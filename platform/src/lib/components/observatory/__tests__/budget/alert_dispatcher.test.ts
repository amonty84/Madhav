// @vitest-environment node
//
// Phase O — O.3 Budgets — USTAD_S3_2_ALERT_DISPATCHER tests.
//
// 8 tests, layout:
//   §A  dispatchAlerts (7): log success / webhook 200 / webhook 500 /
//                           webhook timeout / email stub / unknown channel /
//                           empty alerts_triggered
//   §B  POST /evaluate/run endpoint (1): 2 active rules, 1 alert →
//                                        alerts_fired_count=1
//
// Discipline:
//   - Tests construct BudgetEvaluationResult fixtures directly to control
//     which thresholds are "triggered". The dispatcher does not re-classify;
//     it dispatches whatever is in result.alerts_triggered.
//   - fetch is mocked at the module-global level so the dispatcher's
//     behaviour can be observed without network IO.
//   - The /evaluate/run endpoint test mocks the DB query helper so
//     evaluateAllRules round-trips without touching a real DB.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextResponse } from 'next/server'

vi.mock('server-only', () => ({}))

import {
  dispatchAlerts,
  validateWebhookUrl,
} from '@/lib/observatory/budget/alert_dispatcher'
import type { BudgetEvaluationResult } from '@/lib/observatory/budget/types'

// ---------------------------------------------------------------------------
// Fixture helper
// ---------------------------------------------------------------------------

