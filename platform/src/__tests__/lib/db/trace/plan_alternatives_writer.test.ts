import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('@/lib/storage', () => ({
  getStorageClient: vi.fn(),
}))

import { writePlanAlternatives } from '@/lib/db/trace/plan_alternatives_writer'
import type { PlanAlternative } from '@/lib/db/trace/plan_alternatives_writer'
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

function makeAlt(overrides: Partial<PlanAlternative> = {}): PlanAlternative {
  return {
    query_id: 'bbbbbbbb-0000-0000-0000-000000000001',
    bundle_name: 'msr_sql',
    was_selected: true,
    ...overrides,
  }
}

describe('writePlanAlternatives', () => {
  beforeEach(() => vi.clearAllMocks())

  it('happy path: calls db.query with INSERT and correct param count', async () => {
    const db = makeDb()
    const alts = [makeAlt({ bundle_name: 'msr_sql' }), makeAlt({ bundle_name: 'vector_search', was_selected: false })]
    writePlanAlternatives(alts, db)
    await flush()
    expect(db.query).toHaveBeenCalledOnce()
    const [sql, params] = (db.query as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(sql).toContain('INSERT INTO plan_alternatives_log')
    expect((params as unknown[]).length).toBe(alts.length * 5)
  })

  it('empty array: db.query is NOT called', async () => {
    const db = makeDb()
    writePlanAlternatives([], db)
    await flush()
    expect(db.query).not.toHaveBeenCalled()
  })

  it('DB error: does not throw, error is swallowed', async () => {
    const db = makeDb(() => Promise.reject(new Error('connection error')))
    expect(() => writePlanAlternatives([makeAlt()], db)).not.toThrow()
    await flush()
    expect(db.query).toHaveBeenCalled()
  })

  it('optional fields rationale and expected_recall_score default to null', async () => {
    const db = makeDb()
    writePlanAlternatives([makeAlt()], db)
    await flush()
    const [, params] = (db.query as ReturnType<typeof vi.fn>).mock.calls[0]
    const p = params as unknown[]
    // params for one row: [query_id, bundle_name, was_selected, rationale, expected_recall_score]
    expect(p[3]).toBeNull()  // rationale defaults to null
    expect(p[4]).toBeNull()  // expected_recall_score defaults to null
  })
})
