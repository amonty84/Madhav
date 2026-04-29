import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))

const mockWriteAuditLog = vi.fn()
vi.mock('../writer', () => ({ writeAuditLog: (...a: unknown[]) => mockWriteAuditLog(...a) }))

const mockLogPrediction = vi.fn()
vi.mock('@/lib/prediction/writer', () => ({ logPrediction: (...a: unknown[]) => mockLogPrediction(...a) }))

const mockRecordError = vi.fn()
vi.mock('@/lib/telemetry/index', () => ({
  telemetry: { recordError: (...a: unknown[]) => mockRecordError(...a) },
}))

import { createAuditConsumer, type AuditConsumerContext } from '../consumer'
import type { SynthesisAuditEvent } from '@/lib/synthesis/types'
import type { QueryPlan } from '@/lib/router/types'
import type { Bundle } from '@/lib/bundle/types'

function makeContext(overrides: Partial<AuditConsumerContext> = {}): AuditConsumerContext {
  return {
    query_text: 'Will I get a promotion in 2026?',
    query_plan: {
      query_plan_id: 'plan-001',
      query_text: 'Will I get a promotion in 2026?',
      query_class: 'predictive',
      domains: ['career'],
      forward_looking: true,
      audience_tier: 'super_admin',
      tools_authorized: ['msr_sql'],
      history_mode: 'synthesized',
      panel_mode: false,
      expected_output_shape: 'time_indexed_prediction',
      manifest_fingerprint: 'fp-abc',
      schema_version: '1.0',
    } as QueryPlan,
    bundle: {
      bundle_id: 'bundle-001',
      query_plan_reference: 'plan-001',
      manifest_fingerprint: 'fp-abc',
      mandatory_context: [
        { canonical_id: 'FORENSIC', version: '8.0', content_hash: 'sha256:aaa', token_count: 1000, role: 'floor', source: 'rule_composer' },
      ],
      total_tokens: 1000,
      bundle_hash: 'sha256:bbb',
      schema_version: '1.0',
    } as Bundle,
    tool_results: [
      {
        tool_bundle_id: 'tb-001',
        tool_name: 'msr_sql',
        tool_version: '1.0',
        invocation_params: {},
        results: [],
        served_from_cache: false,
        latency_ms: 30,
        result_hash: 'sha256:tool-hash',
        schema_version: '1.0' as const,
      },
    ],
    validator_results: [
      { validator_id: 'p1_layer_separation', validator_version: '1.0', vote: 'pass', reason: 'ok' },
    ],
    disclosure_tier: 'super_admin',
    ...overrides,
  }
}

function makeAuditEvent(overrides: Partial<SynthesisAuditEvent> = {}): SynthesisAuditEvent {
  return {
    event_type: 'synthesis_complete',
    query_plan_id: 'plan-001',
    bundle_id: 'bundle-001',
    synthesis_prompt_version: '1.0',
    synthesizer_model_id: 'claude-haiku-4-5',
    finish_reason: 'stop',
    validator_votes: {},
    started_at: '2026-04-28T10:00:00.000Z',
    finished_at: '2026-04-28T10:00:05.000Z',
    input_tokens: 1000,
    output_tokens: 200,
    final_output: 'Career acceleration likely 2026–2027, with 70% confidence.',
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  mockWriteAuditLog.mockResolvedValue(undefined)
  mockLogPrediction.mockResolvedValue('pred-uuid-001')
})

// ── E2E: flag-ON synthesizer→audit row ───────────────────────────────────────

