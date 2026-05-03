// Phase O — O.2 Reconciliation — manual CSV parsing shared between the two
// non-API providers (DeepSeek + NIM).
//
// `papaparse` is not in the platform deps; the brief explicitly says "if
// absent, parse manually." The parser implements the small RFC4180 subset
// real billing exports use: header row + simple comma-separated values, with
// support for quoted fields containing commas/quotes/newlines (CRLF or LF).
// No streaming — billing CSVs are bounded by month/day exports and well
// under any reasonable memory limit. The upload endpoint additionally caps
// the JSONified raw payload at 1000 rows when persisting.

export class CsvParseError extends Error {
  constructor(
    message: string,
    public readonly columns_found: string[],
    public readonly columns_expected: string[],
  ) {
    super(message)
    this.name = 'CsvParseError'
  }
}

/** Parse a CSV text blob into an array of header→value records.
 *
 *  Behavior:
 *    - Header row is the first non-empty line; header names are trimmed.
 *    - Each subsequent non-empty line becomes one record. Trailing CRs are
 *      stripped. Trailing blank lines are ignored.
 *    - Quoted fields are supported (RFC4180): `"foo,bar"` is one field; `""`
 *      inside a quoted field encodes a literal `"`. Newlines inside quoted
 *      fields are preserved.
 *    - Values are returned as raw strings; numeric coercion is the caller's
 *      job (per-provider parsers cast `total_cost` etc. to float).
 *    - Whitespace is trimmed on each value before return.
 */
export function parseCsvText(csvText: string): {
  headers: string[]
  rows: Record<string, string>[]
} {
  const rows: string[][] = []
  let currentRow: string[] = []
  let currentField = ''
  let inQuotes = false
  let i = 0
  const n = csvText.length

  while (i < n) {
    const ch = csvText[i]
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < n && csvText[i + 1] === '"') {
          currentField += '"'
          i += 2
          continue
        }
        inQuotes = false
        i += 1
        continue
      }
      currentField += ch
      i += 1
      continue
    }
    // not in quotes
    if (ch === '"') {
      inQuotes = true
      i += 1
      continue
    }
    if (ch === ',') {
      currentRow.push(currentField)
      currentField = ''
      i += 1
      continue
    }
    if (ch === '\r') {
      // swallow standalone CR; CRLF handled by following \n
      i += 1
      continue
    }
    if (ch === '\n') {
      currentRow.push(currentField)
      rows.push(currentRow)
      currentRow = []
      currentField = ''
      i += 1
      continue
    }
    currentField += ch
    i += 1
  }
  // flush trailing field/row (no terminating newline)
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField)
    rows.push(currentRow)
  }

  // strip empty rows (e.g. trailing blank lines → [''] arrays)
  const nonEmpty = rows.filter(r => !(r.length === 1 && r[0].trim() === ''))
  if (nonEmpty.length === 0) {
    return { headers: [], rows: [] }
  }
  const headers = nonEmpty[0].map(h => h.trim())
  const records: Record<string, string>[] = []
  for (let ri = 1; ri < nonEmpty.length; ri += 1) {
    const r = nonEmpty[ri]
    const rec: Record<string, string> = {}
    for (let ci = 0; ci < headers.length; ci += 1) {
      rec[headers[ci]] = (r[ci] ?? '').trim()
    }
    records.push(rec)
  }
  return { headers, rows: records }
}

/** Verify the parsed headers contain every expected column. Throws
 *  `CsvParseError` with both lists when any expected column is missing. */
export function assertColumns(
  found: string[],
  expected: string[],
  providerLabel: string,
): void {
  const missing = expected.filter(e => !found.includes(e))
  if (missing.length === 0) return
  const message =
    `${providerLabel} CSV is missing required column(s): ${missing.join(', ')}. ` +
    `Found columns: [${found.join(', ')}]. ` +
    `Expected columns: [${expected.join(', ')}].`
  throw new CsvParseError(message, found, expected)
}

/** Safe-parse a numeric field; throws CsvParseError if the value is missing
 *  or non-numeric. Used by per-provider parsers to coerce token + cost
 *  columns from string to number. */
export function parseNumberField(
  raw: string | undefined,
  columnName: string,
  rowIndex: number,
  providerLabel: string,
  found: string[],
  expected: string[],
): number {
  if (raw === undefined || raw === '') {
    throw new CsvParseError(
      `${providerLabel} CSV row ${rowIndex} has empty value for required column "${columnName}".`,
      found,
      expected,
    )
  }
  const n = Number(raw)
  if (!Number.isFinite(n)) {
    throw new CsvParseError(
      `${providerLabel} CSV row ${rowIndex} has non-numeric value "${raw}" for column "${columnName}".`,
      found,
      expected,
    )
  }
  return n
}

/** Inclusive-on-both-ends ISO date filter helper. Strings are compared
 *  lexicographically — valid because all dates are zero-padded YYYY-MM-DD. */
export function isInPeriod(
  date: string,
  period_start: string,
  period_end: string,
): boolean {
  return date >= period_start && date <= period_end
}
