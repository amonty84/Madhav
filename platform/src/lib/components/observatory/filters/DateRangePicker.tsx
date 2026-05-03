'use client'

import { cn } from '@/lib/utils'
import { presetToRange } from './dateRange'
import { DATE_RANGE_PRESETS, type DateRange, type DateRangePresetId } from './types'

interface Props {
  preset: DateRangePresetId
  range: DateRange
  onChange: (next: { preset: DateRangePresetId; range: DateRange }) => void
}

export function DateRangePicker({ preset, range, onChange }: Props) {
  function pickPreset(id: DateRangePresetId) {
    if (id === 'custom') {
      onChange({ preset: 'custom', range })
      return
    }
    onChange({ preset: id, range: presetToRange(id) })
  }

  return (
    <div data-testid="date-range-picker" className="flex flex-wrap items-center gap-1">
      <div role="group" aria-label="Date range preset" className="flex flex-wrap gap-1">
        {DATE_RANGE_PRESETS.map((p) => (
          <button
            type="button"
            key={p.id}
            data-testid={`date-preset-${p.id}`}
            data-selected={preset === p.id ? 'true' : 'false'}
            aria-pressed={preset === p.id}
            onClick={() => pickPreset(p.id)}
            className={cn(
              'rounded border px-2 py-0.5 text-xs',
              preset === p.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card hover:bg-muted',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      {preset === 'custom' ? (
        <div data-testid="date-range-custom" className="ml-1 flex items-center gap-1">
          <input
            type="date"
            aria-label="From date"
            data-testid="date-range-from"
            value={range.from}
            onChange={(e) =>
              onChange({ preset: 'custom', range: { ...range, from: e.target.value } })
            }
            className="h-7 rounded border bg-card px-2 text-xs"
          />
          <span className="text-xs text-muted-foreground">→</span>
          <input
            type="date"
            aria-label="To date"
            data-testid="date-range-to"
            value={range.to}
            onChange={(e) =>
              onChange({ preset: 'custom', range: { ...range, to: e.target.value } })
            }
            className="h-7 rounded border bg-card px-2 text-xs"
          />
        </div>
      ) : (
        <span data-testid="date-range-display" className="ml-1 text-xs text-muted-foreground">
          {range.from} → {range.to}
        </span>
      )}
    </div>
  )
}
