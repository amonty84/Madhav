import { tool } from 'ai'
import { z } from 'zod'
import { query } from '@/lib/db/client'

export const query_planet_position = tool({
  description:
    'Query Swiss Ephemeris-computed planetary positions from the ephemeris_daily table (1900–2100, daily resolution, Lahiri sidereal). ' +
    'Use this when the user asks: "what was Saturn\'s longitude on 2018-03-15?", ' +
    '"was Jupiter retrograde in January 2021?", ' +
    '"what sign was Rahu transiting on the day of my job change (2019-05-15)?", ' +
    '"show all planets for 1984-02-05 (natal chart)", ' +
    '"what nakshatra was the Moon in on 2022-01-03?". ' +
    'Returns longitude_deg, sign, nakshatra, nakshatra_pada, is_retrograde, speed_deg_per_day. ' +
    'For natal chart facts use query_chart_fact instead (more structured, faster).',
  inputSchema: z.object({
    date: z.string().describe(
      'Date in YYYY-MM-DD format. Must be between 1900-01-01 and 2100-12-31.'
    ),
    planet: z.enum([
      'sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu',
    ]).optional().describe(
      'Planet to query. Omit to return all 9 planets for the date.'
    ),
  }),
  execute: async ({ date, planet }) => {
    try {
      const conditions: string[] = ['date = $1']
      const params: (string | number)[] = [date]
      let idx = 2

      if (planet) {
        conditions.push(`planet = $${idx++}`)
        params.push(planet)
      }

      const sql = `
        SELECT planet, date, longitude_deg, latitude_deg, speed_deg_per_day,
               is_retrograde, sign, sign_degree, nakshatra, nakshatra_pada,
               ayanamsha, ephemeris_version
        FROM ephemeris_daily
        WHERE ${conditions.join(' AND ')}
        ORDER BY planet ASC
      `
      const { rows } = await query(sql, params)
      return { date, count: rows.length, positions: rows }
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) }
    }
  },
})
