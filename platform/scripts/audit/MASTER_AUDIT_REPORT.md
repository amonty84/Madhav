---
report_id: MASTER_AUDIT_REPORT
version: rolling
last_updated: 2026-04-28
executor: Claude Code (Sonnet 4.6)
brief: MASTER_AUDIT_BRIEF_v1_0.md
---

# MASTER AUDIT REPORT — Rolling

---

## Invocation 1 — 2026-04-28 — Phase A (Foundation)

### Status
Phase A complete (A.1–A.4 all COMPLETE). **HALTED** before Phase B per §A.1 pause condition.

### Phases Executed

| Phase | Verdict | Key Finding |
|---|---|---|
| A.1 Credentials | ⚠️ PARTIAL | 7/8 pass; OPENAI_API_KEY missing |
| A.2 GCP Services | ✅ GREEN | All services healthy; voyage secret deprecated/gone |
| A.3 Env Vars | ⚠️ AMBER | 3 findings (see below) |
| A.4 Dev Hygiene | ✅ GREEN | dev:clean script added to package.json |

### Findings

#### A1.F1 — OPENAI_API_KEY missing (MEDIUM)
- Not in `.env.local`, not in GCP Secrets Manager, not in Cloud Run env
- Impact: Panel mode (`PANEL_MODE_ENABLED`) cannot run; Phase F.4 skipped until resolved
- Current queries unaffected (PANEL_MODE_ENABLED defaults false)
- **Fix:** Add `OPENAI_API_KEY=<key>` to `.env.local`; create GCP secret and mount in Cloud Run

#### A3.F1 — SIDECAR_API_KEY silent bug (MEDIUM)
- Files: `routerClient.ts:29`, `retrieveClient.ts:30`, `synthesizeClient.ts:34`
- Code reads `process.env.SIDECAR_API_KEY` but env provides `PYTHON_SIDECAR_API_KEY` (different key name)
- Result: all three RAG pipeline sidecar clients send requests unauthenticated (`x-api-key` header absent)
- **Fix (surgical, unambiguous):** In each of the three files, change `SIDECAR_API_KEY` to `PYTHON_SIDECAR_API_KEY`

#### A3.F2 — GCS_BUCKET_* missing from dev (LOW-MEDIUM)
- `GCS_BUCKET_CHAT_ATTACHMENTS` and `GCS_BUCKET_CHART_DOCUMENTS` not in `.env.local` or `.env.example`
- Code uses `!` non-null assertion — any storage call in dev will throw at runtime
- **Fix:** Add both vars to `.env.local` and `.env.example` with bucket names

#### A3.F3 — VERTEX_AI_LOCATION not in prod (LOW)
- Not in Cloud Run env → Vertex AI client may use `us-central1` default instead of `asia-south1`
- Higher embedding latency in prod
- **Fix:** Add `VERTEX_AI_LOCATION=asia-south1` to Cloud Run service env

### Changes Made This Invocation
1. Created `platform/scripts/audit/.audit_state.json` (new)
2. Added `dev:clean` script to `platform/package.json`
3. Created `A1_credentials.md`, `A2_gcp_services.md`, `A3_env_matrix.md`, `A4_dev_hygiene.md`

---

## Invocation 2 — 2026-04-28 — Fixes + Phase B (Data Layer)

### Fixes Applied Before Phase B
| Fix | Files Changed |
|---|---|
| OPENAI_API_KEY added to `.env.local` | `.env.local` |
| `SIDECAR_API_KEY` → `PYTHON_SIDECAR_API_KEY` (silent auth bug) | `routerClient.ts`, `retrieveClient.ts`, `synthesizeClient.ts` |
| `GCS_BUCKET_CHAT_ATTACHMENTS` + `GCS_BUCKET_CHART_DOCUMENTS` added to `.env.local` | `.env.local` |

### Status
Phase B complete (B.1–B.6 all COMPLETE). **HALTED** at Phase B pause point for two native decisions.

### Phases Executed

| Phase | Verdict | Key Finding |
|---|---|---|
| B.1 FORENSIC Completeness | ⚠️ AMBER | All 9 planets complete ✅; house cusp nakshatra+pada missing for all 12 houses (24 items) |
| B.2 MSR Signals | ✅ GREEN | 499/499 signals; schema clean; 1 signal missing classical_basis |
| B.3 CGM Graph | ✅ GREEN | 1753 nodes, 3915 edges; 101 adjudicated edges (expected growth); traversable |
| B.4 UCN/CDLM/RM | ✅ GREEN | UCN+CDLM in DB; RM from filesystem; all consistent |
| B.5 Manifest | ⚠️ AMBER | 0 missing files; 10 hash-drift (active registers); 32 version-drift (formatting only) |
| B.6 GCS Drift | ⚠️ AMBER | GCS chart-docs are stale v1.0 snapshots; prod bundle reads outdated artifacts |

### Findings

#### B1.F1 — FORENSIC house cusp nakshatra+pada missing (LOW-MEDIUM)
- 24 items missing: nakshatra + pada for all 12 house cusps
- All planetary data (9 planets × 5 attrs) is complete
- Values are computationally derivable from cusp degrees + ayanamsha already in file
- **Native decision required** (see HALT below)

#### B5.F1 — Manifest hash-drift in JSON registers (LOW)
- 10 entries in L6 Learning Layer + L3.5 Discovery Layer JSON files have hash drift
- Expected: these files are updated frequently between manifest builds
- Fix: `cd platform && npm run manifest:build`

#### B6.F1 — GCS chart-documents stale (MEDIUM)
- Production bundle composer reads from GCS path; GCS has v1.0 snapshots vs local v8.0/v9.0/v3.0
- FORENSIC in GCS: v1.0 (87KB) vs local v8.0 (much richer)
- MSR in GCS: v1.0 vs local v3.0 (499 signals)
- CGM in GCS: v1.0 vs local v9.0
- **Native decision required** (see HALT below)

---

## Next Invocation

**Next ready phase:** C.1 (Embeddings — rag_chunks audit)

**Native decisions required before re-triggering:**

1. **B.1 FORENSIC gap** — Choose one:
   - **(a) Enrich to FORENSIC v8.1** — add nakshatra+pada for all 12 house cusps from Jhora source (`01_FACTS_LAYER/SOURCES/JHORA_TRANSCRIPTION_v8_0_SOURCE.md`). Say: "enrich FORENSIC to v8.1"
   - **(b) Accept gap** — house cusp nakshatra+pada are not currently used by any retrieval query. Say: "accept FORENSIC gap, proceed"

2. **B.6 GCS stale artifacts** — Choose one:
   - **(a) Sync GCS now** — re-run build pipeline to upload current L1/L2/L2.5 artifacts. Say: "sync GCS artifacts"
   - **(b) Defer** — accept that prod reads v1.0 artifacts for now; schedule for next deployment. Say: "defer GCS sync, proceed"

Re-trigger phrase: **"Read MASTER_AUDIT_BRIEF_v1_0.md and execute it."**
