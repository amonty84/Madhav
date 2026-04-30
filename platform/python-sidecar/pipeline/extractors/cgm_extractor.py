"""
pipeline.extractors.cgm_extractor — Extract CGM nodes and edges.
KARN-W2-R3-CGM-FULL-EDGES: expanded to derive all 15 edge types from node properties.

Two-pass extraction:
  Pass 1 — Nodes: parse CGM_v9_0.md via _parse_nodes / _parse_node_properties,
           then merge UCN section nodes (UCN.SEC.*) and aux KARAKA node so the
           full set covers all edge-manifest targets.
  Pass 2 — Edges: 15 parser functions, each deriving edges from CGM node properties.
           No manifest loading. All edges status='valid' (orphan check validates both
           source AND target before emitting any edge).
"""
from __future__ import annotations

import logging
import re
from pathlib import Path
from typing import Any

from rag.chunkers.cgm_node import _parse_node_properties, _parse_nodes

log = logging.getLogger(__name__)

SOURCE_FILE = "025_HOLISTIC_SYNTHESIS/CGM_v9_0.md"

_SLUG_RE = re.compile(r"[^A-Za-z0-9_.→\-]")
# Pattern to detect CGM node ID references in free text (node-ID format)
_CGM_NODE_RE = re.compile(
    r"\b(PLN|HSE|SGN|NAK|YGA|YOG|KRK|DVS|DSH|SEN)\.[A-Z0-9_.]+\b"
)
# Planet name → PLN node ID for narrative-text matching in UCN sections
_PLANET_NAME_TO_NODE: dict[str, str] = {
    "Mercury": "PLN.MERCURY",
    "Saturn":  "PLN.SATURN",
    "Jupiter": "PLN.JUPITER",
    "Mars":    "PLN.MARS",
    "Venus":   "PLN.VENUS",
    "Moon":    "PLN.MOON",
    "Sun":     "PLN.SUN",
    "Rahu":    "PLN.RAHU",
    "Ketu":    "PLN.KETU",
}
_PLANET_NAME_RE = re.compile(
    r"\b(" + "|".join(_PLANET_NAME_TO_NODE.keys()) + r")\b"
)

# Auxiliary CGM nodes referenced by edge derivations but absent from CGM_v9_0.md.
# KARAKA.DUAL_SYSTEM_DIVERGENCE is the target of 4 DUAL_SYSTEM_DIVERGENCE edges.
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
                "divergence in the chart. DUAL_SYSTEM_DIVERGENCE edges from KRK "
                "nodes point here when the node's validity depends on which karaka "
                "system is canonical. GAP.13 resolved: 8-karaka is canonical."
            ),
            "source_layer": "L2.5_meta",
        },
        "source_section": "CGM_v9_0 §KRK-system-divergence",
    },
]

# Parashari special aspect offsets: planet → list of extra aspect house offsets
# (7th is universal for all, so only the special offsets are listed here)
_SPECIAL_ASPECTS: dict[str, list[int]] = {
    "PLN.JUPITER": [5, 9],
    "PLN.SATURN":  [3, 10],
    "PLN.MARS":    [4, 8],
    "PLN.RAHU":    [5, 9],
    "PLN.KETU":    [5, 9],
}

# Traditional malefics for AFFLICTS derivation
_MALEFICS = frozenset({"PLN.SUN", "PLN.MARS", "PLN.SATURN", "PLN.RAHU", "PLN.KETU"})
# Natural benefics for SUPPORTS derivation
_BENEFICS = frozenset({"PLN.JUPITER", "PLN.VENUS", "PLN.MERCURY", "PLN.MOON"})

# Sign name → lord mapping (canonical Parashari)
_SIGN_LORD: dict[str, str] = {
    "Aries":       "PLN.MARS",
    "Taurus":      "PLN.VENUS",
    "Gemini":      "PLN.MERCURY",
    "Cancer":      "PLN.MOON",
    "Leo":         "PLN.SUN",
    "Virgo":       "PLN.MERCURY",
    "Libra":       "PLN.VENUS",
    "Scorpio":     "PLN.MARS",
    "Sagittarius": "PLN.JUPITER",
    "Capricorn":   "PLN.SATURN",
    "Aquarius":    "PLN.SATURN",
    "Pisces":      "PLN.JUPITER",
}

# Jaimini Chara MD sign → planet lord
_CHARA_SIGN_LORD = _SIGN_LORD  # same mapping


