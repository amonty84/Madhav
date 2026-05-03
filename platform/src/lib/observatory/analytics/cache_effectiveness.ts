// Phase O.4 — Cache Effectiveness Analytics (USTAD_S4_1).
//
// Per-provider cache hit ratios + dollar savings from cache reads.
//
// `cost_saved_usd` is the dollars *not* spent because tokens hit the read-cache
// instead of being charged at the input rate. For each event:
//
//     savings = cache_read_tokens × (input_price − cache_read_price) ÷ 1e6
//
// Pricing comes from `llm_pricing_versions` joined twice — once for
// `token_class='input'`, once for `token_class='cache_read'` — picking the row
// whose effectivity window contains `started_at`. Providers/models with no
// `cache_read` pricing row contribute 0 savings (LEFT JOIN, NULL → 0). This is
// correct because we cannot estimate savings against a price we do not know.

import 'server-only'
import type { Pool, PoolClient } from 'pg'

export interface CacheMetrics {
  provider: string
  total_events: number
  input_tokens: bigint
  cache_read_tokens: bigint
  cache_write_tokens: bigint
  output_tokens: bigint
  actual_cost_usd: number
  cost_saved_usd: number
  cost_without_cache_usd: number
  cache_hit_ratio: number
  cost_saved_pct: number
}

export interface CacheEffectivenessResult {
  date_start: string
  date_end: string
  providers: CacheMetrics[]
  totals: Omit<CacheMetrics, 'provider'>
}

export interface CacheEffectivenessParams {
  date_start: string
  date_end: string
  provider?: string
}

// Structural type — accepts Pool, PoolClient, or any test mock with `.query`.
export type Queryable = Pick<Pool | PoolClient, 'query'>

interface CacheRow {
  provider: string
  total_events: string
  input_tokens: string | null
  cache_read_tokens: string | null
  cache_write_tokens: string | null
  output_tokens: string | null
  actual_cost_usd: number | string | null
  cost_saved_usd: number | string | null
}

const ZERO = BigInt(0)

function asBigInt(v: string | number | null | undefined): bigint {
  if (v == null) return ZERO
  if (typeof v === 'bigint') return v
  return BigInt(typeof v === 'number' ? Math.trunc(v) : v)
}

function asFloat(v: number | string | null | undefined): number {
  if (v == null) return 0
  return typeof v === 'number' ? v : Number(v)
}

function computeRatios(row: {
  input_tokens: bigint
  cache_read_tokens: bigint
  cache_write_tokens: bigint
  actual_cost_usd: number
  cost_saved_usd: number
}): { cache_hit_ratio: number; cost_saved_pct: number; cost_without_cache_usd: number } {
  const denom = row.input_tokens + row.cache_read_tokens + row.cache_write_tokens
  const cache_hit_ratio = denom === ZERO ? 0 : Number(row.cache_read_tokens) / Number(denom)
  const cost_without_cache_usd = row.actual_cost_usd + row.cost_saved_usd
  const cost_saved_pct =
    cost_without_cache_usd === 0 ? 0 : row.cost_saved_usd / cost_without_cache_usd
  return { cache_hit_ratio, cost_saved_pct, cost_without_cache_usd }
}

const QUERY_SQL = `
  SELECT
    e.provider,
    COUNT(*)::text                                                     AS total_events,
    COALESCE(SUM(e.input_tokens), 0)::text                             AS input_tokens,
    COALESCE(SUM(e.cache_read_tokens), 0)::text                        AS cache_read_tokens,
    COALESCE(SUM(e.cache_write_tokens), 0)::text                       AS cache_write_tokens,
    COALESCE(SUM(e.output_tokens), 0)::text                            AS output_tokens,
    COALESCE(SUM(e.computed_cost_usd), 0)::float8                      AS actual_cost_usd,
    COALESCE(SUM(
      CASE
        WHEN p_cache.price_per_million_usd IS NULL THEN 0
        ELSE COALESCE(e.cache_read_tokens, 0) *
             (COALESCE(p_input.price_per_million_usd, 0) - p_cache.price_per_million_usd)
             / 1000000.0
      END
    ), 0)::float8                                                      AS cost_saved_usd
  FROM llm_usage_events e
  LEFT JOIN llm_pricing_versions p_input
    ON p_input.provider = e.provider
    AND p_input.model = e.model
    AND p_input.token_class = 'input'
    AND p_input.effective_from <= e.started_at
    AND (p_input.effective_to IS NULL OR p_input.effective_to > e.started_at)
  LEFT JOIN llm_pricing_versions p_cache
    ON p_cache.provider = e.provider
    AND p_cache.model = e.model
    AND p_cache.token_class = 'cache_read'
    AND p_cache.effective_from <= e.started_at
    AND (p_cache.effective_to IS NULL OR p_cache.effective_to > e.started_at)
  WHERE e.started_at >= $1
    AND e.started_at < $2
    AND ($3::text IS NULL OR e.provider = $3)
  GROUP BY e.provider
  ORDER BY e.provider ASC
`

