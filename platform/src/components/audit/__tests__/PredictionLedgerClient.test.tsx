import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PredictionLedgerClient } from '../PredictionLedgerClient'
import type { PredictionRow } from '@/lib/prediction/types'

const pastDate = '2025-01-01'
const futureDate = '2030-01-01'

const openPred: PredictionRow = {
  id: 'pred-open-1',
  query_id: 'q-001',
  created_at: '2026-01-01T00:00:00Z',
  prediction_text: 'Career pivot likely by 2027.',
  confidence: 0.72,
  horizon_start: pastDate,
  horizon_end: '2027-12-31',
  falsifier: 'No career change by end of 2027.',
  subject: 'native:abhisek',
  outcome: null,
  outcome_observed_at: null,
  calibration_bucket: null,
  brier_score: null,
  correction_note: null,
}

const closedPred: PredictionRow = {
  ...openPred,
  id: 'pred-closed-1',
  prediction_text: 'Jupiter transit triggers recognition.',
  outcome: 'confirmed',
  outcome_observed_at: '2026-03-15T00:00:00Z',
  calibration_bucket: 'true_positive',
}

const futurePred: PredictionRow = {
  ...openPred,
  id: 'pred-future-1',
  prediction_text: 'Future prediction not yet begun.',
  horizon_start: futureDate,
  horizon_end: '2035-12-31',
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

describe('PredictionLedgerClient', () => {
  it('renders open and closed tabs', () => {
    render(<PredictionLedgerClient initialOpen={[openPred]} initialClosed={[closedPred]} />)
    expect(screen.getByRole('tab', { name: /open/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /closed/i })).toBeInTheDocument()
  })

  it('shows open predictions by default', () => {
    render(<PredictionLedgerClient initialOpen={[openPred]} initialClosed={[closedPred]} />)
    expect(screen.getByText('Career pivot likely by 2027.')).toBeInTheDocument()
    expect(screen.queryByText('Jupiter transit triggers recognition.')).not.toBeInTheDocument()
  })

  it('switches to closed tab', () => {
    render(<PredictionLedgerClient initialOpen={[openPred]} initialClosed={[closedPred]} />)
    fireEvent.click(screen.getByRole('tab', { name: /closed/i }))
    expect(screen.getByText('Jupiter transit triggers recognition.')).toBeInTheDocument()
    expect(screen.queryByText('Career pivot likely by 2027.')).not.toBeInTheDocument()
  })

  it('shows outcome form for open predictions with past horizon_start', () => {
    render(<PredictionLedgerClient initialOpen={[openPred]} initialClosed={[]} />)
    expect(screen.getByLabelText('Select outcome')).toBeInTheDocument()
  })

  it('does NOT show outcome form for predictions whose horizon_start is future', () => {
    render(<PredictionLedgerClient initialOpen={[futurePred]} initialClosed={[]} />)
    expect(screen.queryByLabelText('Select outcome')).not.toBeInTheDocument()
    expect(screen.getByText(/Outcome recording opens on/)).toBeInTheDocument()
  })

  it('disables Record button until outcome selected', () => {
    render(<PredictionLedgerClient initialOpen={[openPred]} initialClosed={[]} />)
    const recordBtn = screen.getByRole('button', { name: 'Record' })
    expect(recordBtn).toBeDisabled()
  })

  it('enables Record button when outcome selected', () => {
    render(<PredictionLedgerClient initialOpen={[openPred]} initialClosed={[]} />)
    fireEvent.change(screen.getByLabelText('Select outcome'), { target: { value: 'confirmed' } })
    expect(screen.getByRole('button', { name: 'Record' })).not.toBeDisabled()
  })

  it('moves prediction to closed tab after successful outcome recording', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ prediction: { ...openPred, outcome: 'confirmed' } }),
    })
    vi.stubGlobal('fetch', mockFetch)

    render(<PredictionLedgerClient initialOpen={[openPred]} initialClosed={[]} />)
    fireEvent.change(screen.getByLabelText('Select outcome'), { target: { value: 'confirmed' } })
    fireEvent.click(screen.getByRole('button', { name: 'Record' }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/audit/predictions/${openPred.id}/outcome`,
        expect.objectContaining({ method: 'POST' })
      )
    })

    // After update, prediction moves to closed tab
    await waitFor(() => {
      expect(screen.queryByLabelText('Select outcome')).not.toBeInTheDocument()
    })
  })

  it('shows error message on failed outcome recording', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'horizon_start has not been reached yet' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    render(<PredictionLedgerClient initialOpen={[openPred]} initialClosed={[]} />)
    fireEvent.change(screen.getByLabelText('Select outcome'), { target: { value: 'confirmed' } })
    fireEvent.click(screen.getByRole('button', { name: 'Record' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('shows outcome badge on closed predictions', () => {
    render(<PredictionLedgerClient initialOpen={[]} initialClosed={[closedPred]} />)
    fireEvent.click(screen.getByRole('tab', { name: /closed/i }))
    expect(screen.getByText('confirmed')).toBeInTheDocument()
  })

  it('shows empty state for open tab', () => {
    render(<PredictionLedgerClient initialOpen={[]} initialClosed={[]} />)
    expect(screen.getByText('No open predictions.')).toBeInTheDocument()
  })

  it('shows tab count badges', () => {
    render(<PredictionLedgerClient initialOpen={[openPred, futurePred]} initialClosed={[closedPred]} />)
    expect(screen.getByRole('tab', { name: /open/i }).textContent).toContain('2')
    expect(screen.getByRole('tab', { name: /closed/i }).textContent).toContain('1')
  })
})
