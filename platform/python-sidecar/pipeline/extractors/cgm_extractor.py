"""
pipeline.extractors.cgm_extractor — Extract CGM nodes and edges.
Phase 14D Stream E / RETRIEVAL_11C_a.

Two-pass extraction:
  Pass 1 — Nodes: parse CGM_v9_0.md via _parse_nodes / _parse_node_properties,
           then merge UCN section nodes (UCN.SEC.*) and aux KARAKA node so the
           full set covers all edge-manifest targets (resolves 105 orphan edges).
  Pass 2 — Edges: inline 'edges:' blocks in CGM_v9_0.md + 3 manifest JSON files.
           All edges stored with status field: 'valid' | 'orphan' | 'self_loop'.
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

_EDGE_MANIFEST_PATHS = [
    "035_DISCOVERY_LAYER/cgm_edges_manifest_v1_0.json",
    "035_DISCOVERY_LAYER/cgm_supports_edges_manifest_v1_0.json",
    "035_DISCOVERY_LAYER/cgm_contradicts_edges_manifest_v1_0.json",
]

_SLUG_RE = re.compile(r"[^A-Za-z0-9_.→\-]")

# Auxiliary CGM nodes referenced by edge manifests but absent from CGM_v9_0.md.
# KARAKA.DUAL_SYSTEM_DIVERGENCE is the target of 4 CONTRADICTS edges (B4_contradicts batch).
_AUX_CGM_NODES: list[dict[str, Any]] = [
    {
        "node_id": "KARAKA.DUAL_SYSTEM_DIVERGENCE",
        "node_type": "KARAKA_META",
        "display_name": "Karaka Dual-System Divergence",
        "properties": {
            "concept_class": "contradiction_target",
            "conflict_type": "rahu_as_pk",
            "axis": "7-karaka system vs 8-karaka system",
            "description": (
                "Meta-concept node representing the 7-karaka vs 8-karaka system "
                "divergence in the chart. CONTRADICTS edges from MSR signals point "
                "here when the signal's correctness depends on which karaka system "
                "is canonical. Resolution: chart-wide karaka system must be locked "
                "(see edge manifest steelman_reconciliation_excerpt fields)."
            ),
            "referenced_signals": ["SIG.MSR.226", "SIG.MSR.320", "SIG.MSR.321", "SIG.MSR.432"],
            "source_layer": "L2.5_meta",
        },
        "source_section": "035_DISCOVERY_LAYER/cgm_contradicts_edges_manifest_v1_0.json",
    },
]


def _slugify_edge_id(source: str, target: str, edge_type: str) -> str:
    """Build a unique, printable edge_id slug."""
    raw = f"{source}→{target}→{edge_type}"
    return _SLUG_RE.sub("_", raw)


def extract_ucn_section_nodes(repo_root: str) -> list[dict[str, Any]]:
    """
    Return UCN section nodes in l25_cgm_nodes schema with node_id prefix "UCN.SEC.".

    Calls extract_ucn_sections and transforms each section_id from "UCN.X" to "UCN.SEC.X".
    Deduplicates by node_id (first occurrence wins) to handle the source document's
    additive revision layers that reuse the same part numerals.

    Returns ≥80 node dicts. Raises ValueError on failure.
    """
    from pipeline.extractors.ucn_extractor import extract_ucn_sections

    sections = extract_ucn_sections(repo_root)
    rows: list[dict[str, Any]] = []

    for section in sections:
        node_id = section["section_id"].replace("UCN.", "UCN.SEC.", 1)
        rows.append({
            "node_id": node_id,
            "node_type": "UCN_SECTION",
            "display_name": section["title"],
            "properties": {
                "domain": section.get("domain"),
                "parent_section_id": section.get("parent_section_id"),
                "derived_from_signals": section.get("derived_from_signals", []),
                "content_excerpt": section["content"][:500],
                "source_layer": "L2.5",
            },
            "source_section": section.get("source_lines", "UCN_v4_0"),
        })

    bad_ids = [r["node_id"] for r in rows if not r["node_id"].startswith("UCN.SEC.")]
    if bad_ids:
        raise ValueError(
            "extract_ucn_section_nodes: node_ids without UCN.SEC. prefix: " + str(bad_ids[:5])
        )

    # Deduplicate by node_id: UCN_v4_0.md has additive revision sections sharing the same
    # part numeral (e.g. multiple §I layers), which would cause DB primary-key violations.
    seen: set[str] = set()
    deduped: list[dict[str, Any]] = []
    for r in rows:
        if r["node_id"] not in seen:
            seen.add(r["node_id"])
            deduped.append(r)
    rows = deduped

    if len(rows) < 80:
        raise ValueError(
            f"extract_ucn_section_nodes produced only {len(rows)} nodes (expected ≥80). "
            "Check UCN_v4_0.md parse."
        )

    log.info("cgm_extractor: extracted %d UCN section nodes", len(rows))
    return rows


def extract_aux_cgm_nodes(_repo_root: str) -> list[dict[str, Any]]:
    """Return small aux CGM nodes that don't have a natural source file."""
    return list(_AUX_CGM_NODES)


