"""
Tests for rag.chunkers.lel_chunker.
KARN-W3-R1-CHUNKER-COMPLETION AC.3 / AC.4 / AC.10 / AC.12.
"""
from __future__ import annotations

from pathlib import Path

REPO_ROOT = str(Path(__file__).resolve().parents[5])

_EXPECTED_PERIOD_IDS = {
    "PERIOD.2007",
    "PERIOD.2012_2013",
    "PERIOD.2016",
    "PERIOD.2018_2021",
    "PERIOD.2022_2024",
}

_EXPECTED_CHRONIC_IDS = {
    "PATTERN.STAMMER.01",
    "PATTERN.PHYSIQUE.01",
    "PATTERN.SPORTS_LUCK.01",
    "PATTERN.SLEEP_IRREGULARITY.01",
    "PATTERN.HEADACHES.01",
    "PATTERN.COMPUTER_APTITUDE.01",
}


def test_lel_period_count():
    """AC.3: chunk_lel_sections produces exactly 5 lel_period_summary chunks."""
    from rag.chunkers.lel_chunker import chunk_lel_sections

    chunks = chunk_lel_sections(REPO_ROOT)
    period_chunks = [c for c in chunks if c.doc_type == "lel_period_summary"]
    assert len(period_chunks) == 5, (
        f"Expected 5 lel_period_summary chunks, got {len(period_chunks)}"
    )


def test_lel_chronic_count():
    """AC.4: chunk_lel_sections produces exactly 6 lel_chronic_pattern chunks."""
    from rag.chunkers.lel_chunker import chunk_lel_sections

    chunks = chunk_lel_sections(REPO_ROOT)
    chronic_chunks = [c for c in chunks if c.doc_type == "lel_chronic_pattern"]
    assert len(chronic_chunks) == 6, (
        f"Expected 6 lel_chronic_pattern chunks, got {len(chronic_chunks)}"
    )


def test_lel_period_block_ids():
    """AC.3: block_ids for period chunks are exactly the 5 expected PERIOD.xxx IDs."""
    from rag.chunkers.lel_chunker import chunk_lel_sections

    chunks = chunk_lel_sections(REPO_ROOT)
    period_ids = {c.metadata["block_id"] for c in chunks if c.doc_type == "lel_period_summary"}
    assert period_ids == _EXPECTED_PERIOD_IDS, (
        f"Period block_id mismatch.\nExpected: {_EXPECTED_PERIOD_IDS}\nGot: {period_ids}"
    )


def test_lel_chronic_block_ids():
    """AC.4: block_ids for chronic chunks are exactly the 6 expected PATTERN.xxx IDs."""
    from rag.chunkers.lel_chunker import chunk_lel_sections

    chunks = chunk_lel_sections(REPO_ROOT)
    chronic_ids = {c.metadata["block_id"] for c in chunks if c.doc_type == "lel_chronic_pattern"}
    assert chronic_ids == _EXPECTED_CHRONIC_IDS, (
        f"Chronic block_id mismatch.\nExpected: {_EXPECTED_CHRONIC_IDS}\nGot: {chronic_ids}"
    )


def test_lel_metadata_required_fields():
    """AC.10: every chunk has block_id, native_id, lel_version, section in metadata."""
    from rag.chunkers.lel_chunker import chunk_lel_sections

    chunks = chunk_lel_sections(REPO_ROOT)
    required = {"block_id", "native_id", "lel_version", "section"}
    for c in chunks:
        missing = required - set(c.metadata.keys())
        assert not missing, (
            f"Chunk {c.chunk_id} missing metadata fields: {missing}"
        )
        assert c.metadata["native_id"] == "abhisek"
        assert c.metadata["lel_version"] == "1.2"
        assert c.layer == "L1"
        assert c.source_file == "01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md"
        assert c.source_version == "1.2"
        expected_section = "5" if c.doc_type == "lel_period_summary" else "4"
        assert c.metadata["section"] == expected_section, (
            f"Chunk {c.chunk_id} has section={c.metadata['section']}, expected {expected_section}"
        )
