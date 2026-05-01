import Link from 'next/link'
import { listPredictions } from '@/lib/prediction/queries'
import { PredictionLedgerClient } from '@/components/audit/PredictionLedgerClient'

export const metadata = { title: 'Predictions — MARSYS-JIS' }

export default async function PredictionsPage() {
  const [openResult, closedResult] = await Promise.all([
    listPredictions({ status: 'open', subject: 'native:abhisek' }),
    listPredictions({ status: 'closed', subject: 'native:abhisek' }),
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

      <PredictionLedgerClient
        initialOpen={openResult.rows}
        initialClosed={closedResult.rows}
      />
    </div>
  )
}
