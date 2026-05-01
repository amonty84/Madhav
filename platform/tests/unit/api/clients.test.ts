import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/firebase/server', () => ({
  getServerUser: vi.fn().mockResolvedValue({ uid: 'super-admin-1' }),
  adminAuth: {},
}))

// clients/route.ts uses query() from @/lib/db/client (Cloud SQL)
vi.mock('@/lib/db/client', () => ({
  query: vi.fn(),
}))

import { query } from '@/lib/db/client'

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

    // First call: profile lookup → super_admin role.
    // Second call: charts query.
    ;(query as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ rows: [{ role: 'super_admin' }] })
      .mockResolvedValueOnce({ rows: mockCharts })

    const { GET } = await import('@/app/api/clients/route')
    const response = await GET()
    const body = await response.json()

    expect(body).toEqual(mockCharts)
  })
})
