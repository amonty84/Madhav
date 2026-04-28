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
vi.mock('../AnswerView', () => ({
  AnswerView: ({ text }: { text: string }) => <div data-testid="answer-view">{text}</div>,
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

  it('renders completed assistant message via AnswerView', () => {
    render(
      <StreamingAnswer
        messages={[makeMsg('user', 'Q'), makeMsg('assistant', 'A long synthesis answer.')]}
        isStreaming={false}
      />
    )
    expect(screen.getByTestId('answer-view')).toBeInTheDocument()
    expect(screen.getByTestId('answer-view').textContent).toBe('A long synthesis answer.')
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

  it('calls onStop on unmount while streaming', () => {
    const onStop = vi.fn()
    const { unmount } = render(
      <StreamingAnswer
        messages={[makeMsg('assistant', 'In progress…')]}
        isStreaming={true}
        onStop={onStop}
      />
    )
    act(() => unmount())
    expect(onStop).toHaveBeenCalledOnce()
  })

  it('does not call onStop on unmount when not streaming', () => {
    const onStop = vi.fn()
    const { unmount } = render(
      <StreamingAnswer
        messages={[makeMsg('assistant', 'Done.')]}
        isStreaming={false}
        onStop={onStop}
      />
    )
    act(() => unmount())
    expect(onStop).not.toHaveBeenCalled()
  })

  it('only the last assistant message streams — earlier ones use AnswerView', () => {
    const msgs: UIMessage[] = [
      makeMsg('user', 'Q1'),
      makeMsg('assistant', 'A1'),
      makeMsg('user', 'Q2'),
      makeMsg('assistant', 'A2 partial'),
    ]
    render(<StreamingAnswer messages={msgs} isStreaming={true} />)
    const answerViews = screen.getAllByTestId('answer-view')
    expect(answerViews).toHaveLength(1)
    expect(answerViews[0].textContent).toBe('A1')
    expect(screen.getByTestId('streaming-markdown')).toBeInTheDocument()
  })
})
