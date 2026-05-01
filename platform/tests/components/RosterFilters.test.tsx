import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { RosterFilters } from '@/components/dashboard/RosterFilters'
import { DEFAULT_FILTER } from '@/lib/roster/filter'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}))

const BASE_PROPS = {
  filters: { ...DEFAULT_FILTER },
  view: 'grid' as const,
  places: ['Bhubaneswar', 'Mumbai'],
  onFilterChange: vi.fn(),
  onViewChange: vi.fn(),
}

describe('RosterFilters', () => {
  it('renders search input', () => {
    const { getByPlaceholderText } = render(<RosterFilters {...BASE_PROPS} />)
    expect(getByPlaceholderText('Search name or place…')).toBeTruthy()
  })

  it('calls onFilterChange when search input changes', () => {
    const onFilterChange = vi.fn()
    const { getByPlaceholderText } = render(
      <RosterFilters {...BASE_PROPS} onFilterChange={onFilterChange} />
    )
    fireEvent.change(getByPlaceholderText('Search name or place…'), {
      target: { value: 'Abhisek' },
    })
    expect(onFilterChange).toHaveBeenCalledWith({ q: 'Abhisek' })
  })

  it('renders place options from props', () => {
    const { container } = render(<RosterFilters {...BASE_PROPS} />)
    const selects = container.querySelectorAll('select:not([disabled])')
    // place select and since select — both have the place values
    const options = Array.from(selects).flatMap((s) => Array.from(s.querySelectorAll('option')))
    const hasPlace = options.some((o) => o.textContent === 'Bhubaneswar')
    expect(hasPlace).toBe(true)
  })

  it('renders disabled dasha select with tooltip title', () => {
    const { container } = render(<RosterFilters {...BASE_PROPS} />)
    const dashaSelect = container.querySelector('select[disabled]')
    expect(dashaSelect).toBeTruthy()
    expect(dashaSelect?.getAttribute('title')).toContain('Phase 14C')
  })

  it('shows Grid and Table toggle buttons', () => {
    const { getByRole } = render(<RosterFilters {...BASE_PROPS} />)
    const group = getByRole('group', { name: 'View mode' })
    expect(group.textContent).toContain('grid')
    expect(group.textContent).toContain('table')
  })

  it('calls onViewChange when table toggle pressed', () => {
    const onViewChange = vi.fn()
    const { getAllByRole } = render(
      <RosterFilters {...BASE_PROPS} onViewChange={onViewChange} />
    )
    // Find the "table" button in the view group
    const buttons = getAllByRole('button').filter((b) =>
      b.textContent?.toLowerCase() === 'table'
    )
    buttons[0].click()
    expect(onViewChange).toHaveBeenCalledWith('table')
  })
})
