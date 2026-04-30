---
artifact: PHASE_M3_PLAN_v1_0.md
canonical_id: PHASE_M3_PLAN
version: 1.0
status: CURRENT
authored_by: KARN-W9-M3-OPEN
authored_at: 2026-05-01
parent_macro_phase: M3 — Temporal Animation / Discovery Layer (Pattern + Contradiction Engines)
parent_plan: 00_ARCHITECTURE/MACRO_PLAN_v2_0.md §M3
predecessor_artifact: 00_ARCHITECTURE/HANDOFF_M2_TO_M3_v1_0.md
predecessor_phase_plan: 00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md (SUPERSEDED-AS-COMPLETE for M2 at KARN-W8-R2-M2-CLOSE)
sub_phases: [M3-A, M3-B, M3-C, M3-D]
hard_prerequisite_gate: "M2 eval baseline (BASELINE_RUN_W7.json → BASELINE_RUN_M3A.json) must be CAPTURED before any M3 retrieval-behavior change. Gates M3-A entry."
native_approval_points:
  - M3-A entry — eval baseline capture acceptance
  - M3-A close — DIS.009 disposition decision
  - M3-B entry — ayanamsha selection if deviating from project default
  - M3-C close — dasha-school disagreement-resolution verdicts
  - M3-D close — M3 macro-phase close (acharya-grade review on 5 chart readings)
mirror_obligations:
  claude_side: 00_ARCHITECTURE/PHASE_M3_PLAN_v1_0.md
  gemini_side: phase-plan pointer in .gemini/project_state.md (MP.4 adapted parity, propagated at first M3-A session)
  mirror_mode: adapted_parity_pointer
  authoritative_side: claude
  asymmetries: >
    Gemini-side carries a one-line pointer to this plan plus the active sub-phase ID. Full
    sub-phase tables stay Claude-side. Gemini-side updates on each sub-phase transition.
changelog:
  - v1.0 (2026-05-01, KARN-W9-M3-OPEN): Initial M3 phase plan. Sub-phases M3-A through
    M3-D defined per HANDOFF_M2_TO_M3 §What M3 needs to know + MACRO_PLAN_v2_0 §M3.
    Hard prerequisite gate (eval baseline) recorded for M3-A entry. DIS.009 disposition
    decision point recorded at M3-A close. BHISMA sprint (KARN-W9-B1/B2/B3/B4) referenced
    as parallel-allowed co-stream, non-blocking on M3 sub-phase progression.
---

# PHASE M3 PLAN — v1.0

## §0 — Status block

| Field | Value |
|---|---|
| Macro-phase | **M3 — Temporal Animation / Discovery Layer (Pattern + Contradiction Engines)** |
| Active sub-phase | **M3-A — Eval Baseline + Discovery Engine Activation + DIS.009 Disposition** (entry-blocked on eval baseline capture) |
| Sub-phase status | NOT YET STARTED — this session is plan-authoring only |
| Phase opened | 2026-05-01 (KARN-W8-R2-M2-CLOSE flipped active_macro_phase M2→M3) |
| Phase plan authored | 2026-05-01 (this session — KARN-W9-M3-OPEN) |
| Hard prerequisite gate | M2 eval baseline must be captured before M3-A retrieval changes |
| Concurrent (non-blocking) | KARN-W9 BHISMA sprint (B1/B2/B3/B4); LEL workstream; Portal Redesign R1–R6; PPL active-from-emission |

## §1 — Reading order for M3 sessions

Per `CLAUDE.md §C`, every M3 session reads its mandatory list at open. Sub-phase-specific
add-ons:

- **All M3 sessions:** add this file to the mandatory-reading list (item 5 slot, replacing
  PHASE_B_PLAN). HANDOFF_M2_TO_M3 stays read-once at first M3 session, then is referenced
  but not re-read (closed handoff memo).
- **M3-A sessions:** add `BASELINE_RUN_W7.json` (or its successor `BASELINE_RUN_M3A.json` once
  captured) and `00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md §DIS.009`.
- **M3-B sessions:** add `MACRO_PLAN_v2_0.md §External Dependency Graph ED.1 (Jagannatha
  Hora) + ED.2 (Swiss Ephemeris)`.
- **M3-C sessions:** add the dasha-school cross-check artifact (path declared at M3-C entry).
- **M3-D sessions:** add `00_ARCHITECTURE/EVAL/REDTEAM_M2_v1_0.md` (precedent template) and
  the held-out date sample fixture (path declared at M3-D entry).

## §2 — Sub-phase summary

