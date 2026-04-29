"""
pipeline.extractors.sade_sati_extractor — Parse SADE_SATI_CYCLES_ALL.md from GCS.
Phase 14C Stream E.

Returns list[dict] with one dict per phase row, ready for SadeSatiWriter.
"""
from __future__ import annotations

import io
import logging
import re
from datetime import date
from typing import Any

from google.cloud import storage as gcs

log = logging.getLogger(__name__)

SOURCE_URI = "gs://madhav-marsys-sources/L1/facts/SADE_SATI_CYCLES_ALL.md"

_CYCLE_MAP = {
    "Pre-Birth": 0,
    "Cycle 1": 1,
    "Cycle 2": 2,
    "Cycle 3": 3,
    "Cycle 4": 4,
}

_PHASE_MAP = {
    "Rising": "rising",
    "Peak": "peak",
    "Setting": "setting",
}


def _load_source() -> str:
    bucket_name, blob_path = SOURCE_URI.replace("gs://", "").split("/", 1)
    client = gcs.Client()
    blob = client.bucket(bucket_name).blob(blob_path)
    return blob.download_as_text()


def extract_sade_sati_phases() -> list[dict[str, Any]]:
    """
    Parse the Sade Sati table in SADE_SATI_CYCLES_ALL.md.

    Table format (pipe-delimited):
      | ID | Cycle | Saturn Sign | Start | End | Phase |

    Returns list[dict] ready for SadeSatiWriter.write_to_staging().
    """
    content = _load_source()
    rows: list[dict[str, Any]] = []

    # Match the main table rows: | TRS.SS.* | Cycle ... | Saturn Sign | Start | End | Phase |
    table_pattern = re.compile(
        r"\|\s*`(TRS\.SS\.[^`]+)`\s*\|"
        r"\s*([^|]+)\|"   # Cycle
        r"\s*([^|]+)\|"   # Saturn Sign
        r"\s*(\d{4}-\d{2}-\d{2})\s*\|"  # Start
        r"\s*(\d{4}-\d{2}-\d{2})\s*\|"  # End
        r"\s*([^|]+)\|"   # Phase
    )

    for match in table_pattern.finditer(content):
        trs_id = match.group(1).strip()
        cycle_raw = match.group(2).strip()
        saturn_sign = match.group(3).strip()
        start_date = date.fromisoformat(match.group(4).strip())
        end_date = date.fromisoformat(match.group(5).strip())
        phase_raw = match.group(6).strip()

        cycle_number = _CYCLE_MAP.get(cycle_raw, -1)
        phase = _PHASE_MAP.get(phase_raw, "rising")

        rows.append({
            "cycle_number": cycle_number,
            "phase": phase,
            "start_date": start_date,
            "end_date": end_date,
            "saturn_sign_at_start": saturn_sign,
            "notes": trs_id,
            "source_section": f"SADE_SATI_CYCLES_ALL.md — {trs_id}",
        })

    count = len(rows)
    if count < 20 or count > 80:
        raise RuntimeError(f"sade_sati sanity gate: {count} phase rows (expected 20–80)")
    log.info("sade_sati_extractor: extracted %d phase rows from GCS", count)
    return rows
