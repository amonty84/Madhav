---
artifact_id: NAK_ERROR_AUDIT_REPORT_W1_R2
version: 1.0
status: COMPLETE
authored_by: Claude Code (NAK W1-R2 session) 2026-04-30
project: NAK — Nakula
wave_run: W1-R2
title: Error Handling and Robustness Audit Report
scope: >
  platform/src/app/api/** (30 routes), platform/src/hooks/** (9 hooks),
  platform/src/app/**/error.tsx (5 boundaries), platform/src/lib/**
input_from: NAK_BASELINE_AUDIT_REPORT_W0_v1_0.md Part B + NAK_ERROR_FRAMEWORK_v1_0.md §9
consumed_by: NAK W2-R2 (Error Handling Implementation)
changelog:
  - v1.0 (2026-04-30): W1-R2 initial audit — full route + hook + boundary inventory.
---

# NAK W1-R2 — Error Handling and Robustness Audit Report

---

## §1 — Executive Summary

The platform has 30 API routes, 9 client hooks, and 5 error boundaries. The dominant failure pattern across routes is **unprotected DB/fetch calls outside try-catch blocks** — DB helpers (`query`, `getConversation`, `resolveAccess`, `listConversations`) are called at the top of handlers with no error wrapping, so a DB connection failure at any of these points produces an unhandled 500 crash response. Structured error envelope (`ApiErrorBody`) is present nowhere — all routes return `{ error: string }` only.

Hook errors: W0 accurately caught the `useFeedback` silent failure (GET fetch). Two other hooks (`useTraceStream`, `useChatSession`) were assessed as weak in W0 but actually do expose error state — this report corrects those findings. All 5 error boundaries now exist (W0 had 3 "not confirmed" — all confirmed present). One boundary (`cockpit`) is off-brand; four boundaries do not display the error digest.

**`lib/errors/` does not exist.** W2-R2 must create it.

Severity distribution:
- HIGH gaps: 13 routes
- MEDIUM gaps: 10 routes
- LOW/FINE: 7 routes

---

## §2 — Part A: Route Error Inventory (Complete)

Target error shape per `NAK_ERROR_FRAMEWORK_v1_0.md §2`:
```typescript
{ error: { code: string; message: string; detail?: string; retry?: boolean } }
```
Current dominant shape across all routes: `{ error: string }` — NOT `ApiErrorBody`.

### 2.1 Admin Routes (6 files; W0 listed 7 — correction: count is 6)

| Route | Method(s) | Current Error Shape | Has Try-Catch | Status Codes | Missing Cases | Gap Severity |
|---|---|---|---|---|---|---|
| `api/admin/users` | GET | `{ error: string }` | GET: full ✅ POST: partial | 400/409/500 | POST: duplicate-check query (line 66) unprotected; bare DB call can propagate as unhandled 500 | MEDIUM |
| `api/admin/users/[id]` | PATCH, DELETE | `{ error: string }` | PATCH: full ✅ DELETE: full ✅ | 400/500 | PATCH: no 404 check — returns `{ ok: true }` for non-existent `id`; Firebase+DB atomicity risk on status change | MEDIUM |
| `api/admin/users/[id]/send-reset` | POST | `{ error: string }` | DB query line 20: ❌ Firebase call: ✅ | 404/500 | DB query at line 20 is outside try-catch — DB error propagates as unhandled crash | HIGH |
| `api/admin/access-requests` | GET | `{ error: string }` | Full ✅ | 500 | Functional; just missing structured envelope | LOW |
| `api/admin/access-requests/[id]/approve` | POST | `{ error: string }` | Load+dup queries: ❌ Firebase: ✅ Profile: ✅ Status update: silent | 400/404/409/500 | Lines 41–56: two unprotected DB queries. Step 5 (mark approved, lines 89–98): caught but **silently swallowed** — function returns `{ ok: true }` even if status update failed | HIGH |
| `api/admin/access-requests/[id]/reject` | POST | `{ error: string }` | Load query: ❌ Update: ✅ | 404/409/500 | Load query lines 14–18 outside try-catch | HIGH |

**W0 Assessment Correction:** W0 found 7 admin routes with ❌ "bare throws, no structured envelope." Full-read correction: all 6 admin routes have *some* try-catch. The correct finding is *incomplete* coverage with specific unprotected DB calls and universal `{ error: string }` instead of `ApiErrorBody`. The count discrepancy (7→6) is because the W0 survey included `send-reset` as one of the 7 but only listed 5 explicitly; the actual file count is 6.

---

### 2.2 Auth Routes

| Route | Method(s) | Current Error Shape | Has Try-Catch | Status Codes | Missing Cases | Gap Severity |
|---|---|---|---|---|---|---|
| `api/auth/callback` | GET | n/a (redirect) | n/a | 302 | Legacy route — just redirects to /login | FINE |
| `api/auth/resolve-username` | POST | `{ error: string }` | JSON parse: ✅ DB query line 17: ❌ | 400/404 | DB query outside try-catch — DB error propagates as unhandled 500 | HIGH |
| `api/auth/session` | POST, DELETE | `{ error: string }` | JSON parse: ✅ verifyIdToken: ✅ DB SELECT line 24: ❌ createSessionCookie line 50: ❌ | 400/401/403/500 | Two unprotected operations in critical auth path | HIGH |
| `api/access-requests` | POST | `{ error: string }` | Dup-check query line 40: ❌ INSERT: ✅ | 400/409/500 | Duplicate check query outside try-catch | MEDIUM |

---

### 2.3 Chat Routes

| Route | Method(s) | Current Error Shape | Has Try-Catch | Status Codes | Missing Cases | Gap Severity |
|---|---|---|---|---|---|---|
| `api/chat/build` | POST | `{ error: string }` / `onError` callback | JSON: ✅ Promise.all lines 40–49: ❌ LLM `onError`: ✅ Persistence `onFinish`: ✅ | 400/403/404/500 | `Promise.all` DB queries outside try-catch | MEDIUM |
| `api/chat/consume` | POST | `{ error: string }` / `onError` callback / `new Response(msg, 500)` | New pipeline: wrapped ✅ Old pipeline Promise.all lines 119–132: ❌ | 400/401/403/404/422/500 | Old pipeline DB queries unprotected. New pipeline error at line 416 returns `new Response(msg, 500)` — inconsistent with all other routes using `NextResponse.json` | MEDIUM |
| `api/chat/upload` | POST | `{ error: string }` | Form parse: ✅ GCS upload: ✅ DB INSERT line 58: ❌ | 400/401/413/415/500 | DB INSERT after GCS upload succeeds is unprotected — upload URL generated but attachment metadata lost on DB failure | HIGH |

---

### 2.4 Clients Route

| Route | Method(s) | Current Error Shape | Has Try-Catch | Status Codes | Missing Cases | Gap Severity |
|---|---|---|---|---|---|---|
| `api/clients` | GET, POST | `{ error: string }` | GET: ✅ POST: JSON line 32: ❌ Firebase: ✅ DB inserts: ✅ | 400/403/500 | POST `request.json()` on line 32 is not in try-catch — malformed body crashes | MEDIUM |

---

### 2.5 Conversations Routes

**Systemic pattern:** `resolveAccess(userId)` (a DB query helper) and `getConversation(...)` are called at the top of every handler with no try-catch. A DB connection failure on any of these produces an unhandled 500 across the entire conversations surface.

| Route | Method(s) | Current Error Shape | Has Try-Catch | Status Codes | Missing Cases | Gap Severity |
|---|---|---|---|---|---|---|
| `api/conversations` | GET | `{ error: string }` | `listConversations` call: ❌ | 400/401 | `listConversations` is a DB call with no error wrapping | HIGH |
| `api/conversations/[id]` | GET, PATCH, DELETE | `{ error: string }` | `resolveAccess`: ❌ all methods. `getConversation`: ❌ all. `loadConversationMessages`: ❌ GET. `updateConversationTitle`: ❌ PATCH. `deleteConversation`: ❌ DELETE. | 400/401/404 | All DB helper calls unprotected across all 3 methods | HIGH |
| `api/conversations/[id]/feedback` | GET, POST | `{ error: string }` | `resolveAccess`: ❌ both. `getConversation`: ❌ both. GET query: ❌. DELETE rating=null query: ❌. POST INSERT: ✅ | 400/401/404/500 | Systemic helper pattern + additional unprotected queries | HIGH |
| `api/conversations/[id]/share` | GET, POST, DELETE | `{ error: string }` | `resolveAccess`: ❌ all. `getConversation`: ❌ all. GET query: ❌. POST `existing` query: ❌. DELETE query: ❌. POST INSERT: ✅ | 401/404/500 | Systemic helper pattern + additional unprotected queries across all 3 methods | HIGH |

---

### 2.6 Audit Routes

| Route | Method(s) | Current Error Shape | Has Try-Catch | Status Codes | Missing Cases | Gap Severity |
|---|---|---|---|---|---|---|
| `api/audit/[query_id]` | GET | `{ error: string }` | Full ✅ | 404/500 | Fine | LOW |
| `api/audit/list` | GET | `{ error: string }` | Full ✅ | 400/500 | Fine | LOW |
| `api/audit/predictions` | GET | `{ error: string }` | Full ✅ | 500 | Fine | LOW |
| `api/audit/predictions/[id]/outcome` | POST | `{ error: string }` | Pre-check query line 34: ❌ `recordOutcome`: ✅ | 400/404/409/422/500 | Pre-check query outside try-catch | MEDIUM |

---

### 2.7 Citations Route

| Route | Method(s) | Current Error Shape | Has Try-Catch | Status Codes | Missing Cases | Gap Severity |
|---|---|---|---|---|---|---|
| `api/citations/preview` | GET | `{ error: string }` | **NO try-catch anywhere** ❌ | 400/401/404 | Entire route body is unprotected — all 3 DB query branches can throw unhandled. No 500 handler. | HIGH |

---

### 2.8 LEL Route

| Route | Method(s) | Current Error Shape | Has Try-Catch | Status Codes | Missing Cases | Gap Severity |
|---|---|---|---|---|---|---|
| `api/lel` | POST | `{ error: string }` | Full ✅ | 400/403/500 | Fine | LOW |

---

### 2.9 Pyramid Route

| Route | Method(s) | Current Error Shape | Has Try-Catch | Status Codes | Missing Cases | Gap Severity |
|---|---|---|---|---|---|---|
| `api/pyramid` | GET | `{ error: string }` | Auth DB queries lines 14–28: ❌ Main query: ✅ | 400/401/403/404/500 | Two auth-check DB queries outside try-catch | MEDIUM |

---

### 2.10 Compute Route

| Route | Method(s) | Current Error Shape | Has Try-Catch | Status Codes | Missing Cases | Gap Severity |
|---|---|---|---|---|---|---|
| `api/compute/[type]` | POST | `{ error: string }` | JSON parse line 32: ❌ `fetch(sidecarUrl)` lines 34–41: ❌ | 400/401/503 | JSON parse unprotected. `fetch()` to sidecar unprotected — if sidecar is unreachable (ECONNREFUSED), the `fetch` itself throws and propagates as unhandled crash. This is the primary expected failure mode for this route. | HIGH |

---

### 2.11 Trace Routes

| Route | Method(s) | Current Error Shape | Has Try-Catch | Status Codes | Missing Cases | Gap Severity |
|---|---|---|---|---|---|---|
| `api/trace/history` | GET | `{ error: string }` | Full ✅ | 500 | Fine | LOW |
| `api/trace/stream/[queryId]` | GET (SSE) | SSE `data:` events; error in stream handled silently | Historical `fetchTraceSteps` line 42: ❌ Live `fetchTraceSteps` line 71: ❌ SSE enqueue errors: ✅ | n/a (streaming) | DB fetch calls in both modes unprotected. SSE client-disconnect errors silently caught (correct). | MEDIUM |

---

### 2.12 Reports Route

| Route | Method(s) | Current Error Shape | Has Try-Catch | Status Codes | Missing Cases | Gap Severity |
|---|---|---|---|---|---|---|
| `api/reports/[chartId]/[domain]` | GET | `{ error: string }` | `Promise.all` queries line 15: ❌ Third query lines 28–36: ❌ GCS download: ✅ | 401/403/404/500 | Two unprotected DB queries covering auth and report lookup | HIGH |

---

### 2.13 Route Severity Summary

| Severity | Count | Routes |
|---|---|---|
| HIGH | 13 | `admin/users/[id]/send-reset`, `admin/access-requests/[id]/approve`, `admin/access-requests/[id]/reject`, `auth/resolve-username`, `auth/session`, `chat/upload`, `conversations`, `conversations/[id]`, `conversations/[id]/feedback`, `conversations/[id]/share`, `citations/preview`, `compute/[type]`, `reports/[chartId]/[domain]` |
| MEDIUM | 10 | `admin/users`, `admin/users/[id]`, `access-requests`, `chat/build`, `chat/consume`, `clients`, `audit/predictions/[id]/outcome`, `pyramid`, `trace/stream/[queryId]`, (OLD: `admin/access-requests` borderline MEDIUM/LOW) |
| LOW/FINE | 7 | `auth/callback`, `admin/access-requests` (GET), `lel`, `audit/[query_id]`, `audit/list`, `audit/predictions`, `trace/history` |

**Universal gap across all 30 routes:** No route returns `ApiErrorBody` (`{ error: { code, message, detail?, retry? } }`). All use `{ error: string }`.

---

## §3 — Part B: Hook Error Inventory (Complete)

9 hooks audited.

| Hook | Async Ops | Has Try-Catch | Exposes Error State | Silent Failure Risk | Gap |
|---|---|---|---|---|---|
| `useFeedback` | GET (load ratings) + POST (rate) | GET: empty `.catch(() => {})` ❌ POST: rollback catch ✅ | Neither op exposes error to caller. Return: `{ ratings, rate }` — no `error` field. | **CONFIRMED: GET silently discards fetch errors.** POST rolls back optimistic update silently — caller cannot display error message to user. | MEDIUM — W0 confirmed. W1-R2 deep finding: POST rollback is silent too. |
| `useTraceStream` | SSE connection (EventSource) | `es.onerror` sets `error` state ✅ JSON parse errors: `console.error` only | `{ steps, done, error }` — error IS returned to caller. **W0 CORRECTION: error is surfaced.** | None for SSE connection — error state propagates. JSON parse errors (malformed event data) are console.error only, not surfaced via `error` state. | LOW — error surfaced. Gap: JSON parse errors discarded; `error` message is generic string, not failure-mode-classified. |
| `useChatSession` | LLM stream via ai-sdk `useChat` | ai-sdk handles error state internally. `onFinish` does not handle errors. | `error: chat.error` returned in hook result. **W0 CORRECTION: error is surfaced.** | None — ai-sdk error propagates as `chat.error`. | LOW — error surfaced. `onFinish` conversation-ID extraction has no error handling but this is not an error path (it reads metadata, not an async op). |
| `useBuildChatAdapter` (hook: `useBuildChat`) | LLM stream via ai-sdk `useChat` | Same as useChatSession | `error: chat.error` returned. ✅ | None | LOW — error surfaced. |
| `useAttachments` | File upload to `/api/chat/upload` | Upload wrapped in try-catch ✅ | `attachments[i].status === 'error'` + `attachments[i].errorMsg` — error surfaced per-file in attachment state | None | FINE — per-file error state is clear and actionable. |
| `useBranches` | None (in-memory) | n/a | n/a | None | FINE |
| `useChatPreferences` | localStorage read/write | Empty try/catch on localStorage ops | None needed — localStorage fails silently by design | None — appropriate | FINE |
| `useHotkeys` | None (keyboard events) | n/a | n/a | None | FINE |
| `useScrollAnchor` | None (DOM observers) | n/a | n/a | None | FINE |

**Key corrections to W0 Part B:**
1. `useTraceStream` — W0 said "error surface unclear." Deep read: error IS surfaced via `error: string | null` in return value. `es.onerror` sets it.
2. `useChatSession` — W0 said "onFinish silently swallows errors." Deep read: ai-sdk's `useChat` hook owns error state; `chat.error` is returned. The `onFinish` callback in the route file only reads metadata — it is not an error-handling path.

---

## §4 — Part C: Error Boundary Inventory (Complete)

`find platform/src/app -name "error.tsx"` output (2026-04-30):
```
platform/src/app/error.tsx
platform/src/app/cockpit/error.tsx
platform/src/app/clients/[id]/error.tsx
platform/src/app/clients/[id]/consume/error.tsx
platform/src/app/clients/[id]/consume/[conversationId]/error.tsx
```

**W0 correction:** W0 had 3 boundaries as "not confirmed." All 3 now confirmed present:
- `clients/[id]/error.tsx` ✅
- `clients/[id]/consume/error.tsx` ✅
- `clients/[id]/consume/[conversationId]/error.tsx` ✅

### 4.1 Per-Boundary Assessment

| File | Component | Uses Design Tokens | Uses `Button` Component | Shows Digest | Gap |
|---|---|---|---|---|---|
| `app/error.tsx` | `GlobalError` | Tailwind (`muted-foreground`) — partial tokens | ✅ Uses `Button` | ❌ No digest shown | Renders `error.message` directly — may expose internal errors to end users. No digest. |
| `app/cockpit/error.tsx` | `BuildError` | Raw Tailwind strings (`text-destructive`, inline classes) — NOT brand tokens | ❌ Raw `<button>` | ✅ Shows digest | Off-brand button styles. Confirmed from W0. |
| `app/clients/[id]/error.tsx` | `ClientError` | Tailwind (`muted-foreground`) — partial tokens | ✅ Uses `Button` + `buttonVariants` | ❌ No digest | Clean design. Missing digest display. |
| `app/clients/[id]/consume/error.tsx` | `ConsumeError` | Delegates to `SharedConsumeError` — full brand tokens ✅ | ❌ Raw `<button>` with `brand-cta` class (not `Button` component) | ❌ No digest | `SharedConsumeError` uses CSS variables (`--brand-gold`, `--brand-charcoal`, etc.) — branded ✅. But uses raw `<button>` instead of `Button` component. |
| `app/clients/[id]/consume/[conversationId]/error.tsx` | `ConversationError` | Same as above (delegates to `SharedConsumeError`) | ❌ Raw `<button>` | ❌ No digest | Same as ConsumeError. |

### 4.2 Missing Boundaries

Route segments reachable by users that lack `error.tsx`, with priority from `NAK_ERROR_FRAMEWORK_v1_0.md §8`:

| Route Segment | User-Facing? | Priority | Status |
|---|---|---|---|
| `app/dashboard/` | Yes — main user landing | P1 | ❌ Missing |
| `app/clients/[id]/build/` | Yes — build mode surface | P1 | ❌ Missing |
| `app/share/[slug]/` | Yes — public share link (unauthenticated) | P1 | ❌ Missing |
| `app/audit/` | Super-admin only | P2 | ❌ Missing |
| `app/clients/[id]/timeline/` | Yes | P2 | ❌ Missing |
| `app/build/[...slug]/` | Redirect surface | P2 | ❌ Missing |
| `app/admin/` | Super-admin only | P2 | ❌ Missing |
| `app/cockpit/` subsections | Super-admin only | P2 | Falls through to `cockpit/error.tsx` (off-brand) |
| `app/login/` | Public auth surface | P3 | ❌ Missing |
| `app/reset-password/` | Public auth surface | P3 | ❌ Missing |

3 P1 boundaries are missing: `dashboard`, `clients/[id]/build`, `share/[slug]`.

---

## §5 — Part D: lib/errors/ Inventory

`platform/src/lib/errors/` — **does not exist.**

No error utilities, error types, or error factory functions exist in `lib/`. W2-R2 must create:
- `platform/src/lib/errors/types.ts` — `ApiErrorBody` interface + `apiError()` factory
- `platform/src/lib/errors/codes.ts` — all SCREAMING_SNAKE_CASE codes enumerated
- `platform/src/lib/errors/index.ts` — re-export barrel

Related utilities in `lib/`:
- `lib/auth/access-control.ts` — `requireSuperAdmin()` helper returns `NextResponse` on failure; pattern is sound but does not use `ApiErrorBody`
- No error middleware, no centralized error logger, no error boundary shared component beyond `SharedConsumeError.tsx`

---

## §6 — Cross-Cutting Patterns and Root Cause Analysis

### Pattern 1: DB Calls Without Try-Catch at Route Top-Level

The most pervasive gap. DB helper functions (`query`, `getConversation`, `resolveAccess`, `listConversations`) are called in route handler bodies before any try-catch. This affects conversations (4 routes × 3 methods), auth, citations, reports, compute, and others.

**Root cause:** No centralized database error handler or wrapper utility. Each route manually wraps some DB calls but not all.

**W2-R2 fix:** Create `lib/errors/db.ts` with a `withDbError(fn)` wrapper or route-level try-catch at the top of each handler.

### Pattern 2: Systemic `resolveAccess` + `getConversation` Helpers

Conversation routes call two DB helpers in sequence before any business logic, with no try-catch. Any DB failure on either call crashes the route.

**W2-R2 fix:** Wrap these calls in the route-level try-catch, or create error-safe versions of the helpers.

### Pattern 3: Structured Envelope Absent Everywhere

Every route uses `{ error: string }`. The `ApiErrorBody` interface does not exist in the codebase.

**W2-R2 fix:** Create `lib/errors/types.ts`, migrate all routes to use the `apiError()` factory.

### Pattern 4: Silent `approve` Route Step 5

`admin/access-requests/[id]/approve` step 5 (marking the request `approved`) is wrapped in try-catch that only console.errors — the function returns `{ ok: true }` even if the status update failed. The access request row remains `pending` but the user was created and the caller receives success.

**W2-R2 fix:** Return an error response if step 5 fails, or accept eventual consistency and document the behavior.

### Pattern 5: `compute/[type]` Fetch Without Try-Catch

The bare `fetch(sidecarUrl)` call is the primary expected failure mode for this route (sidecar down). Yet it is not wrapped. ECONNREFUSED, ETIMEDOUT, or DNS failures will throw and produce an unhandled 500 instead of the intended `SYSTEM_SIDECAR_UNAVAILABLE` response.

---

## §7 — Severity-Ranked Gap Register

Ranked by severity, then by user impact.

| # | Gap | Mode | Severity | Surface | W2-R2 Action |
|---|---|---|---|---|---|
| G-01 | `conversations` route family: `resolveAccess` + `getConversation` + all queries unprotected across 4 routes × multiple methods | SYSTEM | HIGH | Core app surface — every conversation interaction | Wrap route handlers in top-level try-catch |
| G-02 | `compute/[type]`: bare `fetch(sidecarUrl)` — ECONNREFUSED throws unhandled | SYSTEM | HIGH | Sidecar compute (ephemeris, chart states, etc.) | Wrap fetch + return `SYSTEM_SIDECAR_UNAVAILABLE` |
| G-03 | `citations/preview`: entire route unprotected | SYSTEM | HIGH | Trace drawer citation preview | Add try-catch to entire route |
| G-04 | `auth/session`: DB SELECT + `createSessionCookie` unprotected | SYSTEM | HIGH | Login critical path | Wrap both calls |
| G-05 | `auth/resolve-username`: DB query unprotected | SYSTEM | HIGH | Login critical path | Add try-catch |
| G-06 | `chat/upload`: DB INSERT after GCS upload succeeds unprotected — metadata lost on DB failure | DATA/SYSTEM | HIGH | File attachment upload | Wrap DB INSERT |
| G-07 | `reports/[chartId]/[domain]`: two unprotected DB queries | SYSTEM | HIGH | Report download | Wrap route handler |
| G-08 | `admin/access-requests/[id]/approve`: two unprotected DB queries + silent step-5 swallow | DATA/SYSTEM | HIGH | Admin approval flow | Protect queries; decide on step-5 error behavior |
| G-09 | `admin/access-requests/[id]/reject`: load query unprotected | SYSTEM | HIGH | Admin rejection flow | Add try-catch |
| G-10 | `admin/users/[id]/send-reset`: DB query unprotected | SYSTEM | HIGH | Admin password reset | Add try-catch |
| G-11 | `conversations` (GET `/api/conversations`): `listConversations` unprotected | SYSTEM | HIGH | Sidebar conversation list | Wrap call |
| G-12 | `dashboard/` missing error.tsx boundary | SYSTEM | HIGH (P1) | Main user landing | Author `app/dashboard/error.tsx` |
| G-13 | `clients/[id]/build/` missing error.tsx boundary | SYSTEM | HIGH (P1) | Build mode surface | Author `app/clients/[id]/build/error.tsx` |
| G-14 | `share/[slug]/` missing error.tsx boundary | SYSTEM | HIGH (P1) | Public share link | Author `app/share/[slug]/error.tsx` |
| G-15 | `useFeedback` GET: silent `.catch(() => {})` — no error state exposed | NETWORK/SYSTEM | MEDIUM | Consume chat rating load | Expose error state; replace silent swallow |
| G-16 | `useFeedback` POST: silent rollback — caller cannot show error message | SYSTEM | MEDIUM | Consume chat rating submit | Expose error state |
| G-17 | `admin/users`: POST duplicate-check query unprotected | SYSTEM | MEDIUM | Admin user creation | Wrap query |
| G-18 | `admin/users/[id]` PATCH: no 404 check | DATA | MEDIUM | Admin user edit | Add check |
| G-19 | `access-requests` (public) POST: duplicate-check query unprotected | SYSTEM | MEDIUM | Access request form | Wrap query |
| G-20 | `chat/build` + `chat/consume` (old path): `Promise.all` DB queries unprotected | SYSTEM | MEDIUM | Chat (build and consume) | Wrap Promise.all |
| G-21 | `clients` POST: JSON parse unprotected | DATA | MEDIUM | Client creation | Add try-catch |
| G-22 | `pyramid` GET: auth queries unprotected | SYSTEM | MEDIUM | Pyramid layer view | Wrap queries |
| G-23 | `trace/stream` GET: `fetchTraceSteps` unprotected in both modes | SYSTEM | MEDIUM | Trace panel SSE stream | Wrap calls |
| G-24 | `audit/predictions/[id]/outcome` POST: pre-check query unprotected | SYSTEM | MEDIUM | Prediction outcome recording | Wrap query |
| G-25 | `chat/consume` (new pipeline): error response is `new Response(msg, 500)` not `NextResponse.json` — inconsistent shape | SYSTEM | MEDIUM | Consume pipeline pre-stream error | Use `NextResponse.json` |
| G-26 | `app/error.tsx`: renders `error.message` directly — may expose internals | SYSTEM | MEDIUM | Global fallback | Show generic message; log digest |
| G-27 | 4 of 5 boundaries missing digest display | SYSTEM | LOW | All surfaces | Add digest to reset/fallback areas |
| G-28 | `app/cockpit/error.tsx`: off-brand (raw Tailwind, no `Button`, no brand tokens) | — | LOW | Build cockpit | Align to `SharedConsumeError` pattern |
| G-29 | `SharedConsumeError`: raw `<button>` instead of `Button` component | — | LOW | Consume/conversation errors | Replace with `Button` component |
| G-30 | `useTraceStream`: JSON parse errors in SSE handler are console.error only, not surfaced | SYSTEM | LOW | Trace panel | Optionally surface to `error` state |
| G-31 | Universal: No route returns `ApiErrorBody` — all use `{ error: string }` | — | (systemic) | All 30 routes | W2-R2 full migration |
| G-32 | `lib/errors/` does not exist | — | (prerequisite) | — | W2-R2 must create |

---

*End of NAK_ERROR_AUDIT_REPORT_W1_R2_v1_0.md v1.0 — COMPLETE. W2-R2 consumes this as its input.*
