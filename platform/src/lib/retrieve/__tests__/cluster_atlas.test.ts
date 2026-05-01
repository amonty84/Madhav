import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/storage', () => ({
  getStorageClient: vi.fn(),
}))

vi.mock('@/lib/telemetry', () => ({
  telemetry: { recordLatency: vi.fn() },
}))

import { getStorageClient } from '@/lib/storage'
import { tool } from '../cluster_atlas'
import type { QueryPlan } from '../types'

const SAMPLE_ATLAS = {
  schema: 'https://marsys-jis/schemas/cluster_atlas.schema.json',
  version: '1.0',
  produced_by_session: 'test-session',
  produced_at: '2026-04-01T00:00:00Z',
  clusters: [
    {
      cluster_id: 'CLU-001',
      cluster_label: 'Career Saturn Cluster',
      dominant_domain: 'career',
      sub_domains: ['dharma', 'discipline'],
      signal_ids: ['SIG-001', 'SIG-002'],
      chunk_ids: [],
      centroid_method: 'kmeans',
      cluster_size_n: 12,
      pass_1_actor: 'gemini',
      confidence: '0.85',
      significance: '0.90',
      annotation: 'Saturn dominates career significations through dual lordship',
      ledger_event_ids: [],
      created_at: '2026-04-01T00:00:00Z',
      created_by_session: 'test-session',
    },
    {
      cluster_id: 'CLU-002',
      cluster_label: 'Health Vulnerability Cluster',
      dominant_domain: 'health',
      sub_domains: ['psychology', 'chronic'],
      signal_ids: ['SIG-010', 'SIG-011'],
      chunk_ids: [],
      centroid_method: 'kmeans',
      cluster_size_n: 8,
      pass_1_actor: 'gemini',
      confidence: 0.72,
      significance: 0.78,
      annotation: 'Afflicted 6th and 8th produce recurring health themes',
      ledger_event_ids: [],
      created_at: '2026-04-01T00:00:00Z',
      created_by_session: 'test-session',
    },
    {
      cluster_id: 'CLU-003',
      cluster_label: 'Finance Dharma Bridge',
      dominant_domain: 'finance',
      sub_domains: ['career', 'relationships'],
      signal_ids: ['SIG-020'],
      chunk_ids: [],
      centroid_method: 'kmeans',
      cluster_size_n: 5,
      pass_1_actor: 'gemini',
      confidence: '0.68',
      significance: '0.75',
      annotation: null,
      ledger_event_ids: [],
      created_at: '2026-04-01T00:00:00Z',
      created_by_session: 'test-session',
    },
  ],
}

const mockReadFile = vi.fn()

const basePlan: QueryPlan = {
  query_plan_id: '00000000-0000-0000-0000-000000000004',
  query_text: 'Show clusters',
  query_class: 'discovery',
  domains: [],
  forward_looking: false,
  audience_tier: 'client',
  tools_authorized: ['cluster_atlas'],
  history_mode: 'synthesized',
  panel_mode: false,
  expected_output_shape: 'single_answer',
  manifest_fingerprint: 'abc123',
  schema_version: '1.0',
}

beforeEach(() => {
  vi.clearAllMocks()
  mockReadFile.mockResolvedValue(JSON.stringify(SAMPLE_ATLAS))
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

describe('cluster_atlas tool', () => {
  it('returns ToolBundle with correct structure', async () => {
    const bundle = await tool.retrieve(basePlan)

    expect(bundle.tool_name).toBe('cluster_atlas')
    expect(bundle.tool_version).toBe('1.0')
    expect(bundle.schema_version).toBe('1.0')
    expect(bundle.served_from_cache).toBe(false)
    expect(bundle.result_hash).toMatch(/^sha256:/)
    expect(typeof bundle.latency_ms).toBe('number')
  })

  it('returns all 3 clusters when domains is empty', async () => {
    const bundle = await tool.retrieve(basePlan)

    expect(bundle.results).toHaveLength(3)
  })

  it('filters clusters by dominant_domain match', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['career'] }
    const bundle = await tool.retrieve(plan)

    // CLU-001 has dominant_domain 'career'
    // CLU-003 has 'career' in sub_domains
    expect(bundle.results).toHaveLength(2)
    const ids = bundle.results.map(r => r.signal_id)
    expect(ids).toContain('CLU-001')
    expect(ids).toContain('CLU-003')
  })

  it('filters clusters by sub_domains match', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['psychology'] }
    const bundle = await tool.retrieve(plan)

    // CLU-002 has 'psychology' in sub_domains
    expect(bundle.results).toHaveLength(1)
    expect(bundle.results[0].signal_id).toBe('CLU-002')
  })

  it('brings graph_seed_hints clusters to front without excluding others', async () => {
    const plan: QueryPlan = {
      ...basePlan,
      graph_seed_hints: ['CLU-003'],
    }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results).toHaveLength(3)
    expect(bundle.results[0].signal_id).toBe('CLU-003')
  })

  it('brings multiple graph_seed_hints to front', async () => {
    const plan: QueryPlan = {
      ...basePlan,
      graph_seed_hints: ['CLU-002', 'CLU-003'],
    }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results).toHaveLength(3)
    const first2 = bundle.results.slice(0, 2).map(r => r.signal_id)
    expect(first2).toContain('CLU-002')
    expect(first2).toContain('CLU-003')
  })

  it('maps content field correctly', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['career'] }
    const bundle = await tool.retrieve(plan)

    const clu001 = bundle.results.find(r => r.signal_id === 'CLU-001')
    expect(clu001?.content).toContain('Career Saturn Cluster')
    expect(clu001?.content).toContain('Saturn dominates career significations through dual lordship')
    expect(clu001?.content).toContain('Dominant domain: career')
    expect(clu001?.content).toContain('Cluster size: 12 signals')
  })

  it('uses fallback annotation text when annotation is null', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['finance'] }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results[0].signal_id).toBe('CLU-003')
    expect(bundle.results[0].content).toContain('No annotation')
  })

  it('sets source_canonical_id to CLUSTER_ATLAS', async () => {
    const bundle = await tool.retrieve(basePlan)
    for (const r of bundle.results) {
      expect(r.source_canonical_id).toBe('CLUSTER_ATLAS')
    }
  })

  it('sets source_version from register version field', async () => {
    const bundle = await tool.retrieve(basePlan)
    for (const r of bundle.results) {
      expect(r.source_version).toBe('1.0')
    }
  })

  it('parses confidence and significance from string values', async () => {
    const plan: QueryPlan = { ...basePlan, domains: ['career'] }
    const bundle = await tool.retrieve(plan)

    const clu001 = bundle.results.find(r => r.signal_id === 'CLU-001')
    expect(clu001?.confidence).toBeCloseTo(0.85)
    expect(clu001?.significance).toBeCloseTo(0.90)
  })

  it('maps signal_id to cluster_id', async () => {
    const bundle = await tool.retrieve(basePlan)
    const ids = bundle.results.map(r => r.signal_id)
    expect(ids).toContain('CLU-001')
    expect(ids).toContain('CLU-002')
    expect(ids).toContain('CLU-003')
  })

  it('result_hash is stable for same content', async () => {
    const bundle1 = await tool.retrieve(basePlan)
    const bundle2 = await tool.retrieve(basePlan)

    expect(bundle1.result_hash).toBe(bundle2.result_hash)
  })
})
