import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { RoomCard } from '@/components/profile/RoomCard'

describe('RoomCard', () => {
  it('renders title', () => {
    const { getByText } = render(
      <RoomCard title="Build Room" cta={{ label: 'Go', href: '/build' }} />,
    )
    expect(getByText('Build Room')).toBeTruthy()
  })

  it('renders description when provided', () => {
    const { getByText } = render(
      <RoomCard
        title="Consume Room"
        description="Query the chart"
        cta={{ label: 'Ask', href: '/consume' }}
      />,
    )
    expect(getByText('Query the chart')).toBeTruthy()
  })

  it('renders enabled CTA as a link', () => {
    const { container } = render(
      <RoomCard title="Build" cta={{ label: 'Continue', href: '/build' }} />,
    )
    const link = container.querySelector('a')
    expect(link).toBeTruthy()
    expect(link?.getAttribute('href')).toBe('/build')
    expect(link?.textContent).toContain('Continue')
  })

  it('renders disabled CTA as a span with no href', () => {
    const { container } = render(
      <RoomCard
        title="Timeline"
        cta={{ label: 'Coming soon', href: '#', disabled: true, tooltip: 'R5 scope' }}
      />,
    )
    const link = container.querySelector('a')
    expect(link).toBeNull()
    const span = container.querySelector('span.cursor-not-allowed')
    expect(span).toBeTruthy()
    expect(span?.textContent).toContain('Coming soon')
  })

  it('shows tooltip on disabled CTA', () => {
    const { container } = render(
      <RoomCard
        title="Timeline"
        cta={{ label: 'Coming soon', href: '#', disabled: true, tooltip: 'R5 scope' }}
      />,
    )
    const span = container.querySelector('[title]')
    expect(span?.getAttribute('title')).toBe('R5 scope')
  })

  it('renders children', () => {
    const { getByText } = render(
      <RoomCard title="Room" cta={{ label: 'Go', href: '/' }}>
        <p>Child content</p>
      </RoomCard>,
    )
    expect(getByText('Child content')).toBeTruthy()
  })
})
