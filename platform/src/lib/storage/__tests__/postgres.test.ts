import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock db/client and telemetry before importing the module under test
vi.mock('../../db/client', () => {
  const mockQuery = vi.fn().mockResolvedValue({ rows: [{ id: 1 }], rowCount: 1 })
  const mockClient = {
    query: vi.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
    release: vi.fn(),
  }
  const mockPool = {
    connect: vi.fn().mockResolvedValue(mockClient),
  }
  return {
    query: mockQuery,
    getPool: vi.fn().mockResolvedValue(mockPool),
    _mockQuery: mockQuery,
    _mockClient: mockClient,
    _mockPool: mockPool,
  }
})

vi.mock('../../telemetry/index', () => ({
  telemetry: {
    recordLatency: vi.fn(),
  },
}))

import { postgresAdapter } from '../postgres'
import * as dbClient from '../../db/client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mocked = dbClient as any

describe('postgresAdapter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Re-establish mock return values after clearAllMocks
    mocked._mockQuery.mockResolvedValue({ rows: [{ id: 1 }], rowCount: 1 })
    mocked._mockClient.query.mockResolvedValue({ rows: [], rowCount: 0 })
    mocked._mockClient.release.mockReturnValue(undefined)
    mocked._mockPool.connect.mockResolvedValue(mocked._mockClient)
    mocked.getPool.mockResolvedValue(mocked._mockPool)
  })

  it('query delegates to db client and returns rows + rowCount', async () => {
    const result = await postgresAdapter.query('SELECT 1')
    expect(mocked._mockQuery).toHaveBeenCalledWith('SELECT 1', undefined)
    expect(result.rows).toEqual([{ id: 1 }])
    expect(result.rowCount).toBe(1)
  })

  it('query passes params to db client', async () => {
    await postgresAdapter.query('SELECT $1', [42])
    expect(mocked._mockQuery).toHaveBeenCalledWith('SELECT $1', [42])
  })

  it('transaction calls BEGIN, fn, COMMIT, and releases client', async () => {
    const fn = vi.fn().mockResolvedValue('result')
    const result = await postgresAdapter.transaction(fn)

    expect(mocked._mockClient.query).toHaveBeenCalledWith('BEGIN')
    expect(fn).toHaveBeenCalledTimes(1)
    expect(mocked._mockClient.query).toHaveBeenCalledWith('COMMIT')
    expect(mocked._mockClient.release).toHaveBeenCalled()
    expect(result).toBe('result')
  })

  it('transaction rolls back on error and rethrows', async () => {
    const err = new Error('oops')
    const fn = vi.fn().mockRejectedValue(err)

    await expect(postgresAdapter.transaction(fn)).rejects.toThrow('oops')
    expect(mocked._mockClient.query).toHaveBeenCalledWith('ROLLBACK')
    expect(mocked._mockClient.release).toHaveBeenCalled()
  })
})
