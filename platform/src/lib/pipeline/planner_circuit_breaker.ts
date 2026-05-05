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
 *   - PlannerCompatibilityError — fast-open immediately (deterministic failure)
 *   - timeout (Promise.race against timeoutMs)
 *   - any error whose message contains a 5xx hint from the provider
 *
 * Per-stack tracking: pass a stackKey to call() to isolate failures.
 * One stack opening does not open others. Default key: 'default'.
 *
 * getMetrics(): returns current state snapshot for monitoring dashboard.
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
  /** Maximum recoveryMs backoff on repeated half-open failures (default: 300_000ms). */
  maxRecoveryMs: number
}

export interface CircuitMetric {
  stack: string
  state: CircuitState
  failureCount: number
  lastFailureAt: number | null
  consecutiveSuccesses: number
}

export class PlannerCircuitOpenError extends Error {
  constructor(stack?: string) {
    super(`Planner circuit breaker is open — request rejected${stack ? ` (stack: ${stack})` : ''}`)
    this.name = 'PlannerCircuitOpenError'
  }
}

// Per-stack timeout overrides — added 2026-05-05 GANGA-DEFERRED
// NIM free-tier full-prompt latency exceeds 15s; raise its timeout only.
const STACK_TIMEOUT_OVERRIDES: Partial<Record<string, number>> = {
  nim: 30_000,
}

const DEFAULT_OPTIONS: CircuitBreakerOptions = {
  failureThreshold: 3,
  recoveryMs: 300_000,
  // Raised 5s→15s 2026-05-05 GANGA-PLANNER-FIX-S1:
  // 5s timeout tripped the breaker on providers with >5s cold-start (nemotron-49B: 6.8s).
  // 15s covers known worst-case cold-starts across all confirmed-live NIM models.
  // The breaker's purpose is to stop sustained outages, not catch slow cold-starts.
  timeoutMs: 15_000,
  maxRecoveryMs: 300_000,
}

function looksLike5xx(err: unknown): boolean {
  if (!err) return false
  const msg = err instanceof Error ? err.message : String(err)
  return /\b5\d\d\b/.test(msg)
}

