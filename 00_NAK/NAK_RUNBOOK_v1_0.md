---
artifact_id: NAK_RUNBOOK
version: 1.0
status: CURRENT
authored_by: Cowork (Opus)
authored_at: 2026-04-30
owner: Abhisek Mohanty
project: NAK — Nakula
purpose: >
  Step-by-step operational playbook for the native. Covers how to launch
  parallel Claude Code agents per wave, how to manage worktrees, how to
  coordinate and merge, and what to do when something goes wrong.
  Read this when you are ready to execute a wave — not before.
---

# Project NAK — Parallel Execution Runbook v1.0

---

## §0 — When to use this runbook

Use this runbook when:
- W0 is closed and you are ready to start W1 (see §2 for the pre-fan-out checklist).
- A prior wave is closed and you are ready to fan out the next wave.
- You need to set up a worktree for a single run.

Do NOT use this runbook before the gate phase of the current wave is closed. If W0 is not closed, do W0 first.

---

## §1 — What parallel execution means in NAK

Each NAK wave fans out to **three Claude Code instances**. Each instance:
- Lives in its own **git worktree** (a separate checkout of the same repo in a different directory).
- Runs on its own **branch** (`nak/w{n}-r{m}-{slug}`).
- Reads its own **active brief** (`NAK_CLAUDECODE_BRIEF.md` in the worktree root, copied from the brief pool).
- Touches only the files declared in its `may_touch` scope.
- Runs independently — you do not need to wait for one to finish before starting the next.

When all three runs in a wave close, you merge all three branches to `main` (or `nak/main` if you prefer a NAK integration branch), resolve any conflicts (there should be none if scope isolation held), and then open the next wave.

**Three terminals, three instances, three conversations — running at the same time.**

---

## §2 — Pre-fan-out checklist (run before any wave)

Before creating worktrees for wave W{n}, verify the gate is truly closed:

```bash
cd ~/Vibe-Coding/Apps/Madhav

# 1. Confirm gate wave/run is closed in tracker
grep "w0_closed: true" 00_NAK/NAK_TRACKER_v1_0.md      # for W1 fan-out
# or:
grep "status: closed" 00_NAK/NAK_TRACKER_v1_0.md | grep "W1-R"  # all three for W2 fan-out

# 2. Confirm all exec briefs for this wave are authored
ls NAK_EXEC_BRIEF_W1_*.md           # should show R1, R2, R3 files

# 3. Confirm all brief pool files exist
ls NAK_CLAUDECODE_BRIEF_W1_R*.md    # should show R1, R2, R3 files

# 4. Confirm main is clean and up to date
git status
git log --oneline -3 main

# 5. No NAK worktrees already open for this wave
git worktree list | grep nak
```

All checks must pass. If any fail, fix before proceeding.

---

## §3 — Creating worktrees for a wave

### Full fan-out — all three runs at once (recommended)

```bash
cd ~/Vibe-Coding/Apps/Madhav

# W1 example — substitute W2 or W3 as needed
git worktree add ../Madhav-nak-w1r1 -b nak/w1-r1-design-audit main
git worktree add ../Madhav-nak-w1r2 -b nak/w1-r2-error-audit main
git worktree add ../Madhav-nak-w1r3 -b nak/w1-r3-component-audit main

git worktree list   # verify all three appear
```

### Partial fan-out — start fewer runs

If you want to start one or two runs first and add more later:

```bash
# Start with R1 only
git worktree add ../Madhav-nak-w1r1 -b nak/w1-r1-design-audit main

# Add R2 when ready (even if R1 is still running)
git worktree add ../Madhav-nak-w1r2 -b nak/w1-r2-error-audit main
```

This is safe because runs are scope-isolated — they don't read each other's uncommitted changes.

---

## §4 — Activating a brief in a worktree

Each worktree needs its own `NAK_CLAUDECODE_BRIEF.md`. The brief pool files live at the project root; you copy (not symlink) them into each worktree:

```bash
# For W1-R1
cd ~/Vibe-Coding/Apps/Madhav-nak-w1r1
cp ~/Vibe-Coding/Apps/Madhav/NAK_CLAUDECODE_BRIEF_W1_R1.md NAK_CLAUDECODE_BRIEF.md

# For W1-R2
cd ~/Vibe-Coding/Apps/Madhav-nak-w1r2
cp ~/Vibe-Coding/Apps/Madhav/NAK_CLAUDECODE_BRIEF_W1_R2.md NAK_CLAUDECODE_BRIEF.md

# For W1-R3
cd ~/Vibe-Coding/Apps/Madhav-nak-w1r3
cp ~/Vibe-Coding/Apps/Madhav/NAK_CLAUDECODE_BRIEF_W1_R3.md NAK_CLAUDECODE_BRIEF.md
```

Verify the copy worked and shows `status: ACTIVE`:

```bash
head -5 ~/Vibe-Coding/Apps/Madhav-nak-w1r1/NAK_CLAUDECODE_BRIEF.md
```

---

## §5 — Opening three Claude Code sessions

You have three options for running three instances simultaneously:

### Option A — Three terminal tabs / panes (simplest)

Open three terminal windows or iTerm panes. In each:

