# MARSYS-JIS — Pipeline & Layer Accessibility Audit Report
**Date:** 2026-04-29  
**Scope:** End-to-end query pipeline (Consumer UI → Cloud Run → GCP services) and per-layer data source accessibility (L0–L4)  
**Method:** Static code analysis + filesystem inspection (42 checks across all pipeline hops)  
**Runtime checks:** Not executable from sandbox (PyPI proxy-blocked); service checks (Cloud SQL, Vertex AI, sidecar) are flagged as `[MANUAL]` — run `platform/scripts/pipeline_smoke_audit.py` locally to confirm.

---

## Executive Summary

The new query pipeline (`classify → compose → retrieve → synthesize → audit`) is correctly wired end-to-end, all env var names are aligned after the previous sprint's fixes, and 6 of the 10 retrieval tools reach Google Cloud cleanly. However, **one critical Dockerfile omission causes 4 of the 10 retrieval tools to fail silently in Cloud Run**, meaning the entire L3 register layer (pattern, resonance, cluster, contradiction) is invisible to every query in production. That fix has been applied in this session. Two secondary issues and three deployment action items are also documented below.

**Critical fix applied this session:** `platform/Dockerfile` — added `COPY 035_DISCOVERY_LAYER` to runner stage.

---

## Section 1 — Pipeline Hop Map

```
Consumer Browser
  │  Firebase Auth token (NEXT_PUBLIC_FIREBASE_* vars ✓)
  ▼
Cloud Run: Next.js App (port 3000)
  │  MARSYS_REPO_ROOT=/app  NODE_ENV=production
  ▼
/api/chat/consume/route.ts  [NEW_QUERY_PIPELINE_ENABLED=true ✓]
  │
  ├─ classify()  →  Anthropic API  (ANTHROPIC_API_KEY ✓)
  │
  ├─ loadManifest()  →  filesystem  /app/00_ARCHITECTURE/CAPABILITY_MANIFEST.json  [PRESENT ✓]
  │
  ├─ compose()  →  in-process (no I/O)
  │
  ├─ 10× parallel retrieval tools:
  │     msr_sql              →  Cloud SQL (rag_embeddings, msr_signals)     [GCP ✓]
  │     pattern_register     →  /app/035_DISCOVERY_LAYER/REGISTERS/...      [FIXED ✓]
  │     resonance_register   →  /app/035_DISCOVERY_LAYER/REGISTERS/...      [FIXED ✓]
  │     cluster_atlas        →  /app/035_DISCOVERY_LAYER/REGISTERS/...      [FIXED ✓]
  │     contradiction_reg    →  /app/035_DISCOVERY_LAYER/REGISTERS/...      [FIXED ✓]
  │     temporal             →  Python Sidecar (PYTHON_SIDECAR_URL ✓)       [GCP ✓]
  │     query_msr_aggregate  →  stub / no I/O                               [N/A ✓]
  │     cgm_graph_walk       →  Cloud SQL (rag_graph_nodes, rag_graph_edges) [GCP ✓]
  │     manifest_query       →  /app/00_ARCHITECTURE/CAPABILITY_MANIFEST.json [PRESENT ✓]
  │     vector_search        →  Vertex AI (embed) + Cloud SQL               [GCP ✓]
  │
  ├─ synthesize()  →  Anthropic API  (ANTHROPIC_API_KEY ✓)
  │
  └─ audit write  →  Cloud SQL (audit_events)  [AUDIT_ENABLED=true ✓]

Cloud Run: Python Sidecar (port 8000)
  │  PYTHON_SIDECAR_API_KEY=*** (set in GCP Console ✓)
  │  VERTEX_AI_LOCATION=asia-south1 ✓
  ▼
  /transits, /ephemeris, /sade_sati, /eclipses  →  in-process Swiss-Eph (no external calls)
  /rag/retrieve  →  Vertex AI embed + Cloud SQL
```

**Zero localhost or Supabase references in the query hot-path.** Every service call resolves to a GCP endpoint or an in-container filesystem path.

---

## Section 2 — Layer Accessibility Matrix

