import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('TelemetryService', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('recordMetric emits a structured log in dev/test mode', async () => {
    const { telemetry } = await import('@/lib/telemetry/index')
    telemetry.recordMetric('c2.1', 'component.latency_ms', 150, { operation: 'classify' })
    expect(console.log).toHaveBeenCalledWith('[telemetry]', expect.stringContaining('component.latency_ms'))
  })

  it('recordLatency calls recordMetric with correct metric name', async () => {
    const { telemetry, Metrics } = await import('@/lib/telemetry/index')
    const spy = vi.spyOn(telemetry, 'recordMetric')
    telemetry.recordLatency('c2.1', 'classify', 200)
    expect(spy).toHaveBeenCalledWith('c2.1', Metrics.COMPONENT_LATENCY_MS, 200, { operation: 'classify' })
  })

  it('recordError emits error metric', async () => {
    const { telemetry, Metrics } = await import('@/lib/telemetry/index')
    const spy = vi.spyOn(telemetry, 'recordMetric')
    telemetry.recordError('c3.1', 'ValidationError', new Error('test error'))
    expect(spy).toHaveBeenCalledWith('c3.1', Metrics.COMPONENT_ERROR_RATE, 1, expect.objectContaining({ errorType: 'ValidationError' }))
  })
})
