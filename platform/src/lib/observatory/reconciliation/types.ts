// Phase O — O.2 Reconciliation framework: shared types.
//
// Authored by USTAD_S2_1_RECONCILIATION_FRAMEWORK per OBSERVATORY_PLAN §2.2 +
// §3.4. Per-provider reconcilers (S2.2 Anthropic, S2.3 OpenAI, S2.4 Gemini,
// S2.5 DeepSeek+NIM CSV) implement the abstract `ProviderReconciler`
// interface; the BaseReconciler template (`./base.ts`) handles persistence
// and variance classification so subclasses only implement
// `fetchAuthoritativeCost`.
//
// Schema reality (migration 038 — frozen for O.2): `llm_cost_reconciliation`
// stores a single `reconciliation_date` (DATE) and uses `computed_total_usd`
// + `authoritative_total_usd`. The in-memory `ProviderReconcileResult`
// preserves the brief's period_start/period_end/computed_cost_usd/
// authoritative_cost_usd/raw_report_id naming because that is the public API
// shape downstream sessions consume. The SQL boundary in `./base.ts` maps:
//   period_start  → reconciliation_date  (DATE; for multi-day periods, the
//                                         start day is recorded; full span is
//                                         echoed in `notes`)
//   computed_cost_usd      → computed_total_usd
//   authoritative_cost_usd → authoritative_total_usd
//   raw_report_id is NOT persisted to llm_cost_reconciliation (no FK column);
//   it is returned in-memory only and surfaces in API responses.

import type { LlmProvider } from '@/lib/db/schema/observatory'

export type ProviderName = LlmProvider

/** Inclusive date range (`YYYY-MM-DD`) describing the reconciliation period.
 *  S2.2–S2.5 reconcilers daily by default; longer ranges are supported by the
 *  framework but require the per-provider authoritative API to honor the same
 *  range. */
export interface ProviderReconcileInput {
  provider: ProviderName
  /** ISO date `YYYY-MM-DD` (inclusive). */
  period_start: string
  /** ISO date `YYYY-MM-DD` (inclusive). */
  period_end: string
}

export type ReconciliationStatus =
  | 'matched'
  | 'variance_within_tolerance'
  | 'variance_alert'
  | 'missing_authoritative'
  | 'error'

export interface ProviderReconcileResult {
  provider: ProviderName
  period_start: string
  period_end: string
  /** Provider-billed authoritative cost over the period. NaN/undefined →
   *  status='missing_authoritative'; value retained as-was for audit. */
  authoritative_cost_usd: number
  /** Sum of llm_usage_events.computed_cost_usd over the period. */
  computed_cost_usd: number
  /** authoritative_cost_usd - computed_cost_usd (signed). 0 when
   *  authoritative is missing (variance is undefined in that case). */
  variance_usd: number
  /** |variance_usd| / authoritative_cost_usd * 100. 0 when authoritative is
   *  zero or missing. */
  variance_pct: number
  status: ReconciliationStatus
  /** Number of llm_usage_events rows in the period. */
  event_count: number
  /** llm_provider_cost_reports.report_id for the row that captured the raw
   *  authoritative payload. Empty string when the fetch failed before
   *  persistence (status='error') or when authoritative was unavailable
   *  (status='missing_authoritative'). */
  raw_report_id: string
  notes?: string
}

export interface ReconciliationConfig {
  /** |variance_pct| <= this → 'matched'. */
  tolerance_pct: number
  /** |variance_pct| <= this → 'variance_within_tolerance'; above → 'variance_alert'. */
  alert_pct: number
}

export const DEFAULT_RECONCILIATION_CONFIG: ReconciliationConfig = {
  tolerance_pct: 2.0,
  alert_pct: 5.0,
}

export interface ProviderReconciler {
  readonly provider: ProviderName
  reconcile(
    input: ProviderReconcileInput,
    config: ReconciliationConfig,
  ): Promise<ProviderReconcileResult>
}

/** Shape returned by `GET /api/admin/observatory/reconciliation/history`. */
export interface ReconciliationHistoryRow {
  reconciliation_id: string
  provider: ProviderName | string
  period_start: string
  period_end: string
  status: ReconciliationStatus | string
  variance_pct: number | null
  computed_cost_usd: number
  authoritative_cost_usd: number | null
  created_at: string
}

export interface ReconciliationHistoryResponse {
  rows: ReconciliationHistoryRow[]
  total: number
}

/** Errors used by the API surface to disambiguate "not implemented yet" from
 *  hard failures. S2.1 ships only stubs; S2.2–S2.5 replace them. */
export class NotImplementedError extends Error {
  constructor(public readonly providerName: ProviderName) {
    super(`Reconciler for provider "${providerName}" not yet implemented`)
    this.name = 'NotImplementedError'
  }
}
