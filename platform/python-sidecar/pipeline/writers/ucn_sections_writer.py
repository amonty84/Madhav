"""
pipeline.writers.ucn_sections_writer — Write UCN sections to l25_ucn_sections_staging.
Phase 14D Stream C.
"""
from __future__ import annotations

import logging
import os
from typing import Any

import psycopg

from pipeline.writers.base import IBuildWriter, SwapResult, ValidationResult, WriteResult

log = logging.getLogger(__name__)

TABLE_STAGING = "l25_ucn_sections_staging"
TABLE_LIVE = "l25_ucn_sections"
MIN_EXPECTED_COUNT = 50

_INSERT_SQL = f"""
INSERT INTO {TABLE_STAGING}
  (section_id, parent_section_id, domain, title, content,
   derived_from_signals, source_lines, build_id)
VALUES
  (%(section_id)s, %(parent_section_id)s, %(domain)s, %(title)s, %(content)s,
   %(derived_from_signals)s, %(source_lines)s, %(build_id)s)
ON CONFLICT (section_id) DO UPDATE SET
  parent_section_id    = EXCLUDED.parent_section_id,
  domain               = EXCLUDED.domain,
  title                = EXCLUDED.title,
  content              = EXCLUDED.content,
  derived_from_signals = EXCLUDED.derived_from_signals,
  source_lines         = EXCLUDED.source_lines,
  build_id             = EXCLUDED.build_id
"""


def _db_url() -> str:
    url = os.environ.get("DATABASE_URL", "")
    if not url:
        raise RuntimeError("DATABASE_URL env var not set")
    return url


class UCNSectionsWriter(IBuildWriter):
    """
    Writes UCN section rows (from ucn_extractor.extract_ucn_sections) to
    l25_ucn_sections_staging, with staging-then-swap lifecycle.
    """

    def write_to_staging(self, rows: list[Any], build_id: str) -> WriteResult:
        """
        Write UCN section dicts to l25_ucn_sections_staging.

        Args:
            rows: list[dict] from extract_ucn_sections().
            build_id: The active build identifier.

        Returns:
            WriteResult with chunk_count = number of rows written.
        """
        if not rows:
            return WriteResult(chunk_count=0, errors=["No rows provided"])

        errors: list[str] = []
        written = 0

        with psycopg.connect(_db_url()) as conn:
            for row in rows:
                params = {
                    "section_id": row["section_id"],
                    "parent_section_id": row.get("parent_section_id"),
                    "domain": row.get("domain"),
                    "title": row["title"],
                    "content": row["content"],
                    "derived_from_signals": row.get("derived_from_signals", []),
                    "source_lines": row.get("source_lines"),
                    "build_id": build_id,
                }
                try:
                    conn.execute(_INSERT_SQL, params)
                    written += 1
                except Exception as exc:
                    errors.append(f"{row['section_id']}: {exc}")
            conn.commit()

        log.info("ucn_sections_staging written: %d rows, %d errors", written, len(errors))
        return WriteResult(chunk_count=written, errors=errors)

    def validate_staging(self, build_id: str) -> ValidationResult:
        """
        Verify that l25_ucn_sections_staging has >= 50 rows for this build_id.

        Returns:
            ValidationResult(valid=True) when count >= 50.
        """
        with psycopg.connect(_db_url()) as conn:
            row = conn.execute(
                "SELECT COUNT(*) FROM l25_ucn_sections_staging WHERE build_id = %s",
                (build_id,),
            ).fetchone()
            count = int(row[0]) if row else 0

        valid = count >= MIN_EXPECTED_COUNT
        issues = [] if valid else [
            f"Expected >= {MIN_EXPECTED_COUNT} rows in staging for build_id={build_id}, found {count}"
        ]
        log.info("ucn_sections validate_staging: build_id=%s count=%d valid=%s", build_id, count, valid)
        return ValidationResult(valid=valid, chunk_count=count, issues=issues)

    def swap_to_live(self, build_id: str) -> SwapResult:
        """
        Promote l25_ucn_sections_staging → l25_ucn_sections in a single transaction.

        Safety gate: staging must have >= 0.5 × live count. If live is empty, allow any
        positive count. Steps: DELETE live; INSERT from staging; TRUNCATE staging — all atomic.
        """
        with psycopg.connect(_db_url()) as conn:
            live_count = int(
                (conn.execute("SELECT COUNT(*) FROM l25_ucn_sections").fetchone() or [0])[0]
            )
            staging_count = int(
                (
                    conn.execute(
                        "SELECT COUNT(*) FROM l25_ucn_sections_staging WHERE build_id = %s",
                        (build_id,),
                    ).fetchone()
                    or [0]
                )[0]
            )

        # 0.5× safety gate — skip if live is empty
        if live_count > 0 and staging_count < (0.5 * live_count):
            msg = (
                f"ABORT: staging has {staging_count} rows but live has {live_count} — "
                "below 50% safety threshold. Swap aborted; live tables untouched."
            )
            log.error(msg)
            return SwapResult(success=False, promoted_chunk_count=0, message=msg)

        if staging_count == 0:
            msg = f"ABORT: staging has 0 rows for build_id={build_id}. Swap aborted."
            log.error(msg)
            return SwapResult(success=False, promoted_chunk_count=0, message=msg)

        with psycopg.connect(_db_url(), autocommit=False) as conn:
            with conn.transaction():
                conn.execute("DELETE FROM l25_ucn_sections")
                conn.execute(
                    """
                    INSERT INTO l25_ucn_sections
                      (section_id, parent_section_id, domain, title, content,
                       derived_from_signals, source_lines, build_id)
                    SELECT
                      section_id, parent_section_id, domain, title, content,
                      derived_from_signals, source_lines, build_id
                    FROM l25_ucn_sections_staging
                    WHERE build_id = %s
                    """,
                    (build_id,),
                )
                conn.execute("TRUNCATE l25_ucn_sections_staging")

                # Best-effort build_manifests update — skip if table/FK not present
                try:
                    conn.execute(
                        "UPDATE build_manifests SET status='live', promoted_at=NOW() WHERE build_id=%s",
                        (build_id,),
                    )
                except Exception as exc:
                    log.warning("build_manifests update skipped: %s", exc)

        log.info("ucn_sections swap_to_live: promoted %d rows for build_id=%s", staging_count, build_id)
        return SwapResult(
            success=True,
            promoted_chunk_count=staging_count,
            message=f"l25_ucn_sections live: {staging_count} rows (build_id={build_id})",
        )
