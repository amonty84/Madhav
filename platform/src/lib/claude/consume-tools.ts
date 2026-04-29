import { tool } from 'ai'
import { z } from 'zod'
import { query } from '@/lib/db/client'
import { chartDocsBucket, gcsDownloadText } from '@/lib/storage/client'
import { query_patterns } from '@/lib/tools/structured/query_patterns'
import { query_resonances_l3 } from '@/lib/tools/structured/query_resonances_l3'
import { query_clusters } from '@/lib/tools/structured/query_clusters'
import { query_contradictions } from '@/lib/tools/structured/query_contradictions'
import { query_msr_signals } from '@/lib/tools/structured/query_msr_signals'
import { query_ucn_section } from '@/lib/tools/structured/query_ucn_section'
import { query_cdlm_link } from '@/lib/tools/structured/query_cdlm_link'
import { query_cgm } from '@/lib/tools/structured/query_cgm'
import { query_resonance } from '@/lib/tools/structured/query_resonance'
import { query_chart_fact } from '@/lib/tools/structured/query_chart_fact'
import { query_planet_position } from '@/lib/tools/structured/query_planet_position'
import { query_eclipse_window } from '@/lib/tools/structured/query_eclipse_window'
import { query_retrograde_window } from '@/lib/tools/structured/query_retrograde_window'
import { query_life_events } from '@/lib/tools/structured/query_life_events'
import { query_sade_sati } from '@/lib/tools/structured/query_sade_sati'
import { query_dasha } from '@/lib/tools/structured/query_dasha'

async function readDocumentContent(storage_path: string): Promise<string | null> {
  return gcsDownloadText(chartDocsBucket(), storage_path)
}

