'use client'

import { useEffect, useRef, useState } from 'react'
import { DateRangePicker } from './DateRangePicker'
import { MultiSelect } from './MultiSelect'
import { defaultFilters } from './serialization'
import {
  PIPELINE_STAGE_OPTIONS,
  PROVIDER_OPTIONS,
  STATUS_OPTIONS,
  type ObservatoryFilters,
} from './types'

export interface FiltersBarProps {
  filters: ObservatoryFilters
  /** Distinct model values from /breakdowns (parent passes; we don't fetch). */
  modelOptions: ReadonlyArray<string>
  onFiltersChange: (next: ObservatoryFilters) => void
  /** Debounce in ms for the free-text search; defaults to 400. */
  searchDebounceMs?: number
}

const PROVIDER_OPTS = PROVIDER_OPTIONS.map((v) => ({ value: v, label: v }))
const STAGE_OPTS = PIPELINE_STAGE_OPTIONS.map((v) => ({ value: v, label: v }))
const STATUS_OPTS = STATUS_OPTIONS.map((v) => ({ value: v, label: v }))

export function FiltersBar({
  filters,
  modelOptions,
  onFiltersChange,
  searchDebounceMs = 400,
}: FiltersBarProps) {
  const [searchDraft, setSearchDraft] = useState(filters.search)
  const lastEmittedSearch = useRef(filters.search)

  useEffect(() => {
    if (filters.search !== lastEmittedSearch.current) {
      setSearchDraft(filters.search)
      lastEmittedSearch.current = filters.search
    }
  }, [filters.search])

  useEffect(() => {
    if (searchDraft === lastEmittedSearch.current) return
    const t = setTimeout(() => {
      lastEmittedSearch.current = searchDraft
      onFiltersChange({ ...filters, search: searchDraft })
    }, searchDebounceMs)
    return () => clearTimeout(t)
    // we deliberately depend on `searchDraft` only; emitting on filter changes
    // would echo every URL update back through this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft, searchDebounceMs])

  const modelOpts = modelOptions.map((v) => ({ value: v, label: v }))

  return (
    <div
      data-testid="observatory-filters-bar"
      className="flex flex-wrap items-center gap-3 rounded-md border bg-card p-3"
    >
      <DateRangePicker
        preset={filters.preset}
        range={filters.date_range}
        onChange={({ preset, range }) =>
          onFiltersChange({ ...filters, preset, date_range: range })
        }
      />

      <label className="flex items-center gap-1.5 text-xs">
        <input
          type="checkbox"
          data-testid="filter-compare-toggle"
          checked={filters.compare_to_previous}
          onChange={(e) =>
            onFiltersChange({ ...filters, compare_to_previous: e.target.checked })
          }
        />
        <span>Compare to previous</span>
      </label>

      <MultiSelect
        testId="filter-providers"
        label="Provider"
        options={PROVIDER_OPTS}
        selected={filters.providers}
        onChange={(providers) =>
          onFiltersChange({ ...filters, providers: providers as ObservatoryFilters['providers'] })
        }
      />

      <MultiSelect
        testId="filter-models"
        label="Model"
        options={modelOpts}
        selected={filters.models}
        onChange={(models) => onFiltersChange({ ...filters, models })}
      />

      <MultiSelect
        testId="filter-stages"
        label="Stage"
        options={STAGE_OPTS}
        selected={filters.pipeline_stages}
        onChange={(stages) =>
          onFiltersChange({
            ...filters,
            pipeline_stages: stages as ObservatoryFilters['pipeline_stages'],
          })
        }
      />

      <MultiSelect
        testId="filter-statuses"
        label="Status"
        options={STATUS_OPTS}
        selected={filters.statuses}
        onChange={(statuses) =>
          onFiltersChange({
            ...filters,
            statuses: statuses as ObservatoryFilters['statuses'],
          })
        }
      />

      <input
        type="search"
        data-testid="filter-search"
        placeholder="Search prompt / response…"
        value={searchDraft}
        onChange={(e) => setSearchDraft(e.target.value)}
        className="h-7 w-48 rounded border bg-card px-2 text-xs"
      />

      <button
        type="button"
        data-testid="filter-clear-all"
        onClick={() => {
          const cleared = defaultFilters()
          setSearchDraft('')
          lastEmittedSearch.current = ''
          onFiltersChange(cleared)
        }}
        className="ml-auto rounded border px-2 py-0.5 text-xs hover:bg-muted"
      >
        Clear all
      </button>
    </div>
  )
}
