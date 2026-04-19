'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function ConversationError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[consume/conversation] route error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
      <h2 className="text-lg font-semibold">This conversation hit a snag</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        {error.message || 'An unexpected error occurred while rendering this conversation.'}
      </p>
      <Button size="sm" onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
