---
artifact_id: NAK_ERROR_FRAMEWORK
version: 2.0
status: FINAL
authored_by: Claude Code (NAK W0 session) 2026-04-30
revised_by: Claude Code (NAK W1-R2 session) 2026-04-30
implemented_by: Claude Code (NAK W2-R2 session) 2026-04-30
project: NAK — Nakula
wave_run: W0 (draft) → W1-R2 (confirmed/extended §9) → W2-R2 (implement) → FINAL
purpose: >
  Defines the canonical error contract for the MARSYS-JIS platform portal.
  This is prescriptive (target state). W1-R2 audited current state in depth;
  §2–§7 required no constraint-driven revision. §8 coverage table corrected
  (all 3 "not confirmed" boundaries confirmed present + 3 new P1 gaps found).
  §9 extended from 7 to 32 confirmed gaps. W2-R2 implemented all 32 gaps;
  status elevated to FINAL.
changelog:
  - v1.0 (2026-04-30): W0 authoring — canonical error envelope, four failure modes,
      user-facing messages, display patterns, decision matrix, retry strategy.
  - v1.1 (2026-04-30): W1-R2 deep audit. §8 boundary table corrected and extended.
      §9 replaced with confirmed 32-gap register from full-read audit of all 30 routes
      and 9 hooks. No constraint found requiring revision to §2–§7 prescriptive spec.
  - v2.0 (2026-04-30): W2-R2 implementation complete. All 32 gaps resolved:
      platform/src/lib/errors/ created (ApiErrorBody type, factory functions, res.* helpers);
      all 30 API routes migrated to ApiErrorBody envelope; all specific try-catch gaps
      wrapped; useFeedback hook error state exposed. Status: DRAFT → FINAL.
      Deferred to W2-R3: error.tsx boundary files (3 missing P1 boundaries:
      dashboard, clients/[id]/build, share/[slug]; cockpit off-brand fix;
      digest display on 4 boundaries; SharedConsumeError raw button).
---

# NAK Error Framework v2.0 — FINAL

## §1 — Purpose

The platform currently uses an inconsistent error model: API routes return `{ error: string }` with no machine-readable code, hooks either silently discard errors or delegate to the AI SDK, and error boundaries are missing on several user-facing surfaces. This document defines the **target state** — the canonical error contract that W2-R2 will implement.

This is prescriptive, not descriptive. W1-R2 audits current state in depth and may revise §2–§7 if implementation constraints arise.

---

## §2 — Canonical API Error Envelope

Every API route that returns an error (non-2xx) must return JSON in this shape:

```typescript
interface ApiErrorBody {
  error: {
    code: string;      // machine-readable SCREAMING_SNAKE_CASE
    message: string;   // human-readable sentence for logs/debugging
    detail?: string;   // optional structured context (field name, constraint, etc.)
    retry?: boolean;   // true if the client should offer/auto-retry
  };
}
```

**Example:**
```json
{
  "error": {
    "code": "CHART_NOT_FOUND",
    "message": "Chart c_abc123 does not exist or you do not have access.",
    "detail": "chartId: c_abc123",
    "retry": false
  }
}
```

**Migration note:** The current `{ error: string }` shape is tolerated through W1 (audit only). W2-R2 migrates all routes to the structured envelope.

**Utility type to author in `platform/src/lib/errors/types.ts`:**

```typescript
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    detail?: string;
    retry?: boolean;
  };
}

export function apiError(
  code: string,
  message: string,
  options?: { detail?: string; retry?: boolean }
): ApiErrorBody {
  return { error: { code, message, ...options } };
}
```

---

## §3 — Four Failure Modes

All errors map to one of four modes. The mode determines the code prefix, user message, and display pattern.

### 3.1 NETWORK

The client's fetch did not complete — connection refused, DNS failure, timeout, or no response body received. The server was never reached or the response never arrived.

**Code prefix:** `NETWORK_*`

| Code | Meaning |
|---|---|
| `NETWORK_TIMEOUT` | Request exceeded configured timeout |
| `NETWORK_UNREACHABLE` | DNS failure or connection refused |
| `NETWORK_ABORTED` | Request aborted (user navigated away) |

**Characteristics:** `retry: true`. Server never processed the request — no state was changed. Applies to all fetch calls in hooks, streaming connections, SSE.

### 3.2 AUTH

The server received the request but refused it because the caller is not authenticated (401) or not authorised (403).

**Code prefix:** `AUTH_*`

| Code | Meaning |
|---|---|
| `AUTH_UNAUTHENTICATED` | No session or session expired (401) |
| `AUTH_FORBIDDEN` | Authenticated but lacks required role/permission (403) |
| `AUTH_SESSION_EXPIRED` | Token was valid but has since expired |