def _slugify_edge_id(source: str, target: str, edge_type: str) -> str:
    raw = f"{source}→{target}→{edge_type}"
    return _SLUG_RE.sub("_", raw)


def _make_edge(
    source: str,
    target: str,
    edge_type: str,
    strength: float | None,
    notes: str | None,
    source_section: str,
    node_ids: set[str],
) -> dict[str, Any] | None:
    """Build a validated edge dict, returning None if source or target is missing."""
    if source not in node_ids:
        log.debug("cgm_extractor: skipping edge %s→%s (source not in node catalog)", source, target)
        return None
    if target not in node_ids:
        log.debug("cgm_extractor: skipping edge %s→%s (target not in node catalog)", source, target)
        return None
    if source == target:
        return None
    edge_id = _slugify_edge_id(source, target, edge_type)
    return {
        "edge_id": edge_id,
        "source_node_id": source,
        "target_node_id": target,
        "edge_type": edge_type,
        "strength": strength,
        "notes": notes,
        "source_section": source_section,
        "status": "valid",
        "orphan_reason": None,
    }


# ---------------------------------------------------------------------------
# Node extraction (unchanged from Phase 14D implementation)
# ---------------------------------------------------------------------------

def extract_ucn_section_nodes(repo_root: str) -> list[dict[str, Any]]:
    """Return UCN section nodes in l25_cgm_nodes schema (node_id prefix UCN.SEC.)."""
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
    return list(_AUX_CGM_NODES)


