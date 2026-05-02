import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'

import { EventSidePanel } from '@/lib/components/observatory/events/EventSidePanel'
import { makeDetail, makeRow, makeEventsResponse } from './fixtures'

const DATE_RANGE = { from: '2026-04-01', to: '2026-05-01' }

describe('EventSidePanel — tab switching', () => {
  it('renders Prompt → Response → Meta with tab-specific content', async () => {
    const detail = makeDetail(7, {
      event_id: 'evt-test-7',
      prompt_text: 'PROMPT-CANARY',
      response_text: 'RESPONSE-CANARY',
      provider_request_id: 'REQ-CANARY-7',
    })
    const fetchEvent = vi.fn().mockResolvedValue(detail)
    const fetchEvents = vi
      .fn()
      .mockResolvedValue(makeEventsResponse([], null, 0))

    await act(async () => {
      render(
        <EventSidePanel
          eventId="evt-test-7"
          dateRange={DATE_RANGE}
          onClose={() => {}}
          fetchEvent={fetchEvent}
          fetchEvents={fetchEvents}
        />,
      )
    })

    await waitFor(() =>
      expect(screen.getByTestId('event-prompt-text')).toBeInTheDocument(),
    )

    expect(screen.getByTestId('event-prompt-text')).toHaveTextContent(
      'PROMPT-CANARY',
    )

    await act(async () => {
      fireEvent.click(screen.getByTestId('event-side-panel-tab-response'))
    })
    expect(screen.getByTestId('event-response-text')).toHaveTextContent(
      'RESPONSE-CANARY',
    )
    expect(screen.queryByTestId('event-prompt-text')).not.toBeInTheDocument()

    await act(async () => {
      fireEvent.click(screen.getByTestId('event-side-panel-tab-meta'))
    })
    expect(screen.getByTestId('event-side-panel-meta')).toBeInTheDocument()
    expect(screen.getByTestId('event-side-panel-meta')).toHaveTextContent(
      'REQ-CANARY-7',
    )
    expect(screen.getByTestId('event-raw-payload-note')).toHaveTextContent(
      /Raw provider payload not captured/i,
    )
  })
})

describe('EventSidePanel — conversation thread mini-list', () => {
  it('lists 4 siblings; clicking sibling 3 switches the panel to that event', async () => {
    const conversationId = 'conv-thread-X'
    const initialDetail = makeDetail(0, {
      event_id: 'evt-current',
      conversation_id: conversationId,
      prompt_text: 'CURRENT-PROMPT',
    })
    const siblings = [
      makeRow(0, { event_id: 'evt-current', conversation_id: conversationId }),
      makeRow(1, { event_id: 'evt-sibling-1', conversation_id: conversationId }),
      makeRow(2, { event_id: 'evt-sibling-2', conversation_id: conversationId }),
      makeRow(3, { event_id: 'evt-sibling-3', conversation_id: conversationId }),
    ]
    const sibling3Detail = makeDetail(3, {
      event_id: 'evt-sibling-3',
      conversation_id: conversationId,
      prompt_text: 'SIBLING-3-PROMPT',
    })

    const fetchEvent = vi.fn(async (id: string) => {
      if (id === 'evt-sibling-3') return sibling3Detail
      return initialDetail
    })
    const fetchEvents = vi
      .fn()
      .mockResolvedValue(makeEventsResponse(siblings, null, 4))

    function Harness(): React.ReactElement {
      const [id, setId] = React.useState<string>('evt-current')
      return (
        <EventSidePanel
          eventId={id}
          dateRange={DATE_RANGE}
          onClose={() => {}}
          onSelectEvent={setId}
          fetchEvent={fetchEvent}
          fetchEvents={fetchEvents}
        />
      )
    }

    await act(async () => {
      render(<Harness />)
    })

    await waitFor(() =>
      expect(screen.getByTestId('event-side-panel-thread')).toHaveTextContent(
        /Conversation thread \(4\)/,
      ),
    )

    // All 4 sibling buttons present
    siblings.forEach((s) => {
      expect(
        screen.getByTestId(`event-thread-sibling-${s.event_id}`),
      ).toBeInTheDocument()
    })

    // Click sibling 3 — panel re-targets to evt-sibling-3
    await act(async () => {
      fireEvent.click(screen.getByTestId('event-thread-sibling-evt-sibling-3'))
    })

    await waitFor(() =>
      expect(screen.getByTestId('event-side-panel-id')).toHaveTextContent(
        'evt-sibling-3',
      ),
    )
    await waitFor(() =>
      expect(screen.getByTestId('event-prompt-text')).toHaveTextContent(
        'SIBLING-3-PROMPT',
      ),
    )

    // fetchEvent was called for both ids
    const calledIds = fetchEvent.mock.calls.map((c) => c[0])
    expect(calledIds).toContain('evt-current')
    expect(calledIds).toContain('evt-sibling-3')
  })
})
