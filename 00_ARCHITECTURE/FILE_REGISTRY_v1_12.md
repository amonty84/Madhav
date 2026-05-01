---
artifact: FILE_REGISTRY_v1_12.md
version: "1.12"
status: CURRENT
date: 2026-04-27
scope: Delta registry for Madhav_M2A_Exec_11 — B.5 Discovery Engine Session 3 deliverables (cluster annotation, contradiction register, combined red-team, B.5 phase final close).
supersedes: FILE_REGISTRY_v1_11.md (2026-04-26, Madhav_M2A_Exec_10)
schema_version: 1.8
changelog:
  - "v1.12 (2026-04-27, Madhav_M2A_Exec_11 close — B.5 Session 3 complete):"
  - "  (a) §9.1 — FILE_REGISTRY row updated to v1.12 (this file); FILE_REGISTRY_v1_11 flipped to SUPERSEDED."
  - "  (b) §9.14 NEW — Exec_11 deliverables: cluster annotation infrastructure, CLUSTER_ATLAS, contradiction scan infrastructure, CONTRADICTION_REGISTER, p6 sweep, acceptance check, red-team, ledger schema extension, prompt registry additions."
  - "  (c) §9.2–§9.13 — unchanged from v1.11 by reference."
  - "v1.11 (2026-04-26, Madhav_M2A_Exec_10): B.5 Session 2 complete."
  - "v1.10 (2026-04-27, Madhav_M2A_Exec_9): B.5 Session 1 complete."
---

# MARSYS-JIS File Registry — Final Corpus (v1.12)

**Subject**: Abhisek Mohanty, b. 1984-02-05, 10:43 IST, Bhubaneswar
**Branch**: `feature/amjis-platform`
**Registry date**: 2026-04-27 (v1.12 published at Madhav_M2A_Exec_11 close; supersedes v1.11)

---

## §9.1 — Registry version row

| artifact | version | status | date |
|---|---|---|---|
| `FILE_REGISTRY_v1_12.md` | 1.12 | CURRENT | 2026-04-27 |
| `FILE_REGISTRY_v1_11.md` | 1.11 | SUPERSEDED | 2026-04-26 |
| `FILE_REGISTRY_v1_10.md` | 1.10 | SUPERSEDED | 2026-04-27 |

---

## §9.2–§9.13 — Earlier deliverables

See `FILE_REGISTRY_v1_11.md §9.2–§9.13` — unchanged.

---

## §9.14 — Madhav_M2A_Exec_11 deliverables (B.5 Discovery Engine Session 3 — Cluster Annotation + Contradiction Register + B.5 Phase Final Close + Combined Red-Team)

### §9.14.1 — Code (Python sidecar — cluster annotation pipeline)

| Path | Version | Status | Role |
|---|---|---|---|
| `platform/python-sidecar/rag/reconcilers/cluster_reconciler.py` | 1.0 | CURRENT | Claude Pass-2 reconciler for B.5 cluster annotation. Parses cluster_annotations YAML from Gemini raw response; validates label, dominant_domain, annotation ≥50 chars, confidence ≥0.60, signal_ids in MSR registry, Gemini verdict; writes to CLUSTER_ATLAS. |
| `platform/python-sidecar/rag/reconcilers/run_cluster_pipeline.py` | 1.0 | CURRENT | Orchestrates cluster annotation pipeline. Reads from `*_B5_cluster_annotation_{batch_id}_raw.md`; hard-halt on ACCEPTANCE_RATE_ANOMALY; opens DR entry. |
| `platform/python-sidecar/rag/reconcilers/contradiction_reconciler.py` | 1.0 | CURRENT | Claude+Gemini two-pass reconciler for B.5 contradiction scan. CONTRADICTS flow (inverted): Claude Pass-1 hypotheses + Gemini Pass-2 adjudications → CONTRADICTION_REGISTER. |
| `platform/python-sidecar/rag/reconcilers/run_contradiction_pipeline.py` | 1.0 | CURRENT | Orchestrates contradiction scan pipeline. Reads Claude + Gemini raw files; produces CONTRADICTION_REGISTER entries. |

### §9.14.2 — Schemas (JSON)

| Path | Version | Status | Role |
|---|---|---|---|
| `06_LEARNING_LAYER/SCHEMAS/cluster_schema_v0_1.json` | 0.1 | CURRENT | JSON Schema for CLUSTER_ATLAS entries. Required fields: cluster_id (CLUS.NNN), cluster_label, dominant_domain, sub_domains, signal_ids (≥3), chunk_ids, centroid_method, cluster_size_n, pass_1_actor, confidence (≥0.60 threshold), significance, annotation, ledger_event_ids. |
| `06_LEARNING_LAYER/SCHEMAS/contradiction_schema_v0_1.json` | 0.1 | CURRENT | JSON Schema for CONTRADICTION_REGISTER entries. Required fields: contradiction_id (CON.NNN), contradiction_class, hypothesis_text, mechanism, domains_implicated, signals_in_conflict (≥2), l1_references, claude_severity_prior, resolution_options, gemini_verdict, ledger_event_ids, pass_1_actor. |
| `06_LEARNING_LAYER/SCHEMAS/two_pass_events_schema_v0_1.json` | 0.1 | CURRENT (extended in-place) | Extended at Exec_11: added cluster event types (cluster_proposal, claude_cluster_accept, claude_cluster_reject), cluster_id field (CLUS.NNN), cluster_payload field. Also added gemini_revalidation_pass1 event type (backfill for AC.4 events). |

