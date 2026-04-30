/**
 * BHISMA-B1 §3.3 (ADR-3) — Failure is loud, never silent.
 *
 * When any LLM call in the pipeline fails (network error, invalid model id,
 * schema validation failure after 2 attempts, rate limit), the pipeline halts
 * immediately and propagates a structured PipelineError. The route handler
 * catches it, emits a `step_error` trace event, and returns a structured JSON
 * error response so the UI can show a real failure message instead of a
 * silently-degraded answer.
 */

export type PipelineStage = 'classify' | 'compose' | 'tool_fetch' | 'synthesis'

export interface PipelineErrorPayload {
  stage: PipelineStage
  reason: string
  model_id?: string
  provider?: string
  /** Optional cause for chaining the underlying error in logs/telemetry. */
  cause?: unknown
}

export class PipelineError extends Error {
  readonly stage: PipelineStage
  readonly reason: string
  readonly model_id?: string
  readonly provider?: string

  constructor(payload: PipelineErrorPayload) {
    super(`[${payload.stage}] ${payload.reason}`)
    this.name = 'PipelineError'
    this.stage = payload.stage
    this.reason = payload.reason
    this.model_id = payload.model_id
    this.provider = payload.provider
    if (payload.cause !== undefined) {
      // Use the standard Error.cause when available (Node 18+).
      ;(this as Error & { cause?: unknown }).cause = payload.cause
    }
    // Restore prototype chain after `super` for cross-bundle instanceof safety.
    Object.setPrototypeOf(this, PipelineError.prototype)
  }
}

export function isPipelineError(err: unknown): err is PipelineError {
  return err instanceof PipelineError
}
