"""
validators.p1_layer_separation — P1 Facts/Interpretation layer separation validator.
Phase B.1. Per M2A_EXEC_PLAN_v1_0.md §PLAN B.1 Task 1.5 + PHASE_B_PLAN_v1_0.md §E.6.
Validates L1 chunks contain no interpretive content; L2+ chunks carry entity references.
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

# ── Fixtures ──────────────────────────────────────────────────────────────────

_FIXTURES_DIR = Path(__file__).parent / "fixtures"

_TRIGGER_VOCAB: list[str] | None = None

# Regex matching entity reference IDs (PLN., HSE., SGN., EVT., SIG.MSR.)
_ENTITY_REF_PATTERN = re.compile(
    r"\b(PLN|HSE|SGN|EVT|SIG\.MSR|NAK|KRK|DSH|YGA|LAG|ARD|SAH|BVB|SBL|AVG)\.[A-Z0-9_.]+\b"
)

# Bridging marker that excuses interpretive language in L1
_BRIDGE_MARKER = re.compile(r"\[L1 fact\]\s*→\s*\[L2")

# Backtick/quote protection pattern
_QUOTED = re.compile(r"`[^`]*`|\"[^\"]*\"")


def _get_trigger_vocab() -> list[str]:
    global _TRIGGER_VOCAB
    if _TRIGGER_VOCAB is None:
        vocab_path = _FIXTURES_DIR / "p1_trigger_vocab.json"
        _TRIGGER_VOCAB = json.loads(vocab_path.read_text(encoding="utf-8"))
    return _TRIGGER_VOCAB


def _strip_quoted(text: str) -> str:
    """Remove backtick/quoted spans so trigger words inside them are ignored."""
    return _QUOTED.sub("", text)


def validate(chunk: dict[str, Any]) -> dict[str, Any]:
    """
    Validate a chunk dict for P1 layer separation.

    Returns:
        {"valid": bool, "reason": str | None}

    Rules:
    - L1 chunks: reject if content contains trigger words outside backtick/quotes
      (unless [L1 fact] → [L2 interp] bridge marker present).
    - L2/L2.5/L3 chunks: reject if content has no entity reference IDs at all.
    - Chunks without a layer tag: reject.
    """
    layer = chunk.get("layer", "")
    content = chunk.get("content", "")

    if not layer:
        return {"valid": False, "reason": "P1: missing layer tag"}

    if layer == "L1":
        if _BRIDGE_MARKER.search(content):
            return {"valid": True, "reason": None}
        stripped = _strip_quoted(content)
        vocab = _get_trigger_vocab()
        for word in vocab:
            if re.search(r"\b" + re.escape(word) + r"\b", stripped, re.IGNORECASE):
                return {
                    "valid": False,
                    "reason": f"P1: L1 chunk contains interpretive trigger word '{word}'",
                }
        return {"valid": True, "reason": None}

    if layer in ("L2", "L2.5", "L3"):
        if not _ENTITY_REF_PATTERN.search(content):
            return {
                "valid": False,
                "reason": "P1: L2/L2.5/L3 chunk has no entity reference IDs (PLN., HSE., etc.)",
            }
        return {"valid": True, "reason": None}

    # L0, L4 — no P1 constraint
    return {"valid": True, "reason": None}
