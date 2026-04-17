import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
  createServiceClient: vi.fn(),
}))

import { createClient, createServiceClient } from '@/lib/supabase/server'

describe('clients API', () => {
  it('returns charts for astrologer', async () => {
    const mockCharts = [
      { id: 'chart-1', name: 'Abhisek Mohanty', birth_date: '1984-02-05',
        birth_time: '10:43:00', birth_place: 'Bhubaneswar', ayanamsa: 'lahiri',
        house_system: 'sripathi', client_id: 'user-1', created_at: '2026-01-01' }
    ]

    // Auth mock: authenticated astrologer
    const mockAuthClient = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'astrologer-1' } } }) },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { role: 'astrologer' } }),
      }),
    }
    ;(createClient as ReturnType<typeof vi.fn>).mockResolvedValue(mockAuthClient)

    // Service client mock: returns chart data
    const mockQuery = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockCharts, error: null }),
    }
    ;(createServiceClient as ReturnType<typeof vi.fn>).mockReturnValue({
      from: vi.fn().mockReturnValue(mockQuery),
    })

    const { GET } = await import('@/app/api/clients/route')
    const response = await GET()
    const body = await response.json()

    expect(body).toEqual(mockCharts)
  })
})
