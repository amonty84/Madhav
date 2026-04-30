// Surface: /admin (super_admin user management). Catches admin-route failures (Firebase, DB, role-check denials).
'use client'

import { useEffect } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Admin error]', error.digest ?? error.name)
  }, [error])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-xl font-semibold">Something went wrong on our end</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        The admin panel could not be loaded. Try again in a moment.
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