| Sub-phase | One-line scope | Entry gate | Exit gate | Deliverable folder(s) |
|---|---|---|---|---|
| **M3-A** | Discovery Engine activation (Pattern + Contradiction surfaces query-time); eval baseline; DIS.009 disposition. | M2 eval baseline captured (HARD GATE). | Pattern + Contradiction Engines surfacing in synthesis; DIS.009 disposed; pre/post baseline delta recorded. | `platform/src/lib/retrieve/`, `platform/src/lib/bundle/`, `035_DISCOVERY_LAYER/REGISTERS/`, `00_ARCHITECTURE/EVAL/` |
| **M3-B** | Vimshottari + Yogini dashas; transit engine v1; date-indexed lit/dormant/ripening signal surface. | M3-A closed; ayanamsha confirmed. | Vimshottari MD/AD/PD/SD computed for native lifetime; Yogini computed; transit engine emits date-indexed signal states for held-out sample. | `05_TEMPORAL_ENGINES/dasha/`, `05_TEMPORAL_ENGINES/transit/` |
| **M3-C** | Chara + Narayana dashas (Jaimini); KP sublord timing; Varshaphala (Tajika); shadbala over time; cross-school disagreement register. | M3-B closed; ED.1 + ED.2 cross-checks operational. | All listed schools/computations populated; cross-school disagreements logged with native verdicts; shadbala-over-time series produced. | `05_TEMPORAL_ENGINES/dasha/jaimini/`, `05_TEMPORAL_ENGINES/kp/`, `05_TEMPORAL_ENGINES/varshaphala/`, `05_TEMPORAL_ENGINES/shadbala/` |
| **M3-D** | Temporal validator meta-tests; held-out date sample validation; IS.8 macro-phase-close red-team; M3_CLOSE + HANDOFF_M3_TO_M4. | M3-C closed; native acharya-grade review scheduled. | M3 closed; CURRENT_STATE flipped M3→M4; mirrors propagated; M3_CLOSE_v1_0.md + HANDOFF_M3_TO_M4_v1_0.md authored. | `00_ARCHITECTURE/EVAL/`, `00_ARCHITECTURE/M3_CLOSE_v1_0.md`, `00_ARCHITECTURE/HANDOFF_M3_TO_M4_v1_0.md` |

## §3 — Sub-phase details

### §3.1 — M3-A — Eval Baseline + Discovery Engine Activation + DIS.009 Disposition

**Scope.** This sub-phase is the operational stream named in `HANDOFF_M2_TO_M3 §What M3 needs
to know §1` — moving the L3.5 Discovery Engine surfaces (Pattern + Contradiction +
Resonance + Cluster) from "registers exist in DB" (M2 deliverable) to "queried at synthesis
time and surfaced in answers" (M3 Pattern + Contradiction Engine activation). DIS.009
(`DIS.class.output_conflict` on PAT.008 — Saturn D9 Karakamsa + AL Identity Lock; opened
2026-04-27 at Madhav_M2A_Exec_11) is dispositioned at this sub-phase's close because it is
the first sub-phase that touches the Pattern register at synthesis time and therefore the
first natural moment for the entry to be either (a) RESOLVED (split / re-grounded /
[EXTERNAL_COMPUTATION_REQUIRED]-tagged), (b) WITHDRAWN (Gemini revalidation upheld and PAT.008
marked deprecated), or (c) NEEDS_NATIVE_DECISION (escalation). The disposition is a
native-approval point per §0.

**Entry gate (HARD PREREQUISITE — non-bypassable).** Per `HANDOFF_M2_TO_M3 §3` and `M2_CLOSE_v1_0
§Known deferred items #4`, the M2 eval baseline must be **captured** before M3-A modifies
retrieval-output shape. The gate is mechanical, not procedural:

- M3-A may **not** modify `platform/src/lib/retrieve/**`, `platform/src/lib/bundle/**`,
  `platform/src/lib/synthesis/**`, or the synthesis-prompt set in any way that changes
  retrieval-output shape until `BASELINE_RUN_M3A.json` exists with a non-stub run.
- The runner is `platform/scripts/eval/runner.py`; auth path documented in
  `BASELINE_RUN_W7.json`'s `note` field. If the headless run cannot be obtained
  (auth-cookie / chart-id unavailable), the gate is satisfied by a **manual-run capture**
  with native-acceptance signed in the session-close `notes`.
- Non-retrieval-affecting M3-A work (DIS.009 written analysis only; register schema audits
  read-only; capability-spec authoring) may proceed before baseline capture, but no
  retrieval-behavior commit lands until the gate is cleared.

**Deliverables.**

1. **Eval baseline captured.** `00_ARCHITECTURE/EVAL/BASELINE_RUN_M3A.json` — non-stub. The
   pre-M3 retrieval baseline against the 24 W7 fixtures; all six metrics populated (per-class
   pass rate, retrieval coverage, signal-citation count, latency p50/p95, output-shape
   compliance, audit-event presence). This row becomes the comparison anchor for every
   subsequent M3 retrieval change.
2. **Pattern Engine query-time surface.** Pattern register (21 patterns at M2 close) becomes
   queryable at synthesis time. Tool spec authored; capability-manifest entry added; retrieval
   integration into the per-class composition. Patterns selected for inclusion follow native-
   approved relevance criteria (proposed at M3-A entry, approved before commit).
3. **Contradiction Engine query-time surface.** Contradiction register (≥27 contradictions at
   M2 close, post-W5) becomes queryable. Contradictions surfaced in synthesis under explicit
   "contradicts" framing per `PROJECT_ARCHITECTURE §B.11` Whole-Chart-Read discipline.
   Synthesis prompt amended to accommodate contradiction framing without violating
   layer-separation (B.1).
