'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { TraceDocument } from '@/lib/admin/trace_assembler'

interface QueryHeaderStripProps {
  trace: TraceDocument
}

const HEALTH_STYLES: Record<TraceDocument['query']['health'], string> = {
  HEALTHY: 'bg-emerald-400/10 border border-emerald-400/30 text-emerald-400',
  DEGRADED: 'bg-amber-400/10 border border-amber-400/30 text-amber-400',
  FAILED: 'bg-red-400/10 border border-red-400/30 text-red-400',
  UNKNOWN: 'bg-zinc-400/10 border border-zinc-400/30 text-zinc-400',
}

function formatCost(usd: number | null) {
  if (usd === null) return '—'
  return `$${usd.toFixed(4)}`
}

function formatLatency(ms: number | null) {
  if (ms === null) return '—'
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`
}

export function QueryHeaderStrip({ trace }: QueryHeaderStripProps) {
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const q = trace.query

  const queryText = q.text ?? ''
  const truncated = queryText.length > 80 ? queryText.slice(0, 80) + '…' : queryText

  function handleCopyId() {
    void navigator.clipboard.writeText(q.id).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function handleClose() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/admin/audit')
    }
  }

  return (
    <div
      data-testid="query-header-strip"
      className="h-14 flex items-center px-4 gap-3 border-b border-[rgba(212,175,55,0.1)] shrink-0"
    >
      {/* Left: query text */}
      <p
        className="text-sm text-zinc-200 truncate max-w-[50%]"
        title={queryText}
      >
        {truncated || <span className="text-zinc-500 italic">no query text</span>}
      </p>

      {/* Center: pills */}
      <div className="flex items-center gap-2 flex-1 justify-center">
        {q.type && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.2)] text-[#d4af37]">
            {q.type}
            {q.confidence != null ? ` · ${q.confidence.toFixed(2)}` : ''}
          </span>
        )}
        <span className="text-xs text-zinc-400">{formatLatency(q.total_ms)}</span>
        <span className="text-xs text-zinc-400">{formatCost(q.total_cost_usd)}</span>
      </div>

      {/* Right: health badge, query id, close */}
      <div className="flex items-center gap-3 ml-auto">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${HEALTH_STYLES[q.health]}`}
          data-testid={`health-badge-${q.health}`}
        >
          {q.health}
        </span>

        <div className="group relative flex items-center gap-1">
          <span className="text-[10px] font-mono text-zinc-500 select-all">{q.id.slice(0, 8)}…</span>
          <button
            onClick={handleCopyId}
            className="opacity-0 group-hover:opacity-100 text-[10px] text-zinc-400 hover:text-zinc-200 transition-opacity"
            title="Copy full query ID"
          >
            {copied ? '✓' : '⎘'}
          </button>
        </div>

        <button
          onClick={handleClose}
          className="text-zinc-400 hover:text-white text-sm leading-none"
          data-testid="trace-close-btn"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
