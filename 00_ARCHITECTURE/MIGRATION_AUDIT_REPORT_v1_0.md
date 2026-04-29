---
artifact: MIGRATION_AUDIT_REPORT_v1_0.md
canonical_id: MIGRATION_AUDIT_REPORT
version: "1.0"
status: COMPLETE
produced_during: Forensic Migration Audit (post-Phase-14G lockdown)
produced_on: "2026-04-29"
authoritative_side: claude
trigger_brief: EXEC_BRIEF_FORENSIC_MIGRATION_AUDIT_v1_0.md
phase_14_lockdown_commit: 5b7d252
changelog:
  - v1.0 (2026-04-29): Initial audit. 3 divergences found (0 HIGH, 2 MEDIUM, 1 LOW). All content-faithful. Lockdown seal intact.
---

# Forensic Migration Audit Report — Phase 14

## Executive Summary

Every file migrated from local filesystem → GCS → Postgres during Phase 14 is **content-faithful**.
No data was lost, corrupted, or silently transformed during migration.

Three divergences were found, all in governance metadata (manifest path entries and manifest
omissions). Zero byte-level or row-level content failures across all 10 content-audit streams.

**Verdict: Phase 14 lockdown commit `5b7d252` is SEALED. The lockdown integrity is intact.**
Two remediation actions (manifest-only edits, no data migration) are required to close the
metadata divergences.

---

## Streams Summary

| Stream | Subject | Result | Key Metric |
|---|---|---|---|
| A | GCS inventory reconciliation | PASS_WITH_DIVERGENCES | 2 path-drift, 3 manifest omissions |
| B | Byte-level sha256 (GCS vs local) | PASS | 27/27 sha256 match; 0 mismatches |
| C | rag_chunks integrity | PASS | 941 chunks; 0 integrity issues |
| D | rag_embeddings coverage | PASS | 941 embeddings; 1:1 coverage; 768-dim |
| E | chart_facts content audit | PASS | 589/589 rows; 0 null fact_id; 0 null source_section |
| F | ephemeris_daily determinism | PASS | 660,726 rows; max pyswisseph delta 0.00000145° |
| G | eclipses + retrogrades count | PASS | eclipses 913/913; retrogrades 2,462 DB |
| H | life_events + sade_sati_phases | PASS | 36/36 life events; 46/46 sade sati phases |
| I | L2.5 structured tables | PASS | 7 tables; 499+134+81+234+21+28 rows; all counts match |
| J | L3 register tables | PASS | 4 tables; 22+12+12+8 rows; JSON count == DB count; 5/5 spot-check each |

---

## Divergence Register (3 items, 0 HIGH)

See `00_ARCHITECTURE/MIGRATION_DIVERGENCE_REGISTER_v1_0.json` for machine-readable detail.

### DIV-001 — CHART_FACTS_EXTRACTION_v1_0 path drift (MEDIUM)

`CAPABILITY_MANIFEST.json` records GCS path `L1/structured/CHART_FACTS_EXTRACTION_v1_0.yaml`.
Actual GCS location: `L1/facts/STRUCTURED/CHART_FACTS_EXTRACTION_v1_0.yaml`.
Content is intact (Stream B sha256 confirmed at actual path). Manifest metadata is wrong, not
the file.

### DIV-002 — CHART_FACTS_SCHEMA_v1_0 path drift (MEDIUM)

Same wrong-prefix bug as DIV-001, same file family. Manifest declares `L1/structured/`; GCS
has `L1/facts/STRUCTURED/`. Content intact.

### DIV-003 — Three ephemeris CSVs absent from CAPABILITY_MANIFEST.json (LOW)

