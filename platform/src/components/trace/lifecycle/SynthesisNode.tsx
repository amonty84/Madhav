import type { TraceDocument } from '@/lib/admin/trace_assembler'
import { NodeWrapper } from './NodeWrapper'

interface SynthesisNodeProps {
  trace: TraceDocument
  selected: boolean
  onSelect: () => void
}

export function SynthesisNode({ trace, selected, onSelect }: SynthesisNodeProps) {
  const synth = trace.synthesis
  const scorecard = synth?.scorecard as { composite_score?: number | null } | null | undefined
  const status = synth === null ? 'skipped' : 'ok'

  return (
    <NodeWrapper selected={selected} status={status} testId="node-synthesis" onClick={onSelect}>
      <p className="text-xs font-semibold text-[#d4af37]">synthesis</p>
      <p className="text-xs text-zinc-300">
        {synth?.model ?? '—'} · {synth?.input_tokens ?? '—'}in · {synth?.output_tokens ?? '—'}out
        {' · Q '}
        {scorecard?.composite_score != null ? scorecard.composite_score.toFixed(2) : '—'}
      </p>
    </NodeWrapper>
  )
}
