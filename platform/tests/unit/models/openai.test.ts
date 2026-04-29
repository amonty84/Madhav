import { describe, it, expect, vi } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('@ai-sdk/openai', () => ({
  openai: vi.fn((modelId: string) => ({ modelId, provider: 'openai-mock' })),
}))

describe('getOpenAIModel', () => {
  it('returns a language model for a valid model ID', async () => {
    const { getOpenAIModel } = await import('@/lib/models/openai')
    const model = getOpenAIModel('gpt-4.1')
    expect(model).toBeDefined()
  })
})
