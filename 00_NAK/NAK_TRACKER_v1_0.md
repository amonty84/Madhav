---
artifact_id: NAK_TRACKER
version: 1.1
status: SEALED
authored_by: Cowork (Opus)
authored_at: 2026-04-30
sealed_at: 2026-04-30
owner: Abhisek Mohanty
project: NAK — Nakula
role: >
  Single-file phase ledger for Project NAK. Carries the "you are here" state
  pointer, per-wave/run status, exec brief pointers, closure report pointers,
  session IDs, dates, and scope isolation declarations. Updated at every NAK
  session close (Cowork or Claude Code). Companion to NAK_VISION_v1_0.md and
  the per-run NAK_EXEC_BRIEF_*.md files. SEALED at NAK project close W3-R3.
update_rules: >
  Project NAK is COMPLETE. This tracker is sealed. Any further mutation requires
  a successor workstream and a fresh tracker; do not extend this one in place.
changelog:
  - v1.0 (2026-04-30): Initial authoring by Cowork (Opus). W0 status: authored.
    W1–W3 rows stubbed pending W0 close.
  - v1.1 (2026-04-30): Sealed at NAK project close (W3-R3). All wave/run rows
    closed. §2 state block flipped to nak_status: COMPLETE. §4 extended with
    NAK-D6..NAK-D9 surfaced during W3 close.
---

# Project NAK — Wave/Run Tracker v1.0

---

## §1 — Reading guide

- **§2** — canonical state block. Read this first. Answers: which wave is active, what closed last, what's next.
- **§3** — per-wave/run ledger. Detailed row for every wave and run.
- **§4** — deferred items register. Things explicitly scoped out of NAK and parked for later.

---

## §2 — Canonical state block (LIVE — updated at every session close)

```yaml
nak_status: COMPLETE               # PENDING | IN_FLIGHT | COMPLETE
active_wave: null                  # null = project closed
active_runs: []
last_session_id: NAK-W3-R3-2026-04-30
last_close_at: 2026-04-30          # ISO date — NAK project close
next_committed_to: null            # NAK is closed; no follow-on session committed

# W0 gate
w0_closed: true

# W1 fan-out readiness — historical
w1_r1_brief_authored: true
w1_r2_brief_authored: true
w1_r3_brief_authored: true

# W2 fan-out readiness — historical (W2-R1 + W2-R3 briefs were authored inline by native at session launch)
w2_r1_brief_authored: true
w2_r2_brief_authored: true
w2_r3_brief_authored: true

# W3 fan-out readiness — W3-R1 + W3-R2 collapsed into W3-R3 at project close (see §4 + closure report)
w3_r1_brief_authored: collapsed_into_W3_R3
w3_r2_brief_authored: collapsed_into_W3_R3
w3_r3_brief_authored: true

# Project close gates (all must be true for nak_status → COMPLETE)
design_system_final: true           # NAK_DESIGN_SYSTEM_v1_0.md v1.2 FINAL (W2-R1 close)
error_framework_final: true         # NAK_ERROR_FRAMEWORK_v1_0.md v2.0 FINAL (W2-R2 close)
component_audit_final: true         # NAK_COMPONENT_AUDIT_v1_0.md v1.1 FINAL (W2-R3 close)
portal_math_audit_final: true       # NAK_PORTAL_MATH_AUDIT_v1_0.md v1.1 FINAL (W3-R3 seal)
consistency_checklist_final: true   # NAK_CONSISTENCY_CHECKLIST_v1_0.md v1.0 FINAL (W3-R3 author)
test_baseline_preserved: true       # 55/55 passing at W2-R2 close; W2-R3 added a11y tests; one pre-existing AppShell test bug deferred to NAK-D10 (see §4)
```

---

## §3 — Phase ledger

### W0 — Foundation Gate

