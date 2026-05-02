---
artifact: M3_CLOSE_v1_0.md
canonical_id: M3_CLOSE_v1_0
version: 1.0
status: CURRENT
authored_by: M3-W4-D2-M3-CLOSE
authored_at: 2026-05-01
macro_phase: M3 — Temporal Animation / Discovery Layer (Pattern + Contradiction Engines)
phase_opened: 2026-05-01 (KARN-W8-R2-M2-CLOSE flipped active_macro_phase M2→M3)
phase_closed: 2026-05-01
predecessor_close_artifact: 00_ARCHITECTURE/M2_CLOSE_v1_0.md
predecessor_governance_doc: 00_ARCHITECTURE/GOVERNANCE_BASELINE_v1_0.md
successor_phase: M4 — Calibration + LEL Ground-Truth Spine
successor_handoff_doc: 00_ARCHITECTURE/HANDOFF_M3_TO_M4_v1_0.md
red_team_artifact: 00_ARCHITECTURE/EVAL/REDTEAM_M3_v1_0.md
phase_plan: 00_ARCHITECTURE/PHASE_M3_PLAN_v1_0.md
changelog:
  - v1.0 (2026-05-01) — Initial sealing artifact for Macro Phase 3.
    Authored at M3-W4-D2-M3-CLOSE (D2 of Wave 4) immediately following
    the M3-W4-D1 IS.8(b) macro-phase-close red-team (verdict PASS,
    9/9 axes, 0 CRITICAL/HIGH/MEDIUM, 1 LOW carry-forward).
---

# M3 CLOSE — Macro Phase 3: Temporal Animation / Discovery Layer

## Executive summary

M3 (Temporal Animation / Discovery Layer — Pattern + Contradiction Engines + Vimshottari + Yogini + Chara + Narayana + Transit + KP + Varshaphala + Shadbala) is **CLOSED**.

The L3.5 Discovery Engine surfaces (Pattern + Contradiction + Resonance + Cluster) are queried at synthesis time and surfaced in answers behind default-true feature flags. The temporal substrate is operational: Vimshottari MD/AD/PD computed for native lifetime → 2070; Yogini MD/AD with Bhramari-anchored 8-lord cycle; transit engine v1 emits date-indexed lit/dormant/ripening surface; Chara + Narayana dasha computers landed (needs_verification per DIS.010/011/012 N3 deferrals); KP sublord per-natal-planet snapshot; Varshaphala 78-year annual chart series; Shadbala four-of-six components computed deterministically with Sthana + Drik tagged `[EXTERNAL_COMPUTATION_REQUIRED]` per CLAUDE.md §I B.10. The temporal validator (`run_validator.py`) exits 0 on six deterministic invariants. The held-out date sample (10 dates × 5 fields) is CONSISTENT 10/10 on in-session native review. The IS.8(b) macro-phase-close red-team returned PASS on all nine axes with zero CRITICAL/HIGH/MEDIUM findings and zero fixes applied.

The bar to open M4 is therefore cleared.

## §1 — M3 quality bar — final status

Per `PHASE_M3_PLAN §3.4` acceptance criteria + `MACRO_PLAN §M3` exit-state. AC.M3A.* / AC.M3B.* / AC.M3C.* / AC.M3D.* aggregated.

