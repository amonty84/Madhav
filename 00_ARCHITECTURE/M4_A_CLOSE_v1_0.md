---
artifact: M4_A_CLOSE_v1_0.md
canonical_id: M4_A_CLOSE_v1_0
version: 1.0
status: CURRENT
authored_by: M4-A-CLOSE-LEL-PATCH
authored_at: 2026-05-02
sub_phase: M4-A — LEL Ground-Truth Spine (sub-phase of M4 macro-phase)
macro_phase: M4 — Calibration + LEL Ground-Truth Spine
sub_phase_opened: 2026-05-01 (M4-W1 — PHASE_M4_PLAN authored; LEL gate CLEARED at e9dc44b)
sub_phase_closed: 2026-05-02
phase_plan: 00_ARCHITECTURE/PHASE_M4_PLAN_v1_0.md §3.1 (AC.M4A.1–AC.M4A.10)
predecessor_close_artifact: 00_ARCHITECTURE/M3_CLOSE_v1_0.md (M3 macro-phase sealing)
predecessor_handoff: 00_ARCHITECTURE/HANDOFF_M3_TO_M4_v1_0.md
red_team_artifact: 00_ARCHITECTURE/EVAL/REDTEAM_M4A_v1_0.md (IS.8(a) cadence-fire; PASS 6/6 axes)
successor_sub_phase: M4-B — Learning Layer Activation (LL.1 + LL.2 + LL.3 + LL.4)
produced_during: M4-A-CLOSE-LEL-PATCH
produced_on: 2026-05-02
note: >
  This is a SUB-PHASE close artifact, not a macro-phase close. The M4 macro-phase
  itself remains active and closes at M4-D with its own M4_CLOSE_v1_0.md sealing
  artifact. The IS.8(b) macro-phase-close red-team fires at M4 close, not here.
  This artifact discharges PHASE_M4_PLAN §3.1 acceptance criteria AC.M4A.1–AC.M4A.10
  and unblocks M4-B entry per §3.2.
changelog:
  - v1.0 (2026-05-02) — Initial sealing artifact for M4-A sub-phase. Authored at
    M4-A-CLOSE-LEL-PATCH following the NAP.M4.1/2/3/4 native dispositions
    (M4-A-S2-T3-SHADOW-PROTOCOL NAP-decisions append) and the M4-A Round 3
    integration pass. All 10 ACs verified PASS against committed artifacts on
    post-merge-main. LEL v1.6 patch applied in same session (GAP.M4A.04 partial
    close — EVT.2019.05.XX.01 + EVT.2023.05.XX.01 dual-tagged residential+travel).
---

# M4-A CLOSE — LEL Ground-Truth Spine (M4 sub-phase)

## Executive summary

M4-A (LEL Ground-Truth Spine — Swiss Ephemeris pass on the 11 v1.3 pending events; LEL↔MSR event-match record corpus authored under native-approved Calibration Rubric Option B; held-out partition identified and decade-stratified; PPL substrate migrated; LL.1 STUB→ACTIVE-PENDING; chronological-completeness audit completed; KR.M3A.JH-EXPORT disposition recorded; SHADOW_MODE_PROTOCOL §3 binding) is **CLOSED**.

The empirical ground truth that every downstream M4-B/C/D calibration mechanism consumes is now in place. `06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records.json` carries 46 records (37 training / 9 held-out, decade-stratified 2/3/4 across the 2000s/2010s/2020s) under schema v1.1, every record citing `rubric_option: B`, every `match_rate` populated. The PPL substrate (`06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl`) carries PRED.M3D.HOLDOUT.001 + 002 with `partition: held_out`. SHADOW_MODE_PROTOCOL_v1_0.md is APPROVED with §3 promotion criteria (N≥3, variance≤0.3, two-pass approval, validity margin match_rate≥0.4) binding for M4-B/C weight writes. The IS.8(a) every-third-session red-team (REDTEAM_M4A_v1_0.md) returned PASS 6/6 axes with one LOW carry-forward (KR.M4A.RT.LOW.1) and reset the counter 3→0.

The bar to open M4-B is therefore cleared.

## §1 — M4-A quality bar — final status

Per `PHASE_M4_PLAN_v1_0.md §3.1` acceptance criteria. Each row verified against committed artifacts on `post-merge-main` at session-open.

