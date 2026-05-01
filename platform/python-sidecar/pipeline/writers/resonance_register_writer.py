"""pipeline.writers.resonance_register_writer — Phase 14E."""
from __future__ import annotations

import logging
import os
from typing import Any

import psycopg

from pipeline.extractors.register_loader import ResonanceEntry, load
from pipeline.writers.base import IBuildWriter, SwapResult, ValidationResult, WriteResult

log = logging.getLogger(__name__)


def _get_db_url() -> str:
    url = os.environ.get("DATABASE_URL", "")
    if not url:
        raise RuntimeError("DATABASE_URL not set")
    return url


def _validate_signal_fks(entries: list[ResonanceEntry], conn: psycopg.Connection) -> list[str]:
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


class ResonanceRegisterWriter(IBuildWriter):
    """Writes resonance_register from RESONANCE_REGISTER_v1_0.json (append-only swap)."""

    def write_to_staging(self, rows: list[Any], build_id: str) -> WriteResult:
        if not rows:
            return WriteResult(chunk_count=0, errors=["No rows provided"])

        db_rows = [e.to_db_row() for e in rows]
        with psycopg.connect(_get_db_url()) as conn:
            missing = _validate_signal_fks(rows, conn)
            if missing:
                log.warning("fk_validation_warn register=%s missing=%s", "resonance", missing[:10])

            count = 0
            errors: list[str] = []
            for row in db_rows:
                try:
                    conn.execute(
                        """
                        INSERT INTO resonance_register_staging
                          (resonance_id, theme, description, signal_ids, pattern_ids,
                           domains, confidence, discovered_at, discovered_in_build_id, status)
                        VALUES (%(resonance_id)s, %(theme)s, %(description)s,
                                %(signal_ids)s, %(pattern_ids)s, %(domains)s,
                                %(confidence)s, %(discovered_at)s,
                                %(discovered_in_build_id)s, %(status)s)
                        ON CONFLICT (resonance_id) DO UPDATE SET
                          confidence = EXCLUDED.confidence,
                          description = EXCLUDED.description
                        """,
                        row,
                    )
                    count += 1
                except Exception as exc:
                    errors.append(f"{row['resonance_id']}: {exc}")
            conn.commit()
        log.info("resonance_staging_written count=%d errors=%d", count, len(errors))
        return WriteResult(chunk_count=count, errors=errors)

    def validate_staging(self, build_id: str) -> ValidationResult:
        with psycopg.connect(_get_db_url()) as conn:
            count = conn.execute("SELECT COUNT(*) FROM resonance_register_staging").fetchone()[0]
        ok = count > 0
        return ValidationResult(valid=ok, chunk_count=count,
                                issues=[] if ok else ["resonance_register_staging is empty"])

    def swap_to_live(self, build_id: str) -> SwapResult:
        with psycopg.connect(_get_db_url()) as conn:
            conn.execute("""
                INSERT INTO resonance_register
                SELECT * FROM resonance_register_staging
                WHERE resonance_id NOT IN (SELECT resonance_id FROM resonance_register)
            """)
            conn.execute("""
                UPDATE resonance_register rr
                SET confidence = s.confidence,
                    description = s.description
                FROM resonance_register_staging s
                WHERE rr.resonance_id = s.resonance_id
                  AND rr.status != 'rejected'
            """)
            promoted = conn.execute("SELECT COUNT(*) FROM resonance_register").fetchone()[0]
            conn.execute("TRUNCATE resonance_register_staging")
            conn.commit()
        log.info("resonance_swap_complete live_count=%d", promoted)
        return SwapResult(success=True, promoted_chunk_count=promoted,
                          message=f"resonance_register live: {promoted} rows")


def load_and_ingest(build_id: str = "build-l3-registers-20260429") -> WriteResult:
    entries = load("resonance")
    writer = ResonanceRegisterWriter()
    result = writer.write_to_staging(entries, build_id)
    if not result.errors:
        writer.swap_to_live(build_id)
    return result
