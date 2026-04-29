import 'server-only'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { parseLELMarkdown } from './parser'

export interface NewLELEvent {
  date: string
  category: string
  description: string
  magnitude?: 'trivial' | 'moderate' | 'significant' | 'major' | 'life-altering'
  valence?: 'positive' | 'mixed' | 'negative' | 'neutral'
  native_reflection?: string
}

export interface NewLELPrediction {
  chart_id: string
  horizon: string
  confidence: number
  falsifier: string
  body: string
}

function lelPath(): string {
  const root = process.env.CORPUS_ROOT ?? join(process.cwd(), '..')
  return join(root, '01_FACTS_LAYER', 'LIFE_EVENT_LOG_v1_2.md')
}

// In-process soft lock — prevents concurrent writes within the same Next.js process
let _writeLock: Promise<void> = Promise.resolve()

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = _writeLock.then(fn)
  // Detach errors from the lock chain so a failed write doesn't block future writes
  _writeLock = next.then(
    () => undefined,
    () => undefined
  )
  return next
}

function generateEventId(date: string): string {
  const ts = date.replace(/[^0-9X]/g, '.').replace(/\.$/, '')
  const now = Date.now().toString().slice(-2).padStart(2, '0')
  return `EVT.${ts}.${now}`
}

function generatePredictionId(): string {
  const now = new Date()
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '.')
  return `PRED.${datePart}.${String(now.getMilliseconds()).slice(0, 1).padStart(1, '1')}`
}

function bumpVersion(frontmatter: string): string {
  return frontmatter.replace(
    /^(version:\s*\d+\.\d+)\.?(\d*)$/m,
    (_, base, patch) => `${base}.${patch ? parseInt(patch) + 1 : 1}`
  )
}


function buildEventBlock(id: string, event: NewLELEvent): string {
  const lines: string[] = [
    '```yaml',
    `${id}:`,
    `  date: ${event.date}`,
    `  date_confidence: year-exact`,
    `  category: ${event.category}`,
    `  description: ${event.description}`,
    `  magnitude: ${event.magnitude ?? 'moderate'}`,
    `  valence: ${event.valence ?? 'neutral'}`,
  ]
  if (event.native_reflection) {
    lines.push(`  native_reflection: "${event.native_reflection.replace(/"/g, "'")}"`)
  }
  lines.push(
    '  chart_state_at_event:',
    '    chart_state_pending: true',
    '  retrodictive_match:',
    '    predicted_by_chart: unexamined',
    '    signals_that_matched: []',
    '    signals_that_missed: []',
    '```'
  )
  return lines.join('\n')
}

function buildPredictionBlock(id: string, pred: NewLELPrediction): string {
  const madeAt = new Date().toISOString().slice(0, 10)
  const lines: string[] = [
    '```yaml',
    `${id}:`,
    `  made_at: ${madeAt}`,
    `  chart_id: ${pred.chart_id}`,
    `  horizon: "${pred.horizon}"`,
    `  confidence: ${pred.confidence}`,
    `  falsifier: "${pred.falsifier}"`,
    `  body: "${pred.body.replace(/"/g, "'")}"`,
    '  status: open',
    '  outcome_logged_at: null',
    '  outcome_body: null',
    '```'
  ]
  return lines.join('\n')
}

export async function appendEvent(
  _chartId: string,
  event: NewLELEvent
): Promise<{ id: string }> {
  return withLock(async () => {
    const path = lelPath()
    const markdown = await readFile(path, 'utf-8')

    const id = generateEventId(event.date)
    const block = buildEventBlock(id, event)

    // Append to end of §3 EVENT LOG (before §4)
    const anchor = '\n\n## §4 — CHRONIC PATTERNS'
    const insertAt = markdown.indexOf(anchor)
    let updated: string
    if (insertAt !== -1) {
      updated = markdown.slice(0, insertAt) + '\n\n' + block + markdown.slice(insertAt)
    } else {
      updated = markdown + '\n\n' + block
    }

    // Bump frontmatter version
    updated = updated.replace(
      /^(version:\s*\S+)$/m,
      (match) => bumpVersion(match)
    )

    // Validate round-trip before writing
    const parsed = parseLELMarkdown(updated)
    const found = parsed.events.find(e => e.id === id)
    if (!found) throw new Error(`Round-trip validation failed: new event ${id} not found after write`)

    await writeFile(path, updated, 'utf-8')
    return { id }
  })
}

export async function appendPrediction(
  _chartId: string,
  pred: NewLELPrediction
): Promise<{ id: string }> {
  return withLock(async () => {
    const path = lelPath()
    const markdown = await readFile(path, 'utf-8')

    const id = generatePredictionId()
    const block = buildPredictionBlock(id, pred)

    // Append to end of §3 EVENT LOG (before §4), after events
    const anchor = '\n\n## §4 — CHRONIC PATTERNS'
    const insertAt = markdown.indexOf(anchor)
    let updated: string
    if (insertAt !== -1) {
      updated = markdown.slice(0, insertAt) + '\n\n' + block + markdown.slice(insertAt)
    } else {
      updated = markdown + '\n\n' + block
    }

    updated = updated.replace(/^(version:\s*\S+)$/m, (match) => bumpVersion(match))

    const parsed = parseLELMarkdown(updated)
    const found = parsed.predictions.find(p => p.id === id)
    if (!found) throw new Error(`Round-trip validation failed: new prediction ${id} not found after write`)

    await writeFile(path, updated, 'utf-8')
    return { id }
  })
}

export async function markPredictionOutcome(
  predId: string,
  outcome: { status: 'observed_confirmed' | 'observed_refuted'; body: string }
): Promise<void> {
  return withLock(async () => {
    const path = lelPath()
    const markdown = await readFile(path, 'utf-8')

    const loggedAt = new Date().toISOString().slice(0, 10)
    // Find the prediction block and update status/outcome fields
    const predBlockRe = new RegExp(
      `(${predId.replace(/\./g, '\\.')}:[\\s\\S]*?)(?=^` + '```' + `|$)`,
      'm'
    )
    if (!predBlockRe.test(markdown)) {
      throw new Error(`Prediction ${predId} not found in LEL`)
    }

    let updated = markdown
      .replace(new RegExp(`(${predId.replace(/\./g, '\\.')}:[\\s\\S]*?)  status: open`, 'm'),
        (m) => m.replace('  status: open', `  status: ${outcome.status}`))
      .replace(new RegExp(`(${predId.replace(/\./g, '\\.')}:[\\s\\S]*?)  outcome_logged_at: null`, 'm'),
        (m) => m.replace('  outcome_logged_at: null', `  outcome_logged_at: ${loggedAt}`))
      .replace(new RegExp(`(${predId.replace(/\./g, '\\.')}:[\\s\\S]*?)  outcome_body: null`, 'm'),
        (m) => m.replace('  outcome_body: null', `  outcome_body: "${outcome.body.replace(/"/g, "'")}"`)
      )

    updated = updated.replace(/^(version:\s*\S+)$/m, (match) => bumpVersion(match))

    const parsed = parseLELMarkdown(updated)
    const found = parsed.predictions.find(p => p.id === predId)
    if (!found || found.status !== outcome.status) {
      throw new Error(`Round-trip validation failed for outcome on ${predId}`)
    }

    await writeFile(path, updated, 'utf-8')
  })
}
