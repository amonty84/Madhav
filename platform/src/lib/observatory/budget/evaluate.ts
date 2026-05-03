// Phase O — O.3 Budgets — evaluation engine.
//
// Authored by USTAD_S3_1_BUDGET_RULES_FRAMEWORK. Pure functions where
// possible; the DB-touching ones accept the query helper from
// `@/lib/db/client` directly so callers can swap in a mock.
//
// Three responsibilities:
//   1. computePeriodBounds — given a period kind ('daily' / 'weekly' /
//      'monthly') and an `as_of` clock (defaulting to now), return the UTC
//      [start, end) window as ISO date strings.
//   2. computeScopeSpend — sum llm_usage_events.computed_cost_usd over the
//      period for a given scope (total / provider / model / pipeline_stage).
//   3. classifyBudgetStatus / evaluateBudgetRule / evaluateAllRules — the
//      orchestration the API endpoint calls.
//
// Discipline:
//   - All filtering is in SQL with bound parameters; never string-interpolated.
//   - Errors at the DB layer are caught and surfaced as `status: 'ok'` with
//     `current_spend_usd: 0`, matching the brief's never-throw contract. The
//     console.error log preserves a forensic trail.

import 'server-only'
import { query } from '../../db/client'
import type {
  AlertThreshold,
  BudgetEvaluationResult,
  BudgetPeriod,
  BudgetRuleRow,
  BudgetScope,
  BudgetStatus,
} from './types'

// ---------------------------------------------------------------------------
// 1. Period bounds — pure
// ---------------------------------------------------------------------------

