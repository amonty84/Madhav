import 'server-only'
import type { StorageClient } from '@/lib/storage/types'
import { resolveBaseline } from './baseline_resolver'

// ─────────────────────────────────────────────────────────────────────────────
// TraceDocument — the full trace for one query_id
// ─────────────────────────────────────────────────────────────────────────────

export interface TraceDocument {
  query: {
    id: string
    text: string | null
    type: string | null
    confidence: number | null
    total_ms: number | null
    total_cost_usd: number | null
    health: 'HEALTHY' | 'DEGRADED' | 'FAILED' | 'UNKNOWN'
  }
  classify: {
    input: unknown
    alternatives: Array<{ type: string; confidence: number; rationale: string | null }>
    decision_reasoning: string | null
    latency_ms: number | null
    tokens: { input: number; output: number }
  } | null
  plan: {
    included_bundles: Array<{ name: string; rationale: string | null; expected_recall: number | null }>
    excluded_bundles: Array<{ name: string; rationale: string | null }>
    plan_json: unknown
    latency_ms: number | null
  } | null
  fetches: Array<{
    bundle: string
    step_order: number
    raw_count: number
    kept_count: number
    dropped_items: Array<{ item_id: string; score: number | null; drop_reason: string }>
    kept_items: Array<{ item_id: string; score: number | null; contribution_tokens: number | null }>
    latency_ms: number | null
    error_class: string
  }>
  context_assembly: {
    items: Array<{
      rank: number
      source_bundle: string
      source_item_id: string
      layer: string
      token_cost: number
      relevance_score: number | null
      status: 'INCLUDED' | 'TRUNCATED' | 'DROPPED'
      drop_reason: string | null
      cumulative_tokens: number
      budget: number
    }>
    token_ledger: {
      total: number
      budget: number
      preamble: number
      L1: number
      L2_5: number
      dropped_count: number
      truncated_count: number
    }
  } | null
  synthesis: {
    model: string | null
    input_tokens: number | null
    output_tokens: number | null
    latency_ms: number | null
    scorecard: unknown | null
  } | null
  baselines: {
    p50_total_latency_ms: number | null
    p95_total_latency_ms: number | null
    p50_total_cost_usd: number | null
    p95_total_cost_usd: number | null
    sample_size: number
  } | null
  anomalies: Array<{
    stage: string
    severity: 'ERROR' | 'WARNING' | 'INFO'
    message: string
    step_id: string | null
  }>
  partial: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// DB row types (internal)
// ─────────────────────────────────────────────────────────────────────────────

interface LlmCallRow {
  id: string
  call_stage: string
  model_id: string
  input_tokens: number | null
  output_tokens: number | null
  latency_ms: number | null
  cost_usd: string | null
  decision_alternatives: unknown | null
  decision_reasoning: string | null
  payload: unknown | null
}

interface ToolExecRow {
  id: string
  tool_name: string
  raw_result_count: number | null
  kept_result_count: number | null
  dropped_items: unknown | null
  kept_items: unknown | null
  latency_ms: number | null
  error_class: string | null
  rows_returned: number | null
}

interface PlanAltRow {
  bundle_name: string
  was_selected: boolean
  rationale: string | null
  expected_recall_score: number | null
}

interface ContextItemRow {
  item_rank: number
  source_bundle: string
  source_item_id: string
  layer: string
  token_cost: number
  relevance_score: number | null
  status: 'INCLUDED' | 'TRUNCATED' | 'DROPPED'
  drop_reason: string | null
  cumulative_tokens_at_decision: number | null
  budget_at_decision: number | null
}

interface ScorecardRow {
  composite_score: number | null
  citation_density: number | null
  failures: unknown | null
}

interface QueryPlanRow {
  query_text: string | null
  query_class: string | null
  plan_json: unknown | null
  planner_latency_ms: number | null
}

// ─────────────────────────────────────────────────────────────────────────────
// Anomaly detectors
// ─────────────────────────────────────────────────────────────────────────────

function detectAnomalies(
  doc: Omit<TraceDocument, 'anomalies' | 'query'> & {
    planLatencyMs: number | null
    baselineP50LatencyMs: number | null
  },
): TraceDocument['anomalies'] {
  const anomalies: TraceDocument['anomalies'] = []

  // Detector 1: plan latency > 2× p50
  if (doc.planLatencyMs !== null && doc.baselineP50LatencyMs !== null && doc.baselineP50LatencyMs > 0) {
    const ratio = doc.planLatencyMs / doc.baselineP50LatencyMs
    if (ratio > 2) {
      anomalies.push({
        stage: 'plan',
        severity: 'WARNING',
        message: `Plan latency ${doc.planLatencyMs}ms (${ratio.toFixed(1)}× p50)`,
        step_id: null,
      })
    }
  }

  // Detector 2: fetch error_class !== 'OK'
  for (const fetch of doc.fetches) {
    if (fetch.error_class && fetch.error_class !== 'OK') {
      anomalies.push({
        stage: 'fetch',
        severity: 'ERROR',
        message: `${fetch.bundle} fetch failed: ${fetch.error_class}`,
        step_id: null,
      })
    }
  }

  // Detector 3: fetch returned 0 items
  for (const fetch of doc.fetches) {
    if (fetch.kept_count === 0) {
      anomalies.push({
        stage: 'fetch',
        severity: 'WARNING',
        message: `${fetch.bundle} returned 0 items`,
        step_id: null,
      })
    }
  }

  // Detector 4: context assembly dropped >30% of candidates
  if (doc.context_assembly) {
    const { dropped_count } = doc.context_assembly.token_ledger
    const total = doc.context_assembly.items.length
    if (total > 0 && dropped_count / total > 0.3) {
      anomalies.push({
        stage: 'context_assembly',
        severity: 'WARNING',
        message: `Context assembly dropped >30% of candidates (budget pressure)`,
        step_id: null,
      })
    }
  }

  // Detector 5: low citation density in scorecard
  if (doc.synthesis?.scorecard) {
    const scorecard = doc.synthesis.scorecard as { citation_density?: number }
    if (typeof scorecard.citation_density === 'number' && scorecard.citation_density < 0.5) {
      anomalies.push({
        stage: 'synthesis',
        severity: 'WARNING',
        message: `Synthesis citation density low`,
        step_id: null,
      })
    }
  }

  return anomalies
}

// ─────────────────────────────────────────────────────────────────────────────
// Health derivation
// ─────────────────────────────────────────────────────────────────────────────

function deriveHealth(
  fetches: TraceDocument['fetches'],
  scorecard: ScorecardRow | null,
): TraceDocument['query']['health'] {
  if (fetches.some(f => f.error_class && f.error_class !== 'OK')) return 'FAILED'
  if (scorecard?.composite_score !== null && scorecard?.composite_score !== undefined
      && scorecard.composite_score < 0.5) return 'DEGRADED'
  if (fetches.length === 0) return 'UNKNOWN'
  return 'HEALTHY'
}

// ─────────────────────────────────────────────────────────────────────────────
// assembleTrace — main entrypoint
// ─────────────────────────────────────────────────────────────────────────────

export async function assembleTrace(
  queryId: string,
  db: StorageClient,
): Promise<TraceDocument> {
  // Run all queries in parallel; missing rows for pre-instrumentation queries
  // are handled gracefully (empty arrays / null).
  const [
    llmRows,
    toolRows,
    planAltRows,
    contextItemRows,
    scorecardRows,
    queryPlanRows,
    baselines,
  ] = await Promise.all([
    db.query<LlmCallRow>(
      `SELECT id, call_stage, model_id, input_tokens, output_tokens, latency_ms,
              cost_usd, decision_alternatives, decision_reasoning, payload
       FROM llm_call_log
       WHERE query_id = $1::uuid
       ORDER BY created_at ASC`,
      [queryId],
    ).then(r => r.rows).catch(() => [] as LlmCallRow[]),

    db.query<ToolExecRow>(
      `SELECT id, tool_name, raw_result_count, kept_result_count,
              dropped_items, kept_items, latency_ms, error_class, rows_returned
       FROM tool_execution_log
       WHERE query_id = $1::uuid
       ORDER BY created_at ASC`,
      [queryId],
    ).then(r => r.rows).catch(() => [] as ToolExecRow[]),

    db.query<PlanAltRow>(
      `SELECT bundle_name, was_selected, rationale, expected_recall_score
       FROM plan_alternatives_log
       WHERE query_id = $1::uuid
       ORDER BY created_at ASC`,
      [queryId],
    ).then(r => r.rows).catch(() => [] as PlanAltRow[]),

    db.query<ContextItemRow>(
      `SELECT item_rank, source_bundle, source_item_id, layer, token_cost,
              relevance_score, status, drop_reason,
              cumulative_tokens_at_decision, budget_at_decision
       FROM context_assembly_item_log
       WHERE query_id = $1::uuid
       ORDER BY item_rank ASC`,
      [queryId],
    ).then(r => r.rows).catch(() => [] as ContextItemRow[]),

    db.query<ScorecardRow>(
      `SELECT composite_score, citation_density, failures
       FROM synthesis_quality_scorecard
       WHERE query_id = $1::uuid`,
      [queryId],
    ).then(r => r.rows).catch(() => [] as ScorecardRow[]),

    db.query<QueryPlanRow>(
      `SELECT query_text, query_class, plan_json, planner_latency_ms
       FROM query_plan_log
       WHERE query_id = $1::uuid
       LIMIT 1`,
      [queryId],
    ).then(r => r.rows).catch(() => [] as QueryPlanRow[]),

    resolveBaseline(null, db),
  ])

  // ── classify section ────────────────────────────────────────────────────
  const classifyRow = llmRows.find(r => r.call_stage === 'classifier' || r.call_stage === 'classify')
  const classify: TraceDocument['classify'] = classifyRow
    ? {
        input: null,
        alternatives: Array.isArray(classifyRow.decision_alternatives)
          ? (classifyRow.decision_alternatives as Array<{ type?: string; confidence?: number; rationale?: string | null }>).map(a => ({
              type: String(a.type ?? ''),
              confidence: Number(a.confidence ?? 0),
              rationale: a.rationale ?? null,
            }))
          : [],
        decision_reasoning: classifyRow.decision_reasoning,
        latency_ms: classifyRow.latency_ms,
        tokens: {
          input: classifyRow.input_tokens ?? 0,
          output: classifyRow.output_tokens ?? 0,
        },
      }
    : null

  // ── plan section ────────────────────────────────────────────────────────
  const plannerRow = llmRows.find(r => r.call_stage === 'planner')
  const plannerLatencyMs = plannerRow?.latency_ms
    ?? queryPlanRows[0]?.planner_latency_ms
    ?? null

  const plan: TraceDocument['plan'] = (planAltRows.length > 0 || queryPlanRows.length > 0)
    ? {
        included_bundles: planAltRows
          .filter(r => r.was_selected)
          .map(r => ({ name: r.bundle_name, rationale: r.rationale, expected_recall: r.expected_recall_score })),
        excluded_bundles: planAltRows
          .filter(r => !r.was_selected)
          .map(r => ({ name: r.bundle_name, rationale: r.rationale })),
        plan_json: queryPlanRows[0]?.plan_json ?? null,
        latency_ms: plannerLatencyMs,
      }
    : null

  // ── fetches section ─────────────────────────────────────────────────────
  const fetches: TraceDocument['fetches'] = toolRows.map((row, idx) => ({
    bundle: row.tool_name,
    step_order: idx,
    raw_count: row.raw_result_count ?? row.rows_returned ?? 0,
    kept_count: row.kept_result_count ?? row.rows_returned ?? 0,
    dropped_items: Array.isArray(row.dropped_items)
      ? (row.dropped_items as Array<{ item_id?: string; score?: number | null; drop_reason?: string }>).map(d => ({
          item_id: String(d.item_id ?? ''),
          score: d.score ?? null,
          drop_reason: String(d.drop_reason ?? 'UNKNOWN'),
        }))
      : [],
    kept_items: Array.isArray(row.kept_items)
      ? (row.kept_items as Array<{ item_id?: string; score?: number | null; contribution_tokens?: number | null }>).map(k => ({
          item_id: String(k.item_id ?? ''),
          score: k.score ?? null,
          contribution_tokens: k.contribution_tokens ?? null,
        }))
      : [],
    latency_ms: row.latency_ms,
    error_class: row.error_class ?? 'OK',
  }))

  // ── context_assembly section ────────────────────────────────────────────
  let contextAssembly: TraceDocument['context_assembly'] = null
  if (contextItemRows.length > 0) {
    const items = contextItemRows.map(row => ({
      rank: row.item_rank,
      source_bundle: row.source_bundle,
      source_item_id: row.source_item_id,
      layer: row.layer,
      token_cost: row.token_cost,
      relevance_score: row.relevance_score,
      status: row.status,
      drop_reason: row.drop_reason,
      cumulative_tokens: row.cumulative_tokens_at_decision ?? 0,
      budget: row.budget_at_decision ?? 0,
    }))

    const includedItems = items.filter(i => i.status === 'INCLUDED')
    const l1Total = includedItems.filter(i => i.layer === 'L1').reduce((s, i) => s + i.token_cost, 0)
    const l2_5Total = includedItems.filter(i => i.layer === 'L2_5').reduce((s, i) => s + i.token_cost, 0)
    const totalTokens = includedItems.reduce((s, i) => s + i.token_cost, 0)
    const budget = items[0]?.budget ?? 0
    const droppedCount = items.filter(i => i.status === 'DROPPED').length
    const truncatedCount = items.filter(i => i.status === 'TRUNCATED').length

    contextAssembly = {
      items,
      token_ledger: {
        total: totalTokens,
        budget,
        preamble: 0,
        L1: l1Total,
        L2_5: l2_5Total,
        dropped_count: droppedCount,
        truncated_count: truncatedCount,
      },
    }
  }

  // ── synthesis section ───────────────────────────────────────────────────
  const synthRow = llmRows.find(r => r.call_stage === 'synthesis')
  const scorecard = scorecardRows[0] ?? null
  const synthesis: TraceDocument['synthesis'] = synthRow
    ? {
        model: synthRow.model_id,
        input_tokens: synthRow.input_tokens,
        output_tokens: synthRow.output_tokens,
        latency_ms: synthRow.latency_ms,
        scorecard: scorecard,
      }
    : null

  // ── query summary ───────────────────────────────────────────────────────
  const planRow = queryPlanRows[0] ?? null
  const totalCostUsd = llmRows.reduce((sum, r) => {
    if (r.cost_usd === null) return sum
    return sum + Number(r.cost_usd)
  }, 0)
  const totalMs = llmRows.reduce((sum, r) => sum + (r.latency_ms ?? 0), 0)
    + toolRows.reduce((sum, r) => sum + (r.latency_ms ?? 0), 0)
  const health = deriveHealth(fetches, scorecard)

  const querySection: TraceDocument['query'] = {
    id: queryId,
    text: planRow?.query_text ?? null,
    type: planRow?.query_class ?? null,
    confidence: null,
    total_ms: totalMs > 0 ? totalMs : null,
    total_cost_usd: totalCostUsd > 0 ? totalCostUsd : null,
    health,
  }

  // ── partial flag ────────────────────────────────────────────────────────
  // partial = true if context_assembly_item_log has no rows (pre-instrumentation)
  const isPartial = contextItemRows.length === 0

  // ── anomaly detection ───────────────────────────────────────────────────
  const anomalies = detectAnomalies({
    classify,
    plan,
    fetches,
    context_assembly: contextAssembly,
    synthesis,
    baselines,
    partial: isPartial,
    planLatencyMs: plannerLatencyMs ?? null,
    baselineP50LatencyMs: baselines?.p50_total_latency_ms ?? null,
  })

  return {
    query: querySection,
    classify,
    plan,
    fetches,
    context_assembly: contextAssembly,
    synthesis,
    baselines,
    anomalies,
    partial: isPartial,
  }
}
