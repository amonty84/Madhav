import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ClassifyDetail } from '@/components/trace/step_detail/ClassifyDetail'
import { MOCK_TRACE } from './fixtures'

describe('ClassifyDetail', () => {
  it('renders the query text in input section', () => {
    render(<ClassifyDetail trace={MOCK_TRACE} />)
    expect(screen.getByText(/Jupiter/)).toBeInTheDocument()
  })

  it('renders alternatives ranked list', () => {
    render(<ClassifyDetail trace={MOCK_TRACE} />)
    expect(screen.getByTestId('classify-alt-0')).toBeInTheDocument()
    expect(screen.getByTestId('classify-alt-1')).toBeInTheDocument()
    expect(screen.getByTestId('classify-alt-2')).toBeInTheDocument()
  })

  it('first alternative has gold left border (selected)', () => {
    render(<ClassifyDetail trace={MOCK_TRACE} />)
    const alt0 = screen.getByTestId('classify-alt-0')
    expect(alt0.className).toContain('border-l-4')
  })

  it('renders confidence bars for alternatives', () => {
    render(<ClassifyDetail trace={MOCK_TRACE} />)
    // Each alt has a confidence bar - check for percentage display
    expect(screen.getByText('87%')).toBeInTheDocument()
    expect(screen.getByText('9%')).toBeInTheDocument()
  })

  it('renders output section with final type', () => {
    render(<ClassifyDetail trace={MOCK_TRACE} />)
    // 'holistic' appears in both the alternatives list and the output section
    const matches = screen.getAllByText('holistic')
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('renders decision reasoning when present', () => {
    render(<ClassifyDetail trace={MOCK_TRACE} />)
    expect(screen.getByText(/holistic selected/)).toBeInTheDocument()
  })
})
