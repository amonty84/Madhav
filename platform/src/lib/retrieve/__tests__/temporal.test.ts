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
      if (url.includes('/ephemeris')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(MOCK_EPHEMERIS_RESPONSE),
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

  it('calls /transits when dasha_context_required is true but forward_looking is false', async () => {
    const plan: QueryPlan = { ...basePlan, forward_looking: false, dasha_context_required: true }
    const bundle = await tool.retrieve(plan)

    const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls
    const endpoints = calls.map((c: unknown[]) => c[0] as string)
    expect(endpoints.some((e: string) => e.includes('/transits'))).toBe(true)
    expect(endpoints.some((e: string) => e.includes('/ephemeris'))).toBe(false)

    expect(bundle.results).toHaveLength(1)
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
})
