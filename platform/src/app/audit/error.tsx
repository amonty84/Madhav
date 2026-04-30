// Surface: /audit (super_admin audit log + predictions). Catches query log fetch failures and prediction-pagination errors.
'use client'

import { useEffect } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

export default function AuditError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Audit error]', error.digest ?? error.name)
  }, [error])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-xl font-semibold">Something went wrong on our end</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        The audit log could not be loaded. Try again in a moment.
      </p>
      <div className="flex gap-2">
        <Button onClick={reset}>Try again</Button>
        <Link href="/dashboard" className={buttonVariants({ variant: 'outline' })}>
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}
