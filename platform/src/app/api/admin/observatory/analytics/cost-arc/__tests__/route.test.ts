// @vitest-environment node
//
// Phase O — O.4 — /api/admin/observatory/analytics/cost-arc route tests.
//
// Covers:
//   - 200 for a valid request (date_start + date_end).
//   - 400 when date_start or date_end is missing / inverted.
//   - 403 when the caller is not a super-admin (guard delegates to
//     `requireSuperAdmin`, which we mock to return a 403 NextResponse).
//   - 404 from the [conversationId] route when no events exist.
//
// Authored by USTAD_S4_3_COST_ARC.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'

vi.mock('server-only', () => ({}))

const queryMock = vi.fn()
vi.mock('@/lib/db/client', () => ({
  query: (...args: unknown[]) => queryMock(...args),
}))

beforeEach(() => {
  queryMock.mockReset()
  process.env.MARSYS_FLAG_OBSERVATORY_ENABLED = 'true'
  vi.resetModules()
})

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
      NextResponse.json(
        { error: { code: 'AUTH_FORBIDDEN', message: 'Not allowed' } },
        { status: 403 },
      ),
  }))
}

describe('GET /api/admin/observatory/analytics/cost-arc', () => {
  it('returns 200 with conversations[] for a valid date range', async () => {
    mockSuperAdmin()
    queryMock.mockResolvedValueOnce({
      rows: [
        {
          conversation_id: 'conv-A',
          conversation_name: 'Alpha',
          total_cost_usd: 1.25,
          event_count: '4',
          turn_count: '2',
          first_event_at: '2026-04-01T10:00:00Z',
          last_event_at: '2026-04-01T10:30:00Z',
          providers: ['anthropic'],
        },
      ],
    })
    const { GET } = await import('../route')
    const req = new Request(
      'http://x/api/admin/observatory/analytics/cost-arc' +
        '?date_start=2026-04-01T00:00:00Z&date_end=2026-04-30T00:00:00Z',
    )
    const r = await GET(req)
    expect(r.status).toBe(200)
    const body = (await r.json()) as {
      conversations: Array<{ conversation_id: string; total_cost_usd: number }>
      date_start: string
      date_end: string
    }
    expect(body.conversations).toHaveLength(1)
    expect(body.conversations[0].conversation_id).toBe('conv-A')
    expect(body.conversations[0].total_cost_usd).toBeCloseTo(1.25, 6)
    expect(body.date_start).toBe('2026-04-01T00:00:00Z')
    expect(body.date_end).toBe('2026-04-30T00:00:00Z')
  })

  it('returns 400 when date_start or date_end is missing', async () => {
    mockSuperAdmin()
    const { GET } = await import('../route')

    const r1 = await GET(
      new Request(
        'http://x/api/admin/observatory/analytics/cost-arc?date_end=2026-04-30T00:00:00Z',
      ),
    )
    expect(r1.status).toBe(400)

    const r2 = await GET(
      new Request(
        'http://x/api/admin/observatory/analytics/cost-arc?date_start=2026-04-01T00:00:00Z',
      ),
    )
    expect(r2.status).toBe(400)

    const r3 = await GET(
      new Request(
        'http://x/api/admin/observatory/analytics/cost-arc' +
          '?date_start=2026-04-30T00:00:00Z&date_end=2026-04-01T00:00:00Z',
      ),
    )
    expect(r3.status).toBe(400)

    expect(queryMock).not.toHaveBeenCalled()
  })

  it('returns 403 when the caller is not a super-admin', async () => {
    mockNonSuperAdmin()
    const { GET } = await import('../route')
    const r = await GET(
      new Request(
        'http://x/api/admin/observatory/analytics/cost-arc' +
          '?date_start=2026-04-01T00:00:00Z&date_end=2026-04-30T00:00:00Z',
      ),
    )
    expect(r.status).toBe(403)
    expect(queryMock).not.toHaveBeenCalled()
  })
})

describe('GET /api/admin/observatory/analytics/cost-arc/[conversationId]', () => {
  it('returns 404 when no events exist for the conversation_id', async () => {
    mockSuperAdmin()
    queryMock.mockResolvedValueOnce({ rows: [] })
    const { GET } = await import('../[conversationId]/route')
    const r = await GET(
      new Request(
        'http://x/api/admin/observatory/analytics/cost-arc/conv-missing',
      ),
      { params: Promise.resolve({ conversationId: 'conv-missing' }) },
    )
    expect(r.status).toBe(404)
  })

  it('returns 200 with the arc payload when events exist', async () => {
    mockSuperAdmin()
    queryMock.mockResolvedValueOnce({
      rows: [
        {
          event_id: 'evt-1',
          conversation_id: 'conv-1',
          conversation_name: 'Demo',
          started_at: '2026-04-01T10:00:00Z',
          pipeline_stage: 'classify',
          provider: 'anthropic',
          model: 'claude-opus-4-6',
          computed_cost_usd: 0.10,
          cumulative_cost_usd: 0.10,
        },
        {
          event_id: 'evt-2',
          conversation_id: 'conv-1',
          conversation_name: 'Demo',
          started_at: '2026-04-01T10:01:00Z',
          pipeline_stage: 'compose',
          provider: 'anthropic',
          model: 'claude-opus-4-6',
          computed_cost_usd: 0.20,
          cumulative_cost_usd: 0.30,
        },
      ],
    })
    const { GET } = await import('../[conversationId]/route')
    const r = await GET(
      new Request('http://x/api/admin/observatory/analytics/cost-arc/conv-1'),
      { params: Promise.resolve({ conversationId: 'conv-1' }) },
    )
    expect(r.status).toBe(200)
    const body = (await r.json()) as {
      conversation_id: string
      turns: Array<{ cumulative_cost_usd: number }>
      total_cost_usd: number
    }
    expect(body.conversation_id).toBe('conv-1')
    expect(body.turns).toHaveLength(2)
    expect(body.turns[1].cumulative_cost_usd).toBeCloseTo(0.30, 6)
    expect(body.total_cost_usd).toBeCloseTo(0.30, 6)
  })
})
