'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ValidatorFailure } from '@/lib/ui/validator-error'
import { lookupValidator } from '@/lib/validators/labels'

interface Props {
  failures: ValidatorFailure[]
  onRetry: () => void
  className?: string
}

function FailureRow({ failure }: { failure: ValidatorFailure }) {
  const [detailOpen, setDetailOpen] = useState(false)
  const { short: name, description } = lookupValidator(failure.validator_id)

  return (
    <div className="rounded-md border border-[var(--brand-gold-hairline)]/60 bg-[var(--brand-charcoal)]/40">
      <div className="flex items-start justify-between gap-3 px-3 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="bt-body font-medium text-[var(--brand-cream)]">{name}</p>
          <p className="bt-label mt-0.5 text-[var(--brand-cream)]/60">{description}</p>
          {failure.reason && (
            <p className="bt-body mt-1 text-[var(--brand-cream)]/80">{failure.reason}</p>
          )}
        </div>
        <button
          type="button"
          aria-expanded={detailOpen}
          aria-label={`${detailOpen ? 'Hide' : 'Show'} technical detail for ${name}`}
          onClick={() => setDetailOpen(d => !d)}
          className={cn(
            'shrink-0 rounded border border-[var(--brand-gold-hairline)] px-2 py-1',
            'bt-label text-[var(--brand-gold)]/60 hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)] transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]'
          )}
        >
          {detailOpen ? (
            <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </div>

      {detailOpen && (
        <div
          role="region"
          aria-label={`Technical detail: ${name}`}
          className="border-t border-[var(--brand-gold-hairline)]/40 px-3 py-2"
        >
          <p className="bt-mono text-[var(--brand-cream)]/50">
            validator_id: {failure.validator_id}
            {'\n'}version: {failure.validator_version}
            {'\n'}vote: {failure.vote}
            {failure.affected_claims?.length
              ? '\naffected_claims:\n  ' + failure.affected_claims.join('\n  ')
              : ''}
          </p>
        </div>
      )}
    </div>
  )
}

export function ValidatorFailureView({ failures, onRetry, className }: Props) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn('mx-auto w-full max-w-3xl px-4 py-4', className)}
    >
      <div className={cn(
        'rounded-[14px] border border-[var(--brand-gold-hairline)] px-6 py-5',
        'bg-[var(--brand-charcoal)]/80 backdrop-blur-md shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]'
      )}>
        {/* Kicker */}
        <p className="font-serif text-[10px] uppercase tracking-[0.32em] text-[var(--brand-gold)]/80">
          EPISTEMIC HALT
        </p>

        {/* Gold-leaf rule */}
        <div className="h-px w-12 bg-gradient-to-r from-transparent via-[var(--brand-gold)] to-transparent my-3" />

        {/* Title */}
        <p className="bt-body font-semibold text-[var(--brand-cream)]">
          Synthesis halted — quality validators failed
        </p>

        {/* Lead paragraph */}
        <p className="bt-body text-[var(--brand-cream)]/70 mt-2 mb-4">
          The system declined to answer rather than fabricate. The framing of the prompt collided
          with one of the project&apos;s quality gates. Editing the prompt below — adding a chart_state,
          narrowing the dasha range, or grounding the question to a specific signal — typically
          resolves the gate.
        </p>

        <div className="space-y-2 mb-5">
          {failures.map((f, i) => (
            <FailureRow key={`${f.validator_id}-${i}`} failure={f} />
          ))}
        </div>

        <button
          type="button"
          onClick={onRetry}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-4 py-2',
            'brand-cta',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]'
          )}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Edit and retry
        </button>
      </div>
    </div>
  )
}
