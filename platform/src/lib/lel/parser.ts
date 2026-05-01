import 'server-only'
import { readFile } from 'fs/promises'
import { join } from 'path'
import jsYaml from 'js-yaml'

export interface LELEvent {
  id: string
  date: string
  category: string
  body: string
  chart_state?: {
    maha_lord?: string
    antar_lord?: string
    pratyantar_lord?: string
    transit_notes?: string
  }
  source?: string
  confidence?: number
}

export interface LELPrediction {
  id: string
  made_at: string
  chart_id: string
  horizon: string
  confidence: number
  falsifier: string
  body: string
  status: 'open' | 'observed_confirmed' | 'observed_refuted' | 'expired'
  outcome_logged_at?: string
  outcome_body?: string
}

export interface ParseResult {
  events: LELEvent[]
  predictions: LELPrediction[]
  parseErrors: string[]
}

function lelPath(): string {
  const root = process.env.CORPUS_ROOT ?? join(process.cwd(), '..')
  return join(root, '01_FACTS_LAYER', 'LIFE_EVENT_LOG_v1_2.md')
}

// js-yaml parses bare ISO dates (e.g. 2024-07-15) as JS Date objects. Normalize back to string.
function toDateStr(val: unknown): string {
  if (val instanceof Date) return val.toISOString().slice(0, 10)
  return String(val ?? '')
}

function extractYamlBlocks(markdown: string): string[] {
  const blocks: string[] = []
  const re = /^```yaml\n([\s\S]*?)^```/gm
  let m: RegExpExecArray | null
  while ((m = re.exec(markdown)) !== null) {
    blocks.push(m[1])
  }
  return blocks
}

// Scalar extraction for fields that may contain unquoted colons — regex fallback
function scalarField(block: string, field: string): string | undefined {
  const re = new RegExp(`^  ${field}:\\s*(.+)$`, 'm')
  const m = re.exec(block)
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : undefined
}

function nestedScalar(block: string, parent: string, field: string): string | undefined {
  const parentRe = new RegExp(`^  ${parent}:[\\s\\S]*?(?=^  \\w|$)`, 'm')
  const parentSection = parentRe.exec(block)
  if (!parentSection) return undefined
  const re = new RegExp(`^    ${field}:\\s*(.+)$`, 'm')
  const m = re.exec(parentSection[0])
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : undefined
}

