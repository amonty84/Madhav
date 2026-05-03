'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { BreakdownsResponse } from '@/lib/observatory/types'

import { formatCostUSD, formatTokenCount } from './utils'

const TOP_N = 15
const BAR_COLOR = '#6366f1'
const OTHER_COLOR = '#94a3b8'

export interface CostByModelChartProps {
  data: BreakdownsResponse | null
  loading?: boolean
  error?: Error | null
  onRetry?: () => void
}

export interface CostByModelRow {
  label: string
  cost_usd: number
  request_count: number
  isOther: boolean
}

/** Sort by cost desc, take top N, roll the remainder up into "Other (k models)". */
export function rollUpModels(data: BreakdownsResponse): CostByModelRow[] {
  const sorted = [...data.rows].sort((a, b) => b.cost_usd - a.cost_usd)
  if (sorted.length <= TOP_N) {
    return sorted.map((r) => ({
      label: r.dim_value,
      cost_usd: r.cost_usd,
      request_count: r.request_count,
      isOther: false,
    }))
  }
  const top = sorted.slice(0, TOP_N).map((r) => ({
    label: r.dim_value,
    cost_usd: r.cost_usd,
    request_count: r.request_count,
    isOther: false,
  }))
  const rest = sorted.slice(TOP_N)
  const other: CostByModelRow = {
    label: `Other (${rest.length} models)`,
    cost_usd: rest.reduce((s, r) => s + r.cost_usd, 0),
    request_count: rest.reduce((s, r) => s + r.request_count, 0),
    isOther: true,
  }
  return [...top, other]
}

function ModelTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: CostByModelRow }>
}) {
  if (!active || !payload || payload.length === 0) return null
  const row = payload[0].payload
  return (
    <div
      data-testid="cost-by-model-tooltip"
      className="rounded border bg-background p-2 text-xs shadow"
    >
      <div className="mb-1 font-medium">{row.label}</div>
      <div className="flex justify-between gap-4">
        <span>Cost</span>
        <span className="tabular-nums">{formatCostUSD(row.cost_usd)}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span>Requests</span>
        <span className="tabular-nums">{formatTokenCount(row.request_count)}</span>
      </div>
    </div>
  )
}

export function CostByModelChart({
  data,
  loading = false,
  error = null,
  onRetry,
}: CostByModelChartProps) {
  if (loading) {
    return (
      <div
        data-testid="cost-by-model-loading"
        role="status"
        aria-live="polite"
        className="h-96 w-full animate-pulse rounded bg-muted"
      />
    )
  }

  if (error) {
    return (
      <div
        data-testid="cost-by-model-error"
        role="alert"
        className="flex h-96 w-full flex-col items-center justify-center gap-2 rounded border border-destructive/30 p-4 text-sm"
      >
        <p>Failed to load model breakdown.</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded border px-3 py-1 text-xs hover:bg-muted"
          >
            Retry
          </button>
        )}
      </div>
    )
  }

  if (!data || data.rows.length === 0) {
    return (
      <div
        data-testid="cost-by-model-empty"
        className="flex h-72 w-full items-center justify-center rounded border text-sm text-muted-foreground"
      >
        No data in this range
      </div>
    )
  }

  const rows = rollUpModels(data)
  const height = Math.max(280, rows.length * 28)

  return (
    <div
      data-testid="cost-by-model-chart"
      data-row-count={rows.length}
      className="w-full rounded border p-3"
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ left: 24, right: 24 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            tickFormatter={(v: number) => formatCostUSD(v)}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={180}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<ModelTooltip />} />
          <Bar dataKey="cost_usd" fill={BAR_COLOR} />
        </BarChart>
      </ResponsiveContainer>
      {/* Color-distinguish the "Other" row via legend hint */}
      <p className="mt-2 text-xs text-muted-foreground">
        <span
          aria-hidden="true"
          className="mr-1 inline-block h-2 w-2 rounded-sm align-middle"
          style={{ backgroundColor: OTHER_COLOR }}
        />
        Sort: cost desc · Top {TOP_N} models · remainder grouped into Other
      </p>
    </div>
  )
}