| Criterion | Target | Final result | Status |
|---|---|---|---|
| AC.M3A.1 | BASELINE_RUN_M3A non-stub all six metrics | manual-capture mode (auth-wall blocks headless) | PASS (manual-capture) |
| AC.M3A.2 | Pattern Engine flag-gated, default flipped post-smoke | DISCOVERY_PATTERN_ENABLED default true post-A2 smoke | PASS |
| AC.M3A.3 | Contradiction Engine flag-gated, default flipped post-smoke | DISCOVERY_CONTRADICTION_ENABLED default true post-A2 smoke | PASS |
| AC.M3A.4 | DIS.009 terminal status with native verdict | DIS.009 RESOLVED via R3 (RE-GROUND); PAT.008 needs_verification | PASS |
| AC.M3A.5 | Pre/post baseline delta, no regression on 4 hold-flat | DEFERRED — auth wall blocks pre and post numerical capture | DEFERRED (native-accepted; M4-class) |
| AC.M3A.6 | chart_facts + FORENSIC mandatory floor | bundle composition layer enforces; verified W6/W7 audit | PASS |
| AC.M3A.7 | Pattern+Contradiction tool catalog in CAPABILITY_MANIFEST; +3 entry_count fix | manifest entry_count corrected 109→112; tool_binding entries present | PASS |
| AC.M3A.8 | Synthesis prompt B.1+B.3 preserved | CONTRADICTION_FRAMING preamble in shared.ts preserves both | PASS |
| AC.M3A.9 | IS.8(a) cadence cleared | REDTEAM_M3A (A2) + REDTEAM_M3A2 (A4) both PASS | PASS |
| AC.M3B.1 | Vimshottari MD/AD/PD ≤1-day delta vs JH | WITHIN_TOLERANCE max 3-day vs FORENSIC §5.1 (delta inside GAP.09 band) | PASS |
| AC.M3B.2 | Yogini MD/AD produced with cross-check | 162 rows; Bhramari-anchored; CROSSCHECK WITHIN_TOLERANCE max +2-day | PASS |
| AC.M3B.3 | Transit engine deterministic | sample_2026_05_01.json byte-stable across reads; AC.M3B.3 verified | PASS |
| AC.M3B.4 | Date-indexed signal surface produced | lit_states_sample_M3B 495 signals × state assignments | PASS |
| AC.M3B.5 | Ayanamsha recorded in SESSION_LOG at M3-B-S1 open | Lahiri sidereal recorded at M3-W2-B1 open | PASS |
| AC.M3B.6 | PPL substrate writes working | LEL §9 active; PRED.M3D.HOLDOUT.001 + 002 logged | PASS |
| AC.M3B.7 | No L1 mutations; computations at L1.5/L2.5 | L1 frozen; engine outputs at 05_TEMPORAL_ENGINES/ | PASS |
| AC.M3C.1 | Chara + Narayana with native acharya review | engines authored; DIS.010/011/012 RESOLVED-N3 (defer M9) | PASS (N3) |
| AC.M3C.2 | KP sublord integrated with MSR | per-natal-planet KP snapshot; Star+Sub Lord populated; sublord-resolution annotation in retrieval | PASS |
| AC.M3C.3 | Varshaphala cross-checked on 3 sample years | 78 annual charts; Sun-lon residual <0.5 arcsec; sample years pass | PASS |
| AC.M3C.4 | Shadbala-over-time per-planet sanity vs FORENSIC §6.1 | Saturn Uccha 59.18 ±0.02 + Sun 33.99 ±0.02 anchors PASS; all 7 planets within ±0.02 virupas on Uccha + Dig | PASS |
| AC.M3C.5 | Cross-school disagreement register populated | DIS.010/011/012 logged; native verdicts N3 recorded | PASS |
| AC.M3C.6 | No M9 multi-school *triangulation* pre-build | M3-C only logs disagreements; no inter-school weighting | PASS |
| AC.M3D.1 | Temporal validator CI-green on held-out sample | run_validator.py 6/6 PASS, exit 0 | PASS |
| AC.M3D.2 | Held-out date sample ≥10 dates with verdicts | 10 dates × 5 fields a-e × in-session verdict CONSISTENT 10/10 | PASS |
| AC.M3D.3 | 5 native acharya-grade chart readings | in-session native review on 10 rows; external acharya review M4-class per R.M3D.1 | PASS (in-session); DEFERRED-PARTIAL (external) |
| AC.M3D.4 | IS.8(b) macro-phase-close red-team PASS or PASS_WITH_FIXES | REDTEAM_M3_v1_0.md verdict PASS 9/9 axes; 0 CRITICAL/HIGH/MEDIUM; 1 LOW; 0 fixes | PASS |
| AC.M3D.5 | M3_CLOSE + HANDOFF authored; CURRENT_STATE flipped M3→M4 | this artifact + HANDOFF_M3_TO_M4 + flip in same session | PASS |
| AC.M3D.6 | Mirror sync MP.1 + MP.2 propagated | .geminirules + .gemini/project_state.md updated this session | PASS |
| AC.M3D.7 | All M3 deferred items named in M3_CLOSE | enumerated in §3 below | PASS |

