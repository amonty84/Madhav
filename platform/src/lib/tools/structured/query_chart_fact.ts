import { tool } from 'ai'
import { z } from 'zod'
import { query } from '@/lib/db/client'

export const query_chart_fact = tool({
  description:
    'Query the L1 chart_facts table — the structured projection of FORENSIC_ASTROLOGICAL_DATA_v8_0.md. ' +
    'Use this when the user asks: "what is Saturn\'s longitude in the natal chart?", ' +
    '"show me all D9 navamsa placements", "what is the ascendant degree?", ' +
    '"find all yogas in the chart", "what are the KP sub-lord cusps?", ' +
    '"get all planets in Aries", "what are the dasha balance values?". ' +
    'Returns structured fact rows with fact_id, category, value_text, value_number, and source_section. ' +
    'For ephemeris positions on a specific date use query_planet_position instead.',
  inputSchema: z.object({
    fact_id: z.string().optional().describe(
      'Exact fact_id to fetch (e.g. PLN.SUN.LON_DEG, HSE.1.LORD, SAH.PUNYA). ' +
      'Most precise — use when you know the exact ID.'
    ),
    category: z.enum([
      'planet', 'house', 'cusp', 'saham', 'yoga', 'special_lagna',
      'dasha_balance', 'arudha', 'upagraha', 'navatara', 'panchang',
      'karaka', 'nakshatra', 'metadata',
    ]).optional().describe('Filter by fact category.'),
    divisional_chart: z.string().optional().describe(
      'Filter by divisional chart (e.g. D1, D9, D10, D12, D60). Defaults to all charts.'
    ),
    value_contains: z.string().optional().describe(
      'Filter rows where value_text contains this substring (case-insensitive).'
    ),
    limit: z.number().int().min(1).max(100).default(20).describe(
      'Maximum rows to return (default 20).'
    ),
  }),
  execute: async ({ fact_id, category, divisional_chart, value_contains, limit }) => {
    try {
      const conditions: string[] = []
      const params: (string | number)[] = []
      let idx = 1

      if (fact_id) {
        conditions.push(`fact_id = $${idx++}`)
        params.push(fact_id)
      }
      if (category) {
        conditions.push(`category = $${idx++}`)
        params.push(category)
      }
      if (divisional_chart) {
        conditions.push(`divisional_chart = $${idx++}`)
        params.push(divisional_chart)
      }
      if (value_contains) {
        conditions.push(`value_text ILIKE $${idx++}`)
        params.push(`%${value_contains}%`)
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
      const sql = `
        SELECT fact_id, category, divisional_chart, value_text, value_number,
               value_json, source_section, is_stale
        FROM chart_facts
        ${where}
        ORDER BY fact_id ASC
        LIMIT $${idx}
      `
      params.push(limit)
      const { rows } = await query(sql, params)
      return { count: rows.length, facts: rows }
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) }
    }
  },
})
