// Phase O — O.3 Export — formatters.
//
// Two pure formatters that take rows + meta and produce a string. Kept
// separate from the route handler so tests don't have to spin up the API
// surface to verify byte-level output.

import {
  EXPORT_COLUMNS,
  type ExportMeta,
  type ExportRow,
} from './types'

/** Quote a single CSV cell only when it contains a delimiter, quote, or
 *  newline. RFC 4180: embedded quotes are doubled. */
function csvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (
    str.includes(',') ||
    str.includes('"') ||
    str.includes('\n') ||
    str.includes('\r')
  ) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function toCSV(rows: ExportRow[]): string {
  const header = EXPORT_COLUMNS.map(csvCell).join(',')
  const body = rows
    .map((row) => EXPORT_COLUMNS.map((col) => csvCell(row[col])).join(','))
    .join('\n')
  return body ? `${header}\n${body}\n` : `${header}\n`
}

export function toJSON(rows: ExportRow[], meta: ExportMeta): string {
  return JSON.stringify({ export_meta: meta, rows })
}

// USTAD_S4_6 D2 streaming helpers. Used by the route's ReadableStream
// branch so the formatter never sees the full row collection at once.

/** CSV header line (no trailing newline). */
export function csvHeaderLine(): string {
  return EXPORT_COLUMNS.map(csvCell).join(',')
}

/** Encode one CSV row (no trailing newline). */
export function csvRowLine(row: ExportRow): string {
  return EXPORT_COLUMNS.map((col) => csvCell(row[col])).join(',')
}

/** JSON envelope opener: `{"export_meta":{...},"rows":[`. */
export function jsonEnvelopeOpen(meta: ExportMeta): string {
  return `{"export_meta":${JSON.stringify(meta)},"rows":[`
}

/** JSON envelope closer: `]}`. */
export const JSON_ENVELOPE_CLOSE = ']}'
