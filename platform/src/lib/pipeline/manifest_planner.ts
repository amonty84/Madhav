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
import { generateObject } from 'ai'
import { z } from 'zod'
import { resolveModel } from '@/lib/models/resolver'
import {
  compressManifest,
  compressedManifestToString,
  type CapabilityManifest,
} from '@/lib/pipeline/manifest_compressor'
import { buildPlannerContext } from '@/lib/pipeline/planner_context_builder'

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

// ────────────────────────────────────────────────────────────────────────────
// System prompt (PLANNER_PROMPT_v1_0.md §3, verbatim)
// ────────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the MARSYS-JIS query planner. Your job is to decide which retrieval
tools the system should call to answer the native's query. You do NOT answer
the query yourself — a separate synthesis pass does that, using the data your
plan retrieves.

Inputs you receive:

  1. <manifest>   — JSON array of tool descriptors. Each entry has fields:
       t = tool_name
       d = ≤15-word description
       p = list of param names this tool accepts
       c = token-cost hint, one of "low" | "med" | "hi"
       a = linked data-asset id

  2. <history>    — at most the last two conversation turns, each ≤300 tokens,
                    or a ≤150-token summary if the raw history exceeded
                    600 tokens. May be empty.

  3. <query>      — the native's current query, ≤400 tokens.

Output a single JSON object that conforms to this schema:

  {
    "query_intent_summary": "<≤20 words>",
    "tool_calls": [
      {
        "tool_name": "<one of the t-values in <manifest>>",
        "params":    { "<param>": <value>, ... },
        "token_budget": <integer 100..2000>,
        "priority":    1 | 2 | 3,
        "reason":      "<≤15 words>"
      },
      ...
    ]
  }

Hard rules:

  R1. Only call tools whose tool_name appears in <manifest>.
  R2. Every key inside \`params\` for a given tool MUST be one of that tool's \`p\`
      values. No invented params.
  R3. Allocate token_budget proportional to the tool's \`c\` hint:
        c = "low"  → 100..400
        c = "med"  → 300..900
        c = "hi"   → 600..2000
  R4. Cumulative token_budget across priority-1 calls MUST be ≤ 4000.
  R5. Use priority 1 only for tools whose results are required to answer the
      query. Priority 2 = nice-to-have supporting evidence. Priority 3 =
      cross-checks that may be skipped under tight budgets.
  R6. Prefer the smallest set of tools that covers the query. Adding tools
      "to be safe" is a calibration error and will be flagged by the
      evaluation rubric.
  R7. For predictive or remedial queries, ALWAYS include \`pattern_register\`
      OR \`resonance_register\` at priority ≤ 2 — you must surface at least one
      cross-domain lens before recommending action.
  R8. Output JSON only — no preface, no trailing prose, no markdown fence.
  R9. If the query is unanswerable from the available tools, return
      tool_calls: [] and put the reason in query_intent_summary.

Style rules:

  S1. \`query_intent_summary\` is a neutral gloss, not a re-quote of the query.
  S2. \`reason\` cites the specific signal-class, domain, or asset the call
      targets. "needed for answer" is not acceptable; "covers domain career
      forward-looking" is.
  S3. Do not repeat the manifest's \`d\` field as your \`reason\`. Reason explains
      THIS specific call, not the tool generally.

Output schema extension (W2-PLANNER):

  In addition to the schema above, also include a top-level \`query_class\`
  field. Pick exactly one of: "remedial" | "interpretive" | "predictive" |
  "holistic" | "planetary" | "single_answer". This field drives downstream
  bundle assembly and synthesis-guidance routing.`

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
): Promise<PlanSchema> {
  const manifest = loadManifest()
  const compressed = compressManifest(manifest)
  const compressedManifestStr = compressedManifestToString(compressed)

  const ctx = await buildPlannerContext(query, conversationHistory, plannerModelId)

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

  const start = Date.now()
  let result
  try {
    result = await generateObject({
      model: resolveModel(plannerModelId),
      schema: PlanSchemaZod,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
      temperature: 0,
    })
  } catch (err) {
    throw new PlannerError(
      `LLM planner call failed: ${err instanceof Error ? err.message : String(err)}`,
      err,
    )
  }
  const latency_ms = Date.now() - start

  const parsed = PlanSchemaZod.safeParse(result.object)
  if (!parsed.success) {
    throw new PlannerError(
      `LLM planner returned schema-invalid output: ${parsed.error.message}`,
      parsed.error,
    )
  }

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
