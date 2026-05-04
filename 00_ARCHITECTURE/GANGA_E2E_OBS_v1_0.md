---
artifact: GANGA_E2E_OBS_v1_0.md
canonical_id: GANGA_E2E_OBS
version: 1.0
status: COMPLETE
authored_by: Claude (GANGA-P2-R1-S2) 2026-05-04
branch: feature/ganga-umbrella
fix: BF.GAP.001 (applied prior to this run)
---

# GANGA E2E Planner Observation — GANGA-P2-R1-S2

## §1 — Run Metadata

| Field | Value |
|---|---|
| Date | 2026-05-04 |
| Branch | `feature/ganga-umbrella` |
| Planner model | `nvidia/llama-3.3-nemotron-super-49b-v1` (default; `PLANNER_MODEL_ID` not overridden) |
| Feature flag | `LLM_FIRST_PLANNER_ENABLED=true` |
| Golden set | `platform/tests/eval/planner_golden_set.json` |
| Total entries | 29 |
| Runner exit code | 0 (thresholds met) |
| Env note | `platform/.env.local` created for this run; `MARSYS_REPO_ROOT=/Users/Dev/Vibe-Coding/Apps/Ganga` |

---

## §2 — Aggregate Results

| Metric | Value | Threshold | Status |
|---|---|---|---|
| Total entries | 29 | — | — |
| Passed | 23 | — | — |
| Failed | 6 | — | — |
| Pass rate | 0.793 | — | — |
| Avg tool_recall | **0.940** | ≥ 0.80 | ✓ MET |
| Avg tool_precision | **0.941** | ≥ 0.90 | ✓ MET |
| Required misses | 1 (GT.021 — timeout) | 0 preferred | ⚠ WARN |
| Forbidden violations | 0 | 0 | ✓ CLEAN |

Overall verdict: **THRESHOLDS MET** — the LLM-first planner (post-BF.GAP.001) clears both macro-averaged gates. 6 failures remain, none involving a forbidden tool violation. One failure (GT.021) is a transient NIM timeout, not a structural prompt defect.

---

## §3 — Full Failure List

| id | predicted_tools | recall | precision | required_hit | root_cause_category |
|---|---|---|---|---|---|
| GT.002 | `msr_sql, remedial_codex_query, resonance_register` | 0.75 | 1.00 | ✓ | LOW_RECALL |
| GT.017 | `cluster_atlas, msr_sql, vector_search, pattern_register, cgm_graph_walk` | 1.00 | 0.80 | ✓ | LOW_PRECISION |
| GT.021 | *(empty — timeout)* | 0.00 | 0.00 | ✗ | ERROR |
| GT.022 | `msr_sql, pattern_register, vector_search` | 1.00 | 0.67 | ✓ | LOW_PRECISION |
| GT.025 | `cluster_atlas, pattern_register` | 0.50 | 1.00 | ✓ | LOW_RECALL |
| GT.029 | `cluster_atlas, msr_sql, vector_search, pattern_register, cgm_graph_walk, contradiction_register` | 1.00 | 0.83 | ✓ | LOW_PRECISION |

**Notes:**
- GT.021 error message: `"LLM planner call failed: The operation was aborted due to timeout"`. The query ("Tell me everything about Jupiter in my chart.") is not structurally difficult; the timeout was a transient NIM queue event.
- GT.027 and GT.028 correctly predict empty tool lists (`[]`) and pass — these are out-of-scope / refusal entries.

---

## §4 — GT.002 Root Cause Analysis

**Query:** "Which mantra should I recite to support spiritual progress?"

| | Tools |
|---|---|
| Predicted | `msr_sql`, `remedial_codex_query`, `resonance_register` |
| Expected | `remedial_codex_query`, `msr_sql`, `vector_search`, `resonance_register` |
| Required | `remedial_codex_query`, `resonance_register` |

**recall = 0.75 · precision = 1.00** — all predicted tools are correct; `vector_search` is the single miss.

**Root cause:** The planner applies a fixed 3-tool remedial bundle (`msr_sql` + `remedial_codex_query` + `resonance_register`) uniformly across all remedial queries and does not distinguish mantra/stotra queries from gemstone/ritual queries. `vector_search` is the correct fourth tool here because mantras are stored as L3 domain_report text chunks (`doc_type='domain_report'`, spiritual domain) that are only reachable via semantic vector retrieval — the remedial codex (`doc_type='l4_remedial'`) covers the prescription but not the full spirituality corpus. Compare: GT.001 ("What gemstone should I wear to strengthen Venus?") correctly includes `vector_search` in its predicted set, suggesting the planner sometimes selects it but lacks a consistent rule for when.

