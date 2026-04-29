"""
pipeline.writers.retrogrades_writer — Ingest RETROGRADES_1900_2100.csv into retrogrades_staging.
Phase 14C Stream D.

Source: gs://madhav-marsys-sources/L1/ephemeris/RETROGRADES_1900_2100.csv
Target: retrogrades_staging (staging-then-swap, see migration 016_eclipses_retrogrades.sql)

Each CSV row (one retrograde cycle) produces 2 DB rows:
  station_type='retrograde_start'  at station_retro_date / deg_at_station_retro
  station_type='retrograde_end'    at station_direct_date / deg_at_station_direct

Planets: Mercury, Venus, Mars, Jupiter, Saturn.
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

TABLE_STAGING = "retrogrades_staging"
TABLE_LIVE = "retrogrades"
SOURCE_URI = "gs://madhav-marsys-sources/L1/ephemeris/RETROGRADES_1900_2100.csv"

# Each CSV row → 2 station rows; 1231 CSV rows → 2462 DB rows
# Gate: > 10K = duplicate; < 1500 = truncated data
RETROGRADE_MIN = 1500
RETROGRADE_MAX = 10_000

_INSERT_SQL = f"""
INSERT INTO {TABLE_STAGING}
  (planet, station_type, date, longitude_deg, sign, nakshatra, build_id, source_uri)
VALUES
  (%(planet)s, %(station_type)s, %(date)s, %(longitude_deg)s,
   %(sign)s, %(nakshatra)s, %(build_id)s, %(source_uri)s)
ON CONFLICT (planet, station_type, date) DO UPDATE SET
  longitude_deg = EXCLUDED.longitude_deg,
  sign          = EXCLUDED.sign,
  nakshatra     = EXCLUDED.nakshatra,
  build_id      = EXCLUDED.build_id,
  source_uri    = EXCLUDED.source_uri
"""


def _db_url() -> str:
    url = os.environ.get("DATABASE_URL", "")
    if not url:
        raise RuntimeError("DATABASE_URL env var not set")
    return url


def load_from_gcs() -> list[dict]:
    """Fetch the retrogrades CSV from GCS and expand each cycle into 2 station rows."""
    bucket_name, blob_path = SOURCE_URI.replace("gs://", "").split("/", 1)
    client = gcs.Client()
    blob = client.bucket(bucket_name).blob(blob_path)
    content = blob.download_as_text()

    rows = []
    reader = csv.DictReader(io.StringIO(content))
    for r in reader:
        planet = r["planet"].strip()
        retro_date = date.fromisoformat(r["station_retro_date"].strip())
        direct_date = date.fromisoformat(r["station_direct_date"].strip())
        retro_lon = float(r["deg_at_station_retro"]) if r.get("deg_at_station_retro") else None
        direct_lon = float(r["deg_at_station_direct"]) if r.get("deg_at_station_direct") else None
        retro_sign = r.get("sign_at_station_retro") or None
        direct_sign = r.get("sign_at_station_direct") or None

        rows.append({
            "planet": planet,
            "station_type": "retrograde_start",
            "date": retro_date,
            "longitude_deg": retro_lon,
            "sign": retro_sign,
            "nakshatra": None,  # not in CSV
        })
        rows.append({
            "planet": planet,
            "station_type": "retrograde_end",
            "date": direct_date,
            "longitude_deg": direct_lon,
            "sign": direct_sign,
            "nakshatra": None,
        })

    count = len(rows)
    if count < RETROGRADE_MIN or count > RETROGRADE_MAX:
        raise RuntimeError(
            f"Retrograde sanity gate failed: {count} station rows "
            f"(expected {RETROGRADE_MIN}–{RETROGRADE_MAX})"
        )
    log.info("retrogrades_writer: loaded %d station rows from GCS", count)
    return rows


class RetrogradesWriter(IBuildWriter):
    """Write retrograde station rows from RETROGRADES_1900_2100.csv into retrogrades_staging."""

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
                    errors.append(f"{row['planet']}|{row['station_type']}|{row['date']}: {exc}")
            conn.commit()

        log.info("retrogrades_staging written: %d rows, %d errors", written, len(errors))
        return WriteResult(chunk_count=written, errors=errors)

    def validate_staging(self, build_id: str) -> ValidationResult:
        with psycopg.connect(_db_url()) as conn:
            row = conn.execute(
                "SELECT COUNT(*) FROM retrogrades_staging WHERE build_id = %s", (build_id,)
            ).fetchone()
            count = int(row[0]) if row else 0

        valid = RETROGRADE_MIN <= count <= RETROGRADE_MAX
        issues = [] if valid else [
            f"retrogrades_staging count {count} outside expected {RETROGRADE_MIN}–{RETROGRADE_MAX} for build_id={build_id}"
        ]
        log.info("retrogrades validate_staging: build_id=%s count=%d valid=%s", build_id, count, valid)
        return ValidationResult(valid=valid, chunk_count=count, issues=issues)

    def swap_to_live(self, build_id: str) -> SwapResult:
        with psycopg.connect(_db_url()) as conn:
            live_count = int(
                (conn.execute("SELECT COUNT(*) FROM retrogrades").fetchone() or [0])[0]
            )
            staging_count = int(
                (conn.execute(
                    "SELECT COUNT(*) FROM retrogrades_staging WHERE build_id = %s", (build_id,)
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
                conn.execute("DELETE FROM retrogrades")
                conn.execute(
                    """
                    INSERT INTO retrogrades
                      (planet, station_type, date, longitude_deg, sign, nakshatra,
                       build_id, source_uri)
                    SELECT planet, station_type, date, longitude_deg, sign, nakshatra,
                           build_id, source_uri
                    FROM retrogrades_staging
                    WHERE build_id = %s
                    """,
                    (build_id,),
                )
                conn.execute("TRUNCATE retrogrades_staging")
                try:
                    conn.execute(
                        "UPDATE build_manifests SET status='live', promoted_at=NOW() WHERE build_id=%s",
                        (build_id,),
                    )
                except Exception as exc:
                    log.warning("build_manifests update skipped: %s", exc)

        log.info("retrogrades swap_to_live: promoted %d rows for build_id=%s", staging_count, build_id)
        return SwapResult(
            success=True,
            promoted_chunk_count=staging_count,
            message=f"retrogrades live: {staging_count} rows (build_id={build_id})",
        )
