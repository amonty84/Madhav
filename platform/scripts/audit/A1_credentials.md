---
phase: A.1
title: Credentials & API Keys Audit
status: COMPLETE
executed_at: 2026-04-28
executor: Claude Code (Sonnet 4.6)
verdict: PARTIAL — OPENAI_API_KEY missing (see HALT below)
---

# A.1 — Credentials & API Keys Audit

## Stream Results

| # | Credential | Result | Detail |
|---|---|---|---|
| 1 | ANTHROPIC_API_KEY | ✅ PASS | claude-haiku-4-5-20251001 responded |
| 2 | OPENAI_API_KEY | ❌ MISSING | Not in `.env.local`, not in Cloud Run env, not in GCP Secrets Manager |
| 3 | GOOGLE_GENERATIVE_AI_API_KEY | ✅ PASS | Key valid — 429 rate-limit returned (not auth failure) from gemini-2.0-flash |
| 4 | DEEPSEEK_API_KEY | ✅ PASS | deepseek-v4-flash responded |
| 5 | Vertex AI ADC | ✅ PASS | `text-multilingual-embedding-002` returned dim=768 vector |
| 6 | Cloud SQL | ✅ PASS | `SELECT 1` via Auth Proxy (127.0.0.1:5433) returned `1` |
| 7 | Firebase Admin | ✅ PASS | `FIREBASE_ADMIN_CREDENTIALS` parses as `type=service_account, project=madhav-astrology` |
| 8 | GCS | ✅ PASS | `madhav-astrology-chat-attachments` accessible (0 objects); `madhav-astrology-chart-documents` accessible (≥1 object) |

## OPENAI_API_KEY — Analysis

The key is listed in `.env.example` as an expected var. Code path:
- `platform/src/lib/models/openai.ts` — imports `@ai-sdk/openai` which reads `process.env.OPENAI_API_KEY` automatically
- `platform/src/lib/synthesis/panel/default_slate.ts` — default slate includes OpenAI (`gpt-4.1`) as one of 3 panel members
- `platform/src/lib/synthesis/orchestrator.ts` — panel mode fires when `PANEL_MODE_ENABLED=true && panel_opt_in=true`

**Impact:** Panel mode is currently `PANEL_MODE_ENABLED: false` by default, so absence of OPENAI_API_KEY does not crash current queries. However Phase F.4 (Panel UI Smoke) cannot run until this key is added.

---

## HALT — Action required before Phase B

**Credential OPENAI_API_KEY is missing.** Add it to `platform/.env.local` and to GCP Secret Manager (`gcloud secrets create OPENAI_API_KEY --data-file=<file>` + mount in Cloud Run), then re-trigger this brief.

Optional to unblock F.4 only; all other phases can proceed without it. **Per brief spec §A.1 pause condition, execution halts here unless native confirms "proceed to Phase B without OPENAI_API_KEY".**
