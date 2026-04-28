---
phase: A.2
title: GCP Services Audit
status: COMPLETE
executed_at: 2026-04-28
executor: Claude Code (Sonnet 4.6)
verdict: GREEN — all services healthy; voyage secret deprecated/gone (expected)
---

# A.2 — GCP Services Audit

## Stream Results

### Stream 1 — Cloud Run: amjis-web
| Field | Value |
|---|---|
| Status | ✅ Ready=True |
| Latest revision | amjis-web-00010-pd8 |
| URL | https://amjis-web-qm256lasva-el.a.run.app |

### Stream 2 — Cloud Run: amjis-sidecar
| Field | Value |
|---|---|
| Status | ✅ Ready=True |
| Latest revision | amjis-sidecar-00001-s55 |
| URL | https://amjis-sidecar-qm256lasva-el.a.run.app |

### Stream 3 — Cloud SQL: amjis-postgres
| Field | Value |
|---|---|
| State | ✅ RUNNABLE |
| Tier | db-g1-small |
| Connection name | madhav-astrology:asia-south1:amjis-postgres |

### Stream 4 — GCS Buckets
| Bucket | Status | Content |
|---|---|---|
| madhav-astrology-chat-attachments | ✅ Accessible | 0 objects (empty) |
| madhav-astrology-chart-documents | ✅ Accessible | `charts/` folder present |

### Stream 5 — GCP Secrets
Present secrets:
- `ANTHROPIC_API_KEY` ✅
- `DEEPSEEK_API_KEY` ✅
- `GOOGLE_GENERATIVE_AI_API_KEY` ✅
- `PYTHON_SIDECAR_API_KEY` ✅
- `SUPER_ADMIN_EMAIL` ✅
- `amjis-db-password` ✅
- `firebase-admin-credentials` ✅

⚠️ `amjis-voyage-api-key` — **NOT PRESENT**. Brief spec said to flag if deprecated. Voyage embeddings have been replaced by Vertex AI `text-multilingual-embedding-002`. Confirmed gone. No action needed.

⚠️ `OPENAI_API_KEY` — not in secrets. Required for panel mode (see A.1).

### Stream 6 — Cloud Builds (last 5)
| Status | Date | Notes |
|---|---|---|
| SUCCESS | 2026-04-25 | Latest 3 builds all SUCCESS |
| SUCCESS | 2026-04-25 | |
| SUCCESS | 2026-04-25 | |
| FAILURE | 2026-04-25 | Earlier build, superseded by successful re-run |

✅ Most recent build succeeded. No blocked pipeline.

### Stream 7 — Artifact Registry
| Repository | Format |
|---|---|
| amjis | DOCKER |

✅ Docker images present.

### Stream 8 — DNS
`nslookup madhav.marsys.in` → **34.54.231.91** ✅ (matches expected IP)

## Summary
All GCP services are healthy and reachable. No blocking issues. The absence of `amjis-voyage-api-key` is expected (deprecated). OPENAI_API_KEY gap flagged in A.1.
