---
artifact: NAK_CLAUDECODE_BRIEF (W0 instance)
status: COMPLETE
authored_on: 2026-04-30
authored_by: Cowork (Opus)
project: NAK — Nakula
wave_run: W0
title: Foundation Gate — Baseline Audit and Framework Drafting
governing_clause: >
  NAK_SOP_v1_0.md §C.2 — NAK Claude Code sessions read this file first.
  This file's status field governs the session: ACTIVE = session open;
  COMPLETE = session closed.
target_executor: Claude Code (CLI), Sonnet 4.6 in Anti-Gravity / VS Code
session_class: NAK W0 Gate — audit only, no code changes
exec_brief: NAK_EXEC_BRIEF_W0_FOUNDATION_v1_0.md
branch: nak/w0-foundation
worktree: ~/Vibe-Coding/Apps/Madhav-nak-w0
parallelizable_with: []       # gate phase — no parallel runs
unblocks: [W1-R1, W1-R2, W1-R3]
---

# NAK CLAUDECODE_BRIEF — W0 Foundation Gate

## How to activate this brief

This file was copied from the brief pool (`NAK_CLAUDECODE_BRIEF_W0.md` at project root) into the W0 worktree root as `NAK_CLAUDECODE_BRIEF.md`.

If you are reading this as `NAK_CLAUDECODE_BRIEF_W0.md` (the pool copy, not in a worktree), you are in the wrong file. Copy it to your worktree first per `NAK_RUNBOOK_v1_0.md §4`.

## What this session does

W0 is the gate phase for Project NAK. It produces the baseline that shapes W1. It makes **zero code changes**. It reads `platform/src/`, audits three axes (design system, error handling, component inventory), and produces the governance documents and briefs that fan out into W1.

## Required reads, in order

1. This file.
2. `NAK_EXEC_BRIEF_W0_FOUNDATION_v1_0.md` — the full spec. Pay special attention to §3 (acceptance criteria) and §4 (suggested work sequence).
3. `00_NAK/NAK_VISION_v1_0.md` §1–§5 — project orientation (skim).
4. `00_NAK/NAK_SOP_v1_0.md` §B (file locations), §C (session ritual), §G (invariants) — the rules you operate under.
5. `00_NAK/NAK_TRACKER_v1_0.md` §2 — confirm `active_wave: W0`, `w0_closed: false`.

Do NOT read `CLAUDE.md §C items 1–11` — KARN governance is out of scope for NAK sessions.

## Pre-flight gate

1. Branch `nak/w0-foundation` is checked out in this worktree.
2. `git status` is clean.
3. `00_NAK/NAK_TRACKER_v1_0.md` §2 shows `active_wave: W0`, `w0_closed: false`.
4. No prior W0 session has closed (this file `status: ACTIVE`, not `COMPLETE`).

## Acceptance criteria (summary — full spec in exec brief §3)

All seven must be met before claiming close:

- [ ] AC-1: `00_NAK/reports/NAK_BASELINE_AUDIT_REPORT_W0_v1_0.md` committed (Parts A–D)
- [ ] AC-2: `00_NAK/NAK_DESIGN_SYSTEM_v1_0.md` committed (status: DRAFT)
- [ ] AC-3: `00_NAK/NAK_ERROR_FRAMEWORK_v1_0.md` committed (status: DRAFT)
- [ ] AC-4: Three W1 exec briefs authored and committed
- [ ] AC-5: Three W1 CLAUDECODE_BRIEF pool files authored and committed
- [ ] AC-6: `00_NAK/NAK_TRACKER_v1_0.md` updated (w0_closed: true, W1 flags, active_wave: W1)
- [ ] AC-7: This file flipped to `status: COMPLETE`

## One-line session summary

Audit `platform/src/` across design-system, error-handling, and component axes. Produce baseline docs and W1 exec briefs. Make zero code changes.

---
