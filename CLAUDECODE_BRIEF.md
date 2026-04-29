---
artifact: CLAUDECODE_BRIEF_PLATFORM_HYGIENE_2026-04-29.md
status: PENDING
authored_on: 2026-04-29
authored_by: Cowork (Claude Sonnet 4.6)
authored_during: "Platform hygiene — H.2 + M.1 + M.2 verification"
governing_clause: CLAUDE.md §C item 0 — overrides items 1–11 for the duration of this session
target_executor: Claude Code (CLI), Sonnet 4.6
session_class: Platform infrastructure (not a PHASE_B_PLAN execution session)
---

# CLAUDECODE_BRIEF — Platform Hygiene: H.2 + M.1 + M.2

## Background

This session closes three items from the PIPELINE_SMOKE_AUDIT_REPORT_2026-04-29.md.
It is a pure platform session — no corpus artifacts are touched.

### Pre-read: what was already verified in Cowork before this Brief was written

**M.2 — ALREADY FIXED. No action required.**
`vector_search.ts` already hard-fails with a clear error if `VERTEX_AI_LOCATION` is unset.
The smoke audit finding was based on a stale code reading. Verify this and document it as closed.
Verification: check that `platform/src/lib/retrieve/vector_search.ts` contains `throw new Error`
(not `?? 'us-central1'`) in the `VERTEX_AI_LOCATION` branch. If so, annotate the finding closed
and proceed to H.2 and M.1 — no code change needed.

**H.2 — BUILD_STATE_GCS_BASE is unset; `dataSource.ts` falls back to a nonexistent bucket.**
- `platform/src/lib/build/dataSource.ts` lines 4–6: fallback is
  `'https://storage.googleapis.com/marsys-jis-build-state'` — this bucket does not exist.
- `platform/.env.local` line 50: `BUILD_STATE_GCS_BASE` is commented out.
- The existing `madhav-marsys-build-artifacts` bucket (already used by the build pipeline) is the
  right place to host build-state JSON until a dedicated bucket is provisioned.
- Fix: (a) replace the silent `??` fallback in `dataSource.ts` with a hard-fail throw,
  (b) create a minimal valid `build-state.json` in `gs://madhav-marsys-build-artifacts/`,
  (c) set `BUILD_STATE_GCS_BASE=https://storage.googleapis.com/madhav-marsys-build-artifacts`
  in `.env.local` and Cloud Run.

**M.1 — `temporal.ts` callSidecar constructs `'undefined/transits'` if PYTHON_SIDECAR_URL unset.**
- `platform/src/lib/retrieve/temporal.ts` line 20: `const url = \`${process.env.PYTHON_SIDECAR_URL}${endpoint}\``
- If `PYTHON_SIDECAR_URL` is unset, `url` becomes `'undefined/transits'` — a confusing string
  that throws a `TypeError: Failed to parse URL` inside `fetch()`, which is then caught by the
  outer `try/catch` and silently returns a warning bundle.
- The degradation is graceful but the root cause is invisible. Fix: add a null check at the top
  of `callSidecar` that throws a clear error before any URL construction.
- `compute/[type]/route.ts` already has a proper `if (!sidecarUrl)` guard — no change needed there.

---

## may_touch

```
platform/src/lib/build/dataSource.ts
platform/src/lib/retrieve/temporal.ts
platform/.env.local
```

## must_not_touch

```
platform/src/lib/retrieve/vector_search.ts       <- M.2 already fixed; verify only
platform/src/lib/retrieve/cgm_graph_walk.ts
platform/migrations/**
01_FACTS_LAYER/**
025_HOLISTIC_SYNTHESIS/**
035_DISCOVERY_LAYER/**
00_ARCHITECTURE/**
platform/src/lib/retrieve/__tests__/**
```

---

## Implementation Steps

### Step 0 — Verify M.2 is already closed

```bash
grep -n 'VERTEX_AI_LOCATION' platform/src/lib/retrieve/vector_search.ts
```

Expected: a line containing `throw new Error` (not `?? 'us-central1'`).
If confirmed, M.2 requires no code change. Proceed to Step 1.
If NOT confirmed (fallback still present), fix it before continuing:
replace `process.env.VERTEX_AI_LOCATION ?? 'us-central1'` with:
```typescript
const location = process.env.VERTEX_AI_LOCATION
if (!location) {
  throw new Error(
    'VERTEX_AI_LOCATION env var not set — refusing to fall back to wrong region ' +
    '(would corrupt vector similarity against asia-south1 embeddings)'
  )
}
```

---

### Step 1 — Fix dataSource.ts: hard-fail on missing BUILD_STATE_GCS_BASE

In `platform/src/lib/build/dataSource.ts`, replace lines 4–6:

**Before:**
```typescript
const GCS_BASE =
  process.env.BUILD_STATE_GCS_BASE ??
  'https://storage.googleapis.com/marsys-jis-build-state'
```

**After:**
```typescript
const _buildStateBase = process.env.BUILD_STATE_GCS_BASE
if (!_buildStateBase) {
  throw new Error(
    'BUILD_STATE_GCS_BASE env var not set — build dashboard will not function. ' +
    'Set to https://storage.googleapis.com/madhav-marsys-build-artifacts or a dedicated bucket.'
  )
}
const GCS_BASE = _buildStateBase
```

---

### Step 2 — Fix temporal.ts: clear error if PYTHON_SIDECAR_URL unset

In `platform/src/lib/retrieve/temporal.ts`, replace the `callSidecar` function (lines 19–28):

**Before:**
```typescript
async function callSidecar(endpoint: string, body: object): Promise<unknown> {
  const url = `${process.env.PYTHON_SIDECAR_URL}${endpoint}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Sidecar ${endpoint} returned ${res.status}`)
  return await res.json()
}
```

