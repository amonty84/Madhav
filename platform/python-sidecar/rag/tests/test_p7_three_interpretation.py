"""
test_p7_three_interpretation.py — unit tests for P7 validator.
Run from platform/python-sidecar/: python -m pytest rag/tests/test_p7_three_interpretation.py -v
"""

import pytest

from rag.validators.p7_three_interpretation import ValidatorResult, validate


class TestP7ThreeInterpretation:
    def test_low_significance_passes_regardless_of_interpretations(self):
        record = {"significance": 0.5, "claim_text": "some claim"}
        result = validate(record)
        assert result.passed is True
        assert result.findings == []

    def test_low_significance_no_interpretations_field_passes(self):
        record = {"significance": 0.3}
        result = validate(record)
        assert result.passed is True

    def test_zero_significance_passes(self):
        record = {}
        result = validate(record)
        assert result.passed is True

    def test_high_significance_with_two_interpretations_passes(self):
        record = {
            "significance": 0.8,
            "interpretations": ["7-karaka reading: Jupiter rules career", "8-karaka reading: Jupiter rules longevity"],
        }
        result = validate(record)
        assert result.passed is True
        assert result.findings == []

    def test_high_significance_with_three_interpretations_passes(self):
        record = {
            "significance": 1.0,
            "interpretations": ["reading_a", "reading_b", "reading_c"],
        }
        result = validate(record)
        assert result.passed is True

    def test_high_significance_with_one_interpretation_fails(self):
        record = {
            "significance": 0.9,
            "interpretations": ["only one reading"],
        }
        result = validate(record)
        assert result.passed is False
        assert "P7_INTERPRETATION_COUNT_BELOW_2" in result.findings

    def test_high_significance_with_no_interpretations_field_fails(self):
        record = {"significance": 0.75, "claim_text": "Jupiter aspects career house"}
        result = validate(record)
        assert result.passed is False
        assert "P7_INTERPRETATION_COUNT_BELOW_2" in result.findings

    def test_high_significance_with_empty_interpretations_fails(self):
        record = {"significance": 0.7, "interpretations": []}
        result = validate(record)
        assert result.passed is False
        assert "P7_INTERPRETATION_COUNT_BELOW_2" in result.findings

    def test_threshold_boundary_exactly_0_7_fires(self):
        record = {"significance": 0.7, "interpretations": ["only one"]}
        result = validate(record)
        assert result.passed is False

    def test_threshold_boundary_0_699_passes(self):
        record = {"significance": 0.699, "interpretations": ["only one"]}
        result = validate(record)
        assert result.passed is True

    def test_alternatives_field_accepted_as_fallback(self):
        record = {
            "significance": 0.8,
            "alternatives": ["reading A", "reading B"],
        }
        result = validate(record)
        assert result.passed is True

    def test_custom_threshold(self):
        record = {"significance": 0.5, "interpretations": ["one reading"]}
        result = validate(record, threshold=0.4)
        assert result.passed is False

    def test_validator_result_is_dataclass(self):
        result = validate({"significance": 0.0})
        assert isinstance(result, ValidatorResult)
        assert hasattr(result, "passed")
        assert hasattr(result, "findings")