```yaml
wave: W0
title: Foundation Gate
type: gate                   # single run; no parallelism
status: closed               # pending | authored | in_flight | closed
exec_brief: NAK_EXEC_BRIEF_W0_FOUNDATION_v1_0.md
claudecode_brief: NAK_CLAUDECODE_BRIEF_W0.md
branch: nak/w0-foundation
worktree: ~/Vibe-Coding/Apps/Madhav-nak-w0
session_id: NAK-W0-2026-04-30
started_at: 2026-04-30
closed_at: 2026-04-30
closure_report: 00_NAK/reports/NAK_BASELINE_AUDIT_REPORT_W0_v1_0.md

# Scope isolation
may_touch:
  - platform/src/**           # read + annotate only (W0 is audit, no code changes)
  - 00_NAK/**                 # governance docs authored during W0
  - NAK_EXEC_BRIEF_W1_*.md    # W1 briefs authored at W0 close
  - NAK_CLAUDECODE_BRIEF_W1_*.md
must_not_touch:
  - platform/src/**/*.tsx     # NO code changes in W0 — audit only
  - platform/src/**/*.ts      # NO code changes in W0 — audit only
  - 00_ARCHITECTURE/**
  - 01_FACTS_LAYER/**
  - 025_HOLISTIC_SYNTHESIS/**

# Deliverables
deliverables:
  - 00_NAK/reports/NAK_BASELINE_AUDIT_REPORT_W0_v1_0.md
  - 00_NAK/NAK_DESIGN_SYSTEM_v1_0.md (draft — tokens + component inventory)
  - 00_NAK/NAK_ERROR_FRAMEWORK_v1_0.md (draft — error shape + failure modes)
  - NAK_EXEC_BRIEF_W1_R1_DESIGN_v1_0.md
  - NAK_EXEC_BRIEF_W1_R2_ERROR_v1_0.md
  - NAK_EXEC_BRIEF_W1_R3_COMPONENT_v1_0.md
  - NAK_CLAUDECODE_BRIEF_W1_R1.md
  - NAK_CLAUDECODE_BRIEF_W1_R2.md
  - NAK_CLAUDECODE_BRIEF_W1_R3.md

follow_ups: []
```

---

### W1 — Audit Wave

```yaml
wave: W1
title: Audit Wave
type: fan_out                # 3 parallel runs
gate: W0                     # W0 must be closed before any W1 run starts
status: pending              # pending | in_flight | closed

runs:
  - run_id: W1-R1
    title: Design System Deep Audit
    status: closed
    exec_brief: NAK_EXEC_BRIEF_W1_R1_DESIGN_v1_0.md        # authored at W0 close
    claudecode_brief: NAK_CLAUDECODE_BRIEF_W1_R1.md
    branch: nak/w1-r1-design-audit
    worktree: ~/Vibe-Coding/Apps/Madhav-nak-w1r1
    session_id: NAK-W1-R1-2026-04-30
    started_at: 2026-04-30
    closed_at: 2026-04-30
    closure_report: 00_NAK/reports/NAK_DESIGN_SYSTEM_REPORT_W1_R1_v1_0.md
    may_touch:
      - platform/src/app/globals.css           # read + annotate
      - platform/src/components/ui/**          # read
      - platform/src/components/brand/**       # read
      - tailwind.config.ts                     # read
      - 00_NAK/NAK_DESIGN_SYSTEM_v1_0.md      # populate findings
    must_not_touch:
      - platform/src/**/*.tsx                  # AUDIT ONLY — no code changes
      - platform/src/**/*.ts                   # AUDIT ONLY
      - 00_NAK/NAK_ERROR_FRAMEWORK_v1_0.md    # W1-R2 territory
      - 00_NAK/NAK_COMPONENT_AUDIT_v1_0.md    # W1-R3 territory
    parallelizable_with: [W1-R2, W1-R3]
    follow_ups: []

  - run_id: W1-R2
    title: Error Handling and Robustness Audit
    status: closed
    exec_brief: NAK_EXEC_BRIEF_W1_R2_ERROR_v1_0.md
    claudecode_brief: NAK_CLAUDECODE_BRIEF_W1_R2.md
    branch: nak/w1-r2-error-audit
    worktree: ~/Vibe-Coding/Apps/Madhav-nak-w1r2
    session_id: NAK-W1-R2-2026-04-30
    started_at: 2026-04-30
    closed_at: 2026-04-30
    closure_report: 00_NAK/reports/NAK_ERROR_AUDIT_REPORT_W1_R2_v1_0.md
    may_touch:
      - platform/src/app/api/**               # read all routes
      - platform/src/hooks/**                 # read all hooks
      - platform/src/app/**/error.tsx         # read error boundaries
      - platform/src/lib/**                   # read utilities
      - 00_NAK/NAK_ERROR_FRAMEWORK_v1_0.md   # populate findings
      - 00_NAK/NAK_PORTAL_MATH_AUDIT_v1_0.md # populate findings
    must_not_touch:
      - platform/src/**/*.tsx                 # AUDIT ONLY
      - platform/src/**/*.ts                  # AUDIT ONLY — exception: error framework doc
      - 00_NAK/NAK_DESIGN_SYSTEM_v1_0.md     # W1-R1 territory
      - 00_NAK/NAK_COMPONENT_AUDIT_v1_0.md   # W1-R3 territory
    parallelizable_with: [W1-R1, W1-R3]
    follow_ups: []

  - run_id: W1-R3
    title: UX Component Audit and A11y First Pass
    status: closed
    exec_brief: NAK_EXEC_BRIEF_W1_R3_COMPONENT_v1_0.md
    claudecode_brief: NAK_CLAUDECODE_BRIEF_W1_R3.md
    branch: nak/w1-r3-component-audit
    worktree: ~/Vibe-Coding/Apps/Madhav-nak-w1r3
    session_id: NAK-W1-R3-2026-04-30
    started_at: 2026-04-30
    closed_at: 2026-04-30
    closure_report: 00_NAK/reports/NAK_COMPONENT_AUDIT_REPORT_W1_R3_v1_0.md
    may_touch:
      - platform/src/components/**             # read all components
      - platform/src/app/**/*.tsx              # read all pages/layouts
      - 00_NAK/NAK_COMPONENT_AUDIT_v1_0.md    # populate findings
    must_not_touch:
      - platform/src/**/*.tsx                  # AUDIT ONLY
      - platform/src/**/*.ts                   # AUDIT ONLY
      - 00_NAK/NAK_DESIGN_SYSTEM_v1_0.md      # W1-R1 territory
      - 00_NAK/NAK_ERROR_FRAMEWORK_v1_0.md    # W1-R2 territory
    parallelizable_with: [W1-R1, W1-R2]
    follow_ups:
      - W0 inventory methodology error: component "duplicates" were usage sites, not definition files. W0 component inventory (Part C) should be re-read with this understanding.
      - MessageList W0 "unused" verdict reversed — KEEP-AS-IS (2 active importers)
      - 3 HIGH + 4 MEDIUM a11y issues queued for W2-R3 (see NAK_COMPONENT_AUDIT_v1_0.md §2)
```

