"""pipeline.writers.pattern_register_writer — Phase 14E."""
from __future__ import annotations

import logging
import os
from typing import Any

import psycopg

from pipeline.extractors.register_loader import PatternEntry, load
from pipeline.writers.base import IBuildWriter, SwapResult, ValidationResult, WriteResult

log = logging.getLogger(__name__)


def _get_db_url() -> str:
    url = os.environ.get("DATABASE_URL", "")
    if not url:
        raise RuntimeError("DATABASE_URL not set")
    return url


def _validate_signal_fks(entries: list[PatternEntry], conn: psycopg.Connection) -> list[str]:
    """Return list of signal_ids that are referenced but missing from msr_signals."""
    all_ids: set[str] = set()
    for e in entries:
        all_ids.update(e.signals_referenced)
    if not all_ids:
        return []
    rows = conn.execute(
        "SELECT signal_id FROM msr_signals WHERE signal_id = ANY(%s)",
        (list(all_ids),),
    ).fetchall()
    found = {r[0] for r in rows}
    return sorted(all_ids - found)


class PatternRegisterWriter(IBuildWriter):
    """Writes pattern_register from PATTERN_REGISTER_v1_0.json (append-only swap)."""

    def write_to_staging(self, rows: list[Any], build_id: str) -> WriteResult:
        if not rows:
            return WriteResult(chunk_count=0, errors=["No rows provided"])

        db_rows = [e.to_db_row() for e in rows]
        with psycopg.connect(_get_db_url()) as conn:
            missing = _validate_signal_fks(rows, conn)
            if missing:
                log.warning("fk_validation_warn register=%s missing=%s", "pattern", missing[:10])

            count = 0
            errors: list[str] = []
            for row in db_rows:
                try:
                    conn.execute(
                        """
                        INSERT INTO pattern_register_staging
                          (pattern_id, name, description, domain, evidence,
                           source_signal_ids, source_fact_ids, confidence,
                           discovered_at, discovered_in_build_id, status)
                        VALUES (%(pattern_id)s, %(name)s, %(description)s, %(domain)s,
                                %(evidence)s::jsonb, %(source_signal_ids)s, %(source_fact_ids)s,
                                %(confidence)s, %(discovered_at)s, %(discovered_in_build_id)s,
                                %(status)s)
                        ON CONFLICT (pattern_id) DO UPDATE SET
                          confidence = EXCLUDED.confidence,
                          description = EXCLUDED.description,
                          status = EXCLUDED.status
                        """,
                        row,
                    )
                    count += 1
                except Exception as exc:
                    errors.append(f"{row['pattern_id']}: {exc}")
            conn.commit()
        log.info("pattern_staging_written count=%d errors=%d", count, len(errors))
        return WriteResult(chunk_count=count, errors=errors)

    def validate_staging(self, build_id: str) -> ValidationResult:
        with psycopg.connect(_get_db_url()) as conn:
            count = conn.execute("SELECT COUNT(*) FROM pattern_register_staging").fetchone()[0]
        ok = count > 0
        return ValidationResult(valid=ok, chunk_count=count,
                                issues=[] if ok else ["pattern_register_staging is empty"])

    def swap_to_live(self, build_id: str) -> SwapResult:
        """Append-only swap: insert new entries; update existing (skip rejected)."""
        with psycopg.connect(_get_db_url()) as conn:
            conn.execute("""
                INSERT INTO pattern_register
                SELECT * FROM pattern_register_staging
                WHERE pattern_id NOT IN (SELECT pattern_id FROM pattern_register)
            """)
            conn.execute("""
                UPDATE pattern_register pr
                SET confidence = s.confidence,
                    description = s.description,
                    status = s.status
                FROM pattern_register_staging s
                WHERE pr.pattern_id = s.pattern_id
                  AND pr.status != 'rejected'
            """)
            promoted = conn.execute("SELECT COUNT(*) FROM pattern_register").fetchone()[0]
            conn.execute("TRUNCATE pattern_register_staging")
            conn.commit()
        log.info("pattern_swap_complete live_count=%d", promoted)
        return SwapResult(success=True, promoted_chunk_count=promoted,
                          message=f"pattern_register live: {promoted} rows")


def load_and_ingest(build_id: str = "build-l3-registers-20260429") -> WriteResult:
    entries = load("pattern")
    writer = PatternRegisterWriter()
    result = writer.write_to_staging(entries, build_id)
    if not result.errors:
        writer.swap_to_live(build_id)
    return result
