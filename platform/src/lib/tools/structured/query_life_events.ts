import { tool } from 'ai'
import { z } from 'zod'
import { query } from '@/lib/db/client'

export const query_life_events = tool({
  description:
    'Query the life_events table — 36 key events from LIFE_EVENT_LOG_v1_2.md with Swiss Ephemeris chart_state snapshots. ' +
    'Use this when the user asks: "what major events happened during Saturn dasha?", ' +
    '"show all career events between 2015 and 2022", ' +
    '"what was the chart state at the time of marriage?", ' +
    '"find health events after 2020", ' +
    '"list family events and their astrological context". ' +
    'Returns event_id, event_date, category, description, significance, chart_state (JSONB with planets/dashas), source_section.',
  inputSchema: z.object({
    start_date: z.string().optional().describe('Filter events on or after this date (YYYY-MM-DD).'),
    end_date: z.string().optional().describe('Filter events on or before this date (YYYY-MM-DD).'),
    category: z.enum([
      'career', 'health', 'family', 'marriage', 'spiritual', 'travel', 'finance', 'education', 'relocation',
    ]).optional().describe('Filter by life event category. Omit for all categories.'),
    significance: z.enum(['major', 'moderate', 'minor']).optional().describe(
      'Filter by significance level. Omit for all.'
    ),
  }),
  execute: async ({ start_date, end_date, category, significance }) => {
    try {
      const conditions: string[] = []
      const params: (string | number)[] = []
      let idx = 1

      if (start_date) {
        conditions.push(`event_date >= $${idx++}`)
        params.push(start_date)
      }
      if (end_date) {
        conditions.push(`event_date <= $${idx++}`)
        params.push(end_date)
      }
      if (category) {
        conditions.push(`category = $${idx++}`)
        params.push(category)
      }
      if (significance) {
        conditions.push(`significance = $${idx++}`)
        params.push(significance)
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
      const sql = `
        SELECT event_id, event_date, category, description, significance,
               chart_state, source_section
        FROM life_events
        ${where}
        ORDER BY event_date ASC
        LIMIT 50
      `
      const { rows } = await query(sql, params)
      return { count: rows.length, events: rows }
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) }
    }
  },
})
