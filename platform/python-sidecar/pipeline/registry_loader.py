"""
pipeline.registry_loader — Read VALIDATED_ASSET_REGISTRY from GCS and compute fingerprint.
Phase 14B.
"""
from __future__ import annotations

import hashlib
import json
import logging

from google.cloud import storage

from pipeline.validators import ValidatedAssetRegistry

logger = logging.getLogger(__name__)


def load_registry(registry_uri: str) -> tuple[ValidatedAssetRegistry, str]:
    """
    Fetch registry JSON from GCS, parse into ValidatedAssetRegistry,
    return (registry, sha256_fingerprint).
    """
    if not registry_uri.startswith("gs://"):
        raise ValueError(f"registry_uri must be a gs:// URI, got: {registry_uri}")

    parts = registry_uri[5:].split("/", 1)
    bucket_name = parts[0]
    blob_name = parts[1] if len(parts) > 1 else ""

    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    raw_bytes = blob.download_as_bytes()
    logger.info("Loaded registry from %s (%d bytes)", registry_uri, len(raw_bytes))

    fingerprint = hashlib.sha256(raw_bytes).hexdigest()
    data = json.loads(raw_bytes)
    registry = ValidatedAssetRegistry.model_validate(data)

    logger.info("Registry version=%s fingerprint=%s...", registry.version, fingerprint[:16])
    return registry, fingerprint


def collect_current_assets(registry: ValidatedAssetRegistry) -> list[dict]:
    """
    Walk all layers and collect assets where status == 'CURRENT'.
    Returns list of dicts with {layer_key, asset_id, path, format}.
    Skips archived assets and assets with no status field.
    """
    result = []
    for layer_key, layer in registry.layers.items():
        for asset in layer.current_assets:
            if asset.status == "CURRENT":
                result.append({
                    "layer_key": layer_key,
                    "asset_id": asset.asset_id,
                    "path": asset.path,
                    "format": asset.format,
                })
    logger.info("Found %d CURRENT assets across layers", len(result))
    return result
