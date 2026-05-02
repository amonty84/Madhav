---
artifact: 00_ARCHITECTURE/PHASE_M4C_PLAN_v1_0.md
canonical_id: PHASE_M4C_PLAN
version: "1.0"
status: DRAFT
authored_by: M4-B-P5-M4C-ENTRY-PREP
authored_on: 2026-05-02
sub_phase: M4-C — Discovery / Retrieval / Plan-Selection Activation (sub-phase of M4 macro-phase)
macro_phase: M4 — Calibration + LEL Ground-Truth Spine
parent_phase_plan: 00_ARCHITECTURE/PHASE_M4_PLAN_v1_0.md (M4-C row)
authoritative_spec: 00_ARCHITECTURE/MACRO_PLAN_v2_0.md §M4 + §LL-Appendix.A + §LL-Appendix.B (LL.5/LL.6/LL.7 rows)
governs: M4-C entry through close — mechanism activation for LL.5 (retrieval ranking), LL.6 (plan selection), LL.7 (discovery prior shaping, native-only mode)
inputs_from_M4B:
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/production/ll1_weights_promoted_v1_0.json (30 promoted; weights_in_production_register=true)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll2_edge_weights_v1_0.json (9,922 edges; LL.2 stability gate FULL_PASS)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/ll4_prediction_priors_v1_0.json (qualitative tier priors)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL3_DOMAIN_COHERENCE_v1_0.md §5 recommendations (R.LL3.1 / R.LL3.2 / R.LL3.3 fix-before-prod; R.LL3.4 / R.LL3.5 / R.LL3.6 / R.LL3.7 investigate-in-M5)
shadow_discipline: SHADOW_MODE_PROTOCOL_v1_0.md §3 (NAP.M4.4 APPROVED 2026-05-02; binding throughout M4-C unchanged)
related_acceptance_criteria_in_PHASE_M4_PLAN: AC.M4C.1, AC.M4C.2, AC.M4C.3, AC.M4C.4, AC.M4C.5
nap_gates:
  - NAP.M4.6 (LL.7 discovery prior rubric — required at M4-C-S3 entry; brief authored at 00_ARCHITECTURE/EVAL/NAP_M4_6_BRIEF_v1_0.md)
  - NAP.M4.7 (M4 macro-phase close — at M4-D, not M4-C)
changelog:
  - v1.0 (2026-05-02, M4-B-P5-M4C-ENTRY-PREP, parallel governance slot): Initial DRAFT.
    Authored alongside (not after) M4-B-S6 (M4-B sub-phase close); the plan is a forward
    pointer for the M4-C entry session. Status remains DRAFT until M4-C-S1 opens and
    confirms the plan against actual M4-B-close state (sealed M4_B_CLOSE_v1_0.md).
    First M4-C-S1 substantive session may flip status DRAFT → CURRENT or amend the plan
    in-place per actual M4-B exit conditions.
---

# PHASE_M4C_PLAN v1.0 — DRAFT

## MARSYS-JIS — M4 sub-phase C execution plan
## Discovery / Retrieval / Plan-Selection Activation (LL.5 + LL.6 + LL.7 native-only)

```
STATUS: 1.0 — DRAFT 2026-05-02 (M4-B-P5-M4C-ENTRY-PREP, parallel governance slot).
This plan is a forward pointer authored before M4-B closes. It does NOT begin
M4-C execution; M4-C-S1 begins only after M4-B-S6 seals M4_B_CLOSE_v1_0.md
(status DRAFT → CURRENT) AND NAP.M4.6 native verdict has been issued (for LL.7
scope at S3; LL.5 and LL.6 at S1/S2 do not gate on NAP.M4.6).

The plan is structural — it defines scope, gates, sub-phase ordering, parallel-
slot opportunities, residuals, and NAP gates. It does NOT design the LL.5/LL.6/
LL.7 computation algorithms; algorithm design is the M4-C-S1/S2/S3 substantive
work itself.
```

---

## §1 — Scope

### §1.1 — Mechanisms in scope

M4-C activates three Learning Layer mechanisms that were `dormant` at M3 and are
slated `active` from M4 per `MACRO_PLAN §LL-Appendix.A`. M4-B activated LL.1–LL.4
(per the M4-B sub-phase plan); M4-C activates LL.5–LL.7 (native-only mode for
LL.7; cohort mode is M7+ scope).

**LL.5 — Retrieval ranking learning.** Per `MACRO_PLAN §LL-Appendix.B LL.5`:
- **Input.** Query-result-relevance judgements (acharya-grade pseudo-clicks);
  ranker features derived from the post-M4-B retrieval pipeline; per-query
  Discovery-Engine outputs.