**After:**
```typescript
async function callSidecar(endpoint: string, body: object): Promise<unknown> {
  const baseUrl = process.env.PYTHON_SIDECAR_URL
  if (!baseUrl) {
    throw new Error(
      'PYTHON_SIDECAR_URL env var not set — sidecar call to ' + endpoint + ' will fail'
    )
  }
  const url = `${baseUrl}${endpoint}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Sidecar ${endpoint} returned ${res.status}`)
  return await res.json()
}
```

Note: the outer `try/catch` in `retrieve()` still catches this and returns a graceful warning
bundle — the change only makes the error message clear instead of producing a confusing
TypeError about an unparseable URL.

---

### Step 3 — Determine BuildState type and create minimal build-state.json

Read `platform/src/lib/build/types.ts` to find the `BuildState` interface.
Create a minimal valid `build-state.json` that satisfies the type with sensible stub values.
Then upload:

```bash
gsutil cp /tmp/build-state.json gs://madhav-marsys-build-artifacts/build-state.json
```

Verify:
```bash
gsutil ls gs://madhav-marsys-build-artifacts/build-state.json
gsutil cat gs://madhav-marsys-build-artifacts/build-state.json
```

---

### Step 4 — Set BUILD_STATE_GCS_BASE in .env.local

In `platform/.env.local`, replace line 50:

**Before:**
```
# BUILD_STATE_GCS_BASE=https://storage.googleapis.com/marsys-jis-build-state
```

**After:**
```
BUILD_STATE_GCS_BASE=https://storage.googleapis.com/madhav-marsys-build-artifacts
```

---

### Step 5 — Set BUILD_STATE_GCS_BASE in Cloud Run

```bash
gcloud run services update amjis-web \
  --region asia-south1 \
  --project madhav-astrology \
  --update-env-vars "BUILD_STATE_GCS_BASE=https://storage.googleapis.com/madhav-marsys-build-artifacts"
```

Confirm the new revision is serving:
```bash
gcloud run revisions list \
  --service amjis-web \
  --region asia-south1 \
  --project madhav-astrology \
  --limit 3
```

---

### Step 6 — Run npm tests

```bash
cd platform && npm test
```

Or directly:
```bash
cd platform && npx vitest run --reporter=verbose
```

All tests must pass. The `dataSource.ts` and `temporal.ts` changes are code-only and do not
break existing test assertions. If any `temporal.ts` test fails because it no longer expects
the `TypeError` path, update the test mock to ensure `PYTHON_SIDECAR_URL` is set:
```typescript
process.env.PYTHON_SIDECAR_URL = 'http://localhost:8000'
```
(This mock is already present in the existing test file — tests should pass as-is.)

---

### Step 7 — Rebuild and redeploy

The `dataSource.ts` code change requires a new image:

```bash
cd platform
gcloud builds submit \
  --config cloudbuild.yaml \
  --project madhav-astrology

gcloud run deploy amjis-web \
  --image asia-south1-docker.pkg.dev/madhav-astrology/amjis/amjis-web:latest \
  --region asia-south1 \
  --project madhav-astrology \
  --quiet
```

---

### Step 8 — Smoke verify

```bash
# Confirm build-state.json is publicly readable from GCS
curl -s "https://storage.googleapis.com/madhav-marsys-build-artifacts/build-state.json" | head -5

# Full pipeline smoke audit — all 10 tools must remain PASS
cd platform && python3 scripts/pipeline_smoke_audit.py
```

---

## Acceptance Criteria

| # | Criterion | How to verify |
|---|-----------|---------------|
| AC.1 | M.2 confirmed already fixed — `vector_search.ts` has `throw new Error`, not `?? 'us-central1'` | grep output in Step 0 |
| AC.2 | `dataSource.ts` throws `Error` (not falls back) when `BUILD_STATE_GCS_BASE` unset | Code review |
| AC.3 | `temporal.ts` `callSidecar` throws clear error naming the missing env var | Code review |
| AC.4 | `build-state.json` exists at `gs://madhav-marsys-build-artifacts/build-state.json` | gsutil ls |
| AC.5 | `BUILD_STATE_GCS_BASE` set in `platform/.env.local` (uncommented, correct URL) | File review |
| AC.6 | `BUILD_STATE_GCS_BASE` set in Cloud Run `amjis-web` env vars | gcloud describe |
| AC.7 | `npm test` — all tests green, no regressions | Test runner output |
| AC.8 | Cloud Run `amjis-web` new revision serving 100% traffic | gcloud revisions list |
| AC.9 | Smoke audit — all 10 tools PASS, no regressions | Smoke audit output |

Set `status: COMPLETE` in this file's frontmatter when all 9 ACs are met.

---

## Execution order summary

```
Step 0  — Verify M.2 already fixed (grep only, no edit)
Step 1  — Fix dataSource.ts (hard-fail on missing BUILD_STATE_GCS_BASE)
Step 2  — Fix temporal.ts (clear error in callSidecar)
Step 3  — Read BuildState type; create + upload build-state.json to GCS
Step 4  — Uncomment BUILD_STATE_GCS_BASE in .env.local
Step 5  — Set BUILD_STATE_GCS_BASE in Cloud Run via --update-env-vars  [REQUIRES: gcloud auth]
Step 6  — Run npm test
Step 7  — gcloud builds submit + gcloud run deploy                     [REQUIRES: gcloud auth]
Step 8  — Smoke verify: curl GCS + run pipeline_smoke_audit.py         [REQUIRES: Auth Proxy :5433]
```

Steps 0–4 are pure file reads/writes — no external dependencies.
Steps 5, 7, 8 (gcloud) require gcloud CLI authenticated.
Step 8 (smoke audit) requires Auth Proxy running locally on port 5433.