| Criterion | Target | Final result | Status |
|---|---|---|---|
| AC.M4A.1 | LEL v1.4 exists; 11 prior `pending_computation` events have populated `chart_state_at_event` | LEL frontmatter v1.5 (v1.4 advanced 11 events; v1.5 added §9 migration annotations); changelog records "M4-A AC.M4A.1 discharged" at v1.4 (commit 5d015bd) | PASS |
| AC.M4A.2 | `lel_event_match_records.json` exists; 46 records; required fields populated | 46 records under schema_version 1.1; all required fields present (`event_id`, `event_date`, `expected_lit_signals`, `actual_lit_signals`, `match_rate`, `partition`, `rubric_option`, `rubric_version`); commits 79a6810 + d53e42d + integration 8232fa1 | PASS |
| AC.M4A.3 | Calibration rubric native-approved; rubric document exists; rubric version cited per record | CALIBRATION_RUBRIC_v1_0.md exists at `06_LEARNING_LAYER/OBSERVATIONS/`; NAP.M4.1 APPROVED at M4-A-INTEGRATION-PASS-R3 (Option B per CURRENT_STATE v1.3); all 46 records cite `rubric_option: B`. Known doc-frontmatter drift: rubric file frontmatter still reads `status: AWAITING_NATIVE_APPROVAL` despite native approval recorded in CURRENT_STATE v1.3+v1.4 (deferred — see §3, KR.M4A.CLOSE.1) | PASS (with documentation drift carry-forward) |
| AC.M4A.4 | Held-out partition: ≥9 events; decade-stratified; never used for M4-B training weights | 9 held-out records (`held_out_count: 9`, `training_count: 37`); decade tally: 2000s = 2 (EVT.2008.06.09.01, EVT.2009.06.XX.01), 2010s = 3 (EVT.2017.03.XX.01, EVT.2018.11.28.01, EVT.2019.05.XX.01), 2020s = 4 (EVT.2022.01.03.01, EVT.2024.02.16.01, EVT.2025.05.XX.01, EVT.2026.01.XX.01). `held_out_manifest` carries all 9 IDs at the file level | PASS |
| AC.M4A.5 | PPL migration: prediction_ledger.jsonl carries PRED.M3D.HOLDOUT.001 + 002; LEL §9 entries `migrated: true`; no outcome pre-observation | `prediction_ledger.jsonl` last two records are PRED.M3D.HOLDOUT.001 + PRED.M3D.HOLDOUT.002, both with `partition: held_out`, `migrated_at: 2026-05-01`, `migrated_by_session: M4-A-T2-PPL-INFRA`, `outcome: null`. LEL §9 carries `migrated: true` annotations (verified). Commit f7f477e (T2) + integration 0793719 | PASS |
| AC.M4A.6 | LL.1 STUB banner removed; mechanism status `active-pending`; no signal_weights/ directory | `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/README.md` carries `active-pending` status; no `signal_weights/` subdirectory yet (M4-B scope per §3.2). Commit f7f477e (T2) | PASS |
| AC.M4A.7 | LEL chronological-completeness audit complete; decade gap record; native disposition per gap | `06_LEARNING_LAYER/OBSERVATIONS/LEL_GAP_AUDIT_v1_0.md` v1.1, status `COMPLETE`. §5.4 records NAP.M4.2 native dispositions: 1 patch (GAP.M4A.04 — applied as LEL v1.6 patch in this session), 5 deferred (GAP.M4A.01/02/03/05/06), 5 accept. Native_id `abhisek` recorded. Commit 73d9e76 (T4) + NAP append c5877c5. Adjunct: `msr_domain_buckets.json` 495/499 signals bucketed across 10 domains; 4 absent IDs (SIG.MSR.207/497/498/499) flagged for M4-substrate or M5+ | PASS |
| AC.M4A.8 | KR.M3A.JH-EXPORT decision recorded — JH verification performed OR explicit deferral with rationale | `00_ARCHITECTURE/EVAL/JH_EXPORT_DISPOSITION_v1_0.md` v1.0 status `NATIVE_DECIDED`; §4 carries `native_decision: "Option Y — carry forward"`, native_decided_on 2026-05-02, full rationale recorded (JH not operationalised; M4 critical path is calibration; SHADOW_MODE_PROTOCOL §3.2 match_rate<0.4 filter is the empirical cross-check on the 35 D9-dependent signals; target M5 next pursuit window). DIS.009 remains `resolved-R3 (pending ECR)`. Commit c819dbb (T3) + NAP append c5877c5 | PASS |
| AC.M4A.9 | No L1 mutations (FORENSIC frozen); LEL updates via versioning; no fabricated computation | FORENSIC_v8_0 untouched in M4-A. LEL v1.3→v1.4→v1.5 minor bumps each with changelog and Swiss-Ephemeris-sourced chart states (no invented numerical values per B.10). Note: this M4-A close session itself bumps LEL v1.5→v1.6 (GAP.M4A.04 patch — the v1.6 patch is itself the §A.4 native-decision-execution writeback for AC.M4A.7, scope-tight per the close brief) | PASS |
| AC.M4A.10 | IS.8(a) cadence check at M4-A close; REDTEAM_M4A produced if due | `00_ARCHITECTURE/EVAL/REDTEAM_M4A_v1_0.md` v1.0 status `COMPLETE`; verdict PASS 6/6 axes (RT.M4A.1 through RT.M4A.6); 0 CRITICAL / 0 HIGH / 0 MEDIUM / 1 LOW carry-forward (KR.M4A.RT.LOW.1 — see §3); counter_action `resets 3 → 0`. Discharged at M4-A-S2-T1-REDTEAM-BATCH1 (commit 79a6810) — IS.8(a) every-third-session cadence cleared before any new substantive corpus writes downstream | PASS |

