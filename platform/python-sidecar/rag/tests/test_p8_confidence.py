"""
test_p8_confidence.py — unit tests for P8 validator.
Run from platform/python-sidecar/: python -m pytest rag/tests/test_p8_confidence.py -v
"""

import pytest

from rag.validators.p8_confidence import validate
from rag.validators.p7_three_interpretation import ValidatorResult


class TestP8Confidence:
    def test_backward_looking_passes_regardless_of_falsifier(self):
        record = {"is_forward_looking": False, "claim_text": "Saturn was in Libra at birth"}
        result = validate(record)
        assert result.passed is True
        assert result.findings == []

    def test_no_forward_looking_flag_passes(self):
        record = {"claim_text": "Sun in Aries is exalted"}
        result = validate(record)
        assert result.passed is True

    def test_forward_looking_with_falsifier_list_passes(self):
        record = {
            "is_forward_looking": True,
            "falsifier_conditions": ["Career change does not occur by 2027", "Saturn dasha ends early"],
        }
        result = validate(record)
        assert result.passed is True
        assert result.findings == []

    def test_forward_looking_with_null_falsifier_fails(self):
        record = {"is_forward_looking": True, "falsifier_conditions": None}
        result = validate(record)
        assert result.passed is False
        assert "P8_FALSIFIER_MISSING" in result.findings

    def test_forward_looking_with_empty_list_fails(self):
        record = {"is_forward_looking": True, "falsifier_conditions": []}
        result = validate(record)
        assert result.passed is False
        assert "P8_FALSIFIER_MISSING" in result.findings

    def test_forward_looking_with_no_falsifier_field_fails(self):
        record = {"is_forward_looking": True, "claim_text": "Will become a CEO by 2028"}
        result = validate(record)
        assert result.passed is False
        assert "P8_FALSIFIER_MISSING" in result.findings

    def test_time_indexed_falsifier_with_nested_conditions_passes(self):
        record = {
            "is_forward_looking": True,
            "time_indexed_falsifier": {
                "verification_window_start": "2026-01-01",
                "verification_window_end": "2028-01-01",
                "falsifier_conditions": ["no promotion occurs in this window"],
            },
        }
        result = validate(record)
        assert result.passed is True

    def test_time_indexed_falsifier_with_empty_nested_conditions_fails(self):
        record = {
            "is_forward_looking": True,
            "time_indexed_falsifier": {
                "verification_window_start": "2026-01-01",
                "verification_window_end": "2028-01-01",
                "falsifier_conditions": [],
            },
        }
        result = validate(record)
        assert result.passed is False
        assert "P8_FALSIFIER_MISSING" in result.findings

    def test_non_forward_looking_with_time_indexed_falsifier_fires(self):
        # time_indexed_falsifier being present should also trigger the check
        record = {
            "is_forward_looking": False,
            "time_indexed_falsifier": {
                "falsifier_conditions": [],
            },
        }
        result = validate(record)
        assert result.passed is False

    def test_result_is_validator_result(self):
        result = validate({})
        assert isinstance(result, ValidatorResult)
