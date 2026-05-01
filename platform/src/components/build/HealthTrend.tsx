import type { ScriptsTrend, StalenessEntry } from '@/lib/build/types'
import { TrendLine } from './charts/TrendLine'
import { formatDate } from '@/lib/build/format'

export function HealthTrend({
  scripts_trend,
  staleness_register,
  next_quarterly_pass,
  days_to_pass,
}: {
  scripts_trend: ScriptsTrend
  staleness_register: StalenessEntry[]
  next_quarterly_pass: string
  days_to_pass: number | null
}) {
  const stale = staleness_register.filter((e) => e.path !== 'file_path')

  return (
    <div className="space-y-6">
      {/* Full LineCharts — one per script */}
      <section>
        <p className="bt-label mb-3">Script trend</p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <TrendLine data={scripts_trend.drift_detector} label="Drift detector" height={180} />
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <TrendLine data={scripts_trend.schema_validator} label="Schema validator" height={180} />
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <TrendLine data={scripts_trend.mirror_enforcer} label="Mirror enforcer" height={180} />
          </div>
        </div>
        <p className="bt-label mt-2 text-muted-foreground">
          Reference line at exit 2 (baseline). Dots color-coded by exit code: 0=green, 2=amber, 3/4=red.
        </p>
      </section>

      {/* Quarterly pass countdown */}
      <section>
        <p className="bt-label mb-3">Quarterly governance pass</p>
        <div className="rounded-xl border border-border bg-card p-5 flex items-center justify-between">
          <div>
            <p className="bt-body font-medium">Next pass due</p>
            <p className="bt-body text-muted-foreground">{formatDate(next_quarterly_pass)}</p>
          </div>
          <div className="text-right">
            {days_to_pass === null ? (
              <p className="bt-mega text-muted-foreground">—</p>
            ) : days_to_pass > 0 ? (
              <p className="bt-mega">{days_to_pass}d</p>
            ) : (
              <p className="bt-mega text-destructive">Overdue</p>
            )}
          </div>
        </div>
      </section>

      {/* Staleness register */}
      <section>
        <p className="bt-label mb-3">Staleness register ({stale.length} entries)</p>
        {stale.length === 0 ? (
          <p className="bt-body text-muted-foreground">No stale artifacts.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="bt-label px-4 py-2.5 text-left">Path</th>
                  <th className="bt-label px-4 py-2.5 text-left">Since</th>
                  <th className="bt-label px-4 py-2.5 text-left">Reason</th>
                </tr>
              </thead>
              <tbody>
                {stale.map((e, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="bt-mono px-4 py-2 text-xs truncate max-w-[260px]" title={e.path}>
                      {e.path}
                    </td>
                    <td className="bt-body px-4 py-2 text-muted-foreground whitespace-nowrap">
                      {e.since}
                    </td>
                    <td className="bt-body px-4 py-2 text-muted-foreground">{e.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
