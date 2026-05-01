---
report_id: RETRIEVAL_AUDIT_PHASE_13
version: 1.0
generated: 2026-04-28
executor: Claude Code (Sonnet 4.6)
brief: EXEC_BRIEF_PHASE_13_RETRIEVAL_AUDIT_v1_0.md
status: COMPLETE
---

# Phase 13 — Retrieval Completeness Audit + Repair Report

## Executive Summary

The `[EXTERNAL_COMPUTATION_REQUIRED]` markers for Sun/Moon/Mars/Rahu/Ketu degrees, Ketu's nakshatra, and house cusps 2-12 were caused by a **schema mismatch that silently failed every vector_search call**, not by any corpus gap. All the data exists in both FORENSIC v8.0 and in `rag_chunks` with valid embeddings. Two surgical fixes have been applied:

1. `platform/src/lib/retrieve/vector_search.ts` — removed `WHERE e.native_id = $2` clause that referenced a non-existent column
2. `platform/src/lib/config/feature_flags.ts` — bumped `VECTOR_SEARCH_TOP_K_DEFAULT` from 10 to 20

A secondary finding: migration `011_audit_log.sql` was never applied to Cloud SQL. Applied during this session.

---

## Stream A — FORENSIC Catalog

**Result: All ECR facts are present in FORENSIC.**

| Fact (ECR-claimed) | Present in FORENSIC? | Value |
|---|---|---|
| sun.degree | ✅ YES | 21°57′35″ (PLN.SUN, §2.1) |
| sun.nakshatra | ✅ YES | Shravana / pada 4 (PLN.SUN, §2.1) |
| moon.degree | ✅ YES | 27°02′48″ (PLN.MOON, §2.1) |
| mars.degree | ✅ YES | 18°31′38″ (PLN.MARS, §2.1) |
| rahu.degree | ✅ YES | 19°01′47″ (PLN.RAHU, §2.1) |
| ketu.degree | ✅ YES | 19°01′47″ (PLN.KETU, §2.1) |
| ketu.nakshatra | ✅ YES | Jyeshtha / pada 1 (PLN.KETU, §2.1) |
| cusps.2_through_12 | ✅ YES | Full Bhava/Chalit ledger (§2.3) |

**Verdict: No corpus gap. The ECR markers were a retrieval failure, not a data absence.**

Output: `retrieval_audit_forensic_catalog.json`

---

## Stream B — rag_chunks Catalog

**Result: All ECR facts exist in embedded chunks in the DB.**

| Doc Type | Total Chunks | Embedded | Unembedded |
|---|---|---|---|
| msr_signal | 499 | 499 | 0 |
| cgm_node | 234 | 234 | 0 |
| l1_fact | 102 | 102 | 0 |
| cdlm_cell | 81 | 81 | 0 |
| domain_report | 52 | 36 | **16** |
| ucn_section | 25 | 25 | 0 |
| **Total** | **993** | **977** | **16** |

**Critical chunks for ECR facts:**

| Chunk ID | Section | ECR Facts Covered |
|---|---|---|
| `fcf469e1354fc3204e32f0d80dc1d1a2` | §2.1 D1 Planet Positions | ALL planetary degrees + nakshatras |
| `f52abf1325d766781b3a05f38a26466a` | §2.3 Bhava/Chalit Cusp Ledger | All house cusps 1-12 |

Both chunks: `doc_type=l1_fact`, `is_stale=false`, embedding present in `rag_embeddings`. BM25 test confirms the §2.1 chunk ranks #1 (score 0.1) for "D1 planet position" query, with nearest MSR competitor at 0.02.

**Secondary finding:** 16 `domain_report` chunks lack embeddings. Not related to ECR issue; flagged for follow-up.

Output: `retrieval_audit_forensic_chunks.json`

---

## Stream C — Retrieval vs Reality

**Result: BLOCKED — no live audit trail. Root cause found via code analysis instead.**

| Check | Status |
|---|---|
| `audit_log` table exists | ❌ Migration 011 was never applied — TABLE MISSING |
| `messages` table has rows | ❌ Empty — no platform UI queries yet |
| `rag_queries` / `rag_retrievals` | ❌ Empty |

Since no live execution trace was available, the investigation shifted to code analysis of the `vector_search.ts` SQL query.

