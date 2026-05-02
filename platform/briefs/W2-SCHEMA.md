---
status: COMPLETE
session: W2-SCHEMA
scope: MON-1/2/3/4 (DB migrations) + MON-10 (analytics views)
authored: 2026-05-01
round: 1
critical_path: false
blocks: W2-INSTRUMENT (Round 3) — instrumentation writes need these tables
---

# CLAUDECODE_BRIEF — W2-SCHEMA
## Monitoring Database Schema

Read CLAUDE.md §0 first. Copy this file to the project root as
`CLAUDECODE_BRIEF.md` before opening the session.

---

## Context

The monitoring infrastructure (Round 3: W2-INSTRUMENT) writes one row per LLM
call, one row per query plan, one row per tool execution, and one row per
context assembly to four new tables. This session creates those tables. It is
pure DB schema work — no application code changes.

Next migration number: **021** (check `platform/migrations/` to confirm; use
the next available number). If W2-BUGS runs in parallel and creates a 021
migration, use 022 here.

Existing migration convention: files named `NNN_description.sql`, applied in
numeric order. Each migration is idempotent (`CREATE TABLE IF NOT EXISTS`,
`CREATE INDEX IF NOT EXISTS`).

---

## Acceptance criteria

### AC.S.1 — MON-1: llm_call_log table

File: `platform/migrations/02N_llm_call_log.sql`

```sql
CREATE TABLE IF NOT EXISTS llm_call_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id        UUID NOT NULL,
  conversation_id UUID,
  call_stage      TEXT NOT NULL,  -- 'planner' | 'synthesis' | 'title' | 'history_summary' | 'context_assembly'
  model_id        TEXT NOT NULL,
  provider        TEXT NOT NULL,
  input_tokens    INTEGER,
  output_tokens   INTEGER,
  reasoning_tokens INTEGER,       -- o-series and deepseek-reasoner only; NULL otherwise
  latency_ms      INTEGER,
  cost_usd        NUMERIC(12, 8),
  fallback_used   BOOLEAN DEFAULT false,
  error_code      TEXT,           -- NULL on success
  payload         JSONB,          -- reasoning_trace, raw_response_metadata, etc.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_llm_call_log_query_id ON llm_call_log(query_id);
CREATE INDEX IF NOT EXISTS idx_llm_call_log_model_id ON llm_call_log(model_id);
CREATE INDEX IF NOT EXISTS idx_llm_call_log_call_stage ON llm_call_log(call_stage);
CREATE INDEX IF NOT EXISTS idx_llm_call_log_created_at ON llm_call_log(created_at DESC);
```

### AC.S.2 — MON-2: query_plan_log table

File: `platform/migrations/02N_query_plan_log.sql`

```sql
CREATE TABLE IF NOT EXISTS query_plan_log (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id          UUID NOT NULL UNIQUE,
  conversation_id   UUID,
  chart_id          TEXT,
  planner_model_id  TEXT,
  query_text        TEXT,
  query_class       TEXT,         -- from classifier or planner
  tool_count        INTEGER,
  plan_json         JSONB,        -- full PlanSchema output
  parsing_success   BOOLEAN NOT NULL DEFAULT true,
  parse_error       TEXT,         -- NULL on success
  fallback_used     BOOLEAN DEFAULT false,
  planner_latency_ms INTEGER,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_query_plan_log_query_id ON query_plan_log(query_id);
CREATE INDEX IF NOT EXISTS idx_query_plan_log_conversation_id ON query_plan_log(conversation_id);
CREATE INDEX IF NOT EXISTS idx_query_plan_log_created_at ON query_plan_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_query_plan_log_fallback ON query_plan_log(fallback_used)
  WHERE fallback_used = true;
```

### AC.S.3 — MON-3: tool_execution_log table

File: `platform/migrations/02N_tool_execution_log.sql`

```sql
CREATE TABLE IF NOT EXISTS tool_execution_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id        UUID NOT NULL,
  tool_name       TEXT NOT NULL,
  params_json     JSONB,
  status          TEXT NOT NULL,  -- 'ok' | 'zero_rows' | 'error' | 'cache_hit'
  rows_returned   INTEGER,
  latency_ms      INTEGER,
  token_estimate  INTEGER,
  data_asset_id   TEXT,
  error_code      TEXT,
  served_from_cache BOOLEAN DEFAULT false,
  fallback_used   BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tool_execution_log_query_id ON tool_execution_log(query_id);
CREATE INDEX IF NOT EXISTS idx_tool_execution_log_tool_name ON tool_execution_log(tool_name);
CREATE INDEX IF NOT EXISTS idx_tool_execution_log_status ON tool_execution_log(status);
CREATE INDEX IF NOT EXISTS idx_tool_execution_log_zero_rows ON tool_execution_log(tool_name)
  WHERE status = 'zero_rows';
```

### AC.S.4 — MON-4: context_assembly_log table

File: `platform/migrations/02N_context_assembly_log.sql`

