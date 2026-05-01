export type { AudienceTier, ContentType, DisclosureFilterResult, DisclosureFilter } from './types'
import type { AudienceTier, ContentType, DisclosureFilterResult, DisclosureFilter } from './types'

const ACHARYA_REVIEWER_SYNTHESIS_PREAMBLE = `[METHODOLOGY DISCLOSURE — For peer review of instrument reasoning.
This synthesis was produced by the MARSYS-JIS pipeline.
Calibration status: Phase 3 (pre-calibration). Use with critical judgment.]

`

const ACHARYA_REVIEWER_AUDIT_PREAMBLE = `[AUDIT VIEW — Methodology disclosure for this synthesis run.
This is the full unfiltered audit record.]

`

function filterByTier(
  content: string,
  tier: AudienceTier,
  content_type: ContentType
): DisclosureFilterResult {
  switch (tier) {
    case 'super_admin':
      return {
        filtered_content: content,
        redactions_applied: 0,
        notes: [],
      }

    case 'acharya_reviewer':
      const preamble = content_type === 'audit_view' ? ACHARYA_REVIEWER_AUDIT_PREAMBLE : ACHARYA_REVIEWER_SYNTHESIS_PREAMBLE
      return {
        filtered_content: preamble + content,
        redactions_applied: 0,
        notes: ['methodology_disclosure_prepended'],
      }

    case 'client':
      return {
        filtered_content: content,
        redactions_applied: 0,
        notes: [
          'TODO: client-tier redaction not yet implemented (M6 deliverable). Future M6 will: redact internal terminology, add calibration bands to predictive claims, remove fate-adjacent assertions.',
        ],
      }

    case 'public_redacted':
      return {
        filtered_content: content,
        redactions_applied: 0,
        notes: [
          'TODO: public_redacted-tier filtering not yet implemented (M10 deliverable). Future M10: aggregated cohort findings only, no individual chart attribution.',
        ],
      }

    default:
      const _: never = tier
      return _
  }
}

export const DISCLOSURE_FILTER: DisclosureFilter = {
  filter(content: string, tier: AudienceTier, content_type: ContentType): DisclosureFilterResult {
    return filterByTier(content, tier, content_type)
  },
}
