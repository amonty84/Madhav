---
artifact: FILE_REGISTRY_v1_4.md
version: 1.4
status: CURRENT
date: 2026-04-24
scope: Complete registry of final/current AM-JIS corpus files; adds Step 10/11/12 governance-rebuild artifacts and closes the Step 10-deferred v1.3→v1.4 bump
supersedes: FILE_REGISTRY_v1_3.md (closed 2026-04-24 at Step 10 in-place amendment; superseded 2026-04-24 at Step 12 of the Step 0→15 governance rebuild); FILE_REGISTRY_v1_2.md (closed 2026-04-24 at Step 5A; superseded 2026-04-24 at Step 7); FILE_REGISTRY_v1_1.md (closed 2026-04-23 at Step 5; superseded 2026-04-24 at Step 5A); FILE_REGISTRY_v1_0.md (closed 2026-04-19; superseded 2026-04-23 at Step 5)
schema_version: 1.4
  # v1.4 additions: §9.1 rows — SESSION_LOG_SCHEMA_v1_0 (CURRENT, Step 10), CURRENT_STATE_v1_0
  # (LIVE, Step 10), LEARNING_LAYER_SCAFFOLD_DECISION_v1_0 (CURRENT, Step 11),
  # ONGOING_HYGIENE_POLICIES_v1_0 (CURRENT, Step 12); §9.1 removals — AM_JIS_BOOTSTRAP_HANDOFF
  # (retired Step 12) moved to §8 Archival; §8 archival — LEL_v1_1 archival banner (Step 12);
  # §9.4 NEW — 06_LEARNING_LAYER/ scaffold inventory; §9.5 NEW — governance script extensions
  # (Step 12). No new columns.
changelog:
  - v1.4 (2026-04-24, Step 12 of the Step 0→15 governance rebuild):
    (a) §9.1 Architecture & Governance — added ONGOING_HYGIENE_POLICIES_v1_0 (CURRENT).
        Confirmed already-in-place Step-10/11 rows: SESSION_LOG_SCHEMA_v1_0 (CURRENT),
        CURRENT_STATE_v1_0 (LIVE), LEARNING_LAYER_SCAFFOLD_DECISION_v1_0 (CURRENT).
    (b) §9.1 — AM_JIS_BOOTSTRAP_HANDOFF retired (moved to §8 Archival) per native Step 12
        decision on WARN.4/WARN.6.
    (c) §8 Archival — added LEL_v1_1 archival row (was in §2 L1 Facts; §A retain-in-place
        policy per ONGOING_HYGIENE_POLICIES applied; GA.12 closed).
    (d) §8 Archival — added FILE_REGISTRY_v1_3 self-entry as superseded.
    (e) §9.4 NEW — 06_LEARNING_LAYER/ scaffold inventory (top-level README + four LL.1–LL.4
        mechanism stubs + two .gitkeep markers).
    (f) §9.5 NEW — governance script extensions log: Step 12 additions to
        `platform/scripts/governance/schema_validator.py` (validate_scope_boundary,
        validate_files_touched_completeness, validate_learning_layer_stub,
        validate_mirror_structural_block, validate_dr_entry_yaml, --dr-entry CLI,
        --session-open-for-close CLI) + `schemas/artifact_schemas.yaml` extensions
        (learning_layer_stub, session_close, disagreement_register_entry classes).
    (g) Lineage chain: FILE_REGISTRY_v1_3 → FILE_REGISTRY_v1_4 (this). §1–§7 corpus rows
        unchanged from v1.3 (L1/L2.5/L3 facts + tooling unchanged). Readers requiring
        §1–§7 should consult v1.3 (SUPERSEDED but content-identical for §1–§7).
  - v1.3 (2026-04-24, Step 7): governance-integrity bundle registered.
  - v1.2 (2026-04-24, Step 5A): PROJECT_ARCHITECTURE v2.1 → v2.2.
  - v1.1 (2026-04-23, Step 5): MSR v2.0 → v3.0; MP v2.0 registered.
  - v1.0 (2026-04-19): registry successor to FILE_INDEX_v1_0.
---

# AM-JIS File Registry — Final Corpus (v1.4)

**Subject**: Abhisek Mohanty, b. 1984-02-05, 10:43 IST, Bhubaneswar
**Branch**: `feature/amjis-platform`
**Registry date**: 2026-04-24 (v1.4 published at Step 12 of the Step 0→15 governance rebuild; supersedes v1.3 dated 2026-04-24 Step 7)

