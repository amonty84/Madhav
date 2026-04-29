'use client'

import { useCallback } from 'react'
import type { FilterState } from '@/lib/roster/types'

export type ViewMode = 'grid' | 'table'

interface RosterFiltersProps {
  filters: FilterState
  view: ViewMode
  places: string[]
  onFilterChange: (next: Partial<FilterState>) => void
  onViewChange: (view: ViewMode) => void
}

export function RosterFilters({
  filters,
  view,
  places,
  onFilterChange,
  onViewChange,
}: RosterFiltersProps) {
  const handleBuildRangeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFilterChange({ buildMax: parseInt(e.target.value, 10) })
    },
    [onFilterChange]
  )

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <input
        value={filters.q}
        onChange={(e) => onFilterChange({ q: e.target.value })}
        placeholder="Search name or place…"
        className="h-8 w-full max-w-xs rounded-md border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />

      {/* Birth place */}
      <select
        value={filters.place}
        onChange={(e) => onFilterChange({ place: e.target.value })}
        className="h-8 rounded-md border border-border bg-background px-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">All places</option>
        {places.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {/* Dasha — disabled until Phase 14C */}
      <select
        disabled
        title="Dasha data available after Phase 14C"
        className="h-8 cursor-not-allowed rounded-md border border-border bg-background px-2 text-sm text-muted-foreground opacity-50 focus:outline-none"
      >
        <option>Current dasha</option>
      </select>

      {/* Build % max slider */}
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="whitespace-nowrap">Build ≤ {filters.buildMax}%</span>
        <input
          type="range"
          min={0}
          max={100}
          step={10}
          value={filters.buildMax}
          onChange={handleBuildRangeChange}
          className="w-20 accent-primary"
        />
      </label>

      {/* Last activity */}
      <select
        value={filters.since}
        onChange={(e) => onFilterChange({ since: e.target.value })}
        className="h-8 rounded-md border border-border bg-background px-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">Any activity</option>
        <option value={sinceDate(7)}>Last 7 days</option>
        <option value={sinceDate(30)}>Last 30 days</option>
        <option value={sinceDate(90)}>Last 90 days</option>
      </select>

      {/* Spacer */}
      <span className="flex-1" />

      {/* Grid / Table toggle */}
      <div
        role="group"
        aria-label="View mode"
        className="inline-flex h-8 items-center rounded-lg bg-muted p-[3px] text-sm"
      >
        {(['grid', 'table'] as ViewMode[]).map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            aria-pressed={view === v}
            className={`inline-flex h-[calc(100%-1px)] items-center justify-center rounded-md border px-3 text-sm font-medium capitalize transition-all ${
              view === v
                ? 'border-transparent bg-background text-foreground shadow-sm'
                : 'border-transparent text-foreground/60 hover:text-foreground'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}

function sinceDate(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().slice(0, 10)
}
