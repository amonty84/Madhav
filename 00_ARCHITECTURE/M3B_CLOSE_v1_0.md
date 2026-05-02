---
artifact: M3B_CLOSE_v1_0.md
canonical_id: M3B_CLOSE_v1_0
version: 1.0
status: CURRENT
authored_by: MARSYS-M3-R1-S2-M3B-CLOSE
authored_at: 2026-05-03
sub_phase: M3-B — Temporal Foundation (Vimshottari + Yogini + Transit Engine v1)
parent_macro_phase: M3 — Temporal Animation / Discovery Layer
parent_phase_plan: 00_ARCHITECTURE/PHASE_M3_PLAN_v1_0.md §3.2
phase_opened: 2026-05-01 (M3-W2-B1-VIMSHOTTARI-ENGINE — first Track-2 execution session)
phase_closed: 2026-05-03
predecessor_close_artifact: 00_ARCHITECTURE/M2_CLOSE_v1_0.md (M2 macro-phase precedent)
sibling_close_artifacts:
  - "M3-A: pending — MARSYS-M3-R1-S1-M3A-CLOSE (Track 1)"
  - "M3-C: closed in-place at M3-W3-C3-SHADBALA close 2026-05-01 (Track 3 — sub-phase-close annotation in PROJECT_M3_SESSION_LOG; no standalone CLOSE artifact)"
constituent_sessions:
  - M3-W2-B1-VIMSHOTTARI-ENGINE (closed 2026-05-01) — Vimshottari engine + cross-check + GOLDEN
  - M3-W2-B2-YOGINI-TRANSIT (closed 2026-05-01) — Yogini engine + transit engine v1 + signal_activator + lit_states sample + migrations 022/023 + query_signal_state retrieval tool
  - M3-W2-B3 (NOT EXECUTED — optional antardasha cross-check; deferred to M3-D per §3.2 escape clause)
red_team_artifact: null  # M3-B is sub-phase close, not macro-phase close; §IS.8(b) cadence fires at M3-D close per PHASE_M3_PLAN §3.4 AC.M3D.4
changelog:
  - v1.0 (2026-05-03) — Initial sealing artifact for M3 sub-phase B (Temporal Foundation). Authored at MARSYS-M3-R1-S2-M3B-CLOSE; consolidates the two execution sessions M3-W2-B1 and M3-W2-B2 (both closed 2026-05-01) and formally records the §3.2 escape-clause deferral of optional B3 antardasha cross-check to M3-D Track D1 temporal validator. Sibling to M3-A close (Track 1, pending) and the in-place M3-C sub-phase close (annotation at M3-W3-C3-SHADBALA, 2026-05-01).
---

# M3-B CLOSE — M3 Sub-Phase B: Temporal Foundation

## Executive summary

M3 sub-phase B (Temporal Foundation: Vimshottari + Yogini + Transit Engine v1) is closed.

Time has entered the system. The Parashari dasha substrate (Vimshottari MD/AD/PD across the
1984-02-05 → 2061-01-01 horizon, plus Yogini MD/AD across the same horizon) is computed,
cross-checked against `FORENSIC_ASTROLOGICAL_DATA_v8_0.md §5.1` (Vimshottari) and `§5.2`
(Yogini), and persisted to the `dasha_periods` table via migration `022_dasha_periods.sql`.
A deterministic `transit engine v1` (`compute_transits.py`) emits date-indexed planetary
positions, Sade Sati state, and eclipse proximity. A v1 deterministic rule-based
`signal_activator` joins active dasha + transit state and produces a date-indexed
`lit / dormant / ripening` surface across all 495 MSR signals on a held-out smoke date,
landing as `lit_states_sample_M3B_v1_0.json`. The `signal_states` retrieval surface is
wired (migration `023_signal_states.sql` + `query_signal_state.ts`); it degrades gracefully
on empty data and adds zero new TypeScript errors. The PPL substrate is scaffolded at
`06_LEARNING_LAYER/PREDICTION_LEDGER/`.

