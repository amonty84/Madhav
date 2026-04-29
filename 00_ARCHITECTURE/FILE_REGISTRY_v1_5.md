---
artifact: FILE_REGISTRY_v1_5.md
version: 1.5
status: SUPERSEDED
superseded_by: FILE_REGISTRY_v1_6.md (Madhav_M2A_Exec_6, 2026-04-26)
date: 2026-04-26
scope: Complete registry of final/current MARSYS-JIS corpus files; adds B.3.5 (CGM Rebuild) deliverables — CGM_v9_0 CURRENT, CGM_v2_0 SUPERSEDED, cgm_node chunker, RED_TEAM_M2A_v1_0
supersedes: FILE_REGISTRY_v1_4.md (amended 2026-04-25 at Madhav_M2A_Exec §9.1/§9.6 additions; original 2026-04-24 Step 12); FILE_REGISTRY_v1_3.md (2026-04-24 Step 7); FILE_REGISTRY_v1_2.md (2026-04-24 Step 5A); FILE_REGISTRY_v1_1.md (2026-04-23 Step 5); FILE_REGISTRY_v1_0.md (2026-04-19)
schema_version: 1.5
changelog:
  - v1.5 amended in-place (2026-04-26, Madhav_BUILD_TRACKER_INTEGRATION_v0_1):
    (f) §9.7 NEW — Build Tracker Integration deliverables: serialize_build_state.py (LIVE),
        build_state.schema.json (CURRENT), build_state.example.json (CURRENT).
        Implements ONGOING_HYGIENE_POLICIES §O (build-state serialization at session close).
  - v1.5 (2026-04-26, session Madhav_M2A_Exec_5 / B.3.5 CGM Rebuild):
    (a) §4 L2.5 Holistic Synthesis — CGM row updated: CGM_v2_0 flipped to SUPERSEDED;
        CGM_v9_0.md (234-node YAML, 8-karaka canonical) registered as CURRENT.
        canonical_artifact_id: CGM remains; source_version: "9.0".
    (b) §8 Archival — added CGM_v2_0 row: superseded by CGM_v9_0, archive copy at
        99_ARCHIVE/CGM_v2_0.md, session Madhav_M2A_Exec_5 (2026-04-26).
    (c) §9.6 B.3.5 deliverables — new rows: cgm_node.py chunker (LIVE),
        RED_TEAM_M2A_v1_0.md (CURRENT), Gemini edge-proposal prompt
        035_DISCOVERY_LAYER/PROMPTS/gemini/cgm_edge_proposals_v1_0.md (CURRENT).
    (d) §9.1 — FILE_REGISTRY row updated to v1.5 (this file); FILE_REGISTRY_v1_4 flipped
        to SUPERSEDED in §8.
    (e) §1–§3, §5–§7, §9.2–§9.5, §10 — unchanged from v1.4 by reference.
  - v1.4 (2026-04-24/2026-04-25): Step 12 governance bundle + B.1 ingestion deliverables.
  - v1.3 (2026-04-24, Step 7): governance-integrity bundle.
  - v1.2 (2026-04-24, Step 5A): PROJECT_ARCHITECTURE v2.1 → v2.2.
  - v1.1 (2026-04-23, Step 5): MSR v2.0 → v3.0; MP v2.0.
  - v1.0 (2026-04-19): registry successor to FILE_INDEX_v1_0.
---

# MARSYS-JIS File Registry — Final Corpus (v1.5)

**Subject**: Abhisek Mohanty, b. 1984-02-05, 10:43 IST, Bhubaneswar
**Branch**: `feature/amjis-platform`
**Registry date**: 2026-04-26 (v1.5 published at Madhav_M2A_Exec_5 / B.3.5 CGM Rebuild; supersedes v1.4 dated 2026-04-24/2026-04-25)

The v1.5 revision is **delta-style relative to v1.4**. Changed sections: §4 (CGM row), §8 (CGM archival), §9.1 (registry self-row), §9.6 (B.3.5 deliverables). All other sections are unchanged from v1.4 (which defers unchanged §1–§3, §5–§7 back to v1.3). The authoritative machine-readable inventory is `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md`.

---

## §1–§3 — L0, L1, L2

See `FILE_REGISTRY_v1_4.md §1–§3` — unchanged.

---

## §4 — L2.5 Holistic Synthesis (Canonical)

*The L2.5 stack. CGM updated at v1.5; UCN, MSR, CDLM, RM unchanged.*

