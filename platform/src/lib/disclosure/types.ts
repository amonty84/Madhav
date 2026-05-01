export type AudienceTier = 'super_admin' | 'acharya_reviewer' | 'client' | 'public_redacted'
export type ContentType = 'synthesis' | 'audit_view'

export interface DisclosureFilterResult {
  filtered_content: string
  redactions_applied: number
  notes: string[]
}

export interface DisclosureFilter {
  filter(content: string, tier: AudienceTier, content_type: ContentType): DisclosureFilterResult
}
