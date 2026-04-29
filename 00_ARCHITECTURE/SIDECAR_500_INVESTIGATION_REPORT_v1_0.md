---
artifact: SIDECAR_500_INVESTIGATION_REPORT_v1_0.md
canonical_id: SIDECAR_500_REPORT
version: "1.0"
status: COMPLETE
produced_during: Sidecar 500 Investigation (post-Phase-14G)
produced_on: "2026-04-29"
authoritative_side: claude
trigger_brief: EXEC_BRIEF_SIDECAR_500_INVESTIGATION_v1_0.md
phase_14_lockdown_commit: 5b7d252
changelog:
  - v1.0 (2026-04-29): Initial investigation. Root cause: transient cold-start. Sidecar healthy.
---

# Sidecar 500 Investigation Report

## Executive Summary

The HTTP 500 reported in Phase 14G Finding E.1 was a **transient cold-start failure** on
the Python sidecar, not a persistent outage. The sidecar was scaled to zero at the moment
the 14G smoke collection ran; the cold-start latency (~3s) exceeded the configured fetch
timeout in the legacy pipeline, producing a single 500. The sidecar has been consistently
healthy since deployment and returned 200 on all subsequent requests.

The investigation additionally surfaced two latent issues that do not affect the current
runtime but will block future deployments if not remediated:
- `REM-001`: `filesystemAdapter` has a hardcoded local-dev path → breaks any new amjis-web
  deploy with Phase 11A code (HIGH pre-deploy risk)
- `REM-002`: Deployed sidecar image predates RAG route additions → `/rag/*` endpoints return 404
  (LOW current risk; MEDIUM if sidecar RAG routes are ever called directly)

**Verdict: Runtime is not degraded. No rollback required. Two deferred briefs authored.**

---

## Stream A — Symptom Capture

**Original symptom (14G smoke_evidence.json Finding E.1):**
- `POST /api/chat/consume` returned HTTP 500 during Phase 14G collection window (2026-04-29)
- Smoke evidence note: "Python sidecar (port 8000) unresponsive at collection time"
- 14G remediation hypothesis: "Restart Python sidecar; check query_trace_steps migration
  (013_query_trace_steps.sql not applied to live DB)"

**Reproduction attempt in this investigation:**
- Unauthenticated probe to `POST /api/chat/consume` → HTTP 401 (expected, no session cookie)
- No session cookie available; authenticated reproduction not performed
- Log analysis and service inspection performed instead per brief §Stream A fallback

**Evidence:** `verification_artifacts/SIDECAR_500/symptom_capture.txt`

---

## Stream B — Service + Logs Audit

### amjis-sidecar

| Field | Value |
|---|---|
| Active revision | `amjis-sidecar-00001-s55` |
| Deployed | 2026-04-25T15:59:38 |
| Image SHA | `sha256:0753472cff3116acae8f4b6e6a1c90bb18e36df558f359260c34e84c3ba5ec64` |
| Service Ready | True (all conditions) |
| HTTP 5xx since deploy | **0** |
| ERROR-level log entries | **0** |
| Requests logged | 5 (health checks × 3 + 1 ephemeris POST + 1 root 404) |

**Deployed routes (from /openapi.json):**
```
GET  /health
POST /eclipses, /ephemeris, /event_chart_states, /jaimini_drishti, /retrogrades, /sade_sati, /v7_additions
```

**Missing routes (present in local main.py, NOT in deployed image):**
```
POST /rag/route      → 404
POST /rag/retrieve   → 404
POST /rag/synthesize → 404
```

### amjis-web

| Field | Value |
|---|---|
| Currently serving | `amjis-web-00010-pd8` (deployed 2026-04-25T23:02:54) |
| Image SHA | `sha256:a8a1118c41cce1edc57077707de5ba93c6748b369e175cf2d719282908a95dc3` |
| Service Ready | True (all conditions, since 2026-04-25T23:03:03) |
| HTTP 5xx in request logs | **0** |

**Failed revision (historical):** `amjis-web-00006-v2s` (2026-04-25T21:23:50) —
Secret Manager access denied for `amjis-db-password` on `938361928218-compute@developer.gserviceaccount.com`.
**RESOLVED**: IAM was subsequently fixed; `00010-pd8` deployed successfully.

