import { describe, it, expect, vi, beforeEach } from 'vitest'

// AI SDK + model resolver are mocked so the test never makes a live call.
const generateTextMock = vi.fn()
vi.mock('ai', () => ({
  generateText: (...args: unknown[]) => generateTextMock(...args),
}))
vi.mock('@/lib/models/resolver', () => ({
  resolveModel: (id: string) => ({ __mocked_model_id: id }),
}))

// Import AFTER the mocks are registered.
import { buildPlannerContext } from '@/lib/pipeline/planner_context_builder'

const WORKER = 'mock-worker'

beforeEach(() => {
  generateTextMock.mockReset()
})

describe('buildPlannerContext — ≤600-token planner history window', () => {
  it('empty history → history_turns = [], history_was_summarized = false', async () => {
    const ctx = await buildPlannerContext('What does Saturn signify here?', [], WORKER)
    expect(ctx.history_turns).toEqual([])
    expect(ctx.history_was_summarized).toBe(false)
    // total_estimated_tokens equals query tokens alone.
    expect(ctx.total_estimated_tokens).toBe(Math.ceil('What does Saturn signify here?'.length / 4))
    expect(generateTextMock).not.toHaveBeenCalled()
  })

  it('2 short turns → pass-through unchanged, no summarization', async () => {
    const history = [
      { role: 'user',      content: 'hello' },
      { role: 'assistant', content: 'hi, how can I help?' },
    ]
    const ctx = await buildPlannerContext('next query', history, WORKER)
    expect(ctx.history_was_summarized).toBe(false)
    expect(ctx.history_turns).toEqual([
      { role: 'user',      content: 'hello' },
      { role: 'assistant', content: 'hi, how can I help?' },
    ])
    expect(generateTextMock).not.toHaveBeenCalled()
  })

  it('3+ turns → only the last 2 are included', async () => {
    const history = [
      { role: 'user',      content: 'first turn — ignored'        },
      { role: 'assistant', content: 'second turn — also ignored'  },
      { role: 'user',      content: 'third turn — kept'           },
      { role: 'assistant', content: 'fourth turn — also kept'     },
    ]
    const ctx = await buildPlannerContext('q', history, WORKER)
    expect(ctx.history_was_summarized).toBe(false)
    expect(ctx.history_turns).toHaveLength(2)
    expect(ctx.history_turns[0].content).toBe('third turn — kept')
    expect(ctx.history_turns[1].content).toBe('fourth turn — also kept')
    expect(generateTextMock).not.toHaveBeenCalled()
  })

  it('single turn > 300 tokens → truncated to 300 tokens', async () => {
    // 1500 chars ≈ 375 tokens — over the 300-token-per-turn cap, but raw
    // combined (375) still ≤ 600, so summarization does NOT trigger; per-turn
    // truncation is the path under test.
    const longContent = 'x'.repeat(1500)
    const ctx = await buildPlannerContext('q', [
      { role: 'user', content: longContent },
    ], WORKER)
    expect(ctx.history_was_summarized).toBe(false)
    expect(ctx.history_turns).toHaveLength(1)
    expect(ctx.history_turns[0].content.length).toBe(1200) // 300 tokens × 4 chars
    expect(Math.ceil(ctx.history_turns[0].content.length / 4)).toBe(300)
    expect(generateTextMock).not.toHaveBeenCalled()
  })

  it('combined raw history > 600 tokens → summarized via worker model', async () => {
    // Two turns each at ~500 tokens → raw combined ≈ 1000 tokens (>600).
    const longA = 'a'.repeat(2000)  // 500 tokens
    const longB = 'b'.repeat(2000)  // 500 tokens

    generateTextMock.mockResolvedValueOnce({ text: 'condensed dialogue summary preserving Saturn-career context.' })

    const ctx = await buildPlannerContext('next query', [
      { role: 'user',      content: longA },
      { role: 'assistant', content: longB },
    ], WORKER)

    expect(ctx.history_was_summarized).toBe(true)
    expect(ctx.history_turns).toHaveLength(1)
    expect(ctx.history_turns[0].role).toBe('user')
    expect(ctx.history_turns[0].content).toContain('condensed dialogue summary')
    // Summary stays well within 150 tokens (≤600 chars).
    expect(Math.ceil(ctx.history_turns[0].content.length / 4)).toBeLessThanOrEqual(150)
    // Worker model invoked exactly once with the resolved model handle.
    expect(generateTextMock).toHaveBeenCalledTimes(1)
    const callArg = generateTextMock.mock.calls[0][0] as { model: { __mocked_model_id: string } }
    expect(callArg.model.__mocked_model_id).toBe(WORKER)
    // total_estimated_tokens = query_tokens + summary_tokens (post-summarize).
    const expectedTotal =
      Math.ceil('next query'.length / 4) +
      Math.ceil(ctx.history_turns[0].content.length / 4)
    expect(ctx.total_estimated_tokens).toBe(expectedTotal)
  })

  it('summary that exceeds 150 tokens is truncated to 150 tokens', async () => {
    // Worker hallucinates a 300-token summary; builder must clamp.
    generateTextMock.mockResolvedValueOnce({ text: 's'.repeat(2000) })  // 500 tokens raw

    const ctx = await buildPlannerContext('q', [
      { role: 'user',      content: 'a'.repeat(2000) },
      { role: 'assistant', content: 'b'.repeat(2000) },
    ], WORKER)

    expect(ctx.history_was_summarized).toBe(true)
    expect(Math.ceil(ctx.history_turns[0].content.length / 4)).toBeLessThanOrEqual(150)
  })
})
