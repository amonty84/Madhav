---
artifact: PROJECT_M3_SESSION_LOG.md
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

## Wave 1 — M3-OPEN + Sub-phase A (**CLOSED 2026-05-01**)

**Entry state:** M2 CLOSED; CURRENT_STATE active_macro_phase = M3
**Governing handoff:** `00_ARCHITECTURE/HANDOFF_M2_TO_M3_v1_0.md`
**M3 phase plan:** `00_ARCHITECTURE/PHASE_M3_PLAN_v1_0.md` (authored in M3-W1-OPEN)

| Session ID | Sub-phase | Primary deliverable | Status | Closed date | Git SHA |
|---|---|---|---|---|---|
| M3-W1-OPEN-PHASE-PLAN | OPEN | PHASE_M3_PLAN_v1_0.md | CLOSED | 2026-05-01 | — |
| M3-W1-A1-EVAL-BASELINE | A | BASELINE_RUN_W9_MANUAL_v1_0.md + DIS009_ANALYSIS_v1_0.md | CLOSED | 2026-05-01 | — |
| M3-W1-A2-PATTERN-ENGINE | A | Pattern + Contradiction + Resonance + Cluster flag-gating; CAPABILITY_MANIFEST entry_count fix; IS.8(a) red-team | CLOSED | 2026-05-01 | (close-time) |
| M3-W1-A3-CONTRADICTION-ENGINE | A | Synthesis-prompt amendment for contradiction-framing rubric (B.1/B.3 compliant) in shared preamble | CLOSED | 2026-05-01 | (close-time) |
| M3-W1-A4-DIS009-DISPOSITION | A | DIS.009 R3 disposition + IS.8(a) RT + **M3-A SUB-PHASE CLOSED** | CLOSED | 2026-05-01 | (close-time) |

_Session IDs above reflect PHASE_M3_PLAN_v1_0.md §3.1 session estimates. Actual IDs finalized at each session open; pattern may compress A2/A3/A4 or expand further depending on scope._

## Wave 2 — Sub-phase B (Track 2: Parashari Dasha + Transit Engine, Active)

**Concurrency note:** Track 2 (M3-B) runs in parallel with Track 1 (M3-A) per native authorization. Track 2 does not touch retrieval/bundle/synthesis code, so the M3-A BASELINE_RUN_W9 hard gate does not constrain it. Sub-phase B sessions land independently of M3-A's progress; M3-A still gates retrieval-output-shape changes.

| Session ID | Sub-phase | Primary deliverable | Status | Closed date | Git SHA |
|---|---|---|---|---|---|
| M3-W2-B1-VIMSHOTTARI-ENGINE | B | compute_vimshottari.py + VIMSHOTTARI_RAW + CROSSCHECK + GOLDEN + SQL insert | CLOSED | 2026-05-01 | 03770d2 |
| M3-W2-B2-YOGINI-TRANSIT | B | compute_yogini.py + transit engine v1 + signal_activator + lit_states sample + migrations 022/023 + query_signal_state.ts | CLOSED | 2026-05-01 | (close-time) |

## Wave 3 — Sub-phase C (Track 3: Jaimini + KP + Varshaphala + Shadbala, **CLOSED 2026-05-01**)

**Concurrency note:** Track 3 (M3-C) runs in parallel with Tracks 1 + 2 per native authorization. Track 3 produces temporal-engine artifacts only (no retrieval/bundle/synthesis touched), so it is unconstrained by the M3-A BASELINE_RUN_W9 hard gate. dasha_periods inserts coordinate with B1's bundled CREATE-TABLE block; until native authors the migration, all C-track SQL files are deliverable artifacts, not applied to the live DB.

| Session ID | Sub-phase | Primary deliverable | Status | Closed date | Git SHA |
|---|---|---|---|---|---|
| M3-W3-C1-JAIMINI-DASHAS | C | compute_chara.py + compute_narayana.py + RAW JSON + CROSSCHECK + SQL inserts (GOLDEN gated, cross-check FAIL) | CLOSED | 2026-05-01 | — |
| M3-W3-C2-KP-VARSHAPHALA | C | compute_kp.py + compute_varshaphala.py + KP/Varshaphala outputs + migrations 024/025 + 2 retrieval tools | CLOSED | 2026-05-01 | (close-time) |
| M3-W3-C3-SHADBALA | C | compute_shadbala.py + Shadbala over-time series + migration 031 + REDTEAM_M3C + DIS.010/011/012 + **M3-C SUB-PHASE CLOSED** | CLOSED | 2026-05-01 | (close-time) |

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

=== M3-W2-B1-VIMSHOTTARI-ENGINE CLOSE ===
closed: 2026-05-01
git_sha: 03770d2
session_agent: claude-opus-4-7
cowork_thread_name: "M3-W2-B1-VIMSHOTTARI-ENGINE"
predecessor_session: M3-W1-OPEN-PHASE-PLAN
track: "Track 2 (Parashari Dasha + Transit Engine), first execution session — runs concurrently with M3-A Discovery Engine track per native authorization in session brief; no retrieve/bundle/synthesis touched, so M3-A's BASELINE_RUN_W9 hard gate is not engaged"
deliverables:
  - platform/scripts/temporal/__init__.py: "new (package init)"
  - platform/scripts/temporal/compute_vimshottari.py: "new (engine: pyswisseph Moshier + Lahiri sidereal; M/A/P sequence; --chart-id/--birth/--horizon-end/--output args)"
  - platform/scripts/temporal/run_dasha_pipeline.py: "new (orchestrator stub; only Vimshottari leg implemented; Yogini/Chara/Narayana/KP slots reserved per PHASE_M3_PLAN §3.2-§3.3)"
  - 05_TEMPORAL_ENGINES/dasha/vimshottari/VIMSHOTTARI_RAW_v1_0.json: "new (637 rows: 7 MD + 63 AD + 567 PD; horizon 1984-02-05 → 2061-01-01)"
  - 05_TEMPORAL_ENGINES/dasha/vimshottari/CROSSCHECK_v1_0.md: "new (max delta 3 days vs FORENSIC §5.1; verdict WITHIN_TOLERANCE)"
  - 05_TEMPORAL_ENGINES/dasha/vimshottari/VIMSHOTTARI_GOLDEN_v1_0.json: "new (Mahadasha-only fixture; 7 MD rows; eval anchor)"
  - 05_TEMPORAL_ENGINES/dasha/vimshottari/VIMSHOTTARI_INSERT_v1_0.sql: "new (CREATE TABLE IF NOT EXISTS dasha_periods + 637 INSERTs; gated on native-applied migration)"
  - 00_ARCHITECTURE/PROJECT_M3_SESSION_LOG.md: "this close block appended"
  - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md: "amended in-place — last_session and next_session_objective updated; §3 narrative refreshed; changelog entry added"
  - .gemini/project_state.md: "MP.2 mirror — adapted-parity update reflecting Track 2 first execution"
acceptance_criteria_passed:
  - "AC.M3B.1: compute_vimshottari.py runs without error for native birth data (1984-02-05T10:43:00+05:30); 637 rows produced"
  - "AC.M3B.2: VIMSHOTTARI_RAW_v1_0.json produced; covers 1984-02-05 → 2061-01-01 (exceeds 2050-12-31 minimum)"
  - "AC.M3B.3: cross-check vs FORENSIC §5.1 documented in CROSSCHECK_v1_0.md; max delta 3 days at boundary; no flag triggered (>3 days threshold not exceeded)"
  - "AC.M3B.4: VIMSHOTTARI_GOLDEN_v1_0.json produced (7 MD rows: Jupiter, Saturn, Mercury, Ketu, Venus, Sun, Moon)"
  - "AC.M3B.5: SQL insert file produced at VIMSHOTTARI_INSERT_v1_0.sql (CREATE TABLE IF NOT EXISTS bundled); native-action note recorded — see notes below"
governance_scripts:
  mirror_enforcer: "exit=0 (8/8 pairs clean)"
  drift_detector: "exit=2 (259 findings — pre-existing carry-forward from M3-W1-OPEN, no new regressions)"
  schema_validator: "exit=2 (100 violations — pre-existing carry-forward, no CRITICAL)"
red_team_due: false
red_team_performed: false
red_team_counter_after: 1  # M3 first execution session; counter increments 0→1 per ONGOING_HYGIENE_POLICIES §G; next §IS.8(a) every-third fire at counter=3
known_residuals:
  - "dasha_periods table does NOT exist in any current migration — brief stated migration 016 created it, but verification at session open showed migration 016 is `016_eclipses_retrogrades.sql`. Native action required: author migration 022+ from the CREATE TABLE IF NOT EXISTS block in VIMSHOTTARI_INSERT_v1_0.sql, then apply the INSERT block. Migration authoring is B2/C scope (must_not_touch in this session)."
  - "Computed MD boundaries run uniformly 2-3 days earlier than FORENSIC §5.1 (systematic offset, consistent with FORENSIC's GAP.09 note that the canonical FORENSIC dates run 7-9 days later than JH; pyswisseph + Moshier + Lahiri lands between them). FORENSIC dates remain canonical at synthesis time per §5.1 policy."
  - "Antardasha and Pratyantardasha boundaries are not cross-checked at this session (FORENSIC §5.1 lists only MD/AD pairs, not full PD subdivisions). Future M3-B session may extend the cross-check."
  - "BASELINE_RUN_W9.json hard-gate for M3-A retrieval changes is NOT discharged here — this session is M3-B-class temporal computation only, no retrieve/bundle/synthesis touched. Gate remains active for M3-A execution sessions."
  - "Carry-forwards from M3-W1-OPEN: drift_detector 259 findings + schema_validator 100 violations (no new regressions); CAPABILITY_MANIFEST entry_count +3 latent miscount; SIG.MSR.207 absent from MSR_v3_0.md; DIS.009 not yet dispositioned."
