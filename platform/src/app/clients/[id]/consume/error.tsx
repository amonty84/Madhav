'use client'

import { useEffect } from 'react'
import { SharedConsumeError } from '@/components/consume/SharedConsumeError'

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

  return <SharedConsumeError title="The chat hit a snag" error={error} reset={reset} />
}
