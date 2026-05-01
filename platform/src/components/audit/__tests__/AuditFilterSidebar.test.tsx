import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuditFilterSidebar } from '../AuditFilterSidebar'
import type { AuditListFilters } from '@/lib/audit/queries'

describe('AuditFilterSidebar', () => {
  it('renders filter panel with all sections', () => {
    render(<AuditFilterSidebar filters={{}} onChange={vi.fn()} />)
    expect(screen.getByRole('complementary', { name: 'Audit filters' })).toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('calls onChange with search term on input', () => {
    const onChange = vi.fn()
    render(<AuditFilterSidebar filters={{}} onChange={onChange} />)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'career' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ search: 'career' }))
  })

  it('clears search to undefined when input emptied', () => {
    const onChange = vi.fn()
    render(<AuditFilterSidebar filters={{ search: 'test' }} onChange={onChange} />)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ search: undefined }))
  })

  it('toggles query_class checkbox and propagates', () => {
    const onChange = vi.fn()
    render(<AuditFilterSidebar filters={{}} onChange={onChange} />)
    const checkbox = screen.getByRole('checkbox', { name: /factual/i })
    fireEvent.click(checkbox)
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ query_class: ['factual'] }))
  })

  it('removes query_class when unchecked', () => {
    const onChange = vi.fn()
    const filters: AuditListFilters = { query_class: ['factual'] }
    render(<AuditFilterSidebar filters={filters} onChange={onChange} />)
    const checkbox = screen.getByRole('checkbox', { name: /factual/i })
    fireEvent.click(checkbox)
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ query_class: undefined }))
  })

  it('toggles disclosure_tier checkbox', () => {
    const onChange = vi.fn()
    render(<AuditFilterSidebar filters={{}} onChange={onChange} />)
    const checkbox = screen.getByRole('checkbox', { name: /super_admin/i })
    fireEvent.click(checkbox)
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ disclosure_tier: ['super_admin'] }))
  })

  it('sets date_from on date input', () => {
    const onChange = vi.fn()
    render(<AuditFilterSidebar filters={{}} onChange={onChange} />)
    fireEvent.change(screen.getByLabelText('From date'), { target: { value: '2026-01-01' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ date_from: '2026-01-01' }))
  })

  it('sets date_to on date input', () => {
    const onChange = vi.fn()
    render(<AuditFilterSidebar filters={{}} onChange={onChange} />)
    fireEvent.change(screen.getByLabelText('To date'), { target: { value: '2026-03-31' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ date_to: '2026-03-31' }))
  })

  it('sets validator_status radio', () => {
    const onChange = vi.fn()
    render(<AuditFilterSidebar filters={{}} onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio', { name: /passed all/i }))
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ validator_status: 'passed_all' }))
  })

  it('clears all filters on Clear all', () => {
    const onChange = vi.fn()
    const filters: AuditListFilters = { query_class: ['factual'], search: 'test' }
    render(<AuditFilterSidebar filters={filters} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Clear all filters' }))
    expect(onChange).toHaveBeenCalledWith({})
  })

  it('sets panel_mode radio to panel_only', () => {
    const onChange = vi.fn()
    render(<AuditFilterSidebar filters={{}} onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio', { name: /panel only/i }))
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ panel_mode: 'panel_only' }))
  })

  it('sets checkpoint_status radio to halt', () => {
    const onChange = vi.fn()
    render(<AuditFilterSidebar filters={{}} onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio', { name: /^halt$/i }))
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ checkpoint_status: 'halt' }))
  })
})
