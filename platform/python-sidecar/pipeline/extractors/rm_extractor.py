"""
pipeline.extractors.rm_extractor — Extract resonance pairs from RM_v2_0.md.
Phase 14D Stream F.

Parses RM_v2_0.md element blocks (### RM.NN headings + YAML code blocks),
generates all pairwise combinations of msr_anchors per block, and returns
one dict per signal pair matching the l25_rm_resonances schema.
"""
from __future__ import annotations

import itertools
import logging
import re
from pathlib import Path
from typing import Any

import yaml

log = logging.getLogger(__name__)

SOURCE_FILE = "025_HOLISTIC_SYNTHESIS/RM_v2_0.md"

# Matches headings like: ### RM.01 — ..., ### RM.21A — ..., ### RM.21B — ...
_HEADING_RE = re.compile(r'^###\s+(RM\.\d+[A-Z]?)\s*[—–-]')

# Matches clean MSR.NNN (optional lowercase letter suffix)
_MSR_ID_RE = re.compile(r'MSR\.(\d{3}[a-z]?)')


def _normalize_anchor(raw: str) -> str | None:
    """
    Strip parenthetical qualifications and return canonical 'SIG.MSR.NNN' form.

    Examples:
        'MSR.413'                           → 'SIG.MSR.413'
        'MSR.089 (Moolatrikona-band var)'   → 'SIG.MSR.089'
        'MSR.397 (0.91)'                    → 'SIG.MSR.397'
        'MSR.391 (recalibrated ...)'        → 'SIG.MSR.391'
        'something else'                    → None
    """
    m = _MSR_ID_RE.search(raw)
    return f"SIG.MSR.{m.group(1)}" if m else None


def _derive_resonance_type(net_resonance: str) -> str:
    """
    Derive resonance_type from net_resonance text.

    Priority order (first match wins):
      AMPLIF  → 'amplify'
      REINFOR → 'reinforce'
      TENSION or DESTRUCT → 'tension'
      CANCEL or MODULATE  → 'modulate'
      default → 'reinforce'
    """
    text = (net_resonance or "").upper()
    if "AMPLIF" in text:
        return "amplify"
    if "REINFOR" in text:
        return "reinforce"
    if "TENSION" in text or "DESTRUCT" in text:
        return "tension"
    if "CANCEL" in text or "MODULATE" in text:
        return "modulate"
    return "reinforce"


def _derive_strength(net_resonance: str) -> str:
    """
    Derive strength from net_resonance text.

      'STRONGLY'   → 'strong'
      'MODERATELY' → 'moderate'
      default      → 'moderate'
    """
    text = (net_resonance or "").upper()
    if "STRONGLY" in text:
        return "strong"
    if "MODERATELY" in text:
        return "moderate"
    return "moderate"


def _next_sequential_id(last_id: str | None) -> str:
    """
    Generate the next RM ID in sequence after last_id.
    Handles plain integers (RM.07 → RM.08) and suffixed (RM.21A → RM.21B).
    Falls back to a placeholder if last_id is None.
    """
    if last_id is None:
        return "RM.??"
    # Strip RM. prefix
    core = last_id[3:]  # e.g. '07', '21A', '21B'
    # If it ends with a letter suffix
    if core and core[-1].isalpha():
        # Increment letter: A→B, B→C, etc.
        num_part = core[:-1]
        letter = core[-1]
        next_letter = chr(ord(letter) + 1)
        return f"RM.{num_part}{next_letter}"
    else:
        try:
            n = int(core)
            return f"RM.{n + 1:02d}"
        except ValueError:
            return f"RM.??"


