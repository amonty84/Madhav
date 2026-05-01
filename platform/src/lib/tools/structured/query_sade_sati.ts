import { tool } from 'ai'
import { z } from 'zod'
import { query } from '@/lib/db/client'

export const query_sade_sati = tool({
  description:
    'Query the sade_sati_phases table — Saturn Sade Sati cycle data across all 4 cycles (pre-birth + 3 lifetime). ' +
    'Use this when the user asks: "am I currently in Sade Sati?", ' +
    '"when was the peak of the second Sade Sati cycle?", ' +
    '"what Sade Sati phase was active in 2022?", ' +
    '"show all Sade Sati rising/peak/setting phases", ' +
    '"when does the current Sade Sati end?". ' +
    'Returns cycle_number, phase (rising/peak/setting/pre_birth/gap), start_date, end_date, saturn_sign_at_start, notes.',
  inputSchema: z.object({
    date: z.string().optional().describe(
      'Find phases active on this date (YYYY-MM-DD). Returns phases where start_date <= date <= end_date.'
    ),
    cycle_number: z.number().int().min(0).max(4).optional().describe(
      'Filter to a specific cycle (0=pre-birth, 1–3 = lifetime cycles). Omit for all cycles.'
    ),
    phase: z.enum(['pre_birth', 'rising', 'peak', 'setting', 'gap']).optional().describe(
      'Filter by phase type. Omit for all phases.'
    ),
  }),
  execute: async ({ date, cycle_number, phase }) => {
    try {
      const conditions: string[] = []
      const params: (string | number)[] = []
      let idx = 1

      if (date) {
        conditions.push(`start_date <= $${idx} AND end_date >= $${idx}`)
        params.push(date)
        idx++
      }
      if (cycle_number !== undefined) {
        conditions.push(`cycle_number = $${idx++}`)
        params.push(cycle_number)
      }
      if (phase) {
        conditions.push(`phase = $${idx++}`)
        params.push(phase)
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
      const sql = `
        SELECT cycle_number, phase, start_date, end_date, saturn_sign_at_start, notes, source_section
        FROM sade_sati_phases
        ${where}
        ORDER BY start_date ASC
      `
      const { rows } = await query(sql, params)
      return { count: rows.length, phases: rows }
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) }
    }
  },
})
