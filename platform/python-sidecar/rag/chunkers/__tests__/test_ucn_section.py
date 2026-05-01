"""
Tests for rag.chunkers.ucn_section — H3 always-emit behavior.
KARN-W3-R1-CHUNKER-COMPLETION AC.2 / AC.12.
"""
from __future__ import annotations

from pathlib import Path

REPO_ROOT = str(Path(__file__).resolve().parents[5])


def _make_ucn_text(sections: str) -> str:
    """Wrap section markdown in a minimal UCN-shaped string for unit tests."""
    return f"---\nfrontmatter: test\n---\n\n{sections}"


def test_ucn_h3_chunks_always_split(tmp_path):
    """AC.2: H2 with 3 H3 sub-sections (total tokens < MAX_TOKENS) produces ≥3 chunks."""
    from rag.chunkers.ucn_section import chunk_ucn_sections

    ucn_dir = tmp_path / "025_HOLISTIC_SYNTHESIS"
    ucn_dir.mkdir(parents=True)
    # Short section well under 1500 tokens but has 3 H3 sub-sections
    ucn_content = _make_ucn_text(
        "## Part I — Test Section\n"
        "### I.1 — First Sub\nMercury PLN.MERCURY is strong here.\n\n"
        "### I.2 — Second Sub\nSaturn PLN.SATURN rules the 7th.\n\n"
        "### I.3 — Third Sub\nJupiter PLN.JUPITER brings wisdom.\n\n"
    )
    (ucn_dir / "UCN_v4_0.md").write_text(ucn_content)
    chunks = chunk_ucn_sections(str(tmp_path), min_chunks=0)
    h3_chunks = [c for c in chunks if c.metadata.get("sub_heading")]
    assert len(h3_chunks) >= 3, (
        f"Expected ≥3 H3 chunks from section with 3 H3 sub-headings, got {len(h3_chunks)}"
    )


def test_ucn_h2_no_h3_single_chunk(tmp_path):
    """AC.2: H2 with no H3 sub-sections produces exactly 1 chunk."""
    from rag.chunkers.ucn_section import chunk_ucn_sections

    ucn_dir = tmp_path / "025_HOLISTIC_SYNTHESIS"
    ucn_dir.mkdir(parents=True)
    ucn_content = _make_ucn_text(
        "## Part I — Single Block\n"
        "Mercury PLN.MERCURY is the Yogi planet in this chart. "
        "Saturn PLN.SATURN occupies the 7th house HSE.7 (Libra) and is exalted.\n\n"
    )
    (ucn_dir / "UCN_v4_0.md").write_text(ucn_content)
    chunks = chunk_ucn_sections(str(tmp_path), min_chunks=0)
    assert len(chunks) == 1, f"Expected 1 chunk for H2 with no H3, got {len(chunks)}"
    assert "sub_heading" not in chunks[0].metadata
    assert "sub_chunk_index" not in chunks[0].metadata


def test_ucn_total_chunk_count():
    """AC.2 / AC.1: chunk_ucn_sections(REPO_ROOT) returns ≥100 chunks against real UCN_v4_0.md."""
    from rag.chunkers.ucn_section import chunk_ucn_sections

    chunks = chunk_ucn_sections(REPO_ROOT)
    assert len(chunks) >= 100, f"Expected ≥100 ucn_section chunks, got {len(chunks)}"


def test_ucn_h3_chunk_metadata():
    """AC.9: every H3-derived chunk has sub_heading populated and sub_chunk_index set."""
    from rag.chunkers.ucn_section import chunk_ucn_sections

    chunks = chunk_ucn_sections(REPO_ROOT)
    h3_chunks = [c for c in chunks if c.metadata.get("sub_heading")]
    assert h3_chunks, "No H3 chunks found — test requires ≥1 H3 chunk"
    for c in h3_chunks:
        assert c.metadata.get("sub_heading"), f"sub_heading missing on chunk {c.chunk_id}"
        assert "sub_chunk_index" in c.metadata, f"sub_chunk_index missing on chunk {c.chunk_id}"
        assert isinstance(c.metadata["sub_chunk_index"], int), (
            f"sub_chunk_index must be int, got {type(c.metadata['sub_chunk_index'])}"
        )
        assert c.metadata.get("part_title"), f"part_title missing on chunk {c.chunk_id}"
        assert c.metadata.get("part_number") is not None, f"part_number missing on chunk {c.chunk_id}"
        assert c.layer == "L2.5", f"Wrong layer on chunk {c.chunk_id}: {c.layer}"
        assert c.doc_type == "ucn_section", f"Wrong doc_type on chunk {c.chunk_id}"
        assert c.source_file == "025_HOLISTIC_SYNTHESIS/UCN_v4_0.md"


def test_ucn_p1_all_pass():
    """AC.8: all chunks produced from UCN_v4_0.md pass the P1 layer_separation validator."""
    from rag.chunkers.ucn_section import chunk_ucn_sections
    from rag.validators import p1_layer_separation as p1

    chunks = chunk_ucn_sections(REPO_ROOT)
    violations = []
    for c in chunks:
        result = p1.validate({"layer": c.layer, "doc_type": c.doc_type, "content": c.content, "metadata": c.metadata})
        if not result["valid"]:
            violations.append((c.chunk_id, result["reason"]))
    assert not violations, f"P1 violations ({len(violations)}):\n" + "\n".join(
        f"  {cid}: {reason}" for cid, reason in violations[:10]
    )
