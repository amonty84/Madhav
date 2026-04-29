'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PanelResult } from '@/lib/synthesis/panel/types'
import { DivergenceReport } from './DivergenceReport'
import { AnswerView } from './AnswerView'

interface Props {
  panel: PanelResult
  chartId: string
}

export function PanelAnswerView({ panel, chartId: _chartId }: Props) {
  const [divergenceOpen, setDivergenceOpen] = useState(false)
  const [membersOpen, setMembersOpen] = useState(false)

  const { adjudication, member_outputs, degrade_notice } = panel

  // Build a DivergenceClassification shape from the adjudication data for DivergenceReport
  const classification: import('@/lib/synthesis/panel/divergence_detector').DivergenceClassification = {
    has_divergence: adjudication.divergence_summary.has_divergence,
    instances: [],
    member_alignment_summary: adjudication.member_alignment,
  }

  const successfulMembers = member_outputs.filter(m => m.status === 'success')

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-4 space-y-4">
      {/* Degrade notice */}
      {degrade_notice && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs text-amber-300"
        >
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            One panel member failed — proceeding with{' '}
            <strong>{degrade_notice.surviving_members}</strong> member
            {degrade_notice.surviving_members !== 1 ? 's' : ''}
            {degrade_notice.reason ? ` (${degrade_notice.reason})` : ''}
          </span>
        </div>
      )}

      {/* Final answer — routed through AnswerView so markdown, headings, lists,
          code blocks, and citation chips render identically to the single-model path. */}
      <AnswerView text={adjudication.final_answer} />

      {/* Divergence section */}
      <div className="border border-border/60 rounded-lg overflow-hidden">
        <button
          type="button"
          aria-expanded={divergenceOpen}
          onClick={() => setDivergenceOpen(o => !o)}
          className={cn(
            'flex w-full items-center justify-between px-3 py-2.5',
            'text-xs font-medium text-muted-foreground hover:text-foreground',
            'hover:bg-muted/40 transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset'
          )}
        >
          <span>
            {adjudication.divergence_summary.has_divergence
              ? `Show divergence analysis (${adjudication.divergence_summary.divergence_count} instance${adjudication.divergence_summary.divergence_count !== 1 ? 's' : ''})`
              : 'Show divergence analysis'}
          </span>
          {divergenceOpen ? (
            <ChevronUp className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          )}
        </button>

        {divergenceOpen && (
          <div
            role="region"
            aria-label="Divergence analysis"
            className="border-t border-border/60 px-3 py-3"
          >
            <DivergenceReport
              classification={classification}
              divergenceSummary={adjudication.divergence_summary}
              memberAlignment={adjudication.member_alignment}
            />
          </div>
        )}
      </div>

      {/* Panel members section */}
      <div className="border border-border/60 rounded-lg overflow-hidden">
        <button
          type="button"
          aria-expanded={membersOpen}
          onClick={() => setMembersOpen(o => !o)}
          className={cn(
            'flex w-full items-center justify-between px-3 py-2.5',
            'text-xs font-medium text-muted-foreground hover:text-foreground',
            'hover:bg-muted/40 transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset'
          )}
        >
          <span>Show panel members ({successfulMembers.length} of {member_outputs.length})</span>
          {membersOpen ? (
            <ChevronUp className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          )}
        </button>

        {membersOpen && (
          <div
            role="region"
            aria-label="Panel member outputs"
            className="border-t border-border/60 px-3 py-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {member_outputs.map((member, idx) => (
                <div
                  key={`member-${member.member_index}-${idx}`}
                  className={cn(
                    'rounded-md border px-3 py-2.5 space-y-1.5',
                    member.status === 'success'
                      ? 'border-border/60 bg-muted/20'
                      : 'border-destructive/30 bg-destructive/5'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-foreground/70">
                      M{member.member_index + 1}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] rounded border px-1.5 py-0.5',
                        member.status === 'success'
                          ? 'border-green-500/30 text-green-400'
                          : 'border-destructive/30 text-destructive'
                      )}
                    >
                      {member.status}
                    </span>
                  </div>
                  {member.status === 'success' && member.answer ? (
                    <p className="text-xs text-foreground/80 leading-relaxed line-clamp-6 whitespace-pre-wrap">
                      {member.answer}
                    </p>
                  ) : (
                    <p className="text-xs text-destructive/70 italic">
                      {member.error ?? 'Member failed'}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground">
                    {member.latency_ms}ms · {member.provider_family}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
