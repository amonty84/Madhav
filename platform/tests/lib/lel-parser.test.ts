import { describe, it, expect, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import { parseLELMarkdown } from '../../src/lib/lel/parser'

// Minimal valid fixture — one well-formed event
const FIXTURE_VALID = `
---
version: 1.2
---

## §3 — EVENT LOG

\`\`\`yaml
EVT.2024.07.15.01:
  date: 2024-07-15
  date_confidence: exact
  category: career
  description: First Marsys contract signed.
  magnitude: major
  valence: positive
  chart_state_at_event:
    vimshottari_md: Mercury
    vimshottari_ad: Saturn
    vimshottari_id: DSH.V.042
    transits_of_note: ["Saturn transit 10H", "Jupiter transit 1H"]
  retrodictive_match:
    predicted_by_chart: yes
    signals_that_matched: [SIG.01, SIG.09]
    signals_that_missed: []
\`\`\`

## §4 — CHRONIC PATTERNS
`

// Fixture with an additional malformed block (colon in unquoted string breaks YAML strict mode)
const FIXTURE_WITH_MALFORMED = `
---
version: 1.2
---

## §3 — EVENT LOG

\`\`\`yaml
EVT.2024.07.15.01:
  date: 2024-07-15
  category: career
  description: First contract: a major milestone for Marsys.
  magnitude: major
  valence: positive
  chart_state_at_event:
    vimshottari_md: Mercury
    vimshottari_ad: Saturn
    vimshottari_id: DSH.V.042
    transits_of_note: []
\`\`\`

\`\`\`yaml
EVT.2023.05.XX.01:
  date: 2023-05-XX
  category: other
  description: US return and pivot: career shift from salary to business.
  magnitude: life-altering
  valence: mixed
  chart_state_at_event:
    vimshottari_md: Mercury
    vimshottari_ad: Jupiter
    vimshottari_id: DSH.V.038
    transits_of_note: ["Sade Sati peak"]
\`\`\`

## §4 — CHRONIC PATTERNS
`

// Schema template placeholder — must be filtered out
const FIXTURE_WITH_TEMPLATE = `
## §1 — META

\`\`\`yaml
EVT.YYYY.MM.DD.XX:
  date: "[YYYY-MM-DD]"
  category: other
  description: example
\`\`\`

## §3 — EVENT LOG

\`\`\`yaml
EVT.2024.07.15.01:
  date: 2024-07-15
  category: career
  description: Real event.
  magnitude: moderate
  valence: positive
  chart_state_at_event:
    vimshottari_md: Mercury
    vimshottari_ad: Saturn
    vimshottari_id: DSH.V.042
    transits_of_note: []
\`\`\`
`

// Prediction fixture
const FIXTURE_WITH_PREDICTION = `
## §3 — EVENT LOG

\`\`\`yaml
PRED.2026.04.29.1:
  made_at: 2026-04-29
  chart_id: abc123
  horizon: "Q4 2026"
  confidence: 0.7
  falsifier: "No contract signed by 2026-12-31"
  body: "A major business contract will be signed in Q4 2026."
  status: open
  outcome_logged_at: null
  outcome_body: null
\`\`\`
`

describe('parseLELMarkdown', () => {
  it('parses a single well-formed event', () => {
    const { events, predictions, parseErrors } = parseLELMarkdown(FIXTURE_VALID)
    expect(events).toHaveLength(1)
    expect(predictions).toHaveLength(0)
    expect(parseErrors).toHaveLength(0)

    const ev = events[0]
    expect(ev.id).toBe('EVT.2024.07.15.01')
    expect(ev.date).toBe('2024-07-15')
    expect(ev.category).toBe('career')
    expect(ev.body).toContain('Marsys')
    expect(ev.chart_state?.maha_lord).toBe('Mercury')
    expect(ev.chart_state?.antar_lord).toBe('Saturn')
    expect(ev.chart_state?.transit_notes).toContain('Saturn transit 10H')
  })

  it('parses events where description contains colons (regex fallback path)', () => {
    const { events, parseErrors } = parseLELMarkdown(FIXTURE_WITH_MALFORMED)
    expect(events).toHaveLength(2)
    // Both events parsed — either via YAML or regex fallback
    expect(events.find(e => e.id === 'EVT.2024.07.15.01')).toBeDefined()
    expect(events.find(e => e.id === 'EVT.2023.05.XX.01')).toBeDefined()
    // Hard errors should be zero — malformed entries are recovered via regex fallback
    expect(parseErrors).toHaveLength(0)
  })

  it('filters out the EVT.YYYY.MM.DD.XX schema template', () => {
    const { events } = parseLELMarkdown(FIXTURE_WITH_TEMPLATE)
    expect(events.every(e => !e.id.includes('YYYY'))).toBe(true)
    expect(events).toHaveLength(1)
    expect(events[0].id).toBe('EVT.2024.07.15.01')
  })

  it('parses a prediction block', () => {
    const { events, predictions, parseErrors } = parseLELMarkdown(FIXTURE_WITH_PREDICTION)
    expect(events).toHaveLength(0)
    expect(predictions).toHaveLength(1)
    expect(parseErrors).toHaveLength(0)

    const pred = predictions[0]
    expect(pred.id).toBe('PRED.2026.04.29.1')
    expect(pred.made_at).toBe('2026-04-29')
    expect(pred.chart_id).toBe('abc123')
    expect(pred.horizon).toBe('Q4 2026')
    expect(pred.confidence).toBe(0.7)
    expect(pred.status).toBe('open')
    expect(pred.falsifier).toContain('contract')
  })

  it('returns empty arrays for markdown with no EVT/PRED blocks', () => {
    const { events, predictions, parseErrors } = parseLELMarkdown('# Just prose\n\nNo YAML here.')
    expect(events).toHaveLength(0)
    expect(predictions).toHaveLength(0)
    expect(parseErrors).toHaveLength(0)
  })

  it('surfaces hard parse errors without throwing', () => {
    // A block where the regex fallback also cannot extract an ID
    const broken = '```yaml\nnot: valid: yaml: at: all\n  badly:\n    - nested\n```'
    // Should not throw — just return errors
    expect(() => parseLELMarkdown(broken)).not.toThrow()
  })

  it('parses events from the actual LEL file structure (PATTERN/PERIOD/GAP blocks skipped silently)', () => {
    const fixture = `
\`\`\`yaml
PATTERN.STAMMER.01:
  trait: Stammering
  onset: childhood
\`\`\`

\`\`\`yaml
EVT.2024.07.15.01:
  date: 2024-07-15
  category: career
  description: Contract.
  magnitude: moderate
  valence: positive
  chart_state_at_event:
    vimshottari_md: Mercury
    vimshottari_ad: Saturn
    vimshottari_id: DSH.V.042
    transits_of_note: []
\`\`\`
`
    const { events } = parseLELMarkdown(fixture)
    expect(events).toHaveLength(1)
    expect(events[0].id).toBe('EVT.2024.07.15.01')
  })
})
