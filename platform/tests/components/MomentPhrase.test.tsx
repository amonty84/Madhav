import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MomentPhrase, composeMomentPhrase } from '@/components/dashboard/MomentPhrase'

describe('composeMomentPhrase', () => {
  it('returns dasha and activity when both present', () => {
    const phrase = composeMomentPhrase({
      currentDasha: 'Saturn–Jupiter',
      lastLayerActivity: new Date(Date.now() - 4 * 86400_000).toISOString(),
      pyramidPercent: 60,
    })
    expect(phrase).toContain('Saturn–Jupiter')
    expect(phrase).toContain('last updated')
  })

  it('returns "build not started" when pyramidPercent is 0 and no activity', () => {
    const phrase = composeMomentPhrase({
      pyramidPercent: 0,
      lastLayerActivity: null,
    })
    expect(phrase).toBe('build not started')
  })

  it('returns null when no dasha, no activity, and percent > 0', () => {
    const phrase = composeMomentPhrase({
      pyramidPercent: 50,
      lastLayerActivity: null,
    })
    expect(phrase).toBeNull()
  })

  it('renders only activity when dasha absent', () => {
    const phrase = composeMomentPhrase({
      pyramidPercent: 50,
      lastLayerActivity: new Date(Date.now() - 2 * 86400_000).toISOString(),
    })
    expect(phrase).toContain('last updated')
    expect(phrase).not.toContain('·')
  })
})

describe('MomentPhrase component', () => {
  it('renders nothing when phrase is null', () => {
    const { container } = render(
      <MomentPhrase pyramidPercent={50} lastLayerActivity={null} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders phrase text when data available', () => {
    const { getByText } = render(
      <MomentPhrase
        pyramidPercent={0}
        lastLayerActivity={null}
      />
    )
    expect(getByText('build not started')).toBeTruthy()
  })
})
