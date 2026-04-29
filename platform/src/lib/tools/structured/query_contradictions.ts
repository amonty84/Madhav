import { tool } from 'ai'
import { z } from 'zod'
import { query } from '@/lib/db/client'

export const query_contradictions = tool({
  description:
    'Query the L3 contradiction register — signals, facts, or interpretations that directly oppose each other in the chart. ' +
    'Use this when the user asks: "what are the unresolved tensions in the chart?", "which signals conflict?", ' +
    '"what contradictions exist in the career domain?", "what are the unsettled oppositions?", ' +
    '"what signal conflicts has the system flagged?". ' +
    'This is the most powerful tool for revealing non-obvious chart complexity — a confirmation that the system holds ' +
    'opposing truths without collapsing them. ' +
    'Set unresolved_only=true for active tensions; omit to see all including dismissed.',
  inputSchema: z.object({
    unresolved_only: z.boolean().optional().describe(
      'If true, return only contradictions with resolution_status="unresolved". Defaults to true.'
    ),
    domain: z.string().optional().describe(
      'Filter by domain (career|wealth|relationships|mind|health|spiritual|…). Omit for all.'
    ),
    conflict_type: z.enum([
      'signal_vs_signal',
      'fact_vs_signal',
      'pattern_vs_event',
      'tradition_vs_observation',
    ]).optional().describe('Filter by conflict type. Omit for all types.'),
  }),
  execute: async ({ unresolved_only = true, domain, conflict_type }) => {
    try {
      const conditions: string[] = []
      const params: (string | boolean | number)[] = []
      let idx = 1
      if (unresolved_only) {
        conditions.push(`resolution_status = $${idx++}`)
        params.push('unresolved')
      }
      if (domain) {
        conditions.push(`domain = $${idx++}`)
        params.push(domain)
      }
      if (conflict_type) {
        conditions.push(`conflict_type = $${idx++}`)
        params.push(conflict_type)
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
      const sql = `
        SELECT contradiction_id, statement_a, statement_b, conflict_type,
               source_signal_ids, resolution_status, resolution_notes,
               domain, confidence, discovered_at
        FROM contradiction_register
        ${where}
        ORDER BY confidence DESC, discovered_at ASC
        LIMIT 20
      `
      const { rows } = await query(sql, params)
      return { count: rows.length, contradictions: rows }
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) }
    }
  },
})
