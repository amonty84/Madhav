'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { PredictionRow } from '@/lib/prediction/types'
import type { PredictionOutcome } from '@/lib/prediction/queries'

const OUTCOMES: PredictionOutcome[] = ['confirmed', 'refuted', 'partial', 'unobservable']

const OUTCOME_STYLES: Record<PredictionOutcome, string> = {
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300',
  refuted: 'bg-destructive/10 text-destructive border-destructive/30',
  partial: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
  unobservable: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400',
}

function OutcomeForm({ prediction, onRecorded }: {
  prediction: PredictionRow
  onRecorded: (updated: PredictionRow) => void
}) {
  const [selectedOutcome, setSelectedOutcome] = useState<PredictionOutcome | ''>('')
  const [correctionNote, setCorrectionNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const today = new Date().toISOString().split('T')[0]
  const horizonNotYetBegun = prediction.horizon_start > today

  const showCorrectionNote = selectedOutcome === 'refuted' || selectedOutcome === 'partial'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedOutcome) return

    startTransition(async () => {
      try {
        const body: Record<string, string> = { outcome: selectedOutcome }
        if (showCorrectionNote && correctionNote.trim()) {
          body.correction_note = correctionNote.trim()
        }
        const res = await fetch(`/api/audit/predictions/${prediction.id}/outcome`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          const json = (await res.json()) as { error?: string }
          setError(json.error ?? 'Failed to record outcome')
          return
        }
        const { prediction: updated } = (await res.json()) as { prediction: PredictionRow }
        onRecorded(updated)
        setError(null)
        setCorrectionNote('')
        setSelectedOutcome('')
      } catch {
        setError('Network error — please try again')
      }
    })
  }

  if (horizonNotYetBegun) {
    return (
      <p className="text-xs text-muted-foreground italic">
        Outcome recording opens on {prediction.horizon_start}
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={selectedOutcome}
          onChange={(e) => setSelectedOutcome(e.target.value as PredictionOutcome)}
          aria-label="Select outcome"
          className={cn(
            'rounded border border-border bg-background px-2 py-1 text-xs',
            'focus:outline-none focus:ring-2 focus:ring-ring'
          )}
          disabled={isPending}
        >
          <option value="">Select outcome…</option>
          {OUTCOMES.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!selectedOutcome || isPending}
          className={cn(
            'rounded border border-border px-2 py-1 text-xs transition-colors',
            'hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
        >
          {isPending ? 'Saving…' : 'Record'}
        </button>
        {error && <span role="alert" className="text-xs text-destructive">{error}</span>}
      </div>
      {showCorrectionNote && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Correction note (optional)
          </label>
          <textarea
            value={correctionNote}
            onChange={e => setCorrectionNote(e.target.value)}
            placeholder="What did the instrument get wrong? How should it reason differently?"
            rows={3}
            disabled={isPending}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>
      )}
    </form>
  )
}

function PredictionCard({
  prediction,
  showOutcomeForm,
  onUpdated,
}: {
  prediction: PredictionRow
  showOutcomeForm: boolean
  onUpdated: (updated: PredictionRow) => void
}) {
  const [current, setCurrent] = useState(prediction)

  function handleRecorded(updated: PredictionRow) {
    setCurrent(updated)
    onUpdated(updated)
  }

  return (
    <div className="rounded-md border border-border bg-card px-4 py-3 space-y-1.5">
      <p className="text-sm text-foreground leading-relaxed">{current.prediction_text}</p>
      <div className="flex flex-wrap gap-x-5 gap-y-0.5 text-xs text-muted-foreground">
        <span>Confidence: <strong className="text-foreground">{(current.confidence * 100).toFixed(0)}%</strong></span>
        <span>Horizon: {current.horizon_start} → {current.horizon_end}</span>
        <Link
          href={`/audit/${current.query_id}`}
          className="hover:text-foreground transition-colors underline"
        >
          Source query
        </Link>
        {current.calibration_bucket && (
          <span>Bucket: {current.calibration_bucket}</span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground/70">Falsifier:</span> {current.falsifier}
      </p>
      {current.outcome ? (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] font-medium',
              OUTCOME_STYLES[current.outcome as PredictionOutcome] ??
                'bg-muted text-muted-foreground border-border'
            )}
          >
            {current.outcome}
          </span>
          {current.outcome_observed_at && (
            <span className="text-xs text-muted-foreground">
              {new Date(current.outcome_observed_at).toLocaleDateString()}
            </span>
          )}
        </div>
      ) : (
        showOutcomeForm && (
          <OutcomeForm prediction={current} onRecorded={handleRecorded} />
        )
      )}
    </div>
  )
}

interface Props {
  initialOpen: PredictionRow[]
  initialClosed: PredictionRow[]
}

export function PredictionLedgerClient({ initialOpen, initialClosed }: Props) {
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open')
  const [openRows, setOpenRows] = useState<PredictionRow[]>(initialOpen)
  const [closedRows, setClosedRows] = useState<PredictionRow[]>(initialClosed)

  function handleUpdated(updated: PredictionRow) {
    setOpenRows((prev) => prev.filter((p) => p.id !== updated.id))
    setClosedRows((prev) => [updated, ...prev])
  }

  const rows = activeTab === 'open' ? openRows : closedRows

  return (
    <div>
      {/* Tabs */}
      <div role="tablist" aria-label="Prediction tabs" className="mb-4 flex gap-1 border-b border-border">
        {(['open', 'closed'] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab === 'open' ? 'Open' : 'Closed'}
            <span
              className={cn(
                'ml-1.5 rounded-full border px-1.5 py-0.5 text-[11px] font-medium',
                activeTab === tab ? 'border-primary/30 bg-primary/10' : 'border-border bg-muted'
              )}
            >
              {tab === 'open' ? openRows.length : closedRows.length}
            </span>
          </button>
        ))}
      </div>

      {/* Table header for closed tab */}
      {activeTab === 'closed' && closedRows.length > 0 && (
        <div className="mb-2 grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span>Prediction</span>
          <span>Outcome</span>
          <span>Observed</span>
          <span>Bucket</span>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-sm">
            {activeTab === 'open' ? 'No open predictions.' : 'No closed predictions yet.'}
          </p>
        </div>
      ) : (
        <div role="tabpanel" aria-label={`${activeTab} predictions`} className="space-y-2">
          {rows.map((p) => (
            <PredictionCard
              key={p.id}
              prediction={p}
              showOutcomeForm={activeTab === 'open'}
              onUpdated={handleUpdated}
            />
          ))}
        </div>
      )}
    </div>
  )
}
