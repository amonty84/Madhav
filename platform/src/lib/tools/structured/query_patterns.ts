import { tool } from 'ai'
import { z } from 'zod'
import { query } from '@/lib/db/client'

export const query_patterns = tool({
  description:
    'Query the L3 pattern register. Use this when the user asks: "what patterns has the chart revealed?", "find patterns in the career domain", "show me high-confidence patterns", or "what structural patterns govern this native?". ' +
    'Each pattern is a discovered, cross-signal claim about the native with evidence, confidence, and domain. ' +
    'For unresolved chart tensions use query_contradictions instead. ' +
    'For deep cross-domain unifications use query_resonances_l3.',
  inputSchema: z.object({
    domain: z.string().optional().describe(
      'Filter by domain (career|wealth|relationships|mind|health|spiritual|children|self|cross_domain|…). Omit for all domains.'
    ),
    confidence_min: z.number().min(0).max(1).optional().describe(
      'Minimum confidence threshold 0–1 (HIGH≈0.85, MED≈0.60, LOW≈0.35). Omit to return all.'
    ),
    status: z.enum(['active', 'superseded', 'rejected']).optional().describe(
      'Filter by pattern status. Defaults to "active" if omitted.'
    ),
  }),
  execute: async ({ domain, confidence_min, status = 'active' }) => {
    try {
      const conditions: string[] = ['status = $1']
      const params: (string | number)[] = [status]
      let idx = 2
      if (domain) {
        conditions.push(`domain = $${idx++}`)
        params.push(domain)
      }
      if (confidence_min !== undefined) {
        conditions.push(`confidence >= $${idx++}`)
        params.push(confidence_min)
      }
      const sql = `
        SELECT pattern_id, name, description, domain, source_signal_ids,
               confidence, status, discovered_at
        FROM pattern_register
        WHERE ${conditions.join(' AND ')}
        ORDER BY confidence DESC
        LIMIT 20
      `
      const { rows } = await query(sql, params)
      return { count: rows.length, patterns: rows }
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) }
    }
  },
})
