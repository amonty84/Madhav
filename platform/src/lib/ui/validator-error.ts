/**
 * Utility to detect and extract structured validator failure payloads from
 * chat errors. The consume route returns HTTP 422 with body:
 *   { error: 'bundle_validation_failed', failures: ValidationResult[] }
 * The @ai-sdk/react transport surfaces this as chat.error with the response
 * body stringified in the message.
 */

export interface ValidatorFailure {
  validator_id: string
  validator_version: string
  vote: 'fail' | 'warn' | 'pass'
  reason?: string
  affected_claims?: string[]
}

export interface ValidatorErrorPayload {
  error: 'bundle_validation_failed'
  failures: ValidatorFailure[]
}

/**
 * Try to extract a structured validator failure payload from a chat error.
 * Returns null if the error is not a validator failure (generic error, network
 * error, etc.) so callers can fall back to the standard error display.
 */
export function parseValidatorError(error: unknown): ValidatorFailure[] | null {
  if (!error) return null

  const message = errorMessage(error)
  if (!message) return null

  // The ai SDK may wrap the JSON body in the error message, or return it directly.
  // Try to find a JSON object anywhere in the message string.
  const jsonStart = message.indexOf('{')
  const jsonEnd = message.lastIndexOf('}')
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) return null

  let parsed: unknown
  try {
    parsed = JSON.parse(message.slice(jsonStart, jsonEnd + 1))
  } catch {
    return null
  }

  if (!isValidatorErrorPayload(parsed)) return null
  return parsed.failures
}

function isValidatorErrorPayload(v: unknown): v is ValidatorErrorPayload {
  if (!v || typeof v !== 'object') return false
  const obj = v as Record<string, unknown>
  return (
    obj.error === 'bundle_validation_failed' &&
    Array.isArray(obj.failures)
  )
}

function errorMessage(error: unknown): string | null {
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message)
  }
  return null
}
