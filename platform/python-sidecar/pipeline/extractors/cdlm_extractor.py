"""
pipeline.extractors.cdlm_extractor — Extract CDLM 9x9 domain-link matrix.
Phase 14D Stream D.

Parses CDLM_v1_1.md and returns 81 row dicts matching the l25_cdlm_links schema.
Delegates cell parsing to rag.chunkers.cdlm_cell helpers.
"""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

from rag.chunkers.cdlm_cell import (
    DOMAIN_MAP,
    _cell_id,
    _normalize_anchors,
    _parse_cells,
)

log = logging.getLogger(__name__)

SOURCE_FILE = "025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md"
EXPECTED_COUNT = 81


def _strength_label(score: Any) -> str:
    """Derive strength label from numeric score.

    >= 0.7  → 'strong'
    >= 0.4  → 'moderate'
    >  0    → 'weak'
    == 0 or None → 'nil'
    """
    if score is None:
        return "nil"
    try:
        val = float(score)
    except (TypeError, ValueError):
        return "nil"
    if val >= 0.7:
        return "strong"
    if val >= 0.4:
        return "moderate"
    if val > 0:
        return "weak"
    return "nil"


def extract_cdlm_links(repo_root: str) -> list[dict[str, Any]]:
    """
    Parse CDLM_v1_1.md and return one dict per cell matching the l25_cdlm_links schema.

    Args:
        repo_root: Absolute path to the repository root.

    Returns:
        List of exactly 81 link dicts.

    Raises:
        FileNotFoundError: If CDLM_v1_1.md is not found.
        ValueError: If the parsed cell count is not exactly 81.
    """
    cdlm_path = Path(repo_root) / SOURCE_FILE
    if not cdlm_path.exists():
        raise FileNotFoundError(f"CDLM_v1_1.md not found at {cdlm_path}")

    cells = _parse_cells(cdlm_path)
    rows: list[dict[str, Any]] = []

    for cell_key, _yaml_body, data in cells:
        # Derive from_domain / to_domain from cell_key (e.g. 'CDLM.D1.D2')
        parts = cell_key.split(".")
        if len(parts) == 3:
            from_domain = DOMAIN_MAP.get(parts[1], parts[1])
            to_domain = DOMAIN_MAP.get(parts[2], parts[2])
        else:
            from_domain = data.get("row_domain", "")
            to_domain = data.get("col_domain", "")

        link_id = _cell_id(cell_key)
        link_type = str(data.get("linkage_type", "NEUTRAL") or "NEUTRAL").strip() or "NEUTRAL"
        strength = _strength_label(data.get("strength"))
        source_signals = _normalize_anchors(data.get("msr_anchors", []))
        notes = data.get("key_finding") or None
        if notes is not None:
            notes = str(notes).strip() or None

        row: dict[str, Any] = {
            "link_id": link_id,
            "from_domain": from_domain,
            "to_domain": to_domain,
            "link_type": link_type,
            "strength": strength,
            "source_signals": source_signals,
            "notes": notes,
            "source_section": cell_key,
            "build_id": "",  # filled in by writer
        }
        rows.append(row)

    if len(rows) != EXPECTED_COUNT:
        raise ValueError(
            f"CDLM extractor expected {EXPECTED_COUNT} cells, got {len(rows)}. "
            "Check CDLM_v1_1.md parse."
        )

    log.info("cdlm_extractor: extracted %d cells from %s", len(rows), SOURCE_FILE)
    return rows
