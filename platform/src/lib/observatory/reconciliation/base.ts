// Phase O — O.2 Reconciliation framework: BaseReconciler template.
//
// Subclasses (S2.2 Anthropic, S2.3 OpenAI, S2.4 Gemini, S2.5 DeepSeek+NIM
// CSV) implement only `fetchAuthoritativeCost`; the template orchestrates
// persistence + variance classification + result assembly. Never throws —
// every failure path returns a result with status='error' and an explanatory
// `notes` field.
//
// Schema mapping (migration 038 frozen for O.2):
//   llm_provider_cost_reports     ← raw fetch payload
//     period_start  → time_bucket_start (cast to timestamptz at midnight UTC)
//     period_end    → time_bucket_end   (cast to start-of-next-day UTC, half-open)
//   llm_cost_reconciliation       ← variance ledger
//     period_start  → reconciliation_date (DATE; multi-day periods echo full
//                                          range in `notes`)
//     computed_cost_usd      → computed_total_usd
//     authoritative_cost_usd → authoritative_total_usd

import 'server-only'
import { query } from '@/lib/db/client'
import { classifyVariance, computePeriodCost } from './variance'
import type {
  ProviderName,
  ProviderReconcileInput,
  ProviderReconcileResult,
  ProviderReconciler,
  ReconciliationConfig,
} from './types'

export interface FetchAuthoritativeCostResult {
  cost_usd: number
  raw_payload: unknown
}

export abstract class BaseReconciler implements ProviderReconciler {
  abstract readonly provider: ProviderName

  /** Implemented by S2.2–S2.5 subclasses. May throw — the template catches. */
  protected abstract fetchAuthoritativeCost(
    input: ProviderReconcileInput,
  ): Promise<FetchAuthoritativeCostResult>

  async reconcile(
    input: ProviderReconcileInput,
    config: ReconciliationConfig,
  ): Promise<ProviderReconcileResult> {
    const baseResult: ProviderReconcileResult = {
      provider: input.provider,
      period_start: input.period_start,
      period_end: input.period_end,
      authoritative_cost_usd: 0,
      computed_cost_usd: 0,
      variance_usd: 0,
      variance_pct: 0,
      status: 'error',
      event_count: 0,
      raw_report_id: '',
    }

    let authoritative: FetchAuthoritativeCostResult
    try {
      authoritative = await this.fetchAuthoritativeCost(input)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      try {
        await query(
          `INSERT INTO llm_provider_cost_reports
             (provider, model, time_bucket_start, time_bucket_end,
              authoritative_cost_usd, raw_payload)
           VALUES ($1, NULL, $2::date, ($3::date + INTERVAL '1 day'), 0, $4)`,
          [
            input.provider,
            input.period_start,
            input.period_end,
            JSON.stringify({ error: message }),
          ],
        )
      } catch {
        // Best-effort error log; never escalates above template.
      }
      return { ...baseResult, status: 'error', notes: message }
    }

    let raw_report_id = ''
    try {
      const { rows } = await query<{ report_id: string }>(
        `INSERT INTO llm_provider_cost_reports
           (provider, model, time_bucket_start, time_bucket_end,
            authoritative_cost_usd, raw_payload)
         VALUES ($1, NULL, $2::date, ($3::date + INTERVAL '1 day'), $4, $5)
         RETURNING report_id`,
        [
          input.provider,
          input.period_start,
          input.period_end,
          authoritative.cost_usd,
          authoritative.raw_payload === undefined
            ? null
            : JSON.stringify(authoritative.raw_payload),
        ],
      )
      raw_report_id = rows[0]?.report_id ?? ''
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { ...baseResult, status: 'error', notes: `report_persist_failed: ${message}` }
    }

    const periodTotals = await computePeriodCost(
      input.provider,
      input.period_start,
      input.period_end,
    )
    const computed_cost_usd = periodTotals.total_cost_usd
    const authoritative_cost_usd = authoritative.cost_usd
    const variance_usd = authoritative_cost_usd - computed_cost_usd
    const variance_pct =
      authoritative_cost_usd === 0
        ? 0
        : (Math.abs(variance_usd) / authoritative_cost_usd) * 100
    const status = classifyVariance(
      computed_cost_usd,
      authoritative_cost_usd,
      config,
    )

    const periodSpansMultipleDays = input.period_start !== input.period_end
    const notes = [
      `raw_report_id=${raw_report_id}`,
      periodSpansMultipleDays
        ? `period=${input.period_start}..${input.period_end}`
        : null,
    ]
      .filter(Boolean)
      .join('; ')

    try {
      await query(
        `INSERT INTO llm_cost_reconciliation
           (reconciliation_date, provider, model,
            computed_total_usd, authoritative_total_usd,
            variance_usd, variance_pct, event_count, status, notes)
         VALUES ($1::date, $2, NULL, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (reconciliation_date, provider, COALESCE(model, ''))
         DO UPDATE SET
            computed_total_usd      = EXCLUDED.computed_total_usd,
            authoritative_total_usd = EXCLUDED.authoritative_total_usd,
            variance_usd            = EXCLUDED.variance_usd,
            variance_pct            = EXCLUDED.variance_pct,
            event_count             = EXCLUDED.event_count,
            status                  = EXCLUDED.status,
            notes                   = EXCLUDED.notes,
            reconciled_at           = NOW()`,
        [
          input.period_start,
          input.provider,
          computed_cost_usd,
          authoritative_cost_usd,
          variance_usd,
          variance_pct,
          periodTotals.event_count,
          status,
          notes,
        ],
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return {
        ...baseResult,
        authoritative_cost_usd,
        computed_cost_usd,
        variance_usd,
        variance_pct,
        event_count: periodTotals.event_count,
        raw_report_id,
        status: 'error',
        notes: `reconciliation_persist_failed: ${message}`,
      }
    }

    return {
      provider: input.provider,
      period_start: input.period_start,
      period_end: input.period_end,
      authoritative_cost_usd,
      computed_cost_usd,
      variance_usd,
      variance_pct,
      status,
      event_count: periodTotals.event_count,
      raw_report_id,
      notes: notes || undefined,
    }
  }
}