- **Output.** Ranker weight modulators written to a shadow register at
  `06_LEARNING_LAYER/RANKER_WEIGHTS/shadow/` (path declared in
  `SHADOW_MODE_PROTOCOL §2`). Promotion to `production/` requires §3.5 LL.5
  promotion criteria (N≥3 + variance ≤ 0.3 + two-pass approval + native-no-hold)
  AND LL.3 stability per the dependency declared in `MACRO_PLAN §LL-Appendix.B
  LL.5`. LL.3 in M4-B shipped as a recommendation document
  (`LL3_DOMAIN_COHERENCE_v1_0.md`), not adapter weights — so the LL.3-stability
  predicate at M4-C-S1 is "LL.3 §5 recommendations triaged and fix-before-prod
  recommendations (R.LL3.1, R.LL3.2, R.LL3.3) addressed", not adapter-weight
  refit-stability (which is M5+ scope per `SHADOW_MODE_PROTOCOL §2 LL.3` row).
- **Activation phase.** M4-C — first shadow write at M4-C-S1.

**LL.6 — Plan selection learning.** Per `MACRO_PLAN §LL-Appendix.B LL.6`:
- **Input.** Per-plan outcome records (did the plan produce the expected
  acharya-grade answer?); per-plan Discovery-Engine output traces.
- **Output.** Plan-selector weights at
  `06_LEARNING_LAYER/PLAN_SELECTION/shadow/` (path per
  `SHADOW_MODE_PROTOCOL §2`). Promotion criteria: §3.5 LL.6 + LL.4 stability per
  the dependency declared in `MACRO_PLAN §LL-Appendix.B LL.6`. LL.4 in M4-B
  shipped as a recommendation document (`LL4_PREDICTION_PRIOR_v1_0.md` +
  `ll4_prediction_priors_v1_0.json`), not a prompt-weight register — so the
  LL.4-stability predicate at M4-C-S2 is "LL.4 priors documented and machine-
  readable JSON view present", which is satisfied at M4-B-S5 close.
- **Activation phase.** M4-C — first shadow write at M4-C-S2.

**LL.7 — Discovery prior shaping (native-only mode).** Per `MACRO_PLAN
§LL-Appendix.B LL.7`:
- **Input.** Native-only mode at M4-C: native's own outcome record; classical-
  prior specifications (CDLM cross-domain linkage map; MSR signal categories);
  empirical co-activation patterns from training-partition LEL event-match
  records (37 events).
- **Output.** Single artifact at
  `06_LEARNING_LAYER/discovery_priors/native_priors_M4C_v1_0.json` (path per
  `SHADOW_MODE_PROTOCOL §2`). LL.7 native-only mode has NO shadow→production
  register split — the native is the gate. Every prior modification requires
  explicit native sign-off per `MACRO_PLAN §LL-Appendix.D` ownership rule.
- **Activation phase.** M4-C — first artifact write at M4-C-S3 (after NAP.M4.6
  verdict issued).
- **Cohort mode (M7+ scope).** Out of M4-C scope. The native_priors_M4C
  artifact's frontmatter declares `mode: native_only` so it cannot accidentally
  inherit cohort-derived priors.

### §1.2 — Inputs from M4-B

M4-C consumes four artifacts produced by M4-B:

| Source | Path | Consumer | Use |
|---|---|---|---|
| LL.1 promoted weights | `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/production/ll1_weights_promoted_v1_0.json` | LL.5, LL.6, LL.7 | Per-signal weight inputs to ranker features (LL.5) and plan-selector features (LL.6); seed weights for prior-shaping cross-validation (LL.7). |
| LL.2 edge modulators (shadow) | `.../signal_weights/shadow/ll2_edge_weights_v1_0.json` | LL.5, LL.7 | Edge modulator inputs to retrieval ranker (LL.5); edge-set source for LL.7's pattern-pairs candidates. **Note:** LL.2 still in shadow; per-edge promotion criteria evaluate at LL.2 promotion time (separate from M4-C scope). M4-C reads shadow weights with shadow-mode disclaimer; promotion is NOT M4-C scope. |
| LL.4 prediction priors (qualitative) | `.../signal_weights/ll4_prediction_priors_v1_0.json` + `LL4_PREDICTION_PRIOR_v1_0.md` §5 | LL.5, LL.6, LL.7 | Domain-bucket and signal-class priors used as initial multipliers in retrieval (LL.5); date-precision global modifier applies across all LL.5/LL.6/LL.7 outputs. |
| LL.3 recommendations | `.../LL3_DOMAIN_COHERENCE_v1_0.md` §5 | M4-C-S1 entry | §5.1 fix-before-prod (R.LL3.1, R.LL3.2, R.LL3.3) MUST be addressed before LL.5 first shadow write. §5.2 investigate-in-M5 (R.LL3.4–R.LL3.7) carry forward to M5 / M4-D — out of M4-C scope. |

### §1.3 — Outputs

M4-C produces:

- **Shadow registers.** `06_LEARNING_LAYER/RANKER_WEIGHTS/shadow/` (LL.5);
  `06_LEARNING_LAYER/PLAN_SELECTION/shadow/` (LL.6). Path-creation discipline
  per `SHADOW_MODE_PROTOCOL §2`: directories are created at the first weight
  write of the relevant sub-phase (M4-C-S1 for LL.5; M4-C-S2 for LL.6). The
  protocol document does NOT pre-build the registers; this plan does NOT
  pre-build the registers.
- **LL.7 native-only artifact.**
  `06_LEARNING_LAYER/discovery_priors/native_priors_M4C_v1_0.json` — single
  native-approved artifact. Created at M4-C-S3 first write, after NAP.M4.6
  verdict.
- **Sub-phase close artifact.** `06_LEARNING_LAYER/M4_C_CLOSE_v1_0.md`
  (analogue to `M4_B_CLOSE_v1_0.md`). Authored at M4-C-S4 close. Sub-phase
  close is internal AC gate, no NAP — same convention as M4-B sub-phase close
  (M4-B-S6 owns).
- **Red-team artifact.** `00_ARCHITECTURE/EVAL/REDTEAM_M4C_v1_0.md` if the
  red-team cadence or sub-phase-close convention requires one (see §3.4 for
  cadence reasoning).

### §1.4 — Out-of-scope

M4-C does NOT perform any of the following — these are explicit out-of-scope
items so M4-C does not silently absorb adjacent work:

- **LL.2 per-edge promotion.** Per-edge LL.2 promotion (shadow → production)
  remains future scope. The 9,922 LL.2 edges are read by LL.5/LL.7 from the
  shadow register with shadow-mode disclaimer attached; per-edge promotion is
  evaluated at LL.2 promotion time, separate from M4-C sub-phase ordering.
- **LL.3 adapter weights.** LL.3 in M4-B shipped as a recommendation document
  (LL3_DOMAIN_COHERENCE). Adapter / embedding-space weights are M5+ scope per
  `SHADOW_MODE_PROTOCOL §2 LL.3` row; M4-C does not write adapter weights.
- **LL.4 prompt-weight refits.** LL.4 in M4-B shipped recommendation tiers (no
  weight register). Prompt amendment landing is gated by feature flag, not by
  shadow/production register split, per `SHADOW_MODE_PROTOCOL §2 LL.4` row.
  M4-C does not refit prompt weights.
- **LL.7 cohort mode.** Cohort-mode LL.7 (with cohort ≥ N) is M7+ scope per
  `MACRO_PLAN §LL-Appendix.A`. M4-C activates native-only mode only.
- **LL.8 Bayesian model updating.** Scaffold at M4 per
  `MACRO_PLAN §LL-Appendix.A`; active from M5. M4-C does not activate LL.8.
- **M4 macro-phase close artifact.** M4 macro-phase close is M4-D scope, not
  M4-C. M4-C closes the sub-phase only; M4-D handles macro-phase close,
  cross-system reconciliation, NAP.M4.7, and the IS.8(b) macro-phase-close
  red-team.

---

## §2 — Entry gates

M4-C-S1 (the first M4-C session) does not open until ALL of the following are
satisfied:

### §2.1 — M4-B formally closed

`06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_B_CLOSE_v1_0.md` frontmatter
flipped DRAFT → CURRENT by M4-B-S6. Close artifact records:
- All AC.M4B.1–10 verdicts (per the M4-B-P4 pre-draft, expected 9 PASS plus 1
  PASS-with-PENDING-S5-resolution; S6 resolves the PENDING tokens against
  actual S5 outcome).
- M4-B-S6's own red-team verdict (sub-phase-close analogue of IS.8(b) at
  sub-phase granularity per M4-B-S5 brief AC.S5.9).
- M4-B residuals carrying to M4-C (see §5 below).

If `M4_B_CLOSE_v1_0.md` is still DRAFT at the moment a session attempts to
open M4-C-S1, that session halts and reports to the native — M4-C does not
open from a DRAFT predecessor close.

### §2.2 — NAP.M4.6 issued (LL.7 sub-phase only — not LL.5/LL.6)

NAP.M4.6 native approval is required at M4-C-S3 entry (LL.7 scope). M4-C-S1
(LL.5) and M4-C-S2 (LL.6) do NOT gate on NAP.M4.6 — those sub-phases proceed
as soon as §2.1 + §2.3 + §2.4 are satisfied.

NAP.M4.6 brief is at `00_ARCHITECTURE/EVAL/NAP_M4_6_BRIEF_v1_0.md` (authored
parallel to this plan in M4-B-P5-M4C-ENTRY-PREP). Native verdict is one of:
Option A (pure empirical), Option B (classical-seeded), Option C (discovery-
first). Verdict recorded in SESSION_LOG NAP-decisions append entry; the LL.7
sub-phase implements the chosen option's algorithm at S3 first write.

