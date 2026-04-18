import { tool } from 'ai'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'

export const buildTools = {
  list_documents: tool({
    description: 'List all documents for a chart, optionally filtered by layer.',
    inputSchema: z.object({
      chart_id: z.string().describe('The chart UUID'),
      layer: z.string().optional().describe('Optional layer filter (e.g. L1, L2, L2.5, L3, L4)'),
    }),
    execute: async ({ chart_id, layer }) => {
      try {
        const supabase = createServiceClient()
        let query = supabase
          .from('documents')
          .select('id, name, layer, version, updated_at')
          .eq('chart_id', chart_id)
        if (layer) query = query.eq('layer', layer)
        const { data, error } = await query.order('layer').order('name')
        if (error) return { error: error.message }
        return data ?? []
      } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) }
      }
    },
  }),

  read_document: tool({
    description: 'Read the full content of a document by name.',
    inputSchema: z.object({
      chart_id: z.string().describe('The chart UUID'),
      name: z.string().describe('Document name (without path or version suffix)'),
    }),
    execute: async ({ chart_id, name }) => {
      try {
        const supabase = createServiceClient()
        const { data: row, error: rowError } = await supabase
          .from('documents')
          .select('id, name, layer, version, storage_path')
          .eq('chart_id', chart_id)
          .eq('name', name)
          .single()
        if (rowError || !row) return { error: rowError?.message ?? 'Document not found' }

        const { data: blob, error: storageError } = await supabase
          .storage
          .from('chart-documents')
          .download(row.storage_path)
        if (storageError || !blob) return { error: storageError?.message ?? 'Download failed' }

        const content = await blob.text()
        return { name: row.name, layer: row.layer, version: row.version, content }
      } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) }
      }
    },
  }),

  create_document: tool({
    description: 'Create a new document in the pyramid with the given content.',
    inputSchema: z.object({
      chart_id: z.string().describe('The chart UUID'),
      layer: z.string().describe('Layer designation (L1, L2, L2.5, L3, L4)'),
      name: z.string().describe('Document name identifier'),
      content: z.string().describe('Full document content (markdown)'),
    }),
    execute: async ({ chart_id, layer, name, content }) => {
      try {
        const supabase = createServiceClient()
        const storage_path = `charts/${chart_id}/${layer}/${name}_v1.0.md`

        const { error: uploadError } = await supabase
          .storage
          .from('chart-documents')
          .upload(storage_path, content, { contentType: 'text/markdown', upsert: false })
        if (uploadError) return { error: uploadError.message }

        const { data: row, error: insertError } = await supabase
          .from('documents')
          .insert({ chart_id, layer, name, storage_path, version: '1.0' })
          .select('id, name, storage_path, version')
          .single()
        if (insertError || !row) {
          await supabase.storage.from('chart-documents').remove([storage_path])
          return { error: insertError?.message ?? 'Insert failed' }
        }

        return { id: row.id, name: row.name, storage_path: row.storage_path, version: row.version }
      } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) }
      }
    },
  }),

  update_document: tool({
    description: 'Replace a document with new content, bumping the major version.',
    inputSchema: z.object({
      chart_id: z.string().describe('The chart UUID'),
      name: z.string().describe('Document name to update'),
      content: z.string().describe('New full content (markdown)'),
      changelog: z.string().describe('Short description of changes made'),
    }),
    execute: async ({ chart_id, name, content, changelog }) => {
      try {
        const supabase = createServiceClient()
        const { data: row, error: rowError } = await supabase
          .from('documents')
          .select('id, storage_path, version')
          .eq('chart_id', chart_id)
          .eq('name', name)
          .single()
        if (rowError || !row) return { error: rowError?.message ?? 'Document not found' }

        const oldVersion = row.version
        const oldMajor = parseInt(oldVersion.split('.')[0], 10)
        if (isNaN(oldMajor)) return { error: `Cannot parse version: ${oldVersion}` }
        const newVersion = `${oldMajor + 1}.0`
        const newPath = row.storage_path.replace(`_v${oldVersion}.md`, `_v${newVersion}.md`)

        if (newPath === row.storage_path) {
          return { error: 'storage_path does not match expected version suffix pattern' }
        }

        const { error: uploadError } = await supabase
          .storage
          .from('chart-documents')
          .upload(newPath, content, { contentType: 'text/markdown', upsert: true })
        if (uploadError) return { error: uploadError.message }

        const { error: updateError } = await supabase
          .from('documents')
          .update({ storage_path: newPath, version: newVersion, updated_at: new Date().toISOString() })
          .eq('id', row.id)
        if (updateError) return { error: updateError.message }

        return { name, old_version: oldVersion, new_version: newVersion, changelog }
      } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) }
      }
    },
  }),

  append_to_document: tool({
    description: 'Append new content to an existing document (in-place, same version).',
    inputSchema: z.object({
      chart_id: z.string().describe('The chart UUID'),
      name: z.string().describe('Document name to append to'),
      content: z.string().describe('Content to append (separated by horizontal rule)'),
    }),
    execute: async ({ chart_id, name, content }) => {
      try {
        const supabase = createServiceClient()
        const { data: row, error: rowError } = await supabase
          .from('documents')
          .select('storage_path')
          .eq('chart_id', chart_id)
          .eq('name', name)
          .single()
        if (rowError || !row) return { error: rowError?.message ?? 'Document not found' }

        const { data: blob, error: downloadError } = await supabase
          .storage
          .from('chart-documents')
          .download(row.storage_path)
        if (downloadError || !blob) return { error: downloadError?.message ?? 'Download failed' }

        const existing = await blob.text()
        const combined = existing + '\n\n---\n\n' + content

        const { error: uploadError } = await supabase
          .storage
          .from('chart-documents')
          .upload(row.storage_path, combined, { contentType: 'text/markdown', upsert: true })
        if (uploadError) return { error: uploadError.message }

        const { error: updateError } = await supabase
          .from('documents')
          .update({ updated_at: new Date().toISOString() })
          .eq('chart_id', chart_id)
          .eq('name', name)
        if (updateError) return { error: updateError.message }

        return { name, bytes_appended: content.length }
      } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) }
      }
    },
  }),

  update_layer_status: tool({
    description: 'Update the status of a pyramid layer/sublayer.',
    inputSchema: z.object({
      chart_id: z.string().describe('The chart UUID'),
      layer: z.string().describe('Layer designation (L1, L2, L2.5, L3, L4)'),
      sublayer: z.string().describe('Sublayer name'),
      status: z.enum(['not_started', 'in_progress', 'complete']).describe('New status'),
    }),
    execute: async ({ chart_id, layer, sublayer, status }) => {
      try {
        const supabase = createServiceClient()
        const { error } = await supabase
          .from('pyramid_layers')
          .upsert(
            { chart_id, layer, sublayer, status, updated_at: new Date().toISOString() },
            { onConflict: 'chart_id,layer,sublayer' }
          )
        if (error) return { error: error.message }
        return { layer, sublayer, status }
      } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) }
      }
    },
  }),

  run_ephemeris: tool({
    description: 'Run ephemeris calculation for a birth chart via the Python sidecar.',
    inputSchema: z.object({
      birth_date: z.string().describe('Birth date in YYYY-MM-DD format'),
      birth_time: z.string().describe('Birth time in HH:MM format'),
      lat: z.number().describe('Birth latitude in decimal degrees'),
      lng: z.number().describe('Birth longitude in decimal degrees'),
      ut_offset: z.number().optional().describe('UTC offset in hours (default: 5.5 for IST)'),
    }),
    execute: async ({ birth_date, birth_time, lat, lng, ut_offset = 5.5 }) => {
      try {
        const url = process.env.PYTHON_SIDECAR_URL + '/ephemeris'
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.PYTHON_SIDECAR_API_KEY ?? '',
          },
          body: JSON.stringify({ birth_date, birth_time, lat, lng, ut_offset }),
        })
        if (!res.ok) return { error: `Ephemeris request failed: ${res.status} ${res.statusText}` }
        return await res.json()
      } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) }
      }
    },
  }),

  run_computation: tool({
    description: 'Run an arbitrary computation endpoint on the Python sidecar.',
    inputSchema: z.object({
      type: z.string().describe('Computation type / endpoint path (e.g. dashas, transits)'),
      params: z.record(z.string(), z.unknown()).describe('Parameters to pass as the request body'),
    }),
    execute: async ({ type, params }) => {
      try {
        const url = process.env.PYTHON_SIDECAR_URL + '/' + type
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.PYTHON_SIDECAR_API_KEY ?? '',
          },
          body: JSON.stringify(params),
        })
        if (!res.ok) return { error: `Computation request failed: ${res.status} ${res.statusText}` }
        return await res.json()
      } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) }
      }
    },
  }),

  search_in_document: tool({
    description: 'Search for a query string within a document and return matching lines.',
    inputSchema: z.object({
      chart_id: z.string().describe('The chart UUID'),
      name: z.string().describe('Document name to search within'),
      query: z.string().describe('Search term (case-insensitive)'),
    }),
    execute: async ({ chart_id, name, query }) => {
      try {
        const supabase = createServiceClient()
        const { data: row, error: rowError } = await supabase
          .from('documents')
          .select('storage_path')
          .eq('chart_id', chart_id)
          .eq('name', name)
          .single()
        if (rowError || !row) return { error: rowError?.message ?? 'Document not found' }

        const { data: blob, error: downloadError } = await supabase
          .storage
          .from('chart-documents')
          .download(row.storage_path)
        if (downloadError || !blob) return { error: downloadError?.message ?? 'Download failed' }

        const text = await blob.text()
        const lowerQuery = query.toLowerCase()
        const matches = text.split('\n').filter(line => line.toLowerCase().includes(lowerQuery))
        return { name, matches, total_matches: matches.length }
      } catch (e) {
        return { error: e instanceof Error ? e.message : String(e) }
      }
    },
  }),

  get_pyramid_status: tool({
    description: 'Get the status of all pyramid layers for a chart.',
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
