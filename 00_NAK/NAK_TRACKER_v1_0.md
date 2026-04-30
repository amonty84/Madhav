---
artifact_id: NAK_TRACKER
version: 1.0
status: LIVING
authored_by: Cowork (Opus)
authored_at: 2026-04-30
owner: Abhisek Mohanty
project: NAK — Nakula
role: >
  Single-file phase ledger for Project NAK. Carries the "you are here" state
  pointer, per-wave/run status, exec brief pointers, closure report pointers,
  session IDs, dates, and scope isolation declarations. Updated at every NAK
  session close (Cowork or Claude Code). Companion to NAK_VISION_v1_0.md and
  the per-run NAK_EXEC_BRIEF_*.md files.
update_rules: >
  Every NAK run-close updates: §2 canonical state block (active_wave,
  last_session_id, last_close_at, next_committed); §3 phase ledger row for
  the run that just closed (status→closed, session_id, closed_at, follow_ups).
  Every wave-close additionally updates: active_wave field; next wave rows'
  status from pending → authored once their exec briefs are committed.
changelog:
  - v1.0 (2026-04-30): Initial authoring by Cowork (Opus). W0 status: authored.
    W1–W3 rows stubbed pending W0 close.
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
nak_status: IN_FLIGHT              # PENDING | IN_FLIGHT | COMPLETE
active_wave: W2                    # W0 | W1 | W2 | W3 | null (at project close)
active_runs: []                    # W2-R1 and W2-R3 still pending; W2-R2 closed
last_session_id: NAK-W2-R2-2026-04-30
last_close_at: 2026-04-30          # ISO date
next_committed_to: W2-R1 (design fix) + W2-R3 (component fix) — pending W1-R1 + W1-R3 close

# W0 gate flag — W1 cannot open until this is true
w0_closed: true

# W1 fan-out readiness — all three flags must be true before W1 opens
w1_r1_brief_authored: true
w1_r2_brief_authored: true
w1_r3_brief_authored: true

# W2 fan-out readiness — all three flags must be true before W2 opens
w2_r1_brief_authored: false
w2_r2_brief_authored: true         # brief was authored inline by native at session launch
w2_r3_brief_authored: false

# W3 fan-out readiness
w3_r1_brief_authored: false
w3_r2_brief_authored: false
w3_r3_brief_authored: false

# Project close gates (all must be true for nak_status → COMPLETE)
design_system_final: false          # NAK_DESIGN_SYSTEM_v1_0.md status: FINAL
error_framework_final: true         # NAK_ERROR_FRAMEWORK_v1_0.md v2.0 → FINAL (W2-R2 close)
component_audit_final: false        # NAK_COMPONENT_AUDIT_v1_0.md status: FINAL
portal_math_audit_final: false      # NAK_PORTAL_MATH_AUDIT_v1_0.md status: FINAL
consistency_checklist_final: false  # NAK_CONSISTENCY_CHECKLIST_v1_0.md status: FINAL
test_baseline_preserved: false      # npm test passes at W3 close with no regressions
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
    status: pending
    exec_brief: NAK_EXEC_BRIEF_W1_R1_DESIGN_v1_0.md        # authored at W0 close
    claudecode_brief: NAK_CLAUDECODE_BRIEF_W1_R1.md
    branch: nak/w1-r1-design-audit
    worktree: ~/Vibe-Coding/Apps/Madhav-nak-w1r1
    session_id: null
    started_at: null
    closed_at: null
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
    status: pending
    exec_brief: NAK_EXEC_BRIEF_W1_R3_COMPONENT_v1_0.md
    claudecode_brief: NAK_CLAUDECODE_BRIEF_W1_R3.md
    branch: nak/w1-r3-component-audit
    worktree: ~/Vibe-Coding/Apps/Madhav-nak-w1r3
    session_id: null
    started_at: null
    closed_at: null
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
    follow_ups: []
```

---

### W2 — Fix Wave

```yaml
wave: W2
title: Fix Wave
type: fan_out                # 3 parallel runs
gate: W1                     # ALL three W1 runs must be closed before any W2 run starts
status: pending

