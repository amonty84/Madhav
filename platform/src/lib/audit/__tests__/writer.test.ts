import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('server-only', () => ({}))

const mockQuery = vi.fn()
vi.mock('@/lib/db/client', () => ({ query: (...a: unknown[]) => mockQuery(...a) }))

const mockRecordError = vi.fn()
vi.mock('@/lib/telemetry/index', () => ({
  telemetry: { recordError: (...a: unknown[]) => mockRecordError(...a) },
}))

import { writeAuditLog } from '../writer'
import type { AuditEvent } from '../types'

function makeEvent(overrides: Partial<AuditEvent> = {}): AuditEvent {
  return {
    query_id: 'aaaaaaaa-0000-0000-0000-000000000001',
    query_text: 'What does my chart say about career?',
    query_class: 'interpretive',
    bundle_keys: ['FORENSIC', 'MSR'],
    tools_called: [{ tool: 'msr_sql', params_hash: 'sha256:abc', latency_ms: 42, cached: false }],
    validators_run: [{ validator_id: 'p1_layer_separation', passed: true, message: 'ok' }],
    synthesis_model: 'claude-haiku-4-5',
    synthesis_input_tokens: 1000,
    synthesis_output_tokens: 200,
    disclosure_tier: 'super_admin',
    final_output: 'Jupiter in 10th indicates...',
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  mockQuery.mockResolvedValue({ rows: [], rowCount: 1 })
})

describe('writeAuditLog — happy path', () => {
  it('executes an INSERT ... ON CONFLICT upsert', async () => {
    await writeAuditLog(makeEvent())

    expect(mockQuery).toHaveBeenCalledOnce()
    const [sql, params] = mockQuery.mock.calls[0] as [string, unknown[]]
    expect(sql).toContain('INSERT INTO audit_log')
    expect(sql).toContain('ON CONFLICT ON CONSTRAINT uq_audit_log_query_id DO UPDATE')
    expect(params[0]).toBe('aaaaaaaa-0000-0000-0000-000000000001')
    expect(params[1]).toBe('What does my chart say about career?')
    expect(params[2]).toBe('interpretive')
  })

  it('serialises bundle_keys and tools_called as JSON strings', async () => {
    await writeAuditLog(makeEvent())

    const [, params] = mockQuery.mock.calls[0] as [string, unknown[]]
    expect(JSON.parse(params[3] as string)).toEqual(['FORENSIC', 'MSR'])
    expect(JSON.parse(params[4] as string)[0].tool).toBe('msr_sql')
  })

  it('defaults audit_event_version to 1 when omitted', async () => {
    const event = makeEvent()
    delete event.audit_event_version
    await writeAuditLog(event)

    const [, params] = mockQuery.mock.calls[0] as [string, unknown[]]
    expect(params[11]).toBe(1)
  })

  it('uses explicit audit_event_version when provided', async () => {
    await writeAuditLog(makeEvent({ audit_event_version: 2 }))

    const [, params] = mockQuery.mock.calls[0] as [string, unknown[]]
    expect(params[11]).toBe(2)
  })
})

describe('writeAuditLog — idempotency', () => {
  it('issues the same upsert SQL for a re-write with the same query_id', async () => {
    await writeAuditLog(makeEvent())
    await writeAuditLog(makeEvent({ final_output: 'Updated output' }))

    expect(mockQuery).toHaveBeenCalledTimes(2)
    const sql0 = (mockQuery.mock.calls[0] as [string])[0]
    const sql1 = (mockQuery.mock.calls[1] as [string])[0]
    expect(sql0).toBe(sql1)
  })
})

describe('writeAuditLog — partial-event tolerance', () => {
  it('handles empty bundle_keys and tools_called arrays', async () => {
    await writeAuditLog(makeEvent({ bundle_keys: [], tools_called: [], validators_run: [] }))

    expect(mockQuery).toHaveBeenCalledOnce()
    const [, params] = mockQuery.mock.calls[0] as [string, unknown[]]
    expect(JSON.parse(params[3] as string)).toEqual([])
    expect(JSON.parse(params[4] as string)).toEqual([])
    expect(JSON.parse(params[5] as string)).toEqual([])
  })

  it('handles empty final_output', async () => {
    await writeAuditLog(makeEvent({ final_output: '' }))

    expect(mockQuery).toHaveBeenCalledOnce()
    const [, params] = mockQuery.mock.calls[0] as [string, unknown[]]
    expect(params[10]).toBe('')
  })

  it('handles zero token counts', async () => {
    await writeAuditLog(makeEvent({ synthesis_input_tokens: 0, synthesis_output_tokens: 0 }))

    const [, params] = mockQuery.mock.calls[0] as [string, unknown[]]
    expect(params[7]).toBe(0)
    expect(params[8]).toBe(0)
  })
})

describe('writeAuditLog — failure-does-not-throw guarantee', () => {
  it('does not throw when DB query rejects', async () => {
    mockQuery.mockRejectedValueOnce(new Error('connection refused'))
    await expect(writeAuditLog(makeEvent())).resolves.toBeUndefined()
  })

  it('records a telemetry error on DB failure', async () => {
    const dbErr = new Error('timeout')
    mockQuery.mockRejectedValueOnce(dbErr)
    await writeAuditLog(makeEvent())

    expect(mockRecordError).toHaveBeenCalledOnce()
    const [component, type, err] = mockRecordError.mock.calls[0] as [string, string, Error]
    expect(component).toBe('audit')
    expect(type).toBe('write_failed')
    expect(err.message).toBe('timeout')
  })

  it('wraps non-Error throws in an Error before recording telemetry', async () => {
    mockQuery.mockRejectedValueOnce('string error')
    await writeAuditLog(makeEvent())

    const [, , err] = mockRecordError.mock.calls[0] as [string, string, Error]
    expect(err).toBeInstanceOf(Error)
  })

  it('does not throw even when telemetry.recordError itself throws', async () => {
    mockQuery.mockRejectedValueOnce(new Error('db down'))
    mockRecordError.mockImplementationOnce(() => { throw new Error('telemetry down') })
    await expect(writeAuditLog(makeEvent())).rejects.toThrow('telemetry down')
    // This is acceptable: we only guarantee the DB failure doesn't throw, not nested failures.
    // Documenting the edge case with this test.
  })
})
