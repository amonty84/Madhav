// @vitest-environment node
//
// Phase O — O.3 Export — backend tests (USTAD_S3_4_EXPORT_O3_CLOSE).
//
// 6 tests:
//   1. date range > 90 days → 400 range_too_wide
//   2. invalid format → 400 invalid_format
//   3. limit capped at 50 000 even if 99 999 passed
//   4. CSV: header row present; values containing commas are quoted
//   5. JSON: export_meta.row_count matches rows array length
//   6. provider filter passed to query (mock queryUsageForExport asserts param)

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'

vi.mock('server-only', () => ({}))

const queryMock = vi.fn()
vi.mock('@/lib/db/client', () => ({
  query: (...args: unknown[]) => queryMock(...args),
}))

import { toCSV, toJSON } from '@/lib/observatory/export/format'
import { queryUsageForExport } from '@/lib/observatory/export/query'
import {
  EXPORT_MAX_LIMIT,
  type ExportMeta,
  type ExportRow,
} from '@/lib/observatory/export/types'

function row(overrides: Partial<ExportRow> = {}): ExportRow {
  return {
    event_id: 'evt-1',
    provider: 'anthropic',
    model: 'claude-sonnet-4-6',
    pipeline_stage: 'classify',
    conversation_id: 'conv-1',
    user_id: 'user-1',
    input_tokens: 100,
    output_tokens: 50,
    cache_read_tokens: 0,
    cache_write_tokens: 0,
    reasoning_tokens: 0,
    computed_cost_usd: 0.001234,
    pricing_version_id: 'pv-1',
    status: 'success',
    latency_ms: 250,
    started_at: '2026-05-01T10:00:00Z',
    ...overrides,
  }
}

function makeRequest(qs: string): Request {
  return new Request(`http://x/api/admin/observatory/export?${qs}`, {
    method: 'GET',
  })
}

async function loadRoute() {
  vi.resetModules()
  process.env.MARSYS_FLAG_OBSERVATORY_ENABLED = 'true'
  vi.doMock('@/lib/auth/access-control', () => ({
    requireSuperAdmin: async () => ({
      user: { uid: 'admin-1' },
      profile: { id: 'admin-1', role: 'super_admin', status: 'active' },
    }),
  }))
  return await import('@/app/api/admin/observatory/export/route')
}

describe('Export route — validation', () => {
  beforeEach(() => {
    queryMock.mockReset()
  })

  it('1. date range > 90 days → 400 range_too_wide', async () => {
    const { GET } = await loadRoute()
    // 2026-01-01 to 2026-05-01 = 121 days, well past the 90-day cap.
    const response = await GET(
      makeRequest('format=csv&date_start=2026-01-01&date_end=2026-05-01'),
    )
    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.error).toBe('range_too_wide')
    expect(body.max_days).toBe(90)
    expect(body.requested_days).toBe(121)
    // Validation rejects before the DB is touched.
    expect(queryMock).not.toHaveBeenCalled()
  })

  it('2. invalid format → 400 invalid_format', async () => {
    const { GET } = await loadRoute()
    const response = await GET(
      makeRequest('format=xml&date_start=2026-04-01&date_end=2026-04-30'),
    )
    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.error).toBe('invalid_format')
    expect(body.allowed).toEqual(['csv', 'json'])
    expect(queryMock).not.toHaveBeenCalled()
  })

  it('3. limit capped at 50 000 even when 99 999 passed', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] })
    const { GET } = await loadRoute()
    const response = await GET(
      makeRequest(
        'format=json&date_start=2026-04-01&date_end=2026-04-02&limit=99999',
      ),
    )
    expect(response.status).toBe(200)
    expect(queryMock).toHaveBeenCalledTimes(1)
    const args = queryMock.mock.calls[0][1] as unknown[]
    // Last bound parameter is the LIMIT value; must be capped.
    expect(args[args.length - 1]).toBe(EXPORT_MAX_LIMIT)
  })

  it('6. provider filter is passed to the query', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] })
    const { GET } = await loadRoute()
    const response = await GET(
      makeRequest(
        'format=json&date_start=2026-04-01&date_end=2026-04-02&provider=anthropic',
      ),
    )
    expect(response.status).toBe(200)
    expect(queryMock).toHaveBeenCalledTimes(1)
    const sql = String(queryMock.mock.calls[0][0])
    const args = queryMock.mock.calls[0][1] as unknown[]
    expect(sql).toMatch(/provider\s*=\s*\$3/)
    expect(args).toContain('anthropic')
  })
})

describe('Export formatters', () => {
  it('4. toCSV — header row matches columns; commas are quoted', () => {
    const csv = toCSV([
      row({
        // Conversation name with a comma must be quoted; conversation_id
        // is a clean uuid-style string but use a synthesized comma-bearing
        // user_id to exercise quoting.
        user_id: 'user, with comma',
        model: 'claude-sonnet-4-6',
      }),
    ])
    const lines = csv.trim().split('\n')
    expect(lines[0]).toMatch(/^event_id,provider,model,/)
    // The user_id cell with a comma is wrapped in double quotes.
    expect(lines[1]).toMatch(/"user, with comma"/)
    // Plain values stay unquoted.
    expect(lines[1]).toMatch(/anthropic,claude-sonnet-4-6/)
  })

  it('5. toJSON — export_meta.row_count matches rows.length', () => {
    const rows = [row(), row({ event_id: 'evt-2' }), row({ event_id: 'evt-3' })]
    const meta: ExportMeta = {
      row_count: rows.length,
      date_start: '2026-04-01',
      date_end: '2026-04-30',
      generated_at: '2026-05-03T10:00:00Z',
      format: 'json',
      provider: null,
      pipeline_stage: null,
    }
    const out = JSON.parse(toJSON(rows, meta))
    expect(out.export_meta.row_count).toBe(3)
    expect(Array.isArray(out.rows)).toBe(true)
    expect(out.rows).toHaveLength(3)
  })
})

describe('queryUsageForExport — server-side limit cap', () => {
  it('caps explicit limit > EXPORT_MAX_LIMIT to EXPORT_MAX_LIMIT', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] })
    await queryUsageForExport({
      format: 'json',
      date_start: '2026-04-01',
      date_end: '2026-04-02',
      limit: 99_999,
    })
    const args = queryMock.mock.calls[0][1] as unknown[]
    expect(args[args.length - 1]).toBe(EXPORT_MAX_LIMIT)
  })
})

// Sanity check: NextResponse-shaped 400s above are real NextResponses, not
// raw Response polyfills — guards the route handler against the
// "missed-import" failure mode.
describe('Export route — sanity', () => {
  it('returns NextResponse instances on validation failure', async () => {
    const { GET } = await loadRoute()
    const response = await GET(
      makeRequest('format=csv&date_start=2026-01-01&date_end=2026-05-01'),
    )
    expect(response).toBeInstanceOf(NextResponse)
  })
})
