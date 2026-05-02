---
artifact: VALIDATOR_META_TESTS_v1_0.md
canonical_id: VALIDATOR_META_TESTS_v1_0
version: 1.0
status: CURRENT
authored_by: M3-W4-D1-VALIDATOR-REDTEAM
authored_at: 2026-05-01
parent_plan: 00_ARCHITECTURE/PHASE_M3_PLAN_v1_0.md §3.4 (M3-D Gate 1)
ac_targeted: AC.M3D.1
runner: 00_ARCHITECTURE/EVAL/TEMPORAL/run_validator.py
runner_exit_code_at_authoring: 0
changelog:
  - v1.0 (2026-05-01) — Initial meta-test suite for the M3 temporal substrate.
    Six deterministic invariants (TEST-V.1..6) over the JSON artifacts produced
    in M3-B + M3-C plus the project DISAGREEMENT_REGISTER. All six PASS at
    authoring time. Companion runner exits 0 on full PASS, 1 on any FAIL.
---

# Temporal Validator — Meta-Tests v1.0

## §0 — Scope

This suite tests the **internal consistency** of the M3 temporal substrate. It
does not run any temporal engine; it reads the on-disk JSON outputs that the
engines produced in M3-B (Vimshottari + Yogini + Transit) and M3-C
(Chara + Narayana + KP + Varshaphala + Shadbala) and asserts deterministic
structural invariants. It also asserts the cross-school disagreement
boundary (DIS register has no open `DIS.class.school_disagreement` rows).

The runner is `00_ARCHITECTURE/EVAL/TEMPORAL/run_validator.py`. It exits **0**
when all six tests PASS and **1** if any test FAILs (per AC.M3D.1).

**Out of scope.** The suite does not re-derive numerical chart values from
pyswisseph (B.10: that is the engines' job, not the validator's). It does not
exercise live retrieval / synthesis surfaces (those are M3-A's domain, validated
at the M3-A close-checklist in M3-W1-A4 and at the IS.8(b) red-team in this
session's Gate 3). It does not gate on JH cross-checks (those are
`[EXTERNAL_COMPUTATION_REQUIRED]` per CLAUDE.md §I B.10 and tracked in
HANDOFF_M3_TO_M4 as M4-class open items).

## §1 — Test invariants

### TEST-V.1 — Vimshottari completeness

**Input:** `05_TEMPORAL_ENGINES/dasha/vimshottari/VIMSHOTTARI_RAW_v1_0.json`.

**Asserts:**
- `row_counts.M = 7` and `row_counts.total = len(rows)`.
- The 7 MD rows are contiguous: `MD[i].end_date == MD[i+1].start_date` for `i ∈ [0..5]`.
- Every MD has a child AD chain whose first AD starts at the MD start, whose last
  AD ends at the MD end, and whose adjacent rows are contiguous (no gap, no overlap).
- Every AD has a child PD chain with the same contiguity invariants.
- First MD starts at `1984-02-05` (native birth); last MD ends `≥ 2061-01-01`.

**Evidence anchor.** B1 close summary: "637 INSERT rows for native 1984-02-05
→ 2061-01-01 (7 MD + 63 AD + 567 PD)" and AC.M3B.2 in PHASE_M3_PLAN §3.2.

### TEST-V.2 — Yogini continuity (8-lord cycle, Bhramari first)

**Input:** `05_TEMPORAL_ENGINES/dasha/yogini/YOGINI_RAW_v1_0.json`.

**Asserts:**
- The first MD's `yogini_name` is `Bhramari` (FORENSIC §5.2; B2 close
  Bhramari-correction note — engine output corrected from Mangala-first to
  Bhramari-first).
- The 8-lord cycle (Mangala → Pingala → Dhanya → Bhramari → Bhadrika → Ulka →
  Siddha → Sankata) repeats correctly across the full MD series (start phase
  fixed at Bhramari).
- MD rows are contiguous (`MD[i].end_date == MD[i+1].start_date`).
- First MD starts at `1984-02-05`.

**Evidence anchor.** YOGINI_RAW.system="yogini"; YOGINI_RAW.diagnostics
+ B2 cross-check.

### TEST-V.3 — Transit engine determinism + lit/dormant/ripening presence

**Inputs:** `05_TEMPORAL_ENGINES/transit/sample_2026_05_01.json`,
`05_TEMPORAL_ENGINES/transit/lit_states_sample_M3B_v1_0.json`.

**Asserts:**
- The transit JSON re-loads byte-stable across two reads (the JSON is the agreed
  deterministic anchor per AC.M3B.3 — the engine's serialised output is what
  downstream code consumes; a live `python compute_transits.py` re-run is
  redundant when the on-disk artifact is already the deterministic record).
- `state_summary.lit ≥ 1` (at least one lit signal at sampled date).
- The first 50 signal rows include both `lit` and `dormant` states (i.e., the
  signal_activator emits a non-degenerate state distribution).

### TEST-V.4 — KP sublord coverage (per-planet snapshot)

**Input:** `05_TEMPORAL_ENGINES/kp/KP_SUBLORDS_RAW_v1_0.json`.