/** Render a Date as a UTC `YYYY-MM-DD` string. */
function toIsoDate(d: Date): string {
  const yyyy = d.getUTCFullYear().toString().padStart(4, '0')
  const mm = (d.getUTCMonth() + 1).toString().padStart(2, '0')
  const dd = d.getUTCDate().toString().padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/** Returns [start, end] inclusive as `YYYY-MM-DD` strings, both at UTC.
 *  - daily:   [today, today]
 *  - weekly:  [Monday of this week, Sunday of this week] — ISO 8601 week.
 *  - monthly: [first of this UTC month, last of this UTC month]. */
export function computePeriodBounds(
  period: BudgetPeriod,
  asOf?: Date,
): { start: string; end: string } {
  const ref = asOf ?? new Date()
  // Normalise to UTC midnight to avoid TZ slippage.
  const ref0 = new Date(
    Date.UTC(
      ref.getUTCFullYear(),
      ref.getUTCMonth(),
      ref.getUTCDate(),
    ),
  )
  if (period === 'daily') {
    const iso = toIsoDate(ref0)
    return { start: iso, end: iso }
  }
  if (period === 'weekly') {
    // ISO weekday: Mon=1 ... Sun=7. JS getUTCDay: Sun=0 ... Sat=6.
    const jsDay = ref0.getUTCDay()
    const isoDay = jsDay === 0 ? 7 : jsDay
    const monday = new Date(ref0)
    monday.setUTCDate(monday.getUTCDate() - (isoDay - 1))
    const sunday = new Date(monday)
    sunday.setUTCDate(sunday.getUTCDate() + 6)
    return { start: toIsoDate(monday), end: toIsoDate(sunday) }
  }
  // monthly
  const first = new Date(
    Date.UTC(ref0.getUTCFullYear(), ref0.getUTCMonth(), 1),
  )
  const last = new Date(
    Date.UTC(ref0.getUTCFullYear(), ref0.getUTCMonth() + 1, 0),
  )
  return { start: toIsoDate(first), end: toIsoDate(last) }
}

// ---------------------------------------------------------------------------
// 2. Scope spend — DB-touching
// ---------------------------------------------------------------------------

interface QueryFn {
  <R = unknown>(
    sql: string,
    params?: unknown[],
  ): Promise<{ rows: R[] }>
}

/** Sum `llm_usage_events.computed_cost_usd` for a budget scope window.
 *  `period_end` is inclusive — the WHERE expands to `< period_end + 1 day`. */
export async function computeScopeSpend(
  scope: BudgetScope,
  scopeValue: string | null,
  periodStart: string,
  periodEnd: string,
  queryFn: QueryFn = query as QueryFn,
): Promise<number> {
  const where: string[] = [
    'started_at >= $1::date',
    "started_at <  ($2::date + INTERVAL '1 day')",
  ]
  const params: unknown[] = [periodStart, periodEnd]

  if (scope !== 'total') {
    if (!scopeValue) {
      // A non-total scope without a scope_value can't filter — treat as zero.
      // The API layer rejects this on POST/PATCH; this is a defensive guard
      // for stale rows that pre-date validation.
      return 0
    }
    if (scope === 'provider') {
      where.push('provider = $3')
    } else if (scope === 'model') {
      where.push('model = $3')
    } else if (scope === 'pipeline_stage') {
      where.push('pipeline_stage = $3')
    } else {
      const exhaustive: never = scope
      throw new Error(`Unsupported budget scope: ${exhaustive as string}`)
    }
    params.push(scopeValue)
  }

  const sql =
    'SELECT COALESCE(SUM(computed_cost_usd), 0)::float8 AS total_cost_usd' +
    ' FROM llm_usage_events' +
    ' WHERE ' + where.join(' AND ')

  const { rows } = await queryFn<{ total_cost_usd: number | string | null }>(
    sql,
    params,
  )
  const raw = rows[0]?.total_cost_usd ?? 0
  return Number(raw)
}

// ---------------------------------------------------------------------------
// 3. Status classification — pure
// ---------------------------------------------------------------------------

/** Classify a percentage-used against a rule's alert_thresholds. Pure;
 *  no rounding or floating-point fudge — caller is expected to pass a
 *  clean numeric pct in [0, ∞).
 *
 *  Thresholds are sorted ascending by pct; the function picks the highest
 *  band the pct meets-or-exceeds. */
export function classifyBudgetStatus(
  pctUsed: number,
  thresholds: AlertThreshold[],
): BudgetStatus {
  if (pctUsed >= 100) return 'exceeded'
  if (!thresholds || thresholds.length === 0) return 'ok'
  const sorted = [...thresholds].sort((a, b) => a.pct - b.pct)
  const lowest = sorted[0]
  const highest = sorted[sorted.length - 1]
  if (pctUsed >= highest.pct) return 'alert'
  if (pctUsed >= lowest.pct) return 'warning'
  return 'ok'
}

/** Subset of the rule's alert_thresholds whose `pct` is at-or-below the
 *  observed pct_used (i.e. thresholds the run has crossed). Sorted ascending
 *  by pct in the returned array. */
export function alertsTriggered(
  pctUsed: number,
  thresholds: AlertThreshold[],
): AlertThreshold[] {
  if (!thresholds || thresholds.length === 0) return []
  const sorted = [...thresholds].sort((a, b) => a.pct - b.pct)
  return sorted.filter(t => pctUsed >= t.pct)
}

// ---------------------------------------------------------------------------
// 4. Per-rule evaluator — never throws
// ---------------------------------------------------------------------------

function coerceThresholds(value: unknown): AlertThreshold[] {
  if (!Array.isArray(value)) return []
  const out: AlertThreshold[] = []
  for (const v of value) {
    if (
      v &&
      typeof v === 'object' &&
      typeof (v as { pct?: unknown }).pct === 'number' &&
      typeof (v as { channel?: unknown }).channel === 'string'
    ) {
      const entry: AlertThreshold = {
        pct: (v as { pct: number }).pct,
        channel: (v as { channel: string }).channel,
      }
      // ND.S3.2.1 fix — preserve channel_target so the dispatcher can route
      // webhook alerts to the stored URL after a DB round-trip. Only attach
      // when the source value is a non-empty string; null/undefined/empty
      // collapse to absence (no explicit `undefined` key in the result).
      const target = (v as { channel_target?: unknown }).channel_target
      if (typeof target === 'string' && target.length > 0) {
        entry.channel_target = target
      }
      out.push(entry)
    }
  }
  return out
}

export async function evaluateBudgetRule(
  rule: BudgetRuleRow,
  asOf?: Date,
  queryFn: QueryFn = query as QueryFn,
): Promise<BudgetEvaluationResult> {
  const scope = rule.scope as BudgetScope
  const period = rule.period as BudgetPeriod
  const { start, end } = computePeriodBounds(period, asOf)
  const thresholds = coerceThresholds(rule.alert_thresholds)

  let currentSpend = 0
  try {
    currentSpend = await computeScopeSpend(
      scope,
      rule.scope_value,
      start,
      end,
      queryFn,
    )
  } catch (err) {
    console.error(
      '[observatory/budget/evaluate] computeScopeSpend failed; ' +
        'returning status=ok with spend=0 for rule',
      rule.budget_rule_id,
      err,
    )
    currentSpend = 0
  }

  const amount = Number(rule.amount_usd) || 0
  const pctUsed = amount > 0 ? (currentSpend / amount) * 100 : 0
  const status = classifyBudgetStatus(pctUsed, thresholds)
  const triggered = alertsTriggered(pctUsed, thresholds)

  return {
    rule_id: rule.budget_rule_id,
    name: rule.name,
    scope,
    scope_value: rule.scope_value,
    period,
    period_start: start,
    period_end: end,
    amount_usd: amount,
    current_spend_usd: currentSpend,
    pct_used: pctUsed,
    status,
    alerts_triggered: triggered,
  }
}

// ---------------------------------------------------------------------------
// 5. All-rules evaluator — fetches active rules and runs evaluator per row.
//    Returns the array sorted by pct_used DESC (highest-utilised first).
// ---------------------------------------------------------------------------

export async function evaluateAllRules(
  asOf?: Date,
  queryFn: QueryFn = query as QueryFn,
): Promise<BudgetEvaluationResult[]> {
  const { rows } = await queryFn<BudgetRuleRow>(
    'SELECT budget_rule_id, name, scope, scope_value, period, amount_usd,' +
      ' alert_thresholds, created_by_user_id, active, created_at, updated_at' +
      ' FROM llm_budget_rules' +
      ' WHERE active = TRUE' +
      ' ORDER BY created_at ASC',
  )
  const results: BudgetEvaluationResult[] = []
  for (const row of rows) {
    results.push(await evaluateBudgetRule(row, asOf, queryFn))
  }
  results.sort((a, b) => b.pct_used - a.pct_used)
  return results
}
