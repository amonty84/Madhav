import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/storage', () => ({
  getStorageClient: vi.fn(),
}))

vi.mock('@/lib/telemetry', () => ({
  telemetry: { recordLatency: vi.fn() },
}))

import { getStorageClient } from '@/lib/storage'
import { tool } from '../contradiction_register'
import type { QueryPlan } from '../types'

const SAMPLE_REGISTER = {
  schema: 'https://marsys-jis/schemas/contradiction_register.schema.json',
  version: '1.0',
  produced_by_session: 'test-session',
  produced_at: '2026-04-01T00:00:00Z',
  contradictions: [
    {
      contradiction_id: 'CON-001',
      contradiction_class: 'SIGNAL_CONFLICT',
      hypothesis_text: 'Saturn simultaneously indicates career success and career obstruction',
      mechanism: 'Saturn rules both 10th (success) and 11th (gains) but also aspects 7th (delays)',
      domains_implicated: ['career', 'finance'],
      signals_in_conflict: ['SIG-001', 'SIG-005'],
      l1_references: ['FA-010'],
      claude_severity_prior: 'high',
      resolution_options: ['Accept dual signification', 'Weight by dasha period', 'Defer to transit activation'],
      gemini_verdict: 'CONTRADICTS',
      gemini_rationale: 'Both signals are valid; context-dependent',
      dr_entry_id: 'DIS-001',
      ledger_event_ids: [],
      pass_1_actor: 'claude',
      created_at: '2026-04-01T00:00:00Z',
      created_by_session: 'test-session',
    },
    {
      contradiction_id: 'CON-002',
      contradiction_class: 'LAYER_CONFLICT',
      hypothesis_text: 'Psychological resilience contradicts emotional instability signals',
      mechanism: 'Strong Jupiter (resilience) vs. afflicted Moon (instability)',
      domains_implicated: ['psychology', 'health'],
      signals_in_conflict: ['SIG-011', 'SIG-030'],
      l1_references: ['FA-022'],
      claude_severity_prior: 'medium',
      resolution_options: 'Consider dasha period activation as tiebreaker',
      gemini_verdict: 'NUANCED',
      gemini_rationale: 'Both can coexist at different life periods',
      dr_entry_id: 'DIS-002',
      ledger_event_ids: [],
      pass_1_actor: 'gemini',
      created_at: '2026-04-01T00:00:00Z',
      created_by_session: 'test-session',
    },
    {
      contradiction_id: 'CON-003',
      contradiction_class: 'TEMPORAL_CONFLICT',
      hypothesis_text: 'Relationship timing conflict between D1 and D9 indicators',
      mechanism: '7th lord strong in D1 but debilitated in D9',
      domains_implicated: ['relationships'],
      signals_in_conflict: ['SIG-040', 'SIG-041'],
      l1_references: ['FA-031'],
      claude_severity_prior: 'low',
      resolution_options: [],
      gemini_verdict: null,
      gemini_rationale: null,
      dr_entry_id: null,
      ledger_event_ids: [],
      pass_1_actor: 'claude',
      created_at: '2026-04-01T00:00:00Z',
      created_by_session: 'test-session',
    },
  ],
}

const mockReadFile = vi.fn()

const basePlan: QueryPlan = {
  query_plan_id: '00000000-0000-0000-0000-000000000005',
  query_text: 'What contradictions exist?',
  query_class: 'interpretive',
  domains: [],
  forward_looking: false,
  audience_tier: 'acharya_reviewer',
  tools_authorized: ['contradiction_register'],
  history_mode: 'research',
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

describe('contradiction_register tool', () => {
  it('returns ToolBundle with correct structure', async () => {
    const bundle = await tool.retrieve(basePlan)

    expect(bundle.tool_name).toBe('contradiction_register')
    expect(bundle.tool_version).toBe('1.0')
    expect(bundle.schema_version).toBe('1.0')
    expect(bundle.served_from_cache).toBe(false)
    expect(bundle.result_hash).toMatch(/^sha256:/)
  })

  it('returns all 3 contradictions when domains is empty', async () => {
    const bundle = await tool.retrieve(basePlan)

    expect(bundle.results).toHaveLength(3)
  })

  it('filters by domain: career matches CON-001 only', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['career'] }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results).toHaveLength(1)
    expect(bundle.results[0].signal_id).toBe('CON-001')
  })

  it('filters by domain: psychology matches CON-002 only', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['psychology'] }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results).toHaveLength(1)
    expect(bundle.results[0].signal_id).toBe('CON-002')
  })

  it('filters by multiple domains: career+relationships returns CON-001 and CON-003', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['career', 'relationships'] }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results).toHaveLength(2)
    const ids = bundle.results.map(r => r.signal_id)
    expect(ids).toContain('CON-001')
    expect(ids).toContain('CON-003')
  })

  it('falls back to full register for unknown domain (UQE-7)', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['spirituality'] }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results.length).toBeGreaterThan(0)
  })

  it('uses fixed confidence value of 0.8', async () => {
    const bundle = await tool.retrieve(basePlan)
    for (const r of bundle.results) {
      expect(r.confidence).toBe(0.8)
    }
  })

  it('uses fixed significance value of 0.9', async () => {
    const bundle = await tool.retrieve(basePlan)
    for (const r of bundle.results) {
      expect(r.significance).toBe(0.9)
    }
  })

  it('content format includes contradiction_class in brackets', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['career'] }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results[0].content).toContain('[SIGNAL_CONFLICT]')
  })

  it('content includes hypothesis_text', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['career'] }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results[0].content).toContain(
      'Saturn simultaneously indicates career success and career obstruction'
    )
  })

  it('content includes Mechanism', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['career'] }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results[0].content).toContain('Mechanism:')
  })

  it('content includes Resolution options joined by semicolon for arrays', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['career'] }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results[0].content).toContain('Resolution options:')
    expect(bundle.results[0].content).toContain('Accept dual signification')
    expect(bundle.results[0].content).toContain('Weight by dasha period')
  })

  it('content handles string resolution_options (not array)', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['psychology'] }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results[0].content).toContain(
      'Consider dasha period activation as tiebreaker'
    )
  })

  it('content handles empty array resolution_options with fallback "none"', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['relationships'] }
    const bundle = await tool.retrieve(plan)

    // CON-003 has resolution_options: []
    expect(bundle.results[0].content).toContain('Resolution options: none')
  })

  it('sets source_canonical_id to CONTRADICTION_REGISTER', async () => {
    const bundle = await tool.retrieve(basePlan)
    for (const r of bundle.results) {
      expect(r.source_canonical_id).toBe('CONTRADICTION_REGISTER')
    }
  })

  it('sets source_version from register version field', async () => {
    const bundle = await tool.retrieve(basePlan)
    for (const r of bundle.results) {
      expect(r.source_version).toBe('1.0')
    }
  })

  it('maps signal_id to contradiction_id', async () => {
    const bundle = await tool.retrieve(basePlan)
    const ids = bundle.results.map(r => r.signal_id)
    expect(ids).toContain('CON-001')
    expect(ids).toContain('CON-002')
    expect(ids).toContain('CON-003')
  })

  it('result_hash is stable for same content', async () => {
    const bundle1 = await tool.retrieve(basePlan)
    const bundle2 = await tool.retrieve(basePlan)

    expect(bundle1.result_hash).toBe(bundle2.result_hash)
  })
})