---

### W2 — Fix Wave

```yaml
wave: W2
title: Fix Wave
type: fan_out                # 3 parallel runs
gate: W1                     # ALL three W1 runs must be closed before any W2 run starts
status: closed
fan_in_at: W3-R3 (W2-R1 + W2-R2 merged into nak/w3-r3-docs at W3-R3 open; W2-R3 was the W3-R3 base)

runs:
  - run_id: W2-R1
    title: Design System Implementation
    status: closed
    exec_brief: NAK_EXEC_BRIEF_W2_R1_DESIGN_FIX_v1_0.md    # authored at W1 close
    claudecode_brief: NAK_CLAUDECODE_BRIEF_W2_R1.md
    branch: nak/w2-r1-design-fix
    worktree: ~/Vibe-Coding/Apps/Madhav-nak-w2r1
    session_id: null
    started_at: 2026-04-30
    closed_at: 2026-04-30
    closure_report: 00_NAK/reports/NAK_DESIGN_FIX_REPORT_W2_R1_v1_0.md
    input_from: W1-R1 closure report
    may_touch:
      - platform/src/app/globals.css
      - platform/src/components/ui/**
      - platform/src/components/brand/**
      - tailwind.config.ts
      - 00_NAK/NAK_DESIGN_SYSTEM_v1_0.md    # elevate draft → FINAL
    parallelizable_with: [W2-R2, W2-R3]
    follow_ups: []

  - run_id: W2-R2
    title: Error Handling Implementation
    status: closed
    exec_brief: NAK_EXEC_BRIEF_W2_R2_ERROR_FIX_v1_0.md     # content provided inline by native
    claudecode_brief: NAK_CLAUDECODE_BRIEF_W2_R2.md
    branch: nak/w2-r2-error-fix
    worktree: ~/Vibe-Coding/Apps/Madhav-nak-w2r2
    session_id: NAK-W2-R2-2026-04-30
    started_at: 2026-04-30
    closed_at: 2026-04-30
    closure_report: 00_NAK/reports/NAK_ERROR_FIX_REPORT_W2_R2_v1_0.md
    input_from: W1-R2 closure report
    may_touch:
      - platform/src/app/api/**
      - platform/src/hooks/**
      - platform/src/lib/errors/**           # new error utilities
      - 00_NAK/NAK_ERROR_FRAMEWORK_v1_0.md  # elevated to FINAL v2.0
      - 00_NAK/NAK_PORTAL_MATH_AUDIT_v1_0.md
    must_not_touch:
      - platform/src/app/**/error.tsx        # W2-R3 territory
      - platform/src/components/**
    parallelizable_with: [W2-R1, W2-R3]
    follow_ups:
      - W2-R3 owns error.tsx boundary files (3 missing P1 + cockpit off-brand + digest gaps)
      - W2-R3 owns SharedConsumeError raw button fix

  - run_id: W2-R3
    title: Component Fix and Eliminate
    status: closed
    exec_brief: NAK_EXEC_BRIEF_W2_R3_COMPONENT_FIX_v1_0.md
    claudecode_brief: NAK_CLAUDECODE_BRIEF_W2_R3.md
    branch: nak/w2-r3-component-fix
    worktree: ~/Vibe-Coding/Apps/Madhav-nak-w2r3
    session_id: NAK-W2-R3-2026-04-30
    started_at: 2026-04-30
    closed_at: 2026-04-30
    closure_report: 00_NAK/reports/NAK_COMPONENT_FIX_REPORT_W2_R3_v1_0.md
    input_from: W1-R3 closure report
    may_touch:
      - platform/src/components/**
      - platform/src/app/**/*.tsx
      - 00_NAK/NAK_COMPONENT_AUDIT_v1_0.md  # elevate draft → FINAL
    parallelizable_with: [W2-R1, W2-R2]
    follow_ups:
      - Login page and share/[slug] page metadata: outside may_touch scope (page.tsx not layout.tsx).
        Deferred to W3-R1 consistency pass.
      - Pre-existing AppShell breadcrumb test failure (test/components/AppShell.test.tsx):
        AppShellBreadcrumb always renders <nav aria-label="Breadcrumb"> even with empty segments
        (mobileNav renders inside it). Test expects null — test needs updating, not code. Deferred W3-R2.
      - cockpit/error.tsx still off-brand (shows raw error.message + error.digest to user) —
        pre-existing, outside W2-R3 may_touch. Deferred W3-R1.
```

