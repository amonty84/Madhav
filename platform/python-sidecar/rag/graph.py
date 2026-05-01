"""
graph — MARSYS-JIS RAG Pipeline citation graph construction and traversal.
Phase B.4 Session 1. Per PHASE_B_PLAN_v1_0.md §B.4 Tasks 1, 2, 4, 5.

Builds rag_graph_nodes + rag_graph_edges from:
  - Deterministic edges: CITES (chunk→fact), MENTIONS (chunk→signal),
    AFFECTS_DOMAIN (signal→domain), CROSS_LINKS (domain↔domain from CDLM)
  - CGM-enrichment edges: DISPOSITED_BY, NAKSHATRA_LORD_IS, ASPECTS_* (22 edges)

Task 3 (SUPPORTS / CONTRADICTS two-pass) deferred to Madhav_M2A_Exec_7.
"""
from __future__ import annotations

import hashlib
import json
import logging
import os
import re
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import networkx as nx
from dotenv import load_dotenv

from rag.models import GraphEdge, GraphNode

logger = logging.getLogger(__name__)

# ── Constants ─────────────────────────────────────────────────────────────────

CGM_MANIFEST_PATH = "035_DISCOVERY_LAYER/cgm_edges_manifest_v1_0.json"
GRAPH_JSON_PATH = "verification_artifacts/RAG/graph.json"

# 9 CDLM domain node IDs
DOMAIN_NODES: dict[str, str] = {
    "career":        "DOM.CAREER",
    "wealth":        "DOM.WEALTH",
    "relationships": "DOM.RELATIONSHIPS",
    "health":        "DOM.HEALTH",
    "children":      "DOM.CHILDREN",
    "spirit":        "DOM.SPIRIT",
    "parents":       "DOM.PARENTS",
    "mind":          "DOM.MIND",
    "travel":        "DOM.TRAVEL",
}

# Regex: SIG.MSR.NNN[letter] — same pattern as P5 validator
_SIGNAL_RE = re.compile(r"\bSIG\.MSR\.(\d{3}[a-z]?)\b")
# Regex: L1 fact-ID prefixes used in v6_ids_consumed
_FACT_ID_RE = re.compile(
    r"\b(PLN|HSE|SGN|NAK|KRK|DSH|YGA|LAG|ARD|SAH|BVB|SBL|AVG|D9|D10|D12|D60)\.[A-Z0-9_.]+\b"
)


# ── Environment / DB helpers ─────────────────────────────────────────────────

def _load_env(repo_root: str) -> None:
    load_dotenv(Path(repo_root) / ".env.rag", override=False)


def _db_url() -> str:
    url = os.environ.get("DATABASE_URL", "")
    if not url:
        raise RuntimeError(
            "[STOP] DATABASE_URL not set. "
            "Add DATABASE_URL=postgresql://... to .env.rag and start the Cloud SQL Auth Proxy."
        )
    return url


# ── Edge ID derivation (deterministic, idempotent) ───────────────────────────

def _edge_id(source: str, target: str, edge_type: str) -> str:
    raw = f"{source}:{target}:{edge_type}"
    return hashlib.sha256(raw.encode()).hexdigest()[:32]


# ── Chunk loading ─────────────────────────────────────────────────────────────

def load_chunks_from_db(repo_root: str) -> list[dict[str, Any]]:
    """Fetch all chunks from rag_chunks via psycopg."""
    import psycopg

    _load_env(repo_root)
    with psycopg.connect(_db_url()) as conn:
        rows = conn.execute(
            "SELECT chunk_id, doc_type, layer, content, metadata "
            "FROM rag_chunks"
        ).fetchall()
    result = [
        {
            "chunk_id": r[0],
            "doc_type": r[1],
            "layer": r[2],
            "content": r[3],
            "metadata": r[4] if isinstance(r[4], dict) else {},
        }
        for r in rows
    ]
    logger.info("Loaded %d chunks from rag_chunks.", len(result))
    return result


# ── CGM manifest loader ──────────────────────────────────────────────────────

