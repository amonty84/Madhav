import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { QueryPlan, ToolBundle } from '@/lib/retrieve/types'

// Mock server-only so the import guard doesn't fail in the test environment.
vi.mock('server-only', () => ({}))

vi.mock('@/lib/models/resolver', () => ({
  resolveModel: vi.fn(() => 'mock-model'),
  googleProviderOptions: vi.fn(() => undefined),
}))
vi.mock('@/lib/trace/emitter', () => ({
  traceEmitter: { emitStep: vi.fn() },
}))
vi.mock('@/lib/telemetry/index', () => ({
  telemetry: { recordCost: vi.fn(), recordError: vi.fn() },
}))

const generateText = vi.fn()
vi.mock('ai', () => ({
  get generateText() { return generateText },
}))

const { contextAssembler } = await import('../context_assembler')

const baseBundle: ToolBundle = {
  tool_bundle_id: 'tb_001',
  tool_name: 'msr_sql',
  tool_version: '1.0',
  invocation_params: {},
  results: [
    { content: 'signal one', signal_id: 'SIG.MSR.001' },
    { content: 'signal two', signal_id: 'SIG.MSR.002' },
  ],
  served_from_cache: false,
  latency_ms: 5,
  result_hash: 'sha256:test',
  schema_version: '1.0',
}

const queryPlan: QueryPlan = {
  query_plan_id: 'qp_001',
  query_text: 'When does Saturn return?',
  query_class: 'predictive',
  domains: [],
  forward_looking: true,
  audience_tier: 'super_admin',
  tools_authorized: ['msr_sql'],
  history_mode: 'synthesized',
  panel_mode: false,
  expected_output_shape: 'time_indexed_prediction',
  manifest_fingerprint: 'fp_test',
  schema_version: '1.0',
}

beforeEach(() => {
  generateText.mockReset()
})

describe('contextAssembler — error-recovery (pass-through on failure)', () => {
  it('returns a pass-through ContextBundle when the LLM call throws', async () => {
    generateText.mockRejectedValue(new Error('provider 503'))

    const result = await contextAssembler([baseBundle], queryPlan, 'mock-model', {
      queryId: 'q_001',
      stepSeq: 9,
    })

    expect(result.context_assembly_compressed).toBe(true)
    expect(result.context_assembly_model_id).toBe('pass-through')
    expect(result.tool_bundles).toEqual([baseBundle])
    expect(result.l2_5_tokens).toBeGreaterThan(0)
    expect(result.total_tokens).toBe(result.l2_5_tokens)
  })

  it('passes through unchanged when the LLM returns unparseable text', async () => {
    generateText.mockResolvedValue({ text: 'not-json at all', usage: {} })

    const result = await contextAssembler([baseBundle], queryPlan, 'mock-model', {
      queryId: 'q_002',
      stepSeq: 10,
    })

    expect(result.context_assembly_model_id).toBe('pass-through')
    expect(result.tool_bundles).toEqual([baseBundle])
  })

  it('uses the LLM-compressed bundle when the response parses cleanly', async () => {
    generateText.mockResolvedValue({
      text: JSON.stringify([
        {
          tool_bundle_id: 'tb_001',
          results: [{ content: 'signal one', signal_id: 'SIG.MSR.001' }],
        },
      ]),
      usage: { inputTokens: 100, outputTokens: 20 },
    })

    const result = await contextAssembler([baseBundle], queryPlan, 'mock-model', {
      queryId: 'q_003',
      stepSeq: 11,
    })

    expect(result.context_assembly_model_id).toBe('mock-model')
    expect(result.tool_bundles).toHaveLength(1)
    expect(result.tool_bundles[0].results).toHaveLength(1)
    expect(result.tool_bundles[0].results[0].signal_id).toBe('SIG.MSR.001')
  })

  it('discards LLM-invented results that were not in the input', async () => {
    generateText.mockResolvedValue({
      text: JSON.stringify([
        {
          tool_bundle_id: 'tb_001',
          results: [{ content: 'fabricated signal', signal_id: 'SIG.MSR.999' }],
        },
      ]),
      usage: {},
    })

    const result = await contextAssembler([baseBundle], queryPlan, 'mock-model', {
      queryId: 'q_004',
      stepSeq: 12,
    })

    // Filter dropped fabricated entry → reverted to original results.
    expect(result.tool_bundles[0].results).toEqual(baseBundle.results)
  })
})