function nestedList(block: string, parent: string, field: string): string | undefined {
  // Handles both inline lists [...] and block lists
  const parentRe = new RegExp(`^  ${parent}:[\\s\\S]*?(?=^  \\w|$)`, 'm')
  const parentSection = parentRe.exec(block)
  if (!parentSection) return undefined
  const re = new RegExp(`^    ${field}:\\s*(\\[.*?\\]|.+)$`, 'm')
  const m = re.exec(parentSection[0])
  if (!m) return undefined
  const raw = m[1].trim()
  if (raw.startsWith('[')) {
    // inline list — strip brackets and join
    return raw.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).join('; ')
  }
  return raw.replace(/^['"]|['"]$/g, '')
}

function regexExtractEntry(_id: string, block: string): Record<string, unknown> {
  return {
    date: scalarField(block, 'date') ?? scalarField(block, 'made_at') ?? '',
    category: scalarField(block, 'category') ?? 'other',
    description:
      scalarField(block, 'description') ??
      scalarField(block, 'body') ??
      scalarField(block, 'characterization') ??
      '',
    confidence: (() => {
      const v = scalarField(block, 'confidence')
      return v ? parseFloat(v) : undefined
    })(),
    chart_state_at_event: {
      vimshottari_md: nestedScalar(block, 'chart_state_at_event', 'vimshottari_md'),
      vimshottari_ad: nestedScalar(block, 'chart_state_at_event', 'vimshottari_ad'),
      vimshottari_id: nestedScalar(block, 'chart_state_at_event', 'vimshottari_id'),
      transits_of_note: nestedList(block, 'chart_state_at_event', 'transits_of_note'),
    },
    // Prediction fields
    made_at: scalarField(block, 'made_at'),
    chart_id: scalarField(block, 'chart_id'),
    horizon: scalarField(block, 'horizon'),
    falsifier: scalarField(block, 'falsifier'),
    body: scalarField(block, 'body') ?? scalarField(block, 'description') ?? '',
    status: scalarField(block, 'status'),
    outcome_logged_at: scalarField(block, 'outcome_logged_at'),
    outcome_body: scalarField(block, 'outcome_body'),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseEventBlock(id: string, raw: Record<string, any>): LELEvent {
  const chartRaw = raw['chart_state_at_event'] ?? raw['chart_state']
  let chart: LELEvent['chart_state'] | undefined
  if (chartRaw && typeof chartRaw === 'object') {
    const transitsRaw = chartRaw['transits_of_note']
    chart = {
      maha_lord: chartRaw['vimshottari_md'] ?? undefined,
      antar_lord: chartRaw['vimshottari_ad'] ?? undefined,
      pratyantar_lord: chartRaw['vimshottari_id'] ?? undefined,
      transit_notes: Array.isArray(transitsRaw)
        ? transitsRaw.join('; ')
        : typeof transitsRaw === 'string'
          ? transitsRaw
          : undefined,
    }
  }

  return {
    id,
    date: toDateStr(raw['date']),
    category: String(raw['category'] ?? 'other'),
    body: String(raw['description'] ?? raw['body'] ?? raw['characterization'] ?? ''),
    chart_state: chart,
    confidence: typeof raw['confidence'] === 'number' ? raw['confidence'] : undefined,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parsePredictionBlock(id: string, raw: Record<string, any>): LELPrediction {
  const validStatuses = ['open', 'observed_confirmed', 'observed_refuted', 'expired'] as const
  return {
    id,
    made_at: toDateStr(raw['made_at']),
    chart_id: String(raw['chart_id'] ?? ''),
    horizon: String(raw['horizon'] ?? ''),
    confidence: typeof raw['confidence'] === 'number' ? raw['confidence'] : 0,
    falsifier: String(raw['falsifier'] ?? ''),
    body: String(raw['body'] ?? raw['description'] ?? ''),
    status: validStatuses.includes(raw['status'])
      ? (raw['status'] as LELPrediction['status'])
      : 'open',
    outcome_logged_at: raw['outcome_logged_at'] ? String(raw['outcome_logged_at']) : undefined,
    outcome_body: raw['outcome_body'] ? String(raw['outcome_body']) : undefined,
  }
}

// Parse one YAML block — tries js-yaml first, falls back to regex extraction
function parseBlock(
  block: string
): { entries: Array<{ id: string; raw: Record<string, unknown> }>; error?: string } {
  // Try strict YAML parse first
  try {
    const parsed = jsYaml.load(block)
    if (parsed && typeof parsed === 'object') {
      const obj = parsed as Record<string, unknown>
      const entries: Array<{ id: string; raw: Record<string, unknown> }> = []
      for (const [key, val] of Object.entries(obj)) {
        if ((key.startsWith('EVT.') || key.startsWith('PRED.')) && val && typeof val === 'object') {
          entries.push({ id: key, raw: val as Record<string, unknown> })
        }
      }
      if (entries.length > 0) return { entries }
    }
  } catch {
    // fall through to regex extraction
  }

  // Regex fallback — find event/prediction ID in the block
  const idMatch = /^(EVT\.[A-Z0-9X.]+|PRED\.[A-Z0-9.]+):/m.exec(block)
  if (!idMatch) return { entries: [] }
  // Skip schema template placeholder
  if (idMatch[1].includes('YYYY')) return { entries: [] }

  const id = idMatch[1]
  try {
    const raw = regexExtractEntry(id, block)
    return { entries: [{ id, raw }] }
  } catch (e) {
    return {
      entries: [],
      error: `Regex fallback failed for ${id}: ${e instanceof Error ? e.message : String(e)}`,
    }
  }
}

export async function parseLEL(
  _chartId?: string,
  overridePath?: string
): Promise<ParseResult> {
  const filePath = overridePath ?? lelPath()
  const markdown = await readFile(filePath, 'utf-8')
  return parseLELMarkdown(markdown)
}

export function parseLELMarkdown(markdown: string): ParseResult {
  const events: LELEvent[] = []
  const predictions: LELPrediction[] = []
  const parseErrors: string[] = []

  const blocks = extractYamlBlocks(markdown)

  for (const block of blocks) {
    const { entries, error } = parseBlock(block)
    if (error) parseErrors.push(error)

    for (const { id, raw } of entries) {
      try {
        if (id.startsWith('EVT.')) {
          // Skip schema template entry (§1.4 example placeholder)
          if (id.includes('YYYY')) continue
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          events.push(parseEventBlock(id, raw as Record<string, any>))
        } else if (id.startsWith('PRED.')) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          predictions.push(parsePredictionBlock(id, raw as Record<string, any>))
        }
      } catch (e) {
        parseErrors.push(
          `Entry parse error for ${id}: ${e instanceof Error ? e.message : String(e)}`
        )
      }
    }
  }

  return { events, predictions, parseErrors }
}
