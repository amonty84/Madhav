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
        className="h-8 w-full max-w-xs bg-[rgba(8,6,3,0.7)] border border-[rgba(212,175,55,0.2)] text-[#fce29a] placeholder:text-[#6a5830] rounded-md px-3 text-sm focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20"
      />

      {/* Birth place */}
      <select
        value={filters.place}
        onChange={(e) => onFilterChange({ place: e.target.value })}
        className="h-8 bg-[rgba(8,6,3,0.7)] border border-[rgba(212,175,55,0.2)] text-[#fce29a] placeholder:text-[#6a5830] rounded-md px-3 text-sm focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20"
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
        className="h-8 bg-[rgba(8,6,3,0.7)] border border-[rgba(212,175,55,0.2)] text-[#fce29a] placeholder:text-[#6a5830] rounded-md px-3 text-sm focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 opacity-40 cursor-not-allowed"
      >
        <option>Current dasha</option>
      </select>

      {/* Build % max slider */}
      <label className="flex items-center gap-2 text-[rgba(212,175,55,0.45)] text-sm">
        <span className="whitespace-nowrap">Build ≤ {filters.buildMax}%</span>
        <input
          type="range"
          min={0}
          max={100}
          step={10}
          value={filters.buildMax}
          onChange={handleBuildRangeChange}
          className="w-20 accent-[#d4af37]"
        />
      </label>

      {/* Last activity */}
      <select
        value={filters.since}
        onChange={(e) => onFilterChange({ since: e.target.value })}
        className="h-8 bg-[rgba(8,6,3,0.7)] border border-[rgba(212,175,55,0.2)] text-[#fce29a] placeholder:text-[#6a5830] rounded-md px-3 text-sm focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20"
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
        className="flex h-8 items-center rounded-[8px] border border-[rgba(212,175,55,0.2)] bg-[rgba(8,6,3,0.6)] p-[3px] text-sm"
      >
        {(['grid', 'table'] as ViewMode[]).map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            aria-pressed={view === v}
            className={`inline-flex h-[calc(100%-1px)] items-center justify-center px-3 transition-colors ${
              view === v
                ? 'rounded-[5px] bg-gradient-to-b from-[#3a2c10] to-[#241a07] font-medium uppercase tracking-[0.06em] text-[#fce29a] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.25)]'
                : 'rounded-[5px] font-medium uppercase tracking-[0.06em] text-[rgba(212,175,55,0.35)] hover:text-[#fce29a]'
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
