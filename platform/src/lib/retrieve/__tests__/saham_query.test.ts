import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/storage', () => ({
  getStorageClient: vi.fn(),
}))

import { getStorageClient } from '@/lib/storage'
import { tool } from '../saham_query'
import type { QueryPlan } from '../types'

const mockQuery = vi.fn()

const basePlan: QueryPlan = {
  query_plan_id: '00000000-0000-0000-0000-000000000002',
  query_text: 'saham query test',
  query_class: 'factual',
  domains: [],
  forward_looking: false,
  audience_tier: 'super_admin',
  tools_authorized: ['saham_query'],
  history_mode: 'synthesized',
  panel_mode: false,
  expected_output_shape: 'single_answer',
  manifest_fingerprint: 'abc123',
  schema_version: '1.0',
}

const vivahaSaham = {
  fact_id: 'SAH.VIVAHA',
  value_text: null,
  value_json: { sign: 'Libra', house: 7, meaning: 'Marriage', longitude: '5°30′00″ Li', nakshatra: 'Chitra' },
  source_section: 'FORENSIC §12.2',
}

function makeSahamRows(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    fact_id: `SAH.SAHAM${i + 1}`,
    value_text: null,
    value_json: { sign: 'Aries', house: (i % 12) + 1, meaning: `Saham${i + 1}`, longitude: `${i}°00′00″ Ar`, nakshatra: 'Ashwini' },
    source_section: 'FORENSIC §12.2',
  }))
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

describe('saham_query tool', () => {
  it('returns 36 saham rows when no params supplied', async () => {
    const rows = makeSahamRows(36)
    mockQuery.mockResolvedValue({ rows, rowCount: 36 })

    const bundle = await tool.retrieve(basePlan)

    expect(bundle.results).toHaveLength(36)
    expect(bundle.tool_name).toBe('saham_query')
  })

  it('filters by saham_name and returns Vivaha row', async () => {
    mockQuery.mockResolvedValue({ rows: [vivahaSaham], rowCount: 1 })

    const bundle = await tool.retrieve(basePlan, { saham_name: 'Vivaha' })

    expect(bundle.results).toHaveLength(1)
    const content = JSON.parse(bundle.results[0].content)
    expect(content.fact_id).toBe('SAH.VIVAHA')
    // filter param should include %Vivaha%
    const sqlParams: unknown[] = mockQuery.mock.calls[0][1]
    expect(sqlParams[0]).toBe('%Vivaha%')
  })

  it('filters by house and returns sahams in that house', async () => {
    const house7Rows = [{ ...vivahaSaham, fact_id: 'SAH.H7' }]
    mockQuery.mockResolvedValue({ rows: house7Rows, rowCount: 1 })

    const bundle = await tool.retrieve(basePlan, { house: 7 })

    expect(bundle.results).toHaveLength(1)
    const sql: string = mockQuery.mock.calls[0][0]
    expect(sql).toContain("value_json->>'house'")
    const sqlParams: unknown[] = mockQuery.mock.calls[0][1]
    expect(sqlParams[0]).toBe(7)
  })

  it('returns valid ToolBundle shape', async () => {
    mockQuery.mockResolvedValue({ rows: [vivahaSaham], rowCount: 1 })

    const bundle = await tool.retrieve(basePlan)

    expect(bundle.tool_name).toBe('saham_query')
    expect(bundle.tool_version).toBe('1.0')
    expect(bundle.schema_version).toBe('1.0')
    expect(bundle.served_from_cache).toBe(false)
    expect(typeof bundle.tool_bundle_id).toBe('string')
    expect(bundle.result_hash).toMatch(/^sha256:[0-9a-f]{64}$/)
    expect(bundle.results[0].source_canonical_id).toBe('FORENSIC')
    expect(bundle.results[0].significance).toBe(0.80)
  })

  it('returns empty results without error for nonexistent saham name', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 })

    const bundle = await tool.retrieve(basePlan, { saham_name: 'NonExistent' })

    expect(bundle.results).toHaveLength(0)
    expect(bundle.tool_name).toBe('saham_query')
    expect(bundle.result_hash).toMatch(/^sha256:/)
  })
})
