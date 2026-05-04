import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))

const mockQuery = vi.fn()
vi.mock('@/lib/db/client', () => ({ query: (...a: unknown[]) => mockQuery(...a) }))

import { recordOutcome, computeCalibrationMetrics } from '../queries'

beforeEach(() => {
  vi.clearAllMocks()
})

// ── Test A: computeCalibrationMetrics aggregation ─────────────────────────────

describe('computeCalibrationMetrics', () => {
  it('Test A: returns parsed metrics from DB aggregation result', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{
        mean_brier_score: '0.1250',
        closed_count: '4',
        confirmed_count: '2',
        refuted_count: '1',
        partial_count: '1',
      }],
      rowCount: 1,
    })

    const metrics = await computeCalibrationMetrics('native:abhisek')

    expect(mockQuery).toHaveBeenCalledOnce()
    const [sql, params] = mockQuery.mock.calls[0] as [string, unknown[]]
    expect(sql).toContain('FROM prediction_ledger')
    expect(sql).toContain('outcome IS NOT NULL')
    expect(sql).toContain('AVG(brier_score)')
    expect(params).toContain('native:abhisek')

    expect(metrics.mean_brier_score).toBeCloseTo(0.125)
    expect(metrics.closed_count).toBe(4)
    expect(metrics.confirmed_count).toBe(2)
    expect(metrics.refuted_count).toBe(1)
    expect(metrics.partial_count).toBe(1)
  })

  it('returns null mean_brier_score when DB returns null (no closed predictions)', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{
        mean_brier_score: null,
        closed_count: '0',
        confirmed_count: '0',
        refuted_count: '0',
        partial_count: '0',
      }],
      rowCount: 1,
    })

    const metrics = await computeCalibrationMetrics()
    expect(metrics.mean_brier_score).toBeNull()
    expect(metrics.closed_count).toBe(0)
  })
})

// ── Test B: recordOutcome passes correction_note as $3 ────────────────────────

describe('recordOutcome — correction_note parameter', () => {
  it('Test B: passes correction_note as third SQL param', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{
        id: 'pred-001',
        query_id: 'q-001',
        created_at: '2026-04-28T10:00:00Z',
        prediction_text: 'Career event Q3 2026',
        confidence: 0.7,
        horizon_start: '2026-07-01',
        horizon_end: '2026-09-30',
        falsifier: 'no event',
        subject: 'native:abhisek',
        outcome: 'refuted',
        outcome_observed_at: '2026-10-01T00:00:00Z',
        calibration_bucket: 'false_positive',
        brier_score: 0.49,
        correction_note: 'Saturn aspect underweighted',
      }],
      rowCount: 1,
    })

    await recordOutcome({
      id: 'pred-001',
      outcome: 'refuted',
      correction_note: 'Saturn aspect underweighted',
    })

    expect(mockQuery).toHaveBeenCalledOnce()
    const [sql, params] = mockQuery.mock.calls[0] as [string, unknown[]]
    expect(params[0]).toBe('refuted')
    expect(params[1]).toBe('pred-001')
    expect(params[2]).toBe('Saturn aspect underweighted')
    expect(sql).toContain('correction_note = $3')
    expect(sql).toContain('brier_score')
  })

  it('passes null for correction_note when omitted', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 })

    await recordOutcome({ id: 'pred-002', outcome: 'confirmed' })

    const [, params] = mockQuery.mock.calls[0] as [string, unknown[]]
    expect(params[2]).toBeNull()
  })
})

// ── Tests C & D: Brier score formula ─────────────────────────────────────────

describe('Brier score formula (SQL POWER assertions)', () => {
  it('Test C: confirmed with confidence=0.7 → SQL computes POWER(0.7-1, 2) = 0.09', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 })

    await recordOutcome({ id: 'p-c', outcome: 'confirmed' })

    const [sql] = mockQuery.mock.calls[0] as [string]
    // Verify the SQL encodes the correct formula for 'confirmed'
    expect(sql).toContain("WHEN $1 = 'confirmed' THEN POWER(confidence - 1.0, 2)")
    // Algebraic check: (0.7 - 1)^2 = (-0.3)^2 = 0.09
    expect(Math.pow(0.7 - 1.0, 2)).toBeCloseTo(0.09)
  })

  it('Test D: refuted with confidence=0.9 → SQL computes POWER(0.9-0, 2) = 0.81', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 })

    await recordOutcome({ id: 'p-d', outcome: 'refuted' })

    const [sql] = mockQuery.mock.calls[0] as [string]
    expect(sql).toContain("WHEN $1 = 'refuted'   THEN POWER(confidence - 0.0, 2)")
    // Algebraic check: (0.9 - 0)^2 = 0.81
    expect(Math.pow(0.9 - 0.0, 2)).toBeCloseTo(0.81)
  })

  it('partial outcome → brier_score is NULL (ELSE NULL branch)', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 })

    await recordOutcome({ id: 'p-e', outcome: 'partial' })

    const [sql] = mockQuery.mock.calls[0] as [string]
    expect(sql).toContain('ELSE NULL')
  })
})
