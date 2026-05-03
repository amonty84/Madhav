// Phase O — O.4 Analytics — USTAD_S4_6 anomaly detection tests.
//
// Layout:
//   §A  z-score classification (4): below threshold → no anomaly;
//       above threshold → flagged; min_data_points gate; stddev=0 → 0
//       z_score (avoid divide-by-zero false positives)
//   §B  alert dispatch (3): fires when anomalies.length > 0; webhook
//       payload shape; webhook failure swallowed (never throws)
//   §C  config resolution (1): defaults applied when partial passed
//
// Discipline mirrors pricing_diff.test.ts — DB swapped for vi.fn(), fetch
// stubbed on globalThis.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('server-only', () => ({}))

import {
  DEFAULT_LOOKBACK_DAYS,
  DEFAULT_Z_THRESHOLD,
  DEFAULT_MIN_DATA_POINTS,
  detectAnomalies,
  type AnomalyDimension,
} from '@/lib/observatory/analytics/anomaly'

interface MockRow {
  dimension: AnomalyDimension
  dimension_value: string
  cost_date: string
  observed_cost_usd: number
  mean_cost_usd: number
  stddev_cost_usd: number
  data_points: number
  z_score: number
}

function makeQuery(rows: MockRow[]) {
  return vi.fn().mockResolvedValue({ rows })
}

describe('§A — detectAnomalies z-score classification', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>
  let originalFetch: typeof globalThis.fetch
  const originalWebhook = process.env.OBSERVATORY_ALERT_WEBHOOK_URL

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    originalFetch = globalThis.fetch
    delete process.env.OBSERVATORY_ALERT_WEBHOOK_URL
  })

  afterEach(() => {
    warnSpy.mockRestore()
    globalThis.fetch = originalFetch
    if (originalWebhook === undefined) {
      delete process.env.OBSERVATORY_ALERT_WEBHOOK_URL
    } else {
      process.env.OBSERVATORY_ALERT_WEBHOOK_URL = originalWebhook
    }
  })

  it('1. z_score below threshold → no anomaly recorded', async () => {
    const queryFn = makeQuery([
      {
        dimension: 'provider',
        dimension_value: 'anthropic',
        cost_date: '2026-05-02',
        observed_cost_usd: 1.05,
        mean_cost_usd: 1.0,
        stddev_cost_usd: 0.1,
        data_points: 14,
        z_score: 0.5, // 0.5 < 2.5
      },
    ])
    const result = await detectAnomalies(undefined, queryFn)
    expect(result.total_series_checked).toBe(1)
    expect(result.anomalies).toHaveLength(0)
    expect(result.alert_fired).toBe(false)
    expect(result.config.z_threshold).toBe(DEFAULT_Z_THRESHOLD)
    expect(result.config.lookback_days).toBe(DEFAULT_LOOKBACK_DAYS)
  })

  it('2. z_score above threshold → flagged is_anomaly=true', async () => {
    const queryFn = makeQuery([
      {
        dimension: 'provider',
        dimension_value: 'openai',
        cost_date: '2026-05-02',
        observed_cost_usd: 50.0,
        mean_cost_usd: 5.0,
        stddev_cost_usd: 2.0,
        data_points: 14,
        z_score: 22.5,
      },
    ])
    const result = await detectAnomalies(undefined, queryFn)
    expect(result.anomalies).toHaveLength(1)
    const anomaly = result.anomalies[0]
    expect(anomaly.dimension).toBe('provider')
    expect(anomaly.dimension_value).toBe('openai')
    expect(anomaly.is_anomaly).toBe(true)
    expect(anomaly.z_score).toBe(22.5)
    expect(result.alert_fired).toBe(true)
  })

  it('3. multiple anomalies sorted by z_score DESC', async () => {
    const queryFn = makeQuery([
      {
        dimension: 'provider',
        dimension_value: 'gemini',
        cost_date: '2026-05-02',
        observed_cost_usd: 2.0,
        mean_cost_usd: 1.0,
        stddev_cost_usd: 0.2,
        data_points: 14,
        z_score: 5.0,
      },
      {
        dimension: 'pipeline_stage',
        dimension_value: 'synthesize',
        cost_date: '2026-05-02',
        observed_cost_usd: 30.0,
        mean_cost_usd: 5.0,
        stddev_cost_usd: 2.0,
        data_points: 14,
        z_score: 12.5,
      },
    ])
    const result = await detectAnomalies(undefined, queryFn)
    expect(result.anomalies).toHaveLength(2)
    expect(result.anomalies[0].z_score).toBe(12.5)
    expect(result.anomalies[1].z_score).toBe(5.0)
  })

  it('4. stddev=0 → not flagged even if z_score is large', async () => {
    const queryFn = makeQuery([
      {
        dimension: 'provider',
        dimension_value: 'flat',
        cost_date: '2026-05-02',
        observed_cost_usd: 1.0,
        mean_cost_usd: 1.0,
        stddev_cost_usd: 0,
        data_points: 14,
        z_score: 999, // shouldn't matter
      },
    ])
    const result = await detectAnomalies(undefined, queryFn)
    expect(result.total_series_checked).toBe(1)
    expect(result.anomalies).toHaveLength(0)
  })
})

