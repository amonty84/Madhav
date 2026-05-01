import Link from 'next/link'
import type { SessionIndex } from '@/lib/build/types'
import { friendlySessionTitle, plainSummary, relativeDay } from '@/lib/build/derive'

export function SessionTimeline({ sessions }: { sessions: SessionIndex[] }) {
  // Group by phase_id (preserving reverse-chronological order within each group)
  const reversed = [...sessions].reverse()
  const groups = new Map<string, SessionIndex[]>()
  for (const s of reversed) {
    const key = s.phase_id ?? 'Unphased'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(s)
  }

  if (reversed.length === 0) {
    return (
      <p className="bt-body text-muted-foreground">No sessions recorded yet.</p>
    )
  }

  return (
    <div className="space-y-8">
      {Array.from(groups.entries()).map(([phaseId, items]) => (
        <section key={phaseId}>
          <div className="mb-3 flex items-baseline gap-3">
            <p className="bt-label">{phaseId}</p>
            <span className="bt-body text-muted-foreground">
              {items.length} {items.length === 1 ? 'session' : 'sessions'}
            </span>
          </div>
          <ol className="relative space-y-3 border-l border-border pl-5">
            {items.map((s, i) => (
              <li key={`${s.session_id}-${i}`} className="relative">
                <span className="absolute -left-[27px] top-2.5 h-2 w-2 rounded-full bg-foreground/60 ring-4 ring-background" />
                <Link
                  href={`/build/sessions/${encodeURIComponent(s.session_id)}`}
                  className="group block rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="bt-body font-medium group-hover:underline">
                      {friendlySessionTitle(s)}
                    </p>
                    <span className="bt-label shrink-0">{relativeDay(s.date)}</span>
                  </div>
                  <p className="bt-body mt-1 line-clamp-2 text-muted-foreground">
                    {plainSummary(s)}
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
