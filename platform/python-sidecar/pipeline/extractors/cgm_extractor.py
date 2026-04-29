"""
pipeline.extractors.cgm_extractor — Extract CGM nodes and edges.
Phase 14D Stream E.

Two-pass extraction:
  Pass 1 — Nodes: parse CGM_v9_0.md via _parse_nodes / _parse_node_properties.
  Pass 2 — Edges: first collect any inline 'edges:' blocks from node YAML props;
           then supplement from the three manifest JSON files in 035_DISCOVERY_LAYER/.
           Orphan edges (target not in known node_ids) are dropped with a WARNING.
           If drop count > 5% of total edges, logs WARNING but does not raise.
"""
from __future__ import annotations

import json
import logging
import re
from pathlib import Path
from typing import Any

from rag.chunkers.cgm_node import _parse_node_properties, _parse_nodes

log = logging.getLogger(__name__)

SOURCE_FILE = "025_HOLISTIC_SYNTHESIS/CGM_v9_0.md"

# Manifest files that carry validated edge records (in order of precedence)
_EDGE_MANIFEST_PATHS = [
    "035_DISCOVERY_LAYER/cgm_edges_manifest_v1_0.json",
    "035_DISCOVERY_LAYER/cgm_supports_edges_manifest_v1_0.json",
    "035_DISCOVERY_LAYER/cgm_contradicts_edges_manifest_v1_0.json",
]

_SLUG_RE = re.compile(r"[^A-Za-z0-9_.→\-]")


def _slugify_edge_id(source: str, target: str, edge_type: str) -> str:
    """Build a unique, printable edge_id slug."""
    raw = f"{source}→{target}→{edge_type}"
    return _SLUG_RE.sub("_", raw)


def extract_cgm_nodes(repo_root: str) -> list[dict[str, Any]]:
    """
    Parse CGM_v9_0.md and return one dict per node matching l25_cgm_nodes schema.

    Args:
        repo_root: Absolute path to the repository root.

    Returns:
        List of node dicts (10 ≤ count ≤ 5000).

    Raises:
        FileNotFoundError: If CGM_v9_0.md is not found.
        ValueError: If node count is outside [10, 5000].
    """
    cgm_path = Path(repo_root) / SOURCE_FILE
    if not cgm_path.exists():
        raise FileNotFoundError(f"CGM_v9_0.md not found at {cgm_path}")

    text = cgm_path.read_text(encoding="utf-8")
    raw_nodes = _parse_nodes(text)

    rows: list[dict[str, Any]] = []
    for node_id, block in raw_nodes:
        props = _parse_node_properties(block)

        # Remove 'edges' key from properties before storing
        props_for_storage = {k: v for k, v in props.items() if k != "edges"}

        display_name = str(
            props.get("node_label", props.get("label", node_id))
        )

        row: dict[str, Any] = {
            "node_id": node_id,
            "node_type": str(props.get("node_type", "unknown")),
            "display_name": display_name,
            "properties": props_for_storage,
            "source_section": f"CGM_v9_0 §{node_id}",
        }
        rows.append(row)

    count = len(rows)
    if count < 10 or count > 5000:
        raise ValueError(
            f"CGM node count {count} is outside valid range [10, 5000]. "
            "Check CGM_v9_0.md parse."
        )

    log.info("cgm_extractor: extracted %d nodes", count)
    return rows


