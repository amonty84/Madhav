"""
test_p6_uvc_consistency.py
Smoke tests for p6_uvc_consistency.py (PARTIAL-IMPL — B.4 Exec_8).

AC.2 stop-criteria:
  - scan returns ≥0 ConflictFlags without raising
  - no schema validation errors on ConflictFlag fields
  - module loads without import errors
"""

import pytest

from rag.validators.p6_uvc_consistency import ConflictFlag, scan_ucn_vs_l3


def test_module_imports():
    """Module loads; ConflictFlag and scan_ucn_vs_l3 are importable."""
    assert callable(scan_ucn_vs_l3)
    assert ConflictFlag is not None


def test_scan_returns_list():
    """scan_ucn_vs_l3() returns a list without raising."""
    result = scan_ucn_vs_l3()
    assert isinstance(result, list)


def test_scan_returns_valid_conflict_flags():
    """Each item is a ConflictFlag with valid field types and enum values."""
    valid_conflict_types = {"direct_negation", "magnitude_mismatch", "mechanism_inversion"}
    valid_severities = {"LOW", "MED", "HIGH"}

    result = scan_ucn_vs_l3()
    for flag in result:
        assert isinstance(flag, ConflictFlag), f"Not a ConflictFlag: {type(flag)}"
        assert isinstance(flag.conflict_id, str) and len(flag.conflict_id) == 12, (
            f"conflict_id must be 12-char hex: {flag.conflict_id!r}"
        )
        assert isinstance(flag.ucn_section_id, str) and flag.ucn_section_id.startswith("UCN.SEC."), (
            f"ucn_section_id must start with 'UCN.SEC.': {flag.ucn_section_id!r}"
        )
        assert isinstance(flag.ucn_assertion_excerpt, str) and len(flag.ucn_assertion_excerpt) <= 200
        assert isinstance(flag.l3_report_id, str) and flag.l3_report_id.endswith(".md")
        assert isinstance(flag.l3_claim_excerpt, str) and len(flag.l3_claim_excerpt) <= 200
        assert flag.conflict_type in valid_conflict_types, (
            f"Invalid conflict_type: {flag.conflict_type!r}"
        )
        assert flag.severity_prior in valid_severities, (
            f"Invalid severity_prior: {flag.severity_prior!r}"
        )


def test_conflict_id_uniqueness():
    """conflict_ids are unique within a single scan run."""
    result = scan_ucn_vs_l3()
    ids = [f.conflict_id for f in result]
    assert len(ids) == len(set(ids)), "Duplicate conflict_ids found in scan result"


def test_conflict_flag_construction():
    """ConflictFlag can be constructed with valid fields."""
    flag = ConflictFlag(
        conflict_id="aabbccdd1234",
        ucn_section_id="UCN.SEC.I.1",
        ucn_assertion_excerpt="Saturn strengthens the 10th house",
        l3_report_id="REPORT_CAREER_DHARMA_v1_1.md",
        l3_claim_excerpt="Saturn weakens career prospects",
        conflict_type="direct_negation",
        severity_prior="MED",
    )
    assert flag.conflict_id == "aabbccdd1234"
    assert flag.conflict_type == "direct_negation"
    assert flag.severity_prior == "MED"
