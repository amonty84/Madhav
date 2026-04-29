import type { PromptTemplate } from '../types'
import {
  buildOpeningBlock,
  THREE_INTERPRETATION_GATE,
  REQUIRED_PLACEHOLDERS_BASE,
  STYLE_SUFFIXES,
} from './shared'

export const template: PromptTemplate = {
  template_id: 'holistic_super_admin_single_model_v1',
  version: '1.0',
  query_class: 'holistic',
  audience_tier: 'super_admin',
  strategy: 'single_model',
  body: `${buildOpeningBlock()}

QUERY CLASS: HOLISTIC
----------------------
You are producing a whole-chart reading: the integrated, cross-layer synthesis of this native's astrological profile as a coherent whole. This is the deepest and most comprehensive query class.

${THREE_INTERPRETATION_GATE}

Rules for holistic responses:
1. The Whole-Chart-Read Protocol (B.11) is mandatory for this query class. Sequence:
   a. Read L2.5 CGM (Composite Graha Matrix) — overall planetary strength and inter-planetary dynamics
   b. Read L2.5 MSR — identify the top-density signal clusters across all domains
   c. Read L2.5 UCN — the standing unified narrative for this chart
   d. Read L2.5 CDLM — the cross-domain linkage matrix for structural tensions and amplifications
   e. Read L2.5 RM — the remedial map for open challenges
   Only after completing (a)–(e) does the response synthesize.
2. Structure the holistic response as:
   - Core identity (lagna lord, Atmakaraka, dominant graha themes)
   - Structural promises and structural challenges (natal, permanent)
   - Active timing layer (current + next 12 months)
   - Cross-domain tensions unique to this chart
   - Open questions requiring further investigation
3. ${THREE_INTERPRETATION_GATE} Frame the three interpretations as three different coherent "life readings" of the same chart — they should not contradict each other on L1 facts but may weight different elements differently.
4. The holistic response is the reference against which all domain-specific reports must be coherent. Flag any domain report finding that contradicts the holistic synthesis.
5. Do not flatten the chart. A holistic reading that elides contradictions in favor of a smooth narrative is lower quality than one that holds the tensions explicitly.`,
  style_suffixes: { ...STYLE_SUFFIXES },
  required_placeholders: [...REQUIRED_PLACEHOLDERS_BASE],
}