def extract_cgm_nodes(repo_root: str) -> list[dict[str, Any]]:
    """
    Parse CGM_v9_0.md and return one dict per node matching l25_cgm_nodes schema.
    Merges UCN section nodes (UCN.SEC.*) and auxiliary meta-concept nodes.
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


# ---------------------------------------------------------------------------
# Edge type parsers — one function per edge_type
# ---------------------------------------------------------------------------

def _parse_rules_over(
    nodes_by_id: dict[str, dict[str, Any]], node_ids: set[str]
) -> list[dict[str, Any]]:
    """HSE.X.lord → RULES_OVER → HSE.X (12 edges, one per house)."""
    edges: list[dict[str, Any]] = []
    for node_id, props in nodes_by_id.items():
        if props.get("node_type") != "HSE":
            continue
        lord = props.get("lord")
        if not lord or not isinstance(lord, str):
            continue
        e = _make_edge(
            lord, node_id, "RULES_OVER", 0.95,
            f"Parashari house lordship: {lord} is the lord of {node_id}",
            f"CGM_v9_0 §{node_id}.lord",
            node_ids,
        )
        if e:
            edges.append(e)
    return edges


def _parse_disposes(
    nodes_by_id: dict[str, dict[str, Any]], node_ids: set[str]
) -> list[dict[str, Any]]:
    """SGN.X.lord → DISPOSES → SGN.X (12 edges, sign lordship)."""
    edges: list[dict[str, Any]] = []
    for node_id, props in nodes_by_id.items():
        if props.get("node_type") != "SGN":
            continue
        lord = props.get("lord")
        if not lord or not isinstance(lord, str):
            continue
        e = _make_edge(
            lord, node_id, "DISPOSES", 0.90,
            f"Parashari sign lordship: {lord} disposes {node_id}",
            f"CGM_v9_0 §{node_id}.lord",
            node_ids,
        )
        if e:
            edges.append(e)
    return edges


def _parse_nakshatra_of(
    nodes_by_id: dict[str, dict[str, Any]], node_ids: set[str]
) -> list[dict[str, Any]]:
    """PLN.X (lord of NAK.Y) → NAKSHATRA_OF → NAK.Y (15 edges)."""
    edges: list[dict[str, Any]] = []
    for node_id, props in nodes_by_id.items():
        if props.get("node_type") != "NAK":
            continue
        lord = props.get("lord")
        if not lord or not isinstance(lord, str):
            continue
        e = _make_edge(
            lord, node_id, "NAKSHATRA_OF", 0.85,
            f"Nakshatra lordship: {lord} is the nakshatra lord of {node_id}",
            f"CGM_v9_0 §{node_id}.lord",
            node_ids,
        )
        if e:
            edges.append(e)
    return edges


def _parse_karaka_of(
    nodes_by_id: dict[str, dict[str, Any]], node_ids: set[str]
) -> list[dict[str, Any]]:
    """PLN.X → KARAKA_OF → KRK.Y (18 edges, one per KRK node)."""
    edges: list[dict[str, Any]] = []
    for node_id, props in nodes_by_id.items():
        if props.get("node_type") != "KRK":
            continue
        planet = props.get("planet")
        if not planet or not isinstance(planet, str):
            continue
        ksys = props.get("karaka_system", "")
        e = _make_edge(
            planet, node_id, "KARAKA_OF", 0.90,
            f"Karaka assignment: {planet} is karaka in system={ksys}, role={props.get('karaka_role')}",
            f"CGM_v9_0 §{node_id}.planet",
            node_ids,
        )
        if e:
            edges.append(e)
    return edges


def _parse_conjunct(
    nodes_by_id: dict[str, dict[str, Any]], node_ids: set[str]
) -> list[dict[str, Any]]:
    """Bidirectional CONJUNCT edges for planets sharing the same house (tenants list)."""
    edges: list[dict[str, Any]] = []
    seen: set[frozenset[str]] = set()
    for node_id, props in nodes_by_id.items():
        if props.get("node_type") != "HSE":
            continue
        tenants_raw = props.get("tenants", [])
        if not isinstance(tenants_raw, list):
            continue
        tenants = [t for t in tenants_raw if isinstance(t, str) and t.startswith("PLN.")]
        if len(tenants) < 2:
            continue
        for i, p1 in enumerate(tenants):
            for p2 in tenants[i + 1:]:
                pair = frozenset({p1, p2})
                if pair in seen:
                    continue
                seen.add(pair)
                note = f"Conjunct in {node_id} (same rashi co-tenancy)"
                for src, tgt in [(p1, p2), (p2, p1)]:
                    e = _make_edge(src, tgt, "CONJUNCT", 0.85, note,
                                   f"CGM_v9_0 §{node_id}.tenants", node_ids)
                    if e:
                        edges.append(e)
    return edges


def _parse_dasha_gives(
    nodes_by_id: dict[str, dict[str, Any]], node_ids: set[str]
) -> list[dict[str, Any]]:
    """DSH.X → DASHA_GIVES → PLN.Y (30 edges, one per DSH node)."""
    edges: list[dict[str, Any]] = []
    for node_id, props in nodes_by_id.items():
        if props.get("node_type") != "DSH":
            continue
        # Vimshottari MD and Yogini: direct `planet` field
        planet = props.get("planet")
        if planet and isinstance(planet, str) and planet.startswith("PLN."):
            e = _make_edge(
                node_id, planet, "DASHA_GIVES", 0.90,
                f"Dasha activation: {node_id} activates {planet} as dasha lord",
                f"CGM_v9_0 §{node_id}.planet",
                node_ids,
            )
            if e:
                edges.append(e)
            continue
        # Vimshottari AD: use md_planet (primary dasha lord association)
        md_planet = props.get("md_planet")
        if md_planet and isinstance(md_planet, str) and md_planet.startswith("PLN."):
            e = _make_edge(
                node_id, md_planet, "DASHA_GIVES", 0.85,
                f"Antardasha operating within {md_planet} mahadasha",
                f"CGM_v9_0 §{node_id}.md_planet",
                node_ids,
            )
            if e:
                edges.append(e)
            continue
        # Jaimini Chara: derive planet from md_sign
        md_sign = props.get("md_sign")
        if md_sign and isinstance(md_sign, str):
            lord = _CHARA_SIGN_LORD.get(md_sign)
            if lord:
                e = _make_edge(
                    node_id, lord, "DASHA_GIVES", 0.80,
                    f"Jaimini Chara MD {md_sign} → lord {lord}",
                    f"CGM_v9_0 §{node_id}.md_sign",
                    node_ids,
                )
                if e:
                    edges.append(e)
    return edges


def _parse_aspects(
    nodes_by_id: dict[str, dict[str, Any]], node_ids: set[str]
) -> list[dict[str, Any]]:
    """PLN.X → ASPECTS → HSE.Y using Parashari graha drishti (19 edges)."""
    edges: list[dict[str, Any]] = []
    for node_id, props in nodes_by_id.items():
        if props.get("node_type") != "PLN":
            continue
        house_num = props.get("house_rashi")
        if not isinstance(house_num, int):
            continue
        # Universal 7th aspect
        offsets = [7] + _SPECIAL_ASPECTS.get(node_id, [])
        for offset in offsets:
            target_house = ((house_num - 1 + offset - 1) % 12) + 1
            target_node = f"HSE.{target_house}"
            # Skip self-aspect (shouldn't happen with 7th offset from own house)
            if target_node == f"HSE.{house_num}":
                continue
            e = _make_edge(
                node_id, target_node, "ASPECTS", 0.80,
                f"Parashari drishti: {node_id} in H{house_num} casts {offset}th aspect on H{target_house}",
                f"CGM_v9_0 §{node_id}.house_rashi + RM_v2_0 §0",
                node_ids,
            )
            if e:
                edges.append(e)
    return edges


def _parse_afflicts(
    nodes_by_id: dict[str, dict[str, Any]], node_ids: set[str]
) -> list[dict[str, Any]]:
    """Malefic PLN → AFFLICTS → tenant PLN in aspected house."""
    # Build house→tenants lookup
    house_tenants: dict[int, list[str]] = {}
    for node_id, props in nodes_by_id.items():
        if props.get("node_type") != "HSE":
            continue
        try:
            hnum = int(node_id.split(".")[-1])
        except ValueError:
            continue
        tenants_raw = props.get("tenants", [])
        if isinstance(tenants_raw, list):
            house_tenants[hnum] = [t for t in tenants_raw if isinstance(t, str) and t.startswith("PLN.")]

    edges: list[dict[str, Any]] = []
    for node_id, props in nodes_by_id.items():
        if node_id not in _MALEFICS or props.get("node_type") != "PLN":
            continue
        house_num = props.get("house_rashi")
        if not isinstance(house_num, int):
            continue
        offsets = [7] + _SPECIAL_ASPECTS.get(node_id, [])
        for offset in offsets:
            target_house = ((house_num - 1 + offset - 1) % 12) + 1
            for tenant in house_tenants.get(target_house, []):
                if tenant == node_id:
                    continue
                e = _make_edge(
                    node_id, tenant, "AFFLICTS", 0.70,
                    f"Malefic {node_id} casts {offset}th aspect on H{target_house}, afflicting tenant {tenant}",
                    f"CGM_v9_0 §{node_id}.house_rashi + §HSE.{target_house}.tenants",
                    node_ids,
                )
                if e:
                    edges.append(e)
    # Deduplicate (same pair can come from multiple offsets)
    seen: set[str] = set()
    deduped: list[dict[str, Any]] = []
    for e in edges:
        key = e["edge_id"]
        if key not in seen:
            seen.add(key)
            deduped.append(e)
    return deduped


def _parse_supports(
    nodes_by_id: dict[str, dict[str, Any]], node_ids: set[str]
) -> list[dict[str, Any]]:
    """Benefic PLN → SUPPORTS → conjunct PLN in same house (co-tenancy benefic pairs)."""
    edges: list[dict[str, Any]] = []
    seen: set[frozenset[str]] = set()
    for node_id, props in nodes_by_id.items():
        if props.get("node_type") != "HSE":
            continue
        tenants_raw = props.get("tenants", [])
        if not isinstance(tenants_raw, list):
            continue
        tenants = [t for t in tenants_raw if isinstance(t, str) and t.startswith("PLN.")]
        # Benefic → any conjunct planet SUPPORTS relationship
        for src in tenants:
            if src not in _BENEFICS:
                continue
            for tgt in tenants:
                if tgt == src:
                    continue
                pair = frozenset({src, tgt})
                if pair in seen:
                    continue
                seen.add(pair)
                e = _make_edge(
                    src, tgt, "SUPPORTS", 0.70,
                    f"Benefic {src} co-tenants with {tgt} in {node_id}, extending natural support",
                    f"CGM_v9_0 §{node_id}.tenants",
                    node_ids,
                )
                if e:
                    edges.append(e)
    return edges


def _parse_arudha_of(
    nodes_by_id: dict[str, dict[str, Any]], node_ids: set[str]
) -> list[dict[str, Any]]:
    """SEN.ARD.X → ARUDHA_OF → HSE.Y (12 edges, one per SEN.ARD node)."""
    edges: list[dict[str, Any]] = []
    for node_id, props in nodes_by_id.items():
        if props.get("node_type") != "SEN":
            continue
        if props.get("sen_class") != "arudha":
            continue
        house = props.get("house")
        if not isinstance(house, int):
            continue
        target = f"HSE.{house}"
        e = _make_edge(
            node_id, target, "ARUDHA_OF", 0.85,
            f"Arudha image: {node_id} ({props.get('arudha_type', '')}) falls in {target}",
            f"CGM_v9_0 §{node_id}.house",
            node_ids,
        )
        if e:
            edges.append(e)
    return edges


def _parse_co_occurs(
    nodes_by_id: dict[str, dict[str, Any]], node_ids: set[str]
) -> list[dict[str, Any]]:
    """
    CO_OCCURS edges from three sources:
      a. YGA.X.members → YGA node CO_OCCURS each member PLN
      b. DVS.X.planet → DVS node CO_OCCURS planet (skip lagna nodes)
      c. SEN.X.planet_ref or yogi_planet or avayogi_planet → SEN CO_OCCURS PLN
    """
    edges: list[dict[str, Any]] = []
    seen_ids: set[str] = set()

    def _add(src: str, tgt: str, note: str, section: str) -> None:
        e = _make_edge(src, tgt, "CO_OCCURS", 0.75, note, section, node_ids)
        if e and e["edge_id"] not in seen_ids:
            seen_ids.add(e["edge_id"])
            edges.append(e)

    # a. YGA members
    for node_id, props in nodes_by_id.items():
        if props.get("node_type") not in ("YOG", "YGA"):
            continue
        members_raw = props.get("members", [])
        if not isinstance(members_raw, list):
            continue
        for member in members_raw:
            if isinstance(member, str) and member.startswith("PLN."):
                _add(
                    node_id, member,
                    f"Yoga membership: {member} is a member of {node_id}",
                    f"CGM_v9_0 §{node_id}.members",
                )

    # b. DVS planet (skip lagna/hora position nodes)
    for node_id, props in nodes_by_id.items():
        if props.get("node_type") != "DVS":
            continue
        planet = props.get("planet")
        if not isinstance(planet, str) or not planet.startswith("PLN."):
            continue
        pos_type = props.get("position_type", "")
        if pos_type in ("lagna", "lagna_hora", "moon_hora"):
            continue
        _add(
            node_id, planet,
            f"Divisional position: {planet} placed in {node_id} ({props.get('varga', '')})",
            f"CGM_v9_0 §{node_id}.planet",
        )

    # c. SEN planet references
    for node_id, props in nodes_by_id.items():
        if props.get("node_type") != "SEN":
            continue
        for field in ("planet_ref", "yogi_planet", "avayogi_planet", "hora_ruler"):
            ref = props.get(field)
            if isinstance(ref, str) and ref.startswith("PLN."):
                _add(
                    node_id, ref,
                    f"Sensitive point association: {node_id} references {ref} via {field}",
                    f"CGM_v9_0 §{node_id}.{field}",
                )
                break  # one CO_OCCURS per SEN node

    return edges


def _parse_dual_system_divergence(
    nodes_by_id: dict[str, dict[str, Any]], node_ids: set[str]
) -> list[dict[str, Any]]:
    """
    KRK nodes with cross-system ambiguity → DUAL_SYSTEM_DIVERGENCE → KARAKA.DUAL_SYSTEM_DIVERGENCE.
    Four edges: C7/C8 Putra conflict, dual-role Sun (ATMA+PITRI), dual-role Venus (DARA+VAHANA),
    and the C8.PITRU node (new in 8-karaka, displacing Mars-as-PK).
    """
    target = "KARAKA.DUAL_SYSTEM_DIVERGENCE"
    divergence_nodes = [
        ("KRK.C7.PUTRA",  "7-karaka Mars=PK vs 8-karaka Rahu=PK conflict node"),
        ("KRK.C8.PUTRA",  "8-karaka Rahu=PK displaces 7-karaka Mars=PK; GAP.13 resolved"),
        ("KRK.STH.PITRI", "Sthira Pitri Karaka (Sun): same planet as KRK.STH.ATMA, dual sthira role"),
        ("KRK.STH.VAHANA","Sthira Vahana Karaka (Venus): same planet as KRK.STH.DARA, dual sthira role"),
    ]
    edges: list[dict[str, Any]] = []
    for src, note in divergence_nodes:
        e = _make_edge(
            src, target, "DUAL_SYSTEM_DIVERGENCE", 0.85,
            note,
            f"CGM_v9_0 §{src} + FORENSIC_v8_0 §10.3",
            node_ids,
        )
        if e:
            edges.append(e)
    return edges


def _parse_sec_references(
    nodes_by_id: dict[str, dict[str, Any]],
    node_ids: set[str],
    ucn_nodes: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    PLN.X → SEC_REFERENCES → UCN.SEC.Y for each planet prominently discussed in a UCN section.

    UCN_v4_0 is written in narrative prose (planet names, not node IDs). We scan each
    UCN.SEC.* node's content_excerpt for planet name occurrences and create a
    SEC_REFERENCES edge for planets that appear ≥2 times in the excerpt, indicating
    the section substantially discusses that planet.
    """
    edges: list[dict[str, Any]] = []
    seen_ids: set[str] = set()

    for ucn_node in ucn_nodes:
        ucn_id = ucn_node["node_id"]
        if not ucn_id.startswith("UCN.SEC."):
            continue
        content = ucn_node.get("properties", {}).get("content_excerpt", "")
        if not isinstance(content, str) or len(content) < 50:
            continue

        # Count planet name occurrences in the content_excerpt
        from collections import Counter
        planet_counts: Counter[str] = Counter()
        for m in _PLANET_NAME_RE.finditer(content):
            planet_counts[m.group(0)] += 1

        # Emit SEC_REFERENCES for planets appearing ≥2 times (primary discussion signal)
        for planet_name, count in planet_counts.items():
            if count < 2:
                continue
            cgm_node_id = _PLANET_NAME_TO_NODE[planet_name]
            e = _make_edge(
                cgm_node_id, ucn_id, "SEC_REFERENCES", 0.70,
                f"{planet_name} mentioned {count}× in {ucn_id} content — primary UCN section discussion",
                f"UCN_v4_0 §{ucn_id}",
                node_ids,
            )
            if e and e["edge_id"] not in seen_ids:
                seen_ids.add(e["edge_id"])
                edges.append(e)

        # Also check for CGM node-ID format references (PLN.*, HSE.*, etc.) for future-proofing
        for m in _CGM_NODE_RE.finditer(content):
            cgm_node_id = m.group(0)
            if cgm_node_id not in node_ids or cgm_node_id.startswith("UCN.SEC."):
                continue
            e = _make_edge(
                cgm_node_id, ucn_id, "SEC_REFERENCES", 0.75,
                f"Node ID {cgm_node_id} cited directly in {ucn_id}",
                f"UCN_v4_0 §{ucn_id}",
                node_ids,
            )
            if e and e["edge_id"] not in seen_ids:
                seen_ids.add(e["edge_id"])
                edges.append(e)

    log.info("cgm_extractor: _parse_sec_references: %d edges from UCN content scan", len(edges))
    return edges


