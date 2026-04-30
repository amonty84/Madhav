'use client'

import type { TrendEntry } from '@/lib/build/types'

// CHART_PALETTE — hex literals kept for SVG rect fill props; CSS variables are not valid SVG attribute values.
const EXIT_COLORS: Record<number, string> = {
  0: '#22c55e',
  1: '#86efac',
  2: '#fbbf24',
  3: '#f97316',
  4: '#ef4444',
}

function exitColor(code: number | null): string {
  if (code === null) return '#6b7280'
  return EXIT_COLORS[code] ?? '#ef4444'
}

export function HealthSparkline({
  entries,
  label,
  width = 240,
  height = 48,
}: {
  entries: TrendEntry[]
  label: string
  width?: number
  height?: number
}) {
  if (entries.length === 0) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-medium">{label}</span>
        <span>— no data</span>
      </div>
    )
  }

  const n = entries.length
  const barW = Math.max(2, Math.floor((width - n) / n))
  const gap = 1
  const totalW = n * (barW + gap) - gap
  const lastEntry = entries[n - 1]

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground/80">{label}</span>
        <span className="text-muted-foreground">
          last: exit {lastEntry.exit_code ?? '?'} · {lastEntry.finding_count} findings
        </span>
      </div>
      <svg
        width={totalW}
        height={height}
        viewBox={`0 0 ${totalW} ${height}`}
        className="overflow-visible"
        aria-label={`${label} trend sparkline`}
      >
        {entries.map((e, i) => {
          const maxCode = 4
          const code = e.exit_code ?? maxCode
          const barH = Math.max(4, Math.round((code / maxCode) * height))
          const x = i * (barW + gap)
          const y = height - barH
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barW}
              height={barH}
              fill={exitColor(e.exit_code)}
              rx={1}
              aria-label={`exit ${e.exit_code}`}
            />
          )
        })}
      </svg>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{entries[0]?.run_at?.slice(0, 10) ?? '—'}</span>
        <span>{lastEntry.run_at?.slice(0, 10) ?? '—'}</span>
      </div>
    </div>
  )
}
