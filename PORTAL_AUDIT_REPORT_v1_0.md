---
title: PORTAL AUDIT REPORT — Full-Stack Post-Migration Inspection
version: "1.0"
status: DRAFT
date: 2026-04-29
scope: platform/ + python-sidecar + GCP config + migrations + env/config layer
auditor: Claude (Cowork session 2026-04-29)
---

# PORTAL AUDIT REPORT v1.0
## Full-Stack Post-Migration & Modernisation Audit

**Date:** 2026-04-29
**Scope:** Everything — API routes, env/config, migrations, pipelines, sidecar, build system, UI components, dead code, stale provider refs
**Method:** Direct code inspection, not superficial audit-file review
**Findings:** 25 distinct issues across 10 categories

---

## EXECUTIVE SUMMARY

The migration from Supabase → Cloud SQL, Vercel → Cloud Run, and Voyage → Vertex AI is substantially complete at the code level. However, the migration left behind a significant collection of naming artifacts, env var inconsistencies, and unresolved splits that now constitute real operational risk. Most critically: **three RAG client files reference a wrong env var name (`NEXT_PUBLIC_SIDECAR_URL`) that does not exist in any env file**, which means the sidecar URL silently falls back to `localhost:8000` in any Cloud Run deployment. There is also a **migration number collision** (two `013_` files) and a **sidecar API key name mismatch** between caller and server.

The portal is functional in dev but has landmines that will detonate at the next non-local deploy.

---

## FINDINGS REGISTER

### CATEGORY A — ENV VAR ERRORS (CRITICAL — will break in production)

---

#### A.1 — Wrong env var name for sidecar URL in RAG clients
**Severity:** CRITICAL
**Files affected:**
- `platform/src/lib/rag/retrieveClient.ts` (line 31)
- `platform/src/lib/rag/routerClient.ts` (line 36)
- `platform/src/lib/rag/synthesizeClient.ts` (line 37)

**Finding:** All three files read `process.env.NEXT_PUBLIC_SIDECAR_URL` which does not exist in `.env.local`, `.env.example`, or `.env.local.example`. The correct variable is `PYTHON_SIDECAR_URL`. The `NEXT_PUBLIC_` prefix is for browser-exposed variables baked at build time — this is a server-side secret URL that should never be `NEXT_PUBLIC_`. The fallback is `http://localhost:8000` so it silently "works" in local dev but **fails silently in Cloud Run** where the sidecar is on a different internal URL.

```
// Current (WRONG):
const SIDECAR_URL = process.env.NEXT_PUBLIC_SIDECAR_URL ?? "http://localhost:8000";

// Correct:
const SIDECAR_URL = process.env.PYTHON_SIDECAR_URL ?? "http://localhost:8000";
```

**Fix:** Replace `NEXT_PUBLIC_SIDECAR_URL` → `PYTHON_SIDECAR_URL` in all three files. Remove the `NEXT_PUBLIC_` prefix entirely. Do not add this to `NEXT_PUBLIC_` env vars.

---

#### A.2 — Sidecar API key name mismatch: caller vs server
**Severity:** CRITICAL
**Files affected:**
- Server reads: `platform/python-sidecar/main.py` reads `SIDECAR_API_KEY`
- Caller sends: `platform/src/app/api/compute/[type]/route.ts` reads `PYTHON_SIDECAR_API_KEY`
- `.env.local` sets: `PYTHON_SIDECAR_API_KEY=local-dev`

**Finding:** The FastAPI sidecar server validates `x-api-key` against the `SIDECAR_API_KEY` env var. The Next.js caller reads `PYTHON_SIDECAR_API_KEY`. These are two different names. In dev the sidecar likely has `SIDECAR_API_KEY` unset (empty string), so auth passes vacuously. In production (Cloud Run), if `SIDECAR_API_KEY` is set but the frontend sends the value of `PYTHON_SIDECAR_API_KEY`, auth will fail.

The three RAG clients (`retrieveClient.ts`, `routerClient.ts`, `synthesizeClient.ts`) also read `PYTHON_SIDECAR_API_KEY` — same mismatch.