4. **DIS.009 disposition.** A `disagreement_register_entry` update lands in
   `DISAGREEMENT_REGISTER_v1_0.md` with `status: resolved` (or `withdrawn` or
   `escalated_to_native`) plus full `resolution` + `resolved_on` + `resolved_by_session`
   + state hashes. The disposition decision is presented to native at M3-A close as one of
   three options:
     - **Option R1 (RESOLVE-by-split).** Decompose PAT.008 into PAT.008-AL (well-grounded;
       SIG.MSR.397 attribution) and PAT.008-D9 (`[EXTERNAL_COMPUTATION_REQUIRED]` until D9
       Saturn placement is verified through Jagannatha Hora export per ED.1).
     - **Option R2 (WITHDRAW).** Mark PAT.008 deprecated in PATTERN_REGISTER; Gemini
       revalidation verdict upheld; downstream references updated; resonance/cluster
       cross-links re-routed.
     - **Option R3 (RE-GROUND).** Replace the Karakamsa attribution text with a B.10-clean
       grounding citation chain that does not require D9 Saturn placement; pattern stays
       single-entity.
   The choice between R1/R2/R3 is a native decision; the M3-A session presents evidence and
   awaits verdict.
5. **Resonance + Cluster query-time surfaces (lightweight).** Read-only retrieval surfaces
   for the resonance register (≥26 resonances at M2 close, post-W5) and cluster atlas (≥11
   clusters). These ride on the Pattern + Contradiction infrastructure and require no new
   capability-manifest classes — they extend existing tool families.
6. **Pre/post baseline delta recorded.** A second eval run after the engines land
   (`BASELINE_RUN_M3A_POST.json`) compared against `BASELINE_RUN_M3A.json`. Per-class delta
   surfaced in the M3-A close-checklist `notes`. No regression on the four "should-stay-the-same"
   metrics (latency p50, audit-event presence, output-shape compliance, B.10 violations);
   uplift expected on signal-citation count and retrieval coverage.

**Acceptance criteria.**

- AC.M3A.1 — `BASELINE_RUN_M3A.json` exists, is non-stub, all six metrics populated.
- AC.M3A.2 — Pattern Engine retrieval tool ships behind a feature flag (`DISCOVERY_PATTERN_ENABLED`),
  default false at first commit, flipped true after smoke verification within the same sub-phase.
- AC.M3A.3 — Contradiction Engine retrieval tool ships behind a feature flag
  (`DISCOVERY_CONTRADICTION_ENABLED`), default false at first commit, flipped true after smoke.
- AC.M3A.4 — DIS.009 has a terminal status (`resolved` / `withdrawn` / `escalated_to_native`)
  with native verdict recorded.
- AC.M3A.5 — `BASELINE_RUN_M3A_POST.json` exists; per-class delta + per-metric delta surfaced
  in M3-A close-checklist; no regression on the four hold-flat metrics.
- AC.M3A.6 — `chart_facts` and FORENSIC remain mandatory floor in every retrieved bundle
  (B.11 enforcement; verified via trace `context_assembly` payload — gated on BHISMA-B2 if
  that delivers context_assembly emit; otherwise verified via direct test).
- AC.M3A.7 — Pattern Engine and Contradiction Engine tool catalog entries committed to
  `CAPABILITY_MANIFEST.json` (manifest-audit pass folds in the +3 entry_count miscount
  fix from M2 deferred-items #1).
- AC.M3A.8 — Synthesis prompt amendments preserve B.1 layer-separation (no L1 facts
  manufactured at L2.5+; no L2.5+ interpretation back-contaminating L1) and B.3 derivation-
  ledger discipline (every contradiction or pattern surfaced cites its register row IDs).
- AC.M3A.9 — Red-team substrate: no new IS.8(a) every-third-session red-team triggered yet
  (M3 counter resets from 0; first IS.8(a) fire at M3 counter=3, expected mid-M3-A or M3-A
  close depending on session count).

**Sessions.** Estimated 3–5 sessions per HANDOFF cadence:
- M3-A-S1: Eval baseline capture + DIS.009 written analysis (no retrieval changes).
- M3-A-S2: Pattern Engine activation (tool + retrieval + capability spec + smoke).
- M3-A-S3: Contradiction Engine activation (tool + retrieval + synthesis-prompt amendment + smoke).
- M3-A-S4: DIS.009 disposition session (presents R1/R2/R3 to native; commits chosen path).
- M3-A-S5 (close): Post-baseline run + delta + M3-A close-checklist + IS.8(a) red-team if
  cadence fires.

The session boundaries above are illustrative; the operational rule is one
closed-artifact-per-session per `CLAUDE.md §M`. Sessions may be split or combined with
native approval at session open.

**Risks.**
- (R.M3A.1) DIS.009 escalation deadlock — native unavailable at M3-A close. Mitigation:
  M3-A is allowed to close with DIS.009 in `escalated_to_native` status if and only if the
  Pattern Engine flag stays default-false until disposition lands. AC.M3A.4 still met
  (terminal status = `escalated_to_native`); engine activation lives behind flag until
  disposition.
- (R.M3A.2) Eval baseline drift between capture and engine activation — corpus mutated mid
  sub-phase. Mitigation: re-run pre-baseline within the same session as engine activation
  if any L1/L2.5 artifact was edited since last run; both pre and post baselines run on
  identical corpus state.
- (R.M3A.3) Contradiction surface confuses synthesis output (model hedges instead of
  resolving). Mitigation: synthesis prompt amendment includes explicit "surface
  contradictions, do not synthesize them away" rubric. Red-team verifies via fixture pair.
- (R.M3A.4) BHISMA Stream 2 (LLM-First Pipeline) lands while M3-A is in flight, changing
  the planner contract under M3-A's feet. Mitigation: M3-A coordinates with BHISMA-B2 brief;
  if planner is replaced, M3-A's tool integration follows the new planner's tool-spec format.
  Cross-stream sync recorded in SESSION_LOG.

### §3.2 — M3-B — Temporal Foundation (Vimshottari + Yogini + Transit Engine v1)

**Scope.** Time enters the system. `MACRO_PLAN_v2_0 §M3` exit-state items (a) Vimshottari +
Yogini computed for native lifetime + (b) transit engine produces date-indexed lit/dormant/
ripening states are the M3-B deliverables. Chara + Narayana + KP + Varshaphala + shadbala
defer to M3-C — the split is by school complexity (Parashari Vimshottari is the canonical
floor; Jaimini schools and KP introduce cross-school disagreement that needs the M3-C-class
machinery).

**Entry gate.** M3-A closed (Pattern + Contradiction Engines live, DIS.009 dispositioned,
post-baseline delta recorded). Plus: Swiss Ephemeris (ED.2) version-locked + ayanamsha
declared in SESSION_LOG (per `MACRO_PLAN §M3 Risks (a)`); Jagannatha Hora export (ED.1)
available for cross-check. Ayanamsha selection is a native-approval point per §0; default
is project ayanamsha unless native instructs otherwise.

**Deliverables.**

1. **Vimshottari dasha computation.** MD/AD/PD/SD for native's lifetime horizon (1984-02-05
   onward through coverage window declared at M3-B entry — likely ≥120 years to cover full
   Vimshottari cycle; native confirms horizon at session open). Output: structured table +
   JSON serialization in `05_TEMPORAL_ENGINES/dasha/vimshottari/`. Cross-check against
   Jagannatha Hora export for ED.1 sanity check (per ED.1 mitigation rule).
