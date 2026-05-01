---
phase: A.3
title: Environment Variables Audit
status: COMPLETE
executed_at: 2026-04-28
executor: Claude Code (Sonnet 4.6)
verdict: AMBER — 3 silent-failure risks found; 2 minor gaps
---

# A.3 — Environment Variables Audit

## Full Matrix

| Env Var | Code reads? | .env.example | .env.local | Prod (Cloud Run) | Finding |
|---|---|---|---|---|---|
| ANTHROPIC_API_KEY | ✅ | ✅ | ✅ | ✅ (secret) | OK |
| BUILD_STATE_GCS_BASE | ✅ | ❌ | ❌ | ❌ | ⚠️ Uses code fallback default |
| DATABASE_URL | ✅ | ✅ | ✅ | ❌ | OK (prod uses DB_USER+DB_PASSWORD+INSTANCE) |
| DB_NAME | ✅ | ✅ | ✅ | ✅ | OK |
| DB_PASSWORD | ✅ | ✅ | ❌ | ✅ (secret) | ⚠️ Not standalone in .env.local; dev reads it embedded in DATABASE_URL |
| DB_USER | ✅ | ✅ | ✅ | ✅ | OK |
| DEEPSEEK_API_KEY | ✅ | ✅ | ✅ | ✅ (secret) | OK |
| FIREBASE_ADMIN_CREDENTIALS | ✅ | ✅ | ✅ | ✅ (secret) | OK |
| GCP_PROJECT | ✅ | ✅ | ✅ | ✅ | OK |
| GCS_BUCKET_CHAT_ATTACHMENTS | ✅ | ❌ | ❌ | ✅ | ❌ **DEV GAP** — runtime failure if storage called in dev |
| GCS_BUCKET_CHART_DOCUMENTS | ✅ | ❌ | ❌ | ✅ | ❌ **DEV GAP** — runtime failure if storage called in dev |
| GOOGLE_GENERATIVE_AI_API_KEY | ✅ (via AI SDK) | ✅ | ✅ | ✅ (secret) | OK |
| INSTANCE_CONNECTION_NAME | ✅ | ✅ | ✅ | ✅ | OK |
| NEXT_PUBLIC_FIREBASE_* (6 vars) | ✅ | ✅ | ✅ | ✅ | OK |
| NEXT_PUBLIC_SIDECAR_URL | ✅ | ❌ | ❌ | ❌ | ⚠️ Code defaults to `http://localhost:8000` — acceptable for dev; prod uses PYTHON_SIDECAR_URL (server-side only) |
| NODE_ENV | ✅ | — | — | ✅ | OK (set by framework) |
| OPENAI_API_KEY | ✅ (via @ai-sdk/openai) | ✅ | ❌ | ❌ | ❌ Missing — panel mode blocked (see A.1) |
| PYTHON_SIDECAR_API_KEY | ✅ | ✅ | ✅ | ✅ (secret) | OK |
| PYTHON_SIDECAR_URL | ✅ | ❌ | ✅ | ✅ | OK |
| SIDECAR_API_KEY | ✅ | ❌ | ❌ | ❌ | ❌ **SILENT BUG** — see below |
| SUPER_ADMIN_EMAIL | ✅ | ✅ | ✅ | ✅ (secret) | OK |
| VERTEX_AI_LOCATION | ✅ | ❌ | ✅ | ❌ | ⚠️ Prod defaults to us-central1; instance is asia-south1 |

## Critical Findings

### FINDING A3.1 — SIDECAR_API_KEY (SILENT BUG, MEDIUM PRIORITY)
**File:** `platform/src/lib/rag/routerClient.ts:29`, `retrieveClient.ts:30`, `synthesizeClient.ts:34`

Code reads `process.env.SIDECAR_API_KEY` (without `PYTHON_` prefix) with `?? ""` fallback. This is a **different key name** from `PYTHON_SIDECAR_API_KEY` which is what the sidecar checks.

Result: rag pipeline clients (`routerClient`, `retrieveClient`, `synthesizeClient`) make all requests to the Python sidecar **without authentication** (`x-api-key` header is empty string → header omitted). The sidecar may accept unauthenticated requests in dev, masking the bug. In prod, unauthenticated sidecar calls fail or bypass auth.

**Fix:** Either rename env var in .env.local + prod to `SIDECAR_API_KEY`, or align the code to read `PYTHON_SIDECAR_API_KEY` consistently. The latter is preferred (avoids a new env var in prod).

### FINDING A3.2 — GCS_BUCKET_* missing from dev (LOW-MEDIUM PRIORITY)
Code at `platform/src/lib/storage/client.ts:11,15` uses `process.env.GCS_BUCKET_CHAT_ATTACHMENTS!` with non-null assertion. In dev, this is `undefined` — any call to `getChatAttachmentsBucket()` or `getChartDocumentsBucket()` will throw.

**Fix:** Add to `.env.local` and `.env.example`:
```
GCS_BUCKET_CHAT_ATTACHMENTS=madhav-astrology-chat-attachments
GCS_BUCKET_CHART_DOCUMENTS=madhav-astrology-chart-documents
```

### FINDING A3.3 — VERTEX_AI_LOCATION not in prod (LOW PRIORITY)
Prod Cloud Run env does not set `VERTEX_AI_LOCATION`. Code at `vector_search.ts` reads this var; if absent, Vertex AI client may default to `us-central1` instead of `asia-south1` where the instance lives. Higher latency.

**Fix:** Add `VERTEX_AI_LOCATION=asia-south1` to Cloud Run service env (or set as secret).

## Deprecated vars present in .env.local
- `ASTROLOGER_EMAIL` — in .env.local but not in .env.example or code; likely remnant from earlier phase. Low priority cleanup.
