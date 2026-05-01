---
artifact: M2A_EXEC_PLAN
version: "1.0"
status: READY_FOR_EXEC
produced_by: Madhav_M2A_Plan_Foundation_Stack
produced_on: 2026-04-25
planned_by_model: claude-sonnet-4-6
execution_model: claude-sonnet-4-6
milestone: "M2A — Foundation Stack"
sub_phases_covered: [B.1, B.2, B.3, B.3.5]
file_registry_snapshot_count: 35
  # Derived from FILE_REGISTRY_v1_3.md §1–§7 CURRENT/Current rows + FILE_REGISTRY_v1_4.md §6
  # migration rows. The prescribed field `is_current: true` does NOT exist in FILE_REGISTRY_v1_4.md
  # — see OBS.1. Count: §1 L0=4, §2 L1=5, §3 L2=5, §4 L2.5=5, §5 L3=9, §6 Remedial=2,
  # §7 Temporal=2, §6-migration=3. Total = 35. B.1 manifest acceptance target = ≥35.
estimated_sessions: 5
  # B.1=1 session, B.2=2 sessions, B.3=1 session, B.3.5=1 session. PHASE_B_PLAN velocity
  # confirmed. See §SESSION_PACKAGING for session-boundary recommendations.
---

# M2A Execution Plan v1.0 — Foundation Stack (B.1–B.3.5)

*Produced in `Madhav_M2A_Plan_Foundation_Stack` (2026-04-25) per `CLAUDECODE_BRIEF.md` §5.*
*Executor: Claude Code Extension. Input to Cowork for M2A-Exec brief.*

---

## §OBS — Pre-Condition Observations

The following divergences between what PHASE_B_PLAN_v1_0.md §G expects and actual repo state were found during the §3 pre-condition check on 2026-04-25.

---

**OBS.1 — FILE_REGISTRY version and `is_current: true` field absent**

- PHASE_B_PLAN §G B.1 references `FILE_REGISTRY_v1_0.md` and the acceptance criterion uses `is_current=true` count as the manifest target.
- Actual: Current registry is `FILE_REGISTRY_v1_4.md` (delta-style; §1–§7 content lives in `FILE_REGISTRY_v1_3.md`). The field `is_current: true` does NOT appear anywhere in either file. The registry uses markdown table rows with a `Status` column valued `CURRENT | Current | LIVE | LIVING | CLOSED | SUPERSEDED`.
- `grep -c "is_current: true" FILE_REGISTRY_v1_4.md` returns **0**.
- Impact on plan: B.1 acceptance criterion "Manifest count matches FILE_REGISTRY_v1_0.md `is_current=true` count" cannot be verified as written.
- Resolution: Replace with the count of CURRENT/Current rows from the combined registry (v1_3 §1–§7 + v1_4 §6 migration additions). Computed count = **35** (see frontmatter). B.1 manifest acceptance target = `ingestion_manifest.json` document_count ≥ 35, with every Document tagged `is_current: true` having a corresponding CURRENT/Current row in FILE_REGISTRY_v1_4 (or v1_3 §1–§7). In the `ingest.py` implementation, derive `is_current` from FILE_REGISTRY row status: CURRENT/Current → `True`; all other statuses → `False`. B.1 accepts if: CURRENT-document count = 35 (exact, not ≥), confirming no over-count of stale rows.

---

**OBS.2 — STALENESS_REGISTER.md absent (expected)**

- PHASE_B_PLAN §G B.1 references STALENESS_REGISTER.md as a B.1 output, not an input.
- Actual: File does not exist at `00_ARCHITECTURE/STALENESS_REGISTER.md`. This is correct — it is a B.1 deliverable.
- Impact on plan: None. B.1 Task 3 creates it.
- Resolution: No change. B.1 Task 3 proceeds as planned.

---

**OBS.3 — `06_LEARNING_LAYER/` structure reflects Step 11 decisions, not F.1 spec verbatim**

- PHASE_B_PLAN §F.1 specifies `CALIBRATION_TABLES/`, `PARAMETER_STORE/`, `SHADOW_OBSERVATIONS/`.
- Actual (per `LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md`, Step 11): `SIGNAL_WEIGHT_CALIBRATION/` (LL.1 stub), `GRAPH_EDGE_WEIGHT_LEARNING/` (LL.2 stub), `EMBEDDING_SPACE_ADAPTATION/` (LL.3 stub), `PROMPT_OPTIMIZATION/` (LL.4 stub), `OBSERVATIONS/.gitkeep`, `PARAMETER_UPDATES/.gitkeep`. Also present (per B.0): `PREDICTION_LEDGER/`, `PROMPT_REGISTRY/`, `SCHEMAS/`, `README.md`.
- Impact on plan: None for B.1–B.3.5. The Step 11 structure supersedes F.1 for the mechanism stubs. B.1–B.3.5 touch only `PREDICTION_LEDGER/prediction_ledger.jsonl` and `PROMPT_REGISTRY/INDEX.json`.
- Resolution: No change to plan. Executor must not attempt to create CALIBRATION_TABLES/, PARAMETER_STORE/, SHADOW_OBSERVATIONS/ — those names are superseded. `must_not_touch: 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/`, `06_LEARNING_LAYER/GRAPH_EDGE_WEIGHT_LEARNING/`, `06_LEARNING_LAYER/EMBEDDING_SPACE_ADAPTATION/`, `06_LEARNING_LAYER/PROMPT_OPTIMIZATION/`.

---

**OBS.4 — All 9 validator stubs exist; stub docstrings carry incorrect phase-deferral labels**

- PHASE_B_PLAN §G B.1 Task 1.5: "Implement p1/p2/p5 validators."
- Actual: B.0 scaffolded all 9 validators (p1–p9) as stub modules with docstrings. Stubs for p1/p2/p5 say "Implementation deferred to Phase B.4" (incorrect — B.1 is the correct implementation phase for these three). p6/p9 say similar but carry different deferred-phase labels.
- Impact on plan: B.1 Task 1.5 proceeds as planned — replace p1/p2/p5 stub bodies with full implementations. The "deferred to Phase B.4" docstring label in p1/p2/p5 stubs is wrong and must be corrected to "Phase B.1" in the updated docstring header.
- Resolution: B.1 Task 1.5 implements p1/p2/p5 as working code. p3/p4/p6–p9 remain stubs.

---

**OBS.5 — CGM_v2_0.md is CURRENT; CGM_v9_0.md does not exist**

- Actual state is correct and expected. CGM_v2_0 is the input for B.3.5. CGM_v9_0 is a B.3.5 deliverable.
- Impact on plan: Doc-type 6 CGM node chunks cannot be generated until B.3.5 produces CGM_v9_0. B.3.5 Task 5.5 triggers the doc-type 6 re-chunk after CGM_v9_0 is written.
- Resolution: No change. Dependency is captured in §DEPS.

---

**OBS.6 — `035_DISCOVERY_LAYER/PROMPTS/gemini/` contains no .md prompt files yet**

- Actual: `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/` directory exists (empty). No gemini prompt `.md` files present. A single `035_DISCOVERY_LAYER/PROMPTS/claude/placeholder_v1_0.md` is present.
- Impact on plan: `cgm_edge_proposals_v1_0.md` must be authored as B.3.5 Task 3.5 (as planned in PHASE_B_PLAN §G B.3.5). The responses/ directory is ready for Gemini raw response drops.
- Resolution: No change. B.3.5 Task 3.5 authors the prompt file.

---

**OBS.7 — `PROMPT_REGISTRY/INDEX.json` has one placeholder entry from B.0 smoke test**

- `06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json` carries one entry: `placeholder_v1_0` pointing to `035_DISCOVERY_LAYER/PROMPTS/claude/placeholder_v1_0.md` with hash and timestamp.
- Impact on plan: When B.3.5 registers `cgm_edge_proposals_v1_0.md` via `prompt_registry.py`, it appends to the existing INDEX.json (register is append-only per Hook 3). The placeholder entry remains and does not interfere.
- Resolution: No change.

---

## §DEPS — Cross-Phase Dependency Map

