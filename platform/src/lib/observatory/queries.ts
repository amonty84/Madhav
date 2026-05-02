// Observatory backend API — pure SQL query functions.
//
// Every `/api/admin/observatory/*` route handler delegates to one function
// here; route handlers stay thin (auth + flag + parse → call → respond).
//
// Discipline:
//  - All filtering is done in SQL (predicates pushed into WHERE), never in
//    JS post-fetch. Brief AC.
//  - Parameters are bound; no string interpolation of caller input.
//  - The `started_at` index drives every date-range scan; `(provider, model)`
//    + `(conversation_id)` + `(user_id)` + `(pipeline_stage)` indices drive
//    secondary filtering.
//
// Authored by USTAD_S1_3_OBSERVATORY_BACKEND_API.

import 'server-only'
import { query } from '../db/client'
import type { LlmUsageEventRow } from '../db/schema/observatory'
import type {
  BreakdownsQueryInput,
  BreakdownsResponse,
  BreakdownRow,
  EventDetailResponse,
  EventsQueryInput,
  EventsResponse,
  ObservatoryEventListRow,
  ObservatoryFilters,
  SummaryQueryInput,
  SummaryResponse,
  SummaryWindowMetrics,
  TimeseriesBucket,
  TimeseriesDimension,
  TimeseriesGranularity,
  TimeseriesQueryInput,
  TimeseriesResponse,
} from './types'
import { EVENTS_DEFAULT_LIMIT, EVENTS_MAX_LIMIT } from './types'

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Push the shared {provider, model, pipeline_stage} filters into a WHERE
 *  clause as bound parameters. Returns the SQL fragment + the next $-index
 *  the caller should use after our params. */
function applyFilters(
  filters: ObservatoryFilters | undefined,
  params: unknown[],
  startIndex: number,
): { sql: string; nextIndex: number } {
  const parts: string[] = []
  let idx = startIndex
  if (filters?.provider && filters.provider.length > 0) {
    parts.push(`provider = ANY($${idx}::text[])`)
    params.push(filters.provider)
    idx += 1
  }
  if (filters?.model && filters.model.length > 0) {
    parts.push(`model = ANY($${idx}::text[])`)
    params.push(filters.model)
    idx += 1
  }
  if (filters?.pipeline_stage && filters.pipeline_stage.length > 0) {
    parts.push(`pipeline_stage = ANY($${idx}::text[])`)
    params.push(filters.pipeline_stage)
    idx += 1
  }
  return { sql: parts.length ? ' AND ' + parts.join(' AND ') : '', nextIndex: idx }
}

/** date_trunc unit per granularity. Validated against an allow-list — never
 *  interpolated raw from caller input. */
function truncUnit(g: TimeseriesGranularity): 'hour' | 'day' | 'week' {
  if (g === 'hour' || g === 'day' || g === 'week') return g
  throw new Error(`invalid granularity: ${g}`)
}

/** Column expression for a timeseries/breakdown dimension. Validated against
 *  an allow-list. */
function dimensionColumn(d: TimeseriesDimension | 'conversation'): string {
  switch (d) {
    case 'provider':
      return 'provider'
    case 'model':
      return 'model'
    case 'pipeline_stage':
      return 'pipeline_stage'
    case 'conversation':
      return "COALESCE(conversation_name, conversation_id)"
    default: {
      // Exhaustiveness guard — caller should have validated already.
      const exhaustive: never = d
      throw new Error(`invalid dimension: ${exhaustive as string}`)
    }
  }
}

interface SummaryRollupRow {
  total_cost_usd: number | null
  total_requests: string | null
  total_input_tokens: string | null
  total_output_tokens: string | null
  total_cache_tokens: string | null
  p50_latency_ms: number | null
  p95_latency_ms: number | null
}

