/**
 * MARSYS-JIS Stream B — Tool: kp_query (M2-C.2)
 *
 * Queries chart_facts for Krishnamurti Paddhati (KP) data:
 * cusp significators, planet significators, star lord / sub lord chains.
 *
 * Categories covered: kp_cusp (12 rows), kp_planet (9 rows), kp_significator (7 rows)
 */

import crypto from 'crypto'
import { getStorageClient } from '@/lib/storage'
import { writeToolExecutionLog } from '@/lib/db/monitoring-write'
import type { QueryPlan, ToolBundle, ToolBundleResult, RetrievalTool } from './types'

const TOOL_NAME = 'kp_query'
const TOOL_VERSION = '1.0'

export interface KpQueryInput {
  cusp?: number
  planet?: string
  query_type?: 'significators' | 'star_lord' | 'sub_lord' | 'sub_sub_lord' | 'all'
}

interface ChartFactsRow {
  fact_id: string
  category: string
  divisional_chart: string
  value_text: string | null
  value_json: Record<string, unknown> | null
  source_section: string
}

async function retrieve(plan: QueryPlan, params?: Record<string, unknown>): Promise<ToolBundle> {
  const start = Date.now()
  try {
    return await retrieveImpl(plan, params, start)
  } catch (err) {
    void writeToolExecutionLog({
      query_id: plan.query_plan_id,
      tool_name: TOOL_NAME,
      params_json: (params ?? null) as Record<string, unknown> | null,
      status: 'error',
      rows_returned: 0,
      latency_ms: Date.now() - start,
      token_estimate: 0,
      data_asset_id: 'KP_SUBLORDS',
      error_code: err instanceof Error ? err.message : String(err),
      served_from_cache: false,
      fallback_used: false,
    })
    throw err
  }
}

async function retrieveImpl(
  plan: QueryPlan,
  params: Record<string, unknown> | undefined,
  start: number,
): Promise<ToolBundle> {
  const input = params as KpQueryInput | undefined

  let categories = ['kp_cusp', 'kp_planet', 'kp_significator']
  if (input?.cusp !== undefined) {
    categories = ['kp_cusp', 'kp_significator']
  } else if (input?.planet) {
    categories = ['kp_planet']
  }

  const conditions: string[] = [`category = ANY($1)`, `is_stale = false`]
  const queryParams: unknown[] = [categories]
  let idx = 2

  if (input?.cusp !== undefined) {
    // kp_cusp rows encode cusp in fact_id (KP.CUSP.N); kp_significator rows use value_json->>'house'
    conditions.push(
      `(` +
        `(category = 'kp_cusp' AND fact_id = 'KP.CUSP.' || $${idx}::text)` +
        ` OR ` +
        `(category = 'kp_significator' AND (value_json->>'house')::int = $${idx}::int)` +
        `)`
    )
    queryParams.push(input.cusp)
    idx++
  }

  if (input?.planet) {
    conditions.push(
      `(value_json->>'planet' ILIKE $${idx} OR fact_id ILIKE $${idx})`
    )
    queryParams.push(`%${input.planet}%`)
    idx++
  }

  const sql = `
    SELECT fact_id, category, divisional_chart, value_text, value_json, source_section
    FROM chart_facts
    WHERE ${conditions.join(' AND ')}
    ORDER BY category, fact_id
    LIMIT 50
  `.trim()

  const { rows } = await getStorageClient().query<ChartFactsRow>(sql, queryParams)

  const results: ToolBundleResult[] = rows.map(row => ({
    content: JSON.stringify({
      fact_id: row.fact_id,
      category: row.category,
      value_text: row.value_text,
      kp_data: row.value_json,
      source: row.source_section,
    }),
    source_canonical_id: 'FORENSIC',
    source_version: '8.0',
    confidence: 1.0,
    significance: 0.85,
  }))

  const result_hash =
    'sha256:' +
    crypto
      .createHash('sha256')
      .update(JSON.stringify(results.map(r => r.content.slice(0, 50)).sort()))
      .digest('hex')

  const latency_ms = Date.now() - start

  const bundle: ToolBundle = {
    tool_bundle_id: crypto.randomUUID(),
    tool_name: TOOL_NAME,
    tool_version: TOOL_VERSION,
    invocation_params: {
      cusp: input?.cusp,
      planet: input?.planet,
      query_type: input?.query_type ?? 'all',
    },
    results,
    served_from_cache: false,
    latency_ms,
    result_hash,
    schema_version: '1.0',
  }

  void writeToolExecutionLog({
    query_id: plan.query_plan_id,
    tool_name: TOOL_NAME,
    params_json: bundle.invocation_params as Record<string, unknown>,
    status: results.length === 0 ? 'zero_rows' : 'ok',
    rows_returned: results.length,
    latency_ms,
    token_estimate: Math.ceil(JSON.stringify(results).length / 4),
    data_asset_id: 'KP_SUBLORDS',
    error_code: null,
    served_from_cache: false,
    fallback_used: false,
    raw_result_count: rows.length,
    kept_result_count: results.length,
    dropped_items: [],
    kept_items: results.slice(0, 200).map(r => ({
      item_id: r.signal_id ?? r.source_canonical_id,
      score: r.confidence ?? null,
      contribution_tokens: null,
    })),
    tool_input_payload: bundle.invocation_params,
    error_class: 'OK',
  })

  return bundle
}

export const tool: RetrievalTool = {
  name: TOOL_NAME,
  version: TOOL_VERSION,
  description:
    'KP (Krishnamurti Paddhati) cusp and planet significator lookup. ' +
    'Returns star lord, sub lord, sub-sub lord chains for cusps 1–12 and all 9 planets. ' +
    'Use for KP-system house occupation, signification, and ruling planet queries.',
  retrieve,
}
