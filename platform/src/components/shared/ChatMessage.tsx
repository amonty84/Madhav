import { StreamingCursor } from './StreamingCursor'
import { ToolCallAccordion } from './ToolCallAccordion'
import type { ToolCall } from './ToolCallAccordion'
import { cn } from '@/lib/utils'

interface Props {
  role: 'user' | 'assistant'
  content: string
  toolCalls?: ToolCall[]
  isStreaming?: boolean
}

export function ChatMessage({ role, content, toolCalls, isStreaming }: Props) {
  const isUser = role === 'user'

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%]',
          isUser
            ? 'bg-primary/10 rounded-2xl rounded-tr-sm px-4 py-2 text-sm'
            : 'text-sm leading-relaxed'
        )}
      >
        <p className="whitespace-pre-wrap">
          {content}
          {isStreaming && <StreamingCursor />}
        </p>

        {toolCalls && toolCalls.length > 0 && (
          <ToolCallAccordion toolCalls={toolCalls} />
        )}
      </div>
    </div>
  )
}
