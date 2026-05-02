---
# ROOT BRIEF DISPATCHER — read this first, then navigate to your domain brief.
# This file is NOT a session brief. It is a routing table.
# A Claude Code or Cowork session opens this file, reads its domain row, and
# loads the domain-specific brief. It does NOT execute from this file.
#
# HARD RULE: Engineering sessions must_not_touch 00_ARCHITECTURE/ 01_FACTS_LAYER/ 06_LEARNING_LAYER/
#            Governance sessions must_not_touch platform/src/ platform/tests/
# Any commit mixing both domains is a scope violation and must be split.
#
# BOOTSTRAP TRIGGERS (for new Cowork conversations / new account):
#   "BHISMA"  → read 00_ARCHITECTURE/PROJECT_BHISMA_BOOTSTRAP.md first
#   "KARN"    → read 00_ARCHITECTURE/PROJECT_KARN_BOOTSTRAP.md first
#   "USTAD"   → open /Users/Dev/Vibe-Coding/Apps/Ustad/ as workspace (separate repo)
#   "MARSYS"  → read CLAUDE.md §C items 1–11 (full project orientation)
---

# CLAUDECODE_BRIEF — Session Router

## §1 — Domain map (all active workstreams)

| Domain | Bootstrap / Brief | Active? | Status | Next session |
|--------|------------------|---------|--------|-------------|
| BHISMA Engineering | `00_ARCHITECTURE/PROJECT_BHISMA_BOOTSTRAP.md` → `platform/CLAUDECODE_BRIEF.md` | NO | PARTIAL-COMPLETE — W2 code done; LLM planner PARKED (Lever 3 NAP needed) | W2-PLANNER-L3 (if Lever 3 authorized) |
| MARSYS-JIS Governance (M5) | `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` → author M5-S1 brief | NO | M4 CLOSED 2026-05-02; M5 INCOMING | M5-S1 (not yet authored) |
| KARN Corpus Activation | `00_ARCHITECTURE/PROJECT_KARN_BOOTSTRAP.md` → latest W* brief in `00_ARCHITECTURE/BRIEFS/` | NO | M2 CLOSED; M3 INCOMING | KARN-W9-M3-OPEN |
| Project Ustad | `/Users/Dev/Vibe-Coding/Apps/Ustad/` (separate repo) | UNKNOWN | Check Ustad workspace directly | N/A from here |
| Portal redesign | `00_ARCHITECTURE/PORTAL_REDESIGN_TRACKER_v1_0.md` | NO | COMPLETE 2026-04-30 (R0–R2, R4–R7 closed; R3 deferred) | — |

## §2 — Parallel session anti-entanglement matrix

Can sessions A and B run simultaneously? Check the matrix:

| Session A → | BHISMA Eng | MARSYS Governance | KARN | Ustad |
|-------------|-----------|-------------------|------|-------|
| **BHISMA Engineering** | ✗ (same files) | ⚠ SESSION_LOG conflict | ✓ safe | ✓ safe |
| **MARSYS Governance** | ⚠ SESSION_LOG conflict | ✗ (same files) | ⚠ 00_ARCH/ conflict | ✓ safe |
| **KARN** | ✓ safe | ⚠ 00_ARCH/ conflict | ✗ (same files) | ✓ safe |
| **Ustad** | ✓ safe | ✓ safe | ✓ safe | ✗ (same files) |

**Legend:**
- ✓ safe — no file overlap, can run concurrently
- ⚠ — overlapping files; serialize writes to shared files (SESSION_LOG, CURRENT_STATE)
- ✗ — same domain, never concurrent

**Shared files (serialize writes — one session at a time):**
- `00_ARCHITECTURE/SESSION_LOG.md`
- `00_ARCHITECTURE/CURRENT_STATE_v1_0.md`
- `CLAUDECODE_BRIEF.md` (this file)

## §3 — File lock declarations (per domain)

### BHISMA Engineering
```
may_touch:    platform/src/**, platform/tests/**, platform/briefs/**, platform/scripts/**
must_not_touch: 00_ARCHITECTURE/**, 01_FACTS_LAYER/**, 06_LEARNING_LAYER/**, .geminirules
exception:    may append to 00_ARCHITECTURE/SESSION_LOG.md at session close only
```