This registry lists only the **current authoritative version** of each artifact.
Superseded versions are collected in §8 (Archival). Tooling and process files are in §9–§10.

The v1.4 revision is **additive relative to v1.3** with one retirement (AM_JIS_BOOTSTRAP_HANDOFF moved to archival per WARN.4/WARN.6 close) and one archival-banner application (LEL v1.1 per GA.12 close). §1–§7 corpus rows are unchanged from v1.3 and are retained there for audit trail per ONGOING_HYGIENE_POLICIES §A retain-in-place policy; readers needing §1–§7 consult v1.3 (SUPERSEDED but content-identical for those sections).

The authoritative machine-readable inventory is `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md` — this registry's `canonical_artifact_id` column points into it.

---

## §1 — L0 Source Data (JHora & Ephemeris)

See `FILE_REGISTRY_v1_3.md §1` — unchanged at v1.4.

## §2 — L1 Facts Layer (Authoritative Ground Truth)

See `FILE_REGISTRY_v1_3.md §2` — unchanged at v1.4 except that `LIFE_EVENT_LOG_v1_1.md` (predecessor of LEL v1.2) received §A archival treatment at Step 12 (see §8 below for the archival record).

## §3 — L2 Analytical Layer (Deep Analysis)

See `FILE_REGISTRY_v1_3.md §3` — unchanged.

## §4 — L2.5 Holistic Synthesis (Canonical)

See `FILE_REGISTRY_v1_3.md §4` — unchanged.

## §5 — L3 Domain Reports (Partial Corpus)

See `FILE_REGISTRY_v1_3.md §5` — unchanged.

## §6 — L4 Query Interface / Discovery Layer

*`06_QUERY_INTERFACE/` migrated to `035_DISCOVERY_LAYER/QUERY_TAXONOMY/` in Madhav_17_B0.
Source directory deleted after line-count verification. Original rows superseded below.*

| File (SUPERSEDED path) | New Path | Status | Session | Notes |
|---|---|---|---|---|
| `06_QUERY_INTERFACE/DECISION_SUPPORT_PLAYBOOK_v1_0.md` | `035_DISCOVERY_LAYER/QUERY_TAXONOMY/DECISION_SUPPORT_PLAYBOOK_v1_0.md` | SUPERSEDED (migrated) | Madhav_17_B0 | Content unchanged; path migrated |
| `06_QUERY_INTERFACE/QUERY_PROMPT_LIBRARY_v1_0.md` | `035_DISCOVERY_LAYER/QUERY_TAXONOMY/QUERY_PROMPT_LIBRARY_v1_0.md` | SUPERSEDED (migrated) | Madhav_17_B0 | Content unchanged; path migrated |
| `06_QUERY_INTERFACE/SESSION_PROTOCOL_QUESTION_TAXONOMY_v1_0.md` | `035_DISCOVERY_LAYER/QUERY_TAXONOMY/SESSION_PROTOCOL_QUESTION_TAXONOMY_v1_0.md` | SUPERSEDED (migrated) | Madhav_17_B0 | Content unchanged; path migrated |

**Current active paths (035_DISCOVERY_LAYER/QUERY_TAXONOMY/):**

| File | Version | Status | Notes |
|---|---|---|---|
| `035_DISCOVERY_LAYER/QUERY_TAXONOMY/DECISION_SUPPORT_PLAYBOOK_v1_0.md` | 1.0 | CURRENT | Migrated from 06_QUERY_INTERFACE/, Madhav_17_B0 |
| `035_DISCOVERY_LAYER/QUERY_TAXONOMY/QUERY_PROMPT_LIBRARY_v1_0.md` | 1.0 | CURRENT | Migrated from 06_QUERY_INTERFACE/, Madhav_17_B0 |
| `035_DISCOVERY_LAYER/QUERY_TAXONOMY/SESSION_PROTOCOL_QUESTION_TAXONOMY_v1_0.md` | 1.0 | CURRENT | Migrated from 06_QUERY_INTERFACE/, Madhav_17_B0 |

## §7 — L5 Query-Ready Corpus

See `FILE_REGISTRY_v1_3.md §7` — unchanged.

---

## §8 — Archival

*Superseded artifacts retained in-place per ONGOING_HYGIENE_POLICIES §A. Path resolvers follow the successor chain via `superseded_by` frontmatter.*

