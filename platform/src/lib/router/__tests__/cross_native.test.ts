import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('@/lib/models/resolver', () => ({
  resolveModel: vi.fn(() => ({ id: 'claude-haiku-4-5' })),
  resolveWorkerModel: vi.fn((id: string) => id ?? 'claude-haiku-4-5'),
}))

const mockGenerateText = vi.fn()
vi.mock('ai', () => ({
  generateText: (...args: unknown[]) => mockGenerateText(...args),
}))

import { classify } from '../router'
import type { RouterContext } from '../router'

const CONTEXT: RouterContext = {
  audience_tier: 'acharya_reviewer',
  manifest_fingerprint: 'fp-cross-native-test',
}

function crossNativeResponse(overrides: Record<string, unknown> = {}) {
  return JSON.stringify({
    query_plan_id: '00000000-0000-0000-0000-000000000000',
    query_text: 'test',
    query_class: 'cross_native',
    domains: [],
    forward_looking: false,
    audience_tier: 'acharya_reviewer',
    tools_authorized: ['msr_sql', 'cluster_atlas', 'query_msr_aggregate'],
    history_mode: 'research',
    panel_mode: false,
    expected_output_shape: 'structured_data',
    manifest_fingerprint: 'fp-cross-native-test',
    schema_version: '1.0',
    ...overrides,
  })
}

function mockOnceCrossNative() {
  mockGenerateText.mockResolvedValueOnce({
    text: crossNativeResponse(),
    usage: { promptTokens: 120, completionTokens: 60 },
  })
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ---------------------------------------------------------------------------
// Trigger phrase tests — the LLM is mocked to return cross_native class.
// These tests verify that the trigger phrase queries do not break the router
// and that a cross_native response passes schema validation end-to-end.
// ---------------------------------------------------------------------------

describe('cross_native trigger phrases', () => {
  const triggerPhrases = [
    'Across charts with similar Saturn placements, what patterns are common?',
    'Compare my chart with someone who has Moon in Scorpio',
    'What patterns are common across different natives with Rahu in the 1st house?',
    'Research: what do charts with 5th lord in 8th house show?',
    'Do people with similar ascendants tend to show career patterns like mine?',
    'Compared to others with Jupiter in Capricorn, how does my placement differ?',
    'What does a statistical analysis of charts show about this placement?',
    'How does this manifest in other charts with strong Mars?',
  ]

  for (const phrase of triggerPhrases) {
    it(`classifies as cross_native: "${phrase.slice(0, 60)}..."`, async () => {
      mockOnceCrossNative()

      const plan = await classify(phrase, CONTEXT)

      expect(plan.query_class).toBe('cross_native')
      expect(plan.history_mode).toBe('research')
      expect(plan.expected_output_shape).toBe('structured_data')
    })
  }
})

describe('cross_native plan properties', () => {
  it('includes cluster_atlas in tools_authorized', async () => {
    mockOnceCrossNative()
    const plan = await classify('Across charts with similar placements', CONTEXT)
    expect(plan.tools_authorized).toContain('cluster_atlas')
  })

  it('includes query_msr_aggregate in tools_authorized', async () => {
    mockOnceCrossNative()
    const plan = await classify('Research patterns across different natives', CONTEXT)
    expect(plan.tools_authorized).toContain('query_msr_aggregate')
  })

  it('uses research history_mode', async () => {
    mockOnceCrossNative()
    const plan = await classify('Compare my chart with others', CONTEXT)
    expect(plan.history_mode).toBe('research')
  })

  it('uses structured_data output shape', async () => {
    mockOnceCrossNative()
    const plan = await classify('What common patterns appear across charts?', CONTEXT)
    expect(plan.expected_output_shape).toBe('structured_data')
  })

  it('passes schema validation (router_confidence is 1.0)', async () => {
    mockOnceCrossNative()
    const plan = await classify('Across charts with similar Saturn', CONTEXT)
    expect(plan.router_confidence).toBe(1.0)
  })

  it('preserves audience_tier from context', async () => {
    mockGenerateText.mockResolvedValueOnce({
      text: crossNativeResponse({ audience_tier: 'super_admin' }), // LLM tries to escalate
      usage: { promptTokens: 120, completionTokens: 60 },
    })
    const plan = await classify('Research across native charts', CONTEXT)
    expect(plan.audience_tier).toBe('acharya_reviewer')
  })

  it('with planets specified in query, planets array is present', async () => {
    mockGenerateText.mockResolvedValueOnce({
      text: crossNativeResponse({ planets: ['Saturn', 'Jupiter'] }),
      usage: { promptTokens: 120, completionTokens: 60 },
    })
    const plan = await classify('Across charts with Saturn and Jupiter conjunction', CONTEXT)
    expect(plan.planets).toContain('Saturn')
    expect(plan.planets).toContain('Jupiter')
  })
})
