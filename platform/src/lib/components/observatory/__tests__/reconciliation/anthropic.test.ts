// @vitest-environment node
//
// Phase O — O.2 Reconciliation: AnthropicReconciler tests.
//
// Authored by USTAD_S2_2_ANTHROPIC_RECONCILER per the S2.2 brief AC.7. Six
// scenarios:
//   1. happy-path cost math (input + output + cache_write@1.25× + cache_read@0.1×)
//   2. pagination across multiple pages
//   3. missing ANTHROPIC_ADMIN_API_KEY → status='error'
//   4. 403 from Admin API → notes contains "billing:read"
//   5. unknown model in pricing → cost=0 for that model, notes records it
//   6. POST /reconciliation with provider='anthropic' returns 200 (not 400)
//
// All tests are unit-level — fetch + DB are mocked.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextResponse } from 'next/server'

vi.mock('server-only', () => ({}))

const queryMock = vi.fn()
vi.mock('@/lib/db/client', () => ({
  query: (...args: unknown[]) => queryMock(...args),
}))

import { AnthropicReconciler } from '@/lib/observatory/reconciliation/anthropic'
import { DEFAULT_RECONCILIATION_CONFIG } from '@/lib/observatory/reconciliation/types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePage(
  data: Array<{
    model: string
    usage: {
      input_tokens?: number
      output_tokens?: number
      cache_creation_input_tokens?: number
      cache_read_input_tokens?: number
    }
  }>,
  options: { has_more?: boolean; next_page?: string | null } = {},
): unknown {
  return {
    data,
    has_more: options.has_more ?? false,
    next_page: options.next_page ?? null,
  }
}

function jsonResponse(body: unknown, init: { status?: number } = {}): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { 'content-type': 'application/json' },
  })
}

function emptyPricingTablesQuery(sql: string): { rows: unknown[] } {
  if (/INSERT INTO llm_provider_cost_reports/.test(sql)) {
    return { rows: [{ report_id: 'r-test' }] }
  }
  if (/FROM llm_usage_events/.test(sql)) {
    return { rows: [{ total_cost_usd: 0, event_count: '0' }] }
  }
  return { rows: [] }
}

const OPUS_PRICING_ROWS = [
  { token_class: 'input',       price_per_million_usd: 15.0 },
  { token_class: 'output',      price_per_million_usd: 75.0 },
  { token_class: 'cache_write', price_per_million_usd: 18.75 },
  { token_class: 'cache_read',  price_per_million_usd:  1.5 },
]

// ---------------------------------------------------------------------------
// 1. happy-path cost math
// ---------------------------------------------------------------------------

