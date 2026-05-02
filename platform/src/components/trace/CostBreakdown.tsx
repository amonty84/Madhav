'use client'

/**
 * CostBreakdown — TRACE-8 (W2-TRACE-B).
 *
 * Table of LLM cost entries (one row per call_stage). Footer total. If
 * provider pricing config is missing (every entry has `cost_usd: null`),
 * the footer cell is replaced with an explanatory note.
 *
 * Optional Budget vs Actual section: when the parent passes
 * `budgetComparisons`, render a per-tool comparison row. Cells where
 * actual exceeds budget by > 20% turn amber.
 *
 * UI-only: hydrated by parent on each `step_done` (incremental) and
 * finalised on `query_done`.
 */

export interface CostEntry {
  label: string
  model_id: string
  input_tokens: number
  output_tokens: number
  reasoning_tokens: number | null
  cost_usd: number | null
}

export interface BudgetComparison {
  tool_name: string
  budgeted_tokens: number
  actual_tokens: number
}

interface CostBreakdownProps {
  entries: CostEntry[]
  total_cost_usd: number | null
  isLoading: boolean
  budgetComparisons?: BudgetComparison[]
}

function fmtTokens(n: number | null): string {
  if (n == null) return '—'
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

function fmtCost(usd: number | null): string {
  if (usd == null) return '—'
  if (usd < 0.01) return `$${usd.toFixed(4)}`
  return `$${usd.toFixed(2)}`
}

function RowSkeleton() {
  return (
    <div className="h-7 rounded border border-[rgba(212,175,55,0.10)] bg-[rgba(212,175,55,0.04)] animate-pulse" />
  )
}

export function CostBreakdown({
  entries,
  total_cost_usd,
  isLoading,
  budgetComparisons,
}: CostBreakdownProps) {
  if (isLoading) {
    return (
      <div className="px-4 py-3 space-y-2">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[rgba(212,175,55,0.6)]">
          Cost Breakdown
        </div>
        <RowSkeleton />
        <RowSkeleton />
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="px-4 py-3 text-[10px] italic text-[rgba(212,175,55,0.4)]">
        No LLM cost entries recorded.
      </div>
    )
  }

  const allCostsMissing = entries.every((e) => e.cost_usd == null)

  return (
    <div className="px-4 py-3 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[rgba(212,175,55,0.6)]">
          Cost Breakdown
        </span>
        <span className="ml-auto text-[10px] text-[rgba(212,175,55,0.5)]">
          {entries.length} call{entries.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Cost table */}
      <div className="rounded border border-[rgba(212,175,55,0.15)] bg-[rgba(13,10,5,0.5)] overflow-hidden">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-[rgba(212,175,55,0.12)] text-[rgba(212,175,55,0.55)] uppercase tracking-[0.1em] text-[9px]">
              <th className="text-left px-3 py-1.5 font-semibold">Stage</th>
              <th className="text-left px-2 py-1.5 font-semibold">Model</th>
              <th className="text-right px-2 py-1.5 font-semibold">In</th>
              <th className="text-right px-2 py-1.5 font-semibold">Out</th>
              <th className="text-right px-2 py-1.5 font-semibold">Reason</th>
              <th className="text-right px-3 py-1.5 font-semibold">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(212,175,55,0.08)]">
            {entries.map((e, i) => (
              <tr
                key={`${e.label}-${i}`}
                className="text-[rgba(252,226,154,0.85)]"
              >
                <td className="px-3 py-1.5 font-semibold">{e.label}</td>
                <td className="px-2 py-1.5 font-mono text-[rgba(212,175,55,0.7)]">
                  {e.model_id}
                </td>
                <td className="px-2 py-1.5 text-right tabular-nums">
                  {fmtTokens(e.input_tokens)}
                </td>
                <td className="px-2 py-1.5 text-right tabular-nums">
                  {fmtTokens(e.output_tokens)}
                </td>
                <td className="px-2 py-1.5 text-right tabular-nums text-[rgba(240,170,100,0.85)]">
                  {fmtTokens(e.reasoning_tokens)}
                </td>
                <td className="px-3 py-1.5 text-right tabular-nums text-[rgba(244,209,96,0.85)] font-semibold">
                  {fmtCost(e.cost_usd)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.04)]">
            <tr>
              {allCostsMissing ? (
                <td
                  colSpan={6}
                  className="px-3 py-2 text-[10px] italic text-[rgba(212,175,55,0.55)]"
                >
                  Cost tracking requires provider pricing config.
                </td>
              ) : (
                <>
                  <td
                    colSpan={5}
                    className="px-3 py-2 text-right text-[rgba(212,175,55,0.6)] uppercase tracking-[0.1em] text-[9px] font-semibold"
                  >
                    Total
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-[rgba(252,226,154,0.95)] font-bold">
                    {fmtCost(total_cost_usd)}
                  </td>
                </>
              )}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Budget vs Actual */}
      {budgetComparisons && budgetComparisons.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-[rgba(212,175,55,0.5)]">
            Budget vs Actual
          </div>
          <div className="rounded border border-[rgba(212,175,55,0.15)] bg-[rgba(13,10,5,0.5)] overflow-hidden">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b border-[rgba(212,175,55,0.12)] text-[rgba(212,175,55,0.55)] uppercase tracking-[0.1em] text-[9px]">
                  <th className="text-left px-3 py-1.5 font-semibold">Tool</th>
                  <th className="text-right px-2 py-1.5 font-semibold">
                    Budget
                  </th>
                  <th className="text-right px-2 py-1.5 font-semibold">
                    Actual
                  </th>
                  <th className="text-right px-3 py-1.5 font-semibold">Δ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(212,175,55,0.08)]">
                {budgetComparisons.map((c, i) => {
                  const overage =
                    c.budgeted_tokens > 0
                      ? (c.actual_tokens - c.budgeted_tokens) /
                        c.budgeted_tokens
                      : 0
                  const isOverBudget = overage > 0.2
                  const deltaPct = c.budgeted_tokens > 0
                    ? `${overage >= 0 ? '+' : ''}${(overage * 100).toFixed(0)}%`
                    : '—'
                  return (
                    <tr
                      key={`${c.tool_name}-${i}`}
                      className={
                        isOverBudget
                          ? 'text-[rgba(240,170,100,0.95)]'
                          : 'text-[rgba(252,226,154,0.85)]'
                      }
                    >
                      <td className="px-3 py-1.5 font-mono">{c.tool_name}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums">
                        {fmtTokens(c.budgeted_tokens)}
                      </td>
                      <td className="px-2 py-1.5 text-right tabular-nums">
                        {fmtTokens(c.actual_tokens)}
                      </td>
                      <td
                        className={`px-3 py-1.5 text-right tabular-nums font-semibold ${
                          isOverBudget
                            ? 'text-[rgba(240,170,100,0.95)]'
                            : 'text-[rgba(212,175,55,0.6)]'
                        }`}
                      >
                        {deltaPct}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
