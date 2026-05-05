import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { TimingRibbon } from '@/components/trace/TimingRibbon'
import { MOCK_TRACE } from './fixtures'

describe('TimingRibbon', () => {
  it('renders the timing ribbon container', () => {
    render(
      <TimingRibbon
        trace={MOCK_TRACE}
        selectedStepId="synthesis"
        onSelectStep={vi.fn()}
      />,
    )
    expect(screen.getByTestId('timing-ribbon')).toBeInTheDocument()
  })

  it('renders gantt segments for each step', () => {
    render(
      <TimingRibbon
        trace={MOCK_TRACE}
        selectedStepId="synthesis"
        onSelectStep={vi.fn()}
      />,
    )
    expect(screen.getByTestId('gantt-segment-classify')).toBeInTheDocument()
    expect(screen.getByTestId('gantt-segment-plan')).toBeInTheDocument()
    expect(screen.getByTestId('gantt-segment-synthesis')).toBeInTheDocument()
    expect(screen.getByTestId('gantt-segment-cgm_bundle')).toBeInTheDocument()
    expect(screen.getByTestId('gantt-segment-msr_bundle')).toBeInTheDocument()
  })

  it('hovering a segment calls onSelectStep', () => {
    const onSelectStep = vi.fn()
    render(
      <TimingRibbon
        trace={MOCK_TRACE}
        selectedStepId="synthesis"
        onSelectStep={onSelectStep}
      />,
    )
    fireEvent.mouseEnter(screen.getByTestId('gantt-segment-classify'))
    expect(onSelectStep).toHaveBeenCalledWith('classify')
  })

  it('renders total cost', () => {
    render(
      <TimingRibbon
        trace={MOCK_TRACE}
        selectedStepId="synthesis"
        onSelectStep={vi.fn()}
      />,
    )
    expect(screen.getByText('$0.0042')).toBeInTheDocument()
  })

  it('shows dash placeholders for per-step costs (not available)', () => {
    render(
      <TimingRibbon
        trace={MOCK_TRACE}
        selectedStepId="synthesis"
        onSelectStep={vi.fn()}
      />,
    )
    // plan, fetch, synthesis cost cells show —
    const dashes = screen.getAllByText('—')
    expect(dashes.length).toBeGreaterThanOrEqual(3)
  })
})
