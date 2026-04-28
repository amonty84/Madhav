import Link from 'next/link'
import type { SessionIndex } from '@/lib/build/types'
import { Card, CardContent } from '@/components/ui/card'
import { StatusPill } from './StatusPill'
import { ScriptVerdictBadge } from './ScriptVerdictBadge'
import { formatDate } from '@/lib/build/format'

export function ActivityFeed({ sessions }: { sessions: SessionIndex[] }) {
  if (sessions.length === 0) {
    return <p className="text-sm text-muted-foreground">No session activity found.</p>
  }

  return (
    <div className="space-y-2">
      {sessions.map((s) => (
        <Link
          key={s.session_id}
          href={`/build/sessions/${encodeURIComponent(s.session_id)}`}
          className="block"
        >
          <Card size="sm" className="transition-colors hover:bg-muted/60">
            <CardContent className="py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs font-medium truncate">{s.session_id}</p>
                  {s.title && (
                    <p className="mt-0.5 text-sm leading-snug text-foreground/80 line-clamp-2">{s.title}</p>
                  )}
                  {s.deliverable_one_liner && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{s.deliverable_one_liner}</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(s.date)}</span>
                  <StatusPill status={s.class} />
                  <div className="flex gap-1">
                    <ScriptVerdictBadge code={s.drift_exit} label="d" />
                    <ScriptVerdictBadge code={s.schema_exit} label="s" />
                    <ScriptVerdictBadge code={s.mirror_exit} label="m" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
