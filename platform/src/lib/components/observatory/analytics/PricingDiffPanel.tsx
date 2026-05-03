'use client'

// USTAD_S4_4 — Pricing diff monitor panel.
//
// Server pages pass `initialResult` (from a same-process call to
// checkPricingHealth) so the first render is hydration-safe and doesn't
// flash a loading state. The "Run check now" button POSTs the /run endpoint
// and replaces the local result.

import { useState, useTransition } from 'react'
import type {
  PricingDiffResult,
  PricingHealthStatus,
  ProviderPricingHealth,
} from '@/lib/observatory/analytics/pricing_diff'

interface Props {
  initialResult: PricingDiffResult
}

const STATUS_LABEL: Record<PricingHealthStatus, string> = {
  ok: 'OK',
  stale_pricing: 'Stale pricing',
  systematic_variance: 'Systematic variance',
  both: 'Stale + variance',
}

const STATUS_CHIP_CLASS: Record<PricingHealthStatus, string> = {
  ok: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  stale_pricing: 'bg-amber-100 text-amber-900 border-amber-300',
  systematic_variance: 'bg-red-100 text-red-900 border-red-300',
  both: 'bg-red-200 text-red-900 border-red-400',
}

function fmtAge(p: ProviderPricingHealth): string {
  if (p.last_pricing_update === null) return '— never seen'
  if (!Number.isFinite(p.pricing_age_days)) return '— invalid'
  return `${p.pricing_age_days}d`
}

function fmtVariance(p: ProviderPricingHealth): string {
  if (p.avg_7d_variance_pct === null) return '— no data'
  return `${p.avg_7d_variance_pct.toFixed(2)}%`
}

function fmtLastUpdate(iso: string | null): string {
  if (!iso) return '—'
  // The freshness column comes back as 'YYYY-MM-DD' or an ISO timestamp.
  // Render the date prefix in either case.
  return iso.slice(0, 10)
}

export function PricingDiffPanel({ initialResult }: Props) {
  const [result, setResult] = useState<PricingDiffResult>(initialResult)
  const [pending, startTransition] = useTransition()
  const [errorLine, setErrorLine] = useState<string | null>(null)

  function runNow() {
    setErrorLine(null)
    startTransition(async () => {
      try {
        const response = await fetch(
          '/api/admin/observatory/analytics/pricing-diff/run',
          {
            method: 'POST',
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
          },
        )
        if (!response.ok) {
          throw new Error(`Run failed (${response.status})`)
        }
        const next = (await response.json()) as PricingDiffResult
        setResult(next)
      } catch (err) {
        setErrorLine(err instanceof Error ? err.message : 'Run failed')
      }
    })
  }

  const banner = result.all_healthy ? (
    <div
      data-testid="pricing-diff-banner-ok"
      role="status"
      className="rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
    >
      All pricing healthy ({result.providers.length} provider
      {result.providers.length === 1 ? '' : 's'} checked)
    </div>
  ) : (
    <div
      data-testid="pricing-diff-banner-warn"
      role="alert"
      className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900"
    >
      {result.stale_count} stale ·{' '}
      {result.variance_alert_count} systematic-variance alert
      {result.variance_alert_count === 1 ? '' : 's'}
    </div>
  )

  return (
    <div
      data-testid="pricing-diff-panel"
      className="space-y-4"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-foreground">
          Pricing health (per provider)
        </h2>
        <button
          type="button"
          data-testid="pricing-diff-run-now"
          onClick={runNow}
          disabled={pending}
          className="rounded border px-3 py-1 text-xs hover:bg-muted disabled:opacity-50"
        >
          {pending ? 'Checking…' : 'Run check now'}
        </button>
      </div>

      {banner}

      {errorLine ? (
        <div
          role="alert"
          data-testid="pricing-diff-error"
          className="text-xs text-destructive"
        >
          {errorLine}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table
          data-testid="pricing-diff-table"
          className="w-full border-collapse text-sm"
        >
          <thead>
            <tr className="border-b">
              <th className="px-2 py-1 text-left font-medium">Provider</th>
              <th className="px-2 py-1 text-left font-medium">Last update</th>
              <th className="px-2 py-1 text-right font-medium">Age</th>
              <th className="px-2 py-1 text-right font-medium">7d variance</th>
              <th className="px-2 py-1 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {result.providers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-2 py-4 text-center text-muted-foreground"
                >
                  No providers found in pricing or reconciliation tables.
                </td>
              </tr>
            ) : (
              result.providers.map((p) => (
                <tr
                  key={p.provider}
                  data-testid={`pricing-diff-row-${p.provider}`}
                  className="border-b last:border-b-0"
                >
                  <td className="px-2 py-1">{p.provider}</td>
                  <td className="px-2 py-1">{fmtLastUpdate(p.last_pricing_update)}</td>
                  <td className="px-2 py-1 text-right">{fmtAge(p)}</td>
                  <td className="px-2 py-1 text-right">{fmtVariance(p)}</td>
                  <td className="px-2 py-1">
                    <span
                      data-testid={`pricing-diff-chip-${p.provider}`}
                      className={`inline-block rounded border px-2 py-0.5 text-xs ${STATUS_CHIP_CLASS[p.status]}`}
                    >
                      {STATUS_LABEL[p.status]}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-muted-foreground">
        Checked at {result.checked_at}
      </div>
    </div>
  )
}
