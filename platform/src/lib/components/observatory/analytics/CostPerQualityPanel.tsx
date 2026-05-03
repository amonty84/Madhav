'use client'

// CostPerQualityPanel — per-pipeline-stage cost rollup with a stub for the
// quality dimension (see cost_per_quality.ts: probe spec not yet delivered,
// so quality_score is null for every stage).
//
// Token totals arrive as strings (the API serializes bigint → string), so
// the prop shape diverges slightly from the server-side StageMetrics — see
// PanelStage below.

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import {
  colorForStage,
  formatCostUSD,
} from '@/lib/components/observatory/charts/utils'

export interface PanelStage {
  pipeline_stage: string
  total_events: number
  total_cost_usd: number
  avg_cost_per_event_usd: number
  /** May be a string when crossed JSON; bigint pre-serialization. */
  total_input_tokens: string | number | bigint
  total_output_tokens: string | number | bigint
  avg_latency_ms: number
  quality_score: null
}

export interface CostPerQualityPanelProps {
  date_start: string
  date_end: string
  quality_probe_wired: boolean
  stages: PanelStage[]
  totals: { total_cost_usd: number; total_events: number }
}

const QUALITY_DASH = '—'

export function CostPerQualityPanel({
  date_start,
  date_end,
  quality_probe_wired,
  stages,
  totals,
}: CostPerQualityPanelProps) {
  return (
    <div data-testid="cost-per-quality-panel" className="space-y-4">
      {!quality_probe_wired && (
        <div
          data-testid="quality-probe-banner"
          role="status"
          className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900"
        >
          <strong>Quality probe not yet wired</strong> — cost data is live; the
          quality score column will populate when the audit-stage quality probe
          spec is delivered.
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        Window: {date_start} → {date_end} · {totals.total_events.toLocaleString()}{' '}
        events · {formatCostUSD(totals.total_cost_usd)} total
      </div>

      {stages.length === 0 ? (
        <div
          data-testid="cost-per-quality-empty"
          className="flex h-72 w-full items-center justify-center rounded border text-sm text-muted-foreground"
        >
          No data in this range
        </div>
      ) : (
        <>
          <div
            data-testid="cost-per-quality-chart"
            className="h-72 w-full rounded border p-3"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stages}
                margin={{ left: 12, right: 12, top: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pipeline_stage" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v: number) => formatCostUSD(v)} />
                <Tooltip
                  formatter={(v: number) => formatCostUSD(v)}
                  labelFormatter={(label: string) => `Stage: ${label}`}
                />
                <Bar dataKey="total_cost_usd">
                  {stages.map((s) => (
                    <Cell
                      key={s.pipeline_stage}
                      fill={colorForStage(s.pipeline_stage)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto rounded border">
            <table
              data-testid="cost-per-quality-table"
              className="w-full text-sm"
            >
              <thead className="bg-muted text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left">Stage</th>
                  <th className="px-3 py-2 text-right">Total cost</th>
                  <th className="px-3 py-2 text-right">Events</th>
                  <th className="px-3 py-2 text-right">Avg cost / event</th>
                  <th className="px-3 py-2 text-right">Avg latency (ms)</th>
                  <th className="px-3 py-2 text-right">Quality score</th>
                </tr>
              </thead>
              <tbody>
                {stages.map((s) => (
                  <tr
                    key={s.pipeline_stage}
                    data-testid={`cpq-row-${s.pipeline_stage}`}
                    className="border-t"
                  >
                    <td className="px-3 py-2">
                      <span
                        aria-hidden="true"
                        className="mr-2 inline-block h-2 w-2 rounded-sm align-middle"
                        style={{
                          backgroundColor: colorForStage(s.pipeline_stage),
                        }}
                      />
                      {s.pipeline_stage}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatCostUSD(s.total_cost_usd)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {s.total_events.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatCostUSD(s.avg_cost_per_event_usd)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {Math.round(s.avg_latency_ms).toLocaleString()}
                    </td>
                    <td
                      className="px-3 py-2 text-right text-muted-foreground"
                      data-testid={`cpq-quality-${s.pipeline_stage}`}
                    >
                      {QUALITY_DASH}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  )
}
