---
artifact_id: NAK_PORTAL_MATH_AUDIT
version: 1.1
status: FINAL
authored_by: Claude Code (NAK W1-R2 session) 2026-04-30
sealed_by: Claude Code (NAK W3-R3 session) 2026-04-30
project: NAK — Nakula
wave_run: W1-R2 (skeleton) → W2-R2 (envelope migration) → W3-R3 (sealed FINAL)
purpose: >
  Portal Math Audit — documents the request flow surface for every API route:
  HTTP method, authentication requirement, input validation approach, output
  shape, and error shape. The §2 table reflects pre-fix state (current = `{ error: string }`)
  paired with the §5 post-fix verification block confirming W2-R2 migrated all 30 routes
  to the canonical `ApiErrorBody` envelope.
changelog:
  - v1.0 (2026-04-30): W1-R2 skeleton — full route table from full-read audit.
  - v1.1 (2026-04-30): W3-R3 seal. §5 post-fix verification appended.
    All 30 routes confirmed migrated to ApiErrorBody envelope per W2-R2 closure.
    §3 input-validation gaps reviewed — Medium-severity citations/preview ILIKE risk
    accepted as low-impact (parameterised query) and routed to NAK-D6 (post-NAK pen pass).
    Status elevated to FINAL.
---

# NAK Portal Math Audit v1.1 — FINAL

## §1 — Purpose

This document maps every API route in `platform/src/app/api/` as a request/response math surface. It answers:
- What inputs does the route accept and how are they validated?
- What authentication is required?
- What does the response look like on success and on error?
- Which routes are missing input validation entirely?

The table in §2 is the authoritative reference. §3 flags input validation gaps.

---

## §2 — Route Request/Response Table

30 routes audited (W1-R2, 2026-04-30).

Auth levels:
- **PUBLIC** — no authentication required
- **AUTH** — requires valid session cookie (`getServerUser`)
- **ADMIN** — requires `super_admin` role

Input validation levels:
- **STRONG** — explicit field presence + type + format checks before any DB/external call
- **PARTIAL** — some fields validated, others trusted from request
- **NONE** — no validation; any valid JSON reaches the DB/external service

Error shape: current = `{ error: string }` (all routes); target = `{ error: { code, message, detail?, retry? } }`.

### 2.1 Admin Routes

| Route | Method | Auth | Input Validation | Success Shape | Error Shape | Notes |
|---|---|---|---|---|---|---|
| `api/admin/users` | GET | ADMIN | n/a | `{ users: [...] }` | `{ error: string }` 500 | Full try-catch |
| `api/admin/users` | POST | ADMIN | STRONG (full_name, email regex, username, role enum) | `{ ok: true, user_id, reset_link, user }` | `{ error: string }` 400/409/500 | Duplicate check query unprotected (line 66) |
| `api/admin/users/[id]` | PATCH | ADMIN | PARTIAL (username optional, status enum) | `{ ok: true }` | `{ error: string }` 400/500 | No 404 check; Firebase+DB not atomic |
| `api/admin/users/[id]` | DELETE | ADMIN | NONE (id from path only) | `{ ok: true }` | `{ error: string }` 400/500 | Handles Firebase user-not-found gracefully |
| `api/admin/users/[id]/send-reset` | POST | ADMIN | NONE (id from path only) | `{ ok: true, reset_link }` | `{ error: string }` 404/500 | DB query unprotected |
| `api/admin/access-requests` | GET | ADMIN | n/a | `{ requests: [...] }` | `{ error: string }` 500 | Full try-catch |
| `api/admin/access-requests/[id]/approve` | POST | ADMIN | PARTIAL (username, role enum) | `{ ok: true, user_id, reset_link }` | `{ error: string }` 400/404/409/500 | Multiple unprotected queries; silent step-5 failure |
| `api/admin/access-requests/[id]/reject` | POST | ADMIN | NONE (id from path only) | `{ ok: true }` | `{ error: string }` 404/409/500 | Load query unprotected |

### 2.2 Auth Routes

