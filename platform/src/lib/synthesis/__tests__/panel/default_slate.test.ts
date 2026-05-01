import { describe, it, expect, beforeEach } from 'vitest'

import {
  DEFAULT_PANEL_SLATE,
  ADJUDICATOR_CANDIDATE_POOL,
  selectAdjudicator,
} from '../../panel/default_slate'
import type { PanelMemberConfig, AdjudicatorConfig } from '../../panel/types'

beforeEach(() => {
  // No mocks needed — pure functions only
})

describe('DEFAULT_PANEL_SLATE', () => {
  it('contains exactly 3 members from distinct provider families', () => {
    expect(DEFAULT_PANEL_SLATE).toHaveLength(3)
    const families = DEFAULT_PANEL_SLATE.map(m => m.provider_family)
    const unique = new Set(families)
    expect(unique.size).toBe(3)
  })

  it('covers anthropic, openai, and google families', () => {
    const families = new Set(DEFAULT_PANEL_SLATE.map(m => m.provider_family))
    expect(families.has('anthropic')).toBe(true)
    expect(families.has('openai')).toBe(true)
    expect(families.has('google')).toBe(true)
  })
})

describe('ADJUDICATOR_CANDIDATE_POOL', () => {
  it('has deepseek as the first candidate', () => {
    expect(ADJUDICATOR_CANDIDATE_POOL[0].provider_family).toBe('deepseek')
  })

  it('includes all 4 provider families', () => {
    const families = new Set(ADJUDICATOR_CANDIDATE_POOL.map(c => c.provider_family))
    expect(families.has('deepseek')).toBe(true)
    expect(families.has('anthropic')).toBe(true)
    expect(families.has('openai')).toBe(true)
    expect(families.has('google')).toBe(true)
  })
})

describe('selectAdjudicator', () => {
  it('returns deepseek when slate uses anthropic+openai+google (default slate)', () => {
    const result = selectAdjudicator(DEFAULT_PANEL_SLATE)
    expect(result.provider_family).toBe('deepseek')
    expect(result.model_id).toBe('deepseek-chat')
  })

  it('picks the first candidate whose family is absent from the slate', () => {
    const slate: PanelMemberConfig[] = [
      { provider_family: 'deepseek', model_id: 'deepseek-chat' },
      { provider_family: 'openai', model_id: 'gpt-4.1' },
      { provider_family: 'google', model_id: 'gemini-2.5-pro' },
    ]
    // Candidate pool priority: deepseek → anthropic → openai → google
    // deepseek is in slate, openai is in slate, google is in slate — anthropic is first available
    const result = selectAdjudicator(slate)
    expect(result.provider_family).toBe('anthropic')
  })

  it('uses a custom candidatePool when provided', () => {
    const slate: PanelMemberConfig[] = [
      { provider_family: 'anthropic', model_id: 'claude-sonnet-4-6' },
    ]
    const pool: AdjudicatorConfig[] = [
      { provider_family: 'anthropic', model_id: 'claude-sonnet-4-6' }, // excluded
      { provider_family: 'openai', model_id: 'gpt-4.1' },              // first available
    ]
    const result = selectAdjudicator(slate, pool)
    expect(result.provider_family).toBe('openai')
  })

  it('throws when all candidates share a family with the slate', () => {
    const slate: PanelMemberConfig[] = [
      { provider_family: 'anthropic', model_id: 'claude-sonnet-4-6' },
      { provider_family: 'openai', model_id: 'gpt-4.1' },
    ]
    const pool: AdjudicatorConfig[] = [
      { provider_family: 'anthropic', model_id: 'claude-opus-4' },
      { provider_family: 'openai', model_id: 'gpt-4o' },
    ]
    expect(() => selectAdjudicator(slate, pool)).toThrow(
      /Panel adjudicator family-exclusion/,
    )
  })

  it('throws with a message listing the occupied families', () => {
    const slate: PanelMemberConfig[] = [
      { provider_family: 'deepseek', model_id: 'deepseek-chat' },
      { provider_family: 'anthropic', model_id: 'claude-sonnet-4-6' },
      { provider_family: 'openai', model_id: 'gpt-4.1' },
      { provider_family: 'google', model_id: 'gemini-2.5-pro' },
    ]
    // All 4 families occupied, default pool exhausted
    expect(() => selectAdjudicator(slate)).toThrow(/deepseek|anthropic|openai|google/)
  })

  it('throws when candidatePool is empty', () => {
    expect(() => selectAdjudicator(DEFAULT_PANEL_SLATE, [])).toThrow(
      /Panel adjudicator family-exclusion/,
    )
  })
})
