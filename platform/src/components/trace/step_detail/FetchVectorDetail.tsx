'use client'

import type { TraceDocument } from '@/lib/admin/trace_assembler'
import { Section } from './Section'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'

interface FetchVectorDetailProps {
  trace: TraceDocument
  stepId: string
}

const SIMILARITY_THRESHOLD = 0.5

export function FetchVectorDetail({ trace, stepId }: FetchVectorDetailProps) {
  const fetch = trace.fetches.find(f => f.bundle === stepId)

  if (!fetch) {
    return <p className="text-xs text-zinc-500">Fetch step not found: {stepId}</p>
  }

  const allItems = [...fetch.kept_items, ...fetch.dropped_items]
  const chartData = allItems
    .filter(item => item.score !== null)
    .map((item, i) => ({ rank: i + 1, score: Number(item.score?.toFixed(3)) }))

  return (
    <div className="space-y-6" data-testid="fetch-vector-detail">
      <Section title="Input">
        <div className="text-xs text-zinc-300 space-y-1">
          <p><span className="text-zinc-500">bundle: </span>{fetch.bundle}</p>
          <p><span className="text-zinc-500">top_K: </span>{fetch.raw_count}</p>
          <p><span className="text-zinc-500">latency: </span>
            {fetch.latency_ms !== null ? `${fetch.latency_ms}ms` : '—'}
          </p>
        </div>
      </Section>

      <Section title="Decision">
        {chartData.length > 0 ? (
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis dataKey="rank" tick={{ fontSize: 9, fill: '#71717a' }} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 9, fill: '#71717a' }} />
                <Tooltip
                  contentStyle={{ background: '#1c1917', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 6, fontSize: 11 }}
                  labelStyle={{ color: '#d4af37' }}
                />
                <Bar dataKey="score" fill="#d4af37" opacity={0.7} />
                <ReferenceLine y={SIMILARITY_THRESHOLD} stroke="rgba(212,175,55,0.5)" strokeDasharray="3 3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-xs text-zinc-500">No score data</p>
        )}
      </Section>

      <Section title="Output">
        <div className="space-y-1">
          {allItems.length === 0 && <p className="text-xs text-zinc-500">No results</p>}
          {allItems.slice(0, 30).map((item, i) => {
            const kept = fetch.kept_items.some(k => k.item_id === item.item_id)
            return (
              <div key={i} className="flex items-center gap-2 py-1 border-b border-zinc-800/50">
                <span className="text-[10px] text-zinc-500 w-5">{i + 1}</span>
                <span className="text-[10px] font-mono text-zinc-400 truncate w-32" title={item.item_id}>
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
                      {item.score.toFixed(3)}
                    </span>
                  </div>
                )}
                <span className={`text-[10px] px-1 rounded ${kept ? 'text-emerald-400' : 'text-zinc-600'}`}>
                  {kept ? '✓' : '✗'}
                </span>
              </div>
            )
          })}
        </div>
      </Section>
    </div>
  )
}
