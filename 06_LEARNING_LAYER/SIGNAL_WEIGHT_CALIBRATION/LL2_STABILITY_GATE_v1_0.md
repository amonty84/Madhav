---
artifact: 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL2_STABILITY_GATE_v1_0.md
version: "1.1"
status: CURRENT
produced_during: M4-B-S3-LL2-EDGE-WEIGHTS
produced_on: 2026-05-02
amended_during: M4-B-S5-NAP-M45-EXECUTE
amended_on: 2026-05-02
mechanism: LL.2 Graph Edge Weight Modulators (gate document — does not contain weights)
phase: M4-B
parent_phase_plan: 00_ARCHITECTURE/PHASE_M4_PLAN_v1_0.md §3.2 AC.M4B.3 (LL.1 stability gate documented in SESSION_LOG before first LL.2 shadow write)
authoritative_protocol: 06_LEARNING_LAYER/SHADOW_MODE_PROTOCOL_v1_0.md §3.5 (LL.2 promotion criteria)
gate_decision: FULL_PASS
gate_decision_summary: "LL.2 shadow writes permitted AND LL.2 production promotion now UNBLOCKED for the 30 LL.1 production signals. Re-evaluated 2026-05-02 after NAP.M4.5 closed 30/30 (100%) approve-all."
re_evaluation_trigger: NAP.M4.5 close event (M4-B close per PHASE_M4_PLAN §3.2) — DISCHARGED 2026-05-02 at M4-B-S5
related_acceptance_criteria: AC.S3.2 (M4-B-S3 brief) + AC.M4B.3 (PHASE_M4_PLAN) + AC.S5.6 (M4-B-S5 brief)
---

# LL.2 STABILITY GATE — pre-shadow-write assessment

```
GATE DECISION: FULL_PASS (re-evaluated 2026-05-02, M4-B-S5-NAP-M45-EXECUTE).
LL.2 shadow-mode writes remain permitted (carried from v1.0).
LL.2 production promotion is now UNBLOCKED for edges whose BOTH endpoints are among
the 30 LL.1 signals promoted to production at NAP.M4.5 (pass_2 approved 30/30 = 100%
≥ 90% threshold from M4-B-S5 brief AC.S5.6).
Per-edge promotion criteria (LL.2.a)–(d) are still evaluated at LL.2 promotion time —
this gate only certifies (LL.2.e) is now satisfied for all 30 LL.1 signals.

PRIOR DECISION (v1.0, recorded 2026-05-02 at M4-B-S3-LL2-EDGE-WEIGHTS):
CONDITIONAL_PASS. Shadow writes permitted; production promotion blocked pending
NAP.M4.5. That trigger has now fired and the gate has flipped per §5 re-evaluation
protocol.
```

---

## §1 — Gate criteria

Per `SHADOW_MODE_PROTOCOL_v1_0.md §3.5`:

> *"For LL.2 edge modulators … the same N≥3 + variance ≤ 0.3 + two-pass approval +
> native-no-hold structure applies, with the following per-mechanism additions:
> **LL.2** also requires its parent LL.1 weights for both endpoint signals to be in
> the production register. An edge modulator cannot promote ahead of its endpoints."*

The "stability gate" this document records is the *predicate* of that promotion rule
unpacked into a decidable check. An LL.2 edge weight (sig_A, sig_B) is promotion-eligible
when **all** of the following hold simultaneously:

- **(LL.2.a)** The edge satisfies §3.1(a) of the protocol — co-activation observed in
  ≥ 3 distinct training-partition LEL events (N_co_observations ≥ 3).
- **(LL.2.b)** The edge's per-event co-activation score variance ≤ 0.3 across those
  N observations (§3.1(b)).
- **(LL.2.c)** Two-pass approval recorded in the edge's `approval_chain` field
  (§3.1(c) — Claude scaffolds; Gemini red-teams; native pass_2 gate).
