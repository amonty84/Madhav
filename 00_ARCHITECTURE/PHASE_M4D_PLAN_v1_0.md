---
artifact: 00_ARCHITECTURE/PHASE_M4D_PLAN_v1_0.md
canonical_id: PHASE_M4D_PLAN
version: "1.0"
status: DRAFT
authored_by: M4-C-P7-M4D-ENTRY-PREP
authored_at: 2026-05-02
sub_phase: M4-D — M4 macro-phase close (sub-phase of M4 macro-phase)
macro_phase: M4 — Calibration + LEL Ground-Truth Spine
predecessor_close_artifacts:
  - 00_ARCHITECTURE/M4_A_CLOSE_v1_0.md (M4-A sub-phase sealed 2026-05-02)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_B_CLOSE_v1_0.md (M4-B sub-phase sealed 2026-05-03)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_C_CLOSE_v1_0.md (M4-C sub-phase pre-draft DRAFT 2026-05-03; sealing at M4-C-S4 future)
companion_brief: 00_ARCHITECTURE/EVAL/NAP_M4_7_BRIEF_v1_0.md (NAP.M4.7 native approval brief, authored same session)
status_explanation: >
  This is a forward-pointer execution plan for M4-D (the M4 macro-phase close sub-phase).
  It defines scope, entry gates, sub-phase plan, M5 inputs inherited from M4, the known
  residuals roster entering M4-D, and red-team / NAP / mirror obligations. It does NOT
  author the M4_CLOSE_v1_0.md sealing artifact itself — that is M4-D-S1 substantive scope.
  Status flips DRAFT → CURRENT at M4-D-S1 open (or amended-in-place per actual M4-C exit
  conditions documented at M4-C-S4 sub-phase close).
note: >
  M4-D is the LAST sub-phase of M4. It produces the M4 macro-phase sealing artifact
  (M4_CLOSE_v1_0.md), the IS.8(b) macro-phase-close red-team (REDTEAM_M4_v1_0.md),
  HANDOFF_M4_TO_M5_v1_0.md, and the CURRENT_STATE flip M4 → M5. The binding NAP for
  M4-D is NAP.M4.7 (M4 macro-phase close approval). Entry into M4-D requires M4-C
  formally CLOSED via M4-C-S4 sealing of M4_C_CLOSE_v1_0.md.
changelog:
  - v1.0 DRAFT (2026-05-02, M4-C-P7-M4D-ENTRY-PREP, parallel governance slot to
    M4-C-S4): Initial forward-pointer plan authored as parallel governance slot.
    Same convention as M4-B-P5-M4C-ENTRY-PREP (which authored PHASE_M4C_PLAN ahead
    of M4-C-S1) — PHASE_M4D_PLAN authored ahead of M4-D-S1 so that M4-D enters with
    a published execution plan rather than improvising at session-open. All
    M4-D-S1-dependent fields are forward-pointers, not pending substrate computation.
    - §1 scope: 4 sub-phase deliverables (M4_CLOSE + REDTEAM_M4 + HANDOFF + CURRENT_
      STATE flip); single sub-phase M4-D-S1 (close-class); inputs from M4-A/B/C
      close documents; outputs M4 macro-phase sealing.
    - §2 entry gates: M4-C formally CLOSED (M4-C-S4 sealing); NAP.M4.7 brief
      authored (this session); IS.8(b) macro-phase-close red-team conducted at
      M4-D-S1 per ONGOING_HYGIENE_POLICIES §G.b + MACRO_PLAN §IS.8(b); all open
      carry-forwards either resolved or explicitly accepted as M5 inputs in
      HANDOFF_M4_TO_M5_v1_0.md.
    - §3 sub-phase plan: single session M4-D-S1 with 10 work items (a)–(j) per
      AC.P7.2 enumeration; close-class session.
    - §4 M5 inputs from M4: 8 categories enumerated — LL.1 30 production weights,
      LL.2 9,922 shadow edges (gate-level unblocked), LL.5 dasha_weight 380 signals,
      LL.6 density_weight 37 events × 380 signals, LL.7 107 novel + 136 unconfirmed
      + 8 sanity-check anchors all novel (DECISION-2 literal CDLM clique), LL.4
      qualitative priors + machine-readable JSON view, CF.LL7.1 CDLM-patch
      workstream, LEL v1.6 (46 events; 37 train / 9 held-out sacrosanct).
    - §5 known residuals entering M4-D: exhaustive roster compiled from M4_A_CLOSE
      §3 + M4_B_CLOSE §6 + M4_C_CLOSE pre-draft §6 + M4-C-S1/S2/S3 in-session
      findings (per CURRENT_STATE v2.8/2.9/3.0 changelog). 35+ items classified
      resolve-in-M4-D / accept-as-M5-input / defer-post-M5.
    - §6 changelog (this entry).
---

# PHASE_M4D_PLAN — M4-D — M4 Macro-Phase Close (M4 sub-phase) — DRAFT

## §1 — Scope

M4-D is the **fourth and final** sub-phase of M4. Per `MACRO_PLAN_v2_0.md §M4` exit
state + `PHASE_M4_PLAN_v1_0.md §3.4`, M4-D produces the M4 macro-phase sealing
artifacts and flips CURRENT_STATE M4 → M5.

### §1.1 — Inputs

M4-D consumes (read-only) the three M4 sub-phase close documents:

- **`00_ARCHITECTURE/M4_A_CLOSE_v1_0.md`** v1.0 CURRENT (sealed 2026-05-02). LEL
  ground-truth spine: 46 LEL events with chart_states; lel_event_match_records.json
  46 records under schema v1.1 (37 training / 9 held-out, decade-stratified);
  CALIBRATION_RUBRIC Option B native-approved per NAP.M4.1; SHADOW_MODE_PROTOCOL §3
  approved per NAP.M4.4; LEL_GAP_AUDIT v1.2 with NAP.M4.2 dispositions;
  msr_domain_buckets.json 495/499 signals across 10 domains; KR.M3A.JH-EXPORT
  carry-forward per NAP.M4.3 Option Y.
