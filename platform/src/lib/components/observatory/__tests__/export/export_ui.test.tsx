// Phase O — O.3 Export — UI tests (USTAD_S3_4_EXPORT_O3_CLOSE).
//
// 3 tests:
//   10. ExportPanel renders date inputs + provider select + format radio +
//       download button (when expanded)
//   11. Download button calls buildExportUrl with the form's current params
//   12. ExportPanel collapsed by default; clicking the toggle expands it

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'

const buildExportUrlMock = vi.fn(
  (_params: unknown): string => '/api/admin/observatory/export?stub=1',
)
vi.mock('@/lib/api-clients/observatory', () => ({
  buildExportUrl: (params: unknown): string => buildExportUrlMock(params),
}))

import { ExportPanel } from '../../export/ExportPanel'

describe('ExportPanel', () => {
  let originalLocation: Location
  let assignedHref: string | null

  beforeEach(() => {
    buildExportUrlMock.mockClear()
    buildExportUrlMock.mockReturnValue('/api/admin/observatory/export?stub=1')
    originalLocation = window.location
    assignedHref = null
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...originalLocation,
        set href(value: string) {
          assignedHref = value
        },
        get href() {
          return assignedHref ?? ''
        },
      },
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })

  it('12. is collapsed by default; clicking the toggle expands it', () => {
    render(<ExportPanel />)
    const panel = screen.getByTestId('observatory-export-panel')
    expect(panel.getAttribute('data-open')).toBe('false')
    expect(screen.queryByTestId('observatory-export-form')).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId('observatory-export-toggle'))
    expect(
      screen.getByTestId('observatory-export-panel').getAttribute('data-open'),
    ).toBe('true')
    expect(screen.getByTestId('observatory-export-form')).toBeInTheDocument()
  })

  it('10. renders date inputs + provider select + format radio + download button when expanded', () => {
    render(<ExportPanel />)
    fireEvent.click(screen.getByTestId('observatory-export-toggle'))
    expect(screen.getByTestId('export-date-start')).toBeInTheDocument()
    expect(screen.getByTestId('export-date-end')).toBeInTheDocument()
    expect(screen.getByTestId('export-provider')).toBeInTheDocument()
    expect(screen.getByTestId('export-pipeline-stage')).toBeInTheDocument()
    const fmt = screen.getByTestId('export-format')
    expect(within(fmt).getByTestId('export-format-csv')).toBeInTheDocument()
    expect(within(fmt).getByTestId('export-format-json')).toBeInTheDocument()
    expect(screen.getByTestId('export-download')).toBeInTheDocument()
  })

  it('11. Download button calls buildExportUrl with the form params and navigates the browser', () => {
    render(<ExportPanel />)
    fireEvent.click(screen.getByTestId('observatory-export-toggle'))
    fireEvent.change(screen.getByTestId('export-date-start'), {
      target: { value: '2026-04-01' },
    })
    fireEvent.change(screen.getByTestId('export-date-end'), {
      target: { value: '2026-04-30' },
    })
    fireEvent.change(screen.getByTestId('export-provider'), {
      target: { value: 'anthropic' },
    })
    fireEvent.change(screen.getByTestId('export-pipeline-stage'), {
      target: { value: 'classify' },
    })
    fireEvent.click(screen.getByTestId('export-format-json'))
    fireEvent.change(screen.getByTestId('export-limit'), {
      target: { value: '5000' },
    })

    fireEvent.click(screen.getByTestId('export-download'))

    expect(buildExportUrlMock).toHaveBeenCalledTimes(1)
    expect(buildExportUrlMock.mock.calls[0][0]).toEqual({
      format: 'json',
      date_start: '2026-04-01',
      date_end: '2026-04-30',
      limit: 5000,
      provider: 'anthropic',
      pipeline_stage: 'classify',
    })
    expect(assignedHref).toBe('/api/admin/observatory/export?stub=1')
  })
})
