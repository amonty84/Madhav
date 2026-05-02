---
artifact: 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_C_CLOSE_v1_0.md
canonical_id: M4_C_CLOSE
version: "1.0"
status: DRAFT
authored_by: M4-C-P6-S4-PREDRAFT
authored_at: 2026-05-03
sealed_by: "[PENDING-S4]"
sealed_at: "[PENDING-S4]"
sub_phase: M4-C — Discovery / Retrieval / Plan-Selection Activation (sub-phase of M4 macro-phase)
macro_phase: M4 — Calibration + LEL Ground-Truth Spine
sub_phase_opened: "[PENDING-S1] — first M4-C substantive session (LL.5 first shadow write); M4-B sub-phase formally CLOSED 2026-05-03 at M4-B-S6-CLOSE (commit 007c718) — M4-C entry-gate cleared."
sub_phase_closed: "[PENDING-S4] — M4-C-S4 sub-phase close session sealing this artifact; CURRENT_STATE rotation to mark M4-C CLOSED and M4-D as the incoming active phase."
phase_plan: 00_ARCHITECTURE/PHASE_M4C_PLAN_v1_0.md (DRAFT v1.0 authored 2026-05-02 at M4-B-P5-M4C-ENTRY-PREP; flips DRAFT → CURRENT at M4-C-S1 open or amended-in-place per actual M4-B exit conditions).
predecessor_close_artifact: 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_B_CLOSE_v1_0.md (M4-B sub-phase sealing CLOSED 2026-05-03 at M4-B-S6-CLOSE).
red_team_artifact: "[PENDING-S4] — IS.8(b)-class M4-C sub-phase-close red-team conducted at M4-C-S4 per the same convention used at M4-B-S6-CLOSE (in-document §7.2 OR standalone REDTEAM_M4C_v1_0.md per S4 brief authoring). Cite path/section once authored."
successor_sub_phase: M4-D — M4 macro-phase close (M4 cross-system reconciliation + NAP.M4.7 + IS.8(b) macro-phase-close red-team).
produced_during: M4-C-P6-S4-PREDRAFT (skeleton; parallel governance slot to M4-C-S3)
sealed_during: "[PENDING-S4]"
produced_on: 2026-05-03
status_explanation: >
  This document is a pre-draft skeleton authored at M4-C-P6-S4-PREDRAFT (2026-05-03)
  as a parallel governance slot to M4-C-S3 (LL.7 first artifact write). All S1/S2/S3/S4-
  dependent fields carry literal `[PENDING-S1]` / `[PENDING-S2]` / `[PENDING-S3]` /
  `[PENDING-S4]` tokens with one-line descriptions of what each is waiting for. M4-C-S4
  reads the actual S1/S2/S3 outcomes (from sealed shadow registers + LL.5/LL.6 design +
  stability gate artifacts + LL.7 native-only artifact + SESSION_LOG entries) and
  resolves every PENDING token at S4 close. Sealing flips frontmatter `status: DRAFT`
  to `status: CLOSED`, adds `sealed_by` + `sealed_at` fields, conducts the IS.8(b)-class
  M4-C sub-phase-close red-team (§7.2), and rotates CURRENT_STATE to mark M4-C CLOSED
  + M4-D as the incoming active phase.
note: >
  This is a SUB-PHASE close artifact, not a macro-phase close. The M4 macro-phase
  itself remains active and closes at M4-D with its own M4_CLOSE_v1_0.md sealing
  artifact + NAP.M4.7 native gate + IS.8(b) macro-phase-close red-team. M4-C is the
  Learning Layer activation sub-phase for the second tranche of mechanisms: LL.5
  (retrieval ranking, shadow), LL.6 (plan selection, shadow), and LL.7 (discovery
  prior shaping, native-only mode — no shadow→production split per
  SHADOW_MODE_PROTOCOL §2 LL.7 row). NAP.M4.6 (LL.7 prior rubric) is the binding NAP
  inside M4-C and was APPROVED 2026-05-02 (Option B — Classical-seeded with 3
  refinements; verdict pre-discharged so S3 opens with the rubric already in hand).
parallel_session_notes: >
  M4-C-P6-S4-PREDRAFT (this session) ran as a parallel governance slot alongside
  M4-C-S3 (LL.7 first artifact write per NAP.M4.6 Option B). Same convention as
  M4-B-P4-S6-PREDRAFT (parallel to M4-B-S5) — predraft skeleton authored ahead of S4
  with all S-dependent fields held as literal `[PENDING-S*]` tokens; S4 consumes the
  skeleton at sub-phase close rather than starting fresh. Conflict surfaces:
  CURRENT_STATE.md (this session sets `predraft_available: M4_C_CLOSE_v1_0.md`;
  canonical state pointers UNCHANGED — S3 owns those) and SESSION_LOG.md (this
  session appends its own entry; S3's entry is independent). drift_detector.py /
  schema_validator.py / mirror_enforcer.py to be re-run at S4 close to confirm no
  cross-check regression.
changelog:
  - v1.0 DRAFT (2026-05-03, M4-C-P6-S4-PREDRAFT, parallel governance slot to M4-C-S3):
    Initial pre-draft skeleton authored as a parallel slot to M4-C-S3 (LL.7 first
    artifact write). All S1/S2/S3/S4-dependent fields held as literal `[PENDING-S*]`
    tokens per the brief hard_constraint "Do not pre-decide S3 outcomes (novel edge
    count, sanity-check result). Every S3-dependent field is [PENDING-S3]." The brief
    also instructed to read S1+S2 SESSION_LOG entries if those sub-phases had closed
    by the time this session ran and fill §2 + §5 rows from actual outcomes; check at
    write time confirmed neither S1 nor S2 had closed yet (last logged session is the
    NAP.M4.6 verdict append at af82d8e, 2026-05-03; no M4-C-S1 / S2 / S3 entries in
    SESSION_LOG; latest commits before this slot: ecd30a2 chore stamp + 4948a48 W2
    smoke). All S1/S2/S3/S4-dependent fields therefore remain [PENDING-S*]; S4 reads
    actual outcomes at close.
    - §1 scope: 3 mechanisms (LL.5/LL.6/LL.7 native-only) per PHASE_M4C_PLAN §1.1;
      sub-phase rounds S1–S4 + Px parallel slots (this session is P6); deliverables
      inventory schema (substantive + governance-state).
    - §2 AC ledger: PHASE_M4C_PLAN §3 per-sub-phase ACs (AC.M4C.S1.1–S1.5;
      AC.M4C.S2.1–S2.4; AC.M4C.S3.1–S3.5; AC.M4C.S4.1–S4.5) all marked [PENDING-S*];
      cross-cutting PHASE_M4_PLAN §3.3 ACs (AC.M4C.1–5) marked [PENDING].
    - §3 deliverables inventory: structural rows for each expected M4-C deliverable
      with [PENDING-S*] for path/version/commit/status fields.
    - §4 NAPs: NAP.M4.4 (binding throughout M4-C, unchanged); NAP.M4.6 (RESOLVED
      2026-05-02, Option B + 3 refinements — fully populated since this is known
      ground at predraft time); NAP.M4.7 [PENDING-S4 cross-reference; M4-D scope].
    - §5 LL status: LL.5 [PENDING-S1]; LL.6 [PENDING-S2]; LL.7 [PENDING-S3].
    - §6 known residuals: KR.M4A.RT.LOW.1 (still open); GAP.M4A.04 PARTIAL_CLOSE
      (deferred); R.LL1TPA.1 [PENDING-S1 — Gemini reachability re-check outcome];
      F.RT.S6.M.2 (recorded as closed by S3 manifest update [PENDING-S3 confirmation]);
      F.RT.S6.N.1 (still open — next quarterly governance pass 2026-07-24).
    - §7 red-team: IS.8(a) cadence trail in M4-C [PENDING-S1/S2/S3]; IS.8(b)-class
      M4-C sub-phase-close red-team [PENDING-S4 — author or accept-as-discharged
      per S4 brief].
    - §8 approval: M4-C sub-phase close = internal AC gate, no NAP. NAP.M4.7 at
      M4-D macro-phase close. [PENDING-S4 verdict text].
    - §9 this changelog.
    Authored under brief `M4-C-P6-S4-PREDRAFT`. Companion artifacts: PHASE_M4C_PLAN
    v1.0 DRAFT (forward-pointer plan, M4-B-P5); NAP_M4_6_BRIEF v1.1 OPTION_B_APPROVED
    (decision brief, M4-B-P5 + native verdict 2026-05-02).
