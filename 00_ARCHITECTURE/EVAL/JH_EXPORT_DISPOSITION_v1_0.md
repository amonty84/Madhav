---
artifact: 00_ARCHITECTURE/EVAL/JH_EXPORT_DISPOSITION_v1_0.md
version: 1.0
status: AWAITING_NATIVE_DECISION
native_approval_point: AC.M4A.8 (PHASE_M4_PLAN §3.1) — equivalent to NAP.M4.3 (§5)
produced_during: M4-A-S2-T3-SHADOW-PROTOCOL
produced_on: 2026-05-02
covers: KR.M3A.JH-EXPORT disposition (DIS.009 verification decision)
parent_handoff: 00_ARCHITECTURE/HANDOFF_M3_TO_M4_v1_0.md (KR.M3A.JH-EXPORT inherited open item)
related_disagreement: DIS.009 (DISAGREEMENT_REGISTER_v1_0.md §DIS.009)
related_external_dependency: ED.1 (Jagannatha Hora export integration)
---

# JH_EXPORT_DISPOSITION — Native decision on KR.M3A.JH-EXPORT (DIS.009 verification path)

```
STATUS: AWAITING_NATIVE_DECISION.
This document closes AC.M4A.8 once the native fills in §4.
Until then, DIS.009 status remains `resolved-R3 (pending ECR)` per the
M3-W1-A4-DIS009-DISPOSITION close (2026-05-01).
```

---

## §1 — What is at stake

DIS.009 is an `output_conflict` in `DISAGREEMENT_REGISTER_v1_0.md` opened at
`Madhav_M2A_Exec_11` (2026-04-27) over PAT.008 (Saturn D9 Karakamsa + AL Identity
Lock). At M3-W1-A4 (2026-05-01) the native ruled R3 (RE-GROUND): PAT.008 mechanism
text was rewritten in-place to make the two-step Saturn-Mercury identity-axis
architecture explicit (Saturn → disposits Mercury → Mercury rules Karakamsa Gemini,
across the Capricorn-Gemini spine). The AL component (`SIG.MSR.397`) is L1-clean and
active; the D9 Karakamsa component carries `[EXTERNAL_COMPUTATION_REQUIRED]` per
`CLAUDE.md §I B.10` because D9 placements are computed values that the corpus has not
yet verified against an external Jyotish tool.

The specific external computation requested is a **Jagannatha Hora D9 export** for the
native (1984-02-05 10:43 IST Bhubaneswar) confirming two assertions:

1. **Moon D9 = Gemini** — the Karakamsa sign that is the soul-purpose anchor of
   PAT.008. The Saturn-Mercury identity axis depends on this placement: Mercury rules
   Gemini, so Mercury-as-Karakamsa-lord is contingent on Moon's D9 sign being Gemini
   in the first place.
2. **Mercury D1 = Capricorn** (Vargottama, i.e. same sign in D1 and D9). Mercury's D1
   placement is already in `FORENSIC_v8_0` §1; the *Vargottama* claim that Mercury's
   D9 is also Capricorn is the verification surface here. Vargottama dispositorship
   is structurally load-bearing for PAT.008's stability claim and for several
   downstream MSR signals (e.g. `SIG.MSR.018` Mercury Vargottama strength,
   `SIG.MSR.413` Mercury triple-convergence).

**What changes if JH confirms.** PAT.008 status flips `needs_verification` →
`fully_closed`; DIS.009 closes; D9-dependent MSR signals (`SIG.MSR.002, .003, .004,
.006, .009, .016, .018, .035, .050, .056-.061, .067, .068, .136, .208-.212, .413,
.428-.433, .448, .481-.484` — 35 signals total, ~7% of MSR) gain verified D9 inputs;
M4-B calibration weights for those 35 signals are computed against confirmed (rather
than computed-but-not-verified) D9 chart state.

**What changes if JH denies.** PAT.008's two-step architecture loses its empirical
foundation; the rewrite lands as superseded; a new arbitration pass opens (likely R1
withdraw or a re-rewrite based on actual D9 placements); 35 D9-dependent MSR signals
require re-derivation; M4-B calibration weights for those signals would be invalidated
and require re-computation.

**What changes if JH is unavailable.** DIS.009 remains `resolved-R3 (pending ECR)`;
the 35 D9-dependent signals proceed to M4-B calibration under the *currently asserted*
D9 chart state; their match_rates will empirically reveal whether the D9 assumption
is correct (signals that depend on a wrong D9 sign will systematically fail to fire
at events where they're expected, producing match_rate near 0 → shadow-only
indefinitely per `SHADOW_MODE_PROTOCOL_v1_0.md §3.2`); the n=1 validity disclaimer
applies to all outputs regardless. The match_rate filter is a slower, empirical
cross-check, not a substitute for direct verification.

---

## §2 — Decision options

### Option X — Pursue JH verification now (full DIS.009 close path)