If NAP.M4.6 is still pending at the moment a session attempts to open M4-C-S3,
that session either (a) defers S3 and proceeds with parallel-safe slots if any
remain, or (b) halts and reports to the native.

### §2.3 — Gemini reachability re-check

Per the M4-B-S5 carry-forward residual R.LL1TPA.1 (Gemini NOT_REACHABLE at
M4-B-S5 close): the M4-C entry session re-checks Gemini reachability. Outcome
is recorded in SESSION_LOG. If Gemini is reachable at M4-C entry, two-pass
approval per `MACRO_PLAN §LL-Appendix.D` ownership rule resumes (Claude
scaffolds; Gemini red-teams every third session and at every macro-phase
close). If still NOT_REACHABLE, the surrogate-approval convention used in M4-B
(Claude-as-Gemini-surrogate, audit-disclosed in `LL1_TWO_PASS_APPROVAL_v1_0.md
§5.5`) extends into M4-C with an analogous disclosure block in each M4-C
substrate artifact's audit trail.

The re-check is a 1-line entry in SESSION_LOG (`gemini_reachability_check:
REACHABLE | NOT_REACHABLE | CHECK_DEFERRED`); it is not a separate sub-phase.

### §2.4 — SHADOW_MODE_PROTOCOL §3 unchanged

`SHADOW_MODE_PROTOCOL_v1_0.md §3` (NAP.M4.4 APPROVED 2026-05-02) remains the
governing promotion-criteria spec. M4-C does NOT amend §3. Per-mechanism
additions for LL.5/LL.6 (LL.3-stability dependency for LL.5; LL.4-stability
dependency for LL.6) are already declared in `§3.5 LL.2, LL.5, LL.6 promotion
criteria`. LL.7 native-only mode promotion is governed by `§3.5 LL.7 (native-
only mode) has no shadow-promotion split; native sign-off is the gate per §2`.

If a substantive deviation from §3 is required (e.g., a per-mechanism
override of N≥3 to a higher threshold), that requires a NAP — not an M4-C
session decision. M4-C operates within the §3 envelope as approved.

---

## §3 — Sub-phase plan

M4-C decomposes into four sequential-with-parallel-slot-opportunities sub-phases.

### §3.1 — M4-C-S1: LL.5 Retrieval Ranking — first shadow write

**Scope.**
- Address LL.3 §5.1 fix-before-prod recommendations (R.LL3.1, R.LL3.2, R.LL3.3
  — see LL3_DOMAIN_COHERENCE §5.1) before any LL.5 weight write. These
  affect retrieval pipeline structure: per-domain N + n=0 disclaimer (R.LL3.1);
  Pancha-Mahapurusha cluster-aware consumption rule (R.LL3.2); MSR-without-LL.1-
  weights routing for unobserved buckets (R.LL3.3).
- Define LL.5 ranker feature set: per-signal LL.1 weights (production register);
  per-edge LL.2 modulators (shadow register, shadow-mode disclaimer); LL.4
  domain-bucket priors as initial multipliers; date-precision global modifier
  per LL.4 §5.4.
- First LL.5 shadow write: `06_LEARNING_LAYER/RANKER_WEIGHTS/shadow/
  ll5_ranker_weights_v1_0.json` containing per-(query_class × ranker_feature)
  weight values. N=0 at first write — every weight is shadow-status with
  `n_observations: 0` until acharya-grade relevance judgements accumulate.
- LL.5 stability gate: parallel to LL.2 stability gate (LL2_STABILITY_GATE_v1_0).
  Authored at S1 close as `LL5_STABILITY_GATE_v1_0.md` declaring CONDITIONAL_PASS
  / FULL_PASS verdict and re-evaluation triggers.

**Inputs.** §1.2 sources; LL.3 §5.1 recommendations.

**Outputs.**
- `06_LEARNING_LAYER/RANKER_WEIGHTS/shadow/ll5_ranker_weights_v1_0.json` (NEW)
- `06_LEARNING_LAYER/RANKER_WEIGHTS/LL5_RANKER_DESIGN_v1_0.md` (NEW; sibling of
  LL2_EDGE_WEIGHT_DESIGN_v1_0.md)
- `06_LEARNING_LAYER/RANKER_WEIGHTS/LL5_STABILITY_GATE_v1_0.md` (NEW)
- LL.3 §5.1 recommendations addressed (in LL.5 design doc OR in retrieval
  pipeline code — TBD at S1 entry; design-doc-only is acceptable if pipeline
  code change is M4-D scope).

