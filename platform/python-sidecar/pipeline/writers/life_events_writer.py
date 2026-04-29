"""
pipeline.writers.life_events_writer — Write life events to life_events_staging.
Phase 14C Stream E.
"""
from __future__ import annotations

import json
import logging
import os
from typing import Any

import psycopg

from pipeline.writers.base import IBuildWriter, SwapResult, ValidationResult, WriteResult

log = logging.getLogger(__name__)

TABLE_STAGING = "life_events_staging"
TABLE_LIVE = "life_events"

_INSERT_SQL = f"""
INSERT INTO {TABLE_STAGING}
  (event_id, event_date, category, description, significance, chart_state,
   source_section, build_id, provenance)
VALUES
  (%(event_id)s, %(event_date)s, %(category)s, %(description)s, %(significance)s,
   %(chart_state)s::jsonb, %(source_section)s, %(build_id)s, %(provenance)s::jsonb)
ON CONFLICT (event_id) DO UPDATE SET
  event_date    = EXCLUDED.event_date,
  category      = EXCLUDED.category,
  description   = EXCLUDED.description,
  significance  = EXCLUDED.significance,
  chart_state   = EXCLUDED.chart_state,
  source_section = EXCLUDED.source_section,
  build_id      = EXCLUDED.build_id,
  provenance    = EXCLUDED.provenance
"""


def _db_url() -> str:
    url = os.environ.get("DATABASE_URL", "")
    if not url:
        raise RuntimeError("DATABASE_URL env var not set")
    return url


class LifeEventsWriter(IBuildWriter):
    """Write life event rows from life_event_extractor into life_events_staging."""

    def write_to_staging(self, rows: list[Any], build_id: str) -> WriteResult:
        if not rows:
            return WriteResult(chunk_count=0, errors=["No rows provided"])

        errors: list[str] = []
        written = 0

        with psycopg.connect(_db_url()) as conn:
            for row in rows:
                params = {
                    **row,
                    "build_id": build_id,
                    "chart_state": json.dumps(row["chart_state"]),
                    "provenance": json.dumps(row["provenance"]),
                }
                try:
                    conn.execute(_INSERT_SQL, params)
                    written += 1
                except Exception as exc:
                    errors.append(f"{row['event_id']}: {exc}")
            conn.commit()

        log.info("life_events_staging written: %d rows, %d errors", written, len(errors))
        return WriteResult(chunk_count=written, errors=errors)

    def validate_staging(self, build_id: str) -> ValidationResult:
        with psycopg.connect(_db_url()) as conn:
            row = conn.execute(
                "SELECT COUNT(*) FROM life_events_staging WHERE build_id = %s", (build_id,)
            ).fetchone()
            count = int(row[0]) if row else 0

        valid = 30 <= count <= 40
        issues = [] if valid else [
            f"life_events_staging count {count} outside 30–40 for build_id={build_id}"
        ]
        log.info("life_events validate_staging: build_id=%s count=%d valid=%s", build_id, count, valid)
        return ValidationResult(valid=valid, chunk_count=count, issues=issues)

    def swap_to_live(self, build_id: str) -> SwapResult:
        with psycopg.connect(_db_url()) as conn:
            live_count = int(
                (conn.execute("SELECT COUNT(*) FROM life_events").fetchone() or [0])[0]
            )
            staging_count = int(
                (conn.execute(
                    "SELECT COUNT(*) FROM life_events_staging WHERE build_id = %s", (build_id,)
                ).fetchone() or [0])[0]
            )

        if live_count > 0 and staging_count < (0.5 * live_count):
            msg = (
                f"ABORT: staging={staging_count}, live={live_count} — "
                "below 50% safety threshold."
            )
            log.error(msg)
            return SwapResult(success=False, promoted_chunk_count=0, message=msg)

        with psycopg.connect(_db_url(), autocommit=False) as conn:
            with conn.transaction():
                conn.execute("DELETE FROM life_events")
                conn.execute(
                    """
                    INSERT INTO life_events
                      (event_id, event_date, category, description, significance,
                       chart_state, source_section, build_id, provenance)
                    SELECT event_id, event_date, category, description, significance,
                           chart_state, source_section, build_id, provenance
                    FROM life_events_staging
                    WHERE build_id = %s
                    """,
                    (build_id,),
                )
                conn.execute("TRUNCATE life_events_staging")
                try:
                    conn.execute(
                        "UPDATE build_manifests SET status='live', promoted_at=NOW() WHERE build_id=%s",
                        (build_id,),
                    )
                except Exception as exc:
                    log.warning("build_manifests update skipped: %s", exc)

        log.info("life_events swap_to_live: promoted %d rows for build_id=%s", staging_count, build_id)
        return SwapResult(
            success=True,
            promoted_chunk_count=staging_count,
            message=f"life_events live: {staging_count} rows (build_id={build_id})",
        )
