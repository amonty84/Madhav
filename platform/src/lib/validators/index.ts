import { p1Validator } from './p1_layer_separation'
import { p2Validator } from './p2_citation'
import { p5Validator } from './p5_signal_id_resolution'
import type { Validator, ValidationResult, ValidatorVote, ValidationContext } from './types'

export * from './types'
export { p1Validator, p2Validator, p5Validator }

export const VALIDATORS: Validator[] = [p1Validator, p2Validator, p5Validator]

/**
 * Run all validators that apply at the given stage.
 * For bundle stage, no validators currently apply → returns [].
 */
export async function runAll(
  input: unknown,
  applies_at: 'bundle' | 'synthesis',
  context?: ValidationContext
): Promise<ValidationResult[]> {
  const applicable = VALIDATORS.filter(
    (v) => v.applies_at === applies_at || v.applies_at === 'both'
  )

  if (applicable.length === 0) return []

  const results = await Promise.all(
    applicable.map((v) => v.validate(input, context))
  )

  return results
}

/**
 * Summarize a set of ValidationResults using worst-vote semantics:
 *   any fail  → overall fail
 *   any warn (no fails) → warn
 *   all pass  → pass
 */
export function summarize(results: ValidationResult[]): {
  overall: ValidatorVote
  by_validator: Record<string, ValidatorVote>
  failures: ValidationResult[]
} {
  const by_validator: Record<string, ValidatorVote> = {}

  for (const r of results) {
    by_validator[r.validator_id] = r.vote
  }

  const failures = results.filter((r) => r.vote === 'fail')
  const hasWarn = results.some((r) => r.vote === 'warn')

  let overall: ValidatorVote = 'pass'
  if (failures.length > 0) {
    overall = 'fail'
  } else if (hasWarn) {
    overall = 'warn'
  }

  return { overall, by_validator, failures }
}
