---
artifact: NAK_EXEC_BRIEF_W0_FOUNDATION
version: 1.0
status: AUTHORED
authored_by: Cowork (Opus)
authored_at: 2026-04-30
project: NAK — Nakula
wave_run: W0 (gate)
title: Foundation — Baseline Audit and Framework Drafting
scope: platform/src/** (read-only audit) + 00_NAK/** (governance docs)
target_executor: Claude Code (CLI), Sonnet 4.6
session_class: NAK Gate Phase — read + document, no code changes
---

# NAK W0 — Foundation Exec Brief

## §1 — Purpose of W0

W0 is the **gate phase** for Project NAK. Nothing in W1 starts until W0 closes. W0 does two things:

1. **Produces the baseline.** Audits the current state of `platform/src/` across three axes: design system token usage, error handling patterns, and component inventory. This baseline is the input that shapes the W1 audit briefs.
2. **Authors the W1 briefs.** Using findings from the baseline audit, produces exec briefs and CLAUDECODE_BRIEFS for all three W1 runs (R1 Design Audit, R2 Error Audit, R3 Component Audit).

W0 makes **zero code changes**. It reads and documents. The only files it writes are inside `00_NAK/`.

## §2 — Scope

```yaml
may_touch:
  - platform/src/**               # READ ONLY — no edits, no new files
  - 00_NAK/**                     # governance docs authored here
  - NAK_EXEC_BRIEF_W1_*.md        # W1 briefs authored at W0 close
  - NAK_CLAUDECODE_BRIEF_W1_*.md  # W1 brief pool files

must_not_touch:
  - platform/src/**/*.tsx         # ZERO code changes in W0
  - platform/src/**/*.ts          # ZERO code changes in W0
  - 00_ARCHITECTURE/**
  - 01_FACTS_LAYER/**
  - 025_HOLISTIC_SYNTHESIS/**
  - CLAUDECODE_BRIEF.md           # KARN's brief — do not touch
  - CLAUDECODE_BRIEF_*.md         # KARN's brief pool — do not touch
```

## §3 — Acceptance criteria (all must be met to claim W0 close)

### AC-1: Baseline audit report committed

File: `00_NAK/reports/NAK_BASELINE_AUDIT_REPORT_W0_v1_0.md`

The report covers:

**Part A — Design system token audit**
- Walk every file in `platform/src/components/` and `platform/src/app/globals.css`.
- For each component, record: (a) does it use CSS variables from globals.css, or hard-coded colour values? (b) does it use Tailwind utility classes that conflict with the oklch brand palette? (c) does it use spacing values outside the standard scale?
- Produce a table: `component | token_compliance: ✅ / ⚠️ / ❌ | notes`.

**Part B — Error handling pattern audit**
- Walk every file in `platform/src/app/api/` (all route handlers).
- For each route: (a) what error shape does it return on failure? (b) does it handle all error cases or let them propagate as 500s? (c) is the status code correct?
- Walk every `platform/src/hooks/*.ts` file. For each hook: (a) are all async operations wrapped in try/catch or handled via onError? (b) does it expose error state to the caller?
- Walk `platform/src/app/**/error.tsx` files. Inventory which surfaces have an error boundary and which don't.
- Produce a findings list: `[route/hook] | error_shape | handles_all_cases: ✅/❌ | boundary_present: ✅/❌ | notes`.

**Part C — Component inventory**
- List every component under `platform/src/components/` with: name, surface(s) it appears on, import count (how many places it's used), a one-line description of its job.
- Flag any component that appears to be: unused (0 imports), duplicate (same job as another component), or misused (used in a way that conflicts with its documented purpose).
- Produce a table: `component | surfaces | import_count | status: active/unused/duplicate/suspect`.

**Part D — Test baseline snapshot**
- Run `npm test` in `platform/`. Record the pass/fail counts and any pre-existing failures.
- This snapshot is the W0 baseline — W2 and W3 must not introduce new failures.

### AC-2: Design system draft committed

File: `00_NAK/NAK_DESIGN_SYSTEM_v1_0.md` (status: DRAFT)

The draft documents what exists today in `globals.css` and `tailwind.config.ts`:
- All CSS custom properties (`--background`, `--brand-gold`, etc.) with their values and semantic meaning.
- The two typographic scales (Source Serif 4 headings, Inter UI, Geist Mono code) with size/weight/line-height values.
- The three theme zones (vellum-light, ink-dark, gold-bridge) with their token mappings.
- The shadcn/ui component set in use, and the variants that are used vs. unused.
- A "findings" section: deviations spotted in Part A above, ranked by severity.

This is a draft — it describes current state including its problems. W1-R1 and W2-R1 will complete and fix it.

### AC-3: Error framework draft committed

File: `00_NAK/NAK_ERROR_FRAMEWORK_v1_0.md` (status: DRAFT)

The draft defines the target state (not the current state):
- **Canonical API error envelope:** `{ error: { code: string, message: string, detail?: string, retry?: boolean } }` (or a variant — define the shape to adopt).
- **Four failure modes:** `NETWORK` (fetch failed), `AUTH` (401/403), `DATA` (422/400 — bad input or missing corpus), `SYSTEM` (500 — unexpected server error).
- **User-facing messages per failure mode:** written in layman English, one sentence each.
- **Three display patterns:** `TOAST` (transient, non-blocking), `INLINE` (inside the form or panel that failed), `BOUNDARY` (full-page `error.tsx` replacement).
- **Decision matrix:** failure mode × severity → which display pattern to use.
- **Retry strategy:** which failure modes are retriable, with backoff guidance.

This is prescriptive (what NAK will implement) — it may be revised at W1-R2 close if the audit reveals constraints.

### AC-4: W1 exec briefs authored and committed

Three exec briefs at project root:
- `NAK_EXEC_BRIEF_W1_R1_DESIGN_v1_0.md` — shaped by Part A findings above.
- `NAK_EXEC_BRIEF_W1_R2_ERROR_v1_0.md` — shaped by Part B findings above.
- `NAK_EXEC_BRIEF_W1_R3_COMPONENT_v1_0.md` — shaped by Part C findings above.

Each brief must include: scope (may_touch / must_not_touch), acceptance criteria, specific files to audit (the most important ones identified in W0), output files to produce.

### AC-5: W1 brief pool files authored and committed

Three CLAUDECODE_BRIEF files at project root:
- `NAK_CLAUDECODE_BRIEF_W1_R1.md` (status: ACTIVE, wave_run: W1-R1)
- `NAK_CLAUDECODE_BRIEF_W1_R2.md` (status: ACTIVE, wave_run: W1-R2)
- `NAK_CLAUDECODE_BRIEF_W1_R3.md` (status: ACTIVE, wave_run: W1-R3)

Each brief follows the CLAUDECODE_BRIEF template in `00_NAK/NAK_SOP_v1_0.md §C.2`.

### AC-6: Tracker updated

`00_NAK/NAK_TRACKER_v1_0.md` §2 state block updated:
- `w0_closed: true`
- `w1_r1_brief_authored: true`
- `w1_r2_brief_authored: true`
- `w1_r3_brief_authored: true`
- `active_wave: W1`
- `last_session_id: {session_id}`
- `last_close_at: {date}`

§3 W0 row: `status: closed`, `session_id` set, `closed_at` set.

### AC-7: NAK_CLAUDECODE_BRIEF.md flipped to COMPLETE

`NAK_CLAUDECODE_BRIEF.md` at project root (in the W0 worktree) must show `status: COMPLETE` at session close.

## §4 — Suggested work sequence

1. Read `NAK_CLAUDECODE_BRIEF.md` + this brief.
2. Run Part D first: `cd platform && npm test` — snapshot the baseline. Commit the output to the report file.
3. Run Part A: walk `globals.css` then components. Build the token compliance table progressively.
4. Run Part B: walk `platform/src/app/api/` — there are ~20 route files, scan each for error handling.
5. Run Part C: walk `platform/src/components/` — build the component inventory table.
6. Draft `NAK_DESIGN_SYSTEM_v1_0.md` from Part A + globals.css.
7. Draft `NAK_ERROR_FRAMEWORK_v1_0.md` using the target error shapes you define.
8. Author the three W1 exec briefs using W0's findings as input.
9. Author the three W1 CLAUDECODE_BRIEF pool files.
10. Update `NAK_TRACKER_v1_0.md`. Flip `NAK_CLAUDECODE_BRIEF.md` to COMPLETE. Commit.

## §5 — Important constraints

- **No code changes.** If you spot a fix while auditing, write it in the findings report — do not fix it in W0.
- **No scope creep into corpus files.** If you encounter an import that references a corpus layer file, note it as a finding. Do not follow the import into the corpus layer.
- **Completeness over depth.** It is better to have a shallow entry for every component than a deep dive on five components and gaps on the rest.
- **Plain-language findings.** Findings in the report should be understandable by a non-engineer reviewing the work.

---

*End of NAK_EXEC_BRIEF_W0_FOUNDATION_v1_0.md*
