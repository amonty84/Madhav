# Build System — MARSYS-JIS

Two Cloud Build configurations exist in this repository, targeting two separate Cloud Run deployments.

## `cloudbuild.yaml` (repo root) — Pipeline image

- **Trigger:** Manual or PR merge to main
- **Builds:** `platform/python-sidecar/Dockerfile.pipeline`
- **Pushes to:** `asia-south1-docker.pkg.dev/$PROJECT_ID/marsys-pipeline/pipeline`
- **Deploys:** Cloud Run Job `marsys-build-pipeline-job` (batch corpus ingestion)
- **Tags:** both `$BUILD_ID` (immutable) and `latest`

## `platform/cloudbuild-sidecar.yaml` — Sidecar image

- **Trigger:** Manual (separate Cloud Build trigger configured in GCP console)
- **Builds:** `platform/python-sidecar/Dockerfile`
- **Pushes to:** `asia-south1-docker.pkg.dev/madhav-astrology/amjis/amjis-sidecar:latest`
- **Deploys:** Cloud Run Service (the live query sidecar)
- **Pre-build step:** Copies `035_DISCOVERY_LAYER/PROMPTS/` into the sidecar build context so prompt files are baked into the image

## When to rebuild which

| Changed | Rebuild |
|---------|---------|
| `platform/python-sidecar/` (non-pipeline code) | Sidecar |
| `platform/python-sidecar/pipeline/` | Pipeline |
| `035_DISCOVERY_LAYER/PROMPTS/` | Sidecar (prompts are baked in) |
| `platform/src/` (Next.js frontend) | Neither — Cloud Run auto-deploys via `Dockerfile` at `platform/` root |
