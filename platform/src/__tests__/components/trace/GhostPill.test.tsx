import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { GhostPill } from '@/components/trace/lifecycle/GhostPill'

describe('GhostPill', () => {
  it('renders label text', () => {
    render(<GhostPill label="holistic 87%" tooltip="Full chart" selected={false} />)
    expect(screen.getByText('holistic 87%')).toBeInTheDocument()
  })

  it('selected pill has gold border and text classes', () => {
    const { container } = render(
      <GhostPill label="holistic 87%" tooltip="Full chart" selected={true} />,
    )
    const pill = container.firstChild as HTMLElement
    expect(pill.className).toContain('text-[#d4af37]')
    expect(pill.className).toContain('bg-[rgba(212,175,55,0.08)]')
  })

  it('non-selected pill has zinc text and low opacity', () => {
    const { container } = render(
      <GhostPill label="temporal 9%" tooltip="Transit" selected={false} />,
    )
    const pill = container.firstChild as HTMLElement
    expect(pill.className).toContain('text-zinc-500')
    expect(pill.className).toContain('opacity-50')
  })

  it('renders tooltip via title attribute', () => {
    const { container } = render(
      <GhostPill label="test" tooltip="My tooltip text" selected={false} />,
    )
    expect((container.firstChild as HTMLElement).title).toBe('My tooltip text')
  })
})
