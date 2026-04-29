import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { DashaCountdown } from '@/components/profile/DashaCountdown'

describe('DashaCountdown', () => {
  const FIXED_NOW = new Date('2026-04-30T12:00:00Z').getTime()

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(FIXED_NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the MD and AD labels', () => {
    const { getByText } = render(
      <DashaCountdown md="Mercury" ad="Saturn" adEnd="2027-08-21" />,
    )
    expect(getByText(/Mercury MD · Saturn AD/i)).toBeTruthy()
  })

  it('shows a remaining time string', () => {
    const { container } = render(
      <DashaCountdown md="Mercury" ad="Saturn" adEnd="2027-08-21" />,
    )
    const text = container.textContent ?? ''
    // Should show years/months/days remaining (boundary 2027-08-21 is ~15 months away)
    expect(text).toMatch(/\d+[ymd]/)
  })

  it('shows boundary date', () => {
    const { container } = render(
      <DashaCountdown md="Mercury" ad="Saturn" adEnd="2027-08-21" />,
    )
    expect(container.textContent).toContain('2027-08-21')
  })

  it('shows transition imminent when boundary is in the past', () => {
    const { container } = render(
      <DashaCountdown md="Mercury" ad="Jupiter" adEnd="2024-12-12" />,
    )
    expect(container.textContent).toContain('transition imminent')
  })

  it('renders Vimshottari Dasha label', () => {
    const { getByText } = render(
      <DashaCountdown md="Mercury" ad="Saturn" adEnd="2027-08-21" />,
    )
    expect(getByText(/Vimshottari Dasha/i)).toBeTruthy()
  })
})
