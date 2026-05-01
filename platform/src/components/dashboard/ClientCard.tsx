import Link from 'next/link'
import { cn } from '@/lib/utils'
import { MomentPhrase } from './MomentPhrase'
import type { ChartWithMeta } from '@/lib/roster/types'

interface Props {
  chart: ChartWithMeta
}

type HealthStatus = 'green' | 'amber' | 'red'

function healthStatus(chart: ChartWithMeta): HealthStatus {
  if (chart.pyramidPercent === 0) return 'amber'
  if (!chart.lastLayerActivity) return 'amber'
  const ageMs = Date.now() - new Date(chart.lastLayerActivity).getTime()
  const ageDays = ageMs / (1000 * 60 * 60 * 24)
  return ageDays < 7 ? 'green' : 'amber'
}

const HEALTH_DOT_CLASS: Record<HealthStatus, string> = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-400',
  red: 'bg-red-500',
}

const GHOST_BTN = "border border-[rgba(212,175,55,0.22)] bg-transparent text-[rgba(212,175,55,0.55)] text-xs font-semibold uppercase tracking-[0.08em] rounded-md px-3 py-1.5 hover:text-[#fce29a] hover:border-[rgba(212,175,55,0.4)] transition-colors"

export function ClientCard({ chart }: Props) {
  const percent = chart.pyramidPercent
  const health = healthStatus(chart)

  return (
    <div className="brand-card rounded-xl p-4 flex flex-col gap-3 hover:border-[rgba(212,175,55,0.35)] transition-colors">
      {/* Name and health dot row */}
      <div className="flex items-center justify-between gap-2">
        <span className="bt-heading text-[#fce29a]">{chart.name}</span>
        <span
          aria-label={`Health: ${health}`}
          className={cn('inline-block h-1.5 w-1.5 rounded-full shadow-[0_0_4px_currentColor]', HEALTH_DOT_CLASS[health])}
        />
      </div>

      {/* Build percentage and progress bar */}
      <div className="flex flex-col gap-1">
        <div>
          <span className="bt-num text-[#d4af37]">{percent}</span>
          <span className="text-[rgba(212,175,55,0.5)] text-sm font-normal">%</span>
        </div>
        <div className="h-0.5 w-full bg-[rgba(212,175,55,0.1)] rounded-full">
          <div
            className="h-full bg-gradient-to-r from-[#a26d0e] to-[#f4d160] rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Metadata */}
      <div>
        <span className="bt-label" style={{ color: 'rgba(212,175,55,0.42)' }}>
          {chart.birth_date} · {chart.birth_place}
        </span>
      </div>

      {/* Moment phrase */}
      <div className="text-[rgba(212,175,55,0.3)] text-xs truncate">
        <MomentPhrase
          pyramidPercent={percent}
          lastLayerActivity={chart.lastLayerActivity}
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Link href={`/clients/${chart.id}`} aria-label={`Profile — ${chart.name}`} className="brand-cta text-xs rounded-md px-3 py-1.5 flex-1">
          Profile
        </Link>
        <Link href={`/clients/${chart.id}/build`} aria-label={`Build — ${chart.name}`} className={GHOST_BTN}>
          Build
        </Link>
        <Link href={`/clients/${chart.id}/consume`} aria-label={`Consume — ${chart.name}`} className={GHOST_BTN}>
          Consume
        </Link>
      </div>
    </div>
  )
}
