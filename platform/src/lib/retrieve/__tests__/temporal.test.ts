import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/telemetry', () => ({
  telemetry: { recordLatency: vi.fn() },
}))

import { tool } from '../temporal'
import type { QueryPlan } from '../types'

const MOCK_TRANSITS_RESPONSE = {
  native_id: 'abhisek_mohanty',
  date: '2026-04-27',
  transits: [
    { planet: 'Saturn', sign: 'Aquarius', house: 10 },
    { planet: 'Jupiter', sign: 'Taurus', house: 1 },
  ],
}

const MOCK_EPHEMERIS_RESPONSE = {
  native_id: 'abhisek_mohanty',
  date: '2026-04-27',
  positions: [
    { planet: 'Sun', longitude: 37.5 },
    { planet: 'Moon', longitude: 120.3 },
  ],
}

const MOCK_DASHA_CHAIN_RESPONSE = {
  native_id: 'abhisek_mohanty',
  query_date: '2026-01-01',
  md: { lord: 'Mercury', start: '2010-08-21', end: '2027-08-21' },
  ad: { lord: 'Ketu', start: '2025-08-21', end: '2026-08-21' },
  pd: { lord: 'Saturn', start: '2026-01-01', end: '2026-04-01' },
  sd: { lord: 'Jupiter', start: '2026-01-01', end: '2026-02-01' },
  pd2: { lord: 'Mars', start: '2026-01-01', end: '2026-01-15' },
}

const MOCK_SADE_SATI_RESPONSE = {
  status: 'not_implemented',
  message: 'sade_sati: endpoint not yet implemented',
}

const MOCK_ECLIPSES_RESPONSE = {
  status: 'not_implemented',
  message: 'eclipses: endpoint not yet implemented',
}

const MOCK_RETROGRADES_RESPONSE = {
  status: 'not_implemented',
  message: 'retrogrades: endpoint not yet implemented',
}

const basePlan: QueryPlan = {
  query_plan_id: '00000000-0000-0000-0000-000000000006',
  query_text: 'Current transits',
  query_class: 'predictive',
  domains: [],
  forward_looking: false,
  audience_tier: 'client',
  tools_authorized: ['temporal'],
  history_mode: 'synthesized',
  panel_mode: false,
  expected_output_shape: 'single_answer',
  manifest_fingerprint: 'abc123',
  schema_version: '1.0',
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => {
      if (url.includes('/transits')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(MOCK_TRANSITS_RESPONSE),
        })
      }
      if (url.includes('/dasha_chain')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(MOCK_DASHA_CHAIN_RESPONSE),
        })
      }
      if (url.includes('/ephemeris')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(MOCK_EPHEMERIS_RESPONSE),
        })
      }
      if (url.includes('/sade_sati')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(MOCK_SADE_SATI_RESPONSE),
        })
      }
      if (url.includes('/eclipses')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(MOCK_ECLIPSES_RESPONSE),
        })
      }
      if (url.includes('/retrogrades')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(MOCK_RETROGRADES_RESPONSE),
        })
      }
      return Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({}) })
    })
  )
  process.env.PYTHON_SIDECAR_URL = 'http://localhost:8000'
})

