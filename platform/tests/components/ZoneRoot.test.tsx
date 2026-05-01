import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ZoneRoot } from '@/components/shared/ZoneRoot'

describe('ZoneRoot', () => {
  it('applies zone-vellum class for vellum zone', () => {
    const { container } = render(<ZoneRoot zone="vellum"><span>child</span></ZoneRoot>)
    expect(container.firstElementChild?.className).toContain('zone-vellum')
  })

  it('applies zone-ink and dark class for ink zone', () => {
    const { container } = render(<ZoneRoot zone="ink"><span>child</span></ZoneRoot>)
    const el = container.firstElementChild!
    expect(el.className).toContain('zone-ink')
    expect(el.className).toContain('dark')
  })

  it('applies zone-bridge class for bridge zone', () => {
    const { container } = render(<ZoneRoot zone="bridge"><span>child</span></ZoneRoot>)
    expect(container.firstElementChild?.className).toContain('zone-bridge')
  })

  it('renders children', () => {
    const { getByText } = render(<ZoneRoot zone="vellum"><span>hello</span></ZoneRoot>)
    expect(getByText('hello')).toBeTruthy()
  })

  it('merges extra className', () => {
    const { container } = render(<ZoneRoot zone="vellum" className="extra-class"><span /></ZoneRoot>)
    expect(container.firstElementChild?.className).toContain('extra-class')
  })

  it('passes style prop', () => {
    const { container } = render(
      <ZoneRoot zone="ink" style={{ display: 'contents' }}><span /></ZoneRoot>
    )
    expect((container.firstElementChild as HTMLElement).style.display).toBe('contents')
  })
})
