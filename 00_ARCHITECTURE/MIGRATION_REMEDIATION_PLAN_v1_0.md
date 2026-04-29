---
artifact: MIGRATION_REMEDIATION_PLAN_v1_0.md
canonical_id: MIGRATION_REMEDIATION_PLAN
version: "1.0"
status: OPEN
produced_during: Forensic Migration Audit (post-Phase-14G lockdown)
produced_on: "2026-04-29"
authoritative_side: claude
trigger_brief: EXEC_BRIEF_FORENSIC_MIGRATION_AUDIT_v1_0.md
divergence_register: 00_ARCHITECTURE/MIGRATION_DIVERGENCE_REGISTER_v1_0.json
audit_report: 00_ARCHITECTURE/MIGRATION_AUDIT_REPORT_v1_0.md
open_items: 2
changelog:
  - v1.0 (2026-04-29): Initial plan. 2 REM entries covering 3 DIV entries. Both are manifest-only edits; no data migration required.
---

# Migration Remediation Plan — Phase 14

## Summary

Two remediation actions are required to close the 3 metadata divergences found during the forensic migration audit. Neither action touches cloud data or Postgres rows — both are manifest-only edits to `00_ARCHITECTURE/CAPABILITY_MANIFEST.json`. The Phase 14 lockdown is not reopened; the lockdown integrity statement in the audit report stands.

| REM ID | DIV(s) | Action | Complexity | Risk | Status |
|---|---|---|---|---|---|
| REM-A-001 | DIV-001, DIV-002 | Correct 2 GCS URI prefixes in CAPABILITY_MANIFEST.json | Small | LOW | OPEN |
| REM-A-002 | DIV-003 | Add 3 ephemeris CSV entries to CAPABILITY_MANIFEST.json | Small | LOW | OPEN |

---

## REM-A-001 — Correct GCS URI prefix for CHART_FACTS_EXTRACTION and CHART_FACTS_SCHEMA

**Covers:** DIV-001, DIV-002

### Cause analysis

During Phase 14C Stream B (2026-04-29), `CHART_FACTS_EXTRACTION_v1_0.yaml` and `CHART_FACTS_SCHEMA_v1_0.json` were uploaded to GCS under the path prefix `gs://madhav-marsys-sources/L1/facts/STRUCTURED/`. When their entries were written to `CAPABILITY_MANIFEST.json`, the `gcs_uri` field was recorded with the wrong prefix `L1/structured/` (lowercase, missing the `facts/` component) instead of the correct `L1/facts/STRUCTURED/`. The files themselves are byte-intact at the correct GCS path — Stream B sha256 confirmed this. The manifest metadata is the only thing wrong.

### Fix scope

Single file: `00_ARCHITECTURE/CAPABILITY_MANIFEST.json`.

Two field edits (search-and-replace):

| canonical_id | Field | Current (wrong) value | Corrected value |
|---|---|---|---|
| `CHART_FACTS_EXTRACTION_v1_0` | `gcs_uri` | `gs://madhav-marsys-sources/L1/structured/CHART_FACTS_EXTRACTION_v1_0.yaml` | `gs://madhav-marsys-sources/L1/facts/STRUCTURED/CHART_FACTS_EXTRACTION_v1_0.yaml` |
| `CHART_FACTS_SCHEMA_v1_0` | `gcs_uri` | `gs://madhav-marsys-sources/L1/structured/CHART_FACTS_SCHEMA_v1_0.json` | `gs://madhav-marsys-sources/L1/facts/STRUCTURED/CHART_FACTS_SCHEMA_v1_0.json` |

No GCS object moves required. No Postgres changes required. No fingerprint rotations required beyond the manifest itself.

### Fix complexity

**Small.** Two string replacements in one JSON file. No schema changes.

### Who applies

Executor in next remediation session.

### Verification step

After editing:
```bash
# Confirm corrected values
grep -A2 '"CHART_FACTS_EXTRACTION_v1_0"' 00_ARCHITECTURE/CAPABILITY_MANIFEST.json | grep gcs_uri
grep -A2 '"CHART_FACTS_SCHEMA_v1_0"' 00_ARCHITECTURE/CAPABILITY_MANIFEST.json | grep gcs_uri
# Both should show L1/facts/STRUCTURED/

# Confirm GCS objects exist at corrected paths (read-only check)
gcloud storage ls gs://madhav-marsys-sources/L1/facts/STRUCTURED/CHART_FACTS_EXTRACTION_v1_0.yaml
gcloud storage ls gs://madhav-marsys-sources/L1/facts/STRUCTURED/CHART_FACTS_SCHEMA_v1_0.json
```

Both `gcloud storage ls` calls should return the object without error, confirming the corrected URIs resolve to real GCS objects.

### Acceptance gate

REM-A-001 is discharged when:
1. `CAPABILITY_MANIFEST.json` `gcs_uri` for `CHART_FACTS_EXTRACTION_v1_0` = `gs://madhav-marsys-sources/L1/facts/STRUCTURED/CHART_FACTS_EXTRACTION_v1_0.yaml`.
2. `CAPABILITY_MANIFEST.json` `gcs_uri` for `CHART_FACTS_SCHEMA_v1_0` = `gs://madhav-marsys-sources/L1/facts/STRUCTURED/CHART_FACTS_SCHEMA_v1_0.json`.
3. Both GCS objects confirmed present at corrected paths via `gcloud storage ls`.
4. `drift_detector.py` exits 0 (manifest self-consistent after edit).
5. Commit landed with message referencing REM-A-001.

---

## REM-A-002 — Add three ephemeris CSV entries to CAPABILITY_MANIFEST.json

