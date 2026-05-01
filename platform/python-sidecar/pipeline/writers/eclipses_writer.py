"""
pipeline.writers.eclipses_writer — Ingest ECLIPSES_1900_2100.csv into eclipses_staging.
Phase 14C Stream D.

Source: gs://madhav-marsys-sources/L1/ephemeris/ECLIPSES_1900_2100.csv
Target: eclipses_staging (staging-then-swap, see migration 016_eclipses_retrogrades.sql)

Type normalisation:
  Solar / Total*      → solar_total
  Solar / Annular*    → solar_annular
  Solar / Partial*    → solar_partial
  Lunar / Total       → lunar_total
  Lunar / Partial     → lunar_partial
  Lunar / Penumbral   → lunar_penumbral
"""
from __future__ import annotations

import csv
import io
import logging
import os
from datetime import date
from typing import Any

import psycopg
from google.cloud import storage as gcs

from pipeline.writers.base import IBuildWriter, SwapResult, ValidationResult, WriteResult

log = logging.getLogger(__name__)

TABLE_STAGING = "eclipses_staging"
TABLE_LIVE = "eclipses"
SOURCE_URI = "gs://madhav-marsys-sources/L1/ephemeris/ECLIPSES_1900_2100.csv"

# Sanity gates (brief §Stream D)
ECLIPSE_MIN = 300
ECLIPSE_MAX = 1000

_INSERT_SQL = f"""
INSERT INTO {TABLE_STAGING}
  (date, type, longitude_deg, sign, nakshatra, visibility_region, build_id, source_uri)
VALUES
  (%(date)s, %(type)s, %(longitude_deg)s, %(sign)s, %(nakshatra)s,
   %(visibility_region)s, %(build_id)s, %(source_uri)s)
ON CONFLICT (date, type) DO UPDATE SET
  longitude_deg     = EXCLUDED.longitude_deg,
  sign              = EXCLUDED.sign,
  nakshatra         = EXCLUDED.nakshatra,
  visibility_region = EXCLUDED.visibility_region,
  build_id          = EXCLUDED.build_id,
  source_uri        = EXCLUDED.source_uri
"""


def _db_url() -> str:
    url = os.environ.get("DATABASE_URL", "")
    if not url:
        raise RuntimeError("DATABASE_URL env var not set")
    return url


def _normalise_type(eclipse_type: str, subtype: str) -> str:
    t = eclipse_type.strip().lower()
    s = subtype.strip().lower()
    if t == "lunar":
        if "penumbral" in s:
            return "lunar_penumbral"
        if "partial" in s:
            return "lunar_partial"
        return "lunar_total"
    # Solar
    if "annular" in s:
        return "solar_annular"
    if "partial" in s:
        return "solar_partial"
    return "solar_total"


def load_from_gcs() -> list[dict]:
    """Fetch the eclipses CSV from GCS and parse into row dicts."""
    bucket_name, blob_path = SOURCE_URI.replace("gs://", "").split("/", 1)
    client = gcs.Client()
    blob = client.bucket(bucket_name).blob(blob_path)
    content = blob.download_as_text()

    rows = []
    reader = csv.DictReader(io.StringIO(content))
    for r in reader:
        raw_date = r["date"].strip()
        # Date may include time: "1900-05-28 14:53" → take date part only
        parsed_date = date.fromisoformat(raw_date.split(" ")[0])
        rows.append({
            "date": parsed_date,
            "type": _normalise_type(r["type"], r.get("subtype", "")),
            "longitude_deg": float(r["sidereal_long"]) if r.get("sidereal_long") else None,
            "sign": r.get("sign") or None,
            "nakshatra": r.get("nakshatra") or None,
            "visibility_region": r.get("visible_from_bhubaneswar") or None,
        })

    count = len(rows)
    if count < ECLIPSE_MIN or count > ECLIPSE_MAX:
        raise RuntimeError(
            f"Eclipse sanity gate failed: {count} rows (expected {ECLIPSE_MIN}–{ECLIPSE_MAX})"
        )
    log.info("eclipses_writer: loaded %d rows from GCS", count)
    return rows


class EclipsesWriter(IBuildWriter):
    """Write eclipse rows from ECLIPSES_1900_2100.csv into eclipses_staging."""

    def write_to_staging(self, rows: list[Any], build_id: str) -> WriteResult:
        if not rows:
            return WriteResult(chunk_count=0, errors=["No rows provided"])

        errors: list[str] = []
        written = 0

        with psycopg.connect(_db_url()) as conn:
            for row in rows:
                params = {**row, "build_id": build_id, "source_uri": SOURCE_URI}
                try:
                    conn.execute(_INSERT_SQL, params)
                    written += 1
                except Exception as exc:
                    errors.append(f"{row['date']}|{row['type']}: {exc}")
            conn.commit()

        log.info("eclipses_staging written: %d rows, %d errors", written, len(errors))
        return WriteResult(chunk_count=written, errors=errors)

    def validate_staging(self, build_id: str) -> ValidationResult:
        with psycopg.connect(_db_url()) as conn:
            row = conn.execute(
                "SELECT COUNT(*) FROM eclipses_staging WHERE build_id = %s", (build_id,)
            ).fetchone()
            count = int(row[0]) if row else 0

        valid = ECLIPSE_MIN <= count <= ECLIPSE_MAX
        issues = [] if valid else [
            f"eclipses_staging count {count} outside expected {ECLIPSE_MIN}–{ECLIPSE_MAX} for build_id={build_id}"
        ]
        log.info("eclipses validate_staging: build_id=%s count=%d valid=%s", build_id, count, valid)
        return ValidationResult(valid=valid, chunk_count=count, issues=issues)

    def swap_to_live(self, build_id: str) -> SwapResult:
        with psycopg.connect(_db_url()) as conn:
            live_count = int(
                (conn.execute("SELECT COUNT(*) FROM eclipses").fetchone() or [0])[0]
            )
            staging_count = int(
                (conn.execute(
                    "SELECT COUNT(*) FROM eclipses_staging WHERE build_id = %s", (build_id,)
                ).fetchone() or [0])[0]
            )

        if live_count > 0 and staging_count < (0.5 * live_count):
            msg = (
                f"ABORT: staging={staging_count} rows, live={live_count} — "
                "below 50% safety threshold."
            )
            log.error(msg)
            return SwapResult(success=False, promoted_chunk_count=0, message=msg)

        with psycopg.connect(_db_url(), autocommit=False) as conn:
            with conn.transaction():
                conn.execute("DELETE FROM eclipses")
                conn.execute(
                    """
                    INSERT INTO eclipses
                      (date, type, longitude_deg, sign, nakshatra,
                       visibility_region, build_id, source_uri)
                    SELECT date, type, longitude_deg, sign, nakshatra,
                           visibility_region, build_id, source_uri
                    FROM eclipses_staging
                    WHERE build_id = %s
                    """,
                    (build_id,),
                )
                conn.execute("TRUNCATE eclipses_staging")
                try:
                    conn.execute(
                        "UPDATE build_manifests SET status='live', promoted_at=NOW() WHERE build_id=%s",
                        (build_id,),
                    )
                except Exception as exc:
                    log.warning("build_manifests update skipped: %s", exc)

        log.info("eclipses swap_to_live: promoted %d rows for build_id=%s", staging_count, build_id)
        return SwapResult(
            success=True,
            promoted_chunk_count=staging_count,
            message=f"eclipses live: {staging_count} rows (build_id={build_id})",
        )