def load_cgm_manifest(repo_root: str) -> list[dict[str, Any]]:
    """Load cgm_edges_manifest_v1_0.json; return list of edge dicts."""
    path = Path(repo_root) / CGM_MANIFEST_PATH
    if not path.exists():
        raise FileNotFoundError(
            f"[STOP] cgm_edges_manifest_v1_0.json not found at {path}. "
            "Run AC.1 to produce it."
        )
    data = json.loads(path.read_text(encoding="utf-8"))
    edges = data.get("edges", [])
    logger.info("Loaded %d CGM manifest edges.", len(edges))
    return edges


# ── Graph builder ─────────────────────────────────────────────────────────────

def build_graph(
    chunks: list[dict[str, Any]],
    cgm_manifest_edges: list[dict[str, Any]],
) -> nx.MultiDiGraph:
    """
    Build a NetworkX MultiDiGraph from corpus chunks + CGM manifest edges.

    Node types: chunk | signal | fact | domain
    Deterministic edge types: CITES | MENTIONS | AFFECTS_DOMAIN | CROSS_LINKS
    CGM-enrichment edge types: DISPOSITED_BY | NAKSHATRA_LORD_IS |
                                ASPECTS_3RD | ASPECTS_4TH | ASPECTS_8TH

    Stop: raises RuntimeError('[GRAPH_DANGLING_EDGE]') if any edge references
    a node_id not present in the node set.
    """
    G: nx.MultiDiGraph = nx.MultiDiGraph()
    nodes: dict[str, dict[str, Any]] = {}   # node_id → attrs
    edges: list[dict[str, Any]] = []         # edge attr dicts

    def _add_node(node_id: str, node_type: str, chunk_id: str | None = None) -> None:
        if node_id not in nodes:
            nodes[node_id] = {"node_type": node_type, "chunk_id": chunk_id}

    def _add_edge(source: str, target: str, edge_type: str, weight: float = 1.0,
                  actor: str = "deterministic", metadata: dict | None = None) -> None:
        eid = _edge_id(source, target, edge_type)
        edges.append({
            "edge_id": eid,
            "source_node_id": source,
            "target_node_id": target,
            "edge_type": edge_type,
            "weight": weight,
            "actor": actor,
            "metadata": metadata or {},
        })

    # 1. Register all 9 domain nodes
    for domain_node_id in DOMAIN_NODES.values():
        _add_node(domain_node_id, "domain")

    # 2. Process chunks → chunk nodes + deterministic edges
    signal_meta: dict[str, dict[str, Any]] = {}  # signal_id → {domains_affected, v6_ids_consumed}

    for c in chunks:
        chunk_id = c["chunk_id"]
        doc_type = c["doc_type"]
        content = c.get("content", "")
        meta = c.get("metadata", {})

        _add_node(chunk_id, "chunk", chunk_id=chunk_id)

        if doc_type == "msr_signal":
            sig_id = meta.get("signal_id", "")
            if sig_id:
                _add_node(sig_id, "signal")
                # MENTIONS: chunk → signal (the chunk IS the signal block)
                _add_edge(chunk_id, sig_id, "MENTIONS")
                # AFFECTS_DOMAIN: signal → domain (from metadata.domains_affected)
                domains_raw = meta.get("domains_affected", [])
                if isinstance(domains_raw, str):
                    domains_raw = [d.strip() for d in domains_raw.strip("[]").split(",") if d.strip()]
                for dom in domains_raw:
                    dom_node = DOMAIN_NODES.get(dom.lower().strip())
                    if dom_node:
                        _add_edge(sig_id, dom_node, "AFFECTS_DOMAIN")
                # CITES: chunk → each L1 fact_id in v6_ids_consumed
                v6 = meta.get("v6_ids_consumed", [])
                if isinstance(v6, str):
                    v6 = [x.strip() for x in v6.strip("[]").split(",") if x.strip()]
                for fid in v6:
                    fid = fid.strip()
                    if fid:
                        _add_node(fid, "fact")
                        _add_edge(chunk_id, fid, "CITES")
                # Store signal meta for AFFECTS_DOMAIN from non-msr chunks later
                signal_meta[sig_id] = {
                    "domains_affected": domains_raw,
                    "v6_ids_consumed": v6,
                }

        elif doc_type == "cdlm_cell":
            # CROSS_LINKS: domain_row → domain_col
            row_dom_name = meta.get("row_domain", "")
            col_dom_name = meta.get("col_domain", "")
            row_node = DOMAIN_NODES.get(row_dom_name.lower().strip())
            col_node = DOMAIN_NODES.get(col_dom_name.lower().strip())
            if row_node and col_node and row_node != col_node:
                _add_edge(row_node, col_node, "CROSS_LINKS",
                          metadata={"cell_id": meta.get("cell_id", ""),
                                    "msr_anchors": meta.get("msr_anchors", [])})
            # CITES from CDLM cell → L1 facts via v6_ids_consumed (if set)
            v6 = meta.get("v6_ids_consumed", [])
            if isinstance(v6, str):
                v6 = [x.strip() for x in v6.strip("[]").split(",") if x.strip()]
            for fid in v6:
                fid = fid.strip()
                if fid:
                    _add_node(fid, "fact")
                    _add_edge(chunk_id, fid, "CITES")

        else:
            # For all other doc_types: CITES from v6_ids_consumed if present
            v6 = meta.get("v6_ids_consumed", [])
            if isinstance(v6, str):
                v6 = [x.strip() for x in v6.strip("[]").split(",") if x.strip()]
            for fid in v6:
                fid = fid.strip()
                if fid:
                    _add_node(fid, "fact")
                    _add_edge(chunk_id, fid, "CITES")

        # MENTIONS: scan all chunk content for SIG.MSR.NNN references
        for m in _SIGNAL_RE.finditer(content):
            sig_ref = f"SIG.MSR.{m.group(1)}"
            _add_node(sig_ref, "signal")
            _add_edge(chunk_id, sig_ref, "MENTIONS")

    # 3. Register all signal nodes referenced by MENTIONS edges (may not all be msr_signal chunks)
    #    Domain edges for these signals come from msr_signal chunk metadata (signal_meta dict above)
    #    — no additional loop needed since those were registered in step 2.

    # 4. CGM manifest edges
    for edge_dict in cgm_manifest_edges:
        src = edge_dict.get("source_node_id", "")
        tgt = edge_dict.get("target_node_id", "")
        etype = edge_dict.get("edge_type", "")
        if not src or not tgt or not etype:
            logger.warning("CGM manifest edge missing required fields: %s", edge_dict)
            continue
        # Planet nodes are L1 fact entities
        _add_node(src, "fact")
        _add_node(tgt, "fact")
        _add_edge(src, tgt, etype,
                  actor="gemini-two-pass-reconciled-2026-04-26",
                  metadata={
                      "edge_id": edge_dict.get("edge_id", ""),
                      "l1_source_section": edge_dict.get("l1_source_section", ""),
                      "l1_derivation": edge_dict.get("l1_derivation", ""),
                      "confidence_prior": edge_dict.get("confidence_prior", "HIGH"),
                      "source_batch": edge_dict.get("source_batch", ""),
                  })

    # 5. Dangling edge check (AC.10 hard stop)
    node_id_set = set(nodes.keys())
    dangling: list[str] = []
    for e in edges:
        if e["source_node_id"] not in node_id_set:
            dangling.append(f"source={e['source_node_id']} ({e['edge_type']})")
        if e["target_node_id"] not in node_id_set:
            dangling.append(f"target={e['target_node_id']} ({e['edge_type']})")
    if dangling:
        raise RuntimeError(
            "[GRAPH_DANGLING_EDGE] Edges reference undefined nodes:\n"
            + "\n".join(dangling[:20])
        )

    # 6. Populate NetworkX graph
    for node_id, attrs in nodes.items():
        G.add_node(node_id, **attrs)
    for e in edges:
        G.add_edge(
            e["source_node_id"],
            e["target_node_id"],
            key=e["edge_id"],
            edge_type=e["edge_type"],
            weight=e["weight"],
            actor=e["actor"],
            edge_id=e["edge_id"],
            metadata=e["metadata"],
        )

    # Store edges list on graph for DB persist
    G.graph["_edges_list"] = edges
    G.graph["_nodes_dict"] = nodes

    logger.info(
        "build_graph: %d nodes, %d edges (before dedup)",
        G.number_of_nodes(), G.number_of_edges(),
    )
    return G