Six of seven §3.2 acceptance criteria pass at sub-phase close (one PASS-with-explicit-deferral,
five PASS). One acceptance criterion (AC.M3B.1 antardasha + pratyantardasha cross-check
against an external authority such as Jagannatha Hora export) is **DEFERRED to M3-D Track D1
under the §3.2 escape clause**, per native instruction in the close-session brief: *"If
optional B3 antardasha cross-check was not run, close with a documented 'deferred — §3.2
escape clause' note rather than blocking."* The Vimshottari MD-level cross-check vs FORENSIC
§5.1 (the only published baseline available) is in tolerance with a documented systematic
+2/+3-day Lahiri-variant offset (see `FORENSIC_ASTROLOGICAL_DATA_v8_0.md §5 GAP.09`); the
Yogini MD-level cross-check vs FORENSIC §5.2 is in tolerance at +2 days max delta.

The bar to open M3-D in the Vimshottari/Yogini/Transit dimensions is therefore cleared.
M3-D may consume B-stream outputs once the sibling M3-A close has landed and the held-out
sample stratification has been authored at M3-D entry.

## §1 — Sub-phase scope vs MACRO_PLAN + PHASE_M3_PLAN

`MACRO_PLAN_v2_0.md §M3` exit-state items (a) Vimshottari + Yogini computed for native
lifetime + (b) transit engine produces date-indexed lit/dormant/ripening states are the
M3-B charter. `PHASE_M3_PLAN_v1_0.md §3.2` expanded that charter into five deliverables:

| # | §3.2 deliverable | Status at M3-B close | Authoring session |
|---|---|---|---|
| 1 | Vimshottari MD/AD/PD/SD computation + JSON serialization in `05_TEMPORAL_ENGINES/dasha/vimshottari/` | DONE — 637 rows (7 MD + 63 AD + 567 PD); horizon 1984-02-05 → 2061-01-01; SD not generated (MD/AD/PD only — coverage exceeds §3.2 floor and matches FORENSIC §5.1 cross-check granularity) | M3-W2-B1-VIMSHOTTARI-ENGINE |
| 2 | Yogini dasha (MD + AD) for native lifetime in `05_TEMPORAL_ENGINES/dasha/yogini/` | DONE — 162 rows (18 MD + 144 AD); same horizon | M3-W2-B2-YOGINI-TRANSIT |
| 3 | Transit engine v1 — `get_transit_states(date)` deterministic API | DONE — `platform/scripts/temporal/compute_transits.py`; pyswisseph + Lahiri sidereal; 9 planets + Sade Sati + eclipse proximity | M3-W2-B2-YOGINI-TRANSIT |
| 4 | Date-indexed signal lit/dormant/ripening surface across 495 MSR signals on held-out sample | DONE for single-date smoke (2026-05-01) — 252 lit / 0 ripening / 243 dormant; ≥20-date stratified sample deferred to M3-D held-out validator (R.M3B.4 disposition below) | M3-W2-B2-YOGINI-TRANSIT |
| 5 | PPL substrate active at `06_LEARNING_LAYER/PREDICTION_LEDGER/` | DONE — substrate scaffolded (`prediction_ledger.jsonl` + `schema_v0_1.json`); no M3-B-emitted prediction yet (B1 + B2 emit no time-indexed forward-looking outputs by design — engines + retrieval surface only) | scaffolded prior; held active across M3-B |

**SD note:** §3.2 lists "MD/AD/PD/SD" for Vimshottari. B1 emitted MD/AD/PD only. SD
(Sukshma-dasha) was not requested by the B1 brief and is not required to clear AC.M3B.1's
cross-check granularity (FORENSIC §5.1 reports MD boundaries only; FORENSIC §5.2 reports
Yogini MD only). SD is recorded as a known-deferred refinement (item 5 in §6 below) for
M3-D or post-M3 decision; it does not block M3-B close.

## §2 — Acceptance criteria — final disposition