### MARSYS-JIS Governance
```
may_touch:    00_ARCHITECTURE/**, .geminirules, .gemini/project_state.md
must_not_touch: platform/src/**, platform/tests/**, 01_FACTS_LAYER/**, 025_HOLISTIC_SYNTHESIS/**
```

### KARN Corpus Activation
```
may_touch:    01_FACTS_LAYER/**, 025_HOLISTIC_SYNTHESIS/**, 06_LEARNING_LAYER/**,
              00_ARCHITECTURE/BRIEFS/CLAUDECODE_BRIEF_M2_*.md,
              00_ARCHITECTURE/SESSION_LOG.md (append only)
must_not_touch: platform/src/**, platform/tests/**, .geminirules
```

### Project Ustad
```
workspace:    /Users/Dev/Vibe-Coding/Apps/Ustad/   (entirely separate repo)
may_touch:    everything under Ustad/
must_not_touch: /Users/Dev/Vibe-Coding/Apps/Madhav/** (this repo — zero overlap)
```

## §4 — Parallel session protocol rules

1. **One domain per session.** Engineering OR governance — never both in the same
   session. If a task requires touching both, it must be two separate sessions
   with a handoff commit between them.

2. **Declare file locks at session open.** Every session emits `may_touch` and
   `must_not_touch` globs before any tool call. If two active briefs have
   overlapping `may_touch`, they cannot run simultaneously.

3. **Single-domain commits.** If an engineering session must append to SESSION_LOG.md
   at close, that is the ONE allowed governance-file exception. Nothing else.

4. **Branch naming encodes domain:**
   - `feature/w*`, `feature/bhisma-*` → BHISMA Engineering
   - `feature/m*`, `feature/governance-*` → MARSYS-JIS Governance
   - `feature/karn-*`, `redesign/*` → KARN / Portal
   - Any branch under Ustad repo → Ustad (isolated)

5. **Status hygiene:** When a session closes, the last act is setting its brief
   `status: COMPLETE` (or PARKED/PARTIAL). A brief left at PENDING is a false signal.

6. **Git lock check:** Before any commit, run `ls .git/*.lock`. Remove stale locks
   from crashed sessions before committing.

## §5 — Bootstrap quick-reference (new account or fresh context)

Open the Madhav workspace folder in Cowork on the new account, then paste:

**To continue BHISMA:**
```
BHISMA

Pick up Project BHISMA. Read 00_ARCHITECTURE/PROJECT_BHISMA_BOOTSTRAP.md first,
then CLAUDECODE_BRIEF.md and CURRENT_STATE_v1_0.md. Tell me current state and
what the next session should be.
```

**To continue KARN:**
```
KARN

Pick up Project KARN. Read 00_ARCHITECTURE/PROJECT_KARN_BOOTSTRAP.md first.
Tell me which wave is next and what the next session should be.
```

**To continue full MARSYS-JIS:**
```
MARSYS

Full project orientation. Read CLAUDE.md §C items 1–11 in order.
Tell me active macro-phase, BHISMA status, KARN status, and what to work on next.
```

## §6 — Archived briefs

### BHISMA Wave 2 (PARTIAL-COMPLETE)
- All 58 code tasks complete. LLM_FIRST_PLANNER_ENABLED parked (flag false).
- Commits: 2cd3e12 (W2-BUGS) → 8a14043 (W2-SCHEMA) → 731530b (W2-EVAL-A) →
  a24d96d (W2-MANIFEST) → 4628660 (W2-PLANNER) → 77184e1 (W2-TRACE-A) →
  f1282a1 (W2-INSTRUMENT) → 36d2ac0 (W2-TRACE-B) → 59d55ed (W2-EVAL-B) →
  2fe3ba9 (W2-CTX-ASSEMBLY)
- Lever 3 path: swap planner model → needs native NAP.

### W2-UQE-ACTIVATE (PARKED)
- 8 smoke rounds. Best: recall=0.750, precision=0.631. Thresholds: 0.80/0.90.
- Lever 2 decision: classify() routing retained. commit: 14e4b02.

### M4-D-S1 (COMPLETE)
- M4 macro-phase CLOSED 2026-05-02. NAP.M4.7 APPROVED. commit: 80d5c51.

### Portal Redesign (COMPLETE)
- R0–R2, R4–R7 closed 2026-04-30. R3 deferred indefinitely.

### W2-EVAL-A (COMPLETE)
- commit: 731530b
