---
artifact: FILE_REGISTRY_v1_15.md
version: "1.15"
status: "SUPERSEDED (2026-04-28 — content absorbed into CAPABILITY_MANIFEST.json; retained in place for historical audit and provenance)"
date: 2026-04-28
scope: Delta registry for Madhav_M2A_Exec_14 — B.8 Synthesis Layer.
supersedes: FILE_REGISTRY_v1_14.md (2026-04-27, Madhav_M2A_Exec_13)
schema_version: 1.8
changelog:
  - "v1.15 (2026-04-28, Madhav_M2A_Exec_14 close — B.8 Synthesis Layer):"
  - "  (a) §9.1 — FILE_REGISTRY row updated to v1.15 (this file); FILE_REGISTRY_v1_14 flipped to SUPERSEDED."
  - "  (b) §9.17 NEW — Exec_14 deliverables: DerivationEntry+SynthesisAnswer schemas, synthesis prompt, synthesize.py, FastAPI endpoint, TypeScript shim, golden eval set 10/10."
  - "  (c) §9.16.1 updated — schemas.py mutated (DerivationEntry + SynthesisAnswer added)."
  - "  (d) §9.16.3 updated — main.py mutated (rag_synthesize_router added, v1.3)."
  - "  (e) §9.2–§9.15 — unchanged from v1.14 by reference."
  - "v1.14 (2026-04-27, Madhav_M2A_Exec_13): B.7 Router + Plan Library."
  - "v1.13 (2026-04-27, Madhav_M2A_Exec_12): B.6 Hybrid Retrieval Library + M2B milestone close."
---

# MARSYS-JIS File Registry — Final Corpus (v1.15)

**Subject**: Abhisek Mohanty, b. 1984-02-05, 10:43 IST, Bhubaneswar
**Branch**: `feature/amjis-platform`
**Registry date**: 2026-04-28 (v1.15 published at Madhav_M2A_Exec_14 close; supersedes v1.14)

---

## §9.1 — Registry version row

| artifact | version | status | date |
|---|---|---|---|
| `FILE_REGISTRY_v1_15.md` | 1.15 | CURRENT | 2026-04-28 |
| `FILE_REGISTRY_v1_14.md` | 1.14 | SUPERSEDED | 2026-04-27 |
| `FILE_REGISTRY_v1_13.md` | 1.13 | SUPERSEDED | 2026-04-27 |
| `FILE_REGISTRY_v1_12.md` | 1.12 | SUPERSEDED | 2026-04-27 |
| `FILE_REGISTRY_v1_11.md` | 1.11 | SUPERSEDED | 2026-04-26 |

---

## §9.2–§9.15 — Earlier deliverables

See `FILE_REGISTRY_v1_13.md §9.2–§9.15` — unchanged.

---

## §9.16 — Madhav_M2A_Exec_13 deliverables (B.7 Router + Plan Library) — AMENDED

### §9.16.1 — Schema (Python sidecar) — AMENDED by Exec_14

| Path | Version | Status | Role |
|---|---|---|---|
| `platform/python-sidecar/rag/schemas.py` | 1.1 | CURRENT | Pydantic schemas. B.7: `QueryPlan` (7 fields). B.8 amendment: `DerivationEntry` (5 fields: chunk_id, doc_type, layer, signal_or_fact_id, claim_supported) and `SynthesisAnswer` (11 fields: query_text, plan, answer_text, derivation_ledger, confidence Literal[LOW/MED/HIGH], confidence_rationale, interpretations, bundle_chunk_ids, actor, p7_triggered, p6_enforcement) added. |

### §9.16.2 — Taxonomy and prompt documents

See `FILE_REGISTRY_v1_14.md §9.16.2` — unchanged.

### §9.16.3 — Code (Python sidecar — router) — AMENDED by Exec_14

| Path | Version | Status | Role |
|---|---|---|---|
| `platform/python-sidecar/rag/router.py` | 1.0 | CURRENT | See FILE_REGISTRY_v1_14.md §9.16.3 — unchanged. |
| `platform/python-sidecar/rag/routers/rag_router.py` | 1.0 | CURRENT | See FILE_REGISTRY_v1_14.md §9.16.3 — unchanged. |
| `platform/python-sidecar/main.py` | 1.3 | CURRENT | FastAPI app entry point. B.8 amendment: imports `rag_synthesize_router`; registers at `/rag` prefix with verify_api_key dependency. Full path: POST /rag/synthesize. |

### §9.16.4 — Code (TypeScript — router client)

See `FILE_REGISTRY_v1_14.md §9.16.4` — unchanged.

### §9.16.5 — Evaluation artifacts

See `FILE_REGISTRY_v1_14.md §9.16.5` — unchanged.