**Acceptance criteria.**
- AC.M4C.S1.1: §2 entry gates §2.1 + §2.3 + §2.4 satisfied at S1 open.
- AC.M4C.S1.2: LL.3 §5.1 R.LL3.1/2/3 each addressed (status: addressed-in-design |
  deferred-to-M4D-pipeline-change | accepted-as-disclaimer-only) and recorded in
  LL5_RANKER_DESIGN.
- AC.M4C.S1.3: ll5_ranker_weights_v1_0.json valid JSON; outer metadata matches
  the SHADOW_MODE_PROTOCOL §6 audit-trail schema.
- AC.M4C.S1.4: LL5_STABILITY_GATE verdict declared (CONDITIONAL_PASS expected
  at first write since N=0; promotion blocked until acharya-grade relevance
  judgements accumulate).
- AC.M4C.S1.5: SESSION_LOG entry; CURRENT_STATE updated; mirror MP.1+MP.2 carry-
  forward decision recorded.

**Out-of-scope.** LL.6 work; LL.7 work; pipeline code changes (M4-D); ranker
training (LL.5 promotion is post-M4-C scope until N accumulates).

**Estimated effort.** 1 substantive session.

### §3.2 — M4-C-S2: LL.6 Plan Selection — first shadow write

**Scope.**
- Define LL.6 plan-selector feature set: per-(query_type × chart_context_class)
  features. Plan classes: per Discovery Engine plan inventory at M4-B close
  (TBD; depends on M4-B-S6 sealing of M4_B_CLOSE_v1_0.md §3 deliverables-
  inventory).
- First LL.6 shadow write: `06_LEARNING_LAYER/PLAN_SELECTION/shadow/
  ll6_plan_selectors_v1_0.json`. N=0 at first write per the same convention as
  LL.5.
- LL.6 stability gate authored at S2 close.

**Inputs.** §1.2 sources; M4-B-close plan-inventory subsection; LL.4 priors.

**Outputs.**
- `06_LEARNING_LAYER/PLAN_SELECTION/shadow/ll6_plan_selectors_v1_0.json` (NEW)
- `06_LEARNING_LAYER/PLAN_SELECTION/LL6_PLAN_SELECTOR_DESIGN_v1_0.md` (NEW)
- `06_LEARNING_LAYER/PLAN_SELECTION/LL6_STABILITY_GATE_v1_0.md` (NEW)

**Acceptance criteria.**
- AC.M4C.S2.1: §2 entry gates §2.1 + §2.3 + §2.4 satisfied at S2 open.
- AC.M4C.S2.2: ll6_plan_selectors_v1_0.json valid JSON; outer metadata matches
  the audit-trail schema.
- AC.M4C.S2.3: LL6_STABILITY_GATE verdict declared (CONDITIONAL_PASS expected
  at first write).
- AC.M4C.S2.4: SESSION_LOG entry; CURRENT_STATE updated.

**Out-of-scope.** LL.5 work (S1 owns); LL.7 work (S3 owns); plan-execution
infrastructure (pre-existing in Discovery Engine).

**Estimated effort.** 1 substantive session.

### §3.3 — M4-C-S3: NAP.M4.6 + LL.7 Discovery Prior — first artifact write

**Scope.**
- §2.2 entry gate: NAP.M4.6 verdict ISSUED. LL.7 algorithm path determined by
  the option chosen.
- First LL.7 artifact write:
  `06_LEARNING_LAYER/discovery_priors/native_priors_M4C_v1_0.json`. Algorithm-
  per-NAP.M4.6-option determines what populates the artifact:
  - Option A (pure empirical): co-activation patterns with N≥5 in 37-event
    training partition. Expected output: very thin prior (Pancha-MP clique edges
    dominate; cross-domain edges absent per LL.3 §4 finding).
  - Option B (classical-seeded): CDLM cross-domain linkage map as base prior;
    empirical patterns either confirm/contradict CDLM edges; CDLM edges absent
    from data flagged `classical_only`. LL3 finding (8 MED-tier CDLM edges)
    seeds the empirical-confirmation set.
  - Option C (discovery-first): all co-activation patterns above threshold;
    CDLM consulted post-hoc only.
- LL.7 native-only mode has NO shadow→production split per
  `SHADOW_MODE_PROTOCOL §2 LL.7`. Native sign-off is the gate; first artifact
  write is itself the native-approved state (NAP.M4.6 verdict approved the
  rubric; the artifact's contents are the rubric-applied output, native-
  reviewed at S3 close).

**Inputs.** §1.2 sources; NAP.M4.6 verdict; CDLM (`025_HOLISTIC_SYNTHESIS/
CDLM_v1_1.md`); MSR cross-domain edge inventory (per LL.3 §4 8 MED-tier edges).

**Outputs.**
- `06_LEARNING_LAYER/discovery_priors/native_priors_M4C_v1_0.json` (NEW; mode:
  native_only; algorithm-per-NAP.M4.6-option declared in frontmatter)