**Aggregate:** 10 PASS / 0 DEFERRED / 0 FAIL.

## §2 — Round log (parallel execution summary)

The M4-A sub-phase ran across four execution rounds plus two integration passes plus a NAP-decisions append. All execution rounds used Cowork-style parallel tracks where independence permitted; integration rounds merged track outputs and adjudicated cross-track edits.

| Round | Sub-phase | Sessions / commits | Deliverable summary | Status |
|---|---|---|---|---|
| Round 1 | M4-W1 — Phase plan + LEL gate clearance | Cowork-M4-W1-PLAN-AUTHORING (commit 3669a0a); preceding LEL elicitation cleared the 40-event entry gate (LEL v1.2→v1.3, e9dc44b: 35→46 events; 11 events pending Swiss Ephemeris) | PHASE_M4_PLAN_v1_0.md v1.0 authored — sub-phases M4-W1 through M4-D defined; M4-A entry-gate cleared; AC.M4A.1–AC.M4A.10 specified | CLOSED |
| Round 2 | M4-A T1–T4 (parallel execution) | M4-A-T1-SWISS-EPHEMERIS (5d015bd); M4-A-T2-PPL-INFRA (f7f477e); M4-A-T3-RUBRIC-SCHEMA (be7134b); M4-A-T4-GAP-AUDIT (73d9e76) | T1: LEL v1.3→v1.4, 11 chart_states computed via M3-B/C engines (Vimshottari + Yogini + transits) → AC.M4A.1 discharged. T2: PPL migration (PRED.M3D.HOLDOUT.001 + 002 → prediction_ledger.jsonl) + LL.1 STUB→ACTIVE-PENDING + 06_LEARNING_LAYER/OBSERVATIONS/ scaffold → AC.M4A.5 + AC.M4A.6 discharged. T3: CALIBRATION_RUBRIC_v1_0.md DRAFT (3 options A/B/C; recommend B) + lel_event_match_records_schema.json (JSON Schema draft-07) → NAP.M4.1 ready for native review. T4: LEL_GAP_AUDIT_v1_0.md v1.0 (11 gaps; 6 elicit + 5 accept) + msr_domain_buckets.json (495/499 signals across 10 domains) → AC.M4A.7 discharge ready (pending NAP.M4.2 native disposition) | CLOSED |
| Integration R2 | Round 2 merge + LEL v1.4→v1.5 §9 migration annotations | M4-A-INTEGRATION-PASS (commit 0793719) | LEL §9 PRED.M3D.HOLDOUT.001 + 002 entries annotated `migrated: true`; CURRENT_STATE v1.1→v1.2 + SESSION_LOG entry. Known residual: KR.M4A.RT.LOW.1 — commit 0793719 has a malformed root tree (duplicate `01_FACTS_LAYER` entry surfaced by tree-ls; on-disk content is correct and all reads work; deferred per §3) | CLOSED |
| Round 3 | M4-A-S2 T1–T3 (parallel execution + NAP-ready drafts) | M4-A-S2-T1-REDTEAM-BATCH1 (79a6810); M4-A-S2-T2 batch2 + held-out (d53e42d); M4-A-S2-T3-SHADOW-PROTOCOL (c819dbb) | T1: REDTEAM_M4A_v1_0.md IS.8(a) PASS 6/6; counter 3→0 reset → AC.M4A.10 discharged. event_match_records_batch1.json (23 records, training only, rubric Option B per integration). T2: event_match_records_batch2.json (23 records: 7 held_out + 16 training; held_out_manifest with all 9 IDs; 22 records match_rate=1.0, 1 at 0.84). T3: SHADOW_MODE_PROTOCOL_v1_0.md DRAFT (NAP.M4.4 awaiting) + JH_EXPORT_DISPOSITION_v1_0.md (NAP.M4.3/AC.M4A.8 awaiting) | CLOSED |
| Integration R3 | Round 3 merge + schema v1.1 + records consolidation | M4-A-INTEGRATION-PASS-R3 (commit 8232fa1) | batch1 + batch2 merged → lel_event_match_records.json (46 records, schema v1.1 PASS; stray per-record schema_version stripped from 23 T1 records; partition EVT.2008.06.09.01 + EVT.2009.06.XX.01 flipped training→held_out per T2 manifest). lel_event_match_records_schema.json bumped v1.0→v1.1 (rubric_option outer + per-record; total_events; held_out_count; training_count; held_out_manifest). Stats: total=46, training=37, held_out=9; mean match_rate 0.685 (training 0.630 / held_out 0.913). CURRENT_STATE v1.2→v1.3. NAP.M4.1 APPROVED Option B at this integration pass. → AC.M4A.2 + AC.M4A.3 + AC.M4A.4 discharged | CLOSED |
| NAP-decisions append | Native dispositions for NAP.M4.2/3/4 | commit c5877c5 (M4-A-S2-T3-SHADOW-PROTOCOL NAP-decisions append) | NAP.M4.4 APPROVED (SHADOW_MODE_PROTOCOL §3 criteria binding — N≥3, variance≤0.3, two-pass approval, validity margin match_rate≥0.4); NAP.M4.3 Option Y (JH carry forward; DIS.009 stays resolved-R3-pending-ECR; KR.M3A.JH-EXPORT to HANDOFF_M4_TO_M5); NAP.M4.2 partial (GAP.M4A.04 deferred-pending-patch — applied this session as LEL v1.6; 5 gaps deferred; 5 accept). LEL_GAP_AUDIT v1.0→v1.1; CALIBRATION_RUBRIC, JH_EXPORT_DISPOSITION, SHADOW_MODE_PROTOCOL appended with native decisions; CURRENT_STATE v1.3→v1.4 → AC.M4A.7 + AC.M4A.8 fully discharged; M4-B entry gate cleared | CLOSED |
| M4-A close | This session — sealing artifact + LEL v1.6 patch + CURRENT_STATE v1.5 | M4-A-CLOSE-LEL-PATCH (this commit) | M4_A_CLOSE_v1_0.md authored (this artifact); LEL v1.5→v1.6 patch (EVT.2019.05.XX.01 + EVT.2023.05.XX.01 dual-tagged `residential+travel` per NAP.M4.2 GAP.M4A.04 disposition); CURRENT_STATE v1.4→v1.5; SESSION_LOG appended | THIS SESSION |

