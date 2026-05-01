import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/storage', () => ({
  getStorageClient: vi.fn(),
}))

vi.mock('@/lib/telemetry', () => ({
  telemetry: { recordLatency: vi.fn() },
}))

import { getStorageClient } from '@/lib/storage'
import { tool } from '../domain_report_query'
import type { QueryPlan } from '../types'

const mockQuery = vi.fn()

const basePlan: QueryPlan = {
  query_plan_id: '00000000-0000-0000-0000-000000000002',
  query_text: 'Tell me about my career',
  query_class: 'interpretive',
  domains: ['career'],
  forward_looking: false,
  audience_tier: 'client',
  tools_authorized: ['domain_report_query'],
  history_mode: 'synthesized',
  panel_mode: false,
  expected_output_shape: 'single_answer',
  manifest_fingerprint: 'abc123',
  schema_version: '1.0',
}

const careerRow = {
  content: 'Career report: Mercury as 10H lord in Capricorn...',
  doc_type: 'domain_report',
  source_file: '03_DOMAIN_REPORTS/REPORT_CAREER_DHARMA_v1_1.md',
  chunk_id: 'dr_career_001',
  canonical_id: 'REPORT_CAREER_DHARMA',
  source_version: '1.1',
}

const relRow = {
  content: 'Relationships report: Saturn exalted 7H...',
  doc_type: 'domain_report',
  source_file: '03_DOMAIN_REPORTS/REPORT_RELATIONSHIPS_v1_1.md',
  chunk_id: 'dr_relationships_001',
  canonical_id: 'REPORT_RELATIONSHIPS',
  source_version: '1.1',
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
  } as ReturnType<typeof getStorageClient>)
})

describe('domain_report_query tool', () => {
  it('retrieve() with domains:[career] returns results from CAREER_DHARMA source', async () => {
    mockQuery.mockResolvedValue({ rows: [careerRow], rowCount: 1 })
    const bundle = await tool.retrieve(basePlan, { domains: ['career'] })
    expect(bundle.results.length).toBeGreaterThan(0)
    const content = JSON.parse(bundle.results[0].content)
    expect(content.source_doc).toContain('CAREER_DHARMA')
  })

  it('retrieve() with domains:[relationships] returns results from RELATIONSHIPS source', async () => {
    mockQuery.mockResolvedValue({ rows: [relRow], rowCount: 1 })
    const plan = { ...basePlan, domains: ['relationships'] }
    const bundle = await tool.retrieve(plan, { domains: ['relationships'] })
    expect(bundle.results.length).toBeGreaterThan(0)
    const content = JSON.parse(bundle.results[0].content)
    expect(content.source_doc).toContain('RELATIONSHIPS')
  })

  it('retrieve() with no params returns results without error', async () => {
    mockQuery.mockResolvedValue({ rows: [careerRow, relRow], rowCount: 2 })
    const plan = { ...basePlan, domains: [] }
    const bundle = await tool.retrieve(plan)
    expect(bundle.results.length).toBeGreaterThanOrEqual(0)
  })

  it('ToolBundle has correct shape: tool_name, served_from_cache=false, schema_version=1.0', async () => {
    mockQuery.mockResolvedValue({ rows: [careerRow], rowCount: 1 })
    const bundle = await tool.retrieve(basePlan, { domains: ['career'] })
    expect(bundle.tool_name).toBe('domain_report_query')
    expect(bundle.served_from_cache).toBe(false)
    expect(bundle.schema_version).toBe('1.0')
    expect(bundle.result_hash).toMatch(/^sha256:/)
  })

  it('retrieve() with unknown domain returns empty results without error', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 })
    const bundle = await tool.retrieve(basePlan, { domains: ['nonexistent_domain_xyz'] })
    expect(bundle.results).toEqual([])
    expect(bundle.tool_name).toBe('domain_report_query')
  })
})
