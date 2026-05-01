export type ValidatorVote = 'pass' | 'warn' | 'fail'

export interface ValidationResult {
  validator_id: string
  validator_version: string
  vote: ValidatorVote
  reason?: string
  affected_claims?: string[]
}

export interface ValidationContext {
  query_plan?: import('@/lib/router/types').QueryPlan
  bundle?: import('@/lib/bundle/types').Bundle
  manifest_fingerprint?: string
}

export interface Validator {
  id: string
  version: string
  applies_at: 'bundle' | 'synthesis' | 'both'
  validate(input: unknown, context?: ValidationContext): Promise<ValidationResult>
}
