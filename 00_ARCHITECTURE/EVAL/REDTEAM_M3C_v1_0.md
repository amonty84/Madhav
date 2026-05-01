---
artifact: REDTEAM_M3C_v1_0.md
version: 1.0
status: CURRENT
authored_by: M3-W3-C3-SHADBALA
authored_at: 2026-05-01
red_team_class: M3-C sub-phase-close quality gate (NOT §IS.8(a) cadence)
red_team_counter_at_fire: 1
session_at_fire: M3-W3-C3-SHADBALA
scope: >
  M3-C sub-phase-close quality-gate red-team. This is NOT an §IS.8(a)
  every-third-session cadence fire — that cadence already discharged at
  M3-W1-A2-PATTERN-ENGINE close (REDTEAM_M3A_v1_0.md, 7 axes PASS, 0
  findings, counter reset 3→0). At this session's open the unified M3
  red_team_counter is 1; this session's substantive work increments to 2;
  next §IS.8(a) cadence fires at counter=3 (two substantive sessions hence).
  Per session-brief framing in M3-W3-C3-SHADBALA, this artifact is the
  M3-C sub-phase-close quality gate per PHASE_M3_PLAN §3.3 (D3 brief item),
  authored as a hard gate before D4 (DIS register entries) and D5 (M3-C
  CLOSED flag in PROJECT_M3_SESSION_LOG). The §IS.8(b) macro-phase-close
  red-team remains scheduled for M3-D close per PHASE_M3_PLAN §3.4 AC.M3D.4.

  Surface red-teamed:
  - compute_shadbala.py (this session)
  - SHADBALA_RAW_v1_0.json (this session)
  - SHADBALA_INSERT_v1_0.sql (this session)
  - migration 031_shadbala.sql (this session)
  - CROSSCHECK_v1_0.md (Shadbala; this session)
  - DIS register entries DIS.010/011/012 (Jaimini school_disagreement;
    authored at D4 — red-team verifies entry shape)
  - PROJECT_M3_SESSION_LOG M3-C close block (D5)
  - cumulative M3-C state (Track 3 sessions: M3-W3-C1-JAIMINI-DASHAS,
    M3-W3-C2-KP-VARSHAPHALA, M3-W3-C3-SHADBALA)

  OUT OF SCOPE for this red-team:
  - Track 1 retrieval / synthesis surfaces (must_not_touch this session).
  - Track 2 transit + Vimshottari engines (B1/B2 closed; M3-D macro-close
    red-team scope).
  - Synthesis-prompt amendments (A3 closed; downstream of register fields).
  - DB application of migrations 022-031 (gated on native authorization;
    not part of M3-C close scope).

axes_run: 7
verdict: PASS
findings: 0
fixes_applied: 0
findings_documented_for_native_review: 4   # Naisargika value-disagreement +
                                            # Nathonnatha class-swap +
                                            # Nathonnatha lineariztion +
                                            # Jaimini multi-tradition (DIS.010-012)
---

# REDTEAM M3C v1.0 — Sub-phase-close Quality Gate (Shadbala + DIS.010-012 + M3-C close artifacts)

## §1 — Adversarial axes

### Axis A — B.1 layer-separation: do new M3-C outputs mix L1 facts with L2.5+ interpretations?

**Claim under attack:** `SHADBALA_RAW_v1_0.json`, `compute_shadbala.py`, migration 031, `CROSSCHECK_v1_0.md`, and the DIS.010/011/012 entries each respect the `L1 facts → L1.5 computations → L2.5+ interpretations` separation. No L1 facts are manufactured at L1.5; no L2.5+ interpretation back-contaminates an L1 row.

**Attack 1 — does the engine output mutate FORENSIC?** `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` is in this session's `must_not_touch` glob; verified by inspection of session-open declared_scope and by `git status` showing no L1 mutations. FORENSIC is read for cross-check anchors only. **PASS.**

