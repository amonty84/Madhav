import { tool } from 'ai'
import { z } from 'zod'
import { query } from '@/lib/db/client'

export const query_msr_signals = tool({
  description:
    'Query the L2.5 MSR (Master Signal Register) — the 499-signal foundation of the holistic synthesis layer. ' +
    'Use this when the user asks: "find every MSR signal involving Saturn in the 7th house with negative valence", ' +
    '"what signals are in the yoga category?", "show me all mixed-valence signals involving Mars", ' +
    '"which signals reference the 10th house?", "list all planetary signals with negative valence", ' +
    '"what MSR signals involve Rahu or Ketu?". ' +
    'Each signal is a discrete, sourced, cross-layer finding with a valence, weight, and signal ID (e.g. SIG.MSR.042). ' +
    'For cross-domain relationships between signals use query_resonance instead. ' +
    'For the narrative synthesis built on top of these signals use query_ucn_section.',
  inputSchema: z.object({
    category: z.enum([
      'planetary', 'house', 'sign', 'aspect', 'yoga', 'dasha', 'transit', 'cross',
    ]).optional().describe(
      'Filter by signal category. Omit to search across all categories.'
    ),
    valence: z.enum(['positive', 'negative', 'neutral', 'mixed']).optional().describe(
      'Filter by valence. Omit for all valences.'
    ),
    planet: z.string().optional().describe(
      'Filter to signals that involve this planet (e.g. SAT, SUN, MOO, MAR, MER, JUP, VEN, RAH, KET, ASC). ' +
      'Matches against the planets_involved array column.'
    ),
    house: z.number().int().min(1).max(12).optional().describe(
      'Filter to signals that involve this house number (1–12). ' +
      'Matches against the houses_involved array column.'
    ),
    sign: z.string().optional().describe(
      'Filter to signals that involve this sign (e.g. Aries, Taurus, Scorpio, Pisces). ' +
      'Matches against the signs_involved array column.'
    ),
  }),
  execute: async ({ category, valence, planet, house, sign }) => {
    try {
      const conditions: string[] = []
      const params: (string | number)[] = []
      let idx = 1

      if (category) {
        conditions.push(`category = $${idx++}`)
        params.push(category)
      }
      if (valence) {
        conditions.push(`valence = $${idx++}`)
        params.push(valence)
      }
      if (planet) {
        conditions.push(`$${idx++} = ANY(planets_involved)`)
        params.push(planet)
      }
      if (house !== undefined) {
        conditions.push(`$${idx++} = ANY(houses_involved)`)
        params.push(house)
      }
      if (sign) {
        conditions.push(`$${idx++} = ANY(signs_involved)`)
        params.push(sign)
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
      const sql = `
        SELECT signal_id, signal_number, name, category, valence, weight,
               planets_involved, houses_involved, signs_involved,
               description, source_section
        FROM l25_msr_signals
        ${where}
        ORDER BY signal_number ASC
        LIMIT 30
      `
      const { rows } = await query(sql, params)
      return { count: rows.length, signals: rows }
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) }
    }
  },
})