- `06_LEARNING_LAYER/discovery_priors/LL7_DISCOVERY_PRIOR_DESIGN_v1_0.md` (NEW)

**Acceptance criteria.**
- AC.M4C.S3.1: NAP.M4.6 verdict issued; option recorded in LL7 design doc and
  in artifact frontmatter.
- AC.M4C.S3.2: native_priors_M4C_v1_0.json valid JSON; mode field = "native_only".
- AC.M4C.S3.3: SHADOW_MODE_PROTOCOL §7 n=1 validity disclaimer in artifact
  header.
- AC.M4C.S3.4: native sign-off recorded (the artifact is itself the native-
  approved state per §2 LL.7 row); SESSION_LOG entry with native verdict on
  the artifact's contents.
- AC.M4C.S3.5: SESSION_LOG entry; CURRENT_STATE updated.

**Out-of-scope.** Cohort-mode LL.7 (M7+); LL.8 Bayesian-update integration
(M5).

**Estimated effort.** 1 substantive session if NAP.M4.6 decision-tree is short
(option-A or option-C); 2 substantive sessions if NAP.M4.6 chooses option-B
(classical-seeded — requires CDLM cross-walk).

### §3.4 — M4-C-S4: M4-C sub-phase close + red-team

**Scope.**
- Author `06_LEARNING_LAYER/M4_C_CLOSE_v1_0.md` (analogue to M4_B_CLOSE_v1_0.md).
  Records:
  - Per-AC.M4C.S1/S2/S3.* verdicts.
  - LL status post M4-C: LL.5 SHADOW_ACTIVE; LL.6 SHADOW_ACTIVE; LL.7
    NATIVE_ARTIFACT_LIVE.
  - Residuals carrying to M4-D (see §5).
- Conduct M4-C sub-phase close red-team. Cadence reasoning:
  - IS.8(a) every-third-session counter status at S4 entry: substantive M4-C
    sessions S1+S2+S3 = 3 increments; if any cadence-fire happens in-session,
    it discharges and resets. If no in-session fire, S4 conducts the cadence
    fire.
  - IS.8(b) sub-phase-close analogue: per M4-B-S5 brief AC.S5.9 (sub-phase
    closes carry the IS.8(b) discipline at sub-phase granularity), S4 conducts
    a sub-phase-close red-team regardless of IS.8(a) cadence state.
  - In practice S4 emits exactly ONE red-team artifact:
    `00_ARCHITECTURE/EVAL/REDTEAM_M4C_v1_0.md`, scoped to the M4-C-substrate
    axes (LL.5 shadow integrity, LL.6 shadow integrity, LL.7 algorithm
    integrity, surrogate disclosure if applicable, held-out partition sacrosanct
    verification).

**Inputs.** All M4-C-S1/S2/S3 deliverables + carry-forward state.

**Outputs.**
- `06_LEARNING_LAYER/M4_C_CLOSE_v1_0.md` (NEW; CURRENT)
- `00_ARCHITECTURE/EVAL/REDTEAM_M4C_v1_0.md` (NEW)
- `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` updated (M4-C → CURRENT closed; M4-D
  → next; M4-C-S4 → last_session_id)
- SESSION_LOG entry

**Acceptance criteria.**
- AC.M4C.S4.1: All M4-C-S1/S2/S3 ACs verified PASS.
- AC.M4C.S4.2: M4_C_CLOSE_v1_0.md authored; status CURRENT.
- AC.M4C.S4.3: REDTEAM_M4C_v1_0.md authored; verdict declared (PASS |
  PASS_WITH_FINDINGS | FAIL).
- AC.M4C.S4.4: §5 residuals enumerated and tagged for M4-D consumption.
- AC.M4C.S4.5: CURRENT_STATE flipped to M4-D entry posture; mirror MP.1+MP.2
  propagated.

**Out-of-scope.** M4 macro-phase close (M4-D scope); IS.8(b) macro-phase-close
red-team (M4-D scope; the M4-C-S4 red-team is the sub-phase-close analogue,
not the macro-phase-close).

**Estimated effort.** 1 substantive session.

---

## §4 — Parallel slot opportunities

The brief explicitly invites identifying which sub-phases can run in parallel.
The four sub-phases above have the following dependencies:

| Sub-phase | Depends on | Parallel-safe with |
|---|---|---|
| S1 (LL.5) | §2 entry gates §2.1 + §2.3 + §2.4 | S2 (LL.6) |
| S2 (LL.6) | §2 entry gates §2.1 + §2.3 + §2.4 | S1 (LL.5) |
| S3 (LL.7) | §2 entry gates §2.1 + §2.3 + §2.4 + §2.2 (NAP.M4.6) | None of S1/S2/S4 if S3 modifies CURRENT_STATE; parallel governance-aside slots OK |
| S4 (close) | All of S1, S2, S3 complete | None — S4 is the close session |