- **`06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_B_CLOSE_v1_0.md`** v1.0 CLOSED
  (sealed 2026-05-03 at M4-B-S6-CLOSE, commit 007c718). LL.1 production register:
  30 of 30 promotion-eligible signals at status=production per NAP.M4.5 (verdict
  (a) three independent calibrated phenomena on SIG.MSR.118/.119/.143). LL.2
  stability gate FULL_PASS (gate-level promotion-block lifted; per-edge promotion
  deferred). LL.3 + LL.4 recommendation documents complete. LL.4 machine-readable
  priors JSON view added at S5.
- **`06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_C_CLOSE_v1_0.md`** v1.0 DRAFT
  (pre-draft authored 2026-05-03 at M4-C-P6-S4-PREDRAFT; sealing at M4-C-S4 future
  session). LL.5 dasha-transit synergy first shadow write (380 signals); LL.6
  temporal density modulator first shadow write (37 events × 380 signals); LL.7
  native-only discovery prior first artifact under NAP.M4.6 Option B + 3
  refinements + DECISION-2 literal CDLM clique construction (243 emitted edges:
  107 novel + 136 unconfirmed + 0 confirmed + 0 contradicted; 8 MED-tier LL.2
  sanity-check anchors all classify as `novel` under literal construction —
  PASS gate per NAP §6.3(b) raw N≥3).

M4-D also reads (read-only) the most recent SESSION_LOG entries to capture any
in-flight findings that did not yet land in close documents.

### §1.2 — Outputs

M4-D produces four sealing artifacts:

1. **`00_ARCHITECTURE/M4_CLOSE_v1_0.md`** — M4 macro-phase sealing artifact. §1
   quality bar (per-AC PASS/DEFER/FAIL table covering M4-A through M4-D ACs);
   §2 sub-phase wave log (M4-A through M4-D); §3 deferred items (carries forward
   to M5); §4 red-team evidence; §5 ND status; §6 mirror sync evidence. Mirrors
   M3_CLOSE / M2_CLOSE structural precedent.
2. **`00_ARCHITECTURE/EVAL/REDTEAM_M4_v1_0.md`** — IS.8(b) macro-phase-close
   red-team. 9 axes per `PHASE_M4_PLAN §3.4` paragraph 2 (Layer separation, Derivation
   ledger, No fabricated computation, n=1 validity, Shadow-mode discipline,
   Held-out sacrosanctity, Scope compliance, Mirror discipline, PPL discipline).
   Verdict required: PASS (all 9 axes) before SESSION_LOG seal.
3. **`00_ARCHITECTURE/HANDOFF_M4_TO_M5_v1_0.md`** — What M4 delivered (LL.1–LL.7
   state); platform state; M5 priorities; hard prerequisites for M5 (≥50 PPL
   predictions with ≥6 months elapsed per `MACRO_PLAN §M5` + §10 of
   PHASE_M4_PLAN); inherited open items by owner (native | M5 | M9-class).
   Mirrors HANDOFF_M3_TO_M4 / HANDOFF_M2_TO_M3 structural precedent.
4. **CURRENT_STATE flip** — `active_macro_phase: M4 → M5`; M4
   `active_macro_phase_status: closed`; M4 sealing artifact path recorded;
   `red_team_counter: 0` (IS.8(b) fires + resets per ONGOING_HYGIENE_POLICIES
   §G); mirror MP.1 + MP.2 propagated same-session per ND.1.

### §1.3 — Out of scope for M4-D (preserved at sub-phase + macro-phase boundary)

- **No new corpus or substrate writes.** M4-D consumes prior M4 outputs; it does
  not extend LL.1–LL.7 with new shadow or production weights. The Learning Layer
  state at M4-D close is exactly the state at M4-C close.
- **No L1 mutations.** FORENSIC v8.0 untouched; LEL v1.6 frozen at M4-C close.
- **No M5-shape pre-build.** Per `MACRO_PLAN §Scope Boundary` + CLAUDE.md §L,
  M4-D does NOT scaffold the DBN, LL.8 active operations, cohort-mode LL.7, or
  any other M5-class artifact. The M5 entry state is documented in
  HANDOFF_M4_TO_M5; the artifacts themselves are M5 scope.
- **No retrieval / synthesis surface changes.** `platform/**` untouched throughout
  M4-D. The Learning Layer substrate remains file-based; consumption-surface
  wiring is M5 (or later) scope per `SHADOW_MODE_PROTOCOL §2` LL row schema.
- **No CDLM mutation.** CF.LL7.1 (CDLM Pancha-MP anchor patch) is a workstream
  carried into M4-D for native disposition (resolve-in-M4-D OR defer-to-M5+),
  not a guaranteed write. Decision recorded in M4_CLOSE §3 carry-forward.

### §1.4 — Single-sub-phase structure rationale

Per `PHASE_M4_PLAN §8` session count estimate, M4-D is allotted 2–3 sessions. The
plan adopted here is **single substantive close session M4-D-S1** with all 10
work items (per §3 below) executed in one session, modeled on the M3-D-D1
combined validator+red-team+close pattern (which discharged validator + held-out
sample + LEL §9 PPL append + REDTEAM_M3 in a single session). If session
budget overruns or any work item demands isolation, a follow-up M4-D-S2 may be
authorized — but the default is single-session close.

---

## §2 — Entry gates

M4-D-S1 may not open until ALL of the following are satisfied:

### §2.1 — M4-C formally CLOSED

`06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_C_CLOSE_v1_0.md` flipped
`status: DRAFT` → `status: CLOSED` at M4-C-S4 sub-phase close session. CURRENT_STATE
canonical state pointer `active_phase_plan_sub_phase` reflects "M4-C CLOSED ...
M4-D incoming" or analogous. Entry-gate verification: read M4_C_CLOSE_v1_0.md
frontmatter; confirm `status: CLOSED` + `sealed_by` + `sealed_at` populated.

### §2.2 — NAP.M4.7 brief authored + presented

`00_ARCHITECTURE/EVAL/NAP_M4_7_BRIEF_v1_0.md` exists with `status:
PENDING_NATIVE_DECISION`. Brief is the M4 macro-phase close approval gate.
Authored at this session (M4-C-P7-M4D-ENTRY-PREP); presented to native at
M4-D-S1. **Native verdict is the binding gate on the M4 → M5 flip** —
M4-D-S1 may execute work items (a)–(g) of §3 below in advance of the verdict
(producing the close artifact and the red-team), but the flip itself
(work item (j) — CURRENT_STATE M4 → M5) does not occur until NAP.M4.7
returns APPROVED.