| Route | Method | Auth | Input Validation | Success Shape | Error Shape | Notes |
|---|---|---|---|---|---|---|
| `api/auth/callback` | GET | PUBLIC | n/a | 302 redirect | n/a | Legacy; always redirects to /login |
| `api/auth/resolve-username` | POST | PUBLIC | PARTIAL (username required, trimmed) | `{ email }` | `{ error: string }` 400/404 | DB query unprotected |
| `api/auth/session` | POST | PUBLIC (validates idToken) | PARTIAL (idToken required) | `{ ok: true }` + `__session` cookie | `{ error: string }` 400/401/403/500 | DB SELECT + `createSessionCookie` unprotected |
| `api/auth/session` | DELETE | AUTH | n/a | `{ ok: true }` | n/a | Clears cookie; no errors possible |
| `api/access-requests` | POST | PUBLIC | STRONG (full_name, email regex+length, reason max 500) | `{ ok: true }` | `{ error: string }` 400/409/500 | Duplicate check query unprotected |

### 2.3 Chat Routes

| Route | Method | Auth | Input Validation | Success Shape | Error Shape | Notes |
|---|---|---|---|---|---|---|
| `api/chat/build` | POST | ADMIN (super_admin only) | PARTIAL (chartId + messages required) | `UIMessageStream` | `{ error: string }` / `onError` string | Promise.all DB unprotected; LLM errors via `onError` |
| `api/chat/consume` | POST | AUTH | PARTIAL (chartId + messages required, model + style validated) | `UIMessageStream` | `{ error: string }` / `new Response(msg, 500)` / `onError` string | Old pipeline: Promise.all unprotected. Inconsistent error response type in new pipeline. |
| `api/chat/upload` | POST | AUTH | STRONG (file type, size, mime) | `{ id, uploadUrl, storagePath, mime, filename, size }` | `{ error: string }` 400/401/413/415/500 | DB INSERT unprotected after GCS success |

### 2.4 Clients Route

| Route | Method | Auth | Input Validation | Success Shape | Error Shape | Notes |
|---|---|---|---|---|---|---|
| `api/clients` | GET | ADMIN | n/a | `[...chart rows with client_name]` | `{ error: string }` 403/500 | Full try-catch |
| `api/clients` | POST | ADMIN | PARTIAL (name, birth_date, birth_time, birth_place, client_email required; lat/lng optional) | `{ ...chart, inviteLink }` | `{ error: string }` 400/403/500 | JSON parse unprotected |

### 2.5 Conversations Routes

| Route | Method | Auth | Input Validation | Success Shape | Error Shape | Notes |
|---|---|---|---|---|---|---|
| `api/conversations` | GET | AUTH | PARTIAL (chartId required; module optional) | `{ conversations: [...] }` | `{ error: string }` 400/401 | `listConversations` unprotected |
| `api/conversations/[id]` | GET | AUTH | NONE (id from path) | `{ conversation, messages }` | `{ error: string }` 401/404 | resolveAccess + getConversation + loadMessages unprotected |
| `api/conversations/[id]` | PATCH | AUTH | PARTIAL (title string required, max 120) | `{ ok: true, title }` | `{ error: string }` 400/401/404 | resolveAccess + getConversation + updateTitle unprotected |
| `api/conversations/[id]` | DELETE | AUTH | NONE (id from path) | `{ ok: true }` | `{ error: string }` 401/404 | resolveAccess + getConversation + deleteConversation unprotected |
| `api/conversations/[id]/feedback` | GET | AUTH | NONE (id from path) | `{ feedback: [...] }` | `{ error: string }` 401/404 | resolveAccess + getConversation + query unprotected |
| `api/conversations/[id]/feedback` | POST | AUTH | PARTIAL (messageId required, rating enum 1/-1/null) | `{ ok: true, rating }` | `{ error: string }` 400/401/404/500 | resolveAccess + getConversation unprotected; insert has try-catch |
| `api/conversations/[id]/share` | GET | AUTH | NONE (id from path) | `{ share: {...} or null }` | `{ error: string }` 401/404 | resolveAccess + getConversation + query unprotected |
| `api/conversations/[id]/share` | POST | AUTH | NONE (id from path) | `{ slug }` | `{ error: string }` 401/404/500 | resolveAccess + getConversation + existing query unprotected |
| `api/conversations/[id]/share` | DELETE | AUTH | NONE (id from path) | `{ ok: true }` | `{ error: string }` 401/404 | resolveAccess + getConversation + update query unprotected |

