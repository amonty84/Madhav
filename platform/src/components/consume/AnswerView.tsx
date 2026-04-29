'use client'

import { memo, useMemo } from 'react'
import { parseCitations, type ParsedSegment } from '@/lib/ui/citation-parser'
import { CitationChip } from '@/components/citations/CitationChip'
import { StreamingMarkdown } from '@/components/chat/StreamingMarkdown'

interface Props {
  text: string
  className?: string
}

/**
 * Renders a finalized synthesis answer with inline citation chips.
 * Citation markers ([signal:...], [asset:...], [chunk:...]) are replaced
 * with interactive CitationChip pills; remaining text is markdown-rendered.
 *
 * Used for completed (non-streaming) pipeline-v2 messages.
 */
function AnswerViewImpl({ text, className }: Props) {
  const { segments } = useMemo(() => parseCitations(text), [text])

  // Split segments into markdown runs separated by citation chips.
  // react-markdown requires a full string, so we reconstruct text blocks
  // and interleave chips using a key-indexed span approach.
  const nodes = useMemo(() => buildNodes(segments), [segments])

  return (
    <div className={className}>
      {nodes.map((node, i) => {
        if (node.type === 'markdown') {
          return (
            <StreamingMarkdown key={i} isStreaming={false}>
              {node.content}
            </StreamingMarkdown>
          )
        }
        return (
          <CitationChip
            key={i}
            type={node.citationType}
            id={node.citationId}
            className="mx-0.5 align-middle"
          />
        )
      })}
    </div>
  )
}

type MarkdownNode = { type: 'markdown'; content: string }
type ChipNode = { type: 'chip'; citationType: 'signal' | 'asset' | 'chunk'; citationId: string }
type RenderNode = MarkdownNode | ChipNode

function buildNodes(segments: ParsedSegment[]): RenderNode[] {
  const nodes: RenderNode[] = []
  let textBuf = ''

  for (const seg of segments) {
    if (seg.kind === 'text') {
      textBuf += seg.text ?? ''
    } else if (seg.kind === 'citation' && seg.citation) {
      if (textBuf.trim()) {
        nodes.push({ type: 'markdown', content: textBuf })
        textBuf = ''
      } else {
        textBuf = ''
      }
      nodes.push({
        type: 'chip',
        citationType: seg.citation.type,
        citationId: seg.citation.id,
      })
    }
  }

  if (textBuf.trim()) {
    nodes.push({ type: 'markdown', content: textBuf })
  }

  return nodes
}

export const AnswerView = memo(AnswerViewImpl)
