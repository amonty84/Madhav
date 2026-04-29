import { tool } from 'ai'
import { z } from 'zod'
import { query } from '@/lib/db/client'

export const query_dasha = tool({
  description:
    'Query dasha balance facts from the chart_facts table (category=dasha_balance). ' +
    'Use this when the user asks: "what is the Vimshottari dasha balance at birth?", ' +
    '"when does Saturn mahadasha start?", ' +
    '"show all antardasha periods under Rahu mahadasha", ' +
    '"what dasha was running in 2019?", ' +
    '"get the balance of Moon dasha at birth for computing active periods". ' +
    'Returns structured fact rows with fact_id, value_text, value_number, value_json, source_section. ' +
    'For ephemeris date-by-date queries use query_planet_position instead.',
  inputSchema: z.object({
    system: z.enum(['vimshottari', 'yogini', 'chara']).optional().describe(
      'Dasha system to filter by. Omit for all systems.'
    ),
    planet: z.string().optional().describe(
      'Filter to a specific planet dasha (e.g. Saturn, Rahu, Jupiter). Case-insensitive substring match.'
    ),
    limit: z.number().int().min(1).max(100).default(30).describe(
      'Maximum rows to return (default 30).'
    ),
  }),
  execute: async ({ system, planet, limit }) => {
    try {
      const conditions: string[] = [`category = 'dasha_balance'`]
      const params: (string | number)[] = []
      let idx = 1

      if (system) {
        conditions.push(`value_text ILIKE $${idx++}`)
        params.push(`%${system}%`)
      }
      if (planet) {
        conditions.push(`(fact_id ILIKE $${idx} OR value_text ILIKE $${idx})`)
        params.push(`%${planet}%`)
        idx++
      }

      const sql = `
        SELECT fact_id, divisional_chart, value_text, value_number, value_json, source_section
        FROM chart_facts
        WHERE ${conditions.join(' AND ')}
        ORDER BY fact_id ASC
        LIMIT $${idx}
      `
      params.push(limit)
      const { rows } = await query(sql, params)
      return { count: rows.length, dasha_facts: rows }
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) }
    }
  },
})
