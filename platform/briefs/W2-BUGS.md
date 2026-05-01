---
status: COMPLETE
session: W2-BUGS
scope: UQE-1 (remedial_codex SQL) + UQE-2 (synthesis temperature) + UQE-7 (domain fallback) + UQE-9 (trace seq)
authored: 2026-05-01
round: 1
critical_path: false
blocks: nothing (all bug fixes, self-contained)
---

# CLAUDECODE_BRIEF — W2-BUGS
## Four Independent Bug Fixes

Read CLAUDE.md §0 first. Copy this file to the project root as
`CLAUDECODE_BRIEF.md` before opening the session.

---

## Context

Four production bugs with no inter-dependencies. All can be fixed sequentially
in one session. None require architecture changes.

Key file locations:
- `platform/src/lib/retrieve/remedial_codex_query.ts` — UQE-1
- `platform/src/lib/synthesis/single_model_strategy.ts` — UQE-2
- `platform/src/lib/retrieve/msr_sql.ts` + register tools — UQE-7
- `platform/src/app/api/chat/consume/route.ts` — UQE-9

---

## Acceptance criteria

### AC.B.1 — UQE-1: Fix remedial_codex_query SQL (Bug B2W-1)

**Diagnosis first.** The Wave 2 plan says the bug is "Column 'canonical_id' does not
exist in remedial_codex table". But `remedial_codex_query.ts` actually queries
`rag_chunks` (not `remedial_codex`) and does SELECT `canonical_id`.

Start by running the actual query against the DB:
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'rag_chunks' ORDER BY column_name;
```

Then run the tool's query with a known planet (e.g. 'Saturn') and check if it
returns rows. If `canonical_id` column doesn't exist in `rag_chunks`, add it via
a new migration. If the column exists but returns zero rows, the issue is in
the WHERE conditions or missing data.

**Fix path A (column missing):** New migration
`platform/migrations/021_rag_chunks_canonical_id.sql`:
```sql
ALTER TABLE rag_chunks ADD COLUMN IF NOT EXISTS canonical_id TEXT;
UPDATE rag_chunks SET canonical_id = 'REMEDIAL_CODEX_v2_0'
  WHERE doc_type = 'l4_remedial' AND canonical_id IS NULL;
```

**Fix path B (zero rows from data gap):** If the DB has the column but no
`l4_remedial` rows exist, add a diagnostic comment to `remedial_codex_query.ts`
and open a `[DATA_GAP_REQUIRED]` marker — do not fabricate data (B.10).

Acceptance: `SELECT COUNT(*) FROM rag_chunks WHERE doc_type = 'l4_remedial'`
returns ≥1 row OR a `[DATA_GAP_REQUIRED]` marker is placed with exact
specification of what data to load.

### AC.B.2 — UQE-2: Synthesis temperature (Bug B2W-5)

File: `platform/src/lib/synthesis/single_model_strategy.ts`

Current state: `streamText()` called with no `temperature` param (defaults to
provider's non-zero value → non-deterministic responses).

Fix: pass `temperature` to `streamText()` based on `queryPlan.query_class`:
```typescript
// Single-answer queries: deterministic
const temperature = ['single_answer', 'remedial', 'predictive'].includes(queryPlan.query_class)
  ? 0
  : 0.3  // exploratory / holistic: allow some variation