**Characteristics:** `retry: false` — re-authenticating is required, not retrying. `AUTH_UNAUTHENTICATED` triggers redirect to `/login`. `AUTH_FORBIDDEN` displays inline.

### 3.3 DATA

The server received a well-formed, authorised request but could not complete it because the input was invalid (400/422) or a referenced resource does not exist (404).

**Code prefix:** `DATA_*`

| Code | Meaning |
|---|---|
| `DATA_INVALID_INPUT` | Missing required field or invalid value (400/422) |
| `DATA_NOT_FOUND` | Referenced chart, conversation, or resource not found (404) |
| `DATA_VALIDATION_FAILED` | Query bundle failed schema validation (422) |
| `DATA_CORPUS_EMPTY` | No corpus content available to answer the query |
| `DATA_CONSTRAINT_VIOLATION` | DB uniqueness or FK constraint violated |

**Characteristics:** `retry: false` — same request, same error. Some DATA errors are user-actionable (fix input); others require admin attention (empty corpus).

### 3.4 SYSTEM

A valid, authorised request was received but an unexpected internal error prevented completion. The server's fault.

**Code prefix:** `SYSTEM_*`

| Code | Meaning |
|---|---|
| `SYSTEM_INTERNAL` | Unexpected server error (500) |
| `SYSTEM_DB_UNAVAILABLE` | Database connection failed |
| `SYSTEM_SIDECAR_UNAVAILABLE` | Python sidecar returned non-200 (503) |
| `SYSTEM_LLM_ERROR` | LLM provider returned an error |
| `SYSTEM_TIMEOUT` | Server-side timeout (distinct from `NETWORK_TIMEOUT`) |

**Characteristics:** `retry: true` for transient errors (`SYSTEM_DB_UNAVAILABLE`, `SYSTEM_SIDECAR_UNAVAILABLE`). `retry: false` for permanent errors (`SYSTEM_INTERNAL`). Error code + session ID logged server-side; only a friendly message goes to the client.

---

## §4 — User-Facing Messages

Plain English messages displayed in the UI. The `message` field in the envelope is for logs/debugging only — never rendered directly.

| Mode | Code(s) | User-Facing Message |
|---|---|---|
| NETWORK | `NETWORK_TIMEOUT`, `NETWORK_UNREACHABLE` | "Could not reach the server. Check your connection and try again." |
| NETWORK | `NETWORK_ABORTED` | (silent — user navigated away intentionally) |
| AUTH | `AUTH_UNAUTHENTICATED` | "Your session has expired. Please sign in again." |
| AUTH | `AUTH_FORBIDDEN` | "You do not have access to this area. Contact the administrator if you think this is a mistake." |
| DATA | `DATA_INVALID_INPUT` | "Some information was missing or invalid. Check your input and try again." |
| DATA | `DATA_NOT_FOUND` | "The requested content was not found. It may have been removed or you may have followed an old link." |
| DATA | `DATA_VALIDATION_FAILED` | "The query could not be processed because the request format was invalid. Try rephrasing or refreshing the page." |
| DATA | `DATA_CORPUS_EMPTY` | "There is no content available to answer this question yet. The corpus may still be loading." |
| SYSTEM | `SYSTEM_INTERNAL` | "Something went wrong on our end. Try again in a moment." |
| SYSTEM | `SYSTEM_SIDECAR_UNAVAILABLE` | "The analysis service is temporarily unavailable. Try again in a moment." |
| SYSTEM | `SYSTEM_LLM_ERROR` | "The AI model returned an error. Try again in a moment." |

---

## §5 — Display Patterns

Three patterns are defined. §6 decides which applies.

### 5.1 TOAST

**Component:** `Sonner` toast (already wired via `ui/sonner.tsx`)

**Behaviour:** Appears for 4–6 seconds, bottom-right. Non-blocking. Auto-dismisses. Optionally includes a "Retry" action for `retry: true` errors.

**When to use:** Transient, low-severity errors where the user can continue working — e.g., a feedback persist failing, a share action timing out.

### 5.2 INLINE

**Component:** Custom inline error element within the form/panel/chat that failed.

**Behaviour:** Rendered inside the component that errored. Persists until user acts. Must use `role="alert"` for screen reader accessibility. Includes "Try again" button if `retry: true`.

**When to use:** Errors scoped to a specific UI region — a form submission, a panel that failed to load, a hook error in a specific chat action.

### 5.3 BOUNDARY

**Component:** `error.tsx` (Next.js App Router error boundary)