def extract_cgm_edges(
    repo_root: str,
    node_ids: set[str] | None = None,
) -> list[dict[str, Any]]:
    """
    Extract CGM edges from two sources (in order):
      1. Inline 'edges:' blocks within each CGM_v9_0.md node YAML block.
      2. Validated edge manifest JSON files in 035_DISCOVERY_LAYER/.

    Orphan edges (target_node_id not in known node_ids) are dropped with a WARNING.
    If the drop count exceeds 5% of total pre-filter edges, an additional WARNING is logged
    but extraction continues.

    Args:
        repo_root: Absolute path to the repository root.
        node_ids: Optional set of valid node_ids for orphan filtering. If None, the
                  set is derived by parsing CGM_v9_0.md internally.

    Returns:
        List of edge dicts matching l25_cgm_edges schema (count > 0).

    Raises:
        FileNotFoundError: If CGM_v9_0.md is not found.
        ValueError: If edge count after filtering is zero.
    """
    cgm_path = Path(repo_root) / SOURCE_FILE
    if not cgm_path.exists():
        raise FileNotFoundError(f"CGM_v9_0.md not found at {cgm_path}")

    # Build known node_ids if not supplied
    if node_ids is None:
        text = cgm_path.read_text(encoding="utf-8")
        raw_nodes = _parse_nodes(text)
        node_ids = {nid for nid, _ in raw_nodes}

    # --- Pass 2a: inline edges from node YAML blocks ---
    candidate_rows: list[dict[str, Any]] = []
    text = cgm_path.read_text(encoding="utf-8")
    raw_nodes = _parse_nodes(text)

    for source_node_id, block in raw_nodes:
        props = _parse_node_properties(block)
        inline_edges = props.get("edges", [])
        if not isinstance(inline_edges, list):
            continue
        for edge in inline_edges:
            if not isinstance(edge, dict):
                continue
            target = edge.get("target", edge.get("target_node_id"))
            if not target:
                continue
            edge_type = edge.get("edge_type", edge.get("type", "UNKNOWN"))
            strength_raw = edge.get("strength")
            strength = float(strength_raw) if strength_raw is not None else None
            notes = edge.get("notes") or None
            edge_id = _slugify_edge_id(source_node_id, str(target), edge_type)
            candidate_rows.append({
                "edge_id": edge_id,
                "source_node_id": source_node_id,
                "target_node_id": str(target),
                "edge_type": edge_type,
                "strength": strength,
                "notes": notes,
                "source_section": f"CGM_v9_0 §{source_node_id}.edges",
            })

    # --- Pass 2b: manifest JSON files ---
    seen_edge_ids: set[str] = {r["edge_id"] for r in candidate_rows}
    for rel_path in _EDGE_MANIFEST_PATHS:
        manifest_path = Path(repo_root) / rel_path
        if not manifest_path.exists():
            log.warning("cgm_extractor: edge manifest not found: %s", manifest_path)
            continue
        try:
            with manifest_path.open(encoding="utf-8") as fh:
                manifest = json.load(fh)
        except (json.JSONDecodeError, OSError) as exc:
            log.warning("cgm_extractor: failed to load edge manifest %s: %s", manifest_path, exc)
            continue

        edges_list = manifest.get("edges", [])
        for edge in edges_list:
            if not isinstance(edge, dict):
                continue
            raw_edge_id = edge.get("edge_id") or ""
            source = edge.get("source_node_id", "")
            target = edge.get("target_node_id", "")
            edge_type = edge.get("edge_type", "UNKNOWN")

            # Build a canonical slug for de-duplication
            slug = _slugify_edge_id(source, target, edge_type)
            # Prefer the manifest's own edge_id if unique; fall back to slug
            dedup_key = raw_edge_id if raw_edge_id and raw_edge_id not in seen_edge_ids else slug

            if dedup_key in seen_edge_ids:
                continue
            seen_edge_ids.add(dedup_key)

            strength_raw = edge.get("strength") or edge.get("confidence_prior")
            # confidence_prior is a string label (HIGH/MED/LOW) — don't cast to float
            if isinstance(strength_raw, (int, float)):
                strength: float | None = float(strength_raw)
            else:
                strength = None

            notes = edge.get("notes") or edge.get("l1_derivation") or None

            # Determine source_section: use the manifest's section fields if present
            source_section = (
                edge.get("source_section")
                or edge.get("l1_source_section")
                or f"CGM_v9_0 §{source}.edges"
            )

            candidate_rows.append({
                "edge_id": dedup_key,
                "source_node_id": source,
                "target_node_id": target,
                "edge_type": edge_type,
                "strength": strength,
                "notes": notes,
                "source_section": source_section,
            })

    total_before_filter = len(candidate_rows)

    # --- Orphan filtering ---
    filtered_rows: list[dict[str, Any]] = []
    dropped = 0
    for row in candidate_rows:
        if row["target_node_id"] not in node_ids:
            log.warning(
                "cgm_extractor: dropping orphan edge %s (target %r not in node set)",
                row["edge_id"],
                row["target_node_id"],
            )
            dropped += 1
        else:
            filtered_rows.append(row)

    if dropped > 0:
        log.warning("cgm_extractor: dropped %d orphan edges (total before filter: %d)", dropped, total_before_filter)
        if total_before_filter > 0 and (dropped / total_before_filter) > 0.05:
            log.warning(
                "cgm_extractor: orphan drop rate %.1f%% exceeds 5%% threshold — check edge manifests",
                100.0 * dropped / total_before_filter,
            )

    # --- Self-loop filtering ---
    # Self-referential edges (source == target) are valid astrological facts in the
    # manifest (e.g. Venus in Purva Ashadha is its own nakshatra lord) but must not
    # be surfaced to callers; graph algorithms and S5 of the spec both forbid them.
    non_loop_rows: list[dict[str, Any]] = []
    dropped_loops = 0
    for row in filtered_rows:
        if row["source_node_id"] == row["target_node_id"]:
            log.warning(
                "cgm_extractor: dropping self-loop edge %s (%s → %s, type=%s)",
                row["edge_id"],
                row["source_node_id"],
                row["target_node_id"],
                row["edge_type"],
            )
            dropped_loops += 1
        else:
            non_loop_rows.append(row)

    if dropped_loops > 0:
        log.warning(
            "cgm_extractor: dropped %d self-loop edge(s) after orphan filter",
            dropped_loops,
        )

    count = len(non_loop_rows)
    if count == 0:
        raise ValueError(
            "CGM edge count is 0 after orphan + self-loop filtering. "
            "Check CGM_v9_0.md node blocks and edge manifest files."
        )

    log.info(
        "cgm_extractor: extracted %d edges (%d dropped as orphans, %d dropped as self-loops)",
        count,
        dropped,
        dropped_loops,
    )
    return non_loop_rows
