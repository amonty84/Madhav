---
artifact: CLAUDECODE_BRIEF_M2A_Exec_14.md
status: COMPLETE
authored_on: 2026-04-27
authored_by: Cowork (Claude Sonnet 4.6)
authored_during: "Madhav_M2A_Exec_14 — B.8 Synthesis Layer"
governing_clause: CLAUDE.md §C item 0 — overrides items 1–11 reading sequence and any other scope guidance for the duration of this session
target_executor: Claude Code Extension (Google Anti-Gravity IDE / VS Code), Sonnet 4.6
expected_session_class: M2 corpus execution (B.8 Synthesis Layer — 1 session)
predecessor_session: Madhav_M2A_Exec_13 (CLOSED 2026-04-27 — B.7 Router + Plan Library; all 15 ACs PASS; 20/20 router eval; 15/15 WCR invariant)
canonical_phase_pointer: "PHASE_B_PLAN_v1_0.md §B.8 — Synthesis Layer."
red_team_cadence_note: >
  red_team_counter at session-open: 1 (set at Exec_13 M2 execution; no cadence fire at 1).
  Exec_14 increments to 2 (M2 execution session). No session-cadence (a) fire (need 3).
  No phase-close (b) fire (B.8 is not a milestone close). Next cadence fire at counter=3
  (Exec_15 if no governance asides between Exec_14–15).

carry_forwards_resolved:
  CF_1_from_Exec_13: >
    Upgrade router.py ANTHROPIC_MODEL to claude-opus-4.7 when available.
    STATUS: STILL PENDING — claude-opus-4.7 not yet confirmed available.
    Action: carry forward to Exec_15. Do NOT upgrade in B.8.
  CF_2_from_Exec_13: >
    Revise router_v1_0.md prompt + regenerate eval if AC.7 pass < 20/20.
    STATUS: CLOSED — Exec_13 achieved 20/20. No action needed.

may_touch:
  - platform/python-sidecar/rag/synthesize.py              # new file
  - platform/python-sidecar/rag/schemas.py                 # add DerivationEntry + SynthesisAnswer
  - platform/python-sidecar/rag/routers/rag_synthesize.py  # new file
  - platform/python-sidecar/main.py                        # add rag_synthesize_router include
  - platform/src/lib/rag/synthesizeClient.ts               # new file
  - 035_DISCOVERY_LAYER/PROMPTS/claude/synthesis_v1_0.md   # new file
  - verification_artifacts/RAG/synthesis_golden_v1_0.json  # new file (10-query golden set)
  - verification_artifacts/RAG/synthesis_eval_v1_0.json    # new file (eval results)
  - 00_ARCHITECTURE/FILE_REGISTRY_v1_*.md                  # version bump to v1.15
  - 00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md            # fingerprint rotations only
  - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md                  # session-close update
  - 00_ARCHITECTURE/SESSION_LOG.md                         # session-close append
  - .geminirules                                           # mirror update (MP.1)
  - .gemini/project_state.md                               # mirror update (MP.2)
  - platform/build_state.json                              # serializer re-run
  - CLAUDECODE_BRIEF.md                                    # set status: COMPLETE at close