---

# M4-C CLOSE — Discovery / Retrieval / Plan-Selection Activation (M4 sub-phase) — DRAFT

## Executive summary

```
STATUS: 1.0 — DRAFT 2026-05-03 (M4-C-P6-S4-PREDRAFT, parallel governance slot to S3).
This document is a pre-draft skeleton; sealing happens at M4-C-S4 sub-phase close.
S4 reads actual S1/S2/S3 outcomes and replaces every [PENDING-S*] token with verdict
text or factual outcome cite, conducts the IS.8(b)-class sub-phase-close red-team
(§7.2), and flips frontmatter `status: DRAFT` to `status: CLOSED`.
```

M4-C (Learning Layer Activation — second tranche: LL.5 retrieval-ranking weights in
shadow; LL.6 plan-selector weights in shadow; LL.7 discovery prior in native-only
single-artifact form per NAP.M4.6 Option B classical-seeded with 3 refinements
(`unconfirmed` rename + N≥3 threshold + 8-edge LL.2 sanity-check anchor); binding
`SHADOW_MODE_PROTOCOL §3` discipline; held-out 9-event partition sacrosanct
throughout; NAP.M4.6 RESOLVED 2026-05-02 — `[PENDING-S4 sealing path verdict]`.

NAP.M4.6 verdict (M4-B-P5-M4C-ENTRY-PREP NAP-decisions append, 2026-05-02, commit
af82d8e): **Option B — Classical-seeded** with three native refinements: (a) rename
`classical_only` support class to `unconfirmed`; (b) lower discovery threshold from
N≥5 to N≥3; (c) 8 MED-tier LL.2 edges (per `LL3_DOMAIN_COHERENCE §4.1`) become the
verification anchor for the LL.7 algorithm at S3 — re-finding them is a sanity check.

The Learning Layer activation substrate computed across S1–S3 is `[PENDING-S1/S2/S3]`.
LL.5 first shadow write at S1: `[PENDING-S1]`. LL.6 first shadow write at S2:
`[PENDING-S2]`. LL.7 native-only artifact at S3: `[PENDING-S3]` (expected output
shape per NAP_M4_6_BRIEF v1.1 §6.4: ~30–60 `unconfirmed` + 8 `confirmed` minimum +
0–3 `contradicted` + ~5–15 `novel_candidate`). M4-D macro-phase close is
**unblocked** at the moment §1.4 close-criteria are met `[PENDING-S4]`.

---

## §1 — Scope of M4-C

M4-C is the second Learning Layer activation sub-phase of M4. Per `PHASE_M4C_PLAN §1.1`,
M4-C activates three Learning Layer mechanisms (LL.5/LL.6/LL.7 native-only) under
shadow-mode discipline (LL.5/LL.6) + native-only-artifact discipline (LL.7), where
"shadow mode" is the structural separation between observation of a learned parameter
and application of that parameter in retrieval/synthesis (per
`SHADOW_MODE_PROTOCOL §1`) and "native-only mode" is a single native-approved
artifact with no shadow→production split per §2 LL.7 row.

### §1.1 — Mechanism scope

- **LL.5 — Retrieval ranking learning.** Per `MACRO_PLAN §LL-Appendix.B LL.5` +
  `PHASE_M4C_PLAN §3.1`. Compute per-(query_class × ranker_feature) shadow weights
  consuming LL.1 production weights (30 signals) + LL.2 shadow modulators (with
  shadow disclaimer) + LL.4 priors (qualitative tier) + date-precision global
  modifier. First shadow write at M4-C-S1. Output:
  `06_LEARNING_LAYER/RANKER_WEIGHTS/shadow/ll5_ranker_weights_v1_0.json`
  `[PENDING-S1 — confirm path on actual S1 first write]`.
- **LL.6 — Plan selection learning.** Per `MACRO_PLAN §LL-Appendix.B LL.6` +
  `PHASE_M4C_PLAN §3.2`. Compute per-(query_type × chart_context_class) shadow
  weights for plan classes per Discovery Engine inventory at M4-B close. First
  shadow write at M4-C-S2. Output:
  `06_LEARNING_LAYER/PLAN_SELECTION/shadow/ll6_plan_selectors_v1_0.json`
  `[PENDING-S2 — confirm path on actual S2 first write]`.
- **LL.7 — Discovery prior shaping (native-only mode).** Per
  `MACRO_PLAN §LL-Appendix.B LL.7` + `PHASE_M4C_PLAN §3.3`. Algorithm path determined
  by NAP.M4.6 Option B (classical-seeded; CDLM-as-base-prior; four-class output:
  `confirmed` / `contradicted` / `unconfirmed` / `novel_candidate`) with the three
  native refinements applied. First artifact write at M4-C-S3. Output:
  `06_LEARNING_LAYER/discovery_priors/native_priors_M4C_v1_0.json` (single artifact;
  no shadow→production split). `[PENDING-S3 — confirm 8 MED-tier sanity-check
  re-found; populate per-class counts per NAP_M4_6_BRIEF v1.1 §6.4]`.

### §1.2 — Sub-phase rounds (S1–S4 + parallel-slot Px sessions)

| Round | Session | Date | Substantive deliverable | Class |
|---|---|---|---|---|
| S1 | M4-C-S1 — `[PENDING-S1 — full session_id at S1 close; e.g., M4-C-S1-LL5-RANKER-SHADOW]` | `[PENDING-S1]` | LL.5 first shadow write + LL.3 §5.1 R.LL3.1/2/3 fix-before-prod addressed + LL5_STABILITY_GATE + LL5_RANKER_DESIGN; mirror MP.1+MP.2 sync (carry-forward F.RT.S6.M.1 from M4-B-S6); Gemini reachability re-check (R.LL1TPA.1) | substantive |
| S2 | M4-C-S2 — `[PENDING-S2 — full session_id at S2 close; e.g., M4-C-S2-LL6-PLAN-SHADOW]` | `[PENDING-S2]` | LL.6 first shadow write + LL6_STABILITY_GATE + LL6_PLAN_SELECTOR_DESIGN | substantive |
| S3 | M4-C-S3 — `[PENDING-S3 — full session_id at S3 close; e.g., M4-C-S3-LL7-DISCOVERY-PRIOR]` | `[PENDING-S3]` | LL.7 first artifact write per NAP.M4.6 Option B + 3 refinements; LL7_DISCOVERY_PRIOR_DESIGN; 8 MED-tier sanity-check re-found verification | substantive |
| P6 | M4-C-P6-S4-PREDRAFT | 2026-05-03 (this session) | This document v1.0 DRAFT — pre-draft skeleton with [PENDING-S*] tokens | governance-aside |
| S4 | M4-C-S4 — `[PENDING-S4 — full session_id at S4 close; e.g., M4-C-S4-CLOSE]` | `[PENDING-S4]` | Sealed this document (v1.0 DRAFT → CLOSED) by resolving every [PENDING-S*] token against actual S1/S2/S3 outcome; conducted IS.8(b)-class sub-phase-close red-team in §7.2 OR standalone REDTEAM_M4C_v1_0.md (decision at S4 brief authoring); CURRENT_STATE bumped to mark M4-C CLOSED + M4-D INCOMING; mirror MP.1+MP.2 propagated if not already current | substantive (close-class) |

Additional parallel-slot sessions (Px) may be added as M4-C progresses; the table
above is updated at S4 sealing per actual round structure.

**M4-C sessions total at close:** `[PENDING-S4 — count substantive + governance-aside
sessions when S4 seals]`. This document (`M4_C_CLOSE_v1_0.md`) is the M4-C sealing
artifact, sealed at S4.

### §1.3 — Out of scope for M4-C (preserved at sub-phase boundary)

- **No L1 mutations.** FORENSIC v8.0 untouched in M4-C. LEL v1.6 from M4-A close
  stands; no LEL bumps in M4-C substantive sessions.
- **No LL.2 per-edge promotion.** Per-edge LL.2 promotion (shadow → production)
  remains future scope. The 9,922 LL.2 edges are read by LL.5/LL.7 from the shadow
  register with shadow-mode disclaimer; per-edge promotion evaluated at LL.2
  promotion time, separate from M4-C sub-phase ordering.
- **No LL.3 adapter weights.** LL.3 in M4-B shipped as a recommendation document
  (LL3_DOMAIN_COHERENCE). Adapter / embedding-space weights are M5+ scope per
  `SHADOW_MODE_PROTOCOL §2 LL.3` row.
- **No LL.4 prompt-weight refits.** LL.4 in M4-B shipped recommendation tiers (no
  weight register). Prompt amendment landing is gated by feature flag, not by
  shadow/production register split.
- **No LL.7 cohort mode.** Cohort-mode LL.7 (cohort ≥ N) is M7+ scope per
  `MACRO_PLAN §LL-Appendix.A`. M4-C activates native-only mode only.
- **No LL.8 Bayesian model updating.** Scaffold at M4 per `MACRO_PLAN §LL-Appendix.A`;
  active from M5.
- **No M4 macro-phase close artifact.** M4 macro-phase close is M4-D scope, not M4-C.
  M4-C closes the sub-phase only; M4-D handles macro-phase close, cross-system
  reconciliation, NAP.M4.7, and the IS.8(b) macro-phase-close red-team.
- **No retrieval or synthesis surface changes.** `platform/**` untouched throughout
  M4-C; the Learning Layer substrate is file-based until M4-D wires it into the live
  pipeline (or defers to M5).

### §1.4 — Close-criteria summary (filled at S4)

`[PENDING-S4]` — sealing path verdict (analogue of M4-B's "sealing path (a) full PASS"
per `M4_B_CLOSE` executive summary). S4 records:
- All M4-C-S1/S2/S3 ACs verified PASS.
- LL.5 SHADOW_ACTIVE / LL.6 SHADOW_ACTIVE / LL.7 NATIVE_ARTIFACT_LIVE.
- IS.8(b)-class sub-phase-close red-team verdict.
- Mirror MP.1/MP.2 propagated to adapted parity reflecting M4-C CLOSED + M4-D incoming.
- M4-D entry-gate cleared per `PHASE_M4_PLAN §3.4`.

---

## §2 — Acceptance criteria ledger

Each row corresponds to one acceptance criterion declared in either
`PHASE_M4_PLAN §3.3` (AC.M4C.1–5 cross-cutting) or in `PHASE_M4C_PLAN §3` (per-
sub-phase AC.M4C.S1.1–S1.5; AC.M4C.S2.1–S2.4; AC.M4C.S3.1–S3.5; AC.M4C.S4.1–S4.5)
or in per-session brief AC tables (AC.S1.x, AC.S2.x, AC.S3.x, AC.S4.x — populated
at S4 against the S1/S2/S3 brief AC schemas as published).

### §2.1 — PHASE_M4_PLAN §3.3 acceptance criteria (cross-cutting)

| AC | Target | Verdict | Discharged at | Notes |
|---|---|---|---|---|
| AC.M4C.1 | LL.5 retrieval-ranking shadow register exists; shadow weights per `SHADOW_MODE_PROTOCOL §3.5` LL.5 row | `[PENDING-S1]` | `[PENDING-S1]` | First shadow write at M4-C-S1 |
| AC.M4C.2 | LL.6 plan-selection shadow register exists; shadow weights per `SHADOW_MODE_PROTOCOL §3.5` LL.6 row | `[PENDING-S2]` | `[PENDING-S2]` | First shadow write at M4-C-S2 |
| AC.M4C.3 | LL.7 native-only discovery prior artifact exists; NAP.M4.6 verdict reflected in artifact frontmatter | `[PENDING-S3]` | `[PENDING-S3]` | NAP.M4.6 Option B + 3 refinements; first artifact write at M4-C-S3 |
| AC.M4C.4 | n=1 validity disclaimer attached to all M4-C calibration outputs (LL.5 shadow / LL.6 shadow / LL.7 artifact) | `[PENDING-S1/S2/S3]` | `[PENDING-S1/S2/S3]` | Per `SHADOW_MODE_PROTOCOL §7` |
| AC.M4C.5 | Held-out calibration validity test recorded (per `00_ARCHITECTURE/EVAL/CALIBRATION_VALIDITY_TEST_M4C_v1_0.md`); kill-switch state recorded | `[PENDING-S4]` | `[PENDING-S4]` | M4-C close-criteria gate; held-out partition sacrosanct verified at S4 red-team |

**Aggregate (PHASE_M4_PLAN §3.3):** `[PENDING-S4 — 5/5 PASS expected if S1/S2/S3
clean]` / `[PENDING]` FAIL. M4-C sealing AC gate `[PENDING-S4]`.

### §2.2 — PHASE_M4C_PLAN §3 per-sub-phase acceptance criteria

#### §2.2.1 — M4-C-S1 (LL.5 Retrieval Ranking) ACs (AC.M4C.S1.1–S1.5)

| AC | Target | Verdict |
|---|---|---|
| AC.M4C.S1.1 | §2 entry gates §2.1 (M4-B closed) + §2.3 (Gemini reachability re-check) + §2.4 (SHADOW_MODE_PROTOCOL §3 unchanged) satisfied at S1 open | `[PENDING-S1]` |
| AC.M4C.S1.2 | LL.3 §5.1 R.LL3.1/R.LL3.2/R.LL3.3 each addressed (status: addressed-in-design \| deferred-to-M4D-pipeline-change \| accepted-as-disclaimer-only) and recorded in LL5_RANKER_DESIGN | `[PENDING-S1]` |
| AC.M4C.S1.3 | `ll5_ranker_weights_v1_0.json` valid JSON; outer metadata matches `SHADOW_MODE_PROTOCOL §6` audit-trail schema | `[PENDING-S1]` |
| AC.M4C.S1.4 | LL5_STABILITY_GATE verdict declared (CONDITIONAL_PASS expected at first write since N=0; promotion blocked until acharya-grade relevance judgements accumulate) | `[PENDING-S1]` |
| AC.M4C.S1.5 | SESSION_LOG entry; CURRENT_STATE updated; mirror MP.1+MP.2 carry-forward decision recorded | `[PENDING-S1]` |

#### §2.2.2 — M4-C-S2 (LL.6 Plan Selection) ACs (AC.M4C.S2.1–S2.4)

| AC | Target | Verdict |
|---|---|---|
| AC.M4C.S2.1 | §2 entry gates §2.1 + §2.3 + §2.4 satisfied at S2 open | `[PENDING-S2]` |
| AC.M4C.S2.2 | `ll6_plan_selectors_v1_0.json` valid JSON; outer metadata matches audit-trail schema | `[PENDING-S2]` |
| AC.M4C.S2.3 | LL6_STABILITY_GATE verdict declared (CONDITIONAL_PASS expected at first write) | `[PENDING-S2]` |
| AC.M4C.S2.4 | SESSION_LOG entry; CURRENT_STATE updated | `[PENDING-S2]` |

#### §2.2.3 — M4-C-S3 (NAP.M4.6 + LL.7) ACs (AC.M4C.S3.1–S3.5)

| AC | Target | Verdict |
|---|---|---|
| AC.M4C.S3.1 | NAP.M4.6 verdict issued; option recorded in LL7 design doc and in artifact frontmatter | `[PENDING-S3 confirmation — NAP.M4.6 verdict APPROVED 2026-05-02 (Option B + 3 refinements); S3 confirms reflection in artifact frontmatter]` |
| AC.M4C.S3.2 | `native_priors_M4C_v1_0.json` valid JSON; `mode` field = `"native_only"` | `[PENDING-S3]` |
| AC.M4C.S3.3 | `SHADOW_MODE_PROTOCOL §7` n=1 validity disclaimer in artifact header | `[PENDING-S3]` |
| AC.M4C.S3.4 | Native sign-off recorded (artifact is itself the native-approved state per §2 LL.7 row); SESSION_LOG entry with native verdict on artifact contents | `[PENDING-S3]` |
| AC.M4C.S3.5 | SESSION_LOG entry; CURRENT_STATE updated; 8 MED-tier LL.2 edges re-found as `confirmed` class entries (sanity-check anchor per NAP.M4.6 refinement (c)) | `[PENDING-S3]` |

#### §2.2.4 — M4-C-S4 (sub-phase close) ACs (AC.M4C.S4.1–S4.5)

| AC | Target | Verdict |
|---|---|---|
| AC.M4C.S4.1 | All M4-C-S1/S2/S3 ACs verified PASS | `[PENDING-S4]` |
| AC.M4C.S4.2 | `M4_C_CLOSE_v1_0.md` authored; status CURRENT (sealed: DRAFT → CLOSED) | `[PENDING-S4]` |
| AC.M4C.S4.3 | IS.8(b)-class sub-phase-close red-team authored; verdict declared (PASS \| PASS_WITH_FINDINGS \| FAIL) | `[PENDING-S4]` |
| AC.M4C.S4.4 | §6 residuals enumerated and tagged for M4-D consumption | `[PENDING-S4]` |
| AC.M4C.S4.5 | CURRENT_STATE flipped to M4-D entry posture; mirror MP.1+MP.2 propagated | `[PENDING-S4]` |

### §2.3 — Per-session brief ACs (S1–S3)

`[PENDING-S1/S2/S3]` — populated at S4 against the S1/S2/S3 brief AC schemas as
published. Each row will mirror the `M4_B_CLOSE §2.2` per-session-brief-AC table
format (session, AC count, verdict).

### §2.4 — S4 close-checklist acceptance criteria (per M4-C-S4 brief, future)

`[PENDING-S4]` — populated at S4 close against the S4 brief AC schema (analogue of
`M4_B_CLOSE §2.4` AC.S6.1–S6.6 schema).

---

## §3 — Deliverables inventory

All files created or modified during M4-C sub-phase, with path, version, commit hash,
and status. Sealed status flag flips at S4.

### §3.1 — Substantive deliverables

| Path | Version | Status | Commit | Session |
|---|---|---|---|---|
| `06_LEARNING_LAYER/RANKER_WEIGHTS/shadow/ll5_ranker_weights_v1_0.json` | `[PENDING-S1]` | `[PENDING-S1]` (CURRENT shadow expected) | `[PENDING-S1]` | M4-C-S1 |
| `06_LEARNING_LAYER/RANKER_WEIGHTS/LL5_RANKER_DESIGN_v1_0.md` | `[PENDING-S1]` | `[PENDING-S1]` | `[PENDING-S1]` | M4-C-S1 |
| `06_LEARNING_LAYER/RANKER_WEIGHTS/LL5_STABILITY_GATE_v1_0.md` | `[PENDING-S1]` | `[PENDING-S1]` (CONDITIONAL_PASS expected at first write) | `[PENDING-S1]` | M4-C-S1 |
| `06_LEARNING_LAYER/PLAN_SELECTION/shadow/ll6_plan_selectors_v1_0.json` | `[PENDING-S2]` | `[PENDING-S2]` (CURRENT shadow expected) | `[PENDING-S2]` | M4-C-S2 |
| `06_LEARNING_LAYER/PLAN_SELECTION/LL6_PLAN_SELECTOR_DESIGN_v1_0.md` | `[PENDING-S2]` | `[PENDING-S2]` | `[PENDING-S2]` | M4-C-S2 |
| `06_LEARNING_LAYER/PLAN_SELECTION/LL6_STABILITY_GATE_v1_0.md` | `[PENDING-S2]` | `[PENDING-S2]` | `[PENDING-S2]` | M4-C-S2 |
| `06_LEARNING_LAYER/discovery_priors/native_priors_M4C_v1_0.json` | `[PENDING-S3]` | `[PENDING-S3]` (CURRENT native-only artifact expected; NAP.M4.6 Option B + 3 refinements reflected in frontmatter) | `[PENDING-S3]` | M4-C-S3 |
| `06_LEARNING_LAYER/discovery_priors/LL7_DISCOVERY_PRIOR_DESIGN_v1_0.md` | `[PENDING-S3]` | `[PENDING-S3]` | `[PENDING-S3]` | M4-C-S3 |
| `00_ARCHITECTURE/EVAL/REDTEAM_M4C_v1_0.md` | `[PENDING-S4 — IF standalone artifact path chosen at S4 brief authoring; OTHERWISE in-document §7.2]` | `[PENDING-S4]` | `[PENDING-S4]` | M4-C-S4 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_C_CLOSE_v1_0.md` | 1.0 | DRAFT (this document; sealed at M4-C-S4 per §1.2 row + §9 v1.0 SEAL changelog entry) | `[PENDING-S4 SEAL commit]`; this DRAFT commit `[PENDING-this-session]` | M4-C-P6-S4-PREDRAFT (DRAFT) + sealed M4-C-S4 |

### §3.2 — Governance-state deliverables (touched by M4-C sessions)

| Path | M4-C mutations | Status |
|---|---|---|
| `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` | `[PENDING-S1]` (S1 entry rotation) → `[PENDING-S2]` (S2) → `[PENDING-S3]` (S3) → `[PENDING-S4]` (S4 — M4-C CLOSED marker); this P6 session: v2.6 → v2.7 (canonical state pointers UNCHANGED per AC.P6.3 hard_constraint; predraft_available field set to M4_C_CLOSE_v1_0.md) | LIVE |
| `00_ARCHITECTURE/SESSION_LOG.md` | Entries appended for M4-C-S1, S2, S3, S4 plus parallel-slot Px sessions (this P6 entry; any future P-class slots) — chronological order | LIVE |
| `00_ARCHITECTURE/CAPABILITY_MANIFEST.json` | `[PENDING-S* — first M4-C session that registers M4-C canonical artifacts; expected at S1 entry per F.RT.S6.M.2 carry-forward (which also requires registering M4_B_CLOSE itself); plus M4_C_CLOSE registration at S4]` | LIVE |
| `.geminirules` (MP.1 mirror) | `[PENDING-S1 — first M4-C substantive session re-runs MP.1 sync per F.RT.S6.M.1 carry-forward; plus updates at S2/S3/S4 as adapted-parity warrants]` | LIVE |
| `.gemini/project_state.md` (MP.2 mirror) | `[PENDING-S1 — first M4-C substantive session re-runs MP.2 sync per F.RT.S6.M.1 carry-forward]` | LIVE |

### §3.3 — Files NOT touched in M4-C (verification of scope discipline)

`[PENDING-S4 — verify at sealing]`. Expected scope discipline (per
`PHASE_M4C_PLAN §1.4` out-of-scope and per-session brief must_not_touch):

- `01_FACTS_LAYER/**` — FORENSIC v8.0 untouched; LEL v1.6 unchanged.
- `025_HOLISTIC_SYNTHESIS/**` — read-only for MSR / CDLM domain reference (LL.7
  Option B reads CDLM as base prior, but does not mutate).
- `platform/**` — Learning Layer substrate is file-based; no retrieval/synthesis
  wiring in M4-C scope (M4-D / M5).
- `platform/migrations/**` — no DB tables added in M4-C.
- `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md`, `MACRO_PLAN_v2_0.md` — frozen.
- `SHADOW_MODE_PROTOCOL_v1_0.md` — not modified in M4-C (NAP.M4.4 APPROVED at M4-A
  close is binding throughout).
- `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/**` — M4-B sealed
  artifacts (LL.1 production register; LL.2 shadow; LL.4 priors JSON); read-only in
  M4-C (consumed by LL.5/LL.7).

---

## §4 — NAP decisions

### §4.1 — Resolved within M4-C substrate

- **NAP.M4.6 — LL.7 discovery prior rubric.** **APPROVED 2026-05-02** at
  `M4-B-P5-M4C-ENTRY-PREP NAP-decisions append` (commit af82d8e). Verdict:
  **Option B — Classical-seeded** with three native refinements applied at S3 first
  write:
  - **(a) Rename `classical_only` → `unconfirmed`.** The four-class output at
    M4-C-S3 becomes: `confirmed` (CDLM edge with empirical co-firings in N≥3
    training events); `contradicted` (CDLM edge with empirical co-firings in
    conflict with classical direction); `unconfirmed` (CDLM edge with no empirical
    support in the 37-event training partition; was `classical_only` in the brief);
    `novel_candidate` (empirical pattern N≥3 absent from CDLM; flagged for native
    review).
  - **(b) Lower discovery threshold N≥5 → N≥3.** The CDLM-as-prior structure
    constrains the empirical-confirmation search to a small classically-defined
    edge space, justifying the lower threshold. Per-S3 calibration may tune higher
    if noise-floor warrants. `SHADOW_MODE_PROTOCOL §3` N≥3 minimum honored.
  - **(c) 8 MED-tier LL.2 edges as sanity-check anchor.** Per native: "The 8
    MED-tier edges LL.2 already found are all confirmed CDLM edges — this option
    would have found them too." S3 algorithm must re-find the 8 MED-tier edges
    (per `LL3_DOMAIN_COHERENCE §4.1`) as `confirmed` class entries. Failure to
    re-find = implementation bug, not a discovery → S3 halts and reports.

  Native rationale (verbatim, recorded in `NAP_M4_6_BRIEF_v1_0.md` v1.1 §6.2):
  > LL.7 starts from the CDLM edge map as a prior. Empirical co-activations either
  > confirm, contradict, or are silent on each CDLM edge. Classical-only edges (no
  > empirical support) are flagged as "unconfirmed." Lowers the discovery threshold
  > because the classical map guides where to look. The 8 MED-tier edges LL.2
  > already found are all confirmed CDLM edges — this option would have found them
  > too.

  Brief status: `NAP_M4_6_BRIEF_v1_0.md` v1.0 PENDING_NATIVE_DECISION → v1.1
  OPTION_B_APPROVED.

  Disposition writeback at S3 first write `[PENDING-S3 confirmation]`:
  - `06_LEARNING_LAYER/discovery_priors/native_priors_M4C_v1_0.json` frontmatter
    carries `nap_m4_6_verdict: "Option B"` + `nap_m4_6_refinements:
    [unconfirmed, threshold_N3, ll2_med_anchor]`.
  - LL7_DISCOVERY_PRIOR_DESIGN cites NAP_M4_6_BRIEF v1.1 §6 verbatim for the
    refinement specifications.

### §4.2 — Resolved at M4-A close (binding throughout M4-C)

- **NAP.M4.4 — Shadow-mode promotion criteria.** APPROVED at
  `M4-A-S2-T3-SHADOW-PROTOCOL` NAP-decisions append (c5877c5, 2026-05-02).
  `SHADOW_MODE_PROTOCOL §3` (a)–(d) + §3.2 validity margin (match_rate ≥ 0.4)
  binding for all M4-B and M4-C weight writes (LL.5, LL.6 in M4-C scope).
  M4-C consumes this approval as the substrate-binding rule throughout S1–S2.

### §4.3 — Cross-referenced (not in M4-C scope)

- **NAP.M4.7 — M4 macro-phase close approval.** Scheduled at M4-D close per
  `PHASE_M4_PLAN §3.4 AC.M4D.4`. **M4-C sub-phase close requires only the internal
  AC gate documented at §2 above; NAP.M4.7 is M4 macro-phase close, not sub-phase
  close.** See §8 below. `[PENDING-S4 — confirm cross-reference text at S4 sealing]`.

### §4.4 — NAP.M4.1 / NAP.M4.2 / NAP.M4.3 / NAP.M4.5

Resolved at M4-A close + M4-B close per `M4_A_CLOSE_v1_0.md §4` and
`M4_B_CLOSE_v1_0.md §4` respectively. Surfaced here for cross-reference completeness:

- **NAP.M4.1** — APPROVED Option B (calibration rubric); M4-B inherited binding rubric.
- **NAP.M4.2** — partial (1 patch + 5 deferred + 5 accept); GAP.M4A.04 patch landed
  at M4-A close (LEL v1.6) and status flipped `partially_closed` at M4-B-P1.
- **NAP.M4.3** — Option Y (JH carry forward); KR.M3A.JH-EXPORT carries to
  HANDOFF_M4_TO_M5 at M4-D close.
- **NAP.M4.5** — APPROVED 30/30 at M4-B-S5; LL.1 production register flag flipped
  true; LL.2 stability gate FULL_PASS cascade.

---

## §5 — Learning Layer status at M4-C close

Per `MACRO_PLAN_v2_0.md §LL-Appendix.A` Learning Layer activation matrix.

### §5.1 — LL.5 — Retrieval ranking learning

- **Status at M4-C close:** `[PENDING-S1 + S4 — expected SHADOW_ACTIVE; promotion
  blocked at first write since N=0 (no acharya-grade relevance judgements
  accumulated yet)]`.
- **Shadow register:** `06_LEARNING_LAYER/RANKER_WEIGHTS/shadow/
  ll5_ranker_weights_v1_0.json` `[PENDING-S1 — confirm path; per-(query_class ×
  ranker_feature) weight records; outer-metadata audit-trail per
  SHADOW_MODE_PROTOCOL §6]`.
- **Promotion register:** Empty at M4-C close. Promotion requires `SHADOW_MODE_PROTOCOL
  §3.5` LL.5 row criteria (N≥3 + variance ≤ 0.3 + two-pass approval + native-no-hold
  + LL.3 stability dependency). Per `PHASE_M4C_PLAN §3.1`, the LL.3-stability
  predicate at M4-C-S1 is "LL.3 §5.1 fix-before-prod recommendations (R.LL3.1,
  R.LL3.2, R.LL3.3) addressed"; adapter-weight refit-stability is M5+ scope per
  `SHADOW_MODE_PROTOCOL §2 LL.3` row.
- **Stability gate:** `LL5_STABILITY_GATE_v1_0.md` `[PENDING-S1 — expected
  CONDITIONAL_PASS at first write]`.
- **LL.3 §5.1 disposition:** `[PENDING-S1 — R.LL3.1/R.LL3.2/R.LL3.3 status:
  addressed-in-design \| deferred-to-M4D-pipeline-change \| accepted-as-disclaimer-
  only — recorded in LL5_RANKER_DESIGN]`.
- **Held-out partition discipline:** `[PENDING-S1 + S4 spot-check — verify zero
  held-out IDs in any LL.5 ranker-feature input]`.
- **n=1 disclaimer:** `[PENDING-S1 — verify present in shadow file header per
  SHADOW_MODE_PROTOCOL §7]`.

### §5.2 — LL.6 — Plan selection learning

- **Status at M4-C close:** `[PENDING-S2 + S4 — expected SHADOW_ACTIVE]`.
- **Shadow register:** `06_LEARNING_LAYER/PLAN_SELECTION/shadow/
  ll6_plan_selectors_v1_0.json` `[PENDING-S2 — per-(query_type × chart_context_class)
  weight records]`.
- **Promotion register:** Empty at M4-C close. Promotion requires `SHADOW_MODE_PROTOCOL
  §3.5` LL.6 row criteria (N≥3 + variance ≤ 0.3 + two-pass approval + native-no-hold
  + LL.4 stability dependency). LL.4 stability predicate at S2 is "LL.4 priors
  documented and machine-readable JSON view present" — satisfied at M4-B-S5 close.
- **Stability gate:** `LL6_STABILITY_GATE_v1_0.md` `[PENDING-S2 — expected
  CONDITIONAL_PASS at first write]`.
- **Plan-class inventory consumed:** `[PENDING-S2 — per Discovery Engine plan inventory
  at M4-B close; cite path]`.
- **Held-out partition discipline:** `[PENDING-S2 + S4 spot-check — verify zero
  held-out IDs in any LL.6 plan-selector-feature input]`.
- **n=1 disclaimer:** `[PENDING-S2 — verify present in shadow file header]`.

### §5.3 — LL.7 — Discovery prior shaping (native-only mode)

- **Status at M4-C close:** `[PENDING-S3 + S4 — expected NATIVE_ARTIFACT_LIVE]`.
- **Native-only artifact:** `06_LEARNING_LAYER/discovery_priors/native_priors_M4C_v1_0.json`
  `[PENDING-S3 — single artifact; no shadow→production split per SHADOW_MODE_PROTOCOL
  §2 LL.7 row]`.
- **Algorithm:** NAP.M4.6 Option B (classical-seeded; CDLM-as-base-prior; four-class
  output) with the three native refinements applied: (a) `unconfirmed` rename;
  (b) N≥3 threshold; (c) 8 MED-tier LL.2 sanity-check anchor.
- **Expected output shape (per NAP_M4_6_BRIEF v1.1 §6.4):**
  - `confirmed` — 8 minimum (LL.2 MED-tier sanity-check anchor) + additional CDLM
    edges meeting N≥3 in 37-event training partition.
  - `contradicted` — 0–3 (LL3 §3.2 found 0 mismatch flags structurally; may be empty).
  - `unconfirmed` — ~30–60 (CDLM full inventory minus the confirmed subset).
  - `novel_candidate` — ~5–15 (intra-clique non-CDLM patterns at N≥3; empirical
    count higher than the brief's N≥5 estimate).
- **Sanity-check verification:** `[PENDING-S3 — confirm 8 MED-tier edges per
  LL3_DOMAIN_COHERENCE §4.1 re-found as `confirmed` class entries; if not, S3 halts
  and reports per NAP.M4.6 refinement (c)]`.
- **Native sign-off:** `[PENDING-S3 — recorded in SESSION_LOG entry per
  PHASE_M4C_PLAN §3.3 AC.M4C.S3.4; the artifact's contents themselves are the
  native-approved state since NAP.M4.6 verdict approved the rubric]`.
- **Cohort-mode placeholder:** Out of M4-C scope (M7+ per
  `MACRO_PLAN §LL-Appendix.A`). Artifact frontmatter declares `mode: native_only` so
  it cannot accidentally inherit cohort-derived priors.
- **n=1 disclaimer:** `[PENDING-S3 — verify SHADOW_MODE_PROTOCOL §7 disclaimer
  present in artifact header]`.

### §5.4 — LL.8 — Bayesian model updating (scaffold only)

- **Status at M4-C close:** SCAFFOLD (unchanged from M4-B close). LL.8 active from
  M5 per `MACRO_PLAN §LL-Appendix.A`. M4-C does not write LL.8 weights.

---

## §6 — Known residuals carrying forward to M4-D

These items survive M4-C sub-phase close without silent loss. None gates M4-C close
per §2 above (some gate M4-D entry; flagged where applicable).

### §6.1 — From M4-C substrate (newly surfaced)

`[PENDING-S4 — populate from M4-C-S1/S2/S3 in-session findings]`. Expected
candidates (from `PHASE_M4C_PLAN §5` + carry-forwards):

1. **LL.5 promotion criteria evaluation deferred.** First shadow write at S1 has
   N=0 per-feature; promotion to `RANKER_WEIGHTS/production/` requires acharya-grade
   relevance judgements to accumulate (M5+ or future M4-C extension). `[PENDING-S1
   — confirm at S4 from LL5_STABILITY_GATE verdict]`.
2. **LL.6 promotion criteria evaluation deferred.** Same shape as #1; first shadow
   write at S2 has N=0 per-feature. `[PENDING-S2 — confirm at S4]`.
3. **LL.7 native-only mode promotion convention.** No shadow→production split per
   `SHADOW_MODE_PROTOCOL §2` LL.7 row; native sign-off is the gate. M4-D / M5+
   cohort-mode design will inherit the four-class schema (confirmed/contradicted/
   unconfirmed/novel_candidate) and adapt it for cohort scale. `[PENDING-S3 — confirm
   schema documented in LL7_DISCOVERY_PRIOR_DESIGN at S4]`.
4. **`[PENDING-S1/S2/S3]` — any new red-team-class findings surfaced in IS.8(a)
   cadence-fires within M4-C** (counter trail in §7.1; cadence-fire conditions
   determined by counter at session close).

### §6.2 — Inherited from M4-B (still open at M4-C close)

| # | Residual | Source | Status entering M4-C | Status at M4-C close |
|---|---|---|---|---|
| 1 | KR.M4A.RT.LOW.1 — commit 0793719 malformed root tree (on-disk content correct; cosmetic governance hygiene) | REDTEAM_M4A §6 LOW finding (M4-A inheritance); `M4_B_CLOSE §6.1` item 1 | OPEN — carries forward | `[PENDING-S4 — verify still OPEN; tree-rewrite at native convenience; not blocking M4-D]` |
| 2 | GAP.M4A.04 — travel sparsity, PARTIAL_CLOSE | `LEL_GAP_AUDIT v1.2` (M4-B-P1 partial close per LEL v1.6 patch); `M4_B_CLOSE §6.1` item 5 | DEFERRED — partial close accepted per NAP.M4.2 "no further elicitation required" | `[PENDING-S4 — verify still DEFERRED; no new source data available; carries to M4-D as deferred]` |
| 3 | R.LL1TPA.1 — Gemini reachability re-attempt | `LL1_TWO_PASS_APPROVAL v1.1 §6` (M4-B-S5 NOT_REACHABLE outcome); `M4_B_CLOSE §6.2` item 12 | OPEN — re-attempt obligation at M4-C entry | `[PENDING-S1 — outcome from M4-C-S1 entry Gemini reachability re-check; if REACHABLE, append §5 addendum to LL1_TWO_PASS_APPROVAL per protocol §K.3 ratify/contest; if NOT_REACHABLE, residual carries to M4-D entry as a re-attempt obligation]` |
| 4 | F.RT.S6.M.1 — mirror staleness on M4-B-CLOSED checkpoint | `M4_B_CLOSE §7.2` MEDIUM finding | OPEN — first M4-C substantive session re-runs MP.1+MP.2 sync | `[PENDING-S1 — closed at M4-C-S1 entry MP.1+MP.2 sync per F.RT.S6.M.1 carry-forward; record at S4 sealing]` |
| 5 | F.RT.S6.M.2 — `M4_B_CLOSE_v1_0.md` itself not yet in CAPABILITY_MANIFEST | `M4_B_CLOSE §7.2` LOW finding | OPEN — register at next manifest touch (likely M4-C entry) | `[PENDING-S* — closed at first M4-C session that touches CAPABILITY_MANIFEST.json; expected at S1 entry per the §3.2 governance-state inventory; record closure here at S4 sealing]` |
| 6 | F.RT.S6.N.1 — parallel-session version-coordination convention is ad-hoc | `M4_B_CLOSE §7.2` NOTE finding | OPEN — opportunistic formalization at next quarterly governance pass (2026-07-24 due) | OPEN — STILL CARRIES FORWARD to next quarterly governance pass per `ONGOING_HYGIENE_POLICIES §H`. Not closed in M4-C; not blocking. |
| 7 | F.RT.S6.I.1 — outer-metadata stale-doc-hint on `ll1_weights_promoted` `production_status_field_value` field | `M4_B_CLOSE §7.2` INFO finding | OPEN — opportunistic refresh at next LL.1 production-register touch (M4-C consumer-surface wiring) | `[PENDING-S* — opportunistic close if M4-C touches the LL.1 production register's outer metadata; otherwise carry to M4-D / M5]` |
| 8 | LL.3 §5.1 R.LL3.1/R.LL3.2/R.LL3.3 (fix-before-prod) | `LL3_DOMAIN_COHERENCE §5.1` | OPEN — fix at M4-C-S1 per `PHASE_M4C_PLAN §3.1` | `[PENDING-S1 — disposition (addressed-in-design \| deferred-to-M4D-pipeline-change \| accepted-as-disclaimer-only) recorded in LL5_RANKER_DESIGN; record final status here at S4 sealing]` |
| 9 | LL.4 §5.4 date-precision global modifier | `LL4_PREDICTION_PRIOR §5.4` | INFORMATIONAL — apply at M4-C-S1/S2/S3 | `[PENDING-S1/S2/S3 — confirm applied across all three sub-phases]` |
| 10 | Per-edge LL.2 promotion criteria (gate-level unblocked at M4-B-S5; per-edge execution deferred) | `LL2_STABILITY_GATE v1.1`; `M4_B_CLOSE §6.2` item 13 | OPEN — promotion is post-M4-C scope | `[PENDING-S4 — verify still OPEN; per-edge LL.2 promotion deferred to LL.2 promotion time, separate from M4-C sub-phase ordering]` |

### §6.3 — Defer to M4-D / M5+ (per `PHASE_M4C_PLAN §5.2`)

| Residual | Reason for M4-D / M5+ defer |
|---|---|
| LL.3 §5.2 R.LL3.4 (cross-domain activator extension) | Activator code change is M4-D / M5 scope per LL.3 §5.2 framing |
| LL.3 §5.2 R.LL3.5 (LEL inner-life expansion) | LEL expansion (n=37 → larger) is M5+ scope |
| LL.3 §5.2 R.LL3.6 (Tier-C yoga-absence cluster M5 inspection) | M5 LL.7 discovery-mode scope |
| LL.3 §5.2 R.LL3.7 (CTR/CVG/SIG/RPT/DSH bucket decision) | M4-D cross-system reconciliation scope |

### §6.4 — Inherited from earlier macro-phases (still open at M4-C close)

Items inherited from M3 close + earlier macro-phases that remain open at M4-C
close (carries to M4-D HANDOFF_M4_TO_M5 at M4-D close):

| Residual | Source | Carries to |
|---|---|---|
| KR.M3.RT.LOW.1 (KP TEST-V.4 shape adaptation) | REDTEAM_M3 §6 | HANDOFF_M3_TO_M4 (already handed); M4-D consumes |
| KR.M3A.JH-EXPORT (DIS.009 R3 pending JH D9 export) | DIS.009 | HANDOFF_M4_TO_M5 at M4-D close per NAP.M4.3 Option Y |
| DIS.010/011/012 N3-resolved | DISAGREEMENT_REGISTER | M9 multi-school triangulation |
| External acharya review | M3 close | M4-D records as carry-forward |
| GAP.TRAVEL_MISC.01 — speculative travel events | LEL §6 | M5+ LEL maintenance (no B.10-compliant promotion candidate) |
| R.LL2GATE.1 (LOW) — surrogate ownership for LL2_STABILITY_GATE pass_2 | `M4_B_CLOSE §6.1` item 7 | M4-D / M5 (same ownership pattern as R.LL1TPA.1) |
| R.LL2GATE.2 (DEFERRED) — domain mapping for cross-system signal IDs (M4-D scope) | `M4_B_CLOSE §6.1` item 8 | M4-D cross-system reconciliation |
| R.LL2GATE.3 (LOW) — sparse training partition for edge statistics | `M4_B_CLOSE §6.1` item 9 | Informational; protocol handles via N≥3 floor |
| R.LL2DESIGN.1 (LOW) — LL.2 shadow path co-located with LL.1 | `M4_B_CLOSE §6.1` item 10 | Next M4-class governance pass |
| Domain-stratified LEL training corpus finding | `LL2_EDGE_WEIGHT_DESIGN §3.5+§6.7` | M4-D cross-system reconciliation pass (cross-ref R.LL3.4) |
| Sthana + Drik Shadbala ECR resolution + Narayana Dasha verification | M3-C / DIS.012 | M5+ (JH-access dependency) |
| KR.M3A2.1 — PAT.008 ECR clarification | M3-A2 | M4-class documentation-clarity |
| AC.M3A.5 — post-baseline delta run | DEFERRED per auth wall (BHISMA GAP.P.9) | M4-class with auth-secrets availability |
| KR.W9.1 + KR.W9.2 — eval-runner auth wall + parser quirk | BHISMA GAP.P.9 | M4-class |
| KR.M4A.CLOSE.2 — M4-B-S1 single-track vs B1/B2 split | M4_A_CLOSE §3 item 0 | NAP.M4.5 native acceptance scope; resolved at M4-B-S5 |
| SIG.MSR.207 + SIG.MSR.497/498/499 absent from MSR_v3_0.md | LL3_DOMAIN_COHERENCE §6 | M4-substrate cleaning pass or M5+ MSR expansion |
| UCN inline citation pass (Option A) against UCN_v4_0.md | Aspirational | Not gating |
| TS test-fixture errors in components tests | Portal Redesign R-stream | Non-blocking |

This list MIRRORS `M4_B_CLOSE §6.3` inherited list and adds M4-C-substrate items.
M4-D close artifact (`M4_CLOSE_v1_0.md` at M4-D scope) consolidates the full M4
macro-phase residual roster.

---

## §7 — Red-team summary

### §7.1 — IS.8(a) every-third-substantive-session cadence trail in M4-C

| Counter event | Session | Counter | Notes |
|---|---|---|---|
| Reset entering M4-C | M4-B-S6-CLOSE (2026-05-03) — IS.8(b)-class sub-phase-close discharge | 0 | M4_B_CLOSE §7.2 PASS_WITH_FINDINGS 5/5 axes; 0 CRITICAL/HIGH; counter rotates 1 → 0 per ONGOING_HYGIENE_POLICIES §G discharge-of-cadence-class clause |
| 0 → 1 | M4-C-S1 (substantive) | `[PENDING-S1]` | Substantive learning-layer-substrate (LL.5 first shadow write + LL.3 §5.1 disposition + stability gate + design doc) |
| 1 → 2 | M4-C-S2 (substantive) | `[PENDING-S2]` | Substantive learning-layer-substrate (LL.6 first shadow write + stability gate + design doc) |
| 2 → 3 → FIRES → reset to 0 | M4-C-S3 (substantive) | `[PENDING-S3 — counter at S3 close]` | Substantive learning-layer-substrate (LL.7 first artifact write per NAP.M4.6 Option B + 3 refinements). IS.8(a) every-third cadence-fires at counter=3; expected to fire here unless counter sequence shifts due to governance-aside slots. In-session red-team conducted at S3 close OR deferred to S4 sub-phase-close discharge — decision at S3 brief authoring. |
| 0 (held) | M4-C-Px (governance-aside slots — including this M4-C-P6-S4-PREDRAFT) | 0 | Governance-aside class; do not increment per ONGOING_HYGIENE_POLICIES §G |
| `[PENDING-S4]` | M4-C-S4 (sub-phase close) | `[PENDING-S4]` | IS.8(b)-class M4-C sub-phase-close red-team conducted in-document §7.2 OR standalone REDTEAM_M4C_v1_0.md; counter rotates per discharge-of-cadence-class clause (sub-phase-close cadence treated as analogous to IS.8(b) macro-phase-close with respect to counter-reset behavior — same convention as M4-B-S6-CLOSE) |

`[PENDING-S4 — fill counter trail at M4-C-S4 sealing against actual S1/S2/S3
session counter increments + any in-session red-team discharges]`.

### §7.2 — IS.8(b)-class M4-C sub-phase-close red-team

`[PENDING-S4]` — analogue to `M4_B_CLOSE §7.2`. Per `PHASE_M4C_PLAN §3.4`:

- **Performer**: claude-opus-4-7 (M4-C-S4).
- **Performed**: `[PENDING-S4]`.
- **Decision (in-document vs standalone REDTEAM_M4C_v1_0.md)**: at S4 brief
  authoring. Same considerations as M4-B-S6-CLOSE (in-document acceptable when
  axes are scoped + verifiable from artifacts already-in-place; 0 HIGH/CRITICAL).
- **Scope**: 5 axes (analogue of M4-B-S6 axes adapted to M4-C-substrate):
  - **(a) LL.5 shadow integrity** — verify `ll5_ranker_weights_v1_0.json` outer
    metadata complete; per-feature records have N≥0 honestly recorded; no held-out
    leakage; LL.3 §5.1 disposition recorded.
  - **(b) LL.6 shadow integrity** — verify `ll6_plan_selectors_v1_0.json` outer
    metadata; per-feature records honest; held-out partition sacrosanct.
  - **(c) LL.7 algorithm integrity** — verify Option B + 3 refinements applied
    correctly; 8 MED-tier sanity-check anchor satisfied; four-class schema present;
    n=1 disclaimer present; NAP.M4.6 frontmatter pointers correct.
  - **(d) Surrogate disclosure if applicable** — if Gemini still NOT_REACHABLE at
    M4-C, surrogate-disclosure ledger extended into M4-C with analogous addendum
    to `M4_B_CLOSE §8.2`.
  - **(e) Held-out partition sacrosanct verification** — spot-check 3 of 9 held-out
    records' `partition` field still `held_out` end-to-end across M4-C.
- **Verdict aggregate**: `[PENDING-S4 — PASS \| PASS_WITH_FINDINGS \| FAIL]`.
- **Findings classification**: `[PENDING-S4 — CRITICAL/HIGH/MEDIUM/LOW/NOTE/INFO
  with carry-forward dispositions]`.

`[PENDING-S4 — sub-axis verdicts populated per §7.2.2 through §7.2.6 schema; same
shape as M4_B_CLOSE §7.2.2 through §7.2.6]`.

### §7.3 — Next IS.8(a) every-third cadence

`[PENDING-S4]` — counter trail post-S4 close; next IS.8(a) cadence-fire estimate
(likely first three substantive M4-D sessions). Next IS.8(b) macro-phase-close
cadence fires at M4-D close per `PHASE_M4_PLAN §3.4`. Next §IS.8(c) every-12-months
MACRO_PLAN review remains 2027-04-23 due.

---

## §8 — Approval

### §8.1 — M4-C sub-phase close — internal AC gate, no NAP

M4-C sub-phase close is governed by the internal acceptance-criteria gate documented
at `PHASE_M4_PLAN §3.3` (AC.M4C.1–5) plus `PHASE_M4C_PLAN §3` (per-sub-phase
AC.M4C.S1.1–S4.5) plus the per-session brief ACs (S1–S4). M4-C does **not** require
a native-approval-point (NAP) for sub-phase close — NAP.M4.6 is the binding NAP
within M4-C (LL.7 prior rubric; APPROVED 2026-05-02), and NAP.M4.7 is the M4
macro-phase close NAP at M4-D, not at M4-C.

The close discipline `[PENDING-S4]`:

- **Internal AC gate:** §2 ledger above shows `[PENDING-S4 — expected
  X/X PASS for PHASE_M4_PLAN §3.3 AC.M4C.1–5 + per-sub-phase ACs + per-session
  brief ACs]`. M4-C internal AC gate `[PENDING-S4 — CLEAN \| FINDINGS]`.
- **Sub-phase-close red-team:** §7.2 above `[PENDING-S4 — DISCHARGED in-document
  OR standalone REDTEAM_M4C_v1_0.md per S4 brief authoring; verdict aggregate
  PENDING]`.
- **CURRENT_STATE flip:** S4 (future) flips `active_phase_plan_sub_phase` to
  "M4-C CLOSED `[PENDING-S4 date]`; M4-D incoming"; rotates `last_session_id:
  M4-C-S4 [full session_id PENDING-S4]` + `next_session_objective: M4-D-S1` (or
  per `PHASE_M4_PLAN §3.4`) + `red_team_counter` rotation per discharge-of-cadence-
  class clause + clears `predraft_available` field (this artifact consumed at S4).
- **Mirror sync:** MP.1 + MP.2 propagation `[PENDING-S4 — verify cumulative S3 → S4
  delta propagated to adapted parity reflecting M4-C CLOSED + M4-D incoming;
  decision at S4 brief authoring whether sync happens at S4 close or carries to
  first M4-D session]`.

**No native sign-off is required for M4-C sub-phase close itself**, beyond NAP.M4.6
approval (which was already received 2026-05-02 — Option B + 3 refinements). M4-C
may close as PARTIAL or HOLD if any S1/S2/S3 sub-phase exits PARTIAL or HOLD; the
internal AC gate accommodates partial outcomes via the §2 ledger's PASS / PARTIAL /
PENDING verdict structure.

### §8.2 — Surrogate-disclosure ledger (carry-forward from M4-B)

`[PENDING-S4 — populate from M4-C Gemini reachability outcomes across S1–S3]`.
Carry-forward state from M4-B:

- M4-B pass_1 review path used Claude-surrogate-for-Gemini per
  `LL1_TWO_PASS_APPROVAL §3` (Gemini unavailable synchronously at M4-B-S2).
  Surrogate disclosure recorded in 6 places (per `M4_B_CLOSE §8.2`).
- Gemini reachability check at M4-B-S5 (S5 brief AC.S5.7): NOT_REACHABLE.
  `R.LL1TPA.1` carries forward to M4-C entry (M4-C-S1).
- M4-C re-attempt outcomes `[PENDING-S1/S2/S3]`:
  - **M4-C-S1 entry re-check:** `[PENDING-S1 — REACHABLE \| NOT_REACHABLE \|
    CHECK_DEFERRED]`. If REACHABLE, append addendum to `LL1_TWO_PASS_APPROVAL §5`
    + `LL2_STABILITY_GATE §6.1` per protocol §K.3 (ratify or contest); if contests,
    open `DIS.class.output_conflict` per §K.2.
  - **M4-C-S2/S3 re-checks:** opportunistic; record any new outcome.
- Surrogate-disclosure ledger extension into M4-C `[PENDING-S4 — analogous addendum
  to M4_B_CLOSE §8.2 if Gemini still NOT_REACHABLE; otherwise R.LL1TPA.1 closes]`.

---

## §9 — Changelog

- **v1.0 SEAL (`[PENDING-S4 date]`, M4-C-S4):** `[PENDING-S4 — sealing entry
  appended at S4 close. Document sealed: every `[PENDING-S*]` token replaced with
  verdict text or factual outcome cite; status flipped DRAFT → CLOSED; new fields
  `sealed_by` + `sealed_at`; v1.0 SEAL changelog entry recording the resolution.
  Body changes will be enumerated here per the M4_B_CLOSE §9 v1.0 SEAL precedent.]`

- **v1.0 DRAFT (2026-05-03, M4-C-P6-S4-PREDRAFT, parallel governance slot to S3):**
  Initial pre-draft. Authored as a parallel-slot session running alongside M4-C-S3
  (LL.7 first artifact write per NAP.M4.6 Option B). All S1/S2/S3/S4-dependent
  fields held as literal `[PENDING-S*]` tokens with one-line descriptions of what
  each is waiting for. Sealed at S4 (see v1.0 SEAL entry above when populated).
  - §1 scope: 3 mechanisms (LL.5/LL.6/LL.7 native-only); sub-phase rounds S1–S4
    + Px parallel slots; out-of-scope verification (§1.3); §1.4 close-criteria
    summary [PENDING-S4].
  - §2 acceptance criteria ledger: PHASE_M4_PLAN §3.3 AC.M4C.1–5 [PENDING-S*];
    PHASE_M4C_PLAN §3 per-sub-phase ACs (S1.1–S1.5; S2.1–S2.4; S3.1–S3.5; S4.1–S4.5)
    [PENDING-S*]; per-session brief ACs [PENDING-S*]; S4 close-checklist ACs
    [PENDING-S4].
  - §3 deliverables inventory: 9 expected substantive files + 5 governance-state
    files; structural rows with [PENDING-S*] tokens for path/version/commit/status;
    §3.3 NOT-touched verification at S4.
  - §4 NAP decisions: NAP.M4.6 RESOLVED 2026-05-02 (Option B + 3 refinements —
    fully populated since this is known ground at predraft time, including the
    refinement specifications, verbatim native rationale, and disposition writeback
    plan); NAP.M4.4 binding throughout M4-C; NAP.M4.7 cross-referenced at M4-D scope;
    NAP.M4.1/2/3/5 cross-referenced as resolved at M4-A / M4-B close.
  - §5 LL status: LL.5 [PENDING-S1]; LL.6 [PENDING-S2]; LL.7 [PENDING-S3 — algorithm
    + expected output shape per NAP_M4_6_BRIEF v1.1 §6.4 fully populated since the
    rubric is known]; LL.8 SCAFFOLD unchanged.
  - §6 known residuals: §6.1 M4-C-substrate [PENDING-S4]; §6.2 inherited from M4-B
    (10 items — KR.M4A.RT.LOW.1 OPEN; GAP.M4A.04 PARTIAL_CLOSE deferred; R.LL1TPA.1
    [PENDING-S1]; F.RT.S6.M.1 [PENDING-S1 close]; F.RT.S6.M.2 [PENDING-S* close];
    F.RT.S6.N.1 OPEN-still-carries; F.RT.S6.I.1 [PENDING-S*]; LL.3 §5.1 [PENDING-S1];
    LL.4 §5.4 informational; per-edge LL.2 promotion deferred); §6.3 M4-D / M5+
    deferrals (4 items); §6.4 inherited from earlier macro-phases (17 items, mirror
    of M4_B_CLOSE §6.3 + cross-references).
  - §7 red-team: §7.1 IS.8(a) cadence trail [PENDING-S1/S2/S3]; §7.2 IS.8(b)-class
    M4-C sub-phase-close red-team [PENDING-S4 — author or accept-as-discharged]; §7.3
    cadence forecast [PENDING-S4].
  - §8 approval: M4-C sub-phase close = internal AC gate, no NAP. NAP.M4.7 at M4-D
    macro-phase close. Surrogate-disclosure ledger carry-forward from M4-B
    [PENDING-S1/S2/S3 outcomes].
  - §9 this changelog.

  Authored under brief `M4-C-P6-S4-PREDRAFT`. Sister artifact: `00_ARCHITECTURE/
  PHASE_M4C_PLAN_v1_0.md` v1.0 DRAFT (forward-pointer plan, M4-B-P5). Companion
  artifact: `00_ARCHITECTURE/EVAL/NAP_M4_6_BRIEF_v1_0.md` v1.1 OPTION_B_APPROVED
  (decision brief, M4-B-P5 + native verdict 2026-05-02). Predecessor close artifact:
  `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_B_CLOSE_v1_0.md` (CLOSED 2026-05-03
  at M4-B-S6-CLOSE).

---

*End of M4_C_CLOSE_v1_0.md DRAFT. Sealing happens at M4-C-S4 sub-phase close. S4
reads actual S1/S2/S3 outcomes and replaces every `[PENDING-S*]` token with verdict
text or factual outcome cite; conducts the IS.8(b)-class M4-C sub-phase-close
red-team (§7.2 OR standalone REDTEAM_M4C_v1_0.md per S4 brief authoring); flips
frontmatter `status: DRAFT` → `status: CLOSED`; rotates CURRENT_STATE to mark
M4-C CLOSED + M4-D incoming.*
