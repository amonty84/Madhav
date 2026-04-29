"""
pipeline.writers.cgm_nodes_writer — Write CGM nodes to l25_cgm_nodes_staging.
Phase 14D Stream E.
"""
from __future__ import annotations

import json
import logging
import os
from typing import Any

import psycopg

from pipeline.writers.base import IBuildWriter, SwapResult, ValidationResult, WriteResult

log = logging.getLogger(__name__)

TABLE_STAGING = "l25_cgm_nodes_staging"
TABLE_LIVE = "l25_cgm_nodes"
MIN_VALID_COUNT = 10

_INSERT_SQL = f"""
INSERT INTO {TABLE_STAGING}
  (node_id, node_type, display_name, properties, source_section, build_id)
VALUES
  (%(node_id)s, %(node_type)s, %(display_name)s, %(properties)s::jsonb,
   %(source_section)s, %(build_id)s)
ON CONFLICT (node_id) DO UPDATE SET
  node_type      = EXCLUDED.node_type,
  display_name   = EXCLUDED.display_name,
  properties     = EXCLUDED.properties,
  source_section = EXCLUDED.source_section,
  build_id       = EXCLUDED.build_id
"""


def _db_url() -> str:
    url = os.environ.get("DATABASE_URL", "")
    if not url:
        raise RuntimeError("DATABASE_URL env var not set")
    return url


class CGMNodesWriter(IBuildWriter):
    """
    Writes CGM node rows (from cgm_extractor.extract_cgm_nodes) to
    l25_cgm_nodes_staging, with staging-then-swap lifecycle.
    """

    def write_to_staging(self, rows: list[Any], build_id: str) -> WriteResult:
        """
        Write CGM node dicts to l25_cgm_nodes_staging.

        Args:
            rows: list[dict] from extract_cgm_nodes().
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
                    "node_id": row["node_id"],
                    "node_type": row["node_type"],
                    "display_name": row["display_name"],
                    "properties": json.dumps(row["properties"]),
                    "source_section": row["source_section"],
                    "build_id": build_id,
                }
                try:
                    conn.execute(_INSERT_SQL, params)
                    written += 1
                except Exception as exc:
                    errors.append(f"{row['node_id']}: {exc}")
            conn.commit()

        log.info(
            "cgm_nodes_staging written: %d rows, %d errors",
            written, len(errors),
        )
        return WriteResult(chunk_count=written, errors=errors)

    def validate_staging(self, build_id: str) -> ValidationResult:
        """
        Verify that l25_cgm_nodes_staging has >= 10 rows for this build_id.

        Returns:
            ValidationResult(valid=True) when count >= 10.
        """
        with psycopg.connect(_db_url()) as conn:
            row = conn.execute(
                "SELECT COUNT(*) FROM l25_cgm_nodes_staging WHERE build_id = %s",
                (build_id,),
            ).fetchone()
            count = int(row[0]) if row else 0

        valid = count >= MIN_VALID_COUNT
        issues = [] if valid else [
            f"Expected >= {MIN_VALID_COUNT} rows in staging for build_id={build_id}, found {count}"
        ]
        log.info(
            "cgm_nodes validate_staging: build_id=%s count=%d valid=%s",
            build_id, count, valid,
        )
        return ValidationResult(valid=valid, chunk_count=count, issues=issues)

    def swap_to_live(self, build_id: str) -> SwapResult:
        """
        Promote l25_cgm_nodes_staging → l25_cgm_nodes in a single transaction.

        Safety gate: staging must have >= 0.5 × live count. Skip gate if live is empty.
        Steps: DELETE live; INSERT from staging; TRUNCATE staging — all atomic.
        """
        with psycopg.connect(_db_url()) as conn:
            live_count = int(
                (conn.execute("SELECT COUNT(*) FROM l25_cgm_nodes").fetchone() or [0])[0]
            )
            staging_count = int(
                (
                    conn.execute(
                        "SELECT COUNT(*) FROM l25_cgm_nodes_staging WHERE build_id = %s",
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

        with psycopg.connect(_db_url(), autocommit=False) as conn:
            with conn.transaction():
                conn.execute("DELETE FROM l25_cgm_nodes")
                conn.execute(
                    """
                    INSERT INTO l25_cgm_nodes
                      (node_id, node_type, display_name, properties, source_section, build_id)
                    SELECT
                      node_id, node_type, display_name, properties, source_section, build_id
                    FROM l25_cgm_nodes_staging
                    WHERE build_id = %s
                    """,
                    (build_id,),
                )
                conn.execute("TRUNCATE l25_cgm_nodes_staging")

                # Best-effort build_manifests update — skip if table/FK not present
                try:
                    conn.execute(
                        "UPDATE build_manifests SET status='live', promoted_at=NOW() "
                        "WHERE build_id=%s",
                        (build_id,),
                    )
                except Exception as exc:
                    log.warning("build_manifests update skipped: %s", exc)

        log.info(
            "cgm_nodes swap_to_live: promoted %d rows for build_id=%s",
            staging_count, build_id,
        )
        return SwapResult(
            success=True,
            promoted_chunk_count=staging_count,
            message=f"l25_cgm_nodes live: {staging_count} rows (build_id={build_id})",
        )
