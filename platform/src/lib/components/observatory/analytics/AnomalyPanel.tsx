'use client'

// USTAD_S4_6 — Anomaly detection panel.
//
// The page server-component pre-fetches via detectAnomalies() so the first
// render is hydration-stable; "Run anomaly check" POSTs the /run endpoint
// and replaces the local result.

import { useState, useTransition } from 'react'
import type {
  AnomalyDimension,
  AnomalyResult,
} from '@/lib/observatory/analytics/anomaly'

interface Props {
  initialResult: AnomalyResult
}

const DIMENSION_LABEL: Record<AnomalyDimension, string> = {
  provider: 'Provider',
  pipeline_stage: 'Pipeline stage',
  user_id: 'User',
}

function fmtUsd(value: number): string {
  return `$${value.toFixed(4)}`
}

function fmtZ(value: number): string {
  return value.toFixed(2)
}

export function AnomalyPanel({ initialResult }: Props) {
  const [result, setResult] = useState<AnomalyResult>(initialResult)
  const [pending, startTransition] = useTransition()
  const [errorLine, setErrorLine] = useState<string | null>(null)

  function runNow() {
    setErrorLine(null)
    startTransition(async () => {
      try {
        const response = await fetch(
          '/api/admin/observatory/analytics/anomaly/run',
          {
            method: 'POST',
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
          },
        )
        if (!response.ok) {
          throw new Error(`Run failed (${response.status})`)
        }
        const next = (await response.json()) as AnomalyResult
        setResult(next)
      } catch (err) {
        setErrorLine(err instanceof Error ? err.message : 'Run failed')
      }
    })
  }

  const banner = result.anomalies.length === 0 ? (
    <div
      data-testid="anomaly-banner-ok"
      role="status"
      className="rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
    >
      No anomalies detected ({result.total_series_checked} series checked,
      z-threshold {result.config.z_threshold})
    </div>
  ) : (
    <div
      data-testid="anomaly-banner-warn"
      role="alert"
      className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900"
    >
      {result.anomalies.length} anomal
      {result.anomalies.length === 1 ? 'y' : 'ies'} detected in the last check
    </div>
  )

  return (
    <div data-testid="anomaly-panel" className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-foreground">
          Cost anomalies (yesterday vs. {result.config.lookback_days}-day window)
        </h2>
        <button
          type="button"
          data-testid="anomaly-run-now"
          onClick={runNow}
          disabled={pending}
          className="rounded border px-3 py-1 text-xs hover:bg-muted disabled:opacity-50"
        >
          {pending ? 'Checking…' : 'Run anomaly check'}
        </button>
      </div>

      {banner}

      {errorLine ? (
        <div
          role="alert"
          data-testid="anomaly-error"
          className="text-xs text-destructive"
        >
          {errorLine}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table
          data-testid="anomaly-table"
          className="w-full border-collapse text-sm"
        >
          <thead>
            <tr className="border-b">
              <th className="px-2 py-1 text-left font-medium">Dimension</th>
              <th className="px-2 py-1 text-left font-medium">Value</th>
              <th className="px-2 py-1 text-left font-medium">Date</th>
              <th className="px-2 py-1 text-right font-medium">Observed</th>
              <th className="px-2 py-1 text-right font-medium">Mean</th>
              <th className="px-2 py-1 text-right font-medium">z-score</th>
            </tr>
          </thead>
          <tbody>
            {result.anomalies.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-2 py-4 text-center text-muted-foreground"
                >
                  No anomalies for the current detection window.
                </td>
              </tr>
            ) : (
              result.anomalies.map((a, idx) => (
                <tr
                  key={`${a.dimension}-${a.dimension_value}-${idx}`}
                  data-testid={`anomaly-row-${a.dimension}-${a.dimension_value}`}
                  className="border-b last:border-b-0"
                >
                  <td className="px-2 py-1">{DIMENSION_LABEL[a.dimension]}</td>
                  <td className="px-2 py-1 font-mono text-xs">{a.dimension_value}</td>
                  <td className="px-2 py-1">{a.date}</td>
                  <td className="px-2 py-1 text-right">{fmtUsd(a.observed_cost_usd)}</td>
                  <td className="px-2 py-1 text-right">{fmtUsd(a.mean_cost_usd)}</td>
                  <td className="px-2 py-1 text-right font-mono">{fmtZ(a.z_score)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-muted-foreground">
        Checked at {result.checked_at} · series checked: {result.total_series_checked}
      </div>
    </div>
  )
}
