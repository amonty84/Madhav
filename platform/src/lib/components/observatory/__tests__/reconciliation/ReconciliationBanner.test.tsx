// USTAD_S2_6 — ReconciliationBanner UI tests.
//
// Pure-presentation tests against ReconciliationBannerView (the View accepts
// rows as a prop so the DB loader doesn't need stubbing). Covers the four
// banner cases listed in the session brief.

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import {
  ReconciliationBannerView,
  type ReconciliationBannerRow,
} from '../../reconciliation/ReconciliationBannerView'

function row(
  partial: Partial<ReconciliationBannerRow> & {
    provider: string
    status: ReconciliationBannerRow['status']
  },
): ReconciliationBannerRow {
  return {
    reconciliation_id: `rec-${partial.provider}-${partial.status}`,
    period_start: '2026-05-01',
    period_end: '2026-05-01',
    variance_pct: 0,
    computed_cost_usd: 0,
    authoritative_cost_usd: 0,
    created_at: '2026-05-03T00:00:00Z',
    ...partial,
  }
}

describe('ReconciliationBannerView', () => {
  it('renders nothing when history is empty (test 4)', () => {
    const { container } = render(<ReconciliationBannerView rows={[]} />)
    expect(container.firstChild).toBeNull()
    expect(screen.queryByTestId('reconciliation-banner')).not.toBeInTheDocument()
  })

  it("renders 'matched' chip (green) for a reconciled provider (test 5)", () => {
    render(
      <ReconciliationBannerView
        rows={[row({ provider: 'anthropic', status: 'matched', variance_pct: 0.1 })]}
      />,
    )
    const chip = screen.getByTestId('reconciliation-chip-anthropic')
    expect(chip).toBeInTheDocument()
    expect(chip).toHaveAttribute('data-status', 'matched')
    expect(chip.textContent).toMatch(/Anthropic/)
    expect(chip.textContent).toMatch(/Reconciled/)
    // Green dot present.
    expect(chip.querySelector('.bg-green-500')).not.toBeNull()
  })

  it("renders 'variance_alert' chip (red) for an alerting provider (test 6)", () => {
    render(
      <ReconciliationBannerView
        rows={[row({ provider: 'openai', status: 'variance_alert', variance_pct: 7.5 })]}
      />,
    )
    const chip = screen.getByTestId('reconciliation-chip-openai')
    expect(chip).toHaveAttribute('data-status', 'variance_alert')
    expect(chip.textContent).toMatch(/OpenAI/)
    expect(chip.textContent).toMatch(/Alert/)
    expect(chip.textContent).toMatch(/7\.5%/)
    expect(chip.querySelector('.bg-red-500')).not.toBeNull()
  })

  it("renders 'missing_authoritative' chip (grey) for a no-data provider (test 7)", () => {
    render(
      <ReconciliationBannerView
        rows={[
          row({
            provider: 'deepseek',
            status: 'missing_authoritative',
            variance_pct: null,
          }),
        ]}
      />,
    )
    const chip = screen.getByTestId('reconciliation-chip-deepseek')
    expect(chip).toHaveAttribute('data-status', 'missing_authoritative')
    expect(chip.textContent).toMatch(/DeepSeek/)
    expect(chip.textContent).toMatch(/No data/)
    expect(chip.querySelector('.bg-gray-400')).not.toBeNull()
  })

  it('deduplicates by provider (defensive — loader is the primary dedupe)', () => {
    render(
      <ReconciliationBannerView
        rows={[
          row({ provider: 'gemini', status: 'matched' }),
          row({
            provider: 'gemini',
            status: 'variance_alert',
            reconciliation_id: 'second-gemini',
          }),
        ]}
      />,
    )
    const chips = screen.getAllByTestId('reconciliation-chip-gemini')
    expect(chips).toHaveLength(1)
    // First occurrence (matched) wins.
    expect(chips[0]).toHaveAttribute('data-status', 'matched')
  })
})
