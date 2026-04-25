"""
test_p1_p2_p5 — Meta-tests for P1/P2/P5 validators using fixture files.
Phase B.1. Per M2A_EXEC_PLAN_v1_0.md §PLAN B.1 Task 1.5.
Run: pytest platform/python-sidecar/rag/validators/test_p1_p2_p5.py -v
"""
import json
from pathlib import Path

import pytest

from rag.validators import p1_layer_separation, p2_citation, p5_signal_id_resolution

FIXTURES_DIR = Path(__file__).parent / "fixtures"

# ── Fixture discovery ─────────────────────────────────────────────────────────


def _load_fixtures(prefix: str) -> list[tuple[str, dict]]:
    """Return [(fixture_name, fixture_dict), ...] for all files matching prefix."""
    result = []
    for f in sorted(FIXTURES_DIR.glob(f"{prefix}_*.json")):
        if f.name == "p1_trigger_vocab.json":
            continue
        data = json.loads(f.read_text(encoding="utf-8"))
        result.append((f.name, data))
    return result


# ── P1 tests ──────────────────────────────────────────────────────────────────


@pytest.mark.parametrize("name,fixture", _load_fixtures("p1"))
def test_p1(name: str, fixture: dict) -> None:
    chunk = fixture["chunk"]
    expected = fixture["expected"]
    result = p1_layer_separation.validate(chunk)
    assert result["valid"] == expected["valid"], (
        f"[{name}] P1 expected valid={expected['valid']} but got {result}"
    )


# ── P2 tests ──────────────────────────────────────────────────────────────────


@pytest.mark.parametrize("name,fixture", _load_fixtures("p2"))
def test_p2(name: str, fixture: dict) -> None:
    chunk = fixture["chunk"]
    expected = fixture["expected"]
    result = p2_citation.validate(chunk)
    assert result["valid"] == expected["valid"], (
        f"[{name}] P2 expected valid={expected['valid']} but got {result}"
    )
    if "citation_valid" in expected:
        assert result["citation_valid"] == expected["citation_valid"], (
            f"[{name}] P2 expected citation_valid={expected['citation_valid']} but got {result}"
        )


# ── P5 tests ──────────────────────────────────────────────────────────────────


@pytest.mark.parametrize("name,fixture", _load_fixtures("p5"))
def test_p5(name: str, fixture: dict) -> None:
    chunk = fixture["chunk"]
    expected = fixture["expected"]
    result = p5_signal_id_resolution.validate(chunk)
    assert result["valid"] == expected["valid"], (
        f"[{name}] P5 expected valid={expected['valid']} but got {result}"
    )
    if "citation_valid" in expected:
        assert result["citation_valid"] == expected["citation_valid"], (
            f"[{name}] P5 expected citation_valid={expected['citation_valid']} but got {result}"
        )


# ── Trigger vocab integrity check ─────────────────────────────────────────────


def test_p1_trigger_vocab_has_minimum_terms() -> None:
    """Per plan stop condition: p1_trigger_vocab.json must have ≥8 trigger terms."""
    vocab_path = FIXTURES_DIR / "p1_trigger_vocab.json"
    vocab = json.loads(vocab_path.read_text(encoding="utf-8"))
    assert len(vocab) >= 8, f"p1_trigger_vocab.json has only {len(vocab)} terms (minimum 8)"
