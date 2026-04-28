import { fetchBuildState } from '@/lib/build/dataSource'
import { FilterableActivityFeed } from '@/components/build/FilterableActivityFeed'
import { RefreshButton } from '@/components/build/RefreshButton'
import { naturalSort } from '@/lib/build/format'

export const dynamic = 'force-dynamic'

export default async function ActivityPage() {
  const state = await fetchBuildState()
  const sessions = state.sessions_index

  const classes = [...new Set(sessions.map((s) => s.class).filter(Boolean))].sort(naturalSort)
  const phases = [...new Set(sessions.map((s) => s.phase_id).filter(Boolean) as string[])].sort(naturalSort)

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="bt-display">Activity</h1>
          <p className="bt-body text-muted-foreground">{sessions.length} sessions total</p>
        </div>
        <RefreshButton />
      </div>
      <FilterableActivityFeed sessions={sessions} classes={classes} phases={phases} />
    </main>
  )
}