def _parse_resonates_with(
    nodes_by_id: dict[str, dict[str, Any]], node_ids: set[str]
) -> list[dict[str, Any]]:
    """
    RESONATES_WITH edges from two sources:
      a. Planet pairs that co-occur in 2+ YGA nodes (bidirectional resonance)
      b. Planet → house resonances for key lord/dignity relationships (from RM §1 analysis)
    """
    edges: list[dict[str, Any]] = []
    seen_ids: set[str] = set()

    def _add(src: str, tgt: str, note: str) -> None:
        e = _make_edge(src, tgt, "RESONATES_WITH", 0.75, note,
                       "RM_v2_0 §0 + CGM_v9_0 YGA analysis", node_ids)
        if e and e["edge_id"] not in seen_ids:
            seen_ids.add(e["edge_id"])
            edges.append(e)

    # a. Count planet co-memberships across YGA nodes
    from collections import defaultdict
    pair_yga_count: dict[frozenset[str], int] = defaultdict(int)
    for node_id, props in nodes_by_id.items():
        if props.get("node_type") not in ("YOG", "YGA"):
            continue
        members_raw = props.get("members", [])
        if not isinstance(members_raw, list):
            continue
        pln_members = [m for m in members_raw if isinstance(m, str) and m.startswith("PLN.")]
        for i, p1 in enumerate(pln_members):
            for p2 in pln_members[i + 1:]:
                pair_yga_count[frozenset({p1, p2})] += 1

    # Emit bidirectional RESONATES_WITH for pairs with co-membership ≥2
    for pair, count in pair_yga_count.items():
        if count < 2:
            continue
        p1, p2 = sorted(pair)
        _add(p1, p2, f"Multi-yoga resonance: {p1}↔{p2} share {count} yoga co-memberships (RM axis)")
        _add(p2, p1, f"Multi-yoga resonance: {p2}↔{p1} share {count} yoga co-memberships (RM axis)")

    # b. Key planet→house resonances from RM element block analysis
    # Each represents a documented multi-system alignment between a planet and a house
    planet_house_resonances = [
        ("PLN.MERCURY", "HSE.10", "Mercury 8-system convergence in H10; MD lord + AL co-location (RM.01)"),
        ("PLN.MERCURY", "HSE.3",  "Mercury rules H3 (Gemini) — Yogi planet + skill/effort house (RM.01)"),
        ("PLN.MERCURY", "HSE.6",  "Mercury 6L dual-governance: career activation ↔ health risk (RM.01)"),
        ("PLN.SATURN",  "HSE.7",  "Saturn exalted AmK in H7; Sasha MPY; primary deliverer axis (RM.02)"),
        ("PLN.SATURN",  "HSE.10", "Saturn is 10L (career house) — dominant career delivery axis (RM.02)"),
        ("PLN.SATURN",  "HSE.11", "Saturn is 11L (gains house) — gains activation via Saturn periods (RM.02)"),
        ("PLN.JUPITER", "HSE.9",  "Jupiter own-sign H9; dharma-fortune-knowledge convergence (RM.03)"),
        ("PLN.JUPITER", "HSE.12", "Jupiter rules H12 (Pisces); liberation/foreign-residence domain (RM.03)"),
        ("PLN.MARS",    "HSE.1",  "Mars lagna lord (Aries H1); self-image and drive anchor (RM §0)"),
        ("PLN.MARS",    "HSE.8",  "Mars rules H8 (Scorpio); research/occult/transformation domain"),
        ("PLN.MOON",    "HSE.4",  "Moon rules H4 (Cancer); inner sanctuary and emotional foundation"),
        ("PLN.VENUS",   "HSE.2",  "Venus rules H2 (Taurus with Rahu); material accumulation domain"),
        ("PLN.VENUS",   "HSE.7",  "Venus rules H7 (Libra, occupied); partnership house lord resonance"),
        ("PLN.SUN",     "HSE.5",  "Sun rules H5 (Leo); intellect, creativity, speculation domain"),
        ("PLN.SUN",     "HSE.10", "Sun in H10 Capricorn + AL; identity-career convergence (RM §0)"),
        ("PLN.RAHU",    "HSE.2",  "Rahu in H2 Taurus; material accumulation and unusual gains axis"),
    ]
    for src, tgt, note in planet_house_resonances:
        _add(src, tgt, note)

    return edges


