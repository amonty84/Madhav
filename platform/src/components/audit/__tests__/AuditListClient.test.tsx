import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuditListClient } from '../AuditListClient'
import type { AuditListResult } from '@/lib/audit/queries'

const baseRow = {
  id: 'row-id-1',
  query_id: 'qqq-000-0001',
  created_at: new Date(Date.now() - 60_000).toISOString(),
  query_text: 'What is the active mahadasha?',
  query_class: 'factual',
  bundle_keys: [],
  tools_called: [],
  validators_run: [{ passed: true, validator_id: 'P1', message: 'ok' }],
  synthesis_model: 'claude-opus-4-6',
  synthesis_input_tokens: 100,
  synthesis_output_tokens: 50,
  disclosure_tier: 'super_admin',
  final_output: 'Test answer.',
  audit_event_version: 1,
}

const initialData: AuditListResult = {
  rows: [baseRow],
  total: 1,
  page: 1,
  page_size: 25,
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

describe('AuditListClient', () => {
  it('renders the query text in the table', () => {
    render(<AuditListClient initial={initialData} />)
    expect(screen.getByText(/What is the active mahadasha\?/)).toBeInTheDocument()
  })

  it('renders column headers', () => {
    render(<AuditListClient initial={initialData} />)
    expect(screen.getByText('Class')).toBeInTheDocument()
    expect(screen.getByText('Query')).toBeInTheDocument()
    expect(screen.getByText('Tier')).toBeInTheDocument()
    expect(screen.getByText('Validators')).toBeInTheDocument()
  })

  it('shows empty state when no rows', () => {
    render(<AuditListClient initial={{ ...initialData, rows: [], total: 0 }} />)
    expect(screen.getByText('No audit rows match the current filters.')).toBeInTheDocument()
  })

  it('shows compare button on each row', () => {
    render(<AuditListClient initial={initialData} />)
    expect(screen.getByRole('button', { name: 'Add to compare' })).toBeInTheDocument()
  })

  it('marks row as selected when compare toggled', () => {
    render(<AuditListClient initial={initialData} />)
    const btn = screen.getByRole('button', { name: 'Add to compare' })
    fireEvent.click(btn)
    expect(screen.getByRole('button', { name: 'Remove from compare' })).toBeInTheDocument()
  })

  it('shows compare link when 2 rows selected', () => {
    const data: AuditListResult = {
      rows: [
        baseRow,
        { ...baseRow, id: 'row-id-2', query_id: 'qqq-000-0002', query_text: 'Second query' },
      ],
      total: 2,
      page: 1,
      page_size: 25,
    }
    render(<AuditListClient initial={data} />)
    const buttons = screen.getAllByRole('button', { name: 'Add to compare' })
    fireEvent.click(buttons[0])
    fireEvent.click(buttons[1])
    expect(screen.getByText('Open compare →')).toBeInTheDocument()
  })

  it('clears compare selection when Clear clicked', () => {
    const data: AuditListResult = {
      rows: [
        baseRow,
        { ...baseRow, id: 'row-id-2', query_id: 'qqq-000-0002', query_text: 'Second query' },
      ],
      total: 2,
      page: 1,
      page_size: 25,
    }
    render(<AuditListClient initial={data} />)
    const buttons = screen.getAllByRole('button', { name: 'Add to compare' })
    fireEvent.click(buttons[0])
    fireEvent.click(buttons[1])
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(screen.queryByText('Open compare →')).not.toBeInTheDocument()
  })

  it('fetches new rows on filter change', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ...initialData, rows: [] }),
    })
    vi.stubGlobal('fetch', mockFetch)

    render(<AuditListClient initial={initialData} />)
    // Trigger filter change via sidebar search
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'career' } })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  it('shows error state on fetch failure', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: false })
    vi.stubGlobal('fetch', mockFetch)

    render(<AuditListClient initial={initialData} />)
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'x' } })

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('does not show pagination for single-page results', () => {
    render(<AuditListClient initial={initialData} />)
    expect(screen.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument()
  })

  it('shows pagination when total > page_size', () => {
    render(<AuditListClient initial={{ ...initialData, total: 50, page_size: 25 }} />)
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()
  })

  it('link on query text navigates to detail', () => {
    render(<AuditListClient initial={initialData} />)
    const link = screen.getByRole('link', { name: /What is the active mahadasha/ })
    expect(link).toHaveAttribute('href', '/audit/qqq-000-0001')
  })
})
