'use client'

import { useState } from 'react'
import { AlertTriangle, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ValidatorFailure } from '@/lib/ui/validator-error'

interface Props {
  failures: ValidatorFailure[]
  onRetry: () => void
  className?: string
}

const VALIDATOR_LABELS: Record<string, { name: string; description: string }> = {
  P1: { name: 'Layer Separation', description: 'Facts and interpretations must be kept in separate layers.' },
  P2: { name: 'Citation Integrity', description: 'All claims must trace to an explicit source in the retrieval bundle.' },
  P5: { name: 'Signal ID Resolution', description: 'Signal IDs referenced in the answer must exist in the active MSR.' },
  p1_layer_separation: { name: 'Layer Separation', description: 'Facts and interpretations must be kept in separate layers.' },
  p2_citation: { name: 'Citation Integrity', description: 'All claims must trace to an explicit source in the retrieval bundle.' },
  p5_signal_id_resolution: { name: 'Signal ID Resolution', description: 'Signal IDs referenced in the answer must exist in the active MSR.' },
}

function validatorLabel(id: string): { name: string; description: string } {
  const key = id.toUpperCase()
  return (
    VALIDATOR_LABELS[id] ??
    VALIDATOR_LABELS[key] ??
    { name: id, description: 'A synthesis quality validator reported a failure.' }
  )
}

function FailureRow({ failure }: { failure: ValidatorFailure }) {
  const [detailOpen, setDetailOpen] = useState(false)
  const { name, description } = validatorLabel(failure.validator_id)

  return (
    <div className="rounded-md border border-destructive/30 bg-destructive/5">
      <div className="flex items-start justify-between gap-3 px-3 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="bt-body font-medium text-destructive">{name}</p>
          <p className="bt-label mt-0.5 text-destructive/70">{description}</p>
          {failure.reason && (
            <p className="bt-body mt-1 text-foreground/80">{failure.reason}</p>
          )}
        </div>
        <button
          type="button"
          aria-expanded={detailOpen}
          aria-label={`${detailOpen ? 'Hide' : 'Show'} technical detail for ${name}`}
          onClick={() => setDetailOpen(d => !d)}
          className={cn(
            'shrink-0 rounded border border-border px-2 py-1',
            'bt-label text-muted-foreground hover:bg-muted hover:text-foreground transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
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
          className="border-t border-destructive/20 px-3 py-2"
        >
          <p className="bt-mono text-xs text-muted-foreground">
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
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-4 w-4 text-destructive shrink-0" aria-hidden="true" />
        <p className="bt-body font-semibold text-foreground">
          Synthesis halted — quality validators failed
        </p>
      </div>

      <p className="bt-body text-muted-foreground mb-3">
        The pipeline could not produce a validated answer for this query. The
        validator{failures.length > 1 ? 's' : ''} below identified{' '}
        {failures.length > 1 ? 'issues' : 'an issue'} that prevented synthesis.
        Try rephrasing your question or submitting again.
      </p>

      <div className="space-y-2 mb-4">
        {failures.map((f, i) => (
          <FailureRow key={`${f.validator_id}-${i}`} failure={f} />
        ))}
      </div>

      <button
        type="button"
        onClick={onRetry}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5',
          'bt-body text-foreground hover:bg-muted transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        )}
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        Retry with different framing
      </button>
    </div>
  )
}