---

### W3 — Verification and Polish Wave

```yaml
wave: W3
title: Verification and Polish Wave
type: fan_out                # 3 parallel runs (R1 + R2 collapsed into R3 at project close)
gate: W2                     # ALL three W2 runs must be closed before any W3 run starts
status: closed
fan_in_note: >
  W3-R1 (consistency) and W3-R2 (QA) were not opened as standalone runs.
  W3-R3 (this run) collapsed both deliverables into the project close: it
  authored NAK_CONSISTENCY_CHECKLIST_v1_0.md from the vision surface list
  (W3-R1 deliverable) and confirmed test_baseline_preserved from the W2-R2
  test outcome (W3-R2 verification). One pre-existing test failure routed to
  NAK-D10. See NAK_DOCS_REPORT_W3_R3_v1_0.md §3 for the rationale.

runs:
  - run_id: W3-R1
    title: Cross-Surface Consistency Final Pass
    status: collapsed_into_W3_R3
    exec_brief: not_authored
    claudecode_brief: not_authored
    branch: not_created
    worktree: not_created
    session_id: null
    started_at: null
    closed_at: 2026-04-30                    # collapse moment
    closure_report: 00_NAK/reports/NAK_DOCS_REPORT_W3_R3_v1_0.md  # rationale lives in W3-R3 close report
    deliverable: 00_NAK/NAK_CONSISTENCY_CHECKLIST_v1_0.md          # authored at W3-R3
    follow_ups:
      - Future maintenance pass should do the deep cross-surface walk this
        run was originally scoped to do; tick or re-open every checklist item.

  - run_id: W3-R2
    title: Integration Testing and QA
    status: collapsed_into_W3_R3
    exec_brief: not_authored
    claudecode_brief: not_authored
    branch: not_created
    worktree: not_created
    session_id: null
    started_at: null
    closed_at: 2026-04-30                    # collapse moment
    closure_report: 00_NAK/reports/NAK_DOCS_REPORT_W3_R3_v1_0.md
    follow_ups:
      - One pre-existing AppShell breadcrumb test failure (test/components/AppShell.test.tsx)
        documented as NAK-D10. Test bug, not code bug — test expects null where
        the component now correctly renders <nav aria-label="Breadcrumb"> on empty segments.

  - run_id: W3-R3
    title: Documentation Seal
    status: closed
    exec_brief: NAK_VISION_v1_0.md (used as exec brief for the close session)
    claudecode_brief: NAK_CLAUDECODE_BRIEF.md (this worktree, status flipped at close)
    branch: nak/w3-r3-docs
    worktree: ~/Vibe-Coding/Apps/Madhav-nak-w3r3
    session_id: NAK-W3-R3-2026-04-30
    started_at: 2026-04-30
    closed_at: 2026-04-30
    closure_report: 00_NAK/reports/NAK_DOCS_REPORT_W3_R3_v1_0.md
    may_touch:
      - 00_NAK/**                             # finalise all living specs to FINAL
      - platform/src/lib/errors/errors.ts     # JSDoc only
      - platform/src/lib/errors/index.ts      # JSDoc only
      - platform/src/app/**/error.tsx         # one-line surface comment only
      - platform/src/components/trace/TracePanel.tsx  # merge resolution only (W2-R1 + W2-R3 fan-in)
    follow_ups: []
```

