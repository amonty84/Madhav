// Tests — computeCost.
// Cases (per USTAD_S1_2 brief acceptance list 1–3):
//   1. Correct sum across all 5 token classes with mocked pricing rows.
//   2. Pricing version boundary selection — event before effective_to uses
//      that row; event after falls to next row.
//   3. Throws PricingNotFoundError when no pricing row found.

import { describe, it, expect, vi } from 'vitest'

import {
  computeCost,
  PricingNotFoundError,
} from '../observability/cost'
import type { ObservatoryDb, TokenUsage } from '../observability/types'

interface PricingRowFixture {
  pricing_version_id: string
  token_class: 'input' | 'output' | 'cache_read' | 'cache_write' | 'reasoning'
  price_per_million_usd: number
  effective_from: string
  effective_to: string | null
}

function makeDbFromFixture(rows: PricingRowFixture[]): ObservatoryDb {
  const query = vi.fn(async (_sql: string, params?: unknown[]) => {
    const at = new Date(String(params?.[2]))
    const filtered = rows.filter(r => {
      const fromOk = new Date(r.effective_from).getTime() <= at.getTime()
      const toOk =
        r.effective_to === null ||
        new Date(r.effective_to).getTime() > at.getTime()
      return fromOk && toOk
    })
    return {
      rows: filtered.map(r => ({
        pricing_version_id: r.pricing_version_id,
        token_class: r.token_class,
        price_per_million_usd: r.price_per_million_usd,
      })),
      rowCount: filtered.length,
    }
  })
  return { query } as unknown as ObservatoryDb
}

const ANTHROPIC_V1: PricingRowFixture[] = [
  {
    pricing_version_id: 'pv-input-v1',
    token_class: 'input',
    price_per_million_usd: 3.0,
    effective_from: '2026-01-01T00:00:00Z',
    effective_to: '2026-06-01T00:00:00Z',
  },
  {
    pricing_version_id: 'pv-output-v1',
    token_class: 'output',
    price_per_million_usd: 15.0,
    effective_from: '2026-01-01T00:00:00Z',
    effective_to: '2026-06-01T00:00:00Z',
  },
  {
    pricing_version_id: 'pv-cache-read-v1',
    token_class: 'cache_read',
    price_per_million_usd: 0.3,
    effective_from: '2026-01-01T00:00:00Z',
    effective_to: '2026-06-01T00:00:00Z',
  },
  {
    pricing_version_id: 'pv-cache-write-v1',
    token_class: 'cache_write',
    price_per_million_usd: 3.75,
    effective_from: '2026-01-01T00:00:00Z',
    effective_to: '2026-06-01T00:00:00Z',
  },
  {
    pricing_version_id: 'pv-reasoning-v1',
    token_class: 'reasoning',
    price_per_million_usd: 60.0,
    effective_from: '2026-01-01T00:00:00Z',
    effective_to: '2026-06-01T00:00:00Z',
  },
]

const ANTHROPIC_V2: PricingRowFixture[] = [
  {
    pricing_version_id: 'pv-input-v2',
    token_class: 'input',
    price_per_million_usd: 4.0,
    effective_from: '2026-06-01T00:00:00Z',
    effective_to: null,
  },
  {
    pricing_version_id: 'pv-output-v2',
    token_class: 'output',
    price_per_million_usd: 20.0,
    effective_from: '2026-06-01T00:00:00Z',
    effective_to: null,
  },
]

const FULL_USAGE: TokenUsage = {
  input_tokens: 1_000_000,
  output_tokens: 500_000,
  cache_read_tokens: 2_000_000,
  cache_write_tokens: 100_000,
  reasoning_tokens: 50_000,
}

describe('computeCost', () => {
  it('sums correctly across all five token classes', async () => {
    const db = makeDbFromFixture(ANTHROPIC_V1)
    const at = new Date('2026-03-15T00:00:00Z')

    const result = await computeCost(
      'anthropic',
      'claude-opus-4-6',
      FULL_USAGE,
      at,
      db,
    )

    // Expected: 1.0*3 + 0.5*15 + 2.0*0.3 + 0.1*3.75 + 0.05*60
    //        = 3 + 7.5 + 0.6 + 0.375 + 3 = 14.475
    expect(result.computed_cost_usd).toBeCloseTo(14.475, 6)
    expect(result.pricing_version_id).toBe('pv-input-v1')
  })

  it('selects the correct pricing version across an effective_to boundary', async () => {
    const db = makeDbFromFixture([...ANTHROPIC_V1, ...ANTHROPIC_V2])

    // Just before the boundary — uses v1.
    const before = await computeCost(
      'anthropic',
      'claude-opus-4-6',
      { ...FULL_USAGE, cache_read_tokens: 0, cache_write_tokens: 0, reasoning_tokens: 0 },
      new Date('2026-05-31T23:59:59Z'),
      db,
    )
    // 1.0*3 + 0.5*15 = 10.5
    expect(before.computed_cost_usd).toBeCloseTo(10.5, 6)
    expect(before.pricing_version_id).toBe('pv-input-v1')

    // At/after the boundary — uses v2 (effective_to is exclusive on the upper side).
    const after = await computeCost(
      'anthropic',
      'claude-opus-4-6',
      { ...FULL_USAGE, cache_read_tokens: 0, cache_write_tokens: 0, reasoning_tokens: 0 },
      new Date('2026-06-02T00:00:00Z'),
      db,
    )
    // 1.0*4 + 0.5*20 = 14
    expect(after.computed_cost_usd).toBeCloseTo(14.0, 6)
    expect(after.pricing_version_id).toBe('pv-input-v2')
  })

  it('throws PricingNotFoundError when no pricing row matches', async () => {
    const db = makeDbFromFixture([])

    await expect(
      computeCost(
        'anthropic',
        'claude-opus-4-6',
        FULL_USAGE,
        new Date('2026-03-15T00:00:00Z'),
        db,
      ),
    ).rejects.toBeInstanceOf(PricingNotFoundError)
  })
})
