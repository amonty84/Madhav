import { describe, it, expect } from 'vitest'
import { parseCitations, stripCitations } from '../citation-parser'

describe('parseCitations', () => {
  it('returns single text segment for plain text with no markers', () => {
    const { segments, citations } = parseCitations('Hello world')
    expect(segments).toHaveLength(1)
    expect(segments[0]).toEqual({ kind: 'text', text: 'Hello world' })
    expect(citations).toHaveLength(0)
  })

  it('parses a single signal marker', () => {
    const { segments, citations } = parseCitations('See [signal:S0042] for detail.')
    expect(segments).toHaveLength(3)
    expect(segments[0]).toEqual({ kind: 'text', text: 'See ' })
    expect(segments[1].kind).toBe('citation')
    expect(segments[1].citation).toMatchObject({ type: 'signal', id: 'S0042', marker: '[signal:S0042]' })
    expect(segments[2]).toEqual({ kind: 'text', text: ' for detail.' })
    expect(citations).toHaveLength(1)
    expect(citations[0].type).toBe('signal')
  })

  it('parses asset and chunk variants', () => {
    const { citations } = parseCitations('Refs: [asset:CGM] and [chunk:rag-abc-123]')
    expect(citations).toHaveLength(2)
    expect(citations[0]).toMatchObject({ type: 'asset', id: 'CGM' })
    expect(citations[1]).toMatchObject({ type: 'chunk', id: 'rag-abc-123' })
  })

  it('deduplicates repeated identical markers in the citations list', () => {
    const { segments, citations } = parseCitations('[signal:S0001] and [signal:S0001] again')
    // segments has 2 citation segments but citations list deduplicates
    expect(citations).toHaveLength(1)
    const citationSegments = segments.filter(s => s.kind === 'citation')
    expect(citationSegments).toHaveLength(2)
  })

  it('handles marker at start of string', () => {
    const { segments } = parseCitations('[asset:MSR] is the signal registry.')
    expect(segments[0].kind).toBe('citation')
    expect(segments[1]).toEqual({ kind: 'text', text: ' is the signal registry.' })
  })

  it('handles marker at end of string', () => {
    const { segments } = parseCitations('The source is [chunk:c-99]')
    expect(segments[0]).toEqual({ kind: 'text', text: 'The source is ' })
    expect(segments[1].kind).toBe('citation')
  })

  it('handles adjacent markers with no text between', () => {
    const { segments, citations } = parseCitations('[signal:S0001][signal:S0002]')
    const citationSegs = segments.filter(s => s.kind === 'citation')
    expect(citationSegs).toHaveLength(2)
    expect(citations).toHaveLength(2)
  })

  it('returns empty segments for empty string', () => {
    const { segments, citations } = parseCitations('')
    expect(segments).toHaveLength(0)
    expect(citations).toHaveLength(0)
  })

  it('ignores malformed markers without closing bracket', () => {
    const { segments, citations } = parseCitations('Bad [signal:S0042 marker')
    expect(citations).toHaveLength(0)
    expect(segments[0].kind).toBe('text')
  })

  it('trims whitespace from id', () => {
    const { citations } = parseCitations('[signal: S0042 ]')
    expect(citations[0].id).toBe('S0042')
  })
})

describe('stripCitations', () => {
  it('removes all citation markers from text', () => {
    const result = stripCitations('See [signal:S0042] and [asset:CGM] here.')
    expect(result).toBe('See  and  here.')
  })

  it('returns text unchanged when no markers', () => {
    expect(stripCitations('plain text')).toBe('plain text')
  })
})
