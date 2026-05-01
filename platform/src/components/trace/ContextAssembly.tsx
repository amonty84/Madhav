'use client'

/**
 * ContextAssembly — TRACE-5 (W2-TRACE-B).
 *
 * Stacked horizontal bar showing the proportional token contribution of
 * each context layer (L1 Facts, L2.5 Signals/Patterns, L4 Remedial,
 * Vector, CGM). Below the bar, a legend with token counts. A "context
 * budget" indicator shows total / model_max as a percentage; amber > 70%,
 * red > 85%.
 *
 * Drill-down (this session): clicking a layer expands a row showing the
 * layer label + token count. Item-level drill is the responsibility of
 * TRACE-9 / the investigation endpoint.
 *
 * UI-only: hydrated by parent on `context_assembly_done` SSE event.
 */

import { useState } from 'react'

export interface ContextLayer {
  label: string
  tokens: number
  color: string
}

interface ContextAssemblyProps {
  layers: ContextLayer[]
  total_tokens: number
  model_max_context: number
  isLoading: boolean
}

function fmtTokens(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function ContextAssembly({
  layers,
  total_tokens,
  model_max_context,
  isLoading,
}: ContextAssemblyProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="px-4 py-3 space-y-2">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[rgba(212,175,55,0.6)]">
          Context Assembly
        </div>
        <div className="h-3 w-full rounded bg-[rgba(212,175,55,0.06)] animate-pulse" />
        <div className="flex gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-5 w-14 rounded-full bg-[rgba(212,175,55,0.06)] animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  const totalSafe = total_tokens > 0 ? total_tokens : 1
  const budgetPct =
    model_max_context > 0 ? (total_tokens / model_max_context) * 100 : 0
  const budgetClass =
    budgetPct > 85
      ? 'text-[rgba(240,150,120,0.95)] border-[rgba(230,110,80,0.4)] bg-[rgba(220,90,60,0.12)]'
      : budgetPct > 70
        ? 'text-[rgba(240,170,100,0.95)] border-[rgba(220,140,60,0.4)] bg-[rgba(220,140,60,0.10)]'
        : 'text-[rgba(252,226,154,0.85)] border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.06)]'

  return (
    <div className="px-4 py-3 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[rgba(212,175,55,0.6)]">
          Context Assembly
        </span>
        <span className="ml-auto text-[10px] text-[rgba(212,175,55,0.5)]">
          {fmtTokens(total_tokens)} tok
        </span>
        {model_max_context > 0 && (
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${budgetClass}`}
            title={`${total_tokens} / ${model_max_context} tokens`}
          >
            {budgetPct.toFixed(0)}% of context
          </span>
        )}
      </div>

      {/* Stacked bar */}
      <div className="h-3 w-full rounded overflow-hidden flex bg-[rgba(212,175,55,0.06)]">
        {layers.map((layer, i) => {
          const w = (layer.tokens / totalSafe) * 100
          if (w <= 0) return null
          return (
            <button
              key={`${layer.label}-${i}`}
              type="button"
              onClick={() =>
                setExpanded((e) => (e === layer.label ? null : layer.label))
              }
              className={`${layer.color} h-full transition-opacity hover:opacity-80`}
              style={{ width: `${w}%` }}
              title={`${layer.label}: ${layer.tokens} tok`}
              aria-label={`${layer.label}: ${layer.tokens} tokens`}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-1.5">
        {layers.map((layer, i) => {
          const isExpanded = expanded === layer.label
          return (
            <button
              key={`legend-${layer.label}-${i}`}
              type="button"
              onClick={() =>
                setExpanded((e) => (e === layer.label ? null : layer.label))
              }
              className={`flex items-center gap-1.5 text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                isExpanded
                  ? 'border-[rgba(212,175,55,0.5)] bg-[rgba(212,175,55,0.10)] text-[rgba(252,226,154,0.95)]'
                  : 'border-[rgba(212,175,55,0.20)] bg-[rgba(13,10,5,0.5)] text-[rgba(212,175,55,0.7)] hover:border-[rgba(212,175,55,0.35)]'
              }`}
            >
              <span
                className={`inline-block h-2 w-2 rounded-sm ${layer.color}`}
              />
              <span>{layer.label}</span>
              <span className="text-[rgba(212,175,55,0.55)]">
                {fmtTokens(layer.tokens)}
              </span>
            </button>
          )
        })}
      </div>

      {/* Drill-down placeholder (item-level resolution lives in TRACE-9) */}
      {expanded && (
        <div className="mt-2 px-2.5 py-2 rounded border border-[rgba(212,175,55,0.15)] bg-[rgba(13,10,5,0.5)]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-[rgba(252,226,154,0.95)]">
              {expanded}
            </span>
            <span className="ml-auto text-[10px] text-[rgba(212,175,55,0.6)]">
              {fmtTokens(
                layers.find((l) => l.label === expanded)?.tokens ?? 0,
              )}{' '}
              tok
            </span>
          </div>
          <div className="mt-1 text-[10px] italic text-[rgba(212,175,55,0.45)]">
            Item-level drill-down available in the Investigation tab.
          </div>
        </div>
      )}
    </div>
  )
}