---

## §9.17 — Madhav_M2A_Exec_14 deliverables (B.8 Synthesis Layer)

### §9.17.1 — Synthesis prompt

| Path | Version | Status | Role |
|---|---|---|---|
| `035_DISCOVERY_LAYER/PROMPTS/claude/synthesis_v1_0.md` | 1.0 | CURRENT | Acharya-grade synthesizer system prompt for claude-opus-4-6. Frontmatter: artifact, version=1.0, status=CURRENT, model=claude-opus-4-6. Body: role+mandate; length constraint (600-word answer_text cap); structured input format (QUERY_PLAN + RETRIEVAL_BUNDLE); strict JSON output format (6 fields); P5 enforcement rule (bundle-only chunk_ids); P6 enforcement rule (UCN presence → full/degraded); confidence rubric (HIGH/MED/LOW by cross-layer coverage); P7 gate (3 interpretations when significance_score≥0.7); 2 worked examples (interpretive_multidomain sig=0.82 with P7; factual sig=0.30 without P7). |

### §9.17.2 — Synthesis engine (Python sidecar)

| Path | Version | Status | Role |
|---|---|---|---|
| `platform/python-sidecar/rag/synthesize.py` | 1.0 | CURRENT | Synthesis engine. `ANTHROPIC_MODEL = "claude-opus-4-6"`. Implements: `_load_synthesis_prompt()` (reads synthesis_v1_0.md, strips YAML frontmatter, path resolved via _REPO_ROOT); `_build_bundle_context(plan, results) -> str` (formats QueryPlan + RetrievalResult list as structured user message, derives layer from doc_type via _DOC_TYPE_TO_LAYER map); `synthesize(plan, results) -> SynthesisAnswer` (Anthropic SDK call, temp=0.2, max_tokens=4096; JSON parse; post-parse: sets p7_triggered, bundle_chunk_ids, actor; enforces P7 gate; enforces P5 check; constructs SynthesisAnswer); `class SynthesisError(Exception)`. Note: max_tokens raised to 4096 from brief-specified 1500; 1500 insufficient for P7 3-interpretation + full derivation ledger JSON (spec gap documented in session log). |

### §9.17.3 — FastAPI endpoint (Python sidecar)

| Path | Version | Status | Role |
|---|---|---|---|
| `platform/python-sidecar/rag/routers/rag_synthesize.py` | 1.0 | CURRENT | FastAPI router for POST /rag/synthesize. `SynthesizeRequest(BaseModel)`: `query: str = Field(..., min_length=1, max_length=2000)`. Composite pipeline: classify_query → retrieve (mode="auto" if wcr_forced else "hybrid_rrf", k=10, rerank=True) → synthesize. Returns `{"answer": answer.model_dump()}`. SynthesisError → HTTP 422; all other exceptions → HTTP 500. |

### §9.17.4 — TypeScript shim

| Path | Version | Status | Role |
|---|---|---|---|
| `platform/src/lib/rag/synthesizeClient.ts` | 1.0 | CURRENT | TypeScript shim for POST /rag/synthesize. Exports: `DerivationEntry` interface (5 fields); `SynthesisAnswer` interface (11 fields, `plan` typed as `QueryPlan` imported from `./routerClient`); `ragSynthesize(query: string): Promise<SynthesisAnswer>` calling POST with JSON body `{query}`. Reads `NEXT_PUBLIC_SIDECAR_URL` + `SIDECAR_API_KEY` from env. Mirrors retrieveClient.ts + routerClient.ts pattern. |

### §9.17.5 — Evaluation artifacts

| Path | Version | Status | Role |
|---|---|---|---|
| `verification_artifacts/RAG/synthesis_golden_v1_0.json` | 1.0 | CURRENT | B.8 synthesis golden set. 10 queries (SQ.001–SQ.010). 5 P7-gated (SQ.001–SQ.005, significance≥0.7, confirmed via classify_query() 2026-04-28): career+wealth (0.80), psychological tension (0.90), relationships (0.75), career timing (0.75), spiritual+dharmic (0.80). 5 standard (SQ.006–SQ.010, significance<0.7): factual (7th house lord, 10th house occupant, active mahadasha), meta (conflicting interpretations), factual (UCN section headings). |
| `verification_artifacts/RAG/synthesis_eval_v1_0.json` | 1.0 | CURRENT | B.8 synthesis eval results. Session: Madhav_M2A_Exec_14. Model: claude-opus-4-6. Total: 10. derivation_ledger_pass: 10/10. p7_pass: 10/10 (5/5 P7-gated queries produced exactly 3 interpretations). p5_pass: 10/10 (0 out-of-bundle refs). All AC.7, AC.8, AC.9 gates PASS. |