**M4-A sessions total:** 1 plan-only (W1) + 4 substantive Round 2 (T1–T4) + 1 integration R2 + 3 substantive Round 3 (S2-T1/T2/T3) + 1 integration R3 + 1 NAP-decisions append + 1 close session (this one) = **11 sessions** in M4-A.

## §3 — Known deferred items (carried forward)

These are explicitly named so they survive into M4-B and beyond without silent loss. None gates M4-A close per the §1 quality bar.

### Carry-forward into M4-B (this sub-phase's own residuals)

0. **KR.M4A.CLOSE.2 — M4-B-S1 executed before M4-A formal close (procedural irregularity).** See §8 "Procedural irregularity" for full record. Commit 550fa77 (M4-B-S1-LL1-SHADOW-WEIGHTS) wrote LL.1 shadow weights (single-track, all-domain) ahead of this M4-A formal close. SESSION_LOG entry committed at HEAD. No production promotion happened; held-out partition discipline respected. **Action at M4-B-S2:** native review of single-track implementation vs planned B1/B2 split (accept-as-is or re-split). Not blocking; flagged for audit-trail completeness.

1. **KR.M4A.RT.LOW.1 — commit 0793719 malformed root tree.** REDTEAM_M4A §6 LOW finding. Commit 0793719 (M4-A-INTEGRATION-PASS) has a duplicate `01_FACTS_LAYER` entry in the root tree per `git ls-tree`. On-disk file content is correct; all reads work; subsequent commits (8232fa1 onward) wrote clean trees over it. **Action:** schedule a tree-rewrite (git filter-repo or interactive rebase to re-author 0793719) at native convenience. Not blocking; cosmetic governance hygiene.
2. **KR.M4A.CLOSE.1 — CALIBRATION_RUBRIC_v1_0.md frontmatter drift.** The rubric file frontmatter still carries `status: AWAITING_NATIVE_APPROVAL` and `version: 1.0-DRAFT` despite NAP.M4.1 APPROVED at M4-A-INTEGRATION-PASS-R3 per CURRENT_STATE v1.3. The semantic approval is recorded in CURRENT_STATE v1.3+v1.4 and embedded in every event-match record (`rubric_option: B`). **Action:** at M4-B entry, flip rubric frontmatter to `status: APPROVED`, `version: 1.0`, append a changelog entry citing NAP.M4.1 approval. Documentation hygiene; not blocking M4-B.
3. **NAP.M4.5 — native spot-check of LL.1 weight assignments.** Scheduled at M4-B close per PHASE_M4_PLAN §5. Not in M4-A scope.
4. **NAP.M4.6 — LL.7 discovery prior rubric.** Scheduled at M4-C entry per PHASE_M4_PLAN §5. Not in M4-A scope.
5. **NAP.M4.7 — M4 macro-phase close approval.** Scheduled at M4-D close per PHASE_M4_PLAN §5. Not in M4-A scope.