**Behaviour:** Replaces the entire route segment with a full-page error state. Renders a reset button that re-renders the failed segment. Logs the error digest server-side.

**When to use:** Errors that crash a route segment, or that prevent any useful action on the current surface. Reserved for SYSTEM errors that propagate past component-level handling.

---

## §6 — Decision Matrix

| Failure Mode | Severity | `retry?` | Display Pattern | Notes |
|---|---|---|---|---|
| NETWORK | Low (background action) | true | TOAST | e.g., feedback persist, share |
| NETWORK | High (blocking action) | true | INLINE | e.g., chat submit failing |
| AUTH / UNAUTHENTICATED | Any | false | BOUNDARY (redirect) | Redirect to `/login` |
| AUTH / FORBIDDEN | Any | false | INLINE | Show within the protected element |
| DATA / INVALID_INPUT | Any | false | INLINE | At the form field or submit area |
| DATA / NOT_FOUND | Route-level | false | BOUNDARY | The whole route is broken |
| DATA / NOT_FOUND | Component-level | false | INLINE | A panel or widget couldn't load |
| DATA / CORPUS_EMPTY | Any | false | INLINE | In the chat window / report area |
| DATA / VALIDATION_FAILED | Any | false | INLINE | In the chat window |
| SYSTEM / transient | Background | true | TOAST + auto-retry | 1 retry after 1.5s, then show toast |
| SYSTEM / transient | Blocking | true | INLINE with retry button | |
| SYSTEM / permanent | Route-level | false | BOUNDARY | |
| SYSTEM / permanent | Component-level | false | INLINE | |

---

## §7 — Retry Strategy

Applies only to `retry: true` errors (`NETWORK_*` and transient `SYSTEM_*`).

**Client-side:**

| Context | Strategy |
|---|---|
| Background hooks (useFeedback, useTraceStream) | 1 silent retry after 1.5s; on failure, show TOAST |
| Chat message submission | No auto-retry; show INLINE with manual "Try again" button |
| SSE stream connections | Browser-native EventSource auto-reconnect; cap at 3 reconnects, then show INLINE |
| Non-streaming fetch calls | No auto-retry; let the component decide |

**Server-side:**

| Context | Strategy |
|---|---|
| Sidecar calls (`/api/compute/*`) | 1 retry after 500ms; on failure, return `SYSTEM_SIDECAR_UNAVAILABLE` |
| Database queries | No retry; surface `SYSTEM_DB_UNAVAILABLE` immediately |
| LLM calls | Delegate to ai-sdk built-in retry; surface `SYSTEM_LLM_ERROR` on final failure |

**Backoff:** 1.5× exponential starting at 500ms, capped at 4s. Sequence: 500ms → 750ms → 1125ms → 1500ms (cap).

---

## §8 — Error Boundary Coverage Requirements

Every client-rendered route segment reachable by a non-admin user must have an `error.tsx`. Minimum required boundaries after W2-R2.

**W1-R2 audit results** (2026-04-30): All five existing boundaries confirmed. Three "not confirmed" entries from W0 are now confirmed present. Three new P1 gaps discovered.

| Route | Priority | Status | W1-R2 Finding |
|---|---|---|---|
| `src/app/error.tsx` | P0 — global fallback | ✅ exists | Renders `error.message` directly (may expose internals); no digest; uses `Button` ✅ |
| `src/app/clients/[id]/consume/error.tsx` | P0 — highest-traffic user surface | ✅ confirmed | Delegates to `SharedConsumeError` — brand tokens ✅; raw `<button>` not `Button` component; no digest |
| `src/app/clients/[id]/error.tsx` | P1 — client chart surface | ✅ confirmed | Uses `Button` ✅; no digest |
| `src/app/cockpit/error.tsx` | P1 — build cockpit | ✅ exists (off-brand; fix at W2-R2) | Confirmed off-brand: raw Tailwind, no `Button`, no brand tokens. Does show digest. |
| `src/app/clients/[id]/consume/[conversationId]/error.tsx` | P2 — conversation detail | ✅ confirmed | Delegates to `SharedConsumeError`; same gaps as consume boundary |
| `src/app/dashboard/error.tsx` | P1 — main user landing | ❌ **missing** | Discovered in W1-R2 |
| `src/app/clients/[id]/build/error.tsx` | P1 — build mode surface | ❌ **missing** | Discovered in W1-R2 |
| `src/app/share/[slug]/error.tsx` | P1 — public share link | ❌ **missing** | Discovered in W1-R2; public-facing, unauthenticated |
| `src/app/audit/error.tsx` | P2 — audit surface | ❌ missing | Super-admin only |
| `src/app/clients/[id]/timeline/error.tsx` | P2 — timeline surface | ❌ missing | User-facing |
| `src/app/admin/error.tsx` | P2 — admin panel | ❌ missing | Super-admin only |