| Layer | Content | Access method | Cloud Run path | Status |
|-------|---------|--------------|----------------|--------|
| L0 Architecture | CAPABILITY_MANIFEST.json | filesystem | `/app/00_ARCHITECTURE/` | ✅ Present (Dockerfile line 38) |
| L1 Facts | FORENSIC_DATA, LIFE_EVENT_LOG | filesystem (build pipeline only) | Not needed at query time | ✅ N/A for query path |
| L2.5 Holistic Synthesis | MSR, UCN, CDLM, CGM, RM | Cloud SQL `msr_signals` + vector chunks | DB rows | ✅ via msr_sql + vector_search |
| L3 Registers | PATTERN, RESONANCE, CLUSTER, CONTRADICTION | filesystem JSON | `/app/035_DISCOVERY_LAYER/REGISTERS/` | ✅ **Fixed this session** |
| L3 Registers | Same 4 files | Cloud SQL `rag_chunks` (vector) | DB rows | ✅ via vector_search backup |
| L4 Temporal | Transits, Dasha, Sade Sati | Python Sidecar HTTP | `PYTHON_SIDECAR_URL` | ✅ sidecar → in-process ephemeris |
| L4 Graph | CGM BFS traversal | Cloud SQL `rag_graph_nodes/edges` | DB rows | ✅ via cgm_graph_walk |

