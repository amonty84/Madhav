import type { TraceDocument } from '@/lib/admin/trace_assembler'
import { NodeWrapper } from './NodeWrapper'

interface ContextAssemblyNodeProps {
  trace: TraceDocument
  selected: boolean
  onSelect: () => void
}

export function ContextAssemblyNode({ trace, selected, onSelect }: ContextAssemblyNodeProps) {
  const ca = trace.context_assembly
  const status = ca === null ? 'skipped' : 'ok'
  const ledger = ca?.token_ledger

  return (
    <NodeWrapper selected={selected} status={status} testId="node-context-assembly" onClick={onSelect}>
      <p className="text-xs font-semibold text-[#d4af37]">context assembly</p>
      {ca ? (
        <p className="text-xs text-zinc-300">
          {ca.items.filter(i => i.status === 'INCLUDED').length}/{ca.items.length} items ·{' '}
          {ledger ? `${Math.round(ledger.total / 1000)}k tokens · ${ledger.dropped_count} dropped` : '—'}
        </p>
      ) : (
        <p className="text-xs text-zinc-500">no data</p>
      )}
    </NodeWrapper>
  )
}
