import { describe, it, expect, vi, beforeEach } from 'vitest'

// AI SDK + model resolver are mocked so the test never makes a live call.
const generateObjectMock = vi.fn()
const generateTextMock = vi.fn()
vi.mock('ai', () => ({
  generateObject: (...args: unknown[]) => generateObjectMock(...args),
  generateText: (...args: unknown[]) => generateTextMock(...args),
}))
vi.mock('@/lib/models/resolver', () => ({
  resolveModel: (id: string) => ({ __mocked_model_id: id }),
}))

// Import AFTER the mocks are registered.
import {
  callLlmPlanner,
  PlannerError,
  __resetManifestCacheForTests,
  type PlanSchema,
} from '@/lib/pipeline/manifest_planner'
import { estimateTokens } from '@/lib/pipeline/manifest_compressor'

const PLANNER_MODEL = 'mock-planner-fast'
const NATIVE_ID = 'chart-abc-123'

function planRemedial(): PlanSchema {
  return {
    query_class: 'remedial',
    query_intent_summary: 'Remedial actions for Saturn friction in career domain.',
    tool_calls: [
      {
        tool_name: 'remedial_codex_query',
        params: { planet: 'Saturn', limit: 8 },
        token_budget: 700,
        priority: 1,
        reason: 'Saturn-specific propitiation, gemstone, mantra, dinacharya guidance.',
      },
      {
        tool_name: 'msr_sql',
        params: { domains: ['career'], planets: ['Saturn'], forward_looking: true },
        token_budget: 900,
        priority: 1,
        reason: 'Surface forward-looking career signals involving Saturn.',
      },
      {
        tool_name: 'pattern_register',
        params: { domains: ['career'], forward_looking: true },
        token_budget: 400,
        priority: 2,
        reason: 'Confirm cross-domain Saturn-career pattern before prescribing.',
      },
    ],
  }
}

function planInterpretive(): PlanSchema {
  return {
    query_class: 'interpretive',
    query_intent_summary: 'Interpret Mars-8H influence on relationships domain.',
    tool_calls: [
      {
        tool_name: 'msr_sql',
        params: { planets: ['Mars'], domains: ['relationships'] },
        token_budget: 800,
        priority: 1,
        reason: 'Pull Mars-relationship signals; foundation for interpretation.',
      },
      {
        tool_name: 'cgm_graph_walk',
        params: { graph_seed_hints: ['PLN.Mars', 'HSE.8'], graph_traversal_depth: 2 },
        token_budget: 700,
        priority: 1,
        reason: 'Walk Mars and 8H neighborhoods; pick up dispositors and aspects.',
      },
    ],
  }
}

beforeEach(() => {
  generateObjectMock.mockReset()
  generateTextMock.mockReset()
  __resetManifestCacheForTests()
})

describe('callLlmPlanner — LLM-first planner', () => {
  it('PASS remedial: returns valid PlanSchema with remedial_codex_query', async () => {
    generateObjectMock.mockResolvedValueOnce({ object: planRemedial() })

    const plan = await callLlmPlanner(
      'I keep getting Saturn-related friction in my career. What can I actually do about it?',
      [],
      PLANNER_MODEL,
      NATIVE_ID,
    )

    expect(plan.query_class).toBe('remedial')
    const toolNames = plan.tool_calls.map(tc => tc.tool_name)
    expect(toolNames).toContain('remedial_codex_query')
    expect(generateObjectMock).toHaveBeenCalledTimes(1)

    // The resolved model handle the planner used must come from the planner-fast slot.
    const callArg = generateObjectMock.mock.calls[0][0] as { model: { __mocked_model_id: string } }
    expect(callArg.model.__mocked_model_id).toBe(PLANNER_MODEL)
  })

  it('PASS interpretive: returns valid PlanSchema with msr_sql', async () => {
    generateObjectMock.mockResolvedValueOnce({ object: planInterpretive() })

    const plan = await callLlmPlanner(
      'How does my Mars in the 8th house actually express in relationships?',
      [],
      PLANNER_MODEL,
      NATIVE_ID,
    )

    expect(plan.query_class).toBe('interpretive')
    const toolNames = plan.tool_calls.map(tc => tc.tool_name)
    expect(toolNames).toContain('msr_sql')
  })

  it('PlannerError on bad output: provider throws → callLlmPlanner throws PlannerError', async () => {
    const providerError = new Error('upstream JSON parse failure')
    generateObjectMock.mockRejectedValueOnce(providerError)

    await expect(
      callLlmPlanner('any query', [], PLANNER_MODEL, NATIVE_ID),
    ).rejects.toBeInstanceOf(PlannerError)

    // And the original error is attached as `cause`.
    generateObjectMock.mockRejectedValueOnce(providerError)
    try {
      await callLlmPlanner('any query', [], PLANNER_MODEL, NATIVE_ID)
      expect.fail('expected PlannerError')
    } catch (err) {
      expect(err).toBeInstanceOf(PlannerError)
      expect((err as PlannerError).cause).toBe(providerError)
    }
  })

  it('Token budget: compressed manifest + history combined ≤ 5000 tokens', async () => {
    generateObjectMock.mockResolvedValueOnce({ object: planRemedial() })

    const query = 'What does my chart say about career and Saturn over the next 12 months?'
    await callLlmPlanner(query, [], PLANNER_MODEL, NATIVE_ID)

    // Inspect the actual user message sent to the LLM and assert its token
    // estimate stays within the PLANNER_PROMPT v1.0 budget envelope.
    const callArg = generateObjectMock.mock.calls[0][0] as {
      messages: Array<{ role: string; content: string }>
      system: string
    }
    const userMessage = callArg.messages[0].content
    const combinedTokens = estimateTokens(callArg.system) + estimateTokens(userMessage)
    expect(combinedTokens).toBeLessThanOrEqual(5000)
  })

  it('nativeId threaded: native_id appears in the constructed prompt string', async () => {
    generateObjectMock.mockResolvedValueOnce({ object: planRemedial() })

    await callLlmPlanner('q', [], PLANNER_MODEL, NATIVE_ID)

    const callArg = generateObjectMock.mock.calls[0][0] as {
      messages: Array<{ role: string; content: string }>
    }
    const userMessage = callArg.messages[0].content
    expect(userMessage).toContain(NATIVE_ID)
    expect(userMessage).toContain('"native_id"')
  })
})
