// @vitest-environment node
//
// Unit tests for queryCostPerQuality — uses an in-memory mock PoolClient so
// no real database is required. Covers the per-stage rollup, the always-null
// quality_score column, the literal `quality_probe_wired: false`, sort order,
// and the optional provider filter.

import { describe, it, expect, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import {
  queryCostPerQuality,
  type CostPerQualityResult,
} from '../cost_per_quality'

interface MockRow {
  pipeline_stage: string
  total_events: string
  total_cost_usd: number
  avg_cost_per_event_usd: number
  total_input_tokens: string
  total_output_tokens: string
  avg_latency_ms: number
}

function mockClient(rows: MockRow[]) {
  const calls: Array<{ sql: string; params: unknown[] }> = []
  return {
    calls,
    query: vi.fn(async (sql: string, params: unknown[]) => {
      calls.push({ sql, params })
      return { rows }
    }),
  }
}

const FIXTURE: MockRow[] = [
  {
    pipeline_stage: 'synthesize',
    total_events: '40',
    total_cost_usd: 0.5,
    avg_cost_per_event_usd: 0.0125,
    total_input_tokens: '4000',
    total_output_tokens: '2000',
    avg_latency_ms: 250,
  },
  {
    pipeline_stage: 'compose',
    total_events: '30',
    total_cost_usd: 0.3,
    avg_cost_per_event_usd: 0.01,
    total_input_tokens: '3000',
    total_output_tokens: '1500',
    avg_latency_ms: 180,
  },
  {
    pipeline_stage: 'classify',
    total_events: '20',
    total_cost_usd: 0.1,
    avg_cost_per_event_usd: 0.005,
    total_input_tokens: '1000',
    total_output_tokens: '500',
    avg_latency_ms: 90,
  },
]

describe('queryCostPerQuality', () => {
  it('groups events by pipeline_stage and computes per-stage rollups', async () => {
    const db = mockClient(FIXTURE)
    const result = await queryCostPerQuality(db as never, {
      date_start: '2026-04-01T00:00:00Z',
      date_end: '2026-05-01T00:00:00Z',
    })

    expect(result.stages).toHaveLength(3)
    const synth = result.stages.find((s) => s.pipeline_stage === 'synthesize')!
    expect(synth.total_events).toBe(40)
    expect(synth.total_cost_usd).toBeCloseTo(0.5, 6)
    expect(synth.avg_cost_per_event_usd).toBeCloseTo(0.0125, 6)
    expect(synth.total_input_tokens).toBe(BigInt(4000))
    expect(synth.total_output_tokens).toBe(BigInt(2000))
    expect(synth.avg_latency_ms).toBe(250)

    expect(result.totals.total_events).toBe(90)
    expect(result.totals.total_cost_usd).toBeCloseTo(0.9, 6)

    // SQL contains GROUP BY pipeline_stage.
    expect(db.calls[0].sql).toContain('GROUP BY pipeline_stage')
    // Date params bound, not interpolated.
    expect(db.calls[0].params).toEqual([
      '2026-04-01T00:00:00Z',
      '2026-05-01T00:00:00Z',
    ])
  })

  it('quality_probe_wired is always the literal false', async () => {
    const db = mockClient(FIXTURE)
    const result: CostPerQualityResult = await queryCostPerQuality(db as never, {
      date_start: '2026-04-01T00:00:00Z',
      date_end: '2026-05-01T00:00:00Z',
    })
    expect(result.quality_probe_wired).toBe(false)

    // Type-level: `quality_probe_wired` is the literal false in the type;
    // a runtime "true" would still pass `=== false` if the value were `true`,
    // so we additionally narrow:
    const flag: false = result.quality_probe_wired
    expect(flag).toBe(false)
  })

  it('quality_score is null for every stage', async () => {
    const db = mockClient(FIXTURE)
    const result = await queryCostPerQuality(db as never, {
      date_start: '2026-04-01T00:00:00Z',
      date_end: '2026-05-01T00:00:00Z',
    })
    for (const s of result.stages) {
      expect(s.quality_score).toBeNull()
    }
  })

  it('sorts stages by total_cost_usd DESC (handled by SQL ORDER BY)', async () => {
    const db = mockClient(FIXTURE)
    const result = await queryCostPerQuality(db as never, {
      date_start: '2026-04-01T00:00:00Z',
      date_end: '2026-05-01T00:00:00Z',
    })
    // SQL emits ORDER BY total_cost_usd DESC; our fixture is already in that
    // order. Assert the SQL string carries the right clause and the result
    // preserves the SQL's order verbatim (no JS re-sort).
    expect(db.calls[0].sql).toMatch(/ORDER BY\s+total_cost_usd\s+DESC/i)
    expect(result.stages.map((s) => s.pipeline_stage)).toEqual([
      'synthesize',
      'compose',
      'classify',
    ])
  })

  it('returns empty stages and zeroed totals when DB returns no rows', async () => {
    const db = mockClient([])
    const result = await queryCostPerQuality(db as never, {
      date_start: '2026-04-01T00:00:00Z',
      date_end: '2026-05-01T00:00:00Z',
    })
    expect(result.stages).toEqual([])
    expect(result.totals).toEqual({ total_cost_usd: 0, total_events: 0 })
    expect(result.quality_probe_wired).toBe(false)
  })

  it('appends provider filter as a bound $3 parameter when supplied', async () => {
    const db = mockClient(FIXTURE)
    await queryCostPerQuality(db as never, {
      date_start: '2026-04-01T00:00:00Z',
      date_end: '2026-05-01T00:00:00Z',
      provider: 'anthropic',
    })
    expect(db.calls[0].sql).toContain('provider = $3')
    expect(db.calls[0].params).toEqual([
      '2026-04-01T00:00:00Z',
      '2026-05-01T00:00:00Z',
      'anthropic',
    ])
  })

  it('omits provider clause + $3 param when provider is undefined', async () => {
    const db = mockClient(FIXTURE)
    await queryCostPerQuality(db as never, {
      date_start: '2026-04-01T00:00:00Z',
      date_end: '2026-05-01T00:00:00Z',
    })
    expect(db.calls[0].sql).not.toContain('provider = $3')
    expect(db.calls[0].params).toHaveLength(2)
  })
})
