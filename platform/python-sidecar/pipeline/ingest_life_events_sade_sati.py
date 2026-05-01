"""
pipeline.ingest_life_events_sade_sati — Phase 14C Stream E one-shot runner.

Extracts LIFE_EVENT_LOG_v1_2.md and SADE_SATI_CYCLES_ALL.md from GCS,
writes to staging tables, validates, and swaps to live.

Usage:
  cd platform/python-sidecar
  DATABASE_URL=... python -m pipeline.ingest_life_events_sade_sati [--dry-run]
"""
from __future__ import annotations

import argparse
import logging
import os
import sys

import psycopg

logging.basicConfig(
    stream=sys.stdout,
    level=logging.INFO,
    format="%(levelname)s %(name)s %(message)s",
)
log = logging.getLogger(__name__)

BUILD_ID = "build-14c-life-events-sade-sati-20260429"
IMAGE_URI = "asia-south1-docker.pkg.dev/madhav-astrology/marsys-pipeline/pipeline:v1.0.8"


def _ensure_build_manifest(build_id: str) -> None:
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
                "manual:phase-14c-stream-e",
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
    from pipeline.extractors.life_event_extractor import extract_life_events
    from pipeline.extractors.sade_sati_extractor import extract_sade_sati_phases
    from pipeline.writers.life_events_writer import LifeEventsWriter
    from pipeline.writers.sade_sati_writer import SadeSatiWriter

    jobs = [
        ("life_events", LifeEventsWriter(), extract_life_events),
        ("sade_sati", SadeSatiWriter(), extract_sade_sati_phases),
    ]

    if not dry_run:
        _ensure_build_manifest(BUILD_ID)

    all_ok = True
    for name, writer, extractor in jobs:
        log.info("=== %s ===", name.upper())
        rows = extractor()
        log.info("%s: %d rows extracted", name, len(rows))

        if dry_run:
            log.info("%s: dry-run — skipping DB writes", name)
            continue

        write_result = writer.write_to_staging(rows, BUILD_ID)
        log.info("%s staging: %d rows, errors=%s", name, write_result.chunk_count, write_result.errors[:3])

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
        log.info("ingest_life_events_sade_sati COMPLETE — build_id=%s", BUILD_ID)
    else:
        log.error("ingest_life_events_sade_sati FAILED — see errors above")
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    run(dry_run=args.dry_run)
