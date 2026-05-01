import { describe, it, expect, vi } from 'vitest'

vi.mock('@ai-sdk/anthropic', () => ({ anthropic: vi.fn((id: string) => ({ id, provider: 'anthropic-mock' })) }))
vi.mock('@ai-sdk/google', () => ({ google: vi.fn((id: string) => ({ id, provider: 'google-mock' })) }))
vi.mock('@ai-sdk/deepseek', () => ({ deepseek: vi.fn((id: string) => ({ id, provider: 'deepseek-mock' })) }))
vi.mock('@ai-sdk/openai', () => ({ openai: vi.fn((id: string) => ({ id, provider: 'openai-mock' })) }))
vi.mock('server-only', () => ({}))

describe('resolveModel — openai case', () => {
  it('resolves an openai model without throwing', async () => {
    const { resolveModel } = await import('@/lib/models/resolver')
    const { MODELS } = await import('@/lib/models/registry')
    const gpt = MODELS.find(m => m.provider === 'openai')
    expect(gpt).toBeDefined()
    const model = resolveModel(gpt!.id)
    expect(model).toBeDefined()
  })
})