export const consumeTools = {
  get_birth_data: tool({
    description: 'Get the birth metadata for the client chart.',
    inputSchema: z.object({
      chart_id: z.string().describe('The chart UUID'),
    }),
    execute: async ({ chart_id }) => {
      try {
        const { rows } = await query(
          'SELECT name, birth_date, birth_time, birth_place, birth_lat, birth_lng, ayanamsa, house_system FROM charts WHERE id=$1',
          [chart_id]
        )
        const data = rows[0] ?? null
        if (!data) return { error: 'Chart not found' }
        return data
      } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) }
      }
    },
  }),

  get_planetary_positions: tool({
    description: 'Get sidereal (Lahiri) planetary positions for the natal chart. Optionally specify a divisional chart.',
    inputSchema: z.object({
      chart_id: z.string().describe('The chart UUID'),
      divisional: z.string().optional().describe('Divisional chart type (e.g. D1, D9, D10). Defaults to D1.'),
    }),
    execute: async ({ chart_id, divisional = 'D1' }) => {
      try {
        const { rows } = await query(
          'SELECT birth_date, birth_time, birth_lat, birth_lng FROM charts WHERE id=$1',
          [chart_id]
        )
        const chart = rows[0] ?? null
        if (!chart) return { error: 'Chart not found' }

        if (!chart.birth_lat || !chart.birth_lng) {
          return { error: 'Chart is missing birth coordinates required for ephemeris calculation' }
        }

        const res = await fetch(`${process.env.PYTHON_SIDECAR_URL}/ephemeris`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.PYTHON_SIDECAR_API_KEY ?? '',
          },
          body: JSON.stringify({
            birth_date: chart.birth_date,
            birth_time: chart.birth_time.slice(0, 5),
            lat: chart.birth_lat,
            lng: chart.birth_lng,
          }),
        })
        if (!res.ok) return { error: `Ephemeris request failed: ${res.status}` }
        const positions = await res.json()
        return { divisional, ...positions }
      } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) }
      }
    },
  }),

  get_dasha_periods: tool({
    description: 'Get Vimshottari dasha periods for the chart. Reads from the L1 factual data layer.',
    inputSchema: z.object({
      chart_id: z.string().describe('The chart UUID'),
      date: z.string().optional().describe('Reference date (YYYY-MM-DD) to find the active dasha. If omitted, returns full dasha sequence.'),
    }),
    execute: async ({ chart_id, date }) => {
      try {
        const { rows } = await query(
          "SELECT storage_path FROM documents WHERE chart_id=$1 AND layer='L1' AND lower(name) LIKE '%forensic%' ORDER BY updated_at DESC LIMIT 1",
          [chart_id]
        )
        const doc = rows[0] ?? null
        if (!doc) {
          return { error: 'L1 factual data not found. Build the pyramid first.', date }
        }

        const content = await readDocumentContent(doc.storage_path)
        if (!content) return { error: 'Failed to read L1 document' }

        const lines = content.split('\n')
        const dashaLines = lines.filter(l => /dasha|antar|mahadasha|bhukti/i.test(l))
        return {
          date,
          source: 'L1 factual data',
          dasha_content: dashaLines.slice(0, 50).join('\n'),
        }
      } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) }
      }
    },
  }),

  get_layer_document: tool({
    description: 'Read any document from the astrological data pyramid by layer and name.',
    inputSchema: z.object({
      chart_id: z.string().describe('The chart UUID'),
      layer: z.string().describe('Layer (L1, L2, L2.5, L3, L4)'),
      name: z.string().describe('Document name (e.g. cgm, msr, forensic_data)'),
    }),
    execute: async ({ chart_id, layer, name }) => {
      try {
        const { rows } = await query(
          'SELECT name, layer, version, storage_path FROM documents WHERE chart_id=$1 AND layer=$2 AND name=$3',
          [chart_id, layer, name]
        )
        const row = rows[0] ?? null
        if (!row) return { error: `Document "${name}" not found in layer ${layer}` }

        const content = await readDocumentContent(row.storage_path)
        if (!content) return { error: 'Failed to download document from storage' }

        return { name: row.name, layer: row.layer, version: row.version, content }
      } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) }
      }
    },
  }),

  search_signals: tool({
    description: 'Full-text search across all documents in the pyramid for a given query.',
    inputSchema: z.object({
      chart_id: z.string().describe('The chart UUID'),
      query: z.string().describe('Search term (case-insensitive)'),
    }),
    execute: async ({ chart_id, query: searchQuery }) => {
      try {
        const { rows: docs } = await query(
          'SELECT name, layer, storage_path FROM documents WHERE chart_id=$1',
          [chart_id]
        )

        const results: Array<{ document: string; layer: string; matches: string[] }> = []
        const lowerQuery = searchQuery.toLowerCase()

        for (const doc of docs) {
          const content = await readDocumentContent(doc.storage_path)
          if (!content) continue
          const matches = content.split('\n').filter(l => l.toLowerCase().includes(lowerQuery))
          if (matches.length > 0) {
            results.push({ document: doc.name, layer: doc.layer, matches: matches.slice(0, 10) })
          }
        }

        return { query: searchQuery, results, total_documents_searched: docs.length }
      } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) }
      }
    },
  }),

  get_domain_report: tool({
    description: 'Read a specific L3 domain report. Use the exact domain slug from the system prompt\'s Available reports list. Match is case-insensitive.',
    inputSchema: z.object({
      chart_id: z.string().describe('The chart UUID'),
      domain: z.string().describe('Domain slug from the Available reports list (e.g. finance, career, health, relationships)'),
    }),
    execute: async ({ chart_id, domain }) => {
      try {
        const { rows } = await query(
          'SELECT title, domain, version, storage_path, updated_at FROM reports WHERE chart_id=$1 AND lower(domain)=lower($2) ORDER BY updated_at DESC LIMIT 1',
          [chart_id, domain]
        )
        const report = rows[0] ?? null

        if (!report) {
          const { rows: available } = await query(
            'SELECT DISTINCT domain FROM reports WHERE chart_id=$1 ORDER BY domain',
            [chart_id]
          )
          const domains = available.map(r => r.domain)
          return {
            error: `No report found for domain "${domain}" on this chart.`,
            available_domains: domains,
            hint:
              domains.length > 0
                ? `Call get_domain_report again with one of: ${domains.join(', ')}.`
                : 'This chart has no L3 domain reports yet. Answer from chart facts (get_planetary_positions, get_dasha_periods) and any L2/L2.5 documents.',
          }
        }

        const content = await readDocumentContent(report.storage_path)
        if (!content) return { error: 'Failed to download report from storage' }

        return {
          domain: report.domain,
          title: report.title,
          version: report.version,
          updated_at: report.updated_at,
          content,
        }
      } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) }
      }
    },
  }),

  get_transits: tool({
    description: 'Get planetary transit positions for a date range.',
    inputSchema: z.object({
      chart_id: z.string().describe('The chart UUID'),
      from_date: z.string().describe('Start date (YYYY-MM-DD)'),
      to_date: z.string().describe('End date (YYYY-MM-DD)'),
    }),
    execute: async ({ chart_id, from_date, to_date }) => {
      try {
        const { rows } = await query(
          'SELECT birth_lat, birth_lng FROM charts WHERE id=$1',
          [chart_id]
        )
        const chart = rows[0] ?? null
        if (!chart) return { error: 'Chart not found' }

        const res = await fetch(`${process.env.PYTHON_SIDECAR_URL}/transits`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.PYTHON_SIDECAR_API_KEY ?? '',
          },
          body: JSON.stringify({ from_date, to_date, lat: chart.birth_lat, lng: chart.birth_lng }),
        })
        if (!res.ok) return { error: `Transit request failed: ${res.status} — endpoint may not be implemented yet` }
        return await res.json()
      } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) }
      }
    },
  }),

  query_patterns,
  query_resonances_l3,
  query_clusters,
  query_contradictions,
  query_msr_signals,
  query_ucn_section,
  query_cdlm_link,
  query_cgm,
  query_resonance,
  query_chart_fact,
  query_planet_position,
  query_eclipse_window,
  query_retrograde_window,
  query_life_events,
  query_sade_sati,
  query_dasha,

  get_pyramid_status: tool({
    description: 'Get the status of all pyramid layers for the chart.',
    inputSchema: z.object({
      chart_id: z.string().describe('The chart UUID'),
    }),
    execute: async ({ chart_id }) => {
      try {
        const { rows } = await query(
          'SELECT layer, sublayer, status, version, updated_at FROM pyramid_layers WHERE chart_id=$1 ORDER BY layer ASC, sublayer ASC',
          [chart_id]
        )
        return rows
      } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) }
      }
    },
  }),
}
