/**
 * Parses citation markers embedded by the synthesis prompt in assistant answers.
 * Marker forms: [signal:S0042], [asset:CGM], [chunk:some-chunk-id]
 * Pure function — no side effects, no I/O.
 */

export type CitationType = 'signal' | 'asset' | 'chunk'

export interface Citation {
  type: CitationType
  id: string
  /** Unique key for React rendering — marker as it appears in the raw text */
  marker: string
}

export interface ParsedSegment {
  kind: 'text' | 'citation'
  text?: string
  citation?: Citation
}

export interface ParseResult {
  segments: ParsedSegment[]
  /** All unique citations found, in order of first appearance */
  citations: Citation[]
}

const CITATION_RE = /\[(signal|asset|chunk):([^\]]+)\]/g

/**
 * Parse a text string into alternating text and citation segments.
 * Each [signal:xxx], [asset:xxx], [chunk:xxx] marker becomes a citation segment.
 */
export function parseCitations(text: string): ParseResult {
  const segments: ParsedSegment[] = []
  const seenMarkers = new Set<string>()
  const citations: Citation[] = []

  let lastIndex = 0
  let match: RegExpExecArray | null

  CITATION_RE.lastIndex = 0
  while ((match = CITATION_RE.exec(text)) !== null) {
    const [fullMatch, rawType, id] = match
    const type = rawType as CitationType

    if (match.index > lastIndex) {
      segments.push({ kind: 'text', text: text.slice(lastIndex, match.index) })
    }

    const marker = fullMatch
    const citation: Citation = { type, id: id.trim(), marker }
    segments.push({ kind: 'citation', citation })

    if (!seenMarkers.has(marker)) {
      seenMarkers.add(marker)
      citations.push(citation)
    }

    lastIndex = match.index + fullMatch.length
  }

  if (lastIndex < text.length) {
    segments.push({ kind: 'text', text: text.slice(lastIndex) })
  }

  return { segments, citations }
}

/** Strip all citation markers from text (for use in plain-text contexts). */
export function stripCitations(text: string): string {
  return text.replace(CITATION_RE, '')
}
