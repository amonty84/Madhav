#!/usr/bin/env python3
"""
gcs_sync.py — Phase 14A initial source sync

Reads VALIDATED_ASSET_REGISTRY_v1_0.json, maps each CURRENT asset to its
GCS path per GCS_LAYOUT_v1_0.md, and uploads changed or new files.
Idempotent: skips files whose sha256 matches the live GCS object.

Usage:
    python gcs_sync.py [--dry-run] [--repo-root PATH]

Environment:
    GOOGLE_APPLICATION_CREDENTIALS or gcloud ADC for auth.
    Target bucket is always gs://madhav-marsys-sources.
"""

import argparse
import datetime
import hashlib
import json
import os
import sys
from pathlib import Path

try:
    from google.cloud import storage
except ImportError:
    print("ERROR: google-cloud-storage not installed. Run: pip install google-cloud-storage")
    sys.exit(1)

BUCKET_NAME = "madhav-marsys-sources"
UPLOADED_BY = "phase_14A"

# Mapping from registry layer + local path → GCS prefix per GCS_LAYOUT_v1_0.md.
# Key: (layer, local_filename)  Value: gcs_path_within_bucket
# For each layer, a fallback prefix is used when no explicit override exists.
LAYER_GCS_PREFIX = {
    "L1": {
        "default_facts": "L1/facts/",
        "SOURCES": "L1/sources/",
        "EPHEMERIS": "L1/ephemeris/",
    },
    "L2_5": "L2_5/",
    "L3": "L3/registers/",
}

# L3 companion .md files that exist alongside registry .json entries
L3_COMPANION_MD = [
    "PATTERN_REGISTER_v1_0.md",
    "RESONANCE_REGISTER_v1_0.md",
    "CONTRADICTION_REGISTER_v1_0.md",
    "CLUSTER_ATLAS_v1_0.md",
    "INDEX.json",
]


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def get_gcs_sha256(blob) -> str | None:
    """Return the source_sha256 from blob metadata, or None."""
    blob.reload()
    meta = blob.metadata or {}
    return meta.get("source_sha256")


def local_path_for_asset(asset: dict, repo_root: Path) -> Path | None:
    """Resolve an asset's local path relative to repo_root."""
    rel = asset.get("path", "")
    if not rel:
        return None
    p = repo_root / rel
    return p if p.exists() else None


def gcs_path_for_asset(asset: dict, layer: str) -> str | None:
    """Map an asset's local path to its target GCS object name per layout doc."""
    rel = asset.get("path", "")
    filename = Path(rel).name

    if layer == "L1":
        if "/SOURCES/" in rel.upper() or "/sources/" in rel:
            return f"L1/sources/{filename}"
        if "/EPHEMERIS/" in rel.upper():
            return f"L1/ephemeris/{filename}"
        return f"L1/facts/{filename}"

    if layer == "L2_5":
        return f"L2_5/{filename}"

    if layer == "L3":
        return f"L3/registers/{filename}"

    return None


def collect_upload_jobs(registry: dict, repo_root: Path) -> list[dict]:
    """
    Return a list of {local_path, gcs_path, asset_info} dicts for every
    CURRENT asset that has both a resolvable local file and a GCS target.
    """
    jobs = []
    layers = registry.get("layers", {})

    for layer_name, layer_data in layers.items():
        if not isinstance(layer_data, dict):
            continue
        current_assets = layer_data.get("current_assets", [])
        for asset in current_assets:
            if not isinstance(asset, dict) or asset.get("status") != "CURRENT":
                continue

            local = local_path_for_asset(asset, repo_root)
            gcs = gcs_path_for_asset(asset, layer_name)

            if local is None:
                # File doesn't exist locally (coverage gap) — skip
                jobs.append({
                    "gcs_path": gcs or asset.get("path", "?"),
                    "local_path": None,
                    "result": "SKIP_NO_LOCAL",
                    "asset": asset,
                    "layer": layer_name,
                })
                continue

            if gcs is None:
                jobs.append({
                    "gcs_path": "?",
                    "local_path": str(local),
                    "result": "SKIP_NO_GCS_MAPPING",
                    "asset": asset,
                    "layer": layer_name,
                })
                continue

            jobs.append({
                "gcs_path": gcs,
                "local_path": local,
                "result": None,
                "asset": asset,
                "layer": layer_name,
            })

        # L3: also include companion .md files that exist on disk alongside .json registry entries
        if layer_name == "L3":
            l3_dir = repo_root / "035_DISCOVERY_LAYER" / "REGISTERS"
            for companion in L3_COMPANION_MD:
                p = l3_dir / companion
                if p.exists():
                    gcs = f"L3/registers/{companion}"
                    # Avoid duplicating if already added via registry
                    already = any(j["gcs_path"] == gcs for j in jobs)
                    if not already:
                        jobs.append({
                            "gcs_path": gcs,
                            "local_path": p,
                            "result": None,
                            "asset": {"asset_id": companion, "path": str(p.relative_to(repo_root)), "status": "CURRENT"},
                            "layer": "L3",
                        })

    return jobs


