---
artifact: OBSERVATORY_PLAN_v1_0.md
canonical_id: OBSERVATORY_PLAN
version: 1.0.0
status: CURRENT
authored_session: PHASE_O_S0_1_OBSERVATORY_GOVERNANCE_BOOTSTRAP
authored_date: 2026-05-02
authoritative_side: claude
mirror_obligations: >
  Adapted-parity summary mirror at .geminirules §E (Concurrent workstreams) and
  .gemini/project_state.md (Concurrent Workstream — Phase O Observatory section).
  Semantic parity, not byte-identity. New mirror pair MP.9 declared in
  manifest_overrides.yaml at this S0.1 close.
consumers:
  - 00_ARCHITECTURE/CAPABILITY_MANIFEST.json (registers OBSERVATORY_PLAN as L_GOVERNANCE entry)
  - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md §2 (concurrent_workstreams block cites this artifact)
  - PHASE_O_CLAUDE_CODE_PROMPTS.md (working aid; per-session prompts cite §3 + §5 by reference)
  - Every Phase O session S0.1 → S4.6 (the gate session is THIS plan; subsequent sessions read §5 + their own brief)
  - drift_detector.py + schema_validator.py (cross-checks against the canonical-id registration)
changelog:
  - v1.0.0 (2026-05-02, PHASE_O_S0_1_OBSERVATORY_GOVERNANCE_BOOTSTRAP): Initial authoring.
    Ten sections per the gate-session execution brief. Registers Phase O Observatory as
    a concurrent workstream alongside the main M-phase thread (currently M5 INCOMING).
    Defines the two-layer telemetry+reconciliation ledger, the 5-table data model, the
    five-provider integration matrix, and the O.0–O.4 sub-phase decomposition with all
    30 sessions matrixed. Wall-clock projection at 4-way and 8-way concurrency.
    Acceptance criteria for Phase O close. Risks + open decisions deferred.
---

# OBSERVATORY_PLAN v1.0
## Phase O — LLM Cost & Usage Observatory

*The governance plan for Phase O Observatory — a parallel workstream that builds super-admin observability over LLM spend across all five providers (Anthropic, OpenAI, Gemini, DeepSeek, NIM). This plan is the gate artifact: every Phase O session except the gate (S0.1) cites §3 (data model), §4 (provider matrix), or §5 (session matrix) by reference and runs in its own git worktree under `feature/phase-o-observatory/<session-id>` per `PHASE_O_CLAUDE_CODE_PROMPTS.md`.*

---

## §1 — Mission and ethical framing

**Mission.** Provide the project's super-admin with probabilistic, calibrated, auditable observability over the cost and usage of every LLM call the platform makes — across all five providers and across every pipeline stage (classify, compose, retrieve, synthesize, audit). This is not a product feature; it is an internal accounting and governance instrument. It exists to (a) make spend legible per-conversation, per-user, per-stage, per-provider, per-model; (b) reconcile telemetry-computed cost against authoritative provider billing; (c) flag drift between computed and authoritative numbers before it accrues; (d) enforce budget thresholds with calibrated alerting; (e) support pricing-version transitions and replay/re-cost analysis without rewriting history.

**Ethical framing.** Phase O is bound by `MACRO_PLAN_v2_0.md §"Ethical Framework"`. Specifically:

- **Probabilistic humility.** Every cost figure carries an explicit accuracy band: telemetry-computed (`±0` for the exact computation but `~±provider_lag_pct` for the underlying pricing-table accuracy) vs authoritative (`±0` for the provider's billed total but lagging by the provider's reconciliation window). Variance between the two is reported, not hidden.
- **Truth-in-advertising.** Per-request inference responses do **not** return cost-to-the-end-user fields fabricated by the platform. Cost is computed locally from a versioned pricing table and attached to telemetry rows; it is not reflected back to the chat surface.
- **No self-harm output without guardrail.** Budget alerts are paged before spend exceeds a stated threshold, never after — to prevent fait-accompli overspend.
- **Consent for non-native subjects.** Telemetry rows store conversation_id and user_id; PII (prompt_text, response_text) is captured under the same disclosure-tier rules as the rest of the platform per `PROJECT_ARCHITECTURE_v2_2.md §"Disclosure tiers"`.
- **Red-team oversight.** Every Phase O sub-phase close (O.1, O.2, O.3, O.4) discharges an IS.8(b)-class red-team per `MACRO_PLAN §IS.8`.
- **Rescindability.** Pricing tables are append-only versioned (`llm_pricing_versions`); replay/re-cost (S4.5) re-computes any historical telemetry against any pricing version, so a mid-month price discovery does not silently mutate prior totals.

**Disclosure tier.** Phase O outputs are tier-1 (super-admin only) by default. The Observatory dashboard ships behind a feature-flag-gated route; non-super-admin users see no Observatory UI surface. Cost figures are never surfaced to the chat surface (Consume tab) or to L4 Discovery outputs.

---

## §2 — Architecture: the two-layer ledger

Phase O operates a two-layer ledger. Neither layer alone is authoritative.

### §2.1 — Telemetry layer (computed cost)

Every LLM call routes through an instrumentation shim (`platform/src/lib/llm/instrumented_client.ts`, scoped by S1.2). The shim wraps the underlying provider SDK and emits one `llm_usage_events` row per call with:

