'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

/**
 * Route-scoped error boundary for the consume chat. Scoped here so a render
 * error in the chat area falls back gracefully without unmounting upstream
 * layout state. The conversation in-memory state (useChat) will still reset
 * on `reset()` — but the browser URL and sidebar stay intact.
 */
export default function ConsumeError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[consume] route error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
      <h2 className="text-lg font-semibold">The chat hit a snag</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        {error.message || 'An unexpected error occurred while rendering the chat.'}
      </p>
      <Button size="sm" onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
