import { fetchBuildState } from '@/lib/build/dataSource'
import { SessionTimeline } from '@/components/build/SessionTimeline'

export const dynamic = 'force-dynamic'

export default async function BuildSessionsPage() {
  const state = await fetchBuildState()
  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="bt-display">Sessions</h1>
        <p className="bt-body text-muted-foreground">
          {state.sessions_index.length} sessions in the build so far
        </p>
      </div>
      <SessionTimeline sessions={state.sessions_index} />
    </main>
  )
}