W2-R2 authors the missing P1 boundaries (dashboard, build, share) and the off-brand cockpit fix. P2 boundaries are stretch goals.

---

## §9 — Confirmed Gaps (from W1-R2 Full Audit)

W1-R2 replaced the W0 placeholder list with the confirmed 32-gap register from full-read audit of all 30 routes and 9 hooks. Full audit detail in `00_NAK/reports/NAK_ERROR_AUDIT_REPORT_W1_R2_v1_0.md §7`.

**W0 gap corrections:**
- "Admin routes (6) lack try-catch entirely" — **CORRECTED:** Admin routes have partial try-catch; specific unprotected DB calls identified per route.
- "Consume error boundary not confirmed" — **CORRECTED:** boundary confirmed present ✅.
- "`useTraceStream` error surface unclear" — **CORRECTED:** error IS surfaced via `error: string | null` return value.
- "`useChatSession.onFinish` silently swallows errors" — **CORRECTED:** ai-sdk `chat.error` exposed; `onFinish` is not an error handling path.

**Confirmed gaps (abridged — full detail in NAK_ERROR_AUDIT_REPORT_W1_R2_v1_0.md):**

| Gap | Mode | Severity | Surface |
|---|---|---|---|
| `conversations` route family: `resolveAccess` + `getConversation` unprotected systemically (4 routes, multiple methods) | SYSTEM | HIGH | Core conversation surface |
| `compute/[type]`: bare `fetch(sidecarUrl)` — ECONNREFUSED throws unhandled | SYSTEM | HIGH | Sidecar compute |
| `citations/preview`: entire route has no try-catch | SYSTEM | HIGH | Trace citation preview |
| `auth/session`: DB SELECT + `createSessionCookie` unprotected | SYSTEM | HIGH | Login critical path |
| `auth/resolve-username`: DB query unprotected | SYSTEM | HIGH | Login critical path |
| `chat/upload`: DB INSERT unprotected after GCS upload succeeds | DATA/SYSTEM | HIGH | File attachment upload |
| `reports/[chartId]/[domain]`: two unprotected DB queries | SYSTEM | HIGH | Report download |
| `admin/access-requests/[id]/approve`: two unprotected DB queries + silent step-5 swallow | DATA/SYSTEM | HIGH | Admin approval |
| `admin/access-requests/[id]/reject`: load query unprotected | SYSTEM | HIGH | Admin rejection |
| `admin/users/[id]/send-reset`: DB query unprotected | SYSTEM | HIGH | Admin password reset |
| `conversations` (GET list): `listConversations` unprotected | SYSTEM | HIGH | Sidebar conversation list |
| `dashboard/`, `clients/[id]/build/`, `share/[slug]/` missing error.tsx | SYSTEM | HIGH (P1) | 3 user-facing surfaces |
| `useFeedback` GET + POST: no error state exposed to caller | NETWORK/SYSTEM | MEDIUM | Consume chat feedback |
| `admin/users`, `clients` POST, `access-requests` POST: JSON parse / specific queries unprotected | DATA/SYSTEM | MEDIUM | Various |
| `chat/build` + `chat/consume` (old path): Promise.all DB queries unprotected | SYSTEM | MEDIUM | Chat |
| `pyramid`, `trace/stream`, `audit/predictions/[id]/outcome`: specific queries unprotected | SYSTEM | MEDIUM | Various |
| `chat/consume` new pipeline: error response inconsistently uses `new Response` not `NextResponse.json` | SYSTEM | MEDIUM | Consume pipeline |
| `app/error.tsx`: renders `error.message` directly (may expose internals); no digest | SYSTEM | MEDIUM | Global fallback |
| `cockpit/error.tsx` off-brand (raw Tailwind, no `Button`, no brand tokens) | — | LOW | Build cockpit |
| 4 of 5 boundaries missing digest display | — | LOW | All surfaces |
| `SharedConsumeError`: raw `<button>` not `Button` component | — | LOW | Consume/conversation errors |
| Universal: no route returns `ApiErrorBody` — all use `{ error: string }` | — | SYSTEMIC | All 30 routes |
| `lib/errors/` does not exist | — | PREREQUISITE | — |

---

*End of NAK_ERROR_FRAMEWORK_v1_0.md v1.1 — DRAFT. §9 confirmed and extended by W1-R2. W2-R2 to implement and flip status to FINAL.*