def _parse_contradicts_with(
    nodes_by_id: dict[str, dict[str, Any]], node_ids: set[str]
) -> list[dict[str, Any]]:
    """
    CONTRADICTS_WITH edges for known chart paradoxes (CGM §5 Key Structural Observations).
    Five hardcoded edges.
    """
    contradictions = [
        (
            "PLN.JUPITER", "KRK.STH.PUTRA",
            "Jupiter paradox (CTR.03): own-sign H9 dignified but Phalita Kashta 48.81 "
            "(Phalita-weak). STH.PUTRA role emphasises children/teaching; D9 placement in 12H undermines.",
        ),
        (
            "HSE.7", "PLN.SATURN",
            "H7 paradox: weakest BVB rank 12 of 12 yet holds strongest planet (Saturn exalted). "
            "Structural container weakness contradicts occupant strength.",
        ),
        (
            "HSE.7", "PLN.MARS",
            "H7 paradox: weakest BVB rank 12 yet Mars in exaltation-sign Libra (near Capricorn). "
            "Avayogi in the structurally weakest house creates ATT tension.",
        ),
        (
            "DVS.D9.JUPITER", "PLN.JUPITER",
            "D9 12H placement of Jupiter contradicts D1 own-sign dignity. "
            "D9 soul-level indicator in 12H (loss/foreign) vs D1 dharmic strength.",
        ),
        (
            "PLN.MERCURY", "PLN.MERCURY",
            "Mercury SELF-TENSION: operationally dominant (8-system) yet Naisargika rank 7 "
            "(weakest natural strength). Achieved by effort, not natural flow. SKipped if self-loop.",
        ),
    ]
    edges: list[dict[str, Any]] = []
    for src, tgt, note in contradictions:
        if src == tgt:
            continue  # skip self-loop
        e = _make_edge(
            src, tgt, "CONTRADICTS_WITH", 0.85,
            note,
            "CGM_v9_0 §5 + FORENSIC_v8_0 §10.3",
            node_ids,
        )
        if e:
            edges.append(e)
    return edges


