"""
validators.p2_citation — P2 derivation-ledger citation validator.
Phase B.1. Per M2A_EXEC_PLAN_v1_0.md §PLAN B.1 Task 1.5 + PHASE_B_PLAN_v1_0.md §E.6.
Validates that L2+ chunks carry valid L1 source IDs from FORENSIC_v8_0.
"""
from __future__ import annotations

import re
from pathlib import Path
from typing import Any

# ── Resolution set ────────────────────────────────────────────────────────────

_RESOLUTION_SET: set[str] | None = None

# Pattern for extracting entity IDs from FORENSIC_v8_0
_ID_PATTERN = re.compile(
    r"\b(?:PLN|HSE|SGN|EVT|SBL|BVB|NAK|KRK|AVG|DSH|UPG|SAH|LAG|ARD|DEV|ASP|TRS|PCG|KOT|IKP|PVC|YGA|LON|MET|KP|KAK|AVS|D9|D1)\.[A-Z0-9_.]+\b"
)

_FORENSIC_PATH = (
    Path(__file__).parent.parent.parent.parent.parent
    / "01_FACTS_LAYER"
    / "FORENSIC_ASTROLOGICAL_DATA_v8_0.md"
)


def _build_resolution_set() -> set[str]:
    """Scan FORENSIC_v8_0.md and cache all entity IDs."""
    if not _FORENSIC_PATH.exists():
        # Fallback: try relative to repo root
        alt = Path(__file__).parents[5] / "01_FACTS_LAYER" / "FORENSIC_ASTROLOGICAL_DATA_v8_0.md"
        path = alt if alt.exists() else _FORENSIC_PATH
    else:
        path = _FORENSIC_PATH
    text = path.read_text(encoding="utf-8")
    return set(_ID_PATTERN.findall(text))  # non-capturing group → returns full matches


def get_resolution_set() -> set[str]:
    global _RESOLUTION_SET
    if _RESOLUTION_SET is None:
        _RESOLUTION_SET = _build_resolution_set()
    return _RESOLUTION_SET


def validate(chunk: dict[str, Any]) -> dict[str, Any]:
    """
    Validate P2 citation for a chunk.

    Rules (per PHASE_B_PLAN §E.6 P2 note):
    - L1 chunks with no v6_ids_consumed: PASS (facts don't need self-citation).
    - L2/L2.5/L3 chunks with no v6_ids_consumed or empty: write with citation_valid=False (WARNING, not block).
    - L2/L2.5/L3 chunks with v6_ids_consumed containing an ID NOT in resolution_set:
      write with citation_valid=False.
    - All listed IDs resolve → citation_valid=True.

    Returns:
        {"valid": True, "citation_valid": bool, "reason": str | None}
    """
    layer = chunk.get("layer", "")
    v6_ids = chunk.get("v6_ids_consumed", [])

    # L1 chunks: no citation requirement
    if layer == "L1":
        return {"valid": True, "citation_valid": True, "reason": None}

    # Non-L2/L2.5/L3: pass through
    if layer not in ("L2", "L2.5", "L3"):
        return {"valid": True, "citation_valid": True, "reason": None}

    # L2+ with no citations: flag but do not block
    if not v6_ids:
        return {
            "valid": True,
            "citation_valid": False,
            "reason": "P2: L2+ chunk has no v6_ids_consumed field — citation_valid=False (WARNING)",
        }

    resolution_set = get_resolution_set()
    # v6_ids_consumed may be a list of strings like "PLN.SATURN" or "HSE.7"
    unresolved = []
    for raw_id in v6_ids:
        # Extract just the namespace prefix to match resolution set entries
        # The resolution set contains full matches like "PLN.SATURN"
        norm = str(raw_id).strip()
        # Match against the set directly, or match prefixed form
        if norm not in resolution_set:
            # Try stripping version suffix (e.g. "PLN.SATURN.v8" → "PLN.SATURN")
            base = norm.split(".v")[0]
            if base not in resolution_set:
                unresolved.append(norm)

    if unresolved:
        return {
            "valid": True,
            "citation_valid": False,
            "reason": f"P2: v6_ids_consumed contains unresolvable IDs: {unresolved}",
        }

    return {"valid": True, "citation_valid": True, "reason": None}