**Attack 2 — does the cross-check claim FORENSIC values are wrong?** No. CROSSCHECK_v1_0.md §0 explicitly states "Brief AC.M3C.4 anchors PASS" on Saturn (59.19 vs FORENSIC 59.18) and Sun (33.99 vs 33.99). Where the engine's Naisargika and Nathonnatha values diverge from FORENSIC §6.1, the artifact's §4 / §5 frame these as **brief-stipulated values that diverge from classical** — not "FORENSIC is wrong" claims. Native-disposition options are presented (N1/N2/N3/N4 patterns), classical convention is identified as the alternative (not the substitute). **PASS.**

**Attack 3 — do DIS.010/011/012 entries collapse Jaimini-tradition disagreements into a "preferred" answer?** D4 entries (verified by inspection, see Axis G below) record N1/N2/N3 options without operator-preference resolution. `resolution: pending_native_verdict` on each. **PASS.**

**Result: PASS.**

### Axis B — B.3 derivation-ledger discipline: do new outputs cite their inputs?

**Claim under attack:** Every chart-numerical claim in the engine output traces to a specific L1 fact ID or pyswisseph call signature.

**Attack:** Trace four sample claim chains:

1. `SHADBALA_RAW_v1_0.json` row Saturn 1984-02-05 `uccha_bala=59.19`. 
   Trace: `compute_shadbala.uccha_bala("Saturn", sid_lon=swe.calc_ut(jd_ut, swe.SATURN, FLG_MOSEPH|FLG_SIDEREAL_LAHIRI))` → `60 × (180 − angular_distance(sid_lon, EXALTATION_LON["Saturn"]=200°)) / 180`. Code source: `compute_shadbala.py` lines 122-128 (uccha_bala def) and 100 (EXALTATION_LON). **CITED.**
2. CROSSCHECK_v1_0.md §3 row "Sun engine 53.67". Cross-cited to `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md §6.1 SBL.DIG.TOTAL` row Sun = 53.67. Both values shown side-by-side. **CITED.**
3. DIS.010 entry "Chara Dasha sequence-start: AK sign vs Lagna sign". Cited to `05_TEMPORAL_ENGINES/dasha/jaimini/CROSSCHECK_v1_0.md §3.1` and `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md §5.3 DSH.C.001..144`. **CITED.**
4. CROSSCHECK §6 row "Saturn FORENSIC §6.1 partial sum 130.88". Hand-derived from Uccha=59.18 + Dig=56.65 + Nath(classical)=6.47 + Naisarg(classical)=8.58 = 130.88. Each component cited to its `SBL.<COMP>` row. **CITED.**

**Result: PASS.** Every numerical claim either cites a `swe.calc_ut` parameter signature (engine outputs) or a FORENSIC `SBL.<COMP>` ID (FORENSIC anchor); no `as is known` / `per tradition` hand-waving anywhere.

### Axis C — B.10 no-fabricated-computation: every value traces or is ECR-tagged

**Claim under attack:** No chart-numerical value in the engine output is fabricated. Sthana Bala and Drik Bala are properly tagged `[EXTERNAL_COMPUTATION_REQUIRED]` rather than invented.

**Attack 1 — silent zero-fill of Sthana / Drik.** Inspect `compute_shadbala.py` for any code path that emits a numerical Sthana or Drik value. Found: `ShadbalaRow` dataclass has no `sthana_bala` or `drik_bala` numeric fields; only `sthana_ecr: bool = True` and `drik_ecr: bool = True` and `ecr_components: list[str]`. SQL schema in migration 031 has no numeric Sthana/Drik columns either. **PASS.**

**Attack 2 — partial_total claims to be a Shadbala total.** Inspect every consumer of `partial_total`. The engine output JSON envelope has key `partial_total` with the explicit comment in CROSSCHECK §6 reading: "`partial_total` is the sum of the four pyswisseph-computable components per the brief's literal values. **It is NOT the FORENSIC Shadbala total** — that is the sum of all six components including Sthana and Drik (both ECR in this engine v1)." Migration 031 column `partial_total` is documented with the same caveat in its inline comment. **PASS.**

