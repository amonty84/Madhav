// Observatory advanced analytics — cost per (pipeline) quality (S4.2 stub).
//
// Reports per-pipeline-stage cost & latency rollups suitable for super-admin
// review. The "quality" dimension is intentionally a stub: the audit-stage
// quality probe spec has not yet been delivered (OBSERVATORY_PLAN §10 item
// 4 — open decision). Until the probe lands, every row's `quality_score`
// is `null` and the result-level `quality_probe_wired` flag is the literal
// `false`. When the probe ships:
//   - swap `quality_score` from `null` to `number | null`
//   - flip the `quality_probe_wired` literal to a boolean
//   - join `llm_quality_scores` (or whatever the probe produces) on event_id
//
// Cost rollups are real: `sum(computed_cost_usd)`, `count(*)`,
// `avg(computed_cost_usd)`, `sum(input_tokens)`, `sum(output_tokens)`,
// `avg(latency_ms)`, grouped by `pipeline_stage`, ordered by total cost desc.
// Optional `provider` filter narrows the set in SQL (no JS post-filter).

import 'server-only'
import type { PoolClient } from 'pg'

export interface StageMetrics {
  pipeline_stage: string
  total_events: number
  total_cost_usd: number
  avg_cost_per_event_usd: number
  total_input_tokens: bigint
  total_output_tokens: bigint
  avg_latency_ms: number
  /** Always `null` until the audit-stage quality probe spec lands. */
  quality_score: null
}

export interface CostPerQualityResult {
  date_start: string
  date_end: string
  /** Literal `false` until the probe ships — flip the type when it does. */
  quality_probe_wired: false
  stages: StageMetrics[]
  totals: {
    total_cost_usd: number
    total_events: number
  }
}

export interface CostPerQualityParams {
  date_start: string
  date_end: string
  provider?: string
}

interface CostPerQualityRawRow {
  pipeline_stage: string | null
  total_events: string | null
  total_cost_usd: string | number | null
  avg_cost_per_event_usd: string | number | null
  total_input_tokens: string | null
  total_output_tokens: string | null
  avg_latency_ms: string | number | null
}

const SQL = `
  SELECT
    pipeline_stage                                                 AS pipeline_stage,
    COUNT(*)::text                                                 AS total_events,
    COALESCE(SUM(computed_cost_usd), 0)::float8                    AS total_cost_usd,
    COALESCE(AVG(computed_cost_usd), 0)::float8                    AS avg_cost_per_event_usd,
    COALESCE(SUM(input_tokens), 0)::text                           AS total_input_tokens,
    COALESCE(SUM(output_tokens), 0)::text                          AS total_output_tokens,
    COALESCE(AVG(latency_ms), 0)::float8                           AS avg_latency_ms
  FROM llm_usage_events
  WHERE started_at >= $1 AND started_at < $2
`

export async function queryCostPerQuality(
  db: PoolClient,
  params: CostPerQualityParams,
): Promise<CostPerQualityResult> {
  const sqlParams: unknown[] = [params.date_start, params.date_end]
  let sql = SQL
  if (params.provider) {
    sql += ` AND provider = $3`
    sqlParams.push(params.provider)
  }
  sql += `
    GROUP BY pipeline_stage
    ORDER BY total_cost_usd DESC, pipeline_stage ASC
  `

  const result = await db.query<CostPerQualityRawRow>(sql, sqlParams)

  const stages: StageMetrics[] = result.rows.map((r) => ({
    pipeline_stage: r.pipeline_stage ?? 'other',
    total_events: Number(r.total_events ?? 0),
    total_cost_usd: Number(r.total_cost_usd ?? 0),
    avg_cost_per_event_usd: Number(r.avg_cost_per_event_usd ?? 0),
    total_input_tokens: BigInt(r.total_input_tokens ?? 0),
    total_output_tokens: BigInt(r.total_output_tokens ?? 0),
    avg_latency_ms: Number(r.avg_latency_ms ?? 0),
    quality_score: null,
  }))

  const totals = stages.reduce(
    (acc, s) => {
      acc.total_cost_usd += s.total_cost_usd
      acc.total_events += s.total_events
      return acc
    },
    { total_cost_usd: 0, total_events: 0 },
  )

  return {
    date_start: params.date_start,
    date_end: params.date_end,
    quality_probe_wired: false,
    stages,
    totals,
  }
}