**Covers:** DIV-003

### Cause analysis

Three ephemeris source CSV files were uploaded to GCS during Phase 14 and are confirmed present at `gs://madhav-marsys-sources/L1/ephemeris/`:
- `ECLIPSES_1900_2100.csv`
- `RETROGRADES_1900_2100.csv`
- `EPHEMERIS_MONTHLY_1900_2100.csv`

These files were tracked in `FILE_REGISTRY_v1_14.md` (the pre-Phase-1B registry), which was superseded on 2026-04-27 by `CAPABILITY_MANIFEST.json`. During the Phase 1B cutover, these three CSV entries were not back-populated into the manifest. Their downstream Postgres tables (`eclipses` 913 rows, `retrogrades` 2,462 rows, `ephemeris_daily` 660,726 rows) all pass full content audit — no data loss. The omission is purely a governance gap in the manifest.

### Fix scope

Single file: `00_ARCHITECTURE/CAPABILITY_MANIFEST.json`.

Add three new entries to the artifact catalog (in the L1 ephemeris section, alongside existing ephemeris entries). Entry templates:

```json
{
  "canonical_id": "ECLIPSES_1900_2100",
  "path": "01_FACTS_LAYER/ECLIPSES_1900_2100.csv",
  "version": "1.0",
  "status": "CURRENT",
  "layer": "L1",
  "expose_to_chat": false,
  "representations": ["file", "db_table"],
  "interface_version": "1.0",
  "gcs_uri": "gs://madhav-marsys-sources/L1/ephemeris/ECLIPSES_1900_2100.csv",
  "downstream_table": "eclipses",
  "downstream_row_count": 913,
  "notes": "Eclipse events 1900–2100. Ingested into eclipses table via bootstrap_ephemeris.py. Confirmed in GCS + DB by forensic migration audit 2026-04-29."
},
{
  "canonical_id": "RETROGRADES_1900_2100",
  "path": "01_FACTS_LAYER/RETROGRADES_1900_2100.csv",
  "version": "1.0",
  "status": "CURRENT",
  "layer": "L1",
  "expose_to_chat": false,
  "representations": ["file", "db_table"],
  "interface_version": "1.0",
  "gcs_uri": "gs://madhav-marsys-sources/L1/ephemeris/RETROGRADES_1900_2100.csv",
  "downstream_table": "retrogrades",
  "downstream_row_count": 2462,
  "notes": "Planetary retrograde periods 1900–2100. Ingested into retrogrades table via bootstrap_ephemeris.py. Confirmed in GCS + DB by forensic migration audit 2026-04-29."
},
{
  "canonical_id": "EPHEMERIS_MONTHLY_1900_2100",
  "path": "01_FACTS_LAYER/EPHEMERIS_MONTHLY_1900_2100.csv",
  "version": "1.0",
  "status": "CURRENT",
  "layer": "L1",
  "expose_to_chat": false,
  "representations": ["file"],
  "interface_version": "1.0",
  "gcs_uri": "gs://madhav-marsys-sources/L1/ephemeris/EPHEMERIS_MONTHLY_1900_2100.csv",
  "notes": "Monthly planetary positions 1900–2100 (summary; daily detail in ephemeris_daily table). Confirmed in GCS by forensic migration audit 2026-04-29."
}
```

Note: `EPHEMERIS_MONTHLY_1900_2100.csv` does not have a corresponding Postgres table (ephemeris_daily is the canonical daily-resolution table); omit `downstream_table`/`downstream_row_count` for that entry.

No GCS object uploads required. No Postgres changes required.

### Fix complexity

**Small.** Three JSON block insertions in one file.

### Who applies

Executor in next remediation session.

### Verification step

After editing:
```bash
# Confirm all three entries present
python3 -c "
import json
d = json.load(open('00_ARCHITECTURE/CAPABILITY_MANIFEST.json'))
artifacts = d.get('artifacts', d.get('catalog', []))
ids = {a['canonical_id'] for a in artifacts if isinstance(a, dict)}
for cid in ['ECLIPSES_1900_2100', 'RETROGRADES_1900_2100', 'EPHEMERIS_MONTHLY_1900_2100']:
    print(cid, 'FOUND' if cid in ids else 'MISSING')
"

# Confirm GCS objects exist at stated paths (read-only)
gcloud storage ls gs://madhav-marsys-sources/L1/ephemeris/ECLIPSES_1900_2100.csv
gcloud storage ls gs://madhav-marsys-sources/L1/ephemeris/RETROGRADES_1900_2100.csv
gcloud storage ls gs://madhav-marsys-sources/L1/ephemeris/EPHEMERIS_MONTHLY_1900_2100.csv
```

All three `gcloud storage ls` calls should return objects without error.

### Acceptance gate

REM-A-002 is discharged when:
1. `CAPABILITY_MANIFEST.json` contains entries for `ECLIPSES_1900_2100`, `RETROGRADES_1900_2100`, and `EPHEMERIS_MONTHLY_1900_2100` with correct `gcs_uri` values.
2. All three GCS objects confirmed present via `gcloud storage ls`.
3. `drift_detector.py` exits 0.
4. Commit landed with message referencing REM-A-002.

---

## Remediation ordering

REM-A-001 and REM-A-002 are independent — both touch only `CAPABILITY_MANIFEST.json` and can be executed in the same session or sequentially. Recommended: execute both in a single session, run `drift_detector.py` once after both edits, and commit once.

After both REMs are discharged:
- Update this file's frontmatter: `status: CLOSED`, `open_items: 0`.
- The forensic migration audit cycle is complete.
- Phase 11B (legacy deletion) and any other downstream work gated on clean migration integrity may proceed.
