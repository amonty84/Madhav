import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/storage', () => ({
  getStorageClient: vi.fn(),
}))

vi.mock('@/lib/telemetry', () => ({
  telemetry: { recordLatency: vi.fn() },
}))

import { getStorageClient } from '@/lib/storage'
import { tool } from '../resonance_register'
import type { QueryPlan } from '../types'

const SAMPLE_REGISTER = {
  schema: 'https://marsys-jis/schemas/resonance_register.schema.json',
  version: '1.0',
  produced_by_session: 'test-session',
  produced_at: '2026-04-01T00:00:00Z',
  resonances: [
    {
      resonance_id: 'RES-001',
      claim_text: 'Career and finances are intertwined through Saturn dual lordship',
      mechanism: 'Saturn rules both 10th and 11th; simultaneous activation in dasha',
      domains_bridged: ['career', 'finance'],
      signals_referenced: ['SIG-001', 'SIG-020'],
      cdlm_cells_referenced: ['career:finance'],
      counter_cases: [],
      classical_basis: 'BPHS',
      alternatives: [],
      validator_results: [],
      confidence: '0.79',
      significance: '0.85',
      is_forward_looking: false,
      time_indexed_falsifier: null,
      ledger_event_ids: [],
      prediction_ledger_ref: null,
      pass_1_actor: 'gemini',
      created_at: '2026-04-01T00:00:00Z',
      created_by_session: 'test-session',
    },
    {
      resonance_id: 'RES-002',
      claim_text: 'Psychological stress amplifies health vulnerability during Rahu periods',
      mechanism: 'Rahu in 6th activates anxiety pattern simultaneously with immune suppression',
      domains_bridged: ['psychology', 'health'],
      signals_referenced: ['SIG-011'],
      cdlm_cells_referenced: ['psychology:health'],
      counter_cases: [],
      classical_basis: 'BPHS',
      alternatives: [],
      validator_results: [],
      confidence: 0.72,
      significance: 0.68,
      is_forward_looking: false,
      time_indexed_falsifier: null,
      ledger_event_ids: [],
      prediction_ledger_ref: null,
      pass_1_actor: 'gemini',
      created_at: '2026-04-01T00:00:00Z',
      created_by_session: 'test-session',
    },
    {
      resonance_id: 'RES-003',
      claim_text: 'Relationship events correlate with career turning points',
      mechanism: '7th lord and 10th lord in mutual reception; joint dasha activation',
      domains_bridged: ['relationships', 'career'],
      signals_referenced: ['SIG-030', 'SIG-031'],
      cdlm_cells_referenced: ['relationships:career'],
      counter_cases: [],
      classical_basis: 'BPHS',
      alternatives: [],
      validator_results: [],
      confidence: '0.65',
      significance: '0.73',
      is_forward_looking: true,
      time_indexed_falsifier: 'No correlated events observed by end of 2028',
      ledger_event_ids: [],
      prediction_ledger_ref: null,
      pass_1_actor: 'gemini',
      created_at: '2026-04-01T00:00:00Z',
      created_by_session: 'test-session',
    },
  ],
}

const mockReadFile = vi.fn()

const basePlan: QueryPlan = {
  query_plan_id: '00000000-0000-0000-0000-000000000003',
  query_text: 'Cross-domain analysis',
  query_class: 'cross_domain',
  domains: [],
  forward_looking: false,
  audience_tier: 'client',
  tools_authorized: ['resonance_register'],
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

describe('resonance_register tool', () => {
  it('returns all 3 resonances when domains is empty', async () => {
    const bundle = await tool.retrieve(basePlan)

    expect(bundle.tool_name).toBe('resonance_register')
    expect(bundle.schema_version).toBe('1.0')
    expect(bundle.results).toHaveLength(3)
  })

  it('filters by domain: career matches RES-001 and RES-003', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['career'] }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results).toHaveLength(2)
    const ids = bundle.results.map(r => r.signal_id)
    expect(ids).toContain('RES-001')
    expect(ids).toContain('RES-003')
  })

  it('filters by domain: health matches RES-002 only', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['health'] }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results).toHaveLength(1)
    expect(bundle.results[0].signal_id).toBe('RES-002')
  })

  it('falls back to full register for unknown domain (UQE-7)', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['spirituality'] }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results.length).toBeGreaterThan(0)
  })

  it('maps fields correctly: content includes claim_text, mechanism, and domains_bridged', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['health'] }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results[0].content).toContain('Psychological stress amplifies')
    expect(bundle.results[0].content).toContain('Mechanism:')
    expect(bundle.results[0].content).toContain('Domains bridged:')
    expect(bundle.results[0].content).toContain('psychology')
    expect(bundle.results[0].content).toContain('health')
  })

  it('maps signal_id to resonance_id', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['health'] }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results[0].signal_id).toBe('RES-002')
  })

  it('parses confidence and significance from string values', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['career'] }
    const bundle = await tool.retrieve(plan)

    const res001 = bundle.results.find(r => r.signal_id === 'RES-001')
    expect(res001?.confidence).toBeCloseTo(0.79)
    expect(res001?.significance).toBeCloseTo(0.85)
  })

  it('sets source_canonical_id to RESONANCE_REGISTER', async () => {
    const bundle = await tool.retrieve(basePlan)
    for (const r of bundle.results) {
      expect(r.source_canonical_id).toBe('RESONANCE_REGISTER')
    }
  })

  it('sets source_version from register version field', async () => {
    const bundle = await tool.retrieve(basePlan)
    for (const r of bundle.results) {
      expect(r.source_version).toBe('1.0')
    }
  })

  it('result_hash is stable for same content', async () => {
    const bundle1 = await tool.retrieve(basePlan)
    const bundle2 = await tool.retrieve(basePlan)

    expect(bundle1.result_hash).toBe(bundle2.result_hash)
  })

  it('matches resonance when plan has multiple domains including one that bridges', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['finance', 'psychology'] }
    const bundle = await tool.retrieve(plan)

    // RES-001 bridges career+finance; RES-002 bridges psychology+health
    expect(bundle.results).toHaveLength(2)
    const ids = bundle.results.map(r => r.signal_id)
    expect(ids).toContain('RES-001')
    expect(ids).toContain('RES-002')
  })
})
