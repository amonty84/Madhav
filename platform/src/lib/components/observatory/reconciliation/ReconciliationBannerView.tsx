// Pure presentation half of ReconciliationBanner — accepts pre-loaded rows
// and renders the chip strip. Split out so unit tests don't need to stub
// the DB loader.

import type {
  ReconciliationHistoryRow,
} from '@/lib/observatory/reconciliation/types'
import { StatusChip } from './StatusChip'

export type ReconciliationBannerRow = ReconciliationHistoryRow

export interface ReconciliationBannerViewProps {
  rows: ReconciliationBannerRow[]
  /** Override the click-through href (default `/observatory/reconciliation`). */
  linkHref?: string
}

export function ReconciliationBannerView({
  rows,
  linkHref = '/observatory/reconciliation',
}: ReconciliationBannerViewProps) {
  if (!rows || rows.length === 0) return null

  // Most-recent per provider. Loader already deduplicates, but defending
  // against arbitrary inputs (and non-loader callers) is cheap.
  const seen = new Set<string>()
  const dedup: ReconciliationBannerRow[] = []
  for (const row of rows) {
    if (seen.has(row.provider)) continue
    seen.add(row.provider)
    dedup.push(row)
  }

  return (
    <div
      data-testid="reconciliation-banner"
      role="region"
      aria-label="Reconciliation status by provider"
      className="flex items-center gap-2 border-b bg-muted/30 px-6 py-1.5 text-xs"
    >
      <span className="text-muted-foreground">Reconciliation:</span>
      <div className="flex flex-wrap items-center gap-1.5">
        {dedup.map(row => (
          <StatusChip
            key={row.reconciliation_id}
            provider={row.provider}
            status={row.status}
            variancePct={row.variance_pct}
            href={linkHref}
          />
        ))}
      </div>
    </div>
  )
}
