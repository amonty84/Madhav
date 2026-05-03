// Observatory admin API client.
//
// Hand-written from platform/src/app/api/admin/observatory/openapi.yaml against
// the response types in @/lib/observatory/types. Five GET endpoints, all under
// /api/admin/observatory. The shared `_guard.ts` returns 401 (no user) / 403
// (wrong role or feature flag off); this client surfaces those as typed errors
// so the UI can render the right empty state.

import type {
  BreakdownsQueryInput,
  BreakdownsResponse,
  EventDetailResponse,
  EventsQueryInput,
  EventsResponse,
  ObservatoryFilters,
  SummaryQueryInput,
  SummaryResponse,
  TimeseriesQueryInput,
  TimeseriesResponse,
} from '@/lib/observatory/types'
import type {
  ProviderName,
  ProviderReconcileResult,
  ReconciliationHistoryResponse,
} from '@/lib/observatory/reconciliation/types'
import type {
  BudgetEvaluationResult,
  BudgetRuleInput,
  BudgetRuleRow,
} from '@/lib/observatory/budget/types'

const BASE = '/api/admin/observatory'

export type SummaryParams = SummaryQueryInput
export type TimeseriesParams = TimeseriesQueryInput
export type BreakdownsParams = BreakdownsQueryInput
export type EventsParams = EventsQueryInput

export class ObservatoryApiError extends Error {
  readonly status: number
  readonly code: string
  readonly detail?: string
  constructor(status: number, code: string, message: string, detail?: string) {
    super(message)
    this.name = 'ObservatoryApiError'
    this.status = status
    this.code = code
    this.detail = detail
  }
}

export class UnauthorizedError extends ObservatoryApiError {
  constructor(code: string, message: string, detail?: string) {
    super(401, code, message, detail)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends ObservatoryApiError {
  constructor(code: string, message: string, detail?: string) {
    super(403, code, message, detail)
    this.name = 'ForbiddenError'
  }
}

function appendFilters(qs: URLSearchParams, filters?: ObservatoryFilters): void {
  if (!filters) return
  for (const provider of filters.provider ?? []) qs.append('provider', provider)
  for (const model of filters.model ?? []) qs.append('model', model)
  for (const stage of filters.pipeline_stage ?? []) qs.append('pipeline_stage', stage)
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    credentials: 'same-origin',
  })
  if (res.ok) return (await res.json()) as T

  let code = 'UNKNOWN'
  let message = `Observatory API request failed (${res.status})`
  let detail: string | undefined
  try {
    const body = (await res.json()) as {
      error?: { code?: string; message?: string; detail?: string }
    }
    if (body.error) {
      code = body.error.code ?? code
      message = body.error.message ?? message
      detail = body.error.detail
    }
  } catch {
    // body wasn't JSON; keep defaults
  }

  if (res.status === 401) throw new UnauthorizedError(code, message, detail)
  if (res.status === 403) throw new ForbiddenError(code, message, detail)
  throw new ObservatoryApiError(res.status, code, message, detail)
}

export async function getSummary(params: SummaryParams): Promise<SummaryResponse> {
  const qs = new URLSearchParams({ from: params.from, to: params.to })
  if (params.compare_to_previous) qs.set('compare_to_previous', 'true')
  appendFilters(qs, params.filters)
  return fetchJson<SummaryResponse>(`/summary?${qs.toString()}`)
}

export async function getTimeseries(
  params: TimeseriesParams,
): Promise<TimeseriesResponse> {
  const qs = new URLSearchParams({
    from: params.from,
    to: params.to,
    granularity: params.granularity,
    dimension: params.dimension,
  })
  appendFilters(qs, params.filters)
  return fetchJson<TimeseriesResponse>(`/timeseries?${qs.toString()}`)
}

export async function getBreakdowns(
  params: BreakdownsParams,
): Promise<BreakdownsResponse> {
  const qs = new URLSearchParams({
    from: params.from,
    to: params.to,
    dimension: params.dimension,
  })
  appendFilters(qs, params.filters)
  return fetchJson<BreakdownsResponse>(`/breakdowns?${qs.toString()}`)
}

export async function getEvents(params: EventsParams): Promise<EventsResponse> {
  const qs = new URLSearchParams({ from: params.from, to: params.to })
  for (const provider of params.provider ?? []) qs.append('provider', provider)
  for (const model of params.model ?? []) qs.append('model', model)
  for (const stage of params.pipeline_stage ?? []) qs.append('pipeline_stage', stage)
  if (params.conversation_id) qs.set('conversation_id', params.conversation_id)
  if (params.user_id) qs.set('user_id', params.user_id)
  if (params.status) qs.set('status', params.status)
  if (params.min_cost !== undefined) qs.set('min_cost', String(params.min_cost))
  if (params.max_cost !== undefined) qs.set('max_cost', String(params.max_cost))
  if (params.min_latency !== undefined)
    qs.set('min_latency', String(params.min_latency))
  if (params.max_latency !== undefined)
    qs.set('max_latency', String(params.max_latency))
  if (params.search) qs.set('search', params.search)
  if (params.limit !== undefined) qs.set('limit', String(params.limit))
  if (params.cursor) qs.set('cursor', params.cursor)
  return fetchJson<EventsResponse>(`/events?${qs.toString()}`)
}