| # | Consuming phase | Consuming task | Depends on | Producing phase | Gate type | Notes |
|---|---|---|---|---|---|---|
| D1 | B.2 | All 6 chunkers — P1/P2/P5 gating on every chunk write | P1/P2/P5 validators implemented + all meta-tests passing | B.1 Task 1.5 | **Hard gate** | B.2 cannot begin until `pytest rag/validators/test_p1_p2_p5.py` passes |
| D2 | B.3 | `embed.py` — Voyage batch embedding | `rag_chunks` table populated with ≥35 CURRENT doc chunks | B.2 all doc-types 1–5 | **Hard gate** | Empty rag_chunks = nothing to embed |
| D3 | B.3 | HNSW index creation | `rag_chunks` populated (sufficient chunk count for index build) | B.2 | **Hard gate** | PostgreSQL HNSW index requires vectors; pgvector errors on empty table index build |
| D4 | B.3.5 Task 5.5 | Doc-type 6 CGM node chunker re-run | Doc-type 6 chunker code exists in `rag/chunk.py` (or `chunkers/cgm_node.py`) | B.2 chunker implementation | **Hard gate** | B.3.5 triggers the doc-type 6 chunker; chunker code must pre-exist from B.2 even though CGM_v9_0 input is only available at B.3.5 |
| D5 | B.3.5 Gemini pass | Two-pass on CGM edge proposals | `cgm_edge_proposals_v1_0.md` authored + registered in PROMPT_REGISTRY via `prompt_registry.py` | B.3.5 Task 3.5 | **Hard gate** | Must register prompt before any Gemini invocation per Hook 3 discipline |
| D6 | B.3.5 Claude reconciler | Invariant scan of Gemini proposals | Gemini raw response file exists at `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/YYYY-MM-DD_B3-5_batch<N>_raw.md` | B.3.5 Gemini pass (human-in-loop) | **Hard gate** | Reconciler reads the raw file; file must exist before reconciler starts |
| D7 | B.2 all doc-types | `Chunk` Pydantic model pre-write validation | `models.py` implements `Document`, `Chunk` Pydantic models | B.1 Task 2 | **Hard gate** | Every chunk validated against `Chunk` model before write |
| D8 | B.1 P2 validator | Resolution of L1 IDs referenced in `v6_ids_consumed` | FORENSIC_v8_0 ID list loaded as resolution target (NOT v6.0) | B.1 Task 1.5 setup | **Hard gate** | P2 validator must load v8.0 IDs; incorrect ID space = false accepts on stale references |
| D9 | B.3.5 Task 5.5 | Doc-type 6 chunker input | `CGM_v9_0.md` written with node entries | B.3.5 Task 5 | **Hard gate** | Chunker reads CGM_v9_0 file for node boundary detection |
| D10 | B.2 doc-type 1 chunks | 499 signal chunk count AC | 499 MSR signals parseable from MSR_v3_0.md | B.1 ingest scan | Soft dependency | B.1 must verify 499 signals parseable before B.2 can confirm the AC |
| D11 | B.3 sanity test | "Saturn 7th house Libra" top-3 retrieval | UCN + MSR chunks embedded and indexed | B.3 | **Internal** | Sanity query requires relevant chunks already embedded; not a cross-phase dependency but must run AFTER HNSW index creation |
| D12 | B.2 stale metadata | `is_stale` propagation on all L3 doc-type 5 chunks | `STALENESS_REGISTER.md` populated with stale L3 entries | B.1 Task 3 | **Hard gate** | Chunker reads STALENESS_REGISTER at chunk-write time to set is_stale flag |

---

## §RISKS — Risks and Sequencing Constraints

### B.1 Risks

| Risk | Likelihood | Impact | Stop condition | Mitigation |
|---|---|---|---|---|
| `FORENSIC_v8_0.md` section IDs inconsistently formatted — P2 can't build resolution set | M | H | STOP if P2 meta-test reject-fixture for `PLN.FAKE.99` does not trigger a reject | Load IDs from FORENSIC frontmatter registry + section-boundary regex; document the ID namespace in P2 fixture header |
| MSR_v3_0.md yields fewer than 499 signals on parse | L | H | STOP if `scan_corpus()` reports signal_count < 499 | Verify regex `^SIG\.MSR\.\d{3}:$` against MSR_v3_0.md before writing acceptance test |
| STALENESS_REGISTER cannot determine staleness without reading full L3 file versions | M | M | No stop; note `version_aligned_with: UNKNOWN` for any L3 file missing version frontmatter | Executor reads `version:` frontmatter of each L3 report and compares against FORENSIC_v8_0 version |
| `v6_ids_consumed` field appears in older MSR signals but references v6.0 IDs not present in v8.0 | H | M | Log as P2 flagged (not a STOP); write with `citation_valid: false` | Per PHASE_B_PLAN §E.6 P2 note: P2 validator checks v8.0 resolution target, not v6.0; expected to flag some signals |

### B.2 Risks

| Risk | Likelihood | Impact | Stop condition | Mitigation |
|---|---|---|---|---|
| CDLM grid cell parsing — markdown table rows don't match expected 9×9 grid dimensions | M | H | STOP if CDLM chunker produces chunk count ≠ expected grid cells | Parse table with robust row/column extraction; log cell counts before write |
| UCN H2 Part sections exceed 1500 token limit — split at H3 creates orphan sub-chunks | M | M | No stop; verify sub-chunk count in chunking_report.json | Implement H3-split with `sub_chunk_index` metadata; flag any sub-chunk > 1500 tokens as WARN in ingestion log |
| Domain report files lack `## Part` boundary markers — doc-type 5 chunker finds zero chunks | M | H | STOP if any domain report yields 0 doc-type 5 chunks | Pre-flight: run boundary regex on all 9 domain report files; halt if any returns 0 matches |
| L1 FORENSIC_v8_0 section count changes between B.1 scan and B.2 chunking | L | L | No stop | Sections are fixed at v8.0; if executor detects version change, emit [PRINCIPLE_VIOLATION_SUSPECTED] |
| Doc-type 6 CGM chunker code must exist by B.3.5 even though it produces no chunks in B.2 | H | H | STOP if doc-type 6 chunker not implemented before B.2 closes | B.2 session plan explicitly requires implementing all 6 chunkers including doc-type 6 (code only; no CGM_v9_0 input yet). See §PLAN B.2 Task note |

### B.3 Risks

| Risk | Likelihood | Impact | Stop condition | Mitigation |
|---|---|---|---|---|
| Voyage API outage during B.3 embedding run | M | H | STOP per PHASE_B_PLAN §G B.3 halt policy: emit [RETRIEVAL_UNAVAILABLE]; log unindexed chunk IDs to `verification_artifacts/RAG/unindexed_chunks.jsonl`; do NOT fall back to OpenAI | Per PHASE_B_PLAN: OpenAI fallback is forbidden at index time (mixed embedding spaces). Re-attempt when Voyage available |
| HNSW p95 query > 50ms at chunk count ~1,200 | L | M | No stop; log as WARN and report to native | Tune HNSW `m` and `ef_construction` parameters; 1,200 chunks is well within HNSW capacity |
| Sanity query "Saturn 7th house Libra" returns unexpected top-3 | M | M | No stop; document in B.3 close note and surface to native for calibration | Expected retrieval should surface MSR signals related to Saturn + 7th house + Libra; confirm UCN section present |

### B.3.5 Risks

