'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { LELEvent, LELPrediction } from '@/lib/lel/parser'
import { EventCard } from './EventCard'
import { PredictionTable } from './PredictionTable'
import { LogEventDialog } from './LogEventDialog'
import { LogPredictionDialog } from './LogPredictionDialog'
import { cn } from '@/lib/utils'

type Tab = 'events' | 'predictions'

interface TimelineViewProps {
  events: LELEvent[]
  predictions: LELPrediction[]
  parseErrors: string[]
  chartId: string
  canWrite: boolean
}

const CATEGORIES = [
  'all', 'career', 'education', 'relationship', 'family',
  'health', 'spiritual', 'travel', 'finance', 'loss', 'other',
]

export function TimelineView({
  events,
  predictions,
  parseErrors,
  chartId,
  canWrite,
}: TimelineViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const tab: Tab = (searchParams.get('tab') as Tab) ?? 'events'

  function setTab(t: Tab) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', t)
    startTransition(() => router.replace(`?${params.toString()}`, { scroll: false }))
  }

  // Events tab state
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')

  // Dialog state
  const [showLogEvent, setShowLogEvent] = useState(false)
  const [showLogPrediction, setShowLogPrediction] = useState(false)

  // Derive filter options
  const years = Array.from(
    new Set(events.map(e => e.date.slice(0, 4)).filter(y => /^\d{4}$/.test(y)))
  ).sort((a, b) => b.localeCompare(a))

  const filteredEvents = events
    .filter(e => categoryFilter === 'all' || e.category === categoryFilter)
    .filter(e => yearFilter === 'all' || e.date.startsWith(yearFilter))
    .sort((a, b) => b.date.localeCompare(a.date))

  function refresh() {
    router.refresh()
  }

  return (
    <div className="flex h-full flex-col">
      {/* Parse error banner */}
      {parseErrors.length > 0 && (
        <div className="mx-6 mt-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs text-amber-300">
          {parseErrors.length} {parseErrors.length === 1 ? 'entry' : 'entries'} skipped due to
          format errors. Events and predictions shown are the parsable subset.
        </div>
      )}

      {/* Tab bar + action buttons */}
      <div className="flex items-center justify-between border-b border-border/40 px-6 pt-4">
        <div className="flex gap-1">
          {(['events', 'predictions'] as Tab[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'rounded-t-md px-4 py-2 text-sm font-medium transition-colors',
                tab === t
                  ? 'border-b-2 border-amber-400 text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t === 'events'
                ? `Events (${events.length})`
                : `Predictions (${predictions.length})`}
            </button>
          ))}
        </div>

        {canWrite && (
          <div className="flex gap-2 pb-1">
            {tab === 'events' && (
              <button
                type="button"
                onClick={() => setShowLogEvent(true)}
                className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20"
              >
                + Log event
              </button>
            )}
            {tab === 'predictions' && (
              <button
                type="button"
                onClick={() => setShowLogPrediction(true)}
                className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20"
              >
                + Log prediction
              </button>
            )}
          </div>
        )}
      </div>

      {/* Events tab */}
      {tab === 'events' && (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 overflow-x-auto px-6 py-3">
            <div className="flex gap-1">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategoryFilter(c)}
                  className={cn(
                    'rounded-full border px-2.5 py-0.5 text-xs transition-colors',
                    categoryFilter === c
                      ? 'border-amber-400/60 bg-amber-400/15 text-amber-300'
                      : 'border-border/40 text-muted-foreground hover:border-border hover:text-foreground'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <select
              className="rounded-full border border-border/40 bg-transparent px-2.5 py-0.5 text-xs text-muted-foreground"
              value={yearFilter}
              onChange={e => setYearFilter(e.target.value)}
            >
              <option value="all">All years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Event list */}
          <div className="flex-1 overflow-y-auto px-6 py-2">
            {filteredEvents.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No events match the current filters.
              </p>
            ) : (
              <div>
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Predictions tab */}
      {tab === 'predictions' && (
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <PredictionTable
            predictions={predictions}
            canWrite={canWrite}
            chartId={chartId}
          />
        </div>
      )}

      {/* Dialogs */}
      {showLogEvent && (
        <LogEventDialog
          chartId={chartId}
          onClose={() => setShowLogEvent(false)}
          onSuccess={() => { setShowLogEvent(false); refresh() }}
        />
      )}
      {showLogPrediction && (
        <LogPredictionDialog
          chartId={chartId}
          onClose={() => setShowLogPrediction(false)}
          onSuccess={() => { setShowLogPrediction(false); refresh() }}
        />
      )}
    </div>
  )
}