2. **Yogini dasha computation.** Mahadasha + antardasha for native lifetime. Output:
   `05_TEMPORAL_ENGINES/dasha/yogini/`.
3. **Transit engine v1.** Given a date and the chart, compute current planet positions and
   their interaction with the natal chart (transits to natal positions, transit-to-transit
   aspects, eclipse points active, retrograde periods active, Sade Sati state). Output:
   `05_TEMPORAL_ENGINES/transit/engine.py` + a deterministic API
   (`get_signal_states(date)` → dict of `{signal_id: lit | dormant | ripening}`).
4. **Date-indexed signal lit/dormant/ripening surface.** For every signal in MSR (~499
   signals), compute its activation state on a held-out date sample (sample size declared at
   M3-B entry; ≥20 dates spanning the LEL coverage window). Output:
   `05_TEMPORAL_ENGINES/transit/lit_states_sample_M3B.json`.
5. **PPL substrate active.** Per `HANDOFF_M2_TO_M3 §Concurrent workstreams`, every time-
   indexed prediction emitted in or after M3-B logs to PPL with confidence + horizon +
   falsifier *before* outcome is observed. Substrate scaffolded at
   `06_LEARNING_LAYER/PREDICTION_LEDGER/`; M3-B is the first sub-phase that may emit
   forward-looking outputs, so PPL writes start in M3-B sessions.

**Acceptance criteria.**

- AC.M3B.1 — Vimshottari MD/AD/PD/SD table validates against Jagannatha Hora export to
  ≤1-day delta on every dasha boundary.
- AC.M3B.2 — Yogini dasha table is produced; cross-check against any available external
  reference (or native-acharya inspection if no machine reference exists).
- AC.M3B.3 — Transit engine emits deterministic outputs across two runs on the same date.
- AC.M3B.4 — Date-indexed signal lit/dormant/ripening surface populated for held-out sample;
  per-signal inspection passes acharya-grade review on a 5-signal sub-sample.
- AC.M3B.5 — Ayanamsha selection recorded in SESSION_LOG at M3-B-S1 open per ED.2 mitigation.
- AC.M3B.6 — PPL substrate writes are working; first M3-B-emitted prediction logs to PPL
  with confidence + horizon + falsifier before outcome observed.
- AC.M3B.7 — No L1 mutations (FORENSIC frozen); temporal computations live at L1.5/L2.5
  boundary per `PROJECT_ARCHITECTURE §B.1`.

**Risks.** Per `MACRO_PLAN §M3 Risks`:
- (a) Swiss Ephemeris version drift — version-lock in SESSION_LOG.
- (c) Jagannatha Hora format incompatibility — pyswisseph fallback prepared.
- (R.M3B.4) Held-out date sample bias (dates clustered around major life events) —
  sample stratified across LEL coverage window with random + LEL-anchored dates mixed.

### §3.3 — M3-C — Multi-school Dasha + KP + Varshaphala + Shadbala

**Scope.** `MACRO_PLAN_v2_0 §M3` exit-state items (c–e) — Chara + Narayana dashas (Jaimini
schools); KP sublord timing integrated with MSR signal system; Varshaphala (Tajika); shadbala
computed over full dasha horizon. Plus: cross-school disagreement register opened. This
sub-phase is where `DIS.class.school_disagreement` first becomes a populated category in the
DISAGREEMENT_REGISTER (per MACRO_PLAN §M3 native-approval points).

**Entry gate.** M3-B closed (Vimshottari + Yogini + transit engine v1 verified). Plus: ED.1
+ ED.2 cross-checks operational (used in M3-B; reaffirmed at M3-C entry).

**Deliverables.**

1. **Chara dasha (Jaimini).** Mahadasha + antardasha for native lifetime. Output:
   `05_TEMPORAL_ENGINES/dasha/jaimini/chara/`.
