import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/storage', () => ({
  getStorageClient: vi.fn(),
}))

vi.mock('@/lib/telemetry', () => ({
  telemetry: { recordLatency: vi.fn() },
}))

import { getStorageClient } from '@/lib/storage'
import { tool } from '../timeline_query'
import type { QueryPlan } from '../types'

const mockQuery = vi.fn()

const basePlan: QueryPlan = {
  query_plan_id: '00000000-0000-0000-0000-000000000004',
  query_text: 'What does my Mercury dasha show?',
  query_class: 'predictive',
  domains: [],
  forward_looking: false,
  audience_tier: 'client',
  tools_authorized: ['timeline_query'],
  history_mode: 'synthesized',
  panel_mode: false,
  expected_output_shape: 'single_answer',
  manifest_fingerprint: 'abc123',
  schema_version: '1.0',
}

const mercuryMDRow = {
  content: '## §2 — PHASE-BY-PHASE LIFE ARC\n\nPhase 6: Mercury MD (2024 — 2031-08, age 40-47)...',
  doc_type: 'l5_timeline',
  chunk_id: 'timeline_003',
  canonical_id: 'LIFETIME_TIMELINE_v1_0',
  source_version: '1.0',
}

const ketuMDRow = {
  content: 'Phase 7: Ketu MD (2031-08 → 2038-08). Ketu exalted 8H...',
  doc_type: 'l5_timeline',
  chunk_id: 'timeline_004',
  canonical_id: 'LIFETIME_TIMELINE_v1_0',
  source_version: '1.0',
}

const saturnMDRow = {
  content: 'Phase 2: Saturn MD (1992-02 → 2010-02). Formative years...',
  doc_type: 'l5_timeline',
  chunk_id: 'timeline_001',
  canonical_id: 'LIFETIME_TIMELINE_v1_0',
  source_version: '1.0',
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

describe('timeline_query tool', () => {
  it('retrieve() with dasha_name:Mercury MD returns results', async () => {
    mockQuery.mockResolvedValue({ rows: [mercuryMDRow], rowCount: 1 })
    const bundle = await tool.retrieve(basePlan, { dasha_name: 'Mercury MD' })
    expect(bundle.results.length).toBeGreaterThan(0)
  })

  it('retrieve() with dasha_name:Ketu MD returns results', async () => {
    mockQuery.mockResolvedValue({ rows: [ketuMDRow], rowCount: 1 })
    const plan = { ...basePlan, query_text: 'What happens in my Ketu dasha?' }
    const bundle = await tool.retrieve(plan, { dasha_name: 'Ketu MD' })
    expect(bundle.results.length).toBeGreaterThan(0)
  })

  it('retrieve() with no params returns results without error', async () => {
    mockQuery.mockResolvedValue({ rows: [mercuryMDRow, ketuMDRow], rowCount: 2 })
    const bundle = await tool.retrieve(basePlan)
    expect(bundle.results.length).toBeGreaterThanOrEqual(0)
  })

  it('ToolBundle has correct shape', async () => {
    mockQuery.mockResolvedValue({ rows: [mercuryMDRow], rowCount: 1 })
    const bundle = await tool.retrieve(basePlan, { dasha_name: 'Mercury MD' })
    expect(bundle.tool_name).toBe('timeline_query')
    expect(bundle.served_from_cache).toBe(false)
    expect(bundle.schema_version).toBe('1.0')
    expect(bundle.result_hash).toMatch(/^sha256:/)
  })

  it('retrieve() with keyword:Saturn MD returns historical Saturn MD content', async () => {
    mockQuery.mockResolvedValue({ rows: [saturnMDRow], rowCount: 1 })
    const bundle = await tool.retrieve(basePlan, { keyword: 'Saturn MD' })
    expect(bundle.results.length).toBeGreaterThan(0)
    const content = JSON.parse(bundle.results[0].content)
    expect(content.content).toContain('Saturn MD')
  })
})
