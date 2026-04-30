---
artifact_id: NAK_SOP
version: 1.0
status: CURRENT
authored_by: Cowork (Opus)
authored_at: 2026-04-30
owner: Abhisek Mohanty
project: NAK — Nakula
purpose: >
  Standard Operating Procedure for every NAK session — naming conventions,
  file conventions, session activation ritual, Claude Code trigger prompt
  templates, wave lifecycle rules. This is the first file any NAK session
  (Cowork or Claude Code) reads after NAK_VISION_v1_0.md.
---

# Project NAK — Standard Operating Procedure v1.0

---

## §A — Naming conventions

### §A.1 — Project abbreviation

`NAK` — always uppercase, never "Nakula" in file names or branch names.

### §A.2 — Wave and run IDs

A **wave** is a gate-separated cluster of work. A **run** is one parallel Claude Code instance inside a wave.

| Identifier | Format | Example |
|---|---|---|
| Wave | `W{n}` | `W0`, `W1`, `W2`, `W3` |
| Run | `W{n}-R{m}` | `W1-R1`, `W1-R2`, `W1-R3` |
| Gate wave (W0) | `W0` only — no run suffix | `W0` |

Run numbers within a wave are always 1, 2, 3 — never zero-indexed, never skipped.

### §A.3 — File naming

| File type | Pattern | Example |
|---|---|---|
| Project governance docs | `NAK_{SUBJECT}_v{n}_{m}.md` | `NAK_VISION_v1_0.md` |
| Exec brief (gate phase) | `NAK_EXEC_BRIEF_W0_FOUNDATION_v1_0.md` | — |
| Exec brief (wave run) | `NAK_EXEC_BRIEF_{WaveRun}_{SUBJECT}_v1_0.md` | `NAK_EXEC_BRIEF_W1_R2_ERROR_AUDIT_v1_0.md` |
| Active Claude Code brief | `NAK_CLAUDECODE_BRIEF.md` | root-level, copied from brief pool |
| Brief pool (parked) | `NAK_CLAUDECODE_BRIEF_{WaveRun}.md` | `NAK_CLAUDECODE_BRIEF_W1_R1.md` |
| Findings reports | `NAK_{SUBJECT}_REPORT_{WaveRun}_v1_0.md` | `NAK_DESIGN_SYSTEM_REPORT_W1_R1_v1_0.md` |
| Living specs (authored during W0/W1) | `NAK_{SUBJECT}_v1_0.md` | `NAK_DESIGN_SYSTEM_v1_0.md` |

All files live inside `00_NAK/` unless otherwise noted. Exception: `NAK_CLAUDECODE_BRIEF.md` and the brief pool files `NAK_CLAUDECODE_BRIEF_{WaveRun}.md` live at the **project root** (`~/Vibe-Coding/Apps/Madhav/`), parallel to KARN's `CLAUDECODE_BRIEF.md` pool.

### §A.4 — Git branch naming

| Branch | Pattern | Example |
|---|---|---|
| Gate phase | `nak/w0-foundation` | — |
| Wave run | `nak/w{n}-r{m}-{slug}` | `nak/w1-r1-design-system-audit` |
| Hot fix | `nak/hotfix-{slug}` | `nak/hotfix-auth-error-boundary` |

All NAK branches are prefixed `nak/`. KARN branches are prefixed `redesign/` or carry no prefix on main — the `nak/` prefix ensures zero collision at the branch level.

### §A.5 — Cowork conversation naming

**Format:** `NAK — {WaveRun} — {brief description}`

| Example | Purpose |
|---|---|
| `NAK — W0 — Foundation Audit` | Gate phase planning / authoring |
| `NAK — W1-R1 — Design System Audit` | Claude Code trigger prep |
| `NAK — W2-R2 — Error Handling Fix` | Claude Code trigger prep |
| `NAK — W3-R3 — Documentation Seal` | Final close |

Cowork conversations are used for: planning, authoring briefs, reviewing reports, authoring the next wave's exec briefs. Claude Code conversations (in terminal / Anti-Gravity) are used for: implementation, file changes, test execution.

---

## §B — File locations at a glance

