import { describe, it, expect } from 'vitest'
import { MODELS, getModelMeta, isValidModelId, supports, modelsByProvider, PROVIDER_LABEL } from '@/lib/models/registry'

describe('Model registry — OpenAI entry', () => {
  const gpt = MODELS.find(m => m.provider === 'openai')

  it('has at least one OpenAI model', () => {
    expect(gpt).toBeDefined()
  })

  it('has required fields', () => {
    expect(gpt!.id).toBeTruthy()
    expect(gpt!.label).toBeTruthy()
    expect(gpt!.maxOutputTokens).toBeGreaterThan(0)
    expect(gpt!.provider).toBe('openai')
  })

  it('OpenAI supports tool-use', () => {
    expect(supports(gpt!.id, 'tool-use')).toBe(true)
  })

  it('getModelMeta finds it by id', () => {
    expect(getModelMeta(gpt!.id)).toBe(gpt)
  })

  it('isValidModelId returns true for it', () => {
    expect(isValidModelId(gpt!.id)).toBe(true)
  })

  it('modelsByProvider includes an openai group', () => {
    const groups = modelsByProvider()
    expect(groups.some(g => g.provider === 'openai')).toBe(true)
  })

  it('PROVIDER_LABEL has openai entry', () => {
    expect(PROVIDER_LABEL['openai']).toBe('OpenAI')
  })
})
