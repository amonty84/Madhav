import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import type { EventsParams } from '@/lib/api-clients/observatory'
import type {
  EventDetailResponse,
  EventsResponse,
} from '@/lib/observatory/types'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => '/observatory/events',
  useSearchParams: () => new URLSearchParams(''),
}))

const getEventsMock = vi.fn(
  async (_params: EventsParams): Promise<EventsResponse> => ({
    events: [],
    next_cursor: null,
    total_count: 0,
  }),
)
const getEventMock = vi.fn(
  async (_id: string): Promise<EventDetailResponse | null> => null,
)

vi.mock('@/lib/api-clients/observatory', async () => {
  const actual = await vi.importActual<
    typeof import('@/lib/api-clients/observatory')
  >('@/lib/api-clients/observatory')
  return {
    ...actual,
    getEvents: (params: EventsParams) => getEventsMock(params),
    getEvent: (id: string) => getEventMock(id),
  }
})

import { EventsClient } from '../../pages/EventsClient'

describe('EventsClient (S1.13 wiring)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getEventsMock.mockResolvedValue({
      events: [],
      next_cursor: null,
      total_count: 0,
    })
  })

  it('renders without throwing when the API returns an empty event list', async () => {
    render(<EventsClient />)

    expect(screen.getByTestId('observatory-events')).toBeInTheDocument()
    expect(screen.getByTestId('observatory-filters-bar')).toBeInTheDocument()
    expect(screen.getByTestId('event-table')).toBeInTheDocument()

    await waitFor(() => {
      expect(getEventsMock).toHaveBeenCalledTimes(1)
    })
    expect(screen.getByTestId('event-table-count')).toHaveTextContent(
      'Showing 0 of 0',
    )
  })

  it('forwards date_range + default filter shape to the events fetch', async () => {
    render(<EventsClient />)
    await waitFor(() => {
      expect(getEventsMock).toHaveBeenCalled()
    })
    const params = getEventsMock.mock.calls[0]![0]
    expect(params.from).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/)
    expect(params.to).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/)
    expect(params.limit).toBe(50)
    // Default filters have no provider selection; field omitted (undefined).
    expect(params.provider).toBeUndefined()
  })
})
