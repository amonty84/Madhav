import { Metrics, type MetricName } from './metrics'

export { Metrics, type MetricName }

export interface TelemetryRecord {
  componentId: string
  metricName: string
  value: number
  tags?: Record<string, string>
  timestamp: string
}

class TelemetryServiceImpl {
  private isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'

  recordMetric(componentId: string, metricName: string, value: number, tags?: Record<string, string>): void {
    const record: TelemetryRecord = {
      componentId,
      metricName,
      value,
      tags,
      timestamp: new Date().toISOString(),
    }
    this.emit(record)
  }

  recordLatency(componentId: string, operation: string, latencyMs: number): void {
    this.recordMetric(componentId, Metrics.COMPONENT_LATENCY_MS, latencyMs, { operation })
  }

  recordCost(componentId: string, model: string, inputTokens: number, outputTokens: number, costUsd: number): void {
    this.recordMetric(componentId, Metrics.COMPONENT_COST_USD, costUsd, { model })
    this.recordMetric(componentId, Metrics.LLM_INPUT_TOKENS, inputTokens, { model })
    this.recordMetric(componentId, Metrics.LLM_OUTPUT_TOKENS, outputTokens, { model })
  }

  recordError(componentId: string, errorType: string, error: Error): void {
    this.recordMetric(componentId, Metrics.COMPONENT_ERROR_RATE, 1, {
      errorType,
      errorMessage: error.message.slice(0, 200),
    })
  }

  private emit(record: TelemetryRecord): void {
    if (this.isDev) {
      console.log('[telemetry]', JSON.stringify(record))
    }
    // Production: wire to Cloud Monitoring or equivalent in a later phase.
  }
}

export const telemetry = new TelemetryServiceImpl()
