'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { AuditListFilters } from '@/lib/audit/queries'

const QUERY_CLASSES = [
  'interpretive_multidomain',
  'interpretive_single',
  'factual',
  'timing',
  'meta',
]
const DISCLOSURE_TIERS = ['super_admin', 'acharya_reviewer', 'client', 'public_redacted']

interface Props {
  filters: AuditListFilters
  onChange: (f: AuditListFilters) => void
  className?: string
}

function MultiSelect({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string
  options: string[]
  selected: string[]
  onToggle: (v: string) => void
}) {
  return (
    <fieldset className="space-y-1">
      <legend className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
        {label}
      </legend>
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => onToggle(opt)}
            className="rounded border-border accent-primary"
          />
          <span className="text-sm text-foreground/80">{opt}</span>
        </label>
      ))}
    </fieldset>
  )
}

export function AuditFilterSidebar({ filters, onChange, className }: Props) {
  const [search, setSearch] = useState(filters.search ?? '')

  function toggleMulti(key: 'query_class' | 'disclosure_tier', value: string) {
    const current = (filters[key] as string[] | undefined) ?? []
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onChange({ ...filters, [key]: next.length ? next : undefined })
  }

  function handleSearch(val: string) {
    setSearch(val)
    onChange({ ...filters, search: val || undefined })
  }

  function handleDateChange(key: 'date_from' | 'date_to', val: string) {
    onChange({ ...filters, [key]: val || undefined })
  }

  function handleRadio(key: keyof AuditListFilters, val: string | undefined) {
    onChange({ ...filters, [key]: val })
  }

  function clearAll() {
    setSearch('')
    onChange({})
  }

  return (
    <aside
      aria-label="Audit filters"
      className={cn(
        'w-56 shrink-0 space-y-5 rounded-lg border border-border bg-card p-4 text-sm',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground">Filters</span>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear all filters"
        >
          Clear all
        </button>
      </div>

      {/* Free-text search */}
      <div className="space-y-1">
        <label htmlFor="audit-search" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Search
        </label>
        <input
          id="audit-search"
          type="search"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Query text…"
          className={cn(
            'w-full rounded border border-border bg-background px-2 py-1 text-sm',
            'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
          )}
        />
      </div>

      {/* Date range */}
      <div className="space-y-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date range</span>
        <input
          type="date"
          value={filters.date_from ?? ''}
          onChange={(e) => handleDateChange('date_from', e.target.value)}
          aria-label="From date"
          className="w-full rounded border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          type="date"
          value={filters.date_to ?? ''}
          onChange={(e) => handleDateChange('date_to', e.target.value)}
          aria-label="To date"
          className="w-full rounded border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <MultiSelect
        label="Query class"
        options={QUERY_CLASSES}
        selected={filters.query_class ?? []}
        onToggle={(v) => toggleMulti('query_class', v)}
      />

      <MultiSelect
        label="Disclosure tier"
        options={DISCLOSURE_TIERS}
        selected={filters.disclosure_tier ?? []}
        onToggle={(v) => toggleMulti('disclosure_tier', v)}
      />

      {/* Validator status */}
      <fieldset className="space-y-1">
        <legend className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          Validator status
        </legend>
        {(['passed_all', 'any_failed', 'halted'] as const).map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="validator_status"
              checked={(filters.validator_status ?? '') === opt}
              onChange={() => handleRadio('validator_status', opt)}
              className="accent-primary"
            />
            <span className="text-sm text-foreground/80 capitalize">{opt.replace('_', ' ')}</span>
          </label>
        ))}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="validator_status"
            checked={!filters.validator_status}
            onChange={() => handleRadio('validator_status', undefined)}
            className="accent-primary"
          />
          <span className="text-sm text-foreground/80">Any</span>
        </label>
      </fieldset>

      {/* Checkpoint status */}
      <fieldset className="space-y-1">
        <legend className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          Checkpoint status
        </legend>
        {(['none', 'warn', 'halt'] as const).map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="checkpoint_status"
              checked={(filters.checkpoint_status ?? '') === opt}
              onChange={() => handleRadio('checkpoint_status', opt)}
              className="accent-primary"
            />
            <span className="text-sm text-foreground/80 capitalize">{opt}</span>
          </label>
        ))}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="checkpoint_status"
            checked={!filters.checkpoint_status}
            onChange={() => handleRadio('checkpoint_status', undefined)}
            className="accent-primary"
          />
          <span className="text-sm text-foreground/80">Any</span>
        </label>
      </fieldset>

      {/* Panel mode */}
      <fieldset className="space-y-1">
        <legend className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          Panel mode
        </legend>
        {(['any', 'panel_only', 'single_only'] as const).map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="panel_mode"
              checked={(filters.panel_mode ?? 'any') === opt}
              onChange={() => handleRadio('panel_mode', opt === 'any' ? undefined : opt)}
              className="accent-primary"
            />
            <span className="text-sm text-foreground/80 capitalize">{opt.replace('_', ' ')}</span>
          </label>
        ))}
      </fieldset>
    </aside>
  )
}
