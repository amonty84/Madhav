'use client'

// Phase O.4 — CacheEffectivenessPanel (USTAD_S4_1).
// Renders summary + per-provider breakdown of cache hit ratios and dollar
// savings. Consumes the JSON shape from /api/admin/observatory/analytics/cache.

import * as React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type {
  CacheEffectivenessResultJson,
  CacheMetricsJson,
} from '@/lib/observatory/analytics/cache_effectiveness'
import { formatUsd, formatTokens } from '../kpi/format'
import { colorForProvider } from '../charts/utils'

export interface CacheEffectivenessPanelProps {
  data: CacheEffectivenessResultJson | null
  loading?: boolean
  error?: Error | null
  onRetry?: () => void
}

function ratioPct(r: number): string {
  if (!Number.isFinite(r)) return '0.0%'
  return `${(r * 100).toFixed(1)}%`
}

function tokensFromString(s: string): number {
  // Wire-format bigints arrive as decimal strings; cast for display via
  // formatTokens (which expects number). Realistic per-provider sums fit safely
  // in Number range (≤ ~10^15).
  const n = Number(s)
  return Number.isFinite(n) ? n : 0
}

interface ChartDatum {
  provider: string
  cost_saved_usd: number
  fill: string
}

function buildChartData(rows: CacheMetricsJson[]): ChartDatum[] {
  return rows
    .map((r) => ({
      provider: r.provider,
      cost_saved_usd: r.cost_saved_usd,
      fill: colorForProvider(r.provider),
    }))
    .sort((a, b) => b.cost_saved_usd - a.cost_saved_usd)
}

function CacheBarTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: ChartDatum }>
}) {
  if (!active || !payload || payload.length === 0) return null
  const row = payload[0].payload
  return (
    <div
      data-testid="cache-effectiveness-tooltip"
      className="rounded border bg-background p-2 text-xs shadow"
    >
      <div className="mb-1 font-medium">{row.provider}</div>
      <div className="flex justify-between gap-4">
        <span>Cost saved</span>
        <span className="tabular-nums">{formatUsd(row.cost_saved_usd)}</span>
      </div>
    </div>
  )
}

export function CacheEffectivenessPanel({
  data,
  loading = false,
  error = null,
  onRetry,
}: CacheEffectivenessPanelProps): React.ReactElement {
  if (loading) {
    return (
      <div
        data-testid="cache-effectiveness-loading"
        role="status"
        aria-live="polite"
        className="h-72 w-full animate-pulse rounded bg-muted"
      />
    )
  }

  if (error) {
    return (
      <div
        data-testid="cache-effectiveness-error"
        role="alert"
        className="flex h-72 w-full flex-col items-center justify-center gap-2 rounded border border-destructive/30 p-4 text-sm"
      >
        <p>Failed to load cache effectiveness.</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded border px-3 py-1 text-xs hover:bg-muted"
          >
            Retry
          </button>
        ) : null}
      </div>
    )
  }

  const providers = data?.providers ?? []
  const totals = data?.totals
  const chartData = buildChartData(providers)

  return (
    <div data-testid="cache-effectiveness-panel" className="flex flex-col gap-4">
      <section
        data-testid="cache-effectiveness-summary"
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        <div className="rounded border p-3">
          <div className="text-xs uppercase text-muted-foreground">Total cost saved</div>
          <div
            data-testid="cache-effectiveness-summary-cost-saved"
            className="text-xl font-semibold tabular-nums"
          >
            {totals ? formatUsd(totals.cost_saved_usd) : '—'}
          </div>
        </div>
        <div className="rounded border p-3">
          <div className="text-xs uppercase text-muted-foreground">Overall cache hit ratio</div>
          <div
            data-testid="cache-effectiveness-summary-hit-ratio"
            className="text-xl font-semibold tabular-nums"
          >
            {totals ? ratioPct(totals.cache_hit_ratio) : '—'}
          </div>
        </div>
        <div className="rounded border p-3">
          <div className="text-xs uppercase text-muted-foreground">Cost saved (% of pre-cache)</div>
          <div
            data-testid="cache-effectiveness-summary-saved-pct"
            className="text-xl font-semibold tabular-nums"
          >
            {totals ? ratioPct(totals.cost_saved_pct) : '—'}
          </div>
        </div>
      </section>

      {providers.length === 0 ? (
        <div
          data-testid="cache-effectiveness-empty"
          className="flex h-32 w-full items-center justify-center rounded border text-sm text-muted-foreground"
        >
          No usage events in this range
        </div>
      ) : (
        <>
          <section data-testid="cache-effectiveness-chart" className="h-72 w-full rounded border p-3">
            <h3 className="mb-2 text-sm font-medium uppercase text-muted-foreground">
              Cost saved by provider
            </h3>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickFormatter={(v: number) => formatUsd(v)}
                />
                <YAxis dataKey="provider" type="category" width={84} />
                <Tooltip content={<CacheBarTooltip />} />
                <Bar dataKey="cost_saved_usd" name="Cost saved (USD)" />
              </BarChart>
            </ResponsiveContainer>
          </section>

          <section data-testid="cache-effectiveness-table">
            <table className="w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-2 py-1 font-medium">Provider</th>
                  <th className="px-2 py-1 font-medium">Cache hit ratio</th>
                  <th className="px-2 py-1 font-medium">Cache reads</th>
                  <th className="px-2 py-1 font-medium">Cost saved</th>
                  <th className="px-2 py-1 font-medium">Cost saved %</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((p) => (
                  <tr
                    key={p.provider}
                    data-testid={`cache-effectiveness-row-${p.provider}`}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-2 py-1">
                      <span
                        aria-hidden="true"
                        className="mr-2 inline-block h-2 w-2 rounded-sm align-middle"
                        style={{ backgroundColor: colorForProvider(p.provider) }}
                      />
                      {p.provider}
                    </td>
                    <td className="px-2 py-1 tabular-nums">{ratioPct(p.cache_hit_ratio)}</td>
                    <td className="px-2 py-1 tabular-nums">
                      {formatTokens(tokensFromString(p.cache_read_tokens))}
                    </td>
                    <td className="px-2 py-1 tabular-nums">{formatUsd(p.cost_saved_usd)}</td>
                    <td className="px-2 py-1 tabular-nums">{ratioPct(p.cost_saved_pct)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  )
}