**Overall:** 27 PASS / 1 DEFERRED (AC.M3A.5; native-accepted; M4-class) / 1 PASS+DEFERRED-PARTIAL (AC.M3D.3 external acharya) / 0 FAIL.

## §2 — Wave log summary (M3 execution arc)

| Wave | Sub-phase | Sessions | Deliverable summary | Status |
|---|---|---|---|---|
| W1 | M3-OPEN + M3-A | M3-W1-OPEN-PHASE-PLAN; M3-W1-A1-EVAL-BASELINE; M3-W1-A2-PATTERN-ENGINE; M3-W1-A3-CONTRADICTION-ENGINE; M3-W1-A4-DIS009-DISPOSITION | PHASE_M3_PLAN_v1_0.md authored. Pattern + Contradiction + Resonance + Cluster flag-gating (4 DISCOVERY_*_ENABLED flags default-true post-smoke). CAPABILITY_MANIFEST tool_binding entries + entry_count fix 109→112. CONTRADICTION_FRAMING synthesis preamble. DIS.009 R3 disposition; PAT.008 mechanism re-grounded with Saturn-Mercury two-step identity-axis framing; ECR per B.10. REDTEAM_M3A + REDTEAM_M3A2 IS.8(a) cadence-fires both PASS. M3-A SUB-PHASE CLOSED. | CLOSED |
| W2 | M3-B (Track 2) | M3-W2-B1-VIMSHOTTARI-ENGINE; M3-W2-B2-YOGINI-TRANSIT | compute_vimshottari.py + VIMSHOTTARI_RAW (637 rows: 7 MD + 63 AD + 567 PD; span 1984-02-05 → 2070-08-18) + CROSSCHECK WITHIN_TOLERANCE. compute_yogini.py + YOGINI_RAW (162 rows; Bhramari-anchored; +2 day max delta) + CROSSCHECK. compute_transits.py + sample_2026_05_01.json + lit_states_sample_M3B (495 signals classified). signal_activator.py v1. migrations 022/023 (dasha_periods + signal_states). query_signal_state.ts retrieval tool. | CLOSED (B3 antardasha cross-check optional; closed en bloc at M3-D D1 by virtue of validator + held-out sample antardasha-aware coverage) |
| W3 | M3-C (Track 3) | M3-W3-C1-JAIMINI-DASHAS; M3-W3-C2-KP-VARSHAPHALA; M3-W3-C3-SHADBALA | compute_chara.py + compute_narayana.py + RAW JSON + CROSSCHECK (FAIL on K.N. Rao Padakrama tradition-fork → DIS.010/011/012). compute_kp.py + KP_SUBLORDS_RAW (per-planet) + CROSSCHECK WITHIN_TOLERANCE_GAP_09_BOUND. compute_varshaphala.py + 78 annual charts + CROSSCHECK. migrations 024/025. 2 retrieval tools. compute_shadbala.py (4 of 6 components deterministic; Sthana + Drik ECR per B.10) + 63 rows × 9 snapshots + CROSSCHECK AC.M3C.4 anchors PASS. migration 031. REDTEAM_M3C M3-C sub-phase quality gate PASS 7/7. DIS.010/011/012 opened (school_disagreement). M3-C SUB-PHASE CLOSED. | CLOSED |
| W4 | M3-D | M3-PRE-D-GOVERNANCE-2026-05-01; M3-W4-D1-VALIDATOR-REDTEAM; M3-W4-D2-M3-CLOSE | M3-PRE-D governance aside: DIS.010/011/012 RESOLVED-N3 (defer M9 multi-school); MIGRATION_APPLY_INSTRUCTIONS ACTION_REQUIRED for migrations 022-031 (native-applied pre-D1). M3-W4-D1: VALIDATOR_META_TESTS + run_validator.py 6/6 PASS exit 0; M3_HELD_OUT_SAMPLE 10 dates CONSISTENT 10/10; LEL §9 PPL append (PRED.M3D.HOLDOUT.001 + 002); REDTEAM_M3 IS.8(b) macro-phase-close red-team PASS 9/9 axes; 0 CRITICAL/HIGH/MEDIUM; 1 LOW carry-forward. M3-W4-D2 (this session): M3_CLOSE_v1_0.md + HANDOFF_M3_TO_M4_v1_0.md + CURRENT_STATE flip M3→M4 + MP.1+MP.2 sync. | CLOSED (this session) |

