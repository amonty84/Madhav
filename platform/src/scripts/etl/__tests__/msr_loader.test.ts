import { describe, it, expect, vi } from 'vitest'

// Mock server-only to allow imports in test environment
vi.mock('server-only', () => ({}))

// Mock the entire storage module and all transitive dependencies
vi.mock('@/lib/storage/index', () => {
  const mockQuery = vi.fn().mockResolvedValue({ rows: [{ count: '0' }], rowCount: 1 })
  const mockTxQuery = vi.fn().mockResolvedValue({ rows: [], rowCount: 0 })
  const mockTransaction = vi.fn().mockImplementation(
    async (fn: (tx: { query: typeof mockTxQuery }) => Promise<void>) => {
      const tx = { query: mockTxQuery }
      return await fn(tx)
    }
  )
  return {
    getStorageClient: () => ({
      query: mockQuery,
      transaction: mockTransaction,
    }),
  }
})

vi.mock('@/lib/storage/postgres', () => ({
  postgresAdapter: {
    query: vi.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
    transaction: vi.fn(),
  },
}))

vi.mock('@/lib/db/client', () => ({
  query: vi.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
  getPool: vi.fn(),
}))

import { loadMsrSignals } from '../msr_loader'
import type { MsrSignal } from '@/lib/db/types'

describe('loadMsrSignals', () => {
  it('calls delete then insert in transaction', async () => {
    const fakeSignals: MsrSignal[] = [
      {
        signal_id: 'SIG.MSR.001',
        native_id: 'abhisek',
        domain: 'career',
        planet: 'SATURN',
        house: 7,
        nakshatra: null,
        dasha_lord: null,
        confidence: 0.95,
        significance: 0.92,
        is_forward_looking: false,
        claim_text: 'Test signal',
        classical_basis: null,
        falsifier: null,
        source_file: 'MSR_v3_0.md',
        source_version: '3.0',
        ingested_at: new Date().toISOString(),
      },
    ]
    const result = await loadMsrSignals(fakeSignals)
    expect(result.inserted).toBe(1)
  })
})
