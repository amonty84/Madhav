// @vitest-environment node
//
// Phase O.4 — GET /api/admin/observatory/analytics/cache route tests
// (USTAD_S4_1). Auth + parse + happy-path coverage. The DB layer is mocked at
// the cache_effectiveness module boundary so no real DB is needed.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'

vi.mock('server-only', () => ({}))

beforeEach(() => {
  vi.resetModules()
  process.env.MARSYS_FLAG_OBSERVATORY_ENABLED = 'true'
})

function makeRequest(qs: string): Request {
  return new Request(`http://localhost/api/admin/observatory/analytics/cache${qs}`)
}

function mockSuperAdmin() {
  vi.doMock('@/lib/auth/access-control', () => ({
    requireSuperAdmin: async () => ({
      user: { uid: 'admin-1' },
      profile: { id: 'admin-1', role: 'super_admin', status: 'active' },
    }),
  }))
}

function mockNonSuperAdmin() {
  vi.doMock('@/lib/auth/access-control', () => ({
    requireSuperAdmin: async () =>
      NextResponse.json({ error: 'forbidden' }, { status: 403 }),
  }))
}

function mockDb() {
  vi.doMock('@/lib/db/client', () => ({
    getPool: async () => ({
      query: async () => ({
        rows: [
          {
            provider: 'anthropic',
            total_events: '5',
            input_tokens: '1000',
            cache_read_tokens: '300',
            cache_write_tokens: '50',
            output_tokens: '600',
            actual_cost_usd: 0.5,
            cost_saved_usd: 0.2,
          },
        ],
      }),
    }),
  }))
}

describe('GET /api/admin/observatory/analytics/cache', () => {
  it('returns 200 with valid date range', async () => {
    mockSuperAdmin()
    mockDb()
    const { GET } = await import('../route')
    const r = await GET(
      makeRequest('?date_start=2026-04-01T00:00:00Z&date_end=2026-05-01T00:00:00Z'),
    )
    expect(r.status).toBe(200)
    const body = await r.json()
    expect(body.providers).toHaveLength(1)
    expect(body.providers[0].provider).toBe('anthropic')
    // bigint surfaces serialized as decimal string
    expect(body.providers[0].input_tokens).toBe('1000')
    expect(body.totals.input_tokens).toBe('1000')
  })

  it('returns 400 when date_start is missing', async () => {
    mockSuperAdmin()
    mockDb()
    const { GET } = await import('../route')
    const r = await GET(makeRequest('?date_end=2026-05-01T00:00:00Z'))
    expect(r.status).toBe(400)
  })

  it('returns 400 when date_end is missing', async () => {
    mockSuperAdmin()
    mockDb()
    const { GET } = await import('../route')
    const r = await GET(makeRequest('?date_start=2026-04-01T00:00:00Z'))
    expect(r.status).toBe(400)
  })

  it('returns 400 when date_end <= date_start', async () => {
    mockSuperAdmin()
    mockDb()
    const { GET } = await import('../route')
    const r = await GET(
      makeRequest('?date_start=2026-05-01T00:00:00Z&date_end=2026-04-01T00:00:00Z'),
    )
    expect(r.status).toBe(400)
  })

  it('returns 403 for non-super-admin', async () => {
    mockNonSuperAdmin()
    mockDb()
    const { GET } = await import('../route')
    const r = await GET(
      makeRequest('?date_start=2026-04-01T00:00:00Z&date_end=2026-05-01T00:00:00Z'),
    )
    expect(r.status).toBe(403)
  })

  it('returns 403 when feature flag is disabled', async () => {
    process.env.MARSYS_FLAG_OBSERVATORY_ENABLED = 'false'
    mockSuperAdmin()
    mockDb()
    const { GET } = await import('../route')
    const r = await GET(
      makeRequest('?date_start=2026-04-01T00:00:00Z&date_end=2026-05-01T00:00:00Z'),
    )
    expect(r.status).toBe(403)
  })
})