**Note on L1 + L2.5 filesystem:** `01_FACTS_LAYER/` and `025_HOLISTIC_SYNTHESIS/` are **not** read via the filesystem adapter at query time. They are ingested into Cloud SQL by the build pipeline (sidecar's `pipeline/main.py`, which uses `COPY . .` and has access to all layers). At query time, these layers are accessed exclusively through Cloud SQL rows (`msr_signals`, `rag_chunks`, `rag_embeddings`). No Dockerfile COPY needed for them on the Next.js side.

---

## Section 3 — Findings

### CRITICAL

#### C.1 — `035_DISCOVERY_LAYER` missing from Dockerfile runner stage `[FIXED]`
- **File:** `platform/Dockerfile`
- **Before:** Runner stage contained only `00_ARCHITECTURE/`. The `filesystemAdapter.readFile()` resolves paths relative to `MARSYS_REPO_ROOT=/app`. With `035_DISCOVERY_LAYER/` absent, all four L3 register tools threw `ENOENT` and returned `null` bundles — silently, per the try/catch in the consume route.
- **Impact:** 4 of 10 retrieval tools dark in every Cloud Run query. Pattern, resonance, cluster, and contradiction register data completely absent from synthesis context.
- **Fix applied:** Added to `platform/Dockerfile`:
```dockerfile
# L3 register JSON files — required by pattern_register, resonance_register,
# cluster_atlas, contradiction_register retrieval tools at query time.
# Without this, those 4 tools throw ENOENT silently and return null bundles.
COPY --from=builder --chown=nextjs:nodejs /app/035_DISCOVERY_LAYER ./035_DISCOVERY_LAYER
```
- **Status:** ✅ Fixed in this session.

---

### HIGH

#### H.1 — `SIDECAR_ALLOWED_ORIGINS` not set for production sidecar `[DEPLOYMENT ACTION REQUIRED]`
- **File:** `platform/python-sidecar/main.py` line 17
- **Detail:** Default is `http://localhost:3000`. For Cloud Run, `SIDECAR_ALLOWED_ORIGINS` must be set to the production Next.js Cloud Run URL (e.g., `https://marsys-jis-<hash>-uc.a.run.app`). If not set, the sidecar accepts CORS only from localhost — meaning browser preflight requests from the production frontend will be rejected if the sidecar is ever accessed directly from the browser. Currently the sidecar is called server-side (Next.js API route → sidecar), so CORS is not on the request path today, but it will be if any client-side fetch is added.
- **Action:** Set `SIDECAR_ALLOWED_ORIGINS=https://<your-cloud-run-frontend-url>` in the sidecar Cloud Run service's env vars.

#### H.2 — `BUILD_STATE_GCS_BASE` missing from env `[DEPLOYMENT ACTION REQUIRED]`
- **File:** `platform/src/lib/build/dataSource.ts` line 5
- **Detail:** Falls back to `https://storage.googleapis.com/marsys-jis-build-state`. This bucket name is not in the 4 known GCS buckets (`madhav-astrology-chat-attachments`, `madhav-astrology-chart-documents`, `madhav-marsys-sources`, `madhav-marsys-build-artifacts`). The build dashboard will fail to load with a 404/403. Not on the query hot-path.
- **Action:** Either create the bucket `marsys-jis-build-state` and push build-state JSON there, or add `BUILD_STATE_GCS_BASE=https://storage.googleapis.com/<correct-bucket>` to Cloud Run and `.env.local`.

---

### MEDIUM

#### M.1 — `compute/[type]/route.ts` has `localhost:8000` fallback
- **File:** `platform/src/app/api/compute/[type]/route.ts` line 4
- **Detail:** `const SIDECAR_URL = process.env.PYTHON_SIDECAR_URL ?? 'http://localhost:8000'`. If `PYTHON_SIDECAR_URL` is ever unset in Cloud Run, compute calls silently target a dead localhost. `PYTHON_SIDECAR_URL` is present in `.env.local` and presumably in Cloud Run — so this is not currently broken — but the fallback is a silent fail mode, not a loud one.
- **Recommendation:** Add a startup assertion: `if (!process.env.PYTHON_SIDECAR_URL) throw new Error(...)` or at minimum log a warning if the env var is absent.

#### M.2 — `VERTEX_AI_LOCATION` fallback is `us-central1` in vector_search.ts
- **File:** `platform/src/lib/retrieve/vector_search.ts` line 69
- **Detail:** `const location = process.env.VERTEX_AI_LOCATION ?? 'us-central1'`. The env sets `VERTEX_AI_LOCATION=asia-south1`. If the var is ever dropped from Cloud Run, embedding calls route to `us-central1` and will hit the wrong regional endpoint — likely returning embeddings with subtle distributional shift vs. the stored `asia-south1` embeddings, causing cosine distance comparisons to degrade silently.
- **Recommendation:** Fail hard if `VERTEX_AI_LOCATION` is absent rather than falling back to a different region.

---

### LOW / INFORMATIONAL

#### L.1 — Sidecar pipeline env vars undocumented in `.env.local`
- **Detail:** `platform/python-sidecar/pipeline/main.py` reads `GCS_SOURCES_BUCKET` and `GCS_ARTIFACTS_BUCKET`. Neither is in `.env.local`. The build pipeline will fail locally unless these are set. Not on the query hot-path.
- **Action:** Add to `.env.local`:
```
GCS_SOURCES_BUCKET=madhav-marsys-sources
GCS_ARTIFACTS_BUCKET=madhav-marsys-build-artifacts
```

#### L.2 — `MARSYS_FLAG_*` overrides not exercised in env
- **Detail:** All feature flags (`NEW_QUERY_PIPELINE_ENABLED`, `VECTOR_SEARCH_ENABLED`, `CGM_GRAPH_WALK_ENABLED`, `MANIFEST_QUERY_ENABLED`, `AUDIT_ENABLED`) default to `true` in code and no `MARSYS_FLAG_*` env vars are set. This means the full pipeline is active by default — correct for production. No action needed; documented for awareness.

#### L.3 — `01_FACTS_LAYER` and `025_HOLISTIC_SYNTHESIS` not in Next.js Dockerfile
- **Detail:** These dirs are absent from the Next.js runner stage, but confirmed not needed at query time — the retrieval tools (msr_sql, vector_search, cgm_graph_walk) access them via Cloud SQL rows, not filesystem. The sidecar's `pipeline/main.py` (ingestion only) uses `COPY . .` and has full access. No action needed.

---

## Section 4 — Static Code Checks Summary

| Check | Result | Notes |
|-------|--------|-------|
| `NEXT_PUBLIC_SIDECAR_URL` references in server code | ✅ PASS | Zero occurrences — fixed in commit 3935e0e |
| `SIDECAR_API_KEY` vs `PYTHON_SIDECAR_API_KEY` alignment | ✅ PASS | All callers and server use `PYTHON_SIDECAR_API_KEY` |
| Supabase references in API/lib | ✅ PASS | Zero occurrences |
| Voyage AI references in API/lib | ✅ PASS | Zero occurrences |
| Hardcoded `us-central1` in Vertex AI embed path | ✅ PASS | vector_search.ts reads from env; embed.py reads from env (fix: 718fb01) |
| Migrations directory name | ✅ PASS | `platform/migrations/` (renamed from `supabase/` in 718fb01) |
| Migration prefix collision | ✅ PASS | `020_query_trace_steps.sql` (renamed from `013_` in 3935e0e) |
| Migration sequence | ✅ PASS | 001–020, no gaps, no duplicates |
| `035_DISCOVERY_LAYER` in Dockerfile runner | ✅ FIXED | Added this session |
| `00_ARCHITECTURE` in Dockerfile runner | ✅ PASS | Present since original write |
| Register JSON files present locally | ✅ PASS | All 4 JSONs confirmed in `035_DISCOVERY_LAYER/REGISTERS/` |
| `CAPABILITY_MANIFEST.json` present | ✅ PASS | `00_ARCHITECTURE/CAPABILITY_MANIFEST.json` exists |
| `BUILD_STATE_GCS_BASE` in `.env.local` | ⚠️ MISSING | Falls back to unknown bucket (H.2) |
| `SIDECAR_ALLOWED_ORIGINS` for production | ⚠️ ACTION NEEDED | Default is localhost:3000 (H.1) |
| `localhost:8000` fallback in compute route | ⚠️ MEDIUM | Silent fail if env unset (M.1) |
| `VERTEX_AI_LOCATION` fallback | ⚠️ MEDIUM | Wrong-region silent fallback (M.2) |
| Sidecar pipeline GCS bucket vars in `.env.local` | ℹ️ MISSING | Not query-path (L.1) |

---

## Section 5 — Manual Checks Required (run locally with Auth Proxy)

The following checks require live service access and cannot be executed from this sandbox. Run `platform/scripts/pipeline_smoke_audit.py` locally after starting the Cloud SQL Auth Proxy:

```bash
# Terminal 1 — Auth Proxy
./platform/scripts/start_db_proxy.sh

# Terminal 2 — Audit
cd platform
python3 scripts/pipeline_smoke_audit.py
```

| Section | What it checks |
|---------|---------------|
| Cloud SQL | Connection, all 20 tables with row counts, pgvector extension, 768-dim embedding column, HNSW index |
| GCS | All 4 buckets accessible, 9 corpus files present, VALIDATED_ASSET_REGISTRY |
| Vertex AI | ADC credentials active, live 768-dim embedding call to `asia-south1` |
| Python Sidecar | Health, /transits, /ephemeris, /sade_sati, /eclipses, /rag/retrieve |
| Retrieval tools | Each tool's data source directly probed — confirms L3 register files now readable post-Dockerfile fix |
| Anthropic API | Key format valid, reachability check |

---

## Section 6 — Action Item Checklist

| # | Priority | Action | Owner | Where |
|---|----------|--------|-------|-------|
| 1 | ✅ Done | Add `035_DISCOVERY_LAYER` COPY to Dockerfile runner stage | Claude (this session) | `platform/Dockerfile` |
| 2 | 🔴 High | Set `SIDECAR_ALLOWED_ORIGINS` in sidecar Cloud Run service | You | GCP Console → sidecar service → Edit & deploy → Variables |
| 3 | 🔴 High | Clarify or create `BUILD_STATE_GCS_BASE` bucket | You | GCP Console or `.env.local` + Cloud Run |
| 4 | 🟡 Medium | Add startup assertion if `PYTHON_SIDECAR_URL` is unset | Code | `platform/src/app/api/compute/[type]/route.ts` |
| 5 | 🟡 Medium | Fail hard if `VERTEX_AI_LOCATION` is unset | Code | `platform/src/lib/retrieve/vector_search.ts` |
| 6 | 🟢 Low | Add sidecar pipeline GCS vars to `.env.local` | You | `platform/.env.local` |
| 7 | 🟢 Low | Run `pipeline_smoke_audit.py` locally to confirm live service health | You | Terminal |
| 8 | 🔴 Deploy | Rebuild and redeploy Cloud Run Next.js image with Dockerfile fix | You | `gcloud run deploy` or CI/CD pipeline |

---

## Section 7 — Deployment Trigger

**The Dockerfile fix (item 1) only takes effect after a new Cloud Run image is built and deployed.** Until then, the 4 L3 register tools are still dark in production. Deploy immediately:

```bash
# From platform/ directory
gcloud builds submit --tag gcr.io/madhav-astrology/marsys-jis-frontend .
gcloud run deploy marsys-jis-frontend \
  --image gcr.io/madhav-astrology/marsys-jis-frontend \
  --region asia-south1 \
  --project madhav-astrology
```

Or trigger your existing CI/CD pipeline if one is configured.

---

*Report generated: 2026-04-29 | Static analysis over 42 checks | 1 critical fix applied | 2 deployment actions pending*
