import { tool } from 'ai'
import { z } from 'zod'
import { query } from '@/lib/db/client'
import { chartDocsBucket, gcsDownloadText, gcsUpload, gcsDelete } from '@/lib/storage/client'

export const buildTools = {
  list_documents: tool({
    description: 'List all documents for a chart, optionally filtered by layer.',
    inputSchema: z.object({
      chart_id: z.string().describe('The chart UUID'),
      layer: z.string().optional().describe('Optional layer filter (e.g. L1, L2, L2.5, L3, L4)'),
    }),
    execute: async ({ chart_id, layer }) => {
      try {
        let sql = 'SELECT id, name, layer, version, updated_at FROM documents WHERE chart_id=$1'
        const params: unknown[] = [chart_id]
        if (layer) { sql += ' AND layer=$2'; params.push(layer) }
        sql += ' ORDER BY layer, name'
        const { rows } = await query(sql, params)
        return rows
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
        const { rows } = await query(
          'SELECT id, name, layer, version, storage_path FROM documents WHERE chart_id=$1 AND name=$2',
          [chart_id, name]
        )
        const row = rows[0] ?? null
        if (!row) return { error: 'Document not found' }
        const content = await gcsDownloadText(chartDocsBucket(), row.storage_path)
        if (!content) return { error: 'Download failed' }
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
        const storage_path = `charts/${chart_id}/${layer}/${name}_v1.0.md`
        await gcsUpload(chartDocsBucket(), storage_path, content, 'text/markdown')
        try {
          const { rows } = await query(
            'INSERT INTO documents (chart_id, layer, name, storage_path, version) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, storage_path, version',
            [chart_id, layer, name, storage_path, '1.0']
          )
          const row = rows[0]
          return { id: row.id, name: row.name, storage_path: row.storage_path, version: row.version }
        } catch (insertErr) {
          await gcsDelete(chartDocsBucket(), storage_path)
          return { error: insertErr instanceof Error ? insertErr.message : 'Insert failed' }
        }
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
        const { rows } = await query(
          'SELECT id, storage_path, version FROM documents WHERE chart_id=$1 AND name=$2',
          [chart_id, name]
        )
        const row = rows[0] ?? null
        if (!row) return { error: 'Document not found' }

        const oldMajor = parseInt(row.version.split('.')[0], 10)
        if (isNaN(oldMajor)) return { error: `Cannot parse version: ${row.version}` }
        const newVersion = `${oldMajor + 1}.0`
        const newPath = row.storage_path.replace(`_v${row.version}.md`, `_v${newVersion}.md`)

        if (newPath === row.storage_path) {
          return { error: 'storage_path does not match expected version suffix pattern' }
        }

        await gcsUpload(chartDocsBucket(), newPath, content, 'text/markdown')
        await query(
          'UPDATE documents SET storage_path=$1, version=$2, updated_at=now() WHERE id=$3',
          [newPath, newVersion, row.id]
        )
        return { name, old_version: row.version, new_version: newVersion, changelog }
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
        const { rows } = await query(
          'SELECT storage_path FROM documents WHERE chart_id=$1 AND name=$2',
          [chart_id, name]
        )
        const row = rows[0] ?? null
        if (!row) return { error: 'Document not found' }

        const existing = await gcsDownloadText(chartDocsBucket(), row.storage_path)
        if (existing === null) return { error: 'Download failed' }

        const combined = existing + '\n\n---\n\n' + content
        await gcsUpload(chartDocsBucket(), row.storage_path, combined, 'text/markdown')
        await query(
          'UPDATE documents SET updated_at=now() WHERE chart_id=$1 AND name=$2',
          [chart_id, name]
        )
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
        await query(
          `INSERT INTO pyramid_layers (chart_id, layer, sublayer, status, updated_at)
           VALUES ($1,$2,$3,$4,now())
           ON CONFLICT (chart_id, layer, sublayer) DO UPDATE
           SET status=$4, updated_at=now()`,
          [chart_id, layer, sublayer, status]
        )
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
    execute: async ({ chart_id, name, query: searchQuery }) => {
      try {
        const { rows } = await query(
          'SELECT storage_path FROM documents WHERE chart_id=$1 AND name=$2',
          [chart_id, name]
        )
        const row = rows[0] ?? null
        if (!row) return { error: 'Document not found' }

        const text = await gcsDownloadText(chartDocsBucket(), row.storage_path)
        if (!text) return { error: 'Download failed' }

        const lowerQuery = searchQuery.toLowerCase()
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
