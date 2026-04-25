"""
Shared loader for CANONICAL_ARTIFACTS_v1_0.md.

# Implements: GOVERNANCE_INTEGRITY_PROTOCOL_v1_0.md §E (CANONICAL_ARTIFACTS schema)

The canonical-artifact registry is authored as a markdown document with multiple
fenced ``yaml`` blocks — one per canonical artifact row (under §1) and one per
mirror pair (under §2). This loader extracts those blocks, parses each as YAML,
and returns two dicts keyed by `canonical_id` and `pair_id` respectively.

Usage:
    from _ca_loader import load_canonical_artifacts
    ca = load_canonical_artifacts(repo_root)
    msr_row = ca.artifacts["MSR"]          # dict
    mp1 = ca.mirror_pairs["MP.1"]          # dict

This module has NO dependencies beyond the Python stdlib + PyYAML.
"""
from __future__ import annotations

import dataclasses
import hashlib
import pathlib
import re
from typing import Dict, List, Optional, Tuple

import yaml


CANONICAL_PATH = "00_ARCHITECTURE/CANONICAL_ARTIFACTS_v1_0.md"

# Match fenced ```yaml ... ``` blocks (non-greedy body).
_YAML_BLOCK_RE = re.compile(r"^```yaml\s*\n(.*?)^```\s*$", re.MULTILINE | re.DOTALL)

# Header anchors — we split the document into sections so a block in §1 is
# indexed as a canonical-artifact row and a block in §2 is indexed as a
# mirror-pair row. Headers are at level 2 (## §N — ...).
_SECTION_HEADER_RE = re.compile(r"^##\s+§(\d+)\s*—", re.MULTILINE)


@dataclasses.dataclass
class CanonicalArtifacts:
    path: pathlib.Path
    raw_text: str
    fingerprint_observed: str  # sha256 of the file on disk
    artifacts: Dict[str, dict]       # canonical_id -> row dict
    mirror_pairs: Dict[str, dict]    # pair_id -> row dict


def compute_sha256(path: pathlib.Path) -> Optional[str]:
    """Return hex sha256 of a file's contents, or None if missing."""
    try:
        with open(path, "rb") as f:
            return hashlib.sha256(f.read()).hexdigest()
    except FileNotFoundError:
        return None


def _split_sections(text: str) -> List[Tuple[int, str]]:
    """Return [(section_number, section_body), ...] for top-level §N sections."""
    positions = [(m.start(), int(m.group(1))) for m in _SECTION_HEADER_RE.finditer(text)]
    sections: List[Tuple[int, str]] = []
    for i, (start, num) in enumerate(positions):
        end = positions[i + 1][0] if i + 1 < len(positions) else len(text)
        sections.append((num, text[start:end]))
    return sections


def _extract_yaml_blocks(body: str) -> List[dict]:
    """Parse every fenced ```yaml``` block in a section body."""
    blocks: List[dict] = []
    for m in _YAML_BLOCK_RE.finditer(body):
        try:
            data = yaml.safe_load(m.group(1))
        except yaml.YAMLError:
            continue
        if isinstance(data, dict):
            blocks.append(data)
    return blocks


def load_canonical_artifacts(repo_root: pathlib.Path) -> CanonicalArtifacts:
    """
    Parse CANONICAL_ARTIFACTS_v1_0.md and return indexed artifacts + mirror pairs.
    Raises FileNotFoundError if the registry doesn't exist (bootstrap case).
    """
    path = repo_root / CANONICAL_PATH
    raw_text = path.read_text(encoding="utf-8")
    fingerprint_observed = compute_sha256(path) or ""

    artifacts: Dict[str, dict] = {}
    mirror_pairs: Dict[str, dict] = {}

    sections = _split_sections(raw_text)
    for section_num, body in sections:
        blocks = _extract_yaml_blocks(body)
        if section_num == 1:
            for block in blocks:
                cid = block.get("canonical_id")
                if cid:
                    artifacts[cid] = block
        elif section_num == 2:
            for block in blocks:
                pid = block.get("pair_id")
                if pid:
                    mirror_pairs[pid] = block

    return CanonicalArtifacts(
        path=path,
        raw_text=raw_text,
        fingerprint_observed=fingerprint_observed,
        artifacts=artifacts,
        mirror_pairs=mirror_pairs,
    )
