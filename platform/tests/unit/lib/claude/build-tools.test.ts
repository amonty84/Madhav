import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
  createServiceClient: vi.fn(),
}))

import { createServiceClient } from '@/lib/supabase/server'

describe('buildTools', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exports 10 tool definitions', async () => {
    const { buildTools } = await import('@/lib/claude/build-tools')
    expect(Object.keys(buildTools)).toHaveLength(10)
  })

  it('every tool has description and inputSchema', async () => {
    const { buildTools } = await import('@/lib/claude/build-tools')
    for (const t of Object.values(buildTools)) {
      expect(t).toHaveProperty('description')
      expect(t).toHaveProperty('inputSchema')
    }
  })

  it('includes required tool names', async () => {
    const { buildTools } = await import('@/lib/claude/build-tools')
    const names = Object.keys(buildTools)
    expect(names).toContain('list_documents')
    expect(names).toContain('read_document')
    expect(names).toContain('create_document')
    expect(names).toContain('update_document')
    expect(names).toContain('run_ephemeris')
    expect(names).toContain('get_pyramid_status')
    expect(names).toContain('append_to_document')
    expect(names).toContain('update_layer_status')
    expect(names).toContain('run_computation')
    expect(names).toContain('search_in_document')
  })

  describe('list_documents', () => {
    it('returns documents array for a chart', async () => {
      const mockDocs = [
        { id: 'doc-1', name: 'forensic_data', layer: 'L1', version: '6.0', updated_at: '2026-01-01' },
        { id: 'doc-2', name: 'holistic_synthesis', layer: 'L2.5', version: '1.0', updated_at: '2026-01-02' },
      ]

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
      }
      // Second order() call resolves
      mockQuery.order
        .mockReturnValueOnce(mockQuery)
        .mockResolvedValueOnce({ data: mockDocs, error: null })

      ;(createServiceClient as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue(mockQuery),
      })

      const { buildTools } = await import('@/lib/claude/build-tools')
      const result = await buildTools.list_documents.execute!({ chart_id: 'chart-1' }, {} as never)
      expect(result).toEqual(mockDocs)
    })

    it('returns documents filtered by layer', async () => {
      const mockDocs = [
        { id: 'doc-1', name: 'forensic_data', layer: 'L1', version: '6.0', updated_at: '2026-01-01' },
      ]

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
      }
      mockQuery.order
        .mockReturnValueOnce(mockQuery)
        .mockResolvedValueOnce({ data: mockDocs, error: null })

      ;(createServiceClient as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue(mockQuery),
      })

      const { buildTools } = await import('@/lib/claude/build-tools')
      const result = await buildTools.list_documents.execute!({ chart_id: 'chart-1', layer: 'L1' }, {} as never)
      expect(result).toEqual(mockDocs)
    })

    it('returns error object on DB failure', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
      }
      mockQuery.order
        .mockReturnValueOnce(mockQuery)
        .mockResolvedValueOnce({ data: null, error: { message: 'DB error' } })

      ;(createServiceClient as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue(mockQuery),
      })

      const { buildTools } = await import('@/lib/claude/build-tools')
      const result = await buildTools.list_documents.execute!({ chart_id: 'chart-1' }, {} as never)
      expect(result).toEqual({ error: 'DB error' })
    })
  })

  describe('read_document', () => {
    it('returns document content', async () => {
      const mockRow = {
        id: 'doc-1',
        name: 'forensic_data',
        layer: 'L1',
        version: '6.0',
        storage_path: 'charts/chart-1/L1/forensic_data_v6.0.md',
      }
      const mockContent = '# Forensic Astrological Data\n\nContent here.'

      const mockFrom = vi.fn()
      mockFrom.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockRow, error: null }),
      })

      const mockBlob = { text: vi.fn().mockResolvedValue(mockContent) }
      const mockStorage = {
        from: vi.fn().mockReturnValue({
          download: vi.fn().mockResolvedValue({ data: mockBlob, error: null }),
        }),
      }

      ;(createServiceClient as ReturnType<typeof vi.fn>).mockReturnValue({
        from: mockFrom,
        storage: mockStorage,
      })

      const { buildTools } = await import('@/lib/claude/build-tools')
      const result = await buildTools.read_document.execute!({ chart_id: 'chart-1', name: 'forensic_data' }, {} as never)
      expect(result).toEqual({
        name: 'forensic_data',
        layer: 'L1',
        version: '6.0',
        content: mockContent,
      })
    })

    it('returns error when document not found', async () => {
      ;(createServiceClient as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Row not found' } }),
        }),
      })

      const { buildTools } = await import('@/lib/claude/build-tools')
      const result = await buildTools.read_document.execute!({ chart_id: 'chart-1', name: 'missing' }, {} as never)
      expect(result).toEqual({ error: 'Row not found' })
    })
  })

  describe('get_pyramid_status', () => {
    it('returns pyramid layer statuses', async () => {
      const mockLayers = [
        { layer: 'L1', sublayer: 'facts', status: 'complete', version: '6.0', updated_at: '2026-01-01' },
        { layer: 'L2', sublayer: 'analysis_mode_a', status: 'in_progress', version: null, updated_at: '2026-01-02' },
        { layer: 'L2.5', sublayer: 'synthesis', status: 'not_started', version: null, updated_at: '2026-01-01' },
      ]

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
      }
      mockQuery.order
        .mockReturnValueOnce(mockQuery)
        .mockResolvedValueOnce({ data: mockLayers, error: null })

      ;(createServiceClient as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue(mockQuery),
      })

      const { buildTools } = await import('@/lib/claude/build-tools')
      const result = await buildTools.get_pyramid_status.execute!({ chart_id: 'chart-1' }, {} as never)
      expect(result).toEqual(mockLayers)
    })

    it('returns error on DB failure', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
      }
      mockQuery.order
        .mockReturnValueOnce(mockQuery)
        .mockResolvedValueOnce({ data: null, error: { message: 'Connection timeout' } })

      ;(createServiceClient as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue(mockQuery),
      })

      const { buildTools } = await import('@/lib/claude/build-tools')
      const result = await buildTools.get_pyramid_status.execute!({ chart_id: 'chart-1' }, {} as never)
      expect(result).toEqual({ error: 'Connection timeout' })
    })
  })

  describe('update_layer_status', () => {
    it('upserts layer status and returns result', async () => {
      const mockUpsert = {
        upsert: vi.fn().mockResolvedValue({ error: null }),
      }

      ;(createServiceClient as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue(mockUpsert),
      })

      const { buildTools } = await import('@/lib/claude/build-tools')
      const result = await buildTools.update_layer_status.execute!(
        { chart_id: 'chart-1', layer: 'L1', sublayer: 'facts', status: 'complete' },
        {} as never
      )
      expect(result).toEqual({ layer: 'L1', sublayer: 'facts', status: 'complete' })
      expect(mockUpsert.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ chart_id: 'chart-1', layer: 'L1', sublayer: 'facts', status: 'complete' }),
        { onConflict: 'chart_id,layer,sublayer' }
      )
    })

    it('returns error on upsert failure', async () => {
      ;(createServiceClient as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          upsert: vi.fn().mockResolvedValue({ error: { message: 'Upsert failed' } }),
        }),
      })

      const { buildTools } = await import('@/lib/claude/build-tools')
      const result = await buildTools.update_layer_status.execute!(
        { chart_id: 'chart-1', layer: 'L1', sublayer: 'facts', status: 'in_progress' },
        {} as never
      )
      expect(result).toEqual({ error: 'Upsert failed' })
    })
  })
})
