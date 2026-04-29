'use client'

import { useState, useEffect } from 'react'

interface DashaCountdownProps {
  md: string
  ad: string
  adEnd: string // ISO date string "YYYY-MM-DD"
}

function formatDuration(ms: number): string {
  if (ms <= 0) return 'transition imminent'
  const days = Math.floor(ms / 86_400_000)
  const years = Math.floor(days / 365)
  const rem = days % 365
  const months = Math.floor(rem / 30)
  const d = rem % 30
  const parts: string[] = []
  if (years > 0) parts.push(`${years}y`)
  if (months > 0) parts.push(`${months}m`)
  if (d > 0 || parts.length === 0) parts.push(`${d}d`)
  return parts.join(' ')
}

export function DashaCountdown({ md, ad, adEnd }: DashaCountdownProps) {
  const boundary = new Date(`${adEnd}T00:00:00Z`).getTime()
  const [remaining, setRemaining] = useState(() => boundary - Date.now())

  useEffect(() => {
    const id = setInterval(() => setRemaining(boundary - Date.now()), 60_000)
    return () => clearInterval(id)
  }, [boundary])

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs uppercase tracking-widest opacity-70" style={{ color: 'var(--brand-gold)' }}>
        Vimshottari Dasha
      </p>
      <p className="text-sm font-medium" style={{ color: 'var(--brand-gold-cream, #fce29a)' }}>
        {md} MD · {ad} AD
      </p>
      <p className="text-xs" style={{ color: 'var(--brand-gold)', opacity: 0.85 }}>
        {formatDuration(remaining)} until next antar boundary
        <span className="ml-1 opacity-70">({adEnd})</span>
      </p>
    </div>
  )
}
