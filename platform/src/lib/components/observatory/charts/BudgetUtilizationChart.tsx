'use client'

// O.3 budgets — utilisation summary chart. Wired by S3.3.

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type {
  BudgetEvaluationResult,
  BudgetStatus,
} from '@/lib/observatory/budget/types'

const STATUS_COLOR: Record<BudgetStatus, string> = {
  ok: '#22c55e',
  warning: '#f59e0b',
  alert: '#ef4444',
  exceeded: '#991b1b',
}

interface ChartRow {
  label: string
  pct_used: number
  status: BudgetStatus
}

function rowFor(result: BudgetEvaluationResult): ChartRow {
  const scopePart =
    result.scope === 'total'
      ? 'global'
      : `${result.scope}:${result.scope_value ?? '—'}`
  return {
    label: `${scopePart} (${result.period})`,
    pct_used: Number.isFinite(result.pct_used) ? result.pct_used : 0,
    status: result.status,
  }
}

export interface BudgetUtilizationChartProps {
  results: BudgetEvaluationResult[]
}

export function BudgetUtilizationChart({ results }: BudgetUtilizationChartProps) {
  if (!results || results.length === 0) {
    return (
      <div
        data-testid="budget-utilization-empty"
        className="flex h-40 w-full items-center justify-center rounded border border-dashed text-sm text-muted-foreground"
      >
        No active budget rules
      </div>
    )
  }

  const rows = results.map(rowFor)
  const height = Math.max(180, rows.length * 36)
  const max = Math.max(100, ...rows.map((r) => r.pct_used))

  return (
    <div
      data-testid="budget-utilization-chart"
      data-row-count={rows.length}
      className="w-full rounded border p-3"
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ left: 24, right: 24 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, max]}
            tickFormatter={(v: number) => `${Math.round(v)}%`}
          />
          <YAxis type="category" dataKey="label" width={220} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) => [`${Math.round(value)}%`, 'Utilisation']}
          />
          <ReferenceLine x={100} stroke="#64748b" strokeDasharray="4 4" />
          <Bar dataKey="pct_used">
            {rows.map((row, idx) => (
              <Cell key={idx} fill={STATUS_COLOR[row.status]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
