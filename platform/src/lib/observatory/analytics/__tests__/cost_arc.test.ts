// @vitest-environment node
//
// Phase O — O.4 — Conversation Cost Arc unit tests.
//
// All tests inject a stub QueryFn so they don't depend on a real database.
// The SQL strings are inspected to enforce the brief's contract:
//   - GROUP BY conversation_id + ORDER BY total_cost_usd DESC for the list.
//   - SUM(...) OVER (PARTITION BY conversation_id ORDER BY started_at ...)
//     for the per-event running cumulative.
// And the JS post-processing is verified against representative rows.
//
// Authored by USTAD_S4_3_COST_ARC.

import { describe, it, expect, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import {
  queryConversationArc,
  queryTopConversations,
  TOP_CONVERSATIONS_DEFAULT_LIMIT,
  TOP_CONVERSATIONS_MAX_LIMIT,
  type QueryFn,
} from '../cost_arc'

// ---------------------------------------------------------------------------
// queryTopConversations
// ---------------------------------------------------------------------------

describe('queryTopConversations', () => {
  it('groups by conversation_id and sorts by total_cost_usd DESC', async () => {
    const captured: { sql: string; params: unknown[] } = { sql: '', params: [] }
    const stub = vi.fn(async (sql, params) => {
      captured.sql = sql
      captured.params = params ?? []
      return {
        rows: [
          {
            conversation_id: 'conv-A',
            conversation_name: 'Alpha',
            total_cost_usd: 0.95,
            event_count: '12',
            turn_count: '6',
            first_event_at: '2026-04-01T10:00:00Z',
            last_event_at: '2026-04-01T11:30:00Z',
            providers: ['anthropic', 'openai'],
          },
          {
            conversation_id: 'conv-B',
            conversation_name: 'Beta',
            total_cost_usd: 0.40,
            event_count: '8',
            turn_count: '4',
            first_event_at: '2026-04-02T09:00:00Z',
            last_event_at: '2026-04-02T09:45:00Z',
            providers: ['gemini'],
          },
        ],
      }
    })

    const out = await queryTopConversations(stub as unknown as QueryFn, {
      date_start: '2026-04-01T00:00:00Z',
      date_end: '2026-04-30T00:00:00Z',
    })

    // Contract: groups by conversation_id and orders by total_cost_usd DESC.
    expect(captured.sql).toMatch(/GROUP BY conversation_id/i)
    expect(captured.sql).toMatch(/ORDER BY total_cost_usd DESC/i)
    // Date-range predicate + LIMIT bound as $1, $2, $3.
    expect(captured.params[0]).toBe('2026-04-01T00:00:00Z')
    expect(captured.params[1]).toBe('2026-04-30T00:00:00Z')
    expect(captured.params[2]).toBe(TOP_CONVERSATIONS_DEFAULT_LIMIT)

    // Result mapping: numeric coercion + avg_cost_per_event_usd derivation.
    expect(out).toHaveLength(2)
    expect(out[0].conversation_id).toBe('conv-A')
    expect(out[0].total_cost_usd).toBeCloseTo(0.95, 6)
    expect(out[0].event_count).toBe(12)
    expect(out[0].turn_count).toBe(6)
    expect(out[0].avg_cost_per_event_usd).toBeCloseTo(0.95 / 12, 6)
    expect(out[0].providers).toEqual(['anthropic', 'openai'])

    expect(out[1].conversation_id).toBe('conv-B')
    expect(out[1].avg_cost_per_event_usd).toBeCloseTo(0.40 / 8, 6)
  })

  it('clamps limit to [1, MAX] and falls back to default when omitted', async () => {
    let lastLimit: unknown = null
    const stub = vi.fn(async (_sql, params) => {
      lastLimit = (params ?? [])[2]
      return { rows: [] }
    })

    await queryTopConversations(stub as unknown as QueryFn, {
      date_start: '2026-04-01T00:00:00Z',
      date_end: '2026-04-30T00:00:00Z',
    })
    expect(lastLimit).toBe(TOP_CONVERSATIONS_DEFAULT_LIMIT)

    await queryTopConversations(stub as unknown as QueryFn, {
      date_start: '2026-04-01T00:00:00Z',
      date_end: '2026-04-30T00:00:00Z',
      limit: 5_000,
    })
    expect(lastLimit).toBe(TOP_CONVERSATIONS_MAX_LIMIT)

    await queryTopConversations(stub as unknown as QueryFn, {
      date_start: '2026-04-01T00:00:00Z',
      date_end: '2026-04-30T00:00:00Z',
      limit: 0,
    })
    expect(lastLimit).toBe(1)
  })

  it('uses conversation_id as the display name when conversation_name is null', async () => {
    const stub = vi.fn(async () => ({
      rows: [
        {
          conversation_id: 'conv-X',
          conversation_name: null,
          total_cost_usd: 0.10,
          event_count: '2',
          turn_count: '1',
          first_event_at: '2026-04-01T10:00:00Z',
          last_event_at: '2026-04-01T10:05:00Z',
          providers: null,
        },
      ],
    }))
    const out = await queryTopConversations(stub as unknown as QueryFn, {
      date_start: '2026-04-01T00:00:00Z',
      date_end: '2026-04-30T00:00:00Z',
    })
    expect(out[0].conversation_name).toBe('conv-X')
    expect(out[0].providers).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// queryConversationArc
// ---------------------------------------------------------------------------

describe('queryConversationArc', () => {
  it('returns events in chronological order with correct cumulative sums', async () => {
    const captured: { sql: string; params: unknown[] } = { sql: '', params: [] }
    // Three events with costs 0.10, 0.20, 0.05 → cumulative [0.10, 0.30, 0.35].
    // The simulated DB has already applied the window function.
    const stub = vi.fn(async (sql, params) => {
      captured.sql = sql
      captured.params = params ?? []
      return {
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
          {
            event_id: 'evt-3',
            conversation_id: 'conv-1',
            conversation_name: 'Demo',
            started_at: '2026-04-01T10:02:00Z',
            pipeline_stage: 'synthesize',
            provider: 'openai',
            model: 'gpt-4.1',
            computed_cost_usd: 0.05,
            cumulative_cost_usd: 0.35,
          },
        ],
      }
    })

    const out = await queryConversationArc(stub as unknown as QueryFn,'conv-1')

    // SQL contract: window function with PARTITION BY conversation_id +
    // ORDER BY started_at ASC, between unbounded preceding and current row.
    expect(captured.sql).toMatch(/SUM\(computed_cost_usd\)\s*OVER\s*\(/i)
    expect(captured.sql).toMatch(/PARTITION BY conversation_id/i)
    expect(captured.sql).toMatch(/ORDER BY started_at ASC/i)
    expect(captured.sql).toMatch(
      /ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW/i,
    )
    expect(captured.params[0]).toBe('conv-1')

    expect(out).not.toBeNull()
    if (!out) throw new Error('expected non-null arc')
    expect(out.conversation_id).toBe('conv-1')
    expect(out.conversation_name).toBe('Demo')
    expect(out.turns).toHaveLength(3)

    const cumulatives = out.turns.map(t => t.cumulative_cost_usd)
    expect(cumulatives[0]).toBeCloseTo(0.10, 6)
    expect(cumulatives[1]).toBeCloseTo(0.30, 6)
    expect(cumulatives[2]).toBeCloseTo(0.35, 6)

    // Total comes from the last row's cumulative.
    expect(out.total_cost_usd).toBeCloseTo(0.35, 6)

    // Per-event fields preserved from the source rows.
    expect(out.turns[0].pipeline_stage).toBe('classify')
    expect(out.turns[2].provider).toBe('openai')
  })

  it('returns null when the conversation has no events', async () => {
    const stub = vi.fn(async () => ({ rows: [] }))
    const out = await queryConversationArc(stub as unknown as QueryFn,'conv-missing')
    expect(out).toBeNull()
  })

  it('coerces string-encoded numerics from the driver into numbers', async () => {
    // Some pg drivers return numeric/float8 as strings under certain configs.
    // The mapper must coerce them so consumers can do arithmetic.
    const stub = vi.fn(async () => ({
      rows: [
        {
          event_id: 'evt-1',
          conversation_id: 'conv-1',
          conversation_name: 'Demo',
          started_at: '2026-04-01T10:00:00Z',
          pipeline_stage: 'classify',
          provider: 'anthropic',
          model: 'claude-opus-4-6',
          computed_cost_usd: '0.10',
          cumulative_cost_usd: '0.10',
        },
      ],
    }))
    const out = await queryConversationArc(stub as unknown as QueryFn,'conv-1')
    if (!out) throw new Error('expected non-null arc')
    expect(typeof out.turns[0].computed_cost_usd).toBe('number')
    expect(typeof out.turns[0].cumulative_cost_usd).toBe('number')
    expect(out.turns[0].computed_cost_usd).toBeCloseTo(0.10, 6)
  })
})
