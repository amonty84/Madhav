'use client'

import { memo } from 'react'
import { MarkdownContent } from './MarkdownContent'

interface Props {
  children: string
  className?: string
}

export const Markdown = memo(({ children, className }: Props) => (
  <MarkdownContent streaming={false} className={className}>{children}</MarkdownContent>
))
Markdown.displayName = 'Markdown'