- Identity context: `conversation_id`, `conversation_name`, `prompt_id`, `parent_prompt_id` (for multi-turn lineage), `user_id`, `pipeline_stage` (classify | compose | retrieve | synthesize | audit | other).
- Provider/model: `provider`, `model`, `parameters` (jsonb of all request params).
- Token counts: `input_tokens`, `output_tokens`, `cache_read_tokens`, `cache_write_tokens`, `reasoning_tokens` (Anthropic + o-series).
- **Computed cost**: `computed_cost_usd` is computed locally at insert time from the active row in `llm_pricing_versions` where the call's `started_at` falls between `effective_from` and `effective_to`. The row's `pricing_version_id` is fk'd into the event row so replay (S4.5) can re-cost.
- Prompt/response: `prompt_text`, `response_text`, `system_prompt` (subject to disclosure-tier scrubbing per S1.1 schema migration).
- Outcome: `latency_ms`, `status` (success | error | timeout), `error_code`, `provider_request_id`.
- Diagnostics: `feature_flag_state` (jsonb snapshot at call time), `client_ip_hash`.

Per-request inference responses do **not** include a cost field returned by the provider in the chat path. Cost is purely a telemetry artifact computed by the shim.

### §2.2 — Reconciliation layer (authoritative cost)

Each provider exposes an admin-/billing-API surface that returns the authoritative billed cost for a time window. A nightly job (scoped by S2.1 framework + S2.2/S2.3/S2.4 per-provider reconcilers) pulls these and writes raw rows to `llm_provider_cost_reports`. A reconciliation evaluator joins computed-totals against authoritative-totals per `(reconciliation_date, provider)` (and where the provider exposes per-model granularity, also per model) and writes one `llm_cost_reconciliation` row per join with: `computed_total_usd`, `authoritative_total_usd`, `variance_usd`, `variance_pct`, `event_count`, `status` (matched | variance_within_tolerance | variance_alert | missing_authoritative), `notes`.

Tolerance threshold is configurable per `(provider, model_class)` and stored as a configuration row (out of scope for v1 schema; defaulted to ±2% in code per S2.1 framework). `variance_alert` triggers a banner on the Observatory UI (S2.6) and a log line; it does **not** auto-page (alerting is the budget-rules' job, not reconciliation's).

### §2.3 — Why two layers (and what each is good for)

| Question | Layer that answers it | Lag |
|---|---|---|
| "What is this conversation costing me right now?" | Telemetry (computed) | None — sub-second |
| "Which user / pipeline stage is the most expensive this week?" | Telemetry (computed) | None |
| "Did my cache strategy actually reduce spend?" | Telemetry (computed) | None |
| "What is the platform's authoritative spend for last month?" | Reconciliation (authoritative) | Provider-dependent (Anthropic/OpenAI ~24h; Gemini Cloud Billing ~24h; DeepSeek/NIM manual) |
| "Is my computed model wrong somewhere?" | Variance (computed vs authoritative) | Provider-dependent reconciliation lag |

The platform's chat path always reads telemetry-computed numbers. Procurement / accounting reports read reconciled numbers. Both surfaces cite their layer source explicitly.

---

## §3 — Data model

Five tables, all under the `observatory` schema scope per S1.1 migration. All `_id` columns are `uuid` with `gen_random_uuid()` defaults. Timestamps are `timestamptz`. Numeric columns use `numeric(12, 6)` for cost (six decimal places of USD precision).

### §3.1 — `llm_usage_events`

Per-call telemetry. The largest table; indexed for time-series + group-by.

| Column | Type | Notes |
|---|---|---|
| `event_id` | `uuid` PK | |
| `conversation_id` | `uuid` | Joins to existing chat conversations table; nullable for non-conversational calls (e.g., reconciliation jobs themselves). |
| `conversation_name` | `text` | Denormalized at insert for readability. |
| `prompt_id` | `uuid` | Per-prompt unique id (one user message = one prompt; may map to multiple events if the pipeline fans out). |
| `parent_prompt_id` | `uuid` | nullable; self-fk for multi-turn lineage. |
| `user_id` | `uuid` | |
| `provider` | `enum('anthropic','openai','gemini','deepseek','nim')` | |
| `model` | `text` | Free-text so a new model can be telemetered without schema change. |
| `pipeline_stage` | `enum('classify','compose','retrieve','synthesize','audit','other')` | |
| `prompt_text` | `text` | Subject to disclosure-tier scrubbing (S1.1 decides hash-and-store vs full-text behind feature flag). |
| `response_text` | `text` | Same disclosure-tier rule. |
| `system_prompt` | `text` | |
| `parameters` | `jsonb` | Full request parameter snapshot. |
| `input_tokens` | `int` | |
| `output_tokens` | `int` | |
| `cache_read_tokens` | `int` | Provider-specific; 0 where the provider doesn't expose. |
| `cache_write_tokens` | `int` | |
| `reasoning_tokens` | `int` | OpenAI o-series + Anthropic extended-thinking; 0 elsewhere. |
| `computed_cost_usd` | `numeric(12,6)` | Computed at insert time from the active pricing version. |
| `pricing_version_id` | `uuid` fk → `llm_pricing_versions` | Frozen at insert; replay uses this to re-cost against any historical or alternative version. |
| `latency_ms` | `int` | End-to-end shim-observed latency. |
| `status` | `enum('success','error','timeout')` | |
| `error_code` | `text` | Provider's error code where applicable; nullable. |
| `provider_request_id` | `text` | The provider's own request_id; useful for cross-checking against admin-API line items. |
| `started_at` | `timestamptz` | |
| `finished_at` | `timestamptz` | |
| `feature_flag_state` | `jsonb` | Snapshot at call time. |
| `client_ip_hash` | `text` | Hashed at the edge; never stored raw. |
| `created_at` | `timestamptz` | Default `now()`. |

**Indices:** `(started_at)` (primary time-series); `(provider, model, started_at)` (per-provider rollups); `(conversation_id, started_at)` (per-conversation arc); `(user_id, started_at)` (per-user); `(pipeline_stage, started_at)` (per-stage cost-per-quality).

### §3.2 — `llm_pricing_versions`

