set -euo pipefail

PROJECT=madhav-astrology
REGION=asia-south1
FRONTEND_SERVICE=amjis-web
SIDECAR_SERVICE=amjis-sidecar

echo "--- Fetching current frontend URLs from $FRONTEND_SERVICE ---"

URLS=$(gcloud run services describe $FRONTEND_SERVICE \
  --region $REGION \
  --project $PROJECT \
  --format="value(status.url,status.address.url)" \
  2>/dev/null | tr '\n' ',' | sed 's/,$//')

ORIGINS=$(echo "$URLS" | tr ',' '\n' | sort -u | grep -v '^$' | tr '\n' ',' | sed 's/,$//')

echo "Frontend URLs found: $ORIGINS"
echo ""
echo "--- Updating SIDECAR_ALLOWED_ORIGINS on $SIDECAR_SERVICE ---"

gcloud run services update $SIDECAR_SERVICE \
  --region $REGION \
  --project $PROJECT \
  --update-env-vars "SIDECAR_ALLOWED_ORIGINS=$ORIGINS"

echo ""
echo "--- Verifying ---"
gcloud run services describe $SIDECAR_SERVICE \
  --region $REGION \
  --project $PROJECT \
  --format="value(spec.template.spec.containers[0].env)"
