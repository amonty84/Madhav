"""
Tests for rag.chunkers.rm_element.
Per CLAUDECODE_BRIEF_RETRIEVAL_11C_c AC.9.
"""
from __future__ import annotations

# Repo root is five levels up from this file: tests/chunkers/../../../..
REPO_ROOT = str(__import__("pathlib").Path(__file__).resolve().parents[4])


def test_chunk_rm_elements_min_count():
    """AC.4: ≥20 chunks produced (RM has 28 active elements)."""
    from rag.chunkers.rm_element import chunk_rm_elements

    chunks = chunk_rm_elements(REPO_ROOT)
    assert len(chunks) >= 20, f"Expected ≥20 rm_element chunks, got {len(chunks)}"


def test_chunk_rm_elements_chunk_id_prefix():
    """AC.4: every chunk_id starts with 'RM.'."""
    from rag.chunkers.rm_element import chunk_rm_elements

    chunks = chunk_rm_elements(REPO_ROOT)
    bad = [c.chunk_id for c in chunks if not c.chunk_id.startswith("RM.")]
    assert bad == [], f"chunk_ids without RM. prefix: {bad}"


def test_chunk_rm_elements_doc_type():
    """AC.4: every chunk.doc_type == 'rm_element'."""
    from rag.chunkers.rm_element import chunk_rm_elements

    chunks = chunk_rm_elements(REPO_ROOT)
    bad = [c.chunk_id for c in chunks if c.doc_type != "rm_element"]
    assert bad == [], f"Chunks with wrong doc_type: {bad}"


def test_chunk_rm_elements_layer():
    """AC.4: every chunk.layer == 'L2.5'."""
    from rag.chunkers.rm_element import chunk_rm_elements

    chunks = chunk_rm_elements(REPO_ROOT)
    bad = [c.chunk_id for c in chunks if c.layer != "L2.5"]
    assert bad == [], f"Chunks with wrong layer: {bad}"


def test_chunk_rm_elements_source_file():
    """AC.4: every chunk references the correct source_file."""
    from rag.chunkers.rm_element import chunk_rm_elements

    chunks = chunk_rm_elements(REPO_ROOT)
    bad = [c.chunk_id for c in chunks if "RM_v2_0.md" not in c.source_file]
    assert bad == [], f"Chunks with wrong source_file: {bad}"


def test_chunk_rm_elements_metadata_fields():
    """AC.4: every chunk metadata has element_id, element_label, domains_primary, msr_anchors."""
    from rag.chunkers.rm_element import chunk_rm_elements

    chunks = chunk_rm_elements(REPO_ROOT)
    required = {"element_id", "element_label", "domains_primary", "msr_anchors"}
    for c in chunks:
        missing = required - set(c.metadata.keys())
        assert not missing, f"Chunk {c.chunk_id} missing metadata keys: {missing}"


def test_chunk_rm_elements_unique_ids():
    """AC.4: no duplicate chunk_ids."""
    from rag.chunkers.rm_element import chunk_rm_elements

    chunks = chunk_rm_elements(REPO_ROOT)
    ids = [c.chunk_id for c in chunks]
    assert len(ids) == len(set(ids)), f"Duplicate chunk_ids found: {sorted(set(x for x in ids if ids.count(x) > 1))}"
