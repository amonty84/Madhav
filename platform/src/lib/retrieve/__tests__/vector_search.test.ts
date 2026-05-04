import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mocks must be declared before module imports
vi.mock('google-auth-library', () => ({
  GoogleAuth: vi.fn().mockImplementation(function () {
    return {
      getClient: vi.fn().mockResolvedValue({
        getAccessToken: vi.fn().mockResolvedValue({ token: 'mock-adc-token' }),
      }),
    }
  }),
}))

vi.mock('@/lib/storage', () => ({
  getStorageClient: vi.fn(),
}))

vi.mock('@/lib/telemetry', () => ({
  telemetry: { recordLatency: vi.fn() },
}))

vi.mock('@/lib/schemas', () => ({
  validate: vi.fn().mockReturnValue({ valid: true }),
}))

vi.mock('@/lib/config', () => ({
  getFlag: vi.fn().mockReturnValue(true),
  configService: { getValue: vi.fn().mockReturnValue(10) },
}))

import { getStorageClient } from '@/lib/storage'
import { getFlag, configService } from '@/lib/config'
import { tool, TOOL_METADATA } from '../vector_search'
import type { QueryPlan } from '../types'

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

// 768 dims — matches Vertex AI text-multilingual-embedding-002 (embed.py EMBED_DIM)
const MOCK_EMBEDDING = new Array(768).fill(0.01)

const MOCK_CHUNK_ROWS = [
  {
    chunk_id: 'chunk-001',
    content: 'Saturn in 10th house gives delayed but durable career success.',
    source_file: '025_HOLISTIC_SYNTHESIS/MSR_v3_0.md',
    layer: 'L2.5',
    doc_type: 'msr_signal',
    source_version: '3.0',
    distance: 0.15,
  },
  {
    chunk_id: 'chunk-002',
    content: 'Moon in Cancer with strong 4th house — emotional security is central.',
    source_file: '01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md',
    layer: 'L1',
    doc_type: 'l1_fact',
    source_version: '8.0',
    distance: 0.30,
  },
]

const basePlan: QueryPlan = {
  query_plan_id: '00000000-0000-0000-0000-000000000099',
  query_text: 'What does Saturn indicate for career?',
  query_class: 'interpretive',
  domains: ['career'],
  forward_looking: false,
  audience_tier: 'client',
  tools_authorized: ['vector_search'],
  history_mode: 'synthesized',
  panel_mode: false,
  expected_output_shape: 'single_answer',
  manifest_fingerprint: 'abc123',
  schema_version: '1.0',
}