| Risk | Likelihood | Impact | Stop condition | Mitigation |
|---|---|---|---|---|
| GAP.13 unresolved at B.3.5 (Pitrukaraka 7-karaka vs 8-karaka) | L | M | STOP with [NATIVE_CONFIRMATION_NEEDED] | GAP.13 is RESOLVED per GAP_13_RESOLUTION_v1_0.md (Madhav_17_B0). Should not fire. Confirm at B.3.5 open |
| CGM_v9_0 node positions diverge from FORENSIC_v8_0 — P1 violation at reconciler pass | M | H | STOP if P1 validator fires on any CGM_v9_0 node during Task 4 Claude reconciler pass | Every node position derives from FORENSIC_v8_0 L1 source section; cite by section ID, not by memory |
| Gemini proposes edges with fabricated L1 basis (hallucinated chart positions) | H | M | Log as rejected by P1 reconciler; DO NOT block; emit `[EXTERNAL_COMPUTATION_REQUIRED]` for any unresolvable position claim | P5 invariant check on Gemini proposals: any `L1_basis` that doesn't resolve to a FORENSIC_v8_0 section → REJECTED with logged rationale |
| Gemini raw response file malformed / not committed before reconciler reads it | M | H | STOP if `gemini_response_ref` path does not exist on disk | Commit the raw response file to git BEFORE starting Claude reconciler. P9 validator checks gemini_response_ref exists |
| CGM_v9_0 7-karaka vs 8-karaka node count inconsistency | M | M | No stop; flag as OBS in B.3.5 close note | Per GAP_13_RESOLUTION: Pitrukaraka-dependent nodes carry both readings; `karaka_system: "7-karaka-alternative"` metadata must be set |

### Red-Team Probes for M2A-Exec Close

*`red_team_due: true` at M2A-Exec open (counter = 3, threshold = 3). These 6 probes fire at the final M2A-Exec session close (B.3.5 close). All 6 are appropriate for B.1–B.3.5 deliverables.*

| Probe | Target | Pass condition | Verification command |
|---|---|---|---|
| **RT1 — P1 validator functional** | `p1_layer_separation.py` (B.1 deliverable) | `pytest rag/validators/test_p1_p2_p5.py::test_p1_rejects_interpretive_in_l1 -v` passes (reject fixture: L1-tagged chunk containing modal verb "indicates") | `pytest platform/python-sidecar/rag/validators/test_p1_p2_p5.py -v -k p1` |
| **RT2 — P2 validator functional** | `p2_citation.py` (B.1 deliverable) | Reject fixture: L2+ chunk with `v6_ids_consumed: [PLN.FAKE.99]` (non-existent in FORENSIC_v8_0) → reject; accept fixture: valid L1 ID → accept | `pytest platform/python-sidecar/rag/validators/test_p1_p2_p5.py -v -k p2` |
| **RT3 — P5 signal-ID resolution** | `p5_signal_id_resolution.py` (B.1 deliverable) | Reject fixture: chunk content referencing `SIG.MSR.999` (non-existent) → blocked write; accept fixture: `SIG.MSR.001` (exists in MSR_v3_0) → allowed | `pytest platform/python-sidecar/rag/validators/test_p1_p2_p5.py -v -k p5` |
| **RT4 — Stale-L3 propagation** | B.2 rag_chunks (doc-type 5 stale metadata) | Count of `is_stale: true` doc-type 5 chunks in rag_chunks = count of stale L3 entries in STALENESS_REGISTER.md | `SELECT count(*) FROM rag_chunks WHERE doc_type='domain_report' AND is_stale=true;` compared to `grep -c "is_stale: true" 00_ARCHITECTURE/STALENESS_REGISTER.md` |
| **RT5 — Token ceiling enforcement** | B.2 rag_chunks all doc-types | SELECT of max token_count per doc_type must be ≤ ceiling (msr_signal≤800, ucn_section≤1500, cdlm_cell≤400, l1_fact≤1000, domain_report≤1500) | `SELECT doc_type, max(token_count) FROM rag_chunks GROUP BY doc_type;` — all rows within ceiling |
| **RT6 — CGM node integrity** | B.3.5 CGM_v9_0.md + rag_chunks doc-type 6 | 5 randomly selected CGM_v9_0 node planet positions cross-referenced against FORENSIC_v8_0 — all match exactly; `karaka_system` field present on all KRK-type nodes | Manual spot-check of 5 CGM_v9_0 nodes against `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md`; automated: `SELECT node_id, karaka_system FROM rag_chunks WHERE doc_type='cgm_node' AND karaka_system IS NULL AND node_type='KRK';` must return 0 rows |

---

## §PLAN — Sub-Phase Execution Plan

### Phase B.1 — Ingestion + Staleness Register

**Session:** M2A-Exec (Session 1 of 5)
**Pre-condition:** This session opens only if `pytest platform/python-sidecar/rag/validators/test_p1_p2_p5.py` passes by end of session (B.2 cannot start otherwise). No B.2 work in this session.

#### B.1 Task 1 — Implement `rag/models.py`

**Input:** `PHASE_B_PLAN_v1_0.md §G B.1 Task 2` + `chunker_spec_v1_0.md` metadata field lists  
**Output:** `platform/python-sidecar/rag/models.py` — working Pydantic v2 models  
**Required models:**
- `Document` — `path: str`, `layer: Literal['L1','L2','L2.5','L3','L4']`, `doc_type: str`, `version: str`, `is_current: bool`, `supersedes: Optional[str]`, `frontmatter: dict`
- `Chunk` — `chunk_id: str` (content-hash derived), `doc_type: str`, `layer: str`, `source_file: str`, `source_version: str`, `content: str`, `token_count: int`, `is_stale: bool`, `stale_reason: Optional[str]`, `stale_since: Optional[str]`, `citation_valid: bool`, `external_computation_pending: bool`, `metadata: dict`
- `Signal` — MSR signal representation with `signal_id`, `signal_name`, `signal_type`, `domains_affected`, `confidence`, `valence`, `temporal_activation`, `tags`, `provenance`
- `GraphNode` — `node_id`, `node_type`, `node_label`, `domains`, `layer`
- `GraphEdge` — `source_id`, `target_id`, `edge_type`, `weight`, `ledger_event_ref`
- `RegisterEntry` — generic discovery register entry with `entry_id`, `entry_type`, `status`, `confidence`, `ledger_event_ids`
- `LedgerEvent` — `event_id`, `event_type`, `actor`, `timestamp`, `prompt_ref`, `prompt_version`, `prompt_hash`, `gemini_response_ref: Optional[str]`, `input_bundle_hash`, `artifact_id`

**Stop condition:** STOP if Pydantic validation on a well-formed test Document raises a schema error.  
**Test gate:** `python -c "from rag.models import Document, Chunk, Signal; print('models OK')"` must pass.

---

#### B.1 Task 2 — Implement `rag/ingest.py`

**Input:** All corpus `.md` files (excluding `99_ARCHIVE/`, `node_modules/`, `platform/src/`); `FILE_REGISTRY_v1_4.md` (cross-reference for `is_current` tagging)  
**Output:** `platform/python-sidecar/rag/ingest.py` — `scan_corpus(root: str) -> list[Document]`  
**Implementation spec:**
- Walk `root` recursively; skip `99_ARCHIVE/`, `node_modules/`, `platform/src/`, `.git/`, `platform/supabase/`, `platform/scripts/`
- For each `.md` file: parse YAML frontmatter (`pyyaml`); extract `layer`, `artifact`, `version`, `status`, `supersedes`
- Cross-reference FILE_REGISTRY: if file's `artifact` ID appears in FILE_REGISTRY with `CURRENT` or `Current` status → `is_current=True`; else `is_current=False`
- Parse MSR_v3_0.md separately with signal-boundary regex `^SIG\.MSR\.\d{3}:$` to extract 499 signal entries for Signal model population
- Emit `verification_artifacts/RAG/ingestion_manifest.json` with: `produced_at`, `scanner_version`, `documents: [{path, layer, doc_type, version, is_current, token_count_approx}]`, `document_count`, `current_document_count`, `signal_count`

**Stop conditions:**
- STOP if `current_document_count` ≠ 35 (see OBS.1)
- STOP if `signal_count` < 499
- STOP if any Document has `layer: null`

**File output:** `platform/python-sidecar/rag/ingest.py`, `verification_artifacts/RAG/ingestion_manifest.json`

---

#### B.1 Task 1.5 — Implement P1/P2/P5 validators with meta-tests

*Sequencing note: Implement AFTER Task 1 (models.py) because fixtures reference the Document/Chunk model structure. Implement BEFORE B.2 — this is the B.2 hard gate.*

