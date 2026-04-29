import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock server-only so the import guard doesn't fail in test environment
vi.mock('server-only', () => ({}))

// Mock the model resolver — we don't want real LLM calls
vi.mock('@/lib/models/resolver', () => ({
  resolveModel: vi.fn(() => ({ id: 'claude-haiku-4-5' })),
}))

// Mock generateText at the ai module level
const mockGenerateText = vi.fn()
vi.mock('ai', () => ({
  generateText: (...args: unknown[]) => mockGenerateText(...args),
}))

import { classify } from '../router'
import type { RouterContext } from '../router'

const BASE_CONTEXT: RouterContext = {
  audience_tier: 'client',
  manifest_fingerprint: 'test-fingerprint-abc123',
}

function makeResponse(partial: Record<string, unknown>) {
  const base = {
    query_plan_id: '00000000-0000-0000-0000-000000000000',
    query_text: 'test query',
    domains: [],
    forward_looking: false,
    audience_tier: 'client',
    tools_authorized: ['msr_sql'],
    history_mode: 'synthesized',
    panel_mode: false,
    expected_output_shape: 'single_answer',
    manifest_fingerprint: 'test-fingerprint-abc123',
    schema_version: '1.0',
  }
  return JSON.stringify({ ...base, ...partial })
}

function mockLLMResponse(text: string) {
  mockGenerateText.mockResolvedValueOnce({
    text,
    usage: { promptTokens: 100, completionTokens: 50 },
  })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Router classify() — all 8 query classes', () => {
  it('classifies factual queries', async () => {
    mockLLMResponse(makeResponse({
      query_class: 'factual',
      domains: [],
      tools_authorized: ['msr_sql'],
      expected_output_shape: 'single_answer',
      planets: ['Mercury'],
    }))

    const plan = await classify('What sign is my Mercury in?', BASE_CONTEXT)

    expect(plan.query_class).toBe('factual')
    expect(plan.expected_output_shape).toBe('single_answer')
    expect(plan.planets).toContain('Mercury')
  })

  it('classifies interpretive queries', async () => {
    mockLLMResponse(makeResponse({
      query_class: 'interpretive',
      domains: ['career'],
      tools_authorized: ['msr_sql', 'pattern_register'],
      expected_output_shape: 'three_interpretation',
    }))

    const plan = await classify('What does my chart say about career?', BASE_CONTEXT)

    expect(plan.query_class).toBe('interpretive')
    expect(plan.domains).toContain('career')
    expect(plan.expected_output_shape).toBe('three_interpretation')
  })

  it('classifies predictive queries', async () => {
    mockLLMResponse(makeResponse({
      query_class: 'predictive',
      domains: ['career'],
      forward_looking: true,
      tools_authorized: ['msr_sql', 'temporal'],
      expected_output_shape: 'time_indexed_prediction',
      dasha_context_required: true,
    }))

    const plan = await classify('When will I see a career change?', BASE_CONTEXT)

    expect(plan.query_class).toBe('predictive')
    expect(plan.forward_looking).toBe(true)
    expect(plan.expected_output_shape).toBe('time_indexed_prediction')
    expect(plan.dasha_context_required).toBe(true)
  })

  it('classifies cross_domain queries', async () => {
    mockLLMResponse(makeResponse({
      query_class: 'cross_domain',
      domains: ['career', 'relationships'],
      tools_authorized: ['msr_sql', 'pattern_register', 'contradiction_register'],
      expected_output_shape: 'three_interpretation',
    }))

    const plan = await classify('How do career and marriage interact in my chart?', BASE_CONTEXT)

    expect(plan.query_class).toBe('cross_domain')
    expect(plan.domains).toContain('career')
    expect(plan.domains).toContain('relationships')
  })

  it('classifies discovery queries', async () => {
    mockLLMResponse(makeResponse({
      query_class: 'discovery',
      domains: [],
      tools_authorized: ['msr_sql', 'pattern_register', 'cluster_atlas'],
      history_mode: 'research',
      expected_output_shape: 'structured_data',
    }))

    const plan = await classify('What unusual patterns does my chart show?', BASE_CONTEXT)

    expect(plan.query_class).toBe('discovery')
    expect(plan.history_mode).toBe('research')
    expect(plan.expected_output_shape).toBe('structured_data')
  })

  it('classifies holistic queries', async () => {
    mockLLMResponse(makeResponse({
      query_class: 'holistic',
      domains: ['career', 'finance', 'relationships', 'health'],
      tools_authorized: ['msr_sql', 'pattern_register', 'resonance_register', 'cluster_atlas'],
      panel_mode: true,
      expected_output_shape: 'three_interpretation',
      dasha_context_required: true,
    }))

    const plan = await classify('Give me a complete reading of my chart.', BASE_CONTEXT)

    expect(plan.query_class).toBe('holistic')
    expect(plan.panel_mode).toBe(true)
    expect(plan.expected_output_shape).toBe('three_interpretation')
  })

  it('classifies remedial queries', async () => {
    mockLLMResponse(makeResponse({
      query_class: 'remedial',
      domains: [],
      tools_authorized: ['msr_sql', 'pattern_register'],
      expected_output_shape: 'single_answer',
      planets: ['Saturn'],
    }))

    const plan = await classify('What remedies should I do for my Saturn?', BASE_CONTEXT)

    expect(plan.query_class).toBe('remedial')
    expect(plan.planets).toContain('Saturn')
  })

  it('classifies cross_native queries', async () => {
    mockLLMResponse(makeResponse({
      query_class: 'cross_native',
      domains: [],
      tools_authorized: ['msr_sql', 'cluster_atlas', 'query_msr_aggregate'],
      history_mode: 'research',
      expected_output_shape: 'structured_data',
    }))

    const plan = await classify(
      'Across charts with similar Saturn placements, what patterns are common?',
      BASE_CONTEXT
    )

    expect(plan.query_class).toBe('cross_native')
    expect(plan.history_mode).toBe('research')
    expect(plan.expected_output_shape).toBe('structured_data')
  })
})