def extract_cgm_nodes(repo_root: str) -> list[dict[str, Any]]:
    """
    Parse CGM_v9_0.md and return one dict per node matching l25_cgm_nodes schema.

    Merges UCN section nodes (UCN.SEC.*) and auxiliary meta-concept nodes so that
    the full set covers all edge-manifest targets (Path I — no orchestrator changes).

    Returns:
        List of node dicts (10 ≤ count ≤ 5000).

    Raises:
        FileNotFoundError: If CGM_v9_0.md is not found.
        ValueError: If count is outside [10, 5000] or a node_id collision is detected.
    """
    cgm_path = Path(repo_root) / SOURCE_FILE
    if not cgm_path.exists():
        raise FileNotFoundError(f"CGM_v9_0.md not found at {cgm_path}")

    text = cgm_path.read_text(encoding="utf-8")
    raw_nodes = _parse_nodes(text)

    rows: list[dict[str, Any]] = []
    for node_id, block in raw_nodes:
        props = _parse_node_properties(block)
        props_for_storage = {k: v for k, v in props.items() if k != "edges"}
        display_name = str(props.get("node_label", props.get("label", node_id)))
        rows.append({
            "node_id": node_id,
            "node_type": str(props.get("node_type", "unknown")),
            "display_name": display_name,
            "properties": props_for_storage,
            "source_section": f"CGM_v9_0 §{node_id}",
        })

    # Merge UCN section nodes and aux nodes (Path I — no orchestrator change).
    ucn_rows = extract_ucn_section_nodes(repo_root)
    aux_rows = extract_aux_cgm_nodes(repo_root)

    existing_ids = {r["node_id"] for r in rows}
    for new_row in ucn_rows + aux_rows:
        if new_row["node_id"] in existing_ids:
            raise ValueError(
                f"node_id collision detected: {new_row['node_id']} "
                "already in CGM_v9_0 nodes — refusing to overwrite."
            )

    rows.extend(ucn_rows)
    rows.extend(aux_rows)

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
    Extract CGM edges from two sources:
      1. Inline 'edges:' blocks within each CGM_v9_0.md node YAML block.
      2. Validated edge manifest JSON files in 035_DISCOVERY_LAYER/.

    All edges are stored with status='valid'|'orphan'|'self_loop'.
    Callers should pass node_ids from extract_cgm_nodes (merged set) to resolve orphans.

    Returns:
        List of edge dicts matching l25_cgm_edges schema (count > 0).

    Raises:
        FileNotFoundError: If CGM_v9_0.md is not found.
        ValueError: If edge count is zero.
    """
    cgm_path = Path(repo_root) / SOURCE_FILE
    if not cgm_path.exists():
        raise FileNotFoundError(f"CGM_v9_0.md not found at {cgm_path}")

    text = cgm_path.read_text(encoding="utf-8")
    raw_nodes = _parse_nodes(text)

    if node_ids is None:
        node_ids = {nid for nid, _ in raw_nodes}

    candidate_rows: list[dict[str, Any]] = []

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

        for edge in manifest.get("edges", []):
            if not isinstance(edge, dict):
                continue
            raw_edge_id = edge.get("edge_id") or ""
            source = edge.get("source_node_id", "")
            target = edge.get("target_node_id", "")
            edge_type = edge.get("edge_type", "UNKNOWN")
            slug = _slugify_edge_id(source, target, edge_type)
            dedup_key = raw_edge_id if raw_edge_id and raw_edge_id not in seen_edge_ids else slug
            if dedup_key in seen_edge_ids:
                continue
            seen_edge_ids.add(dedup_key)

            strength_raw = edge.get("strength") or edge.get("confidence_prior")
            strength = float(strength_raw) if isinstance(strength_raw, (int, float)) else None
            notes = edge.get("notes") or edge.get("l1_derivation") or None
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

    for row in candidate_rows:
        if row["source_node_id"] == row["target_node_id"]:
            row["status"] = "self_loop"
            row["orphan_reason"] = None
            log.warning(
                "cgm_extractor: self-loop edge %s (%s → %s) stored with status=self_loop",
                row["edge_id"], row["source_node_id"], row["target_node_id"],
            )
        elif row["target_node_id"] not in node_ids:
            row["status"] = "orphan"
            row["orphan_reason"] = f"target_not_in_cgm_nodes: {row['target_node_id']}"
            log.warning(
                "cgm_extractor: orphan edge %s (target %r) stored with status=orphan",
                row["edge_id"], row["target_node_id"],
            )
        else:
            row["status"] = "valid"
            row["orphan_reason"] = None

    orphan_count = sum(1 for r in candidate_rows if r["status"] == "orphan")
    if candidate_rows and (orphan_count / len(candidate_rows)) > 0.05:
        log.warning(
            "cgm_extractor: orphan rate %.1f%% exceeds 5%% threshold",
            100.0 * orphan_count / len(candidate_rows),
        )

    if not candidate_rows:
        raise ValueError("CGM edge count is 0 — all manifests are empty. Check manifest files.")

    by_status: dict[str, int] = {}
    for r in candidate_rows:
        by_status[r["status"]] = by_status.get(r["status"], 0) + 1
    log.info("cgm_extractor: extracted %d edges — %s", len(candidate_rows), by_status)
    return candidate_rows
