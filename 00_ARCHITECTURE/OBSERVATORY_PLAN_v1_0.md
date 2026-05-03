---
artifact: OBSERVATORY_PLAN_v1_0.md
canonical_id: OBSERVATORY_PLAN_v1_0
version: 1.5.0
status: CURRENT
authored_session: PHASE_O_S0_1_OBSERVATORY_GOVERNANCE_BOOTSTRAP
authored_date: 2026-05-02
last_amended_session: USTAD_S3_4_EXPORT_O3_CLOSE
last_amended_date: 2026-05-03
authoritative_side: claude
phase_status:
  O.0: CLOSED       # 2026-05-02 (S0.1)
  O.1: CLOSED       # 2026-05-03 (S1.13 — MVP wired, all 12 ACs green)
  O.2: CLOSED       # 2026-05-03 (S2.6 — reconciliation UI + RT.5 fix; 13 ACs green)
  O.3: CLOSED       # 2026-05-03 (S3.4 — usage export + ND.S3.2.1 fix + /run wired; all 16 ACs green)
  O.4: IN_PROGRESS  # 2026-05-03 (unblocked; S4.1 is the first session)
mirror_obligations: >
  Adapted-parity summary mirror at .geminirules §E (Concurrent workstreams) and
  .gemini/project_state.md (Concurrent Workstream — Phase O Observatory section).
  Semantic parity, not byte-identity. New mirror pair MP.9 declared in
  manifest_overrides.yaml at S0.1 close. S1.13 (this amendment) is an
  implementation-class session under MP.9 funneling — Gemini-side mirror is
  refreshed at the next governance-class session, not at this close.
consumers:
  - 00_ARCHITECTURE/CAPABILITY_MANIFEST.json (registers OBSERVATORY_PLAN as L_GOVERNANCE entry)
  - 00_ARCHITECTURE/CURRENT_STATE_v1_0.md §2 (concurrent_workstreams block cites this artifact)
  - PHASE_O_CLAUDE_CODE_PROMPTS.md (working aid; per-session prompts cite §3 + §5 by reference)
  - Every Phase O session S0.1 → S4.6 (the gate session is THIS plan; subsequent sessions read §5 + their own brief)
  - drift_detector.py + schema_validator.py (cross-checks against the canonical-id registration)
