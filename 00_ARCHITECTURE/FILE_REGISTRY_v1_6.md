---
artifact: FILE_REGISTRY_v1_6.md
version: 1.6
status: SUPERSEDED
superseded_by: FILE_REGISTRY_v1_7.md
superseded_at: Madhav_PORTAL_BUILD_TRACKER_IMPL_v0_1 (2026-04-26)
date: 2026-04-26
scope: Complete registry of final/current MARSYS-JIS corpus files; adds B.4 Session 1 deliverables — cgm_edges_manifest, graph.py implementation, graph.json export, B.4 verification artifacts, KR-1/KR-2 closure
supersedes: FILE_REGISTRY_v1_5.md (2026-04-26, Madhav_BUILD_TRACKER_INTEGRATION_v0_1 + Madhav_M2A_Exec_5)
schema_version: 1.6
changelog:
  - v1.6 (2026-04-26, Madhav_M2A_Exec_6 / B.4 Session 1):
    (a) §9.1 — FILE_REGISTRY row updated to v1.6 (this file); FILE_REGISTRY_v1_5 flipped
        to SUPERSEDED in §8.
    (b) §9.8 NEW — B.4 Graph Construction Session 1 deliverables: cgm_edges_manifest_v1_0.json,
        rag/graph.py, verification_artifacts/RAG/graph.json, b4_node_count.json, b4_edge_count.json,
        b4_sanity_test.json, cgm_chunks_ingestion_report.json, kr1_kr2_db_verification.json.
    (c) §4 — CGM row updated: edge_count_reconciled: 22 + reconciled_edges_manifest pointer noted.
    (d) §1–§3, §5–§7, §9.2–§9.7, §10 — unchanged from v1.5 by reference.
  - v1.5 (2026-04-26): B.3.5 CGM Rebuild + Build Tracker Integration.
  - v1.4 (2026-04-24/2026-04-25): Step 12 governance bundle + B.1 ingestion deliverables.
  - v1.3 (2026-04-24, Step 7): governance-integrity bundle.
  - v1.2 (2026-04-24, Step 5A): PROJECT_ARCHITECTURE v2.1 → v2.2.
  - v1.1 (2026-04-23, Step 5): MSR v2.0 → v3.0; MP v2.0.
  - v1.0 (2026-04-19): registry successor to FILE_INDEX_v1_0.
---

# MARSYS-JIS File Registry — Final Corpus (v1.6)

**Subject**: Abhisek Mohanty, b. 1984-02-05, 10:43 IST, Bhubaneswar
**Branch**: `feature/amjis-platform`
**Registry date**: 2026-04-26 (v1.6 published at Madhav_M2A_Exec_6 / B.4 Session 1; supersedes v1.5)

The v1.6 revision is **delta-style relative to v1.5**. Changed sections: §4 (CGM manifest pointer), §8 (FILE_REGISTRY_v1_5 archival), §9.1 (registry self-row), §9.8 (B.4 Session 1 deliverables). All other sections are unchanged from v1.5. The authoritative machine-readable inventory is `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md`.

---

## §1–§3 — L0, L1, L2

See `FILE_REGISTRY_v1_4.md §1–§3` — unchanged.

---

## §4 — L2.5 Holistic Synthesis (Canonical)

*The L2.5 stack. CGM updated at v1.6 (manifest pointer); UCN, MSR, CDLM, RM unchanged.*

| File | Description | Version | Status | canonical_artifact_id |
|---|---|---|---|---|
| `025_HOLISTIC_SYNTHESIS/UCN_v4_0.md` | **Unified Chart Narrative — canonical single-file mother document** (v4.1 corrections applied) | 4.1 | **CURRENT** | UCN |
| `025_HOLISTIC_SYNTHESIS/MSR_v3_0.md` | **Master Signal Register — 499 signals** | 3.0 | **CURRENT** | MSR |
| `025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md` | Cross-Domain Linkage Matrix — 9×9 domain grid (v1.2 cleanup applied) | 1.2 | **CURRENT** | CDLM |
| `025_HOLISTIC_SYNTHESIS/RM_v2_0.md` | Resonance Map — 32 RM elements (RM.21A + RM.21B split) | 2.1 | **CURRENT** | RM |
| `025_HOLISTIC_SYNTHESIS/CGM_v9_0.md` | **Chart Graph Model — 234 YAML node blocks; 8-karaka canonical; reconciled_edges_manifest: cgm_edges_manifest_v1_0.json (22 edges).** Amended in-place 2026-04-26 at Madhav_M2A_Exec_6. | 9.0 | **CURRENT** | CGM |
| `025_HOLISTIC_SYNTHESIS/CGM_v2_0.md` | Chart Graph Model v2.0 — **SUPERSEDED** by CGM_v9_0.md (2026-04-26, B.3.5). Retained in-place per ONGOING_HYGIENE_POLICIES §A; archive copy at `99_ARCHIVE/CGM_v2_0.md`. | 2.0 | **SUPERSEDED** | — |
| `035_DISCOVERY_LAYER/cgm_edges_manifest_v1_0.json` | **CGM Reconciled Edges Manifest — 22 P2-clean edges** (8 DISPOSITED_BY + 9 NAKSHATRA_LORD_IS + 5 Special Drishti). Canonical file-side audit trail for B.3.5 two-pass output. DB-queryable form: `rag_graph_edges`. | 1.0 | **CURRENT** | — |

