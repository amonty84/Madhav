import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/storage', () => ({
  getStorageClient: vi.fn(),
}))

import { getStorageClient } from '@/lib/storage'
import { tool } from '../divisional_query'
import type { QueryPlan } from '../types'

const mockQuery = vi.fn()

const basePlan: QueryPlan = {
  query_plan_id: '00000000-0000-0000-0000-000000000003',
  query_text: 'divisional query test',
  query_class: 'factual',
  domains: [],
  forward_looking: false,
  audience_tier: 'super_admin',
  tools_authorized: ['divisional_query'],
  history_mode: 'synthesized',
  panel_mode: false,
  expected_output_shape: 'single_answer',
  manifest_fingerprint: 'abc123',
  schema_version: '1.0',
}

function makeHouseRow(divisional_chart: string, n: number) {
  return {
    fact_id: `${divisional_chart}.HSE.${n}`,
    category: 'house',
    divisional_chart,
    value_text: `House ${n}`,
    value_json: { house: n, sign: 'Aries' },
    source_section: `FORENSIC §${divisional_chart}`,
  }
}

const d9Rows = [makeHouseRow('D9', 1), makeHouseRow('D9', 7)]
const d1Rows = Array.from({ length: 12 }, (_, i) => makeHouseRow('D1', i + 1))
const venusD9Row = {
  fact_id: 'D9.PLN.VENUS',
  category: 'planet',
  divisional_chart: 'D9',
  value_text: 'Venus in D9',
  value_json: { planet: 'Venus', sign: 'Pisces', house: 12 },
  source_section: 'FORENSIC §D9',
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

describe('divisional_query tool', () => {
  it('returns D9 placements for varga=D9', async () => {
    mockQuery.mockResolvedValue({ rows: d9Rows, rowCount: d9Rows.length })

    const bundle = await tool.retrieve(basePlan, { varga: 'D9' })

    expect(bundle.results.length).toBeGreaterThan(0)
    expect(bundle.tool_name).toBe('divisional_query')
    // All results should carry varga: 'D9' in content
    for (const r of bundle.results) {
      const content = JSON.parse(r.content)
      expect(content.varga).toBe('D9')
    }
    // SQL param $1 should be 'D9'
    const sqlParams: unknown[] = mockQuery.mock.calls[0][1]
    expect(sqlParams[0]).toBe('D9')
  })

  it('returns D1 placements and divisional_chart=D1 in content', async () => {
    mockQuery.mockResolvedValue({ rows: d1Rows, rowCount: 12 })

    const bundle = await tool.retrieve(basePlan, { varga: 'D1' })

    expect(bundle.results).toHaveLength(12)
    const content = JSON.parse(bundle.results[0].content)
    expect(content.varga).toBe('D1')
    const sqlParams: unknown[] = mockQuery.mock.calls[0][1]
    expect(sqlParams[0]).toBe('D1')
  })

  it('filters to Venus D9 rows when planet=Venus supplied', async () => {
    mockQuery.mockResolvedValue({ rows: [venusD9Row], rowCount: 1 })

    const bundle = await tool.retrieve(basePlan, { varga: 'D9', planet: 'Venus' })

    expect(bundle.results).toHaveLength(1)
    const content = JSON.parse(bundle.results[0].content)
    expect(content.varga).toBe('D9')
    // planet filter should be in SQL params
    const sqlParams: unknown[] = mockQuery.mock.calls[0][1]
    expect(sqlParams[2]).toBe('%Venus%')
  })

  it('returns valid ToolBundle shape', async () => {
    mockQuery.mockResolvedValue({ rows: d9Rows, rowCount: d9Rows.length })

    const bundle = await tool.retrieve(basePlan, { varga: 'D9' })

    expect(bundle.tool_name).toBe('divisional_query')
    expect(bundle.tool_version).toBe('1.0')
    expect(bundle.schema_version).toBe('1.0')
    expect(bundle.served_from_cache).toBe(false)
    expect(typeof bundle.tool_bundle_id).toBe('string')
    expect(bundle.result_hash).toMatch(/^sha256:[0-9a-f]{64}$/)
    expect(bundle.results[0].source_canonical_id).toBe('FORENSIC')
    expect(bundle.results[0].confidence).toBe(1.0)
  })

  it('returns empty results without error for valid varga with no data', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 })

    const bundle = await tool.retrieve(basePlan, { varga: 'D27' })

    expect(bundle.results).toHaveLength(0)
    expect(bundle.tool_name).toBe('divisional_query')
    expect(bundle.result_hash).toMatch(/^sha256:/)
  })
})
