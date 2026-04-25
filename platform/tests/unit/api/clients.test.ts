import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/firebase/server', () => ({
  getServerUser: vi.fn().mockResolvedValue({ uid: 'super-admin-1' }),
  adminAuth: {},
}))

vi.mock('@/lib/supabase/server', () => ({
  createServiceClient: vi.fn(),
}))

import { createServiceClient } from '@/lib/supabase/server'

describe('clients API', () => {
  it('returns charts for super_admin', async () => {
    const mockCharts = [
      {
        id: 'chart-1',
        name: 'Abhisek Mohanty',
        birth_date: '1984-02-05',
        birth_time: '10:43:00',
        birth_place: 'Bhubaneswar',
        ayanamsa: 'lahiri',
        house_system: 'sripathi',
        client_id: 'user-1',
        created_at: '2026-01-01',
      },
    ]

    // Profile lookup → super_admin role.
    const profileQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role: 'super_admin' } }),
    }
    // Charts query.
    const chartsQuery = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockCharts, error: null }),
    }
    const fromMock = vi.fn((table: string) =>
      table === 'profiles' ? profileQuery : chartsQuery,
    )
    ;(createServiceClient as ReturnType<typeof vi.fn>).mockReturnValue({
      from: fromMock,
    })

    const { GET } = await import('@/app/api/clients/route')
    const response = await GET()
    const body = await response.json()

    expect(body).toEqual(mockCharts)
  })
})