export async function getEvent(id: string): Promise<EventDetailResponse> {
  return fetchJson<EventDetailResponse>(`/event/${encodeURIComponent(id)}`)
}

// ── Reconciliation (O.2; USTAD_S2_6) ─────────────────────────────────────

export interface FetchReconciliationHistoryParams {
  provider?: ProviderName | string
  limit?: number
  offset?: number
}

export interface TriggerReconciliationBody {
  provider: ProviderName
  period_start: string
  period_end: string
}

export async function fetchReconciliationHistory(
  params: FetchReconciliationHistoryParams = {},
): Promise<ReconciliationHistoryResponse> {
  const qs = new URLSearchParams()
  if (params.provider) qs.set('provider', params.provider)
  if (params.limit !== undefined) qs.set('limit', String(params.limit))
  if (params.offset !== undefined) qs.set('offset', String(params.offset))
  const path = qs.size > 0
    ? `/reconciliation/history?${qs.toString()}`
    : '/reconciliation/history'
  return fetchJson<ReconciliationHistoryResponse>(path)
}

export async function triggerReconciliation(
  body: TriggerReconciliationBody,
): Promise<ProviderReconcileResult> {
  const response = await fetch(`${BASE}/reconciliation`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    body: JSON.stringify(body),
  })
  if (response.ok) return (await response.json()) as ProviderReconcileResult

  let code = 'UNKNOWN'
  let message = `Observatory API request failed (${response.status})`
  let detail: string | undefined
  try {
    const errBody = (await response.json()) as {
      error?: string | { code?: string; message?: string; detail?: string }
      message?: string
    }
    if (typeof errBody.error === 'string') {
      code = errBody.error
      message = errBody.message ?? message
    } else if (errBody.error) {
      code = errBody.error.code ?? code
      message = errBody.error.message ?? message
      detail = errBody.error.detail
    }
  } catch {
    // body wasn't JSON; keep defaults
  }

  if (response.status === 401) throw new UnauthorizedError(code, message, detail)
  if (response.status === 403) throw new ForbiddenError(code, message, detail)
  throw new ObservatoryApiError(response.status, code, message, detail)
}

// ── Budget rules (O.3; USTAD_S3_1) ───────────────────────────────────────

export interface FetchBudgetRulesParams {
  /** When 'true' / 'false' — narrow to active or inactive only. */
  active?: 'true' | 'false' | 'all'
}

export async function fetchBudgetRules(
  params: FetchBudgetRulesParams = {},
): Promise<{ rules: BudgetRuleRow[] }> {
  const qs = new URLSearchParams()
  if (params.active && params.active !== 'all') qs.set('active', params.active)
  const path = qs.size > 0 ? `/budget-rules?${qs.toString()}` : '/budget-rules'
  return fetchJson<{ rules: BudgetRuleRow[] }>(path)
}

async function postJson<TResponse>(
  path: string,
  body: unknown,
): Promise<TResponse> {
  const response = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    body: JSON.stringify(body),
  })
  if (response.ok) return (await response.json()) as TResponse

  let code = 'UNKNOWN'
  let message = `Observatory API request failed (${response.status})`
  let detail: string | undefined
  try {
    const errBody = (await response.json()) as {
      error?: string | { code?: string; message?: string; detail?: string }
      message?: string
    }
    if (typeof errBody.error === 'string') {
      code = errBody.error
      message = errBody.message ?? message
    } else if (errBody.error) {
      code = errBody.error.code ?? code
      message = errBody.error.message ?? message
      detail = errBody.error.detail
    }
  } catch {
    // body wasn't JSON; keep defaults
  }

  if (response.status === 401) throw new UnauthorizedError(code, message, detail)
  if (response.status === 403) throw new ForbiddenError(code, message, detail)
  throw new ObservatoryApiError(response.status, code, message, detail)
}

export async function createBudgetRule(
  input: BudgetRuleInput,
): Promise<BudgetRuleRow> {
  return postJson<BudgetRuleRow>('/budget-rules', input)
}

export async function evaluateBudgets(
  ruleId?: string,
): Promise<{ results: BudgetEvaluationResult[] }> {
  const path = ruleId
    ? `/budget-rules/evaluate?rule_id=${encodeURIComponent(ruleId)}`
    : '/budget-rules/evaluate'
  return fetchJson<{ results: BudgetEvaluationResult[] }>(path)
}
