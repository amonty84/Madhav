# Plan — AM-JIS Corpus Verification Brief v1.0

## Context

The AM-JIS corpus has been through multiple iterative correction sessions. Before it can be fed into downstream **vectorization + graph model construction** for LLM-based insight generation, the user needs high confidence that:

1. The L1 ground-truth file (`01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md`) is **internally consistent** — every planet's sign/house/longitude/nakshatra/pada/dasha continuity derives correctly; all numeric aggregates (SAV=337, Shadbala sums, BAV totals) balance.
2. All derived files (L2 matrices, L2.5 synthesis, L3 domain reports) correctly trace back to L1.
3. Cross-file citations (`MSR.NNN`, `CDLM.DN.DM`, `RM.NN`, `UCN §X`) all resolve.
4. Entity naming is uniform enough for automated extraction.
5. No build-process glitches remain (duplicate entries, missing fields, orphan citations, broken cross-refs, encoding defects).

My 3-check answer in the prior session covered only trivial surface checks. This plan produces a **thorough, layered verification framework** that covers L1 internal invariants, cross-file citation integrity, and readiness gates for the downstream phases. The deliverable is a self-contained executor brief (modeled on the previous `AGENT_BRIEF_CORPUS_CLEANUP_v1_0.md` pattern) plus a strategic MSR merge task.

**Known critical findings from Phase 1 exploration (to be addressed):**
- `MSR_v2_0.md` claims 500 signals but only 60 are fully rendered as `SIG.MSR.NNN:` YAML blocks; the other 420 live in archived `MSR_v1_0.md`.
- 29 MSR IDs cited in UCN + domain reports are undefined in `MSR_v2_0.md` (they live in v1_0).
- `RM_v2_0.md` claims 32 elements but defines 28; RM.08/14/26 missing; RM.31/32 cited but undefined.
- `CDLM_v1_1.md` all 81 cells anchor to MSR signals from the 29-undefined set.
- UCN has 2 dangling `§CHANGELOG` references from the prior cleanup pass.
- L1 file has **20+ mechanical invariants** that CAN be verified automatically but currently are not.

**User decisions captured (AskUserQuestion):**
1. **Execution style**: External LLM (Sonnet or DeepSeek) runs the brief standalone. Brief must be self-contained (~1500 lines).
2. **MSR reconciliation**: Merge MSR_v1_0 + MSR_v2_0 → `MSR_v3_0.md` with all 500 signals fully rendered. Archive both source files.

---

## Deliverables (to be produced on exiting Plan Mode)

### Primary deliverable

**`/Users/Dev/Vibe-Coding/Apps/Madhav/AGENT_BRIEF_CORPUS_VERIFICATION_v1_0.md`**

A single self-contained brief an external LLM agent can read and execute end-to-end. Target length 1,400–1,700 lines. Frontmatter:

```yaml
brief_type: Agent Execution Brief
brief_version: 1.0
created: 2026-04-19
scope: Comprehensive AM-JIS corpus verification pre-vectorization
status: READY FOR EXECUTION
executor_model: Claude Sonnet 4.6 or DeepSeek V3
cost_budget_usd: 8
estimated_runtime: 4-8 hours
prerequisite_reads: [CLAUDE.md, AM_JIS_BOOTSTRAP_HANDOFF.md, AGENT_BRIEF_CORPUS_VERIFICATION_v1_0.md (this file), 01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md §0–§2]
produces_artifacts: [/verification_artifacts/<timestamp>/READINESS_REPORT.md + 14 supporting JSON/graphml files]
blocks_downstream: [vectorization, graph_model_construction]
```

### Brief section structure (12 sections + 3 appendices)

| § | Section | Approx. lines |
|---|---|---|
| §0 | Executor preamble — STOP before starting | 40 |
| §1 | Project context (self-contained AM-JIS intro, layer hierarchy, subject metadata) | 80 |
| §2 | Authoritative v8.0 placements ledger (planets, lagnas, sahams, key yogas, SAV=337, Vimshottari window) | 120 |
| §3 | How to read MSR / CDLM / RM / UCN (one fully-rendered example of each) | 200 |
| §4 | Mechanical invariants catalogue — INV.L1.01–24 formally stated | 280 |
| §5 | Verification layers L0–L7 with per-check templates | 500 |
| §6 | **MSR merge task** (v1_0 + v2_0 → v3_0) with full merge procedure | 150 |
| §7 | Tooling strategy (extend audit.py, verify_corpus.py; archive cleanup scripts) | 80 |
| §8 | Execution order DAG and dependencies | 60 |
| §9 | Escalation matrix (auto-fix / brain / acharya) | 60 |
| §10 | Readiness matrix (GO/NO-GO criteria for vectorization + graph) | 90 |
| §11 | Outputs produced (JSON schemas for all artifacts) | 80 |
| §12 | Rollback and safety (git tag, no-write guardrails) | 30 |
| App A | ID namespace catalogue (29 namespaces from L1 §0.1) | 30 |
| App B | Skeletal Python snippets (reusable patterns) | 60 |
| App C | JSON schemas for output artifacts | 60 |

