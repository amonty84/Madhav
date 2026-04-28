'use client'

import { useEffect, useRef } from 'react'
import type { UIMessage } from 'ai'
import { StreamingMarkdown } from '@/components/chat/StreamingMarkdown'
import { StreamingDots } from '@/components/chat/StreamingDots'
import { AnswerView } from './AnswerView'
import { cn } from '@/lib/utils'

interface Props {
  messages: UIMessage[]
  isStreaming: boolean
  onStop?: () => void
  className?: string
}

/**
 * Flag-ON message renderer for the pipeline-v2 path.
 * Renders all messages with simplified bubbles; the last assistant message
 * uses AnswerView (with inline citation chips) when not streaming, and
 * StreamingMarkdown with a caret while streaming.
 *
 * Abort on unmount: when this component unmounts while streaming, it calls
 * onStop() to cancel the in-flight request via AbortController.
 */
export function StreamingAnswer({ messages, isStreaming, onStop, className }: Props) {
  const isStreamingRef = useRef(isStreaming)
  useEffect(() => {
    isStreamingRef.current = isStreaming
  }, [isStreaming])

  // Cancel in-flight request on unmount (navigation away mid-stream)
  useEffect(() => {
    return () => {
      if (isStreamingRef.current && onStop) {
        onStop()
      }
    }
  }, [onStop])

  if (messages.length === 0) return null

  return (
    <div className={cn('flex flex-col', className)}>
      {messages.map((message, idx) => {
        const isLast = idx === messages.length - 1
        const textContent = extractText(message)

        if (message.role === 'user') {
          return (
            <div key={message.id} className="flex justify-end px-4 py-2">
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl bg-muted px-4 py-2.5',
                  'bt-body text-foreground'
                )}
              >
                {textContent}
              </div>
            </div>
          )
        }

        if (message.role === 'assistant') {
          const isCurrentlyStreaming = isLast && isStreaming
          return (
            <div key={message.id} className="px-4 py-2">
              {isCurrentlyStreaming ? (
                textContent ? (
                  <StreamingMarkdown isStreaming>
                    {textContent}
                  </StreamingMarkdown>
                ) : (
                  <StreamingDots />
                )
              ) : (
                <AnswerView text={textContent} />
              )}
            </div>
          )
        }

        return null
      })}
    </div>
  )
}

function extractText(message: UIMessage): string {
  if (!message.parts) return ''
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map(p => p.text)
    .join('')
}