/** Duck-type check for PlannerCompatibilityError without importing nvidia.ts (avoids server-only). */
function isCompatibilityError(err: unknown): boolean {
  return !!(
    err &&
    typeof err === 'object' &&
    (err as Record<string, unknown>).isCompatibilityError === true
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-stack state
// ─────────────────────────────────────────────────────────────────────────────

interface StackState {
  state: CircuitState
  failures: number
  openedAt: number
  consecutiveSuccesses: number
  lastFailureAt: number | null
  currentRecoveryMs: number
}

function freshStackState(initialRecoveryMs: number): StackState {
  return {
    state: 'closed',
    failures: 0,
    openedAt: 0,
    consecutiveSuccesses: 0,
    lastFailureAt: null,
    currentRecoveryMs: initialRecoveryMs,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PlannerCircuitBreaker
// ─────────────────────────────────────────────────────────────────────────────

export class PlannerCircuitBreaker {
  private readonly opts: CircuitBreakerOptions
  // Legacy single-stack state (for call() without stackKey — backward compat)
  private _state: CircuitState = 'closed'
  private failures = 0
  private openedAt = 0
  // Per-stack state map
  private stacks: Map<string, StackState> = new Map()

  constructor(options?: Partial<CircuitBreakerOptions>) {
    this.opts = { ...DEFAULT_OPTIONS, ...options }
  }

  // ── Legacy single-stack accessors (backward compat) ────────────────────────

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
    this.stacks.clear()
  }

  // ── Per-stack state helpers ────────────────────────────────────────────────

  private getStack(key: string): StackState {
    if (!this.stacks.has(key)) {
      this.stacks.set(key, freshStackState(this.opts.recoveryMs))
    }
    return this.stacks.get(key)!
  }

  private resolveStackState(ss: StackState): CircuitState {
    if (ss.state === 'open' && Date.now() - ss.openedAt >= ss.currentRecoveryMs) {
      ss.state = 'half-open'
    }
    return ss.state
  }

  private openStack(ss: StackState): void {
    ss.state = 'open'
    ss.openedAt = Date.now()
    ss.lastFailureAt = Date.now()
  }

  private failStack(ss: StackState, current: CircuitState): void {
    ss.lastFailureAt = Date.now()
    if (current === 'half-open') {
      // Probe failed — re-open with doubled timeout (exponential backoff).
      ss.currentRecoveryMs = Math.min(ss.currentRecoveryMs * 2, this.opts.maxRecoveryMs)
      this.openStack(ss)
    } else {
      ss.failures += 1
      if (ss.failures >= this.opts.failureThreshold) {
        this.openStack(ss)
      }
    }
  }

  private succeedStack(ss: StackState): void {
    ss.state = 'closed'
    ss.failures = 0
    ss.openedAt = 0
    ss.consecutiveSuccesses += 1
    // Reset backoff on clean recovery.
    ss.currentRecoveryMs = this.opts.recoveryMs
  }

  // ── getMetrics ─────────────────────────────────────────────────────────────

  /**
   * Returns a snapshot of per-stack circuit state for the monitoring dashboard.
   * Includes the legacy 'default' stack plus any named stacks that have been used.
   */
  getMetrics(): CircuitMetric[] {
    const metrics: CircuitMetric[] = []

    // Legacy single-stack (exposed as 'default' for backward compat)
    metrics.push({
      stack: 'default',
      state: this.state,
      failureCount: this.failures,
      lastFailureAt: this.openedAt > 0 ? this.openedAt : null,
      consecutiveSuccesses: 0,
    })

    for (const [key, ss] of this.stacks.entries()) {
      metrics.push({
        stack: key,
        state: this.resolveStackState(ss),
        failureCount: ss.failures,
        lastFailureAt: ss.lastFailureAt,
        consecutiveSuccesses: ss.consecutiveSuccesses,
      })
    }

    return metrics
  }

  // ── call (legacy — no stackKey) ────────────────────────────────────────────

  /**
   * Legacy call signature — uses single global state for backward compat.
   * Prefer call(fn, stackKey) for per-stack isolation.
   */
  async call(fn: () => Promise<PlanSchema>, stackKey?: string): Promise<PlanSchema> {
    if (stackKey) {
      return this._callWithStack(fn, stackKey)
    }

    // Legacy path: single global state
    const current = this.state

    if (current === 'open') {
      throw new PlannerCircuitOpenError()
    }

    const effectiveTimeout = this.opts.timeoutMs

    let timer: ReturnType<typeof setTimeout> | null = null
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(new Error(`Planner call timed out after ${effectiveTimeout}ms`))
      }, effectiveTimeout)
    })

    try {
      const result = await Promise.race([fn(), timeoutPromise])
      this._state = 'closed'
      this.failures = 0
      this.openedAt = 0
      return result
    } catch (err) {
      // Compatibility errors fast-open immediately — they are deterministic.
      if (isCompatibilityError(err)) {
        this._state = 'open'
        this.openedAt = Date.now()
        throw err
      }

      const counts =
        err instanceof PlannerError ||
        (err instanceof Error && err.message.startsWith('Planner call timed out')) ||
        looksLike5xx(err)

      if (counts) {
        if (current === 'half-open') {
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

  // ── per-stack call ─────────────────────────────────────────────────────────

  private async _callWithStack(fn: () => Promise<PlanSchema>, stackKey: string): Promise<PlanSchema> {
    const ss = this.getStack(stackKey)
    const current = this.resolveStackState(ss)

    if (current === 'open') {
      throw new PlannerCircuitOpenError(stackKey)
    }

    const stackTimeoutMs = STACK_TIMEOUT_OVERRIDES[stackKey] ?? this.opts.timeoutMs
    let timer: ReturnType<typeof setTimeout> | null = null
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(new Error(`Planner call timed out after ${stackTimeoutMs}ms`))
      }, stackTimeoutMs)
    })

    try {
      const result = await Promise.race([fn(), timeoutPromise])
      this.succeedStack(ss)
      return result
    } catch (err) {
      // Compatibility errors fast-open without waiting for failure threshold.
      if (isCompatibilityError(err)) {
        this.openStack(ss)
        throw err
      }

      const counts =
        err instanceof PlannerError ||
        (err instanceof Error && err.message.startsWith('Planner call timed out')) ||
        looksLike5xx(err)

      if (counts) {
        this.failStack(ss, current)
      }
      throw err
    } finally {
      if (timer) clearTimeout(timer)
    }
  }
}

export const plannerCircuit = new PlannerCircuitBreaker()