# ---------------------------------------------------------------------------
# Main edge extraction entry point
# ---------------------------------------------------------------------------

def extract_cgm_edges(
    repo_root: str,
    node_ids: set[str] | None = None,
) -> list[dict[str, Any]]:
    """
    Extract all CGM edges from 15 derived edge_type parsers.

    Each parser validates both source_node_id AND target_node_id against the
    merged node catalog before emitting any edge. No manifest loading.

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
        # Build full merged node_id set (CGM base + UCN.SEC.* + aux)
        base_ids = {nid for nid, _ in raw_nodes}
        try:
            ucn_nodes = extract_ucn_section_nodes(repo_root)
            ucn_ids = {r["node_id"] for r in ucn_nodes}
        except Exception as exc:
            log.warning("cgm_extractor: UCN section nodes unavailable: %s", exc)
            ucn_nodes = []
            ucn_ids = set()
        aux_ids = {r["node_id"] for r in _AUX_CGM_NODES}
        node_ids = base_ids | ucn_ids | aux_ids
    else:
        # Caller provided node_ids; still need ucn_nodes for SEC_REFERENCES scan
        try:
            ucn_nodes = extract_ucn_section_nodes(repo_root)
        except Exception as exc:
            log.warning("cgm_extractor: UCN section nodes unavailable: %s", exc)
            ucn_nodes = []

    # Build nodes_by_id dict from CGM base nodes
    nodes_by_id: dict[str, dict[str, Any]] = {}
    for nid, block in raw_nodes:
        props = _parse_node_properties(block)
        nodes_by_id[nid] = props

    all_edges: list[dict[str, Any]] = []
    parsers = [
        ("RULES_OVER",           _parse_rules_over(nodes_by_id, node_ids)),
        ("DISPOSES",             _parse_disposes(nodes_by_id, node_ids)),
        ("NAKSHATRA_OF",         _parse_nakshatra_of(nodes_by_id, node_ids)),
        ("KARAKA_OF",            _parse_karaka_of(nodes_by_id, node_ids)),
        ("CONJUNCT",             _parse_conjunct(nodes_by_id, node_ids)),
        ("DASHA_GIVES",          _parse_dasha_gives(nodes_by_id, node_ids)),
        ("ASPECTS",              _parse_aspects(nodes_by_id, node_ids)),
        ("AFFLICTS",             _parse_afflicts(nodes_by_id, node_ids)),
        ("SUPPORTS",             _parse_supports(nodes_by_id, node_ids)),
        ("ARUDHA_OF",            _parse_arudha_of(nodes_by_id, node_ids)),
        ("CO_OCCURS",            _parse_co_occurs(nodes_by_id, node_ids)),
        ("DUAL_SYSTEM_DIVERGENCE", _parse_dual_system_divergence(nodes_by_id, node_ids)),
        ("SEC_REFERENCES",       _parse_sec_references(nodes_by_id, node_ids, ucn_nodes)),
        ("RESONATES_WITH",       _parse_resonates_with(nodes_by_id, node_ids)),
        ("CONTRADICTS_WITH",     _parse_contradicts_with(nodes_by_id, node_ids)),
    ]

    by_type: dict[str, int] = {}
    for edge_type, type_edges in parsers:
        by_type[edge_type] = len(type_edges)
        all_edges.extend(type_edges)

    # Deduplicate by edge_id (last writer wins)
    deduped: dict[str, dict[str, Any]] = {}
    for e in all_edges:
        deduped[e["edge_id"]] = e
    all_edges = list(deduped.values())

    # Final orphan check — both source AND target must be in node_ids
    orphan_count = 0
    for row in all_edges:
        if row["source_node_id"] not in node_ids or row["target_node_id"] not in node_ids:
            row["status"] = "orphan"
            row["orphan_reason"] = (
                f"source_missing:{row['source_node_id'] not in node_ids},"
                f"target_missing:{row['target_node_id'] not in node_ids}"
            )
            orphan_count += 1

    log.info(
        "cgm_extractor: %d edges total — by type: %s | orphans: %d",
        len(all_edges), by_type, orphan_count,
    )

    if not all_edges:
        raise ValueError("CGM edge count is 0 — all parsers returned empty. Check CGM_v9_0.md.")

    return all_edges
