import { describe, it, expect, vi, beforeEach } from 'vitest'

import { concurrentRetry } from '../../panel/concurrent_retry'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('concurrentRetry', () => {
  it('returns the result of the first successful attempt', async () => {
    const factory = vi.fn().mockResolvedValue('ok')
    const result = await concurrentRetry(factory, 3)
    expect(result).toBe('ok')
  })

  it('fires N concurrent attempts — factory is called maxAttempts times', async () => {
    // All succeed immediately; all 3 factories are invoked before settlement.
    const factory = vi.fn().mockResolvedValue('result')
    await concurrentRetry(factory, 3)
    // The factory is called once per attempt slot (all 3 launched upfront).
    expect(factory).toHaveBeenCalledTimes(3)
  })

  it('first success wins — returns value even when earlier attempts are slower', async () => {
    let resolveFirst!: (v: string) => void
    let resolveSecond!: (v: string) => void

    const firstPromise = new Promise<string>(res => { resolveFirst = res })
    const secondPromise = new Promise<string>(res => { resolveSecond = res })

    let call = 0
    const factory = vi.fn((_signal: AbortSignal) => {
      call++
      if (call === 1) return firstPromise   // slow
      if (call === 2) return secondPromise  // fast — will win
      return Promise.resolve('third')       // also fast
    })

    const resultPromise = concurrentRetry(factory, 3)

    // Resolve the "third" attempt synchronously — it should be the winner
    // because we let the first two linger. Actually resolve second for clarity.
    resolveSecond('second-wins')
    resolveFirst('first-late')

    const result = await resultPromise
    // Either second or third (whichever settled first) — but NOT first.
    expect(['second-wins', 'third']).toContain(result)
  })

  it('aborts remaining attempts when first success resolves', async () => {
    const abortedSignals: AbortSignal[] = []

    // Attempt 0: resolves immediately. Attempts 1 & 2: hang forever.
    const factory = vi.fn(async (signal: AbortSignal) => {
      if (factory.mock.calls.length === 1) {
        // First call — succeed
        return 'fast'
      }
      // Subsequent calls — stall and record signal for inspection
      abortedSignals.push(signal)
      return new Promise<string>(() => {}) // never resolves
    })

    await concurrentRetry(factory, 3)

    // The lingering signals should have been aborted
    for (const sig of abortedSignals) {
      expect(sig.aborted).toBe(true)
    }
  })

  it('throws the last error when all attempts fail', async () => {
    const errors = [
      new Error('attempt 0 failed'),
      new Error('attempt 1 failed'),
      new Error('attempt 2 failed'),
    ]
    let call = 0
    const factory = vi.fn(() => Promise.reject(errors[call++]))

    await expect(concurrentRetry(factory, 3)).rejects.toThrow('attempt 2 failed')
  })

  it('succeeds with a single attempt (maxAttempts=1)', async () => {
    const factory = vi.fn().mockResolvedValue('single')
    const result = await concurrentRetry(factory, 1)
    expect(result).toBe('single')
    expect(factory).toHaveBeenCalledTimes(1)
  })

  it('throws when single attempt fails (maxAttempts=1)', async () => {
    const factory = vi.fn(() => Promise.reject(new Error('only error')))
    await expect(concurrentRetry(factory, 1)).rejects.toThrow('only error')
  })

  it('passes an AbortSignal to each factory invocation', async () => {
    const signals: AbortSignal[] = []
    const factory = vi.fn(async (signal: AbortSignal) => {
      signals.push(signal)
      return 'done'
    })
    await concurrentRetry(factory, 2)
    expect(signals.length).toBe(2)
    for (const sig of signals) {
      expect(sig).toBeInstanceOf(AbortSignal)
    }
  })
})