async function summaryRollup(
  from: string,
  to: string,
  filters: ObservatoryFilters | undefined,
): Promise<SummaryWindowMetrics> {
  const params: unknown[] = [from, to]
  const f = applyFilters(filters, params, 3)
  const sql = `
    SELECT
      COALESCE(SUM(computed_cost_usd), 0)::float8                   AS total_cost_usd,
      COUNT(*)::text                                                AS total_requests,
      COALESCE(SUM(input_tokens), 0)::text                          AS total_input_tokens,
      COALESCE(SUM(output_tokens), 0)::text                         AS total_output_tokens,
      COALESCE(SUM(COALESCE(cache_read_tokens,0) + COALESCE(cache_write_tokens,0)), 0)::text
                                                                    AS total_cache_tokens,
      percentile_cont(0.5)  WITHIN GROUP (ORDER BY latency_ms)      AS p50_latency_ms,
      percentile_cont(0.95) WITHIN GROUP (ORDER BY latency_ms)      AS p95_latency_ms
    FROM llm_usage_events
    WHERE started_at >= $1 AND started_at < $2${f.sql}
  `
  const { rows } = await query<SummaryRollupRow>(sql, params)
  const r = rows[0]
  const totalCost = Number(r?.total_cost_usd ?? 0)
  const totalRequests = Number(r?.total_requests ?? 0)
  return {
    total_cost_usd: totalCost,
    total_requests: totalRequests,
    total_input_tokens: Number(r?.total_input_tokens ?? 0),
    total_output_tokens: Number(r?.total_output_tokens ?? 0),
    total_cache_tokens: Number(r?.total_cache_tokens ?? 0),
    avg_cost_per_request: totalRequests > 0 ? totalCost / totalRequests : 0,
    p50_latency_ms: r?.p50_latency_ms != null ? Number(r.p50_latency_ms) : 0,
    p95_latency_ms: r?.p95_latency_ms != null ? Number(r.p95_latency_ms) : 0,
    reconciliation_variance_pct: null,
    reconciliation_through_date: null,
  }
}

async function attachReconciliationContext(
  metrics: SummaryWindowMetrics,
  to: string,
): Promise<SummaryWindowMetrics> {
  const { rows } = await query<{
    reconciliation_date: string
    variance_pct: number | null
  }>(
    `SELECT reconciliation_date, variance_pct
       FROM llm_cost_reconciliation
      WHERE reconciliation_date < $1::timestamptz::date
      ORDER BY reconciliation_date DESC
      LIMIT 1`,
    [to],
  )
  if (rows[0]) {
    return {
      ...metrics,
      reconciliation_variance_pct:
        rows[0].variance_pct != null ? Number(rows[0].variance_pct) : null,
      reconciliation_through_date: rows[0].reconciliation_date,
    }
  }
  return metrics
}

// ---------------------------------------------------------------------------
// 1. summary
// ---------------------------------------------------------------------------

export async function getSummary(input: SummaryQueryInput): Promise<SummaryResponse> {
  const current = await summaryRollup(input.from, input.to, input.filters)
  const withReconciliation = await attachReconciliationContext(current, input.to)

  if (!input.compare_to_previous) return withReconciliation

  const fromMs = Date.parse(input.from)
  const toMs = Date.parse(input.to)
  const span = toMs - fromMs
  if (!Number.isFinite(span) || span <= 0) return withReconciliation
  const prevFrom = new Date(fromMs - span).toISOString()
  const prevTo = input.from
  const previous = await summaryRollup(prevFrom, prevTo, input.filters)

  return {
    ...withReconciliation,
    total_cost_usd_delta: current.total_cost_usd - previous.total_cost_usd,
    total_requests_delta: current.total_requests - previous.total_requests,
    total_input_tokens_delta: current.total_input_tokens - previous.total_input_tokens,
    total_output_tokens_delta:
      current.total_output_tokens - previous.total_output_tokens,
    total_cache_tokens_delta: current.total_cache_tokens - previous.total_cache_tokens,
    avg_cost_per_request_delta:
      current.avg_cost_per_request - previous.avg_cost_per_request,
    p50_latency_ms_delta: current.p50_latency_ms - previous.p50_latency_ms,
    p95_latency_ms_delta: current.p95_latency_ms - previous.p95_latency_ms,
  }
}

// ---------------------------------------------------------------------------
// 2. timeseries
// ---------------------------------------------------------------------------

interface TimeseriesRawRow {
  bucket_time: string
  dim_value: string
  cost_usd: number | null
}

