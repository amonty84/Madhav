import { tool } from 'ai'
import { z } from 'zod'
import { query } from '@/lib/db/client'

export const query_cgm = tool({
  description:
    'Query the L2.5 CGM (Chart Graph Model) — the graph of planetary nodes, house nodes, sign nodes, and their typed relationships. ' +
    'Use this when the user asks: "get Saturn node and all its edges", "show me all PLN-type CGM nodes", ' +
    '"find the node for the 7th house and its relationships", "what aspects does Jupiter make?", ' +
    '"show me all DISPOSITED_BY relationships", "which planets have NAKSHATRA_LORD edges?", ' +
    '"what does the karaka node for career show?", "show me the nakshatra nodes". ' +
    'Node type codes: PLN=planet, HSE=house, SGN=sign, KRK=karaka, NAK=nakshatra, DVS=divisional, SEN=sensitive point, DSH=dasha, YOG=yoga. ' +
    'Planet node IDs: PLN.SATURN, PLN.SUN, PLN.MOON, PLN.MARS, PLN.MERCURY, PLN.JUPITER, PLN.VENUS, PLN.RAHU, PLN.KETU. ' +
    'House node IDs: HSE.1 through HSE.12. ' +
    'Edge types: ASPECTS|RULES|EXALTED_IN|DEBILITATED_IN|YUTI_WITH|LORDS|KARAKA_FOR|CONTRADICTS|SUPPORTS|DISPOSITED_BY|NAKSHATRA_LORD_IS. ' +
    'Set include_edges=false for a lightweight node-only listing. ' +
    'For narrative synthesis that interprets these nodes use query_ucn_section.',
  inputSchema: z.object({
    node_id: z.string().optional().describe(
      'Exact node ID. Planets: PLN.SATURN, PLN.SUN, PLN.MOON, PLN.MARS, PLN.MERCURY, PLN.JUPITER, PLN.VENUS, PLN.RAHU, PLN.KETU. ' +
      'Houses: HSE.1 through HSE.12. Signs: SGN.ARIES, SGN.LIBRA, etc. Returns that specific node and its edges.'
    ),
    node_type: z.enum([
      'PLN', 'HSE', 'SGN', 'KRK', 'NAK', 'DVS', 'SEN', 'DSH', 'YOG',
    ]).optional().describe(
      'Filter nodes by type code: PLN=planet, HSE=house, SGN=sign, KRK=karaka, NAK=nakshatra, DVS=divisional, SEN=sensitive point, DSH=dasha, YOG=yoga. Omit to return all types.'
    ),
    include_edges: z.boolean().optional().describe(
      'If true, also returns all edges where this node is the source or target. Defaults to true. ' +
      'Set false for a lightweight node-only listing.'
    ),
  }),
  execute: async ({ node_id, node_type, include_edges = true }) => {
    try {
      // --- Fetch nodes ---
      const nodeConditions: string[] = []
      const nodeParams: string[] = []
      let idx = 1

      if (node_id) {
        nodeConditions.push(`node_id = $${idx++}`)
        nodeParams.push(node_id)
      }
      if (node_type) {
        nodeConditions.push(`node_type = $${idx++}`)
        nodeParams.push(node_type)
      }

      const nodeWhere = nodeConditions.length > 0 ? `WHERE ${nodeConditions.join(' AND ')}` : ''
      const nodeSql = `
        SELECT node_id, node_type, display_name, properties, source_section
        FROM l25_cgm_nodes
        ${nodeWhere}
        ORDER BY node_type ASC, node_id ASC
        LIMIT 50
      `
      const { rows: nodes } = await query(nodeSql, nodeParams)

      if (!include_edges || nodes.length === 0) {
        return { count: nodes.length, nodes, edges: [] }
      }

      // --- Fetch edges for the returned nodes ---
      const nodeIds = nodes.map(n => n.node_id as string)
      // Use ANY($1::text[]) to match against the collected node IDs
      const edgeSql = `
        SELECT edge_id, source_node_id, target_node_id, edge_type,
               strength, notes, source_section
        FROM l25_cgm_edges
        WHERE source_node_id = ANY($1::text[])
           OR target_node_id = ANY($1::text[])
        ORDER BY edge_type ASC, edge_id ASC
      `
      const { rows: edges } = await query(edgeSql, [nodeIds])

      return { count: nodes.length, nodes, edges }
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) }
    }
  },
})