| File | Superseded By | Supersession Session | Date | Notes |
|---|---|---|---|---|
| `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_0.md` (implicit pre-v1.1) | `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_1.md` (same session) | Session 2 (2026-04-17) | 2026-04-17 | Same-session minor revision |
| `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_1.md` | `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md` | STEP_12_ONGOING_HYGIENE_POLICIES | 2026-04-24 | **GA.12 closure**; §A banner + frontmatter flip applied Step 12 |
| `AM_JIS_BOOTSTRAP_HANDOFF.md` | CLAUDE.md v2.0 + PROJECT_ARCHITECTURE_v2_2.md + MACRO_PLAN_v2_0.md + CURRENT_STATE_v1_0.md | STEP_12_ONGOING_HYGIENE_POLICIES | 2026-04-24 | **WARN.4/WARN.6 closure**; native decision to retire rather than refresh |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_3.md` | `00_ARCHITECTURE/FILE_REGISTRY_v1_4.md` (this) | STEP_12_ONGOING_HYGIENE_POLICIES | 2026-04-24 | v1.4 is delta-style; §1–§7 unchanged bulk retained in v1.3 |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_2.md` | `FILE_REGISTRY_v1_3.md` | STEP_7_GOVERNANCE_INTEGRITY_IMPLEMENTATION | 2026-04-24 | Step 7 governance bundle |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_1.md` | `FILE_REGISTRY_v1_2.md` | STEP_5A_PROJECT_ARCHITECTURE_REFRESH | 2026-04-24 | MP v2.1 → v2.2 |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_0.md` | `FILE_REGISTRY_v1_1.md` | STEP_5_MACRO_PLAN_CLOSURE | 2026-04-23 | MSR v2.0 → v3.0; MP v2.0 |
| `00_ARCHITECTURE/MACRO_PLAN_v1_0.md` | `00_ARCHITECTURE/MACRO_PLAN_v2_0.md` | STEP_5_MACRO_PLAN_CLOSURE | 2026-04-23 | Ten-macro-phase arc rewrite |
| `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_1.md` | `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md` | STEP_5A_PROJECT_ARCHITECTURE_REFRESH | 2026-04-24 | MP arc + Learning Layer + Multi-Agent absorption |
| `025_HOLISTIC_SYNTHESIS/MSR_v2_0.md` | `025_HOLISTIC_SYNTHESIS/MSR_v3_0.md` | (corpus closure, pre-rebuild) | 2026-04-19 | GA.1 resolution |

*Additional archival rows preserved from v1.3 §8 by reference.*

### §8.1 — B.0 Archive Actions (Madhav_17_B0)

| File | Moved To | Session | Date | Notes |
|---|---|---|---|---|
| `025_HOLISTIC_SYNTHESIS/MSR_v1_0.md` | `99_ARCHIVE/MSR_v1_0.md` | Madhav_17_B0 | 2026-04-24 | OBS.2 closure; MSR_v3_0 is sole active MSR |
| `025_HOLISTIC_SYNTHESIS/MSR_v2_0.md` | `99_ARCHIVE/MSR_v2_0.md` | Madhav_17_B0 | 2026-04-24 | OBS.2 closure; MSR_v3_0 is sole active MSR |

---

## §9 — Tooling & Process

### §9.1 — Architecture & Governance artifacts (v1.4 consolidated)

