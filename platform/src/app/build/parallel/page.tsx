import { fetchBuildState } from '@/lib/build/dataSource'
import { MirrorPairsTable } from '@/components/build/MirrorPairsTable'
import { StatusPill } from '@/components/build/StatusPill'
import { RefreshButton } from '@/components/build/RefreshButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, relativeTime } from '@/lib/build/format'

export const dynamic = 'force-dynamic'

export default async function ParallelPage() {
  const state = await fetchBuildState()
  const workstreams = state.workstreams ?? []
  const cowork = state.cowork_ledger ?? []

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-xl font-medium">Parallel Workstreams</h1>
        <RefreshButton />
      </div>

      {/* Workstreams */}
      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Active Workstreams ({workstreams.length})
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {workstreams.map((w) => (
            <Card key={w.id} size="sm">
              <CardHeader>
                <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">{w.id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                <p className="text-sm font-medium leading-snug">{w.title}</p>
                <StatusPill status={w.status} />
                {w.last_activity && (
                  <p className="text-xs text-muted-foreground">{relativeTime(w.last_activity)}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Mirror Pairs */}
      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Mirror Pairs (MP.1–MP.{state.mirror_pairs.length})
        </h2>
        <MirrorPairsTable pairs={state.mirror_pairs} />
      </section>

      {/* Cowork Ledger */}
      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Cowork Ledger ({cowork.length} threads)
        </h2>
        {cowork.length === 0 ? (
          <p className="text-sm text-muted-foreground">No Cowork ledger data available.</p>
        ) : (
          <div className="space-y-2">
            {/* serializer emits cowork ledger newest-first */}
            {cowork.map((entry, i) => (
              <Card key={i} size="sm">
                <CardContent className="py-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium leading-snug">{entry.thread_name}</p>
                    <StatusPill status={entry.closed_on ? 'completed' : 'in_progress'} />
                  </div>
                  <p className="text-xs text-muted-foreground">{entry.purpose}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Opened: {formatDate(entry.opened_on)}</span>
                    {entry.closed_on && <span>Closed: {formatDate(entry.closed_on)}</span>}
                  </div>
                  {entry.outcomes.length > 0 && (
                    <ul className="ml-3 list-disc space-y-0.5 text-xs text-muted-foreground">
                      {entry.outcomes.map((o, j) => (
                        <li key={j}>{o}</li>
                      ))}
                    </ul>
                  )}
                  {entry.spawned_sessions.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Spawned: <span className="font-mono">{entry.spawned_sessions.join(', ')}</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* LEL + PPL quick-status */}
      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Formal Workstream Status
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Life Event Log (LEL)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">v1.2 — 36 events · 5 period summaries · 6 chronic patterns</p>
              <p className="text-xs text-muted-foreground">Swiss-Ephemeris-populated chart_states. Confidence 0.89.</p>
              <p className="text-xs text-muted-foreground">M4 prerequisite; maintained on-close per CLAUDE.md §E.</p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Prospective Prediction Log (PPL)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">Substrate-only — scaffold at Step 11</p>
              <p className="text-xs text-muted-foreground">Interim logging surface: LEL prediction subsection.</p>
              <p className="text-xs text-muted-foreground">Held-out prospective data is sacrosanct; outcome never precedes prediction.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
