import Link from 'next/link'
import { listPredictions, computeCalibrationMetrics } from '@/lib/prediction/queries'
import { PredictionLedgerClient } from '@/components/audit/PredictionLedgerClient'

export const metadata = { title: 'Predictions — MARSYS-JIS' }

function brierColor(score: number | null): string {
  if (score === null) return 'text-foreground'
  if (score <= 0.1) return 'text-green-600'
  if (score <= 0.25) return 'text-amber-600'
  return 'text-red-600'
}

export default async function PredictionsPage() {
  const [openResult, closedResult, metrics] = await Promise.all([
    listPredictions({ status: 'open', subject: 'native:abhisek' }),
    listPredictions({ status: 'closed', subject: 'native:abhisek' }),
    computeCalibrationMetrics('native:abhisek'),
  ])

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/audit" className="hover:text-foreground transition-colors">Audit log</Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">Predictions</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Prediction Ledger</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Prospective predictions — sacrosanct held-out data per CLAUDE.md §E
        </p>
      </div>

      <div className="mb-6 rounded-lg border px-5 py-4 bg-card">
        <div className="flex flex-wrap gap-6 text-sm">
          <span>
            <span className="text-muted-foreground">Mean Brier score:</span>{' '}
            <span className={brierColor(metrics.mean_brier_score)}>
              {metrics.mean_brier_score != null
                ? metrics.mean_brier_score.toFixed(3)
                : '—'}
            </span>
            <span className="text-muted-foreground ml-1">
              ({metrics.closed_count} closed)
            </span>
          </span>
          <span>
            <span className="text-muted-foreground">Confirmed:</span>{' '}
            {metrics.confirmed_count}
          </span>
          <span>
            <span className="text-muted-foreground">Refuted:</span>{' '}
            {metrics.refuted_count}
          </span>
          <span>
            <span className="text-muted-foreground">Partial/unobservable:</span>{' '}
            {metrics.partial_count}
          </span>
        </div>
      </div>

      <PredictionLedgerClient
        initialOpen={openResult.rows}
        initialClosed={closedResult.rows}
      />
    </div>
  )
}
