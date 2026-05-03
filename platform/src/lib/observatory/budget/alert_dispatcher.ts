// Phase O — O.3 Budgets — alert dispatcher.
//
// Authored by USTAD_S3_2_ALERT_DISPATCHER. Consumes a BudgetEvaluationResult
// (produced by `evaluateBudgetRule` in S3.1) and dispatches an alert per
// crossed threshold across three channels:
//
//   - 'log'     — console.warn line (always succeeds)
//   - 'webhook' — POST to threshold.channel_target with a 5s AbortController
//                 timeout; non-2xx and network errors are captured as
//                 outcome.success=false (never thrown)
//   - 'email'   — MVP stub; logs and returns success=true with a fixed
//                 error='email_not_configured_stub'. Real email delivery is
//                 O.4 scope or post-Phase-O.
//
//   - any other channel — captured as success=false with
//                         error='unknown_channel:<channel>'
//
// Discipline:
//   - Never throws. All failures are flattened into `DispatchOutcome.error`.
//   - Only thresholds in `result.alerts_triggered` are dispatched. The
//     evaluator already computed which thresholds the run crossed; the
//     dispatcher does not re-classify.

import 'server-only'
import type { AlertThreshold, BudgetEvaluationResult } from './types'

const WEBHOOK_TIMEOUT_MS = 5_000

export interface DispatchOutcome {
  threshold: AlertThreshold
  channel: string
  success: boolean
  error?: string
}

export interface DispatchResult {
  rule_id: string
  outcomes: DispatchOutcome[]
}

interface WebhookPayload {
  rule_id: string
  scope: string
  scope_value: string | null
  period: string
  status: string
  pct_used: number
  threshold_usd: number
  current_spend_usd: number
  triggered_at: string
}

function buildWebhookPayload(
  result: BudgetEvaluationResult,
  triggeredAt: string,
): WebhookPayload {
  return {
    rule_id: result.rule_id,
    scope: result.scope,
    scope_value: result.scope_value,
    period: result.period,
    status: result.status,
    pct_used: result.pct_used,
    threshold_usd: result.amount_usd,
    current_spend_usd: result.current_spend_usd,
    triggered_at: triggeredAt,
  }
}

async function dispatchWebhook(
  threshold: AlertThreshold,
  result: BudgetEvaluationResult,
  triggeredAt: string,
): Promise<DispatchOutcome> {
  const target = threshold.channel_target
  if (!target) {
    return {
      threshold,
      channel: threshold.channel,
      success: false,
      error: 'webhook_missing_channel_target',
    }
  }
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS)
  try {
    const response = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildWebhookPayload(result, triggeredAt)),
      signal: controller.signal,
    })
    if (!response.ok) {
      return {
        threshold,
        channel: 'webhook',
        success: false,
        error: `webhook_http_${response.status}`,
      }
    }
    return { threshold, channel: 'webhook', success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      threshold,
      channel: 'webhook',
      success: false,
      error: `webhook_error:${message}`,
    }
  } finally {
    clearTimeout(timeout)
  }
}

function dispatchLog(
  threshold: AlertThreshold,
  result: BudgetEvaluationResult,
): DispatchOutcome {
  console.warn(
    `[OBSERVATORY BUDGET ALERT] rule=${result.rule_id} ` +
      `scope=${result.scope}:${result.scope_value} ` +
      `pct_used=${result.pct_used.toFixed(1)}% ` +
      `threshold=${threshold.pct}% status=${result.status}`,
  )
  return { threshold, channel: 'log', success: true }
}

function dispatchEmailStub(
  threshold: AlertThreshold,
  result: BudgetEvaluationResult,
): DispatchOutcome {
  // Real email delivery is O.4 scope or post-Phase-O. The stub keeps the
  // contract surface (success=true, with a sentinel `error` string the UI
  // and tests can recognise) so downstream code is forward-compatible.
  console.info(
    `[OBSERVATORY BUDGET ALERT email stub] rule=${result.rule_id}`,
  )
  return {
    threshold,
    channel: 'email',
    success: true,
    error: 'email_not_configured_stub',
  }
}

/** Dispatch alerts for every threshold the rule has crossed. Never throws. */
export async function dispatchAlerts(
  result: BudgetEvaluationResult,
): Promise<DispatchResult> {
  const triggeredAt = new Date().toISOString()
  const outcomes: DispatchOutcome[] = []
  for (const threshold of result.alerts_triggered) {
    const channel = threshold.channel
    if (channel === 'log') {
      outcomes.push(dispatchLog(threshold, result))
      continue
    }
    if (channel === 'webhook') {
      outcomes.push(await dispatchWebhook(threshold, result, triggeredAt))
      continue
    }
    if (channel === 'email') {
      outcomes.push(dispatchEmailStub(threshold, result))
      continue
    }
    outcomes.push({
      threshold,
      channel,
      success: false,
      error: `unknown_channel:${channel}`,
    })
  }
  return { rule_id: result.rule_id, outcomes }
}
