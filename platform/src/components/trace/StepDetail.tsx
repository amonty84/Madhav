'use client'

import type { TraceDocument } from '@/lib/admin/trace_assembler'
import { ClassifyDetail } from './step_detail/ClassifyDetail'
import { PlanDetail } from './step_detail/PlanDetail'
import { FetchSqlDetail } from './step_detail/FetchSqlDetail'
import { FetchGcsDetail } from './step_detail/FetchGcsDetail'
import { FetchVectorDetail } from './step_detail/FetchVectorDetail'
import { ContextAssemblyDetail } from './step_detail/ContextAssemblyDetail'
import { SynthesisDetail } from './step_detail/SynthesisDetail'

type StepVariant =
  | 'classify'
  | 'plan'
  | 'fetch_sql'
  | 'fetch_gcs'
  | 'fetch_vector'
  | 'context_assembly'
  | 'synthesis'

const VARIANT_LABELS: Record<StepVariant, string> = {
  classify: 'Classify',
  plan: 'Plan',
  fetch_sql: 'Fetch · SQL',
  fetch_gcs: 'Fetch · GCS',
  fetch_vector: 'Fetch · Vector',
  context_assembly: 'Context Assembly',
  synthesis: 'Synthesis',
}

function resolveVariant(stepId: string, trace: TraceDocument): StepVariant {
  if (stepId === 'classify') return 'classify'
  if (stepId === 'plan') return 'plan'
  if (stepId === 'context_assembly') return 'context_assembly'
  if (stepId === 'synthesis') return 'synthesis'
  const fetch = trace.fetches.find(f => f.bundle === stepId)
  if (fetch) {
    const name = fetch.bundle.toLowerCase()
    if (name.includes('gcs') || name.includes('document') || name.includes('storage')) return 'fetch_gcs'
    if (name.includes('vector') || name.includes('embed')) return 'fetch_vector'
    return 'fetch_sql'
  }
  return 'synthesis'
}

function copyStepJson(trace: TraceDocument, stepId: string): unknown {
  if (stepId === 'classify') return trace.classify
  if (stepId === 'plan') return trace.plan
  if (stepId === 'context_assembly') return trace.context_assembly
  if (stepId === 'synthesis') return trace.synthesis
  return trace.fetches.find(f => f.bundle === stepId) ?? null
}

const BADGE_COLORS: Record<StepVariant, string> = {
  classify: 'bg-blue-400/10 text-blue-400',
  plan: 'bg-[rgba(212,175,55,0.1)] text-[#d4af37]',
  fetch_sql: 'bg-emerald-400/10 text-emerald-400',
  fetch_gcs: 'bg-teal-400/10 text-teal-400',
  fetch_vector: 'bg-violet-400/10 text-violet-400',
  context_assembly: 'bg-amber-400/10 text-amber-400',
  synthesis: 'bg-pink-400/10 text-pink-400',
}

function StepTypeBadge({ variant }: { variant: StepVariant }) {
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide ${BADGE_COLORS[variant]}`}>
      {VARIANT_LABELS[variant]}
    </span>
  )
}

interface StepDetailProps {
  trace: TraceDocument
  selectedStepId: string
}

export function StepDetail({ trace, selectedStepId }: StepDetailProps) {
  const variant = resolveVariant(selectedStepId, trace)

  function handleCopyJson() {
    const data = copyStepJson(trace, selectedStepId)
    void navigator.clipboard.writeText(JSON.stringify(data, null, 2))
  }

  return (
    <div className="flex flex-col h-full" data-testid="step-detail">
      {/* Sticky sub-header */}
      <div className="sticky top-0 z-10 bg-[oklch(0.10_0.012_70)] border-b border-[rgba(212,175,55,0.1)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StepTypeBadge variant={variant} />
          <span className="text-sm font-medium text-zinc-200">{selectedStepId}</span>
        </div>
        <button
          onClick={handleCopyJson}
          className="text-xs text-zinc-500 hover:text-zinc-300"
          data-testid="copy-step-json"
        >
          Copy JSON
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {variant === 'classify' && <ClassifyDetail trace={trace} />}
        {variant === 'plan' && <PlanDetail trace={trace} />}
        {variant === 'fetch_sql' && <FetchSqlDetail trace={trace} stepId={selectedStepId} />}
        {variant === 'fetch_gcs' && <FetchGcsDetail trace={trace} stepId={selectedStepId} />}
        {variant === 'fetch_vector' && <FetchVectorDetail trace={trace} stepId={selectedStepId} />}
        {variant === 'context_assembly' && <ContextAssemblyDetail trace={trace} />}
        {variant === 'synthesis' && <SynthesisDetail trace={trace} />}
      </div>
    </div>
  )
}
