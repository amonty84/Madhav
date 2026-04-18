'use client'

import type { UIMessage } from 'ai'
import { UserMessage } from './UserMessage'
import { AssistantMessage } from './AssistantMessage'
import type { Rating } from '@/hooks/useFeedback'

interface Props {
  messages: UIMessage[]
  isStreaming: boolean
  onRegenerate?: () => void
  onEditUserMessage?: (id: string, text: string) => void
  ratings?: Record<string, Rating>
  onRate?: (messageId: string, rating: Rating) => void
}

export function MessageList({
  messages,
  isStreaming,
  onRegenerate,
  onEditUserMessage,
  ratings,
  onRate,
}: Props) {
  return (
    <div className="flex flex-col gap-6 py-6">
      {messages.map((message, i) => {
        const isLast = i === messages.length - 1
        if (message.role === 'user') {
          return <UserMessage key={message.id} message={message} onEditSubmit={onEditUserMessage} />
        }
        if (message.role === 'assistant') {
          return (
            <AssistantMessage
              key={message.id}
              message={message}
              isStreaming={isStreaming && isLast}
              isLast={isLast}
              onRegenerate={onRegenerate}
              rating={ratings?.[message.id] ?? null}
              onRate={onRate ? r => onRate(message.id, r) : undefined}
            />
          )
        }
        return null
      })}
    </div>
  )
}