must_not_touch:
  - 01_FACTS_LAYER/**
  - 025_HOLISTIC_SYNTHESIS/**
  - 02_ANALYTICAL_LAYER/**
  - 03_DOMAIN_REPORTS/**
  - 035_DISCOVERY_LAYER/REGISTERS/**
  - 035_DISCOVERY_LAYER/QUERY_TAXONOMY/**
  - 035_DISCOVERY_LAYER/PROMPTS/claude/router_v1_0.md
  - 035_DISCOVERY_LAYER/PROMPTS/claude/cgm_contradicts_edges_v1_0.md
  - 035_DISCOVERY_LAYER/PROMPTS/claude/contradiction_scan_v1_0.md
  - platform/python-sidecar/rag/retrieve.py
  - platform/python-sidecar/rag/router.py
  - platform/python-sidecar/rag/routers/rag_retrieve.py
  - platform/python-sidecar/rag/routers/rag_router.py
  - platform/src/lib/rag/retrieveClient.ts
  - platform/src/lib/rag/routerClient.ts
  - verification_artifacts/RAG/golden_router_queries_v1_0.json
  - verification_artifacts/RAG/router_eval_v1_0.json
  - verification_artifacts/RAG/retrieval_golden_v1_0.json
  - verification_artifacts/RAG/RED_TEAM_M2B_PHASE_B6_v1_0.md
  - 06_LEARNING_LAYER/**
  - 05_TEMPORAL_ENGINES/**
  - 00_ARCHITECTURE/STEP_LEDGER_v1_0.md
  - 00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md          # no DRs expected in B.8
---

# CLAUDECODE_BRIEF — Madhav_M2A_Exec_14
## B.8 Synthesis Layer

*Status: READY | Authored: 2026-04-27 | Executor: Claude Code Extension (VS Code)*

---

## §0 — Carry-forward status from Exec_13

| ID | From | Description | Status in B.8 |
|---|---|---|---|
| CF.1 | Exec_13 | Upgrade router.py ANTHROPIC_MODEL to claude-opus-4.7 when available | **STILL PENDING** — model not yet available; carry to Exec_15 |
| CF.2 | Exec_13 | Revise router_v1_0.md if eval pass < 20/20 | **CLOSED** — Exec_13 achieved 20/20; no action |

---

## §1 — Pre-flight assertions (AC.0)

Before any implementation, verify:

1. `platform/python-sidecar/rag/synthesize.py` does NOT exist. If present, halt and report.
2. `platform/python-sidecar/rag/routers/rag_synthesize.py` does NOT exist. If present, halt and report.
3. `platform/src/lib/rag/synthesizeClient.ts` does NOT exist. If present, halt and report.
4. `035_DISCOVERY_LAYER/PROMPTS/claude/synthesis_v1_0.md` does NOT exist. If present, halt and report.
5. `platform/python-sidecar/rag/routers/rag_router.py` exists and contains `POST /route` endpoint
   (B.7 complete — confirms predecessor). If absent, halt and report.
6. `platform/python-sidecar/rag/retrieve.py` exists and the `retrieve` function is importable:
   `python3 -c "from rag.retrieve import retrieve; print('ok')"` exits 0.
7. `platform/python-sidecar/rag/schemas.py` contains `QueryPlan` but does NOT yet contain
   `SynthesisAnswer` or `DerivationEntry`. If either class is present, halt and report.

If assertions 1–7 all pass, proceed with §2.

---

## §2 — Implementation scope

B.8 builds the synthesis layer. Given a natural-language query, the system routes it to a
`QueryPlan`, retrieves a ranked bundle via the hybrid retrieval library, and synthesizes a
layer-aware answer using Opus. The synthesizer enforces P7 (three-interpretation gate when
significance ≥ 0.7), P8 (confidence + rationale), and P5 (no out-of-bundle signal references).

**Synthesis runs only for validation-UI queries.** The discovery engine (B.5 registers) has its
own write pipeline and does not use the synthesis endpoint. The Next.js UI pages are B.10 scope.

### §2.1 — Schema additions (schemas.py)

Add two Pydantic models to `platform/python-sidecar/rag/schemas.py`:

```python
class DerivationEntry(BaseModel):
    chunk_id: str            # chunk_id from the retrieval bundle
    doc_type: str            # l1_fact | msr_signal | ucn_section | domain_report | cgm_node
    layer: str               # L1 | L2.5 | L3
    signal_or_fact_id: str   # SIG.MSR.nnn or fact_id; empty string if not applicable
    claim_supported: str     # 1-sentence claim this chunk supports in the answer

class SynthesisAnswer(BaseModel):
    query_text: str
    plan: QueryPlan
    answer_text: str                        # the layered synthesis answer
    derivation_ledger: list[DerivationEntry]   # all citations used; min 1 entry
    confidence: Literal["LOW", "MED", "HIGH"]
    confidence_rationale: str               # ≥50 chars (P8 structural)
    interpretations: list[str]              # exactly 3 if p7_triggered; else empty list
    bundle_chunk_ids: list[str]             # all chunk_ids in the retrieval bundle
    actor: str                              # "claude-opus-4-6"
    p7_triggered: bool                      # True iff plan.significance_score >= 0.7
    p6_enforcement: str                     # "full" | "degraded_no_ucn" | "degraded_[reason]"
```

`SynthesisAnswer` imports `QueryPlan` (already in `schemas.py`).
`Literal` is already imported from `typing`.

### §2.2 — Synthesis prompt (synthesis_v1_0.md)

Author `035_DISCOVERY_LAYER/PROMPTS/claude/synthesis_v1_0.md` with frontmatter:

```yaml
artifact: synthesis_v1_0.md
version: "1.0"
status: CURRENT
model: claude-opus-4-6
session: Madhav_M2A_Exec_14
```

Prompt body must contain:

**(a) Role and mandate.**
Acharya-grade Jyotish synthesizer operating on the MARSYS-JIS corpus. Goal: produce a
layer-aware answer that an independent senior Jyotish acharya would rate as "at my level or
above". No generic astrology. Every claim traces to a specific chunk in the retrieval bundle.

**(b) Input format (structured, passed as user message).**
```
QUERY_PLAN:
  query_text: <text>
  plan_type: <type>
  significance_score: <float>
  domains: [<domain>, ...]
  wcr_forced: <bool>

RETRIEVAL_BUNDLE (k results, ranked by score):
[
  { chunk_id: "...", doc_type: "...", layer: "...", score: <float>, text: "<chunk text>" },
  ...
]
```

**(c) Output format (strict JSON, no markdown fences).**
```json
{
  "answer_text": "<layered synthesis answer>",
  "derivation_ledger": [
    {
      "chunk_id": "...",
      "doc_type": "...",
      "layer": "...",
      "signal_or_fact_id": "...",
      "claim_supported": "<1-sentence claim>"
    }
  ],
  "confidence": "LOW | MED | HIGH",
  "confidence_rationale": "<≥50-char rationale citing breadth, UCN convergence, counter-evidence>",
  "interpretations": ["<interp 1>", "<interp 2>", "<interp 3>"],
  "p6_enforcement": "full | degraded_no_ucn | degraded_[reason]"
}
```

Note: `interpretations` must contain exactly 3 items when `significance_score ≥ 0.7`,
and must be an empty array `[]` otherwise. This is non-negotiable (P7 gate).
The caller sets `p7_triggered`, `bundle_chunk_ids`, `actor`, `plan`, `query_text`.

**(d) P5 enforcement rule (verbatim in prompt).**
"You MAY ONLY cite `chunk_id` values that appear in the RETRIEVAL_BUNDLE provided. If you
cannot support a claim from the bundle, acknowledge the gap explicitly rather than citing
external knowledge. Do NOT invent chunk IDs, signal IDs, or fact IDs."

**(e) P6 enforcement rule (verbatim in prompt).**
"If the RETRIEVAL_BUNDLE contains at least one `doc_type = ucn_section` chunk, set
`p6_enforcement: 'full'`. If it contains no `ucn_section` chunk, set
`p6_enforcement: 'degraded_no_ucn'` and note the absence in `answer_text` with the phrase
`[UCN NOT IN BUNDLE — P6 degraded]`."

**(f) Confidence rubric (verbatim in prompt).**
- **HIGH**: ≥5 distinct chunks cited in derivation_ledger, including ≥1 ucn_section + ≥1 l1_fact
  + ≥1 domain_report, showing convergent support across layers.
- **MED**: 3–4 distinct chunks cited, or ≥5 but missing one layer type.
- **LOW**: ≤2 distinct chunks cited, or all citations from a single doc_type.
`confidence_rationale` must cite breadth (number of chunk types), convergence (layer agreement),
and counter-evidence (any bundle chunk that resists the answer direction).

**(g) Interpretations rubric (when significance_score ≥ 0.7, verbatim in prompt).**
Provide exactly 3 interpretations, ordered as:
1. Classical/traditional reading (shastra-aligned, citing L1 facts or L3 domain reports).
2. Psychological/inner-world reading (citing UCN or MSR psychological signals).
3. Timing/manifestation reading (how and when this may crystallize; cite timing signals or
   dasha windows if present in the bundle; flag `[TIMING_DATA_NOT_IN_BUNDLE]` if absent).

**(h) Worked examples (≥2).**
At minimum:
- Example 1: `interpretive_multidomain`, significance_score = 0.82, wcr_forced = True.
  Shows 3 interpretations, full derivation ledger, HIGH confidence.
- Example 2: `factual`, significance_score = 0.30, wcr_forced = False.
  Shows empty interpretations array, brief derivation ledger, MED or LOW confidence.

Draw worked examples from the domains present in FORENSIC_ASTROLOGICAL_DATA_v8_0.md
(career, wealth, relationships, spiritual, health, etc.) for native Abhisek Mohanty.
Do not invent chart facts — if a specific value is needed for an example, use a placeholder
pattern like `<house lord per FORENSIC>` rather than a fabricated position.

### §2.3 — synthesize.py (full implementation)

`platform/python-sidecar/rag/synthesize.py`:

```python
ANTHROPIC_MODEL = "claude-opus-4-6"

_REPO_ROOT = Path(__file__).resolve().parents[3]
_SYNTHESIS_PROMPT_PATH = (
    _REPO_ROOT / "035_DISCOVERY_LAYER" / "PROMPTS" / "claude" / "synthesis_v1_0.md"
)

def _load_synthesis_prompt() -> str:
    """Read synthesis_v1_0.md and return body with YAML frontmatter stripped."""
    ...

def _build_bundle_context(plan: QueryPlan, results: list) -> str:
    """
    Format QueryPlan + retrieval bundle as a structured user message for Opus.
    Bundle items: {chunk_id, doc_type, layer, score, text}.
    """
    ...

def synthesize(plan: QueryPlan, results: list) -> SynthesisAnswer:
    """
    Synthesize a layer-aware answer from a QueryPlan and retrieval bundle.
    Single-pass Opus. Raises SynthesisError on API or parse failure.

    Post-parse enforcements (by caller, not delegated to Opus):
      - p7_triggered = (plan.significance_score >= 0.7)
      - If p7_triggered and len(parsed["interpretations"]) != 3: raise SynthesisError
      - bundle_chunk_ids = [r.chunk_id for r in results]
      - P5 check: all chunk_ids in derivation_ledger must be in bundle_chunk_ids;
        raise SynthesisError if violation found
      - actor = ANTHROPIC_MODEL
    """
    ...

class SynthesisError(Exception):
    """Raised when synthesis fails validation or Opus API errors."""
    ...
```

Parameters: temperature = 0.2 (slightly above 0 to allow interpretive variance while
remaining deterministic enough for eval). max_tokens = 1500.

`results` accepts `list[RetrievalResult]` from `rag.retrieve`. Import lazily to avoid
circular import: `from rag.retrieve import RetrievalResult` inside the function.

**Important**: `synthesize()` does NOT call `retrieve()` or `classify_query()` itself —
it takes pre-built plan and results. The endpoint (§2.4) is responsible for composition.

### §2.4 — FastAPI endpoint (rag_synthesize.py)

```
POST /rag/synthesize
Request:  { "query": str }
Response: { "answer": SynthesisAnswer }
```

The endpoint:
1. `plan = classify_query(req.query)` — calls router (B.7)
2. `mode = "auto" if plan.wcr_forced else "hybrid_rrf"` — respects WCR flag
3. `results = retrieve(req.query, mode=mode, k=10, rerank=True)` — calls retriever (B.6)
4. `answer = synthesize(plan, results)` — calls synthesizer (B.8)
5. Return `{"answer": answer.model_dump()}`

Errors: `SynthesisError` → HTTP 422 (invalid synthesis output, not a 500); all other
exceptions → HTTP 500.

Register in `main.py` with `prefix="/rag"` so full path is `/rag/synthesize`.
Import: `from rag.routers.rag_synthesize import router as rag_synthesize_router`.

### §2.5 — TypeScript shim (synthesizeClient.ts)

Mirror the pattern of `retrieveClient.ts` and `routerClient.ts`.
Path: `platform/src/lib/rag/synthesizeClient.ts`

Export:
- `DerivationEntry` interface (5 fields per §2.1)
- `SynthesisAnswer` interface (11 fields per §2.1; `plan` field typed as `QueryPlan` imported
  from `./routerClient`)
- `ragSynthesize(query: string): Promise<SynthesisAnswer>` calling `POST ${SIDECAR_URL}/rag/synthesize`

### §2.6 — Golden eval set + eval run (synthesis_golden_v1_0.json)

Author `verification_artifacts/RAG/synthesis_golden_v1_0.json` (10 queries):

```json
{
  "description": "B.8 synthesis golden set — 10 queries (5 P7-gated, 5 standard). Authored Madhav_M2A_Exec_14.",
  "queries": [
    {
      "query_id": "SQ.001",
      "query_text": "...",
      "expected_p7_triggered": true,
      "expected_plan_type": "interpretive_multidomain"
    },
    ...
  ]
}
```

Golden set composition:
- **SQ.001–SQ.005**: High-significance queries (`expected_p7_triggered: true`).
  These must route to `interpretive_multidomain` or `interpretive_single` or `timing`
  with significance ≥ 0.7. Suggested topics:
  - SQ.001: Cross-domain career + wealth synthesis (interpretive_multidomain)
  - SQ.002: Psychological core tension across the chart (interpretive_multidomain)
  - SQ.003: Relationship patterns and their chart basis (interpretive_multidomain)
  - SQ.004: Timing of career crystallization in upcoming dashas (timing, significance ≥ 0.7)
  - SQ.005: Spiritual and dharmic mission synthesis (interpretive_multidomain)
- **SQ.006–SQ.010**: Standard queries (`expected_p7_triggered: false`).
  Route to `factual`, `meta`, or `interpretive_single`/`timing` with significance < 0.7.
  - SQ.006: "What planet lords Abhisek's 7th house?" (factual)
  - SQ.007: "Which planet occupies the 10th house?" (factual)
  - SQ.008: "What is the active mahadasha?" (factual)
  - SQ.009: "How does this instrument handle conflicting interpretations?" (meta)
  - SQ.010: "What is the UCN core narrative for Abhisek?" (interpretive_single)

**IMPORTANT**: Frame SQ.001–SQ.005 so they naturally route with significance ≥ 0.7 per the
router's significance-scoring rubric (§2.3 of CLAUDECODE_BRIEF_M2A_Exec_13). Check that
`classify_query()` produces `significance_score ≥ 0.7` before finalizing these queries; adjust
phrasing if the router scores them below 0.7.

Do NOT modify `golden_router_queries_v1_0.json` or any existing golden set.

---

## §3 — Acceptance criteria

### AC.0 — Pre-flight (blocking)
All 7 assertions in §1 verified and pass. If any fail, halt and report; do not proceed.

### AC.1 — schemas.py: DerivationEntry + SynthesisAnswer Pydantic models
`schemas.py` contains `DerivationEntry` (5 fields) and `SynthesisAnswer` (11 fields per §2.1).
`SynthesisAnswer.confidence` uses `Literal["LOW", "MED", "HIGH"]`.
`SynthesisAnswer.interpretations` typed as `list[str]`.
`SynthesisAnswer.p7_triggered` is a plain `bool`.
**Verification**: `python3 -c "from rag.schemas import SynthesisAnswer, DerivationEntry; print(list(SynthesisAnswer.model_fields.keys()))"` exits 0 and prints the 11 field names.

### AC.2 — synthesis_v1_0.md: Synthesizer prompt
`035_DISCOVERY_LAYER/PROMPTS/claude/synthesis_v1_0.md` exists with frontmatter
(`artifact`, `version: 1.0`, `status: CURRENT`, `model: claude-opus-4-6`).
Body contains: (a) role + mandate; (b) structured input format; (c) JSON output format;
(d) P5 enforcement rule verbatim; (e) P6 enforcement rule verbatim; (f) confidence rubric;
(g) 3-interpretation rubric (when significance ≥ 0.7); (h) ≥2 worked examples.
**Verification**: file exists; frontmatter parses; `model` field = "claude-opus-4-6"; grep for
"P5" and "P6" each return ≥1 match in body.

### AC.3 — synthesize.py: Full implementation
`platform/python-sidecar/rag/synthesize.py` implements:
1. `ANTHROPIC_MODEL = "claude-opus-4-6"` constant at module level.
2. `_load_synthesis_prompt() -> str` — reads synthesis_v1_0.md, strips YAML frontmatter.
   Path resolved relative to repo root (not hardcoded VM mount).
3. `_build_bundle_context(plan, results) -> str` — formats QueryPlan + bundle for Opus.
4. `synthesize(plan, results) -> SynthesisAnswer` — calls Anthropic SDK at temperature=0.2,
   max_tokens=1500; parses JSON; sets `p7_triggered`, `bundle_chunk_ids`, `actor` post-parse;
   enforces P7 gate (3 interpretations if p7_triggered); enforces P5 check (all derivation
   chunk_ids in bundle_chunk_ids); raises `SynthesisError` on any validation failure.
5. `class SynthesisError(Exception)` defined.
**Verification**: `python3 -c "from rag.synthesize import synthesize, SynthesisError; print('import ok')"` exits 0.

### AC.4 — rag_synthesize.py + main.py registration
`platform/python-sidecar/rag/routers/rag_synthesize.py` authored:
- Request model `SynthesizeRequest(BaseModel)`: `query: str = Field(..., min_length=1, max_length=2000)`
- `POST /rag/synthesize` endpoint: route → retrieve → synthesize; returns `{"answer": answer.model_dump()}`
- `SynthesisError` → HTTP 422; all other exceptions → HTTP 500
`main.py` updated: import + `app.include_router(rag_synthesize_router, prefix="/rag", dependencies=[Depends(verify_api_key)])`.
**Verification**: `grep rag_synthesize_router main.py` finds 2 lines (import + include_router).

### AC.5 — synthesizeClient.ts TypeScript shim
`platform/src/lib/rag/synthesizeClient.ts` authored following `retrieveClient.ts` pattern.
Exports: `DerivationEntry` interface (5 fields); `SynthesisAnswer` interface (11 fields,
`plan` typed as `QueryPlan` imported from `./routerClient`); `ragSynthesize(query: string): Promise<SynthesisAnswer>` calling `POST ${SIDECAR_URL}/rag/synthesize`.
**Verification**: file exists; `ragSynthesize` exported as an async function; TypeScript compiles with 0 new errors (`cd platform && npx tsc --noEmit 2>&1 | grep -v "node_modules" | head -20`).

### AC.6 — synthesis_golden_v1_0.json authored
`verification_artifacts/RAG/synthesis_golden_v1_0.json` exists with exactly 10 entries
(SQ.001–SQ.010). Exactly 5 entries have `expected_p7_triggered: true`.
All 5 P7-gated queries confirmed to produce `significance_score ≥ 0.7` when passed through
`classify_query()` before the golden set is finalized.
**Verification**: `python3 -c "import json; d=json.load(open('verification_artifacts/RAG/synthesis_golden_v1_0.json')); assert len(d['queries'])==10; assert sum(1 for q in d['queries'] if q['expected_p7_triggered'])==5; print('ok')"` exits 0.

### AC.7 — Synthesis eval: 10/10 derivation ledger present and non-empty
Run `synthesize()` against all 10 golden queries (via the composite endpoint path: classify →
retrieve → synthesize). For each result, verify:
- `len(answer.derivation_ledger) >= 1`
- `answer.answer_text` is non-empty

Save results to `verification_artifacts/RAG/synthesis_eval_v1_0.json`:
```json
{
  "session": "Madhav_M2A_Exec_14",
  "model": "claude-opus-4-6",
  "total": 10,
  "derivation_ledger_pass": <int>,
  "p7_pass": <int>,
  "p5_pass": <int>,
  "results": [
    {
      "query_id": "SQ.001",
      "query_text": "...",
      "p7_triggered": true,
      "interpretations_count": 3,
      "derivation_ledger_entries": 6,
      "out_of_bundle_refs": 0,
      "confidence": "HIGH",
      "p6_enforcement": "full",
      "pass_derivation": true,
      "pass_p7": true,
      "pass_p5": true
    }
  ]
}
```
**Pass gate**: derivation_ledger_pass = 10/10. If any query has empty derivation_ledger,
halt and report; do not proceed to AC.8.

### AC.8 — P7 invariant: 5/5 significance-gated queries produce 3 interpretations
In `synthesis_eval_v1_0.json`, all 5 entries where `p7_triggered: true` must have
`interpretations_count: 3`. Pass gate = 5/5 = 100%.
**Verification**: scan synthesis_eval_v1_0.json; confirm all 5 p7_triggered entries have
`interpretations_count: 3`.

### AC.9 — P5 invariant: 0/10 out-of-bundle signal references
In `synthesis_eval_v1_0.json`, all 10 entries must have `out_of_bundle_refs: 0`.
Pass gate = 10/10 = 100%. `out_of_bundle_refs` counts derivation_ledger entries whose
`chunk_id` was not in `bundle_chunk_ids` of the returned `SynthesisAnswer`.
**Verification**: scan synthesis_eval_v1_0.json; confirm all 10 entries have `out_of_bundle_refs: 0`.

### AC.10 — FILE_REGISTRY v1.15
Bump from v1.14 to v1.15. Add rows for 6 new files:
`synthesis_v1_0.md`, `synthesize.py`, `rag_synthesize.py`, `synthesizeClient.ts`,
`synthesis_golden_v1_0.json`, `synthesis_eval_v1_0.json`.
Update rows for 2 mutated files: `schemas.py` (DerivationEntry + SynthesisAnswer added),
`main.py` (v1.3 — rag_synthesize_router added).

### AC.11 — CANONICAL_ARTIFACTS fingerprint rotations
Rotate fingerprints for §1 rows whose files were mutated: FILE_REGISTRY (v1.14 → v1.15).
No other §1 entries should be touched by B.8 scope.

### AC.12 — Mirror updates (MP.1 + MP.2)
`.geminirules` footer: append one line recording B.8 completion + session ID.
`.gemini/project_state.md` `_Last updated_` line: refresh to 2026-04-27 + session note.

### AC.13 — CURRENT_STATE_v1_0.md updated
Append `v1.0 amended-in-place` changelog entry for Madhav_M2A_Exec_14.
§2 YAML field updates:
- `active_phase_plan_sub_phase` → "B.8 complete (Synthesis Layer)"
- `red_team_counter` → 2
- `last_session_id` → Madhav_M2A_Exec_14
- `last_session_*` block refreshed
- `next_session_objective` → "Execute Madhav_M2A_Exec_15 — B.9 per PHASE_B_PLAN_v1_0.md §B.9"
- `next_session_proposed_cowork_thread_name` → "Madhav M2A-Exec-15 — B.9"
- `file_updated_at` + `file_updated_by_session` refreshed

### AC.14 — SESSION_LOG.md appended atomically
One entry per SESSION_CLOSE_TEMPLATE schema. Includes session_open YAML (session_id, phase,
sub_phase, cowork_thread_name, scope declaration), body narrative (B.8 work summary), and
session_close YAML (all ACs pass/fail, deliverables list, mirror_updates_propagated,
current_state_updated: true, red_team_counter: 2, close_state: atomically_closed).

### AC.15 — CLAUDECODE_BRIEF.md → COMPLETE
Set `status: COMPLETE` in this file's frontmatter as the final write before SESSION_LOG append.

### AC.16 — build_state.json serialized + GCS uploaded
Run `serialize_build_state.py` to refresh `platform/build_state.json`. Upload:
`/opt/homebrew/bin/gsutil cp platform/build_state.json gs://marsys-jis-build-state/build_state.json`
Verify gsutil exits 0.

---

## §4 — How to start

1. Open the project in Claude Code Extension (VS Code / Anti-Gravity).
2. Read this file — you have it.
3. Run all 7 pre-flight assertions in §1. All must pass before writing any code.
4. Implementation order (dependencies flow top-to-bottom):
   - a. `schemas.py` (AC.1) — DerivationEntry + SynthesisAnswer; required by synthesize.py
      and rag_synthesize.py
   - b. `synthesis_v1_0.md` (AC.2) — synthesizer prompt; draws from FORENSIC data for examples
   - c. `synthesize.py` (AC.3) — reads synthesis_v1_0.md; imports QueryPlan + SynthesisAnswer
   - d. `rag_synthesize.py` + `main.py` (AC.4) — FastAPI wrapper over classify+retrieve+synthesize
   - e. `synthesizeClient.ts` (AC.5) — TypeScript shim; independent of Python chain
   - f. `synthesis_golden_v1_0.json` (AC.6) — author golden set; verify classify_query routes
      P7-gated queries with significance ≥ 0.7 before finalising
   - g. Synthesis eval (AC.7 + AC.8 + AC.9) — requires live Anthropic API connection;
      do not fake results
   - h. Close gates (AC.10–AC.16) — governance close chain
5. For the synthesis eval, a live Anthropic API connection is required. Each of the 10 golden
   queries makes one router call (Opus) + one retrieval call (DB) + one synthesis call (Opus)
   = 20 Opus calls total. Cost ≈ 20 × $0.04 ≈ $0.80. Well within the $9.76 B.8 budget.
6. gsutil: use `/opt/homebrew/bin/gsutil` for AC.16 (confirmed working at Exec_12 + Exec_13).
7. TypeScript compilation: run `cd platform && npx tsc --noEmit` to verify 0 new errors.
8. At session close: set `status: COMPLETE` in CLAUDECODE_BRIEF.md frontmatter (AC.15), then
   append SESSION_LOG (AC.14). These two writes are the atomic close pair.

---

## §5 — Carry-forwards to Exec_15

| ID | Description | Trigger |
|---|---|---|
| CF.1 | Upgrade router.py ANTHROPIC_MODEL to claude-opus-4.7 + regenerate router_eval_v1_0.json | When claude-opus-4.7 model string confirmed available in Anthropic API |
| CF.3 | If any SQ.001–SQ.005 golden queries score < 0.7 at router classification, refine phrasing and document in session_close | Only if classification surprise occurs during AC.6 |

CF.2 from Exec_13 is CLOSED (20/20 router eval; no revision needed).

---

## §6 — Scope boundary notes

- **B.8 = synthesis backend only.** The Next.js validation UI (`/dashboard/ask` page,
  `platform/src/app/api/rag/query/route.ts`, RAG components) is B.10 scope. Do not scaffold
  any UI pages or Next.js API routes in B.8.
- **Composite endpoint.** `/rag/synthesize` is intentionally a composite: route → retrieve →
  synthesize in a single HTTP call. This is the correct design for the portal. Do not expose
  a bare `synthesize(plan, results)` endpoint — that would require the client to manage the
  three-step pipeline.
- **Temperature 0.2.** Synthesis uses temperature 0.2 (vs router's 0.0) to allow natural
  interpretive variance in `interpretations[0–2]` while keeping derivation_ledger deterministic.
  This is a deliberate design choice; do not change it.
- **`SynthesisError` is HTTP 422, not 500.** A P7 violation or P5 violation is a validation
  failure in the synthesizer output — it signals the model failed its instructions, not an
  infrastructure error. 422 is the appropriate status.
- **Cost cap.** B.8 budget ≈ $9.76 (50 Opus synthesis calls per PHASE_B_PLAN §E.7). The
  golden eval = 10 routing + 10 synthesis = 20 Opus calls ≈ $0.80. Stay within the 50-call
  total budget across all testing and iteration.
- **No temporal-engine work.** The `timing` plan type routes to temporal signals in the
  existing corpus only. Do not touch `05_TEMPORAL_ENGINES/`.
- **CF.1 (claude-opus-4.7 upgrade).** Do NOT attempt any model upgrade in this session.
  CF.1 carries forward until the model string is confirmed available.

---

*End of CLAUDECODE_BRIEF_M2A_Exec_14. Status: READY. Executor: read §1 pre-flight first.*