# ── DB persistence ────────────────────────────────────────────────────────────

def _upsert_nodes(nodes: dict[str, dict[str, Any]]) -> int:
    """Upsert all nodes to rag_graph_nodes. Returns count written."""
    import psycopg

    rows = list(nodes.items())
    written = 0
    with psycopg.connect(_db_url(), autocommit=True) as conn:
        for node_id, attrs in rows:
            conn.execute(
                """
                INSERT INTO rag_graph_nodes (node_id, node_type, chunk_id, metadata)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (node_id) DO UPDATE
                  SET node_type = EXCLUDED.node_type,
                      chunk_id  = EXCLUDED.chunk_id,
                      metadata  = EXCLUDED.metadata
                """,
                (
                    node_id,
                    attrs["node_type"],
                    attrs.get("chunk_id"),
                    json.dumps({}),
                ),
            )
            written += 1
    logger.info("_upsert_nodes: %d nodes written.", written)
    return written


def _upsert_edges(edges: list[dict[str, Any]]) -> int:
    """Upsert all edges to rag_graph_edges. Returns count written."""
    import psycopg

    written = 0
    with psycopg.connect(_db_url(), autocommit=True) as conn:
        for e in edges:
            conn.execute(
                """
                INSERT INTO rag_graph_edges
                  (edge_id, source_node_id, target_node_id, edge_type,
                   weight, actor, metadata)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (edge_id) DO UPDATE
                  SET source_node_id = EXCLUDED.source_node_id,
                      target_node_id = EXCLUDED.target_node_id,
                      edge_type      = EXCLUDED.edge_type,
                      weight         = EXCLUDED.weight,
                      actor          = EXCLUDED.actor,
                      metadata       = EXCLUDED.metadata
                """,
                (
                    e["edge_id"],
                    e["source_node_id"],
                    e["target_node_id"],
                    e["edge_type"],
                    e["weight"],
                    e["actor"],
                    json.dumps(e["metadata"]),
                ),
            )
            written += 1
    logger.info("_upsert_edges: %d edges written.", written)
    return written