```
~/Vibe-Coding/Apps/Madhav/
│
├── 00_NAK/                                ← NAK governance home
│   ├── NAK_VISION_v1_0.md                 ← CURRENT (this project's anchor)
│   ├── NAK_SOP_v1_0.md                    ← CURRENT (this file)
│   ├── NAK_TRACKER_v1_0.md                ← LIVING (phase ledger)
│   ├── NAK_RUNBOOK_v1_0.md                ← CURRENT (parallel playbook)
│   │
│   ├── NAK_DESIGN_SYSTEM_v1_0.md          ← authored in W0, finalised in W3-R3
│   ├── NAK_ERROR_FRAMEWORK_v1_0.md        ← authored in W0, finalised in W2-R2
│   ├── NAK_COMPONENT_AUDIT_v1_0.md        ← authored in W1-R3, finalised in W2-R3
│   ├── NAK_PORTAL_MATH_AUDIT_v1_0.md      ← authored in W1-R2, finalised in W2-R2
│   ├── NAK_CONSISTENCY_CHECKLIST_v1_0.md  ← authored in W3-R1, finalised W3-R1
│   │
│   └── reports/                           ← per-run findings reports
│       ├── NAK_BASELINE_AUDIT_REPORT_W0_v1_0.md
│       ├── NAK_DESIGN_SYSTEM_REPORT_W1_R1_v1_0.md
│       ├── NAK_ERROR_AUDIT_REPORT_W1_R2_v1_0.md
│       └── NAK_COMPONENT_AUDIT_REPORT_W1_R3_v1_0.md
│
├── NAK_EXEC_BRIEF_W0_FOUNDATION_v1_0.md   ← W0 exec brief (gate)
├── NAK_EXEC_BRIEF_W1_R1_DESIGN_v1_0.md    ← W1-R1 brief (authored at W0 close)
├── NAK_EXEC_BRIEF_W1_R2_ERROR_v1_0.md     ← W1-R2 brief
├── NAK_EXEC_BRIEF_W1_R3_COMPONENT_v1_0.md ← W1-R3 brief
├── ... (W2, W3 briefs authored at prior wave close)
│
├── NAK_CLAUDECODE_BRIEF.md                ← ACTIVE brief (symlink-by-copy pattern)
├── NAK_CLAUDECODE_BRIEF_W0.md             ← parked W0 brief
├── NAK_CLAUDECODE_BRIEF_W1_R1.md          ← parked W1-R1 brief
├── NAK_CLAUDECODE_BRIEF_W1_R2.md          ← parked W1-R2 brief
├── NAK_CLAUDECODE_BRIEF_W1_R3.md          ← parked W1-R3 brief
└── ... (W2, W3 briefs authored at prior wave close)
```

---

## §C — Session activation ritual

### §C.1 — Cowork sessions (planning, authoring, review)

Every Cowork session that opens in NAK context reads, in order:

1. `00_NAK/NAK_VISION_v1_0.md` — project anchor
2. `00_NAK/NAK_SOP_v1_0.md` — this file
3. `00_NAK/NAK_TRACKER_v1_0.md` — §2 state block ("you are here")
4. The active exec brief for the wave/run being planned (if applicable)

**Conversation name** must match `NAK — {WaveRun} — {brief description}`.

### §C.2 — Claude Code sessions (implementation)

Every Claude Code session that executes a NAK run reads, in order:

1. `NAK_CLAUDECODE_BRIEF.md` at project root — the active brief, copied from the brief pool before the session opens. This file's `status` field governs the session: `ACTIVE` = session open; `COMPLETE` = session closed.
2. The exec brief named in `NAK_CLAUDECODE_BRIEF.md`'s `exec_brief` field.
3. `00_NAK/NAK_VISION_v1_0.md` §1–§5 (orientation).
4. `00_NAK/NAK_TRACKER_v1_0.md` §2 (state confirmation).

**Claude Code does not read `CLAUDE.md §C items 1–11` first when opening a NAK session.** NAK sessions are scoped to `platform/src/` only. KARN governance files are not relevant and reading them wastes context. The only exception: if a NAK run needs to understand a canonical artifact (e.g., the design system references the L1 forensic chart), read only the specific file cited.

