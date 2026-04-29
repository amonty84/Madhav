"""
pipeline.writers.cdlm_links_writer — Write CDLM domain-link rows to l25_cdlm_links_staging.
Phase 14D Stream D.
"""
from __future__ import annotations

import logging
import os
from typing import Any

import psycopg

from pipeline.writers.base import IBuildWriter, SwapResult, ValidationResult, WriteResult

log = logging.getLogger(__name__)

TABLE_STAGING = "l25_cdlm_links_staging"
TABLE_LIVE = "l25_cdlm_links"
EXPECTED_COUNT = 81
MIN_SWAP_GATE = 40  # 0.5× of 81, rounded down

_INSERT_SQL = f"""
INSERT INTO {TABLE_STAGING}
  (link_id, from_domain, to_domain, link_type, strength,
   source_signals, notes, source_section, build_id)
VALUES
  (%(link_id)s, %(from_domain)s, %(to_domain)s, %(link_type)s, %(strength)s,
   %(source_signals)s, %(notes)s, %(source_section)s, %(build_id)s)
ON CONFLICT (link_id) DO UPDATE SET
  from_domain    = EXCLUDED.from_domain,
  to_domain      = EXCLUDED.to_domain,
  link_type      = EXCLUDED.link_type,
  strength       = EXCLUDED.strength,
  source_signals = EXCLUDED.source_signals,
  notes          = EXCLUDED.notes,
  source_section = EXCLUDED.source_section,
  build_id       = EXCLUDED.build_id
"""


def _db_url() -> str:
    url = os.environ.get("DATABASE_URL", "")
    if not url:
        raise RuntimeError("DATABASE_URL env var not set")
    return url


class CDLMLinksWriter(IBuildWriter):
    """
    Writes CDLM link rows (from cdlm_extractor.extract_cdlm_links) to
    l25_cdlm_links_staging, with staging-then-swap lifecycle.
    """

    def write_to_staging(self, rows: list[Any], build_id: str) -> WriteResult:
        """
        Write CDLM link dicts to l25_cdlm_links_staging.

        Args:
            rows: list[dict] from extract_cdlm_links().
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
                    "link_id": row["link_id"],
                    "from_domain": row["from_domain"],
                    "to_domain": row["to_domain"],
                    "link_type": row["link_type"],
                    "strength": row["strength"],
                    "source_signals": row.get("source_signals", []),
                    "notes": row.get("notes"),
                    "source_section": row["source_section"],
                    "build_id": build_id,
                }
                try:
                    conn.execute(_INSERT_SQL, params)
                    written += 1
                except Exception as exc:
                    errors.append(f"{row['link_id']}: {exc}")
            conn.commit()

        log.info("cdlm_links_staging written: %d rows, %d errors", written, len(errors))
        return WriteResult(chunk_count=written, errors=errors)

    def validate_staging(self, build_id: str) -> ValidationResult:
        """
        Verify that l25_cdlm_links_staging has exactly 81 rows for this build_id.

        Returns:
            ValidationResult(valid=True) when count == 81.
        """
        with psycopg.connect(_db_url()) as conn:
            row = conn.execute(
                "SELECT COUNT(*) FROM l25_cdlm_links_staging WHERE build_id = %s",
                (build_id,),
            ).fetchone()
            count = int(row[0]) if row else 0

        valid = count == EXPECTED_COUNT
        issues = [] if valid else [
            f"Expected exactly {EXPECTED_COUNT} rows in staging for build_id={build_id}, found {count}"
        ]
        log.info(
            "cdlm_links validate_staging: build_id=%s count=%d valid=%s",
            build_id, count, valid,
        )
        return ValidationResult(valid=valid, chunk_count=count, issues=issues)

    def swap_to_live(self, build_id: str) -> SwapResult:
        """
        Promote l25_cdlm_links_staging → l25_cdlm_links in a single transaction.

        Safety gate: staging must have >= 40 rows (0.5× of 81).
        Steps: DELETE live; INSERT from staging; TRUNCATE staging — all atomic.
        """
        with psycopg.connect(_db_url()) as conn:
            live_count = int(
                (conn.execute("SELECT COUNT(*) FROM l25_cdlm_links").fetchone() or [0])[0]
            )
            staging_count = int(
                (
                    conn.execute(
                        "SELECT COUNT(*) FROM l25_cdlm_links_staging WHERE build_id = %s",
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

        # Absolute minimum gate
        if staging_count < MIN_SWAP_GATE:
            msg = (
                f"ABORT: staging has {staging_count} rows for build_id={build_id}, "
                f"below minimum gate of {MIN_SWAP_GATE}. Swap aborted."
            )
            log.error(msg)
            return SwapResult(success=False, promoted_chunk_count=0, message=msg)

        with psycopg.connect(_db_url(), autocommit=False) as conn:
            with conn.transaction():
                conn.execute("DELETE FROM l25_cdlm_links")
                conn.execute(
                    """
                    INSERT INTO l25_cdlm_links
                      (link_id, from_domain, to_domain, link_type, strength,
                       source_signals, notes, source_section, build_id)
                    SELECT
                      link_id, from_domain, to_domain, link_type, strength,
                      source_signals, notes, source_section, build_id
                    FROM l25_cdlm_links_staging
                    WHERE build_id = %s
                    """,
                    (build_id,),
                )
                conn.execute("TRUNCATE l25_cdlm_links_staging")

                # Best-effort build_manifests update — skip if table/FK not present
                try:
                    conn.execute(
                        "UPDATE build_manifests SET status='live', promoted_at=NOW() WHERE build_id=%s",
                        (build_id,),
                    )
                except Exception as exc:
                    log.warning("build_manifests update skipped: %s", exc)

        log.info(
            "cdlm_links swap_to_live: promoted %d rows for build_id=%s",
            staging_count, build_id,
        )
        return SwapResult(
            success=True,
            promoted_chunk_count=staging_count,
            message=f"l25_cdlm_links live: {staging_count} rows (build_id={build_id})",
        )