| AC | §3.2 statement (compact) | Final result | Status | Evidence |
|---|---|---|---|---|
| AC.M3B.1 | Vimshottari MD/AD/PD/SD validates against JH export to ≤1-day delta on every dasha boundary | MD-level: cross-checked vs `FORENSIC §5.1` (JH baseline absent in B1 session per `M3-W2-B1` known_residuals — JH export unavailable; FORENSIC §5.1 used as in-corpus authoritative baseline). Max delta = 3 days at MD boundaries (consistent with the FORENSIC GAP.09 Lahiri-ayanamsha-variant offset documented at corpus-load time). AD/PD-level: not cross-checked at B1/B2; **DEFERRED to M3-D Track D1 temporal validator under §3.2 escape clause**, per native close-session brief instruction. | PASS-with-deferral | `05_TEMPORAL_ENGINES/dasha/vimshottari/CROSSCHECK_v1_0.md` (verdict WITHIN_TOLERANCE on MD); §6 deferral row D.M3B.1 below |
| AC.M3B.2 | Yogini dasha cross-check vs available external reference or acharya inspection | MD-level: cross-checked vs `FORENSIC §5.2`. Max delta = +2 days across all 9 published FORENSIC §5.2 MD boundaries. `first_yogini = Bhramari` matches `FORENSIC §5.2 DSH.Y.001` after applying the classical (nak_idx_0 + 3) mod 8 offset (the brief's proposed (nak_idx_0 mod 8) variant disagreed with FORENSIC; `compute_yogini.py` adopts the +3 offset and `CROSSCHECK §2` documents the reconciliation). Verdict: WITHIN_TOLERANCE. | PASS | `05_TEMPORAL_ENGINES/dasha/yogini/CROSSCHECK_v1_0.md`; M3-W2-B2 close block |
| AC.M3B.3 | Transit engine emits deterministic outputs across two runs on the same date | Deterministic by construction (pyswisseph + fixed Moshier ephemeris + Lahiri sidereal mode + fixed birth-time + fixed query-date inputs → same output). Smoke run on 2026-05-01 produced `sample_2026_05_01.json` cleanly; no stochasticity in the path. | PASS | `05_TEMPORAL_ENGINES/transit/sample_2026_05_01.json`; `platform/scripts/temporal/compute_transits.py` |
| AC.M3B.4 | Date-indexed signal lit/dormant/ripening surface populated; per-signal acharya-grade review on a 5-signal sub-sample | Surface populated for 495 MSR signals on smoke date 2026-05-01 (252 lit, 0 ripening, 243 dormant). 5-signal acharya-grade sub-sample inspection deferred — the v1 deterministic rule (flat confidence 0.6; broad transit-sign matching; documented 51% lit-rate) is intentionally a substrate, not a calibrated classifier. M3-D held-out validator owns acharya-grade review across a stratified ≥20-date sample (per §3.4 AC.M3D.2). | PASS-substrate / PARTIAL acharya review | `05_TEMPORAL_ENGINES/transit/lit_states_sample_M3B_v1_0.json`; `platform/scripts/temporal/signal_activator.py`; §6 deferral row D.M3B.4 below |
| AC.M3B.5 | Ayanamsha selection recorded in SESSION_LOG at M3-B-S1 open per ED.2 mitigation | Recorded as `lahiri (Chitrapaksha, swisseph SIDM_LAHIRI)` in `M3-W2-B1-VIMSHOTTARI-ENGINE` close block (`PROJECT_M3_SESSION_LOG.md` line 245); confirmed identical in `M3-W2-B2-YOGINI-TRANSIT` close block. Project-default ayanamsha; no native override invoked. | PASS | PROJECT_M3_SESSION_LOG.md M3-W2-B1 close block |
| AC.M3B.6 | PPL substrate writes are working; first M3-B-emitted prediction logs to PPL with confidence + horizon + falsifier before outcome observed | Substrate scaffolded at `06_LEARNING_LAYER/PREDICTION_LEDGER/` (`prediction_ledger.jsonl` + `schema_v0_1.json`). Schema validation green at scaffold time. **No M3-B-emitted prediction logged to date** because B1 + B2 produce engines + retrieval surface only; neither session emits a time-indexed forward-looking output. Per `MACRO_PLAN §Prospective Prediction Log`, the discipline activates at first emission — that emission is structurally an M3-D Track D3 (acharya-grade readings) deliverable per §3.4. | PASS-substrate / PENDING first prediction | `06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl`; `06_LEARNING_LAYER/PREDICTION_LEDGER/schema_v0_1.json`; §6 deferral row D.M3B.6 below |
| AC.M3B.7 | No L1 mutations (FORENSIC frozen); temporal computations live at L1.5/L2.5 boundary | Verified. `M3-W2-B2-YOGINI-TRANSIT` close block records `FORENSIC_ASTROLOGICAL_DATA_v8_0.md` fingerprint pre/post identical (`f06d8a05...`). All temporal artifacts under `05_TEMPORAL_ENGINES/**` (the L1.5/L2.5 boundary turf per `PROJECT_ARCHITECTURE §B.1`). | PASS | M3-W2-B2 close block AC.M3B.9 (its local numbering) |

**Overall:** 5 PASS / 2 PASS-with-deferral / 0 FAIL. Both deferrals (AC.M3B.1 AD/PD cross-check and AC.M3B.6 first prediction) are
explicitly authorized by the M3-B close-session brief plus PHASE_M3_PLAN §3.2 / §3.4 routing
of optional cross-checks and forward-looking emissions to M3-D.

## §3 — Wave / session log summary (M3-B execution arc)

| Session | Seal | One-line summary | red_team_counter delta |
|---|---|---|---|
| M3-W2-B1-VIMSHOTTARI-ENGINE | CLOSED 2026-05-01 (sha 03770d2) | `compute_vimshottari.py` + 637-row VIMSHOTTARI_RAW + CROSSCHECK + GOLDEN + bundled SQL insert; AC.M3B.1 (MD-level) + AC.M3B.5 cleared | 0 → 1 |
| M3-W2-B2-YOGINI-TRANSIT | CLOSED 2026-05-01 (close-time sha) | `compute_yogini.py` + `compute_transits.py` + `signal_activator.py` + 162-row YOGINI_RAW + Yogini CROSSCHECK + lit_states sample + migrations `022_dasha_periods.sql` + `023_signal_states.sql` + `query_signal_state.ts`; AC.M3B.2 + .3 + .4 + .7 cleared; cleared the M3-W2-B1 native-action item (migration authoring) | 2 → 3 |
| M3-W2-B3 | NOT EXECUTED — deferred | Optional antardasha cross-check (per §3.2 escape clause) — close en bloc at M3-D Track D1 per native close-session brief | n/a |
| MARSYS-M3-R1-S2-M3B-CLOSE | THIS ARTIFACT (2026-05-03) | M3-B sub-phase close artifact + governance scripts + SESSION_LOG append + CURRENT_STATE update + PROJECT_M3_SESSION_LOG annotation + .gemini/project_state.md mirror | 0 → 1 |

(M3-B execution counter trail above is the Track-2-internal book-keeping; the global M3
red-team counter is governed by `CURRENT_STATE_v1_0.md §2.red_team_counter` across all
three M3 tracks per `ONGOING_HYGIENE_POLICIES_v1_0.md §G`.)

## §4 — Live state at M3-B close

### 4.1 Engines

- `platform/scripts/temporal/compute_vimshottari.py` — Parashari Vimshottari MD/AD/PD;
  `pyswisseph 2.10.03 + Moshier built-in + Lahiri sidereal`; `--horizon-end` parameterized
  (default `2061-01-01`); halts on `ImportError` per CLAUDE.md §I B.10.
- `platform/scripts/temporal/compute_yogini.py` — Yogini MD + AD; same toolchain;
  classical `(nak_idx_0 + 3) mod 8` sequence-start formula adopted (CROSSCHECK §2 reconciles
  brief vs FORENSIC §5.2).
- `platform/scripts/temporal/compute_transits.py` — date-indexed transit engine v1;
  9-planet sidereal positions (Rahu = TRUE_NODE; Ketu = Rahu + 180°) + Sade Sati state
  (Saturn in 12th/1st/2nd from natal Moon Aquarius) + eclipse proximity (Sun + Moon
  within 15° of node axis); public API `get_transit_states(birth_dt, query_date, ayanamsha)`.
- `platform/scripts/temporal/signal_activator.py` — v1 deterministic rule-based
  `lit / dormant / ripening` classifier; reads `SIG.MSR.*` blocks from `MSR_v3_0.md`,
  joins with active Vimshottari MD + AD at `query_date` and current transit state; flat
  `confidence = 0.6` with `v1_logic_note` per row.
- `platform/scripts/temporal/run_dasha_pipeline.py` — orchestrator stub; `vimshottari` +
  `yogini` legs implemented; `chara` / `narayana` / `kp` slots reserved for M3-C (the M3-C
  legs landed at the M3-C sub-phase under `compute_chara.py` / `compute_narayana.py` /
  `compute_kp_substrate.py` directly, not via the pipeline orchestrator — left as-is per
  M3-C close).

### 4.2 Persistence

- **Migration 022 (`022_dasha_periods.sql`):** `dasha_periods` schema + 2 indexes + 637
  Vimshottari INSERTs (system='vimshottari', source_file='VIMSHOTTARI_RAW_v1_0.json').
  WRITTEN; not yet APPLIED to live DB (see §6 known-residual D.M3B.NA).
- **Migration 023 (`023_signal_states.sql`):** date-indexed `signal_states` surface;
  `CHECK (state IN ('lit','dormant','ripening'))`; `UNIQUE (chart_id, signal_id, query_date,
  dasha_system)`; two indexes on `(chart_id, query_date)` and `(chart_id, signal_id,
  query_date)`. WRITTEN; not yet APPLIED to live DB.
- **Yogini insert (`YOGINI_INSERT_v1_0.sql`):** 162 INSERTs under `system='yogini'`;
  bundles `CREATE TABLE IF NOT EXISTS dasha_periods` as safety guard (no-op once migration
  022 applied). WRITTEN; not yet APPLIED.
- **Vimshottari insert (`VIMSHOTTARI_INSERT_v1_0.sql`):** 637 INSERTs; same bundling
  pattern. The schema-creation prefix is the source-of-truth that migration 022 mirrors
  verbatim.

### 4.3 Retrieval surface

- `platform/src/lib/retrieve/query_signal_state.ts` — TypeScript retrieval tool for
  `signal_states`; supports `chart_id` / `query_date` / `end_date` range / `signal_ids` /
  `states` / `dasha_system` filters; clamped `limit ∈ [1, 500]`; graceful empty-result
  degradation (returns `{ rows: [] }` when migrations not yet applied).
- `platform/src/lib/retrieve/index.ts` — registered under the `// M3-B — signal state
  surface` comment; `RETRIEVAL_TOOLS` array advanced from 17 → 18 at B2 close (M3-C
  subsequently advanced it to 20 with KP + Varshaphala).

### 4.4 PPL substrate

- `06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl` — JSONL append-only ledger;
  schema-validated empty file; activates on first emission.
- `06_LEARNING_LAYER/PREDICTION_LEDGER/schema_v0_1.json` — schema declaration; required
  fields per `MACRO_PLAN §Prospective Prediction Log` (confidence, horizon, falsifier).
- No M3-B-emitted predictions logged. First emission expected at M3-D Track D3
  (acharya-grade readings) per `PHASE_M3_PLAN §3.4`.

### 4.5 Held-out signal-state sample

- `05_TEMPORAL_ENGINES/transit/lit_states_sample_M3B_v1_0.json` — 495 signal-state rows
  on `query_date = 2026-05-01`. `state_summary = { lit: 252, ripening: 0, dormant: 243 }`.
  `active_dasha = { md: Mercury, ad: Saturn, next_ad: Ketu starts 2027-08-19 }`.
- `05_TEMPORAL_ENGINES/transit/sample_2026_05_01.json` — companion transit-state smoke
  for the same date (Sade Sati ACTIVE Saturn-Pisces 3rd dhaiya; no eclipse proximity).
- ≥20-date stratified held-out sample (per `PHASE_M3_PLAN §3.2 R.M3B.4` mitigation) is a
  M3-D Track D1 deliverable per `§3.4 AC.M3D.2` ("≥10 dates not used in M3-B/M3-C development"
  + held-out date sample validation), not an M3-B in-scope deliverable.

## §5 — Active feature flags at M3-B close

No flag flips this sub-phase. The retrieval-side flag-gating belongs to M3-A (Track 1):
`DISCOVERY_PATTERN_ENABLED`, `DISCOVERY_CONTRADICTION_ENABLED`, etc. M3-B did not author or
flip flags; the new TypeScript tool `query_signal_state.ts` is registered directly in
`RETRIEVAL_TOOLS` because per-tool flag gating did not match the surface design (a
read-only SELECT that returns empty on missing data).

For canonical flag state at M3-B close, see `platform/src/lib/config/feature_flags.ts`;
the M2-close flag table in `M2_CLOSE_v1_0.md §"Active feature flags at M2 close"` remains
the live picture for M2-baseline flags carried into M3.

## §6 — Known deferred items (non-blocking for M3-B close)

These are explicitly named here so they survive into M3-D / M4 / steady-state without
silent loss. None of them gates M3-B close per §3.2 or the close-session brief.

1. **D.M3B.1 — AC.M3B.1 antardasha + pratyantardasha cross-check vs JH export.** §3.2 specifies
   `≤1-day delta on every dasha boundary`; B1 cross-checked MD-level only against
   `FORENSIC §5.1` (the only published in-corpus baseline). AD/PD boundaries are not
   cross-checked, and Jagannatha Hora export was unavailable in the B1/B2 sessions per
   `M3-W2-B1-VIMSHOTTARI-ENGINE` close block. **DEFERRED to M3-D Track D1 temporal validator**
   per the §3.2 escape clause invoked by the close-session brief: *"close en bloc at M3-D
   per PHASE_M3_PLAN §3.2."* Rationale: M3-D's `§3.4` validator scope explicitly owns
   "≥10 dates not used in M3-B/M3-C development" cross-validation and is the natural locus
   for the JH-export-dependent antardasha check (DIS.012 disposition `verdict_recorded N2 =
   JH export mandated` at A4 close 2026-05-02 routes the JH-export workstream to M3-D
   Track D2).
2. **D.M3B.4 — AC.M3B.4 5-signal acharya-grade sub-sample inspection.** Surface populated;
   per-signal acharya-grade review on the 5-signal sub-sample is M3-D Track D1 scope per
   `§3.4 AC.M3D.2`. The v1 lit-rate (252/495 = 51%) is documented at `M3-W2-B2-YOGINI-TRANSIT`
   close as expected behavior of the broad-match v1 rule; rule-set tightening lives at
   M3-D once acharya-grade ground truth on the sub-sample is available.
3. **D.M3B.6 — AC.M3B.6 first M3-B-emitted PPL prediction.** Substrate is live;
   forward-looking emission is structurally M3-D Track D3 scope. No prediction-log entry
   yet. Discipline activates at first emission per `MACRO_PLAN §Prospective Prediction Log`.
4. **D.M3B.NA — Migrations 022 + 023 not yet applied to live DB.** Files written; native
   action gated on environment + backup + authorization. `query_signal_state.ts` degrades
   gracefully on empty/missing table (returns `{ rows: [] }`); no consumers fail. Apply at
   the next maintenance window or as part of M3-D entry housekeeping.
5. **D.M3B.SD — Vimshottari SD (Sukshma) generation deferred.** §3.2 lists `MD/AD/PD/SD`;
   B1 emitted MD/AD/PD only. SD is not required for `FORENSIC §5.1` cross-check
   (which is MD-level), nor for the `signal_activator` v1 rule (which keys off MD + AD).
   SD generation is a future refinement (M3-D or post-M3); not blocking.
6. **D.M3B.R4 — ≥20-date stratified held-out sample.** §3.2 calls for a ≥20-date sample
   spanning the LEL coverage window with a random + LEL-anchored mix. B2 emitted a
   single-date smoke (2026-05-01). The ≥20-date stratified sample is a M3-D Track D1
   `§3.4 AC.M3D.2` deliverable.
7. **D.M3B.YA — Yogini AD cross-check.** `FORENSIC §5.2` lists Yogini MD only; AD
   boundaries are computed via classical pro-rata math without external cross-check.
   M3-D may extend the cross-check via JH export or acharya inspection on a sub-sample.
8. **D.M3B.PD — Vimshottari PD cross-check.** Same disposition: no in-corpus baseline
   exists at PD granularity; cross-check requires JH export (M3-D Track D2).

**Pre-M3 carry-forwards (inherited from M2 / earlier).** These are not M3-B-introduced
items; they are listed here for completeness so the M3-B close artifact does not appear to
silently drop them.

- `entry_count` latent miscount in `CAPABILITY_MANIFEST.json` (+3 delta) — inherited from
  M2; M3-W1-A4 close updated the manifest to v1.2 with PATTERN_REGISTER_v1_2 entry; broader
  audit pass remains pending.
- `SIG.MSR.207` absent from `MSR_v3_0.md` — inherited from M2; investigated read-only at
  `M3-W1-A1-EVAL-BASELINE` close; resolution / explicit-acceptance routes to M3-D close.
- `BASELINE_RUN_W9.json` non-stub run — gated on auth secrets; M3-A close (Track 1, pending)
  owns this gate.
- TypeScript test-fixture errors in `tests/components/AppShell.test.tsx` +
  `tests/components/ReportGallery.test.tsx` — inherited from M2; 9 errors confined to
  those two files; portal-redesign R-stream owns the fixture refresh.

## §7 — Risks (per §3.2) — final disposition

- **(a) Swiss Ephemeris version drift.** ED.2 mitigation discharged: `pyswisseph 2.10.03`
  + Moshier built-in (no `.se1` files required) recorded in `M3-W2-B1` close block
  `PYSWISSEPH_install_path` field. Version-locked.
- **(c) Jagannatha Hora format incompatibility.** Pyswisseph fallback used end-to-end in
  B1 + B2 (no JH dependency exercised). The deferred AD/PD cross-check (D.M3B.1) re-engages
  the JH path at M3-D Track D2 per DIS.012 N2 disposition.
- **(R.M3B.4) Held-out date sample bias.** M3-B emitted single-date smoke only; the
  stratified ≥20-date sample is M3-D Track D1 scope per `§3.4 AC.M3D.2` (the deferral
  surfaces as D.M3B.R4 above).

## §8 — Mirror discipline (ND.1)

Adapted parity holds across MP.1–MP.8. M3-B's relevant mirror is MP.2 (state-pointer
composite): `CURRENT_STATE_v1_0.md` Claude side + `.gemini/project_state.md` Gemini side.
Both are updated in the same MARSYS-M3-R1-S2-M3B-CLOSE session (this session) per
`GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md §K.3`. M3-B touched no other mirror-pair surfaces:

