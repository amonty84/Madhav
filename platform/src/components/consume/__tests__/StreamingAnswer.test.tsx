import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import type { UIMessage } from 'ai'

// Mock child components to isolate StreamingAnswer behaviour
vi.mock('@/components/chat/StreamingMarkdown', () => ({
  StreamingMarkdown: ({ children, isStreaming }: { children: string; isStreaming?: boolean }) => (
    <div data-testid="streaming-markdown" data-streaming={isStreaming}>{children}</div>
  ),
}))
vi.mock('@/components/chat/StreamingDots', () => ({
  StreamingDots: () => <div data-testid="streaming-dots" />,
}))
vi.mock('@/components/chat/AssistantMessage', () => ({
  AssistantMessage: ({
    message,
    isStreaming,
    onRegenerate,
  }: {
    message: UIMessage
    isStreaming: boolean
    isLast: boolean
    onRegenerate?: () => void
  }) => (
    <div
      data-testid="assistant-message"
      data-streaming={isStreaming}
      data-has-regen={onRegenerate != null ? 'true' : 'false'}
    >
      {(message.parts ?? [])
        .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
        .map(p => p.text)
        .join('')}
    </div>
  ),
}))
vi.mock('@/components/chat/MessageErrorBoundary', () => ({
  MessageErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

import { StreamingAnswer } from '../StreamingAnswer'

function makeMsg(role: 'user' | 'assistant', text: string, id = crypto.randomUUID()): UIMessage {
  return { id, role, parts: [{ type: 'text', text }] }
}

describe('StreamingAnswer', () => {
  it('renders nothing when messages is empty', () => {
    const { container } = render(<StreamingAnswer messages={[]} isStreaming={false} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders user message as a bubble', () => {
    render(<StreamingAnswer messages={[makeMsg('user', 'What is my lagna?')]} isStreaming={false} />)
    expect(screen.getByText('What is my lagna?')).toBeInTheDocument()
  })

  it('renders completed assistant message via AssistantMessage', () => {
    render(
      <StreamingAnswer
        messages={[makeMsg('user', 'Q'), makeMsg('assistant', 'A long synthesis answer.')]}
        isStreaming={false}
      />
    )
    expect(screen.getByTestId('assistant-message')).toBeInTheDocument()
    expect(screen.getByTestId('assistant-message').textContent).toBe('A long synthesis answer.')
  })

  it('completed assistant message shows isStreaming=false on AssistantMessage', () => {
    render(
      <StreamingAnswer
        messages={[makeMsg('user', 'Q'), makeMsg('assistant', 'Done answer.')]}
        isStreaming={false}
      />
    )
    const el = screen.getByTestId('assistant-message')
    expect(el.getAttribute('data-streaming')).toBe('false')
  })

  it('passes onRegenerate only to the last assistant message', () => {
    const onRegenerate = vi.fn()
    const msgs: UIMessage[] = [
      makeMsg('user', 'Q1'),
      makeMsg('assistant', 'A1'),
      makeMsg('user', 'Q2'),
      makeMsg('assistant', 'A2'),
    ]
    render(<StreamingAnswer messages={msgs} isStreaming={false} onRegenerate={onRegenerate} />)
    const elems = screen.getAllByTestId('assistant-message')
    expect(elems).toHaveLength(2)
    expect(elems[0].getAttribute('data-has-regen')).toBe('false')
    expect(elems[1].getAttribute('data-has-regen')).toBe('true')
  })

  it('renders streaming assistant message via StreamingMarkdown with isStreaming=true', () => {
    render(
      <StreamingAnswer
        messages={[makeMsg('user', 'Q'), makeMsg('assistant', 'Partial…')]}
        isStreaming={true}
      />
    )
    const md = screen.getByTestId('streaming-markdown')
    expect(md).toBeInTheDocument()
    expect(md.getAttribute('data-streaming')).toBe('true')
  })

  it('shows StreamingDots when last assistant message has no text yet', () => {
    render(
      <StreamingAnswer
        messages={[makeMsg('user', 'Q'), makeMsg('assistant', '')]}
        isStreaming={true}
      />
    )
    expect(screen.getByTestId('streaming-dots')).toBeInTheDocument()
  })

  it('only the last assistant message streams — earlier ones use AssistantMessage', () => {
    const msgs: UIMessage[] = [
      makeMsg('user', 'Q1'),
      makeMsg('assistant', 'A1'),
      makeMsg('user', 'Q2'),
      makeMsg('assistant', 'A2 partial'),
    ]
    render(<StreamingAnswer messages={msgs} isStreaming={true} />)
    const assistantMessages = screen.getAllByTestId('assistant-message')
    expect(assistantMessages).toHaveLength(1)
    expect(assistantMessages[0].textContent).toBe('A1')
    expect(screen.getByTestId('streaming-markdown')).toBeInTheDocument()
  })
})