| File | Version | Status | canonical_artifact_id | Mirror obligations (summary) |
|---|---|---|---|---|
| `CLAUDE.md` | 2.0 | CURRENT | CLAUDE | MP.1 (adapted_parity with .geminirules) |
| `.geminirules` | re-authored STEP_12 | LIVE | GEMINIRULES | MP.1 counterpart |
| `.gemini/project_state.md` | re-authored STEP_12 | LIVE | PROJECT_STATE | MP.2 composite mirror |
| `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md` | 2.2 | CURRENT | PROJECT_ARCHITECTURE | MP.8 (adapted_parity_summary) |
| `00_ARCHITECTURE/MACRO_PLAN_v2_0.md` | 2.0 | CURRENT | MACRO_PLAN | MP.3 (adapted_parity_summary) |
| `00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md` | 1.0.2 | CURRENT (paused during rebuild) | PHASE_B_PLAN | MP.4 (adapted_parity_summary) |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_4.md` | 1.4 | CURRENT | FILE_REGISTRY | MP.5 (adapted_parity_subset) |
| `00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md` | 1.0 (amended-STEP_12) | CURRENT | GOVERNANCE_STACK | MP.6 (claude_only) |
| `00_ARCHITECTURE/STEP_LEDGER_v1_0.md` | 1.0 | LIVE (until Step 15) | STEP_LEDGER | MP.2 (composite with CURRENT_STATE) |
| `00_ARCHITECTURE/SESSION_LOG.md` | rolling-schema-v1.0 | LIVE | SESSION_LOG | MP.7 (claude_only) |
| `00_ARCHITECTURE/NATIVE_DIRECTIVES_FOR_REVISION_v1_0.md` | 1.0 | LIVING | NATIVE_DIRECTIVES | claude_only |
| `00_ARCHITECTURE/CONVERSATION_NAMING_CONVENTION_v1_0.md` | 1.4 | LIVING | CONVERSATION_NAMING_CONVENTION | claude_only |
| `00_ARCHITECTURE/GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md` | 1.0 | CURRENT | GOVERNANCE_INTEGRITY_PROTOCOL | claude_only |
| `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md` | 1.0 | CURRENT | CANONICAL_ARTIFACTS | claude_only |
| `00_ARCHITECTURE/SESSION_OPEN_TEMPLATE_v1_0.md` | 1.0 | CURRENT | SESSION_OPEN_TEMPLATE | claude_only |
| `00_ARCHITECTURE/SESSION_CLOSE_TEMPLATE_v1_0.md` | 1.0 | CURRENT | SESSION_CLOSE_TEMPLATE | claude_only |
| `00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md` | 1.0 | LIVING | DISAGREEMENT_REGISTER | claude_only |
| `00_ARCHITECTURE/SESSION_LOG_SCHEMA_v1_0.md` | 1.0 | CURRENT | SESSION_LOG_SCHEMA | claude_only |
| `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` | 1.0 | LIVE | CURRENT_STATE | MP.2 composite member |
| `00_ARCHITECTURE/LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md` | 1.0 | CURRENT | LEARNING_LAYER_SCAFFOLD_DECISION | claude_only |
| `00_ARCHITECTURE/ONGOING_HYGIENE_POLICIES_v1_0.md` | 1.0 | CURRENT | ONGOING_HYGIENE_POLICIES | claude_only (**NEW at Step 12**) |
| `00_ARCHITECTURE/GAP_13_RESOLUTION_v1_0.md` | 1.0 | CURRENT | — | Madhav_17_B0: 8-karaka lock; 2 Pitrukaraka-dependent signals tagged in MSR_v3_0 (**NEW B.0**) |
| `00_ARCHITECTURE/M2A_EXEC_PLAN_v1_0.md` | 1.0 | READY_FOR_EXEC | M2A_EXEC_PLAN | Madhav_M2A_Plan_Foundation_Stack: execution plan for B.1–B.3.5; 5 sessions; 26 ACs; 6 red-team probes (**NEW M2A Plan**) |
| `00_ARCHITECTURE/STALENESS_REGISTER.md` | 1.0 | LIVE | STALENESS_REGISTER | Madhav_M2A_Exec: 9 CURRENT L3 domain reports; 4 stale (CLOSED frontmatter + no FORENSIC_v8_0 field); used by B.2 doc-type 5 chunker to propagate is_stale to rag_chunks (**NEW B.1**) |
| `00_ARCHITECTURE/LIVING_PROJECT_MAINTENANCE_GUIDE_v1_0.md` | 1.0 | CLOSED | — | corpus-layer; referenced by §M of ONGOING_HYGIENE_POLICIES |
| `00_ARCHITECTURE/MAINTENANCE_SCHEDULE_v1_0.md` | 1.0 | CLOSED | — | corpus-layer; referenced by §M of ONGOING_HYGIENE_POLICIES |
| `00_ARCHITECTURE/GROUNDING_AUDIT_v1_0.md` | 1.0 | CLOSED (baseline) | — | Step 0 rebuild baseline; fresh-context read |
| `~AM_JIS_BOOTSTRAP_HANDOFF.md~` | (retired) | SUPERSEDED | — | Retired Step 12 (WARN.4/WARN.6); see §8 |

*Other v1.3 §9.1 rows unchanged by reference.*

### §9.2 — Step Briefs

See `FILE_REGISTRY_v1_3.md §9.2` — unchanged.

### §9.3 — Governance reports

Expanded at Step 12 with:
- `00_ARCHITECTURE/drift_reports/DRIFT_REPORT_STEP_12_v1_0.md` (NEW)
- `00_ARCHITECTURE/schema_reports/SCHEMA_VALIDATION_REPORT_STEP_12_v1_0.md` (NEW)
- `00_ARCHITECTURE/mirror_reports/MIRROR_REPORT_STEP_12_v1_0.md` (NEW)

Other rows carried from v1.3 §9.3.

### §9.4 — Learning Layer scaffold (Step 11 + Step 12 binding)

| File | Status | Binding policy |
|---|---|---|
| `06_LEARNING_LAYER/README.md` | STUB | LL_SCAFFOLD_DECISION §3 inventory |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/README.md` (LL.1) | STUB — activates at M4 | learning_layer_stub class + N=3 default |
| `06_LEARNING_LAYER/GRAPH_EDGE_WEIGHT_LEARNING/README.md` (LL.2) | STUB — activates at M4 | learning_layer_stub class + N=3 default |
| `06_LEARNING_LAYER/EMBEDDING_SPACE_ADAPTATION/README.md` (LL.3) | STUB — activates at M4 | learning_layer_stub class + N=3 default |
| `06_LEARNING_LAYER/PROMPT_OPTIMIZATION/README.md` (LL.4) | STUB — activates at M4 | learning_layer_stub class + N=3 default |
| `06_LEARNING_LAYER/OBSERVATIONS/.gitkeep` | marker | two-pass population gate applies |
| `06_LEARNING_LAYER/PARAMETER_UPDATES/.gitkeep` | marker | two-pass population gate applies |