2. **Narayana dasha (Jaimini).** Mahadasha computation per Narayana scheme. Output:
   `05_TEMPORAL_ENGINES/dasha/jaimini/narayana/`.
3. **KP sublord timing.** KP (Krishnamurti Paddhati) sublord transit table integrated with
   MSR signal system — for every active dasha period, surface the KP sublord and its
   resonance-mapping with MSR signals. Output: `05_TEMPORAL_ENGINES/kp/sublord_timing/`.
4. **Varshaphala (Tajika) annual chart.** Per-year Tajika chart for native's lifetime.
   Output: `05_TEMPORAL_ENGINES/varshaphala/`.
5. **Shadbala over time.** Six-fold strength of every planet computed at every dasha-period
   boundary (or finer; resolution declared at M3-C entry). Output:
   `05_TEMPORAL_ENGINES/shadbala/over_time/`.
6. **Cross-school disagreement register.** Where Vimshottari (M3-B), Chara, Narayana, and KP
   schools disagree on which signals are lit on a given date, log the disagreement to
   DISAGREEMENT_REGISTER under `DIS.class.school_disagreement`. Per `MACRO_PLAN §M3 Risks
   (b)`, native arbitrates each disagreement at M3-C close; M9 multi-school triangulation
   is the structural resolution layer (out of M3 scope).

**Acceptance criteria.**

- AC.M3C.1 — Chara + Narayana tables produced; native acharya-grade review on 5 sample
  date-readings per school.
- AC.M3C.2 — KP sublord timing table integrated with MSR (every MSR signal that is KP-school-
  attributable carries a sublord-resolution annotation).
- AC.M3C.3 — Varshaphala produced; annual chart cross-checked against Jagannatha Hora export
  (ED.1) on three sample years.
- AC.M3C.4 — Shadbala-over-time series produced; per-planet sanity check against natal
  shadbala (FORENSIC §X) at the natal date — values match within rounding.
- AC.M3C.5 — Cross-school disagreement register has ≥N entries (N declared at M3-C entry;
  expected order-of-magnitude: a handful, not hundreds — major disagreements only); each
  entry has a native verdict before M3-C close.
- AC.M3C.6 — No M9-shape pre-build (multi-school *triangulation* metrics belong to M9, not
  M3-C; M3-C only *logs* disagreements, does not *resolve* via inter-school weights).

**Risks.** Per `MACRO_PLAN §M3 Risks (b)`: dasha-lord disagreements across schools.
Mitigation already named there: cross-check protocol at M3 open with native-arbitrated
disagreement log, plus M9 multi-school triangulation as the structural resolution. Restated
here for the M3-C-specific moment: every disagreement is *logged*, not *resolved by
operator preference*; resolution waits for M9.

### §3.4 — M3-D — Validator + Held-Out Sample + Red-Team + M3 Close

**Scope.** `MACRO_PLAN §M3` exit-state item (f) — temporal validator meta-tests pass on
held-out date sample. Plus: IS.8 macro-phase-close red-team (mandatory per `MACRO_PLAN
§IS.8(b)` — every macro-phase close fires the red-team before SESSION_LOG seal). Plus:
M3 sealing artifacts (M3_CLOSE_v1_0.md + HANDOFF_M3_TO_M4_v1_0.md). Plus: native acharya-
grade review on 5 representative date-specific chart readings per `MACRO_PLAN §M3 Quality
gate`.

**Entry gate.** M3-C closed (all M3-A through M3-C deliverables operational + cross-school
disagreements native-arbitrated).

**Deliverables.**

1. **Temporal validator meta-tests.** A meta-test suite under `00_ARCHITECTURE/EVAL/TEMPORAL/`
   that, given a held-out date and the M3-A through M3-C surfaces, verifies the lit/dormant/
   ripening signal set is consistent across schools (where they should agree) and produces
   the expected disagreement register entries (where they should disagree). Suite runs on
   the M3-B sample plus a second held-out sample drawn at M3-D entry.
2. **Held-out date sample validation.** ≥10 dates not used in M3-B/M3-C development; for each,
   the temporal engine emits its signal-state surface and an acharya-grade review records
   how well the surface matches expectation. Output:
   `00_ARCHITECTURE/EVAL/M3_HELD_OUT_SAMPLE_v1_0.md`.
3. **5 native acharya-grade chart readings.** Five representative date-specific readings
   produced; native (or recruited acharya) records pass/fail at acharya-grade. This is the
   `MACRO_PLAN §M3` quality gate criterion (b).
4. **IS.8 macro-phase-close red-team.** Per `ONGOING_HYGIENE_POLICIES §G.b`, every macro-
   phase close fires a red-team before SESSION_LOG seal. Verdict required: PASS or
   PASS_WITH_FIXES (with all fixes applied within the same sub-phase). Output:
   `00_ARCHITECTURE/EVAL/REDTEAM_M3_v1_0.md`. Precedent: `REDTEAM_M2_v1_0.md` (W8-R1, verdict
   PASS, 9/9 axes, 0 findings, 0 fixes).
5. **M3_CLOSE_v1_0.md sealing artifact.** Quality bar table (per M3 quality gate); wave
   log summary; deferred items; red-team evidence; ND status; mirror sync. Precedent:
   `M2_CLOSE_v1_0.md`.
6. **HANDOFF_M3_TO_M4_v1_0.md.** What M3 delivered + live state of platform + M4 priorities
   + hard prerequisites for M4 (LEL minimum-volume gate ≥40 events spanning ≥5 years per
   `MACRO_PLAN §CW.LEL`) + inherited open items + active feature flags. Precedent:
   `HANDOFF_M2_TO_M3_v1_0.md`.
