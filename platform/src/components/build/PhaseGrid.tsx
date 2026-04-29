import Link from 'next/link'
import type { SubPhase } from '@/lib/build/types'
import { naturalSort } from '@/lib/build/format'

interface Props {
  subPhases: SubPhase[]
}

function statusBadge(status: string | null | undefined) {
  const s = (status ?? '').toLowerCase()
  if (s === 'completed')
    return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
  if (s === 'in_progress' || s === 'active')
    return 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
  if (s === 'pending') return 'bg-muted text-muted-foreground'
  return 'bg-muted/50 text-muted-foreground/60'
}

function statusDot(status: string | null | undefined) {
  const s = (status ?? '').toLowerCase()
  if (s === 'completed') return 'bg-emerald-500'
  if (s === 'in_progress' || s === 'active') return 'bg-amber-500'
  if (s === 'pending') return 'bg-muted-foreground/30'
  return 'bg-muted-foreground/15'
}

export function PhaseGrid({ subPhases }: Props) {
  if (!subPhases.length) {
    return <p className="bt-body text-muted-foreground">No sub-phases found.</p>
  }

  const sorted = subPhases.slice().sort((a, b) => naturalSort(a.phase_id, b.phase_id))
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {sorted.map((sp) => (
        <Link
          key={sp.phase_id}
          href={`/build/plan/${encodeURIComponent(sp.phase_id)}`}
          className="group block rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <span className="bt-mono text-sm font-semibold">{sp.phase_id}</span>
            <span className={`bt-label rounded px-1.5 py-0.5 ${statusBadge(sp.status)}`}>
              {sp.status.replace(/_/g, ' ')}
            </span>
          </div>

          <p className="bt-body font-medium leading-snug mb-4 group-hover:underline">
            {sp.title}
          </p>

          <div className="flex items-center justify-between border-t border-border pt-2.5 mt-auto">
            <div className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${statusDot(sp.status)}`} />
              <span className="bt-label text-muted-foreground">
                {sp.session_count_actual} session{sp.session_count_actual !== 1 ? 's' : ''}
              </span>
            </div>
            {sp.session_count_estimated != null && (
              <span className="bt-label text-muted-foreground">
                est. {sp.session_count_estimated}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
