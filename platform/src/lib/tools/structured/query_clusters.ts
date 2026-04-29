import { tool } from 'ai'
import { z } from 'zod'
import { query } from '@/lib/db/client'

export const query_clusters = tool({
  description:
    'Query the L3 cluster register — groups of MSR signals that cluster together thematically or semantically, ' +
    'revealing hidden structural concentrations in the chart. ' +
    'Use this when the user asks: "which signals cluster together?", "what are the thematic groupings in the chart?", ' +
    '"show me signal clusters in the career domain", "what are the most significant signal concentrations?", ' +
    '"which signals form the Saturn dual-karaka cluster?". ' +
    'Returns cluster ID, name, theme, member signals, domain, and confidence.',
  inputSchema: z.object({
    theme: z.string().optional().describe(
      'Filter by theme (partial, case-insensitive). Example: "saturn" or "career_authority". Omit for all.'
    ),
    domain: z.string().optional().describe(
      'Filter by dominant domain (career|wealth|relationships|…). Omit for all domains.'
    ),
    confidence_min: z.number().min(0).max(1).optional().describe(
      'Minimum confidence threshold 0–1. Omit to return all clusters.'
    ),
  }),
  execute: async ({ theme, domain, confidence_min }) => {
    try {
      const conditions: string[] = []
      const params: (string | number)[] = []
      let idx = 1
      if (theme) {
        conditions.push(`(theme ILIKE $${idx} OR name ILIKE $${idx})`)
        params.push(`%${theme}%`)
        idx++
      }
      if (domain) {
        conditions.push(`domain = $${idx++}`)
        params.push(domain)
      }
      if (confidence_min !== undefined) {
        conditions.push(`confidence >= $${idx++}`)
        params.push(confidence_min)
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
      const sql = `
        SELECT cluster_id, name, theme, description, member_signal_ids,
               domain, confidence, discovered_at
        FROM cluster_register
        ${where}
        ORDER BY confidence DESC
        LIMIT 20
      `
      const { rows } = await query(sql, params)
      return { count: rows.length, clusters: rows }
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) }
    }
  },
})