---

## §5–§7 — L3, L4, L5

See `FILE_REGISTRY_v1_4.md §5–§7` — unchanged.

---

## §8 — Archival

*Superseded artifacts retained in-place per ONGOING_HYGIENE_POLICIES §A.*

| File | Superseded By | Supersession Session | Date | Notes |
|---|---|---|---|---|
| `025_HOLISTIC_SYNTHESIS/CGM_v2_0.md` | `025_HOLISTIC_SYNTHESIS/CGM_v9_0.md` | Madhav_M2A_Exec_5 | 2026-04-26 | **B.3.5 CGM Rebuild**; 8-karaka canonical lock (GAP.13); archive copy at `99_ARCHIVE/CGM_v2_0.md` |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_5.md` | `00_ARCHITECTURE/FILE_REGISTRY_v1_6.md` (this) | Madhav_M2A_Exec_6 | 2026-04-26 | B.4 Session 1 manifest + graph deliverables |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_4.md` | `00_ARCHITECTURE/FILE_REGISTRY_v1_5.md` | Madhav_M2A_Exec_5 | 2026-04-26 | B.3.5 CGM Rebuild delta |

*Additional archival rows preserved from v1.4 §8 by reference.*

---

## §9 — Tooling & Process

### §9.1 — Architecture & Governance artifacts (v1.6 delta)

*Updated rows at v1.6 only. All other rows carry from v1.5 §9.1 by reference.*

| File | Version | Status | canonical_artifact_id | Mirror obligations (summary) |
|---|---|---|---|---|
| `00_ARCHITECTURE/FILE_REGISTRY_v1_6.md` | 1.6 | **CURRENT** | FILE_REGISTRY | MP.5 (adapted_parity_subset) — Gemini-side carries only L2.5 paths; 035-tier manifest row is Claude-only; no Gemini-side update required for this bump |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_5.md` | 1.5 | **SUPERSEDED** | — | Superseded 2026-04-26 by v1.6 |

*All other §9.1 rows (CLAUDE.md, CANONICAL_ARTIFACTS, GOVERNANCE_*, etc.) unchanged from v1.5 §9.1.*

### §9.2–§9.7

See `FILE_REGISTRY_v1_5.md §9.2–§9.7` — unchanged.

### §9.8 — B.4 Graph Construction Session 1 deliverables (NEW at v1.6)

#### B.4 — Graph Construction Session 1 (Madhav_M2A_Exec_6)

| File | Status | Session | Notes |
|---|---|---|---|
| `035_DISCOVERY_LAYER/cgm_edges_manifest_v1_0.json` | **CURRENT** | Madhav_M2A_Exec_6 | 22 reconciled CGM edges; canonical file-side audit trail for B.3.5 two-pass; single source of truth for reconciled edge set |
| `platform/python-sidecar/rag/graph.py` | LIVE | Madhav_M2A_Exec_6 | B.4 graph builder; `build_graph()` NetworkX MultiDiGraph + deterministic edges (CITES, MENTIONS, AFFECTS_DOMAIN, CROSS_LINKS) + 22 CGM edges; DB persist to `rag_graph_nodes` + `rag_graph_edges`; helper library: `expand_neighbors`, `shortest_path`, `domain_cross_links` |
| `verification_artifacts/RAG/graph.json` | LIVE | Madhav_M2A_Exec_6 | B.4 Task 4 adjacency export; `{nodes, edges, node_count, edge_count, edges_by_type, generated_at}` |
| `verification_artifacts/RAG/b4_node_count.json` | LIVE | Madhav_M2A_Exec_6 | Node count per type; `expand_neighbors('PLN.SATURN', hops=2)` smoke-test result |
| `verification_artifacts/RAG/b4_edge_count.json` | LIVE | Madhav_M2A_Exec_6 | Per-type edge counts; SUPPORTS/CONTRADICTS deferral documented |
| `verification_artifacts/RAG/b4_sanity_test.json` | LIVE | Madhav_M2A_Exec_6 | HNSW p95 latency; sanity query top-5 including ≥1 cgm_node chunk |
| `verification_artifacts/RAG/cgm_chunks_ingestion_report.json` | LIVE | Madhav_M2A_Exec_6 | CGM doc-type 6 DB write results: 234 chunks expected |
| `verification_artifacts/RAG/kr1_kr2_db_verification.json` | LIVE | Madhav_M2A_Exec_6 | KR-1 (stale domain_report count=16) + KR-2 (token ceiling max per doc_type) DB evidence; closes both known_residuals |

---

## §10 — Tooling & Process (scripts)

See `FILE_REGISTRY_v1_4.md §10` — unchanged.

---

*Registry v1.6 produced 2026-04-26 at Madhav_M2A_Exec_6 (B.4 Session 1). Supersedes v1.5 dated 2026-04-26. The machine-readable canonical-path registry is `00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md`; this file's `canonical_artifact_id` column points into it.*
