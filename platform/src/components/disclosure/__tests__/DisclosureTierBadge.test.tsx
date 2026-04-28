import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DisclosureTierBadge } from '../DisclosureTierBadge'
import type { AudienceTier } from '@/lib/prompts/types'

const TIERS: AudienceTier[] = ['super_admin', 'acharya_reviewer', 'client', 'public_redacted']

describe('DisclosureTierBadge', () => {
  it.each(TIERS)('renders badge for tier %s', (tier) => {
    render(<DisclosureTierBadge tier={tier} />)
    // Badge must be present with role=status
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('shows tooltip text on hover for client tier', () => {
    render(<DisclosureTierBadge tier="client" />)
    const badge = screen.getByRole('status')
    fireEvent.mouseEnter(badge)
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    expect(screen.getByRole('tooltip').textContent).toMatch(/client-safe/i)
  })

  it('hides tooltip on mouse leave', () => {
    render(<DisclosureTierBadge tier="client" />)
    const badge = screen.getByRole('status')
    fireEvent.mouseEnter(badge)
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    fireEvent.mouseLeave(badge)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('shows methodology button only for super_admin with methodologyBlock', () => {
    render(<DisclosureTierBadge tier="super_admin" methodologyBlock="synthesis_v1_0.md · single_model" />)
    expect(screen.getByRole('button', { name: /methodology/i })).toBeInTheDocument()
  })

  it('does not show methodology button for super_admin without methodologyBlock', () => {
    render(<DisclosureTierBadge tier="super_admin" />)
    expect(screen.queryByRole('button', { name: /methodology/i })).not.toBeInTheDocument()
  })

  it('expands and collapses methodology block', () => {
    render(<DisclosureTierBadge tier="super_admin" methodologyBlock="synthesis prompt: v1.0" />)
    const btn = screen.getByRole('button', { name: /methodology/i })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('region', { name: /methodology disclosure/i })).toBeInTheDocument()
    expect(screen.getByText('synthesis prompt: v1.0')).toBeInTheDocument()
    fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('region', { name: /methodology disclosure/i })).not.toBeInTheDocument()
  })

  it('does not show methodology button for non-super_admin tiers', () => {
    render(<DisclosureTierBadge tier="acharya_reviewer" methodologyBlock="some block" />)
    expect(screen.queryByRole('button', { name: /methodology/i })).not.toBeInTheDocument()
  })
})
