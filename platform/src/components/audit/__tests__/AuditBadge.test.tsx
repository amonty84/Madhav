import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  DisclosureTierBadge,
  QueryClassBadge,
  ValidatorStatusIcon,
  CheckpointSummaryIcon,
  PanelIndicator,
} from '../AuditBadge'

describe('DisclosureTierBadge', () => {
  it('renders super_admin tier', () => {
    render(<DisclosureTierBadge tier="super_admin" />)
    expect(screen.getByText('super_admin')).toBeInTheDocument()
  })

  it('renders client tier', () => {
    render(<DisclosureTierBadge tier="client" />)
    expect(screen.getByText('client')).toBeInTheDocument()
  })

  it('renders unknown tier without throwing', () => {
    render(<DisclosureTierBadge tier="unknown_tier" />)
    expect(screen.getByText('unknown_tier')).toBeInTheDocument()
  })
})

describe('QueryClassBadge', () => {
  it('renders factual class', () => {
    render(<QueryClassBadge queryClass="factual" />)
    expect(screen.getByText('factual')).toBeInTheDocument()
  })

  it('renders interpretive_multidomain class', () => {
    render(<QueryClassBadge queryClass="interpretive_multidomain" />)
    expect(screen.getByText('interpretive_multidomain')).toBeInTheDocument()
  })
})

describe('ValidatorStatusIcon', () => {
  it('shows pass icon when all validators passed', () => {
    render(<ValidatorStatusIcon validatorsRun={[{ passed: true }, { passed: true }]} />)
    expect(screen.getByLabelText('All validators passed')).toBeInTheDocument()
  })

  it('shows fail icon when any validator failed', () => {
    render(<ValidatorStatusIcon validatorsRun={[{ passed: true }, { passed: false }]} />)
    expect(screen.getByLabelText('Some validators failed')).toBeInTheDocument()
  })

  it('shows dash when no validators', () => {
    render(<ValidatorStatusIcon validatorsRun={[]} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })
})

describe('CheckpointSummaryIcon', () => {
  it('renders dash when no payload', () => {
    render(<CheckpointSummaryIcon payload={null} />)
    expect(screen.getByLabelText('No checkpoints')).toBeInTheDocument()
  })

  it('renders halt when any checkpoint halted', () => {
    render(<CheckpointSummaryIcon payload={{ checkpoints: { c4_5: { verdict: 'halt' } } }} />)
    expect(screen.getByLabelText('Checkpoint halt')).toBeInTheDocument()
  })

  it('renders warn when any checkpoint warned (no halt)', () => {
    render(<CheckpointSummaryIcon payload={{ checkpoints: { c4_5: { verdict: 'warn' } } }} />)
    expect(screen.getByLabelText('Checkpoint warn')).toBeInTheDocument()
  })

  it('renders pass when all checkpoints passed', () => {
    render(<CheckpointSummaryIcon payload={{ checkpoints: { c4_5: { verdict: 'pass' } } }} />)
    expect(screen.getByLabelText('Checkpoints passed')).toBeInTheDocument()
  })
})

describe('PanelIndicator', () => {
  it('shows dash for single mode', () => {
    render(<PanelIndicator hasPanel={false} />)
    expect(screen.getByLabelText('Single mode')).toBeInTheDocument()
  })

  it('shows panel label for panel mode', () => {
    render(<PanelIndicator hasPanel={true} />)
    expect(screen.getByLabelText('Panel mode')).toBeInTheDocument()
  })
})
