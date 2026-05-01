import { tool } from 'ai'
import { z } from 'zod'
import { query } from '@/lib/db/client'

export const query_resonance = tool({
  description:
    'Query the L2.5 RM (Resonance Matrix) — pairwise resonance relationships between MSR signals. ' +
    'Use this when the user asks: "find all resonances for signal SIG.MSR.001", ' +
    '"what signals reinforce SIG.MSR.042?", "show me the cancel-type resonances for this signal", ' +
    '"what amplifies SIG.MSR.017?", "which signals are in tension with SIG.MSR.099?", ' +
    '"find all modulate resonances for SIG.MSR.200". ' +
    'Resonance types: reinforce|amplify|modulate|cancel|tension. ' +
    'A signal_id is always in SIG.MSR.NNN format (e.g. SIG.MSR.001). ' +
    'For the full signal record use query_msr_signals. ' +
    'For cross-domain linkage (not signal-pair resonance) use query_cdlm_link.',
  inputSchema: z.object({
    signal_id: z.string().describe(
      'The MSR signal ID to look up (e.g. SIG.MSR.001). Required. ' +
      'Returns all resonance pairs where this signal appears as either signal_a or signal_b.'
    ),
    resonance_type: z.enum(['reinforce', 'amplify', 'modulate', 'cancel', 'tension']).optional().describe(
      'Filter by resonance type. Omit to return all resonance types for this signal.'
    ),
  }),
  execute: async ({ signal_id, resonance_type }) => {
    try {
      const conditions: string[] = [
        `(signal_a_id = $1 OR signal_b_id = $1)`,
      ]
      const params: string[] = [signal_id]
      let idx = 2

      if (resonance_type) {
        conditions.push(`resonance_type = $${idx++}`)
        params.push(resonance_type)
      }

      const sql = `
        SELECT resonance_id, signal_a_id, signal_b_id, resonance_type,
               strength, theme, notes, source_section
        FROM l25_rm_resonances
        WHERE ${conditions.join(' AND ')}
        ORDER BY resonance_type ASC, resonance_id ASC
        LIMIT 20
      `
      const { rows } = await query(sql, params)
      return { count: rows.length, signal_id, resonances: rows }
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) }
    }
  },
})