**Input:** `PHASE_B_PLAN_v1_0.md §E.6` validator specs; `FORENSIC_ASTROLOGICAL_DATA_v8_0.md` (P2 ID resolution set); `MSR_v3_0.md` (P5 signal-ID registry)

**P1 — `platform/python-sidecar/rag/validators/p1_layer_separation.py`:**
- Load trigger vocabulary from `fixtures/p1_trigger_vocab.json` (create file): `["indicates", "suggests", "implies", "denotes", "shows", "strong", "weak", "afflicted", "will", "tends to", "excellent"]`
- Rule: if chunk `layer == 'L1'` and content contains any trigger word NOT inside backticks/quoted text → reject
- Rule: if chunk `layer` is L2/L2.5/L3 and content has no reference to any `PLN.`, `HSE.`, `SGN.`, `EVT.`, `SIG.MSR.` ID → reject (citation-absent)
- Exception: if `[L1 fact] → [L2 interp]` bridging marker present in content → accept despite trigger word
- Fixtures to create: `fixtures/p1_reject_interpretive_l1.json`, `fixtures/p1_reject_no_layer_tag.json`, `fixtures/p1_reject_mixed_no_bridge.json`, `fixtures/p1_accept_fact_only.json`, `fixtures/p1_accept_interp_only.json`

**P2 — `platform/python-sidecar/rag/validators/p2_citation.py`:**
- Load FORENSIC_v8_0 ID namespace: scan `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` for all `PLN.`, `HSE.`, `SGN.`, `EVT.` prefixed IDs; cache as `resolution_set`
- Rule: if chunk `layer` is L2/L2.5/L3 and has no `v6_ids_consumed` field OR the field is empty → write with `citation_valid: False`; log WARNING (not REJECT — per §E.6 P2 note: missing citation writes with flag, not block)
- Rule: if `v6_ids_consumed` contains an ID NOT in `resolution_set` → write with `citation_valid: False`
- Accept: all listed IDs resolve → `citation_valid: True`
- Fixtures: `fixtures/p2_reject_no_citation.json`, `fixtures/p2_reject_nonexistent_id.json`, `fixtures/p2_accept_valid_ids.json`, `fixtures/p2_accept_empty_l1_chunk.json`

**P5 — `platform/python-sidecar/rag/validators/p5_signal_id_resolution.py`:**
- Load MSR_v3_0 signal registry: scan for all `SIG.MSR.NNN` entries; cache as `signal_registry`
- Rule for `msr_signal` chunks: `signal_id` in metadata must be in `signal_registry` → BLOCK write if not found
- Rule for all other chunks: scan content for `SIG.MSR.\d{3}` pattern; any match NOT in `signal_registry` → emit WARNING (not block)
- Fixtures: `fixtures/p5_reject_nonexistent_signal.json`, `fixtures/p5_accept_valid_signal.json`

**Test file:** `platform/python-sidecar/rag/validators/test_p1_p2_p5.py`
- Parametrize over all fixture files per validator
- Run: `pytest platform/python-sidecar/rag/validators/test_p1_p2_p5.py -v`

**Stop condition:** STOP and do NOT proceed to B.2 if any test fails. STOP if p1_trigger_vocab.json has fewer than 8 trigger terms.  
**Test gate (hard gate for B.2):** `pytest platform/python-sidecar/rag/validators/test_p1_p2_p5.py` → all pass.

---

#### B.1 Task 3 — Create `00_ARCHITECTURE/STALENESS_REGISTER.md`

**Input:** All 9 L3 domain reports (`03_DOMAIN_REPORTS/*.md`); `FORENSIC_ASTROLOGICAL_DATA_v8_0.md` (target version)  
**Output:** `00_ARCHITECTURE/STALENESS_REGISTER.md`  
**Format:**
```yaml
---
artifact: STALENESS_REGISTER
version: "1.0"
status: LIVE
produced_by: Madhav_M2A_Exec
produced_on: <date>
---
```
Table columns: `file_path | current_version | version_aligned_with | is_stale | stale_reason | detected_at`

**Known stale reports (from MACRO_PLAN §A and PHASE_B_PLAN §A):** four L3 reports are stale relative to FORENSIC_v8_0. Executor must identify the exact four by checking each L3 report's `source_version` or `aligned_with` frontmatter field against `FORENSIC_ASTROLOGICAL_DATA_v8_0.md`.

**Stop condition:** STOP if any L3 domain report file is missing `version` frontmatter AND the stale status cannot be determined from content — mark as `version_aligned_with: UNKNOWN` and surface to native.

---

#### B.1 Task 4 — Verify ingestion manifest

**Action:** Run `scan_corpus()` against repo root; confirm `ingestion_manifest.json` is written with:
- `current_document_count: 35`
- `signal_count: 499`
- No Document with `layer: null`

**Stop condition:** Any of the three count invariants fails → STOP.

---

#### B.1 Acceptance Criteria

| # | Criterion | Verification |
|---|---|---|
| AC-B1.1 | `ingestion_manifest.json` exists with `current_document_count: 35` | `python -c "import json; d=json.load(open('verification_artifacts/RAG/ingestion_manifest.json')); assert d['current_document_count']==35"` |
| AC-B1.2 | All 499 MSR signals parseable | `python -c "import json; d=json.load(open('verification_artifacts/RAG/ingestion_manifest.json')); assert d['signal_count']==499"` |
| AC-B1.3 | Every Document has non-null `layer` | `python -c "import json; d=json.load(open('verification_artifacts/RAG/ingestion_manifest.json')); assert all(r['layer'] for r in d['documents'])"` |
| AC-B1.4 | `STALENESS_REGISTER.md` exists and lists ≥4 stale L3 reports | `grep -c "is_stale: true" 00_ARCHITECTURE/STALENESS_REGISTER.md` returns ≥4 |
| AC-B1.5 | P1/P2/P5 validators pass all meta-tests | `pytest platform/python-sidecar/rag/validators/test_p1_p2_p5.py -v` → all PASS |
| AC-B1.6 | `models.py` importable without error | `python -c "from rag.models import Document, Chunk, Signal, GraphNode, GraphEdge, RegisterEntry, LedgerEvent; print('OK')"` |

---

### Phase B.2 — Chunking (2 sessions)

**Pre-condition:** AC-B1.5 (P1/P2/P5 all passing) is the hard gate for B.2. Do not begin B.2 until confirmed.

**Chunker spec reference:** ALL 6 chunkers derive their chunk unit, boundary detection, max tokens, required metadata, and stale propagation from `035_DISCOVERY_LAYER/SCHEMAS/chunker_spec_v1_0.md`. This plan cites the spec; it does not restate it. Every implementation decision must be consistent with `chunker_spec_v1_0.md §1` for the relevant doc-type.

**Session boundary:** B.2 is 2 sessions. Recommended split: Session 2 = doc-types 1–3 (MSR, UCN, CDLM); Session 3 = doc-types 4–5 + full B.2 acceptance verification. Doc-type 6 chunker code implemented in Session 3 (no input yet; stub with working code for CGM node boundary detection, no chunks written until B.3.5).

---

#### B.2 Session 2 (M2A-Exec.2) — Doc-types 1–3

**B.2 Task 1.1 — Doc-type 1: MSR Signal Chunker**

**Output location:** `platform/python-sidecar/rag/chunkers/msr_signal.py`  
**Spec ref:** `chunker_spec_v1_0.md §1 Doc-Type 1`  
- Boundary: `^SIG\.MSR\.\d{3}:$` opens; next boundary or EOF closes
- Required metadata: `signal_id`, `signal_name`, `signal_type`, `domains_affected`, `confidence`, `valence`, `temporal_activation`, `tags`, `provenance`
- Max tokens: 800; hard truncation with `truncation_note` in metadata
- Stale propagation: check STALENESS_REGISTER for signal-level stale markers (if any exist); default `is_stale: False` for all v3.0 signals unless STALENESS_REGISTER explicitly marks them
- P1/P2/P5 gating: call validators before each write; P5 blocks if `signal_id` not in MSR registry
- Expected chunk count: **499** (one per signal)

**Stop condition:** STOP if chunk count ≠ 499.

**B.2 Task 1.2 — Doc-type 2: UCN Section Chunker**

