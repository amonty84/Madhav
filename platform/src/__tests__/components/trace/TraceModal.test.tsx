import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { TraceModal } from '@/components/trace/TraceModal'
import { MOCK_TRACE } from './fixtures'

vi.mock('@/lib/admin/trace_client', () => ({
  fetchTrace: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}))

import { fetchTrace } from '@/lib/admin/trace_client'

const mockFetchTrace = vi.mocked(fetchTrace)

describe('TraceModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing while loading (null state)', async () => {
    mockFetchTrace.mockImplementation(() => new Promise(() => {}))
    const { container } = render(<TraceModal queryId="test-id" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders modal with all three zones after fetch resolves', async () => {
    mockFetchTrace.mockResolvedValue(MOCK_TRACE)
    render(<TraceModal queryId="test-id" />)

    await waitFor(() => expect(screen.getByTestId('trace-modal')).toBeInTheDocument())
    expect(screen.getByTestId('lifecycle-graph')).toBeInTheDocument()
    expect(screen.getByTestId('step-detail')).toBeInTheDocument()
    expect(screen.getByTestId('health-rail')).toBeInTheDocument()
    expect(screen.getByTestId('timing-ribbon')).toBeInTheDocument()
  })

  it('renders error state when fetch fails', async () => {
    mockFetchTrace.mockRejectedValue(new Error('Network error'))
    render(<TraceModal queryId="bad-id" />)

    await waitFor(() => expect(screen.getByTestId('trace-error')).toBeInTheDocument())
    expect(screen.getByTestId('trace-error')).toHaveTextContent('Network error')
  })

  it('j/k keyboard navigation changes selected step', async () => {
    mockFetchTrace.mockResolvedValue(MOCK_TRACE)
    render(<TraceModal queryId="test-id" />)

    await waitFor(() => expect(screen.getByTestId('trace-modal')).toBeInTheDocument())

    // Default is synthesis; k should move to context_assembly
    await act(async () => {
      await userEvent.keyboard('k')
    })
    expect(screen.getByTestId('step-detail')).toBeInTheDocument()
    // verify context_assembly detail is shown
    await waitFor(() => expect(screen.getByTestId('context-assembly-detail')).toBeInTheDocument())
  })

  it('number key 1 jumps to classify step', async () => {
    mockFetchTrace.mockResolvedValue(MOCK_TRACE)
    render(<TraceModal queryId="test-id" />)

    await waitFor(() => expect(screen.getByTestId('trace-modal')).toBeInTheDocument())

    await act(async () => {
      await userEvent.keyboard('1')
    })
    await waitFor(() => expect(screen.getByTestId('classify-detail')).toBeInTheDocument())
  })

  it('number key 2 jumps to plan step', async () => {
    mockFetchTrace.mockResolvedValue(MOCK_TRACE)
    render(<TraceModal queryId="test-id" />)

    await waitFor(() => expect(screen.getByTestId('trace-modal')).toBeInTheDocument())

    await act(async () => {
      await userEvent.keyboard('2')
    })
    await waitFor(() => expect(screen.getByTestId('plan-detail')).toBeInTheDocument())
  })
})
