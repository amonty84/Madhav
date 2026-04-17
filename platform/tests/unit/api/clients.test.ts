import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createServiceClient: vi.fn(),
}))

import { createServiceClient } from '@/lib/supabase/server'

describe('clients API', () => {
  it('returns charts for astrologer', async () => {
    const mockCharts = [
      { id: 'chart-1', name: 'Abhisek Mohanty', birth_date: '1984-02-05',
        birth_time: '10:43:00', birth_place: 'Bhubaneswar', ayanamsa: 'lahiri',
        house_system: 'sripathi', client_id: 'user-1', created_at: '2026-01-01' }
    ]
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