**Output location:** `platform/python-sidecar/rag/chunkers/ucn_section.py`  
**Spec ref:** `chunker_spec_v1_0.md §1 Doc-Type 2`  
- Boundary: `^## ` H2 heading opens; next `^## ` or EOF closes; H3+ subsections included within parent H2 chunk
- Max tokens: 1500; split at H3 boundary if exceeded; sub-chunks carry `sub_chunk_index`
- Required metadata: `part_title`, `part_number`, `domains_mentioned` (extract by scanning for known domain names), `ucn_version: "4.0"`
- Stale propagation: UCN_v4_0 is current; default `is_stale: False`
- Expected minimum: ≥1 chunk per major UCN Part section

**Stop condition:** STOP if zero UCN chunks produced.

**B.2 Task 1.3 — Doc-type 3: CDLM Cell Chunker**

**Output location:** `platform/python-sidecar/rag/chunkers/cdlm_cell.py`  
**Spec ref:** `chunker_spec_v1_0.md §1 Doc-Type 3`  
- Parse markdown table row-by-row; each cell in the 9×9 domain grid is a discrete chunk
- Required metadata: `row_domain`, `col_domain`, `cell_id` (e.g., `CDLM.career.wealth`), `cdlm_version: "1.1"`, `cell_valence`
- Max tokens: 400; hard truncation; flag `requires_split: True` in metadata if exceeded
- Expected chunk count: 81 cells (9×9 grid); verify against CDLM_v1_1.md table dimensions
- P3 enforcement note: UCN + CDLM chunks must be present for P3 to work; after B.2 these chunks exist

**Stop condition:** STOP if CDLM chunker produces < 81 chunks (incomplete grid parse).

**B.2 Session 2 close verification:**
- `SELECT count(*) FROM rag_chunks WHERE doc_type='msr_signal';` = 499
- `SELECT count(*) FROM rag_chunks WHERE doc_type='ucn_section';` ≥ 1 per Part
- `SELECT count(*) FROM rag_chunks WHERE doc_type='cdlm_cell';` = 81

---

#### B.2 Session 3 (M2A-Exec.3) — Doc-types 4–5 + doc-type 6 code + B.2 AC verification

**B.2 Task 2.1 — Doc-type 4: L1 Fact Group Chunker**

**Output location:** `platform/python-sidecar/rag/chunkers/l1_fact.py`  
**Spec ref:** `chunker_spec_v1_0.md §1 Doc-Type 4`  
- Boundary: `^## ` (H2) or `^### ` (H3) opens; next heading at same/higher level or EOF closes; H4+ included in parent H3 chunk
- Max tokens: 1000; split at H4 boundary if exceeded; sub-chunks inherit section metadata with `sub_chunk_index`
- Required metadata: `section_id` (e.g., `§10.3`), `section_title`, `data_provenance` (extract from `source:` tags: `swiss_ephemeris|jagannatha_hora|manual_derivation|external_astrologer|UNKNOWN`)
- P1 enforcement: L1 chunks must NOT contain interpretive language (P1 validator gates write)
- P4 flag: if section contains `[EXTERNAL_COMPUTATION_REQUIRED]` → set `external_computation_pending: True` in metadata

**Stop condition:** STOP if P1 validator fires on any L1 chunk (P1 fire on L1 = genuine data quality problem; halt and report section ID to native).

**B.2 Task 2.2 — Doc-type 5: Domain Report Chunker**

**Output location:** `platform/python-sidecar/rag/chunkers/domain_report.py`  
**Spec ref:** `chunker_spec_v1_0.md §1 Doc-Type 5`  
- Boundary: `^## Part` opens; next `^## Part` or EOF closes; H3+ subsections included
- Max tokens: 1500; split at H3 boundary if exceeded; sub-chunks carry `parent_part`
- Required metadata: `report_name` (filename), `part_title`, `part_number`, `domain` (from filename), `report_version`
- Stale propagation: read STALENESS_REGISTER.md; if report listed as `is_stale: true` → set `is_stale: True`, `stale_reason`, `stale_since` on all its chunks
- Run over all 9 domain reports in `03_DOMAIN_REPORTS/`

**Stop condition:** STOP if any domain report produces 0 chunks (boundary detection failure).

**B.2 Task 2.3 — Doc-type 6: CGM Node Chunker code (no input yet)**

**Output location:** `platform/python-sidecar/rag/chunkers/cgm_node.py`  
**Spec ref:** `chunker_spec_v1_0.md §1 Doc-Type 6`  
- Implement boundary detection: each node entry begins with `node_id:` key (YAML block in CGM_v9_0 format)
- Required metadata: `node_id`, `node_type`, `node_label`, `domains`, `karaka_system` (7-karaka|8-karaka|both; required for KRK-type nodes)
- Max tokens: 600; truncate at longest complete property boundary; add `truncation_note`
- Implement chunker logic fully, but do NOT run it — `CGM_v9_0.md` does not exist yet. The chunker must be runnable by B.3.5 Task 5.5 with `CGM_v9_0.md` as input.
- Add a guard: `if not Path('025_HOLISTIC_SYNTHESIS/CGM_v9_0.md').exists(): raise FileNotFoundError("CGM_v9_0 not yet produced — run B.3.5 first")`

**Stop condition:** STOP if doc-type 6 chunker code is missing at B.2 close — B.3.5 depends on it.

**B.2 Task 3 — Emit chunking_report.json**

`verification_artifacts/RAG/chunking_report.json` with:
- `per_doctype_counts: {msr_signal: N, ucn_section: N, cdlm_cell: N, l1_fact: N, domain_report: N}`
- `token_distribution: {doctype: {min, max, p50, p95}}`
- `stale_chunk_count: N` (must match STALENESS_REGISTER stale-Part count)
- `truncation_events: N`
- `p1_violations: N` (should be 0 for L2.5/L3; any L1 P1 violation = STOP)
- `p5_warnings: N`

**B.2 Consolidated Acceptance Criteria:**

| # | Criterion | Verification |
|---|---|---|
| AC-B2.1 | Exactly 499 msr_signal chunks | `SELECT count(*) FROM rag_chunks WHERE doc_type='msr_signal';` = 499 |
| AC-B2.2 | Zero cross-layer chunks | `SELECT count(*) FROM rag_chunks WHERE (doc_type='msr_signal' AND layer!='L2.5') OR (doc_type='l1_fact' AND layer!='L1');` = 0 |
| AC-B2.3 | No chunk > 2000 tokens | `SELECT count(*) FROM rag_chunks WHERE token_count > 2000;` = 0 |
| AC-B2.4 | Stale chunk count matches STALENESS_REGISTER | `SELECT count(*) FROM rag_chunks WHERE is_stale=true AND doc_type='domain_report';` = STALENESS_REGISTER stale-report Part count |
| AC-B2.5 | ≥1 UCN chunk per major Part section | `SELECT count(*) FROM rag_chunks WHERE doc_type='ucn_section';` ≥ number of `## Part` boundaries in UCN_v4_0 |
| AC-B2.6 | ≥81 CDLM chunks (one per grid cell) | `SELECT count(*) FROM rag_chunks WHERE doc_type='cdlm_cell';` = 81 |
| AC-B2.7 | CGM node chunker code exists (no chunks yet) | `python -c "from rag.chunkers.cgm_node import chunk_cgm_nodes; print('OK')"` |
| AC-B2.8 | `chunking_report.json` exists with p1_violations: 0 | `python -c "import json; d=json.load(open('verification_artifacts/RAG/chunking_report.json')); assert d['p1_violations']==0"` |

---

### Phase B.3 — Embedding & Vector Indexing

**Session:** M2A-Exec.4 (Session 4 of 5)  
**Pre-condition:** All B.2 ACs pass. `rag_chunks` contains doc-types 1–5 chunks. Doc-type 6 chunker code exists.

#### B.3 Task 1 — Implement `rag/embed.py`