def persist_graph(G: nx.MultiDiGraph) -> tuple[int, int]:
    """
    Persist graph to rag_graph_nodes + rag_graph_edges.
    Returns (nodes_written, edges_written).
    """
    nodes = G.graph.get("_nodes_dict", {})
    edges = G.graph.get("_edges_list", [])
    n = _upsert_nodes(nodes)
    e = _upsert_edges(edges)
    return n, e


# ── Graph JSON export ─────────────────────────────────────────────────────────

def export_graph_json(G: nx.MultiDiGraph, repo_root: str) -> Path:
    """
    Export adjacency JSON to verification_artifacts/RAG/graph.json.
    Returns path.
    """
    edges = G.graph.get("_edges_list", [])
    nodes = G.graph.get("_nodes_dict", {})

    edges_by_type: dict[str, int] = defaultdict(int)
    for e in edges:
        edges_by_type[e["edge_type"]] += 1

    node_list = [
        {"node_id": nid, "node_type": attrs["node_type"]}
        for nid, attrs in nodes.items()
    ]
    edge_list = [
        {
            "edge_id": e["edge_id"],
            "source_node_id": e["source_node_id"],
            "target_node_id": e["target_node_id"],
            "edge_type": e["edge_type"],
            "weight": e["weight"],
        }
        for e in edges
    ]

    payload = {
        "nodes": node_list,
        "edges": edge_list,
        "node_count": len(node_list),
        "edge_count": len(edge_list),
        "edges_by_type": dict(edges_by_type),
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "produced_by_session": "Madhav_M2A_Exec_6",
        "supports_deferred": "DEFERRED to Madhav_M2A_Exec_7 (Task 3 — Gemini two-pass)",
    }

    out_path = Path(repo_root) / GRAPH_JSON_PATH
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    logger.info("graph.json written to %s (%d nodes, %d edges)", out_path, payload["node_count"], payload["edge_count"])
    return out_path