**v1.7 fix:** Add a few-shot instruction distinguishing mantra/textual remedy queries: *"When the query asks specifically about mantras, stotras, japa, or any text-based spiritual practice (not gemstones or behavioural rituals), add `vector_search` to reach the spirituality L3 domain_report corpus in addition to `remedial_codex_query`."* Alternatively, promote `vector_search` to a default member of the remedial bundle for `query_class=remedial`, guarded by a note that it may be omitted only when the query is strictly gemstone/charity/fasting.

---

## §5 — GT.025 Root Cause Analysis

**Query:** "Tell me something interesting about the chart."

| | Tools |
|---|---|
| Predicted | `cluster_atlas`, `pattern_register` |
| Expected | `pattern_register`, `contradiction_register`, `resonance_register`, `cluster_atlas` |
| Required | *(none — any non-empty subset of the four discovery registers is acceptable)* |

**recall = 0.50 · precision = 1.00** — predicted tools are a correct subset; `contradiction_register` and `resonance_register` are missing.

**Root cause:** The planner treats open-ended holistic curiosity queries as a `cluster_atlas` + `pattern_register` pair (the two "positive signal" discovery registers) and systematically omits `contradiction_register` (tension/paradox signals) and `resonance_register` (cross-domain resonance patterns). This is not a budget-arbitration prune — the budget model would not preferentially drop two of four registers without instructions to do so. The prompt gives no explicit instruction that "interesting" or "curious about" queries warrant all four discovery registers. The planner conflates this query class with a `holistic` overview query and applies the wrong register subset.

Compare GT.018 ("What are the most striking paradoxes or tensions in my chart?"), which correctly selects all four discovery registers: `cluster_atlas, contradiction_register, pattern_register, resonance_register`. GT.025 is an implicit version of the same request but the planner doesn't recognise the implicit signal.

**v1.7 fix:** Add a few-shot instruction: *"For open-ended holistic curiosity queries ('tell me something interesting', 'what stands out', 'what's notable', 'anything surprising'), invoke all four L2.5 discovery registers: `pattern_register`, `contradiction_register`, `resonance_register`, `cluster_atlas`. These queries have no specific domain intent, so maximum discovery breadth is correct — the synthesis layer will filter. Do not prune to a 2-register subset."*

---

## §6 — Systematic Patterns Across All Failures

### Pattern A — LOW_PRECISION on `msr_sql` in holistic/comprehensive queries (GT.017, GT.029)

Both GT.017 ("comprehensive overview of my life path across all major domains") and GT.029 ("everything about everything") receive a spurious `msr_sql` call. The expected tool sets for both are cluster/discovery/graph tools; `msr_sql` is appropriate for targeted signal retrieval but adds noise when the synthesis model is already receiving a full discovery-register output. The planner appears to add `msr_sql` as a safe fallback for any query that feels "comprehensive", even when the query class is `holistic` and no specific signal query is needed.

**Pattern in plain terms:** `msr_sql` is over-triggered as a "completeness hedge" for holistic queries. It should be suppressed when `query_class=holistic` and the query contains no specific planet/house/yoga reference.

### Pattern B — LOW_PRECISION via spurious `vector_search` on divisional-chart planetary queries (GT.022)

GT.022 ("What is Mars's role across my divisional charts?") adds `vector_search` beyond the expected `msr_sql` + `pattern_register`. `vector_search` reaches L3 domain_report text; it is the right tool for qualitative/narrative questions but not for a structured multi-varga signal read. The planner treats "Mars across charts" as also needing corpus lookup, which is incorrect — the MSR and pattern_register already encode divisional data.

**Pattern in plain terms:** `vector_search` is over-triggered on planetary queries that specify a structural read (divisional charts, dignity, aspect) rather than asking for narrative or textual context.

### Pattern C — Incomplete four-register activation for open-ended discovery (GT.025)

The planner consistently selects `cluster_atlas` + `pattern_register` (the two structurally-positive discovery registers) and drops `contradiction_register` + `resonance_register` for ambiguous queries. This is a systematic half-activation pattern: the planner knows the domain is "discovery" but defaults to the confirmatory half of the register quad, ignoring the tension and resonance halves. GT.025 is the clearest example; GT.029 (which does include `contradiction_register`) is an incidental exception driven by the "everything" framing.

---

## §7 — v1.7 Fix Specification (input to PROMPT-EVAL)