### §2.3 — IS.8(b) macro-phase-close red-team — REQUIRED at M4-D-S1

Per `MACRO_PLAN §IS.8(b)` and `PHASE_M4_PLAN §9` red-team cadence table, every
macro-phase close fires a red-team before SESSION_LOG seal. M4-D-S1 authors
`00_ARCHITECTURE/EVAL/REDTEAM_M4_v1_0.md` covering all 9 axes per `PHASE_M4_PLAN
§3.4` paragraph 2. Verdict required: PASS (all 9 axes; or PASS_WITH_FIXES
with all fixes applied before SESSION_LOG seal). The red-team is NOT
discharged in-document at M4-D close (unlike the IS.8(a) every-third-session
class which is sometimes in-document) — IS.8(b) macro-phase-close is a
standalone artifact per AC.M4D.2 of `PHASE_M4_PLAN §3.4`.

### §2.4 — All open carry-forwards either resolved or explicitly accepted

Every item in the M4-A + M4-B + M4-C residual roster (compiled at §5 below) has
one of three dispositions at M4-D close:

- **resolve-in-M4-D** — the item is closed within the M4-D-S1 session
  (either by direct action or by a tracked decision recorded in M4_CLOSE).
- **accept-as-M5-input** — the item carries forward to M5 with explicit owner
  + ETA in HANDOFF_M4_TO_M5_v1_0.md.
- **defer-post-M5** — the item carries forward beyond M5 (e.g., M9 multi-school,
  M5+ JH-access dependent, post-M10 publication scope) with explicit rationale
  in HANDOFF_M4_TO_M5 §inherited open items.

Per AC.M4D.7, **no item may exit M4-D as silently open**.

### §2.5 — SHADOW_MODE_PROTOCOL §3 binding (unchanged)

Per NAP.M4.4 APPROVED at M4-A-S2-T3 NAP-decisions append: shadow→production
promotion criteria binding (N≥3, variance ≤ 0.3, two-pass approval, validity
margin match_rate ≥ 0.4). M4-D does not amend this protocol; it consumes the
binding rule when documenting LL state at M4 close.

### §2.6 — CURRENT_STATE M4-C close marker present

CURRENT_STATE canonical state block reflects "M4-C CLOSED" in
`active_phase_plan_sub_phase` and `last_session_id` rotated to M4-C-S4 (or
the actual M4-C-S4 session_id at sealing). Entry-gate check: grep for
"M4-C CLOSED" + `last_session_id` start with "M4-C-S4" (or analogue).

---

## §3 — Sub-phase plan

### §3.1 — M4-D-S1 — Single substantive close session (close-class)

**Scope:** Author all four M4-D sealing outputs (per §1.2) in one session, with
the 10 work items below executed in order. NAP.M4.7 native verdict is the binding
gate on the final flip; work items (a)–(i) may proceed in advance of the verdict;
work item (j) gates on APPROVED.

**Work items (a)–(j) per AC.P7.2:**

#### (a) Compile full carry-forward roster from M4-A/M4-B/M4-C closes

Read M4_A_CLOSE §3 + M4_B_CLOSE §6 + M4_C_CLOSE (sealed at M4-C-S4) §6 + recent
SESSION_LOG entries for any in-flight findings not yet captured. Reconcile
duplicates; classify each item per §2.4 disposition schema. Output: §3 of
M4_CLOSE_v1_0.md (carry-forward roster with explicit dispositions).

#### (b) IS.8(b) M4 macro-phase red-team (all four sub-phases)

Author `00_ARCHITECTURE/EVAL/REDTEAM_M4_v1_0.md` covering 9 axes per `PHASE_M4_PLAN
§3.4` paragraph 2. Each axis evaluated against the union of M4-A + M4-B + M4-C
deliverables (not just M4-D itself):

- **Axis 1 — Layer separation (B.1).** Calibration weights are L6 (Learning
  Layer) outputs, not L1 claims. LL.1 / LL.2 / LL.5 / LL.6 / LL.7 weights live
  under `06_LEARNING_LAYER/`; FORENSIC v8.0 untouched.
- **Axis 2 — Derivation ledger (B.3).** Every calibration table entry cites
  its LEL event_id + MSR signal_id. lel_event_match_records.json carries 46
  records each citing event_id + actual/expected_lit_signals.
- **Axis 3 — No fabricated computation (B.10).** All chart states computed via
  M3-B/C scripts (compute_vimshottari, compute_yogini, compute_transits,
  compute_panchanga, compute_kp_horary) or flagged
  `[EXTERNAL_COMPUTATION_REQUIRED]`. JH D9 verification deferred per NAP.M4.3
  Option Y (KR.M3A.JH-EXPORT).
- **Axis 4 — n=1 validity (MACRO_PLAN §3.5.A Principle 1).** All calibration
  outputs carry the n=1 disclaimer in shadow file headers + recommendation
  document frontmatter (LL.1 / LL.2 / LL.4 / LL.5 / LL.6 / LL.7).
- **Axis 5 — Shadow-mode discipline.** No production-register writes without
  two-pass approval + N-threshold met. LL.1 30-signal production register
  flipped only after NAP.M4.5 30/30 approved at M4-B-S5. LL.2 / LL.5 / LL.6
  remain shadow at M4 close.
