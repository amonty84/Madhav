// @vitest-environment node
//
// Phase O — O.2 Reconciliation: OpenAIReconciler unit tests.
//
// Authored by USTAD_S2_3_OPENAI_RECONCILER. Six tests covering:
//   1. /costs path happy
//   2. /costs 404 → fallback to /completions
//   3. /completions path with two models priced via llm_pricing_versions
//   4. Cursor pagination across two pages
//   5. OPENAI_ADMIN_API_KEY missing → status='error'
//   6. 403 → status='error', notes contains 'org:read'
//
// All DB writes are mocked via the same `query` mock pattern as
// reconciliation.test.ts; global fetch is stubbed per test.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('server-only', () => ({}))

const queryMock = vi.fn()
vi.mock('@/lib/db/client', () => ({
  query: (...args: unknown[]) => queryMock(...args),
}))

import { OpenAIReconciler } from '@/lib/observatory/reconciliation/openai'
import { DEFAULT_RECONCILIATION_CONFIG } from '@/lib/observatory/reconciliation/types'

interface MockResponseInit {
  status?: number
  body?: unknown
}

function mockResponse({ status = 200, body = {} }: MockResponseInit): Response {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
  } as unknown as Response
}

const PERIOD = { period_start: '2026-05-01', period_end: '2026-05-01' } as const
const PROVIDER = 'openai' as const

function stubReportRow() {
  return { rows: [{ report_id: 'r-test' }], rowCount: 1 }
}
function stubPeriodCost(total = 0, count = '0') {
  return { rows: [{ total_cost_usd: total, event_count: count }], rowCount: 1 }
}
function stubEmpty() {
  return { rows: [], rowCount: 0 }
}

beforeEach(() => {
  queryMock.mockReset()
  process.env.OPENAI_ADMIN_API_KEY = 'sk-admin-test'
})

afterEach(() => {
  vi.unstubAllGlobals()
  delete process.env.OPENAI_ADMIN_API_KEY
})

// ---------------------------------------------------------------------------
// Test 1 — /costs path happy.
// ---------------------------------------------------------------------------