**Output:** `platform/python-sidecar/rag/embed.py`  
**Spec:** `PHASE_B_PLAN_v1_0.md §G B.3`  
- Voyage batch calls with pre-embedding text enrichment: prefix each chunk content with `[{layer}] [{doc_type}]` before embedding (improves retrieval precision by layer-conditioning)
- Idempotent: content-hash skip — if `rag_embeddings` already has an entry for `chunk_id`, skip that chunk
- Batch size: 100 chunks per Voyage call (Voyage-3-large limit)
- Halt policy: if Voyage API returns any error on a batch → HALT; log unindexed chunk IDs to `verification_artifacts/RAG/unindexed_chunks.jsonl`; do NOT fall back to OpenAI at index time
- After all batches: create HNSW index via SQL `CREATE INDEX ON rag_embeddings USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64);`

**Stop conditions:**
- STOP on any Voyage API error (log and halt per halt policy)
- STOP if `rag_embeddings` count after completion ≠ `rag_chunks` count for non-stale chunks (embedding gap)

#### B.3 Task 2 — Sanity retrieval test

Query: "Saturn 7th house Libra"  
Expected top-3: at least one MSR signal about Saturn, at least one UCN section, at least one L1 fact chunk  
Run: direct SQL cosine similarity query against `rag_embeddings`  
Log results to `verification_artifacts/RAG/b3_sanity_test.json`  
**Stop condition:** No stop; document result and surface to native if all top-3 are same doc_type (suggests layer imbalance).

#### B.3 Acceptance Criteria

| # | Criterion | Verification |
|---|---|---|
| AC-B3.1 | ~1,200 embeddings produced (exact = non-stale rag_chunks count) | `SELECT count(*) FROM rag_embeddings;` ≈ `SELECT count(*) FROM rag_chunks WHERE is_stale=false;` (within ±5) |
| AC-B3.2 | HNSW index exists | `SELECT indexname FROM pg_indexes WHERE tablename='rag_embeddings' AND indexname LIKE '%hnsw%';` returns a row |
| AC-B3.3 | HNSW p95 query < 50ms | Run 100 random vector queries; measure p95 latency; log to b3_sanity_test.json |
| AC-B3.4 | Sanity query returns top-3 results from ≥2 distinct doc_types | `b3_sanity_test.json` shows ≥2 distinct doc_types in top-3 |
| AC-B3.5 | No partial-batch unindexed log | `verification_artifacts/RAG/unindexed_chunks.jsonl` does not exist OR is empty (0 lines) |

---

### Phase B.3.5 — CGM Rebuild on v8.0

**Session:** M2A-Exec.5 (Session 5 of 5)  
**Pre-condition:** All B.3 ACs pass. `rag_embeddings` indexed. Doc-type 6 chunker code exists from B.2.

#### B.3.5 Task 1 — Read CGM_v2_0 structure

**Input:** `025_HOLISTIC_SYNTHESIS/CGM_v2_0.md`  
**Action:** Read and document: (a) node types used (planet, house, yoga, domain, karaka), (b) edge types used (ASPECTS, LORDS, OCCUPIES, OWNS, etc.), (c) YAML conventions for node property dicts  
**Output:** Internal session note (not a file) used to guide Task 2–3 regeneration  
**Stop condition:** None; read-only.

#### B.3.5 Task 2 — Regenerate node assertions from L1 v8.0

**Input:** `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md`  
**Action:** Regenerate all planet nodes, house nodes, lagna node with:
- Positions from FORENSIC_v8_0 (cite section ID for each value — e.g., `[L1 source: §2 Planet Positions]`)
- Lordships, occupations, dignities from FORENSIC_v8_0 matrices
- 8-karaka fixed per GAP_13_RESOLUTION_v1_0.md §2; 7-karaka readings preserved as `karaka_system: "7-karaka-alternative"` on Pitrukaraka-dependent KRK nodes
- Every positional value carries `[L1 source: FORENSIC_v8_0 §<section>]` tag

**Stop condition:** STOP if any planet position cannot be resolved from FORENSIC_v8_0 — emit `[EXTERNAL_COMPUTATION_REQUIRED]` with exact specification.

#### B.3.5 Task 3 — Regenerate edge assertions (deterministic)

**Action:** Regenerate ASPECTS, LORDS, OCCUPIES, OWNS edges from L1 v8.0 positions and lordship tables  
**Stop condition:** Same as Task 2.

#### B.3.5 Task 3.5 — Author + register `cgm_edge_proposals_v1_0.md`

**Output:** `035_DISCOVERY_LAYER/PROMPTS/gemini/cgm_edge_proposals_v1_0.md`  
**Prompt structure (per PHASE_B_PLAN §G B.3.5 Task 3.5):**
- ROLE: Promiscuous connector, pass 1 of two-pass protocol
- TASK: Propose additional CGM edges beyond the deterministic set from Tasks 2–3 (subtle aspects, Chalit shifts, dispositor chains, navamsha overlaps)
- INPUT schema: `{node_list: [...], existing_edge_types: [...], l1_basis_summary: "..."}`
- OUTPUT (strict YAML): `proposed_edges: [{source_node, edge_type, target_node, L1_basis, classical_basis_if_applicable, confidence_prior: LOW|MED|HIGH}]`
- CONSTRAINTS: Cite only from L1 v8.0; no invented positions; `[EXTERNAL_COMPUTATION_REQUIRED]` if uncertain; `[EXTERNAL_CORPUS_REQUIRED]` if classical basis not in corpus

**After authoring:** Register via `prompt_registry.py`:
```python
from rag.prompt_registry import register_prompt
entry = register_prompt(
    path="035_DISCOVERY_LAYER/PROMPTS/gemini/cgm_edge_proposals_v1_0.md",
    version="1.0"
)
```
Verify `06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json` has the new entry.

**Stop condition:** STOP if prompt registration fails (hash mismatch or INDEX.json not updated).

#### B.3.5 Task 4 — Two-pass: Gemini → Claude

**Sub-task 4a (human-in-loop Gemini):**
1. Prepare batch: serialize node list + existing edge types from Tasks 2–3 into the prompt INPUT schema
2. Copy `cgm_edge_proposals_v1_0.md` prompt content + batch INPUT to Gemini (human copy-paste workflow)
3. Receive Gemini response; paste into file: `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/YYYY-MM-DD_B3-5_batch1_raw.md`
4. Commit this file to git BEFORE starting Claude reconciler

**Sub-task 4b (Claude reconciler):**
1. Read `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/YYYY-MM-DD_B3-5_batch1_raw.md`
2. For each `proposed_edge` in Gemini output:
   - Run P1 check: `L1_basis` must reference a FORENSIC_v8_0 section ID; reject if fabricated position
   - Run P2 check: `L1_basis` must resolve to a real fact in v8.0; reject if cited ID not in resolution_set
   - Run P5 check: if `proposed_edge` references any SIG.MSR.NNN, verify against MSR_v3_0 registry
   - Accept/Reject/Defer each proposed edge with rationale
3. Write ledger event with:
   - `actor: "gemini-web-YYYY-MM-DD"`
   - `prompt_ref: "035_DISCOVERY_LAYER/PROMPTS/gemini/cgm_edge_proposals_v1_0.md"`
   - `prompt_version: "1.0"`
   - `prompt_hash: <from PROMPT_REGISTRY/INDEX.json>`
   - `gemini_response_ref: "035_DISCOVERY_LAYER/PROMPTS/gemini/responses/YYYY-MM-DD_B3-5_batch1_raw.md"`

**Stop condition:** STOP if `gemini_response_ref` path does not exist on disk before reconciler reads it.

#### B.3.5 Task 5 — Write `CGM_v9_0.md`

**Output:** `025_HOLISTIC_SYNTHESIS/CGM_v9_0.md`  
**Required:** Full YAML frontmatter with `version: "9.0"`, `status: CURRENT`, `canonical_id: CGM`, changelog entry vs v2.0  
**Content:** All regenerated nodes (Task 2) + regenerated edges (Task 3) + accepted Gemini proposals (Task 4b)  
**Archive action:** Move `025_HOLISTIC_SYNTHESIS/CGM_v2_0.md` → `99_ARCHIVE/CGM_v2_0.md`  
**Stop condition:** STOP if CGM_v9_0.md fails P1 validation on any node (position without L1 source citation).

