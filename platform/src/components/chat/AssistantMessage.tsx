'use client'

import type { UIMessage } from 'ai'
import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Markdown } from './Markdown'
import { ToolCallCard } from './ToolCallCard'
import { StreamingDots, StreamingCaret } from './StreamingDots'
import { MessageActions } from './MessageActions'
import type { Rating } from '@/hooks/useFeedback'

function extractText(message: UIMessage): string {
  return message.parts
    .filter(p => p.type === 'text')
    .map(p => (p as { type: 'text'; text: string }).text)
    .join('')
}

interface ToolPart {
  type: string
  state: string
  toolCallId: string
  input?: unknown
  output?: unknown
  errorText?: string
}

function isToolPart(part: unknown): part is ToolPart {
  if (!part || typeof part !== 'object') return false
  const p = part as { type?: unknown }
  return typeof p.type === 'string' && (p.type.startsWith('tool-') || p.type === 'dynamic-tool')
}

function getToolName(part: ToolPart): string {
  if (part.type === 'dynamic-tool') {
    const dyn = part as unknown as { toolName?: string }
    return dyn.toolName ?? 'tool'
  }
  return part.type.replace(/^tool-/, '')
}

interface Props {
  message: UIMessage
  isStreaming: boolean
  isLast: boolean
  onRegenerate?: () => void
  rating?: Rating
  onRate?: (rating: Rating) => void
}

export function AssistantMessage({ message, isStreaming, isLast, onRegenerate, rating, onRate }: Props) {
  const reduce = useReducedMotion()
  const text = extractText(message)
  const hasAnyContent = message.parts.some(p => {
    if (p.type === 'text') return (p as { text: string }).text.length > 0
    if (isToolPart(p)) return true
    if (p.type === 'reasoning') return true
    return false
  })

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
    } catch {}
  }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="group/message mx-auto w-full max-w-3xl px-4"
    >
      <div className="flex gap-3">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground">
          <Sparkles className="size-3.5" />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          {!hasAnyContent && isStreaming && isLast && (
            <div className="py-1.5">
              <StreamingDots />
            </div>
          )}
          {message.parts.map((part, idx) => {
            if (part.type === 'text') {
              const isLastTextPart = idx === message.parts.length - 1
              const streamingThisPart = isStreaming && isLast && isLastTextPart
              return (
                <div key={idx}>
                  <Markdown isStreaming={streamingThisPart}>{(part as { text: string }).text}</Markdown>
                  {streamingThisPart && <StreamingCaret />}
                </div>
              )
            }
            if (isToolPart(part)) {
              return (
                <ToolCallCard
                  key={part.toolCallId || idx}
                  toolName={getToolName(part)}
                  state={part.state}
                  input={part.input}
                  output={part.output}
                  errorText={part.errorText}
                />
              )
            }
            if (part.type === 'reasoning') {
              const reasoning = (part as { text: string }).text
              if (!reasoning) return null
              return (
                <details key={idx} className="my-3 rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    Reasoning
                  </summary>
                  <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{reasoning}</p>
                </details>
              )
            }
            return null
          })}
          {!isStreaming && hasAnyContent && (
            <div className="mt-1 -ml-1.5 opacity-0 transition-opacity duration-150 group-hover/message:opacity-100 focus-within:opacity-100">
              <MessageActions
                onCopy={copy}
                onRegenerate={isLast ? onRegenerate : undefined}
                rating={rating}
                onRate={onRate}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