7. **CURRENT_STATE flip.** `active_macro_phase` M3 → M4; `active_phase_plan` →
   `PHASE_M4_PLAN_v1_0.md` (or null pending M4 phase plan, per native decision at M3-D close).
   Mirrors propagated to `.geminirules` + `.gemini/project_state.md` (MP.1 + MP.2 adapted
   parity).

**Acceptance criteria.**

- AC.M3D.1 — Temporal validator meta-tests CI-green on held-out sample (per `MACRO_PLAN §M3`
  exit-state (f)).
- AC.M3D.2 — Held-out date sample document exists; ≥10 dates; acharya-grade review on each.
- AC.M3D.3 — 5 native acharya-grade chart readings exist with native verdicts recorded.
- AC.M3D.4 — REDTEAM_M3_v1_0.md exists; verdict PASS or PASS_WITH_FIXES; all fixes applied
  within the sub-phase; SESSION_LOG seal block fires after red-team.
- AC.M3D.5 — M3_CLOSE_v1_0.md exists with quality bar populated; CURRENT_STATE flipped
  M3→M4; HANDOFF_M3_TO_M4_v1_0.md authored and readable cold.
- AC.M3D.6 — Mirror sync to Gemini side recorded in close-checklist `mirror_updates_propagated`
  block (MP.1 + MP.2 adapted parity).
- AC.M3D.7 — All M3 known-deferred items (whether inherited from M2 or accumulated in M3)
  are explicitly named in M3_CLOSE_v1_0.md `Known deferred items` section so they survive
  into M4 without silent loss.

**Risks.**
- (R.M3D.1) Acharya-grade review unavailable at M3-D close — native acharya-grade review on
  5 date readings cannot be conducted in-session. Mitigation: acharya-grade review is split
  into "in-session review by native (always)" and "external acharya review (when
  available)" — the in-session review is the gate; the external review is an open item
  carried into M4 if not completed by M3-D close.
- (R.M3D.2) Red-team finds an issue requiring fixes that span M3-A/B/C surfaces. Mitigation:
  per the precedent (W8-R1 was PASS with 0 fixes; alternative path is PASS_WITH_FIXES; FAIL
  blocks M3 close). If FAIL, M3-D becomes a multi-session sub-phase that fixes the finding
  and re-runs the red-team.

## §4 — Dependency graph

```
                        ┌──────────────────────────────────────┐
                        │  M2 closed (KARN-W8-R2-M2-CLOSE)     │
                        │  Discovery registers populated in DB │
                        │  17 retrieval tools live             │
                        │  Eval harness scaffolded             │
                        └──────────────┬───────────────────────┘
                                       │
                                       ▼
                        ┌──────────────────────────────────────┐
                        │  HARD GATE: M2 eval baseline run     │
                        │  (BASELINE_RUN_M3A.json non-stub)    │
                        └──────────────┬───────────────────────┘
                                       │
                                       ▼
              ┌────────────────────────────────────────────────────────┐
              │  M3-A — Discovery Engines + DIS.009 disposition        │
              │   • Pattern Engine query-time                          │
              │   • Contradiction Engine query-time                    │
              │   • Resonance + Cluster surfaces (lightweight)         │
              │   • DIS.009 disposition (R1/R2/R3 native decision)     │
              │   • Pre/post baseline delta                            │
              └──────────────┬─────────────────────────────────────────┘
                             │
                             ▼
              ┌────────────────────────────────────────────────────────┐
              │  M3-B — Temporal Foundation                            │
              │   • Vimshottari dasha (MD/AD/PD/SD lifetime)           │
              │   • Yogini dasha                                       │
              │   • Transit engine v1                                  │
              │   • Date-indexed lit/dormant/ripening surface          │
              │   • PPL writes activate                                │
              │   • Native ayanamsha confirmation (entry)              │
              └──────────────┬─────────────────────────────────────────┘
                             │
                             ▼
              ┌────────────────────────────────────────────────────────┐
              │  M3-C — Multi-school Dasha + KP + Varshaphala + Shadbala
              │   • Chara + Narayana dashas (Jaimini)                  │
              │   • KP sublord timing                                  │
              │   • Varshaphala (Tajika) annual chart                  │
              │   • Shadbala over time                                 │
              │   • DIS.class.school_disagreement entries              │
              │     (native arbitrates at close)                       │
              └──────────────┬─────────────────────────────────────────┘
                             │
                             ▼
              ┌────────────────────────────────────────────────────────┐
              │  M3-D — Validator + Red-Team + Close                   │
              │   • Temporal validator meta-tests                      │
              │   • Held-out date sample (≥10 dates)                   │
              │   • 5 acharya-grade chart readings                     │
              │   • IS.8 macro-phase-close red-team                    │
              │   • M3_CLOSE_v1_0.md + HANDOFF_M3_TO_M4_v1_0.md        │
              │   • CURRENT_STATE flip M3 → M4                         │
              │   • Mirror sync to Gemini                              │
              └──────────────┬─────────────────────────────────────────┘
                             │
                             ▼
                        ┌─────────────┐
                        │  M4 OPEN    │  (gates on CW.LEL ≥ 40 events ≥ 5 yrs)
                        └─────────────┘

Concurrent (non-blocking) co-streams that may run in parallel with any M3 sub-phase:
  ─ KARN-W9 BHISMA sprint (B1/B2/B3/B4 — model family / LLM-first pipeline / trace command)
       Coordinated through SESSION_LOG cross-references; BHISMA-B2 may reshape the planner
       under M3-A/B's feet — handled by M3 sessions adopting the new planner contract.
  ─ Life Event Log (CW.LEL) — continue adding events; M4 prerequisite.
  ─ Prospective Prediction Log (CW.PPL) — active from M3-B; first time-indexed
       predictions log with confidence + horizon + falsifier before outcome.
  ─ Portal Redesign R1–R6 (branch redesign/r0-foundation) — does not block M3.
```

