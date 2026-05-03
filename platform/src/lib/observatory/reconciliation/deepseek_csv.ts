// Phase O — O.2 Reconciliation — DeepSeek manual-CSV parser.
//
// DeepSeek's billing portal exports a per-day usage CSV. There is no admin
// API available (per OBSERVATORY_PLAN §4.4 + the S2.1 close), so the
// super-admin downloads the CSV from DeepSeek's web portal and uploads it
// via POST /api/admin/observatory/reconciliation/upload. Resolves
// open-decision OD-DeepSeek-CSV from USTAD_S2_1 close.
//
// Column mapping (resolved here):
//   date              YYYY-MM-DD
//   model             e.g. "deepseek-chat", "deepseek-reasoner"
//   prompt_tokens     integer
//   completion_tokens integer
//   total_cost        USD float (e.g. "0.001234")

import {
  CsvParseError,
  assertColumns,
  isInPeriod,
  parseCsvText,
  parseNumberField,
} from './csv_upload'

export interface DeepSeekCsvRow {
  date: string
  model: string
  prompt_tokens: number
  completion_tokens: number
  total_cost: number
}

const DEEPSEEK_LABEL = 'DeepSeek'
const DEEPSEEK_REQUIRED_COLUMNS: readonly string[] = [
  'date',
  'model',
  'prompt_tokens',
  'completion_tokens',
  'total_cost',
]

/** Parse a DeepSeek billing-CSV blob into typed rows. Throws CsvParseError
 *  if any required column is missing or any numeric value is malformed. */
export function parseDeepSeekCsv(csvText: string): DeepSeekCsvRow[] {
  const { headers, rows } = parseCsvText(csvText)
  assertColumns(headers, [...DEEPSEEK_REQUIRED_COLUMNS], DEEPSEEK_LABEL)

  const out: DeepSeekCsvRow[] = []
  rows.forEach((rec, idx) => {
    const date = rec.date
    const model = rec.model
    if (!date) {
      throw new CsvParseError(
        `DeepSeek CSV row ${idx} has empty value for required column "date".`,
        headers,
        [...DEEPSEEK_REQUIRED_COLUMNS],
      )
    }
    if (!model) {
      throw new CsvParseError(
        `DeepSeek CSV row ${idx} has empty value for required column "model".`,
        headers,
        [...DEEPSEEK_REQUIRED_COLUMNS],
      )
    }
    const prompt_tokens = parseNumberField(
      rec.prompt_tokens,
      'prompt_tokens',
      idx,
      DEEPSEEK_LABEL,
      headers,
      [...DEEPSEEK_REQUIRED_COLUMNS],
    )
    const completion_tokens = parseNumberField(
      rec.completion_tokens,
      'completion_tokens',
      idx,
      DEEPSEEK_LABEL,
      headers,
      [...DEEPSEEK_REQUIRED_COLUMNS],
    )
    const total_cost = parseNumberField(
      rec.total_cost,
      'total_cost',
      idx,
      DEEPSEEK_LABEL,
      headers,
      [...DEEPSEEK_REQUIRED_COLUMNS],
    )
    out.push({ date, model, prompt_tokens, completion_tokens, total_cost })
  })
  return out
}

/** Sum the `total_cost` column over rows whose `date` falls inside the
 *  inclusive [period_start, period_end] window. */
export function sumDeepSeekCsv(
  rows: DeepSeekCsvRow[],
  period_start: string,
  period_end: string,
): { cost_usd: number; event_count: number } {
  let cost_usd = 0
  let event_count = 0
  for (const r of rows) {
    if (!isInPeriod(r.date, period_start, period_end)) continue
    cost_usd += r.total_cost
    event_count += 1
  }
  return { cost_usd, event_count }
}
