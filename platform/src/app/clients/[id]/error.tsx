'use client'

import { useEffect } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

export default function ClientError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        {error.message || 'Failed to load this client workspace.'}
      </p>
      <div className="flex gap-2">
        <Link href="/dashboard" className={buttonVariants({ variant: 'outline' })}>
          ← Dashboard
        </Link>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
