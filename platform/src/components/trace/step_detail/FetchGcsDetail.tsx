'use client'

import { useState } from 'react'
import type { TraceDocument } from '@/lib/admin/trace_assembler'
import { Section } from './Section'

interface FetchGcsDetailProps {
  trace: TraceDocument
  stepId: string
}

export function FetchGcsDetail({ trace, stepId }: FetchGcsDetailProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [tab, setTab] = useState<'loaded' | 'skipped' | 'failed'>('loaded')

  const fetch = trace.fetches.find(f => f.bundle === stepId)

  if (!fetch) {
    return <p className="text-xs text-zinc-500">Fetch step not found: {stepId}</p>
  }

  const loaded = fetch.kept_items
  const failed = fetch.dropped_items.filter(d => d.drop_reason === 'FETCH_ERROR')
  const skipped = fetch.dropped_items.filter(d => d.drop_reason !== 'FETCH_ERROR')

  const tabItems = tab === 'loaded' ? loaded : tab === 'failed' ? failed : skipped

  return (
    <div className="space-y-6" data-testid="fetch-gcs-detail">
      <Section title="Input">
        <div className="text-xs text-zinc-300 space-y-1">
          <p><span className="text-zinc-500">bundle: </span>{fetch.bundle}</p>
          <p><span className="text-zinc-500">latency: </span>
            {fetch.latency_ms !== null ? `${fetch.latency_ms}ms` : '—'}
          </p>
        </div>
      </Section>

      <Section title="Decision">
        <div className="text-xs text-zinc-300 space-y-0.5">
          <p><span className="text-zinc-500">loaded: </span>{loaded.length}</p>
          <p><span className="text-zinc-500">skipped: </span>{skipped.length}</p>
          <p><span className="text-zinc-500">failed: </span>{failed.length}</p>
        </div>
      </Section>

      <Section title="Output">
        <div className="flex gap-2 mb-3">
          {(['loaded', 'skipped', 'failed'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                tab === t
                  ? 'border-[rgba(212,175,55,0.5)] text-[#d4af37] bg-[rgba(212,175,55,0.08)]'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
              }`}
            >
              {t === 'loaded' ? `Loaded (${loaded.length})` : t === 'skipped' ? `Skipped (${skipped.length})` : `Failed (${failed.length})`}
            </button>
          ))}
        </div>

        <div className="space-y-1">
          {tabItems.length === 0 && <p className="text-xs text-zinc-500">No items</p>}
          {tabItems.map((item, i) => (
            <div key={i}>
              <div
                className="flex items-center gap-2 py-1.5 border-b border-zinc-800/50 cursor-pointer"
                onClick={() => setExpandedId(expandedId === item.item_id ? null : item.item_id)}
              >
                <span className="text-xs text-zinc-300 truncate flex-1 font-mono text-[10px]" title={item.item_id}>
                  {item.item_id}
                </span>
                <span className="text-[10px] text-zinc-600">{expandedId === item.item_id ? '▲' : '▼'}</span>
              </div>
              {expandedId === item.item_id && (
                <div className="py-2 px-2 text-xs text-zinc-400 bg-[oklch(0.08_0.01_70)] rounded mb-1">
                  <pre className="whitespace-pre-wrap break-words text-[10px]">
                    {JSON.stringify(item, null, 2).slice(0, 500)}
                    {JSON.stringify(item, null, 2).length > 500 ? '…' : ''}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
