// Phase O — O.2 Reconciliation framework: variance classifier + period-cost
// rollup. Pure logic, no provider knowledge — consumed by `./base.ts` and
// directly testable in unit tests without DB.

import 'server-only'
import { query } from '@/lib/db/client'
import type {
  ProviderName,
  ReconciliationConfig,
  ReconciliationStatus,
} from './types'

/** Classify a (computed, authoritative) cost pair into a ReconciliationStatus.
 *
 *  Rules per OBSERVATORY_PLAN §2.2:
 *    - authoritative null/undefined/NaN → 'missing_authoritative'
 *    - authoritative === 0 (free tier or no billable usage):
 *        - computed === 0 → 'matched'  (zero-vs-zero)
 *        - computed !== 0 → 'variance_alert'  (we billed locally but provider
 *          shows nothing — almost certainly a pricing/seed bug)
 *    - variance_pct = |authoritative - computed| / authoritative * 100
 *    - variance_pct <= tolerance_pct → 'matched'
 *    - variance_pct <= alert_pct     → 'variance_within_tolerance'
 *    - else                           → 'variance_alert'
 */
export function classifyVariance(
  computed_cost_usd: number,
  authoritative_cost_usd: number | null | undefined,
  config: ReconciliationConfig,
): ReconciliationStatus {
  if (
    authoritative_cost_usd === null ||
    authoritative_cost_usd === undefined ||
    Number.isNaN(authoritative_cost_usd)
  ) {
    return 'missing_authoritative'
  }
  if (authoritative_cost_usd === 0) {
    return computed_cost_usd === 0 ? 'matched' : 'variance_alert'
  }
  const variance_pct =
    (Math.abs(authoritative_cost_usd - computed_cost_usd) /
      authoritative_cost_usd) *
    100
  if (variance_pct <= config.tolerance_pct) return 'matched'
  if (variance_pct <= config.alert_pct) return 'variance_within_tolerance'
  return 'variance_alert'
}

/** Sum llm_usage_events.computed_cost_usd over [period_start, period_end + 1day)
 *  for the given provider. Uses `started_at` (the call's wall-clock time) — not
 *  `created_at` (the DB insert time) — to align with queries.ts and the
 *  `idx_llm_usage_events_started_at` index; the per-period rollup is what the
 *  authoritative provider billing measures. (Brief literally specified
 *  `created_at`; correctness + index alignment require started_at.) */
export async function computePeriodCost(
  provider: ProviderName,
  period_start: string,
  period_end: string,
): Promise<{ total_cost_usd: number; event_count: number }> {
  const { rows } = await query<{ total_cost_usd: number | null; event_count: string }>(
    `SELECT
       COALESCE(SUM(computed_cost_usd), 0)::float8  AS total_cost_usd,
       COUNT(*)::text                                AS event_count
     FROM llm_usage_events
     WHERE provider = $1
       AND started_at >= $2::date
       AND started_at <  ($3::date + INTERVAL '1 day')`,
    [provider, period_start, period_end],
  )
  const r = rows[0]
  return {
    total_cost_usd: Number(r?.total_cost_usd ?? 0),
    event_count: Number(r?.event_count ?? 0),
  }
}
