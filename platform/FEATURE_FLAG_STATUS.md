# Feature Flag Status — MARSYS-JIS Platform

Managed in [platform/src/lib/config/feature_flags.ts](src/lib/config/feature_flags.ts).
Override any flag at runtime via env var `MARSYS_FLAG_<FLAG_NAME>=true|false`.

## Currently ON (backend active, UI hidden)

| Flag | Backend | UI | Notes | Flip when |
|------|---------|----|-------|-----------|
| `AUDIT_ENABLED` | ON | — | Logs every query to `audit_log` table + S3/GCS | Ready — already running |
| `AUDIT_VIEW_VISIBLE` | — | OFF | Shows audit log browser in the Consume UI | After native reviews 1–2 weeks of audit data |
| `PANEL_MODE_ENABLED` | ON | — | Panel synthesis runs server-side on every query | Ready — already running |
| `PANEL_CHECKBOX_VISIBLE` | — | OFF | Shows "Enable Panel Mode" checkbox in query UI | After native validates panel answer quality |
| `NEW_QUERY_PIPELINE_ENABLED` | ON | — | New classify→compose→retrieve→synthesize→audit pipeline (Phase 11A cutover 2026-04-28) | Default ON — revert via `MARSYS_FLAG_NEW_QUERY_PIPELINE_ENABLED=false` |

## How to flip a flag

1. To enable UI for observation: set the `*_VISIBLE` flag to `true` in `feature_flags.ts` defaults, or set `MARSYS_FLAG_AUDIT_VIEW_VISIBLE=true` in Cloud Run env.
2. To disable backend processing: set the backend flag to `false` (stops API costs + DB writes).
3. To revert the new query pipeline: `MARSYS_FLAG_NEW_QUERY_PIPELINE_ENABLED=false` in env.

## Advisory

While `AUDIT_ENABLED=true` and `AUDIT_VIEW_VISIBLE=false`, the audit is running and incurring DB writes + Anthropic API costs for every query, but the user cannot see the audit output. Flip `AUDIT_VIEW_VISIBLE` once you have enough data to validate it's useful.

Similarly, `PANEL_MODE_ENABLED=true` runs panel synthesis on every query (Anthropic API cost), but `PANEL_CHECKBOX_VISIBLE=false` means the user cannot activate panel display. Flip `PANEL_CHECKBOX_VISIBLE` once panel answer quality is validated.
