'use client'

import { useState } from 'react'
import type { NewLELEvent } from '@/lib/lel/writer'

interface LogEventDialogProps {
  chartId: string
  onClose: () => void
  onSuccess: () => void
}

const CATEGORIES = [
  'career', 'education', 'relationship', 'finance', 'family',
  'health', 'travel', 'residential', 'spiritual', 'creative',
  'legal', 'loss', 'gain', 'psychological', 'other',
]

export function LogEventDialog({ chartId, onClose, onSuccess }: LogEventDialogProps) {
  const [form, setForm] = useState<Partial<NewLELEvent>>({
    category: 'other',
    magnitude: 'moderate',
    valence: 'neutral',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.date || !form.category || !form.description) {
      setError('Date, category, and description are required.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/lel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'append_event', chartId, payload: form }),
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
        <h2 className="mb-4 text-base font-semibold text-foreground">Log new event</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Date (YYYY-MM-DD or YYYY-MM-XX)</label>
            <input
              className="w-full rounded-md border border-border/60 bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400/50"
              placeholder="2026-04-30"
              value={form.date ?? ''}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Category</label>
            <select
              className="w-full rounded-md border border-border/60 bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400/50"
              value={form.category ?? 'other'}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Description</label>
            <textarea
              rows={3}
              className="w-full resize-none rounded-md border border-border/60 bg-input px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400/50"
              placeholder="Factual description of the event…"
              value={form.description ?? ''}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Magnitude</label>
              <select
                className="w-full rounded-md border border-border/60 bg-input px-3 py-1.5 text-sm focus:outline-none"
                value={form.magnitude ?? 'moderate'}
                onChange={e => setForm(f => ({ ...f, magnitude: e.target.value as NewLELEvent['magnitude'] }))}
              >
                {['trivial', 'moderate', 'significant', 'major', 'life-altering'].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Valence</label>
              <select
                className="w-full rounded-md border border-border/60 bg-input px-3 py-1.5 text-sm focus:outline-none"
                value={form.valence ?? 'neutral'}
                onChange={e => setForm(f => ({ ...f, valence: e.target.value as NewLELEvent['valence'] }))}
              >
                {['positive', 'mixed', 'negative', 'neutral'].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Native reflection (optional)</label>
            <input
              className="w-full rounded-md border border-border/60 bg-input px-3 py-1.5 text-sm focus:outline-none"
              placeholder="In native's own words…"
              value={form.native_reflection ?? ''}
              onChange={e => setForm(f => ({ ...f, native_reflection: e.target.value || undefined }))}
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
              {submitting ? 'Logging…' : 'Log event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
