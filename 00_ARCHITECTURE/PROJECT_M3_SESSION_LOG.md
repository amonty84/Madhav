---
project: M3
version: 1.0
status: ACTIVE
created: 2026-05-01
description: >
  Macro-Phase M3 — Dasha Engine (Vimshottari + Yogini + Chara + Narayana),
  Transit Engine (date-indexed signal activation), Varshaphala + KP sublord timing,
  Temporal Validator + red-team + M3 close.
cowork_conversation: M3 (separate from BHISMA conversation)
entry_state: M2 CLOSED (KARN-W8-R2, 2026-05-01)
karn_wave_equivalent: KARN-W9 onwards (M3-open + M3-A through M3-D)
---

# PROJECT M3 — Session Log

## Naming Convention

### Pattern
```
M3-W{wave}-{SUBPHASE}-{DESCRIPTION}
```

| Field | Rule |
|---|---|
| `wave` | Sequential integer starting at **1**. Incremented at each sub-phase close (M3-A close = end of W1; M3-B close = end of W2; etc.). |
| `SUBPHASE` | `OPEN` \| `A{n}` \| `B{n}` \| `C{n}` \| `D{n}` — see sub-phase map below. |
| `DESCRIPTION` | SCREAMING-KEBAB-CASE, max 4 words, describes the session's primary deliverable. |

### Sub-phase map
*(Authoritative assignments finalized in `PHASE_M3_PLAN_v1_0.md`. Pre-plan illustrative
assignments updated here to match the plan at M3-W1-OPEN-PHASE-PLAN close.)*

| Sub-phase | Wave | Scope |
|---|---|---|
| OPEN | W1 | M3 phase plan authoring — no execution |
| A{n} | W1 | Discovery Engine Activation (Pattern + Contradiction Engines query-time) + DIS.009 disposition + eval baseline |
| B{n} | W2 | Temporal Foundation: Vimshottari + Yogini dasha calculators + Transit Engine v1 + date-indexed signal surface |
| C{n} | W3 | Multi-school Dasha (Chara + Narayana) + KP sublord timing + Varshaphala (Tajika) + Shadbala over time |
| D{n} | W4 | Temporal Validator + held-out sample + IS.8 red-team + M3 close |

### Examples
```
M3-W1-OPEN-PHASE-PLAN             ← Wave 1: author M3 phase plan; no engine work
M3-W1-A1-EVAL-BASELINE            ← Wave 1: baseline capture + DIS.009 written analysis
M3-W1-A2-PATTERN-ENGINE           ← Wave 1: Pattern Engine query-time activation
M3-W1-A3-CONTRADICTION-ENGINE     ← Wave 1: Contradiction Engine + synthesis-prompt amend
M3-W1-A4-DIS009-DISPOSITION       ← Wave 1: DIS.009 R1/R2/R3 native decision + M3-A close
M3-W2-B1-VIMSHOTTARI-ENGINE       ← Wave 2: Vimshottari dasha calculator + JH cross-check
M3-W2-B2-TRANSIT-ENGINE           ← Wave 2: Transit engine + date-indexed signal surface
M3-W3-C1-JAIMINI-DASHAS           ← Wave 3: Chara + Narayana dasha calculators
M3-W3-C2-KP-VARSHAPHALA           ← Wave 3: KP sublord timing + Varshaphala
M3-W3-C3-SHADBALA                 ← Wave 3: Shadbala over time + M3-C close
M3-W4-D1-VALIDATOR-REDTEAM        ← Wave 4: temporal validator + IS.8 red-team
M3-W4-D2-M3-CLOSE                 ← Wave 4: M3 sealing + handoff to M4
```

### Cowork thread naming
Cowork conversation threads use the same identifier as the Claude Code session:
`M3-W1-OPEN-PHASE-PLAN`, `M3-W1-A1-VIMSHOTTARI-ENGINE`, etc.

### Relationship to KARN
M3 is a macro-phase execution within the KARN framework. `PROJECT_KARN_SESSION_LOG.md`
receives a single entry at M3-W4-D2-M3-CLOSE (the M3 sealing session).
Individual sub-phase sessions write here only (not to the KARN log).

---

## Hard prerequisite: Eval baseline

Before any session that changes retrieval behavior (M3-W1-A1 or later), the eval
baseline must be captured:

```
python3 platform/scripts/eval/runner.py --planner-off \
  --output 00_ARCHITECTURE/EVAL/BASELINE_RUN_W9.json
```

If BHISMA-W1-S2-LLM-PIPELINE has already captured this baseline, M3 may use that
run. If not, M3-W1-A1 must capture it before any corpus or retrieval change.

Status: ☐ PENDING (captured by BHISMA-W1-S2 or M3-W1-A1, whichever runs first)

---

## Open item from M2: DIS.009

DIS.009 (PAT.008 D9 Karakamsa, `DIS.class.output_conflict`) is an open disagreement
carried from M2. Native decision gate: Q2 at M3-A close (after Dasha Engine is built
and D9 signals can be tested empirically).

See `DISAGREEMENT_REGISTER_v1_0.md` entry DIS.009 for full record.

