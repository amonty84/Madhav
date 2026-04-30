---
artifact: NAK_CLAUDECODE_BRIEF (W1-R3 instance)
status: ACTIVE
authored_on: 2026-04-30
authored_by: Claude Code (NAK W0 session)
project: NAK — Nakula
wave_run: W1-R3
title: UX Component Audit and A11y First Pass
governing_clause: >
  NAK_SOP_v1_0.md §C.2 — NAK Claude Code sessions read this file first.
  This file's status field governs the session: ACTIVE = session open;
  COMPLETE = session closed.
target_executor: Claude Code (CLI), Sonnet 4.6 in Anti-Gravity / VS Code
session_class: NAK W1-R3 — audit only, no code changes
exec_brief: NAK_EXEC_BRIEF_W1_R3_COMPONENT_v1_0.md
branch: nak/w1-r3-component-audit
worktree: ~/Vibe-Coding/Apps/Madhav-nak-w1r3
parallelizable_with: [W1-R1, W1-R2]
unblocks: [W2-R3]
---

# NAK CLAUDECODE_BRIEF — W1-R3 UX Component Audit and A11y First Pass

## How to activate this brief

Copy from the brief pool to your worktree root before opening the session:

```bash
cd ~/Vibe-Coding/Apps/Madhav
git worktree add ../Madhav-nak-w1r3 -b nak/w1-r3-component-audit main
cp NAK_CLAUDECODE_BRIEF_W1_R3.md ../Madhav-nak-w1r3/NAK_CLAUDECODE_BRIEF.md
cd ../Madhav-nak-w1r3
```

Copy the exec brief and NAK governance dir (they are untracked in main):

```bash
cp ~/Vibe-Coding/Apps/Madhav/NAK_EXEC_BRIEF_W1_R3_COMPONENT_v1_0.md .
cp -r ~/Vibe-Coding/Apps/Madhav/00_NAK .
```

## Pre-flight gate

1. `git status` is clean in worktree.
2. `00_NAK/NAK_TRACKER_v1_0.md` §2 shows `w0_closed: true`, `active_wave: W1`.
3. `00_NAK/reports/NAK_BASELINE_AUDIT_REPORT_W0_v1_0.md` exists (Part C has the suspect list).

## What this session does

Resolves the 9 suspect duplicate components from W0 by reading both files in each pair. Performs an a11y first pass on the four user-facing component dirs (consume, shared, chat, ui). Maps all pages/layouts to surface coverage. Creates `NAK_COMPONENT_AUDIT_v1_0.md`. Makes **zero code changes**.

## Required reads, in order

1. This file.
2. `NAK_EXEC_BRIEF_W1_R3_COMPONENT_v1_0.md` — full spec. Pay special attention to §3 (AC-1 Parts A–D), §5 (suspect components list with file paths), and §6 (a11y focus areas).
3. `00_NAK/reports/NAK_BASELINE_AUDIT_REPORT_W0_v1_0.md` Part C — the 9 suspects and the 149-component inventory.
4. `00_NAK/NAK_TRACKER_v1_0.md` §2 — confirm `active_wave: W1`, `w0_closed: true`.

## Acceptance criteria (summary — full spec in exec brief §3)

- [ ] AC-1: `00_NAK/reports/NAK_COMPONENT_AUDIT_REPORT_W1_R3_v1_0.md` committed (Parts A–D)
- [ ] AC-2: `00_NAK/NAK_COMPONENT_AUDIT_v1_0.md` DRAFT created
- [ ] AC-3: `NAK_TRACKER_v1_0.md` §3 W1-R3 row closed

## One-line session summary

Resolve 9 suspect duplicates, run a11y pass on user-facing surfaces, build page/layout surface map. Zero code changes.

---