### Carry-forward into M4-B from M3 (still open at M4-A close)

6. **KR.M3A.JH-EXPORT — DIS.009 full closure pending JH D9 export per ED.1.** Native disposition recorded at NAP.M4.3 (Option Y — carry forward). DIS.009 remains `resolved-R3 (pending ECR)`. Empirical cross-check via SHADOW_MODE_PROTOCOL §3.2 match_rate<0.4 filter on the 35 D9-dependent MSR signals during M4-B calibration. **Next pursuit window:** M5 open (alongside Sthana + Drik Shadbala ECR and Narayana Dasha verification per ED.1). Carries to HANDOFF_M4_TO_M5_v1_0.md inherited open items at M4-D close.
7. **GAP.M4A.04 — travel sparsity (partially closed this session).** LEL v1.6 patch (this session) dual-tags EVT.2019.05.XX.01 + EVT.2023.05.XX.01 as `residential+travel` per NAP.M4.2 §5.4 native disposition `patch`. Two travel events surfaced. Remainder of travel-decade sparsity (cell value below the threshold in §5.2 of LEL_GAP_AUDIT v1.1) remains as accept/defer per native discretion at next LEL maintenance pass.
8. **GAP.M4A.01 / GAP.M4A.02 / GAP.M4A.03 / GAP.M4A.05 / GAP.M4A.06 — five elicit-recommended gaps deferred.** Native disposition `defer` per NAP.M4.2 §5.4. To be reconsidered at native discretion in a future LEL minor-version pass; not gating M4-B.
9. **KR.M3.RT.LOW.1 — KP per-planet snapshot vs 0°-360° boundary table.** REDTEAM_M3 §6 forward-work. M4-class follow-up if M4 calibration requires the boundary-table mode. Not blocking.

### Carry-forward into M4-B / M4-C from M3 sub-phases (procedural / verification)

10. **DIS.010 / DIS.011 / DIS.012 — Jaimini multi-tradition forks.** RESOLVED-N3 (defer to M9 multi-school triangulation per `PHASE_M3_PLAN §8` default policy). compute_chara.py + compute_narayana.py outputs remain `needs_verification` until M9. Tracked but not gating.
11. **Sthana + Drik Shadbala ECR resolution.** `[EXTERNAL_COMPUTATION_REQUIRED]` per CLAUDE.md §I B.10. JH access dependency. M5+.
12. **Narayana Dasha verification.** External acharya review or JH export per DIS.012 R1/R2. `compute_narayana.py` output `needs_verification: true`. M4-class open item; carries to M5 alongside JH integration.
13. **KR.M3A2.1 — PAT.008 ECR clarification.** Documentation-clarity carry-forward (not a B.10 violation). Could explicitly cite FORENSIC §3.5 as in-corpus L1 source. M4-class.
14. **AC.M3A.5 — post-baseline delta run.** DEFERRED at M3-A close (auth wall). Carries to M4 with auth secrets (BHISMA GAP.P.9 unblocking).
15. **External acharya review on M3 deliverables (R.M3D.1 mitigation).** In-session native review = AC.M3D.3 PASS at M3 close. External acharya review carried as M4-class open item.

### Inherited from M2 (still open at M4-A close)

