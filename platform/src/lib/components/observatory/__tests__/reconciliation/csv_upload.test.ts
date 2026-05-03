// @vitest-environment node
//
// Phase O — O.2 Reconciliation — DeepSeek + NIM manual-CSV reconciler tests.
// Authored by USTAD_S2_5_DEEPSEEKNNIM_CSV. 10 tests across 3 describe blocks:
//   parseDeepSeekCsv (4) — happy + period filter + missing-column +
//                          string-coerced cost
//   parseNimCsv     (2) — happy + missing-column
//   POST /upload    (4) — DeepSeek happy / NIM happy / unsupported_provider /
//                          parse_error
//
// All DB calls are mocked — no integration test surface.

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'

vi.mock('server-only', () => ({}))

const queryMock = vi.fn()
vi.mock('@/lib/db/client', () => ({
  query: (...args: unknown[]) => queryMock(...args),
}))

import {
  CsvParseError,
} from '@/lib/observatory/reconciliation/csv_upload'
import {
  parseDeepSeekCsv,
  sumDeepSeekCsv,
} from '@/lib/observatory/reconciliation/deepseek_csv'
import {
  parseNimCsv,
  sumNimCsv,
} from '@/lib/observatory/reconciliation/nim_csv'

// ---------------------------------------------------------------------------
// 1. parseDeepSeekCsv — 4 unit tests.
// ---------------------------------------------------------------------------

describe('parseDeepSeekCsv + sumDeepSeekCsv', () => {
  it('happy path — 3 rows across 2 models, sums correctly', () => {
    const csv =
      'date,model,prompt_tokens,completion_tokens,total_cost\n' +
      '2026-05-01,deepseek-chat,1000,500,0.001234\n' +
      '2026-05-02,deepseek-chat,2000,800,0.002500\n' +
      '2026-05-02,deepseek-reasoner,500,400,0.003000\n'

    const rows = parseDeepSeekCsv(csv)
    expect(rows).toHaveLength(3)
    expect(rows[0].model).toBe('deepseek-chat')
    expect(rows[0].total_cost).toBeCloseTo(0.001234, 6)
    expect(rows[2].model).toBe('deepseek-reasoner')

    const summed = sumDeepSeekCsv(rows, '2026-05-01', '2026-05-02')
    expect(summed.event_count).toBe(3)
    expect(summed.cost_usd).toBeCloseTo(0.001234 + 0.0025 + 0.003, 6)
  })

  it('rows outside the period are filtered out by sumDeepSeekCsv', () => {
    const csv =
      'date,model,prompt_tokens,completion_tokens,total_cost\n' +
      '2026-04-30,deepseek-chat,100,50,0.000100\n' +     // before period
      '2026-05-01,deepseek-chat,200,100,0.000200\n' +    // in period
      '2026-05-03,deepseek-chat,300,150,0.000300\n'      // after period

    const rows = parseDeepSeekCsv(csv)
    const summed = sumDeepSeekCsv(rows, '2026-05-01', '2026-05-02')
    expect(summed.event_count).toBe(1)
    expect(summed.cost_usd).toBeCloseTo(0.0002, 6)
  })

  it('missing total_cost column → CsvParseError with helpful message', () => {
    const csv =
      'date,model,prompt_tokens,completion_tokens\n' +
      '2026-05-01,deepseek-chat,1000,500\n'

    let caught: CsvParseError | null = null
    try {
      parseDeepSeekCsv(csv)
    } catch (err) {
      if (err instanceof CsvParseError) caught = err
    }
    expect(caught).not.toBeNull()
    expect(caught?.message).toMatch(/total_cost/)
    expect(caught?.columns_found).toEqual([
      'date', 'model', 'prompt_tokens', 'completion_tokens',
    ])
    expect(caught?.columns_expected).toContain('total_cost')
  })

  it('total_cost as string "0.001234" is parsed to float', () => {
    const csv =
      'date,model,prompt_tokens,completion_tokens,total_cost\n' +
      '2026-05-01,deepseek-chat,1000,500,"0.001234"\n'

    const rows = parseDeepSeekCsv(csv)
    expect(typeof rows[0].total_cost).toBe('number')
    expect(rows[0].total_cost).toBeCloseTo(0.001234, 6)
  })
})

// ---------------------------------------------------------------------------
// 2. parseNimCsv — 2 unit tests.
// ---------------------------------------------------------------------------

describe('parseNimCsv + sumNimCsv', () => {
  it('happy path — 2 rows, sums TotalCost', () => {
    const csv =
      'Date,Model,InputTokens,OutputTokens,TotalCost\n' +
      '2026-05-01,meta/llama-3.1-70b-instruct,5000,2000,0.012500\n' +
      '2026-05-02,meta/llama-3.1-70b-instruct,8000,3000,0.020000\n'

    const rows = parseNimCsv(csv)
    expect(rows).toHaveLength(2)
    expect(rows[0].Model).toBe('meta/llama-3.1-70b-instruct')
    expect(rows[1].TotalCost).toBeCloseTo(0.02, 6)

    const summed = sumNimCsv(rows, '2026-05-01', '2026-05-02')
    expect(summed.event_count).toBe(2)
    expect(summed.cost_usd).toBeCloseTo(0.0325, 6)
  })

  it('missing TotalCost column → CsvParseError', () => {
    const csv =
      'Date,Model,InputTokens,OutputTokens\n' +
      '2026-05-01,meta/llama-3.1-70b-instruct,5000,2000\n'

    let caught: CsvParseError | null = null
    try {
      parseNimCsv(csv)
    } catch (err) {
      if (err instanceof CsvParseError) caught = err
    }
    expect(caught).not.toBeNull()
    expect(caught?.message).toMatch(/TotalCost/)
    expect(caught?.columns_expected).toContain('TotalCost')
  })
})