# Matches the msr_anchors line in a YAML block
_MSR_ANCHORS_LINE_RE = re.compile(r'^msr_anchors\s*:\s*\[([^\]]*)\]', re.MULTILINE)
# Matches net_resonance: "..." or net_resonance: '...' or net_resonance: text
_NET_RESONANCE_RE = re.compile(
    r'^net_resonance\s*:\s*["\']?([^"\'\\n][^\\n]*?)["\']?\s*$', re.MULTILINE
)
_ELEMENT_RE = re.compile(r'^element\s*:\s*["\']([^"\']+)["\']', re.MULTILINE)
_INTERPRETIVE_RE = re.compile(
    r'^interpretive_note\s*:\s*["\']([^"\']+)["\']', re.MULTILINE
)


def _extract_fields_by_regex(raw_yaml: str) -> dict[str, Any]:
    """
    Fallback: extract key fields from a YAML block that failed to parse cleanly.
    Only extracts the fields needed for resonance pair generation:
      element, msr_anchors, net_resonance, interpretive_note.
    """
    data: dict[str, Any] = {}

    m = _ELEMENT_RE.search(raw_yaml)
    if m:
        data["element"] = m.group(1)

    m = _MSR_ANCHORS_LINE_RE.search(raw_yaml)
    if m:
        # Split comma-separated items and strip whitespace
        items = [item.strip() for item in m.group(1).split(",") if item.strip()]
        data["msr_anchors"] = items

    m = _NET_RESONANCE_RE.search(raw_yaml)
    if m:
        data["net_resonance"] = m.group(1).strip()

    m = _INTERPRETIVE_RE.search(raw_yaml)
    if m:
        data["interpretive_note"] = m.group(1)

    return data


def _parse_rm_blocks(text: str) -> list[tuple[str, dict[str, Any]]]:
    """
    Parse RM_v2_0.md text and return a list of (section_id, parsed_yaml_dict) tuples.

    Strategy:
    - Walk lines, tracking the current RM section heading (### RM.NN).
    - Collect YAML code blocks (``` ... ```) within each section.
    - Assign section_id from the heading; for orphaned YAML blocks (no
      heading since last block), infer the next sequential ID.
    - Each heading may produce at most one YAML block (the first one found).
    """
    lines = text.splitlines()
    blocks: list[tuple[str, dict[str, Any]]] = []

    current_section: str | None = None
    in_yaml: bool = False
    yaml_lines: list[str] = []
    # Track whether we've already consumed a YAML block for the current heading
    heading_consumed: bool = False
    # Track the last emitted section ID so we can infer sequential IDs
    last_emitted_id: str | None = None

    for line in lines:
        heading_match = _HEADING_RE.match(line)
        if heading_match:
            # Flush any open YAML block (shouldn't happen, but be safe)
            if in_yaml and yaml_lines:
                log.warning("Unclosed YAML block at heading %s — discarding", line.strip())
                in_yaml = False
                yaml_lines = []
            current_section = heading_match.group(1)
            heading_consumed = False
            continue

        # Detect opening of a YAML code block
        if re.match(r'^```yaml\s*$', line):
            if in_yaml:
                log.warning("Nested ``` yaml block — ignoring")
                continue
            in_yaml = True
            yaml_lines = []
            continue

        # Detect closing of a code block
        if re.match(r'^```\s*$', line) and in_yaml:
            in_yaml = False
            raw_yaml = "\n".join(yaml_lines)
            try:
                data = yaml.safe_load(raw_yaml) or {}
            except yaml.YAMLError as exc:
                log.warning(
                    "YAML parse error (section=%s): %s — falling back to regex extraction",
                    current_section, exc,
                )
                data = _extract_fields_by_regex(raw_yaml)

            if not isinstance(data, dict):
                yaml_lines = []
                continue

            # Determine section ID
            if current_section and not heading_consumed:
                section_id = current_section
                heading_consumed = True
            else:
                # Orphaned block: infer next sequential ID
                section_id = _next_sequential_id(last_emitted_id)
                log.debug("Orphaned YAML block assigned section_id=%s", section_id)

            blocks.append((section_id, data))
            last_emitted_id = section_id
            yaml_lines = []
            continue

        if in_yaml:
            yaml_lines.append(line)

    return blocks


