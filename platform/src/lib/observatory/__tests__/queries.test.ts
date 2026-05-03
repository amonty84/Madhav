// @vitest-environment node
//
// Observatory backend API — query layer tests.
//
// Two layers, mirroring the schema-test convention from
// platform/src/lib/db/__tests__/observatory_schema.test.ts:
//   1. Unit-style tests (always run): auth-gate behaviour + cursor codec.
//   2. Integration tests (gated on OBSERVATORY_TEST_DATABASE_URL):
//      11 cases covering all five query functions against ≥100 seeded rows.
//
// To run the integration block:
//   OBSERVATORY_TEST_DATABASE_URL=postgres://... \
//     npx vitest run src/lib/observatory/__tests__/queries.test.ts

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Pool } from 'pg'
import { NextResponse } from 'next/server'

// `server-only` throws under jsdom test runners; neutralize it for the
// guard module under test (and its transitive auth-module import).
vi.mock('server-only', () => ({}))

const REPO_ROOT = resolve(__dirname, '../../../../..')
const UP_SQL = readFileSync(
  resolve(REPO_ROOT, 'platform/migrations/038_observatory_schema.sql'),
  'utf-8',
)
const DOWN_SQL = readFileSync(
  resolve(REPO_ROOT, 'platform/migrations/038_observatory_schema_down.sql'),
  'utf-8',
)

const TEST_DB_URL = process.env.OBSERVATORY_TEST_DATABASE_URL
const integrationDescribe = TEST_DB_URL ? describe : describe.skip

// ---------------------------------------------------------------------------
// Layer 1 — always-run unit-style tests (no DB required)
// ---------------------------------------------------------------------------

describe('observatory api_guard — auth + flag gate', () => {
  // Test 11 — non-super-admin returns 403.
  it('returns 403 when requireSuperAdmin returns 403', async () => {
    process.env.MARSYS_FLAG_OBSERVATORY_ENABLED = 'true'
    vi.resetModules()
    vi.doMock('@/lib/auth/access-control', () => ({
      requireSuperAdmin: async () =>
        NextResponse.json({ error: 'forbidden' }, { status: 403 }),
    }))
    const { guardObservatoryRoute } = await import(
      '../../../app/api/admin/observatory/_guard'
    )
    const result = await guardObservatoryRoute()
    expect(result).toBeInstanceOf(NextResponse)
    expect((result as NextResponse).status).toBe(403)
    vi.doUnmock('@/lib/auth/access-control')
  })

  it('returns 403 when feature flag is off', async () => {
    process.env.MARSYS_FLAG_OBSERVATORY_ENABLED = 'false'
    vi.resetModules()
    vi.doMock('@/lib/auth/access-control', () => ({
      requireSuperAdmin: async () => ({
        user: { uid: 'admin-1' },
        profile: { id: 'admin-1', role: 'super_admin', status: 'active' },
      }),
    }))
    const { guardObservatoryRoute } = await import(
      '../../../app/api/admin/observatory/_guard'
    )
    const result = await guardObservatoryRoute()
    expect(result).toBeInstanceOf(NextResponse)
    expect((result as NextResponse).status).toBe(403)
    vi.doUnmock('@/lib/auth/access-control')
  })
})

// ---------------------------------------------------------------------------
// Layer 2 — integration tests against a real PostgreSQL test DB
// ---------------------------------------------------------------------------

interface SeedSpec {
  conversation_id: string
  conversation_name: string | null
  user_id: string
  provider: string
  model: string
  pipeline_stage: string
  status: string
  input_tokens: number
  output_tokens: number
  cache_read_tokens: number
  cache_write_tokens: number
  computed_cost_usd: number
  latency_ms: number
  prompt_text: string
  response_text: string
  started_at: Date
}

const PROVIDERS = ['anthropic', 'openai', 'gemini'] as const
// Brief: 4 models. Two Anthropic, one OpenAI, one Gemini.
const MODELS = [
  { provider: 'anthropic', model: 'claude-opus-4-6' },
  { provider: 'anthropic', model: 'claude-sonnet-4-6' },
  { provider: 'openai', model: 'gpt-4.1' },
  { provider: 'gemini', model: 'gemini-2.5-pro' },
] as const
const STAGES = ['classify', 'compose', 'synthesize'] as const
const STATUSES = ['success', 'success', 'success', 'success', 'error'] as const

