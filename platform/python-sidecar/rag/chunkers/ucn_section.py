"""
chunkers.ucn_section — Doc-type 2: UCN Section chunker.
Phase B.2. Per M2A_EXEC_PLAN_v1_0.md §PLAN B.2 Task 1.2 + chunker_spec_v1_0.md §1 Doc-Type 2.
Spec ref: chunker_spec_v1_0.md §1 Doc-Type 2.
Boundary: ^## (H2). Max tokens: 1500; split at H3 if exceeded. Target: ≥1 chunk per Part.
"""
from __future__ import annotations

import logging
import re
import sys
from pathlib import Path
from typing import Any

from rag.chunkers import count_tokens, normalize_msr_refs, truncate_to_tokens, write_chunks_to_db
from rag.models import Chunk
from rag.validators import p1_layer_separation as p1

logger = logging.getLogger(__name__)

MAX_TOKENS = 1500
MIN_BODY_TOKENS = 30  # skip preamble/container sections below this threshold
SOURCE_FILE = "025_HOLISTIC_SYNTHESIS/UCN_v4_0.md"
SOURCE_VERSION = "4.0"
LAYER = "L2.5"

_PART_NUM_RE = re.compile(r"(?:Part|PART|§)\s*([IVX\d]+)", re.IGNORECASE)

DOMAIN_KEYWORDS = {
    "career": "career",
    "wealth": "wealth",
    "relationship": "relationships",
    "health": "health",
    "children": "children",
    "spirit": "spirit",
    "parents": "parents",
    "mind": "mind",
    "travel": "travel",
}


def _extract_part_number(heading: str) -> str:
    m = _PART_NUM_RE.search(heading)
    return m.group(1) if m else ""


def _extract_domains(content: str) -> list[str]:
    lower = content.lower()
    return [domain for kw, domain in DOMAIN_KEYWORDS.items() if kw in lower]


def _split_at_h2(text: str) -> list[tuple[str, str]]:
    """Split text at H2 (## ) boundaries. Returns [(heading, body)] pairs."""
    parts: list[tuple[str, str]] = []
    current_heading = ""
    current_body: list[str] = []

    for line in text.split("\n"):
        if line.startswith("## "):
            if current_heading or current_body:
                parts.append((current_heading, "\n".join(current_body)))
            current_heading = line[3:].strip()
            current_body = []
        else:
            current_body.append(line)

    if current_heading or current_body:
        parts.append((current_heading, "\n".join(current_body)))
    return parts


def _split_at_h3(body: str) -> list[tuple[str, str]]:
    """Split a section body at H3 (### ) boundaries. Returns [(sub_heading, sub_body)]."""
    parts: list[tuple[str, str]] = []
    current_heading = ""
    current_body: list[str] = []

    for line in body.split("\n"):
        if line.startswith("### "):
            if current_body or current_heading:
                parts.append((current_heading, "\n".join(current_body)))
            current_heading = line[4:].strip()
            current_body = []
        else:
            current_body.append(line)

    if current_body or current_heading:
        parts.append((current_heading, "\n".join(current_body)))
    return parts


def _build_chunk(
    heading: str,
    content: str,
    part_number: str,
    domains: list[str],
    sub_chunk_index: int | None = None,
    sub_heading: str = "",
) -> Chunk:
    """Construct a Chunk from section parts. Applies truncation if needed."""
    content = normalize_msr_refs(content)
    token_count = count_tokens(content)
    truncated = False
    if token_count > MAX_TOKENS:
        content, truncated = truncate_to_tokens(content, MAX_TOKENS)
        token_count = count_tokens(content)

    metadata: dict[str, Any] = {
        "part_title": heading,
        "part_number": part_number,
        "domains_mentioned": domains if domains else _extract_domains(content),
        "ucn_version": SOURCE_VERSION,
    }
    if sub_chunk_index is not None:
        metadata["sub_chunk_index"] = sub_chunk_index
        metadata["sub_heading"] = sub_heading
    if truncated:
        metadata["truncation_note"] = f"Hard truncated at {MAX_TOKENS} tokens"

    return Chunk(
        chunk_id="",
        doc_type="ucn_section",
        layer=LAYER,
        source_file=SOURCE_FILE,
        source_version=SOURCE_VERSION,
        content=content,
        token_count=token_count,
        is_stale=False,
        citation_valid=True,
        metadata=metadata,
    )


