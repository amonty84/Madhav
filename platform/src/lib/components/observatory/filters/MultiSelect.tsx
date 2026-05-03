'use client'

import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface Props {
  testId: string
  label: string
  options: ReadonlyArray<Option>
  selected: ReadonlyArray<string>
  onChange: (next: string[]) => void
}

/** Compact multi-select rendered as a row of toggle chips. Pure presentational
 *  — keeps the FiltersBar test surface simple (no external popover library). */
export function MultiSelect({ testId, label, options, selected, onChange }: Props) {
  const set = new Set(selected)
  function toggle(value: string) {
    const next = new Set(set)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    onChange(options.map((o) => o.value).filter((v) => next.has(v)))
  }
  return (
    <div data-testid={testId} className="flex items-center gap-1.5">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <div role="group" aria-label={label} className="flex flex-wrap gap-1">
        {options.map((opt) => {
          const active = set.has(opt.value)
          return (
            <button
              type="button"
              key={opt.value}
              data-testid={`${testId}-opt-${opt.value}`}
              data-selected={active ? 'true' : 'false'}
              aria-pressed={active}
              onClick={() => toggle(opt.value)}
              className={cn(
                'rounded border px-2 py-0.5 text-xs transition-colors',
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card hover:bg-muted',
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
