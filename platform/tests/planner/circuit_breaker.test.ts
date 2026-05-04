/**
 * circuit_breaker.test.ts — PlannerCircuitBreaker unit tests
 *
 * Tests per-stack isolation, OPEN→HALF_OPEN transition, half-open probe
 * success/failure, getMetrics() shape, and compatibility error fast-open.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('@/lib/pipeline/manifest_planner', () => ({
  PlannerError: class PlannerError extends Error {
    constructor(msg: string) { super(msg); this.name = 'PlannerError' }
  },
}))

import { PlannerCircuitBreaker, PlannerCircuitOpenError } from '@/lib/pipeline/planner_circuit_breaker'

const FAST_OPTS = { failureThreshold: 2, recoveryMs: 100, timeoutMs: 5_000, maxRecoveryMs: 400 }

const ok = () => Promise.resolve({ tool_calls: [] } as any)
const fail = () => Promise.reject(new Error('NIM HTTP 500 error'))

// Compatibility error duck-types PlannerCompatibilityError
class FakeCompatError extends Error {
  readonly isCompatibilityError = true
  constructor() { super('does not support tool_choice'); this.name = 'PlannerCompatibilityError' }
}
const failCompat = () => Promise.reject(new FakeCompatError())

function advanceTime(ms: number) {
  vi.setSystemTime(Date.now() + ms)
}

describe('OPEN→HALF_OPEN transition', () => {
  beforeEach(() => { vi.useFakeTimers() })

  it('transitions from OPEN to HALF_OPEN after recoveryMs', async () => {
    const cb = new PlannerCircuitBreaker(FAST_OPTS)
    await expect(cb.call(fail, 'stack1')).rejects.toThrow()
    await expect(cb.call(fail, 'stack1')).rejects.toThrow()
    expect(cb.getMetrics().find(m => m.stack === 'stack1')?.state).toBe('open')

    advanceTime(FAST_OPTS.recoveryMs + 10)
    expect(cb.getMetrics().find(m => m.stack === 'stack1')?.state).toBe('half-open')
  })
})

describe('half-open probe success → CLOSED', () => {
  beforeEach(() => { vi.useFakeTimers() })

  it('closes the circuit after a successful probe in HALF_OPEN', async () => {
    const cb = new PlannerCircuitBreaker(FAST_OPTS)
    await expect(cb.call(fail, 'stackA')).rejects.toThrow()
    await expect(cb.call(fail, 'stackA')).rejects.toThrow()

    advanceTime(FAST_OPTS.recoveryMs + 10)
    await expect(cb.call(ok, 'stackA')).resolves.toBeDefined()
    expect(cb.getMetrics().find(m => m.stack === 'stackA')?.state).toBe('closed')
  })
})

describe('half-open probe failure → OPEN', () => {
  beforeEach(() => { vi.useFakeTimers() })

  it('re-opens the circuit after a failed probe in HALF_OPEN', async () => {
    const cb = new PlannerCircuitBreaker(FAST_OPTS)
    await expect(cb.call(fail, 'stackB')).rejects.toThrow()
    await expect(cb.call(fail, 'stackB')).rejects.toThrow()

    advanceTime(FAST_OPTS.recoveryMs + 10)
    await expect(cb.call(fail, 'stackB')).rejects.toThrow()
    expect(cb.getMetrics().find(m => m.stack === 'stackB')?.state).toBe('open')
  })

  it('doubles recoveryMs on half-open failure (exponential backoff)', async () => {
    const cb = new PlannerCircuitBreaker({ ...FAST_OPTS, recoveryMs: 100, maxRecoveryMs: 400 })
    await expect(cb.call(fail, 'stackC')).rejects.toThrow()
    await expect(cb.call(fail, 'stackC')).rejects.toThrow()

    // First recovery window
    advanceTime(110)
    await expect(cb.call(fail, 'stackC')).rejects.toThrow() // probe fails → re-opens with 200ms

    // 110ms more is not enough (backoff doubled to 200ms)
    advanceTime(110)
    await expect(cb.call(ok, 'stackC')).rejects.toThrow(PlannerCircuitOpenError)

    // 90ms more (total 200ms) → transitions to half-open again
    advanceTime(100)
    await expect(cb.call(ok, 'stackC')).resolves.toBeDefined()
  })
})

describe('per-stack isolation', () => {
  it('opening one stack does not open others', async () => {
    const cb = new PlannerCircuitBreaker(FAST_OPTS)
    await expect(cb.call(fail, 'deepseek')).rejects.toThrow()
    await expect(cb.call(fail, 'deepseek')).rejects.toThrow()
    expect(cb.getMetrics().find(m => m.stack === 'deepseek')?.state).toBe('open')

    // Other stacks still work — they succeed and remain closed
    await expect(cb.call(ok, 'anthropic')).resolves.toBeDefined()
    await expect(cb.call(ok, 'gemini')).resolves.toBeDefined()
    expect(cb.getMetrics().find(m => m.stack === 'anthropic')?.state).toBe('closed')
    expect(cb.getMetrics().find(m => m.stack === 'gemini')?.state).toBe('closed')
  })
})

describe('getMetrics() shape', () => {
  it('returns array with required fields', async () => {
    const cb = new PlannerCircuitBreaker(FAST_OPTS)
    await expect(cb.call(fail, 'nim')).rejects.toThrow()

    const metrics = cb.getMetrics()
    expect(Array.isArray(metrics)).toBe(true)

    const nim = metrics.find(m => m.stack === 'nim')
    expect(nim).toBeDefined()
    expect(nim).toMatchObject({
      stack: 'nim',
      state: expect.stringMatching(/^(closed|open|half-open)$/),
      failureCount: expect.any(Number),
      consecutiveSuccesses: expect.any(Number),
    })
    // lastFailureAt is number or null
    expect(nim!.lastFailureAt === null || typeof nim!.lastFailureAt === 'number').toBe(true)
  })
})

describe('compatibility error fast-open', () => {
  it('opens the circuit immediately on PlannerCompatibilityError without waiting for threshold', async () => {
    const cb = new PlannerCircuitBreaker(FAST_OPTS)
    // failureThreshold=2 but compat error should open on first hit
    await expect(cb.call(failCompat, 'nim')).rejects.toThrow(FakeCompatError)
    expect(cb.getMetrics().find(m => m.stack === 'nim')?.state).toBe('open')
  })

  it('compatibility error fast-open also works on legacy call() without stackKey', async () => {
    const cb = new PlannerCircuitBreaker(FAST_OPTS)
    await expect(cb.call(failCompat)).rejects.toThrow(FakeCompatError)
    expect(cb.state).toBe('open')
  })
})