def chunk_ucn_sections(repo_root: str) -> list[Chunk]:
    """
    Parse UCN_v4_0.md and produce chunks per H2 section.
    - Sections < MIN_BODY_TOKENS: skipped (preamble/container headers).
    - Sections > MAX_TOKENS: split at H3 sub-boundaries.
    - P1 gating applied to all candidate chunks.
    Stop condition: raises RuntimeError if zero chunks produced.
    """
    ucn_path = Path(repo_root) / SOURCE_FILE
    if not ucn_path.exists():
        raise FileNotFoundError(f"UCN_v4_0.md not found at {ucn_path}")

    text = ucn_path.read_text(encoding="utf-8")
    sections = _split_at_h2(text)

    chunks: list[Chunk] = []
    p1_violations = 0
    skipped_short = 0

    for heading, body in sections:
        if not heading:
            continue  # frontmatter preamble before first H2

        norm_body = normalize_msr_refs(body)
        body_tokens = count_tokens(norm_body)

        if body_tokens < MIN_BODY_TOKENS:
            skipped_short += 1
            logger.debug("UCN: skipping short/container section '%s' (%d tokens)", heading, body_tokens)
            continue

        part_number = _extract_part_number(heading)
        domains = _extract_domains(body)

        # Decide: single chunk or H3-split
        full_content = f"## {heading}\n{body}"
        if count_tokens(normalize_msr_refs(full_content)) <= MAX_TOKENS:
            candidate = _build_chunk(heading, full_content, part_number, domains)
            chunk_dict = {
                "layer": LAYER,
                "doc_type": "ucn_section",
                "content": candidate.content,
                "metadata": candidate.metadata,
            }
            p1_res = p1.validate(chunk_dict)
            if not p1_res["valid"]:
                p1_violations += 1
                logger.warning("P1 violation UCN '%s': %s", heading, p1_res["reason"])
                continue
            chunks.append(candidate)
        else:
            # Split at H3 boundaries
            h3_parts = _split_at_h3(body)
            if len(h3_parts) <= 1:
                # No H3s — hard-truncate entire section
                candidate = _build_chunk(heading, full_content, part_number, domains)
                chunk_dict = {
                    "layer": LAYER,
                    "doc_type": "ucn_section",
                    "content": candidate.content,
                    "metadata": candidate.metadata,
                }
                p1_res = p1.validate(chunk_dict)
                if not p1_res["valid"]:
                    p1_violations += 1
                    logger.warning("P1 violation UCN '%s' (truncated): %s", heading, p1_res["reason"])
                    continue
                chunks.append(candidate)
            else:
                for idx, (sub_heading, sub_body) in enumerate(h3_parts):
                    if not sub_body.strip():
                        continue
                    sub_content = (
                        f"## {heading} / ### {sub_heading}\n{sub_body}"
                        if sub_heading
                        else f"## {heading}\n{sub_body}"
                    )
                    sub_domains = _extract_domains(sub_body)
                    candidate = _build_chunk(
                        heading, sub_content, part_number, sub_domains, idx, sub_heading
                    )
                    chunk_dict = {
                        "layer": LAYER,
                        "doc_type": "ucn_section",
                        "content": candidate.content,
                        "metadata": candidate.metadata,
                    }
                    p1_res = p1.validate(chunk_dict)
                    if not p1_res["valid"]:
                        p1_violations += 1
                        logger.warning(
                            "P1 violation UCN sub-chunk '%s / %s': %s",
                            heading, sub_heading, p1_res["reason"],
                        )
                        continue
                    chunks.append(candidate)

    if not chunks:
        raise RuntimeError("STOP: Zero UCN chunks produced — boundary detection failed")

    logger.info(
        "ucn_section: %d chunks produced (%d skipped short, %d P1 violations)",
        len(chunks), skipped_short, p1_violations,
    )
    return chunks


def run(repo_root: str) -> int:
    """Parse UCN sections, write to rag_chunks via Supabase REST, return written count."""
    chunks = chunk_ucn_sections(repo_root)
    written = write_chunks_to_db(chunks)
    logger.info("ucn_section: wrote %d / %d chunks to rag_chunks", written, len(chunks))
    return written


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    root = sys.argv[1] if len(sys.argv) > 1 else str(Path(__file__).parents[5])
    count = run(root)
    print(f"ucn_section: {count} chunks written")
