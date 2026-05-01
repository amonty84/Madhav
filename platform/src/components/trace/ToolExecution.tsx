'use client'

/**
 * ToolExecution — TRACE-3 (W2-TRACE-A).
 *
 * 3-column grid of tool execution status cards. Status drives the left
 * border colour:
 *   ok        → green
 *   zero_rows → amber
 *   error     → red
 *   cache_hit → blue
 *   pending   → grey, pulsing
 *
 * Hydration: parent maps `step_start` → pending card, `step_done` → status
 * update, using the tool_name as the card key. UI-only; receives state.
 */

export interface ToolExecutionRecord {
  tool_name: string
  status: 'ok' | 'zero_rows' | 'error' | 'cache_hit' | 'pending'
  rows_returned: number | null
  latency_ms: number | null
  fallback_used: boolean
  error_code: string | null
}

interface ToolExecutionProps {
  executions: ToolExecutionRecord[]
  isLoading: boolean
}

const STATUS_BORDER: Record<ToolExecutionRecord['status'], string> = {
  ok: 'border-l-[rgba(120,210,160,0.85)]',
  zero_rows: 'border-l-[rgba(244,209,96,0.85)]',
  error: 'border-l-[rgba(240,150,120,0.95)]',
  cache_hit: 'border-l-[rgba(140,190,240,0.85)]',
  pending: 'border-l-[rgba(212,175,55,0.35)]',
}

const STATUS_LABEL: Record<ToolExecutionRecord['status'], string> = {
  ok: 'OK',
  zero_rows: '0 rows',
  error: 'ERROR',
  cache_hit: 'CACHED',
  pending: '…',
}

function fmtMs(ms: number | null): string {
  if (ms == null) return '—'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

function CellSkeleton() {
  return (
    <div className="h-[60px] rounded border border-[rgba(212,175,55,0.10)] bg-[rgba(212,175,55,0.04)] animate-pulse" />
  )
}

export function ToolExecution({ executions, isLoading }: ToolExecutionProps) {
  if (isLoading) {
    return (
      <div className="px-4 py-3 space-y-2">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[rgba(212,175,55,0.6)]">
          Tool Execution
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <CellSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (executions.length === 0) {
    return (
      <div className="px-4 py-3 text-[10px] italic text-[rgba(212,175,55,0.4)]">
        No tool executions recorded.
      </div>
    )
  }

  return (
    <div className="px-4 py-3 space-y-2">
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[rgba(212,175,55,0.6)]">
        Tool Execution
      </div>
      <div className="grid grid-cols-3 gap-2">
        {executions.map((exec, idx) => {
          const isPending = exec.status === 'pending'
          return (
            <div
              key={`${exec.tool_name}-${idx}`}
              className={`rounded border border-[rgba(212,175,55,0.15)] bg-[rgba(13,10,5,0.5)] border-l-2 px-2.5 py-2 ${
                STATUS_BORDER[exec.status]
              } ${isPending ? 'animate-pulse' : ''}`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-[rgba(252,226,154,0.95)] truncate">
                  {exec.tool_name}
                </span>
                <span className="ml-auto text-[9px] font-bold text-[rgba(212,175,55,0.6)] flex-shrink-0">
                  {STATUS_LABEL[exec.status]}
                </span>
              </div>

              <div className="mt-1 flex items-center gap-2 text-[10px] text-[rgba(212,175,55,0.55)]">
                <span>
                  {exec.rows_returned == null ? '—' : `${exec.rows_returned} rows`}
                </span>
                <span className="ml-auto">{fmtMs(exec.latency_ms)}</span>
              </div>

              {(exec.fallback_used || exec.error_code) && (
                <div className="mt-1 flex items-center gap-1">
                  {exec.fallback_used && (
                    <span className="text-[9px] font-bold px-1 py-px rounded border bg-[rgba(220,140,60,0.12)] text-[rgba(240,170,100,0.95)] border-[rgba(230,150,80,0.4)]">
                      FALLBACK
                    </span>
                  )}
                  {exec.error_code && (
                    <span className="text-[9px] font-bold px-1 py-px rounded border bg-[rgba(220,90,60,0.12)] text-[rgba(240,150,120,0.95)] border-[rgba(230,110,80,0.4)]">
                      {exec.error_code}
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
