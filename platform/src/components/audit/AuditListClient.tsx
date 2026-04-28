'use client'

import { useState, useCallback, useTransition } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { AuditFilterSidebar } from './AuditFilterSidebar'
import {
  DisclosureTierBadge,
  QueryClassBadge,
  ValidatorStatusIcon,
  CheckpointSummaryIcon,
  PanelIndicator,
} from './AuditBadge'
import type { AuditListFilters, AuditListResult, AuditLogRowExtended } from '@/lib/audit/queries'

function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return `${diffSec}s ago`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}h ago`
  const diffDay = Math.floor(diffHour / 24)
  return `${diffDay}d ago`
}

function AuditTableRow({
  row,
  onAddToCompare,
  compareIds,
}: {
  row: AuditLogRowExtended
  onAddToCompare: (id: string) => void
  compareIds: string[]
}) {
  const truncated = row.query_text?.length > 80
    ? row.query_text.slice(0, 80) + '…'
    : (row.query_text ?? '—')

  const isInCompare = compareIds.includes(row.query_id)
  const validators = (row.validators_run as Array<{ passed: boolean }>) ?? []

  return (
    <tr className="border-b border-border hover:bg-muted/40 transition-colors group">
      <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
        {formatRelativeTime(row.created_at)}
      </td>
      <td className="px-3 py-2.5">
        <QueryClassBadge queryClass={row.query_class ?? '—'} />
      </td>
      <td className="px-3 py-2.5 max-w-xs">
        <Link
          href={`/audit/${row.query_id}`}
          className="text-sm text-foreground hover:underline block truncate"
          title={row.query_text}
        >
          {truncated}
        </Link>
      </td>
      <td className="px-3 py-2.5">
        <DisclosureTierBadge tier={row.disclosure_tier ?? '—'} />
      </td>
      <td className="px-3 py-2.5 text-center">
        <ValidatorStatusIcon validatorsRun={validators} />
      </td>
      <td className="px-3 py-2.5 text-center">
        <CheckpointSummaryIcon payload={row.payload} />
      </td>
      <td className="px-3 py-2.5 text-center">
        <PanelIndicator hasPanel={!!row.payload?.panel} />
      </td>
      <td className="px-3 py-2.5 text-xs text-muted-foreground max-w-[120px] truncate" title={row.synthesis_model}>
        {row.synthesis_model ?? '—'}
      </td>
      <td className="px-3 py-2.5">
        <button
          type="button"
          onClick={() => onAddToCompare(row.query_id)}
          disabled={!isInCompare && compareIds.length >= 2}
          aria-pressed={isInCompare}
          aria-label={isInCompare ? 'Remove from compare' : 'Add to compare'}
          className={cn(
            'rounded border px-2 py-0.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            isInCompare
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed'
          )}
        >
          {isInCompare ? 'Remove' : 'Compare'}
        </button>
      </td>
    </tr>
  )
}

function Pagination({
  page,
  total,
  pageSize,
  onPage,
}: {
  page: number
  total: number
  pageSize: number
  onPage: (p: number) => void
}) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between border-t border-border px-3 py-2 text-sm"
    >
      <span className="text-muted-foreground">
        Page {page} of {totalPages} ({total} rows)
      </span>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="rounded border border-border px-2 py-1 text-xs hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="rounded border border-border px-2 py-1 text-xs hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </nav>
  )
}

interface Props {
  initial: AuditListResult
}

export function AuditListClient({ initial }: Props) {
  const [data, setData] = useState<AuditListResult>(initial)
  const [filters, setFilters] = useState<AuditListFilters>({})
  const [page, setPage] = useState(1)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const fetchRows = useCallback(
    (nextFilters: AuditListFilters, nextPage: number) => {
      startTransition(async () => {
        try {
          const params = new URLSearchParams({
            page: String(nextPage),
            page_size: '25',
            filters: JSON.stringify(nextFilters),
          })
          const res = await fetch(`/api/audit/list?${params}`)
          if (!res.ok) throw new Error('Failed to load')
          const result = (await res.json()) as AuditListResult
          setData(result)
          setError(null)
        } catch {
          setError('Failed to load audit rows. Please try again.')
        }
      })
    },
    []
  )

  function handleFiltersChange(next: AuditListFilters) {
    setFilters(next)
    setPage(1)
    fetchRows(next, 1)
  }

  function handlePage(nextPage: number) {
    setPage(nextPage)
    fetchRows(filters, nextPage)
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((v) => v !== id)
      if (prev.length >= 2) return prev
      return [...prev, id]
    })
  }

  return (
    <div className="flex gap-6">
      <AuditFilterSidebar filters={filters} onChange={handleFiltersChange} />

      <div className="flex-1 min-w-0">
        {compareIds.length > 0 && (
          <div
            role="status"
            aria-live="polite"
            className="mb-3 flex items-center gap-3 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm"
          >
            <span className="text-muted-foreground">Comparing {compareIds.length}/2</span>
            {compareIds.length === 2 && (
              <Link
                href={`/audit/compare?ids=${compareIds.join(',')}`}
                className="rounded bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Open compare →
              </Link>
            )}
            <button
              type="button"
              onClick={() => setCompareIds([])}
              className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          </div>
        )}

        {error && (
          <div role="alert" className="mb-3 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <div
          className={cn(
            'overflow-x-auto rounded-lg border border-border bg-card',
            isPending && 'opacity-60 transition-opacity'
          )}
          aria-busy={isPending}
        >
          {data.rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <p className="text-sm">No audit rows match the current filters.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th scope="col" className="px-3 py-2 text-xs font-semibold text-muted-foreground">Time</th>
                  <th scope="col" className="px-3 py-2 text-xs font-semibold text-muted-foreground">Class</th>
                  <th scope="col" className="px-3 py-2 text-xs font-semibold text-muted-foreground">Query</th>
                  <th scope="col" className="px-3 py-2 text-xs font-semibold text-muted-foreground">Tier</th>
                  <th scope="col" className="px-3 py-2 text-xs font-semibold text-muted-foreground text-center">Validators</th>
                  <th scope="col" className="px-3 py-2 text-xs font-semibold text-muted-foreground text-center">Checkpoints</th>
                  <th scope="col" className="px-3 py-2 text-xs font-semibold text-muted-foreground text-center">Panel</th>
                  <th scope="col" className="px-3 py-2 text-xs font-semibold text-muted-foreground">Model</th>
                  <th scope="col" className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => (
                  <AuditTableRow
                    key={row.query_id}
                    row={row}
                    onAddToCompare={toggleCompare}
                    compareIds={compareIds}
                  />
                ))}
              </tbody>
            </table>
          )}
          <Pagination
            page={page}
            total={data.total}
            pageSize={data.page_size}
            onPage={handlePage}
          />
        </div>
      </div>
    </div>
  )
}
