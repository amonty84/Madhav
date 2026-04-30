import type { InsightCard } from '@/lib/build/types'

interface Props {
  insights: InsightCard[]
}

function severityIcon(severity: InsightCard['severity']) {
  if (severity === 'positive') return '✓'
  if (severity === 'concern') return '!'
  return '·'
}

function severityClass(severity: InsightCard['severity']) {
  if (severity === 'positive')
    return 'border-status-success bg-status-success-bg'
  if (severity === 'concern')
    return 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-600'
  return 'border-border bg-muted/40'
}

function iconClass(severity: InsightCard['severity']) {
  if (severity === 'positive') return 'text-status-success'
  if (severity === 'concern') return 'text-amber-600 dark:text-amber-400'
  return 'text-muted-foreground'
}

export function InsightCards({ insights }: Props) {
  if (!insights.length) return null
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="bt-label mb-3">Insights</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {insights.map((card) => (
          <div
            key={card.id}
            className={`flex items-start gap-2.5 rounded-lg border p-3 ${severityClass(card.severity)}`}
          >
            <span className={`shrink-0 font-bold text-sm mt-0.5 ${iconClass(card.severity)}`}>
              {severityIcon(card.severity)}
            </span>
            <p className="bt-body leading-snug">{card.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