- **Axis 6 — Held-out sacrosanctity (Learning discipline #4).** Held-out 9
  events never influenced a training calibration write. Verified by direct
  partition filter at M4-A-T2 (PPL migration), M4-B-S1 (LL.1 shadow), M4-B-S3
  (LL.2 shadow), M4-C-S1 (LL.5 shadow), M4-C-S2 (LL.6 shadow), M4-C-S3 (LL.7
  artifact). Spot-check 3 of 9 records at M4-D-S1 red-team.
- **Axis 7 — Scope compliance.** No M5-shape pre-builds exist. LL.8 status is
  SCAFFOLD-M4 (per AC.M4C.4); no DBN; no probabilistic signal-state outputs;
  no cohort-mode LL.7 (cohort-mode is M7+ scope per `MACRO_PLAN §LL-Appendix.A`).
- **Axis 8 — Mirror discipline (ND.1 + MP.1–MP.8).** Mirror pairs current at
  M4 close. Confirm `.geminirules` and `.gemini/project_state.md` reflect
  M4-D close + M5 incoming at M4-D-S1 close (or carry-forward documented).
- **Axis 9 — PPL discipline.** All time-indexed M4 predictions logged before
  observation per CW.PPL. PPL log at M4 close: PRED.M3D.HOLDOUT.001 +
  PRED.M3D.HOLDOUT.002 with `partition: held_out`; outcome `null`; window
  2026-08-15 + 2027-08-19+. M4 sessions emitted no new time-indexed
  predictions — confirm.

**Verdict required:** PASS (all 9 axes) OR PASS_WITH_FIXES (all fixes applied
before SESSION_LOG seal). FAIL would block M4-D close per AC.M4D.2.

#### (c) CF.LL7.1 CDLM-patch disposition decision

`CF.LL7.1` is the carry-forward opened at M4-C-S3-LL7-DISCOVERY-PRIOR (per
CURRENT_STATE v3.0 changelog): the 8 MED-tier LL.2 anchor pairs (MSR.117/.118/
.119/.143/.145/.402 Pancha-Mahapurusha clique) classify as `novel` under
literal CDLM clique construction (DECISION-2 verbatim) because the governing
CDLM cells (D1.D1 Sasha-Saturn-Kendra; D5.D5 Venus-Malavya; D5.D6 Mars-Ruchaka;
D5.D7 Jupiter-Hamsa) do NOT carry these MSR IDs in their `msr_anchors` field.
The classification is **correct under current CDLM**, not a defect.

**Three options for CF.LL7.1 at M4-D-S1:**

- **Option α — patch CDLM in M4-D.** Author CDLM v1.1 → v1.2 with msr_anchors
  populated for the relevant cells. Re-run LL.7 sanity-check; expect 8 MED-tier
  pairs to flip from `novel` → `confirmed`. Cost: requires 025_HOLISTIC_SYNTHESIS
  touch (frozen unless native-approved) + LL.7 re-emit + manifest re-bump.
- **Option β — accept-as-M5-input.** CDLM patch becomes M5 workstream; LL.7
  artifact stays at v1.0 with 8 MED-tier as `novel` documented as
  "CDLM-as-prior gap, not classification error". HANDOFF_M4_TO_M5 records the
  workstream with M5 owner.
- **Option γ — defer-post-M5.** CDLM patch becomes M6+ workstream (e.g., M8
  classical-text cross-reference may surface additional anchor patches at
  scale); LL.7 artifact stays unchanged across M5 entry. HANDOFF documents the
  deferral with M6+ ETA.

**Decision authority:** native (NAP.M4.7 brief §3 condition (c) presents the
disposition for native sign-off). Default if native does not specify: Option β
(accept-as-M5-input) — minimizes blast radius at M4 close while keeping the
workstream visible.

#### (d) KR.M4A.RT.LOW.1 git tree-rewrite (execute or defer)

`KR.M4A.RT.LOW.1` is the LOW-severity finding from REDTEAM_M4A §6: commit 0793719
(M4-A-INTEGRATION-PASS) has a duplicate `01_FACTS_LAYER` entry in its root tree
per `git ls-tree`. On-disk file content is correct; subsequent commits wrote
clean trees over it; all reads work. The malformation is cosmetic.

**Two options at M4-D-S1:**

- **Option α — execute tree-rewrite.** Use `git filter-repo` or interactive
  rebase to re-author 0793719 with a clean tree. Force-push only if native
  authorizes (force-push to main is a hard-constraint event; default is to
  defer). Cost: 30–60 min; risk of force-push collateral.
- **Option β — defer.** Carry KR.M4A.RT.LOW.1 forward into HANDOFF_M4_TO_M5 as
  cosmetic-hygiene M5+ item. No action at M4-D.

**Default:** Option β (defer). Tree-rewrite is opportunistic; the malformation
does not affect any read path or any downstream consumer.

#### (e) R.LL1TPA.1 Gemini reachability final record

`R.LL1TPA.1` is the carry-forward from M4-B-S5 (NAP.M4.5 native pass_2): Gemini
synchronously NOT_REACHABLE at M4-B-S5; re-attempt scheduled at M4-C entry per
`LL1_TWO_PASS_APPROVAL §6`. Status across M4-C: not re-attempted at M4-C-S3
(brief did not require it); discharge status at M4-C-S1 / S2 / S4 to be
recorded in M4_C_CLOSE.

**Action at M4-D-S1:** record final M4-class reachability status in M4_CLOSE §6
mirror sync evidence. If still NOT_REACHABLE at M4 close, R.LL1TPA.1 carries
to M5 with same convention (re-attempt at M5 entry; surrogate-disclosure ledger
extended). If REACHABLE at any M4-C session, addendum to LL1_TWO_PASS_APPROVAL
§5 captured Gemini's verdict (ratify or contest); record disposition in
M4_CLOSE.

#### (f) DECISION-1 R.LL5DESIGN.1 verify propagation complete

`R.LL5DESIGN.1` (with sibling R.LL6DESIGN.1) is the LL.5 / LL.6 mechanism-name
divergence: `LL5_DASHA_TRANSIT_DESIGN_v1_0.md` and `LL6_TEMPORAL_DENSITY_DESIGN_v1_0.md`
adopt brief-binding scope decisions for "Dasha-Transit Synergy" and "Temporal
Density Modulator" rather than the PHASE_M4C_PLAN §LL-Appendix-named "Retrieval
Ranking" (LL.5) and "Plan Selection" (LL.6). Per CURRENT_STATE v3.0 changelog,
DECISION-1 (Option A — propagate the brief-naming downstream) was ratified;
propagation to MACRO_PLAN / PHASE_M4C_PLAN / SHADOW_MODE_PROTOCOL was deferred
to M4-C-S4 sub-phase close.

**Action at M4-D-S1:** verify M4-C-S4 has propagated the LL.5 + LL.6
mechanism-name updates to MACRO_PLAN §LL-Appendix.B (LL.5 + LL.6 row),
PHASE_M4C_PLAN §3.1 + §3.2, and SHADOW_MODE_PROTOCOL §3.5 LL.5/LL.6 row labels.
If incomplete at M4-D-S1 read time, M4-D-S1 completes the propagation as part
of the close-class housekeeping (similar precedent: M3-D D1 closed M3-B Track 2
en bloc per PHASE_M3_PLAN §3.2 close-en-bloc clause). Record disposition in
M4_CLOSE §3 carry-forward.

#### (g) Author M4_CLOSE_v1_0.md sealing artifact

Author `00_ARCHITECTURE/M4_CLOSE_v1_0.md` per AC.M4D.3:

- **§1 quality bar** — per-AC PASS/DEFER/FAIL table covering AC.M4A.1–10 +
  AC.M4B.1–10 + AC.M4C.1–5 (PHASE_M4_PLAN §3.3) + AC.M4D.1–8 (PHASE_M4_PLAN
  §3.4) — total 33 ACs across the macro-phase.
- **§2 sub-phase wave log** — M4-A through M4-D session count + commit-hash
  trail + key deliverables per sub-phase.
- **§3 deferred items** — carries from §5 of this plan + new-at-M4-D items;
  every item with explicit owner + ETA per AC.M4D.7.
- **§4 red-team evidence** — REDTEAM_M4 verdict cite + counts.
- **§5 ND status** — ND.1 (Mirror Discipline) addressed since 2026-04-24;
  no new directives in M4.
- **§6 mirror sync evidence** — MP.1 + MP.2 propagated at M4-D-S1 close.

#### (h) NAP.M4.7 native sign-off (present brief; await reply)

Present `NAP_M4_7_BRIEF_v1_0.md` to native at M4-D-S1 open. Brief contains the
decision template (§4 of brief): native replies "M4 approved. [optional notes]"
OR "Hold — [specific issue to resolve first]". Brief is purely
decision-presenting; it does not pre-decide approval (per AC.P7.3 hard
constraint). If native replies APPROVED, work item (j) executes; if HOLD,
M4-D-S1 closes as PARTIAL with the holding issue named, and a follow-up M4-D-S2
session opens after the holding issue is resolved.

#### (i) Produce M5 handoff — what M5 inherits from M4

Author `00_ARCHITECTURE/HANDOFF_M4_TO_M5_v1_0.md` per AC.M4D.4:

- **§1 What M4 delivered** — LL.1–LL.7 state at M4 close (numerical summary +
  paths to artifacts); LEL v1.6 with 46 events; CALIBRATION_RUBRIC Option B
  approved + binding; SHADOW_MODE_PROTOCOL §3 approved + binding.
- **§2 Platform state** — `platform/**` state unchanged through M4 (no DB
  migrations; no retrieval/synthesis surface changes). Feature flag state
  unchanged from M3 close (per CURRENT_STATE).
- **§3 M5 priorities** — first M5 session priorities per `MACRO_PLAN §M5`:
  DBN topology proposal + prior elicitation; signal embedding refit-stability
  test design; CW.PPL volume gate verification (≥50 predictions ≥6 months
  elapsed — current state: 16 predictions, far short).
- **§4 Hard prerequisites for M5** — ≥50 PPL predictions ≥6 months elapsed;
  LL.1–LL.7 stable; LL.8 SCAFFOLD; native-approved DBN topology; native-approved
  prior specification.
- **§5 Inherited open items** — full §5 carry-forward roster from this plan
  + any items added at M4-D-S1; classified by owner (native | M5 | M9-class)
  with ETA per AC.M4D.7.

#### (j) CURRENT_STATE → M5 active

ONLY after NAP.M4.7 returns APPROVED at work item (h):

- `active_macro_phase: M4 → M5`.
- M4 `active_macro_phase_status: closed`.
- `active_phase_plan: 00_ARCHITECTURE/PHASE_M4_PLAN_v1_0.md` retained as
  reference; new field `active_phase_plan_status: COMPLETE`.
- `last_session_id: M4-D-S1` (or whatever the actual M4-D-S1 session_id is).
- `next_session_objective: M5 first session (M5 phase plan authoring OR
  drive directly from MACRO_PLAN §M5 — decision at M5 open per CURRENT_STATE
  v3.0 §3 narrative precedent of M3 → M4 transition)`.
- `red_team_counter: 0` (IS.8(b) fires + resets per ONGOING_HYGIENE_POLICIES
  §G).
- `file_updated_at` rotated; `file_updated_by_session: M4-D-S1`.
- Mirror MP.1 + MP.2 propagated same-session per ND.1.

If NAP.M4.7 returned HOLD at work item (h), work item (j) does NOT execute;
CURRENT_STATE remains at M4-C / M4-D-IN-FLIGHT until the holding issue is
resolved at M4-D-S2.

---

## §4 — M5 inputs from M4 — what M5 inherits

The following Learning Layer state is what M5 inherits at M4 → M5 flip. Per
`MACRO_PLAN §M5` entry state requirement "M4 closed (calibration tables stable;
LL.1–LL.7 active)", these are the calibration tables and LL state.

