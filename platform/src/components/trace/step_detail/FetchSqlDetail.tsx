'use client'

import { useState } from 'react'
import type { TraceDocument } from '@/lib/admin/trace_assembler'
import { Section } from './Section'

interface FetchSqlDetailProps {
  trace: TraceDocument
  stepId: string
}

const PAGE_SIZE = 50

export function FetchSqlDetail({ trace, stepId }: FetchSqlDetailProps) {
  const [tab, setTab] = useState<'kept' | 'dropped'>('kept')
  const [page, setPage] = useState(0)

  const fetch = trace.fetches.find(f => f.bundle === stepId)

  if (!fetch) {
    return <p className="text-xs text-zinc-500">Fetch step not found: {stepId}</p>
  }

  const items = tab === 'kept' ? fetch.kept_items : fetch.dropped_items
  const totalPages = Math.ceil(items.length / PAGE_SIZE)
  const pageItems = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="space-y-6" data-testid="fetch-sql-detail">
      <Section title="Input">
        <div className="text-xs text-zinc-300 space-y-1">
          <p><span className="text-zinc-500">bundle: </span>{fetch.bundle}</p>
          <p><span className="text-zinc-500">latency: </span>
            {fetch.latency_ms !== null ? `${fetch.latency_ms}ms` : '—'}
          </p>
          {fetch.error_class !== 'OK' && (
            <p className="text-red-400">error: {fetch.error_class}</p>
          )}
        </div>
      </Section>

      <Section title="Decision">
        <p className="text-xs text-zinc-300">
          Retrieved {fetch.raw_count} rows → kept {fetch.kept_count}, dropped {fetch.dropped_items.length}
        </p>
      </Section>

      <Section title="Output">
        <div className="flex gap-2 mb-3">
          {(['kept', 'dropped'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setPage(0) }}
              className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                tab === t
                  ? 'border-[rgba(212,175,55,0.5)] text-[#d4af37] bg-[rgba(212,175,55,0.08)]'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
              }`}
            >
              {t === 'kept' ? `Kept (${fetch.kept_items.length})` : `Dropped (${fetch.dropped_items.length})`}
            </button>
          ))}
        </div>

        <div className="space-y-1">
          {pageItems.length === 0 && (
            <p className="text-xs text-zinc-500">No items</p>
          )}
          {pageItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2 py-1 border-b border-zinc-800/50">
              <span className="text-[10px] text-zinc-500 font-mono truncate w-40" title={item.item_id}>
                {item.item_id}
              </span>
              {item.score !== null && (
                <div className="flex items-center gap-1 flex-1">
                  <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#d4af37]"
                      style={{ width: `${Math.min(1, item.score) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500 w-8 text-right">
                    {item.score.toFixed(2)}
                  </span>
                </div>
              )}
              {tab === 'dropped' && 'drop_reason' in item && (
                <span className="text-[10px] text-red-400 truncate max-w-[120px]">
                  {(item as { drop_reason: string }).drop_reason}
                </span>
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
            >
              ← prev
            </button>
            <span className="text-xs text-zinc-500">{page + 1}/{totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="text-xs text-zinc-400 disabled:opacity-30"
            >
              next →
            </button>
          </div>
        )}
      </Section>
    </div>
  )
}