// ---------------------------------------------------------------------------
// 3. POST /api/admin/observatory/reconciliation/upload — 4 endpoint tests.
// ---------------------------------------------------------------------------

describe('POST /api/admin/observatory/reconciliation/upload', () => {
  beforeEach(() => {
    queryMock.mockReset()
    vi.resetModules()
    process.env.MARSYS_FLAG_OBSERVATORY_ENABLED = 'true'
    vi.doMock('@/lib/auth/access-control', () => ({
      requireSuperAdmin: async () => ({
        user: { uid: 'admin-1' },
        profile: { id: 'admin-1', role: 'super_admin', status: 'active' },
      }),
    }))
  })

  async function loadRoute() {
    return await import(
      '@/app/api/admin/observatory/reconciliation/upload/route'
    )
  }

  function makeMultipartRequest(
    fields: Record<string, string>,
    fileName: string,
    fileContent: string,
  ): Request {
    const form = new FormData()
    for (const [k, v] of Object.entries(fields)) form.set(k, v)
    form.set(
      'file',
      new Blob([fileContent], { type: 'text/csv' }),
      fileName,
    )
    return new Request(
      'http://x/api/admin/observatory/reconciliation/upload',
      { method: 'POST', body: form },
    )
  }

  it('valid DeepSeek CSV → 200 ProviderReconcileResult; both INSERTs called', async () => {
    queryMock.mockImplementation(async (sql: string) => {
      if (/INSERT INTO llm_provider_cost_reports/.test(sql)) {
        return { rows: [{ report_id: 'r-ds-1' }] }
      }
      if (/FROM llm_usage_events/.test(sql)) {
        return { rows: [{ total_cost_usd: 0.0025, event_count: '4' }] }
      }
      if (/INSERT INTO llm_cost_reconciliation/.test(sql)) {
        return { rows: [] }
      }
      return { rows: [] }
    })

    const csv =
      'date,model,prompt_tokens,completion_tokens,total_cost\n' +
      '2026-05-01,deepseek-chat,1000,500,0.001234\n' +
      '2026-05-02,deepseek-chat,2000,800,0.002500\n'

    const { POST } = await loadRoute()
    const response = await POST(
      makeMultipartRequest(
        { provider: 'deepseek', period_start: '2026-05-01', period_end: '2026-05-02' },
        'deepseek.csv',
        csv,
      ),
    )

    expect(response).toBeInstanceOf(NextResponse)
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.provider).toBe('deepseek')
    expect(body.authoritative_cost_usd).toBeCloseTo(0.003734, 6)
    expect(body.computed_cost_usd).toBeCloseTo(0.0025, 6)
    expect(body.event_count).toBe(4)
    expect(body.raw_report_id).toBe('r-ds-1')

    const sqlCalls = queryMock.mock.calls.map(c => String(c[0]))
    expect(sqlCalls.some(s => /INSERT INTO llm_provider_cost_reports/.test(s))).toBe(true)
    expect(sqlCalls.some(s => /INSERT INTO llm_cost_reconciliation/.test(s))).toBe(true)
  })

  it('valid NIM CSV → 200 ProviderReconcileResult', async () => {
    queryMock.mockImplementation(async (sql: string) => {
      if (/INSERT INTO llm_provider_cost_reports/.test(sql)) {
        return { rows: [{ report_id: 'r-nim-1' }] }
      }
      if (/FROM llm_usage_events/.test(sql)) {
        return { rows: [{ total_cost_usd: 0.025, event_count: '2' }] }
      }
      return { rows: [] }
    })

    const csv =
      'Date,Model,InputTokens,OutputTokens,TotalCost\n' +
      '2026-05-01,meta/llama-3.1-70b-instruct,5000,2000,0.012500\n' +
      '2026-05-02,meta/llama-3.1-70b-instruct,8000,3000,0.020000\n'

    const { POST } = await loadRoute()
    const response = await POST(
      makeMultipartRequest(
        { provider: 'nim', period_start: '2026-05-01', period_end: '2026-05-02' },
        'nim.csv',
        csv,
      ),
    )

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.provider).toBe('nim')
    expect(body.authoritative_cost_usd).toBeCloseTo(0.0325, 6)
    expect(body.raw_report_id).toBe('r-nim-1')
  })

  it("provider='openai' → 400 unsupported_provider", async () => {
    const { POST } = await loadRoute()
    const response = await POST(
      makeMultipartRequest(
        { provider: 'openai', period_start: '2026-05-01', period_end: '2026-05-01' },
        'x.csv',
        'a,b\n1,2\n',
      ),
    )
    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.error).toBe('unsupported_provider')
    expect(body.provider).toBe('openai')
  })

  it('malformed CSV (wrong columns) → 400 parse_error with columns_found', async () => {
    queryMock.mockImplementation(async () => ({ rows: [] }))
    const { POST } = await loadRoute()
    const csv = 'foo,bar,baz\n1,2,3\n'
    const response = await POST(
      makeMultipartRequest(
        { provider: 'deepseek', period_start: '2026-05-01', period_end: '2026-05-01' },
        'bad.csv',
        csv,
      ),
    )
    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.error).toBe('parse_error')
    expect(body.columns_found).toEqual(['foo', 'bar', 'baz'])
    expect(body.columns_expected).toContain('total_cost')
  })
})