changelog:
  - v1.5.0 (2026-05-03, USTAD_S3_4_EXPORT_O3_CLOSE): O.3 GATE CLOSE.
    All four S3.x sessions S3.1–S3.4 carry `close_criteria_met: true`. This
    session lands (a) the usage-export surface — backend
    (`platform/src/lib/observatory/export/{types,query,format}.ts`), GET
    endpoint (`platform/src/app/api/admin/observatory/export/route.ts`,
    flag+super-admin gated, 90-day window cap, 50 000-row server-side cap,
    CSV `Content-Disposition: attachment` + JSON `export_meta` wrapper,
    `X-Export-Row-Count` hint past 5 000), API-client extension
    (`buildExportUrl()`), and the events-page collapsible `<ExportPanel />`
    UI (`platform/src/lib/components/observatory/export/ExportPanel.tsx`);
    (b) **resolves ND.S3.2.1** — `coerceThresholds()` in
    `platform/src/lib/observatory/budget/evaluate.ts` now preserves
    `channel_target` round-trip from JSONB, with two new tests verifying
    presence-preservation + null/undefined/empty omission (`Object.keys`
    excludes `channel_target`); (c) **closes S3.3 AC.6** — the budgets
    page `RunEvaluationButton` now POSTs
    `/api/admin/observatory/budget-rules/evaluate/run` (the dispatching
    endpoint) instead of GETting the read-only `/evaluate` endpoint; the
    feedback banner shows "Evaluated N rules — N alerts fired", with a
    secondary `text-destructive` line when any dispatch outcome reports
    `success=false`. O.3-close IS.8(b) red-team discharged in-document
    (six axes; RT.O3.1 PASS, RT.O3.2 MED, RT.O3.3 MED, RT.O3.4 PASS,
    RT.O3.5 PASS, RT.O3.6 ACK — see §12 below). 12 brief-required new
    tests added (2 ND.S3.2.1 round-trip, 1 wire-fix POST, 6 export
    backend, 3 export UI). Per-suite count for the changed surfaces:
    `__tests__/budget` + `__tests__/export` = 5 files / 45 tests, all
    pass. **Pre-existing failures inherited from e7f1e8f tip** in
    `src/lib/llm/providers/__tests__/{anthropic,openai}_observed.test.ts`
    (2 tests asserting raw `prompt_text` after the S2.6 RT.5 hash-by-default
    flip) are NOT regressions and NOT touched by this session — they were
    already failing at the parent merge tip and remain unchanged here;
    logged as a residual for an O.4 cleanup session. **CAPABILITY_MANIFEST
    deferred gap.** Per the §6.2 governance constraint, S3.4 does not touch
    `00_ARCHITECTURE/CAPABILITY_MANIFEST.json`; the export endpoint entry
    is recorded in §12 below as exact instructions for the last-closing S4
    session to register. Sub-phase O.4 (Advanced Analytics) is now
    unblocked; S4.1 (Cache effectiveness) is the next session. Each
    S4.x analytics module's `may_touch` is its sibling under
    `platform/src/lib/observatory/analytics/`, so all six S4 sessions are
    parallel-safe per §6.1 after this merge.
  - v1.4.0 (2026-05-03, USTAD_S3_1_BUDGET_RULES_FRAMEWORK): O.3 OPEN.
    Sub-phase O.3 marked IN_PROGRESS; S3.1 framework session CLOSED.
    Landed the budget-rules framework: types
    (`platform/src/lib/observatory/budget/types.ts` — BudgetScope alias of
    LlmBudgetScope, BudgetPeriod, AlertThreshold, BudgetStatus
    {ok|warning|alert|exceeded}, BudgetRuleInput, BudgetEvaluationResult);
    evaluation engine
    (`platform/src/lib/observatory/budget/evaluate.ts` — computePeriodBounds
    daily/weekly-ISO/monthly UTC, computeScopeSpend over total | provider |
    model | pipeline_stage, classifyBudgetStatus, evaluateBudgetRule
    never-throws contract, evaluateAllRules sorted DESC by pct_used);
    persistence + validation
    (`platform/src/lib/observatory/budget/persist.ts`); six API endpoints
    (`/api/admin/observatory/budget-rules` GET list + POST create,
    `/api/admin/observatory/budget-rules/{id}` GET/PATCH/DELETE,
    `/api/admin/observatory/budget-rules/evaluate` GET) all gated by the
    shared observatory guard; DELETE is soft (active=false, never DROPs).
    API client (`platform/src/lib/api-clients/observatory.ts`) extended
    with fetchBudgetRules / createBudgetRule / evaluateBudgets.
    openapi.yaml extended with all six paths + four schemas. **Resolves the
    two MED findings carried over from O.2 close:** RT.O2.3 — upload route
    now hard-caps at 5 MB and validates MIME via an allowlist
    {text/csv, text/plain, application/octet-stream}, returning 400
    file_too_large / invalid_mime_type before reading the blob; RT.O2.4 —
    Gemini BigQuery query adds `_PARTITIONTIME BETWEEN ... AND ...` ahead
    of the existing `DATE(usage_start_time)` predicate to enable partition
    pruning on date-partitioned billing exports (correctness unaffected
    on unpartitioned tables). CAPABILITY_MANIFEST.json bumped to 2.7
    (entry_count 139 → 145; six new entries with phase=phase-o-s3-1).
    14 brief-required tests + 1 bonus pass; full observatory + LLM-shim
    suite 123 passed | 10 skipped, 0 failed (vs 108 at S2.6 close — net
    +15). Field-naming divergence from the brief (brief listed
    `threshold_usd` / `is_active` / scopes 'conversation','user','global';
    DB-frozen migration 038 has `amount_usd` / `active` / scopes
    'total','provider','model','pipeline_stage') resolved by aligning
    types to the migration; documented in budget/types.ts header
    comment. Sub-phases S3.2 (alert evaluator), S3.3 (Budgets UI), S3.4
    (Export endpoints + UI) all parallel-safe per §6.1 after this merge.
  - v1.3.0 (2026-05-03, USTAD_S2_6_O2_GATE_CLOSE): O.2 GATE CLOSE.
    All six S2.x sessions S2.1–S2.6 carry `close_criteria_met: true`. This
    session lands the reconciliation UI surface (banner + history page +
    sidebar link), the API-client extension (fetchReconciliationHistory +
    triggerReconciliation), and resolves the deferred RT.5 finding from the
    S2.1 IS.8(b) red-team — `getActivePolicy()` in
    `platform/src/lib/llm/observability/redaction.ts` now defaults to
    `hashPromptPolicy`; raw-text capture requires explicit
    `OBSERVATORY_HASH_PROMPTS=false`. Per OBSERVATORY_PLAN §10 OD-5.
    O.2-close IS.8(b) red-team discharged in-document (six axes;
    RT.O2.1 PASS, RT.O2.2 PASS, RT.O2.3 MED, RT.O2.4 MED,
    RT.O2.5 PASS, RT.O2.6 PASS — see §11 below). MED findings logged
    for O.3 follow-up; no HIGH findings. 12 new unit tests added
    (3 redaction `getActivePolicy` cases incl. RT.5 default; 5
    ReconciliationBanner cases; 4 ReconciliationHistoryView cases including
    a CSV-upload-form-hidden negative). Full observatory + LLM-shim suite
    108 passed | 10 skipped, 0 failed (vs 91 at S2.5 close — net +17).
    Sub-phase O.3 unblocked; S3.1 (budget rules schema + API) is the
    next session.
  - v1.2.0 (2026-05-03, USTAD_S2_1_RECONCILIATION_FRAMEWORK): O.2 OPEN.
    Sub-phase O.2 marked IN_PROGRESS; S2.1 framework session CLOSED. Landed
    the reconciliation framework: types (ProviderReconciler interface +
    ProviderReconcileInput/Result + ReconciliationStatus enum +
    DEFAULT_RECONCILIATION_CONFIG with tolerance=2%/alert=5%), variance
    classifier (classifyVariance + computePeriodCost), BaseReconciler
    abstract template (subclasses implement only fetchAuthoritativeCost; the
    template handles persistence + variance classification + never-throws
    error path), per-provider factory with NotImplementedReconciler stubs,
    POST /api/admin/observatory/reconciliation + GET history endpoints (both
    flag+super-admin gated; 400 manual_upload_required for DeepSeek/NIM and
    400 not_implemented for the three auto providers until S2.2–S2.4). 17
    new unit tests pass; full observatory suite 74 passed | 22 skipped, 0
    failed (vs 57 at S1.13 close — net +17). IS.8(b) red-team for O.1 close
    discharged (8 axes; 7 PASS + 1 MED finding RT.5 on PII default-policy
    polarity, deferred to follow-up cleanup session per brief). DeepSeek
    +NIM clarified as CSV-upload reconciliation path (S2.5 implements an
    ingest handler instead of an admin-API pull; per-row CSV column mapping
    deferred to S2.5 brief). Schema reality reconciled in code: in-memory
    public types preserve brief naming (period_start/period_end,
    computed_cost_usd, authoritative_cost_usd, raw_report_id); SQL boundary
    in base.ts maps to migration-038 columns (reconciliation_date,
    computed_total_usd, authoritative_total_usd, no FK column for
    raw_report_id — surfaced in-memory only). Migration 038 unchanged.
    Next milestone: S2.2 (Anthropic), S2.3 (OpenAI), S2.4 (Gemini), S2.5
    (DeepSeek+NIM CSV) — all parallel-safe after this merge per §6.1.
  - v1.1.0 (2026-05-03, USTAD_S1_13_OBSERVATORY_MVP_WIRING): O.1 GATE CLOSE.
    All 13 sessions S1.1–S1.13 closed. Observatory MVP wired end-to-end:
    overview page (KPI tiles + filters + cost-over-time + provider/stage
    breakdowns) + events explorer with side panel + budgets placeholder for
    O.3. Smoke test script `npm run observatory:smoke` (with --dry-run mode)
    landed at platform/scripts/observatory/smoke_test.ts. OD.S1.3.1 RESOLVED
    (no separate raw-responses table; parameters jsonb is sufficient).
    OD.S1.7.1 RESOLVED via Option B (no shim API change; adapters call
    persistObservation() directly with status='timeout'; documented inline
    in observe.ts + persist.ts). All 12 S1.13 acceptance criteria PASS.
    Frontmatter adds `phase_status` block as CURRENT_STATE-style mirror.
    Next milestone: O.2 Reconciliation, S2.1 framework session unblocked.
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