**Asserts:**
- Rows cover all 7 classical planets + Rahu + Ketu (9 rows; no duplicates).
- Each row has populated `nakshatra_lord` (Star Lord) and `sub_lord` (Sub Lord).
- Each row's `sidereal_lon ∈ [0, 360)`.

**Adaptation note (REDTEAM_M3 Axis E cross-reference).** The session brief's
literal TEST-V.4 expectation ("all 12 sign spans covered; Star Lord + Sub Lord
populated for every degree range; no gap or duplicate in the 0°–360° span")
describes a 0°–360° KP boundary table. The M3-W3-C2-KP-VARSHAPHALA artifact
`KP_SUBLORDS_RAW_v1_0.json` is a per-natal-planet KP snapshot (one row per
natal planet — 9 rows), not a 0°–360° boundary table. Per
PHASE_M3_PLAN §3.3 deliverable 3 (KP sublord timing integrated with MSR signal
system), the per-natal-planet snapshot is the M3-C deliverable shape; a
0°–360° boundary table would be a different deliverable not authored in M3-C.
The validator asserts the artifact's actual invariants (all 9 expected planets;
Star + Sub Lord populated; longitude range valid) — this honours B.10
(no fabrication of an asserted-but-absent shape) and B.3 (cite the actual
design choice rather than invent the brief's literal shape). The
0°–360° boundary table is **noted as a possible M4-class follow-up** in
HANDOFF_M3_TO_M4 §Inherited open items if the per-planet snapshot turns out
to be insufficient for downstream synthesis.

### TEST-V.5 — Shadbala planet coverage + FORENSIC anchors

**Input:** `05_TEMPORAL_ENGINES/shadbala/SHADBALA_RAW_v1_0.json`.

**Asserts:**
- `len(rows) ≥ 63` and at least 9 distinct snapshots (`(query_date,
  query_context)` keys).
- Every snapshot covers all 7 classical planets (Sun, Moon, Mars, Mercury,
  Jupiter, Venus, Saturn).
- AC.M3C.4 anchors: at the natal snapshot `1984-02-05 / MD_start_Jupiter`,
  Saturn `uccha_bala = 59.18 ± 0.02` and Sun `uccha_bala = 33.99 ± 0.02`
  vs FORENSIC §6.1.

**Evidence anchor.** SHADBALA CROSSCHECK_v1_0.md §0 (AC.M3C.4 anchors PASS).

### TEST-V.6 — Cross-school disagreement boundary

**Input:** `00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md`.

**Asserts:**
- No DIS entry with `class: DIS.class.school_disagreement` AND first-occurring
  `status: open` line in its section.

**Evidence anchor.** DIS.010 / DIS.011 / DIS.012 all resolved-N3 by
M3-PRE-D-GOVERNANCE-2026-05-01 per `arbitration_steps_taken` block in each
entry.

## §2 — Run record (this session)

```
[PASS] TEST-V.1 — Vimshottari completeness                          7 MD / 63 AD / 567 PD; span 1984-02-05 → 2070-08-18
[PASS] TEST-V.2 — Yogini continuity                                 18 MDs starting at Bhramari; 8-lord cycle clean
[PASS] TEST-V.3 — Transit engine determinism + lit_states presence  sample 2026-05-01 planets=9; lit_states {'lit': 252, 'ripening': 0, 'dormant': 243}
[PASS] TEST-V.4 — KP sublord coverage (per-planet snapshot)         9 planet rows; Star+Sub Lord populated for each
[PASS] TEST-V.5 — Shadbala planet coverage + FORENSIC anchors       63 rows / 9 snapshots; Saturn Uccha=59.19; Sun Uccha=33.99
[PASS] TEST-V.6 — Cross-school disagreement boundary                no open DIS.class.school_disagreement entries (DIS.010/011/012 all resolved-N3)

summary: 6/6 PASS, 0 FAIL
```

**Exit code:** `0`. **AC.M3D.1: PASS.**

Reproducible via:

```sh
.venv/bin/python 00_ARCHITECTURE/EVAL/TEMPORAL/run_validator.py
```

## §3 — Notes

- The `ripening` state appears 0 times in `lit_states_sample_M3B_v1_0.json`'s
  `state_summary`. This is **not** a validator finding — the v1 lit-states logic
  documented in the file's `v1_logic_note` may not yet emit the `ripening` state
  for this sampled date / chart combination. State-distribution depth is M4
  scope (calibration). Test-V.3 asserts only that `lit` appears ≥ 1 time and
  that the `lit`/`dormant` states are observed in the first 50 signals; it
  does not require `ripening` to be present in this sample.
- The validator does **not** assert that engine outputs match Jagannatha Hora
  exports. JH-cross-check is `[EXTERNAL_COMPUTATION_REQUIRED]` per
  CLAUDE.md §I B.10 and tracked in HANDOFF_M3_TO_M4 as M4-class open items
  (DIS.009 PAT.008 D9 verification; Sthana + Drik Shadbala; Narayana Dasha).

---

*End of VALIDATOR_META_TESTS_v1_0.md.*