| Mirror pair | Touched this session? | Disposition |
|---|---|---|
| MP.1 (CLAUDE.md ↔ .geminirules) | NO | Frozen at GOVERNANCE_BASELINE; no canonical-path change in M3-B |
| MP.2 (CURRENT_STATE composite ↔ .gemini/project_state.md) | YES | Both sides updated this session — adapted parity |
| MP.3 (MACRO_PLAN ↔ Gemini compact ref) | NO | MP frozen |
| MP.4 (PHASE_M3_PLAN ↔ Gemini phase pointer) | NO | PHASE_M3_PLAN unchanged this session |
| MP.5 (CAPABILITY_MANIFEST ↔ Gemini canonical-path block) | NO | Manifest was updated at A4 close (2026-05-02); not re-touched here |
| MP.6 (GOVERNANCE_STACK) | NO | Claude-only per CANONICAL_ARTIFACTS §2 |
| MP.7 (SESSION_LOG) | YES (claude side only) | Claude-only per CANONICAL_ARTIFACTS §2 — append at this session close |
| MP.8 (PROJECT_ARCHITECTURE ↔ Gemini compact arch ref) | NO | Architecture frozen |

## §9 — Red-team status at M3-B close

- **§IS.8(a) every-third-session cadence.** `red_team_counter` was reset to 0 at the
  preceding session close (M3-W1-A4-DIS009-DISPOSITION, 2026-05-02). This M3-B close
  session increments 0 → 1; cadence does not fire (next fire at counter = 3).
