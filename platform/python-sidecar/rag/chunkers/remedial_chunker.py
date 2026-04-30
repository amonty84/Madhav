"""
chunkers.remedial_chunker — Doc-type l4_remedial: Remedial Codex chunker.
Wave 5 M2-D234-BUNDLE. Source: REMEDIAL_CODEX_v2_0_PART1.md + PART2.md.
Boundary: H2 (^## ); split at H3 if > 1500 tokens.
Doc-type: l4_remedial.
Layer: L4.
Stop condition: STOP if either source file produces 0 chunks.
"""
from __future__ import annotations

import logging
import re
import sys
from pathlib import Path
from typing import Any

from rag.chunkers import count_tokens, truncate_to_tokens, write_chunks_to_db
from rag.models import Chunk

logger = logging.getLogger(__name__)

SOURCE_FILES = [
    ("04_REMEDIAL_CODEX/REMEDIAL_CODEX_v2_0_PART1.md", "PART1", 1),
    ("04_REMEDIAL_CODEX/REMEDIAL_CODEX_v2_0_PART2.md", "PART2", 2),
]
DOC_TYPE = "l4_remedial"
LAYER = "L4"
SOURCE_VERSION = "2.0"
MAX_TOKENS = 1500
MIN_BODY_TOKENS = 30

_H2_RE = re.compile(r"^## (.+)$", re.MULTILINE)
_H3_RE = re.compile(r"^### (.+)$", re.MULTILINE)
_FRONTMATTER_RE = re.compile(r"^---\n.*?^---\n", re.DOTALL | re.MULTILINE)

# Headings to skip (document metadata headers, not content)
_SKIP_HEADING_PATTERNS = [
    re.compile(r"abhisek mohanty jyotish intelligence system", re.IGNORECASE),
    re.compile(r"^v\d+\.\d+\s*\|", re.IGNORECASE),
]


def _strip_frontmatter(text: str) -> str:
    m = _FRONTMATTER_RE.match(text)
    return text[m.end():] if m else text


def _is_metadata_heading(heading: str) -> bool:
    for pat in _SKIP_HEADING_PATTERNS:
        if pat.search(heading):
            return True
    return False


def _split_at_h3(section_text: str, heading: str) -> list[str]:
    """Split an H2 section into sub-chunks at H3 boundaries."""
    parts: list[str] = []
    matches = list(_H3_RE.finditer(section_text))
    if not matches:
        return [section_text.strip()]
    # text before first H3
    preamble = section_text[: matches[0].start()].strip()
    if preamble and count_tokens(preamble) >= MIN_BODY_TOKENS:
        parts.append(preamble)
    for i, m in enumerate(matches):
        end = matches[i + 1].start() if i + 1 < len(matches) else len(section_text)
        chunk_text = section_text[m.start() : end].strip()
        if count_tokens(chunk_text) >= MIN_BODY_TOKENS:
            parts.append(chunk_text)
    return parts if parts else [section_text.strip()]


def _build_chunk(content: str, part_label: str, part_num: int, idx: int, heading: str) -> Chunk:
    canonical_id = f"REMEDIAL_CODEX_v2_0_{part_label}"
    source_file = f"04_REMEDIAL_CODEX/REMEDIAL_CODEX_v2_0_{part_label}.md"
    chunk_id = f"remedial_{part_label.lower()}_{idx:03d}"
    token_count = count_tokens(content)
    truncated = False
    if token_count > MAX_TOKENS:
        content, truncated = truncate_to_tokens(content, MAX_TOKENS)
        token_count = count_tokens(content)

    metadata: dict[str, Any] = {
        "canonical_id": canonical_id,
        "heading": heading,
        "part_num": part_num,
        "chunk_index": idx,
    }
    if truncated:
        metadata["truncation_note"] = f"Hard truncated at {MAX_TOKENS} tokens"

    return Chunk(
        chunk_id=chunk_id,
        doc_type=DOC_TYPE,
        layer=LAYER,
        source_file=source_file,
        source_version=SOURCE_VERSION,
        content=content,
        token_count=token_count,
        is_stale=False,
        citation_valid=True,
        metadata=metadata,
    )


def _chunk_file(repo_root: str, rel_path: str, part_label: str, part_num: int) -> list[Chunk]:
    """Parse one REMEDIAL_CODEX part file and return its chunks."""
    path = Path(repo_root) / rel_path
    if not path.exists():
        raise FileNotFoundError(f"Source file not found: {path}")

    text = _strip_frontmatter(path.read_text(encoding="utf-8"))

    # Split at H2 boundaries
    sections: list[tuple[str, str]] = []  # (heading, body_text)
    matches = list(_H2_RE.finditer(text))
    for i, m in enumerate(matches):
        heading = m.group(1).strip()
        if _is_metadata_heading(heading):
            continue
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        body = text[start:end].strip()
        if body:
            sections.append((heading, body))

    if not sections:
        raise RuntimeError(
            f"STOP: {rel_path} produced 0 content H2 sections — boundary detection failure"
        )

    chunks: list[Chunk] = []
    idx = 0
    for heading, body in sections:
        full_section = f"## {heading}\n\n{body}"
        if count_tokens(full_section) <= MAX_TOKENS:
            if count_tokens(body) >= MIN_BODY_TOKENS:
                chunks.append(_build_chunk(full_section, part_label, part_num, idx, heading))
                idx += 1
        else:
            # Split at H3
            sub_parts = _split_at_h3(body, heading)
            for sub in sub_parts:
                sub_content = f"## {heading}\n\n{sub}" if not sub.startswith("###") else sub
                if count_tokens(sub_content) >= MIN_BODY_TOKENS:
                    chunks.append(_build_chunk(sub_content, part_label, part_num, idx, heading))
                    idx += 1

    if not chunks:
        raise RuntimeError(
            f"STOP: {rel_path} produced 0 chunks — check H2 structure and MIN_BODY_TOKENS"
        )

    logger.info("remedial_chunker: %s → %d chunks", rel_path, len(chunks))
    return chunks


def chunk_remedial_codex(repo_root: str) -> list[Chunk]:
    """
    Parse both REMEDIAL_CODEX part files and return combined chunks.
    Stop condition: raises RuntimeError if either file produces 0 chunks.
    """
    all_chunks: list[Chunk] = []
    for rel_path, part_label, part_num in SOURCE_FILES:
        chunks = _chunk_file(repo_root, rel_path, part_label, part_num)
        all_chunks.extend(chunks)

    logger.info(
        "remedial_chunker: total %d chunks (PART1 + PART2) for doc_type='%s'",
        len(all_chunks), DOC_TYPE,
    )
    return all_chunks


def run(repo_root: str) -> int:
    """Parse both REMEDIAL_CODEX files, write to rag_chunks, return written count."""
    chunks = chunk_remedial_codex(repo_root)
    written = write_chunks_to_db(chunks)
    logger.info("remedial_chunker: wrote %d / %d chunks to rag_chunks", written, len(chunks))
    return written


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    root = sys.argv[1] if len(sys.argv) > 1 else str(Path(__file__).parents[4])
    count = run(root)
    print(f"remedial_chunker: {count} chunks written")