### §4.1 — LL.1 — Per-signal weight calibration (PRODUCTION)

- **30 production-weight signals** at `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/
  signal_weights/production/ll1_weights_promoted_v1_0.json`. All 30 carry
  `status: production`; outer `weights_in_production_register: true`;
  per-signal `approval_chain[0].pass_2_decision: approved`. Joint-Tier-C verdict
  on SIG.MSR.118/.119/.143: (a) three independent calibrated phenomena
  (NAP.M4.5 native, M4-B-S5).
- **380 shadow-observed signals** at `signal_weights/shadow/
  ll1_shadow_weights_v1_0.json`. 30 promotion-eligible (now in production); 285
  insufficient_observations (N<3); 52 shadow_indefinite_low_match_rate; 13
  shadow_indefinite_high_variance. variance_estimator: sample.
- **Calibration rubric** Option B (per NAP.M4.1) binding for all weight
  derivations. Rubric document at `OBSERVATIONS/CALIBRATION_RUBRIC_v1_0.md` v1.1
  status APPROVED.

### §4.2 — LL.2 — Edge weights (SHADOW; gate-level promotion-block UNBLOCKED)

- **9,922 shadow edges** at `signal_weights/shadow/ll2_edge_weights_v1_0.json`.
  Tier distribution: HIGH=0, MED=8 (Pancha-Mahapurusha clique), LOW=9,914,
  ZERO=0; cross_domain=0, intra_domain=9,922.