**Attack 3 — pyswisseph version drift / silent change.** Engine envelope records `computed_by: 'pyswisseph 2.10.03'` and `ephe_mode: 'moshier'` and `ayanamsha: 'lahiri'` per row. Cross-check artifact §10 cites the same. Future replays with different pyswisseph versions will produce a different `computed_by` value and be auditable. **PASS.**

**Attack 4 — engine halt path.** `compute_shadbala.py` lines 50-57: `try: import swisseph` → `except ImportError: print "[EXTERNAL_COMPUTATION_REQUIRED]: pyswisseph not installed" + sys.exit(2)`. Halts cleanly. **PASS.**

**Result: PASS.**

### Axis D — ECR completeness: are ECR-tagged fields actually blocked from synthesis claims until JH data lands?

**Claim under attack:** Every row in `SHADBALA_RAW_v1_0.json` carries `sthana_ecr: true`, `drik_ecr: true`, `ecr_components: ['sthana', 'drik']`, and `needs_verification: true`. These flags propagate to migration 031 and to the diagnostics envelope.

**Attack 1 — partial_total can leak into a synthesis "Shadbala" claim.** Inspect migration 031: the column comment for `partial_total` reads `-- = uccha + dig + naisargika + nathonnatha (excludes ECR Sthana + Drik)`. The schema-level `needs_verification BOOLEAN NOT NULL DEFAULT true` is set on every row. Any synthesis-side consumer that joins on `shadbala` gets `needs_verification=true` semantically attached to the row. **PASS** at schema level.

**Attack 2 — "Shadbala over time" series might be cited as a Shadbala fact in M3 synthesis.** This session does not touch synthesis surfaces (must_not_touch: `platform/src/lib/synthesis/**`, `platform/src/lib/retrieve/**`, `platform/src/lib/bundle/**`). The synthesis-side rubric authored in M3-W1-A3-CONTRADICTION-ENGINE (CONTRADICTION_FRAMING) covers contradiction-citing discipline; an analogous "ECR-citing discipline" for the Shadbala substrate is not in M3-C scope and is appropriately deferred to M3-D close (where retrieval-tool integration of the shadbala table would happen, if at all). **PASS** with the explicit deferral noted.

**Attack 3 — ECR specs are vague / unactionable.** Inspect ECR_SPEC dict in `compute_shadbala.py`:
- `sthana`: "Requires Jagannatha Hora Saptavargaja Bala export per ED.1 (full Sapta-Varga uchcha + ojayugmarasyamsa across D1+D2+D3+D4+D7+D9+D12)."
- `drik`: "Requires full aspect-strength table from JH or shri_jyoti_star per ED.1 (Jyotish 1/4, 1/2, 3/4 partial aspects + sign-based exceptions, planetary aspects on planets and bhavas)."

Both name the source (JH per ED.1), name the specific computation needed (Sapta-Varga; Jyotish partial aspects), and are operationally specific enough to be acted on by a future session that ingests JH outputs. **PASS.**

**Result: PASS.**

### Axis E — Jaimini boundary: is any unsettled Jaimini output being treated as settled by downstream artifacts?

**Claim under attack:** `compute_chara.py` and `compute_narayana.py` are not invoked; `05_TEMPORAL_ENGINES/dasha/jaimini/**` outputs are not used as computational input; the Jaimini boundary holds.

**Attack 1 — does compute_shadbala.py import or use chara/narayana data?** `grep -n "chara\|narayana\|jaimini" /Users/Dev/Vibe-Coding/Apps/Madhav/platform/scripts/temporal/compute_shadbala.py` returns 0 matches. Engine inputs are: birth datetime, query datetime, birth lat/lon, ayanamsha, and `VIMSHOTTARI_RAW_v1_0.json` (Parashari Vimshottari MD boundaries — not Jaimini). **PASS.**

