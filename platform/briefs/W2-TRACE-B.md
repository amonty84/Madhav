---
status: COMPLETE
session: W2-TRACE-B
scope: TRACE-4/5/6/7/8/9 (remaining six UI panels) + MON-9 (investigation endpoint)
authored: 2026-05-02
round: 4
critical_path: false
blocks: nothing (terminal trace stream)
prerequisites:
  - W2-TRACE-A (COMPLETE — 77184e1): TRACE-0/1/2/3, circuit breaker, SSE events
  - W2-INSTRUMENT (COMPLETE — f1282a1): monitoring-write.ts, all four tables populated
  - W2-SCHEMA (COMPLETE — 8a14043): monitoring-types.ts, all four tables + analytics views
---

# W2-TRACE-B
## Remaining TRACE Panels (4–9) + Investigation Endpoint

Reference this file directly: `platform/briefs/W2-TRACE-B.md`. Do not use CLAUDECODE_BRIEF.md.

---

## Context

W2-TRACE-A (77184e1) delivered TRACE-0 through TRACE-3 (four components) plus
the circuit breaker and SSE planning events.

This session delivers the remaining six TRACE panels and the backend investigation
endpoint they depend on for post-query deep-dives (TRACE-9 + MON-9).

All components are UI-only — they receive props, do not fetch data themselves,
except TRACE-9 (InvestigationTab) which lazy-fetches via the new MON-9 endpoint.

---

## Acceptance criteria

### AC.B.1 — TRACE-4: Data Asset Flow panel

New file: `platform/src/components/trace/DataAssetFlow.tsx`

```typescript
interface DataAssetNode {
  asset_id: string
  tool_name: string
  tokens_contributed: number
  is_zero: boolean     // true if zero tokens contributed
}

interface DataAssetFlowProps {
  nodes: DataAssetNode[]
  total_context_tokens: number
  isLoading: boolean
}
```

SVG-based Sankey-style diagram (no third-party chart library):
- Left column: asset nodes (one rectangle per DataAssetNode)
- Right: single "Context Assembly" rectangle
- Arrows from each asset to Context Assembly; stroke-width proportional to `tokens_contributed / total_context_tokens`
- Zero-contributing assets: grey dashed border, grey arrow
- Non-zero assets: colored by tool category; arrow color matches
- Tooltip on hover: asset_id, tool_name, tokens_contributed, percentage of total

Skeleton: SVG placeholder with 6 grey asset node rectangles, no arrows.

Hydration: `context_assembly_done` SSE event.

### AC.B.2 — TRACE-5: Context Assembly panel

New file: `platform/src/components/trace/ContextAssembly.tsx`

```typescript
interface ContextLayer {
  label: string        // 'L1 Facts' | 'L2.5 Signals' | 'L2.5 Patterns' | 'L4 Remedial' | 'Vector' | 'CGM'
  tokens: number
  color: string        // Tailwind bg class e.g. 'bg-blue-500'
}

interface ContextAssemblyProps {
  layers: ContextLayer[]
  total_tokens: number
  model_max_context: number
  isLoading: boolean
}
```

Stacked horizontal bar showing each layer's proportional token contribution.
Below the bar: layer legend with token counts. A "context budget" indicator
shows `total_tokens / model_max_context` as a percentage — amber if > 70%, red if > 85%.

Drill-down: clicking a layer segment expands a list of items (citations, signal IDs)
contributed from that layer. For this session, the drill-down shows the layer label +
token count only (item-level drill requires TRACE-9 / investigation endpoint).

Skeleton: empty stacked bar, 100% grey, one row of 6 grey legend pills.

Hydration: `context_assembly_done` SSE event.

### AC.B.3 — TRACE-6: Synthesis Receipt panel

New file: `platform/src/components/trace/SynthesisReceipt.tsx`

```typescript
interface CitationValidationSummary {
  gate_result: 'PASS' | 'WARN' | 'ERROR'
  layer1_count: number
  layer2_verified: number
  layer2_leaked: number
  gate_reason: string
}

interface SynthesisReceiptProps {
  synthesis_model_id: string
  synthesis_temperature: number
  input_tokens: number
  output_tokens: number
  cost_usd: number | null
  citation_validation: CitationValidationSummary | null
  b3_compliant: boolean
  isLoading: boolean
}
```

Displays a receipt-style summary:
- Model + temperature badge
- Input / output token counts
- Cost (if available; "—" if null)
- B.3 compliance status: green checkmark (PASS), amber warning (WARN), red X (ERROR)
- Citation breakdown: `layer1_count` total citations, `layer2_verified` verified,
  `layer2_leaked` leaked (training data). Show amber "Training data leak detected"
  banner if `layer2_leaked > 0`.

Skeleton: 3 grey field placeholders.

Hydration: `synthesis_done` SSE event.

### AC.B.4 — TRACE-7: Query Timeline panel

New file: `platform/src/components/trace/QueryTimeline.tsx`

```typescript
interface TimelineStep {
  step_seq: number
  step_type: string
  label: string
  started_at: number    // epoch ms
  latency_ms: number | null
  status: 'running' | 'done' | 'error' | 'zero_rows'
  is_parallel_group?: boolean
}

interface QueryTimelineProps {
  steps: TimelineStep[]
  isLoading: boolean
}
```

