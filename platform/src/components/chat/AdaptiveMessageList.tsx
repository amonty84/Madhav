'use client'

import { useMemo } from 'react'
import type { UIMessage } from 'ai'
import { MessageList } from './MessageList'
import { VirtualizedMessageList } from './VirtualizedMessageList'
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
  /**
   * Optional scroll container ref from parent useScrollAnchor
   */
  scrollRef?: React.RefObject<HTMLDivElement | null>
  /**
   * Whether to use virtualization for long conversations
   * @default true (auto-detect based on message count)
   */
  enableVirtualization?: boolean | 'auto'
  /**
   * Threshold for auto-enabling virtualization
   * @default 30 messages
   */
  virtualizationThreshold?: number
}

/**
 * Adaptive message list that automatically switches to virtualization
 * for long conversations while keeping the simple implementation for shorter ones.
 */
export function AdaptiveMessageList({
  messages,
  isStreaming,
  onRegenerate,
  onEditUserMessage,
  ratings,
  onRate,
  branchStats,
  onStepBranch,
  scrollRef,
  enableVirtualization = 'auto',
  virtualizationThreshold = 30,
}: Props) {
  const shouldUseVirtualization = useMemo(() => {
    if (enableVirtualization === false) return false
    if (enableVirtualization === true) return true
    // Auto-detect: use virtualization for long conversations
    return messages.length > virtualizationThreshold
  }, [enableVirtualization, messages.length, virtualizationThreshold])

  if (shouldUseVirtualization) {
    return (
      <VirtualizedMessageList
        messages={messages}
        isStreaming={isStreaming}
        onRegenerate={onRegenerate}
        onEditUserMessage={onEditUserMessage}
        ratings={ratings}
        onRate={onRate}
        branchStats={branchStats}
        onStepBranch={onStepBranch}
        scrollRef={scrollRef}
      />
    )
  }

  return (
    <MessageList
      messages={messages}
      isStreaming={isStreaming}
      onRegenerate={onRegenerate}
      onEditUserMessage={onEditUserMessage}
      ratings={ratings}
      onRate={onRate}
      branchStats={branchStats}
      onStepBranch={onStepBranch}
    />
  )
}