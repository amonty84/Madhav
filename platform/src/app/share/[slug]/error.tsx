// Surface: /share/[slug] (read-only Consume share page). Catches invalid/expired-slug errors, share-resolution failures, and answer-render errors.
'use client'

import { useEffect } from 'react'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

export default function ShareError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Share error]', error.digest ?? error.name)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-xl font-semibold">This shared conversation could not be loaded</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        The requested content was not found. It may have been removed or you may have followed an
        old link.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={reset}
          className={buttonVariants({ variant: 'default' })}
        >
          Try again
        </button>
        <Link href="/" className={buttonVariants({ variant: 'outline' })}>
          Go to home
        </Link>
      </div>
    </div>
  )
}