**LL.5 ⊥ LL.6.** S1 and S2 touch disjoint file scopes
(`RANKER_WEIGHTS/**` vs `PLAN_SELECTION/**`). They share the CURRENT_STATE +
SESSION_LOG conflict surface — same convention as M4-B-S3 + M4-B-P1 parallel
sessions: version-coordination by `current+1` rule, last writer's pointers win,
both changelog blocks preserved side-by-side. Recommended **only if** the
native opens both sessions in close succession; otherwise sequential is the
simpler path.

**LL.7 NOT parallel-safe with LL.5/LL.6.** LL.7 reads LL.5/LL.6 design choices
when deciding the algorithm-per-option (Option B classical-seeded reads LL.5
ranker-feature names to ensure CDLM-edge-as-prior plumbs through retrieval).
S3 is therefore sequenced after S1 and S2. Exception: a parallel governance-
aside slot (e.g., a residual-cleanup or red-team-prep slot) may run alongside
S3, the same way M4-B-P1/P2/P3/P4/P5 ran alongside the M4-B substantive slots.
Such a slot must declare disjoint may_touch / must_not_touch in its CLAUDECODE_BRIEF
and follow the parallel_session_notes convention.

**S4 NOT parallel-safe.** The close session reads all S1/S2/S3 outputs and
emits the close artifact + red-team. No parallel slot at S4.

---

## §5 — Known residuals entering M4-C from M4-B

Per the M4-B-P4 pre-draft of `M4_B_CLOSE_v1_0.md` §6, M4-B carries 27 residuals
to M4-C (11 substrate + 2 PENDING-S5 (resolved at S6) + 14 inherited). This
plan enumerates the residuals that bind M4-C entry; the full list is in
M4_B_CLOSE §6 once S6 seals.

### §5.1 — Bind M4-C entry

| Residual | Source | Status entering M4-C | M4-C-S* consumer |
|---|---|---|---|
| KR.M4A.RT.LOW.1 | REDTEAM_M4A v1.0 (commit 0793719 malformed root tree, on-disk content correct) | OPEN — carries forward | Audit at M4-C-S4 close; no algorithmic consumer |
| GAP.M4A.04 PARTIAL_CLOSE | LEL_GAP_AUDIT v1.2 (travel-bucket residual deferred per NAP.M4.2; 2 events dual-tagged at LEL v1.6 patch) | DEFERRED — partial close accepted | Travel-domain LL.5 retrievals carry GAP-disclaimer until M5 LEL expansion |
| R.LL1TPA.1 | LL1_TWO_PASS_APPROVAL_v1.1 §6 (Gemini NOT_REACHABLE at M4-B-S5 close) | OPEN — carries forward to M4-C entry | M4-C-S1 entry gate §2.3 (Gemini reachability re-check) |
| LL.3 §5.1 R.LL3.1/2/3 (fix-before-prod) | LL3_DOMAIN_COHERENCE §5.1 | OPEN — fix at M4-C-S1 | M4-C-S1 design doc + retrieval pipeline notes |
| LL.4 §5.4 date-precision global modifier | LL4_PREDICTION_PRIOR §5.4 | INFORMATIONAL — apply at M4-C-S1/S2/S3 | All three sub-phases |
| Per-edge LL.2 promotion criteria | LL2_EDGE_WEIGHT_DESIGN | OPEN — promotion is post-M4-C | M4-C reads shadow with disclaimer; promotion is post-M4-C |

### §5.2 — Defer to M4-D

These residuals carry forward beyond M4-C entirely:

| Residual | Reason for M4-D defer |
|---|---|
| LL.3 §5.2 R.LL3.4 (cross-domain activator extension) | Activator code change is M4-D / M5 scope per LL.3 §5.2 framing |
| LL.3 §5.2 R.LL3.5 (LEL inner-life expansion) | LEL expansion (n=37 → larger) is M5+ scope |
| LL.3 §5.2 R.LL3.6 (Tier-C yoga-absence cluster M5 inspection) | M5 LL.7 discovery-mode scope |
| LL.3 §5.2 R.LL3.7 (CTR/CVG/SIG/RPT/DSH bucket decision) | M4-D cross-system reconciliation scope |

### §5.3 — Carry-through inherited from earlier macro-phases

Items inherited from M3 close that remain open at M4-C:

| Residual | Source | M4-C action |
|---|---|---|
| KR.M3.RT.LOW.1 (KP TEST-V.4 shape adaptation) | REDTEAM_M3 §6 | None — out of M4-C scope; HANDOFF_M3_TO_M4 owns |
| KR.M3A.JH-EXPORT (DIS.009 R3 pending JH D9 export) | DIS.009 | None — handoff to M4-D / M5 |
| DIS.010/011/012 N3-resolved | DISAGREEMENT_REGISTER | None — M9 multi-school triangulation |
| External acharya review | M3 close | Out of M4 scope; M4-D records as carry-forward |