```bash
# Tab 1
cd ~/Vibe-Coding/Apps/Madhav-nak-w1r1
claude   # opens Claude Code in this worktree

# Tab 2
cd ~/Vibe-Coding/Apps/Madhav-nak-w1r2
claude

# Tab 3
cd ~/Vibe-Coding/Apps/Madhav-nak-w1r3
claude
```

Paste the appropriate trigger prompt (from `NAK_SOP_v1_0.md §E`) into each session.

### Option B — Three VS Code windows (Anti-Gravity)

Open three VS Code windows, each pointed at a different worktree. Use Anti-Gravity to run Claude Code in each.

### Option C — Sequential (if parallel is too much to manage)

Run R1, R2, R3 sequentially in the same terminal, same worktree (but separate branches). Slower but simpler if you prefer to watch one run at a time.

**Recommended:** Option A for audit waves (W1 — read-only, low risk), Option C for fix waves (W2 — code changes, higher attention needed).

---

## §6 — Trigger prompts (ready to paste)

Copy the relevant prompt from `NAK_SOP_v1_0.md §E` and paste it into the Claude Code session after it opens. The prompt tells Claude Code what project it's in, what run it is, and what to do. Claude Code then reads `NAK_CLAUDECODE_BRIEF.md` to get the full spec.

**Important:** Claude Code reads `NAK_CLAUDECODE_BRIEF.md` from the worktree root, not from the main project root. Verify the copy step (§4 above) before pasting the trigger.

---

## §7 — Monitoring running sessions

You don't need to babysit sessions. Check in periodically:

- **For audit runs (W1):** Sessions should be reading files and writing to `00_NAK/` docs. No code changes expected. If you see a session editing `*.tsx` or `*.ts` files, that's out of scope — interrupt and redirect.
- **For fix runs (W2):** Sessions will be making code changes. Watch for scope creep. If a session touches a file outside its `may_touch` glob, that's a violation — interrupt, revert, redirect.
- **For verification runs (W3):** Sessions run tests and do minor fixes. Watch for test output — any new test failures that weren't present at W0 baseline are a problem.

---

## §8 — Closing a run and merging

When a Claude Code session signals that its acceptance criteria are met and `NAK_CLAUDECODE_BRIEF.md` is flipped to `COMPLETE`:

```bash
# 1. Review the changes in the worktree
cd ~/Vibe-Coding/Apps/Madhav-nak-w1r1
git log --oneline   # what did it commit?
git diff main       # what changed?

# 2. If happy, merge to main
cd ~/Vibe-Coding/Apps/Madhav
git merge nak/w1-r1-design-audit --no-ff -m "NAK W1-R1: Design System Deep Audit"

# 3. Remove the worktree
git worktree remove ../Madhav-nak-w1r1

# 4. Update the tracker
# Open 00_NAK/NAK_TRACKER_v1_0.md and flip W1-R1 row status: closed,
# set session_id, closed_at, follow_ups.
```

Repeat for R2 and R3. Once all three are merged, update §2 state block: `active_wave → W2` (or W3), `w1_r1_brief_authored` etc. flags accordingly.

---

## §9 — Merge conflict resolution

Scope isolation is designed to prevent merge conflicts. If a conflict does occur:

1. **Stop.** Do not auto-resolve.
2. Read both sides of the conflict carefully.
3. If the conflict is in `00_NAK/*.md` (governance docs): merge manually, preserving both runs' findings.
4. If the conflict is in `platform/src/`: this means two runs touched the same file — a scope violation. Identify which run violated its `must_not_touch` declaration and revert that run's change on the offending file. Then merge.
5. Document the conflict and resolution in the wave's closure notes in `NAK_TRACKER_v1_0.md`.

---

## §10 — Wave close ceremony (Cowork session)

After all runs in a wave are merged to main:

1. Open a Cowork session named `NAK — W{n} Close + W{n+1} Brief Authoring`.
2. Read `00_NAK/NAK_TRACKER_v1_0.md` §2 + §3 to confirm all runs are closed.
3. Read all three closure reports for the wave.
4. Author exec briefs for the next wave's three runs (scope shaped by current wave's findings).
5. Author `NAK_CLAUDECODE_BRIEF_W{n+1}_R{m}.md` files at project root.
6. Update `NAK_TRACKER_v1_0.md` §2: flip `active_wave`, set `*_brief_authored` flags.
7. Tag this state in git: `git tag nak-w{n}-close`.

---

## §11 — Quick reference table

| Wave | Runs | Gate | Branch pattern | Worktree pattern |
|---|---|---|---|---|
| W0 | 1 | — | `nak/w0-foundation` | `../Madhav-nak-w0` |
| W1 | 3 | W0 closed | `nak/w1-r{m}-{slug}` | `../Madhav-nak-w1r{m}` |
| W2 | 3 | W1 all closed | `nak/w2-r{m}-{slug}` | `../Madhav-nak-w2r{m}` |
| W3 | 3 | W2 all closed | `nak/w3-r{m}-{slug}` | `../Madhav-nak-w3r{m}` |

---

*End of NAK_RUNBOOK_v1_0.md — authored 2026-04-30. Operational guide for parallel Claude Code execution across NAK waves.*