16. **SIG.MSR.207 absent from `MSR_v3_0.md`.** Plus SIG.MSR.497 / SIG.MSR.498 / SIG.MSR.499 absent (msr_domain_buckets.json `missing_signal_ids.count: 4`). MSR frontmatter declares 499 / §I declares 500; actual file carries 495 unique signal blocks (SIG.MSR.001 through SIG.MSR.496 with SIG.MSR.207 absent). M4-substrate-cleaning pass or M5+ MSR expansion.
17. **UCN inline citation pass (Option A) against `UCN_v4_0.md`.** Aspirational only; not gating.
18. **TypeScript test-fixture errors** in `tests/components/AppShell.test.tsx` + `tests/components/ReportGallery.test.tsx`. 9 errors total; pre-W6 portal-redesign drift; Portal Redesign R-stream owns; non-blocking.
19. **KR.W9.1 + KR.W9.2 — eval-runner auth wall + parser quirk.** BHISMA GAP.P.9. M4-class with auth-secrets availability.

## §4 — Red-team evidence

`00_ARCHITECTURE/EVAL/REDTEAM_M4A_v1_0.md` — IS.8(a) every-third-session cadence-fire on M4-A Round 2 outputs. **Verdict: PASS (6/6 axes; 0 CRITICAL / 0 HIGH / 0 MEDIUM / 1 LOW carry-forward; 0 fixes applied).** Counter action: 3 → 0 reset. AC.M4A.10 DISCHARGED.

The 1 LOW carry-forward is **KR.M4A.RT.LOW.1** (commit 0793719 malformed root tree). On-disk file content correct; cosmetic. See §3 item 1.

**No IS.8(b) macro-phase-close red-team for M4-A.** IS.8(b) cadence fires at M4 macro-phase close (M4-D-S2 per PHASE_M4_PLAN §3.4 AC.M4D.2), not at sub-phase close. The next M4 IS.8(a) every-third-session cadence-fires three substantive M4-B sessions hence (counter restarts at 0 from this M4-A close).

**Counter trail in M4-A:**
- M3-W4-D2-M3-CLOSE reset / next macro-phase open → 0 (per CURRENT_STATE v1.3 trail)
- M4-A Round 2 (T1, T2, T3, T4) → counter incremented 0→1→2→3 across the four parallel tracks
- M4-A-INTEGRATION-PASS (R2) → counter held at 3 (administrative; cadence held-pending)
- M4-A-S2-T1-REDTEAM-BATCH1 → IS.8(a) FIRES (REDTEAM_M4A v1.0 PASS) → counter reset 3→0
- M4-A-S2-T2 / T3 → 0→1→2
- M4-A-INTEGRATION-PASS-R3 + NAP-decisions append → governance / administrative; held at 2 (per CURRENT_STATE v1.3+v1.4 ledger; note CURRENT_STATE v1.4 currently records `red_team_counter: 0` per the §2 cached annotation referencing the R3 reset — the operational reading is "counter at 0 entering M4-A close")
- This M4-A close session → close-artifact authoring (M4-A sub-phase close, not a macro-phase close); per ONGOING_HYGIENE_POLICIES §G this session's increment behaviour follows steady-state rules

Per CURRENT_STATE v1.4 §2 `red_team_counter: 0` cache annotation, M4-B substantive sessions begin counting from counter=0; next IS.8(a) fires at counter=3 (three substantive M4-B sessions from now).

## §5 — ND status at M4-A close

- **ND.1 (Mirror Discipline)** — addressed since Step 7 close (2026-04-24); held throughout M4-A across MP.1–MP.8. M4-A sub-phase did not touch MP.3 / MP.4 / MP.8 frozen sources. MP.6 / MP.7 are declared Claude-only (no Gemini-side update required). The MP.1 / MP.2 sync for M4-A close itself is performed at this session — see §6.
- **No open native directives** at M4-A close.

`open_native_directives: []`. `addressed_native_directives: ["ND.1"]`.

## §6 — Mirror sync evidence

This M4-A close session (M4-A-CLOSE-LEL-PATCH) is a Claude-side governance milestone. Per MP.1 + MP.2 mirror discipline (CLAUDE.md §K + GOVERNANCE_INTEGRITY_PROTOCOL §K), Gemini-side adapted-parity update on `.geminirules` (MP.1) and `.gemini/project_state.md` (MP.2) is due at this session close.

