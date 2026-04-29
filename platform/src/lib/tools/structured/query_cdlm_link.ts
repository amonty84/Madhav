import { tool } from 'ai'
import { z } from 'zod'
import { query } from '@/lib/db/client'

const DOMAIN_ENUM = [
  'career', 'children', 'health', 'mind', 'parents',
  'relationships', 'spirit', 'travel', 'wealth',
] as const

export const query_cdlm_link = tool({
  description:
    'Query the L2.5 CDLM (Cross-Domain Linkage Matrix) — the 9×9 matrix of how each life domain relates to every other. ' +
    'Use this when the user asks: "how does career relate to relationships?", ' +
    '"which domain pairs have strong links?", "show me all cross-domain links involving wealth", ' +
    '"what does career reinforce or contradict?", "show me the full cross-domain matrix", ' +
    '"what domains does wealth connect to?", "which domain pairs have tension?". ' +
    'Domains: career|children|health|mind|parents|relationships|spirit|travel|wealth. ' +
    'Each link has a type (CITES|CONTRADICTS|REINFORCES|NEUTRAL) and strength (strong|moderate|weak|nil). ' +
    'For the narrative of a specific domain use query_ucn_section. ' +
    'For resonance relationships between individual MSR signals use query_resonance.',
  inputSchema: z.object({
    from_domain: z.enum(DOMAIN_ENUM).optional().describe(
      'The source domain. Filters to links originating from this domain. ' +
      'Omit to search all source domains.'
    ),
    to_domain: z.enum(DOMAIN_ENUM).optional().describe(
      'The target domain. Filters to links pointing to this domain. ' +
      'Omit to search all target domains. ' +
      'If both from_domain and to_domain are provided, returns the single link between them.'
    ),
  }),
  execute: async ({ from_domain, to_domain }) => {
    try {
      const conditions: string[] = []
      const params: string[] = []
      let idx = 1

      if (from_domain) {
        conditions.push(`from_domain = $${idx++}`)
        params.push(from_domain)
      }
      if (to_domain) {
        conditions.push(`to_domain = $${idx++}`)
        params.push(to_domain)
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
      const sql = `
        SELECT link_id, from_domain, to_domain, link_type, strength,
               source_signals, notes, source_section
        FROM l25_cdlm_links
        ${where}
        ORDER BY from_domain ASC, to_domain ASC
        LIMIT 81
      `
      const { rows } = await query(sql, params)
      return { count: rows.length, links: rows }
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) }
    }
  },
})