`ECLIPSES_1900_2100.csv`, `RETROGRADES_1900_2100.csv`, `EPHEMERIS_MONTHLY_1900_2100.csv` are
present in GCS (Stream A confirmed) and in the now-SUPERSEDED `FILE_REGISTRY_v1_14.md`, but
were never added to `CAPABILITY_MANIFEST.json` during Phase 1B cutover (2026-04-27). Their
downstream Postgres tables (eclipses 913 rows, retrogrades 2,462 rows, ephemeris_daily 660,726
rows) all pass full content audit — no data loss.

---

## Informational Findings (no remediation required)

| ID | Stream | Finding |
|---|---|---|
| INFO-001 | A | Extra GCS object `00_ARCHITECTURE/VALIDATED_ASSET_REGISTRY_v1_0.json` — governance artifact from Phase 14 asset validation; not tracked in manifest by design |
| INFO-002 | E | Spec column `fact_category`/`fact_type` vs actual schema `category` (no `fact_type`); data present, naming discrepancy between extraction spec and loader output |
| INFO-003 | F | ephemeris_daily uses midnight UT (not noon) and TRUE_NODE for Rahu/Ketu (not MEAN_NODE); confirmed by pyswisseph calibration; internally consistent; two nakshatra transliteration variants ('Moola'='Mula', 'Dhanishta'='Dhanishtha') |
| INFO-004 | I | l25_msr_signals: `signal_number` max=496 while COUNT=499; gap in sequential numbering; not migration fault; count matches spec |

---

## Remediation Plan

See `MIGRATION_REMEDIATION_PLAN_v1_0.md` for full details.

| ID | DIV | Action | Effort | Risk |
|---|---|---|---|---|
| REM-A-001 | DIV-001, DIV-002 | Update 2 GCS URIs in CAPABILITY_MANIFEST.json from `L1/structured/` to `L1/facts/STRUCTURED/` | ~15 min | LOW |
| REM-A-002 | DIV-003 | Add 3 ephemeris CSV entries to CAPABILITY_MANIFEST.json | ~15 min | LOW |

---

## Lockdown Integrity Statement

The Phase 14 lockdown, sealed at commit `5b7d252` (2026-04-29 Phase 14G close), **is intact**.

All three divergences are governance-metadata artifacts:
- DIV-001 and DIV-002 are incorrect GCS URI strings in `CAPABILITY_MANIFEST.json`. The actual
  files exist in GCS at the correct paths and their sha256 hashes match local sources exactly
  (Stream B). No content was lost or altered.
- DIV-003 is a manifest omission for 3 CSV source files. The files exist in GCS (Stream A
  set_C confirmed), and all downstream Postgres tables derived from them pass full row-count
  and content audit (Streams F, G, H). No data loss.

Zero byte-level mismatches (Stream B: 27/27 PASS).
Zero row-count failures across all Postgres tables (Streams E–J: all counts match specification).
Zero content-hash issues in the RAG corpus (Streams C, D: 941 chunks and embeddings verified).
Zero data-integrity issues in ephemeris computation (Stream F: max pyswisseph delta 0.00000145°
across 10 random samples over 200-year range, well within 0.001° tolerance).

The lockdown seal stands. The remediation actions (REM-A-001, REM-A-002) are follow-on
manifest-maintenance tasks, not integrity repairs.

---

## Verification Artifacts

All per-stream evidence files are in `verification_artifacts/MIGRATION_AUDIT/`:

```
A_inventory.json
B_layer1/FORENSIC_ASTROLOGICAL_DATA_v8_0.md.json  (27 files + summary.csv)
C_chunks/summary.json
D_embeddings.json
E_chart_facts.json
F_ephemeris.json
G_eclipses_retrogrades.json
H_life_events_sade_sati.json
I_l2_5/l25_msr_signals.json  (7 files)
J_l3/pattern_register.json   (4 files)
```

Sidecar 500 investigation artifacts:
```
verification_artifacts/SIDECAR_500/symptom_capture.txt
verification_artifacts/SIDECAR_500/service_describe.yaml
verification_artifacts/SIDECAR_500/revisions.txt
verification_artifacts/SIDECAR_500/error_logs.json
```
