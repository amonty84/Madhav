// @vitest-environment node
//
// Route tests for GET /api/admin/observatory/analytics/cost-per-quality.
// Three cases per the brief: 200 happy path, 400 missing params, 403
// non-super-admin.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'

vi.mock('server-only', () => ({}))

const mockGuard = vi.fn()
vi.mock('../../../_guard', () => ({
  guardObservatoryRoute: () => mockGuard(),
}))

const mockClient = {
  query: vi.fn(),
  release: vi.fn(),
}
const mockPool = { connect: vi.fn(async () => mockClient) }
vi.mock('@/lib/db/client', () => ({
  getPool: vi.fn(async () => mockPool),
}))

beforeEach(() => {
  mockGuard.mockReset()
  mockClient.query.mockReset()
  mockClient.release.mockReset()
  mockPool.connect.mockClear()
})

async function callRoute(url: string) {
  const { GET } = await import('../route')
  return GET(new Request(url))
}

describe('GET /api/admin/observatory/analytics/cost-per-quality', () => {
  it('returns 200 with the analytics payload for valid params', async () => {
    mockGuard.mockResolvedValueOnce({
      user: { uid: 'admin-1' },
      profile: { id: 'admin-1', role: 'super_admin', status: 'active' },
    })
    mockClient.query.mockResolvedValueOnce({
      rows: [
        {
          pipeline_stage: 'synthesize',
          total_events: '12',
          total_cost_usd: 0.42,
          avg_cost_per_event_usd: 0.035,
          total_input_tokens: '1200',
          total_output_tokens: '600',
          avg_latency_ms: 220,
        },
      ],
    })

    const res = await callRoute(
      'http://localhost/api/admin/observatory/analytics/cost-per-quality' +
        '?date_start=2026-04-01T00:00:00Z&date_end=2026-05-01T00:00:00Z',
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.quality_probe_wired).toBe(false)
    expect(body.stages).toHaveLength(1)
    expect(body.stages[0].pipeline_stage).toBe('synthesize')
    expect(body.stages[0].quality_score).toBeNull()
    // bigint serialized as a string by the route's replacer.
    expect(body.stages[0].total_input_tokens).toBe('1200')
    expect(mockClient.release).toHaveBeenCalledTimes(1)
  })

  it('returns 400 when date_start is missing', async () => {
    mockGuard.mockResolvedValueOnce({
      user: { uid: 'admin-1' },
      profile: { id: 'admin-1', role: 'super_admin', status: 'active' },
    })
    const res = await callRoute(
      'http://localhost/api/admin/observatory/analytics/cost-per-quality' +
        '?date_end=2026-05-01T00:00:00Z',
    )
    expect(res.status).toBe(400)
    expect(mockClient.query).not.toHaveBeenCalled()
  })

  it('returns 400 when date_end is missing', async () => {
    mockGuard.mockResolvedValueOnce({
      user: { uid: 'admin-1' },
      profile: { id: 'admin-1', role: 'super_admin', status: 'active' },
    })
    const res = await callRoute(
      'http://localhost/api/admin/observatory/analytics/cost-per-quality' +
        '?date_start=2026-04-01T00:00:00Z',
    )
    expect(res.status).toBe(400)
    expect(mockClient.query).not.toHaveBeenCalled()
  })

  it('returns 400 when date_end <= date_start', async () => {
    mockGuard.mockResolvedValueOnce({
      user: { uid: 'admin-1' },
      profile: { id: 'admin-1', role: 'super_admin', status: 'active' },
    })
    const res = await callRoute(
      'http://localhost/api/admin/observatory/analytics/cost-per-quality' +
        '?date_start=2026-05-01T00:00:00Z&date_end=2026-04-01T00:00:00Z',
    )
    expect(res.status).toBe(400)
    expect(mockClient.query).not.toHaveBeenCalled()
  })

  it('returns 403 when guard rejects (non-super-admin)', async () => {
    mockGuard.mockResolvedValueOnce(
      NextResponse.json({ error: 'forbidden' }, { status: 403 }),
    )
    const res = await callRoute(
      'http://localhost/api/admin/observatory/analytics/cost-per-quality' +
        '?date_start=2026-04-01T00:00:00Z&date_end=2026-05-01T00:00:00Z',
    )
    expect(res.status).toBe(403)
    expect(mockPool.connect).not.toHaveBeenCalled()
  })
})