export async function getTimeseries(
  input: TimeseriesQueryInput,
): Promise<TimeseriesResponse> {
  const unit = truncUnit(input.granularity)
  const dimCol = dimensionColumn(input.dimension)
  const params: unknown[] = [input.from, input.to]
  const f = applyFilters(input.filters, params, 3)
  const sql = `
    SELECT
      date_trunc('${unit}', started_at)             AS bucket_time,
      ${dimCol}                                     AS dim_value,
      COALESCE(SUM(computed_cost_usd), 0)::float8   AS cost_usd
    FROM llm_usage_events
    WHERE started_at >= $1 AND started_at < $2${f.sql}
    GROUP BY bucket_time, dim_value
    ORDER BY bucket_time ASC, dim_value ASC
  `
  const { rows } = await query<TimeseriesRawRow>(sql, params)

  const bucketIndex = new Map<string, TimeseriesBucket>()
  for (const r of rows) {
    const time = new Date(r.bucket_time).toISOString()
    let bucket = bucketIndex.get(time)
    if (!bucket) {
      bucket = { time, series: {} }
      bucketIndex.set(time, bucket)
    }
    bucket.series[r.dim_value ?? 'unknown'] = Number(r.cost_usd ?? 0)
  }
  return { buckets: Array.from(bucketIndex.values()) }
}

// ---------------------------------------------------------------------------
// 3. breakdowns
// ---------------------------------------------------------------------------

interface BreakdownRawRow {
  dim_value: string
  cost_usd: number | null
  request_count: string
  input_tokens: string | null
  output_tokens: string | null
  cache_tokens: string | null
  avg_latency_ms: number | null
}

export async function getBreakdowns(
  input: BreakdownsQueryInput,
): Promise<BreakdownsResponse> {
  const dimCol = dimensionColumn(input.dimension)
  const params: unknown[] = [input.from, input.to]
  const f = applyFilters(input.filters, params, 3)
  const sql = `
    SELECT
      ${dimCol}                                                     AS dim_value,
      COALESCE(SUM(computed_cost_usd), 0)::float8                   AS cost_usd,
      COUNT(*)::text                                                AS request_count,
      COALESCE(SUM(input_tokens), 0)::text                          AS input_tokens,
      COALESCE(SUM(output_tokens), 0)::text                         AS output_tokens,
      COALESCE(SUM(COALESCE(cache_read_tokens,0) + COALESCE(cache_write_tokens,0)), 0)::text
                                                                    AS cache_tokens,
      AVG(latency_ms)::float8                                       AS avg_latency_ms
    FROM llm_usage_events
    WHERE started_at >= $1 AND started_at < $2${f.sql}
    GROUP BY dim_value
    ORDER BY cost_usd DESC, dim_value ASC
  `
  const { rows } = await query<BreakdownRawRow>(sql, params)
  const out: BreakdownRow[] = rows.map(r => ({
    dim_value: r.dim_value ?? 'unknown',
    cost_usd: Number(r.cost_usd ?? 0),
    request_count: Number(r.request_count ?? 0),
    input_tokens: Number(r.input_tokens ?? 0),
    output_tokens: Number(r.output_tokens ?? 0),
    cache_tokens: Number(r.cache_tokens ?? 0),
    avg_latency_ms: r.avg_latency_ms != null ? Number(r.avg_latency_ms) : 0,
  }))
  return { rows: out }
}

// ---------------------------------------------------------------------------
// 4. events
// ---------------------------------------------------------------------------

/** Encode a keyset cursor `<startedAt>|<eventId>`. */
function encodeCursor(startedAt: string, eventId: string): string {
  return Buffer.from(`${startedAt}|${eventId}`, 'utf8').toString('base64url')
}

/** Decode a keyset cursor; returns null on any failure (treated as "from start"). */
function decodeCursor(token: string): { startedAt: string; eventId: string } | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8')
    const [startedAt, eventId] = decoded.split('|')
    if (!startedAt || !eventId) return null
    return { startedAt, eventId }
  } catch {
    return null
  }
}