### 2.6 Audit Routes

| Route | Method | Auth | Input Validation | Success Shape | Error Shape | Notes |
|---|---|---|---|---|---|---|
| `api/audit/[query_id]` | GET | ADMIN | NONE (id from path) | `{ row: {...} }` | `{ error: string }` 404/500 | Full try-catch |
| `api/audit/list` | GET | ADMIN | PARTIAL (filters JSON validated; page/pageSize clamped) | `{ rows, total, page, page_size }` | `{ error: string }` 400/500 | Full try-catch |
| `api/audit/predictions` | GET | ADMIN | PARTIAL (status enum; date/confidence filters cast) | `{ predictions: [...] }` | `{ error: string }` 500 | Full try-catch |
| `api/audit/predictions/[id]/outcome` | POST | ADMIN | STRONG (outcome enum required, observation optional) | `{ ok: true, prediction }` | `{ error: string }` 400/404/409/422/500 | Pre-check query unprotected |

### 2.7 Citations Route

| Route | Method | Auth | Input Validation | Success Shape | Error Shape | Notes |
|---|---|---|---|---|---|---|
| `api/citations/preview` | GET | AUTH | PARTIAL (type enum, id required) | `{ title, content, meta }` | `{ error: string }` 400/401/404 | **No try-catch anywhere** — all 3 DB branches unprotected |

### 2.8 LEL Route

| Route | Method | Auth | Input Validation | Success Shape | Error Shape | Notes |
|---|---|---|---|---|---|---|
| `api/lel` | POST | ADMIN | PARTIAL (action enum, chartId required for append actions) | Action-dependent JSON | `{ error: string }` 400/403/500 | Full try-catch |

### 2.9 Pyramid Route

| Route | Method | Auth | Input Validation | Success Shape | Error Shape | Notes |
|---|---|---|---|---|---|---|
| `api/pyramid` | GET | AUTH | PARTIAL (chartId required) | `[...layer rows]` | `{ error: string }` 400/401/403/404/500 | Auth check queries unprotected |

### 2.10 Compute Route

| Route | Method | Auth | Input Validation | Success Shape | Error Shape | Notes |
|---|---|---|---|---|---|---|
| `api/compute/[type]` | POST | AUTH | PARTIAL (type enum validated against allowlist) | Sidecar response passthrough | `{ error: string }` 400/401/503 | JSON parse + fetch both unprotected |

### 2.11 Trace Routes

| Route | Method | Auth | Input Validation | Success Shape | Error Shape | Notes |
|---|---|---|---|---|---|---|
| `api/trace/history` | GET | ADMIN | PARTIAL (limit clamped 1–100) | `{ queries: [...] }` | `{ error: string }` 500 | Full try-catch |
| `api/trace/stream/[queryId]` | GET (SSE) | ADMIN | NONE (queryId from path, mode from query param) | `text/event-stream` data events | SSE `done` event or implicit | Both `fetchTraceSteps` calls unprotected |

### 2.12 Reports Route

| Route | Method | Auth | Input Validation | Success Shape | Error Shape | Notes |
|---|---|---|---|---|---|---|
| `api/reports/[chartId]/[domain]` | GET | AUTH | NONE (chartId + domain from path) | `{ domain, title, version, url }` | `{ error: string }` 401/403/404/500 | Auth + report queries unprotected; GCS download protected |

---

## §3 — Input Validation Gap Register

Routes where key inputs arrive from user/client with no server-side validation:

| Route | Method | Missing Validation | Risk |
|---|---|---|---|
| `api/conversations/[id]` | GET/PATCH/DELETE | `id` from path — no format check | Low (DB will miss-match silently) |
| `api/conversations/[id]/feedback` | GET | `id` from path | Low |
| `api/conversations/[id]/share` | GET/POST/DELETE | `id` from path | Low |
| `api/citations/preview` | GET | `id` — arbitrary string passed to DB ILIKE for asset type | **Medium — ILIKE `%${id}%` with unsanitized user input** |
| `api/compute/[type]` | POST | Request body passed through to sidecar after type allowlist check only | Medium — sidecar responsible for body validation |
| `api/reports/[chartId]/[domain]` | GET | `domain` from path — no allowlist | Low (DB will miss) |
| `api/admin/users/[id]` | DELETE | `id` from path — no format check | Low (Firebase handles bad UID) |
| `api/trace/stream/[queryId]` | GET | `queryId` from path | Low |