**This session's mirror sync status:** M4-A close governance milestone is reflected on the Claude side (this artifact + CURRENT_STATE v1.5 + SESSION_LOG append). The Gemini-side propagation to `.geminirules` and `.gemini/project_state.md` was outside the may_touch declaration of this close brief (the brief restricts to `00_ARCHITECTURE/M4_A_CLOSE_v1_0.md`, `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md`, `00_ARCHITECTURE/CURRENT_STATE_v1_0.md`, `00_ARCHITECTURE/SESSION_LOG.md`). Therefore the MP.1 + MP.2 propagation is **flagged as a carry-forward** — the next session that touches Gemini-side surfaces (or the natively-triggered next mirror sync session) performs the adapted-parity update.

Per GOVERNANCE_INTEGRITY_PROTOCOL §K.3 step 3, this carry-forward opens a `DIS.class.mirror_desync` entry candidate in `DISAGREEMENT_REGISTER_v1_0.md` if the propagation is not picked up by the immediately-following session. The expected discharge path is: at M4-B Round 1 entry (T1 / T2 parallel), the session that opens declares `.geminirules` + `.gemini/project_state.md` in its may_touch and updates them to reflect M4-A CLOSED + M4-B in-flight at adapted parity.

`mirror_enforcer.py` was not run at this close (would be expected to surface the desync as part of the carry-forward record).

**Summary:**
- MP.1 (.geminirules) — propagation **carry-forward** to next session.
- MP.2 (.gemini/project_state.md) — propagation **carry-forward** to next session.
- MP.6 (GOVERNANCE_STACK), MP.7 (SESSION_LOG) — declared Claude-only; no Gemini-side update required (SESSION_LOG appended this session).

## §7 — Live state of the platform at M4-A close

**Carried forward from M3 + extended in M4-A:**

- **Query pipeline (default):** `classify → [per_tool_planner: optional] → compose → retrieve(parallel) → validate → synthesize → audit`. Flag-state unchanged from M3 close (NEW_QUERY_PIPELINE_ENABLED=true, AUDIT_ENABLED=true, PER_TOOL_PLANNER_ENABLED=false; DISCOVERY_*_ENABLED all true).
- **Retrieval tools wired:** 22 total at M3 close; M4-A added no retrieval tools (M4-A scope is calibration substrate, not retrieval surfaces).
- **Structured tables:** 6 L1 + 6 L2.5 + 4 L3.5 register tables + 5 M3 temporal tables (`dasha_periods`, `signal_states`, `kp_sublords`, `varshaphala`, `shadbala`). M4-A added no migrations (calibration substrate is file-based under `06_LEARNING_LAYER/` until M4-B writes weights — and even those are file-based per LL.1 spec).
- **Learning Layer state at M4-A close:**
  - `06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl` — 16 PRED rows (10 M2-W5/W6 inherited + 4 M2-W6/W7 inherited + 2 M3-D-HOLDOUT migrated); held_out partition tagged on the 2 M3-D-HOLDOUT rows.
  - `06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records.json` — 46 records, schema v1.1, rubric Option B, 37 training / 9 held-out.
  - `06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records_schema.json` — JSON Schema draft-07 v1.1.
  - `06_LEARNING_LAYER/OBSERVATIONS/CALIBRATION_RUBRIC_v1_0.md` — Option B native-approved at NAP.M4.1; frontmatter status carry-forward (KR.M4A.CLOSE.1).
  - `06_LEARNING_LAYER/OBSERVATIONS/LEL_GAP_AUDIT_v1_0.md` v1.1 — NAP.M4.2 dispositions recorded.
  - `06_LEARNING_LAYER/OBSERVATIONS/msr_domain_buckets.json` — 495/499 signals across 10 domains.
  - `06_LEARNING_LAYER/SHADOW_MODE_PROTOCOL_v1_0.md` v1.0 status APPROVED — §3 promotion criteria binding for M4-B/C.
  - `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/README.md` — LL.1 mechanism status was `active-pending` at M4-A NAP-decisions append; M4-B-S1 (commit 550fa77) wrote the first shadow weights ahead of this formal close (see §8 Procedural irregularity). On-disk at HEAD: `signal_weights/shadow/ll1_shadow_weights_v1_0.json` exists (225,178 bytes; 380 signals observed; 30 promotion-eligible pending two-pass; production register empty).
- **L1 corpus (LEL):** v1.5 → v1.6 (this session — GAP.M4A.04 patch dual-tagging EVT.2019.05.XX.01 + EVT.2023.05.XX.01 as `residential+travel`). 46 events. FORENSIC v8.0 frozen.
- **Active feature flags at M4-A close:** unchanged from M3 close.
- **Synthesis prompt:** unchanged from M3 close.
- **Eval harness:** baseline STUB persists per AC.M3A.5 deferral (M4-class with auth-secrets).
- **Temporal validator:** unchanged; exit 0.
- **Disagreement state:** DIS.009 `resolved-R3 (pending ECR)` (next pursuit window M5); DIS.010/011/012 RESOLVED-N3.

