'use client'

import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import type { UIMessage } from 'ai'
import { UserMessage } from './UserMessage'
import { AssistantMessage } from './AssistantMessage'
import { MessageErrorBoundary } from './MessageErrorBoundary'
import type { Rating } from '@/hooks/useFeedback'

interface BranchStat {
  total: number
  current: number
}

interface Props {
  messages: UIMessage[]
  isStreaming: boolean
  onRegenerate?: () => void
  onEditUserMessage?: (id: string, text: string) => void
  ratings?: Record<string, Rating>
  onRate?: (messageId: string, rating: Rating) => void
  branchStats?: Record<string, BranchStat>
  onStepBranch?: (messageId: string, delta: -1 | 1) => void
  /** Optional scroll container ref from a parent useScrollAnchor. */
  scrollRef?: React.RefObject<HTMLDivElement | null>
}

// Number of messages to render above and below viewport.
const BUFFER = 8
// Approximate height of each message in pixels for initial calculation.
const ESTIMATED_MESSAGE_HEIGHT = 120
// Pixels from bottom at which we consider the user "at bottom" for pin-to-latest.
const AT_BOTTOM_THRESHOLD = 100

export function VirtualizedMessageList({
  messages,
  isStreaming,
  onRegenerate,
  onEditUserMessage,
  ratings,
  onRate,
  branchStats,
  onStepBranch,
  scrollRef: externalScrollRef,
}: Props) {
  const internalScrollRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const [isAtBottom, setIsAtBottom] = useState(true)

  // Track the last message to ensure it stays visible during streaming.
  const lastMessageIdRef = useRef<string | null>(null)

  // The element we measure + observe. Falls back to the internal ref if no
  // external container was provided (standalone mode).
  const getContainer = useCallback((): HTMLDivElement | null => {
    return externalScrollRef?.current ?? internalScrollRef.current
  }, [externalScrollRef])

  // Calculate visible range. All dependencies are proper state, not refs, so
  // the memo recomputes correctly when any input changes.
  const { startIndex, endIndex, paddingTop, paddingBottom } = useMemo(() => {
    if (messages.length === 0) {
      return { startIndex: 0, endIndex: 0, paddingTop: 0, paddingBottom: 0 }
    }

    const totalHeight = messages.length * ESTIMATED_MESSAGE_HEIGHT
    let startIdx = Math.max(0, Math.floor(scrollTop / ESTIMATED_MESSAGE_HEIGHT) - BUFFER)
    let endIdx = Math.min(
      messages.length - 1,
      Math.floor((scrollTop + containerHeight) / ESTIMATED_MESSAGE_HEIGHT) + BUFFER
    )

    // While streaming, if the user is near the bottom, ensure the tail of the
    // list is always mounted so new tokens are visible without a re-measure.
    if (isStreaming && isAtBottom) {
      const lastMessagesStart = Math.max(0, messages.length - BUFFER * 3)
      startIdx = Math.min(startIdx, lastMessagesStart)
      endIdx = messages.length - 1
    }

    return {
      startIndex: startIdx,
      endIndex: endIdx,
      paddingTop: startIdx * ESTIMATED_MESSAGE_HEIGHT,
      paddingBottom: Math.max(0, totalHeight - (endIdx + 1) * ESTIMATED_MESSAGE_HEIGHT),
    }
  }, [messages.length, scrollTop, containerHeight, isStreaming, isAtBottom])

  // Attach scroll + resize observers to the actual container (external or
  // internal). This is the fix for the silent-broken-virtualization bug: when
  // an external ref was passed, the whole effect used to return early, leaving
  // scrollTop / containerHeight / isAtBottom frozen at their initial values.
  useEffect(() => {
    const container = getContainer()
    if (!container) return

    const measure = () => {
      setScrollTop(container.scrollTop)
      setContainerHeight(container.clientHeight)
      const distance = container.scrollHeight - container.scrollTop - container.clientHeight
      setIsAtBottom(distance <= AT_BOTTOM_THRESHOLD)
    }

    // Initial measurement.
    measure()

    const onScroll = () => measure()
    container.addEventListener('scroll', onScroll, { passive: true })

    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => measure())
      resizeObserver.observe(container)
    }

    return () => {
      container.removeEventListener('scroll', onScroll)
      resizeObserver?.disconnect()
    }
  }, [getContainer])

  // Auto-scroll to new messages during streaming if near bottom.
  useEffect(() => {
    if (!isStreaming) return
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage) return
    if (lastMessageIdRef.current === lastMessage.id) return

    lastMessageIdRef.current = lastMessage.id
    if (!isAtBottom) return
    const container = getContainer()
    if (!container) return
    requestAnimationFrame(() => {
      const c = getContainer()
      if (c) c.scrollTop = c.scrollHeight
    })
  }, [messages, isStreaming, isAtBottom, getContainer])

  // While streaming, always render the last BUFFER*3 messages so new content
  // is on screen even if measurements haven't caught up yet.
  const visibleMessages = useMemo(() => {
    if (isStreaming && messages.length > 0) {
      const lastMessagesStart = Math.max(0, messages.length - BUFFER * 3)
      return messages.slice(lastMessagesStart)
    }
    return messages.slice(startIndex, endIndex + 1)
  }, [messages, startIndex, endIndex, isStreaming])

  const renderMessage = useCallback(
    (message: UIMessage, absoluteIndex: number) => {
      const isLast = absoluteIndex === messages.length - 1
      if (message.role === 'user') {
        const stat = branchStats?.[message.id]
        return (
          <MessageErrorBoundary key={message.id} messageId={message.id}>
            <UserMessage
              message={message}
              onEditSubmit={onEditUserMessage}
              branchTotal={stat?.total}
              branchCurrent={stat?.current}
              onStepBranch={onStepBranch ? d => onStepBranch(message.id, d) : undefined}
            />
          </MessageErrorBoundary>
        )
      }
      if (message.role === 'assistant') {
        return (
          <MessageErrorBoundary key={message.id} messageId={message.id}>
            <AssistantMessage
              message={message}
              isStreaming={isStreaming && isLast}
              isLast={isLast}
              onRegenerate={onRegenerate}
              rating={ratings?.[message.id] ?? null}
              onRate={onRate ? r => onRate(message.id, r) : undefined}
            />
          </MessageErrorBoundary>
        )
      }
      return null
    },
    [isStreaming, onRegenerate, onEditUserMessage, ratings, onRate, branchStats, onStepBranch, messages.length]
  )

  // If we have few messages, just render normally without virtualization.
  if (messages.length <= BUFFER * 3) {
    return (
      <div className="flex flex-col gap-6 py-6">
        {messages.map((message, i) => renderMessage(message, i))}
      </div>
    )
  }

  const content = (
    <div
      style={{
        paddingTop: `${paddingTop}px`,
        paddingBottom: `${paddingBottom}px`,
        minHeight: '100%',
      }}
    >
      <div className="flex flex-col gap-6 py-6">
        {visibleMessages.map((message, i) => {
          const absoluteIndex =
            isStreaming && messages.length > BUFFER * 3
              ? messages.length - BUFFER * 3 + i
              : startIndex + i
          return renderMessage(message, absoluteIndex)
        })}
      </div>
    </div>
  )

  if (externalScrollRef) {
    return content
  }

  return (
    <div
      ref={internalScrollRef}
      className="relative flex-1 overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable]"
    >
      {content}
    </div>
  )
}
