---
artifact: NAK_CLAUDECODE_BRIEF (W1-R1 instance)
status: ACTIVE
authored_on: 2026-04-30
authored_by: Claude Code (NAK W0 session)
project: NAK — Nakula
wave_run: W1-R1
title: Design System Deep Audit
governing_clause: >
  NAK_SOP_v1_0.md §C.2 — NAK Claude Code sessions read this file first.
  This file's status field governs the session: ACTIVE = session open;
  COMPLETE = session closed.
target_executor: Claude Code (CLI), Sonnet 4.6 in Anti-Gravity / VS Code
session_class: NAK W1-R1 — audit only, no code changes
exec_brief: NAK_EXEC_BRIEF_W1_R1_DESIGN_v1_0.md
branch: nak/w1-r1-design-audit
worktree: ~/Vibe-Coding/Apps/Madhav-nak-w1r1
parallelizable_with: [W1-R2, W1-R3]
unblocks: [W2-R1]
---

# NAK CLAUDECODE_BRIEF — W1-R1 Design System Deep Audit

## How to activate this brief

Copy from the brief pool to your worktree root before opening the session:

```bash
cd ~/Vibe-Coding/Apps/Madhav
git worktree add ../Madhav-nak-w1r1 -b nak/w1-r1-design-audit main
cp NAK_CLAUDECODE_BRIEF_W1_R1.md ../Madhav-nak-w1r1/NAK_CLAUDECODE_BRIEF.md
cd ../Madhav-nak-w1r1
```

Copy the exec brief and NAK governance dir (they are untracked in main):

```bash
cp ~/Vibe-Coding/Apps/Madhav/NAK_EXEC_BRIEF_W1_R1_DESIGN_v1_0.md .
cp -r ~/Vibe-Coding/Apps/Madhav/00_NAK .
```

## Pre-flight gate

1. `git status` is clean in worktree.
2. `00_NAK/NAK_TRACKER_v1_0.md` §2 shows `w0_closed: true`, `active_wave: W1`.
3. `00_NAK/NAK_DESIGN_SYSTEM_v1_0.md` exists (authored in W0).

## What this session does

Deep audit of the design system. Reads every file in the six non-compliant component directories from W0 (admin/build/dashboard/consume/audit/profile) and the ui/ and brand/ dirs. Documents every violation precisely (file + line). Populates `NAK_DESIGN_SYSTEM_v1_0.md §6`. Makes **zero code changes**.

## Required reads, in order

1. This file.
2. `NAK_EXEC_BRIEF_W1_R1_DESIGN_v1_0.md` — full spec. Pay special attention to §3 (AC-1 Part A–D) and §5 (key files from W0).
3. `00_NAK/NAK_DESIGN_SYSTEM_v1_0.md` — the DRAFT to populate.
4. `00_NAK/NAK_TRACKER_v1_0.md` §2 — confirm `active_wave: W1`, `w0_closed: true`.

## Acceptance criteria (summary — full spec in exec brief §3)

- [ ] AC-1: `00_NAK/reports/NAK_DESIGN_SYSTEM_REPORT_W1_R1_v1_0.md` committed (Parts A–D)
- [ ] AC-2: `00_NAK/NAK_DESIGN_SYSTEM_v1_0.md` bumped to v1.1 with §6 populated
- [ ] AC-3: `NAK_TRACKER_v1_0.md` §3 W1-R1 row closed

## One-line session summary

Sweep all non-compliant component dirs for token violations (file + line). Populate the design system findings doc. Zero code changes.

---
