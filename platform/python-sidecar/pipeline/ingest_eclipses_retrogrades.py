"""
pipeline.ingest_eclipses_retrogrades — Phase 14C Stream D one-shot runner.

Loads ECLIPSES_1900_2100.csv and RETROGRADES_1900_2100.csv from GCS,
writes to staging tables, validates, and swaps to live.

Usage:
  cd platform/python-sidecar
  DATABASE_URL=... python -m pipeline.ingest_eclipses_retrogrades [--dry-run]
"""
from __future__ import annotations

import argparse
import logging
import sys

import os

import psycopg

logging.basicConfig(
    stream=sys.stdout,
    level=logging.INFO,
    format="%(levelname)s %(name)s %(message)s",
)
log = logging.getLogger(__name__)

BUILD_ID = "build-14c-eclipses-retrogrades-20260429"
IMAGE_URI = "asia-south1-docker.pkg.dev/madhav-astrology/marsys-pipeline/pipeline:v1.0.5"


def _ensure_build_manifest(build_id: str) -> None:
    """Insert a build_manifests row for this ingest build_id if not already present."""
    db_url = os.environ.get("DATABASE_URL", "")
    if not db_url:
        raise RuntimeError("DATABASE_URL env var not set")
    with psycopg.connect(db_url) as conn:
        existing = conn.execute(
            "SELECT 1 FROM build_manifests WHERE build_id = %s", (build_id,)
        ).fetchone()
        if existing:
            log.info("build_manifest already exists for build_id=%s", build_id)
            return
        conn.execute(
            """
            INSERT INTO build_manifests
              (build_id, triggered_by, registry_fingerprint, pipeline_image_uri,
               embedding_model, embedding_dim, chunk_count, embedding_count, status, manifest_uri)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                build_id,
                "manual:phase-14c-stream-d",
                "n/a",
                IMAGE_URI,
                "n/a",
                0,
                0,
                0,
                "live",
                f"gs://madhav-marsys-build-artifacts/{build_id}/manifest.json",
            ),
        )
        conn.commit()
    log.info("build_manifest registered for build_id=%s", build_id)


def run(dry_run: bool = False) -> None:
    from pipeline.writers.eclipses_writer import EclipsesWriter, load_from_gcs as load_eclipses
    from pipeline.writers.retrogrades_writer import RetrogradesWriter, load_from_gcs as load_retrogrades

    jobs = [
        ("eclipses", EclipsesWriter(), load_eclipses),
        ("retrogrades", RetrogradesWriter(), load_retrogrades),
    ]

    if not dry_run:
        _ensure_build_manifest(BUILD_ID)

    all_ok = True
    for name, writer, loader in jobs:
        log.info("=== %s ===", name.upper())
        rows = loader()
        log.info("%s: %d rows loaded from GCS", name, len(rows))

        if dry_run:
            log.info("%s: dry-run — skipping DB writes", name)
            continue

        write_result = writer.write_to_staging(rows, BUILD_ID)
        log.info("%s staging: %d rows written, errors=%s", name, write_result.chunk_count, write_result.errors[:3])

        val = writer.validate_staging(BUILD_ID)
        log.info("%s validate: valid=%s count=%d issues=%s", name, val.valid, val.chunk_count, val.issues)

        if not val.valid:
            log.error("%s validation FAILED: %s", name, val.issues)
            all_ok = False
            continue

        swap = writer.swap_to_live(BUILD_ID)
        log.info("%s swap: %s", name, swap.message)
        if not swap.success:
            log.error("%s swap FAILED", name)
            all_ok = False

    if dry_run:
        log.info("Dry-run complete — no DB writes performed.")
        return

    if all_ok:
        log.info("ingest_eclipses_retrogrades COMPLETE — build_id=%s", BUILD_ID)
    else:
        log.error("ingest_eclipses_retrogrades FAILED — see errors above")
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Load from GCS but skip DB writes")
    args = parser.parse_args()
    run(dry_run=args.dry_run)
