// USTAD_S4_5 — ReplayPanel UI test.
// Covers the empty-state contract from the brief.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'

const fetchMock = vi.fn(async () => ({
  ok: true,
  status: 200,
  json: async () => ({ versions: [] }),
}))

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch)
  fetchMock.mockClear()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

import { ReplayPanel } from '../../analytics/ReplayPanel'

describe('ReplayPanel — initial render', () => {
  it('8. renders the "Run re-cost" button and the empty-state notice', () => {
    render(
      <ReplayPanel
        defaultDateStart="2026-04-01"
        defaultDateEnd="2026-04-30"
      />,
    )
    expect(screen.getByTestId('replay-panel')).toBeInTheDocument()
    expect(screen.getByTestId('replay-form')).toBeInTheDocument()
    const runBtn = screen.getByTestId('replay-run')
    expect(runBtn.textContent).toMatch(/Run re-cost/)
    expect(screen.getByTestId('replay-empty')).toBeInTheDocument()
    // No result section yet.
    expect(screen.queryByTestId('replay-result')).not.toBeInTheDocument()
  })
})