# ── Helper library (AC.11) ────────────────────────────────────────────────────

def expand_neighbors(node_id: str, hops: int = 1, repo_root: str = ".") -> list[str]:
    """
    Return all node_ids reachable from node_id within `hops` hops.
    Round-trips via DB: reads from rag_graph_edges.
    """
    import psycopg

    _load_env(repo_root)
    frontier = {node_id}
    visited: set[str] = set()

    with psycopg.connect(_db_url()) as conn:
        for _ in range(hops):
            if not frontier:
                break
            visited.update(frontier)
            next_frontier: set[str] = set()
            for nid in frontier:
                rows = conn.execute(
                    """
                    SELECT target_node_id FROM rag_graph_edges WHERE source_node_id = %s
                    UNION
                    SELECT source_node_id FROM rag_graph_edges WHERE target_node_id = %s
                    """,
                    (nid, nid),
                ).fetchall()
                for (neighbor,) in rows:
                    if neighbor not in visited:
                        next_frontier.add(neighbor)
            frontier = next_frontier

    neighbors = list(visited | frontier - {node_id})
    logger.info("expand_neighbors('%s', hops=%d): %d neighbors", node_id, hops, len(neighbors))
    return neighbors


def shortest_path(source: str, target: str, repo_root: str = ".") -> list[str] | None:
    """
    Find shortest path between source and target nodes using NetworkX on the
    in-memory graph loaded from DB edges. Returns ordered node_id list or None.
    """
    import psycopg

    _load_env(repo_root)
    with psycopg.connect(_db_url()) as conn:
        rows = conn.execute(
            "SELECT source_node_id, target_node_id FROM rag_graph_edges"
        ).fetchall()

    G_tmp = nx.DiGraph()
    for src, tgt in rows:
        G_tmp.add_edge(src, tgt)

    try:
        path = nx.shortest_path(G_tmp, source=source, target=target)
        logger.info("shortest_path('%s' → '%s'): %d hops", source, target, len(path) - 1)
        return path
    except nx.NetworkXNoPath:
        logger.info("shortest_path('%s' → '%s'): no path found", source, target)
        return None
    except nx.NodeNotFound:
        logger.info("shortest_path: node not found ('%s' or '%s')", source, target)
        return None


def domain_cross_links(domain_id: str, repo_root: str = ".") -> list[GraphEdge]:
    """
    Return all CROSS_LINKS edges where domain_id is source or target.
    Round-trips via DB.
    """
    import psycopg

    _load_env(repo_root)
    with psycopg.connect(_db_url()) as conn:
        rows = conn.execute(
            """
            SELECT source_node_id, target_node_id, edge_type, weight
            FROM rag_graph_edges
            WHERE edge_type = 'CROSS_LINKS'
              AND (source_node_id = %s OR target_node_id = %s)
            """,
            (domain_id, domain_id),
        ).fetchall()

    result = [
        GraphEdge(source_id=r[0], target_id=r[1], edge_type=r[2], weight=r[3])
        for r in rows
    ]
    logger.info("domain_cross_links('%s'): %d edges", domain_id, len(result))
    return result


# ── Verification helpers ──────────────────────────────────────────────────────