---

## The 8-layer verification model (brief §5)

Every layer section in the brief follows an identical template:
```
### L<N>.<M> <check name>
Purpose | Input files | Output artifact | Implementation [pure-Python | LLM-assisted | hybrid]
Reuse/extend [audit.py:function | verify_corpus.py:function | new]
Success criteria | Failure handling [auto-fix | flag-for-brain | escalate-to-human]
```

### L0 — Structural integrity (pure-Python, ~5 min)
- **L0.1** File inventory + version-latest resolver (reuse `verify_corpus.py::find_latest_versions`)
- **L0.2** YAML frontmatter validator (pyyaml; required keys per file class)
- **L0.3** Encoding + line-ending + BOM check (UTF-8/LF, no BOM)
- **L0.4** Markdown structural sanity (balanced code fences, table pipe counts match headers)
- **L0.5** Stable-ID uniqueness within each namespace

### L1 — Forensic v8.0 internal invariants (pure-Python, ~10 min)
Most important numeric-confidence layer. 24 formal invariants organized into 5 families:

**F1 Positional** (4 invariants): Sign↔house under Aries Lagna; abs_long within sign range; nakshatra matches longitude; pada matches longitude sub-range
**F2 Temporal continuity** (4 invariants): Vimshottari/Yogini/Chara dasha date chains; 120-year Vimshottari cycle check
**F3 Numeric aggregate** (4 invariants): SAV=337; BAV row sums; Shadbala component sums match totals; column sums match SAV
**F4 Derivation rules** (7 invariants): Chalit deviation bounds; special-lagna derivations; 36 Saham formulas; arudha padas; D9 Navamsa; Chara Karaka 8-order; deity-nakshatra canonical map
**F5 Structural** (5 invariants): MET.DASHA.CURRENT window; INTENTIONALLY_EXCLUDED markers have governance refs; dual-engine notes cite both FORENSIC+JH; §27 ledger consistency; Varshphal Tajika mirror

**Implementation:** pure-Python module `invariants_l1.py` with one function per INV. Zero LLM calls. Fully deterministic. Any failure = HARD BLOCK for downstream.

### L2 — Matrix files ↔ L1 (pure-Python, ~5 min)
Exhaustive row-by-row trace from each of the 5 MATRIX files to the corresponding L1 section. Extends `verify_corpus.py::spot_check_matrix_files` from spot-check to full-sweep.

### L2.5a — Synthesis internal consistency (pure-Python, ~3 min)
- MSR signal count vs claim (post-merge to v3_0: expect 500 defined)
- CDLM 81-cell completeness
- RM element inventory (reconcile gaps + splits)
- UCN Part structure I→III→IV, all §X anchors resolve

### L2.5b — L2.5 ↔ L1 cross-reference (pure-Python + LLM spot-check, ~15 min)
- Entity extraction from MSR `entities_involved` + regex from CDLM/RM/UCN
- Placement consistency (reuse `audit.py::check_placement_consistency` — exhaustive, not sampled)
- Numeric citation traceability
- Haiku worker LLM spot-check for semantic drift (reuse `verify_corpus.py::run_worker_phase`)

### L2.5c — Citation graph integrity (pure-Python, ~5 min)
**The most important NEW work.** Build `CITATION_GRAPH.graphml`:
- Extract all `MSR\.\d{3}`, `CDLM\.D\d\.D\d`, `RM\.\d{2}[A-Z]?`, `UCN §X` tokens
- Resolve against merged MSR_v3_0 registry, CDLM index, RM registry, UCN TOC
- Dangling-edge report (hard fail)
- Orphan-definition report (flag for review)
- Cycle + depth analysis (informational for graph modeling)

### L3 — Domain reports (pure-Python + LLM, ~20 min)
- Report inventory (9 expected)
- UCN parent references (frontmatter `parent_UCN_version`)
- Citation density per report (flag outliers for brain)
- Entity-naming uniformity (produce `NAMING_VARIANTS.json`: Śani/Shani/शनि, Shree/Sri/Sree)
- Cross-report coherence: when two reports cite the same MSR, their valence/temporal characterization must match (LLM-assisted)
- L3 ↔ L1 placement consistency

### L4 — Entity registry construction (pure-Python, ~3 min)
Not verification; deliverable for downstream. `ENTITY_REGISTRY.json` with canonical name, aliases, type, L1 ID, occurrence count. This is the vectorization vocabulary.

