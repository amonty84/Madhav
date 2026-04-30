import { NextResponse } from 'next/server'

export interface ApiErrorBody {
  error: {
    code: string
    message: string
    detail?: string
    retry?: boolean
  }
}

export function apiError(
  code: string,
  message: string,
  options?: { detail?: string; retry?: boolean },
): ApiErrorBody {
  return { error: { code, message, ...options } }
}

// HTTP status mapper
export function errorResponse(
  code: string,
  message: string,
  status: number,
  options?: { detail?: string; retry?: boolean },
): NextResponse<ApiErrorBody> {
  return NextResponse.json(apiError(code, message, options), { status })
}

// ── NETWORK ──────────────────────────────────────────────────────────────────

export const networkError = {
  timeout: (detail?: string) =>
    apiError('NETWORK_TIMEOUT', 'Request timed out.', { retry: true, detail }),
  unreachable: (detail?: string) =>
    apiError('NETWORK_UNREACHABLE', 'Service unreachable.', { retry: true, detail }),
}

// ── AUTH ─────────────────────────────────────────────────────────────────────

export const authError = {
  unauthenticated: () =>
    apiError('AUTH_UNAUTHENTICATED', 'Authentication required.', { retry: false }),
  forbidden: () =>
    apiError('AUTH_FORBIDDEN', 'You do not have permission to perform this action.', { retry: false }),
  sessionExpired: () =>
    apiError('AUTH_SESSION_EXPIRED', 'Session has expired. Please sign in again.', { retry: false }),
}

// ── DATA ─────────────────────────────────────────────────────────────────────

export const dataError = {
  invalidInput: (detail?: string) =>
    apiError('DATA_INVALID_INPUT', 'Invalid or missing input.', { retry: false, detail }),
  notFound: (detail?: string) =>
    apiError('DATA_NOT_FOUND', 'The requested resource was not found.', { retry: false, detail }),
  validationFailed: (detail?: string) =>
    apiError('DATA_VALIDATION_FAILED', 'Request validation failed.', { retry: false, detail }),
  corpusEmpty: () =>
    apiError('DATA_CORPUS_EMPTY', 'No corpus content available.', { retry: false }),
  constraintViolation: (detail?: string) =>
    apiError('DATA_CONSTRAINT_VIOLATION', 'A data constraint was violated.', { retry: false, detail }),
  conflict: (detail?: string) =>
    apiError('DATA_CONFLICT', 'Resource already exists or state conflict.', { retry: false, detail }),
}

// ── SYSTEM ────────────────────────────────────────────────────────────────────

export const systemError = {
  internal: (detail?: string) =>
    apiError('SYSTEM_INTERNAL', 'An unexpected server error occurred.', { retry: false, detail }),
  dbUnavailable: () =>
    apiError('SYSTEM_DB_UNAVAILABLE', 'Database is temporarily unavailable.', { retry: true }),
  sidecarUnavailable: () =>
    apiError('SYSTEM_SIDECAR_UNAVAILABLE', 'Analysis service is temporarily unavailable.', { retry: true }),
  llmError: () =>
    apiError('SYSTEM_LLM_ERROR', 'The AI model returned an error.', { retry: true }),
  timeout: () =>
    apiError('SYSTEM_TIMEOUT', 'The request timed out on the server.', { retry: true }),
}

// ── HTTP status shorthand ─────────────────────────────────────────────────────

export const res = {
  badRequest: (detail?: string) =>
    NextResponse.json(dataError.invalidInput(detail), { status: 400 }),
  unauthenticated: () =>
    NextResponse.json(authError.unauthenticated(), { status: 401 }),
  forbidden: () =>
    NextResponse.json(authError.forbidden(), { status: 403 }),
  notFound: (detail?: string) =>
    NextResponse.json(dataError.notFound(detail), { status: 404 }),
  conflict: (detail?: string) =>
    NextResponse.json(dataError.conflict(detail), { status: 409 }),
  validationFailed: (detail?: string) =>
    NextResponse.json(dataError.validationFailed(detail), { status: 422 }),
  internal: (detail?: string) =>
    NextResponse.json(systemError.internal(detail), { status: 500 }),
  dbError: () =>
    NextResponse.json(systemError.dbUnavailable(), { status: 503 }),
  sidecarDown: () =>
    NextResponse.json(systemError.sidecarUnavailable(), { status: 503 }),
}