Append-only versioned price book. One row per `(provider, model, token_class, effective_from)` triple.

| Column | Type | Notes |
|---|---|---|
| `pricing_version_id` | `uuid` PK | |
| `provider` | `enum(...)` | Same enum as §3.1. |
| `model` | `text` | |
| `token_class` | `enum('input','output','cache_read','cache_write','reasoning')` | |
| `price_per_million_usd` | `numeric(14,6)` | Six-decimal USD per million tokens. |
| `effective_from` | `timestamptz` | |
| `effective_to` | `timestamptz` | nullable; null = currently active. |
| `source_url` | `text` | Citation to the published pricing page where this row was sourced. |
| `recorded_at` | `timestamptz` | When the row was inserted. |

**Indices:** `(provider, model, token_class, effective_from desc)` (lookup at telemetry insert time).

**Cardinality at v1 seed (S1.1):** ~50–80 rows for the published rates as of 2026-05-02 across the five providers + standard token classes.

### §3.3 — `llm_provider_cost_reports`

Raw daily pulls from each provider's admin/billing API. One row per `(provider, time_bucket_start, time_bucket_end)` (or per-`(provider, model, bucket)` where the provider exposes per-model granularity).

| Column | Type | Notes |
|---|---|---|
| `report_id` | `uuid` PK | |
| `provider` | `enum(...)` | |
| `model` | `text` nullable | Where the provider exposes only provider-level totals, this is null. |
| `time_bucket_start` | `timestamptz` | |
| `time_bucket_end` | `timestamptz` | |
| `workspace_id` | `text` nullable | Provider workspace/org-id where applicable. |
| `authoritative_cost_usd` | `numeric(14,6)` | |
| `authoritative_input_tokens` | `bigint` | nullable where the provider doesn't expose. |
| `authoritative_output_tokens` | `bigint` | |
| `raw_payload` | `jsonb` | Full JSON response from the provider for forensic replay. |
| `pulled_at` | `timestamptz` | |

**Indices:** `(provider, time_bucket_start)` (the join key for reconciliation).

### §3.4 — `llm_cost_reconciliation`

Per-day per-provider variance ledger.

| Column | Type | Notes |
|---|---|---|
| `reconciliation_id` | `uuid` PK | |
| `reconciliation_date` | `date` | Day-aligned; reconciliation jobs run nightly per provider. |
| `provider` | `enum(...)` | |
| `model` | `text` nullable | |
| `computed_total_usd` | `numeric(14,6)` | Sum of `llm_usage_events.computed_cost_usd` for the matching window/provider/model. |
| `authoritative_total_usd` | `numeric(14,6)` | Sum of `llm_provider_cost_reports.authoritative_cost_usd` for the same window. |
| `variance_usd` | `numeric(14,6)` | |
| `variance_pct` | `numeric(8,4)` | |
| `event_count` | `int` | Count of telemetry events that contributed to `computed_total_usd`. |
| `status` | `enum('matched','variance_within_tolerance','variance_alert','missing_authoritative')` | |
| `notes` | `text` | Free-form. |
| `reconciled_at` | `timestamptz` | |

**Indices:** `(reconciliation_date, provider)`.

### §3.5 — `llm_budget_rules`

Budget thresholds + alert configuration.

