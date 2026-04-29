/**
 * MARSYS-JIS Phase 7 — Concurrent retry pattern
 * schema_version: 1.0
 *
 * Fires up to N concurrent attempts of a task; the first to succeed wins and
 * all remaining attempts are aborted. Per the native pre-approval from the
 * panel brainstorm: N=3 concurrent attempts per panel member call.
 *
 * Contract:
 * - If attempt N succeeds before attempt 1, N's result is returned.
 * - If all N attempts fail, the last rejection is thrown.
 * - Callers must not observe partial results from losing attempts.
 */

export async function concurrentRetry<T>(
  factory: (signal: AbortSignal) => Promise<T>,
  maxAttempts = 3,
): Promise<T> {
  const controllers: AbortController[] = Array.from(
    { length: maxAttempts },
    () => new AbortController(),
  )

  const attempts = controllers.map((ctrl, i) =>
    factory(ctrl.signal)
      .then(result => ({ index: i, result, success: true as const }))
      .catch(err => ({ index: i, error: err, success: false as const })),
  )

  const errors: unknown[] = []

  // Process settlements in arrival order — first success wins.
  const pending = new Set(attempts.map((_, i) => i))
  const settled = Promise.allSettled(attempts)

  // Use a race loop: each iteration picks the next attempt to settle.
  for (let i = 0; i < maxAttempts; i++) {
    const winner = await Promise.race(
      [...pending].map(idx =>
        attempts[idx].then(outcome => ({ idx, outcome })),
      ),
    )

    pending.delete(winner.idx)

    if (winner.outcome.success) {
      // Abort all remaining in-flight attempts.
      for (const idx of pending) {
        controllers[idx].abort()
      }
      // Drain the settled promise so GC can collect.
      settled.catch(() => {})
      return winner.outcome.result
    }

    errors.push((winner.outcome as { error: unknown }).error)
  }

  // All attempts failed.
  throw errors[errors.length - 1]
}
