import { telemetry } from '@/lib/telemetry/index'
import type { ValidationContext, ValidationResult, Validator } from './types'

const VALIDATOR_ID = 'p5_signal_id_resolution'
const VALIDATOR_VERSION = '1.0.0'

const SIGNAL_EXTRACT_PATTERN = /SIG\.MSR\.([A-Z0-9_]+)/g

const MAX_SIGNAL_ID_LENGTH = 80

function isMalformed(component: string): boolean {
  if (!component || component.trim().length === 0) return true
  const fullId = `SIG.MSR.${component}`
  if (fullId.length > MAX_SIGNAL_ID_LENGTH) return true
  if (!/^[A-Z0-9_]+$/.test(component)) return true
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

  const matches = [...input.matchAll(SIGNAL_EXTRACT_PATTERN)]
  const components = matches.map((m) => m[1])

  if (components.length === 0) {
    const latencyMs = Date.now() - start
    telemetry.recordLatency(VALIDATOR_ID, 'validate', latencyMs)
    telemetry.recordMetric(VALIDATOR_ID, 'vote', 1, { vote: 'pass' })
    return {
      validator_id: VALIDATOR_ID,
      validator_version: VALIDATOR_VERSION,
      vote: 'pass',
      reason: 'No SIG.MSR.* signal IDs found in synthesis',
    }
  }

  const malformed = components.filter(isMalformed)
  if (malformed.length > 0) {
    const latencyMs = Date.now() - start
    telemetry.recordLatency(VALIDATOR_ID, 'validate', latencyMs)
    telemetry.recordMetric(VALIDATOR_ID, 'vote', 1, { vote: 'fail' })
    return {
      validator_id: VALIDATOR_ID,
      validator_version: VALIDATOR_VERSION,
      vote: 'fail',
      reason: `${malformed.length} malformed signal ID(s) found`,
      affected_claims: malformed.map((c) => `SIG.MSR.${c}`).slice(0, 10),
    }
  }

  const latencyMs = Date.now() - start
  telemetry.recordLatency(VALIDATOR_ID, 'validate', latencyMs)
  telemetry.recordMetric(VALIDATOR_ID, 'vote', 1, { vote: 'pass' })
  return {
    validator_id: VALIDATOR_ID,
    validator_version: VALIDATOR_VERSION,
    vote: 'pass',
    reason: `${components.length} signal ID(s) found, all valid format (Phase 3: format-only check)`,
  }
}

export const p5Validator: Validator = {
  id: VALIDATOR_ID,
  version: VALIDATOR_VERSION,
  applies_at: 'synthesis',
  validate,
}
