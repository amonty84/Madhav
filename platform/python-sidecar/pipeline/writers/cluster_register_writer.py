"""pipeline.writers.cluster_register_writer — Phase 14E."""
from __future__ import annotations

import logging
import os
from typing import Any

import psycopg

from pipeline.extractors.register_loader import ClusterEntry, load
from pipeline.writers.base import IBuildWriter, SwapResult, ValidationResult, WriteResult

log = logging.getLogger(__name__)


def _get_db_url() -> str:
    url = os.environ.get("DATABASE_URL", "")
    if not url:
        raise RuntimeError("DATABASE_URL not set")
    return url


def _validate_signal_fks(entries: list[ClusterEntry], conn: psycopg.Connection) -> list[str]:
    all_ids: set[str] = set()
    for e in entries:
        all_ids.update(e.signal_ids)
    if not all_ids:
        return []
    rows = conn.execute(
        "SELECT signal_id FROM msr_signals WHERE signal_id = ANY(%s)",
        (list(all_ids),),
    ).fetchall()
    found = {r[0] for r in rows}
    return sorted(all_ids - found)


class ClusterRegisterWriter(IBuildWriter):
    """Writes cluster_register from CLUSTER_ATLAS_v1_0.json (append-only swap)."""

    def write_to_staging(self, rows: list[Any], build_id: str) -> WriteResult:
        if not rows:
            return WriteResult(chunk_count=0, errors=["No rows provided"])

        db_rows = [e.to_db_row() for e in rows]
        with psycopg.connect(_get_db_url()) as conn:
            missing = _validate_signal_fks(rows, conn)
            if missing:
                log.warning("fk_validation_warn register=%s missing=%s", "cluster", missing[:10])

            count = 0
            errors: list[str] = []
            for row in db_rows:
                try:
                    conn.execute(
                        """
                        INSERT INTO cluster_register_staging
                          (cluster_id, name, theme, description, member_signal_ids,
                           member_fact_ids, member_event_ids, domain, confidence,
                           discovered_at, discovered_in_build_id, status)
                        VALUES (%(cluster_id)s, %(name)s, %(theme)s, %(description)s,
                                %(member_signal_ids)s, %(member_fact_ids)s, %(member_event_ids)s,
                                %(domain)s, %(confidence)s, %(discovered_at)s,
                                %(discovered_in_build_id)s, %(status)s)
                        ON CONFLICT (cluster_id) DO UPDATE SET
                          confidence = EXCLUDED.confidence,
                          description = EXCLUDED.description
                        """,
                        row,
                    )
                    count += 1
                except Exception as exc:
                    errors.append(f"{row['cluster_id']}: {exc}")
            conn.commit()
        log.info("cluster_staging_written count=%d errors=%d", count, len(errors))
        return WriteResult(chunk_count=count, errors=errors)

    def validate_staging(self, build_id: str) -> ValidationResult:
        with psycopg.connect(_get_db_url()) as conn:
            count = conn.execute("SELECT COUNT(*) FROM cluster_register_staging").fetchone()[0]
        ok = count > 0
        return ValidationResult(valid=ok, chunk_count=count,
                                issues=[] if ok else ["cluster_register_staging is empty"])

    def swap_to_live(self, build_id: str) -> SwapResult:
        with psycopg.connect(_get_db_url()) as conn:
            conn.execute("""
                INSERT INTO cluster_register
                SELECT * FROM cluster_register_staging
                WHERE cluster_id NOT IN (SELECT cluster_id FROM cluster_register)
            """)
            conn.execute("""
                UPDATE cluster_register cr
                SET confidence = s.confidence,
                    description = s.description
                FROM cluster_register_staging s
                WHERE cr.cluster_id = s.cluster_id
                  AND cr.status != 'rejected'
            """)
            promoted = conn.execute("SELECT COUNT(*) FROM cluster_register").fetchone()[0]
            conn.execute("TRUNCATE cluster_register_staging")
            conn.commit()
        log.info("cluster_swap_complete live_count=%d", promoted)
        return SwapResult(success=True, promoted_chunk_count=promoted,
                          message=f"cluster_register live: {promoted} rows")


def load_and_ingest(build_id: str = "build-l3-registers-20260429") -> WriteResult:
    entries = load("cluster")
    writer = ClusterRegisterWriter()
    result = writer.write_to_staging(entries, build_id)
    if not result.errors:
        writer.swap_to_live(build_id)
    return result
