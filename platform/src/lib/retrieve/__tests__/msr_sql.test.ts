import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { MsrSignal } from '@/lib/db/types'

// Mock storage and telemetry before importing the module under test
vi.mock('@/lib/storage', () => ({
  getStorageClient: vi.fn(),
}))

vi.mock('@/lib/telemetry', () => ({
  telemetry: { recordLatency: vi.fn() },
}))

import { getStorageClient } from '@/lib/storage'
import { tool } from '../msr_sql'
import type { QueryPlan } from '../types'

const mockQuery = vi.fn()

const baseSignal: MsrSignal = {
  signal_id: 'sig-001',
  native_id: 'abhisek_mohanty',
  domain: 'career',
  planet: 'Saturn',
  house: 10,
  nakshatra: 'Pushya',
  dasha_lord: 'Saturn',
  confidence: 0.85,
  significance: 0.9,
  is_forward_looking: false,
  claim_text: 'Saturn in 10th gives career obstacles that eventually yield',
  classical_basis: 'Brihat Parashara Hora Shastra',
  falsifier: 'No career disruption before 35',
  source_file: '025_HOLISTIC_SYNTHESIS/MSR_v3_0.md',
  source_version: '3.0',
  ingested_at: '2026-04-01T00:00:00Z',
}

const basePlan: QueryPlan = {
  query_plan_id: '00000000-0000-0000-0000-000000000001',
  query_text: 'Tell me about career',
  query_class: 'interpretive',
  domains: [],
  forward_looking: false,
  audience_tier: 'client',
  tools_authorized: ['msr_sql'],
  history_mode: 'synthesized',
  panel_mode: false,
  expected_output_shape: 'single_answer',
  manifest_fingerprint: 'abc123',
  schema_version: '1.0',
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(getStorageClient).mockReturnValue({
    query: mockQuery,
    transaction: vi.fn(),
    readObject: vi.fn(),
    writeObject: vi.fn(),
    objectExists: vi.fn(),
    readFile: vi.fn(),
    fileExists: vi.fn(),
    listFiles: vi.fn(),
  })
})

describe('msr_sql tool', () => {
  it('returns a ToolBundle with valid structure', async () => {
    mockQuery.mockResolvedValue({ rows: [baseSignal], rowCount: 1 })

    const bundle = await tool.retrieve(basePlan)

    expect(bundle.tool_name).toBe('msr_sql')
    expect(bundle.tool_version).toBe('1.0.0')
    expect(bundle.schema_version).toBe('1.0')
    expect(bundle.served_from_cache).toBe(false)
    expect(bundle.cache_key).toBeUndefined()
    expect(typeof bundle.tool_bundle_id).toBe('string')
    expect(typeof bundle.latency_ms).toBe('number')
    expect(bundle.result_hash).toMatch(/^sha256:[0-9a-f]{64}$/)
    expect(bundle.results).toHaveLength(1)
    expect(bundle.results[0].content).toBe(baseSignal.claim_text)
    expect(bundle.results[0].source_canonical_id).toBe('MSR')
    expect(bundle.results[0].signal_id).toBe('sig-001')
    expect(bundle.results[0].confidence).toBe(0.85)
    expect(bundle.results[0].significance).toBe(0.9)
  })

  it('filters by domain: passes domain array to SQL', async () => {
    mockQuery.mockResolvedValue({ rows: [baseSignal], rowCount: 1 })

    const plan: QueryPlan = { ...basePlan, domains: ['career', 'health'] }
    await tool.retrieve(plan)

    const callArgs = mockQuery.mock.calls[0]
    // $2 param should be the domain array
    expect(callArgs[1][1]).toEqual(['career', 'health'])
  })

  it('passes null domain param when no domains specified', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 })

    await tool.retrieve(basePlan)

    const callArgs = mockQuery.mock.calls[0]
    expect(callArgs[1][1]).toBeNull()
  })

  it('filters by planet: passes planet array to SQL', async () => {
    mockQuery.mockResolvedValue({ rows: [baseSignal], rowCount: 1 })

    const plan: QueryPlan = { ...basePlan, planets: ['Saturn', 'Jupiter'] }
    await tool.retrieve(plan)

    const callArgs = mockQuery.mock.calls[0]
    // $3 param should be the planet array
    expect(callArgs[1][2]).toEqual(['Saturn', 'Jupiter'])
  })

  it('passes null planet param when no planets specified', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 })

    await tool.retrieve(basePlan)

    const callArgs = mockQuery.mock.calls[0]
    expect(callArgs[1][2]).toBeNull()
  })

  it('handles empty result gracefully', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 })

    const bundle = await tool.retrieve(basePlan)

    expect(bundle.results).toHaveLength(0)
    expect(bundle.schema_version).toBe('1.0')
    expect(bundle.result_hash).toMatch(/^sha256:/)
  })

  it('sets forward_looking filter to true when plan.forward_looking is true', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 })

    const plan: QueryPlan = { ...basePlan, forward_looking: true }
    await tool.retrieve(plan)

    const callArgs = mockQuery.mock.calls[0]
    // $4 param should be true
    expect(callArgs[1][3]).toBe(true)
  })

  it('passes native_id override from params', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 })

    await tool.retrieve(basePlan, { native_id: 'other_native' })

    const callArgs = mockQuery.mock.calls[0]
    expect(callArgs[1][0]).toBe('other_native')
  })

  it('uses default native_id abhisek_mohanty when no override', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 })

    await tool.retrieve(basePlan)

    const callArgs = mockQuery.mock.calls[0]
    expect(callArgs[1][0]).toBe('abhisek_mohanty')
  })
})
