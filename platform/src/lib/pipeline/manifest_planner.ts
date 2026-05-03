/**
 * manifest_planner.ts — LLM-first planner (W2-PLANNER, UQE-4c).
 *
 * Consumes:
 *   1. PLANNER_PROMPT_v1_0.md §3 system prompt (verbatim).
 *   2. The compressed CAPABILITY_MANIFEST primary-tool view (≤3K tokens).
 *   3. The PlannerContext window (≤600 tokens) from planner_context_builder.
 *   4. The native's query and chart id (the planner is per-native).
 *
 * Emits a single `PlanSchema` JSON object (validated via Zod) that lists the
 * tool calls the retrieval layer should execute.
 *
 * Failure mode: any provider error or schema-validation failure is surfaced as
 * `PlannerError` with the original error attached as `cause`. The route caller
 * (consume/route.ts) catches `PlannerError`, warn-logs, and falls back silently
 * to the existing classify() + compose_bundle() path.
 *
 * Gated by `LLM_FIRST_PLANNER_ENABLED` (default false). The module is safe to
 * import unconditionally; it does no work until `callLlmPlanner()` is called.
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { generateText, jsonSchema, tool } from 'ai'
import type { JSONSchema7 } from 'json-schema'
import { z } from 'zod'
import { resolveModel } from '@/lib/models/resolver'
import {
  compressManifest,
  compressedManifestToString,
  type CapabilityManifest,
} from '@/lib/pipeline/manifest_compressor'
import { buildPlannerContext } from '@/lib/pipeline/planner_context_builder'
import type { PlanningStartEvent, PlanningDoneEvent } from '@/lib/trace/types'
import { writeLlmCallLog, resolveProvider } from '@/lib/db/monitoring-write'

// ────────────────────────────────────────────────────────────────────────────
// PlanSchema (TS) + PlannerError
// ────────────────────────────────────────────────────────────────────────────

export interface PlanSchema {
  query_class: 'remedial' | 'interpretive' | 'predictive' | 'holistic' | 'planetary' | 'single_answer'
  query_intent_summary: string
  tool_calls: Array<{
    tool_name: string
    params: Record<string, unknown>
    token_budget: number
    priority: 1 | 2 | 3
    reason: string
  }>
}

export class PlannerError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = 'PlannerError'
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Zod schema for generateObject() structured output
// ────────────────────────────────────────────────────────────────────────────

const ToolCallSchema = z.object({
  tool_name: z.string().min(1),
  params: z.record(z.string(), z.unknown()),
  token_budget: z.number().int().min(100).max(2000),
  priority: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  reason: z.string().min(1),
})

export const PlanSchemaZod = z.object({
  query_class: z.enum([
    'remedial',
    'interpretive',
    'predictive',
    'holistic',
    'planetary',
    'single_answer',
  ]),
  query_intent_summary: z.string().min(1),
  tool_calls: z.array(ToolCallSchema),
})

// Hand-crafted JSON Schema for the submit_plan tool input. We do NOT feed the
// Zod schema directly because Zod's translation for `z.record(z.string(),
// z.unknown())` emits the `propertyNames` JSON-Schema keyword, which NIM's
// grammar-constrained decoder rejects ("Grammar error: Unimplemented keys"),
// and `z.union([z.literal(1), z.literal(2), z.literal(3)])` emits an
// `anyOf:[{const:N}]` form that's similarly unfriendly. PlanSchemaZod is still
// applied post-call as the runtime validator (parity with prior generateObject
// behavior), so this hand-crafted schema only governs what NIM constrains the
// model to emit, not what the planner ultimately accepts.
const PlanInputJsonSchema: JSONSchema7 = {
  type: 'object',
  properties: {
    query_class: {
      type: 'string',
      enum: ['remedial', 'interpretive', 'predictive', 'holistic', 'planetary', 'single_answer'],
    },
    query_intent_summary: { type: 'string' },
    tool_calls: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          tool_name: { type: 'string' },
          params: { type: 'object' },
          token_budget: { type: 'integer', minimum: 100, maximum: 2000 },
          priority: { type: 'integer', minimum: 1, maximum: 3 },
          reason: { type: 'string' },
        },
        required: ['tool_name', 'params', 'token_budget', 'priority', 'reason'],
      },
    },
  },
  required: ['query_class', 'query_intent_summary', 'tool_calls'],
}

// ────────────────────────────────────────────────────────────────────────────
// System prompt — loaded at module init from PLANNER_PROMPT_v1_0.md §3 + §4.
// ────────────────────────────────────────────────────────────────────────────
//
// Why load from markdown instead of hardcoding (W2-UQE-ACTIVATE round 5):
//   Round 4 surfaced a load-bearing defect — markdown edits to R8 + the second
//   remedial few-shot (resonance_register for alignment-character remedials)
//   never reached the runtime, because SYSTEM_PROMPT was a hand-copied string
//   constant of §3 only. §4 (few-shots) had never been at runtime at all.
//   Loading at module init eliminates the drift permanently: the markdown is
//   the single source of truth.
//
// Output schema extension (W2-PLANNER) — appended to the markdown body since
// §3 in the doc predates the query_class addition. This is the only piece of
// the runtime prompt not in the markdown today; folding it into the markdown
// is a follow-up.

const PROMPT_PATH = path.join(
  process.cwd(),
  '..',
  '00_ARCHITECTURE',
  'PLANNER_PROMPT_v1_0.md',
)

const QUERY_CLASS_EXTENSION = `
Output schema extension (W2-PLANNER):

  In addition to the schema above, also include a top-level \`query_class\`
  field. Pick exactly one of: "remedial" | "interpretive" | "predictive" |
  "holistic" | "planetary" | "single_answer". This field drives downstream
  bundle assembly and synthesis-guidance routing.`

function extractSystemPromptBody(md: string): string {
  // §3 is "## 3. System prompt (verbatim — copy into code)" followed by a
  // ```...``` fenced code block. Pull out just the fenced contents.
  const headerIdx = md.indexOf('## 3. System prompt')
  if (headerIdx < 0) {
    throw new Error('PLANNER_PROMPT_v1_0.md: §3 header not found')
  }
  const fenceOpen = md.indexOf('```', headerIdx)
  if (fenceOpen < 0) {
    throw new Error('PLANNER_PROMPT_v1_0.md: §3 opening fence not found')
  }
  const bodyStart = md.indexOf('\n', fenceOpen) + 1
  const fenceClose = md.indexOf('```', bodyStart)
  if (fenceClose < 0) {
    throw new Error('PLANNER_PROMPT_v1_0.md: §3 closing fence not found')
  }
  return md.slice(bodyStart, fenceClose).trimEnd()
}

function extractFewShotSection(md: string): string {
  // §4 is "## 4. Few-shot examples" through (but not including) "## 5.".
  const startIdx = md.indexOf('## 4. Few-shot examples')
  if (startIdx < 0) {
    throw new Error('PLANNER_PROMPT_v1_0.md: §4 header not found')
  }
  const endIdx = md.indexOf('\n## 5.', startIdx)
  if (endIdx < 0) {
    throw new Error('PLANNER_PROMPT_v1_0.md: §5 boundary not found')
  }
  return md.slice(startIdx, endIdx).trimEnd()
}

function buildSystemPrompt(): string {
  const md = readFileSync(PROMPT_PATH, 'utf-8')
  const body = extractSystemPromptBody(md)
  const fewShots = extractFewShotSection(md)
  return `${body}\n${QUERY_CLASS_EXTENSION}\n\n---\n\n${fewShots}\n`
}

const SYSTEM_PROMPT = buildSystemPrompt()

// ────────────────────────────────────────────────────────────────────────────
// Manifest loading (read-once, lazy)
// ────────────────────────────────────────────────────────────────────────────

const MANIFEST_PATH = path.join(
  process.cwd(),
  '..',
  '00_ARCHITECTURE',
  'CAPABILITY_MANIFEST.json',
)

let _manifestCache: CapabilityManifest | null = null

function loadManifest(): CapabilityManifest {
  if (_manifestCache) return _manifestCache
  const raw = readFileSync(MANIFEST_PATH, 'utf-8')
  _manifestCache = JSON.parse(raw) as CapabilityManifest
  return _manifestCache
}

// ────────────────────────────────────────────────────────────────────────────
// Public entrypoint
// ────────────────────────────────────────────────────────────────────────────

export async function callLlmPlanner(
  query: string,
  conversationHistory: Array<{ role: string; content: string }>,
  plannerModelId: string,
  nativeId: string,
  emitTrace?: (event: PlanningStartEvent | PlanningDoneEvent) => void,
  queryId?: string,
): Promise<PlanSchema> {
  const manifest = loadManifest()
  const compressed = compressManifest(manifest)
  const compressedManifestStr = compressedManifestToString(compressed)

  const ctx = await buildPlannerContext(query, conversationHistory, plannerModelId, queryId)

  // The user message is JSON the planner consumes alongside the verbatim
  // system prompt. native_id is included so the planner can keep per-native
  // context if it needs to (currently informational only — UQE-4c logs it,
  // W2-INSTRUMENT will persist it).
  const userPayload = {
    native_id: nativeId,
    manifest: JSON.parse(compressedManifestStr) as unknown,
    history: {
      turns: ctx.history_turns,
      was_summarized: ctx.history_was_summarized,
    },
    query: ctx.query,
  }
  const userMessage = JSON.stringify(userPayload)

  // nativeId doubles as the SSE query_id for the request that owns this plan.
  emitTrace?.({
    event: 'planning_start',
    query_id: nativeId,
    planner_model_id: plannerModelId,
    manifest_tool_count: compressed.length,
  })

  // NIM (and other OpenAI-compatible providers that don't implement
  // response_format=json_schema) reject `generateObject`'s structured-output
  // path with HTTP 500. Force tool-call mode by routing through `generateText`
  // with a single submit-plan tool whose inputSchema is PlanSchemaZod and
  // toolChoice='required'. The AI SDK validates the model's tool-call args
  // against PlanSchemaZod before populating `toolCall.input`.
  const start = Date.now()
  let result
  try {
    result = await generateText({
      model: resolveModel(plannerModelId),
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
      temperature: 0,
      tools: {
        submit_plan: tool({
          description:
            'Submit the planned tool calls for the native query. Call this exactly once with the full plan; do not emit prose.',
          inputSchema: jsonSchema<PlanSchema>(PlanInputJsonSchema),
        }),
      },
      toolChoice: 'required',
    })
  } catch (err) {
    if (queryId) {
      void writeLlmCallLog({
        query_id: queryId,
        conversation_id: null,
        call_stage: 'planner',
        model_id: plannerModelId,
        provider: resolveProvider(plannerModelId),
        input_tokens: null,
        output_tokens: null,
        reasoning_tokens: null,
        latency_ms: Date.now() - start,
        cost_usd: null,
        fallback_used: false,
        error_code: err instanceof Error ? err.message : String(err),
        payload: null,
      })
    }
    throw new PlannerError(
      `LLM planner call failed: ${err instanceof Error ? err.message : String(err)}`,
      err,
    )
  }
  const latency_ms = Date.now() - start

  if (queryId) {
    void writeLlmCallLog({
      query_id: queryId,
      conversation_id: null,
      call_stage: 'planner',
      model_id: plannerModelId,
      provider: resolveProvider(plannerModelId),
      input_tokens: result.usage?.inputTokens ?? null,
      output_tokens: result.usage?.outputTokens ?? null,
      reasoning_tokens: null,
      latency_ms,
      cost_usd: null,
      fallback_used: false,
      error_code: null,
      payload: null,
    })
  }

  const submitCall = result.toolCalls.find(tc => tc.toolName === 'submit_plan')
  if (!submitCall) {
    throw new PlannerError(
      `LLM planner did not produce a submit_plan tool call ` +
        `(toolCalls=${result.toolCalls.length}, finishReason=${result.finishReason})`,
    )
  }
  const parsed = PlanSchemaZod.safeParse(submitCall.input)
  if (!parsed.success) {
    throw new PlannerError(
      `LLM planner returned schema-invalid output: ${parsed.error.message}`,
      parsed.error,
    )
  }

  emitTrace?.({
    event: 'planning_done',
    query_id: nativeId,
    tool_count_planned: parsed.data.tool_calls.length,
    tools_selected: Array.from(new Set(parsed.data.tool_calls.map(tc => tc.tool_name))),
    query_intent_summary: parsed.data.query_intent_summary,
    planner_latency_ms: latency_ms,
  })

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `[planner] callLlmPlanner ok model=${plannerModelId} ` +
        `latency_ms=${latency_ms} tool_calls=${parsed.data.tool_calls.length} ` +
        `query_class=${parsed.data.query_class}`,
    )
  }

  return parsed.data
}

// Exported for tests only — lets the suite reset the manifest cache between
// runs without hitting the filesystem twice in a row.
export function __resetManifestCacheForTests(): void {
  _manifestCache = null
}