def run_sync(jobs: list[dict], bucket, dry_run: bool) -> list[dict]:
    results = []

    for job in jobs:
        gcs_path = job["gcs_path"]
        local_path = job["local_path"]
        pre_result = job.get("result")

        if pre_result is not None:
            # Already resolved (SKIP_NO_LOCAL / SKIP_NO_GCS_MAPPING)
            results.append({
                "asset_id": job["asset"].get("asset_id", job["asset"].get("path", "?")),
                "layer": job["layer"],
                "gcs_path": gcs_path,
                "local_path": str(local_path) if local_path else None,
                "result": pre_result,
                "sha256": None,
                "note": "",
            })
            continue

        local_sha256 = sha256_file(local_path)
        blob = bucket.blob(gcs_path)

        try:
            blob.reload()
            existing = True
        except Exception:
            existing = False

        if existing:
            remote_sha256 = get_gcs_sha256(blob)
            if remote_sha256 == local_sha256:
                results.append({
                    "asset_id": job["asset"].get("asset_id", job["asset"].get("path", "?")),
                    "layer": job["layer"],
                    "gcs_path": gcs_path,
                    "local_path": str(local_path),
                    "result": "SKIPPED",
                    "sha256": local_sha256,
                    "note": "sha256 match",
                })
                continue

        if dry_run:
            results.append({
                "asset_id": job["asset"].get("asset_id", job["asset"].get("path", "?")),
                "layer": job["layer"],
                "gcs_path": gcs_path,
                "local_path": str(local_path),
                "result": "DRY_RUN_WOULD_UPLOAD",
                "sha256": local_sha256,
                "note": "existing sha256 differs or new" if existing else "new object",
            })
            continue

        try:
            blob.metadata = {
                "source_version": job["asset"].get("path", gcs_path),
                "source_sha256": local_sha256,
                "uploaded_at": datetime.datetime.utcnow().isoformat() + "Z",
                "uploaded_by": UPLOADED_BY,
            }
            blob.upload_from_filename(str(local_path))
            results.append({
                "asset_id": job["asset"].get("asset_id", job["asset"].get("path", "?")),
                "layer": job["layer"],
                "gcs_path": gcs_path,
                "local_path": str(local_path),
                "result": "UPLOADED",
                "sha256": local_sha256,
                "note": "updated" if existing else "new",
            })
        except Exception as e:
            results.append({
                "asset_id": job["asset"].get("asset_id", job["asset"].get("path", "?")),
                "layer": job["layer"],
                "gcs_path": gcs_path,
                "local_path": str(local_path),
                "result": "ERROR",
                "sha256": local_sha256,
                "note": str(e),
            })

    return results


def main():
    parser = argparse.ArgumentParser(description="Sync MARSYS source assets to GCS.")
    parser.add_argument("--dry-run", action="store_true", help="Report what would be uploaded without uploading.")
    parser.add_argument("--repo-root", default=None, help="Path to repo root (default: grandparent of this script).")
    args = parser.parse_args()

    script_dir = Path(__file__).resolve().parent
    repo_root = Path(args.repo_root) if args.repo_root else script_dir.parent.parent.parent
    registry_path = repo_root / "00_ARCHITECTURE" / "VALIDATED_ASSET_REGISTRY_v1_0.json"

    if not registry_path.exists():
        print(f"ERROR: Registry not found at {registry_path}")
        sys.exit(1)

    with open(registry_path) as f:
        registry = json.load(f)

    client = storage.Client()
    bucket = client.bucket(BUCKET_NAME)

    jobs = collect_upload_jobs(registry, repo_root)
    results = run_sync(jobs, bucket, dry_run=args.dry_run)

    # Print summary table
    col_w = [20, 6, 45, 22]
    header = f"{'ASSET':<{col_w[0]}} {'LAYER':<{col_w[1]}} {'GCS PATH':<{col_w[2]}} {'RESULT':<{col_w[2]}}"
    print(header)
    print("-" * (sum(col_w) + 10))
    uploaded = skipped = errors = skip_no_local = 0
    for r in results:
        aid = str(r["asset_id"])[:col_w[0] - 1]
        layer = str(r["layer"])[:col_w[1] - 1]
        gp = str(r["gcs_path"])[:col_w[2] - 1]
        res = r["result"]
        note = r.get("note", "")
        if res == "UPLOADED":
            uploaded += 1
        elif res == "SKIPPED":
            skipped += 1
        elif res == "ERROR":
            errors += 1
        elif res == "SKIP_NO_LOCAL":
            skip_no_local += 1
        print(f"{aid:<{col_w[0]}} {layer:<{col_w[1]}} {gp:<{col_w[2]}} {res}  {note}")

    print()
    print(f"SUMMARY: UPLOADED={uploaded}  SKIPPED={skipped}  SKIP_NO_LOCAL={skip_no_local}  ERRORS={errors}")

    # Write JSON results for report generation
    out_path = script_dir / "gcs_sync_results.json"
    with open(out_path, "w") as f:
        json.dump({"run_at": datetime.datetime.utcnow().isoformat() + "Z", "results": results}, f, indent=2)
    print(f"Results written to {out_path}")

    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
