---
step: 9
title: CLAUDE.md rebuild (root governance surface)
version: 1.0
status: CURRENT
produced_in: STEP_0_GROUNDING (2026-04-23)
consumed_by: Step 10 (SESSION_LOG schema)
---

# STEP 9 — CLAUDE.md Rebuild

## 1. Objective

Rewrite `/Users/Dev/Vibe-Coding/Apps/Madhav/CLAUDE.md` from scratch against the new Macro Plan and the Integrity Protocol. The rebuild addresses every `UNREFERENCED-ARTIFACT` finding in the grounding audit, installs the canonical-paths import model, and adds the currently-executing marker that Step 0 only stubbed.

## 2. Inputs

**MUST read:**

1. The current CLAUDE.md (pre-rebuild)
2. STEP_LEDGER_v1_0.md
3. This brief
4. The new Macro Plan (current after Step 5)
5. `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md`
6. `CANONICAL_ARTIFACTS_v1_0.md`
7. `GROUNDING_AUDIT_v1_0.md` (findings GA.9, GA.10, GA.11, GA.19 are primary inputs)
8. `GOVERNANCE_INTEGRITY_REDTEAM_v1_0.md` (must show PASS/PASS_WITH_FIXES)
9. `AM_JIS_BOOTSTRAP_HANDOFF.md` — verify existence (per GA.8); if missing, decide whether to retire the reference or create a stub
10. `SESSION_OPEN_TEMPLATE_v1_0.md`, `SESSION_CLOSE_TEMPLATE_v1_0.md`

## 3. Deliverable

**File path:** `/Users/Dev/Vibe-Coding/Apps/Madhav/CLAUDE.md` (same path, replaces existing)

**Required sections (in this order):**

- **§A — Project mission.** One paragraph, lifted from the new Macro Plan's "Ultimate goal".
- **§B — Subject.** Native, birth data, canonical L1 reference.
- **§C — Mandatory reading (per session).** Ordered list. Replaces the current implicit ordering. Must include: the new Macro Plan, the active phase plan, CANONICAL_ARTIFACTS, GOVERNANCE_INTEGRITY_PROTOCOL, STEP_LEDGER if active, AM_JIS_BOOTSTRAP_HANDOFF (if verified to exist).
- **§D — Canonical artifacts (import).** One line: "Canonical artifact versions and paths are defined in `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md`. Do not duplicate declarations here." Then a cached snapshot of the table with a timestamp and hash — the snapshot is informational; CANONICAL_ARTIFACTS is authoritative.
- **§E — Concurrent workstreams.** Explicit callout of Life Event Log v1.2 and prospective prediction logging. LEL is now surfaced (closes GA.9).
- **§F — Current execution position marker.** A "You are here" block with: active macro-phase (M_N), active phase-plan expansion (B.N or equivalent), active governance step (Step_N of 0–15, or "governance-closed / Phase B execution") — with pointer to STEP_LEDGER_v1_0.md for the current-step source of truth.
- **§G — Session-open handshake reference.** One line: "Every session begins by emitting the SESSION_OPEN artifact per `00_ARCHITECTURE/SESSION_OPEN_TEMPLATE_v1_0.md`." 
- **§H — Session-close checklist reference.** One line: "Every session ends by emitting the SESSION_CLOSE artifact per `00_ARCHITECTURE/SESSION_CLOSE_TEMPLATE_v1_0.md`."
- **§I — Operating principles (summarized).** Pointer to architecture §B (full list) plus the five most-violated principles surfaced as inline bullets.
- **§J — Quality standard.** Acharya-grade statement, unchanged from current CLAUDE.md.
- **§K — Gemini collaboration.** Replace current ad-hoc clause with pointer to Integrity Protocol §K (disagreement protocol) and mirror discipline.
- **§L — Do-not list.** Unchanged wording from current, plus any new prohibitions surfaced by red-team (Step 8).
- **§M — Cadence.** Daily sessions, closed-artifact discipline, red-team every 3rd session.

## 4. Constraints

- DO NOT duplicate canonical artifact paths in CLAUDE.md. Every path lives in CANONICAL_ARTIFACTS_v1_0.md; CLAUDE.md references it.
- DO NOT restate the Macro Plan. Reference only.
- DO NOT inline the full Integrity Protocol. Reference only.
- DO NOT remove the AM_JIS_BOOTSTRAP_HANDOFF reference without first verifying and documenting what that file is and whether it is redundant with PROJECT_ARCHITECTURE_v2_1.md. If redundant, retire and note. If authoritative, keep and maintain.
- DO mirror any change to `.geminirules` in the same session (mirror_enforcer.py will fail close otherwise).

## 5. Discipline rules

- Closed artifact.
- Version: increment CLAUDE.md implicit version via a changelog at the bottom. Suggest adding a minimal frontmatter block.
- After the edit, run `drift_detector.py` and confirm it passes (baseline was established in Step 7/8; Step 9 should not regress).

## 6. Close criteria

- [ ] New CLAUDE.md exists at root path with all sections §A–§M
- [ ] Life Event Log is surfaced (GA.9 resolved)
- [ ] GOVERNANCE_STACK, MAINTENANCE, FALSIFIER, CONTRADICTION registries are surfaced or intentionally excluded with rationale (GA.10, GA.11)
- [ ] Currently-executing marker present (GA.19 resolved)
- [ ] CANONICAL_ARTIFACTS referenced as single source of truth (GA.1, GA.2 structurally resolved)
- [ ] drift_detector.py passes
- [ ] mirror_enforcer.py passes (.geminirules reflects new CLAUDE.md structure)
- [ ] STEP_LEDGER updated; SESSION_LOG appended

## 7. Handoff

- **Next step:** Step 10 (SESSION_LOG schema)
- **Files the next step will read:** new CLAUDE.md + SESSION_LOG.md

## 8. Red-team prompts

- "A fresh session in two months reads the new CLAUDE.md. Does it know (a) the current macro-phase, (b) the current step, (c) the canonical LEL version, (d) the session-open protocol?"
- "Diff new CLAUDE.md vs old — is any prior guardrail silently removed?"
