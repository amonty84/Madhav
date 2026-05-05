import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ContextAssemblyDetail } from '@/components/trace/step_detail/ContextAssemblyDetail'
import { MOCK_TRACE } from './fixtures'
import type { TraceDocument } from '@/lib/admin/trace_assembler'

describe('ContextAssemblyDetail', () => {
  it('renders INCLUDED items with emerald badge', () => {
    render(<ContextAssemblyDetail trace={MOCK_TRACE} />)
    const included = screen.getAllByTestId('context-item-included')
    expect(included.length).toBeGreaterThan(0)
    included.forEach(el => {
      expect(el.textContent).toContain('INCLUDED')
    })
  })

  it('renders TRUNCATED items with amber text', () => {
    render(<ContextAssemblyDetail trace={MOCK_TRACE} />)
    const truncated = screen.getAllByTestId('context-item-truncated')
    expect(truncated.length).toBeGreaterThan(0)
    truncated.forEach(el => {
      expect(el.textContent).toContain('TRUNCATED')
    })
  })

  it('renders DROPPED items', () => {
    render(<ContextAssemblyDetail trace={MOCK_TRACE} />)
    const dropped = screen.getAllByTestId('context-item-dropped')
    expect(dropped.length).toBeGreaterThan(0)
    dropped.forEach(el => {
      expect(el.textContent).toContain('DROPPED')
    })
  })

  it('expanding a DROPPED item shows drop_reason', () => {
    render(<ContextAssemblyDetail trace={MOCK_TRACE} />)
    const dropped = screen.getAllByTestId('context-item-dropped')[0]
    fireEvent.click(dropped)
    expect(screen.getByText(/LOW_RELEVANCE/)).toBeInTheDocument()
  })

  it('renders token ledger table', () => {
    render(<ContextAssemblyDetail trace={MOCK_TRACE} />)
    expect(screen.getByText('Total tokens')).toBeInTheDocument()
    expect(screen.getByText('Budget')).toBeInTheDocument()
    expect(screen.getByText('Dropped count')).toBeInTheDocument()
  })

  it('renders no-data message when context_assembly is null', () => {
    const traceNoCA: TraceDocument = { ...MOCK_TRACE, context_assembly: null }
    render(<ContextAssemblyDetail trace={traceNoCA} />)
    expect(screen.getByTestId('context-assembly-detail')).toHaveTextContent('No context assembly data')
  })
})
