#!/usr/bin/env bash
# ============================================================
# MARSYS-JIS — Platform Hygiene Steps 5 / 7 / 8
# Brief: CLAUDECODE_BRIEF_PLATFORM_HYGIENE_2026-04-29.md
#
# Step 3 (GCS upload): DONE ✓
# Step 6 (npm tests):  DONE ✓  806/815 pass; 9 pre-existing failures,
#                              zero regressions from dataSource.ts/temporal.ts.
#
# Prerequisites:
#   - gcloud CLI authenticated (gcloud auth login)
#   - Auth Proxy running on :5433 (for Step 8 smoke audit only)
#   - Run from: /Users/Dev/Vibe-Coding/Apps/Madhav/platform/
# ============================================================

set -e
cd "$(dirname "$0")/.."      # ensures we are in /…/platform/

# ── Step 5 — Set BUILD_STATE_GCS_BASE in Cloud Run ───────────────────────────
echo ""
echo "=== Step 5: Set BUILD_STATE_GCS_BASE in Cloud Run amjis-web ==="
gcloud run services update amjis-web \
  --region asia-south1 \
  --project madhav-astrology \
  --update-env-vars "BUILD_STATE_GCS_BASE=https://storage.googleapis.com/madhav-marsys-build-artifacts"

echo "Confirming latest revision..."
gcloud run revisions list \
  --service amjis-web \
  --region asia-south1 \
  --project madhav-astrology \
  --limit 3
echo "Step 5: DONE ✓"

# ── Step 7 — Rebuild image + redeploy ────────────────────────────────────────
echo ""
echo "=== Step 7: Cloud Build + Cloud Run deploy ==="
gcloud builds submit \
  --config cloudbuild.yaml \
  --project madhav-astrology

gcloud run deploy amjis-web \
  --image asia-south1-docker.pkg.dev/madhav-astrology/amjis/amjis-web:latest \
  --region asia-south1 \
  --project madhav-astrology \
  --quiet
echo "Step 7: DONE ✓"

# ── Step 8 — Smoke verify ─────────────────────────────────────────────────────
echo ""
echo "=== Step 8: Smoke audit ==="
echo "-- Verifying build-state.json readable from GCS (authenticated) --"
gsutil cat gs://madhav-marsys-build-artifacts/build-state.json \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('GCS read OK — schema_version:', d['schema_version'], '| generated_at:', d['generated_at'])"

echo ""
echo "-- Running pipeline smoke audit (requires Auth Proxy on :5433) --"
python3 scripts/pipeline_smoke_audit.py

echo ""
echo "=== ALL STEPS COMPLETE ==="
echo "Update CLAUDECODE_BRIEF status to COMPLETE if all 9 ACs met."
