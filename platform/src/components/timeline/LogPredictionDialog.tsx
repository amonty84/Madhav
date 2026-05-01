'use client'

import { useState } from 'react'
import type { NewLELPrediction } from '@/lib/lel/writer'

interface LogPredictionDialogProps {
  chartId: string
  onClose: () => void
  onSuccess: () => void
}

export function LogPredictionDialog({ chartId, onClose, onSuccess }: LogPredictionDialogProps) {
  const [form, setForm] = useState<Partial<NewLELPrediction>>({
    chart_id: chartId,
    confidence: 0.6,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.body || !form.horizon || !form.falsifier) {
      setError('Body, horizon, and falsifier are required.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/lel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'append_prediction', chartId, payload: { ...form, chart_id: chartId } }),
      })
      if (!res.ok) {
        const { error: msg } = await res.json()
        throw new Error(msg ?? `HTTP ${res.status}`)
      }
      onSuccess()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
        <h2 className="mb-1 text-base font-semibold text-foreground">Log prediction</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Per Learning Layer discipline: body, horizon, confidence, and falsifier must be set <em>before</em> observing the outcome.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Prediction body</label>
            <textarea
              rows={3}
              className="w-full resize-none rounded-md border border-border/60 bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400/50"
              placeholder="What is predicted to happen…"
              value={form.body ?? ''}
              onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Horizon (when to check)</label>
            <input
              className="w-full rounded-md border border-border/60 bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400/50"
              placeholder="e.g. Q4 2026 or before 2026-12-31"
              value={form.horizon ?? ''}
              onChange={e => setForm(f => ({ ...f, horizon: e.target.value }))}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">
              Confidence: {Math.round((form.confidence ?? 0.6) * 100)}%
            </label>
            <input
              type="range"
              min={0.05}
              max={0.99}
              step={0.05}
              className="w-full accent-amber-400"
              value={form.confidence ?? 0.6}
              onChange={e => setForm(f => ({ ...f, confidence: parseFloat(e.target.value) }))}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Falsifier</label>
            <input
              className="w-full rounded-md border border-border/60 bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400/50"
              placeholder="What observable event would refute this prediction?"
              value={form.falsifier ?? ''}
              onChange={e => setForm(f => ({ ...f, falsifier: e.target.value }))}
            />
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border/50 px-4 py-1.5 text-sm text-muted-foreground hover:bg-muted/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-amber-500/80 px-4 py-1.5 text-sm font-medium text-black hover:bg-amber-400 disabled:opacity-50"
            >
              {submitting ? 'Logging…' : 'Log prediction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
