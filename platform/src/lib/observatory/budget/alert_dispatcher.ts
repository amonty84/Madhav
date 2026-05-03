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

/**
 * RT.O3.3 SSRF guard (USTAD_S4_6 D3 fix).
 *
 * Validates a webhook target URL synchronously without DNS resolution.
 * Throws if the URL is not HTTPS or if the hostname is a literal IP that
 * sits inside a private/loopback/link-local range, or if it equals the
 * AWS/GCP metadata endpoint `169.254.169.254`. Static parsing is enough
 * here because:
 *   (a) the threat model is super-admin-side mis-configuration; and
 *   (b) we don't want a network hop on every dispatch just to resolve a
 *       hostname.
 *
 * A future hardening pass MAY add an async `dnsLookup()` step (and re-bind
 * the resolved IP into `fetch()` to defeat DNS-rebinding). MED-severity
 * fix per the O.3 close red-team — see RT.O3.3 in OBSERVATORY_PLAN §12.
 */
export function validateWebhookUrl(url: string): void {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error('ssrf_blocked: invalid_url')
  }
  if (parsed.protocol !== 'https:') {
    throw new Error('ssrf_blocked: https_required')
  }
  const host = parsed.hostname.toLowerCase()
  // IPv6 literals come bracketed in URL.hostname (`[::1]` → `::1`); strip.
  const stripped = host.startsWith('[') && host.endsWith(']')
    ? host.slice(1, -1)
    : host
  // Cloud-metadata endpoint + common loopback names.
  const BLOCKED_EXACT = new Set([
    'localhost',
    '169.254.169.254',
    'metadata.google.internal',
    '::1',
    '0.0.0.0',
  ])
  if (BLOCKED_EXACT.has(stripped)) {
    throw new Error('ssrf_blocked: private_endpoint')
  }
  // IPv4 private + loopback prefixes.
  const PRIVATE_PREFIXES = ['127.', '10.', '192.168.', '0.', '169.254.']
  if (PRIVATE_PREFIXES.some((p) => stripped.startsWith(p))) {
    throw new Error('ssrf_blocked: private_ip')
  }
  // 172.16.0.0/12 — 172.16.x through 172.31.x.
  const m = stripped.match(/^172\.(\d+)\./)
  if (m) {
    const second = parseInt(m[1], 10)
    if (second >= 16 && second <= 31) {
      throw new Error('ssrf_blocked: private_ip')
    }
  }
  // IPv6 unique-local fc00::/7 (covers fc and fd prefixes).
  if (/^f[cd][0-9a-f]{2}:/.test(stripped)) {
    throw new Error('ssrf_blocked: private_ip')
  }
  // IPv6 link-local fe80::/10.
  if (/^fe[89ab][0-9a-f]:/.test(stripped)) {
    throw new Error('ssrf_blocked: private_ip')
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
  try {
    validateWebhookUrl(target)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'ssrf_blocked'
    return {
      threshold,
      channel: 'webhook',
      success: false,
      error: message,
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
