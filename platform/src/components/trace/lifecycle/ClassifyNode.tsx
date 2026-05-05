import type { TraceDocument } from '@/lib/admin/trace_assembler'
import { NodeWrapper } from './NodeWrapper'
import { GhostPill } from './GhostPill'

interface ClassifyNodeProps {
  trace: TraceDocument
  selected: boolean
  onSelect: () => void
}

export function ClassifyNode({ trace, selected, onSelect }: ClassifyNodeProps) {
  const classify = trace.classify
  const status = classify === null ? 'skipped' : 'ok'

  return (
    <NodeWrapper selected={selected} status={status} testId="node-classify" onClick={onSelect}>
      <p className="text-xs font-semibold text-[#d4af37]">classify</p>
      <p className="text-xs text-zinc-300">
        {classify?.alternatives[0]?.type ?? trace.query.type ?? '—'} · {classify?.alternatives[0]?.confidence?.toFixed(2) ?? '—'}
      </p>
      {classify && classify.alternatives.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {classify.alternatives.slice(0, 3).map((alt, i) => (
            <GhostPill
              key={i}
              label={`${alt.type} ${(alt.confidence * 100).toFixed(0)}%`}
              tooltip={alt.rationale ?? ''}
              selected={i === 0}
            />
          ))}
        </div>
      )}
    </NodeWrapper>
  )
}
