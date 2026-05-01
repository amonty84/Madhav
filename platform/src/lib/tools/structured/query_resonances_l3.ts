import { tool } from 'ai'
import { z } from 'zod'
import { query } from '@/lib/db/client'

export const query_resonances_l3 = tool({
  description:
    'Query the L3 resonance register — deep thematic unifications where multiple MSR signals converge into a single structural truth spanning domains. ' +
    'Use this when the user asks: "what are the deep resonances in the chart?", "what unifies career and spiritual domains?", ' +
    '"which signals reinforce each other at the highest level?", "what is the soul-level theme of the chart?". ' +
    'This is distinct from query_resonance (L2.5 signal-pair resonances) — L3 resonances are emergent, multi-domain structural truths. ' +
    'For domain-specific patterns use query_patterns instead.',
  inputSchema: z.object({
    theme: z.string().optional().describe(
      'Filter by theme string (partial match). Example: "career_spiritual" or "self_wealth". Omit for all.'
    ),
    signal_id: z.string().optional().describe(
      'Filter to resonances containing this MSR signal ID (e.g. SIG.MSR.015).'
    ),
    domain: z.string().optional().describe(
      'Filter to resonances that touch this domain (career|wealth|spiritual|…).'
    ),
  }),
  execute: async ({ theme, signal_id, domain }) => {
    try {
      const conditions: string[] = []
      const params: (string | number)[] = []
      let idx = 1
      if (theme) {
        conditions.push(`theme ILIKE $${idx++}`)
        params.push(`%${theme}%`)
      }
      if (signal_id) {
        conditions.push(`$${idx++} = ANY(signal_ids)`)
        params.push(signal_id)
      }
      if (domain) {
        conditions.push(`$${idx++} = ANY(domains)`)
        params.push(domain)
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
      const sql = `
        SELECT resonance_id, theme, description, signal_ids, domains,
               confidence, discovered_at
        FROM resonance_register
        ${where}
        ORDER BY confidence DESC
        LIMIT 20
      `
      const { rows } = await query(sql, params)
      return { count: rows.length, resonances: rows }
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) }
    }
  },
})
