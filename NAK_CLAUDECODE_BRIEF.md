---
artifact: NAK_CLAUDECODE_BRIEF (W2-R2 instance)
status: COMPLETE
authored_on: 2026-04-30
authored_by: Native (NAK W2-R2 session launch)
project: NAK — Nakula
wave_run: W2-R2
title: Error Handling Implementation
governing_clause: >
  NAK_SOP_v1_0.md §C.2 — NAK Claude Code sessions read this file first.
  This file's status field governs the session: ACTIVE = session open;
  COMPLETE = session closed.
target_executor: Claude Code (CLI), Sonnet 4.6 in Anti-Gravity / VS Code
session_class: NAK W2-R2 — code changes permitted within may_touch scope
branch: nak/w2-r2-error-fix
worktree: ~/Vibe-Coding/Apps/Madhav-nak-w2r2
input_from: nak/w1-r2-error-audit
may_touch:
  - platform/src/lib/errors/**
  - platform/src/app/api/**
  - platform/src/hooks/useFeedback.ts
  - 00_NAK/NAK_ERROR_FRAMEWORK_v1_0.md
  - 00_NAK/NAK_PORTAL_MATH_AUDIT_v1_0.md
  - 00_NAK/NAK_TRACKER_v1_0.md
  - 00_NAK/reports/NAK_ERROR_FIX_REPORT_W2_R2_v1_0.md
must_not_touch:
  - platform/src/app/**/error.tsx
  - platform/src/components/**
  - platform/src/app/globals.css
  - 00_NAK/NAK_DESIGN_SYSTEM_v1_0.md
  - 00_NAK/NAK_COMPONENT_AUDIT_v1_0.md
---

# NAK CLAUDECODE_BRIEF — W1-R2 Error Handling and Robustness Audit

## How to activate this brief

Copy from the brief pool to your worktree root before opening the session:

```bash
cd ~/Vibe-Coding/Apps/Madhav
git worktree add ../Madhav-nak-w1r2 -b nak/w1-r2-error-audit main
cp NAK_CLAUDECODE_BRIEF_W1_R2.md ../Madhav-nak-w1r2/NAK_CLAUDECODE_BRIEF.md
cd ../Madhav-nak-w1r2
```

Copy the exec brief and NAK governance dir (they are untracked in main):

```bash
cp ~/Vibe-Coding/Apps/Madhav/NAK_EXEC_BRIEF_W1_R2_ERROR_v1_0.md .
cp -r ~/Vibe-Coding/Apps/Madhav/00_NAK .
```

## Pre-flight gate

1. `git status` is clean in worktree.
2. `00_NAK/NAK_TRACKER_v1_0.md` §2 shows `w0_closed: true`, `active_wave: W1`.
3. `00_NAK/NAK_ERROR_FRAMEWORK_v1_0.md` exists (authored in W0).

## What this session does

Deep audit of error handling across all API routes, hooks, and error boundaries. Maps current state against the target in `NAK_ERROR_FRAMEWORK_v1_0.md`. Confirms or corrects every finding from W0 Part B. Creates the portal math audit skeleton. Makes **zero code changes**.

## Required reads, in order

1. This file.
2. `NAK_EXEC_BRIEF_W1_R2_ERROR_v1_0.md` — full spec. Pay special attention to §3 (AC-1 Parts A–D) and §5 (high-priority routes and hooks).
3. `00_NAK/NAK_ERROR_FRAMEWORK_v1_0.md` — the target state you are auditing against.
4. `00_NAK/NAK_TRACKER_v1_0.md` §2 — confirm `active_wave: W1`, `w0_closed: true`.

## Acceptance criteria (summary — full spec in exec brief §3)

- [ ] AC-1: `00_NAK/reports/NAK_ERROR_AUDIT_REPORT_W1_R2_v1_0.md` committed (Parts A–D)
- [ ] AC-2: `00_NAK/NAK_ERROR_FRAMEWORK_v1_0.md` bumped to v1.1 with confirmed/revised §9
- [ ] AC-3: `00_NAK/NAK_PORTAL_MATH_AUDIT_v1_0.md` DRAFT skeleton created
- [ ] AC-4: `NAK_TRACKER_v1_0.md` §3 W1-R2 row closed

## One-line session summary

Read every API route and hook in full. Map against the error framework target state. Confirm gaps. Zero code changes.

---