const mockQuery = vi.fn()

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks()

  // Default: feature flag ON, topK = 10
  vi.mocked(getFlag).mockReturnValue(true)
  vi.mocked(configService.getValue).mockReturnValue(10)

  // Default: storage mock
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

  // Default: Vertex AI Embeddings API returns valid embedding
  // GCP_PROJECT + VERTEX_AI_LOCATION must be set — vector_search requires both
  process.env.GCP_PROJECT = 'test-project'
  process.env.VERTEX_AI_LOCATION = 'asia-south1'
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve({
        predictions: [{ embeddings: { values: MOCK_EMBEDDING } }],
      }),
  })

  // Default: DB returns two rows
  mockQuery.mockResolvedValue({ rows: MOCK_CHUNK_ROWS, rowCount: 2 })
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('vector_search tool', () => {
  describe('feature flag', () => {
    it('returns empty ToolBundle when feature flag disabled', async () => {
      vi.mocked(getFlag).mockReturnValue(false)

      const bundle = await tool.retrieve(basePlan)

      // No Vertex AI call and no DB call
      expect(global.fetch).not.toHaveBeenCalled()
      expect(mockQuery).not.toHaveBeenCalled()

      expect(bundle.tool_name).toBe('vector_search')
      expect(bundle.results).toHaveLength(0)
      expect(bundle.schema_version).toBe('1.0')
    })
  })

  describe('Vertex AI embedding failures', () => {
    it('returns warning ToolBundle when Vertex AI call throws (network error)', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'))

      const bundle = await tool.retrieve(basePlan)

      // Should not propagate — must not throw
      expect(bundle.tool_name).toBe('vector_search')
      // Warning bundle has one result; no DB call should have happened
      expect(mockQuery).not.toHaveBeenCalled()
      expect(bundle.schema_version).toBe('1.0')
    })

    it('returns warning ToolBundle when Vertex AI returns non-200', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: () => Promise.resolve({}),
      })

      const bundle = await tool.retrieve(basePlan)

      expect(bundle.tool_name).toBe('vector_search')
      expect(mockQuery).not.toHaveBeenCalled()
      // Graceful: warning result indicates degradation
      const hasWarning =
        bundle.results.length === 0 ||
        (bundle.results.length === 1 && bundle.results[0].confidence === 0)
      expect(hasWarning).toBe(true)
    })
  })

  describe('successful retrieval', () => {
    it('returns top-K results on successful embedding + DB query', async () => {
      const bundle = await tool.retrieve(basePlan)

      expect(bundle.results).toHaveLength(2)
      expect(bundle.results[0].signal_id).toBe('chunk-001')
      expect(bundle.results[1].signal_id).toBe('chunk-002')
    })

    it('formats content as text + source attribution', async () => {
      const bundle = await tool.retrieve(basePlan)

      const first = bundle.results[0]
      expect(first.content).toContain(MOCK_CHUNK_ROWS[0].content)
      expect(first.content).toContain('[Source: ' + MOCK_CHUNK_ROWS[0].source_file)
      expect(first.content).toContain('Layer: ' + MOCK_CHUNK_ROWS[0].layer + ']')
    })

    it('result confidence is 1 - distance', async () => {
      const bundle = await tool.retrieve(basePlan)

      // chunk-001 distance = 0.15 → confidence ≈ 0.85
      expect(bundle.results[0].confidence).toBeCloseTo(0.85, 5)
      // chunk-002 distance = 0.30 → confidence ≈ 0.70
      expect(bundle.results[1].confidence).toBeCloseTo(0.70, 5)
    })

    it('sets source_canonical_id to doc_type', async () => {
      const bundle = await tool.retrieve(basePlan)

      expect(bundle.results[0].source_canonical_id).toBe('msr_signal')
      expect(bundle.results[1].source_canonical_id).toBe('l1_fact')
    })

    it('sets source_version from chunk row', async () => {
      const bundle = await tool.retrieve(basePlan)

      expect(bundle.results[0].source_version).toBe('3.0')
      expect(bundle.results[1].source_version).toBe('8.0')
    })
  })

  describe('top_k resolution', () => {
    it('uses params.top_k override over configService value', async () => {
      vi.mocked(configService.getValue).mockReturnValue(10)

      await tool.retrieve(basePlan, { top_k: 3 })

      // The SQL LIMIT param ($3) should be 3
      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining([expect.anything(), expect.anything(), 3])
      )
    })

    it('uses configService value when params.top_k is absent', async () => {
      vi.mocked(configService.getValue).mockReturnValue(7)

      await tool.retrieve(basePlan)

      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining([expect.anything(), expect.anything(), 7])
      )
    })
  })

  describe('ToolBundle schema fields', () => {
    it('returns valid ToolBundle with correct tool_name', async () => {
      const bundle = await tool.retrieve(basePlan)
      expect(bundle.tool_name).toBe('vector_search')
    })

    it('returns correct tool_version string', async () => {
      const bundle = await tool.retrieve(basePlan)
      expect(typeof bundle.tool_version).toBe('string')
      expect(bundle.tool_version.length).toBeGreaterThan(0)
    })

    it('schema_version is literal "1.0"', async () => {
      const bundle = await tool.retrieve(basePlan)
      expect(bundle.schema_version).toBe('1.0')
    })

    it('result_hash has sha256: prefix followed by 64 hex chars', async () => {
      const bundle = await tool.retrieve(basePlan)
      expect(bundle.result_hash).toMatch(/^sha256:[0-9a-f]{64}$/)
    })

    it('tool_bundle_id is a UUID', async () => {
      const bundle = await tool.retrieve(basePlan)
      expect(bundle.tool_bundle_id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      )
    })

    it('served_from_cache is false', async () => {
      const bundle = await tool.retrieve(basePlan)
      expect(bundle.served_from_cache).toBe(false)
    })

    it('latency_ms is a non-negative number', async () => {
      const bundle = await tool.retrieve(basePlan)
      expect(typeof bundle.latency_ms).toBe('number')
      expect(bundle.latency_ms).toBeGreaterThanOrEqual(0)
    })
  })

  describe('secondary tool marker', () => {
    it('tool.secondary is true', () => {
      expect(tool.secondary).toBe(true)
    })

    it('TOOL_METADATA.secondary is true', () => {
      expect(TOOL_METADATA.secondary).toBe(true)
    })

    it('TOOL_METADATA.description contains "vector_search [secondary]"', () => {
      expect(TOOL_METADATA.description).toContain('vector_search [secondary]')
    })
  })

  describe('DB failure degradation', () => {
    it('returns warning ToolBundle when DB query throws', async () => {
      mockQuery.mockRejectedValue(new Error('Connection pool exhausted'))

      const bundle = await tool.retrieve(basePlan)

      expect(bundle.tool_name).toBe('vector_search')
      expect(bundle.schema_version).toBe('1.0')
      // Graceful: returns warning result, does not throw
      const hasWarning =
        bundle.results.length === 0 ||
        (bundle.results.length === 1 && bundle.results[0].confidence === 0)
      expect(hasWarning).toBe(true)
    })
  })

  describe('embedding serialization', () => {
    it('passes embedding to DB as bracket-enclosed comma-separated string', async () => {
      await tool.retrieve(basePlan)

      const dbCallArgs = mockQuery.mock.calls[0][1] as unknown[]
      const embeddingArg = dbCallArgs[0] as string
      expect(embeddingArg).toMatch(/^\[[\d.,]+\]$/)
    })
  })

  describe('D.5: empty result set safety', () => {
    it('returns empty ToolBundle (not throwing) when doc_type=["domain_report"] yields no rows', async () => {
      // Simulate: no spiritual/domain_report chunks indexed yet
      mockQuery.mockResolvedValue({ rows: [], rowCount: 0 })

      const plan: QueryPlan = {
        ...basePlan,
        query_text: 'mantra spiritual progress karma',
        vector_search_filter: { doc_type: ['domain_report'] },
      }

      // Must not throw — must return a valid empty bundle
      const bundle = await tool.retrieve(plan)

      expect(bundle.results).toHaveLength(0)
      expect(bundle.tool_name).toBe('vector_search')
      expect(bundle.schema_version).toBe('1.0')
    })

    it('returns empty ToolBundle (not throwing) when result set is empty for any doc_type filter', async () => {
      mockQuery.mockResolvedValue({ rows: [], rowCount: 0 })

      const bundle = await tool.retrieve(basePlan)

      expect(() => bundle).not.toThrow()
      expect(bundle.results).toHaveLength(0)
      expect(bundle.result_hash).toMatch(/^sha256:[0-9a-f]{64}$/)
    })
  })

  describe('doc_type and layer filter', () => {
    it('backward compat: no filter → null params at positions [2] and [3]', async () => {
      await tool.retrieve(basePlan)

      const dbCallArgs = mockQuery.mock.calls[0][1] as unknown[]
      expect(dbCallArgs[2]).toBeNull()
      expect(dbCallArgs[3]).toBeNull()
    })

    it('layer filter: plan.vector_search_filter.layer passed at position [3]', async () => {
      const plan: QueryPlan = { ...basePlan, vector_search_filter: { layer: 'L1' } }
      await tool.retrieve(plan)

      const dbCallArgs = mockQuery.mock.calls[0][1] as unknown[]
      expect(dbCallArgs[2]).toBeNull()
      expect(dbCallArgs[3]).toBe('L1')
    })

    it('doc_type filter: plan.vector_search_filter.doc_type passed at position [2]', async () => {
      const plan: QueryPlan = { ...basePlan, vector_search_filter: { doc_type: ['l1_fact'] } }
      await tool.retrieve(plan)

      const dbCallArgs = mockQuery.mock.calls[0][1] as unknown[]
      expect(dbCallArgs[2]).toEqual(['l1_fact'])
      expect(dbCallArgs[3]).toBeNull()
    })

    it('both filters active: both positions [2] and [3] contain the filter values', async () => {
      const plan: QueryPlan = {
        ...basePlan,
        vector_search_filter: { layer: 'L2.5', doc_type: ['ucn_section', 'msr_signal'] },
      }
      await tool.retrieve(plan)

      const dbCallArgs = mockQuery.mock.calls[0][1] as unknown[]
      expect(dbCallArgs[2]).toEqual(['ucn_section', 'msr_signal'])
      expect(dbCallArgs[3]).toBe('L2.5')
    })

    it('invocation_params records filter values for traceability', async () => {
      const plan: QueryPlan = {
        ...basePlan,
        vector_search_filter: { layer: 'L1', doc_type: ['l1_fact'] },
      }
      const bundle = await tool.retrieve(plan)

      const inv = bundle.invocation_params as Record<string, unknown>
      expect(inv.doc_type_filter).toEqual(['l1_fact'])
      expect(inv.layer_filter).toBe('L1')
    })

    it('SQL injection safety: filter values reach DB only as parameterised inputs, not interpolated', async () => {
      const maliciousDocType = ["l1_fact'; DROP TABLE rag_chunks; --"]
      const plan: QueryPlan = { ...basePlan, vector_search_filter: { doc_type: maliciousDocType } }
      await tool.retrieve(plan)

      // The SQL string itself must not contain the injected value
      const sqlArg = mockQuery.mock.calls[0][0] as string
      expect(sqlArg).not.toContain('DROP TABLE')
      // The value must appear in the params array only
      const dbCallArgs = mockQuery.mock.calls[0][1] as unknown[]
      expect(dbCallArgs[2]).toEqual(maliciousDocType)
    })
  })
})