```

Acceptance:
- `temperature` is passed to every `streamText()` call in `single_model_strategy.ts`.
- The value is logged in the existing synthesis trace step under `data_summary`.
- `npx tsc --noEmit` clean.

### AC.B.3 — UQE-7: Domain-only fallback for MSR + registers (Bug B2W-2/3)

**Problem:** When `compose_bundle` emits `planets=[]` or `houses=null`, queries
like `WHERE planet = ANY($planets)` return zero rows.

**Fix in `msr_sql.ts`:** After the primary query, if `rows.length === 0` AND
`planetFilter !== null` (i.e. we filtered by planet but got nothing), retry
without the planet filter — domain-only fallback:

```typescript
if (rows.length === 0 && planetFilter !== null) {
  const { rows: fallbackRows } = await getStorageClient().query<MsrSignal>(SQL, [
    nativeId,
    domainFilter,
    null,              // no planet filter
    forwardLookingFilter,
    confidenceFloor,
    signalTypeFilter,
    temporalFilter,
    valenceFilter,
    entitiesFilter,
  ])
  // use fallbackRows; log fallback_used=true in bundle metadata
}
```

Apply same pattern to:
- `pattern_register.ts`
- `contradiction_register.ts`
- `resonance_register.ts`

Each should add `fallback_used: boolean` to the returned `ToolBundle`'s
`invocation_params` or a top-level field so it's visible in trace.

Acceptance:
- A query with `domains=['remedial']` and empty `planets` returns ≥1 row from
  each of the four tools.
- `fallback_used=true` visible in the bundle when fallback was triggered.
- `npx tsc --noEmit` clean.

### AC.B.4 — UQE-9: Fix trace step_seq collisions (Bug B2W-7)

File: `platform/src/app/api/chat/consume/route.ts`

**Current problem:** Tool steps use `step_seq: 3 + idx` where `idx` is the
index within the parallel tool fetch array. The synthesis step uses
`synthesisSeq` computed as `3 + validToolResults.length`. If tools run in
parallel, multiple tools get the same `step_seq` value.

**Fix:** Replace the manual arithmetic with an atomic counter:

```typescript
// Near the top of the pipeline try-block, after queryId is known:
let stepSeq = 0
const nextSeq = () => ++stepSeq
```

Replace every hard-coded `step_seq: N` and `step_seq: 3 + idx` with
`step_seq: nextSeq()`. The counter is per-request (local variable), so it's
safe without locks in a single-thread async context.

Acceptance:
- All `step_seq` values within a single `query_id` are unique and monotonically
  increasing when read back from `query_trace_steps` table.
- `npx tsc --noEmit` clean.

### AC.B.5 — tsc clean + commit

```
fix(w2-bugs): UQE-1/2/7/9 — remedial_codex SQL + temperature + domain fallback + trace seq

- remedial_codex_query: diagnose and fix column/data gap (UQE-1)
- single_model_strategy: temperature=0 for single_answer, 0.3 for exploratory (UQE-2)
- msr_sql + registers: domain-only fallback when planet array empty (UQE-7)
- route.ts: atomic nextSeq() counter replaces manual step_seq arithmetic (UQE-9)
```

---

## may_touch

```
platform/src/lib/retrieve/remedial_codex_query.ts
platform/src/lib/retrieve/msr_sql.ts
platform/src/lib/retrieve/pattern_register.ts
platform/src/lib/retrieve/contradiction_register.ts
platform/src/lib/retrieve/resonance_register.ts
platform/src/lib/synthesis/single_model_strategy.ts
platform/src/app/api/chat/consume/route.ts
platform/migrations/021_rag_chunks_canonical_id.sql  (new, only if column missing)
```

## must_not_touch

```
platform/src/lib/router/**
platform/src/lib/pipeline/**
platform/src/lib/config/feature_flags.ts
platform/src/hooks/**
platform/src/components/**
platform/src/lib/models/**
00_ARCHITECTURE/CAPABILITY_MANIFEST.json
01_FACTS_LAYER/**
025_HOLISTIC_SYNTHESIS/**
```

---

## Hard constraints

- AC.B.1 requires diagnosis before fix. Do not assume the column is missing
  without checking. Run the SELECT against the DB first.
- B.10: if the remedial_codex data simply does not exist in the DB, do NOT
  fabricate it. Place a `[DATA_GAP_REQUIRED]` marker with exact specification.
- Do not change the SQL schema for `msr_signals` or any other table without a
  migration file.
- UQE-9 fix must not change any business logic — only the seq numbering.

---

*W2-BUGS · authored 2026-05-01 · no downstream blockers*
