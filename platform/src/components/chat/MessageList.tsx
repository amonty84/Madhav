'use client'

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
}

export function MessageList({
  messages,
  isStreaming,
  onRegenerate,
  onEditUserMessage,
  ratings,
  onRate,
  branchStats,
  onStepBranch,
}: Props) {
  return (
    <div className="flex flex-col gap-6 py-6">
      {messages.map((message, i) => {
        const isLast = i === messages.length - 1
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
      })}
    </div>
  )
}