---

## Wave 1 — M3-OPEN + Sub-phase A (Active)

**Entry state:** M2 CLOSED; CURRENT_STATE active_macro_phase = M3
**Governing handoff:** `00_ARCHITECTURE/HANDOFF_M2_TO_M3_v1_0.md`
**M3 phase plan:** `00_ARCHITECTURE/PHASE_M3_PLAN_v1_0.md` (authored in M3-W1-OPEN)

| Session ID | Sub-phase | Primary deliverable | Status | Closed date | Git SHA |
|---|---|---|---|---|---|
| M3-W1-OPEN-PHASE-PLAN | OPEN | PHASE_M3_PLAN_v1_0.md | CLOSED | 2026-05-01 | — |
| M3-W1-A1-EVAL-BASELINE | A | BASELINE_RUN_W9.json + DIS.009 analysis | PENDING | — | — |
| M3-W1-A2-PATTERN-ENGINE | A | Pattern Engine query-time activation | PENDING | — | — |
| M3-W1-A3-CONTRADICTION-ENGINE | A | Contradiction Engine + synthesis-prompt | PENDING | — | — |
| M3-W1-A4-DIS009-DISPOSITION | A | DIS.009 disposition + M3-A close | PENDING | — | — |

_Session IDs above reflect PHASE_M3_PLAN_v1_0.md §3.1 session estimates. Actual IDs finalized at each session open; pattern may compress A2/A3/A4 or expand further depending on scope._

---

## Session Entries

<!-- Sessions append their close block below in this format:

=== M3-W{n}-{SUBPHASE}-{DESCRIPTION} CLOSE ===
closed: YYYY-MM-DD
git_sha: {sha}
deliverables:
  - {file}: {action}
acceptance_criteria_passed: [...]
known_residuals:
  - {item}
notes: >
  {freeform}

-->

=== M3-W1-OPEN-PHASE-PLAN CLOSE ===
closed: 2026-05-01
git_sha: "—"
session_agent: claude-sonnet-4-6
cowork_thread_name: "M3-W1-OPEN-PHASE-PLAN"
predecessor_session: KARN-W8-R2-M2-CLOSE
deliverables:
  - 00_ARCHITECTURE/PHASE_M3_PLAN_v1_0.md: "accepted as sole deliverable (authored by KARN-W9-M3-OPEN = this session)"
  - 00_ARCHITECTURE/PROJECT_M3_SESSION_LOG.md: "sub-phase map updated to match plan; Wave 1 table updated; this close block appended"
  - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md: "amended in-place — active_phase_plan set; last_session and next_session updated; §3 narrative refreshed; changelog entry added"
  - .gemini/project_state.md: "active phase plan pointer (MP.4 adapted parity) updated"
acceptance_criteria_passed:
  - "PHASE_M3_PLAN_v1_0.md exists with sub-phases M3-A through M3-D (scope + deliverables + ACs per sub-phase)"
  - "Eval-baseline gate declared as hard prerequisite for M3-A entry (§0 + AC.M3A.1)"
  - "DIS.009 disposition decision point noted at M3-A close (AC.M3A.4)"
  - "No M3-A execution begun — plan only"
  - "mirror_enforcer exit=0 (8/8 clean)"
  - "CURRENT_STATE updated"
  - "PROJECT_M3_SESSION_LOG close block appended"
governance_scripts:
  mirror_enforcer: "exit=0 (8/8 pairs clean)"
  drift_detector: "exit=2 (259 findings — pre-existing carry-forward, no new regressions)"
  schema_validator: "exit=2 (100 violations — pre-existing carry-forward, no CRITICAL)"
red_team_due: false
red_team_performed: false
red_team_counter_after: 0  # plan-only session; not incremented
known_residuals:
  - "BASELINE_RUN_W9.json not yet captured — hard gate for M3-A retrieval-affecting work (M3-W1-A1 scope)"
  - "DIS.009 not yet dispositioned — decision gate at M3-A close"
  - "CAPABILITY_MANIFEST entry_count +3 latent miscount — carry-forward from M2 (M3-A manifest-audit pass)"
  - "SIG.MSR.207 absent from MSR_v3_0.md — carry-forward from M2 (M3-A read-only investigation)"
  - "drift_detector 259 findings + schema_validator 100 violations — all pre-existing carry-forward"
  - "sub-phase illustrative session IDs in examples table are estimates; finalized at each session open"
notes: >
  Plan-only session. PHASE_M3_PLAN_v1_0.md was already present (authored by KARN-W9-M3-OPEN,
  which is the KARN-system session name for this M3 naming-convention session M3-W1-OPEN-PHASE-PLAN).
  Both names refer to the same conceptual session; the plan is the deliverable.
  Sub-phase assignments in PROJECT_M3_SESSION_LOG illustrative table updated to match the plan
  (M3-A = Discovery Engine, not Dasha Engine as the pre-plan illustrative had suggested).
  SESSION_LOG explicitly defers to PHASE_M3_PLAN for session ID finalization — this update
  closes the naming gap. Next session: M3-W1-A1-EVAL-BASELINE.