- **LL.2 stability gate FULL_PASS** (LL2_STABILITY_GATE v1.1; re-evaluated
  cascade at NAP.M4.5 close). **Per-edge promotion is M5+ scope** — gate-level
  unblock means the rule "both endpoint signals must be in LL.1 production"
  is now satisfied for the 30-signal pair set; per-edge execution is deferred
  separately from M4-C sub-phase ordering.

### §4.3 — LL.5 — Dasha-Transit Synergy (SHADOW)

- **`signal_weights/shadow/ll5_dasha_transit_v1_0.json`** (M4-C-S1, 2026-05-02,
  commit f30f696). 380 signals × dasha_weight + transit_weight. HIGH=2 / MED=12 /
  LOW=252 / ZERO=114; dasha_dominant=259 / transit_dominant=1 / balanced=6.
  lit_source skew: dasha 410 / transit 4 / both 6.
- **Promotion gate at M4-C close:** N=0 per-feature for ranker-retrieval
  judgements (acharya-grade relevance not yet logged). LL.5 promotion
  deferred to M5+ per LL5_STABILITY_GATE.

### §4.4 — LL.6 — Temporal Density Modulator (SHADOW; informational)

- **`signal_weights/shadow/ll6_temporal_density_v1_0.json`** (M4-C-S2, 2026-05-02,
  commit 0c15a20). 37 events × cluster_size + density_weight; 380 signals ×
  density_adjusted means. cluster-size distribution {1:7, 2:10, 3:11, 4:8, 5:1};
  meaningful_adjustment_count 255/380 (67%); mean delta 0.2202; max 0.5693.
- **H2 dense-cluster-inflation test** REJECTED at n=37 (weighted-form
  gap_reduction −0.0069). Finding is informational only — not a load-bearing
  explanation of the held_out>training gap. LL.4 §2.2 H1 (decade-stratified
  selection bias) + H2 (LEL retrodictive labeling) remain the load-bearing
  hypotheses. Carries to M4-D as informational input to hypothesis ranking.

### §4.5 — LL.7 — Discovery Prior (NATIVE-ONLY ARTIFACT)

- **`signal_weights/shadow/ll7_discovery_prior_v1_0.json`** (M4-C-S3, 2026-05-02,
  commit fee3a5b). NAP.M4.6 Option B + 3 refinements (`unconfirmed` rename;
  N≥3 threshold; 8 MED-tier sanity-check anchor) + DECISION-2 literal
  msr_anchors-clique CDLM construction. 81 cells scanned; 136 unique CDLM
  edges across 58 anchor signals; **243 emitted edges = 107 novel + 136
  unconfirmed + 0 confirmed + 0 contradicted**; 9,867 noise pairs excluded
  from 9,974 raw co-firing pairs.
- **Sanity-check:** all 8 MED-tier LL.2 anchor pairs classify as `novel` under
  literal construction (NOT `confirmed` — the governing CDLM cells lack the
  Pancha-Mahapurusha MSR IDs in their msr_anchors field). PASS gate per
  NAP §6.3(b) raw N≥3 (sanity_anchor_novel_count: 8). CF.LL7.1 CDLM-patch
  workstream flagged for M4-D / M5 disposition.
- **No shadow→production split** per `SHADOW_MODE_PROTOCOL §2 LL.7` row
  (native-only mode).

### §4.6 — LL.4 — Qualitative domain / signal-class priors (RECOMMENDATION)

- **Recommendation document** at `LL4_PREDICTION_PRIOR_v1_0.md` v1.1.
  Qualitative tier priors: STRONG (classical_rule + both bases — full credit);
  MODERATE (career/financial/health/relationship temporal — 0.4–0.5
  multiplier; general temporal — 0.30 with cluster-aware consolidation per
  LL.3 R.LL3.2); WEAK (travel n=5; psy/spi/edu/fam n≤7 too thin).
- **Machine-readable view** at `signal_weights/ll4_prediction_priors_v1_0.json`.
  10 domain priors + 3 signal-class priors + date-precision global modifier
  (exact / approx-month / approx-year).
- **No shadow→production split** per `SHADOW_MODE_PROTOCOL §2 LL.4` row.
  Priors are recommendations, not bindings; M5 LL.5 prior-fitting input.

### §4.7 — CF.LL7.1 — CDLM-patch workstream

- **Pancha-Mahapurusha cluster MSR IDs** (MSR.117/.118/.119/.143/.145/.402)
  absent from CDLM as `msr_anchors` of governing cells. Until patched, the 8
  MED-tier LL.2 anchor pairs remain `novel` in LL.7 — correct under current
  CDLM, not a defect.
- **Disposition at M4-D:** per §3 work item (c). Default Option β
  (accept-as-M5-input).

### §4.8 — LEL v1.6 — Ground-truth spine

- **46 LEL events** at `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md` v1.6 (file
  versioning convention — file path retains v1_2 suffix; in-frontmatter
  version is 1.6). 37 training / 9 held-out, decade-stratified 2/3/4 across
  2000s/2010s/2020s.
- **lel_event_match_records.json** 46 records under schema v1.1; rubric
  Option B; mean match_rate 0.685 (training 0.630 / held-out 0.913).
- **held_out 9 events sacrosanct** end-to-end across M4 (verified at every
  shadow/production write).
- **PPL** (`prediction_ledger.jsonl`) carries 16 PRED rows; 2 with
  `partition: held_out` (PRED.M3D.HOLDOUT.001 + 002; outcome null; window
  2026-08-15 + 2027-08-19+).

---

## §5 — Known residuals entering M4-D — exhaustive roster

