'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { StreamingDots } from './StreamingDots'

/**
 * Rendered between the moment the user sends a message and the moment the
 * assistant UIMessage object materialises. Mirrors AssistantMessage's avatar
 * column so there is no visual shift when the real message arrives.
 */
export function PendingAssistantBubble() {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="mx-auto w-full max-w-3xl px-4"
      aria-live="polite"
      aria-label="Assistant is thinking"
    >
      <div className="flex gap-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border/40 bg-background text-foreground shadow-sm">
          <Sparkles className="size-4" />
        </div>
        <div className="min-w-0 flex-1 pt-2">
          <StreamingDots />
        </div>
      </div>
    </motion.div>
  )
}