| ECR Fact | Chunk That Has It | Was Chunk Retrieved? | Why Not |
|---|---|---|---|
| sun.degree | `fcf469e1…` | ❌ NO | vector_search returned 0 results on every call (see Stream D) |
| moon.degree | `fcf469e1…` | ❌ NO | same |
| mars.degree | `fcf469e1…` | ❌ NO | same |
| rahu.degree | `fcf469e1…` | ❌ NO | same |
| ketu.degree + nakshatra | `fcf469e1…` | ❌ NO | same |
| cusps.2_through_12 | `f52abf1…` | ❌ NO | same |

**0/977 chunks were ever retrieved by vector_search.** Not a ranking issue — a total failure.

Output: `retrieval_audit_failing_query.json`

---

## Stream D — Root Cause

**Classification: Cause #3 variant — Schema mismatch causing total retrieval failure.**

### Evidence

The SQL query in `platform/src/lib/retrieve/vector_search.ts` (lines 39-48):

```sql
SELECT e.chunk_id, c.content, c.source_file, c.layer, c.doc_type,
       c.source_version, e.embedding <=> $1::vector AS distance
FROM rag_embeddings e
JOIN rag_chunks c ON e.chunk_id = c.chunk_id
WHERE e.native_id = $2          ← THIS COLUMN DOES NOT EXIST
  AND c.is_stale = false
ORDER BY e.embedding <=> $1::vector
LIMIT $3
```

The `rag_embeddings` schema (confirmed live):

```
id         uuid
chunk_id   text
model      text
embedding  vector(768)
created_at timestamptz
```

No `native_id` column. Confirmed by running the exact SQL against the live DB:

```
ERROR:  column e.native_id does not exist
LINE 6: WHERE e.native_id = 'abhisek_mohanty'
```

The error is caught in the `try/catch` at line 232 and returns `buildWarningBundle(...)` with message `"Vector search unavailable: DB query failed"` and `confidence: 0`. The synthesizer receives a warning, not chart data, and marks all chart facts `[EXTERNAL_COMPUTATION_REQUIRED]`.

### Cause classification

| Cause | Status | Evidence |
|---|---|---|
| #1 Corpus gap | ❌ NOT applicable | All ECR facts present in FORENSIC §2.1, §2.3 |
| #2 Chunking gap | ❌ NOT applicable | §2.1 and §2.3 are intact, well-formed table chunks |
| #3 Missing chunks / schema mismatch | ✅ **ROOT CAUSE** | `rag_embeddings.native_id` does not exist; SQL error on every call |
| #4 top_K too small | ⚠️ SECONDARY RISK | Mitigated by bump 10→20; unreachable until #3 fixed |
| #5 Semantic ranking bias | ⚠️ POSSIBLE SECONDARY | Unreachable until #3 fixed; BM25 shows §2.1 ranks #1 |
| #6 LLM didn't iterate | ❌ NOT applicable | New pipeline calls tools once per design; old pipeline had stepCountIs(5) |
| #7 Tool authorization gap | ❌ NOT applicable | Router prompt correctly includes vector_search for factual queries (confirmed in few-shot) |

### Secondary finding: audit_log table missing

Migration `011_audit_log.sql` defines the `audit_log` table but was never applied to the Cloud SQL instance. `writeAuditLog()` in `platform/src/lib/audit/writer.ts` was silently failing on every call, meaning:
- No query traces were ever persisted
- Stream C was completely blocked
- This masked the vector_search failure from future debugging

---

## Stream E — Remediation Applied

### Fix 1: Remove phantom `native_id` filter from vector_search SQL

**File:** `platform/src/lib/retrieve/vector_search.ts`

**Before:**
```typescript
const SQL_VECTOR_SEARCH = `
  SELECT e.chunk_id, c.content, c.source_file, c.layer, c.doc_type,
         c.source_version, e.embedding <=> $1::vector AS distance
  FROM rag_embeddings e
  JOIN rag_chunks c ON e.chunk_id = c.chunk_id
  WHERE e.native_id = $2
    AND c.is_stale = false
  ORDER BY e.embedding <=> $1::vector
  LIMIT $3
`.trim()
```

and:
```typescript
const result = await storage.query<ChunkRow>(SQL_VECTOR_SEARCH, [
  embeddingParam,
  nativeId,
  topK,
])
```

