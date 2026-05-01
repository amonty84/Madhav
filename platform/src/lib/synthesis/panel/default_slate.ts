/**
 * MARSYS-JIS Phase 7 — Default panel slate + adjudicator pool
 * schema_version: 1.0
 *
 * The default panel uses one model per provider family so the adjudicator
 * family-exclusion rule has a clear non-overlapping candidate. The slate is
 * defined here (not inline in member_runner) for easy override by the native.
 *
 * Default slate: anthropic + openai + google (3 members)
 * Default adjudicator: deepseek (the family not in the default slate)
 */

import type { PanelMemberConfig, AdjudicatorConfig } from './types'
import type { Provider } from '@/lib/models/registry'

export const DEFAULT_PANEL_SLATE: PanelMemberConfig[] = [
  {
    provider_family: 'anthropic',
    model_id: 'claude-sonnet-4-6',
    prompt_variant_tag: 'panel_member_v1',
  },
  {
    provider_family: 'openai',
    model_id: 'gpt-4.1',
    prompt_variant_tag: 'panel_member_v1',
  },
  {
    provider_family: 'google',
    model_id: 'gemini-2.5-pro',
    prompt_variant_tag: 'panel_member_v1',
  },
]

/** All 4 provider families as candidate adjudicators (in priority order). */
export const ADJUDICATOR_CANDIDATE_POOL: AdjudicatorConfig[] = [
  { provider_family: 'deepseek', model_id: 'deepseek-chat' },
  { provider_family: 'anthropic', model_id: 'claude-sonnet-4-6' },
  { provider_family: 'openai', model_id: 'gpt-4.1' },
  { provider_family: 'google', model_id: 'gemini-2.5-pro' },
]

/**
 * Select an adjudicator whose provider family is not present in the panel slate.
 * Throws if no candidate satisfies the family-exclusion constraint.
 */
export function selectAdjudicator(
  memberSlate: PanelMemberConfig[],
  candidatePool: AdjudicatorConfig[] = ADJUDICATOR_CANDIDATE_POOL,
): AdjudicatorConfig {
  const usedFamilies = new Set<Provider>(memberSlate.map(m => m.provider_family))

  const candidate = candidatePool.find(c => !usedFamilies.has(c.provider_family))
  if (!candidate) {
    throw new Error(
      `Panel adjudicator family-exclusion: no candidate available. ` +
        `All ${candidatePool.length} candidates share a provider family with the panel slate ` +
        `[${[...usedFamilies].join(', ')}]. Add a candidate from a distinct family.`,
    )
  }
  return candidate
}
