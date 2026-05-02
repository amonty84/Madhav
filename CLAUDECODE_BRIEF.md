---
# ROOT BRIEF DISPATCHER — read this first, then go to the brief for your domain.
# This file is NOT a session brief. It is a routing table.
# A Claude Code session opens this file, reads its domain assignment, and
# loads the domain-specific brief. It does NOT execute from this file.
#
# HARD RULE: Engineering sessions must_not_touch 00_ARCHITECTURE/ 01_FACTS_LAYER/ 06_LEARNING_LAYER/
#            Governance sessions must_not_touch platform/src/ platform/tests/
# Any commit mixing both domains is a scope violation and must be split.
---

# CLAUDECODE_BRIEF — Session Router

## §1 — Domain map

| Domain | Brief location | Active? | Status |
|--------|---------------|---------|--------|
| Engineering (BHISMA / platform) | `platform/CLAUDECODE_BRIEF.md` | NO | PARTIAL-COMPLETE — Wave 2 code done; AC.W2.1 PARKED, AC.W2.3 DEFERRED |
| Governance / M4-D | `00_ARCHITECTURE/BRIEFS/CLAUDECODE_BRIEF_M4D_S1.md` | NO | COMPLETE — M4 CLOSED 2026-05-02; M5 INCOMING |
| Portal redesign | N/A | NO | COMPLETE 2026-04-30 (R0–R2, R4–R7 closed; R3 deferred) |

## §2 — Current active sessions (as of 2026-05-02)

**No active sessions.** All open workstreams have landed or been formally parked.

### Engineering domain — wave 2 summary
All 58 Wave 2 tasks complete. Commits: W2-BUGS (2cd3e12), W2-SCHEMA (8a14043),
W2-EVAL-A (731530b), W2-MANIFEST (a24d96d), W2-PLANNER (4628660),
W2-TRACE-A (77184e1), W2-INSTRUMENT (f1282a1), W2-TRACE-B (36d2ac0),
W2-EVAL-B (59d55ed), W2-CTX-ASSEMBLY (2fe3ba9).

Open items (require native authorization before next session):
- AC.W2.1 (LLM_FIRST_PLANNER_ENABLED): PARKED — Lever 3 model swap needs NAP.
  Lever 3 path: swap planner from NIM nemotron-49B → Claude Haiku/Flash.
- AC.W2.3 (NVIDIA_NIM_API_KEY + NVIDIA_PLANNER_ENABLED=true): DEFERRED — gated on Lever 3 NAP.

### Governance domain — M4/M5 summary
M4 CLOSED (commit 80d5c51, 2026-05-02). NAP.M4.7 APPROVED (pre-decided per brief;
retroactively ratified — see SESSION_LOG M4-D-S1 entry). M5 INCOMING.
Next governance session: **M5-S1** (first M5 session — read CURRENT_STATE_v1_0.md §2 for entry conditions).
must_not_touch for any M5 session: platform/src/**, platform/tests/**

## §3 — Parallel session protocol (anti-entanglement rules)

When running N sessions simultaneously:

1. **One domain per session.** Engineering OR governance — never both in the same
   session. If a task requires touching both, it must be two separate sessions
   with a handoff commit between them.

2. **Declare file locks at session open.** Every session emits `may_touch` and
   `must_not_touch` globs in its SESSION_OPEN artifact before any tool call.
   If two active briefs have overlapping `may_touch`, they cannot run simultaneously.

3. **Single-domain commits.** If an engineering session must append to SESSION_LOG.md
   at close, that is the ONE allowed governance-file exception. Nothing else.

4. **Branch naming encodes domain:**
   - `feature/w*`, `feature/bhisma-*` → Engineering
   - `feature/m*`, `feature/governance-*` → Governance
   Seeing both patterns in one branch is a red flag.

5. **Brief files live in their domain:**
   - Engineering briefs: `platform/CLAUDECODE_BRIEF.md` (one active brief at a time)
   - Governance briefs: `00_ARCHITECTURE/BRIEFS/CLAUDECODE_BRIEF_<SESSION_ID>.md`
   - Root CLAUDECODE_BRIEF.md: routing table only — never a session brief itself

6. **Status hygiene:** When a session closes, the last act is setting its brief
   `status: COMPLETE` (or PARKED/PARTIAL). A brief left at PENDING after its
   session runs is a false signal for all future sessions.

## §4 — Archived briefs

### W2-UQE-ACTIVATE (PARKED)
status: PARKED
reason: 8 smoke rounds — best result recall=0.750, precision=0.631 vs. thresholds 0.80/0.90.
lever_2_decision: classify() routing retained; LLM_FIRST_PLANNER_ENABLED stays false.
lever_3_path: swap planner model to Haiku/Flash — requires native authorization.
blocks: W2-MON-A (monitoring write integration smoke — gated on planner being live).
commit: 14e4b02

### W2-EVAL-A (COMPLETE)
status: COMPLETE
commit: 731530b
