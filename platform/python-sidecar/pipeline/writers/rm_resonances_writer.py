"""
pipeline.writers.rm_resonances_writer — Write RM resonance pairs to l25_rm_resonances_staging.
Phase 14D Stream F.
"""
from __future__ import annotations

import logging
import os
from typing import Any

import psycopg

from pipeline.writers.base import IBuildWriter, SwapResult, ValidationResult, WriteResult

log = logging.getLogger(__name__)

TABLE_STAGING = "l25_rm_resonances_staging"
TABLE_LIVE = "l25_rm_resonances"
# Minimum absolute gate for swap (no hard expected count for RM — gate on > 0)
MIN_SWAP_GATE = 1

_INSERT_SQL = f"""
INSERT INTO {TABLE_STAGING}
  (resonance_id, signal_a_id, signal_b_id, resonance_type, strength,
   theme, notes, source_section, build_id)
VALUES
  (%(resonance_id)s, %(signal_a_id)s, %(signal_b_id)s, %(resonance_type)s, %(strength)s,
   %(theme)s, %(notes)s, %(source_section)s, %(build_id)s)
ON CONFLICT (resonance_id) DO UPDATE SET
  signal_a_id    = EXCLUDED.signal_a_id,
  signal_b_id    = EXCLUDED.signal_b_id,
  resonance_type = EXCLUDED.resonance_type,
  strength       = EXCLUDED.strength,
  theme          = EXCLUDED.theme,
  notes          = EXCLUDED.notes,
  source_section = EXCLUDED.source_section,
  build_id       = EXCLUDED.build_id
"""


def _db_url() -> str:
    url = os.environ.get("DATABASE_URL", "")
    if not url:
        raise RuntimeError("DATABASE_URL env var not set")
    return url


class RMResonancesWriter(IBuildWriter):
    """
    Writes RM resonance pair rows (from rm_extractor.extract_rm_resonances) to
    l25_rm_resonances_staging, with staging-then-swap lifecycle.
    """

    def write_to_staging(self, rows: list[Any], build_id: str) -> WriteResult:
        """
        Write RM resonance dicts to l25_rm_resonances_staging.

        Args:
            rows: list[dict] from extract_rm_resonances().
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
                    "resonance_id": row["resonance_id"],
                    "signal_a_id": row["signal_a_id"],
                    "signal_b_id": row["signal_b_id"],
                    "resonance_type": row["resonance_type"],
                    "strength": row["strength"],
                    "theme": row.get("theme"),
                    "notes": row.get("notes"),
                    "source_section": row["source_section"],
                    "build_id": build_id,
                }
                try:
                    conn.execute(_INSERT_SQL, params)
                    written += 1
                except Exception as exc:
                    errors.append(f"{row['resonance_id']}: {exc}")
            conn.commit()

        log.info(
            "rm_resonances_staging written: %d rows, %d errors",
            written, len(errors),
        )
        return WriteResult(chunk_count=written, errors=errors)

    def validate_staging(self, build_id: str) -> ValidationResult:
        """
        Verify that l25_rm_resonances_staging has at least 1 row for this build_id.

        Returns:
            ValidationResult(valid=True) when count > 0.
        """
        with psycopg.connect(_db_url()) as conn:
            row = conn.execute(
                "SELECT COUNT(*) FROM l25_rm_resonances_staging WHERE build_id = %s",
                (build_id,),
            ).fetchone()
            count = int(row[0]) if row else 0

        valid = count > 0
        issues = [] if valid else [
            f"No rows in staging for build_id={build_id}"
        ]
        log.info(
            "rm_resonances validate_staging: build_id=%s count=%d valid=%s",
            build_id, count, valid,
        )
        return ValidationResult(valid=valid, chunk_count=count, issues=issues)

    def swap_to_live(self, build_id: str) -> SwapResult:
        """
        Promote l25_rm_resonances_staging → l25_rm_resonances in a single transaction.

        Safety gate: 0.5× live count (skip gate if live table is empty).
        Steps: DELETE live; INSERT from staging; TRUNCATE staging — all atomic.
        """
        with psycopg.connect(_db_url()) as conn:
            live_count = int(
                (conn.execute("SELECT COUNT(*) FROM l25_rm_resonances").fetchone() or [0])[0]
            )
            staging_count = int(
                (
                    conn.execute(
                        "SELECT COUNT(*) FROM l25_rm_resonances_staging WHERE build_id = %s",
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
                conn.execute("DELETE FROM l25_rm_resonances")
                conn.execute(
                    """
                    INSERT INTO l25_rm_resonances
                      (resonance_id, signal_a_id, signal_b_id, resonance_type, strength,
                       theme, notes, source_section, build_id)
                    SELECT
                      resonance_id, signal_a_id, signal_b_id, resonance_type, strength,
                      theme, notes, source_section, build_id
                    FROM l25_rm_resonances_staging
                    WHERE build_id = %s
                    """,
                    (build_id,),
                )
                conn.execute("TRUNCATE l25_rm_resonances_staging")

                # Best-effort build_manifests update — skip if table/FK not present
                try:
                    conn.execute(
                        "UPDATE build_manifests SET status='live', promoted_at=NOW() WHERE build_id=%s",
                        (build_id,),
                    )
                except Exception as exc:
                    log.warning("build_manifests update skipped: %s", exc)

        log.info(
            "rm_resonances swap_to_live: promoted %d rows for build_id=%s",
            staging_count, build_id,
        )
        return SwapResult(
            success=True,
            promoted_chunk_count=staging_count,
            message=f"l25_rm_resonances live: {staging_count} rows (build_id={build_id})",
        )
