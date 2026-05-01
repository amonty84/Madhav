---
phase: B.5
title: Manifest Cross-Check
status: COMPLETE
executed_at: 2026-04-28
executor: Claude Code (Sonnet 4.6)
verdict: AMBER — no missing files; 10 hash-drift (active registers expected), 32 version-drift (formatting only)
---

# B.5 — Manifest Cross-Check

## Summary Counts

| Category | Count | % |
|---|---|---|
| Total entries | 62 | 100% |
| FILE_OK | 20 | 32% |
| FILE_MISSING | 0 | 0% |
| HASH_DRIFT | 10 | 16% |
| VERSION_DRIFT | 32 | 52% |

**No missing files.** Filesystem is complete relative to the manifest.

## HASH_DRIFT (10 entries)

All 10 are in actively-updated JSON registers/schemas:

| Artifact | Path | Reason |
|---|---|---|
| PATTERN_SCHEMA_v0_1 | `06_LEARNING_LAYER/SCHEMAS/pattern_schema_v0_1.json` | Updated post-manifest |
| PREDICTION_SCHEMA_v0_1 | `06_LEARNING_LAYER/SCHEMAS/prediction_schema_v0_1.json` | Updated post-manifest |
| TWO_PASS_EVENTS_SCHEMA_v0_1 | `06_LEARNING_LAYER/SCHEMAS/two_pass_events_schema_v0_1.json` | Updated post-manifest |
| PROMPT_REGISTRY_INDEX | `06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json` | Updated post-manifest |
| PREDICTION_LEDGER_JSONL | `06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl` | New predictions appended |
| PATTERN_REGISTER_JSON | `035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.json` | Updated post-manifest |
| RESONANCE_REGISTER_JSON | `035_DISCOVERY_LAYER/REGISTERS/RESONANCE_REGISTER_v1_0.json` | Updated post-manifest |
| CONTRADICTION_REGISTER_JSON | `035_DISCOVERY_LAYER/REGISTERS/CONTRADICTION_REGISTER_v1_0.json` | Updated post-manifest |
| CLUSTER_ATLAS_JSON | `035_DISCOVERY_LAYER/REGISTERS/CLUSTER_ATLAS_v1_0.json` | Updated post-manifest |
| DISCOVERY_REGISTERS_INDEX | `035_DISCOVERY_LAYER/REGISTERS/INDEX.json` | Updated post-manifest |

**Assessment:** All hash-drift entries are in the L6 Learning Layer and L3.5 Discovery Layer JSON registers — these are **designed to be updated frequently** and are expected to drift from the manifest snapshot. The manifest build script (`npm run manifest:build`) should be re-run after these updates. Not a blocking issue.

## VERSION_DRIFT (32 entries)

All are formatting inconsistencies, not actual version changes:
- `1` vs `"1"` (integer vs string in frontmatter)
- `1` vs `1.0` (integer vs float)
- Missing frontmatter `version:` field in some files
- One case: `CDLM_v1_1` stored as `1.2` in manifest but file name says `v1_1` — internal version incremented without filename bump (expected per governance convention)

**Assessment:** These are governance metadata formatting issues, not content integrity failures. The manifest re-validate pass (Phase H.1) will resolve them via `npm run manifest:build`.

## Recommended Action
Run `cd platform && npm run manifest:build` to regenerate the manifest with current hashes and versions. Schedule this as part of session-close hygiene (per `ONGOING_HYGIENE_POLICIES §A`).
