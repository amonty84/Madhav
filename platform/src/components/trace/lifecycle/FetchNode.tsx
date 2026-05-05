import type { TraceDocument } from '@/lib/admin/trace_assembler'
import { NodeWrapper } from './NodeWrapper'

interface FetchNodeProps {
  fetch: TraceDocument['fetches'][number]
  selected: boolean
  onSelect: () => void
  variant?: 'sql' | 'gcs' | 'vector'
}

export function FetchNode({ fetch, selected, onSelect }: FetchNodeProps) {
  const hasError = fetch.error_class !== 'OK'
  const isEmpty = fetch.kept_count === 0 && !hasError
  const status = hasError ? 'failed' : isEmpty ? 'empty' : 'ok'

  const statusColor = hasError
    ? 'text-red-400'
    : fetch.kept_count === 0
    ? 'text-amber-400'
    : 'text-emerald-400'

  return (
    <NodeWrapper
      selected={selected}
      status={status}
      testId={`node-fetch-${fetch.bundle}`}
      onClick={onSelect}
    >
      <p className="text-xs font-semibold text-[#d4af37] truncate" title={fetch.bundle}>
        {fetch.bundle}
      </p>
      <p className={`text-xs ${statusColor}`}>
        {fetch.raw_count}→{fetch.kept_count} items
        {fetch.latency_ms !== null ? ` · ${fetch.latency_ms}ms` : ''}
      </p>
      {hasError && (
        <p className="text-[10px] text-red-400 mt-1">{fetch.error_class}</p>
      )}
    </NodeWrapper>
  )
}