| File | Description | Version | Status | canonical_artifact_id |
|---|---|---|---|---|
| `025_HOLISTIC_SYNTHESIS/UCN_v4_0.md` | **Unified Chart Narrative — canonical single-file mother document** (v4.1 corrections applied) | 4.1 | **CURRENT** | UCN |
| `025_HOLISTIC_SYNTHESIS/MSR_v3_0.md` | **Master Signal Register — 499 signals** | 3.0 | **CURRENT** | MSR |
| `025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md` | Cross-Domain Linkage Matrix — 9×9 domain grid (v1.2 cleanup applied) | 1.2 | **CURRENT** | CDLM |
| `025_HOLISTIC_SYNTHESIS/RM_v2_0.md` | Resonance Map — 32 RM elements (RM.21A + RM.21B split) | 2.1 | **CURRENT** | RM |
| `025_HOLISTIC_SYNTHESIS/CGM_v9_0.md` | **Chart Graph Model — 234 YAML node blocks; 8-karaka canonical (GAP.13 resolved); rebuilt on FORENSIC_v8_0 at B.3.5 (2026-04-26). Supersedes CGM_v2_0.md.** | 9.0 | **CURRENT** | CGM |
| `025_HOLISTIC_SYNTHESIS/CGM_v2_0.md` | Chart Graph Model v2.0 — **SUPERSEDED** by CGM_v9_0.md (2026-04-26, B.3.5). Retained in-place per ONGOING_HYGIENE_POLICIES §A; archive copy at `99_ARCHIVE/CGM_v2_0.md`. | 2.0 | **SUPERSEDED** | — |

---

## §5–§7 — L3, L4, L5

See `FILE_REGISTRY_v1_4.md §5–§7` — unchanged.

---

## §8 — Archival

*Superseded artifacts retained in-place per ONGOING_HYGIENE_POLICIES §A.*

| File | Superseded By | Supersession Session | Date | Notes |
|---|---|---|---|---|
| `025_HOLISTIC_SYNTHESIS/CGM_v2_0.md` | `025_HOLISTIC_SYNTHESIS/CGM_v9_0.md` | Madhav_M2A_Exec_5 | 2026-04-26 | **B.3.5 CGM Rebuild**; 8-karaka canonical lock (GAP.13); archive copy at `99_ARCHIVE/CGM_v2_0.md` |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_4.md` | `00_ARCHITECTURE/FILE_REGISTRY_v1_5.md` (this) | Madhav_M2A_Exec_5 | 2026-04-26 | B.3.5 CGM Rebuild delta |

*Additional archival rows preserved from v1.4 §8 by reference.*

---

## §9 — Tooling & Process

### §9.1 — Architecture & Governance artifacts (v1.5 delta)

*Updated rows at v1.5 only. All other rows carry from v1.4 §9.1 by reference.*

| File | Version | Status | canonical_artifact_id | Mirror obligations (summary) |
|---|---|---|---|---|
| `00_ARCHITECTURE/FILE_REGISTRY_v1_5.md` | 1.5 | **CURRENT** | FILE_REGISTRY | MP.5 (adapted_parity_subset) — **updated at v1.5** |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_4.md` | 1.4 | **SUPERSEDED** | — | Superseded 2026-04-26 by v1.5 |

*All other §9.1 rows (CLAUDE.md, CANONICAL_ARTIFACTS, GOVERNANCE_*, etc.) unchanged from v1.4 §9.1.*

### §9.2–§9.5

See `FILE_REGISTRY_v1_4.md §9.2–§9.5` — unchanged.

### §9.6 — M2A Execution deliverables (consolidated through B.3.5)

*B.1 rows from v1.4 §9.6 retained; B.2 and B.3.5 rows added below.*

#### B.1 — Ingestion + validation stack (from v1.4 §9.6)

| File | Status | Session | Notes |
|---|---|---|---|
| `platform/python-sidecar/rag/models.py` | LIVE | Madhav_M2A_Exec | 7 Pydantic v2 models |
| `platform/python-sidecar/rag/ingest.py` | LIVE | Madhav_M2A_Exec | scan_corpus + write_manifest; document_count=35, signal_count=499 |
| `platform/python-sidecar/rag/validators/p1_layer_separation.py` | LIVE | Madhav_M2A_Exec | P1 layer separation validator |
| `platform/python-sidecar/rag/validators/p2_citation.py` | LIVE | Madhav_M2A_Exec | P2 derivation-ledger citation validator |
| `platform/python-sidecar/rag/validators/p5_signal_id_resolution.py` | LIVE | Madhav_M2A_Exec | P5 signal ID resolution validator |
| `platform/python-sidecar/rag/validators/test_p1_p2_p5.py` | LIVE | Madhav_M2A_Exec | 12 parametrized meta-tests; 12/12 PASS |
| `verification_artifacts/RAG/ingestion_manifest.json` | LIVE | Madhav_M2A_Exec | Ingestion manifest; document_count=237, signal_count=499 |

