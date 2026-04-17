import { tool } from 'ai'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'

async function readDocumentContent(storage_path: string): Promise<string | null> {
  const supabase = createServiceClient()
  const { data: blob, error } = await supabase.storage.from('chart-documents').download(storage_path)
  if (error || !blob) return null
  return blob.text()
}

export const consumeTools = {
  get_birth_data: tool({
    description: 'Get the birth metadata for the client chart.',
    inputSchema: z.object({
      chart_id: z.string().describe('The chart UUID'),
    }),
    execute: async ({ chart_id }) => {
      try {
        const supabase = createServiceClient()
        const { data, error } = await supabase
          .from('charts')
          .select('name, birth_date, birth_time, birth_place, birth_lat, birth_lng, ayanamsa, house_system')
          .eq('id', chart_id)
          .single()
        if (error || !data) return { error: error?.message ?? 'Chart not found' }
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
        const supabase = createServiceClient()
        const { data: chart, error } = await supabase
          .from('charts')
          .select('birth_date, birth_time, birth_lat, birth_lng')
          .eq('id', chart_id)
          .single()
        if (error || !chart) return { error: error?.message ?? 'Chart not found' }

        if (!chart.birth_lat || !chart.birth_lng) {
          return { error: 'Chart is missing birth coordinates required for ephemeris calculation' }
        }

        const res = await fetch(`${process.env.PYTHON_SIDECAR_URL}/ephemeris`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.PYTHON_SIDECAR_API_KEY}`,
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
        const supabase = createServiceClient()
        // Dasha periods are recorded in the L1 factual data document
        const { data: doc, error } = await supabase
          .from('documents')
          .select('storage_path')
          .eq('chart_id', chart_id)
          .eq('layer', 'L1')
          .ilike('name', '%forensic%')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single()

        if (error || !doc) {
          return { error: 'L1 factual data not found. Build the pyramid first.', date }
        }

        const content = await readDocumentContent(doc.storage_path)
        if (!content) return { error: 'Failed to read L1 document' }

        // Return the raw document excerpt around dasha-related content
        const lines = content.split('\n')
        const dashaLines = lines.filter(l =>
          /dasha|antar|mahadasha|bhukti/i.test(l)
        )
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
        const supabase = createServiceClient()
        const { data: row, error } = await supabase
          .from('documents')
          .select('name, layer, version, storage_path')
          .eq('chart_id', chart_id)
          .eq('layer', layer)
          .eq('name', name)
          .single()
        if (error || !row) return { error: error?.message ?? `Document "${name}" not found in layer ${layer}` }

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
    execute: async ({ chart_id, query }) => {
      try {
        const supabase = createServiceClient()
        const { data: docs, error } = await supabase
          .from('documents')
          .select('name, layer, storage_path')
          .eq('chart_id', chart_id)
        if (error) return { error: error.message }

        const results: Array<{ document: string; layer: string; matches: string[] }> = []
        const lowerQuery = query.toLowerCase()

        for (const doc of docs ?? []) {
          const content = await readDocumentContent(doc.storage_path)
          if (!content) continue
          const matches = content.split('\n').filter(l => l.toLowerCase().includes(lowerQuery))
          if (matches.length > 0) {
            results.push({ document: doc.name, layer: doc.layer, matches: matches.slice(0, 10) })
          }
        }

        return { query, results, total_documents_searched: (docs ?? []).length }
      } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) }
      }
    },
  }),

  get_domain_report: tool({
    description: 'Read a specific L3 domain report (e.g. finance, career, health).',
    inputSchema: z.object({
      chart_id: z.string().describe('The chart UUID'),
      domain: z.string().describe('Domain name (e.g. finance, career, health, relationships)'),
    }),
    execute: async ({ chart_id, domain }) => {
      try {
        const supabase = createServiceClient()
        const { data: report, error } = await supabase
          .from('reports')
          .select('title, domain, version, storage_path, updated_at')
          .eq('chart_id', chart_id)
          .eq('domain', domain)
          .order('updated_at', { ascending: false })
          .limit(1)
          .single()

        if (error || !report) {
          return { error: `No report found for domain "${domain}". Available domains may include finance, career, health, relationships.` }
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
        const supabase = createServiceClient()
        const { data: chart, error } = await supabase
          .from('charts')
          .select('birth_lat, birth_lng')
          .eq('id', chart_id)
          .single()
        if (error || !chart) return { error: error?.message ?? 'Chart not found' }

        const res = await fetch(`${process.env.PYTHON_SIDECAR_URL}/transits`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.PYTHON_SIDECAR_API_KEY}`,
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

  get_pyramid_status: tool({
    description: 'Get the status of all pyramid layers for the chart.',
    inputSchema: z.object({
      chart_id: z.string().describe('The chart UUID'),
    }),
    execute: async ({ chart_id }) => {
      try {
        const supabase = createServiceClient()
        const { data, error } = await supabase
          .from('pyramid_layers')
          .select('layer, sublayer, status, version, updated_at')
          .eq('chart_id', chart_id)
          .order('layer')
          .order('sublayer')
        if (error) return { error: error.message }
        return data ?? []
      } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) }
      }
    },
  }),
}
