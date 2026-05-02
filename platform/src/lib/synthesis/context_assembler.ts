/**
 * MARSYS-JIS — context_assembly step (W2-CTX-ASSEMBLY)
 *
 * Optional LLM step inserted between retrieval and synthesis in the
 * NEW_QUERY_PIPELINE_ENABLED path. Gated behind CONTEXT_ASSEMBLY_ENABLED
 * (default OFF). When OFF, route.ts forwards the raw ToolBundle[] directly
 * — this module is never called.
 *
 * When ON: receives the full retrieval bundle and asks the assembler model
 * to compress + reorder it (remove redundancy, surface most-relevant first,
 * preserve all citation metadata). On any failure (provider error, parse
 * error, schema mismatch) the function falls through to a pass-through
 * bundle with `context_assembly_model_id: 'pass-through'` so the downstream
 * pipeline never breaks because of an assembly fault.
 *
 * Trace contract: emits a single `context_assembly` step (step_type: 'llm')
 * via traceEmitter using the caller-allocated step_seq. The deterministic
 * `context_assembly` emit inside SingleModelOrchestrator continues to fire
 * after this step — they coexist (different seqs) so the trace UI can read
 * either.
 */

import 'server-only'

import { generateText } from 'ai'

import { resolveModel } from '@/lib/models/resolver'
import { traceEmitter } from '@/lib/trace/emitter'
import { telemetry } from '@/lib/telemetry/index'
import type { QueryPlan, ToolBundle } from '@/lib/retrieve/types'

import type { ContextBundle } from './types'

// Tool-name → layer partitioning. Mirrors the MON-8 writeContextAssemblyLog
// classification in route.ts so per-layer token totals on the ContextBundle
// align with the context_assembly_log schema.
const L1_TOOLS = new Set([
  'chart_facts_query', 'divisional_query', 'kp_query',
  'manifest_query', 'query_kp_ruling_planets', 'query_varshaphala',
  'saham_query', 'temporal', 'timeline_query',
])
const L2_5_TOOLS = new Set([
  'msr_sql', 'query_msr_aggregate', 'query_signal_state',
  'pattern_register', 'resonance_register',
  'contradiction_register', 'cluster_atlas',
])
const L4_TOOLS = new Set(['remedial_codex_query', 'domain_report_query'])

const CHARS_PER_TOKEN = 4

interface CallerOpts {
  queryId: string
  conversationId?: string
  stepSeq: number
}

interface LayerTokens {
  l1: number
  l2_5: number
  l4: number
  vector: number
  cgm: number
  total: number
}

function countTokens(toolBundles: ToolBundle[]): LayerTokens {
  let l1 = 0, l2_5 = 0, l4 = 0, vector = 0, cgm = 0
  for (const tb of toolBundles) {
    let chars = 0
    for (const r of tb.results) chars += r.content.length
    const tokens = Math.ceil(chars / CHARS_PER_TOKEN)
    if (tb.tool_name === 'vector_search') vector += tokens
    else if (tb.tool_name === 'cgm_graph_walk') cgm += tokens
    else if (L1_TOOLS.has(tb.tool_name)) l1 += tokens
    else if (L2_5_TOOLS.has(tb.tool_name)) l2_5 += tokens
    else if (L4_TOOLS.has(tb.tool_name)) l4 += tokens
  }
  return { l1, l2_5, l4, vector, cgm, total: l1 + l2_5 + l4 + vector + cgm }
}

function passThrough(
  toolBundles: ToolBundle[],
  modelId: string,
  latencyMs: number,
): ContextBundle {
  const t = countTokens(toolBundles)
  return {
    tool_bundles: toolBundles,
    context_assembly_compressed: true,
    context_assembly_model_id: modelId,
    context_assembly_latency_ms: latencyMs,
    l1_tokens: t.l1,
    l2_5_tokens: t.l2_5,
    l4_tokens: t.l4,
    vector_tokens: t.vector,
    cgm_tokens: t.cgm,
    total_tokens: t.total,
  }
}

/**
 * Attempt to parse + validate the LLM response into a ToolBundle[]. Returns
 * the original bundles on any structural mismatch — the model can drop
 * results but must not invent ones, so we keep only entries whose
 * tool_bundle_id is present in the input set.
 */
function parseAssemblerOutput(
  raw: string,
  original: ToolBundle[],
): ToolBundle[] | null {
  let parsed: unknown
  try {
    // The model may wrap the JSON in code fences; strip the most common forms.
    const stripped = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/i, '')
      .trim()
    parsed = JSON.parse(stripped)
  } catch {
    return null
  }
  const arr = Array.isArray(parsed) ? parsed : null
  if (!arr) return null

  const byId = new Map(original.map(tb => [tb.tool_bundle_id, tb]))
  const out: ToolBundle[] = []
  for (const item of arr) {
    if (!item || typeof item !== 'object') continue
    const id = (item as { tool_bundle_id?: unknown }).tool_bundle_id
    if (typeof id !== 'string') continue
    const orig = byId.get(id)
    if (!orig) continue
    // Trust the original metadata; only the `results` array may be
    // reordered/compressed. Anything else from the model is discarded so a
    // hallucinated tool_name or version cannot leak downstream.
    const results = (item as { results?: unknown }).results
    if (!Array.isArray(results)) {
      out.push(orig)
      continue
    }
    const allowedSignals = new Set(orig.results.map(r => r.signal_id ?? r.content))
    const filtered = results.filter(r =>
      r && typeof r === 'object' && typeof (r as { content?: unknown }).content === 'string'
      && allowedSignals.has(
        (r as { signal_id?: string; content: string }).signal_id
          ?? (r as { content: string }).content,
      ),
    ) as ToolBundle['results']
    out.push({ ...orig, results: filtered.length > 0 ? filtered : orig.results })
  }
  return out.length > 0 ? out : null
}

