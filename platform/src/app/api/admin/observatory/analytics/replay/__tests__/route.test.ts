// @vitest-environment node
//
// USTAD_S4_5 — Replay & Re-cost API route tests.
//
// Tests the POST /replay handler + GET /replay/pricing-versions handler.
//   §A  POST 200 valid body (auth ok)
//   §B  POST 400 date range > 90 days
//   §C  POST 400 missing required params
//   §D  POST 403 non-admin
//   §E  GET pricing-versions 200 (auth ok)

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'

vi.mock('server-only', () => ({}))

const queryMock = vi.fn()
vi.mock('@/lib/db/client', () => ({
  query: (...args: unknown[]) => queryMock(...args),
  getPool: vi.fn(),
}))

function mockSuperAdmin() {
  vi.doMock('@/lib/auth/access-control', () => ({
    requireSuperAdmin: async () => ({
      user: { uid: 'admin-1' },
      profile: { id: 'admin-1', role: 'super_admin', status: 'active' },
    }),
  }))
}

function mockNonAdmin() {
  vi.doMock('@/lib/auth/access-control', () => ({
    requireSuperAdmin: async () =>
      NextResponse.json({ error: 'forbidden' }, { status: 403 }),
  }))
}

beforeEach(() => {
  queryMock.mockReset()
  vi.resetModules()
  process.env.MARSYS_FLAG_OBSERVATORY_ENABLED = 'true'
})

// ---------------------------------------------------------------------------
// §A — POST 200 valid body
// ---------------------------------------------------------------------------

describe('§A — POST /replay 200 happy path', () => {
  it('1. valid body → 200 + ReplayResult', async () => {
    mockSuperAdmin()

    queryMock.mockImplementation((sql: string) => {
      if (sql.includes('FROM llm_usage_events')) {
        return {
          rows: [
            {
              event_id: 'e-1',
              provider: 'anthropic',
              model: 'claude-opus-4-7',
              input_tokens: 1_000_000,
              output_tokens: 0,
              cache_read_tokens: 0,
              cache_write_tokens: 0,
              reasoning_tokens: 0,
              computed_cost_usd: 10,
            },
          ],
        }
      }
      if (sql.includes('DISTINCT ON (provider, model, token_class)')) {
        return {
          rows: [
            {
              pricing_version_id: 'pv-1',
              provider: 'anthropic',
              model: 'claude-opus-4-7',
              token_class: 'input',
              price_per_million_usd: 15,
              effective_from: '2026-04-01',
            },
          ],
        }
      }
      return { rows: [] }
    })

    const { POST } = await import('../route')
    const request = new Request(
      'http://x/api/admin/observatory/analytics/replay',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date_start: '2026-04-01',
          date_end: '2026-04-30',
        }),
      },
    )
    const response = await POST(request)
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.events_processed).toBe(1)
    expect(body.original_total_usd).toBe(10)
    expect(body.recost_total_usd).toBe(15)
    expect(body.delta_total_usd).toBe(5)
    expect(body.target_pricing_version_id).toBe('pv-1')
  })
})

// ---------------------------------------------------------------------------
// §B — POST 400 date range > 90 days
// ---------------------------------------------------------------------------

describe('§B — POST /replay 400 date range > 90 days', () => {
  it('2. 91-day window → 400', async () => {
    mockSuperAdmin()
    const { POST } = await import('../route')
    const request = new Request(
      'http://x/api/admin/observatory/analytics/replay',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date_start: '2026-01-01',
          date_end: '2026-04-02',
        }),
      },
    )
    const response = await POST(request)
    expect(response.status).toBe(400)
    expect(queryMock).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// §C — POST 400 missing required params
// ---------------------------------------------------------------------------

describe('§C — POST /replay 400 missing required params', () => {
  it('3. missing date_start → 400', async () => {
    mockSuperAdmin()
    const { POST } = await import('../route')
    const request = new Request(
      'http://x/api/admin/observatory/analytics/replay',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date_end: '2026-04-30' }),
      },
    )
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('4. malformed JSON body → 400', async () => {
    mockSuperAdmin()
    const { POST } = await import('../route')
    const request = new Request(
      'http://x/api/admin/observatory/analytics/replay',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not-json',
      },
    )
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('5. limit > 50_000 → 400', async () => {
    mockSuperAdmin()
    const { POST } = await import('../route')
    const request = new Request(
      'http://x/api/admin/observatory/analytics/replay',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date_start: '2026-04-01',
          date_end: '2026-04-30',
          limit: 100_000,
        }),
      },
    )
    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})

// ---------------------------------------------------------------------------
// §D — POST 403 non-admin
// ---------------------------------------------------------------------------

describe('§D — POST /replay 403 non-admin', () => {
  it('6. requireSuperAdmin returns 403 → handler short-circuits to 403', async () => {
    mockNonAdmin()
    const { POST } = await import('../route')
    const request = new Request(
      'http://x/api/admin/observatory/analytics/replay',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date_start: '2026-04-01',
          date_end: '2026-04-30',
        }),
      },
    )
    const response = await POST(request)
    expect(response.status).toBe(403)
    expect(queryMock).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// §E — GET pricing-versions
// ---------------------------------------------------------------------------

describe('§E — GET /replay/pricing-versions 200', () => {
  it('7. returns versions array sorted by effective_from DESC', async () => {
    mockSuperAdmin()
    queryMock.mockResolvedValueOnce({
      rows: [
        {
          pricing_version_id: 'pv-a',
          provider: 'anthropic',
          model: 'claude-opus-4-7',
          effective_from: '2026-04-01',
        },
        {
          pricing_version_id: 'pv-b',
          provider: 'gemini',
          model: 'gemini-2.5-pro',
          effective_from: '2026-04-15',
        },
      ],
    })

    const { GET } = await import('../pricing-versions/route')
    const response = await GET()
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(Array.isArray(body.versions)).toBe(true)
    expect(body.versions).toHaveLength(2)
    // First entry should be the most recent.
    expect(body.versions[0].effective_from).toBe('2026-04-15')
    expect(body.versions[0].provider).toBe('gemini')
    // Each row exposes the four required fields.
    for (const v of body.versions) {
      expect(typeof v.pricing_version_id).toBe('string')
      expect(typeof v.provider).toBe('string')
      expect(typeof v.model).toBe('string')
      expect(typeof v.effective_from).toBe('string')
    }
  })
})
