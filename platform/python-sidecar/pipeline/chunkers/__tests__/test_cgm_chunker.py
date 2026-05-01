"""
Tests for pipeline.chunkers.cgm_chunker.
KARN-W2-R3-CGM-FULL-EDGES — verifies AC.9 (≥365 cgm_node chunks) and chunk structure.
"""
from __future__ import annotations

import pytest

REPO_ROOT = str(__import__("pathlib").Path(__file__).resolve().parents[5])


def test_chunk_all_cgm_nodes_minimum_count():
    """AC.9: total chunks ≥365 (234 base + UCN.SEC.* + aux)."""
    from pipeline.chunkers.cgm_chunker import chunk_all_cgm_nodes

    chunks = chunk_all_cgm_nodes(REPO_ROOT)
    assert len(chunks) >= 365, (
        f"Expected ≥365 cgm_node chunks, got {len(chunks)}"
    )


def test_chunk_all_cgm_nodes_doc_type():
    """All chunks have doc_type=cgm_node and layer=L2.5."""
    from pipeline.chunkers.cgm_chunker import chunk_all_cgm_nodes

    chunks = chunk_all_cgm_nodes(REPO_ROOT)
    bad_doc = [c.doc_type for c in chunks if c.doc_type != "cgm_node"]
    bad_layer = [c.layer for c in chunks if c.layer != "L2.5"]
    assert bad_doc == [], f"Chunks with wrong doc_type: {bad_doc[:3]}"
    assert bad_layer == [], f"Chunks with wrong layer: {bad_layer[:3]}"


def test_chunk_all_cgm_nodes_ucn_present():
    """UCN.SEC.* nodes are represented in the output."""
    from pipeline.chunkers.cgm_chunker import chunk_all_cgm_nodes

    chunks = chunk_all_cgm_nodes(REPO_ROOT)
    ucn_chunks = [c for c in chunks if c.metadata.get("node_id", "").startswith("UCN.SEC.")]
    assert len(ucn_chunks) >= 80, (
        f"Expected ≥80 UCN.SEC.* chunks, got {len(ucn_chunks)}"
    )


def test_chunk_all_cgm_nodes_aux_present():
    """KARAKA.DUAL_SYSTEM_DIVERGENCE auxiliary node is chunked."""
    from pipeline.chunkers.cgm_chunker import chunk_all_cgm_nodes

    chunks = chunk_all_cgm_nodes(REPO_ROOT)
    aux_ids = [c.metadata.get("node_id") for c in chunks
               if c.metadata.get("node_id") == "KARAKA.DUAL_SYSTEM_DIVERGENCE"]
    assert len(aux_ids) >= 1, "KARAKA.DUAL_SYSTEM_DIVERGENCE chunk missing"


def test_chunk_all_cgm_nodes_no_duplicate_node_ids():
    """No duplicate node_id in chunk metadata."""
    from pipeline.chunkers.cgm_chunker import chunk_all_cgm_nodes

    chunks = chunk_all_cgm_nodes(REPO_ROOT)
    node_ids = [c.metadata.get("node_id") for c in chunks]
    unique_ids = set(node_ids)
    assert len(unique_ids) == len(node_ids), (
        f"Duplicate node_ids in chunks: "
        f"{len(node_ids) - len(unique_ids)} duplicates detected"
    )
