import Link from 'next/link'
import { fetchBuildState } from '@/lib/build/dataSource'
import { HealthTrend } from '@/components/build/HealthTrend'
import { MirrorPairsTable } from '@/components/build/MirrorPairsTable'
import { ScriptVerdictBadge } from '@/components/build/ScriptVerdictBadge'
import { daysUntil } from '@/lib/build/format'

export const dynamic = 'force-dynamic'

function StatBlock({
  label,
  value,
  sub,
  tone = 'default',
}: {
  label: string
  value: string | number
  sub?: string
  tone?: 'default' | 'warning' | 'danger'
}) {
  const valueClass =
    tone === 'warning'
      ? 'text-amber-600 dark:text-amber-400'
      : tone === 'danger'
        ? 'text-destructive'
        : ''
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="bt-label">{label}</p>
      <p className={`bt-num mt-1 ${valueClass}`}>{value}</p>
      {sub && <p className="bt-body mt-0.5 text-muted-foreground">{sub}</p>}
    </div>
  )
}

export default async function HealthPage() {
  const state = await fetchBuildState()
  const { governance, native_directives, disagreement_register, mirror_pairs } = state
  const daysToPass = daysUntil(governance.next_quarterly_pass)

  const lastDrift = governance.scripts_trend.drift_detector.at(-1)?.exit_code ?? null
  const lastSchema = governance.scripts_trend.schema_validator.at(-1)?.exit_code ?? null
  const lastMirror = governance.scripts_trend.mirror_enforcer.at(-1)?.exit_code ?? null

  // Tri-state: unknown (any null/undefined) > unhealthy (any non-zero) > healthy (all zero)
  const anyUnknown = lastDrift === null || lastSchema === null || lastMirror === null
  const anyUnhealthy = !anyUnknown && (lastDrift !== 0 || lastSchema !== 0 || lastMirror !== 0)
  const overallHealth = anyUnknown ? 'unknown' : anyUnhealthy ? 'unhealthy' : 'healthy'

  const healthBadgeClass =
    overallHealth === 'healthy'
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
      : overallHealth === 'unhealthy'
        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
        : 'bg-muted text-muted-foreground'
  const healthLabel =
    overallHealth === 'healthy' ? 'All clear' : overallHealth === 'unhealthy' ? 'Findings' : 'No recent run'

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="bt-display">System Health</h1>
        <Link href="/build" className="bt-body text-muted-foreground hover:underline">
          ← Back to cockpit
        </Link>
      </div>

      {/* Top-level gauges */}
      <section className="mb-8">
        <p className="bt-label mb-3">At-a-glance</p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="bt-label">Last script run</p>
            <div className="mt-1.5 mb-2">
              <span className={`bt-label inline-flex items-center gap-1 rounded px-2 py-0.5 ${healthBadgeClass}`}>
                {overallHealth === 'healthy' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                {overallHealth === 'unhealthy' && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                {overallHealth === 'unknown' && <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />}
                {healthLabel}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <ScriptVerdictBadge code={lastDrift} label="drift" />
              <ScriptVerdictBadge code={lastSchema} label="schema" />
              <ScriptVerdictBadge code={lastMirror} label="mirror" />
            </div>
          </div>
          <StatBlock
            label="Red-team counter"
            value={`${governance.red_team.counter}/${governance.red_team.next_fires_at_counter}`}
            sub={`fires in ${governance.red_team.sessions_until_next} sessions`}
          />
          <StatBlock
            label="Quarterly pass"
            value={daysToPass !== null ? (daysToPass > 0 ? `${daysToPass}d` : 'Overdue') : '—'}
            sub={governance.next_quarterly_pass}
            tone={daysToPass !== null && daysToPass <= 0 ? 'danger' : 'default'}
          />
          <div className="grid grid-cols-2 gap-2">
            <StatBlock
              label="Open NDs"
              value={native_directives.open.length}
              tone={native_directives.open.length > 0 ? 'warning' : 'default'}
            />
            <StatBlock
              label="Open DRs"
              value={disagreement_register.open_count}
              tone={disagreement_register.open_count > 0 ? 'warning' : 'default'}
            />
          </div>
        </div>
      </section>

      <HealthTrend
        scripts_trend={governance.scripts_trend}
        staleness_register={state.staleness_register}
        next_quarterly_pass={governance.next_quarterly_pass}
        days_to_pass={daysToPass}
      />

      <section className="mt-8">
        <p className="bt-label mb-3">Mirror pairs (Claude ↔ Gemini)</p>
        <MirrorPairsTable pairs={mirror_pairs} />
      </section>

      {(native_directives.entries.length > 0 || disagreement_register.entries.length > 0) && (
        <section className="mt-8 grid gap-6 md:grid-cols-2">
          {native_directives.entries.length > 0 && (
            <div>
              <p className="bt-label mb-3">Native directives</p>
              <div className="rounded-lg border border-border bg-card divide-y divide-border">
                {native_directives.entries.map((nd) => (
                  <div key={nd.nd_id} className="p-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="bt-body font-medium">{nd.title}</span>
                      <span className="bt-label shrink-0">{nd.status}</span>
                    </div>
                    <p className="bt-label mt-0.5">
                      {nd.nd_id}
                      {nd.issued_on && ` · issued ${nd.issued_on}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {disagreement_register.entries.length > 0 && (
            <div>
              <p className="bt-label mb-3">Disagreements</p>
              <div className="rounded-lg border border-border bg-card divide-y divide-border">
                {disagreement_register.entries.map((dr) => (
                  <div key={dr.dr_id} className="p-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="bt-body font-medium">{dr.dr_id}</span>
                      <span className="bt-label shrink-0">{dr.status}</span>
                    </div>
                    <p className="bt-body mt-0.5 text-muted-foreground">{dr.description}</p>
                    <p className="bt-label mt-0.5">{dr.class}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  )
}