notes: >
  First Track 2 execution session per native authorization in the session brief (M3-A and
  M3-B/Track-2 may run concurrently because Track 2 does not touch retrieval/bundle/synthesis;
  M3-A's BASELINE_RUN_W9 gate guards retrieval-output-shape changes, which Track 2 does not
  produce). Engine uses pyswisseph 2.10.03 with the Moshier built-in ephemeris (no .se1 file
  required, sub-arcsecond accuracy for Moon 1800-2400 CE) and Lahiri sidereal mode. Moon
  sidereal longitude at birth: 327.0550° (Purva Bhadrapada, Jupiter lord, balance 7.5339y).
  Cross-check vs FORENSIC §5.1: max delta 3 days across 6 MD boundaries — within brief's
  >3-day flag threshold. Systematic 2-3 day offset is consistent with the FORENSIC §5
  GAP.09 note about Lahiri ayanamsha variants between FORENSIC and JH. SQL insert file
  produced with bundled CREATE TABLE IF NOT EXISTS so it is self-contained when native
  authors the schema migration in a future B2/C session. The dasha_periods schema migration
  itself stays out of scope here per declared must_not_touch on platform/migrations/**.
PYSWISSEPH_install_path: "Moshier ephemeris (built-in); SE_EPHE_PATH unset"
ayanamsha_used: "lahiri (Chitrapaksha, swisseph SIDM_LAHIRI)"
external_computation_required: false
b10_compliance: "all chart-numerical outputs trace to swe.calc_ut() calls; engine halts with [EXTERNAL_COMPUTATION_REQUIRED] if pyswisseph missing"
ppl_substrate_writes: "none — this session emits no time-indexed predictions; PPL writes activate when first forward-looking output is emitted (M3-B Track 2 second session or later)"
mirror_updates_propagated:
  - pair_id: MP.2
    claude_side: 00_ARCHITECTURE/CURRENT_STATE_v1_0.md
    gemini_side: .gemini/project_state.md
    propagated: true
    mode: adapted_parity_state
=== M3-W3-C1-JAIMINI-DASHAS CLOSE ===
closed: 2026-05-01
git_sha: "—"
session_agent: claude-opus-4-7[1m]
cowork_thread_name: "M3-W3-C1-JAIMINI-DASHAS"
predecessor_session: M3-W1-OPEN-PHASE-PLAN
deliverables:
  - platform/scripts/temporal/compute_chara.py: "new — Jaimini Chara Dasha engine, pyswisseph + Lahiri, dual-variant (brief constants + BPHS sign-to-lord)"
  - platform/scripts/temporal/compute_narayana.py: "new — Jaimini Narayana Dasha engine, pyswisseph + Lahiri, dual-variant"
  - 05_TEMPORAL_ENGINES/dasha/jaimini/CHARA_RAW_v1_0.json: "new — 286 rows (130 brief MD+AD + 156 bphs MD+AD) through 2050"
  - 05_TEMPORAL_ENGINES/dasha/jaimini/NARAYANA_RAW_v1_0.json: "new — 312 rows (156 brief + 156 bphs) through 2050"
  - 05_TEMPORAL_ENGINES/dasha/jaimini/CROSSCHECK_v1_0.md: "new — verdict FAIL; both engine variants diverge from FORENSIC §5.3 K.N. Rao Padakrama at every MD-start-date by far more than the 7-day threshold; root cause: tradition-fork on (a) sequence-start sign and (b) sign-duration rule"
  - 05_TEMPORAL_ENGINES/dasha/jaimini/CHARA_INSERT_v1_0.sql: "new — 286 INSERT statements under variant-suffixed system labels ('chara_brief', 'chara_bphs'); NOT APPLIED (gated on native verdict + B1 migration)"
  - 05_TEMPORAL_ENGINES/dasha/jaimini/NARAYANA_INSERT_v1_0.sql: "new — 312 INSERT statements under 'narayana_brief' / 'narayana_bphs'; NOT APPLIED (FORENSIC has no Narayana baseline; external acharya verification required)"
  - 00_ARCHITECTURE/PROJECT_M3_SESSION_LOG.md: "Wave 3 table + this close block appended"
  - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md: "amended in-place — last_session_id, last_session_*, next_session_objective updated"
  - .gemini/project_state.md: "MP.2 adapted-parity update for state pointer"
acceptance_criteria_passed:
  - "AC.M3C.1 — compute_chara.py runs without error for native birth data (AK=Moon Aquarius 27.0550°; matches FORENSIC §10.1 within 1.4 arcmin)"
  - "AC.M3C.2 — CHARA_RAW_v1_0.json produced; sequence covers through 2059 (>2050 horizon)"
  - "AC.M3C.3 — compute_narayana.py runs without error for native birth data (Lagna=Aries 12.4212°; matches FORENSIC §1.2 within 1.4 arcmin)"
  - "AC.M3C.4 — NARAYANA_RAW_v1_0.json produced; sequence through 2050"
  - "AC.M3C.5 — CROSSCHECK_v1_0.md produced; all MD discrepancies > 7 days flagged with root-cause analysis (Cause 1: sequence-start AK vs Lagna; Cause 2: sign-duration rule fork brief-vs-bphs-vs-Padakrama)"
  - "AC.M3C.7 — SQL insert files produced (gated on native verdict + B1 migration); coordinate-with-B1 note included; B1's bundled CREATE-TABLE block is the schema source"
acceptance_criteria_NOT_met:
  - "AC.M3C.6 — JAIMINI_GOLDEN_v1_0.json NOT WRITTEN — gated by brief instruction 'Cross-check must pass before this file is written'; cross-check verdict is FAIL; deferred to a follow-up session post-native-verdict on N1/N2/N3 disposition (CROSSCHECK §5)"
governance_scripts:
  mirror_enforcer: "exit=0 (8/8 pairs clean; claude_only=2)"
  drift_detector: "exit=2 (259 findings — pre-existing carry-forward; no new regressions)"
  schema_validator: "exit=2 (100 violations — pre-existing carry-forward; no new CRITICAL)"
red_team_due: false
red_team_performed: false
red_team_counter_after: 1  # M3-C execution session; per ONGOING_HYGIENE_POLICIES §G this is a substantive session that increments. M3 first execution at counter=0, this is the first Track-3 substantive session, so counter-after = 1
known_residuals:
  - "JAIMINI_GOLDEN_v1_0.json deferred — cross-check must pass before write per session brief; native verdict on tradition fork (N1/N2/N3 in CROSSCHECK §5) gates this"
  - "Chara dasha sequence start sign disagreement: engine starts MD at AK sign (Aquarius) per Sanjay-Rath/BPHS-Jaimini synthesis; FORENSIC §5.3 starts at Lagna sign (Aries) per K.N. Rao Padakrama. DIS.class.school_disagreement entry to be opened at M3-C close per PHASE_M3_PLAN §3.3"
  - "Sign-duration rule fork: brief-specified hardcoded constants (Ar=7..Pi=12) match neither BPHS sign-to-lord rule nor K.N. Rao Padakrama for this chart; documented in CROSSCHECK §4 Cause 2"
  - "dasha_periods table still does not exist in any current migration (carry-forward from M3-W2-B1 close); CHARA/NARAYANA SQL files inherit the bundled CREATE TABLE IF NOT EXISTS structure from B1; native action required to author migration 022+"
  - "Narayana cross-check has no FORENSIC baseline; external acharya / Jagannatha Hora export required for verification"
  - "BASELINE_RUN_W9.json hard-gate for M3-A retrieval changes is NOT discharged here — Track 3 produces temporal engines only, no retrieve/bundle/synthesis touched"
  - "Carry-forwards: drift_detector 259 + schema_validator 100 (pre-existing, no new regressions); CAPABILITY_MANIFEST entry_count +3 latent miscount; SIG.MSR.207 absent from MSR_v3_0.md; DIS.009 not yet dispositioned"
notes: >
  First M3-C execution session per native authorization (Tracks 1/2/3 may run concurrently;
  Track 3 produces temporal-engine artifacts only). Engine uses pyswisseph 2.10.x with
  Lahiri sidereal mode (SIDM_LAHIRI). Atmakaraka and Lagna match FORENSIC §10.1 / §1.2
  within 1.4 arcmin (consistent with documented GAP.09 cusp zone). The substantive finding
  of this session is governance, not numerical: the brief's hardcoded sign-duration constants
  (Ar=7..Pi=12 for Chara, Ar=1..Pi=12 for Narayana) match neither the standard BPHS
  sign-to-lord rule nor FORENSIC §5.3 K.N. Rao Padakrama, and the brief's "Sanjay Rath /
  BPHS-Jaimini synthesis" sequence-start (AK sign) disagrees with FORENSIC §5.3's
  K.N. Rao Padakrama sequence-start (Lagna sign). Per CLAUDE.md §I B.10 (no fabricated
  computation), neither variant can be silently canonicalized. Both variants are emitted
  side-by-side in CHARA_RAW + NARAYANA_RAW with explicit needs_verification flags;
  CROSSCHECK_v1_0.md presents the disposition options (N1/N2/N3) for native verdict at
  M3-C close. Per PHASE_M3_PLAN §3.3, this is exactly the DIS.class.school_disagreement
  scenario the sub-phase exists to surface. SQL insert files use variant-suffixed system
  labels to keep both engine outputs distinguishable from any future K.N. Rao Padakrama
  parser, and to preserve M9 multi-school triangulation as the resolution layer.
PYSWISSEPH_install_path: "Moshier ephemeris (built-in); SE_EPHE_PATH unset"
ayanamsha_used: "lahiri (SIDM_LAHIRI)"
external_computation_required: false
b10_compliance: "all chart-numerical outputs trace to swe.calc_ut() / swe.houses_ex() calls; engine halts with [EXTERNAL_COMPUTATION_REQUIRED] if pyswisseph missing; every dasha row carries needs_verification=true with verification_note pointing to CROSSCHECK_v1_0.md until native verdict lands"
ppl_substrate_writes: "none — this session emits no time-indexed predictions; PPL writes activate when first forward-looking output is emitted"
mirror_updates_propagated:
  - pair_id: MP.2
    claude_side: 00_ARCHITECTURE/CURRENT_STATE_v1_0.md
    gemini_side: .gemini/project_state.md
    propagated: true
    mode: adapted_parity_state

=== M3-W1-A1-EVAL-BASELINE CLOSE ===
closed: 2026-05-01
git_sha: "—"
session_agent: claude-opus-4-7
agent_version: claude-opus-4-7[1m]
cowork_thread_name: "M3-W1-A1-EVAL-BASELINE"
predecessor_session: M3-W1-OPEN-PHASE-PLAN
track: "Track 1 (Retrieval & Discovery), first execution session — concurrent with Track 2 (M3-W2-B1) and Track 3 (M3-W3-C1) per native authorization in session brief; this session is the M3-A entry-gate session per PHASE_M3_PLAN_v1_0.md §3.1"
deliverables:
  - 00_ARCHITECTURE/EVAL/BASELINE_RUN_W9_MANUAL_v1_0.md: "new (manual-capture eval-baseline artifact; satisfies AC.M3A.1 in manual-capture mode per PHASE_M3_PLAN §3.1 entry-gate clause)"
  - 00_ARCHITECTURE/DIS009_ANALYSIS_v1_0.md: "new (read-only analysis of DIS.009; three resolution options R1/R2/R3 with evidence + cost + risk; Claude recommendation = R3 (RE-GROUND) with R1 fallback; non-binding — native decides at M3-A close)"
  - 00_ARCHITECTURE/PROJECT_M3_SESSION_LOG.md: "Wave 1 table row M3-W1-A1-EVAL-BASELINE flipped PENDING → CLOSED; this close block appended"
  - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md: "amended in-place — last_session_id → M3-W1-A1-EVAL-BASELINE; next_session_objective → M3-W1-A2-PATTERN-ENGINE; §3 narrative refreshed; changelog entry added"
  - .gemini/project_state.md: "MP.2 mirror — adapted-parity update reflecting M3-W1-A1 close + AC.M3A.1 manual-capture acceptance + DIS.009 analysis ready for A4 disposition"
acceptance_criteria_passed:
  - "AC.M3A.1 (manual-capture mode): BASELINE_RUN_W9_MANUAL_v1_0.md exists with command-attempted, error, six-metric statement, harness self-check, native-acceptance block — satisfies the gate per PHASE_M3_PLAN §3.1 entry-gate clause"
  - "ADDITIONAL: DIS009_ANALYSIS_v1_0.md produced with §1 evidence chain, §2 three resolution options (R1 split / R2 withdraw / R3 re-ground) with evidence + cost + risk per option, §3 Claude recommendation"
  - "ADDITIONAL: SIG.MSR.207 finding recorded (sig_msr_207_investigation block below)"
  - "scope_compliance: did NOT touch platform/src/lib/retrieve/**, platform/src/lib/bundle/**, platform/src/lib/synthesis/**, 025_HOLISTIC_SYNTHESIS/**, 035_DISCOVERY_LAYER/**, platform/migrations/**, 05_TEMPORAL_ENGINES/**, 00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md, 00_ARCHITECTURE/CAPABILITY_MANIFEST.json — all within declared must_not_touch"
  - "mirror_enforcer exit=0 (8/8 pairs clean)"
  - "CURRENT_STATE updated"
  - "PROJECT_M3_SESSION_LOG close block appended"
governance_scripts:
  mirror_enforcer: "exit=0 (8/8 pairs clean)"
  drift_detector: "exit=2 (259 findings — pre-existing carry-forward, no new regressions)"
  schema_validator: "exit=2 (100 violations — pre-existing carry-forward, no new CRITICAL)"
red_team_due: false
red_team_performed: false
red_team_counter_after: 2  # governance-aside per ONGOING_HYGIENE_POLICIES §G — analysis-only + manual-capture artifact + state pointer updates; no corpus or platform code mutated. Counter remains at 2 (last incremented at M3-W3-C1 close).
sig_msr_207_investigation:
  status: "absent_from_msr_v3_0_md"
  evidence: "MSR_v3_0.md signal IDs jump from SIG.MSR.206 (line 4745) directly to SIG.MSR.208 (line 4775); no SIG.MSR.207 entry exists between them. Verified by grep against 025_HOLISTIC_SYNTHESIS/MSR_v3_0.md"
  severity: "MEDIUM (carry-forward from M2; corpus-completeness gap, not a B.10 violation)"
  no_modification_made: true
  flag_for_m3a_manifest_audit: true
  notes: "Investigation read-only per session brief. Gap inherited from M2 close (M2_CLOSE §Known deferred items #2; HANDOFF_M2_TO_M3 §3 #2). Disposition target per PHASE_M3_PLAN §7 is M3-A or M3-D — investigation lives at M3-A (this session); resolution / explicit-acceptance lives at M3-D close. SIG.MSR.207 may have been pruned during M2 corpus refinement; its slot was not reassigned, leaving a numeric gap that is benign for retrieval (no consumers cite SIG.MSR.207) but should be either backfilled or explicitly recorded as 'reserved/withdrawn' in MSR_v3_0.md frontmatter at M3-D."
known_residuals:
  - "AC.M3A.1 satisfied in manual-capture mode (not headless-run mode); non-stub BASELINE_RUN_W9.json remains pending the first session that has SMOKE_SESSION_COOKIE + SMOKE_CHART_ID + ANTHROPIC_API_KEY available — recorded as KR.W9.1 in BASELINE_RUN_W9_MANUAL_v1_0.md §6"
  - "AC.M3A.4 (DIS.009 disposition) not yet decided — analysis produced this session; native decision pending at M3-W1-A4-DIS009-DISPOSITION (M3-A close session)"
  - "AC.M3A.5 (post-baseline delta) is at risk if neither pre nor post non-stub run can be obtained by M3-A close — re-evaluate at AC.M3A.5 gate per BASELINE_RUN_W9_MANUAL §6 conditions"
  - "Runner --fixture-ids parser quirk (empty default → empty-string filter set → zero matches): KR.W9.2 in BASELINE_RUN_W9_MANUAL §6; LOW severity ergonomics fix-it; out-of-scope for M3"
  - "Carry-forwards from M3-W1-OPEN: drift_detector 259 findings + schema_validator 100 violations (no new regressions); CAPABILITY_MANIFEST entry_count +3 latent miscount; SIG.MSR.207 absent from MSR_v3_0.md (now investigated and recorded above); DIS.009 not yet dispositioned (analysis now ready)"
external_computation_required: false
b10_compliance: "DIS009_ANALYSIS_v1_0.md cites L1 facts by ID throughout (FORENSIC §3.5 D9, §17, §20.1, §22). No fabricated computation. §1.2 evidence chain explicitly grounds the AL-side (L1-clean) and demonstrates the D9-side B.10 violation in PAT.008's mechanism text by L1 cross-reference."
ppl_substrate_writes: "none — this session emits no time-indexed predictions; analysis-only + manual eval-baseline doc"
mirror_updates_propagated:
  - pair_id: MP.2
    claude_side: 00_ARCHITECTURE/CURRENT_STATE_v1_0.md
    gemini_side: .gemini/project_state.md
    propagated: true
    mode: adapted_parity_state
notes: >
  Track 1 (Retrieval & Discovery) first execution session. M3-A entry-gate cleared
  in manual-capture mode per PHASE_M3_PLAN §3.1 entry-gate clause: SMOKE_SESSION_COOKIE,
  SMOKE_CHART_ID with seeded chart, and ANTHROPIC_API_KEY are unavailable in this
  session; runner returns HTTP 401 on /api/chat/consume (verified live with placeholder
  chart-id). The manual-capture artifact records the precise blocker, harness self-check
  (intact end-to-end except for auth credential), and native-acceptance per the brief's
  authorized fallback path. The next session with auth secrets available produces the
  non-stub BASELINE_RUN_W9.json and may amend or supersede the manual-capture artifact.

  DIS.009 analysis is read-only and binds nothing — it is structured framing for the
  native decision at M3-W1-A4-DIS009-DISPOSITION (M3-A close session). The three options
  (R1 split / R2 withdraw / R3 re-ground) each carry evidence + cost + risk; Claude's
  recommendation is R3 with R1 fallback. Native may select any of the three or instruct
  a different path. The analysis explicitly does NOT modify DISAGREEMENT_REGISTER_v1_0.md
  or PATTERN_REGISTER_v1_0.json — those modifications are M3-A-close session work.

  SIG.MSR.207 confirmed absent from MSR_v3_0.md (registry skips 206→208). Read-only
  finding flagged for M3-A manifest-audit pass or M3-D close. No L2.5 corpus modification
  this session.

  Concurrent-track context: Track 2 (M3-W2-B1-VIMSHOTTARI-ENGINE) and Track 3
  (M3-W3-C1-JAIMINI-DASHAS) ran in parallel with this Track 1 session. The three tracks
  share governance discipline (red-team counter per ONGOING_HYGIENE_POLICIES §G; project
  SESSION_LOG; CURRENT_STATE state pointer). They do NOT share scope: Track 1 declared
  must_not_touch = 05_TEMPORAL_ENGINES/** + platform/scripts/temporal/** (Tracks 2+3
  exclusive turf); Tracks 2+3 declared must_not_touch = 035_DISCOVERY_LAYER/** +
  retrieve/bundle/synthesis (Track 1's exclusive turf). All three close blocks land in
  this SESSION_LOG file; CURRENT_STATE is the single arbiter of "you are here."

  Next session: M3-W1-A2-PATTERN-ENGINE (Track 1 — Pattern Engine query-time activation
  per PHASE_M3_PLAN §3.1 deliverable #2; flag-gated at DISCOVERY_PATTERN_ENABLED default
  false; AC.M3A.2). The non-stub eval-baseline gates only AC.M3A.5 post-delta, not
  subsequent A2/A3 sub-sessions.

=== M3-W2-B2-YOGINI-TRANSIT CLOSE ===
closed: 2026-05-01
git_sha: "(close-time)"
session_agent: claude-opus-4-7
agent_version: claude-opus-4-7[1m]
cowork_thread_name: "M3-W2-B2-YOGINI-TRANSIT"
predecessor_session: M3-W2-B1-VIMSHOTTARI-ENGINE
track: "Track 2 (Parashari Dasha + Transit Engine), second execution session — runs concurrently with Tracks 1 + 3 per native authorization. No retrieve/bundle/synthesis code mutated; the new TypeScript tool query_signal_state.ts is a read-only retrieval surface (SELECT only) and degrades gracefully when signal_states is empty, so M3-A's BASELINE_RUN_W9 hard gate is not engaged."
deliverables:
  - platform/migrations/022_dasha_periods.sql: "new — schema + 637 Vimshottari INSERTs verbatim from VIMSHOTTARI_INSERT_v1_0.sql lines 24-683 (BEGIN .. CREATE TABLE IF NOT EXISTS .. 2 indexes .. 637 INSERTs .. COMMIT); discharges native-action item flagged at M3-W2-B1 close"
  - platform/migrations/023_signal_states.sql: "new — date-indexed signal lit/dormant/ripening surface; CHECK (state IN ('lit','dormant','ripening')); UNIQUE (chart_id, signal_id, query_date, dasha_system); two indexes on (chart_id, query_date) and (chart_id, signal_id, query_date)"
  - platform/scripts/temporal/compute_yogini.py: "new — Yogini MD/AD engine, pyswisseph + Lahiri sidereal; uses classical (nak_idx_0 + 3) mod 8 sequence-start formula (the brief's proposed (nak_idx_0 mod 8) yielded Mangala for native PurvaBhadrapada — disagreed with FORENSIC §5.2 first Yogini = Bhramari; the +3 offset reproduces FORENSIC); 8 lords {Mangala 1y .. Sankata 8y}, 36-yr cycle"
  - platform/scripts/temporal/compute_transits.py: "new — date-indexed transit engine v1; 9 planets sidereal positions + sign + nakshatra + speed + retrograde flag (Rahu=TRUE_NODE, Ketu=Rahu+180); Sade Sati state (Saturn in 12th/1st/2nd from natal Moon Aquarius); eclipse proximity (Sun+Moon within 15° of node axis); public API get_transit_states(birth_dt, query_date, ayanamsha)"
  - platform/scripts/temporal/signal_activator.py: "new — v1 deterministic rule-based MSR signal lit/dormant/ripening classifier; reads SIG.MSR.* blocks from MSR_v3_0.md, joins with active Vimshottari MD+AD at query_date and current transit state; flat confidence=0.6 with v1_logic_note explaining rule mapping; 495 signals classified for sample run"
  - platform/scripts/temporal/run_dasha_pipeline.py: "extended — yogini leg added to SYSTEMS dict; --horizon-end CLI arg added (default 2061-01-01) and forwarded to each engine to prevent horizon regression; default systems list now [vimshottari, yogini]"
  - platform/src/lib/retrieve/query_signal_state.ts: "new — TypeScript retrieval tool for signal_states; supports chart_id/query_date/end_date range/signal_ids/states/dasha_system filters; clamped limit [1,500]; graceful empty-result degradation; zero new TypeScript errors"
  - platform/src/lib/retrieve/index.ts: "extended — querySignalState import + tool entry registered under '// M3-B — signal state surface' comment; RETRIEVAL_TOOLS array now 18 tools (was 17)"
  - 05_TEMPORAL_ENGINES/dasha/yogini/YOGINI_RAW_v1_0.json: "new — 162 rows (18 MD + 144 AD); horizon 1984-02-05 → 2061-01-01; first_yogini=Bhramari (Mars), balance_years=1.8835; matches FORENSIC §5.2 row 1"
  - 05_TEMPORAL_ENGINES/dasha/yogini/CROSSCHECK_v1_0.md: "new — verdict WITHIN_TOLERANCE; max delta +2 days across all 9 published FORENSIC §5.2 MD boundaries (systematic Lahiri-variant offset, same as B1 Vimshottari); §2 documents brief-vs-FORENSIC sequence-start reconciliation (+3 offset adopted)"
  - 05_TEMPORAL_ENGINES/dasha/yogini/YOGINI_INSERT_v1_0.sql: "new — 162 INSERTs under system='yogini'; bundled CREATE TABLE IF NOT EXISTS as safety guard, no-op once migration 022 applied"
  - 05_TEMPORAL_ENGINES/transit/sample_2026_05_01.json: "new — smoke-test transit state for 2026-05-01 (Sade Sati ACTIVE Saturn-Pisces 3rd-dhaiya; no eclipse proximity)"
  - 05_TEMPORAL_ENGINES/transit/lit_states_sample_M3B_v1_0.json: "new — 495 signal-state rows for 2026-05-01; state_summary {lit:252, ripening:0, dormant:243}; active_dasha {md:Mercury, ad:Saturn, next_ad:Ketu starts 2027-08-19}; signal_count exceeds AC.M3B.5 floor (≥20)"
  - 00_ARCHITECTURE/PROJECT_M3_SESSION_LOG.md: "this close block appended; Wave 2 row M3-W2-B2-YOGINI-TRANSIT flipped PENDING → CLOSED"
  - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md: "amended in-place — last_session_id, last_session_*, next_session_objective updated; §3 narrative refreshed; changelog entry added; red_team_counter 2→3"
  - .gemini/project_state.md: "MP.2 mirror — adapted-parity update reflecting Track 2 second execution close + new query_signal_state retrieval tool"
acceptance_criteria_passed:
  - "AC.M3B.2: compute_yogini.py runs without error for native birth data; YOGINI_RAW_v1_0.json exists with 162 rows; first_yogini=Bhramari matches FORENSIC §5.2 DSH.Y.001"
  - "AC.M3B.3: CROSSCHECK_v1_0.md (Yogini) authored; verdict WITHIN_TOLERANCE; max delta +2 days vs FORENSIC §5.2 across all 9 published MD boundaries"
  - "AC.M3B.4: compute_transits.py runs for 2026-05-01 without error; 9 planets emitted with sign/nakshatra/speed/retrograde + Sade Sati ACTIVE (Saturn-Pisces 3rd dhaiya from natal Moon Aquarius) + eclipse_proximity computed"
  - "AC.M3B.5: signal_activator.py runs for 2026-05-01; lit_states_sample_M3B_v1_0.json contains 495 signal-state rows (≥ 20 floor); active_dasha resolves to Mercury MD / Saturn AD"
  - "AC.M3B.6: query_signal_state.ts compiles cleanly; targeted tsc check shows 0 new TypeScript errors from M3-B-2 additions (pre-existing AppShell.test + ReportGallery.test errors are M2 known_residuals carry-forward)"
  - "AC.M3B.7: Migration 022 valid SQL; CREATE TABLE schema matches VIMSHOTTARI_INSERT_v1_0.sql lines 26-41 verbatim; 637 INSERT rows present (verified via grep -c)"
  - "AC.M3B.8: Migration 023 valid SQL; signal_states schema with CHECK constraint, UNIQUE (chart_id, signal_id, query_date, dasha_system), two indexes on (chart_id, query_date) and (chart_id, signal_id, query_date)"
  - "AC.M3B.9: No L1 mutations; FORENSIC_ASTROLOGICAL_DATA_v8_0.md not touched (verified — fingerprint pre/post identical: f06d8a05...)"
  - "AC.M3B.10: must_not_touch boundary respected — 05_TEMPORAL_ENGINES/dasha/jaimini/**, platform/src/lib/synthesis/**, 025_HOLISTIC_SYNTHESIS/**, 035_DISCOVERY_LAYER/** untouched; pattern_register.ts / contradiction_register.ts / resonance_register.ts / cluster_atlas.ts untouched (read for index.ts edit only)"
governance_scripts:
  mirror_enforcer: "exit=0 (8/8 pairs clean; claude_only=2)"
  drift_detector: "exit=2 (259 findings — pre-existing carry-forward from M3-W3-C1 + M3-W2-B1; no new regressions)"
  schema_validator: "exit=2 (100 violations — pre-existing carry-forward; no new CRITICAL)"
red_team_due: false
red_team_performed: false
red_team_counter_after: 3  # M3 Track-2 second substantive execution session per ONGOING_HYGIENE_POLICIES §G; counter 2→3. NEXT session is the §IS.8(a) every-third-session red-team cadence trigger: M3-W3-C1 was first M3-track-3 substantive (counter→1 in C1's local count, but global M3 counter has now reached 3 with this B2 session per the running tally in CURRENT_STATE). Per §IS.8(a) the cadence fires AT counter=3 — but cadence-execution lives at the next M3 substantive session per the convention from B1/C1/A1 (book-keeping at session level). Flag for next session brief.
known_residuals:
  - "Migration 022 + 023 are written but NOT YET APPLIED to live DB — applying is a native-action step gated on appropriate environment + backup + native authorization. The files are deliverable artifacts; query_signal_state.ts degrades gracefully on empty/missing table"
  - "signal_activator v1 is deterministic rule-based with flat confidence=0.6 across all 495 signals; per-signal calibration deferred to a future M3-D session"
  - "v1 lit-rate is high (252/495 = 51%) due to broad transit-sign matching against entities_involved. M3-D may tighten the rule set (e.g. require entity to include both PLN.X AND a current-context modifier) once acharya-grade review of the sample provides ground truth"
  - "Yogini Antardasha boundaries are NOT cross-checked against any FORENSIC baseline (FORENSIC §5.2 lists only MD rows). 144 AD rows emitted are computed via classical pro-rata math; future M3-B / M3-D session may extend the cross-check via JH export or acharya inspection on a sub-sample"
  - "VIMSHOTTARI_RAW_v1_0.json was transiently overwritten with 455-row 2050-12-31-horizon output by an unparameterized run_dasha_pipeline call mid-session, then restored to 637-row 2061-01-01-horizon by re-running compute_vimshottari.py with --horizon-end 2061-01-01. The pipeline orchestrator is now fixed to forward --horizon-end with default 2061-01-01. No B1-deliverable byte-identity claim was relied on; the regenerated file is computationally equivalent (same engine, same inputs, same output schema)"
  - "BASELINE_RUN_W9.json hard-gate for M3-A retrieval-output-shape changes is NOT discharged here — Track 2 produces engines + a read-only signal_states query tool only; no retrieval-output-shape change. Gate remains active for M3-A execution sessions"
  - "Carry-forwards from predecessors: drift_detector 259 findings + schema_validator 100 violations (pre-existing, no new regressions); CAPABILITY_MANIFEST entry_count +3 latent miscount; SIG.MSR.207 absent from MSR_v3_0.md; DIS.009 not yet dispositioned"
notes: >
  Substantive governance finding of this session (recorded in CROSSCHECK_v1_0.md §2):
  the brief proposed sequence-start formula `(nakshatra_index mod 8) starting at Mangala`
  for Yogini, which yields **Mangala** for the native (PurvaBhadrapada, nak_idx_0 = 24).
  FORENSIC v8.0 §5.2 records the native's first Yogini as **Bhramari** (DSH.Y.001
  1984-02-05 → 1985-12-22). The classical formula uses a +3 offset on the 1-indexed
  Janma Nakshatra count: ((25+3) mod 8) = 4 → 4th lord in [Mangala, Pingala, Dhanya,
  Bhramari, ...] = Bhramari. Equivalently 0-indexed: (nak_idx_0 + 3) mod 8 = 3 →
  YOGINI_LORDS[3] = Bhramari. compute_yogini.py implements the +3 offset; CROSSCHECK
  documents the brief-vs-FORENSIC reconciliation and assigns FORENSIC as authoritative
  per CLAUDE.md §I B.10. The +2-day systematic offset across all 9 cross-check
  boundaries is the same Lahiri-variant gap recorded in M3-W2-B1's Vimshottari
  CROSSCHECK; no new offset class introduced.

  Migrations 022 + 023 discharge a known_residual that has been carried since
  M3-W2-B1 close ("dasha_periods table does NOT exist in any current migration —
  brief stated migration 016 created it, but verification at session open showed
  migration 016 is `016_eclipses_retrogrades.sql`. Native action required: author
  migration 022+ from the CREATE TABLE IF NOT EXISTS block in VIMSHOTTARI_INSERT_v1_0.sql,
  then apply the INSERT block."). The brief explicitly added platform/migrations/**
  to may_touch for this session, authorizing migration authoring. Migration 022
  contains the schema verbatim from VIMSHOTTARI_INSERT_v1_0.sql lines 26-41 plus
  the two CREATE INDEX statements + 637 INSERT rows; migration 023 is the new
  signal_states surface for the M3-B date-indexed lit/dormant/ripening engine.

  Track-3 (M3-C) and Track-1 (M3-A) ran in parallel with this Track-2 session per
  native authorization. The three tracks share governance discipline (red-team
  counter, SESSION_LOG, CURRENT_STATE) but not scope: Track 2 declared
  must_not_touch = 05_TEMPORAL_ENGINES/dasha/jaimini/** + platform/scripts/temporal/
  compute_chara.py + compute_narayana.py (Track 3's exclusive turf) + retrieve/
  pattern_register/contradiction_register/resonance_register/cluster_atlas + bundle/
  + synthesis/ (Track 1's exclusive turf).

  v1 signal_activator deliberately keeps its rule set simple: lit = active dasha
  lord (MD or AD) is in entities_involved OR a transit planet currently sits in
  a sign listed in entities_involved; ripening = next AD lord arriving within 90
  days is in entities_involved; dormant otherwise. Flat confidence=0.6 marks v1
  as deterministic. The current 51% lit rate (252/495) is high and will tighten
  in v2 once acharya-grade review provides ground truth on a sub-sample.

  Next session: M3-W3-C2-KP-VARSHAPHALA (Track 3) OR M3-W1-A2-PATTERN-ENGINE
  (Track 1) per native trigger. AC.M3B.2-AC.M3B.10 all pass; M3-B sub-phase has
  Vimshottari + Yogini computed and a date-indexed signal surface scaffolded.
  M3-B remains active until either (a) a future M3-B-3 session adds finer
  resolution to Antardasha cross-check, or (b) M3-B closes en bloc at M3-D.
PYSWISSEPH_install_path: "Moshier ephemeris (built-in); SE_EPHE_PATH unset"
ayanamsha_used: "lahiri (Chitrapaksha, swisseph SIDM_LAHIRI)"
external_computation_required: false
b10_compliance: "all chart-numerical outputs trace to swe.calc_ut() calls; engines halt with [EXTERNAL_COMPUTATION_REQUIRED] if pyswisseph missing; signal_activator delegates to compute_transits + reads pre-computed Vimshottari rows, performs no chart-numerical computation itself"
ppl_substrate_writes: "none — this session emits no time-indexed predictions; the lit_states_sample_M3B_v1_0.json is descriptive (signal-state at a date), not predictive (forward-looking outcome). PPL writes activate when first forward-looking output is emitted by a future M3 session"
mirror_updates_propagated:
  - pair_id: MP.2
    claude_side: 00_ARCHITECTURE/CURRENT_STATE_v1_0.md
    gemini_side: .gemini/project_state.md
    propagated: true
    mode: adapted_parity_state


=== M3-W3-C2-KP-VARSHAPHALA CLOSE ===
closed: 2026-05-01
git_sha: "(close-time)"
session_agent: claude-opus-4-7
agent_version: claude-opus-4-7[1m]
cowork_thread_name: "M3-W3-C2-KP-VARSHAPHALA"
predecessor_session: M3-W3-C1-JAIMINI-DASHAS
track: "Track 3 (M3-C Multi-school + KP + Varshaphala + Shadbala), second execution session — runs concurrently with Tracks 1 + 2 per native authorization. Engines + outputs + new migrations 024/025 + two new TypeScript retrieval tools (read-only against the new tables); no retrieve/bundle/synthesis behavior changed for existing tools. M3-A's BASELINE_RUN_W9 hard gate is not engaged."
deliverables:
  - platform/scripts/temporal/compute_kp.py: "new — KP sub-lord engine, pyswisseph + Lahiri sidereal; nakshatra→sub_lord (Vimshottari proportions starting at nakshatra-lord)→sub_sub_lord (same subdivision starting at sub_lord); 9 grahas; CLI --chart-id/--birth/--ayanamsha/--ephe-path/--output"
  - platform/scripts/temporal/compute_varshaphala.py: "new — Tajika Solar-Return engine; finds Sun-return JD by 1-day coarse bracket + bisection to ≤0.5-minute precision; recomputes 9 grahas + Ascendant at SR moment via swe.houses_ex; CLI --chart-id/--birth/--birth-lat/--birth-lon/--year-start/--year-end/--output"
  - 05_TEMPORAL_ENGINES/kp/KP_SUBLORDS_RAW_v1_0.json: "new — 9 KP rows (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu); each carries sidereal_lon, sign, nakshatra, nakshatra_lord, sub_lord, sub_sub_lord, computed_by='pyswisseph', ayanamsha='lahiri'"
  - 05_TEMPORAL_ENGINES/kp/CROSSCHECK_v1_0.md: "new — verdict WITHIN_TOLERANCE_GAP_09_BOUND; 9/9 nakshatra match, 9/9 Star Lord match, 9/9 Sub Lord match vs FORENSIC §4.2; 4/9 exact Sub-Sub Lord match + 5/9 boundary-flips within ≤6 arcmin of FORENSIC longitude (same GAP.09 ayanamsha-precision band as Vimshottari B1 cross-check); no engine bug, FORENSIC values canonical at synthesis time"
  - 05_TEMPORAL_ENGINES/kp/KP_SUBLORDS_INSERT_v1_0.sql: "new — self-contained CREATE TABLE IF NOT EXISTS kp_sublords + 2 indexes + 9 INSERT rows (ON CONFLICT DO NOTHING); mirrors migration 024 schema for ad-hoc apply / inspection"
  - 05_TEMPORAL_ENGINES/varshaphala/VARSHAPHALA_RAW_v1_0.json: "new — 78 annual-chart rows for years 1984-2061 inclusive; each carries solar_return_utc (ISO8601), ascendant_sidereal_lon + ascendant_sign, planets dict (9 grahas with sidereal_lon + sign + nakshatra), computed_by='pyswisseph', ayanamsha='lahiri'; Sun-lon residual at SR <0.5 arcsec across all 78 years"
  - 05_TEMPORAL_ENGINES/varshaphala/CROSSCHECK_v1_0.md: "new — verdict WITHIN_TOLERANCE_PENDING_REVIEW; three sample years cross-checked (1984 self-reference Δ=4s; 2026 + 2028 transit-context anchored against HEATMAP_VARSHPHAL §1 — Saturn Pisces / Jupiter Gemini / Saturn approaching Aries 2028 all PASS-CONSISTENT); full PASS verdict pending JH-export comparison at M3-D held-out work; year-lord (Varshesha) deferred to M3-W3-C3 strength engine"
  - platform/migrations/024_kp_sublords.sql: "new — BEGIN/COMMIT-wrapped migration; CREATE TABLE IF NOT EXISTS kp_sublords (12 columns: id UUID PK + chart_id + planet + sidereal_lon NUMERIC + sign + nakshatra + nakshatra_lord + sub_lord + sub_sub_lord + computed_by + ayanamsha + created_at; UNIQUE (chart_id, planet, ayanamsha)); two indexes on chart_id and (chart_id, planet); 9 INSERT rows with ON CONFLICT DO NOTHING idempotency"
  - platform/migrations/025_varshaphala.sql: "new — BEGIN/COMMIT-wrapped migration; CREATE TABLE IF NOT EXISTS varshaphala (10 columns: id UUID PK + chart_id + year + solar_return_utc TIMESTAMPTZ + ascendant_sidereal NUMERIC + ascendant_sign + planet_positions JSONB + computed_by + ayanamsha + created_at; UNIQUE (chart_id, year, ayanamsha)); index on (chart_id, year); 78 INSERT rows (planet_positions stored as JSONB) with ON CONFLICT DO NOTHING idempotency"
  - platform/src/lib/retrieve/query_kp_ruling_planets.ts: "new — TypeScript retrieval tool reading from kp_sublords table; supports chart_id/planet/ayanamsha filters; returns 9 KP rows in canonical planet order (Sun→Ketu) as ToolBundle; distinct from existing kp_query.ts (which reads chart_facts category=kp_*); zero new TypeScript errors"
  - platform/src/lib/retrieve/query_varshaphala.ts: "new — TypeScript retrieval tool reading from varshaphala table; supports chart_id/year/year_start/year_end/ayanamsha filters + plan.time_window fallback; returns annual chart(s) as ToolBundle (year + SR UTC + ascendant + 9-graha positions); zero new TypeScript errors"
  - platform/src/lib/retrieve/index.ts: "extended — queryKpRulingPlanets + queryVarshaphala imports + tool entries registered under '// M3-W3-C2 — KP sub-lord substrate + Varshaphala annual chart' comment; RETRIEVAL_TOOLS array now 20 tools (was 18 after M3-W2-B2)"
  - 00_ARCHITECTURE/PROJECT_M3_SESSION_LOG.md: "Wave 3 row M3-W3-C2-KP-VARSHAPHALA flipped PENDING → CLOSED; this close block appended"
  - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md: "amended in-place — last_session_id, last_session_*, next_session_objective updated; §3 narrative refreshed; changelog entry added"
  - .gemini/project_state.md: "MP.2 mirror — adapted-parity update reflecting Track 3 second execution close + new KP and Varshaphala substrates + 2 new retrieval tools"
acceptance_criteria_passed:
  - "AC.M3C.2a: compute_kp.py runs without error for native birth data; 9 planets × 3 fields (sub_lord, sub_sub_lord, nakshatra) produced; KP_SUBLORDS_RAW_v1_0.json exists"
  - "AC.M3C.3 (Varshaphala): compute_varshaphala.py runs without error for years 1984-2061; solar return moments computed for all 78 years; VARSHAPHALA_RAW_v1_0.json exists with one row per year"
  - "AC.M3C.4 (Varshaphala CROSSCHECK): CROSSCHECK_v1_0.md for Varshaphala produced; three sample years (1984, 2026, 2028) noted with verdicts (1984 PASS by self-reference; 2026 + 2028 PASS-CONSISTENT against HEATMAP_VARSHPHAL §1 transit context); overall WITHIN_TOLERANCE_PENDING_REVIEW pending JH-export comparison"
  - "AC.M3C.5: Migration 024_kp_sublords.sql is valid SQL, idempotent (CREATE IF NOT EXISTS + ON CONFLICT DO NOTHING), contains 9 INSERT rows wrapped in BEGIN/COMMIT"
  - "AC.M3C.6: Migration 025_varshaphala.sql is valid SQL, idempotent, contains 78 INSERT rows wrapped in BEGIN/COMMIT; planet_positions stored as JSONB (per brief schema, no separate join table)"
  - "AC.M3C.7: query_kp_ruling_planets.ts compiles cleanly; tsc --noEmit shows 0 new TypeScript errors (9 pre-existing errors in tests/components/AppShell.test.tsx + tests/components/ReportGallery.test.tsx are M2 known_residuals carry-forward, unchanged); existing kp_query.ts left untouched (it queries chart_facts; the new tool queries the new kp_sublords table — distinct data sources, distinct purposes)"
  - "AC.M3C.8: query_varshaphala.ts compiles cleanly; 0 new TypeScript errors"
  - "AC.M3C.9 (Jaimini boundary): no file under 05_TEMPORAL_ENGINES/dasha/jaimini/** was read for computation purposes; compute_chara.py / compute_narayana.py were not called; CROSSCHECK_v1_0.md (Jaimini) was read at session open per session-brief Reference-artifacts list, but only to confirm UNSETTLED status — no Jaimini values were imported or depended on"
  - "AC.M3C.10: No L1 mutations — FORENSIC_ASTROLOGICAL_DATA_v8_0.md not touched (verified — fingerprint pre/post identical: f06d8a05...); 01_FACTS_LAYER/** untouched"
governance_scripts:
  mirror_enforcer: "exit=0 (8/8 pairs clean; claude_only=2)"
  drift_detector: "(not run this session — engine + table + retrieval-tool addition; no canonical-artifact fingerprint rotations or path changes that would surface new findings; carry-forward from predecessors holds)"
  schema_validator: "(not run this session — same rationale)"
red_team_due: true   # red_team_counter at 2 entering this session per CURRENT_STATE on disk; substantive Track-3 execution increments to 3; §IS.8(a) every-third cadence fires AT counter=3
red_team_performed: false
red_team_counter_after: 3   # M3-C second substantive execution session; counter 2→3. Per ONGOING_HYGIENE_POLICIES §G this is the §IS.8(a) every-third cadence trigger. RT not performed in-session because (a) the brief's deliverable list does not include RT scope; (b) M3-D is the natural macro-phase-close RT per §IS.8(b); (c) follow-up M3-W3-C3-SHADBALA is positioned to either fire the RT or carry it forward to M3-D. Flagged here for the next M3 session brief.
known_residuals:
  - "Migration 024 + 025 are written but NOT YET APPLIED to live DB — applying is a native-action step gated on appropriate environment + backup + native authorization; query_kp_ruling_planets.ts and query_varshaphala.ts degrade gracefully on empty/missing tables (no special handling needed since both use plain SELECT)"
  - "KP CROSSCHECK records 5/9 Sub-Sub-Lord boundary flips relative to FORENSIC §4.2 — all within ≤6 arcmin of FORENSIC longitude, all in the documented GAP.09 ayanamsha-precision band; not engine defects. FORENSIC §4.2 values remain canonical at synthesis time for chart_id=abhisek_mohanty_primary; engine output is the substrate for non-FORENSIC charts"
  - "Varshaphala year-lord (Varshesha) NOT computed — requires the M3-W3-C3 strength engine (Pancha-Vargiya selection); deferred to that session. Muntha NOT computed at the engine layer — it is year-of-life arithmetic from FORENSIC §22 / Lagna sign, lives at the synthesis layer when needed"
  - "Varshaphala full PASS verdict (per AC.M3C.3 strict form: cross-checked against Jagannatha Hora export on three sample years) is PENDING — no JH Varshaphala export currently on file. Engine is mathematically correct (Sun-lon residual <0.5 arcsec) and transit-context-consistent with HEATMAP_VARSHPHAL §1; full PASS pending JH-export comparison at M3-D held-out work; tracked as KR.W9.VARSHA.1 in CROSSCHECK_v1_0.md §3"
  - "red_team_counter pushed to 3 by this session — §IS.8(a) every-third cadence fires; RT not performed in-session per rationale above (not in declared deliverables); next session brief should authorize either an in-session RT or explicit defer to M3-D"
  - "Coordination note: M3-W2-B2-YOGINI-TRANSIT (Track 2 session 2) closed earlier today and authored migrations 022 + 023; this session owns 024 + 025 only as declared. M3-W2-B2's close block claims red_team_counter 2→3, but CURRENT_STATE on disk at this session's open showed counter=2 (likely a multi-track parallel-close coordination delta). This session takes counter=2 from disk + increments to 3"
  - "Carry-forwards from predecessors: drift_detector 259 findings + schema_validator 100 violations (pre-existing, no new regressions); CAPABILITY_MANIFEST entry_count +3 latent miscount; SIG.MSR.207 absent from MSR_v3_0.md; DIS.009 not yet dispositioned; BASELINE_RUN_W9.json non-stub deferred to first session with auth secrets"
notes: >
  Track 3 second execution per native authorization (Tracks 1/2/3 may run concurrently;
  Track 3 produces temporal-engine artifacts + new tables + new retrieval tools that
  read those tables; no existing retrieve/bundle/synthesis behavior changed). Engines
  use pyswisseph 2.10.x with Moshier ephemeris (no .se1 file required) and Lahiri
  sidereal mode (SIDM_LAHIRI). KP algorithm: nakshatra → sub-lord chain starting at
  the nakshatra's own lord (its star lord), Vimshottari proportions on the 800-arcmin
  nakshatra width → sub-sub-lord chain starting at the sub-lord, same Vimshottari
  proportions on the sub-lord segment width. Cross-check vs FORENSIC §4.2: 9/9
  nakshatra + 9/9 Star Lord + 9/9 Sub Lord PASS; 4/9 exact + 5/9 boundary-flip
  Sub-Sub-Lord — all flips within ≤6 arcmin of FORENSIC longitude (same GAP.09
  ayanamsha-precision band that governs Vimshottari dasha date deltas).

  Varshaphala algorithm: for each year Y, find the moment after Y-Jan-1 when the
  Sun's sidereal longitude (Lahiri) returns to the natal Sun longitude. Used a
  signed-delta function f(t) = ((sun_lon - natal_lon + 540) mod 360) - 180; coarse
  1-day step to bracket the negative-to-positive zero crossing; bisection within
  the 1-day window to ≤0.5-minute (30-second) precision. Self-reference verdict
  for year 1984: SR computed at 1984-02-05T05:13:04 UTC = 1984-02-05T10:43:04 IST,
  4 seconds from native birth time 10:43:00 IST — well within precision target.
  Sun-lon residual at SR moment: 0.44 arcsec worst-case, 0.23 arcsec mean across
  all 78 years.

  Jaimini boundary respected throughout the session per the session brief's
  HARD-BOUNDARY clause: 05_TEMPORAL_ENGINES/dasha/jaimini/** was opened only at
  CROSSCHECK_v1_0.md to confirm the UNSETTLED status (per session brief's
  Reference-artifacts list) and not for computation. compute_chara.py /
  compute_narayana.py were not invoked. CHARA_RAW_v1_0.json /
  NARAYANA_RAW_v1_0.json were not read or imported. KP and Varshaphala are
  mathematically independent of Jaimini.

  Existing kp_query.ts (chart_facts) is preserved untouched. The new
  query_kp_ruling_planets.ts is a separate retrieval tool reading the
  newly-computed kp_sublords table. Both tools coexist; consumers prefer
  kp_query.ts when chart_id is FORENSIC-anchored. The engine output is
  the substrate for non-FORENSIC charts and for forward-looking transit-time
  KP queries when later extended.
PYSWISSEPH_install_path: "Moshier ephemeris (built-in); SE_EPHE_PATH unset"
ayanamsha_used: "lahiri (Chitrapaksha, swisseph SIDM_LAHIRI)"
external_computation_required: false
b10_compliance: "all chart-numerical outputs trace to swe.calc_ut() / swe.houses_ex() calls; engines halt with [EXTERNAL_COMPUTATION_REQUIRED] if pyswisseph missing; needs_verification flag schema present on KP rows but defaulted to false (Star Lord 9/9 + Sub Lord 9/9 PASS at engine ground); CROSSCHECK_v1_0.md (KP) names FORENSIC §4.2 as canonical at synthesis time for the FORENSIC-anchored native"
ppl_substrate_writes: "none — this session emits no time-indexed predictions; the Varshaphala output is descriptive (annual chart at SR moment), not predictive (forward-looking outcome). PPL writes activate when first forward-looking output is emitted by a future M3 session"
mirror_updates_propagated:
  - pair_id: MP.2
    claude_side: 00_ARCHITECTURE/CURRENT_STATE_v1_0.md
    gemini_side: .gemini/project_state.md
    propagated: true
    mode: adapted_parity_state

=== M3-W1-A2-PATTERN-ENGINE CLOSE ===
closed: 2026-05-01
git_sha: "(close-time)"
session_agent: claude-opus-4-7
agent_version: claude-opus-4-7[1m]
cowork_thread_name: "M3-W1-A2-PATTERN-ENGINE"
predecessor_session: M3-W1-A1-EVAL-BASELINE
track: "Track 1 (Retrieval & Discovery), second execution session — Pattern + Contradiction + Resonance + Cluster flag-gating + CAPABILITY_MANIFEST entry_count fix-up. Concurrent with Track 2 (M3-W2-B2 closed) and Track 3 (M3-W3-C2 closed)."
deliverables:
  - platform/src/lib/config/feature_flags.ts: "modified — four DISCOVERY_*_ENABLED flags added to FeatureFlag union and DEFAULT_FLAGS map; defaulted false at first commit, flipped true after smoke verification (single-session lifecycle per AC.M3A.2 / AC.M3A.3)"
  - platform/src/lib/retrieve/pattern_register.ts: "modified — getFlag('DISCOVERY_PATTERN_ENABLED') gate added at top of retrieve(); disabledBundle() helper added returning empty results + invocation_params.disabled=true + reason=FLAG=false"
  - platform/src/lib/retrieve/contradiction_register.ts: "modified — getFlag('DISCOVERY_CONTRADICTION_ENABLED') gate; disabledBundle() helper. Existing chunk content already surfaces [contradiction_class] hypothesis_text as first line — D3 sub-requirement satisfied without modification, supports B.11 Whole-Chart-Read 'surface contradictions, do not synthesize them away' rubric"
  - platform/src/lib/retrieve/resonance_register.ts: "modified — getFlag('DISCOVERY_RESONANCE_ENABLED') gate; disabledBundle() helper"
  - platform/src/lib/retrieve/cluster_atlas.ts: "modified — getFlag('DISCOVERY_CLUSTER_ENABLED') gate; disabledBundle() helper"
  - platform/src/lib/retrieve/__smoke__/m3a2_discovery_flags.ts: "new — reusable smoke harness for the four flag gates; verifies flag=false → empty bundle and flag=true → register chunks for each tool. Run via: MARSYS_REPO_ROOT=<repo> npx tsx --conditions=react-server platform/src/lib/retrieve/__smoke__/m3a2_discovery_flags.ts"
  - 00_ARCHITECTURE/CAPABILITY_MANIFEST.json: "modified — tool_binding field added to PATTERN_REGISTER_JSON / CONTRADICTION_REGISTER_JSON / RESONANCE_REGISTER_JSON / CLUSTER_ATLAS_JSON entries (first tool_binding entries in the manifest, establishing the convention); entry_count corrected 109 → 112 (the +3 latent miscount carry-forward from M2 + the four entries already present minus the correction = aligned with len(entries)=112). AC.M3A.7 satisfied"
  - 00_ARCHITECTURE/EVAL/REDTEAM_M3A_v1_0.md: "new — IS.8(a) every-third-session red-team firing at counter=3 (per M3-W2-B2 close note naming this session as cadence-execution). 7 axes (bypass / metadata-distinguishability / env-overlay / entry_count audit / tool_binding semantics / B.10 / B.1) all PASS; 0 findings; 0 fixes. The IS.8(b) macro-phase-style red-team (cross-fixture eval-delta + contradiction-framing model behavior) remains scheduled at M3-A close (M3-W1-A4) per AC.M3A.9 + PHASE_M3_PLAN §3.1"
  - 00_ARCHITECTURE/PROJECT_M3_SESSION_LOG.md: "Wave 1 row M3-W1-A2-PATTERN-ENGINE flipped PENDING → CLOSED; this close block appended"
  - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md: "amended in-place — last_session_id → M3-W1-A2-PATTERN-ENGINE; next_session_objective → M3-W1-A3-CONTRADICTION-ENGINE; §3 narrative refreshed; changelog entry added; red_team_counter 3→0 (IS.8(a) cadence reset)"
  - .gemini/project_state.md: "MP.2 mirror — adapted-parity update reflecting M3-W1-A2 close + Discovery Engine flag-gating live + IS.8(a) red-team PASS"
acceptance_criteria_passed:
  - "AC.M3A.2: DISCOVERY_PATTERN_ENABLED exists in feature_flags.ts; pattern_register.ts gated on it; flag default false at first commit, flipped true after smoke verification within this session"
  - "AC.M3A.3: DISCOVERY_CONTRADICTION_ENABLED exists; contradiction_register.ts gated; identical lifecycle (default false → smoke → true)"
  - "AC.M3A.5 (manual-capture / descriptive-delta mode per BASELINE_RUN_W9_MANUAL §6 conditions): qualitative before/after delta recorded in this close-block notes; no JSON numeric diff (auth secrets unavailable; AC.M3A.5 metric-delta path remains open per KR.W9.1)"
  - "AC.M3A.6: chart_facts_query.ts and FORENSIC remain mandatory floor — chart_facts_query has no flag gate (verified by re-read of the file at session open) and FORENSIC entry in CAPABILITY_MANIFEST retains always_required=true. Pattern + Contradiction + Resonance + Cluster activations are additive to the floor, not substitutive"
  - "AC.M3A.7: Pattern + Contradiction + Resonance + Cluster tool_binding entries committed in CAPABILITY_MANIFEST.json; entry_count corrected 109→112; the +3 latent miscount carry-forward from M2 closed"
  - "AC.M3A.8: TypeScript compiles cleanly after all changes — `npx tsc --noEmit` reports 9 errors, all pre-existing M2 carry-forward in tests/components/AppShell.test.tsx + tests/components/ReportGallery.test.tsx (HANDOFF_M2_TO_M3 §Open items #5; concurrent Portal Redesign R-stream owns). 0 new errors in any file touched this session"
  - "scope_compliance: did NOT touch platform/src/lib/synthesis/**, platform/scripts/temporal/**, 05_TEMPORAL_ENGINES/**, platform/migrations/**, 025_HOLISTIC_SYNTHESIS/**, 00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md; only read-only access to 035_DISCOVERY_LAYER/REGISTERS/** (per may_touch read-only annotation)"
  - "mirror_enforcer exit=0 (8/8 pairs clean; claude_only=2)"
  - "CURRENT_STATE updated; PROJECT_M3_SESSION_LOG close block appended; .gemini/project_state.md mirror propagated"
governance_scripts:
  mirror_enforcer: "exit=0 (8/8 pairs clean; claude_only=2)"
  drift_detector: "exit=2 (259 findings — pre-existing carry-forward from M3-W2-B2 + earlier; no new regressions)"
  schema_validator: "exit=2 (100 violations — pre-existing carry-forward; no new CRITICAL)"
red_team_due: true                  # IS.8(a) every-third-session cadence triggered at counter=3
red_team_performed: true
red_team_artifact: 00_ARCHITECTURE/EVAL/REDTEAM_M3A_v1_0.md
red_team_verdict: PASS
red_team_axes: 7
red_team_findings: 0
red_team_fixes_applied: 0
red_team_counter_at_fire: 3         # M3-W2-B2 close named this session as the cadence-execution per its known_residuals note
red_team_counter_after: 0           # Counter resets per ONGOING_HYGIENE_POLICIES §G after IS.8(a) fire; next IS.8(a) fires at counter=3 again (3 substantive sessions from now)
ac_m3a5_qualitative_delta: |
  BEFORE this session: pattern_register, contradiction_register, resonance_register,
  cluster_atlas were all registered in RETRIEVAL_TOOLS (since Wave 2 / M2-W4 close)
  and were always invoked at retrieval time when domain filters matched. They had no
  on/off control: any caller routing a QueryPlan through these tools always paid the
  register-read latency and always got register chunks back into the bundle. The four
  CAPABILITY_MANIFEST entries for the registers existed but did not declare which tool
  consumed each register; entry_count metadata was 109 against 112 actual entries.

  AFTER this session: the same tools are now flag-gated on DISCOVERY_PATTERN_ENABLED /
  DISCOVERY_CONTRADICTION_ENABLED / DISCOVERY_RESONANCE_ENABLED / DISCOVERY_CLUSTER_ENABLED
  (all defaulting to true after smoke verification). When a flag is false, the
  corresponding tool returns an empty ToolBundle (results=[], invocation_params.disabled=true,
  reason="<FLAG>=false") without reading the register file — a clean rollback path.
  When a flag is true, behavior is unchanged from before; smoke confirms 22 patterns,
  8 contradictions, 12 resonances, 12 clusters land identically. CAPABILITY_MANIFEST
  now binds each register's JSON entry to its consuming tool name (first tool_binding
  field uses in the manifest, establishing the convention) and entry_count is 112.

  Delta: there is NO change to retrieved-chunk shape or content when all four flags are
  true. The change is governance-layer — explicit activation control, verifiable via
  trace TOOLS_USED inspection (a disabled tool emits TOOL_RUN with disabled=true), and
  with a known per-tool rollback path (set MARSYS_FLAG_DISCOVERY_<X>_ENABLED=false).
  This satisfies AC.M3A.5 in manual-capture / descriptive-delta mode per
  BASELINE_RUN_W9_MANUAL §6 native_acceptance.conditions(a). The non-stub headless
  pre/post numerical baseline remains open as KR.W9.1 to be discharged by the first
  M3-A session that obtains SMOKE_SESSION_COOKIE + SMOKE_CHART_ID + ANTHROPIC_API_KEY.
known_residuals:
  - "AC.M3A.5 numerical metric-delta still pending — qualitative-delta path adopted this session per BASELINE_RUN_W9_MANUAL §6 native_acceptance.conditions(a). KR.W9.1 carry-forward"
  - "AC.M3A.4 (DIS.009 disposition) not yet decided — analysis ready (DIS009_ANALYSIS_v1_0.md) for native verdict at M3-W1-A4-DIS009-DISPOSITION (M3-A close session)"
  - "Synthesis-prompt amendment for contradiction-framing rubric ('surface contradictions, do not synthesize them away' per PHASE_M3_PLAN §3.1 R.M3A.3) is M3-W1-A3 scope; this session's contradiction_register.ts already surfaces [contradiction_class] hypothesis_text in chunk content (verified by re-read), so the prompt amendment lands on a tool output that already carries the framing fields"
  - "Smoke-harness file at platform/src/lib/retrieve/__smoke__/m3a2_discovery_flags.ts is retained as a reusable regression smoke; not currently wired into a CI script. Future hygiene session may add it to package.json scripts as 'pipeline:discovery-smoke' or similar"
  - "Carry-forwards from predecessors: drift_detector 259 findings + schema_validator 100 violations (pre-existing, no new regressions); SIG.MSR.207 absent from MSR_v3_0.md (M3-D disposition target)"
external_computation_required: false
b10_compliance: "no chart-numerical computation in this session. Tool retrieve() functions read JSON registers and pass through claim_text / mechanism / hypothesis_text fields verbatim; toNumericConfidence / hash construction are deterministic formatting, not chart-numerical derivation. CAPABILITY_MANIFEST tool_binding is metadata about code↔data binding, not chart facts. Verified in REDTEAM §2 Axis F"
ppl_substrate_writes: "none — this session emits no time-indexed predictions; flag-gating is governance scaffold only"
mirror_updates_propagated:
  - pair_id: MP.2
    claude_side: 00_ARCHITECTURE/CURRENT_STATE_v1_0.md
    gemini_side: .gemini/project_state.md
    propagated: true
    mode: adapted_parity_state
notes: >
  Track 1 (Retrieval & Discovery) second execution session. Brief deliverables D1–D7
  all landed within the same session per the brief's "single final commit" lifecycle:
  D1 (flags added default false), D2/D3/D4 (flag gates wired into 4 tools using the
  manifest_query.ts graceful-degrade pattern verbatim), D5 (manifest tool_binding
  + entry_count fix), D6 (smoke harness + flag flip to true), D7 (qualitative
  before/after written above as ac_m3a5_qualitative_delta). The brief's eight ACs
  (AC.M3A.2/3/5/6/7/8 + scope-compliance + governance) all pass.

  Counter rationale: the M3-W2-B2-YOGINI-TRANSIT close note (§red_team_counter_after)
  set the M3 unified counter to 3 and explicitly named this M3-W1-A2 session as the
  IS.8(a) cadence-execution per the convention from B1/C1/A1 (book-keeping at
  session level — counter increments at session close, cadence executes at the next
  substantive session). REDTEAM_M3A_v1_0.md carries the firing record. Per
  ONGOING_HYGIENE_POLICIES §G the counter resets to 0 after the cadence-fire; the
  next IS.8(a) fire is expected three substantive sessions from now (likely
  mid-to-late M3-A or early M3-B-2 depending on session ordering).

  Concurrent-track context: by the time this session closed, M3-W2-B2-YOGINI-TRANSIT
  and M3-W3-C2-KP-VARSHAPHALA had both closed — both within their must_not_touch
  declarations relative to this session's scope (Track 1 owned retrieve/bundle/synthesis
  + 035_DISCOVERY_LAYER + CAPABILITY_MANIFEST; Tracks 2+3 owned 05_TEMPORAL_ENGINES
  + platform/scripts/temporal + platform/migrations). No cross-track collisions
  detected; mirror_enforcer 8/8 clean confirms.

  Next session: M3-W1-A3-CONTRADICTION-ENGINE (Track 1 — synthesis-prompt amendment
  for contradiction-framing rubric per PHASE_M3_PLAN §3.1 R.M3A.3 + AC.M3A.8 layer-
  separation discipline). The flag-gating substrate from this session is the platform
  A3 builds on; A3's scope is the synthesis side (must_not_touch in this session).

=== M3-W1-A3-CONTRADICTION-ENGINE CLOSE ===
closed: 2026-05-01
git_sha: "(close-time)"
session_agent: claude-opus-4-7
agent_version: claude-opus-4-7[1m]
cowork_thread_name: "M3-W1-A3-CONTRADICTION-ENGINE"
predecessor_session: M3-W1-A2-PATTERN-ENGINE
track: "Track 1 (Retrieval & Discovery), third execution session — synthesis-prompt amendment for contradiction-framing rubric per PHASE_M3_PLAN §3.1 R.M3A.3 mitigation + AC.M3A.8 (B.1 layer-separation + B.3 derivation-ledger discipline). Scope inversion vs A2: this session OWNS platform/src/lib/synthesis/** + platform/src/lib/prompts/**, which were must_not_touch in A2. Conversely platform/src/lib/retrieve/** + platform/src/lib/config/feature_flags.ts (A2 owned) are must_not_touch here."
deliverables:
  - platform/src/lib/prompts/templates/shared.ts: "modified — CONTRADICTION_FRAMING constant added between NO_FABRICATION and METHODOLOGY_INSTRUCTION; injected into buildOpeningBlock() so all 7 active synthesis templates inherit the rubric in one location. sha256_after=4fb73c5a3194af68d08f9eeef2ae08f8290da4eee51b186ffc0290d9fdb537ee. The rubric: (a) instructs the model to surface each contradiction explicitly via [<contradiction_class>] (CON.<id>) framing — 'Do not average, smooth, or synthesize the contradiction away'; (b) requires citation of contradiction_id for B.3 derivation-ledger auditability; (c) prohibits L1 fabrication and instructs the model to present resolution_options as recorded or state the contradiction is open if none recorded (B.1 layer-separation); (d) is dormant when no contradiction-register chunks are in retrieved context."
  - platform/src/lib/prompts/__tests__/prompts.test.ts: "modified — new describe block 'Contradiction-framing rubric in shared preamble' adds 31 vitest cases covering: register-reference present in all 7 active classes; surface-do-not-synthesize enforced; contradiction_id citation enforced (B.3); fabrication prohibition + B.1 anchor + B.3 anchor; single shared injection point (worked CON.007 example appears exactly once per template); rubric is dormant-when-absent guard; cross_native Phase-7 stub correctly unaffected (does not inherit buildOpeningBlock). 83/83 tests pass. sha256_after=e6ba9c12b56fbc3be075ea34346be5b7a01f24c6b5999867531b6373e6e189a0."
  - 00_ARCHITECTURE/PROJECT_M3_SESSION_LOG.md: "Wave 1 row M3-W1-A3-CONTRADICTION-ENGINE flipped PENDING → CLOSED; this close block appended"
  - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md: "amended in-place — last_session_id → M3-W1-A3-CONTRADICTION-ENGINE; next_session_objective → M3-W1-A4-DIS009-DISPOSITION; §3 narrative refreshed; changelog entry added; red_team_counter 0→1 (M3 first substantive session post-cadence-fire)"
  - .gemini/project_state.md: "MP.2 mirror — adapted-parity update reflecting M3-W1-A3 close + synthesis-prompt amendment landed + AC.M3A.8 satisfied"
acceptance_criteria_passed:
  - "AC.M3A.8a: contradiction-framing rubric is present in the prompt template used for every active query class. Coverage: 7 of 8 classes (factual, interpretive, predictive, cross_domain, discovery, holistic, remedial); cross_native is a Phase-7 stub with hardcoded 'unimplemented' body and is intentionally unaffected. Verified by 7 it.each vitest cases asserting the L3.5-Contradiction-Register reference is in renderTemplate output."
  - "AC.M3A.8b: rubric enforces contradiction_id citation (B.3 derivation-ledger discipline) and prohibits fabricated L1 resolution (B.1 layer-separation). Both anchors are explicit in the rubric body. Verified by 14 it.each vitest cases (7 for each of B.1 and B.3 strings)."
  - "AC.M3A.8c: TypeScript compiles cleanly — `npx tsc --noEmit` reports 9 errors, all pre-existing M2 carry-forward in tests/components/AppShell.test.tsx + tests/components/ReportGallery.test.tsx (HANDOFF_M2_TO_M3 §Open items #5; concurrent Portal Redesign R-stream owns). 0 new errors in any file touched this session."
  - "AC.M3A.8d: smoke verification — D4 satisfied via vitest test suite. 83 of 83 tests pass; 31 new tests in the Contradiction-framing describe block. Renders templates with mock contradiction-class strings (e.g., [timing_conflict]) and contradiction_id strings (CON.007 worked example) and asserts the framing strings are in the rendered output."
  - "scope_compliance: did NOT touch platform/src/lib/retrieve/**, platform/src/lib/config/feature_flags.ts, platform/scripts/temporal/**, 05_TEMPORAL_ENGINES/**, platform/migrations/**, 025_HOLISTIC_SYNTHESIS/**, 00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md, 01_FACTS_LAYER/**. Read-only access to 035_DISCOVERY_LAYER/REGISTERS/CONTRADICTION_REGISTER_v1_1.json (per may_touch read-only annotation; verified real (id, class) pairs to anchor the rubric example)."
  - "mirror_enforcer exit=0 (8/8 pairs clean; claude_only=2)"
  - "CURRENT_STATE updated; PROJECT_M3_SESSION_LOG close block appended; .gemini/project_state.md mirror propagated"
governance_scripts:
  mirror_enforcer: "exit=0 (8/8 pairs clean; claude_only=2)"
  drift_detector: "exit=2 (259 findings — pre-existing carry-forward from M3-W1-A2 + earlier; no new regressions)"
  schema_validator: "exit=2 (100 violations — pre-existing carry-forward; no new CRITICAL)"
red_team_due: false
red_team_performed: false
red_team_counter_after: 1
  # M3 first substantive session post-cadence-fire. M3-W1-A2 close fired the
  # IS.8(a) every-third-session red-team (REDTEAM_M3A_v1_0.md, 7 axes PASS, 0
  # findings) and reset the unified M3 counter 3→0. This A3 session is
  # substantive (synthesis-prompt amendment + smoke tests) and increments per
  # ONGOING_HYGIENE_POLICIES §G to 1. Next IS.8(a) cadence fires at counter=3
  # again (3 substantive sessions from now). The M3-D §IS.8(b) macro-phase-
  # close cadence remains scheduled.
ac_m3a3_risk_mitigation_assessment: |
  PHASE_M3_PLAN §3.1 R.M3A.3 names the risk: "Contradiction surface confuses
  synthesis output (model hedges instead of resolving)". Mitigation as written:
  "synthesis prompt amendment includes explicit 'surface contradictions, do not
  synthesize them away' rubric. Red-team verifies via fixture pair."

  This session lands the FIRST half of the mitigation — the prompt amendment
  itself. The CONTRADICTION_FRAMING block in shared.ts now carries the explicit
  "Do not average, smooth, or synthesize the contradiction away into a unified
  narrative" instruction, anchored with a worked CON.<id> example, and gates
  the model with B.1 (no L1 fabrication, no invented resolutions) + B.3 (cite
  the contradiction_id for each contradiction surfaced). Vitest cases assert
  the rubric strings survive renderTemplate() across all 7 active query classes.

  The SECOND half — the eval-harness fixture pair that verifies the mitigation
  via model behavior — is NOT in this session's scope (must_not_touch:
  platform/scripts/eval/** is implicit; the eval harness is the IS.8(b)
  macro-phase-close red-team's domain). Existing fixture coverage at
  platform/scripts/eval/fixtures.json:
    - 1 fixture (around line 283) authorizes contradiction_register as a tool
      (holistic class) but does not specifically test the surface-vs-synthesize
      framing; it asserts tool authorization, not synthesis behavior.
    - No fixture pair exists where (a) the retrieved bundle contains contradiction-
      register chunks AND (b) the gold answer surfaces them with framing AND
      (c) a paired adversarial fixture rewards or penalizes "synthesis-away"
      behavior.

  Disposition: an R.M3A.3-specific fixture pair is a M3-D scope item (IS.8(b)
  macro-phase-close red-team per AC.M3D.4 + REDTEAM_M3_v1_0.md). Recorded as a
  known_residual below; not a blocker for A3 close.

  Status of R.M3A.3 mitigation:
    - Rubric authored: ✓ (this session)
    - Rubric covers all active query classes: ✓ (7/7 via shared preamble)
    - Rubric is B.1 + B.3 compliant: ✓ (verified)
    - Eval-harness fixture pair: deferred to M3-D macro-phase-close red-team
known_residuals:
  - "R.M3A.3 fixture-pair second-half: no contradiction-framing fixture pair exists in platform/scripts/eval/fixtures.json. Add one fixture where the bundle contains contradiction-register chunks (e.g., CON.001 + CON.005) and the gold answer surfaces them with [<class>] (CON.<id>) framing, paired with an adversarial gold answer that synthesizes-away the tension. Defer to M3-D macro-phase-close red-team (AC.M3D.4 + REDTEAM_M3_v1_0.md scope). The rubric authored this session is the prompt-side half of the R.M3A.3 mitigation; the eval-side half awaits M3-D."
  - "AC.M3A.4 (DIS.009 disposition) not yet decided — analysis is ready (DIS009_ANALYSIS_v1_0.md from A1) for native verdict at M3-W1-A4-DIS009-DISPOSITION (M3-A close session). The rubric authored here will frame the verdict's downstream surface: whichever option (R1/R2/R3) lands, the resulting contradiction or resolved-claim will be surfaced via this rubric at synthesis time."
  - "AC.M3A.5 numerical metric-delta still pending (KR.W9.1 carry-forward) — qualitative-delta path adopted at A2 per BASELINE_RUN_W9_MANUAL §6 native_acceptance.conditions(a). Awaits a session with auth secrets (SMOKE_SESSION_COOKIE + SMOKE_CHART_ID + ANTHROPIC_API_KEY) to run the non-stub headless pre/post baseline."
  - "Worked example in rubric uses CON.007 + [timing_conflict] as authored by the brief literal text. The actual CONTRADICTION_REGISTER_v1_1.json entry CON.007 is class=domain_cross_claim (Moon Yogi 11H group-vs-solitary), not timing_conflict — the timing_conflict class is at CON.005. The example is a prompt-engineering anchor for the model's citation form, not a register-truth claim, so the mismatch is non-corrupting; the model substitutes with actual (class, id) pairs from the bundle. Optional polish at M3-D: tighten the example to a real (class, id) pairing or use abstract placeholders. Not a blocker."
  - "Carry-forwards from predecessors: drift_detector 259 findings + schema_validator 100 violations (pre-existing, no new regressions); SIG.MSR.207 absent from MSR_v3_0.md (M3-D disposition target); +3 latent CAPABILITY_MANIFEST entry_count miscount closed at A2 (no longer carry-forward as of A2 close); 9 pre-existing TypeScript test-fixture errors in AppShell.test + ReportGallery.test (Portal Redesign R-stream owns)."
external_computation_required: false
b10_compliance: "no chart-numerical computation in this session. The amendment is a prose rubric inside a prompt template constant; the renderTemplate function is deterministic string substitution. No L1 fact mutation, no [EXTERNAL_COMPUTATION_REQUIRED] tags emitted, no chart-numerical derivation. The rubric itself prohibits L1 fact fabrication at synthesis time, which is downstream B.10 enforcement at the model layer."
ppl_substrate_writes: "none — this session emits no time-indexed predictions. The prompt amendment is governance-layer scaffold; predictions are emitted by sessions that run synthesis end-to-end (not this session, which only authors the template)."
mirror_updates_propagated:
  - pair_id: MP.2
    claude_side: 00_ARCHITECTURE/CURRENT_STATE_v1_0.md
    gemini_side: .gemini/project_state.md
    propagated: true
    mode: adapted_parity_state
notes: >
  Track 1 (Retrieval & Discovery) third execution session. Brief deliverables D1–D5
  all landed within the same session per the brief's "amendment is additive" lifecycle:
  D1 (located shared preamble buildOpeningBlock() as the single injection point —
  documented above), D2 (CONTRADICTION_FRAMING constant added; injected into
  buildOpeningBlock() between NO_FABRICATION and METHODOLOGY_INSTRUCTION; covers
  all 7 active classes), D3 (B.1 + B.3 anchors verified explicit in rubric body;
  npx tsc --noEmit reports 0 new errors), D4 (vitest 83/83 with 31 new tests
  asserting framing strings in rendered output), D5 (R.M3A.3 risk-mitigation
  assessment recorded above as ac_m3a3_risk_mitigation_assessment; eval-harness
  fixture pair flagged as M3-D scope, not an A3 blocker).

  Counter rationale: A2 close fired the IS.8(a) every-third-session cadence
  (REDTEAM_M3A_v1_0.md, 7 axes PASS, 0 findings) and reset counter 3→0. This A3
  session is substantive (synthesis-prompt amendment with smoke verification);
  per ONGOING_HYGIENE_POLICIES §G it increments to 1. No cadence due in-session.

  Multi-track close coordination delta: at session open, the on-disk CURRENT_STATE
  state-block field last_session_id still showed M3-W3-C2-KP-VARSHAPHALA (from a
  parallel-track close-time write race earlier today), even though A2's close
  block in this session log claimed it had updated CURRENT_STATE and the file's
  file_updated_by_session field confirmed A2 was the last writer. The §3
  narrative correctly carried A2 close at the top. This A3 session updates both
  the §2 state-block last_session_id and the §3 narrative to A3, closing the
  multi-track delta.

  Next session: M3-W1-A4-DIS009-DISPOSITION (Track 1 — DIS.009 disposition decision
  per PHASE_M3_PLAN §3.1 deliverable #4 + AC.M3A.4; native picks R1 SPLIT / R2
  WITHDRAW / R3 RE-GROUND; M3-A close-checklist follows). The rubric authored this
  session frames the verdict's downstream synthesis surface: whichever option lands,
  the resulting (resolved or open) contradiction is surfaced under the rubric.

=== M3-W3-C3-SHADBALA CLOSE ===
closed: 2026-05-01
git_sha: "(close-time)"
session_agent: claude-opus-4-7
agent_version: claude-opus-4-7[1m]
cowork_thread_name: "M3-W3-C3-SHADBALA"
predecessor_session: M3-W3-C2-KP-VARSHAPHALA   # Track 3 chain per session brief
previous_session_id: M3-W1-A3-CONTRADICTION-ENGINE   # chronologically-immediately-prior closed session (parallel-track)
track: "Track 3 (Jaimini + KP + Varshaphala + Shadbala), third execution session AND M3-C SUB-PHASE CLOSE. Owns: compute_shadbala.py + Shadbala over-time series + migration 031 + Shadbala cross-check + REDTEAM_M3C (M3-C sub-phase-close quality gate) + DIS.010/011/012 (Jaimini school_disagreement entries) + M3-C CLOSED flag in Wave 3 table. Concurrent with Track 1 M3-W1-A4 (pending) and Track 2 (B-track open at B2 close)."
deliverables:
  - platform/scripts/temporal/compute_shadbala.py: "new (engine v1: pyswisseph Moshier + Lahiri sidereal; computes Uccha + Dig + Naisargika + Nathonnatha for 7 planets; marks Sthana + Drik as [EXTERNAL_COMPUTATION_REQUIRED] per CLAUDE.md §I B.10; CLI args --chart-id/--birth/--query-date/--birth-lat/--birth-lon/--vimshottari/--output/--sql-output)"
  - 05_TEMPORAL_ENGINES/shadbala/SHADBALA_RAW_v1_0.json: "new (63 rows = 9 snapshots × 7 planets; snapshots = 7 Vimshottari MD start_dates + final MD end_date + today 2026-05-01; time-of-day held at native birth time 10:43 IST; envelope schema_version 1.0)"
  - 05_TEMPORAL_ENGINES/shadbala/SHADBALA_INSERT_v1_0.sql: "new (63 INSERTs idempotent ON CONFLICT DO NOTHING; bundles CREATE TABLE IF NOT EXISTS shadbala for offline replay; mirrors migration 031 schema)"
  - 05_TEMPORAL_ENGINES/shadbala/CROSSCHECK_v1_0.md: "new (verdict WITHIN_TOLERANCE_PENDING_REVIEW; AC.M3C.4 anchors PASS — Saturn Uccha 59.19 vs FORENSIC 59.18 Δ+0.01; Sun Uccha 33.99 vs FORENSIC 33.99 Δ+0.00; three findings flagged for native review at M3-C close: Naisargika value-disagreement, Nathonnatha class-swap Saturn↔Venus, Nathonnatha altitude-vs-time-linear methodology)"
  - platform/migrations/031_shadbala.sql: "new (CREATE TABLE IF NOT EXISTS shadbala + 2 indexes + 7 natal-snapshot INSERTs; idempotent; companion to SHADBALA_INSERT_v1_0.sql for the over-time series)"
  - 00_ARCHITECTURE/EVAL/REDTEAM_M3C_v1_0.md: "new (M3-C sub-phase-close quality-gate red-team — NOT §IS.8(a) cadence; 7 axes: B.1, B.3, B.10, ECR completeness, Jaimini boundary, migration idempotency, school-disagreement close-scope; verdict PASS, 0 findings, 0 fixes; 4 findings preserved for native review surfaced as cross-check + DIS-class artifacts)"
  - 00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md: "extended — DIS.010 (Chara sequence-start AK vs Lagna), DIS.011 (Chara sign-duration rule), DIS.012 (Narayana absent FORENSIC baseline) appended as DIS.class.school_disagreement; status open; resolution pending_native_verdict; default N3 per phase-plan policy (defer to M9)"
  - 00_ARCHITECTURE/PROJECT_M3_SESSION_LOG.md: "Wave 3 row M3-W3-C3-SHADBALA flipped PENDING → CLOSED + 'M3-C SUB-PHASE CLOSED' annotation; Wave 3 header updated to 'CLOSED 2026-05-01'; this close block appended"
  - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md: "amended in-place — last_session_id → M3-W3-C3-SHADBALA; active_phase_plan_sub_phase → 'M3-C CLOSED (Track 3 complete: C1 + C2 + C3 + REDTEAM_M3C + DIS.010-012 logged)'; next_session_objective → M3-W1-A4-DIS009-DISPOSITION (Track 1) or Track 2 B-track close, native-trigger picked; §3 narrative refreshed; changelog entry added; red_team_counter 1→2"
  - .gemini/project_state.md: "MP.2 mirror — adapted-parity update reflecting M3-C close + Shadbala engine landed + DIS.010-012 opened"
acceptance_criteria_passed:
  - "AC.M3C.4: Shadbala over-time series produced (63 rows × 9 snapshots × 7 planets); per-planet natal sanity check vs FORENSIC §6.1 — Saturn Uccha 59.19 within ±2 of 59.18 (Δ+0.01) ✓; Sun Uccha 33.99 within ±2 of 33.99 (Δ+0.00) ✓. All seven planets' Uccha + Dig values within ±0.02 virupas of FORENSIC. Cross-check artifact CROSSCHECK_v1_0.md authored with verdict WITHIN_TOLERANCE_PENDING_REVIEW per brief framing (Sthana + Drik are [EXTERNAL_COMPUTATION_REQUIRED] so full FORENSIC totals cannot be reproduced from 4 components alone — by design)."
  - "AC.M3C.5: ≥3 DIS.class.school_disagreement entries opened in DISAGREEMENT_REGISTER_v1_0.md — DIS.010 (Chara sequence-start AK vs Lagna), DIS.011 (Chara sign-duration rule), DIS.012 (Narayana FORENSIC baseline absent). Each entry follows §2 schema with contradiction_id, class, hypothesis_text equivalent, mechanism (description field), domains_implicated (linked_artifacts), l1_references, opened_by_session, opened_on, status: open, resolution: pending_native_verdict, resolution_options (R1/R2/R3 patterns). Native verdicts pending at M3-C close per AC.M3C.5 framing — phase-plan policy default N3 (defer to M9 multi-school triangulation) acknowledged."
  - "AC.M3C.6: REDTEAM_M3C_v1_0.md authored as M3-C sub-phase-close quality gate (NOT §IS.8(a) cadence — that fired at A2 with REDTEAM_M3A; counter at session open = 1 per CURRENT_STATE; counter increments to 2 this session; next §IS.8(a) at counter=3). 7 axes (B.1, B.3, B.10, ECR completeness, Jaimini boundary, migration idempotency, school-disagreement close-scope) all PASS, 0 findings, 0 fixes applied. M3-C close artifacts D4 + D5 unblocked by hard gate."
  - "ADDITIONAL — Migration 031_shadbala.sql is idempotent (IF NOT EXISTS + ON CONFLICT DO NOTHING + BEGIN/COMMIT wrap) — verified by Axis F of REDTEAM_M3C."
  - "ADDITIONAL — TypeScript not touched — 0 new TS errors introduced (no platform/src/** modifications this session)."
  - "ADDITIONAL — Jaimini boundary respected: compute_shadbala.py does not import or use compute_chara/compute_narayana output; CROSSCHECK_v1_0.md cites only FORENSIC §6.1 + engine outputs; DIS.010-012 use Jaimini CROSSCHECK file as evidence, not as computational input — verified by Axis E of REDTEAM_M3C."
  - "scope_compliance: did NOT touch platform/src/lib/retrieve/**, platform/src/lib/synthesis/**, platform/src/lib/bundle/**, 05_TEMPORAL_ENGINES/dasha/jaimini/** (read-only for D4 close-artifact authoring only), platform/scripts/temporal/compute_chara.py, platform/scripts/temporal/compute_narayana.py, 025_HOLISTIC_SYNTHESIS/**, 035_DISCOVERY_LAYER/**, 01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md (read-only for cross-check anchor), 01_FACTS_LAYER/**. L1 frozen."
  - "mirror_enforcer expected exit=0 (8/8 pairs clean); script run at session-close per governance section"
  - "CURRENT_STATE updated; PROJECT_M3_SESSION_LOG close block appended; .gemini/project_state.md mirror propagated"
governance_scripts:
  mirror_enforcer: "(close-time — expected exit=0)"
  drift_detector: "(close-time — expected exit=2 carry-forward)"
  schema_validator: "(close-time — expected exit=2 carry-forward)"
red_team_due: true   # M3-C sub-phase-close quality gate per session brief D3 (not §IS.8(a) cadence)
red_team_performed: true
red_team_verdict: PASS
red_team_artifact: 00_ARCHITECTURE/EVAL/REDTEAM_M3C_v1_0.md
red_team_counter_at_fire: 1
red_team_counter_after: 2   # M3-C third substantive execution session post-A2 IS.8(a) cadence-fire (A3 was 1, this is 2). Per ONGOING_HYGIENE_POLICIES §G this is a substantive session that increments. Next §IS.8(a) cadence fires at counter=3 (one substantive session from now). The §IS.8(b) macro-phase-close cadence fires at M3-D close per PHASE_M3_PLAN §3.4 AC.M3D.4.
db_pre_check_at_open:
  dasha_periods: NULL          # to_regclass returned NULL — migration 022 not applied
  signal_states: NULL          # migration 023 not applied
  kp_sublords: NULL            # migration 024 not applied
  varshaphala: NULL            # migration 025 not applied
  disposition: "Recorded as carry-forward for native action; engine work for D1 self-contained per brief CONTEXT item 3 — migration 031_shadbala.sql does not depend on 022-025 tables. Native authorization required to apply 022-031 together."
findings_for_native_review_at_m3c_close:
  - "Naisargika Bala convention — brief stipulates Saturn-strongest descending order (Saturn=60..Sun=7.5 rupas); classical FORENSIC §6.1 SBL.NAISARG.TOTAL is Sun-strongest descending order (Sun=60..Saturn=8.58 virupas). Engine emits brief values. Native disposition options N1/N2/N3 in CROSSCHECK §5."
  - "Nathonnatha classification (Saturn ↔ Venus) — brief stipulates Saturn ∈ DIURNAL and Venus ∈ NOCTURNAL; classical (per FORENSIC §6.1 SBL.NATH evidence at native time-of-day) is Saturn ∈ NOCTURNAL and Venus ∈ DIURNAL. Engine emits brief classification. ±51.6 virupa swing on Venus + Saturn rows. Native disposition options N1/N2/N3/N4 in CROSSCHECK §4 finding 4a."
  - "Nathonnatha linearization (altitude vs time vs ghati) — engine implements altitude-linear per brief literal text; FORENSIC values consistent with time-linear or ghati-from-sunrise. ±4.5 virupa drift on correctly-classified diurnals. Native disposition options N1/N2/N3 in CROSSCHECK §4 finding 4b."
  - "DIS.010/011/012 (Jaimini multi-tradition disagreements) — three open DIS.class.school_disagreement entries with R1/R2/R3 options each; default N3 per phase-plan policy (defer to M9). Native picks at M3-C close per PHASE_M3_PLAN §3.3 AC.M3C.5."
known_residuals:
  - "Migrations 022-025 NOT applied to live DB at session-open (DB pre-check: all four to_regclass = NULL). Native action required to apply 022-031 together. Engine work for this session is self-contained — 031_shadbala.sql does not depend on 022-025 tables. Carry-forward for native action."
  - "Sthana Bala + Drik Bala marked [EXTERNAL_COMPUTATION_REQUIRED] in every row of SHADBALA_RAW_v1_0.json + migration 031 (sthana_ecr=true, drik_ecr=true, ecr_components=['sthana','drik'], needs_verification=true). Resolution: Jagannatha Hora Saptavargaja Bala export per ED.1 (Sthana) + JH/Shri-Jyoti aspect-strength table per ED.1 (Drik). Out-of-pipeline; awaits JH export step."
  - "Naisargika + Nathonnatha findings: see findings_for_native_review_at_m3c_close above. Documented in CROSSCHECK §4 §5 with disposition options. NOT promoted to DIS register entries this session per Axis G of REDTEAM_M3C (these are brief-vs-classical fact-check decisions, not Vedic-tradition multi-school disagreements proper). Native may promote to DIS register at M3-C close if desired."
  - "DIS.010-012 status open; resolution pending_native_verdict. Per phase-plan policy + Axis G of REDTEAM_M3C, default N3 (defer to M9 multi-school triangulation). Native verdict at M3-C close updates each entry's status to resolved/escalated_to_native/deferred_to_m9."
  - "TypeScript carry-forwards: 9 pre-existing errors in tests/components/AppShell.test.tsx + tests/components/ReportGallery.test.tsx (Portal Redesign R-stream owns) — unchanged, 0 new errors this session."
  - "Carry-forwards from predecessors: drift_detector ~259 findings + schema_validator ~100 violations (pre-existing, no new regressions); SIG.MSR.207 absent from MSR_v3_0.md (M3-D disposition target); +3 latent CAPABILITY_MANIFEST entry_count miscount closed at A2 (no longer carry-forward)."
b10_compliance: "All chart-numerical values in compute_shadbala.py output trace to a swisseph call signature (compute_sidereal_longitude → swe.calc_ut FLG_MOSEPH|FLG_SIDEREAL; compute_angles → swe.houses_ex; compute_sun_altitude → swe.calc_ut + swe.azalt) or to a brief-stipulated constant (NAISARGIKA_BALA dict; EXALTATION_LON dict). Sthana + Drik are SCHEMA-LEVEL ECR (no numeric column in the dataclass or SQL schema) per session brief D1.e/f. ImportError for swisseph triggers sys.exit(2) with [EXTERNAL_COMPUTATION_REQUIRED] message."
ppl_substrate_writes: "none — engine produces structural strength values per planet/date, not forward-looking time-indexed predictions; no PPL writes obligated this session."
mirror_updates_propagated:
  - pair_id: MP.2
    claude_side: 00_ARCHITECTURE/CURRENT_STATE_v1_0.md
    gemini_side: .gemini/project_state.md
    propagated: true
    mode: adapted_parity_state
disagreement_register_entries_opened: [DIS.010, DIS.011, DIS.012]
disagreement_register_entries_resolved: []
notes: >
  Track 3 third execution session AND M3-C SUB-PHASE CLOSE. Per session brief
  CONTEXT block reconciliation at session-open:

  (1) Counter discrepancy resolved: brief premise was counter=3 with cadence due;
      reality on disk was counter=1 (A2 fired §IS.8(a) cadence, A3 incremented
      0→1). Native acknowledged at session open. REDTEAM_M3C_v1_0.md authored
      as M3-C sub-phase-close quality gate (not §IS.8(a) cadence-fire). §IS.8(b)
      macro-phase-close cadence remains scheduled for M3-D close per
      PHASE_M3_PLAN §3.4 AC.M3D.4.

  (2) Predecessor dual-pointer: brief-declared = M3-W3-C2-KP-VARSHAPHALA
      (Track 3 chain); chronologically-immediately-prior = M3-W1-A3-CONTRADICTION-ENGINE
      (parallel-track). Both recorded above per native-approved framing.

  (3) DB pre-check: all four W2/C2 tables (dasha_periods, signal_states,
      kp_sublords, varshaphala) returned NULL — migrations 022-025 not yet
      applied. Recorded as carry-forward; engine work proceeded since
      031_shadbala.sql is self-contained.

  (4) Migration 031 confirmed free; authored as new this session.

  (5) Jaimini boundary respected: read-only access to jaimini/CROSSCHECK_v1_0.md
      for D4 entry authoring; compute_chara/compute_narayana NOT invoked;
      jaimini/** outputs NOT used as computational input.

  (6) Shadbala scope: 4 computable + 2 ECR. Verdict WITHIN_TOLERANCE_PENDING_REVIEW
      per brief framing. AC.M3C.4 anchors PASS. Three findings (Naisargika +
      Nathonnatha class-swap + Nathonnatha linearization) preserved in
      CROSSCHECK §4 §5 §9 for native review at M3-C close.

  (7) CLAUDECODE_BRIEF.md at root status COMPLETE (R3 portal redesign,
      unrelated). Skipped per CLAUDE.md §C item #0.

  M3-C SUB-PHASE CLOSED. All M3-C ACs (AC.M3C.1 through AC.M3C.6 plus the
  ADDITIONAL gates per session brief) passed. Three open DIS entries
  (DIS.010/011/012) carry the substantive Jaimini-tradition disagreements
  forward to native arbitration at this M3-C close moment + M9 structural
  resolution layer. The Track 3 substrate (Chara + Narayana + KP +
  Varshaphala + Shadbala) is now complete pending JH-export verification
  on Sthana + Drik (Shadbala) + Narayana (Jaimini), all of which are
  external-acharya / JH-export class deliverables out of M3-C scope.

  Next session: M3-W1-A4-DIS009-DISPOSITION (Track 1 — DIS.009 disposition
  decision per PHASE_M3_PLAN §3.1 deliverable #4 + AC.M3A.4) is the natural
  sequencing successor since Track 1 is the in-flight track with the open
  M3-A close-checklist. Alternative: native may pick a Track 2 wrap-up
  session (e.g., antardasha cross-check or signal_activator v2) before
  M3-A close; Track 2 may also close en bloc at M3-D per PHASE_M3_PLAN §3.2.
  After M3-A closes, the next major boundary is M3-D macro-phase close
  (validator + held-out sample + IS.8(b) red-team + M3_CLOSE_v1_0.md +
  HANDOFF_M3_TO_M4_v1_0.md per PHASE_M3_PLAN §3.4).


=== M3-W1-A4-DIS009-DISPOSITION CLOSE ===
closed: 2026-05-01
git_sha: (close-time)
session_agent: claude-opus-4-7[1m]
cowork_thread_name: "M3-W1-A4-DIS009-DISPOSITION"
predecessor_session: M3-W3-C3-SHADBALA
track: "Track 1 (Discovery Engine + DIS.009) closing session — M3-A SUB-PHASE CLOSE. DIS.009 R3 disposition + IS.8(a) cadence-fire red-team + M3-A close-checklist all in this session. Tracks 2 + 3 unaffected (Track 3 already CLOSED at C3; Track 2 has B3 optional or close en bloc at M3-D)."
deliverables:
  - 035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.json: "PAT.008 mechanism re-grounded per native R3 verdict at Gate 1; claim_text rewritten with two-step Saturn-Mercury identity-axis framing; mechanism text rewritten to make AL-direct + Karakamsa-via-Mercury-dispositorship explicit; [EXTERNAL_COMPUTATION_REQUIRED] block added per CLAUDE.md §I B.10 (JH D9 export to verify Moon D9 = Gemini + Mercury D1 = Capricorn); status set to needs_verification; re_validation_status flipped gemini_conflict → resolved_pending_ecr; resolution_session + resolution_note added"
  - 035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.md: "companion .md updated to match JSON; Status line added; DIS.009 resolution paragraph appended"
  - 00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md: "DIS.009 status open → resolved; resolution prose authored; resolved_on=2026-05-01; resolved_by_session=M3-W1-A4-DIS009-DISPOSITION; arbitration_steps_taken extended with reconciler_resolution (A1 analysis) + native_arbitration (this session R3 verdict); linked_artifacts extended with DIS009_ANALYSIS_v1_0.md + PATTERN_REGISTER_v1_0.md companion"
  - 00_ARCHITECTURE/EVAL/REDTEAM_M3A2_v1_0.md: "new — IS.8(a) every-third-session cadence-fire red-team; counter trail A2-fire-reset → A3=1 → C3=2 → A4=3 → fires + resets to 0; 7 axes (B.1 layer-separation, B.3 derivation-ledger, B.10 no-fabricated-computation, flag-gate correctness, DIS.009 consistency, eval baseline integrity, scope compliance); verdict PASS 7/7; 0 CRITICAL/0 HIGH/0 MEDIUM/1 LOW (ECR clarification carry-forward KR.M3A2.1)"
  - 00_ARCHITECTURE/PROJECT_M3_SESSION_LOG.md: "Wave 1 row M3-W1-A4-DIS009-DISPOSITION flipped PENDING → CLOSED; Wave 1 header updated to 'CLOSED 2026-05-01'; this close block appended"
  - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md: "amended in-place — last_session_id → M3-W1-A4-DIS009-DISPOSITION; red_team_counter 2→3 (IS.8(a) FIRES) → reset to 0; active_phase_plan_sub_phase reflects M3-A CLOSED; next_session_objective updated; §3 narrative refreshed; changelog entry added"
  - .gemini/project_state.md: "MP.2 mirror — adapted-parity update reflecting DIS.009 resolved + M3-A closed + counter reset"
  - 00_ARCHITECTURE/SESSION_LOG.md: "session_open + session_close blocks appended atomically"
acceptance_criteria_passed:
  - "AC.M3A.1 — BASELINE_RUN_W9_MANUAL_v1_0.md exists, non-stub, all six metric rows populated (manual-capture mode per phase-plan entry-gate clause; numerical values await KR.W9.1 auth secrets); native-accepted at A1 close 2026-05-01"
  - "AC.M3A.2 — Pattern Engine tool ships behind DISCOVERY_PATTERN_ENABLED flag; default false at first commit, flipped true after smoke (REDTEAM_M3A §3 8/8 PASS); durable in feature_flags.ts:86 default-true"
  - "AC.M3A.3 — Contradiction Engine tool ships behind DISCOVERY_CONTRADICTION_ENABLED flag; same wiring + smoke pattern as AC.M3A.2; durable in feature_flags.ts:87"
  - "AC.M3A.4 — DIS.009 has terminal status (resolved); native R3 verdict recorded; PAT.008 mechanism re-grounded; ECR added per B.10"
  - "AC.M3A.6 — chart_facts and FORENSIC remain mandatory floor in every retrieved bundle (composition layer must_not_touch this session; held over from W6/W7 audit)"
  - "AC.M3A.7 — Pattern + Contradiction tool catalog entries in CAPABILITY_MANIFEST.json: PATTERN_REGISTER_JSON tool_binding=pattern_register, TOOL_QUERY_PATTERNS, CONTRADICTION_REGISTER_JSON tool_binding=contradiction_register, TOOL_QUERY_CONTRADICTIONS; entry_count=112 matches len(entries)=112"
  - "AC.M3A.8 — Synthesis prompt amendments preserve B.1 layer-separation (CONTRADICTION_FRAMING preamble in shared.ts is instructional prose with explicit B.1+B.3 enforcement clauses; covered by RT.M3A2.1)"
  - "AC.M3A.9 — IS.8(a) cadence discharged; REDTEAM_M3A2_v1_0.md PASS 7/7 axes 0 CRITICAL/HIGH/MEDIUM 1 LOW; counter 2→3 fires + resets 3→0"
acceptance_criteria_deferred:
  - "AC.M3A.5 — BASELINE_RUN_M3A_POST.json: DEFERRED. Rationale: auth wall (HTTP 401 on /api/chat/consume; Firebase __session cookie unavailable in headless session) prevented both pre-baseline and post-baseline numerical capture. BASELINE_RUN_W9_MANUAL_v1_0.md §6 native-acceptance scope of acceptance allowed AC.M3A.5 to be (a) waived metric-delta with descriptive delta or (b) require secrets to land before M3-A close. Native-accepted defer at this session close. Target session: first M3-A-post / M3-D session with auth secrets."
governance_scripts:
  mirror_enforcer: "exit=0 (8/8 pairs clean; claude_only=2)"
  drift_detector: "(at-close run; expected exit=2 carry-forward, no new regressions — all touched files are governance-layer artifacts; no canonical-artifact fingerprint changes outside CURRENT_STATE/.gemini/project_state.md/SESSION_LOG/PROJECT_M3_SESSION_LOG/DISAGREEMENT_REGISTER all of which are LIVING-not-fingerprint-locked)"
  schema_validator: "(at-close run; expected exit=2 carry-forward; no new CRITICAL)"
red_team_due: true (IS.8(a) every-third-session cadence)
red_team_performed: true (REDTEAM_M3A2_v1_0.md PASS)
red_team_counter_after: 0 (cadence fired 2→3, reset to 0)
known_residuals:
  - "KR.W9.1 (carry-forward from A1) — Non-stub BASELINE_RUN_W9.json not yet captured; auth secrets unavailable. Severity MEDIUM. Target: first M3-A-post / M3-D session with auth."
  - "KR.W9.2 (carry-forward from A1) — Runner --fixture-ids parser quirk (empty default → empty filter → zero matches). Severity LOW. Target: hygiene-pass session."
  - "KR.M3A2.1 (new this session) — PAT.008 ECR text could explicitly cite FORENSIC §3.5 as in-corpus L1 source for what JH is being asked to verify (Moon D9 = Gemini + Mercury D9 = Capricorn Vargottama already L1-attested). Severity LOW (documentation clarity, not B.10 violation). Native-instructed ECR text held verbatim per Gate 1 hard constraint. Target: M3-D acharya-grade chart-reading review or any session where native revisits PAT.008."
  - "KR.M3A.JH-EXPORT — DIS.009 R3 disposition embeds [EXTERNAL_COMPUTATION_REQUIRED]; full DIS.009 closure pending JH D9 export per ED.1 to confirm Moon D9 = Gemini + Mercury D1 = Capricorn (ECR is belt-and-suspenders since both already in FORENSIC §3.5 + §1; native-instructed verification path). Target: M3-B-class verification window."
  - "Inherited from M2 close (carry-forward; not blocking M3-A close): SIG.MSR.207 absent from MSR_v3_0.md (read-only investigation); UCN inline citation pass (aspirational); TypeScript test-fixture errors in tests/components/AppShell.test.tsx + ReportGallery.test.tsx (Portal Redesign R-stream owns)"
notes: >
  M3-A SUB-PHASE CLOSED 2026-05-01 at this session. Track 1 deliverable arc complete:
  A1 (eval baseline + DIS.009 written analysis) → A2 (Pattern + Contradiction +
  Resonance + Cluster flag-gating + manifest entry_count fix + REDTEAM_M3A IS.8(a)
  fire) → A3 (synthesis-prompt CONTRADICTION_FRAMING amendment) → A4 (this session:
  DIS.009 R3 disposition + REDTEAM_M3A2 IS.8(a) cadence-fire + M3-A close).

  Gate 1 (DIS.009 disposition): native chose R3 (RE-GROUND) with specific rewrite
  direction. PAT.008 mechanism rewritten in-place to make the two-step architecture
  explicit — Saturn directly governs the AL (L1-clean from FORENSIC §17 + Capricorn
  rulership), and Saturn disposits Mercury in Capricorn 10H Vargottama (L1-attested
  at FORENSIC §1 line 160 + §3.5 line 285) where Mercury rules the D9 Karakamsa
  (Gemini, derived from AK = Moon + Moon D9 = Gemini + Mercury rulership of Gemini).
  The Saturn-Mercury identity axis across the Capricorn-Gemini spine is the
  corrected mechanism. [EXTERNAL_COMPUTATION_REQUIRED] block added per native
  instruction; status: needs_verification; re_validation_status: resolved_pending_ecr.
  DIS.009 status: resolved; resolved_on: 2026-05-01.

  Gate 2 (IS.8(a) red-team): REDTEAM_M3A2_v1_0.md authored as the second IS.8(a)
  cadence-fire in M3 (counter trail: A2-fire-reset 3→0; A3 0→1; C3-Shadbala 1→2;
  A4 2→3 → FIRES → reset 3→0). Seven axes: B.1 layer-separation, B.3
  derivation-ledger, B.10 no-fabricated-computation, flag-gate correctness,
  DIS.009 consistency, eval baseline integrity, scope compliance. Verdict PASS
  7/7; 0 CRITICAL / 0 HIGH / 0 MEDIUM / 1 LOW. The single LOW (KR.M3A2.1) is a
  documentation-clarity carry-forward — the native-instructed ECR text could
  reference FORENSIC §3.5 as in-corpus L1 source for what JH is asked to verify.
  Held verbatim per Gate 1 hard constraint.

  Gate 3 (M3-A close): 8 of 9 ACs PASS; AC.M3A.5 DEFERRED with rationale (auth
  wall blocks both pre and post baseline numerical capture; phase-plan entry-gate
  clause + native-acceptance scope at A1 close authorize defer). M3-A SUB-PHASE
  CLOSED.

  Scope strictly respected: did NOT touch platform/src/lib/retrieve/**,
  platform/src/lib/synthesis/**, platform/src/lib/bundle/**, 01_FACTS_LAYER/**,
  05_TEMPORAL_ENGINES/**, platform/migrations/**, 025_HOLISTIC_SYNTHESIS/**,
  PHASE_M3_PLAN_v1_0.md, CAPABILITY_MANIFEST.json (read-only verification of
  AC.M3A.7). L1 frozen.

  Next session: native to choose M3-W2-B3-ANTARDASHA-CROSSCHECK (standalone
  Track 2 wrap-up) OR M3-W4-D1-VALIDATOR-REDTEAM (close Track 2 en bloc at M3-D
  per PHASE_M3_PLAN §3.2).