### L5 — Citation graph export (pure-Python, ~1 min)
`CITATION_GRAPH.graphml` loadable by Neo4j / NetworkX / RDFLib. Typed nodes, typed edges (`cites`, `anchors-to`, `derives-from`, `conflicts-with`).

### L6 — Numeric-invariant rollup (pure-Python, trivial)
Aggregate L1+L2 invariant results into `NUMERIC_INVARIANTS.json`.

### L7 — Go/no-go synthesis (rule-based + LLM, ~2 min)
Produces `READINESS_REPORT.md`. BLOCK on any L0/L1/L2 failure or any L2.5c dangling edge. CONDITIONAL-GO with brain rationale for L3 warnings.

---

## §6 MSR merge task — detailed procedure

Because the user chose "merge all 500 signals into a single MSR_v3_0.md", the brief devotes §6 to this pre-verification task.

**Inputs:**
- `025_HOLISTIC_SYNTHESIS/MSR_v1_0.md` (420 signals, some as full blocks, some as table rows — agent must parse both)
- `025_HOLISTIC_SYNTHESIS/MSR_v2_0.md` (60 re-rendered signals: MSR.022, 024, 391, 402, 402b, 404, 407, 413 + MSR.421–443 + MSR.444–496 + 391a/b/c)
- `00_ARCHITECTURE/AUDIT_REPORT_v1_0.md` and `FIX_SESSION_00*_COMPLETION.md` (for correction provenance)

**Output:** `025_HOLISTIC_SYNTHESIS/MSR_v3_0.md`
- All 500 signals as full `SIG.MSR.NNN:` YAML blocks
- For signals corrected in v2_0, use the v2_0 version (not v1_0)
- For signals unchanged from v1_0, carry forward as-is
- Frontmatter: `version: 3.0`, `status: CURRENT`, `supersedes: MSR_v2_0.md, MSR_v1_0.md`
- Each signal entry has `provenance:` field: `v1_0-confirmed-by-v8 | v2_0-rerendered | v2_0-new-421-443 | v2_0-new-444-496`

