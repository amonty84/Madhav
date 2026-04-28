import { telemetry } from '@/lib/telemetry/index'
import type { ValidationContext, ValidationResult, Validator } from './types'
import { INTERPRETIVE_KEYWORDS } from './constants'

const VALIDATOR_ID = 'p1_layer_separation'
const VALIDATOR_VERSION = '1.0.0'

const CITATION_PATTERN = /\[[A-Z0-9_.]+\]/

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

function isInterpretive(sentence: string): boolean {
  const lower = sentence.toLowerCase()
  return INTERPRETIVE_KEYWORDS.some((kw) => lower.includes(kw))
}

function hasCitation(sentence: string): boolean {
  return CITATION_PATTERN.test(sentence)
}

async function validate(
  input: unknown,
  _context?: ValidationContext
): Promise<ValidationResult> {
  const start = Date.now()

  if (typeof input !== 'string') {
    const latencyMs = Date.now() - start
    telemetry.recordLatency(VALIDATOR_ID, 'validate', latencyMs)
    telemetry.recordMetric(VALIDATOR_ID, 'vote', 1, { vote: 'fail' })
    return {
      validator_id: VALIDATOR_ID,
      validator_version: VALIDATOR_VERSION,
      vote: 'fail',
      reason: 'Input must be a string (synthesis text)',
    }
  }

  const sentences = splitSentences(input)
  const interpretiveSentences = sentences.filter(isInterpretive)

  if (interpretiveSentences.length === 0) {
    const latencyMs = Date.now() - start
    telemetry.recordLatency(VALIDATOR_ID, 'validate', latencyMs)
    telemetry.recordMetric(VALIDATOR_ID, 'vote', 1, { vote: 'pass' })
    return {
      validator_id: VALIDATOR_ID,
      validator_version: VALIDATOR_VERSION,
      vote: 'pass',
      reason: 'No interpretive sentences found',
    }
  }

  const missingCitation = interpretiveSentences.filter((s) => !hasCitation(s))

  if (missingCitation.length === 0) {
    const latencyMs = Date.now() - start
    telemetry.recordLatency(VALIDATOR_ID, 'validate', latencyMs)
    telemetry.recordMetric(VALIDATOR_ID, 'vote', 1, { vote: 'pass' })
    return {
      validator_id: VALIDATOR_ID,
      validator_version: VALIDATOR_VERSION,
      vote: 'pass',
      reason: 'All interpretive sentences have citations',
    }
  }

  // >50% of interpretive sentences lack citations → fail
  // Some lack citations but not all → could be warn or fail depending on ratio
  const missingRatio = missingCitation.length / interpretiveSentences.length

  // If ALL interpretive sentences lack citations → fail
  // If >50% lack citations → also fail per spec ("warn if >50% lack citations but at least some have them")
  // So warn only when: some lack citations AND ≤50% lack citations (meaning >50% have them)
  const withCitation = interpretiveSentences.length - missingCitation.length
  const hasSome = withCitation > 0

  const vote = !hasSome || missingRatio > 0.5 ? 'fail' : 'warn'

  const latencyMs = Date.now() - start
  telemetry.recordLatency(VALIDATOR_ID, 'validate', latencyMs)
  telemetry.recordMetric(VALIDATOR_ID, 'vote', 1, { vote })

  return {
    validator_id: VALIDATOR_ID,
    validator_version: VALIDATOR_VERSION,
    vote,
    reason: `${missingCitation.length}/${interpretiveSentences.length} interpretive sentences lack citations`,
    affected_claims: missingCitation.slice(0, 10), // cap at 10 for payload size
  }
}

export const p1Validator: Validator = {
  id: VALIDATOR_ID,
  version: VALIDATOR_VERSION,
  applies_at: 'synthesis',
  validate,
}
