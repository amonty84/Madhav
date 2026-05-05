/**
 * planner_circuit_breaker.test.ts
 *
 * Unit tests for PlannerCircuitBreaker, including per-stack timeout overrides.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  PlannerCircuitBreaker,
  PlannerCircuitOpenError,
} from '../planner_circuit_breaker'
import { PlannerError } from '@/lib/pipeline/manifest_planner'

// Prevent manifest_planner's server-side imports from running in tests.
vi.mock('@/lib/pipeline/manifest_planner', async () => {
  const actual = await vi.importActual<typeof import('../manifest_planner')>(
    '@/lib/pipeline/manifest_planner',
  )
  return {
    ...actual,
    callLlmPlanner: vi.fn(),
  }
})

vi.mock('ai', () => ({ generateText: vi.fn(), tool: vi.fn(), jsonSchema: vi.fn() }))
vi.mock('@/lib/models/resolver', () => ({ resolveModel: vi.fn() }))
vi.mock('@/lib/db/monitoring-write', () => ({
  writeLlmCallLog: vi.fn(),
  resolveProvider: vi.fn(),
}))

// ── Helpers ──────────────────────────────────────────────────────────────────

const okPlan = {
  query_class: 'interpretive' as const,
  query_intent_summary: 'ok',
  tool_calls: [],
}

function passFn() {
  return Promise.resolve(okPlan)
}

function failFn() {
  return Promise.reject(new PlannerError('planner failed'))
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('STACK_TIMEOUT_OVERRIDES — nim override', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllTimers()
  })

  it('nim stack uses 30_000ms timeout (error message carries 30000)', async () => {
    vi.useFakeTimers()
    const breaker = new PlannerCircuitBreaker({ timeoutMs: 15_000 })
    const slowFn = () => new Promise<typeof okPlan>(() => { /* never resolves */ })
    const callPromise = breaker.call(slowFn, 'nim')
    // Suppress unhandled-rejection warning while we drive fake time
    callPromise.catch(() => {})

    await vi.advanceTimersByTimeAsync(30_000)

    await expect(callPromise).rejects.toThrow('timed out after 30000ms')
  })

  it('no stack uses the default 15_000ms timeout (error message carries 15000)', async () => {
    vi.useFakeTimers()
    const breaker = new PlannerCircuitBreaker({ timeoutMs: 15_000 })
    const slowFn = () => new Promise<typeof okPlan>(() => { /* never resolves */ })
    const callPromise = breaker.call(slowFn)
    callPromise.catch(() => {})

    await vi.advanceTimersByTimeAsync(15_000)

    await expect(callPromise).rejects.toThrow('timed out after 15000ms')
  })

  it('anthropic stack uses default timeout — no override exists for anthropic', async () => {
    vi.useFakeTimers()
    const breaker = new PlannerCircuitBreaker({ timeoutMs: 15_000 })
    const slowFn = () => new Promise<typeof okPlan>(() => { /* never resolves */ })
    const callPromise = breaker.call(slowFn, 'anthropic')
    callPromise.catch(() => {})

    await vi.advanceTimersByTimeAsync(15_000)

    await expect(callPromise).rejects.toThrow('timed out after 15000ms')
  })

  it('nim does NOT time out at 15_000ms (override is 30_000)', async () => {
    vi.useFakeTimers()
    const breaker = new PlannerCircuitBreaker({ timeoutMs: 15_000 })
    let resolved = false
    const slowFn = () => new Promise<typeof okPlan>(resolve => {
      // resolves at exactly 20_000ms in fake time
      setTimeout(() => { resolved = true; resolve(okPlan) }, 20_000)
    })
    const callPromise = breaker.call(slowFn, 'nim')

    // At 15s the breaker should NOT have timed out (nim override is 30s)
    await vi.advanceTimersByTimeAsync(15_000)
    expect(resolved).toBe(false)

    // At 20s the fn resolves; circuit stays closed
    await vi.advanceTimersByTimeAsync(5_000)
    const result = await callPromise
    expect(result).toBeDefined()
    expect(breaker.state).toBe('closed')
  })
})

describe('PlannerCircuitBreaker — state machine', () => {
  let breaker: PlannerCircuitBreaker

  beforeEach(() => {
    breaker = new PlannerCircuitBreaker({ failureThreshold: 2, recoveryMs: 60_000, timeoutMs: 1_000 })
  })

  it('starts closed', () => {
    expect(breaker.state).toBe('closed')
  })

  it('stays closed on success', async () => {
    await breaker.call(passFn)
    expect(breaker.state).toBe('closed')
  })

  it('opens after failureThreshold consecutive failures', async () => {
    await expect(breaker.call(failFn)).rejects.toThrow()
    await expect(breaker.call(failFn)).rejects.toThrow()
    expect(breaker.state).toBe('open')
  })

  it('throws PlannerCircuitOpenError when open', async () => {
    await expect(breaker.call(failFn)).rejects.toThrow()
    await expect(breaker.call(failFn)).rejects.toThrow()
    await expect(breaker.call(passFn)).rejects.toBeInstanceOf(PlannerCircuitOpenError)
  })

  it('reset() returns breaker to closed', async () => {
    await expect(breaker.call(failFn)).rejects.toThrow()
    await expect(breaker.call(failFn)).rejects.toThrow()
    breaker.reset()
    expect(breaker.state).toBe('closed')
    await expect(breaker.call(passFn)).resolves.toBeDefined()
  })

  it('getMetrics() reflects current state', async () => {
    const m = breaker.getMetrics()
    expect(m.state).toBe('closed')
    expect(m.failures).toBe(0)
    expect(m.openedAt).toBeNull()
  })

  it('getMetrics() openedAt is non-null when open', async () => {
    await expect(breaker.call(failFn)).rejects.toThrow()
    await expect(breaker.call(failFn)).rejects.toThrow()
    const m = breaker.getMetrics()
    expect(m.state).toBe('open')
    expect(m.openedAt).not.toBeNull()
  })
})

describe('PlannerCircuitBreaker — half-open probe', () => {
  it('transitions open → half-open after recoveryMs', async () => {
    vi.useFakeTimers()
    const breaker = new PlannerCircuitBreaker({
      failureThreshold: 1,
      recoveryMs: 5_000,
      timeoutMs: 1_000,
    })
    await expect(breaker.call(failFn)).rejects.toThrow()
    expect(breaker.state).toBe('open')

    await vi.advanceTimersByTimeAsync(5_001)
    expect(breaker.state).toBe('half-open')
    vi.useRealTimers()
  })

  it('half-open success closes the breaker', async () => {
    vi.useFakeTimers()
    const breaker = new PlannerCircuitBreaker({
      failureThreshold: 1,
      recoveryMs: 5_000,
      timeoutMs: 1_000,
    })
    await expect(breaker.call(failFn)).rejects.toThrow()
    // Advance past recoveryMs — state getter should now return half-open
    await vi.advanceTimersByTimeAsync(5_001)
    expect(breaker.state).toBe('half-open')
    // Successful probe while still in fake-timer mode
    const result = await breaker.call(passFn)
    expect(result).toBeDefined()
    expect(breaker.state).toBe('closed')
    vi.useRealTimers()
  })
})