describe('createAuditConsumer — E2E audit write', () => {
  it('calls writeAuditLog with correctly mapped fields', async () => {
    const consumer = createAuditConsumer(makeContext())
    consumer(makeAuditEvent())

    // Allow the floating promise to resolve
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockWriteAuditLog).toHaveBeenCalledOnce()
    const [event] = mockWriteAuditLog.mock.calls[0] as [import('../types').AuditEvent]
    expect(event.query_id).toBe('plan-001')
    expect(event.query_text).toBe('Will I get a promotion in 2026?')
    expect(event.query_class).toBe('predictive')
    expect(event.bundle_keys).toEqual(['FORENSIC'])
    expect(event.tools_called[0].tool).toBe('msr_sql')
    expect(event.tools_called[0].params_hash).toBe('sha256:tool-hash')
    expect(event.tools_called[0].cached).toBe(false)
    expect(event.validators_run[0].validator_id).toBe('p1_layer_separation')
    expect(event.validators_run[0].passed).toBe(true)
    expect(event.synthesis_model).toBe('claude-haiku-4-5')
    expect(event.synthesis_input_tokens).toBe(1000)
    expect(event.synthesis_output_tokens).toBe(200)
    expect(event.disclosure_tier).toBe('super_admin')
    expect(event.final_output).toBe('Career acceleration likely 2026–2027, with 70% confidence.')
    expect(event.audit_event_version).toBe(1)
  })

  it('maps validator vote=pass to passed=true and warn to passed=false', async () => {
    const ctx = makeContext({
      validator_results: [
        { validator_id: 'p1', validator_version: '1.0', vote: 'pass', reason: 'ok' },
        { validator_id: 'p2', validator_version: '1.0', vote: 'warn', reason: 'mild issue' },
        { validator_id: 'p5', validator_version: '1.0', vote: 'fail', reason: 'bad' },
      ],
    })
    const consumer = createAuditConsumer(ctx)
    consumer(makeAuditEvent())
    await new Promise(resolve => setTimeout(resolve, 0))

    const [event] = mockWriteAuditLog.mock.calls[0] as [import('../types').AuditEvent]
    expect(event.validators_run[0].passed).toBe(true)
    expect(event.validators_run[1].passed).toBe(false)
    expect(event.validators_run[2].passed).toBe(false)
  })
})

// ── Prediction-detection heuristic ───────────────────────────────────────────

describe('createAuditConsumer — prediction detection', () => {
  it('calls logPrediction when query_class is predictive', async () => {
    const consumer = createAuditConsumer(makeContext())
    consumer(makeAuditEvent({
      final_output: 'Career advancement in 2026 to 2027 seems very likely at 70% confidence.',
    }))
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockLogPrediction).toHaveBeenCalledOnce()
  })

  it('does NOT call logPrediction when output lacks a date range (miss case)', async () => {
    const consumer = createAuditConsumer(makeContext({
      query_plan: { ...makeContext().query_plan, query_class: 'interpretive', expected_output_shape: 'single_answer' } as QueryPlan,
    }))
    consumer(makeAuditEvent({
      final_output: 'Jupiter rules the 10th lord and indicates career success in general.',
    }))
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockLogPrediction).not.toHaveBeenCalled()
  })

  it('does NOT call logPrediction when output has date range but no confidence assertion', async () => {
    const consumer = createAuditConsumer(makeContext({
      query_plan: { ...makeContext().query_plan, query_class: 'interpretive', expected_output_shape: 'single_answer' } as QueryPlan,
    }))
    consumer(makeAuditEvent({
      final_output: 'Saturn transited Aquarius from 2023 to 2025, shaping karmic obligations.',
    }))
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockLogPrediction).not.toHaveBeenCalled()
  })
})

// ── Failure isolation ─────────────────────────────────────────────────────────

describe('createAuditConsumer — failure isolation', () => {
  it('records telemetry when writeAuditLog rejects but does not throw to caller', async () => {
    mockWriteAuditLog.mockRejectedValueOnce(new Error('db down'))
    const consumer = createAuditConsumer(makeContext())
    expect(() => consumer(makeAuditEvent())).not.toThrow()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockRecordError).toHaveBeenCalledWith(
      'audit_consumer', 'audit_write_failed', expect.any(Error)
    )
  })

  it('records telemetry when logPrediction rejects but does not throw to caller', async () => {
    mockLogPrediction.mockRejectedValueOnce(new Error('pred fail'))
    const consumer = createAuditConsumer(makeContext())
    expect(() => consumer(makeAuditEvent())).not.toThrow()
    await new Promise(resolve => setTimeout(resolve, 0))

    const errCall = mockRecordError.mock.calls.find(
      c => (c as string[])[1] === 'prediction_log_failed'
    )
    expect(errCall).toBeDefined()
  })
})
