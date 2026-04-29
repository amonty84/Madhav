'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { RotateCw } from 'lucide-react'

export function RefreshButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => router.refresh())}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
      title="Refresh from GCS"
    >
      <RotateCw className={`h-3.5 w-3.5 ${isPending ? 'animate-spin' : ''}`} />
      {isPending ? 'Refreshing…' : 'Refresh'}
    </button>
  )
}
