import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuditDetailView } from '../AuditDetailView'
import type { AuditDetailRow } from '@/lib/audit/queries'

vi.mock('@/components/citations/CitationChip', () => ({
  CitationChip: ({ type, id }: { type: string; id: string }) => (
    <button type="button" aria-label={`Citation: ${type} ${id}`}>{id}</button>
  ),
}))

vi.mock('@/components/consume/ValidatorFailureView', () => ({
  ValidatorFailureView: ({ failures }: { failures: Array<{ validator_id: string }> }) => (
    <div role="alert" data-testid="validator-failure-view">
      {failures.map((f) => <span key={f.validator_id}>{f.validator_id}</span>)}
    </div>
  ),
}))

const baseRow: AuditDetailRow = {
  id: 'row-1',
  query_id: 'q-abc-123',
  created_at: '2026-04-28T10:00:00Z',
  query_text: 'What is the active mahadasha?',
  query_class: 'factual',
  bundle_keys: ['signal:SIG.MSR.042', 'chunk:rag-001'],
  tools_called: [{ tool: 'retrieve', params_hash: 'abc123', latency_ms: 120, cached: false }],
  validators_run: [{ validator_id: 'P1', passed: true, message: 'ok' }],
  synthesis_model: 'claude-opus-4-6',
  synthesis_input_tokens: 200,
  synthesis_output_tokens: 80,
  disclosure_tier: 'super_admin',
  final_output: 'Moon mahadasha is active until 2028.',
  audit_event_version: 1,
  predictions: [],
}

describe('AuditDetailView — section rendering', () => {
  it('renders query text in header section', () => {
    render(<AuditDetailView row={baseRow} />)
    expect(screen.getByText('What is the active mahadasha?')).toBeInTheDocument()
  })

  it('renders synthesis model in header', () => {
    render(<AuditDetailView row={baseRow} />)
    expect(screen.getByText('claude-opus-4-6')).toBeInTheDocument()
  })

  it('renders bundle keys as citation chips', () => {
    render(<AuditDetailView row={baseRow} />)
    expect(screen.getByLabelText('Citation: signal SIG.MSR.042')).toBeInTheDocument()
    expect(screen.getByLabelText('Citation: chunk rag-001')).toBeInTheDocument()
  })

  it('renders tools called list', () => {
    render(<AuditDetailView row={baseRow} />)
    expect(screen.getByText('retrieve')).toBeInTheDocument()
    expect(screen.getByText('120ms')).toBeInTheDocument()
  })

  it('renders passing validators without failure view', () => {
    render(<AuditDetailView row={baseRow} />)
    expect(screen.queryByTestId('validator-failure-view')).not.toBeInTheDocument()
    expect(screen.getByText('P1')).toBeInTheDocument()
  })

  it('renders ValidatorFailureView for failed validators', () => {
    const row: AuditDetailRow = {
      ...baseRow,
      validators_run: [{ validator_id: 'P2', passed: false, message: 'citation missing' }],
    }
    render(<AuditDetailView row={row} />)
    expect(screen.getByTestId('validator-failure-view')).toBeInTheDocument()
  })

  it('renders final output', () => {
    render(<AuditDetailView row={baseRow} />)
    expect(screen.getByText('Moon mahadasha is active until 2028.')).toBeInTheDocument()
  })

  it('renders raw payload collapsible', () => {
    render(<AuditDetailView row={baseRow} />)
    expect(screen.getByText('Show JSON')).toBeInTheDocument()
  })

  it('expands raw payload on click', () => {
    render(<AuditDetailView row={baseRow} />)
    fireEvent.click(screen.getByText('Show JSON'))
    expect(screen.getByText(/q-abc-123/)).toBeInTheDocument()
  })

  it('gracefully renders without checkpoint payload', () => {
    render(<AuditDetailView row={{ ...baseRow, payload: null }} />)
    expect(screen.queryByText('Checkpoints')).not.toBeInTheDocument()
  })

  it('gracefully renders without panel payload', () => {
    render(<AuditDetailView row={{ ...baseRow, payload: null }} />)
    expect(screen.queryByText('Panel Mode')).not.toBeInTheDocument()
  })

  it('renders checkpoints section when payload present', () => {
    const row: AuditDetailRow = {
      ...baseRow,
      payload: {
        checkpoints: {
          c4_5: { verdict: 'warn', confidence: 0.7, reasoning: 'Ambiguous layer boundary.' },
        },
      },
    }
    render(<AuditDetailView row={row} />)
    expect(screen.getByText('Checkpoints')).toBeInTheDocument()
    expect(screen.getByText('warn')).toBeInTheDocument()
  })

  it('renders panel section when payload present', () => {
    const row: AuditDetailRow = {
      ...baseRow,
      payload: {
        panel: {
          adjudicator_answer: 'Final synthesis answer.',
          members: [
            { label: 'Member A', answer: 'Answer A', alignment: 'agree' },
          ],
          divergence_class: 'low',
        },
      },
    }
    render(<AuditDetailView row={row} />)
    expect(screen.getByText('Panel Mode')).toBeInTheDocument()
    expect(screen.getByText('Final synthesis answer.')).toBeInTheDocument()
  })

  it('renders linked predictions when present', () => {
    const row: AuditDetailRow = {
      ...baseRow,
      predictions: [
        {
          id: 'pred-1',
          prediction_text: 'Career pivot likely by 2027.',
          confidence: 0.72,
          horizon_start: '2026-01-01',
          horizon_end: '2027-12-31',
          falsifier: 'No career change by end of 2027.',
          outcome: null,
          outcome_observed_at: null,
          calibration_bucket: null,
        },
      ],
    }
    render(<AuditDetailView row={row} />)
    expect(screen.getByText('Career pivot likely by 2027.')).toBeInTheDocument()
  })
})