export async function queryCacheEffectiveness(
  db: Queryable,
  params: CacheEffectivenessParams,
): Promise<CacheEffectivenessResult> {
  const result = await db.query<CacheRow>(QUERY_SQL, [
    params.date_start,
    params.date_end,
    params.provider ?? null,
  ])

  const providers: CacheMetrics[] = []
  let total_events = 0
  let total_input = ZERO
  let total_cache_read = ZERO
  let total_cache_write = ZERO
  let total_output = ZERO
  let total_actual_cost = 0
  let total_cost_saved = 0

  for (const r of result.rows) {
    const events = Number(r.total_events ?? 0)
    const input_tokens = asBigInt(r.input_tokens)
    const cache_read_tokens = asBigInt(r.cache_read_tokens)
    const cache_write_tokens = asBigInt(r.cache_write_tokens)
    const output_tokens = asBigInt(r.output_tokens)
    const actual_cost_usd = asFloat(r.actual_cost_usd)
    const cost_saved_usd = Math.max(0, asFloat(r.cost_saved_usd))
    const ratios = computeRatios({
      input_tokens,
      cache_read_tokens,
      cache_write_tokens,
      actual_cost_usd,
      cost_saved_usd,
    })
    providers.push({
      provider: r.provider,
      total_events: events,
      input_tokens,
      cache_read_tokens,
      cache_write_tokens,
      output_tokens,
      actual_cost_usd,
      cost_saved_usd,
      cost_without_cache_usd: ratios.cost_without_cache_usd,
      cache_hit_ratio: ratios.cache_hit_ratio,
      cost_saved_pct: ratios.cost_saved_pct,
    })
    total_events += events
    total_input += input_tokens
    total_cache_read += cache_read_tokens
    total_cache_write += cache_write_tokens
    total_output += output_tokens
    total_actual_cost += actual_cost_usd
    total_cost_saved += cost_saved_usd
  }

  const totalRatios = computeRatios({
    input_tokens: total_input,
    cache_read_tokens: total_cache_read,
    cache_write_tokens: total_cache_write,
    actual_cost_usd: total_actual_cost,
    cost_saved_usd: total_cost_saved,
  })

  return {
    date_start: params.date_start,
    date_end: params.date_end,
    providers,
    totals: {
      total_events,
      input_tokens: total_input,
      cache_read_tokens: total_cache_read,
      cache_write_tokens: total_cache_write,
      output_tokens: total_output,
      actual_cost_usd: total_actual_cost,
      cost_saved_usd: total_cost_saved,
      cost_without_cache_usd: totalRatios.cost_without_cache_usd,
      cache_hit_ratio: totalRatios.cache_hit_ratio,
      cost_saved_pct: totalRatios.cost_saved_pct,
    },
  }
}

// JSON-safe shape for the wire — bigints surface as decimal strings so
// `JSON.stringify` does not throw and clients can `BigInt(...)` round-trip.
export interface CacheMetricsJson
  extends Omit<
    CacheMetrics,
    'input_tokens' | 'cache_read_tokens' | 'cache_write_tokens' | 'output_tokens'
  > {
  input_tokens: string
  cache_read_tokens: string
  cache_write_tokens: string
  output_tokens: string
}

export interface CacheEffectivenessResultJson
  extends Omit<CacheEffectivenessResult, 'providers' | 'totals'> {
  providers: CacheMetricsJson[]
  totals: Omit<CacheMetricsJson, 'provider'>
}

function metricsToJson<T extends { input_tokens: bigint; cache_read_tokens: bigint; cache_write_tokens: bigint; output_tokens: bigint }>(
  m: T,
): Omit<T, 'input_tokens' | 'cache_read_tokens' | 'cache_write_tokens' | 'output_tokens'> & {
  input_tokens: string
  cache_read_tokens: string
  cache_write_tokens: string
  output_tokens: string
} {
  const { input_tokens, cache_read_tokens, cache_write_tokens, output_tokens, ...rest } = m
  return {
    ...rest,
    input_tokens: input_tokens.toString(),
    cache_read_tokens: cache_read_tokens.toString(),
    cache_write_tokens: cache_write_tokens.toString(),
    output_tokens: output_tokens.toString(),
  }
}

export function toJson(r: CacheEffectivenessResult): CacheEffectivenessResultJson {
  return {
    date_start: r.date_start,
    date_end: r.date_end,
    providers: r.providers.map(metricsToJson),
    totals: metricsToJson(r.totals),
  }
}
