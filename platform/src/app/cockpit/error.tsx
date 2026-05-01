'use client'

import { useEffect } from 'react'

export default function BuildError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Build Tracker error]', error)
  }, [error])

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 text-center">
      <p className="text-sm font-medium text-destructive">Build Tracker error</p>
      <p className="mt-2 text-xs text-muted-foreground">{error.message}</p>
      {error.digest && (
        <p className="mt-1 font-mono text-xs text-muted-foreground">digest: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="mt-6 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
      >
        Try again
      </button>
    </main>
  )
}