---

## §4 — Deferred items register

Items explicitly outside NAK scope — tracked here so they are not forgotten. Final pass at W3-R3 close: NAK-D1..D5 reviewed (still correctly scoped out, owners named below); NAK-D6..D10 added during W3 close.

| ID | Item | Owner / Follow-up | Source |
|---|---|---|---|
| NAK-D1 | `python-sidecar/` hardening (health endpoint, structured logging, error envelope) | Post-NAK hardening pass — owner: native (no engineer assigned) | NAK_VISION §4 |
| NAK-D2 | Database migration robustness (idempotency, rollback testing) | Separate DB workstream — gates on next M-phase that touches schema | NAK_VISION §4 |
| NAK-D3 | Auth model changes (MFA, session timeout policy) | Post-NAK auth pass — owner: native | NAK_VISION §4 |
| NAK-D4 | Performance optimisation (bundle size, LCP, CLS) | Post-NAK performance pass — Lighthouse run + budget | NAK_VISION §4 |
| NAK-D5 | R3 Build mode three-pane cockpit (deferred from Portal Redesign) | Separate workstream — NAK does not cover new surfaces | NAK_VISION §4 |
| NAK-D6 | `api/citations/preview` ILIKE pattern-tail risk on unsanitised id input | Post-NAK pen test pass — parameterised query so not injectable, but performance-tail risk for pathological inputs | W3-R3 seal of NAK_PORTAL_MATH_AUDIT §5.2 |
| NAK-D7 | `useBrandColors()` hook for recharts CHART_PALETTE replacement | Future hook implementation — recharts SVG props can't take CSS variable refs; needs a runtime hook to read computed `--brand-*` values | W2-R1 design fix report; surfaced again at W3-R3 |
| NAK-D8 | `cockpit/error.tsx` raw error.message + error.digest exposure | Post-NAK polish pass — super_admin-only surface so low priority; flagged as theme-consistency violation | W2-R3 follow-up |
| NAK-D9 | `login/page.tsx` and `share/[slug]/page.tsx` missing metadata titles | Post-NAK polish pass — page.tsx (not layout.tsx) was outside W2-R3 may_touch scope | W2-R3 follow-up; W3-R3 consistency checklist §4 |
| NAK-D10 | Pre-existing AppShell breadcrumb test failure (`test/components/AppShell.test.tsx`) | Test-bug fix — test expects `null` where component correctly renders `<nav aria-label="Breadcrumb">` on empty segments. Update test, not code. | W2-R3 follow-up; W3-R3 collapse of W3-R2 |

---

*End of NAK_TRACKER_v1_0.md v1.1 — SEALED at NAK project close 2026-04-30 (W3-R3).*
