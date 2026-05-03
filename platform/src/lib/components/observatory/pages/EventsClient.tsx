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

const PAGE_LIMIT = 50

export function EventsClient(): React.ReactElement {
  const { filters, setFilters } = useObservatoryFilters()
  const [selectedEventId, setSelectedEventId] = React.useState<string | null>(null)

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
      <EventTable
        key={tableKey}
        fetchParams={fetchParams}
        onRowClick={handleRowClick}
      />
      <EventSidePanel
        eventId={selectedEventId}
        dateRange={{ from: fetchParams.from, to: fetchParams.to }}
        onClose={() => setSelectedEventId(null)}
        onSelectEvent={(id) => setSelectedEventId(id)}
      />
    </div>
  )
}
