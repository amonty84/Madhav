import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/storage', () => ({ getStorageClient: vi.fn() }))
vi.mock('@/lib/telemetry', () => ({ telemetry: { recordLatency: vi.fn() } }))
vi.mock('@/lib/schemas', () => ({ validate: vi.fn().mockReturnValue({ valid: true }) }))
vi.mock('@/lib/config', () => ({ getFlag: vi.fn().mockReturnValue(true) }))

import { getStorageClient } from '@/lib/storage'
import { getFlag } from '@/lib/config'
import { tool } from '../manifest_query'
import type { QueryPlan } from '../types'

// ---------------------------------------------------------------------------
// Synthetic manifest fixture
// ---------------------------------------------------------------------------

const SYNTHETIC_MANIFEST = {
  generated_at: '2026-01-01T00:00:00Z',
  generator_version: '1.0',
  entry_count: 3,
  fingerprint: 'abc123',
  entries: [
    {
      canonical_id: 'FORENSIC_DATA',
      path: '01_FACTS_LAYER/FORENSIC_DATA.md',
      version: '1',
      status: 'CURRENT',
      layer: 'L1',
      expose_to_chat: true,
      representations: ['file'],
      interface_version: '1.0',
      fingerprint: 'fp1',
      native_id: 'abhisek',
      preferred_for: ['factual', 'forensic'],
    },
    {
      canonical_id: 'MSR_SIGNALS',
      path: '025_HOLISTIC_SYNTHESIS/MSR.md',
      version: '3',
      status: 'CURRENT',
      layer: 'L2.5',
      expose_to_chat: true,
      representations: ['file', 'sql'],
      interface_version: '1.0',
      fingerprint: 'fp2',
      native_id: 'abhisek',
      preferred_for: ['saturn', 'career'],
    },
    {
      canonical_id: 'ARCHITECTURE_DOC',
      path: '00_ARCHITECTURE/arch.md',
      version: '1',
      status: 'CURRENT',
      layer: 'L0',
      expose_to_chat: false,
      representations: ['file'],
      interface_version: '1.0',
      fingerprint: 'fp3',
      native_id: 'abhisek',
    },
  ],
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const mockReadFile = vi.fn()

const basePlan: QueryPlan = {
  query_plan_id: '00000000-0000-0000-0000-000000000099',
  query_text: 'saturn career',
  query_class: 'interpretive',
  domains: [],
  forward_looking: false,
  audience_tier: 'client',
  tools_authorized: ['manifest_query'],
  history_mode: 'synthesized',
  panel_mode: false,
  expected_output_shape: 'single_answer',
  manifest_fingerprint: 'abc123',
  schema_version: '1.0',
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(getFlag).mockReturnValue(true)
  mockReadFile.mockResolvedValue(JSON.stringify(SYNTHETIC_MANIFEST))
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

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('manifest_query tool', () => {
  it('returns empty ToolBundle when feature flag disabled', async () => {
    vi.mocked(getFlag).mockReturnValue(false)

    const bundle = await tool.retrieve(basePlan)

    expect(bundle.tool_name).toBe('manifest_query')
    expect(bundle.schema_version).toBe('1.0')
    expect(bundle.results).toHaveLength(0)
    // readFile must NOT be called when flag is disabled
    expect(mockReadFile).not.toHaveBeenCalled()
  })

  it("keyword match: 'saturn career' matches MSR_SIGNALS and not ARCHITECTURE_DOC", async () => {
    const plan: QueryPlan = { ...basePlan, query_text: 'saturn career' }
    const bundle = await tool.retrieve(plan)

    const ids = bundle.results.map(r => r.signal_id)
    expect(ids).toContain('MSR_SIGNALS')
    // ARCHITECTURE_DOC has no matching tokens for 'saturn' or 'career'
    // expose_to_chat is false so it gets +1 — but it must NOT score 0 AND
    // 'saturn'/'career' won't hit its canonical_id, path, or preferred_for,
    // so its score is 0 and it is filtered out.
    expect(ids).not.toContain('ARCHITECTURE_DOC')
  })

  it("keyword match: 'forensic' matches FORENSIC_DATA", async () => {
    const plan: QueryPlan = { ...basePlan, query_text: 'forensic' }
    const bundle = await tool.retrieve(plan)

    const ids = bundle.results.map(r => r.signal_id)
    expect(ids).toContain('FORENSIC_DATA')
  })

  it('returns empty results when no keyword matches', async () => {
    const plan: QueryPlan = { ...basePlan, query_text: 'xyzzy gibberish' }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results).toHaveLength(0)
  })

  it('uses params.question over plan.query_text', async () => {
    // query_text would not match MSR_SIGNALS; params.question would
    const plan: QueryPlan = { ...basePlan, query_text: 'xyzzy gibberish' }
    const bundle = await tool.retrieve(plan, { question: 'saturn' })

    const ids = bundle.results.map(r => r.signal_id)
    expect(ids).toContain('MSR_SIGNALS')
  })

  it('respects top_n param', async () => {
    // Use a query that matches multiple entries — 'data' hits FORENSIC_DATA path
    // and MSR_SIGNALS path; let both score > 0 but cap at 1.
    const plan: QueryPlan = { ...basePlan, query_text: 'forensic saturn career' }
    const bundle = await tool.retrieve(plan, { top_n: 1 })

    expect(bundle.results).toHaveLength(1)
  })

  it('returns valid ToolBundle schema fields', async () => {
    const bundle = await tool.retrieve(basePlan)

    expect(bundle.tool_name).toBe('manifest_query')
    expect(bundle.schema_version).toBe('1.0')
    expect(bundle.result_hash).toMatch(/^sha256:[0-9a-f]{64}$/)
    expect(typeof bundle.tool_bundle_id).toBe('string')
    expect(bundle.tool_bundle_id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    )
  })

  it('graceful degradation on file read error', async () => {
    mockReadFile.mockRejectedValue(new Error('File not found'))

    const bundle = await tool.retrieve(basePlan)

    expect(bundle.tool_name).toBe('manifest_query')
    expect(bundle.schema_version).toBe('1.0')
    expect(bundle.results).toHaveLength(1)
    expect(bundle.results[0].content).toContain('Manifest data unavailable')
    expect(bundle.results[0].confidence).toBe(0)
    expect(bundle.results[0].significance).toBe(0)
  })

  // -------------------------------------------------------------------------
  // Additional structural assertions
  // -------------------------------------------------------------------------

  it('each result carries signal_id equal to canonical_id', async () => {
    const plan: QueryPlan = { ...basePlan, query_text: 'forensic' }
    const bundle = await tool.retrieve(plan)

    for (const result of bundle.results) {
      expect(result.signal_id).toBeDefined()
      // signal_id must be one of the known canonical_ids
      const knownIds = SYNTHETIC_MANIFEST.entries.map(e => e.canonical_id)
      expect(knownIds).toContain(result.signal_id)
    }
  })

  it('source_canonical_id is always CAPABILITY_MANIFEST for matched results', async () => {
    const bundle = await tool.retrieve(basePlan)

    for (const result of bundle.results) {
      expect(result.source_canonical_id).toBe('CAPABILITY_MANIFEST')
    }
  })

  it('source_version equals the manifest fingerprint', async () => {
    const bundle = await tool.retrieve(basePlan)

    for (const result of bundle.results) {
      expect(result.source_version).toBe(SYNTHETIC_MANIFEST.fingerprint)
    }
  })

  it('confidence is normalized to 0-1 range', async () => {
    const bundle = await tool.retrieve(basePlan)

    for (const result of bundle.results) {
      if (result.confidence !== undefined) {
        expect(result.confidence).toBeGreaterThanOrEqual(0)
        expect(result.confidence).toBeLessThanOrEqual(1)
      }
    }
  })

  it('top result has confidence 1.0 (max-score normalization)', async () => {
    const bundle = await tool.retrieve(basePlan)

    if (bundle.results.length > 0) {
      expect(bundle.results[0].confidence).toBe(1.0)
    }
  })

  it('content is valid JSON containing canonical_id field', async () => {
    const plan: QueryPlan = { ...basePlan, query_text: 'forensic' }
    const bundle = await tool.retrieve(plan)

    expect(bundle.results.length).toBeGreaterThan(0)
    const parsed = JSON.parse(bundle.results[0].content)
    expect(parsed).toHaveProperty('canonical_id')
  })
})
