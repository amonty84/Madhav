import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { QueryHeaderStrip } from '@/components/trace/QueryHeaderStrip'
import { MOCK_TRACE, DEGRADED_TRACE, FAILED_TRACE } from './fixtures'
import type { TraceDocument } from '@/lib/admin/trace_assembler'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}))

const UNKNOWN_TRACE: TraceDocument = {
  ...MOCK_TRACE,
  query: { ...MOCK_TRACE.query, health: 'UNKNOWN' },
}

describe('QueryHeaderStrip', () => {
  it('renders HEALTHY health badge', () => {
    render(<QueryHeaderStrip trace={MOCK_TRACE} />)
    expect(screen.getByTestId('health-badge-HEALTHY')).toBeInTheDocument()
    expect(screen.getByTestId('health-badge-HEALTHY')).toHaveTextContent('HEALTHY')
  })

  it('renders DEGRADED health badge', () => {
    render(<QueryHeaderStrip trace={DEGRADED_TRACE} />)
    expect(screen.getByTestId('health-badge-DEGRADED')).toBeInTheDocument()
  })

  it('renders FAILED health badge', () => {
    render(<QueryHeaderStrip trace={FAILED_TRACE} />)
    expect(screen.getByTestId('health-badge-FAILED')).toBeInTheDocument()
  })

  it('renders UNKNOWN health badge', () => {
    render(<QueryHeaderStrip trace={UNKNOWN_TRACE} />)
    expect(screen.getByTestId('health-badge-UNKNOWN')).toBeInTheDocument()
  })

  it('truncates query text at 80 chars', () => {
    const longTrace = {
      ...MOCK_TRACE,
      query: { ...MOCK_TRACE.query, text: 'A'.repeat(100) },
    }
    render(<QueryHeaderStrip trace={longTrace} />)
    expect(screen.getByText(/A{80}…/)).toBeInTheDocument()
  })

  it('renders close button', () => {
    render(<QueryHeaderStrip trace={MOCK_TRACE} />)
    expect(screen.getByTestId('trace-close-btn')).toBeInTheDocument()
  })

  it('renders query strip container', () => {
    render(<QueryHeaderStrip trace={MOCK_TRACE} />)
    expect(screen.getByTestId('query-header-strip')).toBeInTheDocument()
  })
})