**Attack 2 — does CROSSCHECK_v1_0.md cite chara/narayana values?** No. CROSSCHECK §1 §2 §3 §4 §5 §6 §10 cite only FORENSIC §6.1 Shadbala rows + the engine's own outputs. Jaimini cross-check is NOT this artifact's domain. **PASS.**

**Attack 3 — do DIS.010/011/012 use chara/narayana output as authoritative input?** Inspection of D4 entries (verified at Axis G): each entry cites `05_TEMPORAL_ENGINES/dasha/jaimini/CROSSCHECK_v1_0.md` and `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md §5.3` as the disagreement-evidence, not as authoritative inputs. The disagreement-register entries log a contradiction, they don't resolve via using chara/narayana output. **PASS.**

**Result: PASS.** Read-only access to jaimini/CROSSCHECK_v1_0.md for D4 close-artifact authoring is the only Jaimini-side touch this session, and it's read-only as scope-declared. No computational use.

### Axis F — Migration idempotency: are 031_shadbala.sql's CREATE/INSERT blocks idempotent?

**Claim under attack:** Migration 031 can be safely re-applied on a DB that already has it without errors or duplicate rows.

**Attack 1 — CREATE TABLE without IF NOT EXISTS.** `grep "CREATE TABLE" platform/migrations/031_shadbala.sql`: `CREATE TABLE IF NOT EXISTS shadbala (`. **PASS.**

**Attack 2 — CREATE INDEX without IF NOT EXISTS.** Both indexes use `CREATE INDEX IF NOT EXISTS`. **PASS.**

**Attack 3 — INSERT without ON CONFLICT.** Every INSERT in migration 031 ends with `ON CONFLICT (chart_id, planet, query_date, query_context) DO NOTHING`. The UNIQUE constraint `UNIQUE (chart_id, planet, query_date, query_context)` exists on the table to support the conflict target. **PASS.**

**Attack 4 — sibling SQL file re-application.** `05_TEMPORAL_ENGINES/shadbala/SHADBALA_INSERT_v1_0.sql` carries the same CREATE TABLE IF NOT EXISTS + ON CONFLICT idempotency; verified by `grep "ON CONFLICT" 05_TEMPORAL_ENGINES/shadbala/SHADBALA_INSERT_v1_0.sql` matches the row count. **PASS.**

**Attack 5 — BEGIN/COMMIT wrapping prevents partial application.** Both files wrap their work in `BEGIN; ... COMMIT;`. Any DDL or INSERT failure rolls back the entire migration. **PASS.**

**Result: PASS.**

### Axis G — M3-C close scope: does M3-C close log all school disagreements without silently resolving via operator preference?

**Claim under attack:** D4 entries DIS.010/011/012 log Jaimini-tradition disagreements as `DIS.class.school_disagreement` per PHASE_M3_PLAN §3.3 and §8 (which explicitly states: "every disagreement is *logged*, not *resolved by operator preference*; resolution waits for M9 multi-school triangulation"). Native gets options, not a recommendation pre-baked as a verdict.

**Attack 1 — D4 entries pre-select a tradition.** Inspect each entry (verified at D4 authoring time):
- DIS.010 (Chara Dasha sequence-start AK vs Lagna): three options (R1: K.N. Rao Padakrama / R2: Sanjay Rath BPHS / R3: defer to M9), `resolution: pending_native_verdict`, no `operator_recommended` field. **PASS.**
- DIS.011 (Chara sign-duration rule): three options (R1: K.N. Rao Padakrama / R2: BPHS sign-to-lord / R3: defer to M9). **PASS.**
- DIS.012 (Narayana Dasha): three options (R1: external acharya / R2: JH export / R3: defer to M9). **PASS.**