describe('temporal tool', () => {
  it('calls only /transits when forward_looking is false', async () => {
    const plan: QueryPlan = { ...basePlan, forward_looking: false }
    const bundle = await tool.retrieve(plan)

    const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls
    const endpoints = calls.map((c: unknown[]) => c[0] as string)
    expect(endpoints.some((e: string) => e.includes('/transits'))).toBe(true)
    expect(endpoints.some((e: string) => e.includes('/ephemeris'))).toBe(false)

    expect(bundle.results).toHaveLength(1)
  })

  it('calls both /transits and /ephemeris when forward_looking is true', async () => {
    const plan: QueryPlan = { ...basePlan, forward_looking: true }
    const bundle = await tool.retrieve(plan)

    const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls
    const endpoints = calls.map((c: unknown[]) => c[0] as string)
    expect(endpoints.some((e: string) => e.includes('/transits'))).toBe(true)
    expect(endpoints.some((e: string) => e.includes('/ephemeris'))).toBe(true)

    expect(bundle.results).toHaveLength(2)
  })

  it('calls /transits and /dasha_chain when dasha_context_required is true', async () => {
    const plan: QueryPlan = { ...basePlan, forward_looking: false, dasha_context_required: true }
    const bundle = await tool.retrieve(plan)

    const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls
    const endpoints = calls.map((c: unknown[]) => c[0] as string)
    expect(endpoints.some((e: string) => e.includes('/transits'))).toBe(true)
    expect(endpoints.some((e: string) => e.includes('/dasha_chain'))).toBe(true)
    expect(endpoints.some((e: string) => e.includes('/ephemeris'))).toBe(false)

    expect(bundle.results).toHaveLength(2)
  })

  it('returns served_from_cache: false', async () => {
    const bundle = await tool.retrieve(basePlan)
    expect(bundle.served_from_cache).toBe(false)
  })

  it('result content is JSON-stringified sidecar response', async () => {
    const bundle = await tool.retrieve(basePlan)
    const parsed = JSON.parse(bundle.results[0].content)
    expect(parsed).toHaveProperty('transits')
  })

  it('result has source_canonical_id TEMPORAL_DATA', async () => {
    const bundle = await tool.retrieve(basePlan)
    expect(bundle.results[0].source_canonical_id).toBe('TEMPORAL_DATA')
  })

  it('result has confidence 1.0 and significance 0.8 on success', async () => {
    const bundle = await tool.retrieve(basePlan)
    expect(bundle.results[0].confidence).toBe(1.0)
    expect(bundle.results[0].significance).toBe(0.8)
  })

  it('handles sidecar error gracefully: returns ToolBundle without throwing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('Connection refused')))
    )

    const bundle = await tool.retrieve(basePlan)

    expect(bundle.tool_name).toBe('temporal')
    expect(bundle.results).toHaveLength(1)
    expect(bundle.results[0].content).toContain('Temporal data unavailable')
    expect(bundle.results[0].confidence).toBe(0)
    expect(bundle.results[0].significance).toBe(0)
  })

  it('handles sidecar non-200 response gracefully', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 503,
          json: () => Promise.resolve({}),
        })
      )
    )

    const bundle = await tool.retrieve(basePlan)

    expect(bundle.results).toHaveLength(1)
    expect(bundle.results[0].content).toContain('Temporal data unavailable')
  })

  it('returns correct tool_name and schema_version', async () => {
    const bundle = await tool.retrieve(basePlan)

    expect(bundle.tool_name).toBe('temporal')
    expect(bundle.schema_version).toBe('1.0')
  })

  it('result_hash is prefixed sha256:', async () => {
    const bundle = await tool.retrieve(basePlan)
    expect(bundle.result_hash).toMatch(/^sha256:/)
  })

  // --- v1.1 extension tests ---

  it('calls /dasha_chain when dasha_context_required is true', async () => {
    const plan: QueryPlan = { ...basePlan, dasha_context_required: true }
    await tool.retrieve(plan)

    const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls
    const endpoints = calls.map((c: unknown[]) => c[0] as string)
    expect(endpoints.some((e: string) => e.includes('/dasha_chain'))).toBe(true)
  })

  it('calls /dasha_chain with time_window start date when time_window is set', async () => {
    const plan: QueryPlan = {
      ...basePlan,
      time_window: { start: '2026-06-01', end: '2026-12-31' },
    }
    await tool.retrieve(plan)

    const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls
    const dashaCall = calls.find((c: unknown[]) => (c[0] as string).includes('/dasha_chain'))
    expect(dashaCall).toBeDefined()
    const body = JSON.parse(dashaCall![1].body as string)
    expect(body.date).toBe('2026-06-01')
  })

  it('calls /sade_sati when sade_sati_query is true', async () => {
    const plan: QueryPlan = { ...basePlan, sade_sati_query: true }
    const bundle = await tool.retrieve(plan)

    const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls
    const endpoints = calls.map((c: unknown[]) => c[0] as string)
    expect(endpoints.some((e: string) => e.includes('/sade_sati'))).toBe(true)
    expect(bundle.results.length).toBeGreaterThanOrEqual(2)
  })

  it('calls /eclipses when eclipse_query is true with time_window', async () => {
    const plan: QueryPlan = {
      ...basePlan,
      eclipse_query: true,
      time_window: { start: '2026-01-01', end: '2026-12-31' },
    }
    await tool.retrieve(plan)

    const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls
    const endpoints = calls.map((c: unknown[]) => c[0] as string)
    expect(endpoints.some((e: string) => e.includes('/eclipses'))).toBe(true)
  })

  it('calls /retrogrades when retrograde_query is true without planet filter', async () => {
    const plan: QueryPlan = { ...basePlan, retrograde_query: true }
    await tool.retrieve(plan)

    const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls
    const retCall = calls.find((c: unknown[]) => (c[0] as string).includes('/retrogrades'))
    expect(retCall).toBeDefined()
    const body = JSON.parse(retCall![1].body as string)
    expect(body.planet).toBeUndefined()
  })

  it('passes retrograde_planet in body when retrograde_planet is set', async () => {
    const plan: QueryPlan = {
      ...basePlan,
      retrograde_query: true,
      retrograde_planet: 'Mercury',
    }
    await tool.retrieve(plan)

    const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls
    const retCall = calls.find((c: unknown[]) => (c[0] as string).includes('/retrogrades'))
    expect(retCall).toBeDefined()
    const body = JSON.parse(retCall![1].body as string)
    expect(body.planet).toBe('Mercury')
  })

  it('calls /ephemeris with start_date + end_date when forward_looking + time_window both set', async () => {
    const plan: QueryPlan = {
      ...basePlan,
      forward_looking: true,
      time_window: { start: '2026-06-01', end: '2026-09-30' },
    }
    await tool.retrieve(plan)

    const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls
    const ephCall = calls.find((c: unknown[]) => (c[0] as string).includes('/ephemeris'))
    expect(ephCall).toBeDefined()
    const body = JSON.parse(ephCall![1].body as string)
    expect(body.start_date).toBe('2026-06-01')
    expect(body.end_date).toBe('2026-09-30')
    expect(body.date).toBeUndefined()
  })

  it('does not call new endpoints when no new flags are set', async () => {
    const plan: QueryPlan = {
      ...basePlan,
      forward_looking: false,
      dasha_context_required: false,
    }
    await tool.retrieve(plan)

    const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls
    const endpoints = calls.map((c: unknown[]) => c[0] as string)
    expect(endpoints.some((e: string) => e.includes('/dasha_chain'))).toBe(false)
    expect(endpoints.some((e: string) => e.includes('/sade_sati'))).toBe(false)
    expect(endpoints.some((e: string) => e.includes('/eclipses'))).toBe(false)
    expect(endpoints.some((e: string) => e.includes('/retrogrades'))).toBe(false)
    expect(endpoints.some((e: string) => e.includes('/ephemeris'))).toBe(false)
  })

  it('gracefully degrades when /dasha_chain throws: returns warning bundle not exception', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) => {
        if (url.includes('/dasha_chain')) {
          return Promise.reject(new Error('Connection refused'))
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(MOCK_TRANSITS_RESPONSE),
        })
      })
    )
    const plan: QueryPlan = { ...basePlan, dasha_context_required: true }
    const bundle = await tool.retrieve(plan)

    expect(bundle.tool_name).toBe('temporal')
    expect(bundle.results[0].content).toContain('Temporal data unavailable')
    expect(bundle.results[0].confidence).toBe(0)
  })
})