### §9.14.3 — Prompts

| Path | Version | Status | Role |
|---|---|---|---|
| `035_DISCOVERY_LAYER/PROMPTS/gemini/cluster_annotation_v1_0.md` | 1.0 | CURRENT | Gemini Pass-1 cluster annotation prompt. Sections: Role, Chart context, Output schema (strict YAML cluster_annotations:), Rejection criteria a-d + tightening block, Per-batch cluster input template, Registration. |
| `035_DISCOVERY_LAYER/PROMPTS/claude/contradiction_scan_v1_0.md` | 1.0 | CURRENT | Claude Pass-1 contradiction scan prompt. Sections: Purpose/scope, Chart context, Contradiction classes (C.1–C.6), Output schema (strict YAML contradiction_hypotheses:), Quality discipline, Registration. |

### §9.14.4 — Discovery Layer Registers

| Path | Version | Status | Role |
|---|---|---|---|
| `035_DISCOVERY_LAYER/REGISTERS/CLUSTER_ATLAS_v1_0.json` | 1.0 | LIVE | Cluster atlas (canonical JSON). 12 clusters (CLUS.001–CLUS.012); KMeans/HDBSCAN over Vertex AI text-multilingual-embedding-002 embeddings; 12 domains covered; 100% two-pass trail. |
| `035_DISCOVERY_LAYER/REGISTERS/CLUSTER_ATLAS_v1_0.md` | 1.0 | LIVE | Cluster atlas (Markdown mirror). Regenerated by cluster_reconciler.py; do not edit directly. |
| `035_DISCOVERY_LAYER/REGISTERS/CONTRADICTION_REGISTER_v1_0.json` | 1.0 | LIVE | Contradiction register (canonical JSON). 8 confirmed contradictions (CON.001–CON.008); CONTRADICTS flow (Claude Pass-1 + Gemini Pass-2); 100% two-pass trail. |
| `035_DISCOVERY_LAYER/REGISTERS/CONTRADICTION_REGISTER_v1_0.md` | 1.0 | LIVE | Contradiction register (Markdown mirror). Regenerated by contradiction_reconciler.py; do not edit directly. |

### §9.14.5 — Verification Artifacts

| Path | Version | Status | Role |
|---|---|---|---|
| `verification_artifacts/RAG/p6_retroactive_sweep_v1_0.json` | 0.1 | CURRENT | P6 retroactive sweep results. PARTIAL-IMPL (keyword heuristic scan). 0 conflict flags. Residual status documented + whitelisted per ONGOING_HYGIENE_POLICIES §G. |
| `verification_artifacts/RAG/b5_session3_summary.json` | 0.1 | CURRENT | B.5 Session 3 acceptance check. All 8 bars PASS: ≥20 patterns (22), ≥10 resonances (12), ≥5 contradictions (8), ≥10 clusters (12), 100% two-pass trail, 100% FL→PRED, 0 P9 violations, P6 documented. |
| `verification_artifacts/RAG/batch_acceptance_rates.json` | rolling | LIVE | Cluster batch acceptance rates. batch1: 80.0% (12/15 accepted; within band [15%,80%]). |
| `verification_artifacts/RAG/RED_TEAM_M2B_PHASE_B5_v1_0.md` | 1.0 | CURRENT | Combined red-team: mid-phase B.5 (§IS.8(a), counter=3) + B.5 phase-close (§IS.8(b)). 12 probes: all PASS. red_team_counter resets to 0. |

### §9.14.6 — Gemini Raw Responses (Exec_11)

| Path | Status | Role |
|---|---|---|
| `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/2026-04-27_B5_cluster_annotation_batch1_raw.md` | ARCHIVED | Gemini Pass-1 cluster annotation batch1. 15 proposals, 12 accepted. |
| `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/2026-04-27_B5_claude_contradiction_batch1_raw.md` | ARCHIVED | Claude Pass-1 contradiction scan batch1. 10 hypotheses. |
| `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/2026-04-27_B5_gemini_contradiction_pass2_batch1_raw.md` | ARCHIVED | Gemini Pass-2 contradiction adjudications. 8 CONFIRMED, 2 REJECTED. |

### §9.14.7 — Governance Updates (Exec_11)

| Path | Version | Status | Change |
|---|---|---|---|
| `00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md` | 1.0 | LIVING | DIS.003/4/5 → RESOLVED (Option B). DIS.006/7/8 backfilled + immediately resolved. DIS.009 opened (PAT.008 gemini_conflict, OPEN per Q2 soft gate). |
| `06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json` | rolling | LIVE | Added: gemini.cluster_annotation v1.0, claude.contradiction_scan v1.0, claude.pattern_revalidation v1.0 (backfill), gemini.contradiction_adjudication v1.0 (backfill). 10 total entries. |
| `035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.json` | 1.0 | LIVE | Added re_validation_status + re_validation_event_id fields to all 22 patterns (in-place additive per AC.4). |
| `06_LEARNING_LAYER/SCHEMAS/pattern_schema_v0_1.json` | 0.1 | CURRENT (extended in-place) | Added re_validation_status + re_validation_event_id properties (additive, Exec_11 AC.4). |

---

*End of FILE_REGISTRY_v1_12.md — v1.12 (Madhav_M2A_Exec_11 close — B.5 Session 3 complete — 2026-04-27).*
