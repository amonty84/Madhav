"""
Tests for remedial_chunker.py — Wave 5 M2-D234-BUNDLE.
"""
import pytest
from pathlib import Path

REPO_ROOT = str(Path(__file__).parents[5])


def test_chunk_count_gte_10():
    from rag.chunkers.remedial_chunker import chunk_remedial_codex
    chunks = chunk_remedial_codex(REPO_ROOT)
    assert len(chunks) >= 10, f"Expected ≥10 chunks, got {len(chunks)}"


def test_all_chunks_doc_type_l4_remedial():
    from rag.chunkers.remedial_chunker import chunk_remedial_codex
    chunks = chunk_remedial_codex(REPO_ROOT)
    for c in chunks:
        assert c.doc_type == "l4_remedial", f"Bad doc_type: {c.doc_type}"


def test_all_chunks_layer_L4():
    from rag.chunkers.remedial_chunker import chunk_remedial_codex
    chunks = chunk_remedial_codex(REPO_ROOT)
    for c in chunks:
        assert c.layer == "L4", f"Bad layer: {c.layer}"


def test_no_chunk_exceeds_max_tokens():
    from rag.chunkers import count_tokens
    from rag.chunkers.remedial_chunker import MAX_TOKENS, chunk_remedial_codex
    chunks = chunk_remedial_codex(REPO_ROOT)
    for c in chunks:
        actual = count_tokens(c.content)
        assert actual <= MAX_TOKENS, f"Chunk {c.chunk_id} has {actual} tokens > {MAX_TOKENS}"


def test_chunk_ids_are_unique():
    from rag.chunkers.remedial_chunker import chunk_remedial_codex
    chunks = chunk_remedial_codex(REPO_ROOT)
    ids = [c.chunk_id for c in chunks]
    assert len(ids) == len(set(ids)), "Duplicate chunk_ids found"


def test_both_parts_produce_chunks():
    from rag.chunkers.remedial_chunker import chunk_remedial_codex
    chunks = chunk_remedial_codex(REPO_ROOT)
    part1_chunks = [c for c in chunks if "part1" in c.chunk_id]
    part2_chunks = [c for c in chunks if "part2" in c.chunk_id]
    assert len(part1_chunks) >= 5, f"PART1 produced only {len(part1_chunks)} chunks"
    assert len(part2_chunks) >= 3, f"PART2 produced only {len(part2_chunks)} chunks"


def test_source_version_is_2_0():
    from rag.chunkers.remedial_chunker import chunk_remedial_codex
    chunks = chunk_remedial_codex(REPO_ROOT)
    for c in chunks:
        assert c.source_version == "2.0", f"Bad source_version: {c.source_version}"


def test_metadata_contains_canonical_id():
    from rag.chunkers.remedial_chunker import chunk_remedial_codex
    chunks = chunk_remedial_codex(REPO_ROOT)
    for c in chunks:
        assert "canonical_id" in c.metadata, f"Missing canonical_id in metadata for {c.chunk_id}"
        assert "REMEDIAL_CODEX_v2_0" in c.metadata["canonical_id"]
