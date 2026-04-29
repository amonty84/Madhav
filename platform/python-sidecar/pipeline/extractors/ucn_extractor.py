"""
pipeline.extractors.ucn_extractor — Extract UCN sections from UCN_v4_0.md.
Phase 14D Stream C.

Parses UCN_v4_0.md H2/H3 sections into row dicts matching the l25_ucn_sections schema.
Does NOT call chunk_ucn_sections (avoids P1 gating and Chunk wrappers).
Uses raw parsing utilities from rag.chunkers.ucn_section.
"""
from __future__ import annotations

import logging
import re
import unicodedata
from pathlib import Path
from typing import Any

from rag.chunkers.ucn_section import (
    _extract_domains,
    _extract_part_number,
    _split_at_h2,
    _split_at_h3,
    MIN_BODY_TOKENS,
)
from rag.chunkers import count_tokens

log = logging.getLogger(__name__)

SOURCE_FILE = "025_HOLISTIC_SYNTHESIS/UCN_v4_0.md"

_SIG_RE = re.compile(r"SIG\.MSR\.\d{3}[a-z]?")


def _extract_signal_refs(text: str) -> list[str]:
    return sorted(set(_SIG_RE.findall(text)))


def _slugify(text: str) -> str:
    """Convert heading text to a safe slug for section_id when part_number is empty."""
    text = unicodedata.normalize("NFKD", text)
    text = re.sub(r"[^\w\s-]", "", text).strip()
    text = re.sub(r"[\s_-]+", "-", text)
    return text[:40].strip("-")


def extract_ucn_sections(repo_root: str) -> list[dict[str, Any]]:
    """
    Parse UCN_v4_0.md and return one dict per H2/H3 section matching l25_ucn_sections schema.

    Args:
        repo_root: Absolute path to the repository root.

    Returns:
        List of > 50 section dicts.

    Raises:
        FileNotFoundError: If UCN_v4_0.md is not found.
        ValueError: If fewer than 50 dicts are returned.
    """
    ucn_path = Path(repo_root) / SOURCE_FILE
    if not ucn_path.exists():
        raise FileNotFoundError(f"UCN_v4_0.md not found at {ucn_path}")

    text = ucn_path.read_text(encoding="utf-8")
    h2_sections = _split_at_h2(text)

    rows: list[dict[str, Any]] = []

    for heading, body in h2_sections:
        if not heading:
            continue  # frontmatter preamble before first H2

        body_tokens = count_tokens(body)

        if body_tokens < MIN_BODY_TOKENS:
            log.debug("UCN extractor: skipping short section '%s' (%d tokens)", heading, body_tokens)
            continue

        part_number = _extract_part_number(heading)
        # If no roman/arabic part number, generate a slug from heading
        if not part_number:
            part_number_slug = _slugify(heading)
            top_level_id = f"UCN.{part_number_slug}" if part_number_slug else f"UCN.{len(rows)}"
        else:
            top_level_id = f"UCN.{part_number}"

        domains = _extract_domains(body)
        first_domain = domains[0] if domains else None
        signal_refs = _extract_signal_refs(body)

        # Determine whether to emit a single top-level row or split into H3 sub-rows
        h3_parts = _split_at_h3(body)

        # If there are meaningful H3 sub-sections, emit sub-rows instead of the parent
        # A "meaningful" split means more than one part AND at least one part with enough tokens
        meaningful_h3 = len(h3_parts) > 1 and any(
            count_tokens(sb) >= MIN_BODY_TOKENS for _, sb in h3_parts
        )

        if not meaningful_h3:
            # Emit single top-level row
            row: dict[str, Any] = {
                "section_id": top_level_id,
                "parent_section_id": None,
                "domain": first_domain,
                "title": heading,
                "content": body,
                "derived_from_signals": signal_refs,
                "source_lines": f"H2:{heading}",
                "build_id": "",  # filled in by writer
            }
            rows.append(row)
        else:
            # Emit parent row (full body) for hierarchy anchor
            parent_row: dict[str, Any] = {
                "section_id": top_level_id,
                "parent_section_id": None,
                "domain": first_domain,
                "title": heading,
                "content": body,
                "derived_from_signals": signal_refs,
                "source_lines": f"H2:{heading}",
                "build_id": "",
            }
            rows.append(parent_row)

            # Emit sub-rows for each H3 that meets the minimum token threshold
            for sub_idx, (sub_heading, sub_body) in enumerate(h3_parts):
                sub_tokens = count_tokens(sub_body)
                if sub_tokens < MIN_BODY_TOKENS:
                    log.debug(
                        "UCN extractor: skipping short H3 sub-section '%s / %s' (%d tokens)",
                        heading, sub_heading, sub_tokens,
                    )
                    continue

                sub_id = f"{top_level_id}.{sub_idx}"
                sub_domains = _extract_domains(sub_body)
                sub_first_domain = sub_domains[0] if sub_domains else first_domain
                sub_signal_refs = _extract_signal_refs(sub_body)

                source_label = (
                    f"H2:{heading} / H3:{sub_heading}" if sub_heading else f"H2:{heading} / H3:sub-{sub_idx}"
                )

                sub_row: dict[str, Any] = {
                    "section_id": sub_id,
                    "parent_section_id": top_level_id,
                    "domain": sub_first_domain,
                    "title": sub_heading if sub_heading else f"{heading} (sub-{sub_idx})",
                    "content": sub_body,
                    "derived_from_signals": sub_signal_refs,
                    "source_lines": source_label,
                    "build_id": "",
                }
                rows.append(sub_row)

    if len(rows) <= 50:
        raise ValueError(
            f"UCN extractor produced only {len(rows)} sections (expected > 50). "
            "Check H2 parsing or MIN_BODY_TOKENS threshold."
        )

    log.info("ucn_extractor: extracted %d sections from %s", len(rows), SOURCE_FILE)
    return rows