#### B.3.5 Task 5.5 — Re-trigger doc-type 6 CGM chunker

**Input:** `025_HOLISTIC_SYNTHESIS/CGM_v9_0.md`  
**Action:** Run `from rag.chunkers.cgm_node import chunk_cgm_nodes; chunks = chunk_cgm_nodes('025_HOLISTIC_SYNTHESIS/CGM_v9_0.md')` and write to `rag_chunks`  
**Required:** For KRK-type nodes: `karaka_system` field must be set (7-karaka|8-karaka|both)  
**Also:** Embed the new CGM node chunks via `embed.py` and update HNSW index  
**Stop condition:** STOP if CGM node chunk count ≠ CGM_v9_0 node count.

#### B.3.5 Task 6 — Update FILE_REGISTRY

Add `CGM_v9_0.md` as CURRENT and update CGM_v2_0 to SUPERSEDED in `FILE_REGISTRY_v1_4.md`.

#### B.3.5 Red-Team Execution (M2A-Exec.5 close)

Run all 6 probes (RT1–RT6) specified in §RISKS. Record results in `verification_artifacts/RAG/RED_TEAM_M2A_v1_0.md`. All 6 must pass before B.3.5 is closed.

#### B.3.5 Acceptance Criteria

| # | Criterion | Verification |
|---|---|---|
| AC-B3.5.1 | `CGM_v9_0.md` passes P1/P2/P5 validators | Run validators on each CGM_v9_0 node — zero rejects |
| AC-B3.5.2 | All node positions match FORENSIC_v8_0 | Manual spot-check of 5 nodes; automated: `SELECT node_id FROM rag_chunks WHERE doc_type='cgm_node' AND metadata->>'l1_source' IS NULL;` = 0 rows |
| AC-B3.5.3 | CGM node chunk count = CGM_v9_0 node count | `SELECT count(*) FROM rag_chunks WHERE doc_type='cgm_node';` = node_count in CGM_v9_0 header |
| AC-B3.5.4 | All KRK-type CGM chunks have `karaka_system` set | `SELECT count(*) FROM rag_chunks WHERE doc_type='cgm_node' AND node_type='KRK' AND metadata->>'karaka_system' IS NULL;` = 0 |
| AC-B3.5.5 | `cgm_edge_proposals_v1_0.md` registered in PROMPT_REGISTRY | `cat 06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json | python -c "import json,sys; d=json.load(sys.stdin); assert any(e['prompt_id']=='gemini.cgm_edge_proposals' for e in d['entries'])"` |
| AC-B3.5.6 | Gemini raw response file committed | `git log --oneline -- '035_DISCOVERY_LAYER/PROMPTS/gemini/responses/*'` returns ≥1 commit |
| AC-B3.5.7 | All 6 red-team probes pass | `cat verification_artifacts/RAG/RED_TEAM_M2A_v1_0.md` — all 6 probes = PASS |
| AC-B3.5.8 | `FILE_REGISTRY_v1_4.md` updated with CGM_v9_0 CURRENT row | `grep "CGM_v9_0\|CURRENT" 00_ARCHITECTURE/FILE_REGISTRY_v1_4.md | grep CGM` returns CGM_v9_0 row |

---

## §AC — Consolidated Acceptance Criteria

| # | Sub-phase | Criterion | Verification command |
|---|---|---|---|
| AC-B1.1 | B.1 | `ingestion_manifest.json` exists with `current_document_count: 35` | `python -c "import json; d=json.load(open('verification_artifacts/RAG/ingestion_manifest.json')); assert d['current_document_count']==35"` |
| AC-B1.2 | B.1 | 499 MSR signals parseable | `python -c "import json; d=json.load(open('verification_artifacts/RAG/ingestion_manifest.json')); assert d['signal_count']==499"` |
| AC-B1.3 | B.1 | Every Document has non-null layer | `python -c "import json; d=json.load(open('verification_artifacts/RAG/ingestion_manifest.json')); assert all(r['layer'] for r in d['documents'])"` |
| AC-B1.4 | B.1 | STALENESS_REGISTER.md exists with ≥4 stale entries | `grep -c "is_stale: true" 00_ARCHITECTURE/STALENESS_REGISTER.md` ≥ 4 |
| AC-B1.5 | B.1 | P1/P2/P5 validators pass all meta-tests | `pytest platform/python-sidecar/rag/validators/test_p1_p2_p5.py -v` → all PASS |
| AC-B1.6 | B.1 | models.py importable without error | `python -c "from rag.models import Document, Chunk, Signal, GraphNode, GraphEdge, RegisterEntry, LedgerEvent; print('OK')"` |
| AC-B2.1 | B.2 | Exactly 499 msr_signal chunks | `SELECT count(*) FROM rag_chunks WHERE doc_type='msr_signal';` = 499 |
| AC-B2.2 | B.2 | Zero cross-layer chunks | `SELECT count(*) FROM rag_chunks WHERE (doc_type='msr_signal' AND layer!='L2.5') OR (doc_type='l1_fact' AND layer!='L1');` = 0 |
| AC-B2.3 | B.2 | No chunk > 2000 tokens | `SELECT count(*) FROM rag_chunks WHERE token_count > 2000;` = 0 |
| AC-B2.4 | B.2 | Stale chunk count matches STALENESS_REGISTER | `SELECT count(*) FROM rag_chunks WHERE is_stale=true AND doc_type='domain_report';` = STALENESS_REGISTER stale-report count |
| AC-B2.5 | B.2 | ≥1 UCN chunk per major Part section | `SELECT count(DISTINCT metadata->>'part_title') FROM rag_chunks WHERE doc_type='ucn_section';` ≥ UCN Part count |
| AC-B2.6 | B.2 | ≥81 CDLM cell chunks | `SELECT count(*) FROM rag_chunks WHERE doc_type='cdlm_cell';` = 81 |
| AC-B2.7 | B.2 | CGM node chunker code exists | `python -c "from rag.chunkers.cgm_node import chunk_cgm_nodes; print('OK')"` |
| AC-B2.8 | B.2 | chunking_report.json has p1_violations: 0 | `python -c "import json; d=json.load(open('verification_artifacts/RAG/chunking_report.json')); assert d['p1_violations']==0"` |
| AC-B3.1 | B.3 | ~1,200 embeddings (= non-stale chunk count ±5) | `SELECT count(*) FROM rag_embeddings;` within ±5 of non-stale rag_chunks count |
| AC-B3.2 | B.3 | HNSW index exists | `SELECT indexname FROM pg_indexes WHERE tablename='rag_embeddings' AND indexname LIKE '%hnsw%';` returns row |
| AC-B3.3 | B.3 | HNSW p95 query < 50ms | Measured over 100 random queries in b3_sanity_test.json |
| AC-B3.4 | B.3 | Sanity query returns ≥2 distinct doc_types in top-3 | `b3_sanity_test.json` top_3 doc_type distinct count ≥ 2 |
| AC-B3.5 | B.3 | No unindexed chunks log | `wc -l verification_artifacts/RAG/unindexed_chunks.jsonl` = 0 OR file absent |
| AC-B3.5.1 | B.3.5 | CGM_v9_0 passes P1/P2/P5 validators | Run validators on CGM_v9_0 nodes — zero rejects |
| AC-B3.5.2 | B.3.5 | Node positions match FORENSIC_v8_0 | `SELECT node_id FROM rag_chunks WHERE doc_type='cgm_node' AND metadata->>'l1_source' IS NULL;` = 0 rows |
| AC-B3.5.3 | B.3.5 | CGM node chunk count = node count | `SELECT count(*) FROM rag_chunks WHERE doc_type='cgm_node';` = node count in CGM_v9_0 |
| AC-B3.5.4 | B.3.5 | All KRK-type nodes have karaka_system | `SELECT count(*) FROM rag_chunks WHERE doc_type='cgm_node' AND node_type='KRK' AND metadata->>'karaka_system' IS NULL;` = 0 |
| AC-B3.5.5 | B.3.5 | cgm_edge_proposals registered in PROMPT_REGISTRY | Index.json contains `gemini.cgm_edge_proposals` entry |
| AC-B3.5.6 | B.3.5 | Gemini raw response file committed | git log shows ≥1 commit on responses/ path |
| AC-B3.5.7 | B.3.5 | All 6 red-team probes pass | RED_TEAM_M2A_v1_0.md — all 6 = PASS |
| AC-B3.5.8 | B.3.5 | FILE_REGISTRY updated with CGM_v9_0 | grep in FILE_REGISTRY_v1_4 shows CGM_v9_0 CURRENT row |

