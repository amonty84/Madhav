import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { KpiTilesRow } from '../../kpi/KpiTilesRow'
import type { SummaryResponse } from '@/lib/observatory/types'

const BASE_SUMMARY: SummaryResponse = {
  total_cost_usd: 1234.56,
  total_requests: 500,
  total_input_tokens: 800_000,
  total_output_tokens: 350_000,
  total_cache_tokens: 50_000,
  avg_cost_per_request: 2.469,
  p50_latency_ms: 320,
  p95_latency_ms: 1150,
  reconciliation_variance_pct: 1.42,
  reconciliation_through_date: '2026-05-02',
}

describe('KpiTilesRow', () => {
  it('renders all 6 tiles in success state with formatted values', () => {
    render(<KpiTilesRow summary={BASE_SUMMARY} />)

    expect(screen.getByTestId('kpi-cost-value').textContent).toBe('$1,234.56')
    expect(screen.getByTestId('kpi-requests-value').textContent).toBe('500')
    expect(screen.getByTestId('kpi-tokens-value').textContent).toBe('1.2M')
    expect(screen.getByTestId('kpi-avg-cost-value').textContent).toBe('$2.47')
    expect(screen.getByTestId('kpi-latency-p50').textContent).toBe('320ms')
    expect(screen.getByTestId('kpi-latency-p95').textContent).toBe('1150ms')
    expect(screen.getByTestId('kpi-variance-value').textContent).toBe('1.42%')
    // Hover tooltip carries reconciliation_through_date.
    expect(screen.getByTestId('kpi-variance').getAttribute('title')).toContain('2026-05-02')
  })

  it('shows skeletons for every tile when loading=true', () => {
    render(<KpiTilesRow loading />)
    for (const id of [
      'kpi-cost',
      'kpi-requests',
      'kpi-tokens',
      'kpi-avg-cost',
      'kpi-latency',
      'kpi-variance',
    ]) {
      expect(screen.getByTestId(`${id}-skeleton`)).toBeInTheDocument()
    }
  })

  it('shows error state with retry button when error=true', () => {
    const onRetry = vi.fn()
    render(<KpiTilesRow error onRetry={onRetry} />)
    expect(screen.getByTestId('kpi-cost-error')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('kpi-cost-retry'))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('cost decrease → green; cost increase → red', () => {
    // Cost down: previous=1500, current=1200 → delta=-300 → green ("good")
    const downSummary: SummaryResponse = {
      ...BASE_SUMMARY,
      total_cost_usd: 1200,
      total_cost_usd_delta: -300,
    }
    const { rerender } = render(<KpiTilesRow summary={downSummary} />)
    let delta = screen.getByTestId('kpi-cost-delta')
    expect(delta.getAttribute('data-tone')).toBe('good')
    expect(delta.textContent).toContain('↓')

    // Cost up: previous=1000, current=1300 → delta=+300 → red ("bad")
    const upSummary: SummaryResponse = {
      ...BASE_SUMMARY,
      total_cost_usd: 1300,
      total_cost_usd_delta: 300,
    }
    rerender(<KpiTilesRow summary={upSummary} />)
    delta = screen.getByTestId('kpi-cost-delta')
    expect(delta.getAttribute('data-tone')).toBe('bad')
    expect(delta.textContent).toContain('↑')
  })
})