def run_smoke_tests(G: nx.MultiDiGraph, repo_root: str) -> dict[str, Any]:
    """
    AC.11 smoke tests. Includes expand_neighbors('PLN.SATURN', hops=2) ≥ 10 check.
    Writes results to verification_artifacts/RAG/b4_node_count.json.
    """
    # In-graph check (not DB round-trip — the graph may not be persisted yet)
    if "PLN.SATURN" not in G:
        saturn_neighbors: list[str] = []
    else:
        # BFS 2 hops in-memory
        visited: set[str] = set()
        frontier = {"PLN.SATURN"}
        for _ in range(2):
            next_f: set[str] = set()
            for n in frontier:
                for nbr in list(G.predecessors(n)) + list(G.successors(n)):
                    if nbr not in visited and nbr != "PLN.SATURN":
                        next_f.add(nbr)
            visited.update(frontier)
            frontier = next_f
        saturn_neighbors = list(visited | frontier - {"PLN.SATURN"})

    nodes = G.graph.get("_nodes_dict", {})
    node_counts_by_type: dict[str, int] = defaultdict(int)
    for attrs in nodes.values():
        node_counts_by_type[attrs["node_type"]] += 1

    smoke = {
        "saturn_neighbors_hops2": len(saturn_neighbors),
        "saturn_neighbors_hops2_sample": saturn_neighbors[:20],
        "saturn_hops2_ge_10_pass": len(saturn_neighbors) >= 10,
        "node_counts_by_type": dict(node_counts_by_type),
        "total_nodes": G.number_of_nodes(),
    }

    out_path = Path(repo_root) / "verification_artifacts" / "RAG" / "b4_node_count.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(smoke, indent=2, ensure_ascii=False), encoding="utf-8")
    logger.info("b4_node_count.json written. PLN.SATURN hops=2 neighbors: %d", len(saturn_neighbors))

    if not smoke["saturn_hops2_ge_10_pass"]:
        logger.warning(
            "[AC.11 WARN] expand_neighbors('PLN.SATURN', hops=2) = %d < 10. "
            "Check that MSR signal metadata and CGM manifest edges are loaded.",
            len(saturn_neighbors),
        )
    return smoke


def write_edge_count_report(G: nx.MultiDiGraph, repo_root: str) -> dict[str, Any]:
    """
    AC.12/AC.13 edge count report. Writes b4_edge_count.json.
    """
    edges = G.graph.get("_edges_list", [])
    edges_by_type: dict[str, int] = defaultdict(int)
    for e in edges:
        edges_by_type[e["edge_type"]] += 1

    # Load baseline_edge_count.json (957 deterministic edges pre-migration)
    baseline_path = Path(repo_root) / "verification_artifacts" / "RAG" / "baseline_edge_count.json"
    baseline_count = 0
    if baseline_path.exists():
        try:
            baseline_data = json.loads(baseline_path.read_text(encoding="utf-8"))
            baseline_count = baseline_data.get("deterministic_edge_count", 957)
        except Exception:
            baseline_count = 957  # fallback

    total_edges = len(edges)
    deterministic_edge_types = {"CITES", "MENTIONS", "AFFECTS_DOMAIN", "CROSS_LINKS"}
    deterministic_count = sum(
        v for k, v in edges_by_type.items() if k in deterministic_edge_types
    )

    report = {
        "total_edges": total_edges,
        "edges_by_type": dict(edges_by_type),
        "deterministic_edges": deterministic_count,
        "baseline_edge_count": baseline_count,
        "deterministic_ge_baseline_pass": deterministic_count >= baseline_count,
        "supports_edges": 0,
        "contradicts_edges": 0,
        "supports_deferred_to": "Madhav_M2A_Exec_7",
        "contradicts_deferred_to": "Madhav_M2A_Exec_7+",
        "b4_session1_complete": True,
        "b4_full_close_pending": "Exec_7 (Task 3 — Gemini SUPPORTS two-pass)",
    }

    out_path = Path(repo_root) / "verification_artifacts" / "RAG" / "b4_edge_count.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    logger.info(
        "b4_edge_count.json written. Total: %d edges; deterministic: %d (baseline: %d)",
        total_edges, deterministic_count, baseline_count,
    )

    if not report["deterministic_ge_baseline_pass"]:
        raise RuntimeError(
            f"[STOP] Deterministic edge count {deterministic_count} < baseline {baseline_count}. "
            "AC.13 fail: regression in deterministic edges."
        )
    return report