SVG horizontal timeline:
- X-axis: time (ms from query start)
- Each step: rectangle at `x = started_at - query_start`, `width = latency_ms`
- Parallel steps (same approximate start time): stacked vertically
- Color: running=grey pulse, done=green, error=red, zero_rows=amber
- Click any bar: emit `onStepClick(step_seq)` callback (parent wires to detail panel)
- Labels: step type abbreviation inside bars if wide enough; tooltip on hover

Skeleton: empty timeline track with left-to-right pulsing cursor bar.

Hydration: builds incrementally as `step_start`/`step_done`/`step_error` events arrive.
Finalizes layout on `query_done` event.

### AC.B.5 — TRACE-8: Cost Breakdown panel

New file: `platform/src/components/trace/CostBreakdown.tsx`

```typescript
interface CostEntry {
  label: string          // 'Planner (Haiku)', 'Synthesis (Llama-3.1)', etc.
  model_id: string
  input_tokens: number
  output_tokens: number
  reasoning_tokens: number | null
  cost_usd: number | null
}

interface CostBreakdownProps {
  entries: CostEntry[]
  total_cost_usd: number | null
  isLoading: boolean
}
```

Table of LLM cost entries. Footer row: total cost.
If `cost_usd` is null for all entries, show "Cost tracking requires provider pricing config"
note instead of the table total.

Budget vs actual section: if `token_budget` data available from the query plan, show
a per-tool comparison row (budgeted tokens vs actual tokens returned). Amber if actual
exceeds budget by > 20%.

Skeleton: 2 grey row placeholders.

Hydration: `step_done` events for each LLM call; final state on `query_done`.

### AC.B.6 — MON-9: Investigation endpoint

New file: `platform/src/app/api/investigation/[query_id]/route.ts`

```typescript
// GET /api/investigation/:query_id
// Returns: joined records from all four monitoring tables for the given query_id
interface InvestigationResponse {
  query_id: string
  llm_calls: LlmCallLogRow[]
  query_plan: QueryPlanLogRow | null
  tool_executions: ToolExecutionLogRow[]
  context_assembly: ContextAssemblyLogRow | null
}
```

Implementation:
- Four parallel `SELECT * WHERE query_id = $1` queries against the four monitoring tables
- Return 404 if no records found for query_id
- Return 200 with `InvestigationResponse` JSON
- Response must be < 500ms for a single query_id (single-row lookups by UUID index)

### AC.B.7 — TRACE-9: Investigation Tab

New file: `platform/src/components/trace/InvestigationTab.tsx`

```typescript
interface InvestigationTabProps {
  query_id: string | null
  isVisible: boolean      // lazy-load: only fetch when visible
}
```

Lazy-fetches `/api/investigation/:query_id` on first render when `isVisible=true`.
Renders four sub-tabs: LLM Calls, Query Plan, Tool Executions, Context Assembly.
Each sub-tab is a JSON pretty-print with copy button + condensed table view.

Export buttons: "Export JSON" (full InvestigationResponse), "Export CSV" (tool_executions
table only). CSV export uses browser Blob download — no server round-trip.

Skeleton: collapsed accordion, expands only on user click (not auto-expanded).

### AC.B.8 — tsc clean + commit

`npx tsc --noEmit` returns zero errors on all new/changed files.
Known_residuals (`AppShell.test.tsx`, `ReportGallery.test.tsx`) exempt.

```
feat(w2-trace-b): TRACE-4/5/6/7/8/9 + MON-9 investigation endpoint

- DataAssetFlow.tsx: SVG Sankey diagram, zero-asset grey dashed
- ContextAssembly.tsx: stacked bar by layer, budget % indicator
- SynthesisReceipt.tsx: model/temp/tokens/cost/B.3 status + leak banner
- QueryTimeline.tsx: SVG timeline, parallel stacking, step click callback
- CostBreakdown.tsx: LLM cost table, budget vs actual comparison
- InvestigationTab.tsx: lazy investigation tab, 4 sub-tabs, JSON/CSV export
- api/investigation/[query_id]/route.ts: MON-9 endpoint, 4-table join
```

---

## may_touch

```
platform/src/components/trace/DataAssetFlow.tsx         (new)
platform/src/components/trace/ContextAssembly.tsx        (new)
platform/src/components/trace/SynthesisReceipt.tsx       (new)
platform/src/components/trace/QueryTimeline.tsx          (new)
platform/src/components/trace/CostBreakdown.tsx          (new)
platform/src/components/trace/InvestigationTab.tsx       (new)
platform/src/app/api/investigation/[query_id]/route.ts   (new)
```

## must_not_touch

```
platform/src/lib/**
platform/src/hooks/**
platform/migrations/**
platform/tests/**
00_ARCHITECTURE/**
01_FACTS_LAYER/**
025_HOLISTIC_SYNTHESIS/**
platform/src/components/trace/PlanningIndicator.tsx
platform/src/components/trace/LLMCallMap.tsx
platform/src/components/trace/QueryPlan.tsx
platform/src/components/trace/ToolExecution.tsx
```

---

## Hard constraints

- All TRACE components are UI-only and receive props — they do not call hooks or fetch
  data except TRACE-9 (InvestigationTab) which fetches via the MON-9 endpoint.
- SVG diagrams (TRACE-4, TRACE-7) must be hand-authored SVG — no Chart.js, Recharts,
  or other chart libraries.
- Tailwind utility classes only for styling.
- TRACE-9 CSV export uses browser Blob — no server endpoint for CSV.
- MON-9 endpoint must not be accessible without a valid query_id (return 404, not 500).

---

*W2-TRACE-B · authored 2026-05-02 · terminal trace stream, no downstream blockers*