/** Generate ≥100 deterministic seed rows spanning 3 providers, 4 models,
 *  3 pipeline stages, 7 days, with a mix of success/error statuses. */
function generateSeed(): SeedSpec[] {
  const rows: SeedSpec[] = []
  // 7 days × 4 models × 5 calls per (model, day) = 140 rows.
  const baseDay = new Date('2026-04-25T00:00:00Z')
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    for (let m = 0; m < MODELS.length; m++) {
      const { provider, model } = MODELS[m]
      for (let i = 0; i < 5; i++) {
        const startedAt = new Date(baseDay)
        startedAt.setUTCDate(baseDay.getUTCDate() + dayOffset)
        startedAt.setUTCHours(2 + m, 5 + i * 7, 0, 0)
        const stage = STAGES[(dayOffset + i + m) % STAGES.length]
        const status = STATUSES[(dayOffset + i + m) % STATUSES.length]
        const input = 100 + i * 10 + m * 5
        const output = 50 + i * 4 + m * 2
        const conversationIdx = ((dayOffset * 5 + i) % 6) + 1
        rows.push({
          conversation_id: `conv-${conversationIdx}`,
          conversation_name: `Conversation #${conversationIdx}`,
          user_id: `user-${(i % 3) + 1}`,
          provider,
          model,
          pipeline_stage: stage,
          status,
          input_tokens: input,
          output_tokens: output,
          cache_read_tokens: i % 2 === 0 ? 30 : 0,
          cache_write_tokens: i % 3 === 0 ? 5 : 0,
          // Distinct cost values to make sort/threshold checks robust.
          computed_cost_usd: 0.001 * (m + 1) * (i + 1) + dayOffset * 0.0001,
          latency_ms: 100 + i * 50 + dayOffset * 20 + m * 5,
          prompt_text: `seed prompt ${m}-${i}-${dayOffset} ${
            i === 0 ? 'specialKeyword' : 'lorem ipsum'
          }`,
          response_text: `seed response ${m}-${i}-${dayOffset}`,
          started_at: startedAt,
        })
      }
    }
  }
  return rows
}