**Merge algorithm (pure-Python):**
1. Parse all `SIG.MSR.NNN:` blocks from both files → dict keyed by signal_id
2. For each ID in range [1, 496] plus `402b`, `391a/b/c`:
   - If present in v2_0 → use v2_0 version (it's the corrected one)
   - Else if present in v1_0 → use v1_0 version with `provenance: v1_0-confirmed-by-v8`
   - Else → flag as `UNDEFINED` (should not happen if registries are complete)
3. Emit ordered output (MSR.001 → MSR.496 + sub-variants)
4. Archive both source files: add `status: ARCHIVED_BY_v3_0` to their frontmatter; move to `99_ARCHIVE/025_HOLISTIC_SYNTHESIS/` (create directory)
5. Update `025_HOLISTIC_SYNTHESIS/CLAUDE.md` to point to v3_0
6. Update `00_ARCHITECTURE/FILE_REGISTRY_v1_0.md` § 4 entry

**Verification gate after merge (before running L2.5c citation graph):**
- Count of `SIG.MSR.NNN:` blocks in MSR_v3_0 = 500 (or 500 + n suffixes)
- Every MSR ID cited in UCN/CDLM/RM/L3 resolves in MSR_v3_0
- No duplicate IDs
- All entries pass schema validation

---

## User decisions applied to this plan

| Decision | Effect on brief |
|---|---|
| Self-contained brief for external LLM | Long-form §1–§4 with all context quoted (v8.0 placements table, schema examples, ID namespaces). Executor reads this brief plus 2 prerequisite files, nothing else. |
| Merge MSR to v3_0 | §6 contains full merge procedure. L2.5c citation graph runs AGAINST MSR_v3_0, not a runtime unified registry. Both v1_0 and v2_0 archived to `99_ARCHIVE/`. |

---

## Critical files this plan will create

| Path | What |
|---|---|
| `/Users/Dev/Vibe-Coding/Apps/Madhav/AGENT_BRIEF_CORPUS_VERIFICATION_v1_0.md` | The deliverable brief (~1,500 lines) |

## Critical files the executor will create (on running the brief)

| Path | What |
|---|---|
| `025_HOLISTIC_SYNTHESIS/MSR_v3_0.md` | Merged 500-signal registry |
| `99_ARCHIVE/025_HOLISTIC_SYNTHESIS/MSR_v1_0.md` | Archived |
| `99_ARCHIVE/025_HOLISTIC_SYNTHESIS/MSR_v2_0.md` | Archived |
| `corpus_common.py` | Shared utilities extracted from audit.py + verify_corpus.py |
| `invariants_l1.py` | 24 L1 invariant checkers |
| `invariants_l2.py` | Matrix↔L1 exhaustive trace |
| `msr_registry_builder.py` | Builds `MSR_REGISTRY_UNIFIED.json` (for run-time use even post-merge) |
| `citation_graph.py` | Builds `CITATION_GRAPH.graphml` |
| `entity_registry.py` | Builds `ENTITY_REGISTRY.json` |
| `readiness_synthesizer.py` | Composes L7 `READINESS_REPORT.md` |
| `run_verification.py` | Orchestrator — runs L0–L7 in correct order |
| `schema/msr_signal.schema.json` | JSON Schema for MSR signal blocks |
| `schema/cdlm_cell.schema.json` | JSON Schema for CDLM cells |
| `schema/rm_element.schema.json` | JSON Schema for RM elements |
| `schema/ucn_section.schema.json` | JSON Schema for UCN structure |
| `tests/test_invariants_l1.py` | pytest regression suite (one test per INV.L1.NN) |
| `verification_artifacts/<timestamp>/*.json, *.graphml, READINESS_REPORT.md` | All output artifacts |

## Existing utilities to reuse (referenced by the brief)

| Source | Function / Pattern | Used by |
|---|---|---|
| `verify_corpus.py:183` | `find_latest_versions()` | L0.1 file inventory |
| `verify_corpus.py::extract_ground_truth` pattern | GROUND_TRUTH dict | L1, L2, L2.5b |
| `verify_corpus.py:317` | `spot_check_matrix_files()` | L2 exhaustive extension |
| `verify_corpus.py:483` | `run_worker_phase()` (Haiku orchestrator) | L2.5b.4 LLM spot-check, L3.5 coherence |
| `verify_corpus.py:663` | `estimate_cost()` | cost gating |
| `audit.py::HISTORICAL_MARKERS` | Historical-line regex list | L0, L2.5b |
| `audit.py::check_placement_consistency` | ±60-char locality window | L2.5b.2 |
| `audit.py::ERROR_PATTERNS` | 13 regex patterns | L3.6 report check |

## Verification plan — how to test this end-to-end

Once brief is written and executor has run it:

1. **Artifacts sanity:** `/verification_artifacts/<timestamp>/` contains all 14 JSON/graphml files plus `READINESS_REPORT.md` and `run_log.txt`.
2. **Go-signal:** `READINESS_REPORT.md` terminates with `VERDICT: GO` / `CONDITIONAL-GO` / `NO-GO`.
3. **Numeric-invariant rollup:** `NUMERIC_INVARIANTS.json` shows `failed: 0` for L0, L1, L2 (hard-block layers).
4. **Citation-graph integrity:** `CITATION_GRAPH_report.json` shows `dangling_edges: 0`.
5. **Entity registry:** `ENTITY_REGISTRY.json` contains every planet (9), house (12), sign (12), nakshatra (27), special lagna (9), saham (36), yoga (17+) with canonical names and occurrence counts.
6. **MSR merge:** `MSR_v3_0.md` exists and `grep -c "^SIG\.MSR\." MSR_v3_0.md` ≈ 500.
7. **Test suite:** `pytest tests/test_invariants_l1.py` passes all 24 invariant tests (regression protection).

## What requires native / acharya review (out of automation scope)

Explicitly stated in brief §9 as **non-automatable**:
1. Jyotish semantic validity of any interpretation text
2. Whether a remedial measure is spiritually appropriate
3. Whether an MSR `valence` judgment is culturally/traditionally sound
4. Whether acharya-grade quality (per CLAUDE.md §Quality Standard) has been achieved
5. Dual-engine divergences exceeding documented tolerance (policy decision)
6. Any L1 edit (L1 is edited by human + brain only)
7. Cross-report coherence conflicts where automated detection confirms a real conflict

## Estimated effort

- Brief authoring (this plan → AGENT_BRIEF_CORPUS_VERIFICATION_v1_0.md): ~30 min on plan-mode exit
- Executor runtime end-to-end: 4–8 hours wall-clock (mostly pure-Python; ~30–60 min of Haiku worker LLM time)
- LLM cost ceiling: $8 (cap declared in frontmatter)
- Human review of `READINESS_REPORT.md`: ~20 min

## Execution sequence on exit of Plan Mode

1. Write `AGENT_BRIEF_CORPUS_VERIFICATION_v1_0.md` at repo root (primary deliverable).
2. Update `00_ARCHITECTURE/FILE_REGISTRY_v1_0.md` §10 to list the new brief under Tooling & Process.
3. Commit both files; push to remote.
4. Hand the brief to Sonnet / DeepSeek agent for execution.
5. User reviews `READINESS_REPORT.md` when executor completes.

---

*Plan authored by Claude Opus 4.7, 2026-04-19. Phase 1 exploration used 3 parallel Explore agents; Phase 2 design used 1 Plan agent. Decisions captured via AskUserQuestion.*
