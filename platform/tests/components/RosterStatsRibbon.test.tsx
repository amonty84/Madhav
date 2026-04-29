import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { RosterStatsRibbon } from '@/components/dashboard/RosterStatsRibbon'

describe('RosterStatsRibbon', () => {
  it('renders all three core metric segments', () => {
    const { getByText } = render(
      <RosterStatsRibbon total={5} inActiveBuild={2} consumedToday={3} predictionsOverdue={0} />
    )
    expect(getByText('5')).toBeTruthy()
    expect(getByText('charts')).toBeTruthy()
    expect(getByText('2')).toBeTruthy()
    expect(getByText('in active build')).toBeTruthy()
    expect(getByText('3')).toBeTruthy()
    expect(getByText('consumed today')).toBeTruthy()
  })

  it('hides predictions segment when predictionsOverdue is 0', () => {
    const { queryByText } = render(
      <RosterStatsRibbon total={5} inActiveBuild={0} consumedToday={0} predictionsOverdue={0} />
    )
    expect(queryByText('predictions overdue')).toBeNull()
  })

  it('shows predictions segment when predictionsOverdue > 0', () => {
    const { getByText } = render(
      <RosterStatsRibbon total={5} inActiveBuild={0} consumedToday={0} predictionsOverdue={4} />
    )
    expect(getByText('predictions overdue')).toBeTruthy()
    expect(getByText('4')).toBeTruthy()
  })

  it('calls onFilterShortcut when a clickable metric is pressed', () => {
    const onFilterShortcut = vi.fn()
    const { getAllByRole } = render(
      <RosterStatsRibbon
        total={5}
        inActiveBuild={2}
        consumedToday={0}
        predictionsOverdue={0}
        onFilterShortcut={onFilterShortcut}
      />
    )
    const buttons = getAllByRole('button')
    buttons[0].click()
    expect(onFilterShortcut).toHaveBeenCalledWith('buildMax', '99')
  })
})
