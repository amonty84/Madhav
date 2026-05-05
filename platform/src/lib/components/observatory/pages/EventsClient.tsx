'use client'

import * as React from 'react'
import { EventTable } from '../events/EventTable'
import { EventSidePanel } from '../events/EventSidePanel'
import type { EventRow } from '../events/types'
import { FiltersBar } from '../filters/FiltersBar'
import { useObservatoryFilters } from '../filters/useObservatoryFilters'
import {
  dateOnlyToFromIso,
  dateOnlyToToIso,
} from './filterAdapter'
import type { EventsParams } from '@/lib/api-clients/observatory'
import { cn } from '@/lib/utils'

const PAGE_LIMIT = 50

type GroupedRow = {
  conversation_id: string | null
  call_count: string
  total_cost_usd: string | null
  total_input_tokens: string | null
  total_output_tokens: string | null
  started_at: string | null
  finished_at: string | null
  stages: string[]
}

export function EventsClient(): React.ReactElement {
  const { filters, setFilters } = useObservatoryFilters()
  const [selectedEventId, setSelectedEventId] = React.useState<string | null>(null)
  const [groupByQuery, setGroupByQuery] = React.useState(false)
  const [groupedRows, setGroupedRows] = React.useState<GroupedRow[]>([])
  const [groupedLoading, setGroupedLoading] = React.useState(false)

  const fetchParams: EventsParams = React.useMemo(
    () => ({
      from: dateOnlyToFromIso(filters.date_range.from),
      to: dateOnlyToToIso(filters.date_range.to),
      provider: filters.providers.length > 0 ? filters.providers : undefined,
      model: filters.models.length > 0 ? filters.models : undefined,
      pipeline_stage:
        filters.pipeline_stages.length > 0 ? filters.pipeline_stages : undefined,
      status: filters.statuses[0],
      search: filters.search || undefined,
      limit: PAGE_LIMIT,
    }),
    [filters],
  )

  React.useEffect(() => {
    if (!groupByQuery) return
    setGroupedLoading(true)
    const params = new URLSearchParams({ from: fetchParams.from, to: fetchParams.to, groupByQuery: 'true' })
    fetch(`/api/admin/observatory/events?${params.toString()}`)
      .then((r) => r.json())
      .then((data: { type: string; rows: GroupedRow[] }) => {
        if (data.type === 'grouped') setGroupedRows(data.rows)
      })
      .catch(() => setGroupedRows([]))
      .finally(() => setGroupedLoading(false))
  }, [groupByQuery, fetchParams.from, fetchParams.to])

  // Re-key the EventTable on filter change so it remounts and refetches from
  // page 1 (the table holds its own paging state internally).
  const tableKey = React.useMemo(
    () =>
      JSON.stringify([
        fetchParams.from,
        fetchParams.to,
        fetchParams.provider,
        fetchParams.model,
        fetchParams.pipeline_stage,
        fetchParams.status,
        fetchParams.search,
      ]),
    [fetchParams],
  )

  const handleRowClick = React.useCallback((row: EventRow) => {
    setSelectedEventId(row.event_id)
  }, [])

  return (
    <div data-testid="observatory-events" className="flex flex-col gap-4">
      <FiltersBar
        filters={filters}
        modelOptions={[]}
        onFiltersChange={setFilters}
      />
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[rgba(212,175,55,0.45)]">
          LLM Call Events
        </h2>
        <button
          type="button"
          onClick={() => setGroupByQuery(g => !g)}
          className={cn(
            'rounded border px-3 py-1 text-xs font-medium transition-colors',
            groupByQuery
              ? 'border-[rgba(212,175,55,0.4)] bg-[rgba(212,175,55,0.12)] text-[#d4af37]'
              : 'border-border bg-card text-muted-foreground hover:text-foreground',
          )}
        >
          {groupByQuery ? 'Grouped by query' : 'Group by query'}
        </button>
      </div>
      {groupByQuery ? (
        groupedLoading ? (
          <p className="text-xs text-muted-foreground">Loading grouped data…</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Query ID</th>
                <th className="pb-2 pr-4 font-medium">Calls</th>
                <th className="pb-2 pr-4 font-medium">Total Cost</th>
                <th className="pb-2 pr-4 font-medium">Tokens (in / out)</th>
                <th className="pb-2 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {groupedRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    No grouped data in range
                  </td>
                </tr>
              ) : (
                groupedRows.map((row, i) => (
                  <tr key={row.conversation_id ?? i} className="border-b border-border/40">
                    <td className="py-1.5 pr-4 font-mono text-[10px] text-muted-foreground">
                      {row.conversation_id ?? '—'}
                    </td>
                    <td className="py-1.5 pr-4">{row.call_count}</td>
                    <td className="py-1.5 pr-4">
                      {row.total_cost_usd != null
                        ? `$${Number(row.total_cost_usd).toFixed(6)}`
                        : '—'}
                    </td>
                    <td className="py-1.5 pr-4">
                      {row.total_input_tokens ?? '—'} / {row.total_output_tokens ?? '—'}
                    </td>
                    <td className="py-1.5">
                      {row.started_at ? new Date(row.started_at).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )
      ) : (
        <EventTable
          key={tableKey}
          fetchParams={fetchParams}
          onRowClick={handleRowClick}
        />
      )}
      <EventSidePanel
        eventId={selectedEventId}
        dateRange={{ from: fetchParams.from, to: fetchParams.to }}
        onClose={() => setSelectedEventId(null)}
        onSelectEvent={(id) => setSelectedEventId(id)}
      />
    </div>
  )
}