describe('AnthropicReconciler.fetchAuthoritativeCost', () => {
  beforeEach(() => {
    queryMock.mockReset()
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.stubEnv('ANTHROPIC_ADMIN_API_KEY', 'sk-admin-test-123')
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('happy path: input + output + cache_write (1.25×) + cache_read (0.1×) summed correctly', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        makePage(
          [
            {
              model: 'claude-opus-4-6',
              usage: {
                input_tokens: 1000,
                output_tokens: 400,
                cache_creation_input_tokens: 200,
                cache_read_input_tokens: 500,
              },
            },
          ],
          { has_more: false },
        ),
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    queryMock.mockImplementation(async (sql: string) => {
      if (/FROM llm_pricing_versions/.test(sql)) {
        return { rows: OPUS_PRICING_ROWS }
      }
      return emptyPricingTablesQuery(sql)
    })

    const reconciler = new AnthropicReconciler()
    const result = await reconciler.reconcile(
      {
        provider: 'anthropic',
        period_start: '2026-05-01',
        period_end: '2026-05-01',
      },
      DEFAULT_RECONCILIATION_CONFIG,
    )

    // Manual calc:
    //   input:       1000   / 1e6 × 15.00 = 0.015
    //   output:       400   / 1e6 × 75.00 = 0.030
    //   cache_write:  200   / 1e6 × 18.75 = 0.00375
    //   cache_read:   500   / 1e6 × 1.50  = 0.00075
    //                                ────────
    //                                0.04950
    expect(result.authoritative_cost_usd).toBeCloseTo(0.0495, 6)
    expect(result.status).not.toBe('error')
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const calledUrl = String(fetchMock.mock.calls[0][0])
    expect(calledUrl).toContain('start_date=2026-05-01')
    expect(calledUrl).toContain('end_date=2026-05-01')
    const calledHeaders = (fetchMock.mock.calls[0][1] as RequestInit | undefined)?.headers as
      | Record<string, string>
      | undefined
    expect(calledHeaders?.['x-api-key']).toBe('sk-admin-test-123')
    expect(calledHeaders?.['anthropic-version']).toBe('2023-06-01')
  })

  // -------------------------------------------------------------------------
  // 2. pagination
  // -------------------------------------------------------------------------

  it('pagination: follows has_more=true → has_more=false; sums totals across pages', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse(
          makePage(
            [
              {
                model: 'claude-opus-4-6',
                usage: { input_tokens: 1000, output_tokens: 400 },
              },
            ],
            { has_more: true, next_page: 'cursor-page-2' },
          ),
        ),
      )
      .mockResolvedValueOnce(
        jsonResponse(
          makePage(
            [
              {
                model: 'claude-opus-4-6',
                usage: { input_tokens: 500, output_tokens: 200 },
              },
            ],
            { has_more: false },
          ),
        ),
      )
    vi.stubGlobal('fetch', fetchMock)

    queryMock.mockImplementation(async (sql: string) => {
      if (/FROM llm_pricing_versions/.test(sql)) {
        return { rows: OPUS_PRICING_ROWS }
      }
      return emptyPricingTablesQuery(sql)
    })

    const reconciler = new AnthropicReconciler()
    const result = await reconciler.reconcile(
      {
        provider: 'anthropic',
        period_start: '2026-05-01',
        period_end: '2026-05-01',
      },
      DEFAULT_RECONCILIATION_CONFIG,
    )

    // page 1: 1000×15 + 400×75 = 0.015 + 0.030 = 0.045
    // page 2:  500×15 + 200×75 = 0.0075 + 0.015 = 0.0225
    // total = 0.0675
    expect(result.authoritative_cost_usd).toBeCloseTo(0.0675, 6)
    expect(fetchMock).toHaveBeenCalledTimes(2)

    const secondCallUrl = String(fetchMock.mock.calls[1][0])
    expect(secondCallUrl).toContain('page=cursor-page-2')
  })

  // -------------------------------------------------------------------------
  // 3. missing ANTHROPIC_ADMIN_API_KEY → status='error', no throw
  // -------------------------------------------------------------------------

  it('missing ANTHROPIC_ADMIN_API_KEY → status=error, never throws', async () => {
    vi.unstubAllEnvs()
    // Defensive: ensure key is gone even if shell injected one.
    delete process.env.ANTHROPIC_ADMIN_API_KEY

    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    queryMock.mockImplementation(async (sql: string) => emptyPricingTablesQuery(sql))

    const reconciler = new AnthropicReconciler()
    const result = await reconciler.reconcile(
      {
        provider: 'anthropic',
        period_start: '2026-05-01',
        period_end: '2026-05-01',
      },
      DEFAULT_RECONCILIATION_CONFIG,
    )

    expect(result.status).toBe('error')
    expect(result.notes).toContain('ANTHROPIC_ADMIN_API_KEY')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  // -------------------------------------------------------------------------
  // 4. 403 from API → notes contains "billing:read"
  // -------------------------------------------------------------------------

  it('403 from API → status=error, notes contains "billing:read"', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('forbidden', {
        status: 403,
        headers: { 'content-type': 'text/plain' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    queryMock.mockImplementation(async (sql: string) => emptyPricingTablesQuery(sql))

    const reconciler = new AnthropicReconciler()
    const result = await reconciler.reconcile(
      {
        provider: 'anthropic',
        period_start: '2026-05-01',
        period_end: '2026-05-01',
      },
      DEFAULT_RECONCILIATION_CONFIG,
    )

    expect(result.status).toBe('error')
    expect(result.notes).toContain('billing:read')
  })

  // -------------------------------------------------------------------------
  // 5. unknown model in pricing → cost=0 for that model, notes records it
  // -------------------------------------------------------------------------

  it('unknown model in pricing → status not error, notes records unpriced model', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        makePage(
          [
            {
              model: 'claude-future-X',
              usage: {
                input_tokens: 1_000_000,
                output_tokens: 1_000_000,
              },
            },
          ],
          { has_more: false },
        ),
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    queryMock.mockImplementation(async (sql: string) => {
      if (/FROM llm_pricing_versions/.test(sql)) {
        return { rows: [] } // no pricing for this model
      }
      return emptyPricingTablesQuery(sql)
    })

    const reconciler = new AnthropicReconciler()
    const result = await reconciler.reconcile(
      {
        provider: 'anthropic',
        period_start: '2026-05-01',
        period_end: '2026-05-01',
      },
      DEFAULT_RECONCILIATION_CONFIG,
    )

    expect(result.status).not.toBe('error')
    expect(result.authoritative_cost_usd).toBe(0)
    expect(result.notes).toContain('unpriced_models=claude-future-X')
  })
})

// ---------------------------------------------------------------------------
// 6. POST /reconciliation with provider='anthropic' returns 200
// ---------------------------------------------------------------------------

describe('POST /api/admin/observatory/reconciliation — anthropic wired', () => {
  beforeEach(() => {
    queryMock.mockReset()
    vi.resetModules()
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.stubEnv('MARSYS_FLAG_OBSERVATORY_ENABLED', 'true')
    vi.stubEnv('ANTHROPIC_ADMIN_API_KEY', 'sk-admin-test-route')
    vi.doMock('@/lib/auth/access-control', () => ({
      requireSuperAdmin: async () => ({
        user: { uid: 'admin-1' },
        profile: { id: 'admin-1', role: 'super_admin', status: 'active' },
      }),
    }))
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('returns 200 (not 400 not_implemented) when AnthropicReconciler is wired', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        makePage(
          [
            {
              model: 'claude-opus-4-6',
              usage: { input_tokens: 100, output_tokens: 50 },
            },
          ],
          { has_more: false },
        ),
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    queryMock.mockImplementation(async (sql: string) => {
      if (/FROM llm_pricing_versions/.test(sql)) {
        return { rows: OPUS_PRICING_ROWS }
      }
      return emptyPricingTablesQuery(sql)
    })

    const { POST } = await import(
      '@/app/api/admin/observatory/reconciliation/route'
    )
    const request = new Request('http://x/api/admin/observatory/reconciliation', {
      method: 'POST',
      body: JSON.stringify({
        provider: 'anthropic',
        period_start: '2026-05-01',
        period_end: '2026-05-01',
      }),
    })
    const response = await POST(request)
    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.provider).toBe('anthropic')
    expect(body.status).not.toBe('error')
    expect(typeof body.authoritative_cost_usd).toBe('number')
  })
})