**What "operationalised JH access" means.** The Jagannatha Hora desktop tool is
installed (Windows-only software; runs on a Windows VM or Wine on the native's
hardware) AND a workflow exists for: (a) loading the native's birth data, (b)
exporting the D9 chart in a machine-readable or human-verifiable form, (c) recording
the export verbatim in `01_FACTS_LAYER/EXTERNAL_COMPUTATION_LEDGER/` (or analogous
path) with timestamp + JH version + screenshot or text dump as evidence, (d) closing
the loop in `DISAGREEMENT_REGISTER_v1_0.md` DIS.009 with a status update.

**What specifically to run.** Open JH 7.x or later → load birth data
(1984-02-05 10:43 IST Bhubaneswar — coordinates per `FORENSIC_v8_0` §1) → display the
D9 (Navamsa) chart → record (i) Moon's D9 rashi, (ii) Mercury's D9 rashi, (iii)
Saturn's D9 rashi, (iv) all other planets' D9 rashis (for completeness — the 35
D9-dependent signals collectively reference Sun, Moon, Mars, Mercury, Jupiter, Venus,
Saturn, Rahu D9 placements). Save as a screenshot + a structured text record.

**Output file.** `01_FACTS_LAYER/EXTERNAL_COMPUTATION_LEDGER/JH_D9_EXPORT_v1_0.md`
(new artifact; new directory if needed) with frontmatter declaring
`source_tool: jagannatha_hora`, `source_version: <recorded>`, `computation_date`,
`birth_data_used`, and the per-planet D9 rashi table. This becomes an L1-grade
external-computation artifact subject to the same versioning discipline as FORENSIC.

**DIS.009 status updates.** If JH confirms (Moon D9 = Gemini AND Mercury D9 =
Capricorn):
- DIS.009 status: `resolved` → `resolved (fully_closed via JH verification)`.
- PATTERN_REGISTER PAT.008: `needs_verification` → `verified`.
- PAT.008 mechanism text: `[EXTERNAL_COMPUTATION_REQUIRED]` block annotated with
  the JH evidence reference; not removed (audit trail preserved).
- `re_validation_status`: `resolved_pending_ecr` → `resolved_verified`.

If JH denies (either placement is different from asserted):
- DIS.009 reopens at a sub-class `DIS.class.school_disagreement` or a new
  `DIS.class.computation_correction` per `GOVERNANCE_INTEGRITY_PROTOCOL §K.1`.
- A native arbitration pass is required to choose between R1 (withdraw PAT.008), a
  new re-ground based on actual D9 placements, or carry forward with documented
  divergence.
- M4-B calibration weights for the 35 D9-dependent signals are deferred until the
  arbitration concludes.

**Cost estimate.** One M4 session, sequential (cannot parallelize with calibration
work since it gates PAT.008 + 35 signals). If JH access is already operational on
native's hardware: 30-60 minutes execution + 1 hour artifact authoring + DIS.009
update. If JH access requires setup (Windows VM provisioning, software install,
license key resolution): unbounded — the activation itself becomes the work.

### Option Y — Carry forward as needs_verification (deferred-verification path)

**What this means.** No JH session is run in M4. DIS.009 remains `resolved-R3
(pending ECR)`; PAT.008 remains `needs_verification`; the
`[EXTERNAL_COMPUTATION_REQUIRED]` block in PAT.008 stays in place; the 35 D9-dependent
MSR signals proceed to M4-B calibration under the currently asserted D9 chart state.

**Rationale candidates** (to record in §4 if Option Y):
1. JH access is not currently operationalised on the native's hardware; setup cost
   exceeds value within M4's calibration-focused critical path.
2. M4-B match_rate calibration is itself an empirical cross-check on D9 assumptions —
   wrong D9 sign predictions produce low match_rates → shadow-only indefinitely; the
   data filters truth without requiring tool verification.
3. M4 is a calibration phase, not a re-derivation phase; D9 verification is more
   naturally scoped to a M4→M5 transition when JH access is set up alongside the
   broader external-computation infrastructure (Sthana + Drik Shadbala, Narayana
   Dasha — also flagged for JH per `HANDOFF_M3_TO_M4 §JH integration`).

**Next meaningful pursuit window.** M5 open, when (a) JH may be operationalised
alongside the M5 probabilistic-model dependency setup, OR (b) an external acharya
review per `HANDOFF_M3_TO_M4 §Inherited open items` is scheduled. The
`KR.M3A.JH-EXPORT` line item is carried into `HANDOFF_M4_TO_M5` with this rationale
and the next-window recommendation.

**Effect on DIS.009 audit trail.** A new `arbitration_steps_taken` row is added to
DIS.009 recording the M4 carry-forward decision and rationale; the entry remains
`resolved` (per the M3-W1-A4 R3 disposition); the `pending ECR` annotation persists
until JH verification (or equivalent acharya arbitration) is performed in a future
phase.

---

## §3 — Recommendation

**Recommend Option Y (carry forward) — provisionally.**

Three considerations support carry-forward as the M4-default path:

