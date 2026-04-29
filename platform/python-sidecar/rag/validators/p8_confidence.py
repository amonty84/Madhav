"""
validators.p8_confidence
MARSYS-JIS RAG Pipeline — P8 confidence calibration / falsifier-conditions validator.
Per PHASE_B_PLAN_v1_0.md §B.5 Task 0.
Validates that forward-looking artifacts carry non-null, non-empty falsifier_conditions.
Promoted from stub at Madhav_M2A_Exec_9 (2026-04-27).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from rag.validators.p7_three_interpretation import ValidatorResult


def validate(record: dict[str, Any]) -> ValidatorResult:
    """
    Falsifier-conditions enforcement for forward-looking artifacts.

    Fires when record.is_forward_looking == True OR record has a non-null
    time_indexed_falsifier field. Failing records emit P8_FALSIFIER_MISSING.
    """
    is_forward_looking = record.get("is_forward_looking", False)
    time_indexed_falsifier = record.get("time_indexed_falsifier")

    if not is_forward_looking and not time_indexed_falsifier:
        return ValidatorResult(passed=True)

    # Check falsifier_conditions at top level (direct field)
    falsifier_conditions = record.get("falsifier_conditions")

    # Also accept falsifier_conditions nested inside time_indexed_falsifier
    if not falsifier_conditions and isinstance(time_indexed_falsifier, dict):
        falsifier_conditions = time_indexed_falsifier.get("falsifier_conditions")

    if falsifier_conditions:
        return ValidatorResult(passed=True)

    return ValidatorResult(
        passed=False,
        findings=["P8_FALSIFIER_MISSING"],
    )