function makeResult(
  overrides: Partial<BudgetEvaluationResult> = {},
): BudgetEvaluationResult {
  return {
    rule_id: 'rule-fixture-1',
    name: 'Fixture rule',
    scope: 'total',
    scope_value: null,
    period: 'monthly',
    period_start: '2026-05-01',
    period_end: '2026-05-31',
    amount_usd: 100,
    current_spend_usd: 90,
    pct_used: 90,
    status: 'alert',
    alerts_triggered: [{ pct: 80, channel: 'log' }],
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// §A — dispatchAlerts (7 tests)
// ---------------------------------------------------------------------------

describe('§A — dispatchAlerts', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>
  let infoSpy: ReturnType<typeof vi.spyOn>
  let originalFetch: typeof globalThis.fetch

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    originalFetch = globalThis.fetch
  })

  afterEach(() => {
    warnSpy.mockRestore()
    infoSpy.mockRestore()
    globalThis.fetch = originalFetch
    vi.useRealTimers()
  })

  it('1. channel=log → success=true; console.warn includes rule_id', async () => {
    const result = makeResult({
      alerts_triggered: [{ pct: 80, channel: 'log' }],
    })
    const dispatch = await dispatchAlerts(result)
    expect(dispatch.rule_id).toBe('rule-fixture-1')
    expect(dispatch.outcomes).toHaveLength(1)
    expect(dispatch.outcomes[0]).toMatchObject({
      channel: 'log',
      success: true,
    })
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(String(warnSpy.mock.calls[0][0])).toContain('rule-fixture-1')
  })

  it('2. channel=webhook, server 200 → success=true; correct payload + headers', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('ok', { status: 200 }),
    )
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch
    const result = makeResult({
      alerts_triggered: [
        { pct: 80, channel: 'webhook', channel_target: 'https://hook.example/path' },
      ],
    })
    const dispatch = await dispatchAlerts(result)
    expect(dispatch.outcomes[0]).toMatchObject({
      channel: 'webhook',
      success: true,
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://hook.example/path')
    expect((init as RequestInit).method).toBe('POST')
    expect(
      (init as RequestInit & { headers: Record<string, string> }).headers[
        'Content-Type'
      ],
    ).toBe('application/json')
    const body = JSON.parse(String((init as RequestInit).body))
    expect(body.rule_id).toBe('rule-fixture-1')
    expect(body.scope).toBe('total')
    expect(body.status).toBe('alert')
    expect(body.pct_used).toBe(90)
    expect(body.threshold_usd).toBe(100)
    expect(body.current_spend_usd).toBe(90)
    expect(typeof body.triggered_at).toBe('string')
  })

  it('3. channel=webhook, server 500 → success=false, error captured', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('boom', { status: 500 }),
    )
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch
    const result = makeResult({
      alerts_triggered: [
        { pct: 80, channel: 'webhook', channel_target: 'https://hook.example/x' },
      ],
    })
    const dispatch = await dispatchAlerts(result)
    expect(dispatch.outcomes[0].success).toBe(false)
    expect(dispatch.outcomes[0].error).toMatch(/webhook_http_500/)
  })

  it('4. channel=webhook, network/abort error → success=false, no throw', async () => {
    // Simulate a fetch that rejects with an AbortError (the same shape
    // AbortController.abort() produces). The dispatcher must capture the
    // error in the outcome and continue without throwing.
    const fetchMock = vi.fn().mockImplementation(() => {
      const err = new Error('The operation was aborted.')
      err.name = 'AbortError'
      return Promise.reject(err)
    })
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch
    const result = makeResult({
      alerts_triggered: [
        { pct: 80, channel: 'webhook', channel_target: 'https://hook.example/timeout' },
      ],
    })
    let threw = false
    let dispatch
    try {
      dispatch = await dispatchAlerts(result)
    } catch {
      threw = true
    }
    expect(threw).toBe(false)
    expect(dispatch).toBeDefined()
    expect(dispatch!.outcomes[0].success).toBe(false)
    expect(dispatch!.outcomes[0].error).toMatch(/webhook_error/)
  })

  it('5. channel=email (stub) → success=true with sentinel error string', async () => {
    const result = makeResult({
      alerts_triggered: [{ pct: 95, channel: 'email' }],
    })
    const dispatch = await dispatchAlerts(result)
    expect(dispatch.outcomes[0]).toMatchObject({
      channel: 'email',
      success: true,
      error: 'email_not_configured_stub',
    })
    expect(infoSpy).toHaveBeenCalledTimes(1)
  })

  it('6. channel=unknown_xyz → success=false, error contains "unknown_channel"', async () => {
    const result = makeResult({
      alerts_triggered: [{ pct: 80, channel: 'unknown_xyz' }],
    })
    const dispatch = await dispatchAlerts(result)
    expect(dispatch.outcomes[0].success).toBe(false)
    expect(dispatch.outcomes[0].error).toContain('unknown_channel')
    expect(dispatch.outcomes[0].error).toContain('unknown_xyz')
  })

  it('7. result.alerts_triggered=[] → outcomes=[]', async () => {
    const result = makeResult({
      alerts_triggered: [],
      status: 'ok',
      pct_used: 30,
    })
    const dispatch = await dispatchAlerts(result)
    expect(dispatch.rule_id).toBe('rule-fixture-1')
    expect(dispatch.outcomes).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// §A.SSRF — RT.O3.3 SSRF guard (USTAD_S4_6 D3 fix)
// ---------------------------------------------------------------------------

describe('§A.SSRF — validateWebhookUrl', () => {
  it('passes a public HTTPS URL', () => {
    expect(() => validateWebhookUrl('https://hook.example/path')).not.toThrow()
    expect(() => validateWebhookUrl('https://hooks.slack.com/services/T/B/X')).not.toThrow()
  })

  it('rejects HTTP (non-HTTPS)', () => {
    expect(() => validateWebhookUrl('http://hook.example/path')).toThrow(
      /https_required/,
    )
  })

  it('rejects localhost / 127.x / 0.0.0.0', () => {
    expect(() => validateWebhookUrl('https://localhost/x')).toThrow(/private_endpoint/)
    expect(() => validateWebhookUrl('https://127.0.0.1/x')).toThrow(/private_ip/)
    expect(() => validateWebhookUrl('https://0.0.0.0/x')).toThrow(/private_endpoint/)
  })

  it('rejects RFC 1918 ranges (10/8, 192.168/16, 172.16–31)', () => {
    expect(() => validateWebhookUrl('https://10.0.0.5/x')).toThrow(/private_ip/)
    expect(() => validateWebhookUrl('https://192.168.1.1/x')).toThrow(/private_ip/)
    expect(() => validateWebhookUrl('https://172.16.0.1/x')).toThrow(/private_ip/)
    expect(() => validateWebhookUrl('https://172.31.255.255/x')).toThrow(/private_ip/)
    // outside the RFC1918 172 range — still public, must NOT be blocked
    expect(() => validateWebhookUrl('https://172.32.0.1/x')).not.toThrow()
    expect(() => validateWebhookUrl('https://172.15.0.1/x')).not.toThrow()
  })

  it('rejects link-local + cloud metadata endpoints', () => {
    expect(() => validateWebhookUrl('https://169.254.169.254/x')).toThrow(/private_endpoint/)
    expect(() => validateWebhookUrl('https://169.254.0.1/x')).toThrow(/private_ip/)
    expect(() => validateWebhookUrl('https://metadata.google.internal/x')).toThrow(
      /private_endpoint/,
    )
  })

  it('rejects malformed URLs', () => {
    expect(() => validateWebhookUrl('not-a-url')).toThrow(/invalid_url/)
  })

  it('dispatchWebhook with private channel_target returns ssrf_blocked outcome', async () => {
    const fetchMock = vi.fn()
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const result = makeResult({
      alerts_triggered: [
        {
          pct: 80,
          channel: 'webhook',
          channel_target: 'http://10.0.0.5/leak',
        },
      ],
    })
    const dispatch = await dispatchAlerts(result)
    expect(dispatch.outcomes).toHaveLength(1)
    expect(dispatch.outcomes[0].success).toBe(false)
    expect(dispatch.outcomes[0].error).toMatch(/ssrf_blocked/)
    // fetch must NOT be called once SSRF is detected
    expect(fetchMock).not.toHaveBeenCalled()

    warnSpy.mockRestore()
  })
})

// ---------------------------------------------------------------------------
// §B — POST /evaluate/run endpoint (1 test)
// ---------------------------------------------------------------------------

describe('§B — POST /evaluate/run', () => {
  beforeEach(() => {
    vi.resetModules()
    process.env.MARSYS_FLAG_OBSERVATORY_ENABLED = 'true'
  })

  it('8. 2 active rules, 1 alert → evaluated_count=2, alerts_fired_count=1', async () => {
    // Mock super-admin auth.
    vi.doMock('@/lib/auth/access-control', () => ({
      requireSuperAdmin: async () => ({
        user: { uid: 'admin-1' },
        profile: { id: 'admin-1', role: 'super_admin', status: 'active' },
      }),
    }))

    // Mock the DB query helper.
    //   1st call: evaluateAllRules SELECT → 2 active rules
    //   2nd call: computeScopeSpend for rule-A → spend=10 (10% used → ok)
    //   3rd call: computeScopeSpend for rule-B → spend=95 (95% used → alert)
    const queryMock = vi.fn()
    queryMock.mockResolvedValueOnce({
      rows: [
        {
          budget_rule_id: 'rule-A',
          name: 'Rule A — total monthly',
          scope: 'total',
          scope_value: null,
          period: 'monthly',
          amount_usd: 100,
          alert_thresholds: [{ pct: 80, channel: 'log' }],
          created_by_user_id: null,
          active: true,
          created_at: '2026-05-01T00:00:00Z',
          updated_at: '2026-05-01T00:00:00Z',
        },
        {
          budget_rule_id: 'rule-B',
          name: 'Rule B — provider anthropic monthly',
          scope: 'provider',
          scope_value: 'anthropic',
          period: 'monthly',
          amount_usd: 100,
          alert_thresholds: [{ pct: 80, channel: 'log' }],
          created_by_user_id: null,
          active: true,
          created_at: '2026-05-01T00:00:00Z',
          updated_at: '2026-05-01T00:00:00Z',
        },
      ],
    })
    queryMock.mockResolvedValueOnce({ rows: [{ total_cost_usd: 10 }] })
    queryMock.mockResolvedValueOnce({ rows: [{ total_cost_usd: 95 }] })

    vi.doMock('@/lib/db/client', () => ({
      query: (...args: unknown[]) => queryMock(...args),
    }))

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { POST } = await import(
      '@/app/api/admin/observatory/budget-rules/evaluate/run/route'
    )
    const response = await POST()
    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.evaluated_count).toBe(2)
    expect(body.alerts_fired_count).toBe(1)
    expect(Array.isArray(body.dispatch_results)).toBe(true)
    expect(body.dispatch_results).toHaveLength(1)
    expect(body.dispatch_results[0].rule_id).toBe('rule-B')
    expect(body.dispatch_results[0].outcomes).toHaveLength(1)
    expect(body.dispatch_results[0].outcomes[0].channel).toBe('log')
    expect(body.dispatch_results[0].outcomes[0].success).toBe(true)
    expect(typeof body.evaluated_at).toBe('string')

    warnSpy.mockRestore()
  })
})