1. **D9-dependent signal coverage is non-trivial but not catastrophic.** A grep of
   `MSR_v3_0.md` for `D9.<entity>` references in `v6_ids_consumed` fields surfaces 35
   distinct signals (`SIG.MSR.002, .003, .004, .006, .009, .016, .018, .035, .050,
   .056, .057, .058, .059, .060, .061, .067, .068, .136, .208, .209, .210, .211, .212,
   .413, .428, .429, .430, .431, .432, .433, .448, .481, .482, .483, .484` — roughly
   7% of the 499-signal MSR). These 35 signals will appear in M4-B calibration; their
   match_rates encode whether the D9 chart state asserted in `FORENSIC_v8_0` is empirically
   consistent with the LEL ground-truth spine. If the D9 chart is wrong, those 35
   signals will systematically underperform on the [0.0, 1.0] match_rate scale,
   landing in the `< 0.4 → shadow-only indefinitely` bucket per
   `SHADOW_MODE_PROTOCOL_v1_0.md §3.2`. The shadow-only outcome is the structural
   defense against propagating an unverified D9 assumption to production weights.

2. **M4's primary work is calibration, not astrological re-derivation.** Operationalising
   JH access is itself a multi-step infrastructure project (Windows VM, install,
   license, export workflow, ledger artifact authoring) that diverts attention from
   the M4-A → M4-D critical path (event-match records → LL.1–LL.7 weights → held-out
   validity test). Per `PHASE_M4_PLAN §3.1` the M4 sub-phases are sequenced for
   calibration delivery; JH integration is flagged in `HANDOFF_M3_TO_M4 §JH integration`
   as an *optional* M4 enhancement, not a critical-path requirement.

3. **The DIS.009 R3 rewrite already encodes "needs_verification" as a stable state.**
   PAT.008's mechanism text is correct under the asserted D9 chart; the
   `[EXTERNAL_COMPUTATION_REQUIRED]` block is the audit handle for future verification
   without blocking present work. The architectural discipline is "verify when
   verification is cost-effective", not "verify before any downstream use."

**When Option X is the right call instead.** Two scenarios flip the recommendation:
- (a) JH access is *already* operationalised on the native's hardware (a one-session,
  low-cost run). In that case the verification is essentially free and removes the
  pending-ECR carry-forward — Option X dominates. The native is the only one who
  knows whether JH is currently runnable in their environment.
- (b) The native has a high prior that the D9 placements are wrong (or has external
  acharya feedback to that effect). In that case running JH now prevents M4-B
  calibrating against the wrong chart and saves a re-run later.

**Default in absence of explicit native input.** Carry forward (Option Y), document
the rationale (one of the three above + JH-not-yet-operational), and target M5 open
as the next pursuit window. This default is consistent with `PHASE_M4_PLAN §5
NAP.M4.3` default ("Carry forward if JH not yet operationalised; document rationale").

---

## §4 — AWAITING NATIVE DECISION

> The native fills in this section. Until then, the document remains
> `AWAITING_NATIVE_DECISION` and AC.M4A.8 is unmet.

```yaml
native_decision: ""              # "Option X — pursue now" | "Option Y — carry forward"
native_rationale: ""             # brief note: why this option, and (if Option Y)
                                 # which of the three rationales in §3 applies plus
                                 # the next pursuit window confirmation
recorded_at: ""                  # ISO date when native records the decision
recorded_in_session: ""          # session ID that captured the decision
recorded_in_session_log_entry: ""  # SESSION_LOG entry ID/anchor referencing this
```

**If Option X is selected:** the next M4-A session must execute the JH verification
before M4-A closes — it becomes the M4-A-S3 (or M4-A-S4) primary deliverable. AC.M4A.8
discharge requires the JH export artifact + DIS.009 status update + PATTERN_REGISTER
PAT.008 status update.

**If Option Y is selected:** DIS.009 status remains `resolved-R3 (pending ECR)`; this
document closes with the §4 block populated; the carry-forward is recorded in
`HANDOFF_M4_TO_M5_v1_0.md §Inherited open items` at M4-D close; AC.M4A.8 discharge is
the documented carry-forward itself (path (b) per AC.M4A.8 phrasing — "native
explicitly defers with rationale recorded in SESSION_LOG").

**Either way:** DIS.009's `arbitration_steps_taken` block in
`DISAGREEMENT_REGISTER_v1_0.md` gains a new row recording this decision, with
`step: native_arbitration`, `result: <Option X | Option Y, with rationale>`,
`timestamp: <recorded_at>`, `session_id: <recorded_in_session>`.

---

## §5 — Changelog

- **v1.0 (2026-05-02, M4-A-S2-T3-SHADOW-PROTOCOL):** Initial authoring; §4
  AWAITING_NATIVE_DECISION block left blank for native to fill. §3 recommendation
  defaults to Option Y based on (a) 35-signal D9 coverage manageable under shadow-mode
  filter, (b) M4 critical path is calibration not re-derivation, (c) DIS.009 R3
  rewrite already encodes a stable needs_verification state. Native may override.

---

*End of JH_EXPORT_DISPOSITION_v1_0.md. Document closes AC.M4A.8 (NAP.M4.3) when §4
is populated by the native.*
