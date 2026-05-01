'use client'

import { memo } from 'react'
import { MarkdownContent } from './MarkdownContent'

interface Props {
  children: string
  className?: string
  isStreaming?: boolean
}

export const StreamingMarkdown = memo(({ children, className, isStreaming = false }: Props) => (
  <MarkdownContent streaming={isStreaming} className={className}>{children}</MarkdownContent>
))
StreamingMarkdown.displayName = 'StreamingMarkdown'
