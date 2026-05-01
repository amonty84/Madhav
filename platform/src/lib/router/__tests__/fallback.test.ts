import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('@/lib/models/resolver', () => ({
  resolveModel: vi.fn(() => ({ id: 'claude-haiku-4-5' })),
  resolveWorkerModel: vi.fn((id: string) => id),
}))

const mockGenerateText = vi.fn()
vi.mock('ai', () => ({
  generateText: (...args: unknown[]) => mockGenerateText(...args),
}))

import { classify, PipelineError } from '../router'
import type { RouterContext } from '../router'

const BASE_CONTEXT: RouterContext = {
  audience_tier: 'client',
  manifest_fingerprint: 'fallback-test-fingerprint',
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ---------------------------------------------------------------------------
// Helpers to simulate the two generateText calls
// ---------------------------------------------------------------------------

function mockBothCallsWithInvalidJson() {
  mockGenerateText
    .mockResolvedValueOnce({
      text: 'This is not JSON at all, sorry!',
      usage: { promptTokens: 80, completionTokens: 20 },
    })
    .mockResolvedValueOnce({
      text: 'Still not JSON, giving up.',
      usage: { promptTokens: 90, completionTokens: 25 },
    })
}

function mockFirstCallInvalidJsonSecondCallValid() {
  const validJson = JSON.stringify({
    query_plan_id: '00000000-0000-0000-0000-000000000000',
    query_text: 'test',
    query_class: 'interpretive',
    domains: ['career'],
    forward_looking: false,
    audience_tier: 'client',
    tools_authorized: ['msr_sql'],
    history_mode: 'synthesized',
    panel_mode: false,
    expected_output_shape: 'three_interpretation',
    manifest_fingerprint: 'fallback-test-fingerprint',
    schema_version: '1.0',
  })

  mockGenerateText
    .mockResolvedValueOnce({
      text: 'not json {{}}',
      usage: { promptTokens: 80, completionTokens: 15 },
    })
    .mockResolvedValueOnce({
      text: validJson,
      usage: { promptTokens: 95, completionTokens: 55 },
    })
}

function mockFirstCallSchemaInvalidSecondCallValid() {
  // First call returns JSON that is missing required fields
  const invalidJson = JSON.stringify({
    query_class: 'interpretive',
    // missing many required fields
  })

  const validJson = JSON.stringify({
    query_plan_id: '00000000-0000-0000-0000-000000000000',
    query_text: 'test',
    query_class: 'factual',
    domains: [],
    forward_looking: false,
    audience_tier: 'client',
    tools_authorized: ['msr_sql'],
    history_mode: 'synthesized',
    panel_mode: false,
    expected_output_shape: 'single_answer',
    manifest_fingerprint: 'fallback-test-fingerprint',
    schema_version: '1.0',
  })

  mockGenerateText
    .mockResolvedValueOnce({
      text: invalidJson,
      usage: { promptTokens: 80, completionTokens: 30 },
    })
    .mockResolvedValueOnce({
      text: validJson,
      usage: { promptTokens: 95, completionTokens: 55 },
    })
}

// ---------------------------------------------------------------------------
// Hard-fail behaviour — both attempts return invalid JSON
// BHISMA-B1 §3.3 / ADR-3: silent fallback removed; classify throws
// PipelineError so the route can return a structured error to the user.
// ---------------------------------------------------------------------------

describe('Hard-fail — both LLM attempts return invalid JSON', () => {
  it('throws PipelineError(stage="classify") instead of returning a plan', async () => {
    mockBothCallsWithInvalidJson()
    await expect(classify('What does my chart say?', BASE_CONTEXT)).rejects.toBeInstanceOf(PipelineError)
  })

  it('PipelineError carries the planning model id and provider', async () => {
    mockBothCallsWithInvalidJson()
    try {
      await classify('test query', BASE_CONTEXT)
      throw new Error('expected throw')
    } catch (err) {
      expect(err).toBeInstanceOf(PipelineError)
      const pe = err as PipelineError
      expect(pe.stage).toBe('classify')
      expect(pe.model_id).toBe('claude-haiku-4-5')
      expect(pe.reason).toMatch(/JSON|schema/i)
    }
  })

  it('still makes exactly 2 generateText calls before failing', async () => {
    mockBothCallsWithInvalidJson()
    await expect(classify('test query', BASE_CONTEXT)).rejects.toBeInstanceOf(PipelineError)
    expect(mockGenerateText).toHaveBeenCalledTimes(2)
  })
})

// ---------------------------------------------------------------------------
// Retry success — first JSON is schema-invalid, second attempt succeeds.
// (Retry-on-recoverable-failure is preserved; only the silent-fallback after
// both attempts fail was removed.)
// ---------------------------------------------------------------------------

describe('Retry success — first JSON is schema-invalid, second attempt succeeds', () => {
  it('retry resolves with valid plan and router_confidence: 1.0', async () => {
    mockFirstCallSchemaInvalidSecondCallValid()
    const plan = await classify('test query', BASE_CONTEXT)
    expect(plan.router_confidence).toBe(1.0)
    expect(plan.query_class).toBe('factual')
  })

  it('makes exactly 2 generateText calls', async () => {
    mockFirstCallSchemaInvalidSecondCallValid()
    await classify('test query', BASE_CONTEXT)
    expect(mockGenerateText).toHaveBeenCalledTimes(2)
  })
})

describe('Retry success — first call returns non-JSON, second call succeeds', () => {
  it('second call result is used (router_confidence: 1.0)', async () => {
    mockFirstCallInvalidJsonSecondCallValid()
    const plan = await classify('test query', BASE_CONTEXT)
    expect(plan.router_confidence).toBe(1.0)
    expect(plan.query_class).toBe('interpretive')
  })

  it('makes exactly 2 generateText calls', async () => {
    mockFirstCallInvalidJsonSecondCallValid()
    await classify('test query', BASE_CONTEXT)
    expect(mockGenerateText).toHaveBeenCalledTimes(2)
  })
})

// ---------------------------------------------------------------------------
// LLM call throws (network error etc) — surfaces as PipelineError
// ---------------------------------------------------------------------------

describe('Hard-fail — LLM call throws an exception', () => {
  it('throws PipelineError when the first generateText call rejects', async () => {
    mockGenerateText.mockRejectedValueOnce(new Error('network timeout'))
    await expect(classify('test query', BASE_CONTEXT)).rejects.toBeInstanceOf(PipelineError)
  })

  it('PipelineError reason wraps the underlying error message', async () => {
    mockGenerateText.mockRejectedValueOnce(new Error('network timeout'))
    try {
      await classify('test query', BASE_CONTEXT)
      throw new Error('expected throw')
    } catch (err) {
      expect(err).toBeInstanceOf(PipelineError)
      expect((err as PipelineError).reason).toContain('network timeout')
    }
  })
})
