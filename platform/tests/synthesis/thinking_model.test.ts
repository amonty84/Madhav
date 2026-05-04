import { describe, it, expect } from 'vitest'
import { getModelMeta } from '@/lib/models/registry'

// AC.4 — verify isThinkingModel detection logic covers both deepseek-v4-pro
// and deepseek-reasoner without requiring the model stacks to be live.
// The logic mirrors single_model_strategy.ts onFinish:
//   selected_model_id === 'deepseek-reasoner' ||
//   getModelMeta(selected_model_id)?.hint?.toLowerCase().includes('thinking')
function isThinkingModel(modelId: string): boolean {
  return (
    modelId === 'deepseek-reasoner' ||
    (getModelMeta(modelId)?.hint?.toLowerCase().includes('thinking') ?? false)
  )
}

describe('isThinkingModel detection — AC.4', () => {
  it('deepseek-reasoner is always a thinking model', () => {
    expect(isThinkingModel('deepseek-reasoner')).toBe(true)
  })

  it('deepseek-v4-pro is detected as thinking model via hint', () => {
    const meta = getModelMeta('deepseek-v4-pro')
    expect(meta).toBeDefined()
    expect(meta?.hint?.toLowerCase()).toMatch(/thinking/)
    expect(isThinkingModel('deepseek-v4-pro')).toBe(true)
  })

  it('deepseek-v4-flash (non-thinking) is NOT a thinking model', () => {
    expect(isThinkingModel('deepseek-v4-flash')).toBe(false)
  })

  it('claude-sonnet-4-6 is NOT a thinking model', () => {
    expect(isThinkingModel('claude-sonnet-4-6')).toBe(false)
  })
})