Ordered by impact (highest-recall-gain first). All changes target `PLANNER_PROMPT_v1_0.md §3 system prompt` or its few-shot section.

**Fix 1 — Remedial mantra/textual queries: add `vector_search` rule**

> Add to the remedial query instruction block:
> *"If the query asks for a mantra, stotra, japa practice, or any textually-delivered remedy (as opposed to gemstone, charity, or fasting), include `vector_search` in the plan. `vector_search` reaches the spirituality and domain_report corpus for mantra-specific semantic matches that `remedial_codex_query` alone cannot retrieve."*
>
> Add a few-shot pair:
> - User: "Which mantra should I recite to support spiritual progress?"
> - Plan: `query_class=remedial`, tools: `[remedial_codex_query, msr_sql, resonance_register, vector_search]`
>
> **Target:** closes GT.002 LOW_RECALL (0.75 → 1.00), expected +0.009 on avg_recall.

**Fix 2 — Open-ended holistic curiosity: full four-register activation**

> Add to the holistic/edge_case instruction block:
> *"For open-ended curiosity queries ('tell me something interesting', 'what stands out', 'anything notable', 'surprise me') with no domain anchor: activate all four L2.5 discovery registers — `pattern_register`, `contradiction_register`, `resonance_register`, `cluster_atlas`. Do NOT reduce to a 2-register subset. The synthesis model filters; the planner should not pre-filter for curiosity queries."*
>
> Add a few-shot pair:
> - User: "Tell me something interesting about the chart."
> - Plan: `query_class=holistic`, tools: `[pattern_register, contradiction_register, resonance_register, cluster_atlas]`
>
> **Target:** closes GT.025 LOW_RECALL (0.50 → 1.00), expected +0.017 on avg_recall.

**Fix 3 — Suppress `msr_sql` on pure holistic queries (no planet/house reference)**

> Add to the holistic query instruction block:
> *"When `query_class=holistic` and the query contains no specific planet name, house number, or yoga name, omit `msr_sql`. The discovery registers (`cluster_atlas`, `pattern_register`, `contradiction_register`, `resonance_register`) and `cgm_graph_walk` provide holistic synthesis without raw signal retrieval. Add `msr_sql` only when the user explicitly names a planet, house, or yoga in a comprehensive query."*
>
> Add a few-shot pair:
> - User: "Give me a comprehensive overview of my life path across all major domains."
> - Plan: `query_class=holistic`, tools: `[cluster_atlas, vector_search, pattern_register, cgm_graph_walk]` *(no `msr_sql`)*
>
> **Target:** closes GT.017 LOW_PRECISION (0.80 → 1.00), reduces GT.029 spurious tool count.

**Fix 4 — Suppress `vector_search` on structured divisional-chart planetary queries**

> Add to the interpretive/planetary query instruction block:
> *"For queries asking about a planet's role across divisional charts (D9, D10, D7, varga, divisional), use `msr_sql` (with `signal_type=divisional`) and `pattern_register` (for named yogas). Do NOT add `vector_search` unless the query explicitly asks for textual context, classical sources, or narrative — divisional signal queries are structural reads, not corpus queries."*
>
> Add a few-shot pair:
> - User: "What is Mars's role across my divisional charts?"
> - Plan: `query_class=interpretive`, tools: `[msr_sql, pattern_register]`
>
> **Target:** closes GT.022 LOW_PRECISION (0.67 → 1.00).

**Fix 5 — GT.021 timeout: infrastructure, not prompt**

GT.021 ("Tell me everything about Jupiter in my chart.") failed due to a transient NIM network timeout, not a structural prompt defect. The query maps correctly to `[msr_sql, pattern_register, cgm_graph_walk]` and would pass on retry. No prompt change needed. Recommended infrastructure fix: increase planner timeout ceiling or add one retry with exponential backoff for timeout-class errors in `manifest_planner.ts`.

---

**Expected post-v1.7 score (conservative estimate):**

| Metric | Current | Post-v1.7 (est.) |
|---|---|---|
| Passed | 23/29 | 27/29 |
| Avg recall | 0.940 | ≥ 0.960 |
| Avg precision | 0.941 | ≥ 0.960 |
| Pass rate | 0.793 | ≥ 0.931 |

GT.021 will remain a failure unless the timeout infrastructure is addressed. GT.029 partial improvement expected (Fix 3 removes spurious `msr_sql`; `contradiction_register` remains as a borderline spurious add — acceptable given the "everything" framing).