**Inter-sub-phase parallelism.** M3-A is sequential (engines + DIS.009 disposition + baseline
must close before M3-B opens — temporal work depends on a stable retrieval contract). M3-B
and M3-C are dependent (M3-C uses M3-B's transit engine + cross-checks against Vimshottari).
M3-D is sequential after M3-C (close depends on all earlier sub-phases). **No M3 sub-phase
runs in parallel with another M3 sub-phase.** BHISMA streams may run in parallel with any
M3 sub-phase; LEL + PPL workstreams run continuously.

## §5 — Native-approval points (consolidated)

| Gate | Decision | Approving party | Default if no decision |
|---|---|---|---|
| M3-A entry | Eval baseline capture method (headless vs manual-run) | Native | Manual-run capture; session waits if neither available |
| M3-A pre-commit (per engine) | Pattern Engine relevance criteria for inclusion | Native | Conservative subset; flag-gated with feedback loop |
| M3-A close | DIS.009 disposition (R1 split / R2 withdraw / R3 re-ground) | Native | `escalated_to_native` status (terminal but pending) |
| M3-B entry | Ayanamsha selection (project default vs override) | Native | Project default |
| M3-B entry | Lifetime horizon for Vimshottari coverage (≥120 yrs default) | Native | 120 yrs |
| M3-C close | Cross-school disagreement-resolution verdicts (per entry) | Native | Logged; no operator-preference fallback |
| M3-D entry | Held-out date sample composition (random vs LEL-anchored mix) | Native | 50/50 mix; ≥10 dates |
| M3-D close | M3 macro-phase close acceptance (M3_CLOSE_v1_0.md sign-off) | Native | M3 stays open |
| M3-D close | M4 phase-plan authoring decision (PHASE_M4_PLAN vs direct from MACRO_PLAN) | Native | Decision deferred to first M4 session |

## §6 — Concurrent workstreams (non-blocking)

### §6.1 — KARN-W9 BHISMA infrastructure sprint

Per `BHISMA_PLAN_v1_0.md`, BHISMA is a pre-M3 infrastructure elevation sprint that runs
in parallel with the first M3 temporal sessions. **It does not block M3** — but it changes
the platform M3 lands on. Three streams (W9-B1 model family, W9-B2 LLM-first pipeline,
W9-B3 trace command center) plus a convergence session (W9-B4). BHISMA's `must_not_touch`
declarations explicitly leave `00_ARCHITECTURE/**`, `025_HOLISTIC_SYNTHESIS/**`, and
`platform/migrations/**` to the corpus / governance / DB workstreams.

**Sequencing notes for M3 sessions.**

- BHISMA-B1 (model family) does not interact with M3-A's retrieval surfaces. Safe to run
  fully in parallel.
- BHISMA-B2 (LLM-first pipeline) replaces `classify` + `compose` + per-tool planner with a
  unified `planner` step. **If BHISMA-B2 lands while M3-A is in flight, M3-A's tool
  registration follows the new planner's tool-spec format.** Cross-stream sync recorded in
  SESSION_LOG; M3-A may stage its tool registration to commit after BHISMA-B2 if the
  windows overlap.
- BHISMA-B3 (trace command center) extends trace step types and emits `context_assembly` +
  `synthesis_done`. M3-A AC.M3A.6 (FORENSIC always present in synthesis context) is
  *easier to verify* if BHISMA-B3 has landed first; otherwise M3-A verifies via direct test.
- BHISMA-B4 convergence happens at BHISMA's own close, independent of M3.

The M3-A and BHISMA-B2 streams agree on: feature-flag boundary (M3-A's
`DISCOVERY_PATTERN_ENABLED` + `DISCOVERY_CONTRADICTION_ENABLED` are independent of BHISMA's
`LLM_FIRST_PLANNER_ENABLED`); and capability-manifest ownership (M3-A adds Pattern +
Contradiction tool spec entries; BHISMA-B2 adds `token_count` to existing assets — orthogonal
edits).

### §6.2 — Life Event Log (CW.LEL)

Per `HANDOFF_M2_TO_M3 §Concurrent workstreams`: 36 events at M2 close; cadence "start
immediately; do not defer"; M4 prerequisite is ≥40 events spanning ≥5 years. M3 sessions
continue adding events as they happen; no M3-specific deliverable.

### §6.3 — Prospective Prediction Log (CW.PPL)

Substrate at `06_LEARNING_LAYER/PREDICTION_LEDGER/`. **Activates in M3-B** when first time-
indexed predictions are emitted. Discipline #4 holds: confidence + horizon + falsifier
logged *before* outcome observed. M3-B/C/D sessions log every forward-looking output to PPL
in the same session as emission.

### §6.4 — Portal Redesign (branch `redesign/r0-foundation`)

R0 closed 2026-04-29; R1–R6 parallel-ready. Claude-only per
`PORTAL_REDESIGN_TRACKER_v1_0.md`. Does not block M3 sub-phase progression.

## §7 — Open items inherited from M2

Per `M2_CLOSE_v1_0.md §Known deferred items` + `HANDOFF_M2_TO_M3 §Open items inherited from
M2`. Disposition for each item across M3 sub-phases:

| Item | M3 sub-phase that owns disposition | Disposition target |
|---|---|---|
| 1. CAPABILITY_MANIFEST entry_count miscount (+3 delta) | M3-A | Folded into M3-A's manifest-audit pass when adding Pattern + Contradiction tool entries (AC.M3A.7). |
| 2. SIG.MSR.207 absent from MSR_v3_0.md | M3-A or M3-D | Investigation lives at M3-A (read-only — does not gate M3-A close); resolution / explicit-acceptance lives at M3-D close. |
| 3. UCN inline citation pass (Option A) | not M3 | Aspirational only per M2 close. Carried as `aspirational` open item; not gated by M3. |
| 4. Eval baseline manual run | M3-A | HARD GATE for M3-A entry. AC.M3A.1. |
| 5. UI-test fixture errors (AppShell + ReportGallery) | not M3 | Pre-W6 portal-redesign drift; hygiene refresh; concurrent Portal Redesign R-stream owns. |
| 6. DIS.009 (output_conflict on PAT.008) | M3-A | Disposition decision point at M3-A close. AC.M3A.4. |

## §8 — Disagreement-protocol bindings

Per `GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md §K`:

- **DIS.class.output_conflict** (DIS.009 active) — disposed at M3-A close per §3.1.4.
- **DIS.class.mirror_desync** — should not arise in plan-only sessions; M3 execution sessions
  apply ND.1 mirror discipline at session close.
- **DIS.class.school_disagreement** — *first activated in M3-C*. Every cross-school dasha
  disagreement opens a register entry; native arbitrates each at M3-C close. M9 multi-
  school triangulation is the structural resolution layer (out of M3 scope).
- **DIS.class.scope_violation** — would arise if any M3 sub-phase pre-built infrastructure
  for M4+ macro-phases. Mitigated by `MACRO_PLAN §Scope Boundary` + per-sub-phase
  `must_not_touch` declarations.
- **DIS.class.governance_drift** — would arise from silent file mutation. Mitigated by
  every-session canonical-artifact-fingerprint check at session-open handshake.

## §9 — Cadence

Per `CLAUDE.md §M`: daily sessions; closed-artifact-per-session discipline. Red-team passes
at three cadences:
- **(a) every-third-session** — `red_team_counter` resets to 0 at M2 close; first M3
  IS.8(a) cadence fire expected at M3 counter=3 (mid-M3-A or M3-A close depending on
  session count).
- **(b) every-macro-phase-close** — fires at M3-D close before SESSION_LOG seal. `REDTEAM_M3
  _v1_0.md` produced.
- **(c) every-12-months for MACRO_PLAN itself** — outside M3 scope; tracked in governance
  hygiene cadence per `ONGOING_HYGIENE_POLICIES §H`.

A macro-phase does not close without its red-team. AC.M3D.4 is the gate.

## §10 — Out of scope for M3

The following are explicitly *not* M3 work, even though they are temporal-adjacent or
discovery-adjacent. Pre-building any of these in M3 fires `DIS.class.scope_violation`.

- **Empirical calibration of signals against LEL** — M4 scope (`MACRO_PLAN §M4`).
- **Dynamic Bayesian Network over (signals × time) → outcomes** — M5 scope.
- **Forward predictions with falsifiable windows for the system's accuracy measurement** —
  M6 scope (M3-B/C/D *emit* predictions to PPL; M6 is what *scores* them).
- **Multi-school triangulation metrics** — M9 scope. M3-C *logs* school disagreements;
  M9 *resolves* them via learned inter-school weights.
- **Cohort extension beyond native** — M7 scope.
- **Classical text cross-reference** — M8 scope.
- **LLM fine-tuning** — M7+ scope; LL.10 substrate.

## §11 — Predecessor / successor record

- **Predecessor phase plan:** `PHASE_B_PLAN_v1_0.md` (v1.0.3 amended; M2 phase plan;
  SUPERSEDED-AS-COMPLETE for M2 at KARN-W8-R2-M2-CLOSE). Retained as historical record.
- **Successor phase plan:** `PHASE_M4_PLAN_v1_0.md` (to be authored at first M4 session
  — analogous to this session for M3 — or M4 may run directly off `MACRO_PLAN §M4` per
  native decision at M3-D close).
- **Sealing artifact at this plan's retirement:** `M3_CLOSE_v1_0.md` (M3-D deliverable).
- **Mirror counterpart:** `.gemini/project_state.md` carries a one-line pointer to this
  plan + the active sub-phase ID; updated by each M3 session at close (MP.4 adapted
  parity, propagated at M3-A-S1 first session and refreshed each sub-phase boundary).

---

*End of PHASE_M3_PLAN_v1_0.md v1.0 — authored at KARN-W9-M3-OPEN 2026-05-01. M3-A through M3-D defined. Hard prerequisite gate (eval baseline) recorded. DIS.009 disposition decision point recorded at M3-A close. BHISMA sprint referenced as parallel-allowed co-stream. M3 execution begins at next session per native trigger.*
