import { tool } from 'ai'
import { z } from 'zod'
import { query } from '@/lib/db/client'

export const query_ucn_section = tool({
  description:
    'Query the L2.5 UCN (Unified Chart Narrative) — the synthesized narrative built directly on top of MSR signals. ' +
    'Use this when the user asks: "read UCN section UCN.4.2", "find all UCN sections about the career domain", ' +
    '"show me the wealth synthesis narrative", "what does the synthesis say about health?", ' +
    '"read the partner domain narrative", "what UCN sections cover the self domain?". ' +
    'Each section cites the specific MSR signal IDs it was derived from, making it fully traceable. ' +
    'Domains: self|wealth|sibling|home|progeny|health|partner|transformation|career. ' +
    'For the raw underlying signals use query_msr_signals. ' +
    'For cross-domain linkages use query_cdlm_link.',
  inputSchema: z.object({
    section_id: z.string().optional().describe(
      'Exact UCN section ID (e.g. UCN.4.2, UCN.7.1). If provided, returns that section directly. ' +
      'Combine with include_children=true to also return its child sections.'
    ),
    domain: z.enum([
      'self', 'wealth', 'sibling', 'home', 'progeny',
      'health', 'partner', 'transformation', 'career',
    ]).optional().describe(
      'Filter by domain. Returns all sections in that domain. Omit to search across all domains.'
    ),
    include_children: z.boolean().optional().describe(
      'If true and section_id is provided, also returns all sections whose parent_section_id matches section_id. ' +
      'Useful for reading a parent section together with all its subsections. Defaults to false.'
    ),
  }),
  execute: async ({ section_id, domain, include_children = false }) => {
    try {
      const conditions: string[] = []
      const params: string[] = []
      let idx = 1

      if (section_id) {
        if (include_children) {
          conditions.push(`(section_id = $${idx} OR parent_section_id = $${idx})`)
          params.push(section_id)
          idx++
        } else {
          conditions.push(`section_id = $${idx++}`)
          params.push(section_id)
        }
      }
      if (domain) {
        conditions.push(`domain = $${idx++}`)
        params.push(domain)
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
      const sql = `
        SELECT section_id, parent_section_id, domain, title,
               content, derived_from_signals, source_lines
        FROM l25_ucn_sections
        ${where}
        ORDER BY section_id ASC
        LIMIT 50
      `
      const { rows } = await query(sql, params)
      return { count: rows.length, sections: rows }
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) }
    }
  },
})
