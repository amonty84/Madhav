---
artifact: NAK_EXEC_BRIEF_W1_R2_ERROR
version: 1.0
status: AUTHORED
authored_by: Claude Code (NAK W0 session) 2026-04-30
project: NAK — Nakula
wave_run: W1-R2
title: Error Handling and Robustness Audit
scope: platform/src/app/api/**, platform/src/hooks/**, platform/src/app/**/error.tsx, platform/src/lib/** (read-only)
parallelizable_with: [W1-R1, W1-R3]
gate: W0 (must be closed before W1-R2 starts)
input_from: NAK_BASELINE_AUDIT_REPORT_W0_v1_0.md Part B + NAK_ERROR_FRAMEWORK_v1_0.md §9
---

# NAK W1-R2 — Error Handling and Robustness Audit Exec Brief

## §1 — Purpose

W0 produced a high-level error handling survey: 26 routes assessed (many partially), 9 hooks assessed, 2 confirmed error boundaries. W1-R2 reads every route file and every hook file in full, maps the current error model precisely against the target in `NAK_ERROR_FRAMEWORK_v1_0.md`, and produces a gap register that W2-R2 can execute against.

W1-R2 also confirms or creates the `NAK_PORTAL_MATH_AUDIT_v1_0.md` skeleton — the portal math surface (request flows, response shapes, status code usage) as an input to robustness fixes.

W1-R2 makes **zero code changes**. It reads and documents.

## §2 — Scope

```yaml
may_touch:
  - platform/src/app/api/**               # read every route.ts
  - platform/src/hooks/**                 # read every hook file
  - platform/src/app/**/error.tsx         # read every error boundary
  - platform/src/lib/**                   # read utilities (especially lib/errors/, lib/db/)
  - 00_NAK/NAK_ERROR_FRAMEWORK_v1_0.md   # populate §9 + revise §2–§7 if constraints found
  - 00_NAK/NAK_PORTAL_MATH_AUDIT_v1_0.md # create if not present; populate with request flow map

must_not_touch:
  - platform/src/**/*.tsx                 # AUDIT ONLY
  - platform/src/**/*.ts                  # AUDIT ONLY — including route.ts files
  - 00_NAK/NAK_DESIGN_SYSTEM_v1_0.md     # W1-R1 territory
  - 00_NAK/NAK_COMPONENT_AUDIT_v1_0.md   # W1-R3 territory
  - 00_ARCHITECTURE/**
```

## §3 — Acceptance Criteria

### AC-1: Error audit report committed

File: `00_NAK/reports/NAK_ERROR_AUDIT_REPORT_W1_R2_v1_0.md`

The report must contain:

**Part A — Route error inventory (complete)**

Read every `route.ts` under `platform/src/app/api/`. For each:

```
route | method(s) | current_error_shape | has_try_catch | status_codes | missing_cases | gap_severity
```

Gap severity: HIGH (missing try-catch on a user-facing route), MEDIUM (incomplete status codes), LOW (minor inconsistency).

Specifically verify the 7 admin routes flagged as ❌ in W0 — read each file in full and confirm/correct the W0 assessment.

**Part B — Hook error inventory (complete)**

Read every `.ts` file in `platform/src/hooks/`. For each:

```
hook | async_ops | has_try_catch | exposes_error_state | silent_failure_risk | gap
```

Pay close attention to:
- `useFeedback.ts` — confirm the `.catch(() => {})` silent fail and identify the exact fetch call
- `useTraceStream.ts` — confirm whether SSE errors are surfaced to the caller
- `useChatSession.ts` — confirm whether `onFinish` silently swallows errors

**Part C — Error boundary inventory (complete)**

Run: `find platform/src/app -name "error.tsx"` to get the definitive list.

For each found file:
- What does it render?
- Does it use design tokens / the `Button` component?
- Does it display the error digest?

For each route segment in `platform/src/app/` that does NOT have an `error.tsx`, flag it with the priority from `NAK_ERROR_FRAMEWORK_v1_0.md §8`.

**Part D — lib/errors/ inventory**

Check if `platform/src/lib/errors/` exists. If it does, document what's there. If it doesn't, note that W2-R2 needs to create it (as specified in `NAK_ERROR_FRAMEWORK_v1_0.md §2`).

### AC-2: NAK_ERROR_FRAMEWORK_v1_0.md §9 updated

The W0 gap list (7 entries) must be confirmed, corrected, and extended with any new gaps found. If any constraint discovered during the audit requires revising the framework's prescriptive sections (§2–§7), revise them with a note explaining why.

### AC-3: NAK_PORTAL_MATH_AUDIT skeleton committed

File: `00_NAK/NAK_PORTAL_MATH_AUDIT_v1_0.md` (create if absent)

Minimum content:
- A table of every route with: HTTP method, authentication requirement, input validation approach, output shape, error shape
- A note on which routes are missing input validation entirely

### AC-4: W1-R2 closure row in NAK_TRACKER updated

`00_NAK/NAK_TRACKER_v1_0.md` §3 W1-R2 row:
- `status: closed`, `session_id`, `closed_at` set

## §4 — Suggested Work Sequence

1. Read `NAK_ERROR_FRAMEWORK_v1_0.md` in full — this is your reference for what "correct" looks like.
2. Run `find platform/src/app -name "error.tsx"` to get the confirmed boundary list first.
3. Sweep all admin routes (the W0 ❌ cluster). Read each file fully.
4. Sweep the remaining API routes in order: auth → chat → clients → conversations → audit → citations → lel → pyramid → compute → trace → reports.
5. Read all 9 hooks in full.
6. Check `platform/src/lib/` for any existing error utilities.
7. Write the closure report. Update `NAK_ERROR_FRAMEWORK_v1_0.md §9`. Author or populate `NAK_PORTAL_MATH_AUDIT_v1_0.md`. Update tracker.

## §5 — High-Priority Routes to Read in Full

Based on W0 findings, these have the most significant gaps:

**Admin cluster (all ❌ in W0):**
- `platform/src/app/api/admin/users/route.ts`
- `platform/src/app/api/admin/users/[id]/route.ts`
- `platform/src/app/api/admin/access-requests/route.ts`
- `platform/src/app/api/admin/access-requests/[id]/approve/route.ts`
- `platform/src/app/api/admin/access-requests/[id]/reject/route.ts`

**Hooks (confirmed issues):**
- `platform/src/hooks/useFeedback.ts` — silent `.catch(() => {})`
- `platform/src/hooks/useTraceStream.ts` — SSE error surface unclear
- `platform/src/hooks/useChatSession.ts` — `onFinish` error swallowing

**Error boundaries (P0 gap):**
- `platform/src/app/clients/[id]/consume/` — confirm whether `error.tsx` exists

## §6 — Output Files

| File | Status at close |
|---|---|
| `00_NAK/reports/NAK_ERROR_AUDIT_REPORT_W1_R2_v1_0.md` | COMPLETE |
| `00_NAK/NAK_ERROR_FRAMEWORK_v1_0.md` | version bump to 1.1 with confirmed/revised §9 |
| `00_NAK/NAK_PORTAL_MATH_AUDIT_v1_0.md` | DRAFT skeleton created |

---

*End of NAK_EXEC_BRIEF_W1_R2_ERROR_v1_0.md*