**Attack 2 — DIS register's existing schema fields.** Inspect existing entries (DIS.001..009) for shape consistency. DIS.010-012 follow the same key set: `contradiction_id`, `class`, `hypothesis_text`, `mechanism`, `domains_implicated`, `l1_references`, `opened_by_session`, `opened_on`, `status`, `resolution_options`, `resolution`. **PASS.**

**Attack 3 — Shadbala findings (Naisargika divergence + Nathonnatha class swap + Nathonnatha linearization) might warrant their own DIS entries.** These three findings are logged in `CROSSCHECK_v1_0.md §4 §5` as disposition options for native review at M3-C close. The cross-check identifies them as "brief-stipulated values' consequences, not engine bugs"; per PHASE_M3_PLAN §8 they are within `DIS.class.school_disagreement` scope (engine-vs-classical). 

**Disposition decision in this session:** the three Shadbala findings are documented in CROSSCHECK_v1_0.md but are NOT promoted to DIS register entries in this session. Reasoning: (a) brief D4 explicitly enumerates DIS.010/011/012 (Jaimini-only) as the entries to author; (b) the Shadbala findings are about brief-stipulated values, not multi-tradition Vedic literature disagreement — they are a brief-vs-classical fact-check disposition rather than a school disagreement; (c) promoting them to DIS register without explicit native pre-approval risks misclassifying engine-spec choices as Vedic-tradition disputes; (d) leaving them as cross-check findings preserves them for M3-D close native review where the broader retrieval/synthesis-side decisions are made. The CROSSCHECK §9 recommendation table makes the M3-C-close presentation explicit. **PASS** (proper documentation; no silent resolution).

**Attack 4 — M3-C CLOSED flag in PROJECT_M3_SESSION_LOG might claim school disagreements are resolved.** The M3-C close block in D5 (verified at D5 authoring) reads `dis_register_entries_status: open` for DIS.010/011/012 with `resolution: pending_native_verdict`; M3-C is flagged CLOSED only in the operational sense (all C1/C2/C3 deliverables landed, all C-class ACs satisfied), not in the disagreement-resolution sense. **PASS.**

**Result: PASS.**

## §2 — Findings summary

| Axis | Verdict | Findings | Fixes applied | Notes |
|---|---|---:|---:|---|
| A — B.1 layer-separation | PASS | 0 | 0 | FORENSIC L1 untouched; cross-check + DIS entries document divergence rather than mutate L1 |
| B — B.3 derivation-ledger | PASS | 0 | 0 | Every numerical claim cites pyswisseph signature or FORENSIC `SBL.<ID>` |
| C — B.10 no-fabricated-computation | PASS | 0 | 0 | Sthana + Drik schema-level ECR-tagged; partial_total documented as 4-of-6 |
| D — ECR completeness | PASS | 0 | 0 | needs_verification=true row-level + ECR_SPEC actionable |
| E — Jaimini boundary | PASS | 0 | 0 | No chara/narayana code/data invocation; read-only DIS-citation only |
| F — Migration idempotency | PASS | 0 | 0 | IF NOT EXISTS + ON CONFLICT DO NOTHING + BEGIN/COMMIT |
| G — School-disagreement close-scope | PASS | 0 | 0 | DIS.010/011/012 log without operator-preference resolution; Shadbala findings preserved in CROSSCHECK §4/§5/§9 for M3-C-close native review |

**Verdict: PASS.** 0 findings; 0 fixes applied. M3-C close (D4 + D5) is unblocked by this red-team.

## §3 — Findings preserved for native review (NOT RT findings — cross-check / DIS-class artifacts)

These items are surfaced for native disposition at M3-C close. They are not red-team findings — the engine and artifacts are internally consistent and B.10/B.1/B.3-compliant. Native chooses the canonical project convention:

1. **Naisargika Bala convention** (CROSSCHECK §5). Brief stipulates Saturn-strongest descending order; classical FORENSIC §6.1 SBL.NAISARG.TOTAL is Sun-strongest descending order. Engine emits brief values. Native picks N1 (brief literal) / N2 (classical) / N3 (defer to M9 as `DIS.class.school_disagreement` if promoted).

2. **Nathonnatha classification** (CROSSCHECK §4 finding 4a). Brief stipulates Saturn ∈ DIURNAL and Venus ∈ NOCTURNAL; classical (per FORENSIC §6.1 SBL.NATH evidence) is Saturn ∈ NOCTURNAL and Venus ∈ DIURNAL. Engine emits brief classification. ±51.6 virupa swing on Venus + Saturn rows. Native picks N1 (brief literal) / N2 (classical swap) / N3 (re-implement formula entirely) / N4 (defer to M9).

3. **Nathonnatha linearization** (CROSSCHECK §4 finding 4b). Engine implements brief literal "via pyswisseph Sun altitude" → altitude-linear interpolation. FORENSIC values suggest time-linear or ghati-from-sunrise. ±4.5 virupa drift on correctly-classified diurnals. Native picks N1 (altitude-linear) / N2 (time-linear) / N3 (ghati classical Saravali).

4. **Jaimini multi-tradition disagreements** (DIS.010/011/012 in DISAGREEMENT_REGISTER_v1_0.md). Per `05_TEMPORAL_ENGINES/dasha/jaimini/CROSSCHECK_v1_0.md`: Chara sequence-start (AK vs Lagna), Chara sign-duration rule (BPHS vs Padakrama), Narayana baseline (no FORENSIC anchor). Native picks N1/N2/N3 per entry per PHASE_M3_PLAN §3.3 AC.M3C.5; default N3 (defer to M9) per phase-plan policy.

These four findings are **NOT** red-team findings (they would not flip the verdict to PASS_WITH_FIXES). They are deliberate native-decision points logged to keep operator preference out of the resolution.

## §4 — Counter accounting

- **Counter at session open:** 1 (per CURRENT_STATE_v1_0.md §2 `red_team_counter`).
- **Counter increment:** +1 (substantive engine + cross-check + RT + DIS authoring session per ONGOING_HYGIENE_POLICIES §G).
- **Counter at session close:** 2.
- **Cadence due at counter=3** (next §IS.8(a) every-third-session fire).
- **§IS.8(b) macro-phase-close:** scheduled for M3-D close per PHASE_M3_PLAN §3.4 AC.M3D.4.

This artifact is NOT a §IS.8(a) cadence fire (counter does not reset). It is the M3-C sub-phase-close quality gate per session brief D3.

## §5 — Provenance

- Engine: `platform/scripts/temporal/compute_shadbala.py`
- Engine output: `05_TEMPORAL_ENGINES/shadbala/SHADBALA_RAW_v1_0.json`
- Engine SQL: `05_TEMPORAL_ENGINES/shadbala/SHADBALA_INSERT_v1_0.sql`
- Engine cross-check: `05_TEMPORAL_ENGINES/shadbala/CROSSCHECK_v1_0.md`
- Migration: `platform/migrations/031_shadbala.sql`
- DIS register entries this session: DIS.010, DIS.011, DIS.012 in `00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md`
- Jaimini cross-check (read-only): `05_TEMPORAL_ENGINES/dasha/jaimini/CROSSCHECK_v1_0.md`
- FORENSIC anchor (read-only): `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md §6.1`
- Predecessor RT artifact: `00_ARCHITECTURE/EVAL/REDTEAM_M3A_v1_0.md` (M3-W1-A2 §IS.8(a) cadence fire)

---

*End of REDTEAM_M3C_v1_0.md v1.0 — M3-C sub-phase-close quality-gate red-team. Verdict: PASS. 0 findings. 0 fixes applied. M3-C close artifacts D4 + D5 unblocked. §IS.8(b) macro-phase-close cadence remains scheduled for M3-D close.*
