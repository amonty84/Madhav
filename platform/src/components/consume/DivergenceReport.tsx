'use client'

import { cn } from '@/lib/utils'
import type { DivergenceSummary, MemberAlignment } from '@/lib/synthesis/panel/types'
import type { DivergenceClassification, DivergenceInstance } from '@/lib/synthesis/panel/divergence_detector'

interface Props {
  classification: DivergenceClassification
  divergenceSummary: DivergenceSummary
  memberAlignment: Record<string, MemberAlignment>
}

const DIVERGENCE_CLASS_STYLES: Record<string, { label: string; row: string; badge: string }> = {
  'DIS.class.factual': {
    label: 'Factual',
    row: 'border-rose-500/30 bg-rose-500/5',
    badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  },
  'DIS.class.interpretive': {
    label: 'Interpretive',
    row: 'border-amber-500/30 bg-amber-500/5',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  'DIS.class.scope': {
    label: 'Scope',
    row: 'border-blue-500/30 bg-blue-500/5',
    badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  },
  'DIS.class.confidence': {
    label: 'Confidence',
    row: 'border-purple-500/30 bg-purple-500/5',
    badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  },
  'DIS.class.extension': {
    label: 'Extension',
    row: 'border-teal-500/30 bg-teal-500/5',
    badge: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  },
}

const ALIGNMENT_STYLES: Record<MemberAlignment, { label: string; className: string }> = {
  aligned: { label: 'aligned', className: 'bg-green-500/15 text-green-400 border-green-500/30' },
  partial: { label: 'partial', className: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  dissent: { label: 'dissent', className: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
}

function AlignmentBadge({ alignment }: { alignment: MemberAlignment }) {
  const style = ALIGNMENT_STYLES[alignment]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium',
        style.className
      )}
    >
      {style.label}
    </span>
  )
}

function DivergenceRow({ instance }: { instance: DivergenceInstance }) {
  const styles = DIVERGENCE_CLASS_STYLES[instance.class] ?? {
    label: instance.class,
    row: 'border-gray-500/30 bg-gray-500/5',
    badge: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  }

  return (
    <div className={cn('rounded-md border px-3 py-2.5', styles.row)}>
      <div className="flex items-start gap-2">
        <span
          className={cn(
            'mt-0.5 shrink-0 inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium',
            styles.badge
          )}
        >
          {styles.label}
        </span>
        <p className="text-xs text-foreground/80 leading-relaxed">{instance.description}</p>
      </div>
      {instance.member_indices.length > 0 && (
        <p className="mt-1 text-[10px] text-muted-foreground">
          Members: {instance.member_indices.map(i => `M${i + 1}`).join(', ')}
        </p>
      )}
    </div>
  )
}

export function DivergenceReport({ classification, divergenceSummary, memberAlignment }: Props) {
  if (!classification.has_divergence) {
    return (
      <div className="flex items-center gap-2 py-2">
        <span
          className="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400"
          aria-label="Panel agreed"
        >
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-400" aria-hidden="true" />
          Panel agreed
        </span>
        {divergenceSummary.summary_text && (
          <p className="text-xs text-muted-foreground">{divergenceSummary.summary_text}</p>
        )}
      </div>
    )
  }

  const memberEntries = Object.entries(memberAlignment)

  return (
    <div className="space-y-3">
      {/* Summary */}
      {divergenceSummary.summary_text && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          {divergenceSummary.summary_text}
        </p>
      )}

      {/* Divergence instances */}
      {classification.instances.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Divergence instances
          </p>
          {classification.instances.map((instance: DivergenceInstance, idx: number) => (
            <DivergenceRow key={`${instance.class}-${idx}`} instance={instance} />
          ))}
        </div>
      )}

      {/* Member alignment */}
      {memberEntries.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Member alignment
          </p>
          <div className="flex flex-wrap gap-2">
            {memberEntries.map(([label, alignment]) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="text-xs text-foreground/70">{label}</span>
                <AlignmentBadge alignment={alignment} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
