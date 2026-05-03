// ReconciliationBanner — slim horizontal strip showing the most recent
// reconciliation status per provider. Server component (no 'use client').
//
// Renders nothing when there is no reconciliation history at all (empty
// fragment, not an error). Per OBSERVATORY_PLAN §2.2, variance_alert chips
// are surfaced here as a passive UX cue; alerting/paging is the budget
// rules' job (O.3), not reconciliation's.

import { loadLatestReconciliationPerProvider } from './loader'
import {
  ReconciliationBannerView,
  type ReconciliationBannerRow,
} from './ReconciliationBannerView'

export async function ReconciliationBanner() {
  const rows = await loadLatestReconciliationPerProvider()
  return <ReconciliationBannerView rows={rows as ReconciliationBannerRow[]} />
}

export { ReconciliationBannerView }
export type { ReconciliationBannerRow }
