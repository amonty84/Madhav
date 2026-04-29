import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/storage', () => ({
  getStorageClient: vi.fn(),
}))

vi.mock('@/lib/telemetry', () => ({
  telemetry: { recordLatency: vi.fn() },
}))

import { getStorageClient } from '@/lib/storage'
import { tool } from '../pattern_register'
import type { QueryPlan } from '../types'

const SAMPLE_REGISTER = {
  schema: 'https://marsys-jis/schemas/pattern_register.schema.json',
  version: '1.0',
  produced_by_session: 'test-session',
  produced_at: '2026-04-01T00:00:00Z',
  patterns: [
    {
      pattern_id: 'PAT-001',
      claim_text: 'Strong yoga between 1st and 9th lord creates lasting dharmic purpose',
      mechanism: '1st lord and 9th lord mutually aspect; both strong',
      domain: 'career',
      signals_referenced: ['SIG-001'],
      counter_cases: [],
      classical_basis: 'BPHS',
      alternatives: [],
      validator_results: [],
      confidence: '0.82',
      significance: '0.88',
      is_forward_looking: false,
      time_indexed_falsifier: null,
      ledger_event_ids: [],
      prediction_ledger_ref: null,
      created_at: '2026-04-01T00:00:00Z',
      created_by_session: 'test-session',
      pass_1_actor: 'gemini',
      re_validation_status: null,
      re_validation_event_id: null,
    },
    {
      pattern_id: 'PAT-002',
      claim_text: 'Health challenges arise from afflicted 6th house',
      mechanism: '6th lord in 8th with malefics',
      domain: 'health',
      signals_referenced: ['SIG-010'],
      counter_cases: [],
      classical_basis: 'BPHS',
      alternatives: [],
      validator_results: [],
      confidence: 0.75,
      significance: 0.7,
      is_forward_looking: false,
      time_indexed_falsifier: null,
      ledger_event_ids: [],
      prediction_ledger_ref: null,
      created_at: '2026-04-01T00:00:00Z',
      created_by_session: 'test-session',
      pass_1_actor: 'gemini',
      re_validation_status: null,
      re_validation_event_id: null,
    },
    {
      pattern_id: 'PAT-003',
      claim_text: 'Career shift likely after 2027 when dasha changes',
      mechanism: 'Dasha transition to 10th lord period activates raja yoga',
      domain: 'career',
      signals_referenced: ['SIG-015'],
      counter_cases: [],
      classical_basis: 'BPHS',
      alternatives: [],
      validator_results: [],
      confidence: '0.68',
      significance: '0.80',
      is_forward_looking: true,
      time_indexed_falsifier: 'No career change observed by end of 2028',
      ledger_event_ids: [],
      prediction_ledger_ref: null,
      created_at: '2026-04-01T00:00:00Z',
      created_by_session: 'test-session',
      pass_1_actor: 'gemini',
      re_validation_status: null,
      re_validation_event_id: null,
    },
  ],
}

const mockReadFile = vi.fn()

const basePlan: QueryPlan = {
  query_plan_id: '00000000-0000-0000-0000-000000000002',
  query_text: 'Tell me about career',
  query_class: 'interpretive',
  domains: [],
  forward_looking: false,
  audience_tier: 'client',
  tools_authorized: ['pattern_register'],
  history_mode: 'synthesized',
  panel_mode: false,
  expected_output_shape: 'single_answer',
  manifest_fingerprint: 'abc123',
  schema_version: '1.0',
}

beforeEach(() => {
  vi.clearAllMocks()
  mockReadFile.mockResolvedValue(JSON.stringify(SAMPLE_REGISTER))
  vi.mocked(getStorageClient).mockReturnValue({
    query: vi.fn(),
    transaction: vi.fn(),
    readObject: vi.fn(),
    writeObject: vi.fn(),
    objectExists: vi.fn(),
    readFile: mockReadFile,
    fileExists: vi.fn(),
    listFiles: vi.fn(),
  })
})

describe('pattern_register tool', () => {
  it('returns all 3 patterns when domains is empty', async () => {
    const bundle = await tool.retrieve(basePlan)

    expect(bundle.tool_name).toBe('pattern_register')
    expect(bundle.schema_version).toBe('1.0')
    expect(bundle.results).toHaveLength(3)
  })

  it('filters patterns by domain', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['career'] }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results).toHaveLength(2)
    for (const r of bundle.results) {
      expect(r.signal_id).toMatch(/^PAT-00[13]$/)
    }
  })

  it('filters to single domain: health', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['health'] }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results).toHaveLength(1)
    expect(bundle.results[0].signal_id).toBe('PAT-002')
  })

  it('returns empty results for unknown domain', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['finance'] }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results).toHaveLength(0)
  })

  it('maps fields correctly: content includes claim_text and mechanism', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['health'] }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results[0].content).toContain('Health challenges arise from afflicted 6th house')
    expect(bundle.results[0].content).toContain('Mechanism:')
    expect(bundle.results[0].content).toContain('6th lord in 8th with malefics')
  })

  it('maps signal_id to pattern_id', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['health'] }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results[0].signal_id).toBe('PAT-002')
  })

  it('parses confidence and significance from string values', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['career'] }
    const bundle = await tool.retrieve(plan)

    // PAT-001 has string "0.82" and "0.88"
    const pat001 = bundle.results.find(r => r.signal_id === 'PAT-001')
    expect(pat001?.confidence).toBeCloseTo(0.82)
    expect(pat001?.significance).toBeCloseTo(0.88)
  })

  it('sets source_canonical_id to PATTERN_REGISTER', async () => {
    const bundle = await tool.retrieve(basePlan)
    for (const r of bundle.results) {
      expect(r.source_canonical_id).toBe('PATTERN_REGISTER')
    }
  })

  it('sets source_version from register version field', async () => {
    const bundle = await tool.retrieve(basePlan)
    for (const r of bundle.results) {
      expect(r.source_version).toBe('1.0')
    }
  })

  it('surfaces forward-looking patterns first when forward_looking is true', async () => {
    const plan: QueryPlan = { ...basePlan, forward_looking: true }
    const bundle = await tool.retrieve(plan)

    // PAT-003 is the only forward-looking pattern — it should be first
    expect(bundle.results[0].signal_id).toBe('PAT-003')
  })

  it('result_hash is stable for same content', async () => {
    const bundle1 = await tool.retrieve(basePlan)
    const bundle2 = await tool.retrieve(basePlan)

    expect(bundle1.result_hash).toBe(bundle2.result_hash)
  })
})
