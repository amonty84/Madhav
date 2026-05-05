import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SynthesisDetail } from '@/components/trace/step_detail/SynthesisDetail'
import { MOCK_TRACE } from './fixtures'
import type { TraceDocument } from '@/lib/admin/trace_assembler'

describe('SynthesisDetail', () => {
  it('renders quality scorecard rows', () => {
    render(<SynthesisDetail trace={MOCK_TRACE} />)
    expect(screen.getByText('Composite score')).toBeInTheDocument()
    expect(screen.getByText('Citation density')).toBeInTheDocument()
    expect(screen.getByText('Failures')).toBeInTheDocument()
  })

  it('renders composite_score value', () => {
    render(<SynthesisDetail trace={MOCK_TRACE} />)
    expect(screen.getByText('0.820')).toBeInTheDocument()
  })

  it('renders model name in input section', () => {
    render(<SynthesisDetail trace={MOCK_TRACE} />)
    expect(screen.getByText('claude-sonnet-4-6')).toBeInTheDocument()
  })

  it('renders token counts', () => {
    render(<SynthesisDetail trace={MOCK_TRACE} />)
    // token counts appear in both the decision section and scorecard table
    expect(screen.getAllByText('1500').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('420').length).toBeGreaterThanOrEqual(1)
  })

  it('renders no scorecard message when scorecard is null', () => {
    const traceNoScorecard: TraceDocument = {
      ...MOCK_TRACE,
      synthesis: { ...MOCK_TRACE.synthesis!, scorecard: null },
    }
    render(<SynthesisDetail trace={traceNoScorecard} />)
    expect(screen.getByText('No scorecard data')).toBeInTheDocument()
  })
})