export async function getEvents(input: EventsQueryInput): Promise<EventsResponse> {
  const limit = Math.min(
    Math.max(1, Math.floor(input.limit ?? EVENTS_DEFAULT_LIMIT)),
    EVENTS_MAX_LIMIT,
  )

  const params: unknown[] = [input.from, input.to]
  const where: string[] = ['started_at >= $1', 'started_at < $2']
  let idx = 3

  if (input.provider && input.provider.length > 0) {
    where.push(`provider = ANY($${idx}::text[])`)
    params.push(input.provider)
    idx += 1
  }
  if (input.model && input.model.length > 0) {
    where.push(`model = ANY($${idx}::text[])`)
    params.push(input.model)
    idx += 1
  }
  if (input.pipeline_stage && input.pipeline_stage.length > 0) {
    where.push(`pipeline_stage = ANY($${idx}::text[])`)
    params.push(input.pipeline_stage)
    idx += 1
  }
  if (input.conversation_id) {
    where.push(`conversation_id = $${idx}`)
    params.push(input.conversation_id)
    idx += 1
  }
  if (input.user_id) {
    where.push(`user_id = $${idx}`)
    params.push(input.user_id)
    idx += 1
  }
  if (input.status) {
    where.push(`status = $${idx}`)
    params.push(input.status)
    idx += 1
  }
  if (input.min_cost != null) {
    where.push(`computed_cost_usd >= $${idx}`)
    params.push(input.min_cost)
    idx += 1
  }
  if (input.max_cost != null) {
    where.push(`computed_cost_usd <= $${idx}`)
    params.push(input.max_cost)
    idx += 1
  }
  if (input.min_latency != null) {
    where.push(`latency_ms >= $${idx}`)
    params.push(input.min_latency)
    idx += 1
  }
  if (input.max_latency != null) {
    where.push(`latency_ms <= $${idx}`)
    params.push(input.max_latency)
    idx += 1
  }
  if (input.search) {
    // ILIKE on either prompt_text or response_text. Bound, not interpolated.
    where.push(
      `(prompt_text ILIKE $${idx} OR response_text ILIKE $${idx})`,
    )
    params.push(`%${input.search}%`)
    idx += 1
  }

  // Total count (same predicate set, no cursor) — computed once per request.
  const countSql = `SELECT COUNT(*)::text AS n FROM llm_usage_events WHERE ${where.join(' AND ')}`
  const countParams = [...params]
  const countResult = await query<{ n: string }>(countSql, countParams)
  const totalCount = Number(countResult.rows[0]?.n ?? 0)

  // Apply cursor predicate after the count is computed (cursor narrows the
  // page, not the total).
  if (input.cursor) {
    const cur = decodeCursor(input.cursor)
    if (cur) {
      where.push(`(started_at, event_id) < ($${idx}, $${idx + 1})`)
      params.push(cur.startedAt)
      params.push(cur.eventId)
      idx += 2
    }
  }

  const pageSql = `
    SELECT
      event_id, conversation_id, conversation_name, prompt_id, user_id,
      provider, model, pipeline_stage,
      input_tokens, output_tokens, cache_read_tokens, cache_write_tokens,
      computed_cost_usd, latency_ms, status, error_code,
      started_at, finished_at
    FROM llm_usage_events
    WHERE ${where.join(' AND ')}
    ORDER BY started_at DESC, event_id DESC
    LIMIT $${idx}
  `
  params.push(limit + 1) // fetch one extra to know if more exist

  const { rows } = await query<ObservatoryEventListRow>(pageSql, params)

  let nextCursor: string | null = null
  if (rows.length > limit) {
    const lastVisible = rows[limit - 1]
    rows.length = limit
    nextCursor = encodeCursor(lastVisible.started_at, lastVisible.event_id)
  }

  return { events: rows, next_cursor: nextCursor, total_count: totalCount }
}

// ---------------------------------------------------------------------------
// 5. event detail
// ---------------------------------------------------------------------------

export async function getEventById(
  eventId: string,
): Promise<EventDetailResponse | null> {
  const { rows } = await query<LlmUsageEventRow>(
    `SELECT * FROM llm_usage_events WHERE event_id = $1 LIMIT 1`,
    [eventId],
  )
  return rows[0] ?? null
}