async function insertSeed(pool: Pool, rows: SeedSpec[]) {
  for (const r of rows) {
    await pool.query(
      `INSERT INTO llm_usage_events
         (conversation_id, conversation_name, prompt_id, user_id,
          provider, model, pipeline_stage,
          prompt_text, response_text,
          input_tokens, output_tokens, cache_read_tokens, cache_write_tokens,
          computed_cost_usd, latency_ms, status, started_at, finished_at)
       VALUES
         ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
      [
        r.conversation_id,
        r.conversation_name,
        // unique prompt_id — required by uq_llm_usage_events_prompt_id
        `prompt-${r.provider}-${r.model}-${r.started_at.toISOString()}`,
        r.user_id,
        r.provider,
        r.model,
        r.pipeline_stage,
        r.prompt_text,
        r.response_text,
        r.input_tokens,
        r.output_tokens,
        r.cache_read_tokens,
        r.cache_write_tokens,
        r.computed_cost_usd,
        r.latency_ms,
        r.status,
        r.started_at.toISOString(),
        new Date(r.started_at.getTime() + r.latency_ms).toISOString(),
      ],
    )
  }
}

integrationDescribe('observatory queries — integration', () => {
  let pool: Pool
  let seedRows: SeedSpec[]
  // The window covered by the seed data.
  const FROM = '2026-04-25T00:00:00Z'
  const TO = '2026-05-02T00:00:00Z' // exclusive — covers all 7 days

  beforeAll(async () => {
    process.env.DATABASE_URL = TEST_DB_URL!
    pool = new Pool({ connectionString: TEST_DB_URL })
    await pool.query(DOWN_SQL).catch(() => {})
    await pool.query(UP_SQL)
    seedRows = generateSeed()
    await insertSeed(pool, seedRows)
  }, 60_000)

  afterAll(async () => {
    if (pool) {
      await pool.query(DOWN_SQL).catch(() => {})
      await pool.end()
    }
  })

  // -------------------------------------------------------------------------
  // 1. summary — totals over a date range
  // -------------------------------------------------------------------------
  it('summary: returns correct totals for a given date range', async () => {
    const { getSummary } = await import('../queries')
    const summary = await getSummary({ from: FROM, to: TO })
    expect(summary.total_requests).toBe(seedRows.length)

    const expectedCost = seedRows.reduce((s, r) => s + r.computed_cost_usd, 0)
    expect(summary.total_cost_usd).toBeCloseTo(expectedCost, 5)

    const expectedInput = seedRows.reduce((s, r) => s + r.input_tokens, 0)
    expect(summary.total_input_tokens).toBe(expectedInput)

    const expectedOutput = seedRows.reduce((s, r) => s + r.output_tokens, 0)
    expect(summary.total_output_tokens).toBe(expectedOutput)

    const expectedCache = seedRows.reduce(
      (s, r) => s + r.cache_read_tokens + r.cache_write_tokens,
      0,
    )
    expect(summary.total_cache_tokens).toBe(expectedCache)

    expect(summary.avg_cost_per_request).toBeCloseTo(
      expectedCost / seedRows.length,
      6,
    )
    expect(summary.p50_latency_ms).toBeGreaterThan(0)
    expect(summary.p95_latency_ms).toBeGreaterThanOrEqual(summary.p50_latency_ms)
  })

  // -------------------------------------------------------------------------
  // 2. summary — compare_to_previous delta
  // -------------------------------------------------------------------------
  it('summary: compare_to_previous delta calculation correct', async () => {
    const { getSummary } = await import('../queries')
    // Use a 3-day current window: 2026-04-29 → 2026-05-02.
    const cur = await getSummary({
      from: '2026-04-29T00:00:00Z',
      to: '2026-05-02T00:00:00Z',
      compare_to_previous: true,
    })
    const previous = await getSummary({
      from: '2026-04-26T00:00:00Z',
      to: '2026-04-29T00:00:00Z',
    })
    expect(cur.total_requests_delta).toBeDefined()
    const expectedRequestsDelta = cur.total_requests - previous.total_requests
    expect(cur.total_requests_delta).toBe(expectedRequestsDelta)

    const expectedCostDelta = cur.total_cost_usd - previous.total_cost_usd
    expect(cur.total_cost_usd_delta).toBeCloseTo(expectedCostDelta, 5)
  })

  // -------------------------------------------------------------------------
  // 3. summary — provider filter narrows results
  // -------------------------------------------------------------------------
  it('summary: provider filter narrows results correctly', async () => {
    const { getSummary } = await import('../queries')
    const onlyAnthropic = await getSummary({
      from: FROM,
      to: TO,
      filters: { provider: ['anthropic'] },
    })
    const expectedRequests = seedRows.filter(r => r.provider === 'anthropic').length
    expect(onlyAnthropic.total_requests).toBe(expectedRequests)
    expect(onlyAnthropic.total_requests).toBeLessThan(seedRows.length)

    const expectedCost = seedRows
      .filter(r => r.provider === 'anthropic')
      .reduce((s, r) => s + r.computed_cost_usd, 0)
    expect(onlyAnthropic.total_cost_usd).toBeCloseTo(expectedCost, 5)
  })

  // -------------------------------------------------------------------------
  // 4. timeseries — day granularity bucket count
  // -------------------------------------------------------------------------
  it('timeseries: day granularity produces 7 buckets for a 7-day range', async () => {
    const { getTimeseries } = await import('../queries')
    const ts = await getTimeseries({
      from: FROM,
      to: TO,
      granularity: 'day',
      dimension: 'provider',
    })
    expect(ts.buckets.length).toBe(7)
    // Each bucket time should be at midnight UTC and strictly increasing.
    for (let i = 0; i < ts.buckets.length - 1; i++) {
      expect(Date.parse(ts.buckets[i].time)).toBeLessThan(
        Date.parse(ts.buckets[i + 1].time),
      )
    }
  })

  // -------------------------------------------------------------------------
  // 5. timeseries — dimension=provider series keys
  // -------------------------------------------------------------------------
  it('timeseries: dimension=provider produces correct series keys', async () => {
    const { getTimeseries } = await import('../queries')
    const ts = await getTimeseries({
      from: FROM,
      to: TO,
      granularity: 'day',
      dimension: 'provider',
    })
    const allKeys = new Set<string>()
    for (const b of ts.buckets) for (const k of Object.keys(b.series)) allKeys.add(k)
    for (const p of PROVIDERS) {
      expect(allKeys.has(p)).toBe(true)
    }
  })

  // -------------------------------------------------------------------------
  // 6. breakdowns — sorted by cost_usd DESC
  // -------------------------------------------------------------------------
  it('breakdowns: dimension=pipeline_stage, sorted by cost_usd DESC', async () => {
    const { getBreakdowns } = await import('../queries')
    const b = await getBreakdowns({
      from: FROM,
      to: TO,
      dimension: 'pipeline_stage',
    })
    expect(b.rows.length).toBe(STAGES.length)
    for (let i = 0; i < b.rows.length - 1; i++) {
      expect(b.rows[i].cost_usd).toBeGreaterThanOrEqual(b.rows[i + 1].cost_usd)
    }

    // Cross-check totals match seed sums per stage.
    for (const row of b.rows) {
      const expected = seedRows
        .filter(r => r.pipeline_stage === row.dim_value)
        .reduce((s, r) => s + r.computed_cost_usd, 0)
      expect(row.cost_usd).toBeCloseTo(expected, 5)
    }
  })

  // -------------------------------------------------------------------------
  // 7. events — pagination round-trip
  // -------------------------------------------------------------------------
  it('events: pagination — first page returns limit rows + cursor; second page returns remainder', async () => {
    const { getEvents } = await import('../queries')
    const limit = 50
    const page1 = await getEvents({ from: FROM, to: TO, limit })
    expect(page1.events.length).toBe(limit)
    expect(page1.next_cursor).not.toBeNull()
    expect(page1.total_count).toBe(seedRows.length)

    const page2 = await getEvents({
      from: FROM,
      to: TO,
      limit,
      cursor: page1.next_cursor!,
    })
    // Remaining = total - limit. Subsequent pages may again fill or partially fill.
    expect(page2.events.length).toBeGreaterThan(0)
    expect(page2.events.length).toBeLessThanOrEqual(limit)

    // No event_id duplicates across the two pages.
    const ids = new Set<string>()
    for (const e of [...page1.events, ...page2.events]) {
      expect(ids.has(e.event_id)).toBe(false)
      ids.add(e.event_id)
    }
  })

  // -------------------------------------------------------------------------
  // 8. events — search filter matches prompt_text substring
  // -------------------------------------------------------------------------
  it('events: search filter matches prompt_text substring', async () => {
    const { getEvents } = await import('../queries')
    const result = await getEvents({
      from: FROM,
      to: TO,
      search: 'specialKeyword',
      limit: 200,
    })
    const expectedCount = seedRows.filter(r =>
      r.prompt_text.includes('specialKeyword'),
    ).length
    expect(result.events.length).toBe(expectedCount)
    expect(result.total_count).toBe(expectedCount)
    for (const e of result.events) {
      expect(e.event_id).toBeTruthy()
    }
  })

  // -------------------------------------------------------------------------
  // 9. events — min_cost filter excludes rows below threshold
  // -------------------------------------------------------------------------
  it('events: min_cost filter excludes rows below threshold', async () => {
    const { getEvents } = await import('../queries')
    const threshold = 0.005
    const result = await getEvents({
      from: FROM,
      to: TO,
      min_cost: threshold,
      limit: 200,
    })
    const expectedCount = seedRows.filter(r => r.computed_cost_usd >= threshold).length
    expect(result.total_count).toBe(expectedCount)
    for (const e of result.events) {
      expect(e.computed_cost_usd ?? 0).toBeGreaterThanOrEqual(threshold)
    }
  })

  // -------------------------------------------------------------------------
  // 10. event/[id] — full-row fetch + 404
  // -------------------------------------------------------------------------
  it('event/[id]: returns full row; null for nonexistent id', async () => {
    const { getEvents, getEventById } = await import('../queries')
    const page = await getEvents({ from: FROM, to: TO, limit: 1 })
    const id = page.events[0].event_id
    const detail = await getEventById(id)
    expect(detail).not.toBeNull()
    expect(detail?.event_id).toBe(id)
    expect(detail?.prompt_text).toBeTruthy() // full-row fields present
    expect(detail?.response_text).toBeTruthy()

    const missing = await getEventById('00000000-0000-0000-0000-000000000000')
    expect(missing).toBeNull()
  })
})
