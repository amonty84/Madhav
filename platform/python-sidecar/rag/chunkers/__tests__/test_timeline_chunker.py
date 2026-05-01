"""
Tests for timeline_chunker.py — Wave 5 M2-D234-BUNDLE.
"""
import pytest
from pathlib import Path

REPO_ROOT = str(Path(__file__).parents[5])


def test_chunk_count_gte_5():
    from rag.chunkers.timeline_chunker import chunk_timeline_sections
    chunks = chunk_timeline_sections(REPO_ROOT)
    assert len(chunks) >= 5, f"Expected ≥5 chunks, got {len(chunks)}"


def test_all_chunks_doc_type_l5_timeline():
    from rag.chunkers.timeline_chunker import chunk_timeline_sections
    chunks = chunk_timeline_sections(REPO_ROOT)
    for c in chunks:
        assert c.doc_type == "l5_timeline", f"Bad doc_type: {c.doc_type}"


def test_all_chunks_layer_L5():
    from rag.chunkers.timeline_chunker import chunk_timeline_sections
    chunks = chunk_timeline_sections(REPO_ROOT)
    for c in chunks:
        assert c.layer == "L5", f"Bad layer: {c.layer}"


def test_no_chunk_exceeds_max_tokens():
    from rag.chunkers import count_tokens
    from rag.chunkers.timeline_chunker import MAX_TOKENS, chunk_timeline_sections
    chunks = chunk_timeline_sections(REPO_ROOT)
    for c in chunks:
        actual = count_tokens(c.content)
        assert actual <= MAX_TOKENS, f"Chunk {c.chunk_id} has {actual} tokens > {MAX_TOKENS}"


def test_chunk_ids_are_unique():
    from rag.chunkers.timeline_chunker import chunk_timeline_sections
    chunks = chunk_timeline_sections(REPO_ROOT)
    ids = [c.chunk_id for c in chunks]
    assert len(ids) == len(set(ids)), "Duplicate chunk_ids found"


def test_chunk_ids_use_timeline_prefix():
    from rag.chunkers.timeline_chunker import chunk_timeline_sections
    chunks = chunk_timeline_sections(REPO_ROOT)
    for c in chunks:
        assert c.chunk_id.startswith("timeline_"), f"Bad chunk_id prefix: {c.chunk_id}"


def test_source_version_is_1_0():
    from rag.chunkers.timeline_chunker import chunk_timeline_sections
    chunks = chunk_timeline_sections(REPO_ROOT)
    for c in chunks:
        assert c.source_version == "1.0", f"Bad source_version: {c.source_version}"


def test_metadata_contains_canonical_id():
    from rag.chunkers.timeline_chunker import chunk_timeline_sections
    chunks = chunk_timeline_sections(REPO_ROOT)
    for c in chunks:
        assert "canonical_id" in c.metadata, f"Missing canonical_id in metadata for {c.chunk_id}"
        assert c.metadata["canonical_id"] == "LIFETIME_TIMELINE_v1_0"