runs:
  - run_id: W2-R1
    title: Design System Implementation
    status: pending
    exec_brief: NAK_EXEC_BRIEF_W2_R1_DESIGN_FIX_v1_0.md    # authored at W1 close
    claudecode_brief: NAK_CLAUDECODE_BRIEF_W2_R1.md
    branch: nak/w2-r1-design-fix
    worktree: ~/Vibe-Coding/Apps/Madhav-nak-w2r1
    session_id: null
    started_at: null
    closed_at: null
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
    status: pending
    exec_brief: NAK_EXEC_BRIEF_W2_R3_COMPONENT_FIX_v1_0.md
    claudecode_brief: NAK_CLAUDECODE_BRIEF_W2_R3.md
    branch: nak/w2-r3-component-fix
    worktree: ~/Vibe-Coding/Apps/Madhav-nak-w2r3
    session_id: null
    started_at: null
    closed_at: null
    closure_report: 00_NAK/reports/NAK_COMPONENT_FIX_REPORT_W2_R3_v1_0.md
    input_from: W1-R3 closure report
    may_touch:
      - platform/src/components/**
      - platform/src/app/**/*.tsx
      - 00_NAK/NAK_COMPONENT_AUDIT_v1_0.md  # elevate draft → FINAL
    parallelizable_with: [W2-R1, W2-R2]
    follow_ups: []
```

---

### W3 — Verification and Polish Wave

```yaml
wave: W3
title: Verification and Polish Wave
type: fan_out                # 3 parallel runs
gate: W2                     # ALL three W2 runs must be closed before any W3 run starts
status: pending

runs:
  - run_id: W3-R1
    title: Cross-Surface Consistency Final Pass
    status: pending
    exec_brief: NAK_EXEC_BRIEF_W3_R1_CONSISTENCY_v1_0.md   # authored at W2 close
    claudecode_brief: NAK_CLAUDECODE_BRIEF_W3_R1.md
    branch: nak/w3-r1-consistency
    worktree: ~/Vibe-Coding/Apps/Madhav-nak-w3r1
    session_id: null
    started_at: null
    closed_at: null
    closure_report: 00_NAK/reports/NAK_CONSISTENCY_REPORT_W3_R1_v1_0.md
    deliverable: 00_NAK/NAK_CONSISTENCY_CHECKLIST_v1_0.md
    may_touch:
      - platform/src/components/shared/**
      - platform/src/app/**/*.tsx            # layout/page consistency fixes only
      - 00_NAK/NAK_CONSISTENCY_CHECKLIST_v1_0.md
    parallelizable_with: [W3-R2, W3-R3]
    follow_ups: []

  - run_id: W3-R2
    title: Integration Testing and QA
    status: pending
    exec_brief: NAK_EXEC_BRIEF_W3_R2_QA_v1_0.md
    claudecode_brief: NAK_CLAUDECODE_BRIEF_W3_R2.md
    branch: nak/w3-r2-qa
    worktree: ~/Vibe-Coding/Apps/Madhav-nak-w3r2
    session_id: null
    started_at: null
    closed_at: null
    closure_report: 00_NAK/reports/NAK_QA_REPORT_W3_R2_v1_0.md
    may_touch:
      - platform/tests/**
      - platform/verification/**
      - platform/src/**/*.test.ts
    parallelizable_with: [W3-R1, W3-R3]
    follow_ups: []

  - run_id: W3-R3
    title: Documentation Seal
    status: pending
    exec_brief: NAK_EXEC_BRIEF_W3_R3_DOCS_v1_0.md
    claudecode_brief: NAK_CLAUDECODE_BRIEF_W3_R3.md
    branch: nak/w3-r3-docs
    worktree: ~/Vibe-Coding/Apps/Madhav-nak-w3r3
    session_id: null
    started_at: null
    closed_at: null
    closure_report: 00_NAK/reports/NAK_DOCS_REPORT_W3_R3_v1_0.md
    may_touch:
      - 00_NAK/**                             # finalise all living specs to FINAL
      - platform/src/components/**            # update any inline JSDoc/TSDoc
    parallelizable_with: [W3-R1, W3-R2]
    follow_ups: []
```

---

## §4 — Deferred items register

Items explicitly outside NAK scope — tracked here so they are not forgotten.

| ID | Item | Deferred to |
|---|---|---|
| NAK-D1 | `python-sidecar/` hardening (health endpoint, structured logging, error envelope) | Post-NAK hardening pass |
| NAK-D2 | Database migration robustness (idempotency, rollback testing) | Separate DB workstream |
| NAK-D3 | Auth model changes (MFA, session timeout policy) | Post-NAK auth pass |
| NAK-D4 | Performance optimisation (bundle size, LCP, CLS) | Post-NAK performance pass |
| NAK-D5 | R3 Build mode three-pane cockpit (deferred from Portal Redesign) | NAK does not cover new surfaces — separate workstream |

---

*End of NAK_TRACKER_v1_0.md v1.0 — LIVING. Updated at every NAK session close.*