export async function contextAssembler(
  toolBundles: ToolBundle[],
  queryPlan: QueryPlan,
  modelId: string,
  opts: CallerOpts,
): Promise<ContextBundle> {
  const startedAt = Date.now()
  const startedAtIso = new Date(startedAt).toISOString()

  traceEmitter.emitStep({
    event: 'step_start',
    query_id: opts.queryId,
    step: {
      query_id: opts.queryId,
      conversation_id: opts.conversationId,
      step_seq: opts.stepSeq,
      step_name: 'context_assembly',
      step_type: 'llm',
      status: 'running',
      started_at: startedAtIso,
      data_summary: { model: modelId },
      payload: {},
    },
  })

  const systemPrompt =
    'You are the context_assembly step of an astrology query pipeline.\n' +
    'You receive raw retrieval results from multiple retrieval tools.\n' +
    'Your job:\n' +
    '1. Remove redundant passages (the same signal cited by multiple tools).\n' +
    '2. Reorder by relevance to the query — most directly relevant first.\n' +
    '3. Preserve every signal_id and source reference exactly as given.\n' +
    '4. Do NOT synthesize, interpret, or fabricate new signals.\n' +
    'Output ONLY a raw JSON array (no prose, no markdown, no code fences). ' +
    'Each element MUST be a ToolBundle with the same tool_bundle_id you received ' +
    'and a `results` array containing only entries whose signal_id (or content) ' +
    'appeared in the input.'

  const userPrompt = [
    `Query: ${queryPlan.query_text}`,
    `Query class: ${queryPlan.query_class}`,
    '',
    'Retrieval results (input ToolBundle[]):',
    JSON.stringify(toolBundles, null, 2),
    '',
    'Return the compressed, reordered ToolBundle[] as a raw JSON array.',
  ].join('\n')

  let usage: { inputTokens?: number; outputTokens?: number } | undefined
  let assembled: ToolBundle[] | null = null
  let errorMsg: string | null = null

  try {
    const result = await generateText({
      model: resolveModel(modelId),
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0,
      maxOutputTokens: 8000,
    })
    usage = result.usage
    assembled = parseAssemblerOutput(result.text, toolBundles)
    if (!assembled) errorMsg = 'parse_or_schema_mismatch'
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : String(err)
    telemetry.recordError(
      'context_assembler',
      'llm_call_failed',
      err instanceof Error ? err : new Error(String(err)),
    )
  }

  const latencyMs = Date.now() - startedAt

  if (!assembled) {
    console.warn(`[context_assembler] assembly failed (${errorMsg}); passing through`)
    traceEmitter.emitStep({
      event: 'step_error',
      query_id: opts.queryId,
      step: {
        query_id: opts.queryId,
        conversation_id: opts.conversationId,
        step_seq: opts.stepSeq,
        step_name: 'context_assembly',
        step_type: 'llm',
        status: 'error',
        started_at: startedAtIso,
        completed_at: new Date().toISOString(),
        latency_ms: latencyMs,
        data_summary: { model: modelId, result: errorMsg ?? 'unknown_error' },
        payload: {},
      },
    })
    return passThrough(toolBundles, 'pass-through', latencyMs)
  }

  const tokens = countTokens(assembled)

  traceEmitter.emitStep({
    event: 'step_done',
    query_id: opts.queryId,
    step: {
      query_id: opts.queryId,
      conversation_id: opts.conversationId,
      step_seq: opts.stepSeq,
      step_name: 'context_assembly',
      step_type: 'llm',
      status: 'done',
      started_at: startedAtIso,
      completed_at: new Date().toISOString(),
      latency_ms: latencyMs,
      data_summary: {
        model: modelId,
        input_tokens: usage?.inputTokens ?? 0,
        output_tokens: usage?.outputTokens ?? 0,
        token_estimate: tokens.total,
      },
      payload: {
        l1_tokens: tokens.l1,
        l2_tokens: tokens.l2_5,
        total_tokens: tokens.total,
      },
    },
  })

  telemetry.recordCost(
    'context_assembler',
    modelId,
    usage?.inputTokens ?? 0,
    usage?.outputTokens ?? 0,
    0,
  )

  return {
    tool_bundles: assembled,
    context_assembly_compressed: true,
    context_assembly_model_id: modelId,
    context_assembly_latency_ms: latencyMs,
    l1_tokens: tokens.l1,
    l2_5_tokens: tokens.l2_5,
    l4_tokens: tokens.l4,
    vector_tokens: tokens.vector,
    cgm_tokens: tokens.cgm,
    total_tokens: tokens.total,
  }
}