## §8 — M4-A exit — confirmed

M4-A is **CLOSED** as of 2026-05-02 (this session). The LEL Ground-Truth Spine substrate is complete. Calibration rubric is native-approved (Option B). SHADOW_MODE_PROTOCOL §3 promotion criteria are binding. Held-out partition is identified, decade-stratified, and never used for training. PPL substrate is migrated. LL.1 status was `active-pending` at NAP-decisions append; first weight write occurred at M4-B-S1 ahead of this formal close (see Procedural irregularity below). KR.M3A.JH-EXPORT is dispositioned (Option Y — carry forward to M5).

### Procedural irregularity — M4-B-S1 executed before M4-A formal close

M4-B-S1-LL1-SHADOW-WEIGHTS executed at commit `550fa77` (with hash-stamp follow-up `efa599c`) BEFORE this M4-A formal close session (`M4-A-CLOSE-LEL-PATCH`). On-disk evidence at HEAD:
- `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll1_shadow_weights_v1_0.json` — CREATED (225,178 bytes; valid JSON; schema_version "1.0", mechanism "LL.1", phase "M4-B").
- `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/README.md` — CREATED.
- `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/README.md` — CREATED.
- SESSION_LOG entry committed at HEAD with M4-B-S1-LL1-SHADOW-WEIGHTS = CLOSED block.

The M4-B-S1 session ran a SINGLE-TRACK LL.1 shadow-write across all domains (380 signals observed in training expected_lit_signals; 30 promotion_eligible_pending_two_pass; 285 insufficient_observations; 52 shadow_indefinite_low_match_rate; 13 shadow_indefinite_high_variance; 37 training events used; 9 held-out events excluded), rather than the parallel B1/B2 split per `PHASE_M4_PLAN §3.2`. No production weight has been promoted (the production register `signal_weights/production/` does not exist).

**Implication for this M4-A close:** The M4-A→M4-B sub-phase boundary was crossed informally; this M4_A_CLOSE_v1_0.md retroactively documents M4-A as CLOSED and accepts M4-B-S1 as already-executed work. Per CLAUDE.md §I "no fabricated computation" + B.8 versioning discipline, this irregularity is named here for audit completeness. The held-out partition discipline (Learning Layer rule #4) was respected at M4-B-S1 — held-out 9 events contributed zero observations. SHADOW_MODE_PROTOCOL §3 binding criteria were respected — no production promotion happened. Damage assessment: procedural-only; no calibration corruption.

**Carry-forward flag:** schedule a brief native review of M4-B-S1 outputs at the next governance touchpoint to confirm the single-track implementation is acceptable in lieu of the planned parallel B1/B2 split, OR to schedule a B1/B2 re-split pass. The 30 `promotion_eligible_pending_two_pass` signals remain blocked at the §3(c) two-pass approval gate (Gemini red-team review) and §3(d) native-notification-with-no-hold gate.

### Next session

The actual next session is **not** "M4-B Round 1 (parallel B1/B2)" because that work has effectively been performed (single-track variant) at M4-B-S1. The next session should pick up M4-B-S2 follow-up work:
- Two-pass approval (Gemini red-team review) on the 30 promotion_eligible_pending_two_pass signals per `SHADOW_MODE_PROTOCOL §3(c)`.
- Native-notification with no-hold gate per `SHADOW_MODE_PROTOCOL §3(d)`.
- Native review of the M4-B-S1 single-track implementation vs the planned B1/B2 split (see procedural irregularity above).
- LL.2 / LL.3 / LL.4 mechanism activation per `PHASE_M4_PLAN §3.2`.
- KR.M4A.CLOSE.1 — flip CALIBRATION_RUBRIC_v1_0.md frontmatter status `AWAITING_NATIVE_APPROVAL` → `APPROVED`, version `1.0-DRAFT` → `1.0`, append changelog entry citing NAP.M4.1 approval.
- MP.1 + MP.2 mirror sync carry-forward from this M4-A close (`.geminirules` + `.gemini/project_state.md`).

**ACs for M4-B forward work:** `PHASE_M4_PLAN §3.2 AC.M4B.1–AC.M4B.10` continue to govern; shadow-only writes per `SHADOW_MODE_PROTOCOL §3` until promotion criteria are met (N≥3, variance≤0.3, two-pass approval, validity margin match_rate≥0.4).

---

*End of M4_A_CLOSE_v1_0.md.*
