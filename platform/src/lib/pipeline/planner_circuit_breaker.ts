/**
 * planner_circuit_breaker.ts — UQE-5c (W2-TRACE-A).
 *
 * Three-state breaker that protects the request path against a degraded
 * planner provider. Wraps `callLlmPlanner` so a sustained outage stops
 * burning latency on guaranteed failures and lets the route fall back
 * silently to the classify() + compose_bundle() path.
 *
 *   closed     → calls pass through; track consecutive failures
 *   open       → reject immediately without invoking fn; recover after Δt
 *   half-open  → allow one probe; success → closed, failure → open
 *
 * Trip counter increments on:
 *   - PlannerError thrown by callLlmPlanner
 *   - timeout (Promise.race against timeoutMs)
 *   - any error whose message contains a 5xx hint from the provider
 *
 * Module-level singleton. Survives across requests in the same Node
 * process (separate Cloud Run instances trip independently — desired:
 * an instance with a localised provider hiccup is what we're protecting).
 */

import type { PlanSchema } from '@/lib/pipeline/manifest_planner'
import { PlannerError } from '@/lib/pipeline/manifest_planner'

export type CircuitState = 'closed' | 'open' | 'half-open'

export interface CircuitBreakerOptions {
  failureThreshold: number
  recoveryMs: number
  timeoutMs: number
}

export class PlannerCircuitOpenError extends Error {
  constructor() {
    super('Planner circuit breaker is open — request rejected')
    this.name = 'PlannerCircuitOpenError'
  }
}

const DEFAULT_OPTIONS: CircuitBreakerOptions = {
  failureThreshold: 3,
  recoveryMs: 300_000,
  // Raised 5s→15s 2026-05-05 GANGA-PLANNER-FIX-S1:
  // 5s timeout tripped the breaker on providers with >5s cold-start (nemotron-49B: 6.8s).
  // 15s covers known worst-case cold-starts across all confirmed-live NIM models.
  // The breaker's purpose is to stop sustained outages, not catch slow cold-starts.
  timeoutMs: 15_000,
}

function looksLike5xx(err: unknown): boolean {
  if (!err) return false
  const msg = err instanceof Error ? err.message : String(err)
  return /\b5\d\d\b/.test(msg)
}

export class PlannerCircuitBreaker {
  private readonly opts: CircuitBreakerOptions
  private _state: CircuitState = 'closed'
  private failures = 0
  private openedAt = 0

  constructor(options?: Partial<CircuitBreakerOptions>) {
    this.opts = { ...DEFAULT_OPTIONS, ...options }
  }

  get state(): CircuitState {
    if (this._state === 'open' && Date.now() - this.openedAt >= this.opts.recoveryMs) {
      this._state = 'half-open'
    }
    return this._state
  }

  reset(): void {
    this._state = 'closed'
    this.failures = 0
    this.openedAt = 0
  }

  getMetrics(): { state: CircuitState; failures: number; openedAt: number | null } {
    return {
      state: this.state,
      failures: this.failures,
      openedAt: this.openedAt > 0 ? this.openedAt : null,
    }
  }

  async call(fn: () => Promise<PlanSchema>): Promise<PlanSchema> {
    // Refresh state (handles closed→half-open transition).
    const current = this.state

    if (current === 'open') {
      throw new PlannerCircuitOpenError()
    }

    let timer: ReturnType<typeof setTimeout> | null = null
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(new Error(`Planner call timed out after ${this.opts.timeoutMs}ms`))
      }, this.opts.timeoutMs)
    })

    try {
      const result = await Promise.race([fn(), timeoutPromise])
      // Success: half-open probe passed → closed; closed already → reset failures.
      this._state = 'closed'
      this.failures = 0
      this.openedAt = 0
      return result
    } catch (err) {
      const counts =
        err instanceof PlannerError ||
        (err instanceof Error && err.message.startsWith('Planner call timed out')) ||
        looksLike5xx(err)

      if (counts) {
        if (current === 'half-open') {
          // Probe failed — re-open immediately.
          this._state = 'open'
          this.openedAt = Date.now()
        } else {
          this.failures += 1
          if (this.failures >= this.opts.failureThreshold) {
            this._state = 'open'
            this.openedAt = Date.now()
          }
        }
      }
      throw err
    } finally {
      if (timer) clearTimeout(timer)
    }
  }
}

export const plannerCircuit = new PlannerCircuitBreaker()