**Most significant:** `citations/preview` `asset` type branch uses `ILIKE '%${id}%'` with unsanitized user input. While not injectable (parameterized query used), an extremely long or pattern-heavy `id` string could cause performance issues. Low severity for now; document for W2-R2.

---

## §4 — Authentication Surface Map

| Auth Level | Routes | Count |
|---|---|---|
| PUBLIC (no auth) | `auth/callback` (GET), `auth/resolve-username` (POST), `auth/session` (POST/DELETE), `access-requests` (POST) | 5 method-routes |
| AUTH (any logged-in user) | `chat/consume` (POST), `chat/upload` (POST), `conversations/*`, `citations/preview` (GET), `pyramid` (GET), `compute/[type]` (POST), `reports/[chartId]/[domain]` (GET) | ~18 method-routes |
| ADMIN (super_admin only) | `admin/*`, `clients` (GET/POST), `chat/build` (POST), `audit/*`, `trace/*`, `lel` (POST) | ~22 method-routes |

Authentication mechanism: Firebase session cookie (`__session`) verified via `getServerUser()` or `requireSuperAdmin()`.

---

## §5 — Post-fix verification (W3-R3 seal)

### 5.1 Error envelope migration

Per `00_NAK/reports/NAK_ERROR_FIX_REPORT_W2_R2_v1_0.md §2–§5`, all 30 routes were migrated to return the canonical `ApiErrorBody` envelope on every non-2xx path. Old shape `{ error: string }` is fully retired in API code.

```ts
// Canonical post-fix envelope (NAK_ERROR_FRAMEWORK_v1_0.md §2):
interface ApiErrorBody {
  error: {
    code: string         // machine-readable, e.g. "auth.required", "validation.failed"
    message: string      // user-facing, layman-readable
    detail?: unknown     // optional structured context (validation field map, retry hint)
    retry?: { after_ms?: number; idempotent?: boolean }
  }
}
```

Verification trail:
- 13 HIGH-severity routes (G-02..G-14 in W1-R2 register) — wrapped + envelope-migrated. See W2-R2 §3.
- All 30 routes call `res.*` helpers from `platform/src/lib/errors/errors.ts`. See W2-R2 §2.
- 7 missing `error.tsx` boundaries (G-12, G-13, G-14, G-26..G-29) — created in W2-R3. See `00_NAK/reports/NAK_COMPONENT_FIX_REPORT_W2_R3_v1_0.md`.

### 5.2 Input-validation gap disposition

The 8 entries in §3 were reviewed at W3-R3 seal:

| Gap | Disposition | Rationale |
|---|---|---|
| `conversations/[id]` family — id format | Accepted | Non-injection; DB miss is a 404, not a corruption risk. |
| `citations/preview` ILIKE | Routed to **NAK-D6** | Parameterised query so not injectable; performance-tail risk for pathological inputs. Tracked for post-NAK pen pass. |
| `compute/[type]` body passthrough | Accepted | Sidecar boundary. Sidecar owns body validation; this is the documented contract. |
| `reports/[chartId]/[domain]` domain | Accepted | DB miss is a 404; no risk. |
| `admin/users/[id]` DELETE id | Accepted | Firebase rejects unknown UIDs gracefully. |
| `trace/stream/[queryId]` queryId | Accepted | Stream emits `done` event on miss; no risk. |

### 5.3 Test baseline

`pipeline:accuracy-test` vitest run: 55/55 passing at W2-R2 close. W2-R3 added a11y tests; baseline preserved (one pre-existing AppShell breadcrumb test failure documented as test-bug, not code-bug, in W2-R3 follow-ups; queued for W3-R2 if a future QA run is opened).

---

*End of NAK_PORTAL_MATH_AUDIT_v1_0.md v1.1 — FINAL. Sealed at W3-R3 close 2026-04-30.*
