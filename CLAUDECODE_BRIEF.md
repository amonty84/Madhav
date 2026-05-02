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
| Engineering (BHISMA / platform) | `platform/CLAUDECODE_BRIEF.md` | YES | PARTIAL — W2-CTX-ASSEMBLY queued |
| Governance / M4-D | `00_ARCHITECTURE/BRIEFS/CLAUDECODE_BRIEF_M4D_S1.md` | YES | PENDING — M4-D-S1 macro-phase close |
| Portal redesign | N/A | NO | COMPLETE 2026-04-30 (R0–R2, R4–R7 closed; R3 deferred) |

## §2 — Current active sessions (as of 2026-05-02)

### Engineering domain → go to platform/CLAUDECODE_BRIEF.md
Next session: **W2-CTX-ASSEMBLY**
Scope: author `platform/src/lib/synthesis/context_assembler.ts` + wire CONTEXT_ASSEMBLY_ENABLED flag.
AC.W2.1 (LLM planner) is PARKED. Execute AC.W2.2 only.
must_not_touch: 00_ARCHITECTURE/**, 01_FACTS_LAYER/**, 06_LEARNING_LAYER/**, .geminirules

### Governance domain → go to 00_ARCHITECTURE/BRIEFS/CLAUDECODE_BRIEF_M4D_S1.md
Next session: **M4-D-S1**
Scope: M4 macro-phase close — M4_CLOSE, REDTEAM_M4, HANDOFF_M4_TO_M5, CURRENT_STATE M4→M5.
Gate: NAP.M4.7 native approval (read 00_ARCHITECTURE/EVAL/NAP_M4_7_BRIEF_v1_0.md first).
must_not_touch: platform/src/**, platform/tests/**

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
