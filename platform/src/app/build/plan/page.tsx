import { Suspense } from 'react'
import { fetchBuildState } from '@/lib/build/dataSource'
import { PlanTree } from '@/components/build/PlanTree'
import { PhaseGrid } from '@/components/build/PhaseGrid'
import { ProgressBar } from '@/components/build/ProgressBar'
import { DetailSidePanel } from '@/components/build/DetailSidePanel'
import {
  macroCompletionPercent,
  phaseCompletionPercent,
} from '@/lib/build/derive'

export const dynamic = 'force-dynamic'

export default async function BuildPlanPage() {
  const state = await fetchBuildState()
  const { phase_plan, macro_phase } = state
  const overallPct = macroCompletionPercent(state)
  const phasePct = phaseCompletionPercent(state)
  const completedSubs = phase_plan.sub_phases.filter((s) => s.status === 'completed').length
  const inProgressSubs = phase_plan.sub_phases.filter(
    (s) => s.status === 'in_progress' || s.status === 'active',
  ).length

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="bt-display">The Plan</h1>
        <p className="bt-body text-muted-foreground">
          {macro_phase.id} · {macro_phase.title}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr_280px]">
        {/* Left: expandable macro hierarchy */}
        <aside>
          <p className="bt-label mb-3">Plan</p>
          <Suspense fallback={<p className="bt-body text-muted-foreground">Loading…</p>}>
            <PlanTree
              arc={macro_phase.macro_arc}
              activeMacroId={macro_phase.id}
            />
          </Suspense>
        </aside>

        {/* Center: progress summary + phase grid */}
        <section className="space-y-5">
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="bt-label mb-3">Where we are overall</p>
            <div className="space-y-3">
              <ProgressBar
                percent={overallPct}
                label="Overall journey (M1 → M10)"
                tone="active"
              />
              <ProgressBar
                percent={phasePct}
                label={`Sub-phases completed in ${macro_phase.id}`}
              />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-4 border-t border-border pt-4">
              <div>
                <p className="bt-num">{completedSubs}</p>
                <p className="bt-body text-muted-foreground">completed</p>
              </div>
              <div>
                <p className="bt-num">{inProgressSubs}</p>
                <p className="bt-body text-muted-foreground">in progress</p>
              </div>
              <div>
                <p className="bt-num">
                  {phase_plan.sub_phases.length - completedSubs - inProgressSubs}
                </p>
                <p className="bt-body text-muted-foreground">pending</p>
              </div>
            </div>
          </div>

          <div>
            <p className="bt-label mb-3">Sub-phases</p>
            <PhaseGrid subPhases={phase_plan.sub_phases} />
          </div>
        </section>

        {/* Right: side panel */}
        <DetailSidePanel
          title="What this phase does"
          subtitle={`${macro_phase.id} — ${macro_phase.title}`}
          sections={[
            {
              label: 'Purpose',
              body: (
                <p>
                  Activate the corpus: turn the static facts and synthesis layer into a
                  working substrate the LLM can actually read from at acharya-grade depth.
                </p>
              ),
            },
            {
              label: "How we know we're done",
              body: (
                <p>
                  All sub-phases B.0 through B.10 closed with their acceptance criteria
                  passed and deliverables shipped.
                </p>
              ),
            },
            {
              label: 'Pick a sub-phase',
              body: (
                <p className="text-muted-foreground">
                  Click any card to drill into acceptance criteria, sessions, and
                  deliverables.
                </p>
              ),
            },
          ]}
        />
      </div>
    </main>
  )
}