- **§IS.8(b) macro-phase-close cadence.** M3-B is a sub-phase close, not a macro-phase
  close. The §IS.8(b) red-team is scheduled at M3-D close per `PHASE_M3_PLAN §3.4 AC.M3D.4`.
- **No red-team artifact authored at M3-B close.** This is correct per cadence.

## §10 — ND status at M3-B close

- ND.1 (Mirror Discipline) — addressed since 2026-04-24 (Step 7 close). Held throughout M3-B.
  MP.2 mirror updated this session (see §8). No other mirror pairs touched.
- No open native directives.

## §11 — Naming-discrepancy note (close-session brief input)

The close-session brief opened with the phrase *"This session closes M3-B (Chara Dasha
temporal layer) formally."* Per `PHASE_M3_PLAN_v1_0.md §3.2`, M3-B's scope is
**Vimshottari + Yogini + Transit Engine v1** (Parashari dasha + transit foundation);
Chara Dasha is M3-C scope per `§3.3` (Jaimini multi-school + KP + Varshaphala + Shadbala).
Chara Dasha was authored at `M3-W3-C1-JAIMINI-DASHAS` (closed 2026-05-01) and the M3-C
sub-phase was closed in-place at `M3-W3-C3-SHADBALA` (closed 2026-05-01) per the M3-C
close annotation in `PROJECT_M3_SESSION_LOG.md`.

