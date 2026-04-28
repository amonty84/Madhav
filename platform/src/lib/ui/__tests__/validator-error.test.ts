import { describe, it, expect } from 'vitest'
import { parseValidatorError } from '../validator-error'

describe('parseValidatorError', () => {
  it('returns null for null input', () => {
    expect(parseValidatorError(null)).toBeNull()
  })

  it('returns null for undefined', () => {
    expect(parseValidatorError(undefined)).toBeNull()
  })

  it('returns null for a generic error string', () => {
    expect(parseValidatorError(new Error('Network error'))).toBeNull()
  })

  it('parses a 422 validator failure JSON from error message', () => {
    const payload = {
      error: 'bundle_validation_failed',
      failures: [
        { validator_id: 'p1_layer_separation', validator_version: '1.0', vote: 'fail', reason: 'L1 mixed into L2' },
      ],
    }
    const err = new Error(JSON.stringify(payload))
    const result = parseValidatorError(err)
    expect(result).not.toBeNull()
    expect(result).toHaveLength(1)
    expect(result![0].validator_id).toBe('p1_layer_separation')
    expect(result![0].vote).toBe('fail')
  })

  it('extracts failures when JSON is embedded in a longer message', () => {
    const payload = { error: 'bundle_validation_failed', failures: [{ validator_id: 'p2_citation', validator_version: '1.0', vote: 'fail' }] }
    const err = new Error(`HTTP 422: ${JSON.stringify(payload)} — request failed`)
    const result = parseValidatorError(err)
    expect(result).not.toBeNull()
    expect(result![0].validator_id).toBe('p2_citation')
  })

  it('returns null when error key is not bundle_validation_failed', () => {
    const payload = { error: 'some_other_error', failures: [] }
    const err = new Error(JSON.stringify(payload))
    expect(parseValidatorError(err)).toBeNull()
  })

  it('returns null when failures key is missing', () => {
    const payload = { error: 'bundle_validation_failed' }
    const err = new Error(JSON.stringify(payload))
    expect(parseValidatorError(err)).toBeNull()
  })

  it('handles plain string errors with embedded JSON', () => {
    const payload = { error: 'bundle_validation_failed', failures: [{ validator_id: 'p5_signal_id_resolution', validator_version: '1.0', vote: 'fail' }] }
    const result = parseValidatorError(JSON.stringify(payload))
    expect(result).not.toBeNull()
    expect(result![0].validator_id).toBe('p5_signal_id_resolution')
  })

  it('handles multi-failure payloads', () => {
    const payload = {
      error: 'bundle_validation_failed',
      failures: [
        { validator_id: 'p1_layer_separation', validator_version: '1.0', vote: 'fail' },
        { validator_id: 'p2_citation', validator_version: '1.0', vote: 'fail', reason: 'Missing citation' },
      ],
    }
    const result = parseValidatorError(new Error(JSON.stringify(payload)))
    expect(result).toHaveLength(2)
  })
})