### §9.5 — Governance script extensions log (Step 12)

| Script | Extension | Closes |
|---|---|---|
| `platform/scripts/governance/schema_validator.py` | `validate_scope_boundary()` | GA.20 (close-checklist layer) |
| `platform/scripts/governance/schema_validator.py` | `validate_files_touched_completeness()` | GA.21 |
| `platform/scripts/governance/schema_validator.py` | `validate_learning_layer_stub()` | LL_SCAFFOLD §5.7 booking |
| `platform/scripts/governance/schema_validator.py` | `validate_mirror_structural_block()` | Step 8 red-team F.1 |
| `platform/scripts/governance/schema_validator.py` | close-checklist exit-3 whitelist via `known_residuals` | Step 8 red-team F.2 |
| `platform/scripts/governance/schema_validator.py` | `--dr-entry` CLI + `validate_dr_entry_yaml()` | Step 8 red-team F.3 |
| `platform/scripts/governance/schema_validator.py` | `--session-open-for-close` CLI | Step 12 scope-boundary cross-reference |
| `platform/scripts/governance/schemas/artifact_schemas.yaml` | `learning_layer_stub` class | LL scaffold §5.7 |
| `platform/scripts/governance/schemas/artifact_schemas.yaml` | `session_close` class (scope_boundary, files_touched_completeness, exit_code_whitelist, known_residuals_schema) | GA.20 + GA.21 + F.2 |
| `platform/scripts/governance/schemas/artifact_schemas.yaml` | `disagreement_register_entry` class | F.3 |

---

## §10 — Tooling & Process (scripts)

See `FILE_REGISTRY_v1_3.md §10` — unchanged at the file-inventory level. §9.5 above lists the Step 12 code extensions applied in-place to existing scripts (no new script files added).

---

### §9.6 — M2A Execution deliverables (B.1 Ingestion)

| File | Status | Session | Notes |
|---|---|---|---|
| `platform/python-sidecar/rag/models.py` | LIVE | Madhav_M2A_Exec | 7 Pydantic v2 models (Document, Chunk, Signal, GraphNode, GraphEdge, RegisterEntry, LedgerEvent) |
| `platform/python-sidecar/rag/ingest.py` | LIVE | Madhav_M2A_Exec | scan_corpus + write_manifest; current_document_count=35, signal_count=499 |
| `platform/python-sidecar/rag/validators/p1_layer_separation.py` | LIVE | Madhav_M2A_Exec | P1 layer separation validator |
| `platform/python-sidecar/rag/validators/p2_citation.py` | LIVE | Madhav_M2A_Exec | P2 derivation-ledger citation validator |
| `platform/python-sidecar/rag/validators/p5_signal_id_resolution.py` | LIVE | Madhav_M2A_Exec | P5 signal ID resolution validator |
| `platform/python-sidecar/rag/validators/test_p1_p2_p5.py` | LIVE | Madhav_M2A_Exec | 12 parametrized meta-tests; 12/12 PASS |
| `verification_artifacts/RAG/ingestion_manifest.json` | LIVE | Madhav_M2A_Exec | Ingestion manifest; current_document_count=35, signal_count=499, document_count=237 |

---

*End of FILE_REGISTRY_v1_4.md — amended Madhav_M2A_Exec 2026-04-25 (§9.1 STALENESS_REGISTER row; §9.6 B.1 deliverables added). Original: Step 12 of the Step 0→15 governance rebuild — 2026-04-24.*
