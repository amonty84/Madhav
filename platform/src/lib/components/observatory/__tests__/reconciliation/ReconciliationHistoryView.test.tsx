// USTAD_S2_6 — ReconciliationHistoryView tests.
//
// Pure-presentation tests for the history-page view. The page-level data
// fetch lives in app/(super-admin)/observatory/reconciliation/page.tsx and
// is exercised at e2e level (out of scope for this unit suite).

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { ReconciliationHistoryView } from '../../reconciliation/ReconciliationHistoryView'
import type { ReconciliationHistoryRow } from '@/lib/observatory/reconciliation/types'

function buildRow(
  partial: Partial<ReconciliationHistoryRow> & {
    reconciliation_id: string
    provider: string
    status: ReconciliationHistoryRow['status']
  },
): ReconciliationHistoryRow {
  return {
    period_start: '2026-05-01',
    period_end: '2026-05-01',
    variance_pct: 1.2,
    computed_cost_usd: 9.8765,
    authoritative_cost_usd: 10.0,
    created_at: '2026-05-03T01:23:45Z',
    ...partial,
  }
}

describe('ReconciliationHistoryView', () => {
  it('renders the empty-state message when rows=[] (test 8)', () => {
    render(
      <ReconciliationHistoryView selectedProvider={null} rows={[]} total={0} />,
    )
    const empty = screen.getByTestId('reconciliation-empty')
    expect(empty).toBeInTheDocument()
    expect(empty.textContent).toMatch(/No reconciliation runs yet/)
    expect(screen.queryByTestId('reconciliation-table-wrapper')).not.toBeInTheDocument()
  })

  it('renders table rows with status chips when rows provided (test 9)', () => {
    const rows: ReconciliationHistoryRow[] = [
      buildRow({
        reconciliation_id: 'rec-1',
        provider: 'anthropic',
        status: 'matched',
        variance_pct: 0.4,
      }),
      buildRow({
        reconciliation_id: 'rec-2',
        provider: 'openai',
        status: 'variance_alert',
        variance_pct: 8.2,
      }),
      buildRow({
        reconciliation_id: 'rec-3',
        provider: 'gemini',
        status: 'missing_authoritative',
        variance_pct: null,
        authoritative_cost_usd: null,
      }),
    ]
    render(
      <ReconciliationHistoryView selectedProvider={null} rows={rows} total={3} />,
    )

    expect(screen.getByTestId('reconciliation-row-rec-1')).toBeInTheDocument()
    expect(screen.getByTestId('reconciliation-row-rec-2')).toBeInTheDocument()
    expect(screen.getByTestId('reconciliation-row-rec-3')).toBeInTheDocument()

    // Each row carries its own chip (table column 4); banner chips are not in
    // this view, so the only chips with these provider names are inside the rows.
    const matched = screen.getByTestId('reconciliation-chip-anthropic')
    expect(matched).toHaveAttribute('data-status', 'matched')

    const alert = screen.getByTestId('reconciliation-chip-openai')
    expect(alert).toHaveAttribute('data-status', 'variance_alert')
    expect(alert.textContent).toMatch(/Alert/)

    const missing = screen.getByTestId('reconciliation-chip-gemini')
    expect(missing).toHaveAttribute('data-status', 'missing_authoritative')
  })

  it('shows the CSV upload form when provider=deepseek (test 10)', () => {
    render(
      <ReconciliationHistoryView
        selectedProvider="deepseek"
        rows={[]}
        total={0}
      />,
    )
    expect(screen.getByTestId('reconciliation-upload-form')).toBeInTheDocument()
    const select = screen.getByTestId(
      'reconciliation-upload-provider',
    ) as HTMLSelectElement
    expect(select.value).toBe('deepseek')
    expect(screen.getByTestId('reconciliation-upload-period-start')).toBeInTheDocument()
    expect(screen.getByTestId('reconciliation-upload-period-end')).toBeInTheDocument()
    expect(screen.getByTestId('reconciliation-upload-file')).toBeInTheDocument()
  })

  it('hides the CSV upload form when provider=anthropic (auto-reconciled provider)', () => {
    render(
      <ReconciliationHistoryView
        selectedProvider="anthropic"
        rows={[]}
        total={0}
      />,
    )
    expect(
      screen.queryByTestId('reconciliation-upload-form'),
    ).not.toBeInTheDocument()
  })
})
