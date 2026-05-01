import { telemetry } from '@/lib/telemetry/index'
import type { ValidationContext, ValidationResult, Validator } from './types'
import { INTERPRETIVE_KEYWORDS } from './constants'

const VALIDATOR_ID = 'p2_citation'
const VALIDATOR_VERSION = '1.0.0'

const CITATION_EXTRACT_PATTERN = /\[(F\.\w+|FORENSIC\.\w+|SIG\.MSR\.\w+)\]/g

const MAX_CITATION_LENGTH = 100

function hasInterpretiveContent(text: string): boolean {
  const lower = text.toLowerCase()
  return INTERPRETIVE_KEYWORDS.some((kw) => lower.includes(kw))
}

function isMalformed(citationId: string): boolean {
  if (!citationId || citationId.trim().length === 0) return true
  if (citationId.length > MAX_CITATION_LENGTH) return true
  if (/[^A-Za-z0-9_.:-]/.test(citationId)) return true
  return false
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

  const matches = [...input.matchAll(CITATION_EXTRACT_PATTERN)]
  const citationIds = matches.map((m) => m[1])

  // Check for malformed citations
  const malformed = citationIds.filter(isMalformed)
  if (malformed.length > 0) {
    const latencyMs = Date.now() - start
    telemetry.recordLatency(VALIDATOR_ID, 'validate', latencyMs)
    telemetry.recordMetric(VALIDATOR_ID, 'vote', 1, { vote: 'fail' })
    return {
      validator_id: VALIDATOR_ID,
      validator_version: VALIDATOR_VERSION,
      vote: 'fail',
      reason: `${malformed.length} malformed citation(s) found`,
      affected_claims: malformed.slice(0, 10),
    }
  }

  // Warn if synthesis has interpretive content but zero citations
  if (citationIds.length === 0 && hasInterpretiveContent(input)) {
    const latencyMs = Date.now() - start
    telemetry.recordLatency(VALIDATOR_ID, 'validate', latencyMs)
    telemetry.recordMetric(VALIDATOR_ID, 'vote', 1, { vote: 'warn' })
    return {
      validator_id: VALIDATOR_ID,
      validator_version: VALIDATOR_VERSION,
      vote: 'warn',
      reason: 'Synthesis contains interpretive language but has no citations',
    }
  }

  const latencyMs = Date.now() - start
  telemetry.recordLatency(VALIDATOR_ID, 'validate', latencyMs)
  telemetry.recordMetric(VALIDATOR_ID, 'vote', 1, { vote: 'pass' })
  return {
    validator_id: VALIDATOR_ID,
    validator_version: VALIDATOR_VERSION,
    vote: 'pass',
    reason: `${citationIds.length} citation(s) found, all well-formed`,
  }
}

export const p2Validator: Validator = {
  id: VALIDATOR_ID,
  version: VALIDATOR_VERSION,
  applies_at: 'synthesis',
  validate,
}
