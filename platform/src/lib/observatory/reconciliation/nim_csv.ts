// Phase O — O.2 Reconciliation — NVIDIA NIM (managed catalog) manual-CSV
// parser.
//
// NIM's managed-catalog usage dashboard exports a per-day CSV. There is no
// admin/billing API for the managed catalog (self-hosted NIMs are billed via
// NVIDIA AI Enterprise SKUs and out-of-scope). Resolves open-decision
// OD-NIM-CSV from USTAD_S2_1 close.
//
// Column mapping (resolved here, mixed-case as exported by NVIDIA):
//   Date         YYYY-MM-DD
//   Model        e.g. "meta/llama-3.1-70b-instruct"
//   InputTokens  integer
//   OutputTokens integer
//   TotalCost    USD float

import {
  CsvParseError,
  assertColumns,
  isInPeriod,
  parseCsvText,
  parseNumberField,
} from './csv_upload'

export interface NimCsvRow {
  Date: string
  Model: string
  InputTokens: number
  OutputTokens: number
  TotalCost: number
}

const NIM_LABEL = 'NIM'
const NIM_REQUIRED_COLUMNS: readonly string[] = [
  'Date',
  'Model',
  'InputTokens',
  'OutputTokens',
  'TotalCost',
]

/** Parse an NVIDIA NIM managed-catalog usage CSV into typed rows. Throws
 *  CsvParseError on missing/malformed columns. */
export function parseNimCsv(csvText: string): NimCsvRow[] {
  const { headers, rows } = parseCsvText(csvText)
  assertColumns(headers, [...NIM_REQUIRED_COLUMNS], NIM_LABEL)

  const out: NimCsvRow[] = []
  rows.forEach((rec, idx) => {
    const Date_ = rec.Date
    const Model = rec.Model
    if (!Date_) {
      throw new CsvParseError(
        `NIM CSV row ${idx} has empty value for required column "Date".`,
        headers,
        [...NIM_REQUIRED_COLUMNS],
      )
    }
    if (!Model) {
      throw new CsvParseError(
        `NIM CSV row ${idx} has empty value for required column "Model".`,
        headers,
        [...NIM_REQUIRED_COLUMNS],
      )
    }
    const InputTokens = parseNumberField(
      rec.InputTokens,
      'InputTokens',
      idx,
      NIM_LABEL,
      headers,
      [...NIM_REQUIRED_COLUMNS],
    )
    const OutputTokens = parseNumberField(
      rec.OutputTokens,
      'OutputTokens',
      idx,
      NIM_LABEL,
      headers,
      [...NIM_REQUIRED_COLUMNS],
    )
    const TotalCost = parseNumberField(
      rec.TotalCost,
      'TotalCost',
      idx,
      NIM_LABEL,
      headers,
      [...NIM_REQUIRED_COLUMNS],
    )
    out.push({ Date: Date_, Model, InputTokens, OutputTokens, TotalCost })
  })
  return out
}

export function sumNimCsv(
  rows: NimCsvRow[],
  period_start: string,
  period_end: string,
): { cost_usd: number; event_count: number } {
  let cost_usd = 0
  let event_count = 0
  for (const r of rows) {
    if (!isInPeriod(r.Date, period_start, period_end)) continue
    cost_usd += r.TotalCost
    event_count += 1
  }
  return { cost_usd, event_count }
}