This list is ABBREVIATED. M4_B_CLOSE §6 is the authoritative inventory once S6
seals; this plan's §5 names only the residuals that BIND M4-C entry.

---

## §6 — NAP gates for M4-C

### §6.1 — NAP.M4.6 — LL.7 Discovery Prior Rubric (required at M4-C-S3 entry)

**What native decides.** Which of three discovery-prior rubrics governs LL.7
native-only mode:
- Option A — Pure empirical (co-activation N≥5, no classical seed)
- Option B — Classical-seeded (CDLM as prior, empirical confirms/contradicts)
- Option C — Discovery-first (all co-activation above threshold, CDLM post-hoc)

**Brief.** `00_ARCHITECTURE/EVAL/NAP_M4_6_BRIEF_v1_0.md` (authored 2026-05-02
in M4-B-P5-M4C-ENTRY-PREP, parallel to this plan).

**Verdict format.** Native replies "Option A", "Option B", or "Option C" with
optional ≤200-character rationale. Verdict recorded in SESSION_LOG NAP-decisions
append entry; LL.7 frontmatter records the chosen option.

**Timing.** Must be issued before M4-C-S3 opens. May be issued at any time
between this plan's authoring (2026-05-02) and S3 open. Native may also issue
at M4-C entry (S1 open) if the native prefers a single decision moment for
all of M4-C.

**Downstream effect.** Determines LL.7 algorithm path (see §3.3 + the brief's
§4).

### §6.2 — NAP.M4.7 — M4 macro-phase close (M4-D scope, NOT M4-C)

NAP.M4.7 is M4-D scope per `PHASE_M4_PLAN_v1_0.md §3.4 AC.M4D.4`. M4-C does NOT
own NAP.M4.7. M4-C-S4 carries forward to M4-D the M4-C-substrate evidence the
M4-D macro-phase close consumes.

### §6.3 — No additional NAPs in M4-C scope

The brief AC.P5.2 §6 names only NAP.M4.6 (within M4-C) + NAP.M4.7 (deferred to
M4-D). No further NAP is anticipated in M4-C. If a substantive deviation from
SHADOW_MODE_PROTOCOL §3 promotion criteria becomes necessary mid-M4-C, that
would require a new NAP — but the design intent is to operate within the §3
envelope as approved.

---

## §7 — Changelog

- **v1.0 DRAFT (2026-05-02, M4-B-P5-M4C-ENTRY-PREP, parallel governance slot):**
  Initial DRAFT of M4-C execution plan. Authored as a forward pointer alongside
  M4-B-S6 (M4-B sub-phase close); not a substantive plan-activation. Plan
  remains DRAFT until M4-C-S1 opens and confirms or amends in-place per the
  actual M4-B exit conditions sealed at S6.
  - §1 Scope (LL.5/LL.6/LL.7 mechanism definitions; M4-B inputs; outputs;
    out-of-scope).
  - §2 Entry gates (M4-B closed; NAP.M4.6 issued for LL.7; Gemini reachability
    re-check; SHADOW_MODE_PROTOCOL §3 unchanged).
  - §3 Sub-phase plan (S1: LL.5; S2: LL.6; S3: NAP.M4.6 + LL.7; S4: close +
    red-team).
  - §4 Parallel-slot opportunities (LL.5 ⊥ LL.6 parallel-safe; LL.7 sequenced
    after; S4 not parallel-safe).
  - §5 Known residuals (KR.M4A.RT.LOW.1; GAP.M4A.04 PARTIAL_CLOSE; R.LL1TPA.1;
    LL.3 fix-before-prod; LL.4 date-precision; per-edge LL.2 deferred; M4-D
    deferrals; M3 carry-throughs).
  - §6 NAP gates (NAP.M4.6 at S3; NAP.M4.7 at M4-D, not M4-C).
  - §7 Changelog (this entry).

  Authored under brief `M4-B-P5-M4C-ENTRY-PREP`.
  Co-authored artifact: `00_ARCHITECTURE/EVAL/NAP_M4_6_BRIEF_v1_0.md`.
  Sister artifact: `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/
  M4_B_CLOSE_v1_0.md` (DRAFT, authored at M4-B-P4-S6-PREDRAFT).

---

*End of PHASE_M4C_PLAN_v1_0.md DRAFT. M4-C execution begins after M4-B-S6
seals M4_B_CLOSE_v1_0.md AND NAP.M4.6 native verdict has been issued (for the
LL.7 sub-phase). The plan's status flips DRAFT → CURRENT at M4-C-S1 open OR
the plan is amended-in-place at S1 open per actual M4-B exit conditions.*