**O.1 CLOSED 2026-05-03 by USTAD_S1_13_OBSERVATORY_MVP_WIRING.** All 13 S1.x sessions S1.1–S1.13 carry `close_criteria_met: true`. The MVP wiring landed: Overview page (FiltersBar + KPI tiles + CostOverTime chart + provider/stage breakdowns), Events page (EventTable + EventSidePanel with conversation thread), Budgets placeholder for O.3. End-to-end smoke script `npm run observatory:smoke` (with --dry-run for CI-safe verification) added at `platform/scripts/observatory/smoke_test.ts`. Two open decisions resolved at this close: **OD.S1.3.1** (no separate `llm_provider_raw_responses` table — request params live in `parameters` jsonb of `llm_usage_events`) and **OD.S1.7.1** (Option B; observe()/observeStream() classify all thrown errors as `status='error'`; adapters that detect timeouts call `persistObservation()` directly with `status='timeout'` per JSDoc on the export). All 12 S1.13 gate-bar acceptance criteria PASS (AC.1–AC.12 enumerated in SESSION_LOG entry). Per IS.8(b), O.1-close red-team is held over to the first session of O.2 (S2.1) per `ONGOING_HYGIENE_POLICIES §G` cadence rule (this O.1 close is the 13th session in the O.1 wave; S2.1 will discharge the O.1-close red-team as part of its session-open).

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