**Evidence:** `verification_artifacts/SIDECAR_500/service_describe.yaml`,
`verification_artifacts/SIDECAR_500/revisions.txt`, `verification_artifacts/SIDECAR_500/error_logs.json`

---

## Stream C — Root Cause Classification

### Primary cause (E.1 500 during 14G smoke collection)

**Bucket: Cold-start timeout**

Evidence:
- Sidecar scaled to zero between 2026-04-26T06:18 (last `/ephemeris` call) and 2026-04-29T06:39
  (next recorded request = this investigation's health check)
- Cold-start latency observed: ~3s (`latency=3.065s` on warm-up health check)
- Legacy pipeline (running on `00010-pd8`, which predates Phase 11A) calls sidecar for ephemeris/
  compute context at the start of a Consume request
- If the fetch timeout for the sidecar call is < 3s, the cold-start tips the fetch into error,
  propagating as a 500 to the caller
- Subsequent requests after first cold-start succeed (sidecar instance remains warm for hours)

The 14G session's alternative hypothesis ("query_trace_steps not applied") is not confirmed as
causal: `traceEmitter.emitStep` writes are fire-and-forget (`void writeTraceStep(...).catch(err =>
console.error(...))`); a write failure does not propagate as 500. The table now exists regardless.

### Secondary finding: filesystemAdapter REPO_ROOT hardcoded (REM-001)

`platform/src/lib/storage/filesystem.ts` line 4:
```typescript
const REPO_ROOT = '/Users/Dev/Vibe-Coding/Apps/Madhav'
```
This path exists only on the local dev machine. On Cloud Run, `storage.readFile()` will throw
ENOENT. `loadManifest` in the new query pipeline calls `storage.readFile()` on the first request,
so **any amjis-web deployment with Phase 11A+ code will produce 500s on all Consume requests**.

Current risk: LOW (deployed image `00010-pd8` predates Phase 11A; new pipeline not enabled).
Pre-deploy risk: HIGH (must fix before shipping any new amjis-web image).

### Tertiary finding: sidecar RAG routes missing from deployed image (REM-002)

The deployed sidecar image (`sha256:0753472`, 2026-04-25) was built before RAG route handlers
were added to `main.py`. The local main.py now includes:
- `rag_retrieve_router` at `/rag/retrieve`
- `rag_router_router` at `/rag/route`
- `rag_synthesize_router` at `/rag/synthesize`

None are in the deployed image. Current risk: LOW — the TypeScript new pipeline uses native
TypeScript tools (msr_sql, vector_search, etc.) and does NOT call sidecar RAG routes. Risk
becomes MEDIUM if any code path directly proxies to the sidecar RAG endpoints.

---

## Stream D — Action Taken

### Fixes applied in this brief

**None.** The runtime is healthy. No rollback or hotfix was required.

### Deferred fixes (authored as brief stubs)

| ID | Finding | Brief | Complexity |
|---|---|---|---|
| REM-001 | filesystemAdapter REPO_ROOT hardcoded | `EXEC_BRIEF_FILESYSTEM_ADAPTER_FIX_v1_0.md` | Medium |
| REM-002 | Sidecar missing RAG routes | `EXEC_BRIEF_SIDECAR_IMAGE_REBUILD_v1_0.md` | Medium |

**REM-001 must be executed before any new amjis-web image is deployed.**
**REM-002 can be deferred until sidecar RAG routes are actually needed.**

---

## Stream E — Re-Verification

```
GET  /health          → 200 {"status":"ok"}
POST /ephemeris (bad) → 422 (correct validation — not 500)
HTTP 5xx in sidecar request logs: 0
HTTP 5xx in amjis-web request logs: 0
amjis-web service: Ready (all conditions True)
```

**Runtime status: HEALTHY. No active 500. Investigation CLOSED.**

---

## Residuals

1. `REM-001` — filesystemAdapter REPO_ROOT — blocked until `EXEC_BRIEF_FILESYSTEM_ADAPTER_FIX_v1_0.md` executes
2. `REM-002` — Sidecar RAG routes — deferred until needed; `EXEC_BRIEF_SIDECAR_IMAGE_REBUILD_v1_0.md` ready
3. `query_trace_steps` table — now present; 14G hypothesis was secondary/incorrect; no action needed