# ── Main entry point ──────────────────────────────────────────────────────────

def main(repo_root: str = ".") -> None:
    """
    B.4 Session 1 Task 4 main: build graph, persist, export, run smoke tests.

    1. Load chunks from DB.
    2. Load CGM manifest.
    3. Build graph.
    4. Persist to DB (rag_graph_nodes + rag_graph_edges).
    5. Export graph.json.
    6. Smoke tests → b4_node_count.json.
    7. Edge count report → b4_edge_count.json.
    """
    import sys

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )

    _load_env(repo_root)
    logger.info("graph.py B.4 main. repo_root=%s", repo_root)

    chunks = load_chunks_from_db(repo_root)
    cgm_manifest = load_cgm_manifest(repo_root)

    G = build_graph(chunks, cgm_manifest)

    nodes_written, edges_written = persist_graph(G)
    logger.info("Persisted: %d nodes, %d edges.", nodes_written, edges_written)

    export_path = export_graph_json(G, repo_root)
    logger.info("graph.json exported to %s", export_path)

    smoke = run_smoke_tests(G, repo_root)
    logger.info("Smoke tests: PLN.SATURN hops=2=%d (pass=%s)", smoke["saturn_neighbors_hops2"], smoke["saturn_hops2_ge_10_pass"])

    # Edge count report — uses baseline_edge_count.json
    try:
        ec_report = write_edge_count_report(G, repo_root)
        logger.info(
            "Edge count report: total=%d deterministic=%d baseline=%d pass=%s",
            ec_report["total_edges"],
            ec_report["deterministic_edges"],
            ec_report["baseline_edge_count"],
            ec_report["deterministic_ge_baseline_pass"],
        )
    except RuntimeError as exc:
        logger.error("STOP: %s", exc)
        sys.exit(1)

    print(f"B.4 Session 1 graph build complete.")
    print(f"  Nodes: {G.number_of_nodes()}")
    print(f"  Edges: {G.number_of_edges()}")
    print(f"  Nodes written to DB: {nodes_written}")
    print(f"  Edges written to DB: {edges_written}")
    print(f"  graph.json: {export_path}")
    print(f"  PLN.SATURN hops=2 neighbors: {smoke['saturn_neighbors_hops2']} (AC.11 ≥10 pass: {smoke['saturn_hops2_ge_10_pass']})")


def persist_supports_edges(edges: list[dict[str, Any]], repo_root: str = ".") -> int:
    """
    Persist a list of accepted SUPPORTS edge dicts to rag_graph_edges.
    Ensures source and target nodes exist in rag_graph_nodes (creating ucn_section
    nodes on first encounter). Returns count of edges written.

    Each edge dict must have: source_node_id, target_node_id, l1_source,
    l3_evidence_report, l3_evidence_section, confidence_prior, accepted_by_session.
    """
    import psycopg

    _load_env(repo_root)

    written = 0
    with psycopg.connect(_db_url(), autocommit=True) as conn:
        for edge in edges:
            src = edge["source_node_id"]
            tgt = edge["target_node_id"]

            # Ensure source node (msr_signal) exists — created by B.1 ingest, but guard.
            conn.execute(
                """
                INSERT INTO rag_graph_nodes (node_id, node_type, chunk_id, metadata)
                VALUES (%s, 'msr_signal', NULL, %s)
                ON CONFLICT (node_id) DO NOTHING
                """,
                (src, json.dumps({"signal_id": src})),
            )

            # Ensure target node (ucn_section) exists — may be new.
            conn.execute(
                """
                INSERT INTO rag_graph_nodes (node_id, node_type, chunk_id, metadata)
                VALUES (%s, 'ucn_section', NULL, %s)
                ON CONFLICT (node_id) DO NOTHING
                """,
                (tgt, json.dumps({"section_id": tgt, "heading": edge.get("target_ucn_heading", "")})),
            )

            eid = _edge_id(src, tgt, "SUPPORTS")
            conn.execute(
                """
                INSERT INTO rag_graph_edges
                  (edge_id, source_node_id, target_node_id, edge_type,
                   weight, actor, metadata)
                VALUES (%s, %s, %s, 'SUPPORTS', NULL, 'cgm_supports_reconciler', %s)
                ON CONFLICT (edge_id) DO UPDATE
                  SET source_node_id = EXCLUDED.source_node_id,
                      target_node_id = EXCLUDED.target_node_id,
                      edge_type      = EXCLUDED.edge_type,
                      actor          = EXCLUDED.actor,
                      metadata       = EXCLUDED.metadata
                """,
                (
                    eid,
                    src,
                    tgt,
                    json.dumps({
                        "l1_source": edge.get("l1_source", ""),
                        "l3_evidence_report": edge.get("l3_evidence_report", ""),
                        "l3_evidence_section": edge.get("l3_evidence_section", ""),
                        "confidence_prior": edge.get("confidence_prior", "LOW"),
                        "source_batch": edge.get("source_batch", ""),
                        "accepted_by_session": edge.get("accepted_by_session", ""),
                    }),
                ),
            )
            written += 1

    logger.info("persist_supports_edges: %d edges written.", written)
    return written


