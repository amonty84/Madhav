/**
 * MARSYS-JIS Stream B — Tool: saham_query (M2-C.3)
 *
 * Queries chart_facts for Tajika Saham (Arabic Part / Lot) data.
 * 36 sahams from FORENSIC §12.2 — each has longitude, nakshatra, sign, house, meaning.
 *
 * Category: saham (36 rows)
 */

import crypto from 'crypto'
import { getStorageClient } from '@/lib/storage'
import type { QueryPlan, ToolBundle, ToolBundleResult, RetrievalTool } from './types'

const TOOL_NAME = 'saham_query'
const TOOL_VERSION = '1.0'

export interface SahamQueryInput {
  saham_name?: string
  sign?: string
  house?: number
  nakshatra?: string
}

interface ChartFactsRow {
  fact_id: string
  value_text: string | null
  value_json: Record<string, unknown> | null
  source_section: string
}

async function retrieve(plan: QueryPlan, params?: Record<string, unknown>): Promise<ToolBundle> {
  const start = Date.now()
  const input = params as SahamQueryInput | undefined

  const conditions: string[] = [`category = 'saham'`, `is_stale = false`]
  const queryParams: unknown[] = []
  let idx = 1

  if (input?.saham_name) {
    conditions.push(
      `(fact_id ILIKE $${idx} OR value_text ILIKE $${idx} OR value_json->>'name' ILIKE $${idx})`
    )
    queryParams.push(`%${input.saham_name}%`)
    idx++
  }

  if (input?.sign) {
    conditions.push(`value_json->>'sign' ILIKE $${idx}`)
    queryParams.push(`%${input.sign}%`)
    idx++
  }

  if (input?.house !== undefined) {
    conditions.push(`(value_json->>'house')::int = $${idx}`)
    queryParams.push(input.house)
    idx++
  }

  if (input?.nakshatra) {
    conditions.push(`value_json->>'nakshatra' ILIKE $${idx}`)
    queryParams.push(`%${input.nakshatra}%`)
    idx++
  }

  const sql = `
    SELECT fact_id, value_text, value_json, source_section
    FROM chart_facts
    WHERE ${conditions.join(' AND ')}
    ORDER BY fact_id
    LIMIT 36
  `.trim()

  const { rows } = await getStorageClient().query<ChartFactsRow>(sql, queryParams)

  const results: ToolBundleResult[] = rows.map(row => ({
    content: JSON.stringify({
      fact_id: row.fact_id,
      value_text: row.value_text,
      saham: row.value_json,
      source: row.source_section,
    }),
    source_canonical_id: 'FORENSIC',
    source_version: '8.0',
    confidence: 1.0,
    significance: 0.80,
  }))

  const result_hash =
    'sha256:' +
    crypto
      .createHash('sha256')
      .update(JSON.stringify(results.map(r => r.content.slice(0, 50)).sort()))
      .digest('hex')

  return {
    tool_bundle_id: crypto.randomUUID(),
    tool_name: TOOL_NAME,
    tool_version: TOOL_VERSION,
    invocation_params: {
      saham_name: input?.saham_name,
      sign: input?.sign,
      house: input?.house,
      nakshatra: input?.nakshatra,
    },
    results,
    served_from_cache: false,
    latency_ms: Date.now() - start,
    result_hash,
    schema_version: '1.0',
  }
}

export const tool: RetrievalTool = {
  name: TOOL_NAME,
  version: TOOL_VERSION,
  description:
    "Tajika Saham (Lot/Arabic Part) lookup. Returns any of the 36 Sahams from the " +
    "native's chart with their longitude, nakshatra, sign, house, and traditional meaning. " +
    "Use for questions about Saham Vivaha (marriage), Raja (power), Putra (children), " +
    "Mrityu (death), Karma (profession), or any other Tajika lot.",
  retrieve,
}