**Fix:** Standardise on one name. Recommendation: rename the server-side env var to `PYTHON_SIDECAR_API_KEY` everywhere (in the sidecar's Cloud Run env and in `main.py`). Update all `.env.example` files to document this.

---

#### A.3 — `GCS_SOURCES_BUCKET` and `GCS_ARTIFACTS_BUCKET` undocumented
**Severity:** HIGH
**Files affected:**
- `platform/python-sidecar/pipeline/main.py` (lines 425–426)
- None of the `.env.example` files

**Finding:** `pipeline/main.py` reads two critical GCS env vars:
```python
sources_bucket = os.environ.get("GCS_SOURCES_BUCKET", "madhav-marsys-sources")
artifacts_bucket = os.environ.get("GCS_ARTIFACTS_BUCKET", "madhav-marsys-build-artifacts")
```
These are not documented in any `.env.example` or `.env.local.example`. The defaults are hardcoded bucket names — if the bucket names ever change or the pipeline is run in a new environment, it will silently use wrong buckets. They also are not in `.env.local`, meaning a developer who runs the pipeline locally against the real GCS will use whatever the hardcoded default is with no visibility.

**Fix:** Add both vars to `.env.example` (with the default values for dev/prod reference). Consider also: `PIPELINE_WORKSPACE_ROOT`, `PIPELINE_IMAGE_URI`, `VERTEX_AI_LOCATION` — all read by `pipeline/main.py` but undocumented.

---

#### A.4 — `VERTEX_AI_LOCATION` inconsistency between `embed.py` and `pipeline/main.py`
**Severity:** MEDIUM
**Files affected:**
- `platform/python-sidecar/rag/embed.py` line 110: hardcodes `"us-central1"`
- `platform/python-sidecar/pipeline/main.py` line 87: reads `VERTEX_AI_LOCATION` env var (defaults `"us-central1"`)
- `.env.local`: sets `VERTEX_AI_LOCATION=asia-south1`

**Finding:** Two code paths call Vertex AI for embeddings. `embed.py` (the one-shot B.3 ingestion script) hardcodes `us-central1` with a comment that "embedding models are available globally". `pipeline/main.py` (the production build pipeline) reads `VERTEX_AI_LOCATION` which in `.env.local` is `asia-south1`. The two paths initialise Vertex AI with different regions. This inconsistency can cause billing surprises (cross-region data transfer), latency differences, and potential auth confusion.

**Fix:** Remove the hardcode in `embed.py`; read `VERTEX_AI_LOCATION` from env (same as `pipeline/main.py`). Pick one region and enforce it. Since the DB is in `asia-south1`, keeping Vertex AI in `asia-south1` is correct for latency.

---

#### A.5 — `DB_PASSWORD` absent from `.env.local` (Cloud Run prod path broken)
**Severity:** MEDIUM
**Files affected:** `platform/src/lib/db/client.ts`, `platform/.env.local`

**Finding:** `db/client.ts` has two connection paths: (a) local dev via `DATABASE_URL`, (b) Cloud Run production via `Connector + INSTANCE_CONNECTION_NAME + DB_USER + DB_PASSWORD + DB_NAME`. The `.env.local` file has `DB_USER=amjis_app` and `DB_NAME=amjis` but **no `DB_PASSWORD`**. If the Cloud Run path is ever triggered (e.g., auth proxy is not available and `DATABASE_URL` is not set), it will fail. `.env.example` correctly lists `DB_PASSWORD` but `.env.local` doesn't have it.

**Fix:** Add `DB_PASSWORD` to `.env.local` (value from Secret Manager). Also consider whether `INSTANCE_CONNECTION_NAME` should be in `.env.local` for completeness.

---

### CATEGORY B — MIGRATION / DATABASE ISSUES

---

#### B.1 — Duplicate migration prefix: two `013_` files
**Severity:** HIGH
**Files:**
- `platform/supabase/migrations/013_build_pipeline_staging.sql`
- `platform/supabase/migrations/013_query_trace_steps.sql`

**Finding:** Two migration files share the `013_` prefix. Any migration tool that applies files in alphanumeric order will have undefined behaviour — both files sort to the same position. The `013_query_trace_steps.sql` was likely created later (during Phase 14) without checking for the collision. Any future freshdb/reapply will likely apply `013_build_pipeline_staging.sql` before `013_query_trace_steps.sql` arbitrarily, and if there are dependencies, this could break the schema.

**Fix:** Rename `013_query_trace_steps.sql` to `020_query_trace_steps.sql` (since `019_l3_registers.sql` is currently the last). Add a comment at the top of the file documenting the rename. Add a lint rule or check in CI that detects duplicate migration prefixes.

---

#### B.2 — Migrations directory still named `supabase/`
**Severity:** LOW (naming/hygiene)
**Path:** `platform/supabase/migrations/`

**Finding:** The project fully migrated from Supabase to Cloud SQL months ago. The migrations directory retaining the name `supabase/` is a permanent source of confusion — it implies the old provider is still in play. Multiple Exec Briefs still reference `platform/supabase/migrations/` paths. The `platform/supabase/` folder does not appear to contain anything other than `migrations/`.

**Fix:** Rename to `platform/migrations/`. Update all references in EXEC_BRIEFs, CLAUDE.md (§L), and the migration scripts (`scripts/start_db_proxy.sh`, any SQL apply scripts). This is a grep-and-rename exercise.

---

### CATEGORY C — STALE SERVICE PROVIDER ARTIFACTS

---

#### C.1 — `.vercel/` directory still in repository
**Severity:** MEDIUM (operational + security)
**Path:** `platform/.vercel/project.json`

**Finding:** Contains live Vercel project ID (`prj_YumviuYvmdd8XUP8b5dK2qGAkmxM`) and org ID (`team_lepbwi7HGCGdE3NVdqDJtIEh`). The README inside says "you should not share the .vercel folder". The `.gitignore` entry for `.vercel` is present but was added after this was committed — it was explicitly not excluded before. This Vercel project still exists as an orphaned project on Vercel's servers.

**Fix:** Delete `platform/.vercel/` directory. Remove Vercel project from Vercel dashboard if not already done. Verify `.gitignore` rule `.vercel` is working (it is).

---

#### C.2 — `voyageai` package installed in sidecar venv (Voyage replaced, still present)
**Severity:** LOW (bloat / audit confusion)
**Path:** `platform/python-sidecar/venv/lib/python3.13/site-packages/voyageai/`

**Finding:** Voyage AI was replaced by Vertex AI embeddings (Phase 9 hotfix / B.3 migration). The `requirements.txt` and `pipeline/requirements.txt` do not list `voyageai` — good. However, the `venv/` directory is present in the repository and contains the Voyage package. The venv itself should not be committed to source control (it's binary + large), and the stale Voyage package creates confusion during audits.

**Fix:** Add `venv/` and `.venv/` to `.gitignore` at the repo root and in `platform/python-sidecar/`. Clean them from git history if they were committed (`git rm -r --cached platform/python-sidecar/venv`). The sidecar's `.gcloudignore` already excludes `venv/` — extend this to `.gitignore`.

---

#### C.3 — `MIGRATION_SESSION1_PROMPT.md` references Supabase migration workflow
**Severity:** LOW (hygiene)
**Path:** `MIGRATION_SESSION1_PROMPT.md` (project root)

**Finding:** This file describes the Supabase → Cloud SQL migration session plan. It references `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and the old Supabase REST/storage API calls. It should be archived or deleted now that the migration is complete.

**Fix:** Move to `99_ARCHIVE/` or delete. It has no ongoing operational value.

---

### CATEGORY D — UNCOMMITTED CHANGES (NOT IN GIT)

---

#### D.1 — Six modified files not committed to git
**Severity:** HIGH (operational risk — live fixes not preserved)
**Files:**
```
M platform/python-sidecar/.gcloudignore
M platform/python-sidecar/rag/retrieve.py
M platform/python-sidecar/rag/router.py
M platform/python-sidecar/rag/synthesize.py
M platform/src/components/chat/MarkdownContent.tsx
M platform/src/components/consume/StreamingAnswer.tsx
```
**Finding:** These changes include substantive code modifications — notably all three RAG core files (`retrieve.py`, `router.py`, `synthesize.py`) which have switched from `Path(__file__).resolve().parents[3]` to `Path(os.environ.get('MARSYS_REPO_ROOT', '/app'))` for path resolution, and `router.py` has been pinned to `claude-opus-4-6` model. Additionally `MarkdownContent.tsx` and `StreamingAnswer.tsx` have UI changes. If the sidecar Docker image is rebuilt without committing these, the published image will not contain these fixes.

The `.gcloudignore` change adds `035_DISCOVERY_LAYER/` to the exclusion list — this may be intentional (that layer lives in GCS not in the sidecar image) but must be committed.

**Fix:** Commit all six files in a single atomic commit with a clear message (e.g., `fix: REPO_ROOT resolution + model pin + UI polish`). Add model pin and .gcloudignore changes to the commit message.

---

#### D.2 — Two untracked TMP files at project root
**Severity:** LOW (hygiene)
**Files:**
```
?? _TMP_GEMINI_PASTE_THIS_batchA.md
?? _TMP_GEMINI_PASTE_THIS_batchC.md
```
**Finding:** Scratch files for Gemini sessions left at the project root.

**Fix:** Delete both files. They are not production artifacts.

---

#### D.3 — `platform/cloudbuild-sidecar.yaml` untracked
**Severity:** MEDIUM
**Path:** `platform/cloudbuild-sidecar.yaml`

**Finding:** The sidecar Cloud Build configuration file is not yet committed. If a Cloud Build trigger is already configured to use this file from the repo, deployments will fail or use a stale version. The file exists on disk (it was read in this audit) but is not in git.

**Fix:** Commit `platform/cloudbuild-sidecar.yaml` in the same commit as D.1.

---

### CATEGORY E — STALE CODE REFERENCES IN PRODUCTION FILES

---

#### E.1 — `rag/ingest.py` scan dirs include archived `02_ANALYTICAL_LAYER`
**Severity:** MEDIUM
**File:** `platform/python-sidecar/rag/ingest.py` — `CORPUS_SCAN_DIRS` list

**Finding:** `CORPUS_SCAN_DIRS` includes `"02_ANALYTICAL_LAYER"`. Per CLAUDE.md §I (B.1 note): "L2 Analytical Layer archived Phase 14F 2026-04-28". Scanning an archived layer during ingestion will either silently produce zero results (if the dir doesn't exist) or ingest stale data if the dir is still present.

**Fix:** Remove `"02_ANALYTICAL_LAYER"` from `CORPUS_SCAN_DIRS`. Replace with a comment: `# 02_ANALYTICAL_LAYER archived Phase 14F 2026-04-28`.

---

#### E.2 — `rag/ingest.py` SKIP_DIRS references `platform/supabase`
**Severity:** LOW (hygiene)
**File:** `platform/python-sidecar/rag/ingest.py` — `SKIP_DIRS` set

**Finding:** `SKIP_DIRS` contains `"platform/supabase"` — stale path. After renaming (per B.2 fix), this reference breaks. Should be updated to `"platform/migrations"` or simply `"platform"` since the broader `"platform"` exclusion already covers it.

**Fix:** Remove `"platform/supabase"` from `SKIP_DIRS` (redundant given `"platform"` is already in `SKIP_DIR_PATTERNS`).

---

#### E.3 — `rag/ingest.py` FILE_REGISTRY_PATHS references obsolete versions
**Severity:** LOW (hygiene)
**File:** `platform/python-sidecar/rag/ingest.py`

**Finding:**
```python
FILE_REGISTRY_PATHS = [
    "00_ARCHITECTURE/FILE_REGISTRY_v1_3.md",
    "00_ARCHITECTURE/FILE_REGISTRY_v1_4.md",
]
```
Current canonical is `FILE_REGISTRY_v1_14.md` (SUPERSEDED) and `CAPABILITY_MANIFEST.json` (now the single source of truth per CLAUDE.md §C.2). These paths are used to determine `is_current` status during ingestion — pointing at v1.3 and v1.4 means the ingest script is reading a stale registry that is many versions out of date.

**Fix:** Update to reference `CAPABILITY_MANIFEST.json` or at minimum `FILE_REGISTRY_v1_14.md`. Longer-term: rewrite the relevant `ingest.py` function to read from `CAPABILITY_MANIFEST.json` directly.

---

### CATEGORY F — CORS / SECURITY

---

#### F.1 — CORS wildcard in sidecar production server
**Severity:** MEDIUM (security posture)
**File:** `platform/python-sidecar/main.py`

**Finding:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ← wildcard
    ...
)
```
The sidecar is a backend-only service that should only be called by the Next.js frontend (Cloud Run) and the pipeline (Cloud Run Job). A CORS wildcard on a production API that handles astrological data with Firebase auth is unnecessary — in Cloud Run service-to-service communication, CORS is not relevant at all (server-to-server requests). The wildcard exists from an early dev phase and was never tightened.

**Fix:** Restrict `allow_origins` to the Cloud Run service URL of the frontend (or remove CORS middleware entirely since the sidecar is not browser-accessible). At minimum: `allow_origins=["https://amjis-<hash>-<region>.a.run.app"]`.

---

#### F.2 — `.env.local` contains live credentials (not a git risk, but a workspace risk)
**Severity:** MEDIUM (operational security)
**File:** `platform/.env.local`

**Finding:** Contains live, real values for:
- Firebase Admin SDK private key (full RSA key)
- `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `DEEPSEEK_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`
- PostgreSQL password embedded in `DATABASE_URL`

The `.gitignore` correctly excludes `.env.*` (except `*.example`), so this file is NOT committed to git. However, it's sitting on disk in the workspace, visible to any process with file access. In production, all these values should be in Secret Manager, not a local file. This is acceptable for local dev but needs a developer discipline note.

**Fix:** Add a comment at the top of `.env.local` warning: `# LOCAL DEV ONLY — never commit, never push, never share`. Consider rotating the API keys listed if they've been exposed in any shared session. Add Secret Manager references to `.env.example` as comments.

---

### CATEGORY G — DUAL PIPELINE / LEGACY CODE SPLIT

---

#### G.1 — Legacy sidecar RAG path not yet deleted (Phase 11B pending)
**Severity:** LOW (technical debt)
**Files:** `platform/src/lib/rag/retrieveClient.ts`, `routerClient.ts`, `synthesizeClient.ts`

**Finding:** Per CLAUDE.md §F (Phase 11A cutover note): "The legacy code path is still in the codebase (Phase 11B scope for deletion) but is now the explicit opt-out branch." These three client files represent the old pattern of calling the sidecar's `/rag/retrieve`, `/rag/route`, and `/rag/synthesize` endpoints from TypeScript. The new query pipeline (`classify → compose → retrieve → synthesize → audit`) runs natively in TypeScript via `lib/router/`, `lib/retrieve/`, `lib/synthesis/`, etc. without going through these sidecar-proxy shims.

The shims are still live code but it's unclear what still calls them. If nothing calls them, they are dead code. If something does call them, that needs to be audited against the new pipeline.

**Fix:** Grep for all callers of `ragRetrieve`, `ragRoute`, `ragSynthesize` across the codebase. If no active callers, delete all three files and close Phase 11B. If there are callers, document the intent.

---

#### G.2 — Two separate paths exist for embeddings in production
**Severity:** MEDIUM (architectural confusion)

**Finding:** There are two embedding code paths that are both "live":
1. `platform/python-sidecar/rag/embed.py` — the Phase B.3 one-shot script that writes to `rag_embeddings` via psycopg
2. `platform/python-sidecar/pipeline/main.py` — the Phase 14B production pipeline that embeds chunks via Vertex AI and writes to staging tables

These two paths use different Vertex AI locations (see A.4), different batch sizes (10 vs 10), and different workflows. It's not clear if `embed.py` is a one-time script now superseded by the pipeline, or if it's still run for incremental updates. If the pipeline is the canonical embedding path, `embed.py` should be marked deprecated.

**Fix:** In `embed.py`, add a module-level docstring note: `DEPRECATED: Superseded by pipeline/main.py Phase 14B. Retained for audit trail.` Or, if it's still used for development re-embedding, document its purpose and when to use it vs the full pipeline.

---

### CATEGORY H — ORPHANED ROOT-LEVEL ARTIFACTS

---

#### H.1 — Multiple loose operational artifacts at project root
**Severity:** LOW (hygiene)
**Files at project root:**
```
MIGRATION_SESSION1_PROMPT.md          — migration planning doc (done)
CLEANUP_ANALYSIS_v1_0.md              — analysis doc (done)
READINESS_REPORT.md                   — point-in-time readiness report
elaborate.md                          — scratch doc
corpus_verification_report_v1_0.json  — one-time verification output
gcp_migrate.sh                        — migration script (executed)
audit.py                              — ad-hoc audit script
verify_corpus.py                      — one-time verification script
remove_reconciliation.py              — one-time cleanup script
amjis-login.png                       — screenshot artifact
_TMP_GEMINI_PASTE_THIS_batchA.md     — temp scratch file
_TMP_GEMINI_PASTE_THIS_batchC.md     — temp scratch file
AGENT_BRIEF_CORPUS_CLEANUP_v1_0.md   — exec brief (completed)
Plans/                                — planning dir
```
The root is cluttered with operational artifacts from past sessions that served their purpose but were never archived. This obscures the actual structure of the project.

**Fix:** Create `99_ARCHIVE/portal-ops/` and move all completed one-time artifacts there. Delete temp files. Scripts like `gcp_migrate.sh`, `audit.py`, `verify_corpus.py` can be archived to `99_ARCHIVE/scripts/`.

---

### CATEGORY I — BUILD SYSTEM

---

#### I.1 — Two Cloud Build configs, one untracked
**Severity:** MEDIUM
**Files:**
- `cloudbuild.yaml` (root) — builds pipeline image, deploys Cloud Run Job
- `platform/cloudbuild-sidecar.yaml` — builds sidecar image (untracked, see D.3)

**Finding:** The root `cloudbuild.yaml` references `platform/python-sidecar/Dockerfile.pipeline` (which exists). The sidecar `cloudbuild-sidecar.yaml` references `platform/python-sidecar/Dockerfile` (which also exists). Both build configs are well-formed. The issue is that `cloudbuild-sidecar.yaml` is not committed (see D.3), and its relationship to the root `cloudbuild.yaml` is undocumented — a README or BUILD.md should explain which trigger corresponds to which file.

**Fix:** Commit `platform/cloudbuild-sidecar.yaml`. Add a one-paragraph `BUILD.md` at root documenting:
- `cloudbuild.yaml` → pipeline image → Cloud Run Job (`marsys-build-pipeline-job`)
- `platform/cloudbuild-sidecar.yaml` → sidecar image → Cloud Run Service

---

#### I.2 — `cloudbuild-sidecar.yaml` copies `035_DISCOVERY_LAYER/PROMPTS/claude/` files
**Severity:** LOW (fragility)
**File:** `platform/cloudbuild-sidecar.yaml`

**Finding:**
```yaml
- id: copy-prompt-files
  name: 'ubuntu'
  entrypoint: bash
  args:
    - -c
    - |
      mkdir -p platform/python-sidecar/035_DISCOVERY_LAYER/PROMPTS/claude
      cp 035_DISCOVERY_LAYER/PROMPTS/claude/router_v1_0.md ...
      cp 035_DISCOVERY_LAYER/PROMPTS/claude/synthesis_v1_0.md ...
```
These prompt files are hardcoded by name (`router_v1_0.md`, `synthesis_v1_0.md`). If prompts are ever versioned (e.g., `router_v2_0.md`), the build script silently copies the old v1 prompt. The build will succeed but the sidecar will use stale prompts.

**Fix:** Either: (a) Copy the entire `035_DISCOVERY_LAYER/PROMPTS/claude/` directory rather than individual files; or (b) Add a step that validates the expected prompt files exist before copying.

---

### CATEGORY J — FEATURE FLAG STATE

---

#### J.1 — `AUDIT_VIEW_VISIBLE` and `PANEL_CHECKBOX_VISIBLE` default OFF but audit/panel are active
**Severity:** LOW (UX / intent question)
**File:** `platform/src/lib/config/feature_flags.ts`

**Finding:**
```typescript
AUDIT_ENABLED: true,       // audit logging is ON
AUDIT_VIEW_VISIBLE: false, // but the UI to see audit logs is OFF
PANEL_MODE_ENABLED: true,  // panel synthesis is ON
PANEL_CHECKBOX_VISIBLE: false, // but the UI checkbox to activate it is OFF
```
The audit is running and logging every query, but the UI to browse it is disabled. Panel mode is running server-side but users have no way to opt into it from the UI. This creates a state where significant infrastructure is running "invisibly" — incurring Anthropic API costs and DB writes without the user seeing the benefit.

**Fix:** This is an intentional feature-flag discipline (observe before exposing). Document in a `FEATURE_FLAG_STATUS.md` the intended flip date for each flag currently ON but UI-hidden. When validated, flip `AUDIT_VIEW_VISIBLE: true` and `PANEL_CHECKBOX_VISIBLE: true`.

---

## SUMMARY TABLE

| ID  | Category | Severity | Description | Status |
|-----|----------|----------|-------------|--------|
| A.1 | Env/Config | **CRITICAL** | Wrong env var name `NEXT_PUBLIC_SIDECAR_URL` in 3 RAG clients | OPEN |
| A.2 | Env/Config | **CRITICAL** | Sidecar API key name mismatch: `SIDECAR_API_KEY` vs `PYTHON_SIDECAR_API_KEY` | OPEN |
| A.3 | Env/Config | HIGH | `GCS_SOURCES_BUCKET` and `GCS_ARTIFACTS_BUCKET` undocumented | OPEN |
| A.4 | Env/Config | MEDIUM | Vertex AI location inconsistency: hardcoded `us-central1` in `embed.py`, env-driven `asia-south1` elsewhere | OPEN |
| A.5 | Env/Config | MEDIUM | `DB_PASSWORD` absent from `.env.local` | OPEN |
| B.1 | Migrations | HIGH | Duplicate `013_` prefix: `013_build_pipeline_staging.sql` + `013_query_trace_steps.sql` | OPEN |
| B.2 | Migrations | LOW | Migrations dir still named `supabase/` post-migration | OPEN |
| C.1 | Stale Artifacts | MEDIUM | `.vercel/` directory with live IDs still in repo | OPEN |
| C.2 | Stale Artifacts | LOW | `voyageai` package in committed venv | OPEN |
| C.3 | Stale Artifacts | LOW | `MIGRATION_SESSION1_PROMPT.md` references Supabase workflow | OPEN |
| D.1 | Uncommitted | HIGH | 6 modified files not committed (RAG core + UI) | OPEN |
| D.2 | Uncommitted | LOW | 2 untracked TMP scratch files at root | OPEN |
| D.3 | Uncommitted | MEDIUM | `cloudbuild-sidecar.yaml` not committed | OPEN |
| E.1 | Stale Code | MEDIUM | `ingest.py` scans archived `02_ANALYTICAL_LAYER` | OPEN |
| E.2 | Stale Code | LOW | `ingest.py` SKIP_DIRS references `platform/supabase` | OPEN |
| E.3 | Stale Code | LOW | `ingest.py` FILE_REGISTRY_PATHS points at v1.3/v1.4 (current is CAPABILITY_MANIFEST) | OPEN |
| F.1 | Security | MEDIUM | CORS wildcard `allow_origins=["*"]` in production sidecar | OPEN |
| F.2 | Security | MEDIUM | `.env.local` contains live credentials (disk risk) | ADVISORY |
| G.1 | Tech Debt | LOW | Legacy sidecar RAG shim files not yet deleted (Phase 11B pending) | DEFERRED |
| G.2 | Tech Debt | MEDIUM | Two embedding code paths active; `embed.py` vs `pipeline/main.py` not clearly delineated | OPEN |
| H.1 | Hygiene | LOW | ~14 orphaned operational artifacts at project root | OPEN |
| I.1 | Build System | MEDIUM | Two Cloud Build configs, one untracked; relationship undocumented | OPEN |
| I.2 | Build System | LOW | `cloudbuild-sidecar.yaml` hardcodes prompt file versions (fragile) | OPEN |
| J.1 | Feature Flags | LOW | `AUDIT_VIEW_VISIBLE` and `PANEL_CHECKBOX_VISIBLE` hidden while backend is active | ADVISORY |

---

## REMEDIATION PLAN

### Sprint 1 — Emergency fixes (do these before next deploy)

**Block 1A: Env var corrections (A.1 + A.2)**
- In `retrieveClient.ts`, `routerClient.ts`, `synthesizeClient.ts`: change `NEXT_PUBLIC_SIDECAR_URL` → `PYTHON_SIDECAR_URL`
- In `platform/python-sidecar/main.py`: change `SIDECAR_API_KEY` → `PYTHON_SIDECAR_API_KEY` (standardise on the caller's name)
- Verify `.env.local` already has `PYTHON_SIDECAR_API_KEY=local-dev` ✓
- Verify Cloud Run sidecar service env has `PYTHON_SIDECAR_API_KEY` set

**Block 1B: Commit uncommitted changes (D.1 + D.3)**
- Commit all 6 modified files + `cloudbuild-sidecar.yaml` in one atomic commit
- Verify the REPO_ROOT change in `retrieve.py` / `router.py` / `synthesize.py` is correct
- Delete temp files (D.2)

**Block 1C: Migration collision (B.1)**
- Rename `013_query_trace_steps.sql` → `020_query_trace_steps.sql`
- Verify the table `query_trace_steps` doesn't have a dependency on anything in `014–019` that would break order

---

### Sprint 2 — Cleanup (next working session)

**Block 2A: Stale artifacts**
- Delete `platform/.vercel/` directory (C.1)
- Add `venv/` and `.venv/` to root `.gitignore`; run `git rm -r --cached` to untrack venv (C.2)
- Move completed root-level docs to `99_ARCHIVE/portal-ops/` (H.1, C.3)

**Block 2B: Env/config documentation (A.3 + A.4 + A.5)**
- Add `GCS_SOURCES_BUCKET`, `GCS_ARTIFACTS_BUCKET`, `PIPELINE_WORKSPACE_ROOT`, `VERTEX_AI_LOCATION` to `.env.example`
- Fix `embed.py` to read `VERTEX_AI_LOCATION` from env instead of hardcode (A.4)
- Add `DB_PASSWORD` to `.env.local` and `.env.example` (A.5)

**Block 2C: Build system (I.1 + I.2)**
- Write `BUILD.md` at project root explaining the two Cloud Build configs
- Fix `cloudbuild-sidecar.yaml` to copy the entire prompts dir instead of individual files

---

### Sprint 3 — Architecture cleanup (this week)

**Block 3A: Migrations directory rename (B.2)**
- Rename `platform/supabase/` → `platform/migrations/`
- Global grep-and-replace all references in source, scripts, Exec Briefs, CLAUDE.md
- Update all SQL apply scripts

**Block 3B: Stale code in `ingest.py` (E.1 + E.2 + E.3)**
- Remove `02_ANALYTICAL_LAYER` from `CORPUS_SCAN_DIRS`
- Remove `platform/supabase` from `SKIP_DIRS`
- Update `FILE_REGISTRY_PATHS` to point at `CAPABILITY_MANIFEST.json`

**Block 3C: CORS hardening (F.1)**
- Restrict `allow_origins` in sidecar to the Cloud Run frontend URL
- Or remove CORS middleware entirely (server-to-server calls don't need it)

**Block 3D: Legacy shim audit (G.1)**
- Grep for all callers of `ragRetrieve`, `ragRoute`, `ragSynthesize`
- If zero callers: delete all three client files, close Phase 11B
- If callers exist: document and decide

**Block 3E: Delineate embedding paths (G.2)**
- Add deprecation notice to `embed.py` OR document its ongoing role
- Standardise Vertex AI location in both paths to `asia-south1`

---

### Advisory actions (no sprint required — developer discipline)

- Add a warning comment to `.env.local` header: "LOCAL DEV ONLY — never commit"
- Decide flip dates for `AUDIT_VIEW_VISIBLE` and `PANEL_CHECKBOX_VISIBLE` feature flags
- Consider rotating the API keys in `.env.local` if they've been in any shared context

---

## WHAT IS CLEAN AND WORKING WELL

For balance, these areas are well-engineered and need no remediation:

- **DB client** (`lib/db/client.ts`): dual-mode connection (local AUTH proxy vs Cloud Run connector) is clean
- **Feature flag system** (`lib/config/`): singleton, env-override capable, well-typed — solid
- **New query pipeline** (`consume/route.ts`): the classify → compose → retrieve → synthesize → audit chain is correctly wired and the feature flag cutover is clean
- **GCS storage adapter** (`lib/storage/gcs.ts`): uses ADC via `projectId` from env — correct
- **Firebase auth** (`lib/firebase/server.ts`): reads credentials from env correctly
- **Cloud Build pipeline config** (`cloudbuild.yaml`): correctly tags images with both `$BUILD_ID` and `latest`
- **`requirements.txt` / `pipeline/requirements.txt`**: Voyage has been removed; Vertex AI is correctly listed — no stale dependency in the manifests
- **Sidecar FastAPI structure** (`main.py`): clean router mounting, correct API key validation pattern (just the wrong env var name per A.2)
- **Migrations 001–012, 014–019**: no collisions, sequential, well-named
- **`next.config.ts`**: `output: "standalone"` is correct for Cloud Run Docker deployment
- **`Dockerfile`**: multi-stage build, non-root user, copies `00_ARCHITECTURE` for governance tooling — correct

---

*End of PORTAL_AUDIT_REPORT_v1_0.md — 2026-04-29*
*Next step: Review findings with native; execute Sprint 1 (A.1 + A.2 + D.1 + B.1) as the priority block before any deployment.*
