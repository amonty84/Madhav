// @vitest-environment node
//
// Phase O.4 — queryCacheEffectiveness unit tests (USTAD_S4_1).
// Stubs the `Queryable.query` interface — no real DB needed.

import { describe, it, expect, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import {
  queryCacheEffectiveness,
  toJson,
  type Queryable,
} from '../cache_effectiveness'

interface Row {
  provider: string
  total_events: string
  input_tokens: string
  cache_read_tokens: string
  cache_write_tokens: string
  output_tokens: string
  actual_cost_usd: number
  cost_saved_usd: number
}

function fakeDb(rows: Row[]): Queryable {
  return {
    // The signature of pg's query() is overloaded; for our test we accept any
    // and return the rows we want.
    query: vi.fn(async () => ({ rows })) as unknown as Queryable['query'],
  }
}

const PARAMS = { date_start: '2026-04-01T00:00:00Z', date_end: '2026-05-01T00:00:00Z' }

describe('queryCacheEffectiveness', () => {
  it('computes cache_hit_ratio correctly when cache_read_tokens are present', async () => {
    const db = fakeDb([
      {
        provider: 'anthropic',
        total_events: '10',
        input_tokens: '700',
        cache_read_tokens: '200',
        cache_write_tokens: '100',
        output_tokens: '500',
        actual_cost_usd: 0.5,
        cost_saved_usd: 0.4,
      },
    ])
    const r = await queryCacheEffectiveness(db, PARAMS)
    const a = r.providers[0]
    // 200 / (700 + 200 + 100) = 0.2
    expect(a.cache_hit_ratio).toBeCloseTo(0.2, 6)
    expect(a.input_tokens).toBe(BigInt(700))
    expect(a.cache_read_tokens).toBe(BigInt(200))
  })

  it('returns 0 hit ratio when all token columns are zero', async () => {
    const db = fakeDb([
      {
        provider: 'openai',
        total_events: '3',
        input_tokens: '0',
        cache_read_tokens: '0',
        cache_write_tokens: '0',
        output_tokens: '0',
        actual_cost_usd: 0,
        cost_saved_usd: 0,
      },
    ])
    const r = await queryCacheEffectiveness(db, PARAMS)
    expect(r.providers[0].cache_hit_ratio).toBe(0)
    expect(r.providers[0].cost_saved_pct).toBe(0)
  })

  it('keeps cost_saved_usd at 0 when no cache_read pricing row is joined', async () => {
    // SQL would emit cost_saved_usd = 0 in this scenario; the function should
    // surface that value verbatim and clamp at 0 (no negative savings).
    const db = fakeDb([
      {
        provider: 'gemini',
        total_events: '4',
        input_tokens: '1000',
        cache_read_tokens: '300',
        cache_write_tokens: '0',
        output_tokens: '500',
        actual_cost_usd: 0.25,
        cost_saved_usd: 0, // ← no pricing row → SQL CASE returns 0
      },
    ])
    const r = await queryCacheEffectiveness(db, PARAMS)
    expect(r.providers[0].cost_saved_usd).toBe(0)
    expect(r.providers[0].cost_without_cache_usd).toBeCloseTo(0.25, 6)
    expect(r.providers[0].cost_saved_pct).toBe(0)
  })

  it('cost_without_cache_usd = actual_cost_usd + cost_saved_usd', async () => {
    const db = fakeDb([
      {
        provider: 'anthropic',
        total_events: '7',
        input_tokens: '500',
        cache_read_tokens: '100',
        cache_write_tokens: '50',
        output_tokens: '300',
        actual_cost_usd: 1.23,
        cost_saved_usd: 0.45,
      },
    ])
    const r = await queryCacheEffectiveness(db, PARAMS)
    const a = r.providers[0]
    expect(a.cost_without_cache_usd).toBeCloseTo(1.23 + 0.45, 6)
    expect(a.cost_saved_pct).toBeCloseTo(0.45 / (1.23 + 0.45), 6)
  })

  it('totals row aggregates token sums and dollars across providers', async () => {
    const db = fakeDb([
      {
        provider: 'anthropic',
        total_events: '5',
        input_tokens: '1000',
        cache_read_tokens: '400',
        cache_write_tokens: '100',
        output_tokens: '500',
        actual_cost_usd: 1.0,
        cost_saved_usd: 0.6,
      },
      {
        provider: 'openai',
        total_events: '8',
        input_tokens: '2000',
        cache_read_tokens: '600',
        cache_write_tokens: '0',
        output_tokens: '1000',
        actual_cost_usd: 2.5,
        cost_saved_usd: 0.0,
      },
    ])
    const r = await queryCacheEffectiveness(db, PARAMS)
    expect(r.providers).toHaveLength(2)
    expect(r.totals.total_events).toBe(13)
    expect(r.totals.input_tokens).toBe(BigInt(3000))
    expect(r.totals.cache_read_tokens).toBe(BigInt(1000))
    expect(r.totals.cache_write_tokens).toBe(BigInt(100))
    expect(r.totals.output_tokens).toBe(BigInt(1500))
    expect(r.totals.actual_cost_usd).toBeCloseTo(3.5, 6)
    expect(r.totals.cost_saved_usd).toBeCloseTo(0.6, 6)
    // overall hit ratio: 1000 / (3000 + 1000 + 100) = ~0.2439
    expect(r.totals.cache_hit_ratio).toBeCloseTo(1000 / 4100, 6)
  })

  it('passes provider filter through to SQL parameters', async () => {
    const queryFn = vi.fn(async () => ({ rows: [] }))
    const db = { query: queryFn as unknown as Queryable['query'] }
    await queryCacheEffectiveness(db, { ...PARAMS, provider: 'anthropic' })
    expect(queryFn).toHaveBeenCalledOnce()
    const args = queryFn.mock.calls[0] as unknown as unknown[]
    expect(args[1]).toEqual([PARAMS.date_start, PARAMS.date_end, 'anthropic'])
  })

  it('passes null provider when none supplied so SQL OR-clause matches all', async () => {
    const queryFn = vi.fn(async () => ({ rows: [] }))
    const db = { query: queryFn as unknown as Queryable['query'] }
    await queryCacheEffectiveness(db, PARAMS)
    const args = queryFn.mock.calls[0] as unknown as unknown[]
    expect(args[1]).toEqual([PARAMS.date_start, PARAMS.date_end, null])
  })

  it('toJson serializes bigint token fields as decimal strings', async () => {
    const db = fakeDb([
      {
        provider: 'anthropic',
        total_events: '2',
        input_tokens: '12345678901234',
        cache_read_tokens: '9999',
        cache_write_tokens: '1',
        output_tokens: '0',
        actual_cost_usd: 0.1,
        cost_saved_usd: 0.05,
      },
    ])
    const r = await queryCacheEffectiveness(db, PARAMS)
    const j = toJson(r)
    expect(j.providers[0].input_tokens).toBe('12345678901234')
    expect(j.providers[0].cache_read_tokens).toBe('9999')
    // The JSON shape must round-trip safely through JSON.stringify.
    expect(() => JSON.stringify(j)).not.toThrow()
  })
})