**O.2 OPEN 2026-05-03 by USTAD_S2_1_RECONCILIATION_FRAMEWORK.** Framework landed (`platform/src/lib/observatory/reconciliation/{types,variance,base,factory}.ts` + the two API endpoint routes); per-provider reconcilers S2.2–S2.5 are unblocked and parallel-safe per §6.1 (each reconciler's `may_touch` is its single sibling file under the reconciliation/ directory). **Note: DeepSeek + NIM use a manual CSV-upload path (no admin API exposed by either provider as of 2026-05-03).** S2.5 ships a CSV ingestion handler instead of an API-pull reconciler; the precise CSV column mapping (e.g., DeepSeek monthly invoice format, NIM managed-catalog daily usage export) is deferred to the S2.5 session brief. The POST /reconciliation endpoint already returns `400 manual_upload_required` with provider-specific instructions for those two providers.

**O.2 CLOSED 2026-05-03 by USTAD_S2_6_O2_GATE_CLOSE.** All six S2.x sessions S2.1–S2.6 carry `close_criteria_met: true`. Reconciliation framework + four per-provider reconcilers (Anthropic, OpenAI, Gemini-via-BigQuery, DeepSeek+NIM CSV-upload) wired end-to-end; UI surface complete (banner strip in `ObservatoryLayout`, history page at `/observatory/reconciliation` with provider tabs + CSV upload form for the manual providers, sidebar link). Typed API-client methods `fetchReconciliationHistory()` + `triggerReconciliation()` added to `platform/src/lib/api-clients/observatory.ts`. **Resolves RT.5** from S2.1's IS.8(b) red-team: `getActivePolicy()` defaults to `hashPromptPolicy` (raw-text capture is now opt-out via explicit `OBSERVATORY_HASH_PROMPTS=false`, matching OBSERVATORY_PLAN §10 OD-5 hash-by-default policy). O.2-close IS.8(b) red-team discharged with the 6-axis table in §11.

### §5.3 — Sub-phase O.3: Budgets + Export (4 sessions)

| ID | Title | may_touch | must_not_touch | Deps | Deliverable |
|---|---|---|---|---|---|
| S3.1 | Budget rules schema + API | platform/db/migrations/*budget_rules* (extending S1.1's table), platform/src/app/api/observatory/budgets/**, platform/src/lib/observatory/budgets/queries.ts, tests | Alert evaluator, UI | O.1 closed | CRUD endpoints + types for budget rules |
| S3.2 | Alert evaluator | platform/src/lib/observatory/budgets/evaluator.ts, scheduler glue, tests | UI, schema | S3.1 | Periodic evaluator that compares spend vs rules and emits alerts |
| S3.3 | Budgets UI | platform/src/components/observatory/budgets/**, tests | Alert evaluator, schema | S3.1 | UI for creating/editing/viewing budget rules + alert state |
| S3.4 | Export endpoints + UI | platform/src/app/api/observatory/export/**, platform/src/components/observatory/Export.tsx, tests | All other O.3 surfaces | O.1 closed | CSV/Parquet export of usage events with filters; super-admin only |

**O.3 close criteria.** All four sessions closed; first budget rule fires in dev when synthetic spend crosses threshold. IS.8(b)-class red-team.

**O.3 OPEN 2026-05-03 by USTAD_S3_1_BUDGET_RULES_FRAMEWORK.** Framework landed (`platform/src/lib/observatory/budget/{types,evaluate,persist}.ts` + 3 route files: `budget-rules/route.ts`, `budget-rules/[id]/route.ts`, `budget-rules/evaluate/route.ts`). API-client extension and openapi.yaml additions complete. **Resolves the two MED findings deferred from the S2.6 O.2 close**: RT.O2.3 (CSV upload size + MIME guard) and RT.O2.4 (BigQuery `_PARTITIONTIME` partition pruning). Per-session reconcilers S3.2/S3.3/S3.4 are unblocked and parallel-safe per §6.1.

**O.3 CLOSED 2026-05-03 by USTAD_S3_4_EXPORT_O3_CLOSE.** All four S3.x sessions S3.1–S3.4 carry `close_criteria_met: true`. Budget-rules framework + alert dispatcher + budgets UI + usage-export surface all wired end-to-end. **Resolves ND.S3.2.1**: `coerceThresholds()` in [`platform/src/lib/observatory/budget/evaluate.ts`](../platform/src/lib/observatory/budget/evaluate.ts) now preserves `channel_target` round-trip from the JSONB column, so webhook alerts reach the stored URL after a DB round-trip. **Closes S3.3 AC.6**: the budgets-page `RunEvaluationButton` now POSTs the `/budget-rules/evaluate/run` endpoint (which evaluates AND dispatches), not the read-only GET `/evaluate`. O.3-close IS.8(b) red-team discharged with the 6-axis table in §12 below. **CAPABILITY_MANIFEST deferred gap**: per §6.2, S3.4 does not touch the manifest — the export endpoint entry is recorded in §12 as exact instructions for the last-closing S4 session. Sub-phase O.4 unblocked; S4.1 (Cache effectiveness) is the next session.

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

**Status update 2026-05-03 (USTAD_S1_13).** Two ODs resolved at the O.1 close:

- **OD.S1.3.1 — RESOLVED.** No separate `llm_provider_raw_responses` table. Request parameter snapshots live in `llm_usage_events.parameters` (jsonb); all five S1.4–S1.8 provider adapters already populate this column. Raw provider response bodies are not persisted at v1; the EventSidePanel Meta tab carries an inline note. Capture can be added in a future release without schema migration. Documented in `platform/src/lib/llm/observability/persist.ts:5-12`.
- **OD.S1.7.1 — RESOLVED via Option B (no API change).** `observe()` and `observeStream()` classify every thrown error as `status='error'` — they cannot natively produce `status='timeout'`. Adapters that detect a provider timeout (AbortError / deadline exceeded / etc.) call `persistObservation()` directly with `status='timeout'` before re-throwing, then skip the observe() wrapping for that one call. `persistObservation` JSDoc marks itself as the timeout escape hatch. Documented in `platform/src/lib/llm/observability/observe.ts:9-17` and `platform/src/lib/llm/observability/persist.ts:14-18`.

1. **Storage layer choice.** Telemetry rows accumulate fast (one per call, conservatively ~10–100K/day). PostgreSQL is the default platform store, but high-volume telemetry might justify a columnar store (e.g., ClickHouse or BigQuery) for the events table specifically. **Decision needed by S1.1.** Default if unspecified: PostgreSQL with monthly partition on `started_at`.

2. **Retention policy.** How long are telemetry rows kept at full fidelity? Forever vs 13 months vs aggregate-after-90-days? **Decision needed by S1.1.** Default: keep all rows indefinitely; revisit at O.1 close if storage growth is concerning.

3. **Multi-tenant scope.** Does Observatory ever surface another tenant's data? (Currently the platform is single-tenant — Abhisek's chart only — but the architecture allows future multi-tenancy.) **Decision needed by S1.3.** Default: super-admin sees all data, full stop, with workspace-scoped filters added when multi-tenancy ships.

4. **Audit-stage quality-score capture for §S4.2.** Cost-per-quality requires a numeric quality score per audit-stage call. The platform's audit stage produces qualitative verdicts; converting to a numeric score requires a probe spec. **Decision needed by S4.2.** Default behavior if unspecified: S4.2 ships as a stub that displays "quality probe not wired"; the analytics is delivered when the spec lands.

5. **Disclosure tier for prompt/response text in `llm_usage_events`.** Default on Phase O launch: hash-and-store under feature flag `OBSERVATORY_HASH_PROMPTS=true`. Raw-text capture requires an explicit flag flip and is out of default scope. **Decision needed by S1.1.** Default: hash; never raw without explicit super-admin override.

6. **Whether to declare a new mirror pair MP.9** (OBSERVATORY_PLAN ↔ Gemini-side observability summary). **Decision needed at S0.1 close** (i.e., this session). Default: declare MP.9 with `adapted_parity_summary` mode; semantic parity, not byte-identity. Resolution at this S0.1 close: **MP.9 declared** in `manifest_overrides.yaml` with claude_side `00_ARCHITECTURE/OBSERVATORY_PLAN_v1_0.md`, gemini_side `.geminirules §E + .gemini/project_state.md` Phase O block.

7. **Whether self-hosted NIM should be added to v2 scope.** As of 2026-05-02, the project's NIM use is managed-catalog only. Adding self-hosted NIM (cost-derived from GPU utilization) is a substantial v2 effort. **Decision deferred to post-Phase-O-close native review.**

---

## §11 — O.2 close red-team (IS.8(b))

Discharged in-document at O.2 close per `MACRO_PLAN §IS.8` and the
`ONGOING_HYGIENE_POLICIES §G` cadence rule. Six axes; no HIGH findings;
two MED findings logged for O.3 pickup.

| Axis | Question | Verdict | Evidence / fix |
|---|---|---|---|
| RT.O2.1 | Are provider admin-API credentials checked at instantiation time, so a missing key causes `status='error'` on the result row, not a server-startup crash? | **PASS** | All three credentialed reconcilers read env vars *inside* `fetchAuthoritativeCost()` (Anthropic [anthropic.ts:89](../platform/src/lib/observatory/reconciliation/anthropic.ts#L89), OpenAI [openai.ts:117](../platform/src/lib/observatory/reconciliation/openai.ts#L117), Gemini [gemini.ts:127](../platform/src/lib/observatory/reconciliation/gemini.ts#L127)). Throws are caught by `BaseReconciler.reconcile()` ([base.ts:62-82](../platform/src/lib/observatory/reconciliation/base.ts#L62-L82)) which writes a status='error' row with the message in `notes`. No module-init env access. |
| RT.O2.2 | Does double-calling `reconcile()` for the same `(provider, period_start, period_end)` insert duplicate rows in `llm_cost_reconciliation`? | **PASS** | `BaseReconciler` uses `INSERT ... ON CONFLICT (reconciliation_date, provider, COALESCE(model, '')) DO UPDATE SET ...` ([base.ts:138-152](../platform/src/lib/observatory/reconciliation/base.ts#L138-L152)). The CSV-upload path applies the same upsert ([upload/route.ts:225-239](../platform/src/app/api/admin/observatory/reconciliation/upload/route.ts#L225-L239)). Migration 038 declares the matching unique constraint. |
| RT.O2.3 | Does the CSV upload endpoint validate file size and MIME type, or could a malicious super-admin upload a 500 MB file or non-CSV binary and OOM the server? | **MED — FINDING** | Upload route reads `(file as Blob).text()` ([upload/route.ts:118](../platform/src/app/api/admin/observatory/reconciliation/upload/route.ts#L118)) with no size cap and no MIME check. The form `accept=".csv,text/csv"` is browser-side only. **Recommended fix (deferred to O.3):** check `file.size <= 5 MB`, validate `file.type` allowlist, and stream-parse rows past a threshold. Severity capped at MED because the route is super-admin-only and gated by `OBSERVATORY_ENABLED`. |
| RT.O2.4 | Does the Gemini BigQuery reconciler use partition pruning, or does it scan the full billing table? | **MED — FINDING** | Query filters on `WHERE DATE(usage_start_time) BETWEEN @period_start AND @period_end` ([gemini.ts:159](../platform/src/lib/observatory/reconciliation/gemini.ts#L159)). GCP standard billing exports are partitioned on `_PARTITIONTIME` — wrapping `DATE()` around `usage_start_time` does **not** prune those partitions. Daily scans will read the full table history on each reconcile. **Recommended fix (deferred to O.3):** add an additional `_PARTITIONTIME` predicate (e.g., `_PARTITIONTIME BETWEEN TIMESTAMP(@period_start) AND TIMESTAMP_ADD(TIMESTAMP(@period_end), INTERVAL 2 DAY)` to allow for retroactive billing rows). MED because it's a cost issue (BQ scan dollars), not a correctness or security one. |
| RT.O2.5 | Does the RT.5 polarity fix break any existing test that assumed identity-default? | **PASS** | All existing redaction tests still pass; `defaultRedactionPolicy` and `hashPromptPolicy` themselves are unchanged. Only the env-var resolution flipped. Three new `getActivePolicy()` tests cover the new default + both explicit values ([observability_redaction.test.ts:103-130](../platform/src/lib/llm/__tests__/observability_redaction.test.ts#L103-L130)). Full observatory + LLM-shim suite: 108 passed, 10 skipped, 0 failed. |
| RT.O2.6 | Does the ReconciliationBanner / history page ever render outside the `(super-admin)` route group, or import from non-observatory modules in a way that pulls cost data into non-admin surfaces? | **PASS** | Banner is mounted only in `lib/components/observatory/Layout.tsx`, which is rendered only by `app/(super-admin)/observatory/layout.tsx`'s `<ObservatoryLayout>`. The history page lives at `app/(super-admin)/observatory/reconciliation/page.tsx`. Both are inside the `(super-admin)` route group + `<AuthGate>` (flag + super-admin role check). The DB loader (`loader.ts`) is `import 'server-only'`. No imports from non-observatory consumer paths. |

**Recommended O.3 follow-ups (logged to S3.x backlog, not blocking O.2 close):**
- RT.O2.3 → harden `/api/admin/observatory/reconciliation/upload` with file-size + MIME guard.
- RT.O2.4 → add `_PARTITIONTIME` predicate to Gemini BigQuery query.

---

## §12 — O.3 close red-team (IS.8(b))

Discharged in-document at O.3 close per `MACRO_PLAN §IS.8` and the
`ONGOING_HYGIENE_POLICIES §G` cadence rule. Six axes; no HIGH findings;
two MED findings logged for O.4 pickup. ND.S3.2.1 confirmed RESOLVED.

| Axis | Question | Verdict | Evidence / fix |
|---|---|---|---|
| RT.O3.1 | Can the GET `/api/admin/observatory/export` endpoint be reached by a non-super-admin who guesses the URL? Does it honour both `OBSERVATORY_ENABLED` AND the super-admin role check? | **PASS** | The export route's first line is `await guardObservatoryRoute()` ([export/route.ts:36](../platform/src/app/api/admin/observatory/export/route.ts#L36)), which is the same `_guard.ts` shared by every other observatory admin endpoint ([_guard.ts:25-43](../platform/src/app/api/admin/observatory/_guard.ts#L25-L43)). It checks the `MARSYS_FLAG_OBSERVATORY_ENABLED` env var and then `requireSuperAdmin()` (returns 401 / 403) before any other code runs. A non-super-admin guessing the URL hits a 401/403 before the DB is touched. |
| RT.O3.2 | Export data volume — what happens if 50 000 rows are exported as a string in memory? Is there a meaningful risk of OOM on the Cloud Run instance (typical 2 GB RAM)? Is the 90-day / 50 000-row cap sufficient, or is a streaming response needed? | **MED — FINDING** | The route loads all rows into memory with `await queryUsageForExport(params)` and materialises the full string with `toCSV()/toJSON()` before returning. 50 000 rows × ~16 columns × ~30 bytes ≈ 24 MB raw → ~30–50 MB CSV string. Single-request memory is well under the 2 GB Cloud Run cap, but concurrent requests (e.g., two super-admins exporting in parallel) compound. **Recommended fix (deferred to O.4):** stream the response via `ReadableStream` with row-batch SQL cursor — `pg`'s `Cursor` interface or `LIMIT … OFFSET`-paged loop — emitting CSV lines as bytes rather than a single materialised string. MED severity because the 50 000-row cap is enforced before the OOM-risk envelope opens; this is hardening, not a live bug. |
| RT.O3.3 | Webhook security — the alert dispatcher POSTs to a URL in `channel_target`. Can a super-admin use this to cause the server to SSRF to internal GCP metadata endpoints (169.254.169.254, metadata.google.internal)? | **MED — FINDING** | [`alert_dispatcher.ts:87`](../platform/src/lib/observatory/budget/alert_dispatcher.ts#L87) does `await fetch(target, ...)` where `target` is `threshold.channel_target` — a string saved by a super-admin via the budget-rules POST endpoint with **no URL validation**. A super-admin could create a budget rule with `channel_target='http://169.254.169.254/...'` and the server would issue a POST against the GCE metadata service. The metadata service requires a `Metadata-Flavor: Google` header which the dispatcher does not set, so token leak via the Google flow specifically is unlikely — but other internal services (private VPC endpoints, sidecar admin ports) may not require special headers. Threat model bounded: the trigger requires super-admin (already-highest-privilege) to plant the URL AND the rule must cross a threshold for the dispatch to fire. **Recommended fix (deferred to O.4):** at budget-rule POST time, validate `channel_target` against (a) HTTPS-only, (b) public-IP allowlist (block RFC 1918, link-local, loopback), (c) optional explicit allowlist of permitted webhook hosts. MED, not HIGH, because the gating role itself bypasses every other system control. |
| RT.O3.4 | Budget rule soft-delete completeness — after DELETE sets `active=false`, does `evaluateAllRules()` actually exclude the rule? Does the `evaluate/run` endpoint re-evaluate a just-deactivated rule? | **PASS** | [`evaluate.ts:264-269`](../platform/src/lib/observatory/budget/evaluate.ts#L264-L269) selects from `llm_budget_rules WHERE active = TRUE`. The `/evaluate/run` POST handler ([evaluate/run/route.ts:30](../platform/src/app/api/admin/observatory/budget-rules/evaluate/run/route.ts#L30)) calls `evaluateAllRules()` directly with no override path. A soft-deleted rule (`active=false`) is invisible to both the read-only GET `/evaluate` and the dispatching POST `/evaluate/run`. Existing test 14 (in `budget.test.ts`) confirms the DELETE→GET sequence shows `active=false`. |
| RT.O3.5 | ND.S3.2.1 resolution — after the `coerceThresholds()` fix, does a round-trip through the DB (INSERT with `channel_target` → SELECT → coerce → dispatch) correctly route webhook alerts to the stored URL? | **PASS** | [`evaluate.ts:185-208`](../platform/src/lib/observatory/budget/evaluate.ts#L185-L208) now copies `channel_target` into the coerced `AlertThreshold` when present (string, non-empty), and omits the key entirely when null/undefined/empty. New test `14a` in [`budget.test.ts`](../platform/src/lib/components/observatory/__tests__/budget/budget.test.ts) drives a row with `channel_target='https://hook.example/path'` through `evaluateBudgetRule` and asserts the resulting `alerts_triggered[0]` exposes the URL — the same shape `dispatchWebhook()` reads from `threshold.channel_target` ([alert_dispatcher.ts:75](../platform/src/lib/observatory/budget/alert_dispatcher.ts#L75)). Test `14b` asserts no explicit `undefined` key leaks through. ND.S3.2.1 status = **RESOLVED**. |
| RT.O3.6 | CAPABILITY_MANIFEST gap — the export endpoint (TASK 2) is not recorded in `CAPABILITY_MANIFEST.json` because the §6.2 governance constraint forbids touching the manifest in S3.4. Confirm this is acceptable as a known deferred gap (to be resolved by last-closing S4 session), and record the specific entry needed. | **ACK** | Acceptable per §6.2 funneling discipline: only S0.1, S2.1, S3.1, and the last-closing S4 session touch the manifest, in order to prevent the JSON-merge race observed in M4-D-P1/M4-D-S1. The export endpoint must be registered by the last-closing S4 session with the entry shape below. |

**CAPABILITY_MANIFEST entry to add (last-closing S4 session)**

The last-closing S4 session must add this entry to `00_ARCHITECTURE/CAPABILITY_MANIFEST.json` under `entries[]`, increment `entry_count` by one, and bump the manifest version per the standard `phase: "phase-o-s4"` pattern used elsewhere in the file:

```json
{
  "id": "OBSERVATORY_EXPORT_ENDPOINT",
  "kind": "L_API_ROUTE",
  "path": "platform/src/app/api/admin/observatory/export/route.ts",
  "phase": "phase-o-s3-4",
  "authored_session": "USTAD_S3_4_EXPORT_O3_CLOSE",
  "authored_date": "2026-05-03",
  "summary": "GET endpoint returning a filtered usage-events export as CSV or JSON. Gated by OBSERVATORY_ENABLED + super-admin role. Caps: 90-day window, 50000 rows. Companion modules at platform/src/lib/observatory/export/{types,query,format}.ts."
}
```

Sibling entries to consider in the same registration pass (companion modules — same session, same `phase: phase-o-s3-4`): `lib/observatory/export/types.ts`, `lib/observatory/export/query.ts`, `lib/observatory/export/format.ts`, `lib/components/observatory/export/ExportPanel.tsx`. The S4 closing session SHOULD register all five together so the export surface is fully discoverable from the manifest.

**Recommended O.4 follow-ups (logged to O.4 backlog, not blocking O.3 close):**
- RT.O3.2 → stream the export response with a SQL cursor instead of materialising the full result string in memory.
- RT.O3.3 → validate `channel_target` URLs at budget-rule POST time (HTTPS-only + private-IP block + optional host allowlist).
- **Pre-existing test residual (inherited from e7f1e8f)**: `src/lib/llm/providers/__tests__/{anthropic,openai}_observed.test.ts` each have one assertion (raw `prompt_text` literal) failing under the S2.6 RT.5 hash-by-default flip. Not a regression of S3.4. Fix in an O.4 cleanup session by either (a) updating the assertions to expect the SHA256 hash or (b) setting `process.env.OBSERVATORY_HASH_PROMPTS = 'false'` in the test setup of those two files.

---

*End of OBSERVATORY_PLAN_v1_0.md.*