#### B.2 — Chunkers (from prior M2A sessions)

| File | Status | Session | Notes |
|---|---|---|---|
| `platform/python-sidecar/rag/chunkers/__init__.py` | LIVE | Madhav_M2A_Exec_2 | count_tokens, truncate_to_tokens, write_chunks_to_db helpers |
| `platform/python-sidecar/rag/chunkers/msr_signal.py` | LIVE | Madhav_M2A_Exec_2 | Doc-type 1: MSR signal chunker; 499 signals, max 400 tokens |
| `platform/python-sidecar/rag/chunkers/forensic_planet.py` | LIVE | Madhav_M2A_Exec_2 | Doc-type 2: FORENSIC planet-section chunker |
| `platform/python-sidecar/rag/chunkers/ucn_section.py` | LIVE | Madhav_M2A_Exec_3 | Doc-type 3: UCN section chunker |
| `platform/python-sidecar/rag/chunkers/cdlm_cell.py` | LIVE | Madhav_M2A_Exec_3 | Doc-type 4: CDLM cell chunker |
| `platform/python-sidecar/rag/chunkers/domain_report.py` | LIVE | Madhav_M2A_Exec_4 | Doc-type 5: Domain report chunker; is_stale propagation |

#### B.3.5 — CGM Rebuild deliverables (NEW at v1.5)

| File | Status | Session | Notes |
|---|---|---|---|
| `025_HOLISTIC_SYNTHESIS/CGM_v9_0.md` | **CURRENT** | Madhav_M2A_Exec_5 | **234 YAML node blocks** (PLN×9, HSE×12, SGN×12, NAK×15, YOG×19, KRK×18, DVS×77, DSH×30, SEN×42); 8-karaka canonical; all nodes P1-clean; stop-condition verified (chunk_count=234=node_count) |
| `99_ARCHIVE/CGM_v2_0.md` | ARCHIVE | Madhav_M2A_Exec_5 | Archive copy of superseded CGM_v2_0; original path retains in-place banner per ONGOING_HYGIENE_POLICIES §A |
| `platform/python-sidecar/rag/chunkers/cgm_node.py` | LIVE | Madhav_M2A_Exec_5 | Doc-type 6: CGM node chunker; reads CGM_v9_0.md; max 600 tokens; KRK karaka_system field enforcement; P1 gating; stop-condition RuntimeError on mismatch |
| `035_DISCOVERY_LAYER/PROMPTS/gemini/cgm_edge_proposals_v1_0.md` | CURRENT | Madhav_M2A_Exec_5 | Gemini edge-proposals elicitation prompt (B.3.5 Task 3.5); registered in prompt_registry.py INDEX.json |
| `verification_artifacts/RAG/RED_TEAM_M2A_v1_0.md` | CURRENT | Madhav_M2A_Exec_5 | Red-team probes RT1–RT6 for M2A Foundation Stack; all probes pass or carry known_residual disposition |

---

### §9.7 — Build Tracker Integration deliverables (Madhav_BUILD_TRACKER_INTEGRATION_v0_1)

| File | Status | Session | Notes |
|---|---|---|---|
| `platform/scripts/governance/serialize_build_state.py` | LIVE | Madhav_BUILD_TRACKER_INTEGRATION_v0_1 | Build-state serializer v0.1.0; reads CURRENT_STATE + CANONICAL_ARTIFACTS + SESSION_LOG + ONGOING_HYGIENE_POLICIES; emits `build_state.json` conforming to `build_state.schema.json`; invoked at every session close per ONGOING_HYGIENE_POLICIES §O |
| `platform/scripts/governance/schemas/build_state.schema.json` | CURRENT | Madhav_BUILD_TRACKER_INTEGRATION_v0_1 | JSON Schema 2020-12 contract for `build_state.json`; governs serializer output and artifact-side consumption; schema_version 0.1.0 |
| `platform/scripts/governance/schemas/build_state.example.json` | CURRENT | Madhav_BUILD_TRACKER_INTEGRATION_v0_1 | Populated example payload for `--validate-against-schema` test runs; illustrates all required fields per build_state.schema.json |

---

## §10 — Tooling & Process (scripts)

See `FILE_REGISTRY_v1_4.md §10` — unchanged.

---

*Registry v1.5 amended 2026-04-26 at Madhav_BUILD_TRACKER_INTEGRATION_v0_1: added §9.7 build-tracker deliverables. Originally produced 2026-04-26 at Madhav_M2A_Exec_5 (B.3.5 CGM Rebuild). Supersedes v1.4 dated 2026-04-24/2026-04-25. The machine-readable canonical-path registry is `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md`; this file's `canonical_artifact_id` column points into it.*
