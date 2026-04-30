---
artifact: NAK_CLAUDECODE_BRIEF (W2-R1 instance)
status: COMPLETE
authored_on: 2026-04-30
authored_by: Cowork (Opus)
project: NAK — Nakula
wave_run: W2-R1
title: Design System Implementation — Fix Run
governing_clause: >
  NAK_SOP_v1_0.md §C.2 — NAK Claude Code sessions read this file first.
  This file's status field governs the session: ACTIVE = session open;
  COMPLETE = session closed.
target_executor: Claude Code (CLI), Sonnet 4.6 in Anti-Gravity / VS Code
session_class: NAK W2-R1 — code changes permitted within may_touch scope
exec_brief: NAK_EXEC_BRIEF_W2_R1_DESIGN_v1_0.md
branch: nak/w2-r1-design-fix
worktree: ~/Vibe-Coding/Apps/Madhav-nak-w2r1
parallelizable_with: []
unblocks: [W2-R2, W2-R3]
---

# NAK CLAUDECODE_BRIEF — W2-R1 Design System Implementation

## Scope

Fix 181+ design token violations catalogued in W1-R1. Execute in sequence A→B→C→D→E→F.

## may_touch

- platform/src/app/globals.css
- platform/src/components/admin/**
- platform/src/components/trace/TracePanel.tsx
- platform/src/components/build/**
- platform/src/components/consume/TraceDrawer.tsx
- platform/src/components/profile/**
- platform/src/components/audit/AuditBadge.tsx
- platform/src/components/ui/**
- 00_NAK/NAK_DESIGN_SYSTEM_v1_0.md
- 00_NAK/NAK_TRACKER_v1_0.md

## must_not_touch

- platform/src/app/api/**
- platform/src/hooks/**
- platform/src/app/**/error.tsx
- platform/src/lib/**
- 00_NAK/NAK_ERROR_FRAMEWORK_v1_0.md
- 00_NAK/NAK_COMPONENT_AUDIT_v1_0.md

## Acceptance criteria

- [ ] AC-1: STEP A — `--color-brand-*` and `--color-status-*` added to `@theme inline`; build passes
- [ ] AC-2: STEP B — `.brand-card` removed; 4 zero-usage variants removed (Button:link, Badge:ghost, Badge:link, TabsList:line)
- [ ] AC-3: STEP C — admin/ 64 violations fixed; trace/TracePanel.tsx 50+ violations fixed; npm test passes (zero new failures vs W0 baseline of 933)
- [ ] AC-4: STEP D — build/ 28 token-fixable violations fixed (24 CHART_PALETTE exceptions documented/untouched); consume/TraceDrawer.tsx 4 violations fixed
- [ ] AC-5: STEP E — profile/ hex fallbacks removed; audit/AuditBadge.tsx design decision documented
- [ ] AC-6: STEP F — NAK_DESIGN_SYSTEM_v1_0.md elevated to FINAL; all F-DS-1 through F-DS-10 resolved or intentionally deferred
- [ ] AC-7: Closure report at 00_NAK/reports/NAK_DESIGN_FIX_REPORT_W2_R1_v1_0.md committed
- [ ] AC-8: NAK_TRACKER_v1_0.md W2-R1 row status: closed

---
