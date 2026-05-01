import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TierPicker } from '@/components/consume/TierPicker'

describe('TierPicker', () => {
  it('renders three buttons with labels Internal / Peer / Reading in that order', () => {
    render(<TierPicker tier="client" onChange={() => {}} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
    expect(buttons[0].textContent).toBe('Internal')
    expect(buttons[1].textContent).toBe('Peer')
    expect(buttons[2].textContent).toBe('Reading')
  })

  it("calls onChange with 'super_admin' when Internal is clicked", async () => {
    const onChange = vi.fn()
    render(<TierPicker tier="client" onChange={onChange} />)
    await userEvent.click(screen.getByText('Internal'))
    expect(onChange).toHaveBeenCalledWith('super_admin')
  })

  it("calls onChange with 'acharya_reviewer' when Peer is clicked", async () => {
    const onChange = vi.fn()
    render(<TierPicker tier="client" onChange={onChange} />)
    await userEvent.click(screen.getByText('Peer'))
    expect(onChange).toHaveBeenCalledWith('acharya_reviewer')
  })

  it("calls onChange with 'client' when Reading is clicked", async () => {
    const onChange = vi.fn()
    render(<TierPicker tier="super_admin" onChange={onChange} />)
    await userEvent.click(screen.getByText('Reading'))
    expect(onChange).toHaveBeenCalledWith('client')
  })

  it("highlights the active tier — when tier='client', Reading has the gold background", () => {
    render(<TierPicker tier="client" onChange={() => {}} />)
    const reading = screen.getByText('Reading')
    expect(reading.className).toContain('brand-gold')
  })

  it('has accessible group label', () => {
    render(<TierPicker tier="client" onChange={() => {}} />)
    expect(screen.getByRole('group', { name: /audience tier/i })).toBeDefined()
  })
})