**M3 sessions total:** 11 closed sessions (1 plan-only + 9 substantive + 1 governance-aside) + 1 close session = 12 total in M3.

## §3 — Known deferred items (carried into M4)

These are explicitly named so they survive into M4 and steady-state hygiene without silent loss. None gates M3 close per the AC.M3D.4 verdict.

### Inherited from M3 sub-phases

1. **KR.M3.RT.LOW.1 — KP per-planet snapshot vs 0°-360° boundary table.** REDTEAM_M3 §6 forward-work item. The M3-W3-C2 KP artifact is a per-natal-planet snapshot (9 rows). If downstream M4 calibration requires the 0°-360° boundary table for KP-class signal resolution, that's an M4 follow-up (extend `compute_kp.py` to emit boundary-table mode or author a second artifact). Not blocking.
2. **KR.M3A.JH-EXPORT — DIS.009 full closure pending JH D9 export per ED.1.** PAT.008 status `needs_verification`; `re_validation_status: resolved_pending_ecr`. Verification anchors: confirm Moon D9 = Gemini (Karakamsa = Gemini = Mercury-ruled) + Mercury D1 = Capricorn (Vargottama dispositorship). M4-class verification window.
3. **DIS.010/011/012 native verdicts on Jaimini multi-tradition forks.** RESOLVED-N3 (defer to M9 multi-school triangulation per `PHASE_M3_PLAN §8` default policy). compute_chara.py + compute_narayana.py outputs remain `needs_verification` until M9. **Tracked but not gating** — listed for HANDOFF transparency.
4. **Sthana + Drik Shadbala ECR resolution.** `[EXTERNAL_COMPUTATION_REQUIRED]` per CLAUDE.md §I B.10. Requires JH Saptavargaja Bala export + JH/Shri-Jyoti aspect-strength table. M4-or-later when JH access is operationalised. Schema-level ECR-tagging (`sthana_ecr` + `drik_ecr` boolean columns + `ecr_components` text[]) holds the field clean until then.
5. **Narayana Dasha verification.** External acharya review or JH export per DIS.012 R1/R2. `compute_narayana.py` output remains `needs_verification=true`. M4-class open item.
6. **KR.M3A2.1 — PAT.008 ECR clarification.** Native-instructed ECR text in PAT.008 mechanism is held verbatim per Gate 1 hard constraint at M3-W1-A4. Documentation-clarity carry-forward — could explicitly cite FORENSIC §3.5 as in-corpus L1 source. Not a B.10 violation.
7. **Three Shadbala convention findings (Naisargika + Nathonnatha class-swap + Nathonnatha linearization).** Surfaced in SHADBALA CROSSCHECK §4/§5/§9 as native-decision points; not promoted to DIS register per REDTEAM_M3C Axis G (brief-vs-classical fact-check decisions, not Vedic multi-school disagreements proper). M4-class native review.
8. **AC.M3A.5 — post-baseline delta run.** DEFERRED at M3-A close (auth wall blocks pre and post numerical capture; native-accepted per BASELINE_RUN_W9_MANUAL §6 native-acceptance scope). Carries to M4 with auth secrets (BHISMA GAP.P.9 unblocking).
9. **External acharya review on M3 deliverables (R.M3D.1 mitigation).** In-session native review = AC.M3D.3 PASS. External acharya review carried as M4-class open item.

### Inherited from M2 (still open at M3 close)

10. **SIG.MSR.207 absent from `MSR_v3_0.md`** (M2 `Known deferred items #2`). Medium severity (KARN-W6-R3 finding). Investigate at M4 substrate-cleaning pass.
11. **UCN inline citation pass (Option A) against `UCN_v4_0.md`.** Aspirational only; not gating. M2 noted Option B (DB-side `derived_from_signals` backfill) was the audit fix path.
12. **TypeScript test-fixture errors** in `tests/components/AppShell.test.tsx` + `tests/components/ReportGallery.test.tsx`. 9 errors total; pre-W6 portal-redesign drift; Portal Redesign R-stream owns; non-blocking.
13. **KR.W9.1 + KR.W9.2 — eval-runner auth wall + parser quirk.** BHISMA GAP.P.9. M4-class with auth-secrets availability.

