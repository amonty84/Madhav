"""
validators.p7_three_interpretation
MARSYS-JIS RAG Pipeline — P7 Three-Interpretation Principle validator.
Per PHASE_B_PLAN_v1_0.md §B.5 Task 0 + PROJECT_ARCHITECTURE_v2_2.md §H.4.
Validates that significance-gated records present ≥2 formal interpretive alternatives.
Promoted from stub at Madhav_M2A_Exec_9 (2026-04-27).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class ValidatorResult:
    passed: bool
    findings: list[str] = field(default_factory=list)


def validate(record: dict[str, Any], threshold: float = 0.7) -> ValidatorResult:
    """
    Significance-gated three-interpretation check.

    If record.significance >= threshold, record must carry an `interpretations`
    list with len >= 2. Otherwise the check is a pass-through.

    Failing records emit finding P7_INTERPRETATION_COUNT_BELOW_2.
    """
    significance = record.get("significance", 0)
    if significance < threshold:
        return ValidatorResult(passed=True)

    interpretations = record.get("interpretations") or record.get("alternatives") or []
    if len(interpretations) >= 2:
        return ValidatorResult(passed=True)

    return ValidatorResult(
        passed=False,
        findings=["P7_INTERPRETATION_COUNT_BELOW_2"],
    )
