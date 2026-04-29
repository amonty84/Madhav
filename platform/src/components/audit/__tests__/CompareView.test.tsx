import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CompareView } from '../CompareView'
import type { AuditDetailRow } from '@/lib/audit/queries'

vi.mock('@/components/citations/CitationChip', () => ({
  CitationChip: ({ id }: { id: string }) => <button type="button">{id}</button>,
}))

vi.mock('@/components/consume/ValidatorFailureView', () => ({
  ValidatorFailureView: () => <div />,
}))

const baseRow: AuditDetailRow = {
  id: 'row-1',
  query_id: 'q-000-0001',
  created_at: '2026-04-28T10:00:00Z',
  query_text: 'Query A: career',
  query_class: 'factual',
  bundle_keys: [],
  tools_called: [],
  validators_run: [{ validator_id: 'P1', passed: true, message: 'ok' }],
  synthesis_model: 'claude-opus-4-6',
  synthesis_input_tokens: 100,
  synthesis_output_tokens: 50,
  disclosure_tier: 'super_admin',
  final_output: 'Output A',
  audit_event_version: 1,
  predictions: [],
}

const rowB: AuditDetailRow = {
  ...baseRow,
  id: 'row-2',
  query_id: 'q-000-0002',
  query_text: 'Query B: wealth',
  query_class: 'interpretive_multidomain',
  disclosure_tier: 'acharya_reviewer',
  synthesis_model: 'claude-opus-4-7',
  final_output: 'Output B',
  validators_run: [{ validator_id: 'P1', passed: false, message: 'failed' }],
}

describe('CompareView', () => {
  it('renders both query IDs in column headers', () => {
    render(<CompareView rowA={baseRow} rowB={rowB} />)
    expect(screen.getByText(/q-000-0001/)).toBeInTheDocument()
    expect(screen.getByText(/q-000-0002/)).toBeInTheDocument()
  })

  it('renders both query texts', () => {
    render(<CompareView rowA={baseRow} rowB={rowB} />)
    expect(screen.getByText('Query A: career')).toBeInTheDocument()
    expect(screen.getByText('Query B: wealth')).toBeInTheDocument()
  })

  it('highlights differing query class row', () => {
    const { container } = render(<CompareView rowA={baseRow} rowB={rowB} />)
    const highlighted = container.querySelectorAll('.bg-amber-50, .ring-amber-200')
    expect(highlighted.length).toBeGreaterThan(0)
  })

  it('renders both final outputs', () => {
    render(<CompareView rowA={baseRow} rowB={rowB} />)
    expect(screen.getByText('Output A')).toBeInTheDocument()
    expect(screen.getByText('Output B')).toBeInTheDocument()
  })

  it('renders metadata comparison section', () => {
    render(<CompareView rowA={baseRow} rowB={rowB} />)
    expect(screen.getByRole('region', { name: 'Metadata comparison' })).toBeInTheDocument()
  })

  it('renders validators comparison section', () => {
    render(<CompareView rowA={baseRow} rowB={rowB} />)
    expect(screen.getByRole('region', { name: 'Validator comparison' })).toBeInTheDocument()
  })

  it('renders output comparison section', () => {
    render(<CompareView rowA={baseRow} rowB={rowB} />)
    expect(screen.getByRole('region', { name: 'Output comparison' })).toBeInTheDocument()
  })

  it('renders checkpoint comparison when payload present on either row', () => {
    const rowAWithCp: AuditDetailRow = {
      ...baseRow,
      payload: { checkpoints: { c4_5: { verdict: 'pass', confidence: 0.9, reasoning: 'ok' } } },
    }
    render(<CompareView rowA={rowAWithCp} rowB={rowB} />)
    expect(screen.getByRole('region', { name: 'Checkpoint comparison' })).toBeInTheDocument()
  })
})
