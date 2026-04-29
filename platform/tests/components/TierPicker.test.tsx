import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TierPicker } from '@/components/consume/TierPicker'
import type { AudienceTier } from '@/lib/prompts/types'

describe('TierPicker', () => {
  it('renders three tier buttons', () => {
    render(<TierPicker tier="client" onChange={() => {}} />)
    expect(screen.getByText('Client')).toBeDefined()
    expect(screen.getByText('Admin')).toBeDefined()
    expect(screen.getByText('Super')).toBeDefined()
  })

  it('highlights the active tier', () => {
    render(<TierPicker tier="super_admin" onChange={() => {}} />)
    const superBtn = screen.getByText('Super')
    expect(superBtn.className).toContain('brand-gold')
  })

  it('calls onChange with the correct tier value', async () => {
    const onChange = vi.fn()
    render(<TierPicker tier="client" onChange={onChange} />)
    await userEvent.click(screen.getByText('Admin'))
    expect(onChange).toHaveBeenCalledWith('admin')
  })

  it('calls onChange with super_admin when Super clicked', async () => {
    const onChange = vi.fn()
    render(<TierPicker tier="client" onChange={onChange} />)
    await userEvent.click(screen.getByText('Super'))
    expect(onChange).toHaveBeenCalledWith('super_admin')
  })

  it('has accessible group label', () => {
    render(<TierPicker tier="client" onChange={() => {}} />)
    expect(screen.getByRole('group', { name: /audience tier/i })).toBeDefined()
  })
})
