'use client'

import * as React from 'react'
import {
  getEvent,
  getEvents,
  type EventsParams,
} from '@/lib/api-clients/observatory'
import type { EventDetail, EventRow } from './types'
import { StatusBadge } from './StatusBadge'
import { formatCostUsd, formatTimestamp } from './format'

type TabId = 'prompt' | 'response' | 'meta'

const TABS: { id: TabId; label: string }[] = [
  { id: 'prompt', label: 'Prompt' },
  { id: 'response', label: 'Response' },
  { id: 'meta', label: 'Meta' },
]

interface EventSidePanelProps {
  // Identifies which event to load. Changing this prop refetches.
  eventId: string | null
  // Date window forwarded to the conversation-thread fetch (the events API
  // requires from/to + the conversation_id). Provided by the page shell.
  dateRange: { from: string; to: string }
  onClose: () => void
  // Switching to a sibling event in the conversation thread re-targets the panel.
  onSelectEvent?: (id: string) => void
  // Test seams.
  fetchEvent?: typeof getEvent
  fetchEvents?: typeof getEvents
}

export function EventSidePanel({
  eventId,
  dateRange,
  onClose,
  onSelectEvent,
  fetchEvent = getEvent,
  fetchEvents = getEvents,
}: EventSidePanelProps): React.ReactElement | null {
  const [event, setEvent] = React.useState<EventDetail | null>(null)
  const [siblings, setSiblings] = React.useState<EventRow[]>([])
  const [tab, setTab] = React.useState<TabId>('prompt')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [collapsed, setCollapsed] = React.useState<{
    system_prompt: boolean
    parameters: boolean
  }>({ system_prompt: true, parameters: true })

  React.useEffect(() => {
    if (!eventId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEvent(null)
      setSiblings([])
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    setTab('prompt')
    void (async () => {
      try {
        const detail = await fetchEvent(eventId)
        if (cancelled) return
        setEvent(detail)
        const params: EventsParams = {
          from: dateRange.from,
          to: dateRange.to,
          conversation_id: detail.conversation_id,
          limit: 50,
        }
        const sibsResp = await fetchEvents(params)
        if (cancelled) return
        const ordered = [...sibsResp.events].sort((a, b) =>
          a.started_at.localeCompare(b.started_at),
        )
        setSiblings(ordered)
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Failed to load event')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [eventId, dateRange.from, dateRange.to, fetchEvent, fetchEvents])

  if (!eventId) return null

  return (
    <aside
      data-testid="event-side-panel"
      role="dialog"
      aria-label="Event details"
      className="fixed inset-y-0 right-0 z-40 flex w-full max-w-2xl flex-col border-l bg-background shadow-2xl"
    >
      <header className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex flex-col">
          <span className="text-xs uppercase text-muted-foreground">Event</span>
          <span data-testid="event-side-panel-id" className="font-mono text-sm">
            {eventId}
          </span>
        </div>
        <button
          type="button"
          data-testid="event-side-panel-close"
          onClick={onClose}
          aria-label="Close"
          className="rounded border px-2 py-1 text-sm"
        >
          ×
        </button>
      </header>

      <nav
        data-testid="event-side-panel-tabs"
        role="tablist"
        className="flex border-b text-sm"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            data-testid={`event-side-panel-tab-${t.id}`}
            onClick={() => setTab(t.id)}
            className={
              'flex-1 px-4 py-2 ' +
              (tab === t.id
                ? 'border-b-2 border-primary font-medium'
                : 'text-muted-foreground')
            }
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div
        data-testid="event-side-panel-body"
        className="flex-1 overflow-y-auto px-4 py-3 text-sm"
      >
        {loading ? (
          <div data-testid="event-side-panel-loading">Loading…</div>
        ) : error ? (
          <div data-testid="event-side-panel-error" className="text-red-600">
            {error}
          </div>
        ) : !event ? null : tab === 'prompt' ? (
          <PromptTab
            event={event}
            collapsed={collapsed}
            onToggle={(k) =>
              setCollapsed((c) => ({ ...c, [k]: !c[k] }))
            }
          />
        ) : tab === 'response' ? (
          <ResponseTab event={event} />
        ) : (
          <MetaTab event={event} />
        )}
      </div>

      <ConversationThread
        siblings={siblings}
        currentId={eventId}
        onSelect={onSelectEvent}
      />
    </aside>
  )
}

function PromptTab({
  event,
  collapsed,
  onToggle,
}: {
  event: EventDetail
  collapsed: { system_prompt: boolean; parameters: boolean }
  onToggle: (k: 'system_prompt' | 'parameters') => void
}): React.ReactElement {
  return (
    <div className="flex flex-col gap-3" data-testid="event-side-panel-prompt">
      <section>
        <div className="mb-1 text-xs uppercase text-muted-foreground">
          Prompt text
        </div>
        <pre
          data-testid="event-prompt-text"
          className="overflow-x-auto rounded border bg-muted/50 p-2 text-xs"
        >
          {event.prompt_text ?? '(no prompt text captured)'}
        </pre>
      </section>

      <Collapsible
        title="System prompt"
        testIdPrefix="event-system-prompt"
        collapsed={collapsed.system_prompt}
        onToggle={() => onToggle('system_prompt')}
      >
        <pre className="overflow-x-auto rounded border bg-muted/50 p-2 text-xs">
          {event.system_prompt ?? '(none)'}
        </pre>
      </Collapsible>

      <Collapsible
        title="Parameters"
        testIdPrefix="event-parameters"
        collapsed={collapsed.parameters}
        onToggle={() => onToggle('parameters')}
      >
        <pre className="overflow-x-auto rounded border bg-muted/50 p-2 text-xs">
          {formatJson(event.parameters)}
        </pre>
      </Collapsible>
    </div>
  )
}

function ResponseTab({ event }: { event: EventDetail }): React.ReactElement {
  return (
    <div className="flex flex-col gap-3" data-testid="event-side-panel-response">
      <div className="flex items-center gap-2">
        <StatusBadge status={event.status} />
        {event.error_code ? (
          <span data-testid="event-error-code" className="text-xs text-red-600">
            {event.error_code}
          </span>
        ) : null}
      </div>
      <section>
        <div className="mb-1 text-xs uppercase text-muted-foreground">
          Response text
        </div>
        <pre
          data-testid="event-response-text"
          className="overflow-x-auto rounded border bg-muted/50 p-2 text-xs"
        >
          {event.response_text ?? '(no response text captured)'}
        </pre>
      </section>
    </div>
  )
}

function MetaTab({ event }: { event: EventDetail }): React.ReactElement {
  return (
    <div className="flex flex-col gap-3 text-xs" data-testid="event-side-panel-meta">
      <KV label="provider_request_id" value={event.provider_request_id ?? '—'} />
      <KV label="started_at" value={formatTimestamp(event.started_at)} />
      <KV label="finished_at" value={formatTimestamp(event.finished_at)} />
      <KV label="latency_ms" value={String(event.latency_ms ?? '—')} />
      <KV label="cost_usd" value={formatCostUsd(event.computed_cost_usd)} />
      <KV label="pricing_version_id" value={event.pricing_version_id ?? '—'} />
      <section>
        <div className="mb-1 uppercase text-muted-foreground">
          feature_flag_state
        </div>
        <pre
          data-testid="event-feature-flag-state"
          className="overflow-x-auto rounded border bg-muted/50 p-2"
        >
          {formatJson(event.feature_flag_state)}
        </pre>
      </section>
      <p
        data-testid="event-raw-payload-note"
        className="rounded border border-dashed p-2 text-muted-foreground"
      >
        Raw provider payload not captured for this event (super-admin note: capture
        can be enabled in a future release).
      </p>
    </div>
  )
}

function ConversationThread({
  siblings,
  currentId,
  onSelect,
}: {
  siblings: EventRow[]
  currentId: string
  onSelect?: (id: string) => void
}): React.ReactElement {
  return (
    <footer
      data-testid="event-side-panel-thread"
      className="border-t bg-muted/30 px-4 py-2 text-xs"
    >
      <div className="mb-1 font-medium uppercase text-muted-foreground">
        Conversation thread ({siblings.length})
      </div>
      <ul className="flex max-h-48 flex-col gap-1 overflow-y-auto">
        {siblings.map((s) => {
          const active = s.event_id === currentId
          return (
            <li key={s.event_id}>
              <button
                type="button"
                data-testid={`event-thread-sibling-${s.event_id}`}
                aria-current={active ? 'true' : undefined}
                disabled={!onSelect || active}
                onClick={() => onSelect?.(s.event_id)}
                className={
                  'flex w-full items-center justify-between gap-2 rounded border px-2 py-1 text-left ' +
                  (active ? 'bg-primary/10 font-medium' : 'hover:bg-muted/60')
                }
              >
                <span className="truncate font-mono">
                  {s.provider}/{s.model}
                </span>
                <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
                  <span>{formatCostUsd(s.computed_cost_usd)}</span>
                  <span>{s.latency_ms ?? '—'}ms</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </footer>
  )
}

function Collapsible({
  title,
  testIdPrefix,
  collapsed,
  onToggle,
  children,
}: {
  title: string
  testIdPrefix: string
  collapsed: boolean
  onToggle: () => void
  children: React.ReactNode
}): React.ReactElement {
  return (
    <section>
      <button
        type="button"
        data-testid={`${testIdPrefix}-toggle`}
        onClick={onToggle}
        className="flex items-center gap-1 text-xs uppercase text-muted-foreground hover:underline"
      >
        <span aria-hidden>{collapsed ? '▶' : '▼'}</span>
        <span>{title}</span>
      </button>
      {collapsed ? null : (
        <div data-testid={`${testIdPrefix}-body`} className="mt-1">
          {children}
        </div>
      )}
    </section>
  )
}

function KV({
  label,
  value,
}: {
  label: string
  value: string
}): React.ReactElement {
  return (
    <div className="flex items-baseline gap-2">
      <span className="w-40 shrink-0 uppercase text-muted-foreground">
        {label}
      </span>
      <span className="font-mono">{value}</span>
    </div>
  )
}

function formatJson(value: unknown): string {
  if (value === null || value === undefined) return '(none)'
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}