### §C.3 — Brief activation (copy-in ritual)

Before starting a Claude Code run for wave `{W}-R{m}`:

```bash
cd ~/Vibe-Coding/Apps/Madhav

# 1. Confirm the previous gate/wave is fully closed
grep "nak_status" 00_NAK/NAK_TRACKER_v1_0.md       # for W0 check, look at active_wave
grep "status: closed" 00_NAK/NAK_TRACKER_v1_0.md   # prior wave rows should all be closed

# 2. Create worktree for this run
git worktree add ../Madhav-nak-{waverun} -b nak/{waverun}-{slug} main
# example: git worktree add ../Madhav-nak-w1r1 -b nak/w1-r1-design-audit main

# 3. Activate the brief in the worktree
cd ../Madhav-nak-{waverun}
cp ~/Vibe-Coding/Apps/Madhav/NAK_CLAUDECODE_BRIEF_{WaveRun}.md NAK_CLAUDECODE_BRIEF.md

# 4. Open Claude Code in this worktree
# (Anti-Gravity, VS Code, or terminal — per preference)
```

The session opens by reading `NAK_CLAUDECODE_BRIEF.md`. That file names its exec brief, which names the acceptance criteria. The session does not claim close until acceptance criteria are met and `NAK_CLAUDECODE_BRIEF.md` `status` is flipped to `COMPLETE`.

---

## §D — Wave lifecycle

### §D.1 — Opening a wave

A wave opens when:
- The prior gate (W0 for W1; W1 for W2; W2 for W3) has `status: closed` in `NAK_TRACKER_v1_0.md`.
- All exec briefs for the wave's runs are authored and in the brief pool.
- All `NAK_CLAUDECODE_BRIEF_{WaveRun}.md` files exist at project root.

### §D.2 — Within a wave

Runs within a wave are parallel-safe by scope isolation. Each run's exec brief declares:
- `may_touch`: the glob set this run is permitted to modify.
- `must_not_touch`: globs no run in the wave may touch (to prevent collision).

Scope isolation is enforced by convention. There is no automated lock — the exec briefs are designed so that no two runs in the same wave touch the same files.

### §D.3 — Closing a run

A run closes when:
1. All acceptance criteria in the exec brief are met.
2. A findings/closure report is committed to `00_NAK/reports/`.
3. `NAK_TRACKER_v1_0.md` §3 row for the run flips to `status: closed`.
4. `NAK_CLAUDECODE_BRIEF.md` in the worktree flips to `status: COMPLETE`.
5. The PR is merged to `main` (or staged for a coordinated merge at wave close).

### §D.4 — Closing a wave

A wave closes when all its runs are closed. The Cowork session that closes the wave:
1. Verifies all run closure reports exist and have `status: COMPLETE`.
2. Updates `NAK_TRACKER_v1_0.md` §2 state block: `active_wave` → next wave or `null`.
3. Authors exec briefs for the next wave's runs (the scope of those briefs is informed by findings from the wave just closed).
4. Authors `NAK_CLAUDECODE_BRIEF_{WaveRun}.md` files for the next wave at project root.

---

## §E — Claude Code trigger prompt templates

These are the exact prompts to paste into a Claude Code session to activate each type of NAK run. They are terse and directive — Claude Code reads context from the brief, not from the trigger.

### §E.1 — Gate phase W0

```
Project: NAK (Nakula) — Portal Robustness & Design System Hardening
Session type: W0 Foundation Gate
Active brief: NAK_CLAUDECODE_BRIEF.md (confirm status: ACTIVE)
Exec brief: NAK_EXEC_BRIEF_W0_FOUNDATION_v1_0.md

Read NAK_CLAUDECODE_BRIEF.md first. Then read the exec brief. Execute the acceptance criteria in order. Do not proceed past a gate item without confirming it passes. Commit findings to 00_NAK/reports/NAK_BASELINE_AUDIT_REPORT_W0_v1_0.md. When all criteria are met, flip NAK_CLAUDECODE_BRIEF.md status to COMPLETE and update NAK_TRACKER_v1_0.md.
```

