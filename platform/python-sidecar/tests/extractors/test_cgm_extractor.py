"""
Tests for pipeline.extractors.cgm_extractor.
Updated for KARN-W2-R3-CGM-FULL-EDGES: covers all 15 edge types + AC.5/AC.6/AC.7 criteria.
"""
from __future__ import annotations

import pytest

# Repo root is two levels up from this file: tests/extractors/../../..
REPO_ROOT = str(__import__("pathlib").Path(__file__).resolve().parents[4])

# All 15 edge types required by brief AC.7
ALL_EDGE_TYPES = [
    "RULES_OVER",
    "DISPOSES",
    "NAKSHATRA_OF",
    "KARAKA_OF",
    "CONJUNCT",
    "DASHA_GIVES",
    "ASPECTS",
    "AFFLICTS",
    "SUPPORTS",
    "ARUDHA_OF",
    "CO_OCCURS",
    "DUAL_SYSTEM_DIVERGENCE",
    "SEC_REFERENCES",
    "RESONATES_WITH",
    "CONTRADICTS_WITH",
]

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
    """AC.6: with merged node_ids, valid edges ≥320 and orphan edges = 0."""
    from pipeline.extractors.cgm_extractor import extract_cgm_nodes, extract_cgm_edges

    nodes = extract_cgm_nodes(REPO_ROOT)
    node_ids = {n["node_id"] for n in nodes}
    edges = extract_cgm_edges(REPO_ROOT, node_ids)

    valid = sum(1 for e in edges if e["status"] == "valid")
    orphan = sum(1 for e in edges if e["status"] == "orphan")

    assert valid >= 320, f"Expected ≥320 valid edges, got {valid}"
    assert orphan == 0, f"Expected 0 orphan edges, got {orphan}"


def test_extract_cgm_edges_all_types_present():
    """AC.7: all 15 edge_types must appear with non-zero counts."""
    from pipeline.extractors.cgm_extractor import extract_cgm_nodes, extract_cgm_edges

    nodes = extract_cgm_nodes(REPO_ROOT)
    node_ids = {n["node_id"] for n in nodes}
    edges = extract_cgm_edges(REPO_ROOT, node_ids)

    present_types = {e["edge_type"] for e in edges if e["status"] == "valid"}
    missing = [t for t in ALL_EDGE_TYPES if t not in present_types]
    assert missing == [], f"Missing edge types: {missing}"


def test_extract_cgm_edges_per_type_counts():
    """AC.7: per-type counts within reasonable bounds."""
    from pipeline.extractors.cgm_extractor import extract_cgm_nodes, extract_cgm_edges
    from collections import Counter

    nodes = extract_cgm_nodes(REPO_ROOT)
    node_ids = {n["node_id"] for n in nodes}
    edges = extract_cgm_edges(REPO_ROOT, node_ids)

    counts = Counter(e["edge_type"] for e in edges if e["status"] == "valid")

    # Minimum counts per type (conservative lower bounds)
    min_counts = {
        "RULES_OVER": 10,
        "DISPOSES": 10,
        "NAKSHATRA_OF": 10,
        "KARAKA_OF": 15,
        "CONJUNCT": 4,
        "DASHA_GIVES": 20,
        "ASPECTS": 15,
        "AFFLICTS": 4,
        "SUPPORTS": 2,
        "ARUDHA_OF": 10,
        "CO_OCCURS": 50,
        "DUAL_SYSTEM_DIVERGENCE": 3,
        "SEC_REFERENCES": 5,
        "RESONATES_WITH": 10,
        "CONTRADICTS_WITH": 3,
    }
    for edge_type, min_count in min_counts.items():
        actual = counts.get(edge_type, 0)
        assert actual >= min_count, (
            f"{edge_type}: expected ≥{min_count}, got {actual}"
        )


def test_extract_cgm_edges_no_orphans():
    """AC.5: orphan count must be 0 after extracting with full merged node_ids."""
    from pipeline.extractors.cgm_extractor import extract_cgm_nodes, extract_cgm_edges

    nodes = extract_cgm_nodes(REPO_ROOT)
    node_ids = {n["node_id"] for n in nodes}
    edges = extract_cgm_edges(REPO_ROOT, node_ids)

    orphans = [e for e in edges if e["status"] == "orphan"]
    assert orphans == [], (
        f"Expected 0 orphans, got {len(orphans)}: "
        + str([(e["edge_id"], e.get("orphan_reason")) for e in orphans[:5]])
    )


def test_extract_cgm_edges_required_fields():
    """AC.4: every valid edge has required fields populated."""
    from pipeline.extractors.cgm_extractor import extract_cgm_nodes, extract_cgm_edges

    nodes = extract_cgm_nodes(REPO_ROOT)
    node_ids = {n["node_id"] for n in nodes}
    edges = extract_cgm_edges(REPO_ROOT, node_ids)

    required = ["edge_id", "source_node_id", "target_node_id", "edge_type", "source_section"]
    for e in edges:
        if e.get("status") != "valid":
            continue
        for field in required:
            assert e.get(field), f"Edge {e.get('edge_id', '?')} missing {field}"
        # No self-loops
        assert e["source_node_id"] != e["target_node_id"], (
            f"Self-loop detected: {e['edge_id']}"
        )