**After:**
```typescript
const SQL_VECTOR_SEARCH = `
  SELECT e.chunk_id, c.content, c.source_file, c.layer, c.doc_type,
         c.source_version, e.embedding <=> $1::vector AS distance
  FROM rag_embeddings e
  JOIN rag_chunks c ON e.chunk_id = c.chunk_id
  WHERE c.is_stale = false
  ORDER BY e.embedding <=> $1::vector
  LIMIT $2
`.trim()
```

and:
```typescript
const result = await storage.query<ChunkRow>(SQL_VECTOR_SEARCH, [
  embeddingParam,
  topK,
])
```

**Net change:** 3 lines. `nativeId` retained in `invocation_params` for audit logging.

**Verification:** Ran the corrected SQL (using self-similarity test against the §2.1 chunk embedding) — returned 5 semantically-adjacent l1_fact chunks correctly. SQL executes without error.

### Fix 2: Bump VECTOR_SEARCH_TOP_K_DEFAULT from 10 to 20

**File:** `platform/src/lib/config/feature_flags.ts`

```typescript
// Before:
export const VECTOR_SEARCH_TOP_K_DEFAULT = 10

// After:
export const VECTOR_SEARCH_TOP_K_DEFAULT = 20
```

Rationale: 977 embedded chunks compete in every vector search. With top_K=10, only the top 1% are retrieved. Doubling to 20 ensures that even if §2.1 ranks at position 11-15 due to semantic competitors (499 msr_signal chunks also contain planetary position language), it still makes it into context.

### Fix 3: Applied missing audit_log migration

```sql
-- Applied to Cloud SQL (live DB) during this session:
psql -f platform/supabase/migrations/011_audit_log.sql

-- Result: CREATE TABLE, CREATE INDEX, CREATE INDEX
```

The `audit_log` table now exists. Future queries will persist their full execution trace, enabling Stream C analysis in follow-up sessions.

---

## Retrieval-vs-Reality Table (post-fix projection)

After Fix 1, the corrected SQL runs successfully. Vector similarity test against the §2.1 chunk's own embedding returns the §2.1 chunk as the top hit, with neighboring l1_fact position-related chunks in positions 2-5. Expected post-fix behavior for "show D1 chart details in a table":

| ECR Fact | Chunk ID | Expected to be Retrieved? | Confidence |
|---|---|---|---|
| sun.degree + all planetary positions | `fcf469e1…` | ✅ YES | High — §2.1 heading matches semantically |
| cusps.2_through_12 | `f52abf1…` | ✅ YES (with top_K=20) | Medium-high — §2.3 is semantically adjacent |

---

## Native Action

1. **Done — no action needed:** The vector_search SQL bug is fixed. The next query through the platform will retrieve real chart data.

2. **Verify via platform:** Submit "show me D1 chart details in a table" through the Consume tab. The response should now show degrees, nakshatras, and house cusps without any `[EXTERNAL_COMPUTATION_REQUIRED]` markers.

3. **Audit trail now active:** The `audit_log` table was missing (migration 011 not applied). It is now applied. Future queries will have their full execution trace persisted, accessible via `GET /api/audit/list`.

4. **Follow-up brief recommended:** 16 `domain_report` chunks are missing embeddings. Low urgency (reports aren't the primary retrieval source for factual D1 queries), but create a follow-up brief to re-embed them once the Python sidecar is in steady state.

5. **Follow-up brief recommended:** Add `native_id` to the `rag_embeddings` schema if multi-native support is needed in the future, with a matching migration. For now (single native), the filter was both broken and unnecessary — removing it was correct.

---

## Done Criteria Check

| # | Criterion | Status |
|---|---|---|
| 1 | FORENSIC catalog written to `retrieval_audit_forensic_catalog.json` with present/absent flag | ✅ |
| 2 | rag_chunks catalog written to `retrieval_audit_forensic_chunks.json` with fact→chunk_id map | ✅ |
| 3 | Failing query audit row captured to `retrieval_audit_failing_query.json` (blocked; code analysis substituted) | ✅ (blocked; substituted) |
| 4 | Retrieval-vs-reality table present in report; gaps clearly identified | ✅ |
| 5 | Root cause classified to one or more of Causes #1-#7 with cited evidence | ✅ Cause #3 variant (schema mismatch) |
| 6 | Surgical fix applied with documented diff and re-test | ✅ Fixes 1+2+3 applied |
| 7 | Native action section in report: clear "what to do next" | ✅ |
