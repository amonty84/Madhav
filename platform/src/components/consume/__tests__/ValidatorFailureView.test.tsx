import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ValidatorFailureView } from '../ValidatorFailureView'
import type { ValidatorFailure } from '@/lib/ui/validator-error'

const P1: ValidatorFailure = {
  validator_id: 'p1_layer_separation',
  validator_version: '1.0',
  vote: 'fail',
  reason: 'L1 facts mixed into L2 interpretive layer',
}

const P2: ValidatorFailure = {
  validator_id: 'p2_citation',
  validator_version: '1.0',
  vote: 'fail',
  reason: 'Claim lacks source citation',
  affected_claims: ['career peak in 2027'],
}

const P5: ValidatorFailure = {
  validator_id: 'p5_signal_id_resolution',
  validator_version: '1.0',
  vote: 'fail',
}

describe('ValidatorFailureView', () => {
  it('renders with role=alert', () => {
    render(<ValidatorFailureView failures={[P1]} onRetry={vi.fn()} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders single failure with human-readable name', () => {
    render(<ValidatorFailureView failures={[P1]} onRetry={vi.fn()} />)
    expect(screen.getByText('Layer Separation')).toBeInTheDocument()
    expect(screen.getByText(/l1 facts mixed/i)).toBeInTheDocument()
  })

  it('renders multiple failures', () => {
    render(<ValidatorFailureView failures={[P1, P2, P5]} onRetry={vi.fn()} />)
    expect(screen.getByText('Layer Separation')).toBeInTheDocument()
    expect(screen.getByText('Citation Integrity')).toBeInTheDocument()
    expect(screen.getByText('Signal ID Resolution')).toBeInTheDocument()
  })

  it('expands technical detail for a failure', () => {
    render(<ValidatorFailureView failures={[P2]} onRetry={vi.fn()} />)
    const btn = screen.getByRole('button', { name: /show technical detail for citation integrity/i })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/p2_citation/)).toBeInTheDocument()
  })

  it('collapses technical detail on second click', () => {
    render(<ValidatorFailureView failures={[P1]} onRetry={vi.fn()} />)
    const btn = screen.getByRole('button', { name: /show technical detail for layer separation/i })
    fireEvent.click(btn)
    expect(screen.getByText(/p1_layer_separation/)).toBeInTheDocument()
    fireEvent.click(btn)
    expect(screen.queryByText(/p1_layer_separation/)).not.toBeInTheDocument()
  })

  it('calls onRetry when "Edit and retry" button is clicked', () => {
    const onRetry = vi.fn()
    render(<ValidatorFailureView failures={[P1]} onRetry={onRetry} />)
    fireEvent.click(screen.getByRole('button', { name: /edit and retry/i }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('"Edit and retry" button is keyboard accessible with visible text', () => {
    render(<ValidatorFailureView failures={[P5]} onRetry={vi.fn()} />)
    const btn = screen.getByRole('button', { name: /edit and retry/i })
    expect(btn).toBeInTheDocument()
  })

  it('renders EPISTEMIC HALT kicker', () => {
    render(<ValidatorFailureView failures={[P1]} onRetry={vi.fn()} />)
    expect(screen.getByText('EPISTEMIC HALT')).toBeInTheDocument()
  })
})