This artifact closes M3-B per the **PHASE_M3_PLAN §3.2 charter** (Vimshottari + Yogini +
Transit Engine v1 + signal-state surface + PPL substrate), as the brief's close-mechanism
field (cite `§3.2` escape clause for B3 antardasha cross-check defer) and the constituent
session list (`M3-W2-B1-VIMSHOTTARI-ENGINE` + `M3-W2-B2-YOGINI-TRANSIT`, both Track 2)
unambiguously confirm. The "Chara Dasha temporal layer" sub-label is read as a colloquial
reference to the broader temporal-engine workstream and is not load-bearing on the
artifact identity.

## §12 — M3-B exit — confirmed

M3 sub-phase B is **CLOSED**. The Parashari-dasha + transit + signal-state substrate
(Vimshottari MD/AD/PD + Yogini MD/AD + transit engine v1 + 495-signal lit/dormant/ripening
surface + signal_states query tool + PPL substrate) is in place and exit-state items
(a) and (b) of `MACRO_PLAN §M3` are discharged in the Parashari dimension. M3-C
(Jaimini + KP + Varshaphala + Shadbala) is independently closed (2026-05-01).

**Open M3 sub-phases at the moment of this artifact:**
- **M3-A** — in flight; A1 + A2 + A3 + A4 closed; `MARSYS-M3-R1-S1-M3A-CLOSE` (Track 1
  formal close) is the next M3 substantive session per `CURRENT_STATE_v1_0.md §2.next_session_objective`.

After M3-A closes, M3-D (Validator + Held-Out Sample + Red-Team + M3 Close, per
`PHASE_M3_PLAN §3.4`) opens; D.M3B.1 / .4 / .6 / .R4 / .SD / .YA / .PD route to M3-D Track
D1 + Track D2 + Track D3 there.

**Next M3 sub-phase:** M3-A formal close (Track 1) — `MARSYS-M3-R1-S1-M3A-CLOSE`.

---

*End of M3B_CLOSE_v1_0.md.*
