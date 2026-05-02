'use client'

/**
 * LLMCallMap — TRACE-1 (W2-TRACE-A).
 *
 * Per-LLM-call card grid: one card per stage (planner, synthesis, …) showing
 * model + provider, token counts, latency bar (proportional to longest call
 * in the set), cost, and badges for fallback / error / reasoning.
 *
 * State machine (driven by parent):
 *   isLoading=true                  → 2 skeleton cards
 *   isLoading=false, calls.length=0 → empty placeholder
 *   isLoading=false, calls.length>0 → real cards (partial during streaming,
 *                                     complete once synthesis_done arrives)
 *
 * "View thinking" button is visual-only this session; W2-TRACE-B wires it
 * once reasoning-trace storage exists.
 */

export interface LLMCallRecord {
  call_stage: string
  model_id: string
  provider: string
  input_tokens: number | null
  output_tokens: number | null
  reasoning_tokens: number | null
  latency_ms: number | null
  cost_usd: number | null
  fallback_used: boolean
  error_code: string | null
}

interface LLMCallMapProps {
  calls: LLMCallRecord[]
  isLoading: boolean
}

function fmtMs(ms: number | null): string {
  if (ms == null) return '—'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

function fmtTokens(n: number | null): string {
  if (n == null) return '—'
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

function fmtCost(usd: number | null): string {
  if (usd == null) return ''
  if (usd < 0.01) return `$${usd.toFixed(4)}`
  return `$${usd.toFixed(2)}`
}

function CardSkeleton() {
  return (
    <div className="h-[60px] rounded border border-[rgba(212,175,55,0.10)] bg-[rgba(212,175,55,0.04)] animate-pulse" />
  )
}

export function LLMCallMap({ calls, isLoading }: LLMCallMapProps) {
  if (isLoading) {
    return (
      <div className="px-4 py-3 space-y-2">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[rgba(212,175,55,0.6)]">
          LLM Calls
        </div>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  if (calls.length === 0) {
    return (
      <div className="px-4 py-3 text-[10px] italic text-[rgba(212,175,55,0.4)]">
        No LLM calls recorded.
      </div>
    )
  }

  const maxLatency = Math.max(
    ...calls.map((c) => c.latency_ms ?? 0),
    1,
  )

  return (
    <div className="px-4 py-3 space-y-2">
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[rgba(212,175,55,0.6)]">
        LLM Calls
      </div>
      {calls.map((call, idx) => {
        const isReasoner = (call.reasoning_tokens ?? 0) > 0
        const latencyPct = call.latency_ms
          ? Math.min(100, (call.latency_ms / maxLatency) * 100)
          : 0
        const reasoningPct =
          call.latency_ms && call.reasoning_tokens && call.output_tokens
            ? Math.min(
                latencyPct,
                latencyPct *
                  (call.reasoning_tokens /
                    (call.reasoning_tokens + call.output_tokens)),
              )
            : 0

        return (
          <div
            key={`${call.call_stage}-${idx}`}
            className="rounded border border-[rgba(212,175,55,0.15)] bg-[rgba(13,10,5,0.5)] px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[rgba(252,226,154,0.9)]">
                {call.call_stage}
              </span>
              <span className="text-[10px] text-[rgba(212,175,55,0.5)]">
                {call.model_id} · {call.provider}
              </span>
              {call.fallback_used && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-[rgba(220,140,60,0.12)] text-[rgba(240,170,100,0.95)] border-[rgba(230,150,80,0.4)]">
                  FALLBACK
                </span>
              )}
              {call.error_code && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-[rgba(220,90,60,0.12)] text-[rgba(240,150,120,0.95)] border-[rgba(230,110,80,0.4)]">
                  {call.error_code}
                </span>
              )}
              <span className="ml-auto text-[10px] text-[rgba(212,175,55,0.5)]">
                {fmtMs(call.latency_ms)}
              </span>
            </div>

            <div className="mt-1 flex items-center gap-3 text-[10px] text-[rgba(212,175,55,0.6)]">
              <span>in {fmtTokens(call.input_tokens)}</span>
              <span>out {fmtTokens(call.output_tokens)}</span>
              {isReasoner && (
                <span className="text-[rgba(240,170,100,0.85)]">
                  reasoning {fmtTokens(call.reasoning_tokens)}
                </span>
              )}
              {call.cost_usd != null && (
                <span className="ml-auto text-[rgba(244,209,96,0.7)]">
                  {fmtCost(call.cost_usd)}
                </span>
              )}
            </div>

            {/* Latency bar (proportional). Reasoning segment renders as
                an amber prefix on R1-class calls. */}
            <div className="mt-1.5 h-1 w-full rounded bg-[rgba(212,175,55,0.06)] overflow-hidden flex">
              {isReasoner && (
                <div
                  className="h-full bg-[rgba(230,150,80,0.7)]"
                  style={{ width: `${reasoningPct}%` }}
                />
              )}
              <div
                className="h-full bg-[rgba(212,175,55,0.55)]"
                style={{ width: `${Math.max(0, latencyPct - reasoningPct)}%` }}
              />
            </div>

            {isReasoner && (
              <button
                type="button"
                onClick={() => {
                  /* W2-TRACE-B: wire to reasoning_trace payload */
                }}
                className="mt-1.5 text-[10px] text-[rgba(244,209,96,0.6)] hover:text-[rgba(244,209,96,0.95)] underline underline-offset-2"
              >
                View thinking
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