describe('OpenAIReconciler — /costs path', () => {
  it('returns authoritative cost from /costs response', async () => {
    queryMock.mockImplementation(async (sql: string) => {
      if (/INSERT INTO llm_provider_cost_reports/.test(sql)) return stubReportRow()
      if (/FROM llm_usage_events/.test(sql)) return stubPeriodCost(40, '5')
      if (/INSERT INTO llm_cost_reconciliation/.test(sql)) return stubEmpty()
      return stubEmpty()
    })

    const fetchMock = vi.fn(async (url: string) => {
      expect(url).toContain('/v1/organization/costs')
      expect(url).toContain('start_time=')
      expect(url).toContain('bucket_width=1d')
      return mockResponse({
        body: {
          object: 'page',
          data: [
            {
              object: 'bucket',
              start_time: 0,
              end_time: 0,
              results: [{ amount: { value: 42.5, currency: 'usd' } }],
            },
          ],
          has_more: false,
          next_page: null,
        },
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    const reconciler = new OpenAIReconciler()
    const result = await reconciler.reconcile(
      { provider: PROVIDER, ...PERIOD },
      DEFAULT_RECONCILIATION_CONFIG,
    )

    expect(result.authoritative_cost_usd).toBeCloseTo(42.5)
    expect(result.computed_cost_usd).toBe(40)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    // The raw_payload persisted in the report-insert call must record which
    // endpoint was used.
    const reportInsert = queryMock.mock.calls.find(c =>
      /INSERT INTO llm_provider_cost_reports/.test(String(c[0])),
    )
    expect(reportInsert).toBeDefined()
    const rawPayloadJson = (reportInsert![1] as unknown[])[4] as string
    const parsed = JSON.parse(rawPayloadJson)
    expect(parsed.meta.endpoint_used).toBe('/v1/organization/costs')
  })
})

// ---------------------------------------------------------------------------
// Test 2 — /costs 404 → fallback to /completions.
// ---------------------------------------------------------------------------

describe('OpenAIReconciler — /costs 404 fallback', () => {
  it('falls through to /completions when /costs returns 404', async () => {
    queryMock.mockImplementation(async (sql: string) => {
      if (/INSERT INTO llm_provider_cost_reports/.test(sql)) return stubReportRow()
      if (/FROM llm_usage_events/.test(sql)) return stubPeriodCost(0, '0')
      if (/FROM llm_pricing_versions/.test(sql)) {
        return {
          rows: [
            { token_class: 'input', price_per_million_usd: 2.0 },
            { token_class: 'output', price_per_million_usd: 8.0 },
          ],
          rowCount: 2,
        }
      }
      if (/INSERT INTO llm_cost_reconciliation/.test(sql)) return stubEmpty()
      return stubEmpty()
    })

    const fetchMock = vi.fn()
    fetchMock.mockResolvedValueOnce(mockResponse({ status: 404, body: {} }))
    fetchMock.mockResolvedValueOnce(
      mockResponse({
        body: {
          object: 'page',
          data: [
            {
              results: [
                {
                  model: 'gpt-4.1',
                  input_tokens: 1_000_000,
                  output_tokens: 0,
                  input_cached_tokens: 0,
                },
              ],
            },
          ],
          has_more: false,
          next_page: null,
        },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const reconciler = new OpenAIReconciler()
    const result = await reconciler.reconcile(
      { provider: PROVIDER, ...PERIOD },
      DEFAULT_RECONCILIATION_CONFIG,
    )

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(String(fetchMock.mock.calls[0][0])).toContain('/v1/organization/costs')
    expect(String(fetchMock.mock.calls[1][0])).toContain(
      '/v1/organization/usage/completions',
    )

    const reportInsert = queryMock.mock.calls.find(c =>
      /INSERT INTO llm_provider_cost_reports/.test(String(c[0])),
    )
    const rawPayloadJson = (reportInsert![1] as unknown[])[4] as string
    const parsed = JSON.parse(rawPayloadJson)
    expect(parsed.meta.endpoint_used).toBe('/v1/organization/usage/completions')
    // 1M input tokens × $2.00/M = $2.00.
    expect(result.authoritative_cost_usd).toBeCloseTo(2.0)
  })
})

// ---------------------------------------------------------------------------
// Test 3 — /completions path: 2 models priced via llm_pricing_versions.
// ---------------------------------------------------------------------------

describe('OpenAIReconciler — /completions multi-model pricing', () => {
  it('sums per-model cost from local pricing rows', async () => {
    const pricingRowsByModel: Record<
      string,
      Array<{ token_class: string; price_per_million_usd: number }>
    > = {
      'gpt-4.1': [
        { token_class: 'input', price_per_million_usd: 2.0 },
        { token_class: 'output', price_per_million_usd: 8.0 },
      ],
      'gpt-4.1-mini': [
        { token_class: 'input', price_per_million_usd: 0.4 },
        { token_class: 'output', price_per_million_usd: 1.6 },
      ],
    }

    queryMock.mockImplementation(async (sql: string, params?: unknown[]) => {
      if (/INSERT INTO llm_provider_cost_reports/.test(sql)) return stubReportRow()
      if (/FROM llm_usage_events/.test(sql)) return stubPeriodCost(0, '0')
      if (/FROM llm_pricing_versions/.test(sql)) {
        const model = (params?.[1] as string) ?? ''
        return { rows: pricingRowsByModel[model] ?? [], rowCount: 0 }
      }
      if (/INSERT INTO llm_cost_reconciliation/.test(sql)) return stubEmpty()
      return stubEmpty()
    })

    const fetchMock = vi.fn()
    fetchMock.mockResolvedValueOnce(mockResponse({ status: 404, body: {} }))
    fetchMock.mockResolvedValueOnce(
      mockResponse({
        body: {
          data: [
            {
              results: [
                { model: 'gpt-4.1',      input_tokens: 500_000, output_tokens: 100_000 },
                { model: 'gpt-4.1-mini', input_tokens: 2_000_000, output_tokens: 500_000 },
              ],
            },
          ],
          has_more: false,
          next_page: null,
        },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const reconciler = new OpenAIReconciler()
    const result = await reconciler.reconcile(
      { provider: PROVIDER, ...PERIOD },
      DEFAULT_RECONCILIATION_CONFIG,
    )

    // gpt-4.1: 0.5*2 + 0.1*8 = 1.0 + 0.8 = 1.80
    // gpt-4.1-mini: 2.0*0.4 + 0.5*1.6 = 0.80 + 0.80 = 1.60
    // Total: 3.40
    expect(result.authoritative_cost_usd).toBeCloseTo(3.4, 6)
  })
})

// ---------------------------------------------------------------------------
// Test 4 — Pagination: cursor-follow across 2 pages.
// ---------------------------------------------------------------------------

describe('OpenAIReconciler — pagination', () => {
  it('follows next_page cursor on /costs until has_more=false', async () => {
    queryMock.mockImplementation(async (sql: string) => {
      if (/INSERT INTO llm_provider_cost_reports/.test(sql)) return stubReportRow()
      if (/FROM llm_usage_events/.test(sql)) return stubPeriodCost(0, '0')
      if (/INSERT INTO llm_cost_reconciliation/.test(sql)) return stubEmpty()
      return stubEmpty()
    })

    const fetchMock = vi.fn()
    fetchMock.mockResolvedValueOnce(
      mockResponse({
        body: {
          data: [{ results: [{ amount: { value: 10 } }] }],
          has_more: true,
          next_page: 'cursor-page-2',
        },
      }),
    )
    fetchMock.mockResolvedValueOnce(
      mockResponse({
        body: {
          data: [{ results: [{ amount: { value: 5 } }] }],
          has_more: false,
          next_page: null,
        },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const reconciler = new OpenAIReconciler()
    const result = await reconciler.reconcile(
      { provider: PROVIDER, ...PERIOD },
      DEFAULT_RECONCILIATION_CONFIG,
    )

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(String(fetchMock.mock.calls[1][0])).toContain('page=cursor-page-2')
    expect(result.authoritative_cost_usd).toBeCloseTo(15)
  })
})

// ---------------------------------------------------------------------------
// Test 5 — OPENAI_ADMIN_API_KEY missing → status='error'.
// ---------------------------------------------------------------------------

describe('OpenAIReconciler — env guard', () => {
  it('returns status=error when OPENAI_ADMIN_API_KEY is unset', async () => {
    delete process.env.OPENAI_ADMIN_API_KEY
    queryMock.mockImplementation(async () => stubEmpty())
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const reconciler = new OpenAIReconciler()
    const result = await reconciler.reconcile(
      { provider: PROVIDER, ...PERIOD },
      DEFAULT_RECONCILIATION_CONFIG,
    )

    expect(result.status).toBe('error')
    expect(result.notes).toContain('OPENAI_ADMIN_API_KEY')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// Test 6 — 403 → status='error', notes contains 'org:read'.
// ---------------------------------------------------------------------------

describe('OpenAIReconciler — 403 scope error', () => {
  it('classifies 403 as error and notes mentions org:read scope', async () => {
    queryMock.mockImplementation(async () => stubEmpty())
    const fetchMock = vi.fn(async () =>
      mockResponse({ status: 403, body: { error: { code: 'permission_denied' } } }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const reconciler = new OpenAIReconciler()
    const result = await reconciler.reconcile(
      { provider: PROVIDER, ...PERIOD },
      DEFAULT_RECONCILIATION_CONFIG,
    )

    expect(result.status).toBe('error')
    expect(result.notes ?? '').toContain('org:read')
  })
})