Compiled from M4_A_CLOSE §3 + M4_B_CLOSE §6 + M4_C_CLOSE pre-draft §6 + recent
SESSION_LOG entries (M4-C-S1/S2/S3 in-session findings per CURRENT_STATE v2.8 /
v2.9 / v3.0 changelog). Each item classified by disposition:

- **R = resolve-in-M4-D** (close within M4-D-S1).
- **A = accept-as-M5-input** (HANDOFF_M4_TO_M5 §inherited open items, M5 owner).
- **D = defer-post-M5** (M6+ workstream, deferred owner).
- **C = closed prior to M4-D** (recorded for completeness; not active).

### §5.1 — From M4-A substrate

| # | ID | Severity | Description | Default disposition |
|---|---|---|---|---|
| 1 | KR.M4A.RT.LOW.1 | LOW | Commit 0793719 malformed root tree (cosmetic; on-disk content correct) | A (default) — Option β at §3 work item (d) |
| 2 | KR.M4A.CLOSE.1 | doc-drift | CALIBRATION_RUBRIC frontmatter status drift | C — DISCHARGED at M4-B-S3 (CALIBRATION_RUBRIC v1.0-DRAFT → v1.1 APPROVED) |
| 3 | KR.M4A.CLOSE.2 | procedural | M4-B-S1 single-track vs B1/B2 split irregularity | C — RESOLVED at M4-B-S5 (NAP.M4.5 native acceptance) |
| 4 | GAP.M4A.04 | DEFERRED | Travel sparsity (PARTIAL_CLOSE per NAP.M4.2 + LEL v1.6 patch + M4-B-P1 status flip) | A — carries to M4-D / M5 LEL maintenance window |
| 5 | GAP.M4A.01/02/03/05/06 | DEFERRED | Five elicit-recommended gaps deferred per NAP.M4.2 | A — at native discretion in future LEL pass |
| 6 | KR.M3A.JH-EXPORT | DEFERRED | DIS.009 full closure pending JH D9 export per ED.1 (NAP.M4.3 Option Y) | A — explicit HANDOFF to M5 alongside Sthana + Drik Shadbala ECR + Narayana Dasha verification |

### §5.2 — From M4-B substrate

| # | ID | Severity | Description | Default disposition |
|---|---|---|---|---|
| 7 | F.RT.S4.1 | LOW | Variance estimator unspecified in SHADOW_MODE_PROTOCOL §3.1(b) | C — CLOSED at M4-B-S5 via `variance_estimator: sample` field |
| 8 | F.RT.S4.2 | NOTE | Surrogate self-review structural circularity | C — disclosed; bounded by NAP.M4.5 native pass_2 |
| 9 | F.RT.S4.3 | INFO | Domain-coherence-by-rubric-design tautology | C — acknowledged in LL3_DOMAIN_COHERENCE §3.2 |
| 10 | GAP.TRAVEL_MISC.01 | speculative | LEL §6 mention of "possibly Russia-related business trips" without dates | A — speculative-pending-elicitation for M5+ LEL maintenance |
| 11 | R.LL2GATE.1 | LOW | Surrogate ownership for LL2_STABILITY_GATE pass_2 | A — same ownership pattern as R.LL1TPA.1 |
| 12 | R.LL2GATE.2 | DEFERRED | Domain mapping for cross-system signal IDs (CTR/CVG/SIG.NN/RPT — 11 of 30 LL.1 promotion-eligible carry `domain: unknown`) | R — M4-D cross-system reconciliation scope |
| 13 | R.LL2GATE.3 | LOW | Sparse training partition for edge statistics | C — protocol handles via N≥3 floor |
| 14 | R.LL2DESIGN.1 | LOW | LL.2 shadow path co-located with LL.1 (vs. declared GRAPH_EDGE_WEIGHT_LEARNING/edge_modulators/shadow/) | A — next M4-class governance pass |
| 15 | Domain-stratified LEL training corpus | finding | LEL training events fire actual_lit_signals from a single domain bucket (cross-ref R.LL3.4) | R — M4-D cross-system reconciliation scope |
| 16 | R.LL1TPA.1 | LOW | Gemini reachability re-attempt (NOT_REACHABLE at M4-B-S5) | A — re-attempt at M5 entry; surrogate-disclosure ledger extended |
| 17 | F.RT.S6.M.1 | MEDIUM | Mirror staleness on M4-B-CLOSED checkpoint | C — DISCHARGED at M4-C-S1 entry MP.1+MP.2 sync |
| 18 | F.RT.S6.M.2 | LOW | M4_B_CLOSE_v1_0.md not yet in CAPABILITY_MANIFEST | A — register at next manifest touch (M4-D-S1 manifest bump) |
| 19 | F.RT.S6.N.1 | NOTE | Parallel-session version-coordination convention is ad-hoc | A — opportunistic at next quarterly governance pass (2026-07-24) |
| 20 | F.RT.S6.I.1 | INFO | Outer-metadata stale-doc-hint on `ll1_weights_promoted` `production_status_field_value` field | A — opportunistic at next LL.1 production-register touch (M5 consumer wiring) |
| 21 | Per-edge LL.2 promotion | scope | Gate-level promotion-block lifted at NAP.M4.5; per-edge execution deferred | A — separate from M4-C / M4-D ordering; LL.2 promotion time |

### §5.3 — From M4-C substrate (per CURRENT_STATE v2.8 / v2.9 / v3.0 changelog)