describe('Router — caller-controlled fields are always overridden', () => {
  it('caller audience_tier overrides any LLM value', async () => {
    // LLM tries to set audience_tier to super_admin — caller says client
    mockLLMResponse(makeResponse({
      query_class: 'factual',
      audience_tier: 'super_admin', // LLM attempts to escalate — must be ignored
      tools_authorized: ['msr_sql'],
      expected_output_shape: 'single_answer',
    }))

    const plan = await classify('test', { ...BASE_CONTEXT, audience_tier: 'client' })

    expect(plan.audience_tier).toBe('client')
  })

  it('manifest_fingerprint is always from context', async () => {
    mockLLMResponse(makeResponse({
      query_class: 'factual',
      manifest_fingerprint: 'llm-injected-fingerprint',
      tools_authorized: ['msr_sql'],
      expected_output_shape: 'single_answer',
    }))

    const plan = await classify('test', BASE_CONTEXT)

    expect(plan.manifest_fingerprint).toBe('test-fingerprint-abc123')
  })

  it('query_plan_id is a valid UUID generated by caller', async () => {
    mockLLMResponse(makeResponse({
      query_class: 'factual',
      tools_authorized: ['msr_sql'],
      expected_output_shape: 'single_answer',
    }))

    const plan = await classify('test', BASE_CONTEXT)

    expect(plan.query_plan_id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    )
    // Must NOT be the all-zeros placeholder
    expect(plan.query_plan_id).not.toBe('00000000-0000-0000-0000-000000000000')
  })
})

describe('Router — schema validation occurs', () => {
  it('a valid plan returns router_confidence: 1.0', async () => {
    mockLLMResponse(makeResponse({
      query_class: 'factual',
      tools_authorized: ['msr_sql'],
      expected_output_shape: 'single_answer',
    }))

    const plan = await classify('test', BASE_CONTEXT)

    expect(plan.router_confidence).toBe(1.0)
  })

  it('schema_version is always "1.0"', async () => {
    mockLLMResponse(makeResponse({
      query_class: 'interpretive',
      domains: ['career'],
      tools_authorized: ['msr_sql'],
      expected_output_shape: 'three_interpretation',
    }))

    const plan = await classify('test', BASE_CONTEXT)

    expect(plan.schema_version).toBe('1.0')
  })
})

describe('Router classify() — FUB-4: vector_search authorization', () => {
  it('interpretive queries include vector_search in tools_authorized', async () => {
    mockLLMResponse(makeResponse({
      query_class: 'interpretive',
      domains: ['career'],
      tools_authorized: ['msr_sql', 'pattern_register', 'resonance_register', 'vector_search'],
      expected_output_shape: 'three_interpretation',
    }))

    const plan = await classify('What does my chart say about my career?', BASE_CONTEXT)

    expect(plan.query_class).toBe('interpretive')
    expect(plan.tools_authorized).toContain('vector_search')
  })

  it('holistic queries include vector_search in tools_authorized', async () => {
    mockLLMResponse(makeResponse({
      query_class: 'holistic',
      domains: ['career', 'finance', 'relationships', 'health'],
      tools_authorized: ['msr_sql', 'pattern_register', 'resonance_register', 'cluster_atlas', 'contradiction_register', 'vector_search'],
      panel_mode: true,
      expected_output_shape: 'three_interpretation',
    }))

    const plan = await classify('Give me a complete reading of my chart.', BASE_CONTEXT)

    expect(plan.query_class).toBe('holistic')
    expect(plan.tools_authorized).toContain('vector_search')
  })

  it('cross_domain queries include vector_search in tools_authorized', async () => {
    mockLLMResponse(makeResponse({
      query_class: 'cross_domain',
      domains: ['career', 'relationships'],
      tools_authorized: ['msr_sql', 'pattern_register', 'resonance_register', 'contradiction_register', 'cgm_graph_walk', 'vector_search'],
      expected_output_shape: 'three_interpretation',
    }))

    const plan = await classify('How do career and marriage interact in my chart?', BASE_CONTEXT)

    expect(plan.query_class).toBe('cross_domain')
    expect(plan.tools_authorized).toContain('vector_search')
  })

  it('predictive queries do NOT include vector_search in tools_authorized', async () => {
    mockLLMResponse(makeResponse({
      query_class: 'predictive',
      domains: ['career'],
      tools_authorized: ['msr_sql', 'temporal', 'resonance_register'],
      forward_looking: true,
      expected_output_shape: 'time_indexed_prediction',
      dasha_context_required: true,
    }))

    const plan = await classify('When will I see a significant career shift?', BASE_CONTEXT)

    expect(plan.query_class).toBe('predictive')
    expect(plan.tools_authorized).not.toContain('vector_search')
  })
})
