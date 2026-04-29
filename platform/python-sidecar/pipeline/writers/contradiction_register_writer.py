"""pipeline.writers.contradiction_register_writer — Phase 14E."""
from __future__ import annotations

import logging
import os
from typing import Any

import psycopg

from pipeline.extractors.register_loader import ContradictionEntry, load
from pipeline.writers.base import IBuildWriter, SwapResult, ValidationResult, WriteResult

log = logging.getLogger(__name__)


def _get_db_url() -> str:
    url = os.environ.get("DATABASE_URL", "")
    if not url:
        raise RuntimeError("DATABASE_URL not set")
    return url


def _validate_signal_fks(entries: list[ContradictionEntry], conn: psycopg.Connection) -> list[str]:
    all_ids: set[str] = set()
    for e in entries:
        all_ids.update(e.signals_in_conflict)
    if not all_ids:
        return []
    rows = conn.execute(
        "SELECT signal_id FROM msr_signals WHERE signal_id = ANY(%s)",
        (list(all_ids),),
    ).fetchall()
    found = {r[0] for r in rows}
    return sorted(all_ids - found)


class ContradictionRegisterWriter(IBuildWriter):
    """Writes contradiction_register from CONTRADICTION_REGISTER_v1_0.json (append-only swap)."""

    def write_to_staging(self, rows: list[Any], build_id: str) -> WriteResult:
        if not rows:
            return WriteResult(chunk_count=0, errors=["No rows provided"])

        db_rows = [e.to_db_row() for e in rows]
        with psycopg.connect(_get_db_url()) as conn:
            missing = _validate_signal_fks(rows, conn)
            if missing:
                log.warning("fk_validation_warn register=%s missing=%s", "contradiction", missing[:10])

            count = 0
            errors: list[str] = []
            for row in db_rows:
                try:
                    conn.execute(
                        """
                        INSERT INTO contradiction_register_staging
                          (contradiction_id, statement_a, statement_b, conflict_type,
                           evidence, source_signal_ids, source_fact_ids,
                           resolution_status, resolution_notes, domain, confidence,
                           discovered_at, discovered_in_build_id)
                        VALUES (%(contradiction_id)s, %(statement_a)s, %(statement_b)s,
                                %(conflict_type)s, %(evidence)s::jsonb, %(source_signal_ids)s,
                                %(source_fact_ids)s, %(resolution_status)s, %(resolution_notes)s,
                                %(domain)s, %(confidence)s, %(discovered_at)s,
                                %(discovered_in_build_id)s)
                        ON CONFLICT (contradiction_id) DO UPDATE SET
                          resolution_status = CASE
                            WHEN contradiction_register_staging.resolution_status = 'dismissed'
                              THEN contradiction_register_staging.resolution_status
                            ELSE EXCLUDED.resolution_status
                          END,
                          resolution_notes = EXCLUDED.resolution_notes,
                          confidence = EXCLUDED.confidence
                        """,
                        row,
                    )
                    count += 1
                except Exception as exc:
                    errors.append(f"{row['contradiction_id']}: {exc}")
            conn.commit()
        log.info("contradiction_staging_written count=%d errors=%d", count, len(errors))
        return WriteResult(chunk_count=count, errors=errors)

    def validate_staging(self, build_id: str) -> ValidationResult:
        with psycopg.connect(_get_db_url()) as conn:
            count = conn.execute("SELECT COUNT(*) FROM contradiction_register_staging").fetchone()[0]
        ok = count > 0
        return ValidationResult(valid=ok, chunk_count=count,
                                issues=[] if ok else ["contradiction_register_staging is empty"])

    def swap_to_live(self, build_id: str) -> SwapResult:
        """Append-only swap: contradictions dismissed by a human are never auto-revived."""
        with psycopg.connect(_get_db_url()) as conn:
            conn.execute("""
                INSERT INTO contradiction_register
                SELECT * FROM contradiction_register_staging
                WHERE contradiction_id NOT IN (SELECT contradiction_id FROM contradiction_register)
            """)
            conn.execute("""
                UPDATE contradiction_register cr
                SET resolution_status = s.resolution_status,
                    resolution_notes = s.resolution_notes,
                    confidence = s.confidence
                FROM contradiction_register_staging s
                WHERE cr.contradiction_id = s.contradiction_id
                  AND cr.resolution_status NOT IN ('dismissed', 'accepted')
            """)
            promoted = conn.execute("SELECT COUNT(*) FROM contradiction_register").fetchone()[0]
            conn.execute("TRUNCATE contradiction_register_staging")
            conn.commit()
        log.info("contradiction_swap_complete live_count=%d", promoted)
        return SwapResult(success=True, promoted_chunk_count=promoted,
                          message=f"contradiction_register live: {promoted} rows")


def load_and_ingest(build_id: str = "build-l3-registers-20260429") -> WriteResult:
    entries = load("contradiction")
    writer = ContradictionRegisterWriter()
    result = writer.write_to_staging(entries, build_id)
    if not result.errors:
        writer.swap_to_live(build_id)
    return result