| # | ID | Severity | Description | Default disposition |
|---|---|---|---|---|
| 22 | LL.5 promotion criteria | scope | First shadow write at S1 has N=0 per-feature; ranker-retrieval judgements not yet logged | A — M5+ or future LL.5 extension |
| 23 | LL.6 promotion criteria | scope | First shadow write at S2 has N=0; informational mechanism per shadow-mode discipline | A — M5+ |
| 24 | CF.LL7.1 | workstream | CDLM Pancha-MP anchor patch — 8 MED-tier pairs remain `novel` until CDLM patched (DECISION-2 literal construction is correct under current CDLM) | per §3 work item (c) — default A (Option β) |
| 25 | F.M4CS3.MIRROR.1 | LOW | Mirror MP.1+MP.2 NOT propagated at M4-C-S3 (per brief must_not_touch); LL.7-class delta carries to next mirror-touch | C/A — DISCHARGED at M4-C-S4 sub-phase close (or carries to M4-D-S1 if M4-C-S4 deferred) |
| 26 | R.LL5DESIGN.1 | naming | LL.5 mechanism-name propagation to MACRO_PLAN / PHASE_M4C_PLAN / SHADOW_MODE_PROTOCOL deferred to S4 per DECISION-1 | per §3 work item (f) — R if not propagated at M4-C-S4 |
| 27 | R.LL6DESIGN.1 | naming | LL.6 mechanism-naming divergence; jointly tracked with R.LL5DESIGN.1 | per §3 work item (f) — R if not propagated at M4-C-S4 |
| 28 | R.LL6FINDING.1 | finding | LL.6 H2 dense-cluster-inflation rejected at n=37; informational input to M4-D's hypothesis ranking on LL.4 §2.2 | R — informational input to REDTEAM_M4 axis 4 (n=1 validity) |
| 29 | R.LL3.1/.2/.3 | recommendation | LL.3 §5.1 fix-before-prod recommendations; disposition recorded at M4-C-S1 per AC.M4C.S1.2 | A or C per S1 disposition record (default A: deferred-to-M4D-pipeline-change for retrieval-pipeline items) |
| 30 | LL.4 §5.4 date-precision modifier | informational | Apply at M4-C-S1/S2/S3 ranker / plan-selector / discovery features | C — applied per per-session brief |

### §5.4 — Inherited from M3 / M2 / earlier (still open at M4-D entry)

| # | ID | Severity | Description | Default disposition |
|---|---|---|---|---|
| 31 | DIS.010/011/012 | RESOLVED-N3 | Jaimini multi-tradition forks (chara_dasha, narayana_dasha, atmakaraka — RESOLVED-N3 default policy: defer to M9 multi-school triangulation) | D — M9 |
| 32 | Sthana + Drik Shadbala ECR | external | `[EXTERNAL_COMPUTATION_REQUIRED]` per CLAUDE.md §I B.10; JH access dependency | A — M5+ alongside KR.M3A.JH-EXPORT |
| 33 | Narayana Dasha verification | external | `compute_narayana.py` output `needs_verification: true` per DIS.012 R1/R2 | A — M5 alongside JH integration; or M8 multi-school verification |
| 34 | KR.M3A2.1 | doc | PAT.008 ECR clarification — could explicitly cite FORENSIC §3.5 as in-corpus L1 source | R or A — opportunistic doc-clarity at M4-D-S1 if low-cost; otherwise A |
| 35 | AC.M3A.5 | DEFERRED | Post-baseline delta run (auth wall — BHISMA GAP.P.9) | A — M4-class with auth-secrets availability |
| 36 | External acharya review on M3 deliverables | aspirational | R.M3D.1 mitigation; in-session native review = AC.M3D.3 PASS at M3 close | A — M5+ alongside §Acharya Reviewer Pool Policy recruitment |
| 37 | SIG.MSR.207 + SIG.MSR.497/498/499 absent from MSR_v3_0.md | doc | msr_domain_buckets.json `missing_signal_ids.count: 4`; MSR §I declares 500, file carries 495 | A — M4-substrate cleaning pass or M5+ MSR expansion |
| 38 | UCN inline citation pass (Option A) | aspirational | UCN_v4_0.md inline citation pass; not gating | D — post-M5 documentation pass |
| 39 | TS test-fixture errors | non-blocking | tests/components/AppShell.test.tsx + ReportGallery.test.tsx; 9 errors; pre-W6 portal-redesign drift | A — Portal Redesign R-stream owns |
| 40 | KR.W9.1 + KR.W9.2 | DEFERRED | Eval-runner auth wall + parser quirk (BHISMA GAP.P.9) | A — M4-class with auth-secrets availability |
| 41 | KR.M3.RT.LOW.1 | LOW | KP per-planet snapshot vs 0°-360° boundary table (REDTEAM_M3 §6) | A — M4-class follow-up if needed |

### §5.5 — Aggregate count

- **Items**: 41 enumerated above.
- **C (closed prior to M4-D entry)**: 7 items (rows 2, 3, 7, 8, 9, 13, 17, 30 — 8 items if M4-C-S1 disposition closes R.LL3.* fully; otherwise 7).
- **R (resolve-in-M4-D)**: 3–5 items (rows 12, 15, 28; possibly 26, 27, 34).
- **A (accept-as-M5-input)**: ~25 items (default for residuals not requiring M4-D action).
- **D (defer-post-M5)**: 2 items (rows 31, 38).

Final classification produced at M4-D-S1 close (work item (a)) and recorded in
`M4_CLOSE_v1_0.md §3` per AC.M4D.7.

---

## §6 — Changelog

- **v1.0 DRAFT (2026-05-02, M4-C-P7-M4D-ENTRY-PREP):** Initial forward-pointer
  plan for M4-D macro-phase close. Single substantive close session M4-D-S1
  with 10 work items (a)–(j) per AC.P7.2 enumeration. Inputs from M4-A/B/C close
  documents read at this session; outputs (M4_CLOSE / REDTEAM_M4 / HANDOFF /
  CURRENT_STATE flip) authored at M4-D-S1. NAP.M4.7 brief authored same session
  as companion artifact (`00_ARCHITECTURE/EVAL/NAP_M4_7_BRIEF_v1_0.md`).
  Status DRAFT — flips CURRENT at M4-D-S1 open or amended-in-place per actual
  M4-C exit conditions documented at M4-C-S4 sub-phase close.
  Sister artifacts: `00_ARCHITECTURE/PHASE_M4_PLAN_v1_0.md` (M4 macro-phase
  plan; M4-D AC schema at §3.4); `00_ARCHITECTURE/PHASE_M4C_PLAN_v1_0.md` (M4-C
  sub-phase plan; predecessor scope).

---

*End of PHASE_M4D_PLAN_v1_0.md DRAFT. Status flips DRAFT → CURRENT at M4-D-S1
open. M4-D-S1 produces M4 macro-phase sealing artifacts and (gated on NAP.M4.7
APPROVED) flips CURRENT_STATE M4 → M5.*
