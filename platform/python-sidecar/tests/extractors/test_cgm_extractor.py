"""
Tests for pipeline.extractors.cgm_extractor.
Covers AC.1–AC.4 from CLAUDECODE_BRIEF_RETRIEVAL_11C_a.
"""
from __future__ import annotations

import pytest

# Repo root is two levels up from this file: tests/extractors/../../..
REPO_ROOT = str(__import__("pathlib").Path(__file__).resolve().parents[4])

_AC4_TARGETS = [
    "UCN.SEC.II.2", "UCN.SEC.III.4",
    "UCN.SEC.IV.1", "UCN.SEC.IV.2", "UCN.SEC.IV.3", "UCN.SEC.IV.4", "UCN.SEC.IV.5",
    "UCN.SEC.V.4", "UCN.SEC.V.5", "UCN.SEC.V.7",
    "UCN.SEC.VI.1", "UCN.SEC.VI.3", "UCN.SEC.VI.4",
    "UCN.SEC.VII.4",
    "UCN.SEC.VIII.2", "UCN.SEC.VIII.4",
    "UCN.SEC.IX.2",
]


def test_extract_ucn_section_nodes_ac1():
    """AC.1: ≥80 nodes, all node_ids start with UCN.SEC."""
    from pipeline.extractors.cgm_extractor import extract_ucn_section_nodes

    nodes = extract_ucn_section_nodes(REPO_ROOT)
    assert len(nodes) >= 80, f"Expected ≥80 UCN section nodes, got {len(nodes)}"
    bad = [n["node_id"] for n in nodes if not n["node_id"].startswith("UCN.SEC.")]
    assert bad == [], f"node_ids without UCN.SEC. prefix: {bad}"


def test_extract_ucn_section_nodes_ac4_all_present():
    """AC.4: all 17 orphan-targeted UCN.SEC.* node_ids are present."""
    from pipeline.extractors.cgm_extractor import extract_ucn_section_nodes

    nodes = extract_ucn_section_nodes(REPO_ROOT)
    ids = {n["node_id"] for n in nodes}
    missing = [t for t in _AC4_TARGETS if t not in ids]
    assert missing == [], f"Missing AC.4 targets: {missing}"


def test_extract_aux_cgm_nodes_ac2():
    """AC.2: exactly one node with KARAKA.DUAL_SYSTEM_DIVERGENCE, correct type + conflict_type."""
    from pipeline.extractors.cgm_extractor import extract_aux_cgm_nodes

    aux = extract_aux_cgm_nodes(REPO_ROOT)
    ids = [n["node_id"] for n in aux]
    assert "KARAKA.DUAL_SYSTEM_DIVERGENCE" in ids, "KARAKA node missing from aux"

    karaka = next(n for n in aux if n["node_id"] == "KARAKA.DUAL_SYSTEM_DIVERGENCE")
    assert karaka["node_type"] == "KARAKA_META"
    assert karaka["properties"]["conflict_type"] == "rahu_as_pk"
    assert "description" in karaka["properties"]


def test_extract_cgm_nodes_merge_ac3():
    """AC.3: merged set ≥315, contains all AC.4 targets + KARAKA, no collisions."""
    from pipeline.extractors.cgm_extractor import extract_cgm_nodes

    nodes = extract_cgm_nodes(REPO_ROOT)
    ids = {n["node_id"] for n in nodes}

    assert len(nodes) >= 315, f"Expected ≥315 merged nodes, got {len(nodes)}"

    all_targets = _AC4_TARGETS + ["KARAKA.DUAL_SYSTEM_DIVERGENCE"]
    missing = [t for t in all_targets if t not in ids]
    assert missing == [], f"Missing targets in merged set: {missing}"

    # No duplicate node_ids
    assert len(ids) == len(nodes), "Duplicate node_ids detected in merged set"


def test_extract_cgm_nodes_collision_raises():
    """AC.3: collision guard raises ValueError if a new node_id clashes with existing."""
    from unittest.mock import patch
    from pipeline.extractors.cgm_extractor import extract_cgm_nodes

    # Inject a fake UCN section node with a node_id that matches an existing CGM node.
    # We know "PLN.SUN" is always in the CGM_v9_0 set.
    fake_node = {
        "node_id": "PLN.SUN",  # guaranteed collision
        "node_type": "UCN_SECTION",
        "display_name": "Collision Test",
        "properties": {},
        "source_section": "test",
    }

    with patch(
        "pipeline.extractors.cgm_extractor.extract_ucn_section_nodes",
        return_value=[fake_node],
    ):
        with pytest.raises(ValueError, match="node_id collision"):
            extract_cgm_nodes(REPO_ROOT)


def test_extract_cgm_edges_valid_count():
    """AC.6: with merged node_ids, valid edges ≥122 and orphan edges ≤4."""
    from pipeline.extractors.cgm_extractor import extract_cgm_nodes, extract_cgm_edges

    nodes = extract_cgm_nodes(REPO_ROOT)
    node_ids = {n["node_id"] for n in nodes}
    edges = extract_cgm_edges(REPO_ROOT, node_ids)

    valid = sum(1 for e in edges if e["status"] == "valid")
    orphan = sum(1 for e in edges if e["status"] == "orphan")

    assert valid >= 122, f"Expected ≥122 valid edges, got {valid}"
    assert orphan <= 4, f"Expected ≤4 orphan edges, got {orphan}"
