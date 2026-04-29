import { Suspense } from 'react'
import Link from 'next/link'
import { fetchBuildState, fetchPhaseDetail } from '@/lib/build/dataSource'
import { PlanTree } from '@/components/build/PlanTree'
import { ProgressBar } from '@/components/build/ProgressBar'
import { DetailSidePanel } from '@/components/build/DetailSidePanel'
import { AcCriteriaList } from '@/components/build/AcCriteriaList'
import { SessionsBar } from '@/components/build/charts/SessionsBar'
import {
  phaseDetailAcPercent,
  phaseDetailDeliverablePercent,
  friendlySessionTitle,
} from '@/lib/build/derive'

export const dynamic = 'force-dynamic'

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase()
  const tone =
    s === 'completed' || s === 'passed' || s === 'pass'
      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
      : s === 'in_progress' || s === 'active'
        ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
        : 'bg-muted text-muted-foreground'
  return (
    <span className={`bt-label inline-block rounded px-1.5 py-0.5 ${tone}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

export default async function PhaseDetailPage({
  params,
}: {
  params: Promise<{ phase_id: string }>
}) {
  const { phase_id } = await params
  const [state, detail] = await Promise.all([
    fetchBuildState(),
    fetchPhaseDetail(phase_id),
  ])

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="bt-display">The Plan</h1>
        <Link href="/build/plan" className="bt-body text-muted-foreground hover:underline">
          ← Back to overview
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr_280px]">
        {/* Left: tree with this sub-phase selected */}
        <aside>
          <p className="bt-label mb-3">Plan</p>
          <Suspense fallback={<p className="bt-body text-muted-foreground">Loading…</p>}>
            <PlanTree
              arc={state.macro_phase.macro_arc}
              activeMacroId={state.macro_phase.id}
              selectedPhaseId={phase_id}
            />
          </Suspense>
        </aside>

        {/* Center: phase detail */}
        <section className="space-y-5">
          {!detail ? (
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="bt-body text-muted-foreground">
                No detail shard yet for{' '}
                <span className="bt-mono">{phase_id}</span>. The next session that touches
                this sub-phase will produce one.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-baseline justify-between">
                  <div>
                    <h2 className="bt-heading">
                      {detail.phase_id} — {detail.title}
                    </h2>
                    <p className="bt-body mt-1 text-muted-foreground">
                      {detail.session_count_actual} of ~{detail.session_count_estimated}{' '}
                      sessions run
                    </p>
                  </div>
                  <StatusBadge status={detail.status} />
                </div>
                <div className="mt-4 space-y-3">
                  <ProgressBar
                    percent={phaseDetailAcPercent(detail)}
                    label="Acceptance criteria passed"
                    tone="active"
                  />
                  <ProgressBar
                    percent={phaseDetailDeliverablePercent(detail)}
                    label="Deliverables shipped"
                  />
                </div>
              </div>

              {detail.acceptance_criteria.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="bt-label mb-3">Acceptance criteria</p>
                  <AcCriteriaList criteria={detail.acceptance_criteria} />
                </div>
              )}

              {detail.sessions.length > 0 && (() => {
                const enriched = detail.sessions.map((s) => {
                  const idx = state.sessions_index.find((si) => si.session_id === s.session_id)
                  return {
                    ...s,
                    class: idx?.class ?? 'unknown',
                    title: idx ? friendlySessionTitle(idx) : s.session_id,
                  }
                })
                return (
                  <div className="rounded-lg border border-border bg-card p-5">
                    <SessionsBar sessions={enriched} height={140} />
                    <ul className="mt-4 divide-y divide-border border-t border-border pt-3">
                      {enriched.map((s) => (
                        <li key={s.session_id} className="py-2.5">
                          <Link
                            href={`/build/sessions/${encodeURIComponent(s.session_id)}`}
                            className="group block"
                          >
                            <p className="bt-body font-medium group-hover:underline">{s.title}</p>
                            {s.contribution && (
                              <p className="bt-body line-clamp-2 text-muted-foreground">
                                {s.contribution}
                              </p>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })()}

              {(detail.deliverables_complete.length > 0 ||
                detail.deliverables_pending.length > 0) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {detail.deliverables_complete.length > 0 && (
                    <div className="rounded-lg border border-border bg-card p-5">
                      <p className="bt-label mb-2">Shipped</p>
                      <ul className="space-y-1">
                        {detail.deliverables_complete.map((d, i) => (
                          <li key={i} className="bt-body">
                            ✓ {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {detail.deliverables_pending.length > 0 && (
                    <div className="rounded-lg border border-border bg-card p-5">
                      <p className="bt-label mb-2">Still to ship</p>
                      <ul className="space-y-1">
                        {detail.deliverables_pending.map((d, i) => (
                          <li key={i} className="bt-body text-muted-foreground">
                            · {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </section>

        {/* Right: side panel */}
        <DetailSidePanel
          title="What this sub-phase does"
          subtitle={detail ? `${detail.phase_id} — ${detail.title}` : phase_id}
          sections={[
            {
              label: 'Purpose',
              body: detail ? (
                <p>{detail.title}</p>
              ) : (
                <p className="text-muted-foreground">
                  Detail not generated yet for this sub-phase.
                </p>
              ),
            },
            {
              label: 'Done when',
              body: detail && detail.acceptance_criteria.length > 0 ? (
                <p>
                  All {detail.acceptance_criteria.length} acceptance criteria pass and{' '}
                  {detail.deliverables_complete.length + detail.deliverables_pending.length}{' '}
                  deliverables ship.
                </p>
              ) : (
                <p className="text-muted-foreground">No criteria recorded yet.</p>
              ),
            },
            ...(detail && detail.dependencies_inbound.length > 0
              ? [
                  {
                    label: 'Depends on',
                    body: (
                      <ul className="space-y-0.5">
                        {detail.dependencies_inbound.map((d) => (
                          <li key={d} className="bt-mono text-xs">
                            {d}
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                ]
              : []),
            ...(detail && detail.dependencies_outbound.length > 0
              ? [
                  {
                    label: 'Unlocks',
                    body: (
                      <ul className="space-y-0.5">
                        {detail.dependencies_outbound.map((d) => (
                          <li key={d} className="bt-mono text-xs">
                            {d}
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                ]
              : []),
          ]}
        />
      </div>
    </main>
  )
}
