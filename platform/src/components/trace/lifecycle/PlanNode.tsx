import type { TraceDocument } from '@/lib/admin/trace_assembler'
import { NodeWrapper } from './NodeWrapper'
import { GhostPill } from './GhostPill'

interface PlanNodeProps {
  trace: TraceDocument
  selected: boolean
  onSelect: () => void
}

export function PlanNode({ trace, selected, onSelect }: PlanNodeProps) {
  const plan = trace.plan
  const status = plan === null ? 'skipped' : 'ok'

  return (
    <NodeWrapper selected={selected} status={status} testId="node-plan" onClick={onSelect}>
      <p className="text-xs font-semibold text-[#d4af37]">plan</p>
      <p className="text-xs text-zinc-300">{plan?.included_bundles.length ?? 0} bundles</p>
      {plan && plan.excluded_bundles.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {plan.excluded_bundles.map((b, i) => (
            <GhostPill key={i} label={b.name} tooltip={b.rationale ?? 'No rationale'} selected={false} />
          ))}
        </div>
      )}
    </NodeWrapper>
  )
}
