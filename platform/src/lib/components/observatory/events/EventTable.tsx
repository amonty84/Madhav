'use client'

import * as React from 'react'
import { getEvents, type EventsParams } from '@/lib/api-clients/observatory'
import {
  ALL_EVENT_COLUMNS,
  COLUMN_LABELS,
  DEFAULT_VISIBLE_COLUMNS,
  type EventColumnId,
  type EventRow,
  type SortableColumnId,
  type SortState,
} from './types'
import { getCellValue } from './format'
import { StatusBadge } from './StatusBadge'
import { VirtualList } from './VirtualList'
import { useColumnVisibility } from './useColumnVisibility'

const ROW_HEIGHT = 40
const SORTABLE: ReadonlySet<EventColumnId> = new Set([
  'timestamp',
  'cost_usd',
  'latency_ms',
])

interface EventTableProps {
  // The fetch params (date range + filters from S1.10) drive the initial load.
  // Re-running the table against a new range is a remount via React `key`.
  fetchParams: EventsParams
  onRowClick?: (event: EventRow) => void
  // Test seams — production code calls getEvents() directly.
  fetcher?: typeof getEvents
  rowHeight?: number
  viewportHeight?: number
  // Optional initial data so tests + SSR shells can hydrate without network.
  initialData?: {
    events: EventRow[]
    next_cursor: string | null
    total_count: number
  }
}

export function EventTable({
  fetchParams,
  onRowClick,
  fetcher = getEvents,
  rowHeight = ROW_HEIGHT,
  viewportHeight = 480,
  initialData,
}: EventTableProps): React.ReactElement {
  const [rows, setRows] = React.useState<EventRow[]>(initialData?.events ?? [])
  const [cursor, setCursor] = React.useState<string | null>(
    initialData?.next_cursor ?? null,
  )
  const [totalCount, setTotalCount] = React.useState<number>(
    initialData?.total_count ?? 0,
  )
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [sort, setSort] = React.useState<SortState>({
    column: 'timestamp',
    direction: 'desc',
  })
  const [showColumnPanel, setShowColumnPanel] = React.useState(false)
  const { visible, isVisible, toggle, reset } = useColumnVisibility()

  const visibleColumns = React.useMemo<EventColumnId[]>(
    () => ALL_EVENT_COLUMNS.filter((c) => visible.includes(c)),
    [visible],
  )

  const loadPage = React.useCallback(
    async (nextCursor: string | null) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetcher({ ...fetchParams, cursor: nextCursor ?? undefined })
        setRows((prev) =>
          nextCursor === null ? res.events : [...prev, ...res.events],
        )
        setCursor(res.next_cursor)
        setTotalCount(res.total_count)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load events')
      } finally {
        setLoading(false)
      }
    },
    [fetcher, fetchParams],
  )

  React.useEffect(() => {
    if (initialData) return
    // Initial-mount sync from props → state; same pattern as ChatShell etc.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadPage(null)
  }, [initialData, loadPage])

  const sortedRows = React.useMemo(() => {
    const copy = [...rows]
    copy.sort((a, b) => {
      const dir = sort.direction === 'asc' ? 1 : -1
      switch (sort.column) {
        case 'timestamp':
          return dir * a.started_at.localeCompare(b.started_at)
        case 'cost_usd':
          return (
            dir *
            ((a.computed_cost_usd ?? 0) - (b.computed_cost_usd ?? 0))
          )
        case 'latency_ms':
          return dir * ((a.latency_ms ?? 0) - (b.latency_ms ?? 0))
      }
    })
    return copy
  }, [rows, sort])

  const handleSort = (col: EventColumnId) => {
    if (!SORTABLE.has(col)) return
    const c = col as SortableColumnId
    setSort((prev) =>
      prev.column === c
        ? { column: c, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { column: c, direction: 'desc' },
    )
  }

  const renderCell = (row: EventRow, col: EventColumnId): React.ReactNode => {
    if (col === 'status') return <StatusBadge status={row.status} />
    return (
      <span className="truncate" title={getCellValue(row, col)}>
        {getCellValue(row, col)}
      </span>
    )
  }

  return (
    <div data-testid="event-table" className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span data-testid="event-table-count">
          Showing {rows.length} of {totalCount}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid="event-table-columns-toggle"
            onClick={() => setShowColumnPanel((s) => !s)}
            className="rounded border px-2 py-1 text-xs"
          >
            Columns
          </button>
        </div>
      </div>

      {showColumnPanel ? (
        <div
          data-testid="event-table-columns-panel"
          className="rounded border bg-background p-3 text-xs"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium">Visible columns</span>
            <button
              type="button"
              data-testid="event-table-columns-reset"
              onClick={reset}
              className="rounded border px-2 py-0.5"
            >
              Reset columns
            </button>
          </div>
          <ul className="grid grid-cols-2 gap-1">
            {ALL_EVENT_COLUMNS.map((col) => (
              <li key={col}>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    data-testid={`event-table-column-checkbox-${col}`}
                    checked={isVisible(col)}
                    onChange={() => toggle(col)}
                  />
                  <span>{COLUMN_LABELS[col]}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div
        data-testid="event-table-header"
        className="grid grid-flow-col items-center gap-2 rounded-t border-b bg-muted px-2 py-1 text-xs font-medium uppercase"
        style={{
          gridTemplateColumns: `repeat(${visibleColumns.length}, minmax(0, 1fr))`,
        }}
      >
        {visibleColumns.map((col) => {
          const sortable = SORTABLE.has(col)
          const isSorted = sort.column === col
          return (
            <button
              key={col}
              type="button"
              data-testid={`event-table-header-${col}`}
              data-sorted={isSorted ? sort.direction : 'none'}
              disabled={!sortable}
              onClick={() => handleSort(col)}
              className={
                'flex items-center gap-1 text-left ' +
                (sortable ? 'cursor-pointer hover:underline' : 'cursor-default')
              }
            >
              <span>{COLUMN_LABELS[col]}</span>
              {sortable && isSorted ? (
                <span aria-hidden>{sort.direction === 'asc' ? '↑' : '↓'}</span>
              ) : null}
            </button>
          )
        })}
      </div>

      <VirtualList
        items={sortedRows}
        rowHeight={rowHeight}
        viewportHeight={viewportHeight}
        testId="event-table-virtual"
        renderRow={(row) => (
          <button
            type="button"
            data-testid={`event-row-${row.event_id}`}
            data-event-id={row.event_id}
            onClick={() => onRowClick?.(row)}
            className="grid w-full grid-flow-col items-center gap-2 border-b px-2 text-left text-xs hover:bg-muted/50"
            style={{
              gridTemplateColumns: `repeat(${visibleColumns.length}, minmax(0, 1fr))`,
              height: rowHeight,
            }}
          >
            {visibleColumns.map((col) => (
              <div key={col} className="overflow-hidden">
                {renderCell(row, col)}
              </div>
            ))}
          </button>
        )}
      />

      <div className="flex items-center justify-between text-xs">
        {error ? (
          <span data-testid="event-table-error" className="text-red-600">
            {error}
          </span>
        ) : (
          <span />
        )}
        <button
          type="button"
          data-testid="event-table-load-more"
          disabled={loading || cursor === null}
          onClick={() => void loadPage(cursor)}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          {loading ? 'Loading…' : cursor === null ? 'No more' : 'Load more'}
        </button>
      </div>
    </div>
  )
}

// Re-export defaults so tests can rely on a stable surface.
export { DEFAULT_VISIBLE_COLUMNS, ALL_EVENT_COLUMNS }
