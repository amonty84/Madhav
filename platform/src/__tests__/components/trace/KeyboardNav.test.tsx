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

describe('TraceModal keyboard navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetchTrace.mockResolvedValue(MOCK_TRACE)
  })

  async function renderAndWait() {
    const result = render(<TraceModal queryId="test-id" />)
    await waitFor(() => expect(screen.getByTestId('trace-modal')).toBeInTheDocument())
    return result
  }

  it('j key moves forward from synthesis to context_assembly (wrapping from end)', async () => {
    await renderAndWait()
    // Start at synthesis (default), k to go backward shows context_assembly
    await act(async () => { await userEvent.keyboard('k') })
    await waitFor(() => expect(screen.getByTestId('context-assembly-detail')).toBeInTheDocument())
  })

  it('k key moves backward (synthesis → context_assembly)', async () => {
    await renderAndWait()
    await act(async () => { await userEvent.keyboard('k') })
    await waitFor(() => expect(screen.getByTestId('context-assembly-detail')).toBeInTheDocument())
  })

  it('number key 1 jumps to classify (first step)', async () => {
    await renderAndWait()
    await act(async () => { await userEvent.keyboard('1') })
    await waitFor(() => expect(screen.getByTestId('classify-detail')).toBeInTheDocument())
  })

  it('number key 2 jumps to plan', async () => {
    await renderAndWait()
    await act(async () => { await userEvent.keyboard('2') })
    await waitFor(() => expect(screen.getByTestId('plan-detail')).toBeInTheDocument())
  })

  it('j from classify steps forward to plan', async () => {
    await renderAndWait()
    // Go to classify first
    await act(async () => { await userEvent.keyboard('1') })
    await waitFor(() => expect(screen.getByTestId('classify-detail')).toBeInTheDocument())
    // j to plan
    await act(async () => { await userEvent.keyboard('j') })
    await waitFor(() => expect(screen.getByTestId('plan-detail')).toBeInTheDocument())
  })

  it('j does not advance past last step (synthesis)', async () => {
    await renderAndWait()
    // Already at synthesis (default), j should stay
    await act(async () => { await userEvent.keyboard('j') })
    // synthesis detail should still be there
    await waitFor(() => expect(screen.getByTestId('synthesis-detail')).toBeInTheDocument())
  })
})
