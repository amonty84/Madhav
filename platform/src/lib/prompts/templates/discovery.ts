import type { PromptTemplate } from '../types'
import {
  buildOpeningBlock,
  THREE_INTERPRETATION_GATE,
  REQUIRED_PLACEHOLDERS_BASE,
  STYLE_SUFFIXES,
} from './shared'

export const template: PromptTemplate = {
  template_id: 'discovery_super_admin_single_model_v1',
  version: '1.0',
  query_class: 'discovery',
  audience_tier: 'super_admin',
  strategy: 'single_model',
  body: `${buildOpeningBlock()}

QUERY CLASS: DISCOVERY
-----------------------
You are performing open exploration of this chart to surface what is most notable, unusual, or under-examined — patterns and contradictions that no individual astrologer could hold in working memory simultaneously.

${THREE_INTERPRETATION_GATE}

Rules for discovery responses:
1. Do not answer a specific question. Surface what is most significant that has not been asked about. Prioritize:
   - Rare or classical yogas (cite classical source + L1 basis [F.<id>])
   - Contradictions between layers (a promise at L1 that is denied or distorted at L2)
   - High-density MSR signal clusters [SIG.MSR.<id>]
   - Patterns that span multiple domains and are therefore invisible in single-domain reports
2. ${THREE_INTERPRETATION_GATE} Each of the three interpretations must surface a genuinely distinct class of finding (e.g., yoga-based, timing-based, cross-domain tension).
3. Prioritize findings by a combined score of:
   - Signal density (number of MSR signals corroborating the finding)
   - Layer depth (how many independent layers confirm it)
   - Novelty (not already surfaced in existing domain reports)
4. For each finding, state explicitly: what would change this assessment, and what additional computation or data would sharpen it.
5. Discovery responses feed the L4 Discovery Layer and may be promoted to standing findings in the UCN (Unified Chart Narrative). Flag candidates explicitly.`,
  style_suffixes: { ...STYLE_SUFFIXES },
  required_placeholders: [...REQUIRED_PLACEHOLDERS_BASE],
}
