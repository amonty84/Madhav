// Observatory backend API — query-string parsing + validation helpers.
//
// Centralized so every route handler validates filters identically. Failures
// throw `ObservatoryBadRequestError` with a single `detail` string suitable
// to plumb through `res.badRequest(detail)` without leaking internals.

import type {
  BreakdownDimension,
  EventsQueryInput,
  ObservatoryFilters,
  TimeseriesDimension,
  TimeseriesGranularity,
} from '@/lib/observatory/types'

export class ObservatoryBadRequestError extends Error {}

const TIMESERIES_GRANULARITIES = ['hour', 'day', 'week'] as const
const TIMESERIES_DIMENSIONS = ['provider', 'model', 'pipeline_stage'] as const
const BREAKDOWN_DIMENSIONS = [
  'provider',
  'model',
  'pipeline_stage',
  'conversation',
] as const
const EVENT_STATUSES = ['success', 'error', 'timeout'] as const

function requireTimestamp(value: string | null, name: string): string {
  if (!value) {
    throw new ObservatoryBadRequestError(`Missing required parameter: ${name}`)
  }
  const ms = Date.parse(value)
  if (!Number.isFinite(ms)) {
    throw new ObservatoryBadRequestError(`Invalid ISO timestamp for ${name}: ${value}`)
  }
  return value
}

function parseRange(searchParams: URLSearchParams): { from: string; to: string } {
  const from = requireTimestamp(searchParams.get('from'), 'from')
  const to = requireTimestamp(searchParams.get('to'), 'to')
  if (Date.parse(to) <= Date.parse(from)) {
    throw new ObservatoryBadRequestError('`to` must be strictly after `from`')
  }
  return { from, to }
}

function parseBool(value: string | null): boolean {
  return value === '1' || value === 'true'
}

function parseFloatOrThrow(
  value: string | null,
  name: string,
): number | undefined {
  if (value == null) return undefined
  const n = Number(value)
  if (!Number.isFinite(n)) {
    throw new ObservatoryBadRequestError(`Invalid number for ${name}: ${value}`)
  }
  return n
}

function parseIntOrThrow(value: string | null, name: string): number | undefined {
  if (value == null) return undefined
  const n = Number(value)
  if (!Number.isInteger(n)) {
    throw new ObservatoryBadRequestError(`Invalid integer for ${name}: ${value}`)
  }
  return n
}

function parseFilters(searchParams: URLSearchParams): ObservatoryFilters {
  // Repeated keys (`?provider=a&provider=b`) and CSV form (`?provider=a,b`)
  // both supported; the union is returned.
  const collect = (key: string): string[] | undefined => {
    const all = searchParams.getAll(key)
    if (all.length === 0) return undefined
    const out: string[] = []
    for (const v of all) {
      for (const piece of v.split(',')) {
        const t = piece.trim()
        if (t) out.push(t)
      }
    }
    return out.length > 0 ? out : undefined
  }
  return {
    provider: collect('provider'),
    model: collect('model'),
    pipeline_stage: collect('pipeline_stage'),
  }
}

export function parseSummaryQuery(url: URL): {
  from: string
  to: string
  compare_to_previous: boolean
  filters: ObservatoryFilters
} {
  const sp = url.searchParams
  const { from, to } = parseRange(sp)
  return {
    from,
    to,
    compare_to_previous: parseBool(sp.get('compare_to_previous')),
    filters: parseFilters(sp),
  }
}

export function parseTimeseriesQuery(url: URL): {
  from: string
  to: string
  granularity: TimeseriesGranularity
  dimension: TimeseriesDimension
  filters: ObservatoryFilters
} {
  const sp = url.searchParams
  const { from, to } = parseRange(sp)
  const granularity = sp.get('granularity') ?? ''
  if (!(TIMESERIES_GRANULARITIES as readonly string[]).includes(granularity)) {
    throw new ObservatoryBadRequestError(
      `granularity must be one of: ${TIMESERIES_GRANULARITIES.join('|')}`,
    )
  }
  const dimension = sp.get('dimension') ?? ''
  if (!(TIMESERIES_DIMENSIONS as readonly string[]).includes(dimension)) {
    throw new ObservatoryBadRequestError(
      `dimension must be one of: ${TIMESERIES_DIMENSIONS.join('|')}`,
    )
  }
  return {
    from,
    to,
    granularity: granularity as TimeseriesGranularity,
    dimension: dimension as TimeseriesDimension,
    filters: parseFilters(sp),
  }
}

export function parseBreakdownsQuery(url: URL): {
  from: string
  to: string
  dimension: BreakdownDimension
  filters: ObservatoryFilters
} {
  const sp = url.searchParams
  const { from, to } = parseRange(sp)
  const dimension = sp.get('dimension') ?? ''
  if (!(BREAKDOWN_DIMENSIONS as readonly string[]).includes(dimension)) {
    throw new ObservatoryBadRequestError(
      `dimension must be one of: ${BREAKDOWN_DIMENSIONS.join('|')}`,
    )
  }
  return {
    from,
    to,
    dimension: dimension as BreakdownDimension,
    filters: parseFilters(sp),
  }
}

export function parseEventsQuery(url: URL): EventsQueryInput {
  const sp = url.searchParams
  const { from, to } = parseRange(sp)
  const filters = parseFilters(sp)
  const status = sp.get('status') ?? undefined
  if (status != null && !(EVENT_STATUSES as readonly string[]).includes(status)) {
    throw new ObservatoryBadRequestError(
      `status must be one of: ${EVENT_STATUSES.join('|')}`,
    )
  }
  return {
    from,
    to,
    provider: filters.provider,
    model: filters.model,
    pipeline_stage: filters.pipeline_stage,
    conversation_id: sp.get('conversation_id') ?? undefined,
    user_id: sp.get('user_id') ?? undefined,
    status,
    min_cost: parseFloatOrThrow(sp.get('min_cost'), 'min_cost'),
    max_cost: parseFloatOrThrow(sp.get('max_cost'), 'max_cost'),
    min_latency: parseIntOrThrow(sp.get('min_latency'), 'min_latency'),
    max_latency: parseIntOrThrow(sp.get('max_latency'), 'max_latency'),
    search: sp.get('search') ?? undefined,
    limit: parseIntOrThrow(sp.get('limit'), 'limit'),
    cursor: sp.get('cursor') ?? undefined,
  }
}
