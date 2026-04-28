import { fetchBuildState } from '@/lib/build/dataSource'
import { InterventionList } from '@/components/build/InterventionList'
import { InterventionFrequency } from '@/components/build/InterventionFrequency'
import { RefreshButton } from '@/components/build/RefreshButton'

export const dynamic = 'force-dynamic'

export default async function InterventionsPage() {
  const state = await fetchBuildState()
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="bt-display">Interventions</h1>
          <p className="bt-body text-muted-foreground">
            {state.red_team_passes.length} red-team passes · {state.native_directives.entries.length} directives ·{' '}
            {state.disagreement_register.entries.length} disagreements
          </p>
        </div>
        <RefreshButton />
      </div>

      <div className="mb-8">
        <InterventionFrequency sessions={state.sessions_index} />
      </div>

      <InterventionList
        red_team_passes={state.red_team_passes}
        native_directives={state.native_directives}
        disagreement_register={state.disagreement_register}
      />
    </main>
  )
}