- **(LL.2.d)** Native notified, no hold (§3.1(d)).
- **(LL.2.e)** *LL.2-specific*: BOTH endpoint signals' LL.1 weights are in the
  **production register**, not merely the shadow register
  (`signal_weights/production/ll1_weights_promoted_v1_0.json`).

The gate this document evaluates is **(LL.2.e)** specifically. The other criteria
((LL.2.a)–(LL.2.d)) are evaluated per-edge at the time of LL.2 promotion (a future
session — not this one). Without (LL.2.e) satisfied, the per-edge criteria are moot:
no LL.2 edge can promote regardless.

The gate also affirms three secondary checks lifted from `SHADOW_MODE_PROTOCOL §4`
kill-switch conditions (necessary preconditions for any shadow write at all):

- **(LL.2.f)** No open `DIS.class.calibration_methodology` entry blocks LL.2 work.
- **(LL.2.g)** No native halt instruction is in force.
- **(LL.2.h)** Held-out partition is sacrosanct — LL.2 edge weights are computed
  from training partition only, identical discipline to LL.1 (Learning-discipline rule
  #4).

---

## §2 — Current LL.1 state (the gate's evaluation target)

State as of 2026-05-02 22:30 IST (close moment of M4-B-S2-MIRROR-TWOPASS, carried into
M4-B-S3-LL2-EDGE-WEIGHTS open).

| Metric | Value | Source |
|---|---|---|
| LL.1 shadow file | `signal_weights/shadow/ll1_shadow_weights_v1_0.json` | M4-B-S1 |
| LL.1 shadow signals total | 380 | shadow file `summary.total_signals_observed` |
| Promotion-eligible after pass_1 | 30 | `summary.promotion_eligible_pending_two_pass` |
| Pass_1 status | COMPLETE — 30 approved / 0 held / 0 demoted | `LL1_TWO_PASS_APPROVAL_v1_0.md §4` |
| Pass_1 reviewer | Claude-surrogate-M4-B-S2 (surrogate-for-Gemini) | LL1_TWO_PASS_APPROVAL §3 |
| Pass_2 status | **PENDING** — NAP.M4.5 at M4-B close | LL1_TWO_PASS_APPROVAL §5 |
| Production register file | `signal_weights/production/ll1_weights_promoted_v1_0.json` | M4-B-S2-MIRROR-TWOPASS |
| Production register status | `production_pending_pass_2` | production file frontmatter |
| `weights_in_production_register` flag | **false** | production file frontmatter |
| Insufficient observations bucket | 285 (N < 3) | shadow `summary.insufficient_observations` |
| Low match-rate bucket (< 0.4) | 52 | shadow `summary.shadow_indefinite_low_match_rate` |
| High variance bucket (> 0.3) | 13 | shadow `summary.shadow_indefinite_high_variance` |
| Open DIS.class.calibration_methodology | **0** (none open) | DISAGREEMENT_REGISTER_v1_0.md |
| Native halt instruction in force | **no** | SESSION_LOG (no halt at M4-B-S2 close) |
| Held-out partition state | sacrosanct (untouched since M4-A-INTEGRATION-PASS-R3) | LL1_TWO_PASS_APPROVAL §3.4 |

**Summary in plain prose.** LL.1 has produced 30 promotion-eligible signal weights
that have completed pass_1 (surrogate-for-Gemini review). Pass_2 is the binding
final gate (NAP.M4.5 — native spot-check at M4-B close), and is pending. The
production register exists as a structural file but its `weights_in_production_register`
flag is false until pass_2 sign-off; downstream pipeline cannot consume these
weights yet. Therefore, **for every signal pair (sig_A, sig_B), the criterion
(LL.2.e) "BOTH endpoints' LL.1 weights in production" is currently false** —
because no LL.1 weight is in production until NAP.M4.5 fires.

---

## §3 — Gate decision

```
GATE DECISION (v1.1, 2026-05-02 M4-B-S5-NAP-M45-EXECUTE): FULL_PASS

LL.2 shadow-mode writes remain permitted.
LL.2 production promotion is UNBLOCKED for edges whose both endpoints are among
the 30 LL.1 signals promoted at NAP.M4.5.

Re-evaluation trigger from v1.0 §5: NAP.M4.5 close — DISCHARGED.
NAP.M4.5 outcome: 30 approved / 0 held / 0 demoted (100% ≥ 90% AC.S5.6 threshold
for FULL_PASS flip).

—————

PRIOR GATE DECISION (v1.0, 2026-05-02 M4-B-S3-LL2-EDGE-WEIGHTS): CONDITIONAL_PASS
(retained for audit trail; superseded by v1.1 above)
```

The decision is "conditional pass," not "pass." The unpacking:

- **Shadow writes ALLOWED.** Shadow mode is precisely the discipline that decouples
  observation from application. Writing LL.2 edge weights to the shadow register
  while LL.1 is in shadow-pending-pass_2 does not violate (LL.2.e) — that criterion
  governs **promotion**, not **observation**. The shadow file produced by this
  session carries `production_eligible: false` for every edge unconditionally,
  regardless of per-edge §3.1(a)–(d) state. This is the structural defense
  `SHADOW_MODE_PROTOCOL §1` calls out: "shadow mode … separates an *observation*
  of a learned parameter from an *application* of that parameter."
- **Promotion BLOCKED.** Until NAP.M4.5 closes and the LL.1 production register's
  `weights_in_production_register` flag flips to true, no LL.2 edge can advance from
  shadow to production. The shadow file itself encodes this: every edge entry
  carries `parent_ll1_endpoints_in_production: false` and
  `promotion_blocked_reason: "LL.1 NAP.M4.5 pending — see LL2_STABILITY_GATE_v1_0.md"`.
- **Subordinate to LL.1 promotion.** Even after NAP.M4.5 closes (assumed PASS),
  only edges whose **both** endpoint signals are among the 30 LL.1 promoted
  signals become promotion-candidates. Edges whose endpoints are in the 285
  insufficient-observation bucket, the 52 low-match-rate bucket, or the 13
  high-variance bucket remain shadow indefinitely (mirrors `SHADOW_MODE_PROTOCOL
  §3.3` for LL.1).
- **Sub-(LL.2.a)–(d) checks deferred.** This gate document does not pre-evaluate
  per-edge N_co_observations or variance. Those are computed in the shadow file
  written this session and re-evaluated per-edge at promotion time. The gate
  evaluates only the LL.1-state precondition (LL.2.e).

---

## §4 — Rationale

### §4.1 — Why allow shadow writes at all?

`PHASE_M4_PLAN_v1_0.md §3.2 AC.M4B.3` requires the LL.1 stability gate to be
"documented in SESSION_LOG **before first LL.2 shadow write**." The criterion is
*documentation*, not *full LL.1 production state*. The protocol distinguishes
shadow writes (observation) from promotion (application); only the latter
requires LL.1 production state. Holding LL.2 shadow writes back until NAP.M4.5
would (a) delay M4-B work without epistemic benefit, (b) leave the M4-B-S3
session with no substantive deliverable, and (c) not actually defend against
any failure mode the protocol cares about — shadow writes are reversible at
zero cost.

### §4.2 — Why the conditional?

The conditional encodes the protocol's actual rule (`§3.5 LL.2: also requires
its parent LL.1 weights for both endpoint signals to be in the production
register`). Without the conditional, this gate would be "pass," which would be
incorrect — the protocol says LL.2 promotion *is* blocked, not unblocked. The
"conditional pass" framing is the precise English translation of the protocol's
actual logic: shadow yes, promotion no.

### §4.3 — Risk surface and how it is bounded

- **Risk: LL.1 pass_2 fails or holds.** If NAP.M4.5 returns `hold` or `revisit`,
  the LL.2 shadow file produced this session is unaffected — it remains shadow,
  carrying its `promotion_blocked_reason` field. The shadow file does not need to
  be reverted; a failed pass_2 simply means the edges remain shadow indefinitely
  until the LL.1 issue is remediated.
- **Risk: LL.1 pass_2 produces partial pass (e.g., 25 of 30 signals approved).**
  Edges whose endpoints fall outside the partial-pass set remain shadow; edges
  whose endpoints are inside the partial-pass set become per-edge-promotion-candidates.
  The shadow file's `parent_ll1_endpoints_in_production` field is re-checked at the
  re-evaluation moment per §5 below.
- **Risk: LL.1 reversal under `SHADOW_MODE_PROTOCOL §5`.** A reversal of any
  LL.1 production weight invalidates LL.2 edges whose endpoints include the
  reverted signal. The reversal protocol per §5 (open DIS entry + native re-approval)
  applies recursively to LL.2.
- **Risk: kill-switch (a)–(e) fires during M4-B-S3 LL.2 shadow write.** The shadow
  write halts mid-session; the partial shadow file is not committed; the kill-switch
  state is recorded in SESSION_LOG.

### §4.4 — n=1 disclaimer carries through

Per `SHADOW_MODE_PROTOCOL §7`, every LL.2 weight (shadow or production) carries the
n=1 validity disclaimer verbatim in its file header. This gate does not lift or
modify the disclaimer; promotion (when it eventually happens for some edges) still
ships under n=1.

### §4.5 — Gate is itself an LL-Appendix.D ownership-rule artifact

`MACRO_PLAN_v2_0.md §LL-Appendix.D` ownership rule: Claude scaffolds; Gemini red-teams
every third session and at every macro-phase close. This gate document is a Claude
scaffold; the Gemini red-team obligation falls due at the next M4-B-S3-counted
red-team trigger (`red_team_counter` advances 1 → 2 at M4-B-S3 close per
`ONGOING_HYGIENE_POLICIES §G` substantive-session rule; next IS.8(a) every-third
cadence at counter = 3).

---

## §5 — Gate re-evaluation trigger

**STATUS (post-v1.1):** The trigger event named below has fired and been discharged.
The gate has been re-evaluated and flipped from CONDITIONAL_PASS → FULL_PASS as of
2026-05-02 M4-B-S5-NAP-M45-EXECUTE. The re-evaluation event log is captured at §5.1
below; the original trigger description (v1.0) is retained verbatim for audit-trail
purposes.

### §5.1 — Re-evaluation event log (v1.1, 2026-05-02)

- **Trigger event:** NAP.M4.5 closed at M4-B-S5-NAP-M45-EXECUTE (this re-evaluating
  session). Native verdict: 30 approved / 0 held / 0 demoted; joint-question verdict
  for SIG.MSR.118/.119/.143 = (a) three independent calibrated phenomena.
- **AC.S5.6 threshold check:** 30 of 30 signals approved = 100%, which exceeds the
  ≥ 27/30 (≥ 90%) threshold for FULL_PASS flip per the M4-B-S5 brief.
- **LL.1 production register state at re-evaluation:**
  `signal_weights/production/ll1_weights_promoted_v1_0.json` outer
  `weights_in_production_register: true`; per-signal `status: production` for all 30;
  per-signal `approval_chain[0].pass_2_status: approved` for all 30.
- **(LL.2.e) verdict:** SATISFIED for any edge (sig_A, sig_B) where both endpoints are
  among the 30 promoted LL.1 signals. UNSATISFIED for edges incident to any of the
  remaining 350 LL.1 signals (those still in shadow buckets: 285 insufficient
  observations + 52 low match-rate + 13 high variance = 350).
- **Per-edge promotion criteria (LL.2.a)–(d) status:** Unchanged by this re-evaluation
  — those are evaluated per-edge at LL.2 promotion time (a future session). This gate
  certifies only that (LL.2.e) no longer blocks the per-edge assessment.
- **Decision:** FULL_PASS (recorded above at §3).
- **Subsequent action this session:** This re-evaluation log lands; no LL.2 weight
  computation or promotion is performed in this session (out of scope per the M4-B-S5
  brief — `must_not_touch` includes
  `signal_weights/shadow/ll2_edge_weights_v1_0.json`). Per-edge LL.2 promotion is
  expected at a future M4-B or M4-C session under the LL.2-specific approval chain.

### §5.2 — Original v1.0 trigger description (retained for audit trail)

The gate re-evaluates **automatically** at the NAP.M4.5 close event. Specifically:

- **Trigger event.** NAP.M4.5 is recorded in `SESSION_LOG.md` as a session entry
  with the native's pass_2 verdict on the 30 LL.1 promotion-eligible signals.
- **Re-evaluation responsibility.** The session that closes NAP.M4.5 (or the
  immediate successor session — typically the M4-B closing session) reads this
  gate document, re-checks (LL.2.e) for the now-updated LL.1 production state,
  and bumps this gate document to v1.1 with the new decision.
- **Possible v1.1 outcomes.**
  - **PASS.** All 30 signals approved at pass_2 → criterion (LL.2.e) becomes
    decidable per-edge. LL.2 promotion candidacy assessed per edge by §1
    criteria (a)–(d). Gate v1.1 records the new state.
  - **PARTIAL_PASS.** Some signals approved, some held — gate v1.1 records the
    set of pass_2-approved signals; LL.2 promotion candidacy restricted to edges
    with both endpoints in the approved set.
  - **HOLD/FAIL.** No signals advance to production. Gate v1.1 records the
    failure; LL.2 shadow file remains in place, all edges retain `promotion_blocked`.
- **Re-evaluation does not require re-computation of LL.2 shadow weights.** The
  edge weights are empirical co-activation frequencies derived from the LEL
  training partition; they do not depend on LL.1 promotion state and do not
  need to be re-derived when NAP.M4.5 closes. Only the gate state changes.

---

## §6 — Approval chain (gate document itself)

```yaml
approval_chain:
  pass_1_role: claude-scaffold
  pass_1_reviewer: Claude (M4-B-S3-LL2-EDGE-WEIGHTS)
  pass_1_date: 2026-05-02
  pass_1_decision: gate-decision-CONDITIONAL_PASS
  pass_1_rationale: see §4 above
  pass_2_role: gemini-red-team
  pass_2_status: pending — falls due at the next IS.8(a) every-third-substantive-session
    cadence (red_team_counter currently 1; advances to 2 at M4-B-S3 close; next
    IS.8(a) trigger at counter=3, ~2 substantive sessions hence). Per
    MACRO_PLAN §LL-Appendix.D ownership rule, this Claude scaffold is a placeholder
    for Gemini's review; if Gemini becomes reachable before the cadence trigger,
    an addendum at §6.1 below ratifies or contests the decision.
  pass_3_role: native-implicit
  pass_3_status: implicit-no-hold (SHADOW_MODE_PROTOCOL §3.1(d) — native notified
    via SESSION_LOG entry for M4-B-S3-LL2-EDGE-WEIGHTS; absence of explicit hold
    instruction is consent under the protocol's standing convention).
```

### §6.1 — Gemini reachability addendum

Status: open. If Gemini becomes reachable before the next IS.8(a) trigger or
before M4-B close, an addendum at this section captures Gemini's verdict and
either ratifies or contests CONDITIONAL_PASS. Per `GOVERNANCE_INTEGRITY_PROTOCOL
§K.3`, a contest opens a `DIS.class.output_conflict` entry; ratification updates
this document's `pass_2_role` block to `addressed`.

---

## §7 — Known residuals

- **R.LL2GATE.1 (LOW) — surrogate ownership for pass_2.** The §6 approval chain
  carries `pass_2_role: gemini-red-team` with `pass_2_status: pending`. This is
  the same ownership pattern as LL1_TWO_PASS_APPROVAL §6 R.LL1TPA.1: Claude
  scaffolds the artifact; Gemini's review falls due per the every-third cadence;
  if Gemini is unreachable, the next-equivalent session may surrogate-review per
  the M4-B-S2 brief precedent. Severity LOW because (a) the gate decision is
  derivable from the protocol text without judgment (CONDITIONAL_PASS is the
  literal output of `SHADOW_MODE_PROTOCOL §3.5`), (b) the conditional binds even
  if Gemini contests CONDITIONAL_PASS upward (e.g., to FULL_PASS), since the
  protocol governs.
- **R.LL2GATE.2 (DEFERRED) — domain mapping for cross-system signal IDs.** The
  LL.2 edge candidate set drawn from LEL `actual_lit_signals` includes 11 of the
  30 LL.1 promotion-eligible signals with `domain: unknown` (per `ll1_shadow_weights_v1_0.json`
  domain field; these are the CTR/CVG/SIG.NN/RPT semantic-class IDs absent from
  `msr_domain_buckets.json`). Per `LL1_TWO_PASS_APPROVAL §6 R.LL1TPA.3`,
  cross-system reconciliation is M4-D scope. Edges incident to unknown-domain
  signals are computed and stored in the shadow file with `domain_a: unknown` or
  `domain_b: unknown` annotation; their cross-domain status is provisional. Severity
  DEFERRED because the LL.1 weights themselves were promotable under this same
  caveat in M4-B-S2.
- **R.LL2GATE.3 (LOW) — sparse training partition for edge statistics.** With
  n=37 training events, edges are statistically thin: edges with co_count = 1 or 2
  may reflect coincidence rather than calibrated joint-firing. The shadow file
  surfaces this via the `confidence_tier` field (LOW for co_count ∈ {1, 2, 3});
  promotion criteria (LL.2.a)–(b) handle it via the N ≥ 3 floor and variance ≤ 0.3
  ceiling. This residual is informational; the protocol already handles it.

No HIGH or CRITICAL residuals.

---

## §8 — Changelog

- **v1.0 (2026-05-02, M4-B-S3-LL2-EDGE-WEIGHTS):** Initial gate document.
  Decision: CONDITIONAL_PASS — LL.2 shadow writes permitted; LL.2 production
  promotion blocked until NAP.M4.5 (LL.1 pass_2) closes. §1 criteria, §2 LL.1
  state at gate time, §3 decision, §4 rationale, §5 re-evaluation trigger
  (NAP.M4.5 close), §6 approval chain, §7 3 known residuals (3 LOW + 1 DEFERRED),
  §8 changelog. Gate next re-evaluates at NAP.M4.5 close.
- **v1.1 (2026-05-02, M4-B-S5-NAP-M45-EXECUTE):** Re-evaluation. NAP.M4.5 closed
  with 30 approved / 0 held / 0 demoted (100% ≥ 90% AC.S5.6 threshold). Decision
  flipped CONDITIONAL_PASS → FULL_PASS. LL.2 production promotion now unblocked for
  edges whose both endpoints are among the 30 promoted LL.1 signals (criterion
  (LL.2.e) satisfied for that subset; edges incident to the remaining 350 shadow
  signals still blocked). Frontmatter `version` 1.0→1.1, `gate_decision`
  CONDITIONAL_PASS→FULL_PASS, `gate_decision_summary` updated, `re_evaluation_trigger`
  appended with DISCHARGED note. New §5.1 records the re-evaluation event log;
  §5.2 retains v1.0 trigger description for audit. §3 decision block flipped with
  prior decision retained as audit trail. No per-edge LL.2 promotion executed this
  session (out of scope per M4-B-S5 `must_not_touch`); per-edge promotion deferred
  to a future M4-B or M4-C session under LL.2 approval chain.

---

*End of LL2_STABILITY_GATE_v1_0.md v1.1. Gate is FULL_PASS as of 2026-05-02; per-edge
LL.2 promotion under LL.2 approval chain at a future session.*
