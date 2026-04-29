'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { relativeTime } from '@/lib/build/format'

interface Props {
  generatedAt: string
}

export function FreshnessIndicator({ generatedAt }: Props) {
  const router = useRouter()
  const [label, setLabel] = useState(() => relativeTime(generatedAt))

  // Keep the relative label fresh every 30s without a full re-fetch
  useEffect(() => {
    const id = setInterval(() => setLabel(relativeTime(generatedAt)), 30_000)
    return () => clearInterval(id)
  }, [generatedAt])

  return (
    <div className="flex items-center gap-2">
      <span
        className="bt-label text-muted-foreground"
        title={generatedAt}
      >
        Generated · {label}
      </span>
      <button
        onClick={() => router.refresh()}
        className="bt-label rounded px-1.5 py-0.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        aria-label="Refresh build state"
      >
        ↺
      </button>
    </div>
  )
}
