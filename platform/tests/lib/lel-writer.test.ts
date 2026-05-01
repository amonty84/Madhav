import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { writeFile, readFile, rm } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'

vi.mock('server-only', () => ({}))

import { parseLELMarkdown } from '../../src/lib/lel/parser'

// We test the writer against a real temp file to avoid ESM fs/promises mock issues.
// The writer is called with CORPUS_ROOT pointing to a temp dir containing a fake LEL.

const BASE_MARKDOWN = `---
version: 1.2
document: LIFE EVENT LOG
---

## §3 — EVENT LOG (CHRONOLOGICAL)

\`\`\`yaml
EVT.2024.07.15.01:
  date: 2024-07-15
  category: career
  description: First Marsys contract signed.
  magnitude: major
  valence: positive
  chart_state_at_event:
    vimshottari_md: Mercury
    vimshottari_ad: Saturn
    vimshottari_id: DSH.V.042
    transits_of_note: ["Saturn transit 10H"]
  retrodictive_match:
    predicted_by_chart: yes
    signals_that_matched: [SIG.01]
    signals_that_missed: []
\`\`\`

## §4 — CHRONIC PATTERNS AND UNDATED TRAITS

Some content here.
`

let tmpDir: string
let lelFile: string
let originalCorpusRoot: string | undefined

beforeEach(async () => {
  // Reset modules FIRST so the next getWriter() loads fresh after CORPUS_ROOT is set
  vi.resetModules()

  tmpDir = join(tmpdir(), `lel-writer-test-${Date.now()}`)
  const factsDir = join(tmpDir, '01_FACTS_LAYER')

  const { mkdir } = await import('fs/promises')
  await mkdir(factsDir, { recursive: true })

  lelFile = join(factsDir, 'LIFE_EVENT_LOG_v1_2.md')
  await writeFile(lelFile, BASE_MARKDOWN, 'utf-8')

  originalCorpusRoot = process.env.CORPUS_ROOT
  process.env.CORPUS_ROOT = tmpDir
})

afterEach(async () => {
  if (originalCorpusRoot === undefined) {
    delete process.env.CORPUS_ROOT
  } else {
    process.env.CORPUS_ROOT = originalCorpusRoot
  }
  await rm(tmpDir, { recursive: true, force: true })
})

async function getWriter() {
  // Dynamic import after CORPUS_ROOT is set and vi.resetModules() is clean
  return import('../../src/lib/lel/writer')
}

describe('LEL writer', () => {
  it('appendEvent writes a new YAML block and bumps frontmatter version', async () => {
    const { appendEvent } = await getWriter()

    const result = await appendEvent('chart-123', {
      date: '2026-04-30',
      category: 'career',
      description: 'Test event for unit test.',
      magnitude: 'moderate',
      valence: 'positive',
    })

    expect(result.id).toMatch(/^EVT\.2026\.04\.30\./)

    const written = await readFile(lelFile, 'utf-8')
    expect(written).toContain(result.id)
    expect(written).toContain('Test event for unit test.')
    expect(written).toContain('chart_state_pending: true')
    expect(written).toMatch(/version:\s*1\.2\.\d+/)
  })

  it('appended event survives round-trip parse', async () => {
    const { appendEvent } = await getWriter()

    const result = await appendEvent('chart-123', {
      date: '2026-04-30',
      category: 'health',
      description: 'Round-trip test event.',
      magnitude: 'trivial',
      valence: 'neutral',
    })

    const written = await readFile(lelFile, 'utf-8')
    const { events } = parseLELMarkdown(written)
    const found = events.find(e => e.id === result.id)
    expect(found).toBeDefined()
    expect(found?.category).toBe('health')
    expect(found?.body).toContain('Round-trip test event.')
  })

  it('appendEvent inserts before §4 section', async () => {
    const { appendEvent } = await getWriter()

    await appendEvent('chart-123', {
      date: '2026-04-30',
      category: 'other',
      description: 'Insertion placement test.',
    })

    const written = await readFile(lelFile, 'utf-8')
    const eventPos = written.indexOf('Insertion placement test.')
    const section4Pos = written.indexOf('## §4 — CHRONIC PATTERNS')
    expect(eventPos).toBeGreaterThan(0)
    expect(eventPos).toBeLessThan(section4Pos)
  })

  it('appendPrediction writes a PRED block and bumps version', async () => {
    const { appendPrediction } = await getWriter()

    const result = await appendPrediction('chart-123', {
      chart_id: 'chart-123',
      horizon: 'Q4 2026',
      confidence: 0.75,
      falsifier: 'No contract by end of 2026.',
      body: 'A new contract will be signed.',
    })

    expect(result.id).toMatch(/^PRED\./)

    const written = await readFile(lelFile, 'utf-8')
    expect(written).toContain(result.id)
    expect(written).toContain('status: open')
    expect(written).toContain('0.75')

    const { predictions } = parseLELMarkdown(written)
    const found = predictions.find(p => p.id === result.id)
    expect(found).toBeDefined()
    expect(found?.confidence).toBe(0.75)
    expect(found?.status).toBe('open')
  })
})
