---
artifact: GANGA-GQ002-BUG-v1_0.md
session_id: GANGA-PLANNER-FIX-S1
title: GQ-002 Root Cause — Planner Timeout + Compose-Bundle Zero-Tool Fallback
status: DEFERRED
authored: 2026-05-05
version: 1.0
---

# GQ-002 Root Cause Analysis

## Query
"Which mantra should I recite to support spiritual progress?"
query_id (investigation run): df45b449-d62b-448a-8436-d8ba6af2c375

## Observation

After resetting the circuit breaker (GANGA-PLANNER-FIX-S1 RC-1 fix), GQ-002 still
produces `plan_json IS NULL` with `parse_error = 'Planner call timed out after 15000ms'`.
`tool_execution_log` returns 0 rows for the query.

```
query_id                             | query_class | parse_error                          | tool_count | has_plan
df45b449-d62b-448a-8436-d8ba6af2c375 | factual     | Planner call timed out after 15000ms |          0 | f
```

## Root Causes

### RC-A: NIM nemotron model latency exceeds 15s

`nim.planner_fast.primary = nvidia/nemotron-3-super-120b-a12b` consistently takes
>15s end-to-end latency in the current environment. The STACK-S1 session measured
nemotron-super-49b at 6.8s; the 120B model is substantially larger and slower.
The circuit breaker timeout was raised from 5s→15s in this session (CHANGE-3),
but the model still exceeds the new limit.

Impact: every query falls back to the `classify()` + `compose_bundle()` path.

### RC-B: compose_bundle selects 0 tools for remedial/spiritual query class

When the planner falls back to compose_bundle, the spiritual query ("which mantra")
is classified as `factual` (query_class from DB), but compose_bundle returns
`tool_count = 0` for this combination. No chart data is retrieved; the synthesizer
produces a response without L1 fact grounding.

## Investigation Needed

1. Measure actual p50/p95 latency of nemotron-3-super-120b-a12b from the NIM API
   — determine whether a higher timeout (30s? 45s?) is viable or if a faster
   planner model should be substituted.
2. Inspect `compose_bundle()` fallback tool selection for query_class = 'factual'
   and domain = 'remedial'/'spiritual' — determine why tool_count = 0.
3. Consider adding a DeepSeek or Gemini fallback in the planner call path before
   the compose_bundle fallback, to avoid degraded tool selection.

## Deferral Reason

Not a single-file fix. Requires: (a) provider latency profiling, (b) planner model
registry tuning or timeout increase to 30s+, (c) compose_bundle fallback audit
for spiritual query classes. Deferred to next session.
