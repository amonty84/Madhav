import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/storage', () => ({
  getStorageClient: vi.fn(),
}))

import { getStorageClient } from '@/lib/storage'
import { tool } from '../kp_query'
import type { QueryPlan } from '../types'

const mockQuery = vi.fn()

const basePlan: QueryPlan = {
  query_plan_id: '00000000-0000-0000-0000-000000000001',
  query_text: 'KP query test',
  query_class: 'factual',
  domains: [],
  forward_looking: false,
  audience_tier: 'super_admin',
  tools_authorized: ['kp_query'],
  history_mode: 'synthesized',
  panel_mode: false,
  expected_output_shape: 'single_answer',
  manifest_fingerprint: 'abc123',
  schema_version: '1.0',
}

const kpCuspRow = {
  fact_id: 'KP.CUSP.7',
  category: 'kp_cusp',
  divisional_chart: 'D1',
  value_text: 'Libra 12°29′01″',
  value_json: { sign: 'Libra', degree: 12, minute: 29, second: 1, sub_lord: 'Saturn', star_lord: 'Rahu', sub_sub_lord: 'Jupiter' },
  source_section: 'FORENSIC §KP.7',
}

const kpPlanetRow = {
  fact_id: 'KP.PLN.SATURN',
  category: 'kp_planet',
  divisional_chart: 'D1',
  value_text: '0°50′',
  value_json: { planet: 'Saturn', degree: '0°50′', star_lord: 'Mars', sub_lord: 'Ketu', sub_sub_lord: 'Venus' },
  source_section: 'FORENSIC §KP.PLN',
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

describe('kp_query tool', () => {
  it('returns all KP rows when no params supplied', async () => {
    const rows = Array.from({ length: 28 }, (_, i) => ({ ...kpCuspRow, fact_id: `KP.ROW.${i}` }))
    mockQuery.mockResolvedValue({ rows, rowCount: rows.length })

    const bundle = await tool.retrieve(basePlan)

    expect(bundle.tool_name).toBe('kp_query')
    expect(bundle.results.length).toBeGreaterThanOrEqual(1)
    // category filter param should include all three categories
    const sqlParams: unknown[] = mockQuery.mock.calls[0][1]
    expect(sqlParams[0]).toEqual(['kp_cusp', 'kp_planet', 'kp_significator'])
  })

  it('filters to kp_cusp + kp_significator categories when cusp param supplied', async () => {
    mockQuery.mockResolvedValue({ rows: [kpCuspRow], rowCount: 1 })

    await tool.retrieve(basePlan, { cusp: 7 })

    const sqlParams: unknown[] = mockQuery.mock.calls[0][1]
    expect(sqlParams[0]).toEqual(['kp_cusp', 'kp_significator'])
    expect(sqlParams[1]).toBe(7)
  })

  it('returns Saturn KP significators when planet param supplied', async () => {
    mockQuery.mockResolvedValue({ rows: [kpPlanetRow], rowCount: 1 })

    const bundle = await tool.retrieve(basePlan, { planet: 'Saturn' })

    expect(bundle.results).toHaveLength(1)
    const content = JSON.parse(bundle.results[0].content)
    expect(content.fact_id).toBe('KP.PLN.SATURN')
    // category filter should restrict to kp_planet
    const sqlParams: unknown[] = mockQuery.mock.calls[0][1]
    expect(sqlParams[0]).toEqual(['kp_planet'])
  })

  it('returns valid ToolBundle shape', async () => {
    mockQuery.mockResolvedValue({ rows: [kpCuspRow], rowCount: 1 })

    const bundle = await tool.retrieve(basePlan, { cusp: 7 })

    expect(bundle.tool_name).toBe('kp_query')
    expect(bundle.tool_version).toBe('1.0')
    expect(bundle.schema_version).toBe('1.0')
    expect(bundle.served_from_cache).toBe(false)
    expect(typeof bundle.tool_bundle_id).toBe('string')
    expect(typeof bundle.latency_ms).toBe('number')
    expect(bundle.result_hash).toMatch(/^sha256:[0-9a-f]{64}$/)
    expect(Array.isArray(bundle.results)).toBe(true)
    expect(bundle.results[0].source_canonical_id).toBe('FORENSIC')
  })

  it('returns empty results without error for nonexistent cusp', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 })

    const bundle = await tool.retrieve(basePlan, { cusp: 99 })

    expect(bundle.results).toHaveLength(0)
    expect(bundle.tool_name).toBe('kp_query')
    expect(bundle.result_hash).toMatch(/^sha256:/)
  })
})
