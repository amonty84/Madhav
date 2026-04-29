import Link from 'next/link'
import { getActiveCharts } from '@/lib/build/dataSource'

function HealthDot({ health }: { health: 'green' | 'amber' | 'red' }) {
  const colors = {
    green: 'bg-green-500',
    amber: 'bg-amber-400',
    red: 'bg-red-500',
  }
  return (
    <span
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${colors[health]}`}
      aria-label={`Health: ${health}`}
    />
  )
}

function BuildMeter({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, pct))
  return (
    <span className="flex items-center gap-1.5">
      <span className="relative h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <span
          className="absolute inset-y-0 left-0 rounded-full bg-[var(--brand-gold)]"
          style={{ width: `${clamped}%` }}
        />
      </span>
      <span className="bt-label tabular-nums">{Math.round(clamped)}%</span>
    </span>
  )
}

function relativeTime(iso: string | null): string {
  if (!iso) return '—'
  const ms = Date.now() - new Date(iso).getTime()
  const days = Math.floor(ms / 86_400_000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export async function ActiveChartsWidget() {
  const charts = await getActiveCharts({ limit: 5 })

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="bt-label mb-3">Active charts</p>
      {charts.length === 0 ? (
        <p className="bt-body text-muted-foreground">No charts yet.</p>
      ) : (
        <ul className="divide-y divide-border">
          {charts.map((chart) => (
            <li key={chart.id} className="py-2 first:pt-0 last:pb-0">
              <Link
                href={`/clients/${chart.client_id}`}
                className="group flex items-center gap-3"
              >
                <HealthDot health={chart.health} />
                <span className="bt-body min-w-0 flex-1 truncate font-medium group-hover:underline">
                  {chart.name}
                </span>
                <BuildMeter pct={chart.build_pct} />
                <span className="bt-label w-20 shrink-0 text-right text-muted-foreground">
                  {relativeTime(chart.last_activity)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
