import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { HealthRail } from '@/components/trace/HealthRail'
import { SearchFilter } from '@/components/trace/SearchFilter'
import { ShortcutHelpOverlay } from '@/components/trace/ShortcutHelpOverlay'
import { TraceModal } from '@/components/trace/TraceModal'
import { MOCK_TRACE, FAILED_TRACE, DEGRADED_TRACE } from '../fixtures'
import type { Anomaly } from '@/lib/admin/anomaly_detector'

// Mock recharts to avoid canvas issues in jsdom
vi.mock('recharts', () => ({
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ReferenceLine: () => null,
  Cell: () => null,
}))

vi.mock('@/lib/admin/trace_client', () => ({
  fetchTrace: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}))

import { fetchTrace } from '@/lib/admin/trace_client'

const mockFetchTrace = vi.mocked(fetchTrace)

const NO_ANOMALIES: Anomaly[] = []

const SAMPLE_ANOMALIES: Anomaly[] = [
  { stage: 'fetch', severity: 'ERROR', message: 'cgm_bundle fetch failed: TIMEOUT', step_id: 'cgm_bundle' },
  { stage: 'plan', severity: 'WARNING', message: 'Plan latency 4000ms (2.2× p50)', step_id: 'plan' },
]

describe('HealthRail', () => {
  it('renders the health rail container', () => {
    render(<HealthRail trace={MOCK_TRACE} anomalies={NO_ANOMALIES} onFocusStep={vi.fn()} />)
    expect(screen.getByTestId('health-rail')).toBeInTheDocument()
  })

  it('HealthVerdictCard renders HEALTHY with summary "All stages nominal"', () => {
    render(<HealthRail trace={MOCK_TRACE} anomalies={NO_ANOMALIES} onFocusStep={vi.fn()} />)
    const card = screen.getByTestId('health-verdict-card')
    expect(card).toBeInTheDocument()
    expect(card).toHaveTextContent('HEALTHY')
    expect(card).toHaveTextContent('All stages nominal')
  })

  it('HealthVerdictCard renders DEGRADED', () => {
    render(<HealthRail trace={DEGRADED_TRACE} anomalies={NO_ANOMALIES} onFocusStep={vi.fn()} />)
    expect(screen.getByTestId('health-verdict-card')).toHaveTextContent('DEGRADED')
  })

  it('HealthVerdictCard renders FAILED with critical summary', () => {
    render(<HealthRail trace={FAILED_TRACE} anomalies={SAMPLE_ANOMALIES} onFocusStep={vi.fn()} />)
    const card = screen.getByTestId('health-verdict-card')
    expect(card).toHaveTextContent('FAILED')
    expect(card).toHaveTextContent('Critical failure')
  })

  it('renders all 5 stage health rows', () => {
    render(<HealthRail trace={MOCK_TRACE} anomalies={NO_ANOMALIES} onFocusStep={vi.fn()} />)
    expect(screen.getByTestId('stage-health-row-classify')).toBeInTheDocument()
    expect(screen.getByTestId('stage-health-row-plan')).toBeInTheDocument()
    expect(screen.getByTestId('stage-health-row-fetch')).toBeInTheDocument()
    expect(screen.getByTestId('stage-health-row-assemble')).toBeInTheDocument()
    expect(screen.getByTestId('stage-health-row-synthesize')).toBeInTheDocument()
  })

  it('renders baseline comparison section with chart', () => {
    render(<HealthRail trace={MOCK_TRACE} anomalies={NO_ANOMALIES} onFocusStep={vi.fn()} />)
    expect(screen.getByTestId('baseline-comparison')).toBeInTheDocument()
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('shows unreliable baselines warning when sample_size < 30', () => {
    const lowSampleTrace = {
      ...MOCK_TRACE,
      baselines: { ...MOCK_TRACE.baselines!, sample_size: 15 },
    }
    render(<HealthRail trace={lowSampleTrace} anomalies={NO_ANOMALIES} onFocusStep={vi.fn()} />)
    expect(screen.getByTestId('baseline-unreliable-warning')).toBeInTheDocument()
  })

  it('does NOT show unreliable warning when sample_size >= 30', () => {
    render(<HealthRail trace={MOCK_TRACE} anomalies={NO_ANOMALIES} onFocusStep={vi.fn()} />)
    expect(screen.queryByTestId('baseline-unreliable-warning')).not.toBeInTheDocument()
  })

  it('renders anomaly callouts', () => {
    render(<HealthRail trace={MOCK_TRACE} anomalies={SAMPLE_ANOMALIES} onFocusStep={vi.fn()} />)
    expect(screen.getByTestId('anomaly-callouts')).toBeInTheDocument()
    expect(screen.getByText(/cgm_bundle fetch failed/)).toBeInTheDocument()
    expect(screen.getByText(/Plan latency/)).toBeInTheDocument()
  })

  it('clicking an anomaly callout calls onFocusStep with step_id', () => {
    const onFocus = vi.fn()
    render(<HealthRail trace={MOCK_TRACE} anomalies={SAMPLE_ANOMALIES} onFocusStep={onFocus} />)
    fireEvent.click(screen.getByText(/cgm_bundle fetch failed/))
    expect(onFocus).toHaveBeenCalledWith('cgm_bundle')
  })

  it('anomaly filter "errors" hides warnings', () => {
    render(<HealthRail trace={MOCK_TRACE} anomalies={SAMPLE_ANOMALIES} onFocusStep={vi.fn()} />)
    fireEvent.click(screen.getByRole('tab', { name: 'errors' }))
    expect(screen.getByText(/cgm_bundle fetch failed/)).toBeInTheDocument()
    expect(screen.queryByText(/Plan latency/)).not.toBeInTheDocument()
  })

  it('anomaly filter "warnings" hides errors', () => {
    render(<HealthRail trace={MOCK_TRACE} anomalies={SAMPLE_ANOMALIES} onFocusStep={vi.fn()} />)
    fireEvent.click(screen.getByRole('tab', { name: 'warnings' }))
    expect(screen.getByText(/Plan latency/)).toBeInTheDocument()
    expect(screen.queryByText(/cgm_bundle fetch failed/)).not.toBeInTheDocument()
  })

  it('shows "No anomalies detected" when list is empty', () => {
    render(<HealthRail trace={MOCK_TRACE} anomalies={NO_ANOMALIES} onFocusStep={vi.fn()} />)
    expect(screen.getByText('No anomalies detected.')).toBeInTheDocument()
  })

  it('renders cost & token ledger with Classify and Synthesis rows', () => {
    render(<HealthRail trace={MOCK_TRACE} anomalies={NO_ANOMALIES} onFocusStep={vi.fn()} />)
    expect(screen.getByTestId('cost-token-ledger')).toBeInTheDocument()
    expect(screen.getByText('Classify')).toBeInTheDocument()
    expect(screen.getByText('Synthesis')).toBeInTheDocument()
  })
})

describe('SearchFilter', () => {
  it('renders search filter container', () => {
    render(<SearchFilter value="" onChange={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByTestId('search-filter')).toBeInTheDocument()
  })

  it('renders an input with placeholder', () => {
    render(<SearchFilter value="" onChange={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Filter steps…')).toBeInTheDocument()
  })

  it('calls onChange when user types', () => {
    const onChange = vi.fn()
    render(<SearchFilter value="" onChange={onChange} onClose={vi.fn()} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'cgm' } })
    expect(onChange).toHaveBeenCalledWith('cgm')
  })

  it('calls onClose and onChange empty on Escape', () => {
    const onChange = vi.fn()
    const onClose = vi.fn()
    render(<SearchFilter value="cgm" onChange={onChange} onClose={onClose} />)
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' })
    expect(onChange).toHaveBeenCalledWith('')
    expect(onClose).toHaveBeenCalled()
  })

  it('shows clear button when value is non-empty', () => {
    render(<SearchFilter value="cgm" onChange={vi.fn()} onClose={vi.fn()} />)
    expect(screen.getByRole('button', { name: /clear search filter/i })).toBeInTheDocument()
  })

  it('does NOT show clear button when value is empty', () => {
    render(<SearchFilter value="" onChange={vi.fn()} onClose={vi.fn()} />)
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument()
  })
})

describe('ShortcutHelpOverlay', () => {
  it('renders overlay container', () => {
    render(<ShortcutHelpOverlay onClose={vi.fn()} />)
    expect(screen.getByTestId('shortcut-help-overlay')).toBeInTheDocument()
  })

  it('renders all 6 shortcuts', () => {
    render(<ShortcutHelpOverlay onClose={vi.fn()} />)
    expect(screen.getByText('j / k')).toBeInTheDocument()
    expect(screen.getByText('1 – 9')).toBeInTheDocument()
    expect(screen.getByText('/')).toBeInTheDocument()
    expect(screen.getByText('c')).toBeInTheDocument()
    expect(screen.getByText('?')).toBeInTheDocument()
    expect(screen.getByText('Esc')).toBeInTheDocument()
  })

  it('has role=dialog and aria-modal=true', () => {
    render(<ShortcutHelpOverlay onClose={vi.fn()} />)
    const overlay = screen.getByTestId('shortcut-help-overlay')
    expect(overlay).toHaveAttribute('role', 'dialog')
    expect(overlay).toHaveAttribute('aria-modal', 'true')
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<ShortcutHelpOverlay onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: /close keyboard shortcuts/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Escape is pressed on window', () => {
    const onClose = vi.fn()
    render(<ShortcutHelpOverlay onClose={onClose} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })
})

describe('Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('trace modal has role=dialog and aria-modal=true', async () => {
    mockFetchTrace.mockResolvedValue(MOCK_TRACE)
    render(<TraceModal queryId="test-id" />)
    await waitFor(() => expect(screen.getByTestId('trace-modal')).toBeInTheDocument())
    const modal = screen.getByTestId('trace-modal')
    expect(modal).toHaveAttribute('role', 'dialog')
    expect(modal).toHaveAttribute('aria-modal', 'true')
  })

  it('health rail has aria-label', () => {
    render(<HealthRail trace={MOCK_TRACE} anomalies={NO_ANOMALIES} onFocusStep={vi.fn()} />)
    expect(screen.getByLabelText('Health and performance rail')).toBeInTheDocument()
  })

  it('anomaly callouts have severity text labels (not just color)', () => {
    render(<HealthRail trace={MOCK_TRACE} anomalies={SAMPLE_ANOMALIES} onFocusStep={vi.fn()} />)
    // ERROR and WARN text labels should be present
    expect(screen.getByText(/^ERROR/)).toBeInTheDocument()
    expect(screen.getByText(/^WARN/)).toBeInTheDocument()
  })
})