```sql
CREATE TABLE IF NOT EXISTS context_assembly_log (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id            UUID NOT NULL UNIQUE,
  l1_tokens           INTEGER DEFAULT 0,
  l2_5_signal_tokens  INTEGER DEFAULT 0,
  l2_5_pattern_tokens INTEGER DEFAULT 0,
  l4_tokens           INTEGER DEFAULT 0,
  vector_tokens       INTEGER DEFAULT 0,
  cgm_tokens          INTEGER DEFAULT 0,
  total_tokens        INTEGER GENERATED ALWAYS AS (
    COALESCE(l1_tokens,0) + COALESCE(l2_5_signal_tokens,0) +
    COALESCE(l2_5_pattern_tokens,0) + COALESCE(l4_tokens,0) +
    COALESCE(vector_tokens,0) + COALESCE(cgm_tokens,0)
  ) STORED,
  synthesis_model_id  TEXT,
  model_max_context   INTEGER,
  b3_compliant        BOOLEAN,    -- verified_citations ≥ 1
  citation_count      INTEGER,
  verified_citations  INTEGER,    -- Layer 2 cross-ref count (UQE-3-REVISED)
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_context_assembly_log_query_id ON context_assembly_log(query_id);
CREATE INDEX IF NOT EXISTS idx_context_assembly_log_b3 ON context_assembly_log(b3_compliant)
  WHERE b3_compliant = false;
```

### AC.S.5 — MON-10: Analytics views

File: `platform/migrations/02N_analytics_views.sql`

```sql
-- Cost by model (last 30 days)
CREATE OR REPLACE VIEW v_cost_by_model_30d AS
SELECT
  model_id,
  provider,
  call_stage,
  COUNT(*) AS call_count,
  SUM(input_tokens) AS total_input_tokens,
  SUM(output_tokens) AS total_output_tokens,
  SUM(COALESCE(reasoning_tokens, 0)) AS total_reasoning_tokens,
  SUM(COALESCE(cost_usd, 0)) AS total_cost_usd,
  AVG(latency_ms) AS avg_latency_ms
FROM llm_call_log
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY model_id, provider, call_stage;

-- Tool health (last 7 days)
CREATE OR REPLACE VIEW v_tool_health_7d AS
SELECT
  tool_name,
  COUNT(*) AS total_calls,
  SUM(CASE WHEN status = 'ok' THEN 1 ELSE 0 END) AS ok_count,
  SUM(CASE WHEN status = 'zero_rows' THEN 1 ELSE 0 END) AS zero_rows_count,
  SUM(CASE WHEN status = 'error' THEN 1 ELSE 0 END) AS error_count,
  SUM(CASE WHEN fallback_used THEN 1 ELSE 0 END) AS fallback_count,
  AVG(latency_ms) AS avg_latency_ms,
  AVG(rows_returned) AS avg_rows_returned
FROM tool_execution_log
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY tool_name;

-- Grounding health (last 7 days)
CREATE OR REPLACE VIEW v_grounding_health_7d AS
SELECT
  DATE_TRUNC('day', created_at) AS day,
  COUNT(*) AS total_queries,
  SUM(CASE WHEN b3_compliant THEN 1 ELSE 0 END) AS b3_compliant_count,
  AVG(citation_count) AS avg_citations,
  AVG(verified_citations) AS avg_verified_citations,
  AVG(total_tokens) AS avg_total_tokens
FROM context_assembly_log
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY day DESC;
```

### AC.S.6 — TypeScript interfaces

New file: `platform/src/lib/db/monitoring-types.ts`

Export TypeScript interfaces matching each table exactly:
- `LlmCallLogRow`
- `QueryPlanLogRow`
- `ToolExecutionLogRow`
- `ContextAssemblyLogRow`

These are used by W2-INSTRUMENT (Round 3) to type the write helpers.

### AC.S.7 — Migration verification + commit

All migrations must be idempotent (run twice → no error). Verify:
```bash
psql $DATABASE_URL -f migrations/02N_llm_call_log.sql
psql $DATABASE_URL -f migrations/02N_llm_call_log.sql  # second run — must not error
```

Repeat for all four table migrations and the views migration.

`npx tsc --noEmit` clean on `monitoring-types.ts`.

```
feat(w2-schema): monitoring DB schema — llm_call_log, query_plan_log, tool_execution_log, context_assembly_log

- MON-1: llm_call_log with reasoning_tokens for R1/o-series
- MON-2: query_plan_log with plan_json JSONB + fallback tracking
- MON-3: tool_execution_log with zero_rows and fallback_used indexes
- MON-4: context_assembly_log with 6-layer token breakdown + b3_compliant
- MON-10: v_cost_by_model_30d, v_tool_health_7d, v_grounding_health_7d views
- monitoring-types.ts: TypeScript interfaces for all 4 tables
```

---

## may_touch

```
platform/migrations/02N_llm_call_log.sql           (new)
platform/migrations/02N_query_plan_log.sql          (new)
platform/migrations/02N_tool_execution_log.sql      (new)
platform/migrations/02N_context_assembly_log.sql    (new)
platform/migrations/02N_analytics_views.sql         (new)
platform/src/lib/db/monitoring-types.ts             (new)
```

## must_not_touch

```
platform/src/app/**
platform/src/lib/router/**
platform/src/lib/retrieve/**
platform/src/lib/synthesis/**
platform/src/lib/trace/**
platform/src/lib/pipeline/**
platform/src/hooks/**
platform/src/components/**
platform/src/lib/models/**
00_ARCHITECTURE/**
01_FACTS_LAYER/**
```

---

## Hard constraints

- Use the next available migration number. Check existing migrations in
  `platform/migrations/` and use sequential numbers (not all the same number).
- All migrations must be idempotent. Use `IF NOT EXISTS` everywhere.
- The `total_tokens` GENERATED column in `context_assembly_log` requires
  PostgreSQL 12+. If the DB version is earlier, replace with a regular column
  updated by the application.
- Do not add application instrumentation code — that is W2-INSTRUMENT (Round 3).
  This session is schema only.

---

*W2-SCHEMA · authored 2026-05-01 · unblocks W2-INSTRUMENT (Round 3)*
