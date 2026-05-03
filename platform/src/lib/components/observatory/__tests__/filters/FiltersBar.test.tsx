import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { FiltersBar } from '../../filters/FiltersBar'
import {
  defaultFilters,
  filtersToParams,
  parseFilters,
} from '../../filters/serialization'
import { presetToRange } from '../../filters/dateRange'
import type { ObservatoryFilters } from '../../filters/types'

const FIXED_NOW = new Date('2026-05-15T12:00:00Z')

describe('Filters serialization (URL round-trip)', () => {
  it('round-trips a fully-populated filter set: set → write → read → equals', () => {
    const original: ObservatoryFilters = {
      preset: 'custom',
      date_range: { from: '2026-04-01', to: '2026-04-30' },
      compare_to_previous: true,
      providers: ['anthropic', 'openai'],
      models: ['claude-sonnet-4-6', 'gpt-5'],
      pipeline_stages: ['classify', 'synthesize'],
      statuses: ['success', 'error'],
      search: 'cache miss',
    }
    const params = filtersToParams(original)
    const parsed = parseFilters(params)
    expect(parsed).toEqual(original)
  })

  it('30d preset computes a 30-day inclusive window ending today', () => {
    const r = presetToRange('30d', FIXED_NOW)
    expect(r.to).toBe('2026-05-15')
    expect(r.from).toBe('2026-04-16') // 29 days back inclusive
  })

  it('MTD preset starts at the 1st of the current month', () => {
    const r = presetToRange('mtd', FIXED_NOW)
    expect(r.from).toBe('2026-05-01')
    expect(r.to).toBe('2026-05-15')
  })

  it('Last month preset spans the previous calendar month', () => {
    const r = presetToRange('last_month', FIXED_NOW)
    expect(r.from).toBe('2026-04-01')
    expect(r.to).toBe('2026-04-30')
  })
})

describe('FiltersBar — Clear all', () => {
  it('Clear all resets filters to default and produces empty URL params', () => {
    const onChange = vi.fn()
    const populated: ObservatoryFilters = {
      preset: 'custom',
      date_range: { from: '2026-01-01', to: '2026-01-31' },
      compare_to_previous: true,
      providers: ['anthropic'],
      models: ['claude'],
      pipeline_stages: ['classify'],
      statuses: ['error'],
      search: 'foo',
    }
    render(
      <FiltersBar
        filters={populated}
        modelOptions={['claude', 'gpt-5']}
        onFiltersChange={onChange}
      />,
    )
    fireEvent.click(screen.getByTestId('filter-clear-all'))
    expect(onChange).toHaveBeenCalledTimes(1)
    const cleared = onChange.mock.calls[0][0] as ObservatoryFilters
    // Default preset is 30d — its serialized params are empty (preset omitted by default).
    expect(filtersToParams(cleared).toString()).toBe('')
    // Default shape matches defaultFilters() except date_range is "now"-relative; just
    // verify the structural fields.
    const def = defaultFilters()
    expect(cleared.preset).toBe(def.preset)
    expect(cleared.providers).toEqual([])
    expect(cleared.models).toEqual([])
    expect(cleared.pipeline_stages).toEqual([])
    expect(cleared.statuses).toEqual([])
    expect(cleared.search).toBe('')
    expect(cleared.compare_to_previous).toBe(false)
  })
})

describe('FiltersBar — search debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('rapid input triggers onFiltersChange once after the 400ms debounce window', () => {
    const onChange = vi.fn()
    const filters = defaultFilters()
    render(
      <FiltersBar
        filters={filters}
        modelOptions={['claude']}
        onFiltersChange={onChange}
        searchDebounceMs={400}
      />,
    )
    const input = screen.getByTestId('filter-search') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'a' } })
    fireEvent.change(input, { target: { value: 'ab' } })
    fireEvent.change(input, { target: { value: 'abc' } })
    // Mid-flight: nothing yet.
    vi.advanceTimersByTime(200)
    expect(onChange).not.toHaveBeenCalled()
    // Cross the 400ms window after the LAST change.
    vi.advanceTimersByTime(400)
    expect(onChange).toHaveBeenCalledTimes(1)
    const emitted = onChange.mock.calls[0][0] as ObservatoryFilters
    expect(emitted.search).toBe('abc')
  })
})