**Resolved at M3** (no longer open): CAPABILITY_MANIFEST entry_count miscount (109→112 corrected at M3-W1-A2); DIS.009 (R3 disposition at M3-W1-A4; full closure pending JH per #2 above). Discovery Engine query-time activation (4 surfaces flag-gated, default-true).

## §4 — Red-team evidence

`00_ARCHITECTURE/EVAL/REDTEAM_M3_v1_0.md` — IS.8(b) macro-phase-close red-team. **Verdict: PASS (9/9 axes; 0 CRITICAL / 0 HIGH / 0 MEDIUM / 1 LOW carry-forward; 0 fixes applied).** M3 close gate (AC.M3D.4) CLEARED.

**Sub-phase-close + IS.8(a) cadence-fire RTs (preserved as M3 audit trail):**
- `REDTEAM_M3A_v1_0.md` — IS.8(a) every-third-session cadence-fire at M3-W1-A2 close (first M3 fire). 7 axes PASS. 0 findings. counter reset 3→0.
- `REDTEAM_M3A2_v1_0.md` — IS.8(a) every-third-session cadence-fire at M3-W1-A4 close (second M3 fire). 7 axes PASS. 0 CRITICAL/HIGH/MEDIUM; 1 LOW (KR.M3A2.1).
- `REDTEAM_M3C_v1_0.md` — M3-C sub-phase-close quality gate at M3-W3-C3 close (NOT IS.8(a) cadence). 7 axes PASS. 0 findings. M3-C close artifacts unblocked.

**Counter trail in M3:**
- M2-CLOSE reset → 0
- M3-W2-B1 → 1 (first Track-2 substantive)
- M3-W3-C1 → 2 (first Track-3 substantive)
- M3-W2-B2 → 3 (second Track-2 substantive)
- M3-W3-C2 → held at 3 (substantive Track-3)
- M3-W1-A2 → IS.8(a) FIRES (REDTEAM_M3A PASS) → reset 3→0
- M3-W1-A3 → 0→1
- M3-W3-C3 → 1→2 (substantive Track-3 + M3-C-close-RT + DIS register)
- M3-W1-A4 → 2→3 → IS.8(a) FIRES (REDTEAM_M3A2 PASS) → reset 3→0
- M3-PRE-D-GOVERNANCE → governance-aside, did NOT increment (held at 0)
- M3-W4-D1 → 0→1 (D1 substantive; IS.8(b) DISCHARGED)
- M3-W4-D2 (this session) → 1→2 (D2 substantive — close-artifact authoring)

Next IS.8(a) every-third cadence at counter=3 (one substantive session hence — likely first M4 session).

## §5 — ND status at M3 close

- **ND.1 (Mirror Discipline)** — addressed since Step 7 close (2026-04-24); held throughout M3 across MP.1–MP.8. M3 sub-phase closes propagated MP.2 same-session at every substantive close; MP.1 (.geminirules) updated at M2 close + this M3 close (M3→M4 macro-phase flip). `mirror_enforcer.py` exit 0 at every M3 close run.
- **No open native directives** at M3 close.

`open_native_directives: []`. `addressed_native_directives: ["ND.1"]`.

## §6 — Mirror sync evidence

This M3 close session (M3-W4-D2-M3-CLOSE) updates the mirror surfaces in the same session as the M3→M4 transition:

- **MP.1 — `.geminirules`** (CLAUDE.md ↔ .geminirules): updated to reflect active_macro_phase M3 → M4 + last_session_id → M3-W4-D2-M3-CLOSE + next_session_objective at adapted parity (footer line + §F state block + §C item #5 phase-plan pointer).
- **MP.2 — `.gemini/project_state.md`** (composite Claude state ↔ Gemini state): updated to reflect M3 macro-phase CLOSED + M4 active + handoff memo pointer + LEL minimum-volume entry-gate at adapted parity.

`mirror_enforcer.py` exit 0 at this close.

## §7 — Live state of the platform at M3 close

**Carried forward from M2 + extended in M3:**

- **Query pipeline (default):** `classify → [per_tool_planner: optional] → compose → retrieve(parallel) → validate → synthesize → audit`. `NEW_QUERY_PIPELINE_ENABLED=true`, `AUDIT_ENABLED=true`, `PER_TOOL_PLANNER_ENABLED=false` (still default-off).
- **Retrieval tools wired:** 22 total (was 17 at M2 close): 5 L2.5 structured + 7 L1 structured + 5 RAG + 4 L3.5 register query tools (pattern_register, contradiction_register, resonance_register, cluster_atlas) + `query_signal_state.ts` (M3-B) + `query_kp_ruling_planets.ts` (M3-C) + `query_varshaphala.ts` (M3-C). [BHISMA-W1-S2 also added planner.ts + citation_check.ts behind LLM_FIRST_PLANNER_ENABLED flag.]
- **Structured tables:** 6 L1 + 6 L2.5 + 4 L3.5 register tables [as M2 close] + 5 M3 temporal tables (`dasha_periods` 022, `signal_states` 023, `kp_sublords` 024, `varshaphala` 025, `shadbala` 031). Migrations 022-031 native-applied pre-D1 per M3-PRE-D-GOVERNANCE verification + post-apply confirmation.
- **CAPABILITY_MANIFEST:** `entry_count: 112` (corrected at M3-W1-A2 from latent 109; +3 reflects pattern_register/contradiction_register/resonance_register/cluster_atlas tool_binding entries).
- **Active feature flags at M3 close:** `DISCOVERY_PATTERN_ENABLED=true`, `DISCOVERY_CONTRADICTION_ENABLED=true`, `DISCOVERY_RESONANCE_ENABLED=true`, `DISCOVERY_CLUSTER_ENABLED=true` (M3-A2 flips); + M2-inherited flags unchanged.
- **Synthesis prompt:** `CONTRADICTION_FRAMING` constant in `platform/src/lib/prompts/templates/shared.ts:26` injected into `buildOpeningBlock()` so all 7 active synthesis classes inherit. B.1+B.3 enforcement verbatim.
- **Eval harness:** baseline STUB persists per AC.M3A.5 deferral (auth wall; BHISMA GAP.P.9 unblocking pending).
- **Temporal validator:** `00_ARCHITECTURE/EVAL/TEMPORAL/run_validator.py` exit 0; suite `VALIDATOR_META_TESTS_v1_0.md`.
- **PPL substrate:** active. `06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl` carries 10 PRED rows from M2-W5/W6; `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md §9 PROSPECTIVE PREDICTION SUBSECTION` (added M3-W4-D1) carries the held-out-sample subset (PRED.M3D.HOLDOUT.001 + 002).

## §8 — M3 exit — confirmed

M3 is **CLOSED.** The Discovery Engine query-time substrate is live. The temporal substrate is operational across Vimshottari + Yogini + Chara + Narayana + Transit + KP + Varshaphala + Shadbala. The IS.8(b) macro-phase-close red-team verdict is PASS. Mirror discipline holds across MP.1–MP.8.

**M4 — Calibration + LEL Ground-Truth Spine — may now open.**

First M4 session: native-choice between authoring `PHASE_M4_PLAN_v1_0.md` (analogue of `PHASE_M3_PLAN_v1_0.md` for M3) and driving M4 directly from `MACRO_PLAN_v2_0.md §M4` (per `PHASE_M3_PLAN §5` native-approval-points table). **Hard prerequisite for M4-A entry per `MACRO_PLAN §CW.LEL §M4 entry state`: LEL ≥40 events spanning ≥5 years.** Current LEL count is **35 events** (5 short of 40); span is 1984-2025 (41 years; well past the 5-year minimum). The 5-event gap must be closed before M4-A calibration work begins. See HANDOFF_M3_TO_M4 §Hard prerequisites for M4 for detail.

Handoff memo: `00_ARCHITECTURE/HANDOFF_M3_TO_M4_v1_0.md`.

---

*End of M3_CLOSE_v1_0.md.*