def persist_contradicts_edges(edges: list[dict[str, Any]], repo_root: str = ".") -> int:
    """
    Persist a list of accepted CONTRADICTS edge dicts to rag_graph_edges.
    Ensures source and target nodes exist in rag_graph_nodes. Returns count written.

    Each edge dict must have: source_node_id, target_node_id, conflict_type,
    claude_severity_prior, gemini_confidence, accepted_by_session.
    """
    import psycopg

    _load_env(repo_root)

    written = 0
    with psycopg.connect(_db_url(), autocommit=True) as conn:
        for edge in edges:
            src = edge["source_node_id"]
            tgt = edge["target_node_id"]

            # Ensure source node exists
            conn.execute(
                """
                INSERT INTO rag_graph_nodes (node_id, node_type, chunk_id, metadata)
                VALUES (%s, %s, NULL, %s)
                ON CONFLICT (node_id) DO NOTHING
                """,
                (src, edge.get("source_node_type", "msr_signal"), json.dumps({"node_id": src})),
            )

            # Ensure target node exists
            conn.execute(
                """
                INSERT INTO rag_graph_nodes (node_id, node_type, chunk_id, metadata)
                VALUES (%s, %s, NULL, %s)
                ON CONFLICT (node_id) DO NOTHING
                """,
                (tgt, edge.get("target_node_type", "layer_contract"), json.dumps({"node_id": tgt})),
            )

            eid = _edge_id(src, tgt, "CONTRADICTS")
            conn.execute(
                """
                INSERT INTO rag_graph_edges
                  (edge_id, source_node_id, target_node_id, edge_type,
                   weight, actor, metadata)
                VALUES (%s, %s, %s, 'CONTRADICTS', NULL, 'cgm_contradicts_reconciler', %s)
                ON CONFLICT (edge_id) DO UPDATE
                  SET source_node_id = EXCLUDED.source_node_id,
                      target_node_id = EXCLUDED.target_node_id,
                      edge_type      = EXCLUDED.edge_type,
                      actor          = EXCLUDED.actor,
                      metadata       = EXCLUDED.metadata
                """,
                (
                    eid,
                    src,
                    tgt,
                    json.dumps({
                        "conflict_type": edge.get("conflict_type", ""),
                        "claude_severity_prior": edge.get("claude_severity_prior", "LOW"),
                        "gemini_confidence": edge.get("gemini_confidence", "LOW"),
                        "source_batch": edge.get("source_batch", ""),
                        "accepted_by_session": edge.get("accepted_by_session", ""),
                        "steelman_reconciliation": edge.get("steelman_reconciliation_excerpt", ""),
                    }),
                ),
            )
            written += 1

    logger.info("persist_contradicts_edges: %d edges written.", written)
    return written


if __name__ == "__main__":
    import sys
    root = sys.argv[1] if len(sys.argv) > 1 else str(Path(__file__).resolve().parents[3])
    main(root)