### §E.2 — Audit wave runs (W1-R1, W1-R2, W1-R3)

```
Project: NAK (Nakula) — {run_id}: {run_title}
Session type: W1 Audit Run
Active brief: NAK_CLAUDECODE_BRIEF.md (confirm status: ACTIVE, wave_run: {run_id})
Exec brief: {exec_brief_filename}

Read NAK_CLAUDECODE_BRIEF.md first. Then read the exec brief. Your job is AUDIT ONLY — read, analyse, document findings. Do not make code changes in this session. Commit your findings report to 00_NAK/reports/{report_filename}. When done, flip NAK_CLAUDECODE_BRIEF.md status to COMPLETE and update NAK_TRACKER_v1_0.md.
```

### §E.3 — Fix wave runs (W2-R1, W2-R2, W2-R3)

```
Project: NAK (Nakula) — {run_id}: {run_title}
Session type: W2 Fix Run
Active brief: NAK_CLAUDECODE_BRIEF.md (confirm status: ACTIVE, wave_run: {run_id})
Exec brief: {exec_brief_filename}
Prior findings: {findings_report_from_W1_counterpart}

Read NAK_CLAUDECODE_BRIEF.md first. Then read the exec brief. Then read the W1 findings report named above. Implement fixes in order of priority declared in the exec brief. Run tests after each logical change group. Do not exceed the may_touch scope. When all acceptance criteria are met, commit, flip NAK_CLAUDECODE_BRIEF.md to COMPLETE, update NAK_TRACKER_v1_0.md.
```

### §E.4 — Verification wave runs (W3-R1, W3-R2, W3-R3)

```
Project: NAK (Nakula) — {run_id}: {run_title}
Session type: W3 Verification Run
Active brief: NAK_CLAUDECODE_BRIEF.md (confirm status: ACTIVE, wave_run: {run_id})
Exec brief: {exec_brief_filename}

Read NAK_CLAUDECODE_BRIEF.md first. Then read the exec brief. W3 closes NAK — your job is to verify that what W1 found and W2 fixed actually holds. Run the test suite, run the consistency checklist, verify zero unhandled errors. If you find a regression, fix it in this session (scope: may_touch from exec brief). When all acceptance criteria are met, flip NAK_CLAUDECODE_BRIEF.md to COMPLETE, update NAK_TRACKER_v1_0.md to nak_status: COMPLETE.
```

---

## §F — What Cowork does vs what Claude Code does

| Responsibility | Cowork | Claude Code |
|---|---|---|
| Vision authoring | ✅ | — |
| SOP authoring | ✅ | — |
| Tracker maintenance | ✅ (at wave opens/closes) | ✅ (at run close) |
| Exec brief authoring | ✅ | — |
| CLAUDECODE_BRIEF authoring | ✅ | — |
| Baseline audit (W0) | — | ✅ |
| Design system doc draft (W0) | ✅ (first draft) | ✅ (populate from audit) |
| Audit runs (W1) | — | ✅ |
| Fix runs (W2) | — | ✅ |
| Verification runs (W3) | — | ✅ |
| Reviewing findings reports | ✅ | — |
| Authoring next-wave briefs | ✅ (from findings) | — |
| Project close declaration | ✅ | — |

Cowork is the **architect and reviewer**. Claude Code is the **executor**. Neither crosses into the other's lane without explicit native approval.

---

## §G — Invariants (cannot be overridden by any exec brief)

1. NAK runs never touch corpus files outside `platform/src/`.
2. NAK runs never change the database schema or migration files.
3. NAK runs never change auth business logic (they may wrap it in better error UX).
4. No wave starts until its gate wave/run is `status: closed` in the tracker.
5. No run claims close without a committed findings/closure report.
6. `npm test` baseline (at W0 start) must not regress at any W2 or W3 close.
7. `NAK_CLAUDECODE_BRIEF.md` status is ACTIVE at session open, COMPLETE at session close — never left in an intermediate state.

---

*End of NAK_SOP_v1_0.md — authored 2026-04-30. Read at every NAK session open, Cowork or Claude Code.*
