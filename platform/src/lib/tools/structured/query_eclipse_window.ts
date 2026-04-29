import { tool } from 'ai'
import { z } from 'zod'
import { query } from '@/lib/db/client'

export const query_eclipse_window = tool({
  description:
    'Query solar and lunar eclipses from the eclipses table (1900–2100, Swiss Ephemeris, Lahiri sidereal). ' +
    'Use this when the user asks: "were there any eclipses around my marriage date (May 2013)?", ' +
    '"find total solar eclipses near my birth", "any eclipses in Aquarius or Pisces in 2022–2025?", ' +
    '"which eclipses fell within 6 months of 2024-02-16?", ' +
    '"show all lunar eclipses between 2019 and 2022 visible from Bhubaneswar". ' +
    'Returns date, type (solar_total/solar_annular/solar_partial/lunar_total/lunar_partial/lunar_penumbral), ' +
    'longitude_deg, sign, nakshatra, visibility_region.',
  inputSchema: z.object({
    start_date: z.string().describe('Start of window in YYYY-MM-DD format.'),
    end_date: z.string().describe('End of window in YYYY-MM-DD format.'),
    type: z.enum([
      'solar_total', 'solar_annular', 'solar_partial',
      'lunar_total', 'lunar_partial', 'lunar_penumbral',
    ]).optional().describe('Filter by eclipse type. Omit for all types.'),
    sign: z.string().optional().describe(
      'Filter to eclipses in this sidereal sign (e.g. Aquarius, Capricorn, Scorpio).'
    ),
  }),
  execute: async ({ start_date, end_date, type, sign }) => {
    try {
      const conditions: string[] = ['date BETWEEN $1 AND $2']
      const params: (string | number)[] = [start_date, end_date]
      let idx = 3

      if (type) {
        conditions.push(`type = $${idx++}`)
        params.push(type)
      }
      if (sign) {
        conditions.push(`sign = $${idx++}`)
        params.push(sign)
      }

      const sql = `
        SELECT date, type, longitude_deg, sign, nakshatra, visibility_region
        FROM eclipses
        WHERE ${conditions.join(' AND ')}
        ORDER BY date ASC
        LIMIT 50
      `
      const { rows } = await query(sql, params)
      return { window: { start_date, end_date }, count: rows.length, eclipses: rows }
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) }
    }
  },
})