| Column | Type | Notes |
|---|---|---|
| `budget_rule_id` | `uuid` PK | |
| `name` | `text` | Human-readable. |
| `scope` | `enum('total','provider','model','pipeline_stage','user')` | |
| `scope_value` | `text` nullable | The provider/model/stage/user-id this rule applies to; null when `scope='total'`. |
| `period` | `enum('daily','weekly','monthly')` | |
| `amount_usd` | `numeric(14,2)` | |
| `alert_thresholds` | `jsonb` | Array of `{pct, channel}`. Example: `[{"pct":50,"channel":"email"},{"pct":80,"channel":"slack"},{"pct":100,"channel":"page"}]`. |
| `created_by_user_id` | `uuid` | |
| `active` | `boolean` | |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**Indices:** `(active, scope)` (for the alert evaluator's working set).

### §3.6 — Key relationships

```
llm_pricing_versions (versioned price book)
    ↑ pricing_version_id
llm_usage_events (per-call telemetry; computed_cost_usd computed at insert from active price row)
    ↓ (join by (provider, model, time_bucket))
llm_provider_cost_reports (raw admin-API pulls)
    ↓ (joined into)
llm_cost_reconciliation (variance ledger; nightly per-provider)

llm_budget_rules → alert evaluator → reads llm_usage_events sums per scope/period
```

The replay/re-cost engine (S4.5) re-computes `computed_cost_usd` for any historical event range against any pricing version (alternative or counterfactual) without mutating the original event rows.

---

## §4 — Provider integration matrix

Five providers, each with a per-request capture mechanism and an authoritative reconciliation source. Per-provider gotchas are listed inline; sessions S1.4–S1.8 (one per provider for telemetry capture) and S2.2–S2.5 (one per provider for reconciliation) consume this matrix.

### §4.1 — Anthropic

- **Per-request capture.** Anthropic SDK responses include `usage` with `input_tokens`, `output_tokens`, `cache_read_input_tokens`, `cache_creation_input_tokens`. Streaming responses emit a final `message_delta` with the `usage` block. The shim normalizes both paths.
- **Authoritative source.** Anthropic Admin API → Usage and Cost endpoints (per workspace). Daily granularity, per-model breakout. Lag ~24h.
- **Gotchas.** Cache token semantics: `cache_creation_input_tokens` is billed at 1.25× input price; `cache_read_input_tokens` is billed at 0.1× input price. Pricing version must encode three rows per cached model (`input`, `cache_read`, `cache_write`). Extended-thinking models emit `thinking` deltas that count toward `output_tokens` (no separate reasoning_tokens field — record under `output_tokens` and infer reasoning portion from response shape if needed).
- **Sessions.** S1.4 (capture), S2.2 (reconciler).

### §4.2 — OpenAI

- **Per-request capture.** Chat Completions API responses include `usage` with `prompt_tokens`, `completion_tokens`, `total_tokens`. As of GPT-5 family + o-series, also `prompt_tokens_details.cached_tokens` and `completion_tokens_details.reasoning_tokens`. Streaming: final usage included when `stream_options.include_usage: true` is set; the shim must set this on every streaming call.
- **Authoritative source.** OpenAI Admin API → `/v1/organization/usage/completions` (per-day per-model). Lag ~24h.
- **Gotchas.** `cached_tokens` is billed at 0.5× input price (OpenAI as of 2026-05-02; verify at S1.5 against the published rate). `reasoning_tokens` (o-series) is billed as output tokens. Some legacy endpoints (assistants v1, embeddings) emit usage in different shapes; the shim must normalize per-endpoint.
- **Sessions.** S1.5 (capture), S2.3 (reconciler).

### §4.3 — Gemini

- **Per-request capture.** Gemini API responses include `usageMetadata` with `promptTokenCount`, `candidatesTokenCount`, `cachedContentTokenCount`, `totalTokenCount`. As of 2.5 series, also `thoughtsTokenCount` (for thinking models). Streaming: `usageMetadata` emitted on the final chunk.
- **Authoritative source.** Google Cloud Billing → BigQuery export → `gcp_billing_export_v1_*` table, filtered to `service.description = "Vertex AI"` (or the appropriate SKU description for direct Gemini API). Per-day per-SKU. Lag ~24h.
- **Gotchas.** Cloud Billing exports SKUs not models — the reconciler must map SKU → model via a configuration table (out of scope for v1; hardcoded SKU map at S2.4). `cachedContentTokenCount` is billed at 0.25× input price for Gemini 2.5 Pro (verify at S1.6). Free-tier requests don't emit billing rows, but they do emit telemetry — the reconciler treats them as `computed_cost_usd: 0` rows that don't need to match.
- **Sessions.** S1.6 (capture), S2.4 (reconciler).

### §4.4 — DeepSeek

- **Per-request capture.** DeepSeek API responses include `usage` with `prompt_tokens`, `completion_tokens`, `total_tokens`. R1 reasoning model adds `prompt_cache_hit_tokens` and `prompt_cache_miss_tokens`. The shim treats the cache-hit count as `cache_read_tokens` for schema parity.
- **Authoritative source.** **No admin API exposed for DeepSeek as of 2026-05-02.** Reconciliation is **manual**: a super-admin uploads the monthly invoice CSV through a UI form (S2.5) which writes the equivalent `llm_provider_cost_reports` rows.
- **Gotchas.** Cache-hit pricing is significantly lower than cache-miss (≈10× cheaper for V3 chat). R1's reasoning output is included in `completion_tokens` (no separate field). The manual-reconciliation UI must accept either daily or monthly rollups; daily is preferred where the invoice provides it.
- **Sessions.** S1.7 (capture), S2.5 (manual reconciliation UI shared with NIM).

### §4.5 — NIM (Nvidia Inference Microservices)

- **Per-request capture.** NIM endpoints return OpenAI-compatible `usage` blocks. The shim treats NIM as an OpenAI-shaped capture path with `provider='nim'` and the model name (e.g., `meta/llama-3.1-405b-instruct`) recorded verbatim.
- **Authoritative source.** **No standard admin API.** Where NIM is hosted on Nvidia's managed catalog (build.nvidia.com), an Nvidia account dashboard exposes per-day usage; this is **manual reconciliation** like DeepSeek. Where NIM is self-hosted on the project's GPU infrastructure, "cost" is GPU-hour-derived and out of scope for v1 (would require a separate GPU-utilization probe).
- **Gotchas.** Self-hosted vs managed-catalog distinction must be encoded per `model` row in pricing versions (different `source_url` and different cost-derivation mechanism). For v1, only managed-catalog NIM is in scope; self-hosted is documented as a v2 deferral.
- **Sessions.** S1.8 (capture), S2.5 (manual reconciliation UI shared with DeepSeek).

### §4.6 — Streaming usage chunk semantics (cross-cutting)

All five providers emit usage on the **final** stream chunk only (after the response body completes). The shim must:

1. Buffer the stream client-side, then forward chunks to the consumer.
2. After the final chunk, parse the usage block per the provider's shape.
3. Insert the `llm_usage_events` row only after the stream completes successfully (or after error/timeout, recording the partial state).

Streaming-cancelled-mid-response calls (user clicks stop) are recorded with `status: 'success'` if the provider counts the partial response as billable, else `status: 'timeout'`. The shim's per-provider adapter encodes this rule.

---

## §5 — Sub-phase decomposition (O.0–O.4) and the 30-session matrix

Phase O has five sub-phases with 30 sessions total. Every session has a stable session-id (`S<sub>.<n>`), a kebab-id used for git worktree naming (`s<sub>-<n>-<short>`; per `PHASE_O_CLAUDE_CODE_PROMPTS.md`), declared scope, dependencies, and acceptance-criteria summary. All sessions except S0.1 run in their own git worktree on a sub-branch `feature/phase-o-observatory/<kebab-id>`.

### §5.0 — Sub-phase O.0: Governance Bootstrap (1 session)

| ID | Title | may_touch (summary) | must_not_touch (summary) | Deps | Deliverable |
|---|---|---|---|---|---|
| S0.1 | Phase O Plan Artifact | OBSERVATORY_PLAN_v1_0.md, CAPABILITY_MANIFEST.json, manifest_overrides.yaml, CURRENT_STATE_v1_0.md, .geminirules, .gemini/project_state.md, SESSION_LOG.md | All other 00_ARCHITECTURE/**, 01_FACTS_LAYER/**, 025_HOLISTIC_SYNTHESIS/**, platform/**, 06_LEARNING_LAYER/** | None | This artifact + registry registration + mirror propagation |

**Branch:** `feature/phase-o-observatory` (umbrella, no sub-branch — gate session runs in main worktree).

### §5.1 — Sub-phase O.1: Telemetry + Overview Dashboard (the MVP) (13 sessions)

| ID | Title | may_touch | must_not_touch | Deps | Deliverable |
|---|---|---|---|---|---|
| S1.1 | Schema migrations | platform/db/migrations/*observatory*, platform/src/lib/db/schema/observatory.ts, platform/src/lib/db/seed/observatory_pricing/**, platform/src/lib/db/__tests__/observatory_*.test.ts | All other platform/**, all 00_ARCHITECTURE/** except SESSION_LOG.md | S0.1 | 5 tables + idempotent seed of pricing v1 + tests |
| S1.2 | LLMClient instrumentation shim | platform/src/lib/llm/instrumented_client.ts, platform/src/lib/llm/types/usage.ts, platform/src/lib/llm/__tests__/instrumented_client.test.ts | platform/src/lib/llm/providers/**, all schema files | S1.1 | Shim with provider-agnostic event emit + types |
| S1.3 | Backend API for dashboard | platform/src/app/api/observatory/**, platform/src/lib/observatory/queries/**, platform/src/lib/observatory/__tests__/** | platform/src/components/**, all UI files | S1.1 | REST endpoints for KPIs, time-series, drill-down |
| S1.4 | Anthropic provider adapter | platform/src/lib/llm/providers/anthropic_adapter.ts, related tests | All other providers | S1.2 | Anthropic capture per §4.1 |
| S1.5 | OpenAI provider adapter | platform/src/lib/llm/providers/openai_adapter.ts, related tests | All other providers | S1.2 | OpenAI capture per §4.2 |
| S1.6 | Gemini provider adapter | platform/src/lib/llm/providers/gemini_adapter.ts, related tests | All other providers | S1.2 | Gemini capture per §4.3 |
| S1.7 | DeepSeek provider adapter | platform/src/lib/llm/providers/deepseek_adapter.ts, related tests | All other providers | S1.2 | DeepSeek capture per §4.4 |
| S1.8 | NIM provider adapter | platform/src/lib/llm/providers/nim_adapter.ts, related tests | All other providers | S1.2 | NIM capture per §4.5 |
| S1.9 | Frontend scaffold | platform/src/app/(observatory)/**, platform/src/components/observatory/Layout.tsx, platform/src/components/observatory/Shell.tsx, related tests | KPI tiles, charts, drill-down (S1.10–S1.12) | S1.3 | Route + shell + nav (no data widgets yet) |
| S1.10 | KPI tiles + Filters bar | platform/src/components/observatory/KPITiles.tsx, FiltersBar.tsx, related tests | Charts, drill-down | S1.9 | Top-level KPI tiles + filter chips |
| S1.11 | Charts | platform/src/components/observatory/charts/**, related tests | KPI tiles, drill-down | S1.9 | Time-series + per-provider stacked bars |
| S1.12 | Drill-down event explorer + side panel | platform/src/components/observatory/DrillDown.tsx, EventDetail.tsx, related tests | KPI tiles, charts | S1.9 | Per-event explorer + prompt/response side panel |
| S1.13 | Wiring + e2e integration | platform/src/app/(observatory)/page.tsx + integration glue, e2e tests | New components (S1.10–S1.12 own them) | S1.10, S1.11, S1.12 | End-to-end Observatory page wired to backend with passing e2e tests |

**O.1 close criteria.** All 13 sessions closed; e2e test green; manual smoke validates per-provider capture in dev. IS.8(b)-class red-team conducted in-document at the O.1 close session (or as a separate close session if scope demands).

### §5.2 — Sub-phase O.2: Reconciliation (6 sessions)

| ID | Title | may_touch | must_not_touch | Deps | Deliverable |
|---|---|---|---|---|---|
| S2.1 | Reconciliation framework | platform/src/lib/observatory/reconciliation/framework.ts, scheduler glue, related tests | Per-provider reconcilers | O.1 closed | Generic reconciliation engine + scheduler scaffolding |
| S2.2 | Anthropic reconciler | platform/src/lib/observatory/reconciliation/anthropic.ts, tests | All other reconcilers | S2.1 | Anthropic Admin API pull + reconciliation rows |
| S2.3 | OpenAI reconciler | platform/src/lib/observatory/reconciliation/openai.ts, tests | All other reconcilers | S2.1 | OpenAI Admin API pull + reconciliation rows |
| S2.4 | Gemini Cloud Billing reconciler | platform/src/lib/observatory/reconciliation/gemini.ts (BigQuery client), tests | All other reconcilers | S2.1 | BigQuery export read + SKU→model map + reconciliation rows |
| S2.5 | DeepSeek + NIM manual-reconciliation UI | platform/src/components/observatory/ManualReconciliation.tsx + backend endpoints, tests | All other reconcilers | S2.1 | CSV upload form + ingest endpoint |
| S2.6 | Reconciliation banner UI | platform/src/components/observatory/ReconciliationBanner.tsx, tests | All other reconcilers | S2.1, S2.2, S2.3, S2.4 (any one of the auto reconcilers writes a `variance_alert` row to drive banner) | Banner surfacing variance alerts on the Observatory page |

**O.2 close criteria.** All six sessions closed; first nightly reconciliation run completes successfully across the three auto-reconciled providers in dev. IS.8(b)-class red-team.

### §5.3 — Sub-phase O.3: Budgets + Export (4 sessions)

| ID | Title | may_touch | must_not_touch | Deps | Deliverable |
|---|---|---|---|---|---|
| S3.1 | Budget rules schema + API | platform/db/migrations/*budget_rules* (extending S1.1's table), platform/src/app/api/observatory/budgets/**, platform/src/lib/observatory/budgets/queries.ts, tests | Alert evaluator, UI | O.1 closed | CRUD endpoints + types for budget rules |
| S3.2 | Alert evaluator | platform/src/lib/observatory/budgets/evaluator.ts, scheduler glue, tests | UI, schema | S3.1 | Periodic evaluator that compares spend vs rules and emits alerts |
| S3.3 | Budgets UI | platform/src/components/observatory/budgets/**, tests | Alert evaluator, schema | S3.1 | UI for creating/editing/viewing budget rules + alert state |
| S3.4 | Export endpoints + UI | platform/src/app/api/observatory/export/**, platform/src/components/observatory/Export.tsx, tests | All other O.3 surfaces | O.1 closed | CSV/Parquet export of usage events with filters; super-admin only |

**O.3 close criteria.** All four sessions closed; first budget rule fires in dev when synthetic spend crosses threshold. IS.8(b)-class red-team.

### §5.4 — Sub-phase O.4: Advanced Analytics (6 sessions)

| ID | Title | may_touch | must_not_touch | Deps | Deliverable |
|---|---|---|---|---|---|
| S4.1 | Cache effectiveness | platform/src/lib/observatory/analytics/cache_effectiveness.ts + UI module, tests | All other analytics | O.1 closed | Per-provider cache-hit-ratio + cost-saved-by-cache metric |
| S4.2 | Cost per quality | platform/src/lib/observatory/analytics/cost_per_quality.ts + UI, tests | All other analytics | O.1 closed; quality-score capture spec from native (see §10) | Cost-per-quality-point analytics for stages with a quality probe |
| S4.3 | Conversation cost arc | platform/src/lib/observatory/analytics/cost_arc.ts + UI, tests | All other analytics | O.1 closed | Per-conversation cumulative cost over turns |
| S4.4 | Pricing diff alerter | platform/src/lib/observatory/analytics/pricing_diff.ts + alert glue, tests | All other analytics | O.1 closed | Detects significant deviation between modeled vs published pricing per provider; pages |
| S4.5 | Replay & re-cost engine | platform/src/lib/observatory/analytics/replay.ts + endpoint + UI, tests | All other analytics | O.1 closed | Re-cost any historical range against any pricing version (counterfactual analysis) |
| S4.6 | Anomaly detection | platform/src/lib/observatory/analytics/anomaly.ts + alert glue, tests | All other analytics | O.1 closed | Z-score-based anomaly flagging on per-provider, per-stage, per-user series |

**O.4 close criteria.** All six sessions closed. IS.8(b)-class red-team. Phase O macro-phase close.

### §5.5 — Branch model

- Umbrella branch: `feature/phase-o-observatory` (cut from main at the start of O.0, by S0.1).
- Sub-branches: `feature/phase-o-observatory/<kebab-id>` per non-gate session, where kebab-id matches the per-session table in `PHASE_O_CLAUDE_CODE_PROMPTS.md`.
- Merge cadence: each session merges its sub-branch back to umbrella with `git merge --no-ff` after SESSION_CLOSE validates and acceptance criteria pass; sub-branch deletes locally and remotely.
- Phase O macro-phase close (after S4.6): umbrella merges to `main` only after Phase O acceptance criteria (§8) all green.

---

## §6 — Parallelization discipline

The 30-session matrix supports concurrent execution because every session's `may_touch` is disjoint from concurrently-running sessions' `may_touch`. Three discipline rules govern parallelization:

### §6.1 — File-tree partitioning

**Rule.** Two sessions running concurrently must have disjoint `may_touch` globs. Any overlap (even one shared file) forces sequential execution.

**Application to Phase O:**

- Provider adapters S1.4–S1.8 all touch sibling files under `platform/src/lib/llm/providers/`. Each session's `may_touch` is exactly its one provider's adapter file plus its tests; no overlap. **All five can run in parallel after S1.2 closes.**
- UI components S1.10–S1.12 each own their own component file under `platform/src/components/observatory/`. No overlap; **all three can run in parallel after S1.9 closes.**
- Reconciler sessions S2.2–S2.5 are siblings under `platform/src/lib/observatory/reconciliation/`. **All four can run in parallel after S2.1 closes.**
- Analytics sessions S4.1–S4.6 are siblings under `platform/src/lib/observatory/analytics/`. **All six can run in parallel after O.1 closes.**

### §6.2 — Registry-update funneling

**Rule.** Only specific sessions touch `00_ARCHITECTURE/CAPABILITY_MANIFEST.json`. Concurrent sessions that all want to register an entry serialize through a single funnel session per sub-phase.

**Application to Phase O:**

- **S0.1** registers `OBSERVATORY_PLAN`.
- **S2.1** registers the reconciliation framework's canonical entries (if any).
- **S3.1** registers the budget-rules schema/API entry (if any).
- **S4.x** sessions: each session's analytics module is tagged with `phase: "phase-o-s4"` in its manifest entry; the **last-closing S4 session** (typically S4.6 or whichever closes last in wall-clock time) batches all S4 manifest registrations. Sessions earlier in the wave declare manifest must_not_touch.

This convention prevents the JSON-merge race observed in M4-D-P1/M4-D-S1 (manifest "current+1" rule) by simply not letting more than one S4 session touch the manifest at a time.

### §6.3 — Mirror-update funneling

**Rule.** Only governance-shaped sessions trigger MP.1/MP.2 mirror updates. Implementation sessions declare `.geminirules` and `.gemini/project_state.md` in `must_not_touch`.

**Application to Phase O:**

- **S0.1** propagates the Phase O block to MP.1 (`.geminirules §E`) and MP.2 (`.gemini/project_state.md`). New mirror pair MP.9 declared at this session (if needed; see §10 for open decision).
- O.1, O.2, O.3, O.4 sub-phase close sessions (whichever sessions take that close role per the kebab table) are the only further sessions allowed to touch the Gemini surfaces — they update the Phase O status (active → O.1-closed → O.2-closed → … → closed).
- Every other session must_not_touch `.geminirules` and `.gemini/project_state.md`.

---

## §7 — Wall-clock projection

Wall-clock estimates assume Claude Code in worktree mode, ~1–2 hours per session for typical implementation sessions, ~3–4 hours for schema/framework sessions, and ~2–3 hours for sub-phase close sessions (red-team in-document discharge).

### §7.1 — Wave-by-wave breakdown

| Wave | Sessions | Concurrency | Critical path | Wall-clock (sequential) | Wall-clock (4-way) | Wall-clock (8-way) |
|---|---|---|---|---|---|---|
| Wave 0 | S0.1 | 1 | S0.1 | 3h | 3h | 3h |
| Wave 1 | S1.1 | 1 | S1.1 | 4h | 4h | 4h |
| Wave 2 | S1.2, S1.3 | 2 | max(S1.2, S1.3) | 6h | 3h | 3h |
| Wave 3 | S1.4–S1.8 (5 providers) | 5 | max(adapter) | 12.5h | 5h (5/4 rounds × 2.5h) | 2.5h |
| Wave 4 | S1.9 | 1 | S1.9 | 2.5h | 2.5h | 2.5h |
| Wave 5 | S1.10, S1.11, S1.12 | 3 | max | 7.5h | 2.5h | 2.5h |
| Wave 6 | S1.13 (wiring + close) | 1 | S1.13 | 3h | 3h | 3h |
| **O.1 subtotal** | | | | **38.5h** | **23h** | **20h** |
| Wave 7 | S2.1 | 1 | S2.1 | 3.5h | 3.5h | 3.5h |
| Wave 8 | S2.2, S2.3, S2.4, S2.5 | 4 | max | 10h | 2.5h | 2.5h |
| Wave 9 | S2.6 + O.2 close | 1 | S2.6 | 3h | 3h | 3h |
| **O.2 subtotal** | | | | **16.5h** | **9h** | **9h** |
| Wave 10 | S3.1 | 1 | S3.1 | 2.5h | 2.5h | 2.5h |
| Wave 11 | S3.2, S3.3, S3.4 | 3 | max | 7.5h | 2.5h | 2.5h |
| Wave 12 | O.3 close | 1 | RT | 1h | 1h | 1h |
| **O.3 subtotal** | | | | **11h** | **6h** | **6h** |
| Wave 13 | S4.1–S4.6 (6 analytics) | 6 | max | 15h | 4h (6/4 rounds × ~2.5h) | 2.5h |
| Wave 14 | O.4 close (Phase O macro-close) | 1 | RT | 2h | 2h | 2h |
| **O.4 subtotal** | | | | **17h** | **6h** | **4.5h** |
| **Phase O total** | **30** | | | **83h** | **44h** | **39.5h** |

### §7.2 — Calendar projection (assumes 6h/day pace)

- Sequential: ~14 working days.
- 4-way concurrent: ~7–8 working days.
- 8-way concurrent: ~7 working days (hits a floor at the sub-phase-gate sessions which can't be parallelized).

The 8-way ceiling is approached by Wave 8 (4 reconcilers) and Wave 13 (6 analytics); diminishing returns past 4-way for most other waves.

---

## §8 — Phase O close acceptance criteria

Phase O macro-phase close fires after S4.6 closes. The close session (whichever session takes that role; provisionally the same as S4.6 but can be a separate close-class session) verifies:

1. **All 30 sessions closed.** Each session has its own SESSION_LOG entry with `session_close.close_criteria_met: true`. SESSION_LOG continuity verified end-to-end.
2. **Schema migrations stable in production.** `llm_usage_events`, `llm_pricing_versions`, `llm_provider_cost_reports`, `llm_cost_reconciliation`, `llm_budget_rules` all created in prod; row-counts non-zero for the first three; e2e test green.
3. **Per-request capture coverage.** Every LLM call from the chat path emits an `llm_usage_events` row. Verified by sampling: pick 10 random recent conversations, walk every LLM call, confirm a matching telemetry row.
4. **Reconciliation closing.** At least seven consecutive nightly reconciliation runs complete successfully across the three auto-reconciled providers (Anthropic, OpenAI, Gemini); average variance per provider ≤2%.
5. **Manual reconciliation operational.** DeepSeek + NIM manual upload UI accepts a sample monthly invoice CSV in dev and writes the expected `llm_provider_cost_reports` rows.
6. **Budget alerting verified.** A synthetic budget rule with a low threshold fires the configured alert(s) end-to-end.
7. **Export operational.** CSV export of a 7-day window completes for super-admin user; non-super-admin user gets 403.
8. **Analytics pages render.** Cache effectiveness, cost-per-quality (where quality probe is wired), conversation cost arc, pricing diff, replay, and anomaly all render with data.
9. **IS.8(b) red-team passed.** Per-sub-phase red-teams all `PASS` or `PASS_WITH_FINDINGS` (no `FAIL`); macro-phase-close red-team also passes.
10. **Mirror surfaces closed.** Phase O status flipped to `closed` in `.geminirules §E` and `.gemini/project_state.md`. CAPABILITY_MANIFEST updated with the macro-phase-close marker.
11. **CURRENT_STATE updated.** §2 concurrent_workstreams block flips `gate_status: closed` → `phase_status: closed`; macro-phase-close note appended.
12. **All commits on `feature/phase-o-observatory` umbrella.** Sub-branches all merged + deleted.

The umbrella merges to `main` only after all 12 criteria are green.

---

## §9 — Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Concurrent-write hazards on CAPABILITY_MANIFEST.json** in O.1 wave (5 providers want to register) | Medium | Medium (manifest corruption) | §6.2 registry-update funneling: only S2.1, S3.1, and S4-last-closer touch manifest. Provider-adapter sessions declare manifest must_not_touch. |
| **Schema drift between dev and prod** during long-running Phase O | Medium | High (telemetry inserts fail) | S1.1 migrations carry up + down; CI runs migration smoke against ephemeral DB. O.1-close session verifies prod migration state matches schema file. |
| **Pricing-version mid-month transitions** silently mis-cost old events | Low | Medium (variance alarm noise) | `llm_usage_events.pricing_version_id` frozen at insert time; replay (S4.5) re-costs counterfactually without mutating original rows. Pricing changes require a new `llm_pricing_versions` row with `effective_from` set; old row's `effective_to` set to the same timestamp. |
| **Reconciliation lag misinterpretation** — UI banner shows "variance" when authoritative side is just delayed | Medium | Low (UX) | Reconciliation rows carry `status: 'missing_authoritative'` distinct from `'variance_alert'`; UI banner distinguishes the two. |
| **DeepSeek/NIM manual-reconciliation neglect** — no auto-reminder if super-admin doesn't upload | Medium | Medium (compliance gap) | S2.5 includes a "manual reconciliation due" tile on the Observatory page that ages and badges per-provider. O.2 close verifies the tile renders. |
| **Provider SDK breaking changes** mid-phase | Low | Medium (capture breakage) | Per-provider adapter tests run on every CI; adapter is the only code path that knows the SDK shape. Schema is provider-agnostic. |
| **PII leakage in `prompt_text`/`response_text`** | Medium | High (compliance) | S1.1 schema spec must include a feature flag `OBSERVATORY_HASH_PROMPTS` (default true; raw-text capture only when explicitly disabled). Disclosure-tier rules from `PROJECT_ARCHITECTURE_v2_2.md` apply. |
| **Quality-score capture for §S4.2 cost-per-quality** depends on a probe spec the platform doesn't yet have | High | Low (S4.2 only) | §10 Open decision; S4.2 may ship as a stub that surfaces "quality probe not yet wired" until native authors the spec. |
| **GPU-utilization-derived NIM cost (self-hosted)** out of scope for v1 | Already excluded | Low | §4.5 documents this as a v2 deferral; managed-catalog NIM only in v1. |
| **BigQuery billing-export integration cost** for Gemini reconciler | Low | Low (cents/month) | S2.4 documents the BigQuery scan cost; query is a date-bounded scan (~MB-scale per day). |

---

## §10 — Open decisions deferred to native

These decisions are explicitly marked open at S0.1 close. The relevant downstream session must halt-and-ask the native if it reaches one of these without a decision in hand.

1. **Storage layer choice.** Telemetry rows accumulate fast (one per call, conservatively ~10–100K/day). PostgreSQL is the default platform store, but high-volume telemetry might justify a columnar store (e.g., ClickHouse or BigQuery) for the events table specifically. **Decision needed by S1.1.** Default if unspecified: PostgreSQL with monthly partition on `started_at`.

2. **Retention policy.** How long are telemetry rows kept at full fidelity? Forever vs 13 months vs aggregate-after-90-days? **Decision needed by S1.1.** Default: keep all rows indefinitely; revisit at O.1 close if storage growth is concerning.

3. **Multi-tenant scope.** Does Observatory ever surface another tenant's data? (Currently the platform is single-tenant — Abhisek's chart only — but the architecture allows future multi-tenancy.) **Decision needed by S1.3.** Default: super-admin sees all data, full stop, with workspace-scoped filters added when multi-tenancy ships.

4. **Audit-stage quality-score capture for §S4.2.** Cost-per-quality requires a numeric quality score per audit-stage call. The platform's audit stage produces qualitative verdicts; converting to a numeric score requires a probe spec. **Decision needed by S4.2.** Default behavior if unspecified: S4.2 ships as a stub that displays "quality probe not wired"; the analytics is delivered when the spec lands.

5. **Disclosure tier for prompt/response text in `llm_usage_events`.** Default on Phase O launch: hash-and-store under feature flag `OBSERVATORY_HASH_PROMPTS=true`. Raw-text capture requires an explicit flag flip and is out of default scope. **Decision needed by S1.1.** Default: hash; never raw without explicit super-admin override.

6. **Whether to declare a new mirror pair MP.9** (OBSERVATORY_PLAN ↔ Gemini-side observability summary). **Decision needed at S0.1 close** (i.e., this session). Default: declare MP.9 with `adapted_parity_summary` mode; semantic parity, not byte-identity. Resolution at this S0.1 close: **MP.9 declared** in `manifest_overrides.yaml` with claude_side `00_ARCHITECTURE/OBSERVATORY_PLAN_v1_0.md`, gemini_side `.geminirules §E + .gemini/project_state.md` Phase O block.

7. **Whether self-hosted NIM should be added to v2 scope.** As of 2026-05-02, the project's NIM use is managed-catalog only. Adding self-hosted NIM (cost-derived from GPU utilization) is a substantial v2 effort. **Decision deferred to post-Phase-O-close native review.**

---

*End of OBSERVATORY_PLAN_v1_0.md.*
