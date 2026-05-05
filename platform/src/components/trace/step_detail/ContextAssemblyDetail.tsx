'use client'

import { useState } from 'react'
import type { TraceDocument } from '@/lib/admin/trace_assembler'
import { Section } from './Section'

interface ContextAssemblyDetailProps {
  trace: TraceDocument
}

const STATUS_STYLES = {
  INCLUDED: 'text-emerald-400 bg-emerald-400/10',
  TRUNCATED: 'text-amber-400 bg-amber-400/10',
  DROPPED: 'text-red-400 bg-red-400/10',
} as const

const LAYER_COLORS: Record<string, string> = {
  L1: 'text-blue-400 bg-blue-400/10',
  L2_5: 'text-violet-400 bg-violet-400/10',
}

const CA_PAGE_SIZE = 50

export function ContextAssemblyDetail({ trace }: ContextAssemblyDetailProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const ca = trace.context_assembly

  if (!ca) {
    return <p className="text-xs text-zinc-500" data-testid="context-assembly-detail">No context assembly data</p>
  }

  const ledger = ca.token_ledger
  const sortedItems = [...ca.items].sort((a, b) => {
    const order = { INCLUDED: 0, TRUNCATED: 1, DROPPED: 2 }
    return (order[a.status] ?? 3) - (order[b.status] ?? 3) || a.rank - b.rank
  })

  const totalPages = Math.ceil(sortedItems.length / CA_PAGE_SIZE)
  const pagedItems = sortedItems.slice(page * CA_PAGE_SIZE, (page + 1) * CA_PAGE_SIZE)

  const total = ledger.L1 + ledger.L2_5 + ledger.preamble || 1
  const preamblePct = (ledger.preamble / total) * 100
  const l1Pct = (ledger.L1 / total) * 100
  const l25Pct = (ledger.L2_5 / total) * 100

  return (
    <div className="space-y-6" data-testid="context-assembly-detail">
      <Section title="Input">
        <div className="text-xs text-zinc-300 space-y-1">
          {Object.entries(
            ca.items.reduce<Record<string, number>>((acc, item) => {
              acc[item.source_bundle] = (acc[item.source_bundle] ?? 0) + 1
              return acc
            }, {}),
          ).map(([bundle, count]) => (
            <p key={bundle}>
              <span className="text-zinc-500">{bundle}: </span>{count} items
            </p>
          ))}
        </div>
      </Section>

      <Section title="Decision">
        {/* Token stacked bar */}
        <div className="mb-4">
          <div className="flex h-4 rounded overflow-hidden mb-1.5">
            {preamblePct > 0 && (
              <div className="bg-zinc-600" style={{ width: `${preamblePct}%` }} title={`Preamble: ${ledger.preamble}`} />
            )}
            {l1Pct > 0 && (
              <div className="bg-blue-500/60" style={{ width: `${l1Pct}%` }} title={`L1: ${ledger.L1}`} />
            )}
            {l25Pct > 0 && (
              <div className="bg-violet-500/60" style={{ width: `${l25Pct}%` }} title={`L2.5: ${ledger.L2_5}`} />
            )}
          </div>
          <div className="flex gap-3 text-[10px] text-zinc-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-zinc-600 rounded-sm inline-block" />Preamble</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500/60 rounded-sm inline-block" />L1</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-violet-500/60 rounded-sm inline-block" />L2.5</span>
          </div>
        </div>

        {/* Item waterfall */}
        <div className="space-y-0.5 max-h-80 overflow-y-auto">
          {pagedItems.map((item, i) => (
            <div key={i}>
              <div
                className="flex items-center gap-2 py-1.5 border-b border-zinc-800/30 cursor-pointer hover:bg-white/5 rounded px-1"
                onClick={() => setExpandedId(expandedId === item.source_item_id ? null : item.source_item_id)}
                data-testid={`context-item-${item.status.toLowerCase()}`}
              >
                <span className="text-[10px] text-zinc-600 w-5">{item.rank}</span>
                <span className="text-[10px] font-mono text-zinc-400 truncate w-36" title={item.source_item_id}>
                  {item.source_item_id}
                </span>
                <span className={`text-[9px] px-1 py-0.5 rounded font-semibold ${LAYER_COLORS[item.layer] ?? 'text-zinc-500 bg-zinc-800'}`}>
                  {item.layer}
                </span>
                <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  {item.relevance_score !== null && (
                    <div
                      className="h-full bg-[#d4af37]/60"
                      style={{ width: `${Math.min(1, item.relevance_score) * 100}%` }}
                    />
                  )}
                </div>
                <span className="text-[10px] text-zinc-500 w-10 text-right">{item.token_cost}t</span>
                <span className={`text-[9px] px-1 py-0.5 rounded ${STATUS_STYLES[item.status]}`}>
                  {item.status}
                </span>
              </div>
              {expandedId === item.source_item_id && (
                <div className="ml-6 py-1.5 px-2 text-[10px] text-zinc-400 bg-[oklch(0.08_0.01_70)] rounded mb-1">
                  {item.drop_reason && (
                    <p className="text-red-400 mb-0.5">reason: {item.drop_reason}</p>
                  )}
                  <p>budget: {item.budget} · cumulative: {item.cumulative_tokens}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="text-xs text-zinc-400 disabled:opacity-30"
              aria-label="Previous page"
            >
              ← prev
            </button>
            <span className="text-xs text-zinc-500">{page + 1}/{totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="text-xs text-zinc-400 disabled:opacity-30"
              aria-label="Next page"
            >
              next →
            </button>
          </div>
        )}
      </Section>

      <Section title="Output">
        <table className="w-full text-xs">
          <tbody>
            {[
              ['Total tokens', ledger.total],
              ['Budget', ledger.budget],
              ['Preamble', ledger.preamble],
              ['L1', ledger.L1],
              ['L2.5', ledger.L2_5],
              ['Dropped count', ledger.dropped_count],
              ['Truncated count', ledger.truncated_count],
            ].map(([label, value]) => (
              <tr key={label as string} className="border-b border-zinc-800/40">
                <td className="py-1 text-zinc-500">{label}</td>
                <td className="py-1 text-zinc-200 text-right font-mono">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  )
}
