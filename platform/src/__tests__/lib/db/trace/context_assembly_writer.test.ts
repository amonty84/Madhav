import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('@/lib/storage', () => ({
  getStorageClient: vi.fn(),
}))

import { writeContextAssemblyLog } from '@/lib/db/trace/context_assembly_writer'
import type { ContextAssemblyItem } from '@/lib/db/trace/context_assembly_writer'
import type { StorageClient } from '@/lib/storage/types'

const flush = () => new Promise(resolve => setTimeout(resolve, 0))

function makeDb(queryImpl?: () => Promise<unknown>): StorageClient {
  return {
    query: vi.fn(queryImpl ?? (() => Promise.resolve({ rows: [], rowCount: 0 }))),
    transaction: vi.fn(),
    readObject: vi.fn(),
    writeObject: vi.fn(),
    objectExists: vi.fn(),
    readFile: vi.fn(),
    fileExists: vi.fn(),
    listFiles: vi.fn(),
  } as unknown as StorageClient
}

function makeItem(overrides: Partial<ContextAssemblyItem> = {}): ContextAssemblyItem {
  return {
    query_id: 'aaaaaaaa-0000-0000-0000-000000000001',
    assembly_step_id: 'assemble:test',
    item_rank: 0,
    source_bundle: 'L1',
    source_item_id: 'FORENSIC',
    layer: 'L1',
    token_cost: 500,
    status: 'INCLUDED',
    cumulative_tokens_at_decision: 0,
    budget_at_decision: 12000,
    ...overrides,
  }
}

describe('writeContextAssemblyLog', () => {
  beforeEach(() => vi.clearAllMocks())

  it('happy path: calls db.query with INSERT and correct param count', async () => {
    const db = makeDb()
    const items = [makeItem({ item_rank: 0 }), makeItem({ item_rank: 1 })]
    writeContextAssemblyLog(items, db)
    await flush()
    expect(db.query).toHaveBeenCalledOnce()
    const [sql, params] = (db.query as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(sql).toContain('INSERT INTO context_assembly_item_log')
    expect(params).toHaveLength(items.length * 12)
  })

  it('empty array: db.query is NOT called', async () => {
    const db = makeDb()
    writeContextAssemblyLog([], db)
    await flush()
    expect(db.query).not.toHaveBeenCalled()
  })

  it('DB error: does not throw, error is swallowed', async () => {
    const db = makeDb(() => Promise.reject(new Error('db connection lost')))
    expect(() => writeContextAssemblyLog([makeItem()], db)).not.toThrow()
    await flush()
    expect(db.query).toHaveBeenCalled()
  })

  it('caps at 500 items — inserts only first 500 when given 501', async () => {
    const db = makeDb()
    const items = Array.from({ length: 501 }, (_, i) => makeItem({ item_rank: i }))
    writeContextAssemblyLog(items, db)
    await flush()
    expect(db.query).toHaveBeenCalledOnce()
    const [, params] = (db.query as ReturnType<typeof vi.fn>).mock.calls[0]
    expect((params as unknown[]).length).toBe(500 * 12)
  })

  it('includes optional fields as null when omitted', async () => {
    const db = makeDb()
    const item = makeItem({ status: 'DROPPED', drop_reason: undefined, relevance_score: undefined })
    writeContextAssemblyLog([item], db)
    await flush()
    const [, params] = (db.query as ReturnType<typeof vi.fn>).mock.calls[0]
    const paramArr = params as unknown[]
    // relevance_score is param[7] (0-indexed), drop_reason is param[9]
    expect(paramArr[7]).toBeNull()
    expect(paramArr[9]).toBeNull()
  })
})
