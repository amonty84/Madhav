import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('@/lib/models/resolver', () => ({
  resolveModel: vi.fn(() => ({ id: 'claude-haiku-4-5' })),
}))

const mockGenerateText = vi.fn()
vi.mock('ai', () => ({
  generateText: (...args: unknown[]) => mockGenerateText(...args),
}))

import { classify } from '../router'
import type { RouterContext } from '../router'

const BASE_CONTEXT: RouterContext = {
  audience_tier: 'client',
  manifest_fingerprint: 'fallback-test-fingerprint',
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ---------------------------------------------------------------------------
// Helper to simulate the two generateText calls
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
// Fallback behaviour — both attempts fail
// ---------------------------------------------------------------------------

describe('Fallback — both LLM attempts return invalid JSON', () => {
  it('returns fallback plan with router_confidence: 0.0', async () => {
    mockBothCallsWithInvalidJson()
    const plan = await classify('What does my chart say?', BASE_CONTEXT)
    expect(plan.router_confidence).toBe(0.0)
  })

  it('fallback plan query_class is "interpretive"', async () => {
    mockBothCallsWithInvalidJson()
    const plan = await classify('What does my chart say?', BASE_CONTEXT)
    expect(plan.query_class).toBe('interpretive')
  })

  it('fallback plan audience_tier matches context', async () => {
    mockBothCallsWithInvalidJson()
    const plan = await classify('test query', BASE_CONTEXT)
    expect(plan.audience_tier).toBe('client')
  })

  it('fallback plan manifest_fingerprint matches context', async () => {
    mockBothCallsWithInvalidJson()
    const plan = await classify('test query', BASE_CONTEXT)
    expect(plan.manifest_fingerprint).toBe('fallback-test-fingerprint')
  })

  it('fallback plan has a valid UUID', async () => {
    mockBothCallsWithInvalidJson()
    const plan = await classify('test query', BASE_CONTEXT)
    expect(plan.query_plan_id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    )
  })

  it('fallback plan schema_version is "1.0"', async () => {
    mockBothCallsWithInvalidJson()
    const plan = await classify('test query', BASE_CONTEXT)
    expect(plan.schema_version).toBe('1.0')
  })

  it('makes exactly 2 generateText calls before giving up', async () => {
    mockBothCallsWithInvalidJson()
    await classify('test query', BASE_CONTEXT)
    expect(mockGenerateText).toHaveBeenCalledTimes(2)
  })

  it('preserves query_text from input', async () => {
    mockBothCallsWithInvalidJson()
    const plan = await classify('My unique test query text', BASE_CONTEXT)
    expect(plan.query_text).toBe('My unique test query text')
  })
})

// ---------------------------------------------------------------------------
// Fallback behaviour — schema validation failure on attempt 1
// ---------------------------------------------------------------------------

describe('Fallback — first JSON is schema-invalid, second attempt succeeds', () => {
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

// ---------------------------------------------------------------------------
// Retry on invalid JSON — first call invalid JSON, second call valid JSON
// ---------------------------------------------------------------------------

describe('Retry — first call returns non-JSON, second call succeeds', () => {
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
// LLM call throws (network error etc)
// ---------------------------------------------------------------------------

describe('Fallback — LLM call throws an exception', () => {
  it('returns fallback plan when generateText throws', async () => {
    mockGenerateText.mockRejectedValueOnce(new Error('network timeout'))

    const plan = await classify('test query', BASE_CONTEXT)
    expect(plan.router_confidence).toBe(0.0)
    expect(plan.query_class).toBe('interpretive')
  })
})