describe('§B — detectAnomalies alert dispatch', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>
  let originalFetch: typeof globalThis.fetch
  const originalWebhook = process.env.OBSERVATORY_ALERT_WEBHOOK_URL

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    originalFetch = globalThis.fetch
  })

  afterEach(() => {
    warnSpy.mockRestore()
    globalThis.fetch = originalFetch
    if (originalWebhook === undefined) {
      delete process.env.OBSERVATORY_ALERT_WEBHOOK_URL
    } else {
      process.env.OBSERVATORY_ALERT_WEBHOOK_URL = originalWebhook
    }
  })

  it('5. anomaly + webhook URL → fetch fires with anomaly payload', async () => {
    process.env.OBSERVATORY_ALERT_WEBHOOK_URL = 'https://hook.example/anom'
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('ok', { status: 200 }))
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch

    const queryFn = makeQuery([
      {
        dimension: 'user_id',
        dimension_value: 'user-uuid-1',
        cost_date: '2026-05-02',
        observed_cost_usd: 100.0,
        mean_cost_usd: 5.0,
        stddev_cost_usd: 1.0,
        data_points: 14,
        z_score: 95.0,
      },
    ])
    const result = await detectAnomalies(undefined, queryFn)
    expect(result.anomalies).toHaveLength(1)
    expect(result.alert_fired).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://hook.example/anom')
    expect((init as RequestInit).method).toBe('POST')
    const body = JSON.parse(String((init as RequestInit).body))
    expect(body.kind).toBe('anomaly_detection')
    expect(body.anomaly_count).toBe(1)
    expect(body.anomalies[0].dimension).toBe('user_id')
  })

  it('6. webhook failure → never throws; alert_fired still true', async () => {
    process.env.OBSERVATORY_ALERT_WEBHOOK_URL = 'https://hook.example/down'
    const fetchMock = vi
      .fn()
      .mockRejectedValue(new Error('network unreachable'))
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch

    const queryFn = makeQuery([
      {
        dimension: 'provider',
        dimension_value: 'deepseek',
        cost_date: '2026-05-02',
        observed_cost_usd: 50.0,
        mean_cost_usd: 5.0,
        stddev_cost_usd: 1.0,
        data_points: 14,
        z_score: 45.0,
      },
    ])
    let threw = false
    let result
    try {
      result = await detectAnomalies(undefined, queryFn)
    } catch {
      threw = true
    }
    expect(threw).toBe(false)
    expect(result).toBeDefined()
    expect(result!.alert_fired).toBe(true)
    expect(warnSpy.mock.calls.length).toBeGreaterThanOrEqual(2)
  })

  it('7. no anomalies → no console.warn, no fetch', async () => {
    process.env.OBSERVATORY_ALERT_WEBHOOK_URL = 'https://hook.example/noisy'
    const fetchMock = vi.fn()
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch

    const queryFn = makeQuery([])
    const result = await detectAnomalies(undefined, queryFn)
    expect(result.anomalies).toHaveLength(0)
    expect(result.alert_fired).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
    expect(warnSpy).not.toHaveBeenCalled()
  })
})

describe('§C — config resolution', () => {
  it('8. partial config merges with defaults; floors lookback to ≥1', async () => {
    const queryFn = makeQuery([])
    const result = await detectAnomalies(
      { z_threshold: 3.0, lookback_days: 0, min_data_points: 1 },
      queryFn,
    )
    expect(result.config.z_threshold).toBe(3.0)
    expect(result.config.lookback_days).toBe(1)
    expect(result.config.min_data_points).toBe(2)
    // Verify defaults exposed
    expect(DEFAULT_MIN_DATA_POINTS).toBe(7)
    expect(DEFAULT_LOOKBACK_DAYS).toBe(14)
  })
})
