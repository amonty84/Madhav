"""
Tests for msr_extractor — verifies the 8 new source fields added in KARN-W2-R1.
"""
from __future__ import annotations

from unittest.mock import patch, MagicMock
from pathlib import Path


# Minimal signal data for testing — all 8 new fields present
FULL_SIGNAL = {
    "signal_name": "Test Yoga Signal",
    "signal_type": "yoga",
    "temporal_activation": "natal-permanent",
    "valence": "benefic",
    "entities_involved": ["PLN.SATURN", "HSE.7", "SGN.LIBRA"],
    "supporting_rules": ["Rule 1", "Rule 2"],
    "rpt_deep_dive": "RPT.YOG.01.A",
    "v6_ids_consumed": ["PLN.SATURN", "HSE.7"],
    "prior_id": "SIG.01",
    "strength_score": 0.92,
    "confidence": 0.95,
    "classical_source": "BPHS",
    "falsifier": "Test falsifier",
    "domains_affected": ["career"],
    "provenance": "v1_0",
}

# Minimal signal — all 8 new fields absent
SPARSE_SIGNAL = {
    "signal_name": "Sparse Signal",
    "strength_score": 0.5,
    "confidence": 0.6,
    "domains_affected": ["general"],
}

# Mixed signal — only 4 of the 8 new fields present
MIXED_SIGNAL = {
    "signal_name": "Mixed Signal",
    "signal_type": "aspect",
    "valence": "malefic",
    "entities_involved": ["PLN.MARS", "HSE.3"],
    "strength_score": 0.7,
    "confidence": 0.8,
    "domains_affected": ["courage"],
}


def _make_raw_signals(signals_by_id: dict) -> list[tuple]:
    """Build fake raw_signals tuples as returned by _parse_signals."""
    result = []
    for sig_id, data in signals_by_id.items():
        result.append((sig_id, "", data))
    return result


def _run_extractor(signals_by_id: dict) -> list[dict]:
    """Run extract_msr_signals with mocked _parse_signals and no count validation."""
    from pipeline.extractors.msr_extractor import extract_msr_signals

    raw = _make_raw_signals(signals_by_id)

    with (
        patch("pipeline.extractors.msr_extractor._parse_signals", return_value=raw),
        patch("pipeline.extractors.msr_extractor.EXPECTED_COUNT", len(raw)),
        patch.object(Path, "exists", return_value=True),
    ):
        return extract_msr_signals("/fake/root")


class TestMsrExtractorNewFields:
    """Tests for the 8 new source fields added in KARN-W2-R1."""

    def test_all_8_fields_populated(self):
        """Happy path: all 8 fields present in YAML → all present in row dict."""
        rows = _run_extractor({"SIG.MSR.001": FULL_SIGNAL})
        assert len(rows) == 1
        row = rows[0]

        assert row["signal_type"] == "yoga"
        assert row["temporal_activation"] == "natal-permanent"
        assert row["valence_raw"] == "benefic"
        assert row["entities_involved_raw"] == ["PLN.SATURN", "HSE.7", "SGN.LIBRA"]
        assert row["supporting_rules"] == ["Rule 1", "Rule 2"]
        assert row["rpt_deep_dive"] == "RPT.YOG.01.A"
        assert row["v6_ids_consumed"] == ["PLN.SATURN", "HSE.7"]
        assert row["prior_id"] == "SIG.01"

    def test_all_8_fields_absent_returns_none(self):
        """When all 8 source fields are missing in YAML → all None in row dict (not empty str/list)."""
        rows = _run_extractor({"SIG.MSR.002": SPARSE_SIGNAL})
        assert len(rows) == 1
        row = rows[0]

        assert row["signal_type"] is None
        assert row["temporal_activation"] is None
        assert row["valence_raw"] is None
        assert row["entities_involved_raw"] is None
        assert row["supporting_rules"] is None
        assert row["rpt_deep_dive"] is None
        assert row["v6_ids_consumed"] is None
        assert row["prior_id"] is None

    def test_mixed_4_present_4_absent(self):
        """4 fields present, 4 absent → present ones populated, absent ones None."""
        rows = _run_extractor({"SIG.MSR.003": MIXED_SIGNAL})
        assert len(rows) == 1
        row = rows[0]

        # Present
        assert row["signal_type"] == "aspect"
        assert row["valence_raw"] == "malefic"
        assert row["entities_involved_raw"] == ["PLN.MARS", "HSE.3"]

        # Absent
        assert row["temporal_activation"] is None
        assert row["supporting_rules"] is None
        assert row["rpt_deep_dive"] is None
        assert row["v6_ids_consumed"] is None
        assert row["prior_id"] is None

    def test_existing_fields_unaffected(self):
        """Existing row fields (category, valence normalized, entities_involved) still work."""
        rows = _run_extractor({"SIG.MSR.001": FULL_SIGNAL})
        row = rows[0]

        # category is still signal_type (for l25_msr_signals compat)
        assert row["category"] == "yoga"
        # valence is still normalized
        assert row["valence"] == "positive"  # benefic → positive
        # entities_involved is still the raw list (for l25_msr_signals)
        assert row["entities_involved"] == ["PLN.SATURN", "HSE.7", "SGN.LIBRA"]

    def test_signal_id_and_core_fields_intact(self):
        """signal_id, name, weight, source_section still present."""
        rows = _run_extractor({"SIG.MSR.001": FULL_SIGNAL})
        row = rows[0]

        assert row["signal_id"] == "SIG.MSR.001"
        assert row["name"] == "Test Yoga Signal"
        assert row["weight"] == 0.92
        assert "source_section" in row
        assert "provenance" in row
