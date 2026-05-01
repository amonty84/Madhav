"""
pipeline.manifest_writer — Write build manifest JSON to GCS artifacts bucket.
Phase 14B.
"""
from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from typing import Any

from google.cloud import storage

logger = logging.getLogger(__name__)

EMBEDDING_MODEL = "text-multilingual-embedding-002"
EMBEDDING_DIM = 768


def write_manifest(
    artifacts_bucket: str,
    build_id: str,
    triggered_by: str,
    registry_fingerprint: str,
    pipeline_image_uri: str,
    chunk_count: int,
    embedding_count: int,
    status: str,
    asset_sha256_map: dict[str, str],
    extra: dict[str, Any] | None = None,
) -> str:
    """
    Write manifest JSON to gs://<artifacts_bucket>/build-<id>/manifest.json.
    Returns the GCS URI.
    """
    manifest: dict[str, Any] = {
        "build_id": build_id,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "triggered_by": triggered_by,
        "registry_fingerprint": registry_fingerprint,
        "pipeline_image_uri": pipeline_image_uri,
        "embedding_model": EMBEDDING_MODEL,
        "embedding_dim": EMBEDDING_DIM,
        "chunk_count": chunk_count,
        "embedding_count": embedding_count,
        "status": status,
        "asset_sha256": asset_sha256_map,
    }
    if extra:
        manifest.update(extra)

    blob_name = f"{build_id}/manifest.json"
    uri = f"gs://{artifacts_bucket}/{blob_name}"

    client = storage.Client()
    bucket = client.bucket(artifacts_bucket)
    blob = bucket.blob(blob_name)
    blob.upload_from_string(
        json.dumps(manifest, indent=2),
        content_type="application/json",
    )
    logger.info("Manifest written to %s", uri)
    return uri
