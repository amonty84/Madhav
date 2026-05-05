import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { LifecycleGraph } from '@/components/trace/LifecycleGraph'
import { MOCK_TRACE } from './fixtures'

describe('LifecycleGraph', () => {
  it('renders all step node types', () => {
    render(
      <LifecycleGraph
        trace={MOCK_TRACE}
        selectedStepId="synthesis"
        onSelectStep={vi.fn()}
      />,
    )
    expect(screen.getByTestId('node-classify')).toBeInTheDocument()
    expect(screen.getByTestId('node-plan')).toBeInTheDocument()
    expect(screen.getByTestId('node-context-assembly')).toBeInTheDocument()
    expect(screen.getByTestId('node-synthesis')).toBeInTheDocument()
  })

  it('renders fetch nodes for each fetch in trace', () => {
    render(
      <LifecycleGraph
        trace={MOCK_TRACE}
        selectedStepId="synthesis"
        onSelectStep={vi.fn()}
      />,
    )
    expect(screen.getByTestId('node-fetch-cgm_bundle')).toBeInTheDocument()
    expect(screen.getByTestId('node-fetch-msr_bundle')).toBeInTheDocument()
  })

  it('selected node has gold ring class', () => {
    render(
      <LifecycleGraph
        trace={MOCK_TRACE}
        selectedStepId="classify"
        onSelectStep={vi.fn()}
      />,
    )
    const classifyNode = screen.getByTestId('node-classify')
    expect(classifyNode.className).toContain('ring-2')
  })

  it('non-selected node does not have ring', () => {
    render(
      <LifecycleGraph
        trace={MOCK_TRACE}
        selectedStepId="classify"
        onSelectStep={vi.fn()}
      />,
    )
    const planNode = screen.getByTestId('node-plan')
    expect(planNode.className).not.toContain('ring-2')
  })

  it('clicking a node calls onSelectStep with correct id', () => {
    const onSelectStep = vi.fn()
    render(
      <LifecycleGraph
        trace={MOCK_TRACE}
        selectedStepId="synthesis"
        onSelectStep={onSelectStep}
      />,
    )
    fireEvent.click(screen.getByTestId('node-classify'))
    expect(onSelectStep).toHaveBeenCalledWith('classify')
  })

  it('clicking plan node calls onSelectStep with plan', () => {
    const onSelectStep = vi.fn()
    render(
      <LifecycleGraph
        trace={MOCK_TRACE}
        selectedStepId="synthesis"
        onSelectStep={onSelectStep}
      />,
    )
    fireEvent.click(screen.getByTestId('node-plan'))
    expect(onSelectStep).toHaveBeenCalledWith('plan')
  })

  it('clicking fetch node calls onSelectStep with bundle name', () => {
    const onSelectStep = vi.fn()
    render(
      <LifecycleGraph
        trace={MOCK_TRACE}
        selectedStepId="synthesis"
        onSelectStep={onSelectStep}
      />,
    )
    fireEvent.click(screen.getByTestId('node-fetch-cgm_bundle'))
    expect(onSelectStep).toHaveBeenCalledWith('cgm_bundle')
  })
})