def extract_rm_resonances(repo_root: str) -> list[dict[str, Any]]:
    """
    Parse RM_v2_0.md and return one dict per signal-pair resonance matching
    the l25_rm_resonances schema.

    Each RM element block contributes C(n,2) pairs from its msr_anchors list.
    Blocks with fewer than 2 distinct, valid anchors produce no rows.

    Uniqueness:
        (signal_a_id, signal_b_id, resonance_type) must be unique across rows.
        Duplicate pairs (same type, second occurrence) are skipped with a warning.
        Self-pairs (signal_a == signal_b after normalization) are skipped silently.

    Args:
        repo_root: Absolute path to the repository root.

    Returns:
        List of dicts, one per resonance pair.  Always len > 0.

    Raises:
        FileNotFoundError: If RM_v2_0.md is not found at expected path.
        ValueError: If zero pairs are extracted (parse failure guard).
    """
    rm_path = Path(repo_root) / SOURCE_FILE
    if not rm_path.exists():
        raise FileNotFoundError(f"RM_v2_0.md not found at {rm_path}")

    text = rm_path.read_text(encoding="utf-8")
    blocks = _parse_rm_blocks(text)
    log.info("rm_extractor: parsed %d element blocks from %s", len(blocks), SOURCE_FILE)

    rows: list[dict[str, Any]] = []
    # Dedup key: (signal_a_id, signal_b_id, resonance_type)
    seen: set[tuple[str, str, str]] = set()

    for section_id, data in blocks:
        raw_anchors = data.get("msr_anchors") or []
        if isinstance(raw_anchors, str):
            # Single anchor as string (rare but defensive)
            raw_anchors = [raw_anchors]

        # Normalize anchors; drop invalid
        anchors: list[str] = []
        for raw in raw_anchors:
            norm = _normalize_anchor(str(raw))
            if norm:
                anchors.append(norm)
            else:
                log.debug("section=%s: could not normalize anchor %r — skipping", section_id, raw)

        # Remove duplicates while preserving order
        seen_anchors: set[str] = set()
        unique_anchors: list[str] = []
        for a in anchors:
            if a not in seen_anchors:
                seen_anchors.add(a)
                unique_anchors.append(a)

        if len(unique_anchors) < 2:
            log.debug(
                "section=%s: only %d unique anchor(s) — no pairs to emit",
                section_id, len(unique_anchors),
            )
            continue

        net_resonance = str(data.get("net_resonance") or "")
        resonance_type = _derive_resonance_type(net_resonance)
        strength = _derive_strength(net_resonance)
        theme = str(data.get("element") or "").strip() or None
        notes_raw = data.get("interpretive_note")
        notes = str(notes_raw).strip() if notes_raw else None

        for sig_a, sig_b in itertools.combinations(unique_anchors, 2):
            # Skip self-pairs (should not occur after dedup, but be defensive)
            if sig_a == sig_b:
                log.debug("section=%s: self-pair %s skipped", section_id, sig_a)
                continue

            dedup_key = (sig_a, sig_b, resonance_type)
            if dedup_key in seen:
                log.warning(
                    "section=%s: duplicate pair (%s, %s, %s) already emitted — skipping",
                    section_id, sig_a, sig_b, resonance_type,
                )
                continue
            seen.add(dedup_key)

            # resonance_id: 'RM.01.SIG.MSR.413.SIG.MSR.190'
            resonance_id = f"{section_id}.{sig_a}.{sig_b}"

            rows.append({
                "resonance_id": resonance_id,
                "signal_a_id": sig_a,
                "signal_b_id": sig_b,
                "resonance_type": resonance_type,
                "strength": strength,
                "theme": theme,
                "notes": notes,
                "source_section": section_id,
                "build_id": "",  # filled in by writer
            })

    if not rows:
        raise ValueError(
            "rm_extractor: extracted 0 resonance pairs from RM_v2_0.md. "
            "Check parse logic or source file structure."
        )

    log.info("rm_extractor: extracted %d resonance pairs from %d blocks", len(rows), len(blocks))
    return rows