---

## §MANIFEST — Artifact Manifest

Files that M2A-Exec will **CREATE** or **MODIFY**, listed in sub-phase order. This is the `may_touch` list for the M2A-Exec brief.

### B.1 Creates

| File | Type |
|---|---|
| `platform/python-sidecar/rag/models.py` | Implement (replaces stub) |
| `platform/python-sidecar/rag/ingest.py` | Implement (replaces stub) |
| `platform/python-sidecar/rag/validators/p1_layer_separation.py` | Implement (replaces stub) |
| `platform/python-sidecar/rag/validators/p2_citation.py` | Implement (replaces stub) |
| `platform/python-sidecar/rag/validators/p5_signal_id_resolution.py` | Implement (replaces stub) |
| `platform/python-sidecar/rag/validators/fixtures/p1_trigger_vocab.json` | Create |
| `platform/python-sidecar/rag/validators/fixtures/p1_reject_interpretive_l1.json` | Create |
| `platform/python-sidecar/rag/validators/fixtures/p1_reject_no_layer_tag.json` | Create |
| `platform/python-sidecar/rag/validators/fixtures/p1_reject_mixed_no_bridge.json` | Create |
| `platform/python-sidecar/rag/validators/fixtures/p1_accept_fact_only.json` | Create |
| `platform/python-sidecar/rag/validators/fixtures/p1_accept_interp_only.json` | Create |
| `platform/python-sidecar/rag/validators/fixtures/p2_reject_no_citation.json` | Create |
| `platform/python-sidecar/rag/validators/fixtures/p2_reject_nonexistent_id.json` | Create |
| `platform/python-sidecar/rag/validators/fixtures/p2_accept_valid_ids.json` | Create |
| `platform/python-sidecar/rag/validators/fixtures/p2_accept_empty_l1_chunk.json` | Create |
| `platform/python-sidecar/rag/validators/fixtures/p5_reject_nonexistent_signal.json` | Create |
| `platform/python-sidecar/rag/validators/fixtures/p5_accept_valid_signal.json` | Create |
| `platform/python-sidecar/rag/validators/test_p1_p2_p5.py` | Create |
| `00_ARCHITECTURE/STALENESS_REGISTER.md` | Create |
| `verification_artifacts/RAG/ingestion_manifest.json` | Create |

### B.2 Creates

| File | Type |
|---|---|
| `platform/python-sidecar/rag/chunkers/__init__.py` | Create |
| `platform/python-sidecar/rag/chunkers/msr_signal.py` | Create |
| `platform/python-sidecar/rag/chunkers/ucn_section.py` | Create |
| `platform/python-sidecar/rag/chunkers/cdlm_cell.py` | Create |
| `platform/python-sidecar/rag/chunkers/l1_fact.py` | Create |
| `platform/python-sidecar/rag/chunkers/domain_report.py` | Create |
| `platform/python-sidecar/rag/chunkers/cgm_node.py` | Create (code only; no CGM_v9_0 input yet) |
| `platform/python-sidecar/rag/chunk.py` | Implement (replaces stub — orchestrates chunker dispatch per doc_type) |
| `verification_artifacts/RAG/chunking_report.json` | Create |

### B.3 Creates/Modifies

| File | Type |
|---|---|
| `platform/python-sidecar/rag/embed.py` | Implement (replaces stub) |
| `verification_artifacts/RAG/b3_sanity_test.json` | Create |
| `verification_artifacts/RAG/unindexed_chunks.jsonl` | Create (if Voyage errors; otherwise absent) |

### B.3.5 Creates/Modifies

| File | Type |
|---|---|
| `025_HOLISTIC_SYNTHESIS/CGM_v9_0.md` | Create |
| `99_ARCHIVE/CGM_v2_0.md` | Move (from 025_HOLISTIC_SYNTHESIS/) |
| `035_DISCOVERY_LAYER/PROMPTS/gemini/cgm_edge_proposals_v1_0.md` | Create |
| `035_DISCOVERY_LAYER/PROMPTS/gemini/responses/YYYY-MM-DD_B3-5_batch1_raw.md` | Create (Gemini raw response) |
| `06_LEARNING_LAYER/PROMPT_REGISTRY/INDEX.json` | Modify (append cgm_edge_proposals entry) |
| `verification_artifacts/RAG/RED_TEAM_M2A_v1_0.md` | Create |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_4.md` | Modify (add CGM_v9_0, update CGM_v2_0 to SUPERSEDED) |

### Session-close artifacts (every session)

| File | Type |
|---|---|
| `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` | Modify (at each session close) |
| `00_ARCHITECTURE/SESSION_LOG.md` | Append (at each session close) |
| `.geminirules` | Modify — adapted parity (at each session close) |
| `.gemini/project_state.md` | Modify — adapted parity (at each session close) |
| `00_ARCHITECTURE/FILE_REGISTRY_v1_4.md` | Modify (at B.3.5 close for CGM rows) |

---

## §SESSION_PACKAGING — Session Boundary Recommendations

### Recommended packaging: 5 sessions

| Session | Session ID | Sub-phase(s) | Closes with |
|---|---|---|---|
| 1 | `Madhav_M2A_Exec` | B.1 complete | AC-B1.1–AC-B1.6 all pass; pytest passes; STALENESS_REGISTER exists |
| 2 | `Madhav_M2A_Exec_2` | B.2 Session 1: doc-types 1–3 | 499 MSR + 81 CDLM + ≥N UCN chunks in rag_chunks |
| 3 | `Madhav_M2A_Exec_3` | B.2 Session 2: doc-types 4–5 + doc-type 6 code + B.2 ACs | AC-B2.1–AC-B2.8 all pass |
| 4 | `Madhav_M2A_Exec_4` | B.3 complete | AC-B3.1–AC-B3.5 all pass; HNSW indexed |
| 5 | `Madhav_M2A_Exec_5` | B.3.5 complete + red-team | AC-B3.5.1–AC-B3.5.8 all pass; RT1–RT6 all pass |

### Justification

**5 sessions is confirmed** (matching PHASE_B_PLAN §E.8 velocity forecast). Single session is not feasible for B.1+B.2 combined:
- B.1 has substantial validator implementation with fixture sets (~3–4h)
- B.2 has 6 chunker implementations (~6h); split across Sessions 2–3 for context-window discipline

**Session boundary placement rationale:**
- Each session closes at a clean, AC-verified checkpoint with no mid-phase state
- B.2 split at doc-types 1–3 vs 4–6 is natural: MSR/UCN/CDLM are L2.5-only; L1/L3 chunkers introduce different boundary logic
- B.3 and B.3.5 are each 1 session per velocity forecast and clean units

**Context-window note:** B.3.5 is the most complex single session (reads CGM_v2_0, derives v9.0, runs 2-pass, re-chunks). Sonnet 4.6's 200K context is sufficient but the executor should not load all FORENSIC_v8_0 content into context simultaneously — use targeted section reads for individual node derivations.

**Red-team placement:** Probes fire at M2A-Exec.5 close (B.3.5 session). This is the first session with all B.1–B.3.5 code deliverables complete. Probes RT1–RT3 test validator functionality (B.1); RT4–RT5 test chunk quality (B.2); RT6 tests CGM integrity (B.3.5). All are testable with the M2A-Exec.5 deliverables on disk.

---

*End of M2A_EXEC_PLAN_v1_0.md — produced 2026-04-25 in `Madhav_M2A_Plan_Foundation_Stack`.*
*Cowork review required before M2A-Exec brief is issued to Sonnet executor.*
