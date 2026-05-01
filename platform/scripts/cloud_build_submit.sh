#!/usr/bin/env bash
# cloud_build_submit.sh
# Manual Cloud Build + Cloud Run deploy for amjis-web.
# Reads Firebase + GCS substitutions from platform/.env.local so you don't
# have to pass them by hand.
#
# Usage (run from repo root OR platform/ — script resolves both):
#   bash platform/scripts/cloud_build_submit.sh
#
# Requirements: gcloud CLI authenticated, .env.local present in platform/

set -euo pipefail

# ── Resolve repo root regardless of where the script is called from ──────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLATFORM_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$PLATFORM_DIR/.." && pwd)"
ENV_FILE="$PLATFORM_DIR/.env.local"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: $ENV_FILE not found — cannot read substitution values"
  exit 1
fi

# ── Read values from .env.local ───────────────────────────────────────────────
read_env() {
  grep "^$1=" "$ENV_FILE" | cut -d'=' -f2- | tr -d '\r'
}

FIREBASE_API_KEY="$(read_env NEXT_PUBLIC_FIREBASE_API_KEY)"
FIREBASE_AUTH_DOMAIN="$(read_env NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)"
FIREBASE_PROJECT_ID="$(read_env NEXT_PUBLIC_FIREBASE_PROJECT_ID)"
FIREBASE_STORAGE_BUCKET="$(read_env NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)"
FIREBASE_MESSAGING_SENDER_ID="$(read_env NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID)"
FIREBASE_APP_ID="$(read_env NEXT_PUBLIC_FIREBASE_APP_ID)"
BUILD_STATE_GCS_BASE="$(read_env BUILD_STATE_GCS_BASE)"

# Validate nothing is empty
for var in FIREBASE_API_KEY FIREBASE_AUTH_DOMAIN FIREBASE_PROJECT_ID \
           FIREBASE_STORAGE_BUCKET FIREBASE_MESSAGING_SENDER_ID \
           FIREBASE_APP_ID BUILD_STATE_GCS_BASE; do
  if [[ -z "${!var}" ]]; then
    echo "ERROR: $var is empty — check platform/.env.local"
    exit 1
  fi
done

echo "=== Cloud Build submit ==="
echo "Repo root : $REPO_ROOT"
echo "Config    : platform/cloudbuild.yaml"
echo "Project   : madhav-astrology"
echo ""

cd "$REPO_ROOT"

gcloud builds submit \
  --config platform/cloudbuild.yaml \
  --project madhav-astrology \
  --substitutions \
"_FIREBASE_API_KEY=${FIREBASE_API_KEY},\
_FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN},\
_FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID},\
_FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET},\
_FIREBASE_MESSAGING_SENDER_ID=${FIREBASE_MESSAGING_SENDER_ID},\
_FIREBASE_APP_ID=${FIREBASE_APP_ID},\
_BUILD_STATE_GCS_BASE=${BUILD_STATE_GCS_BASE}"

echo ""
echo "=== Deploy to Cloud Run ==="

gcloud run deploy amjis-web \
  --image asia-south1-docker.pkg.dev/madhav-astrology/amjis/amjis-web:latest \
  --region asia-south1 \
  --project madhav-astrology \
  --quiet

echo ""
echo "=== Confirming revision ==="
gcloud run revisions list \
  --service amjis-web \
  --region asia-south1 \
  --project madhav-astrology \
  --limit 3
