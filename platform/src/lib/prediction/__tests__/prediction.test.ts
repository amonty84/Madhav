import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))

const mockQuery = vi.fn()
vi.mock('@/lib/db/client', () => ({ query: (...a: unknown[]) => mockQuery(...a) }))

import { logPrediction } from '../writer'
import { listOpenPredictions } from '../reader'
import type { Prediction } from '../types'

function makePrediction(overrides: Partial<Prediction> = {}): Prediction {
  return {
    query_id: 'bbbbbbbb-0000-0000-0000-000000000001',
    prediction_text: 'Career acceleration likely in Q3 2026 during Jupiter transit over 10th lord',
    confidence: 0.72,
    horizon_start: '2026-07-01',
    horizon_end: '2026-09-30',
    falsifier: 'No significant career event (promotion, new role, or business milestone) observed by 2026-09-30',
    subject: 'native:abhisek',
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  mockQuery.mockResolvedValue({ rows: [{ id: 'new-uuid-001' }], rowCount: 1 })
})

// ── logPrediction: valid write ────────────────────────────────────────────────

describe('logPrediction — valid write', () => {
  it('inserts into prediction_ledger and returns the new id', async () => {
    const id = await logPrediction(makePrediction())

    expect(id).toBe('new-uuid-001')
    expect(mockQuery).toHaveBeenCalledOnce()
    const [sql, params] = mockQuery.mock.calls[0] as [string, unknown[]]
    expect(sql).toContain('INSERT INTO prediction_ledger')
    expect(sql).toContain('RETURNING id')
    expect(params[0]).toBe('bbbbbbbb-0000-0000-0000-000000000001')
    expect(params[2]).toBe(0.72)
  })

  it('defaults subject to native:abhisek when omitted', async () => {
    const p = makePrediction()
    delete (p as Partial<Prediction>).subject
    await logPrediction(p)

    const [, params] = mockQuery.mock.calls[0] as [string, unknown[]]
    expect(params[6]).toBe('native:abhisek')
  })

  it('uses provided subject when supplied', async () => {
    await logPrediction(makePrediction({ subject: 'native:other' }))

    const [, params] = mockQuery.mock.calls[0] as [string, unknown[]]
    expect(params[6]).toBe('native:other')
  })
})

// ── logPrediction: sacrosanct rule — reject write with outcome populated ──────

describe('logPrediction — sacrosanct rule', () => {
  it('throws when outcome is a non-null string on the input object', async () => {
    const bad = { ...makePrediction(), outcome: 'career change observed 2026-08-15' }
    await expect(logPrediction(bad as unknown as Prediction)).rejects.toThrow(
      'held-out discipline violated'
    )
    expect(mockQuery).not.toHaveBeenCalled()
  })

  it('throws when outcome is an empty string (still non-null)', async () => {
    const bad = { ...makePrediction(), outcome: '' }
    await expect(logPrediction(bad as unknown as Prediction)).rejects.toThrow(
      'held-out discipline violated'
    )
  })

  it('does NOT throw when outcome key is absent entirely', async () => {
    const p = makePrediction()
    await expect(logPrediction(p)).resolves.toBe('new-uuid-001')
  })
})

// ── logPrediction: horizon validation ────────────────────────────────────────

describe('logPrediction — horizon validation', () => {
  it('throws when horizon_start > horizon_end', async () => {
    await expect(
      logPrediction(makePrediction({ horizon_start: '2026-10-01', horizon_end: '2026-09-01' }))
    ).rejects.toThrow('horizon_start')
    expect(mockQuery).not.toHaveBeenCalled()
  })

  it('allows same-day horizon (start == end)', async () => {
    await expect(
      logPrediction(makePrediction({ horizon_start: '2026-07-15', horizon_end: '2026-07-15' }))
    ).resolves.toBeDefined()
  })

  it('throws when horizon_start is missing', async () => {
    const p = makePrediction()
    ;(p as Partial<Prediction>).horizon_start = undefined as unknown as string
    await expect(logPrediction(p)).rejects.toThrow('horizon_start and horizon_end are required')
  })

  it('throws when confidence is out of range (> 1)', async () => {
    await expect(logPrediction(makePrediction({ confidence: 1.5 }))).rejects.toThrow('confidence')
  })

  it('throws when confidence is out of range (< 0)', async () => {
    await expect(logPrediction(makePrediction({ confidence: -0.1 }))).rejects.toThrow('confidence')
  })

  it('allows confidence = 0 and confidence = 1 (boundary)', async () => {
    await expect(logPrediction(makePrediction({ confidence: 0 }))).resolves.toBeDefined()
    await expect(logPrediction(makePrediction({ confidence: 1 }))).resolves.toBeDefined()
  })

  it('throws when falsifier is empty', async () => {
    await expect(logPrediction(makePrediction({ falsifier: '   ' }))).rejects.toThrow('falsifier')
  })
})

// ── listOpenPredictions: reader filters ──────────────────────────────────────

describe('listOpenPredictions — reader filters', () => {
  const sampleRows = [
    {
      id: 'row-001',
      query_id: 'q-001',
      created_at: '2026-04-28T10:00:00Z',
      prediction_text: 'Career event Q3',
      confidence: '0.72',
      horizon_start: '2026-07-01',
      horizon_end: '2026-09-30',
      falsifier: 'no event',
      subject: 'native:abhisek',
      outcome: null,
      outcome_observed_at: null,
      calibration_bucket: null,
    },
  ]

  it('queries with outcome IS NULL when no filters given', async () => {
    mockQuery.mockResolvedValueOnce({ rows: sampleRows })
    const rows = await listOpenPredictions()

    expect(mockQuery).toHaveBeenCalledOnce()
    const [sql] = mockQuery.mock.calls[0] as [string]
    expect(sql).toContain('outcome IS NULL')
    expect(rows).toHaveLength(1)
    expect(rows[0].id).toBe('row-001')
  })

  it('adds subject filter when provided', async () => {
    mockQuery.mockResolvedValueOnce({ rows: sampleRows })
    await listOpenPredictions({ subject: 'native:abhisek' })

    const [sql, params] = mockQuery.mock.calls[0] as [string, unknown[]]
    expect(sql).toContain('subject = $')
    expect(params).toContain('native:abhisek')
  })

  it('adds beforeHorizonEnd filter when provided', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] })
    await listOpenPredictions({ beforeHorizonEnd: '2026-12-31' })

    const [sql, params] = mockQuery.mock.calls[0] as [string, unknown[]]
    expect(sql).toContain('horizon_end <=')
    expect(params).toContain('2026-12-31')
  })

  it('applies both filters together', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] })
    await listOpenPredictions({ subject: 'native:abhisek', beforeHorizonEnd: '2026-12-31' })

    const [sql, params] = mockQuery.mock.calls[0] as [string, unknown[]]
    expect(sql).toContain('subject = $')
    expect(sql).toContain('horizon_end <=')
    expect(params).toHaveLength(2)
  })

  it('returns empty array when no rows match', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] })
    const rows = await listOpenPredictions({ subject: 'native:unknown' })
    expect(rows).toEqual([])
  })
})
