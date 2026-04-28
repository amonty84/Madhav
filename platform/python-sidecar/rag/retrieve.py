"""
retrieve — MARSYS-JIS RAG Pipeline hybrid retrieval library.
Phase B.6. Madhav_M2A_Exec_12 (2026-04-27).
Per PHASE_B_PLAN_v1_0.md §B.6 + CLAUDECODE_BRIEF_M2A_Exec_12 §6–§8.

Public API:
  retrieve(query, mode, k, rerank) -> list[RetrievalResult]

Modes: vector | bm25 | graph_walk | hybrid_rrf | auto
Reranker: Vertex AI Ranking API (preferred) or cross-encoder/ms-marco-MiniLM-L-6-v2 (fallback).
Layer-balance enforcer: ≥1 chunk per {l1_fact, msr_signal, ucn_section, domain_report, cgm_node}.
Whole-Chart-Read invariant (B.11): auto-include top-1 UCN + top-1 CDLM for interpretive queries.
"""
from __future__ import annotations

import hashlib
import json
import logging
import os
import re
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Literal

logger = logging.getLogger(__name__)

# ── Constants ─────────────────────────────────────────────────────────────────

_PROJECT_ROOT = Path(__file__).resolve().parents[3]
_UCN_MAP_PATH = _PROJECT_ROOT / "verification_artifacts" / "RAG" / "ucn_section_node_map.json"

RRF_K = 60
OVERSAMPLE_FACTOR = 3
EDGE_TYPE_WEIGHTS = {"SUPPORTS": 1.0, "CONTRADICTS": 0.8, "CITES": 0.6}
CGM_BOOST = 0.3
LAYER_DOC_TYPES = {"l1_fact", "msr_signal", "ucn_section", "domain_report", "cgm_node"}

PLANET_KEYWORDS = {
    "sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn",
    "rahu", "ketu", "lagna", "ascendant",
    "surya", "chandra", "mangal", "budh", "guru", "shukra", "shani",
}
HOUSE_RE = re.compile(r"\b(\d{1,2})(st|nd|rd|th)?\s*house\b", re.IGNORECASE)
SIGN_KEYWORDS = {
    "aries", "taurus", "gemini", "cancer", "leo", "virgo",
    "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
    "mesha", "vrishabha", "mithuna", "karka", "simha", "kanya",
    "tula", "vrischika", "dhanus", "makara", "kumbha", "meena",
}
UCN_KEYWORDS = {
    "soul", "mission", "life purpose", "core narrative", "psychological core",
    "dharma", "karma", "spiritual", "inner",
}

# ── Reranker selection (module-level probe at first retrieve() call) ──────────

RERANKER_SELECTED: str = "not_initialized"
_reranker_model = None  # cross-encoder model instance if selected
_reranker_initialized = False


def _probe_vertex_ranking_api(n_probes: int = 5) -> bool:
    """
    Probe Vertex AI Ranking API in asia-south1. Returns True if accessible with p95 ≤ 200ms.
    Uses google-cloud-aiplatform RankingServiceClient if available.
    """
    try:
        from google.cloud import discoveryengine_v1alpha as discoveryengine
        client = discoveryengine.RankServiceClient(
            client_options={"api_endpoint": "discoveryengine.googleapis.com"}
        )
        # Minimal probe: if client initializes, test a ranking call
        project = os.environ.get("GCP_PROJECT", "")
        if not project:
            return False

        request = discoveryengine.RankRequest(
            ranking_config=(
                f"projects/{project}/locations/global/rankingConfigs/default_ranking_config"
            ),
            model="semantic-ranker-512@latest",
            query="Saturn 7th house",
            records=[
                discoveryengine.RankingRecord(id="probe-1", content="Saturn in Libra 7th house."),
                discoveryengine.RankingRecord(id="probe-2", content="Moon in Scorpio 8th house."),
            ],
        )
        latencies = []
        for _ in range(n_probes):
            t0 = time.perf_counter()
            client.rank(request=request)
            latencies.append((time.perf_counter() - t0) * 1000.0)

        p95 = sorted(latencies)[int(0.95 * len(latencies))]
        logger.info("[retrieve] Vertex Ranking API probe p95=%.1fms", p95)
        return p95 <= 200.0
    except Exception as exc:
        logger.info("[retrieve] Vertex Ranking API unavailable: %s", exc)
        return False


def _init_reranker() -> None:
    global RERANKER_SELECTED, _reranker_model, _reranker_initialized
    if _reranker_initialized:
        return

    if _probe_vertex_ranking_api():
        RERANKER_SELECTED = "vertex"
        logger.info("[retrieve] Reranker selected: vertex")
    else:
        try:
            from sentence_transformers import CrossEncoder
            _reranker_model = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
            RERANKER_SELECTED = "cross_encoder"
            logger.info("[retrieve] Reranker selected: cross_encoder")
        except Exception as exc:
            logger.warning("[retrieve] [RERANKER_UNAVAILABLE] %s", exc)
            RERANKER_SELECTED = "unavailable"

    _reranker_initialized = True


# ── BM25 index cache ──────────────────────────────────────────────────────────

_bm25_cache: dict = {}  # keys: "index", "chunk_ids", "row_count_hash"


def _get_bm25_index():
    """Build BM25 index over all non-stale chunk texts. Cached by DB row count hash."""
    import psycopg
    from rank_bm25 import BM25Okapi

    db_url = _db_url()
    with psycopg.connect(db_url) as conn:
        row_count = conn.execute(
            "SELECT count(*) FROM rag_chunks WHERE is_stale = false"
        ).fetchone()[0]

    row_count_hash = str(row_count)
    if _bm25_cache.get("row_count_hash") == row_count_hash and _bm25_cache.get("index"):
        return _bm25_cache["index"], _bm25_cache["chunk_ids"], _bm25_cache["chunks"]

    with psycopg.connect(db_url) as conn:
        rows = conn.execute(
            "SELECT chunk_id, doc_type, content, metadata FROM rag_chunks WHERE is_stale = false"
        ).fetchall()

    chunk_ids = [r[0] for r in rows]
    doc_types = [r[1] for r in rows]
    texts = [r[2] for r in rows]
    metadatas = []
    for r in rows:
        try:
            md = json.loads(r[3]) if isinstance(r[3], str) else (r[3] or {})
        except Exception:
            md = {}
        metadatas.append(md)

    tokenized = [t.lower().split() for t in texts]
    index = BM25Okapi(tokenized)

    chunks = [
        {"chunk_id": chunk_ids[i], "doc_type": doc_types[i],
         "content": texts[i], "metadata": metadatas[i]}
        for i in range(len(chunk_ids))
    ]

    _bm25_cache["index"] = index
    _bm25_cache["chunk_ids"] = chunk_ids
    _bm25_cache["chunks"] = chunks
    _bm25_cache["row_count_hash"] = row_count_hash
    logger.info("[retrieve] BM25 index built over %d chunks", len(chunk_ids))
    return index, chunk_ids, chunks


# ── NetworkX graph cache ──────────────────────────────────────────────────────

_graph_cache: dict = {}


def _get_nx_graph():
    """Load rag_graph_edges into a NetworkX DiGraph. Cached for session lifetime."""
    if _graph_cache.get("G"):
        return _graph_cache["G"]

    import psycopg
    import networkx as nx

    db_url = _db_url()
    with psycopg.connect(db_url) as conn:
        edges = conn.execute(
            "SELECT source_node_id, target_node_id, edge_type, weight "
            "FROM rag_graph_edges"
        ).fetchall()
        nodes = conn.execute(
            "SELECT node_id, node_type, chunk_id FROM rag_graph_nodes"
        ).fetchall()

    G = nx.DiGraph()
    for n in nodes:
        G.add_node(n[0], node_type=n[1], chunk_id=n[2])
    for e in edges:
        G.add_edge(e[0], e[1], edge_type=e[2], weight=float(e[3] or 1.0))

    _graph_cache["G"] = G
    logger.info("[retrieve] NX graph loaded: %d nodes, %d edges", G.number_of_nodes(), G.number_of_edges())
    return G


# ── RetrievalResult dataclass ─────────────────────────────────────────────────

@dataclass
class RetrievalResult:
    chunk_id: str
    doc_type: str
    score: float
    rank: int
    text: str
    metadata: dict = field(default_factory=dict)
    retrieval_mode: str = "hybrid_rrf"


# ── DB helpers ────────────────────────────────────────────────────────────────

def _db_url() -> str:
    url = os.environ.get("DATABASE_URL", "")
    if not url:
        raise RuntimeError(
            "[STOP] DATABASE_URL not set. "
            "Add DATABASE_URL=postgresql://... to .env.rag and start the Auth Proxy."
        )
    return url


def _fetch_chunks_by_ids(chunk_ids: list[str]) -> dict[str, dict]:
    """Fetch chunk rows by chunk_id. Returns dict[chunk_id → row_dict]."""
    if not chunk_ids:
        return {}
    import psycopg

    with psycopg.connect(_db_url()) as conn:
        rows = conn.execute(
            "SELECT chunk_id, doc_type, content, metadata FROM rag_chunks WHERE chunk_id = ANY(%s)",
            (chunk_ids,),
        ).fetchall()

    result = {}
    for r in rows:
        try:
            md = json.loads(r[3]) if isinstance(r[3], str) else (r[3] or {})
        except Exception:
            md = {}
        result[r[0]] = {"chunk_id": r[0], "doc_type": r[1], "content": r[2], "metadata": md}
    return result


# ── Query classification helpers ──────────────────────────────────────────────

def _is_chart_state_query(query: str) -> bool:
    q = query.lower()
    if any(p in q for p in PLANET_KEYWORDS):
        return True
    if HOUSE_RE.search(q):
        return True
    if any(s in q for s in SIGN_KEYWORDS):
        return True
    return False


def _is_ucn_interpretive_query(query: str) -> bool:
    q = query.lower()
    return any(kw in q for kw in UCN_KEYWORDS)


# ── Vector mode (AC.1) ────────────────────────────────────────────────────────

def _retrieve_vector(query: str, k: int) -> list[RetrievalResult]:
    import psycopg
    import numpy as np
    from pgvector.psycopg import register_vector
    from rag.embed import _embed_batch, _init_vertexai

    _init_vertexai()
    query_vecs = _embed_batch([query], task_type="RETRIEVAL_QUERY")
    vec = np.array(query_vecs[0], dtype=np.float32)

    limit = k * OVERSAMPLE_FACTOR
    with psycopg.connect(_db_url()) as conn:
        register_vector(conn)
        rows = conn.execute(
            """
            SELECT rc.chunk_id, rc.doc_type, rc.content, rc.metadata,
                   (1 - (re.embedding <=> %s))::float AS similarity
            FROM rag_embeddings re
            JOIN rag_chunks rc ON re.chunk_id = rc.chunk_id
            WHERE rc.is_stale = false
            ORDER BY re.embedding <=> %s
            LIMIT %s
            """,
            (vec, vec, limit),
        ).fetchall()

    results = []
    for rank, r in enumerate(rows[:k], start=1):
        try:
            md = json.loads(r[3]) if isinstance(r[3], str) else (r[3] or {})
        except Exception:
            md = {}
        results.append(RetrievalResult(
            chunk_id=r[0], doc_type=r[1], score=float(r[4]),
            rank=rank, text=r[2], metadata=md, retrieval_mode="vector",
        ))
    return results


# ── BM25 mode (AC.2) ──────────────────────────────────────────────────────────

def _retrieve_bm25(query: str, k: int) -> list[RetrievalResult]:
    index, chunk_ids, chunks = _get_bm25_index()
    tokenized_query = query.lower().split()
    raw_scores = index.get_scores(tokenized_query)

    max_score = max(raw_scores) if max(raw_scores) > 0 else 1.0
    scored = sorted(enumerate(raw_scores), key=lambda x: x[1], reverse=True)[:k]

    results = []
    for rank, (idx, score) in enumerate(scored, start=1):
        normalized = float(score) / max_score
        results.append(RetrievalResult(
            chunk_id=chunks[idx]["chunk_id"],
            doc_type=chunks[idx]["doc_type"],
            score=normalized,
            rank=rank,
            text=chunks[idx]["content"],
            metadata=chunks[idx]["metadata"],
            retrieval_mode="bm25",
        ))
    return results


# ── Graph walk mode (AC.3) ────────────────────────────────────────────────────

def _retrieve_graph_walk(query: str, k: int, apply_cgm_boost: bool = False) -> list[RetrievalResult]:
    """Seed from top-5 vector results; expand 1 hop along SUPPORTS/CONTRADICTS/CITES."""
    vector_seeds = _retrieve_vector(query, k=5)
    seed_chunk_ids = {r.chunk_id for r in vector_seeds}

    G = _get_nx_graph()

    # Map chunk_id → node_id (nodes may use chunk_id or signal/fact IDs)
    seed_nodes = set()
    for node_id, attrs in G.nodes(data=True):
        if attrs.get("chunk_id") in seed_chunk_ids or node_id in seed_chunk_ids:
            seed_nodes.add(node_id)

    neighbor_scores: dict[str, float] = {}
    for seed in seed_nodes:
        for target in G.successors(seed):
            edge_data = G.get_edge_data(seed, target) or {}
            edge_type = edge_data.get("edge_type", "CITES")
            weight = EDGE_TYPE_WEIGHTS.get(edge_type, 0.5)
            score = weight / 1  # hop_distance = 1
            if target not in neighbor_scores or neighbor_scores[target] < score:
                neighbor_scores[target] = score
        for pred in G.predecessors(seed):
            edge_data = G.get_edge_data(pred, seed) or {}
            edge_type = edge_data.get("edge_type", "CITES")
            weight = EDGE_TYPE_WEIGHTS.get(edge_type, 0.5)
            score = weight / 1
            if pred not in neighbor_scores or neighbor_scores[pred] < score:
                neighbor_scores[pred] = score

    # Remove seeds themselves from neighbor set
    for s in seed_nodes:
        neighbor_scores.pop(s, None)

    # Resolve chunk_ids for neighbors
    neighbor_chunk_ids = []
    for node_id in neighbor_scores:
        attrs = G.nodes.get(node_id, {})
        cid = attrs.get("chunk_id") or (node_id if not node_id.startswith("DOM.") else None)
        if cid:
            neighbor_chunk_ids.append(cid)

    if not neighbor_chunk_ids:
        return []

    chunk_data = _fetch_chunks_by_ids(neighbor_chunk_ids)

    candidates: list[tuple[str, float, dict]] = []
    for node_id, score in neighbor_scores.items():
        attrs = G.nodes.get(node_id, {})
        cid = attrs.get("chunk_id") or (node_id if not node_id.startswith("DOM.") else None)
        if not cid or cid not in chunk_data:
            continue
        row = chunk_data[cid]
        if apply_cgm_boost and row["doc_type"] == "cgm_node":
            score += CGM_BOOST
            row["metadata"]["cgm_boost_applied"] = True
        candidates.append((cid, score, row))

    # Also include seed chunks
    for r in vector_seeds:
        if r.chunk_id not in {c[0] for c in candidates}:
            cdata = _fetch_chunks_by_ids([r.chunk_id]).get(r.chunk_id)
            if cdata:
                candidates.append((r.chunk_id, r.score, cdata))

    # Deduplicate and sort: score desc, then chunk_id asc for ties
    seen = set()
    deduped = []
    for cid, score, row in sorted(candidates, key=lambda x: (-x[1], x[0])):
        if cid not in seen:
            seen.add(cid)
            deduped.append((cid, score, row))

    results = []
    for rank, (cid, score, row) in enumerate(deduped[:k], start=1):
        results.append(RetrievalResult(
            chunk_id=cid, doc_type=row["doc_type"], score=score,
            rank=rank, text=row["content"], metadata=row["metadata"],
            retrieval_mode="graph_walk",
        ))
    return results


# ── RRF fusion (AC.4) ─────────────────────────────────────────────────────────

def _rrf_fuse(
    results_by_mode: dict[str, list[RetrievalResult]],
    k_rrf: int = RRF_K,
) -> dict[str, float]:
    """Compute RRF scores across all modes. Returns dict[chunk_id → rrf_score]."""
    scores: dict[str, float] = {}
    for mode_results in results_by_mode.values():
        for r in mode_results:
            scores[r.chunk_id] = scores.get(r.chunk_id, 0.0) + 1.0 / (k_rrf + r.rank)
    return scores


def _layer_balance_enforcer(
    top_k_results: list[RetrievalResult],
    k: int,
) -> list[RetrievalResult]:
    """
    Ensure ≥1 chunk per each doc_type in LAYER_DOC_TYPES.
    Force-inserts the highest-ranked missing type from DB if absent.
    Expands beyond k if needed.
    """
    import psycopg

    present_types = {r.doc_type for r in top_k_results}
    missing_types = LAYER_DOC_TYPES - present_types

    for dt in missing_types:
        try:
            with psycopg.connect(_db_url()) as conn:
                row = conn.execute(
                    "SELECT chunk_id, doc_type, content, metadata "
                    "FROM rag_chunks WHERE doc_type = %s AND is_stale = false LIMIT 1",
                    (dt,),
                ).fetchone()
        except Exception:
            row = None

        if not row:
            # No chunks of this type exist — skip and record
            for r in top_k_results:
                r.metadata.setdefault("layer_balance_skipped", []).append(dt)
            continue

        try:
            md = json.loads(row[3]) if isinstance(row[3], str) else (row[3] or {})
        except Exception:
            md = {}
        md["layer_balance_inserted"] = True

        inserted = RetrievalResult(
            chunk_id=row[0], doc_type=row[1],
            score=0.0, rank=len(top_k_results) + 1,
            text=row[2], metadata=md,
            retrieval_mode="layer_balance_insert",
        )
        top_k_results.append(inserted)
        logger.info("[retrieve] Layer balance: inserted %s chunk %s", dt, row[0])

    # Re-rank after insertions
    for i, r in enumerate(top_k_results, start=1):
        r.rank = i
    return top_k_results


def _retrieve_hybrid_rrf(query: str, k: int) -> list[RetrievalResult]:
    apply_boost = _is_chart_state_query(query)
    results_by_mode = {
        "vector": _retrieve_vector(query, k),
        "bm25": _retrieve_bm25(query, k),
        "graph_walk": _retrieve_graph_walk(query, k, apply_cgm_boost=apply_boost),
    }

    rrf_scores = _rrf_fuse(results_by_mode)

    # Collect all chunks with metadata from any mode result
    chunk_meta: dict[str, RetrievalResult] = {}
    for mode_results in results_by_mode.values():
        for r in mode_results:
            if r.chunk_id not in chunk_meta:
                chunk_meta[r.chunk_id] = r

    ranked = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)[:k]
    top_k: list[RetrievalResult] = []
    for rank, (cid, score) in enumerate(ranked, start=1):
        base = chunk_meta[cid]
        top_k.append(RetrievalResult(
            chunk_id=cid, doc_type=base.doc_type, score=score,
            rank=rank, text=base.text, metadata=dict(base.metadata),
            retrieval_mode="hybrid_rrf",
        ))

    top_k = _layer_balance_enforcer(top_k, k)
    return top_k


# ── Reranker application (AC.5) ───────────────────────────────────────────────

def _apply_reranker(query: str, candidates: list[RetrievalResult]) -> list[RetrievalResult]:
    """Rerank top-min(50, k*3) candidates using selected reranker."""
    _init_reranker()

    if RERANKER_SELECTED == "vertex":
        try:
            from google.cloud import discoveryengine_v1alpha as discoveryengine
            project = os.environ.get("GCP_PROJECT", "")
            client = discoveryengine.RankServiceClient()
            records = [
                discoveryengine.RankingRecord(id=r.chunk_id, content=r.text[:512])
                for r in candidates
            ]
            request = discoveryengine.RankRequest(
                ranking_config=(
                    f"projects/{project}/locations/global/rankingConfigs/default_ranking_config"
                ),
                model="semantic-ranker-512@latest",
                query=query,
                records=records,
            )
            response = client.rank(request=request)
            score_map = {rec.id: rec.score for rec in response.records}
            for r in candidates:
                r.score = float(score_map.get(r.chunk_id, r.score))
        except Exception as exc:
            logger.warning("[retrieve] Vertex reranker failed at apply time: %s; skipping", exc)

    elif RERANKER_SELECTED == "cross_encoder" and _reranker_model is not None:
        pairs = [(query, r.text) for r in candidates]
        scores = _reranker_model.predict(pairs)
        for r, s in zip(candidates, scores):
            r.score = float(s)

    ranked = sorted(candidates, key=lambda r: r.score, reverse=True)
    for i, r in enumerate(ranked, start=1):
        r.rank = i
    return ranked


# ── Whole-Chart-Read invariant (B.11) ─────────────────────────────────────────

def _apply_whole_chart_read(results: list[RetrievalResult]) -> list[RetrievalResult]:
    """
    For interpretive auto-mode queries: auto-include top-1 UCN + top-1 CDLM chunk.
    Appends beyond k if not already present. Soft enforcement at B.6.
    """
    present_ucn = any(r.doc_type == "ucn_section" for r in results)
    present_cdlm = any(r.doc_type == "cdlm_cell" for r in results)

    additions = []
    if not present_ucn:
        ucn = _fetch_top_doc_type("ucn_section")
        if ucn:
            ucn.metadata["whole_chart_read_inserted"] = True
            additions.append(ucn)
    if not present_cdlm:
        cdlm = _fetch_top_doc_type("cdlm_cell")
        if cdlm:
            cdlm.metadata["whole_chart_read_inserted"] = True
            additions.append(cdlm)

    combined = results + additions
    for i, r in enumerate(combined, start=1):
        r.rank = i

    # Soft enforcement: call p3 validator and log; do not raise
    try:
        from rag.validators import p3_whole_chart_read
        if hasattr(p3_whole_chart_read, "validate"):
            p3_whole_chart_read.validate(combined)
    except Exception as exc:
        logger.warning("[retrieve] p3 whole-chart-read validation: %s", exc)

    return combined


def _fetch_top_doc_type(doc_type: str) -> RetrievalResult | None:
    """Fetch the first non-stale chunk of a given doc_type."""
    import psycopg
    try:
        with psycopg.connect(_db_url()) as conn:
            row = conn.execute(
                "SELECT chunk_id, doc_type, content, metadata "
                "FROM rag_chunks WHERE doc_type = %s AND is_stale = false LIMIT 1",
                (doc_type,),
            ).fetchone()
    except Exception:
        return None

    if not row:
        return None
    try:
        md = json.loads(row[3]) if isinstance(row[3], str) else (row[3] or {})
    except Exception:
        md = {}
    return RetrievalResult(
        chunk_id=row[0], doc_type=row[1], score=0.0, rank=0,
        text=row[2], metadata=md, retrieval_mode="whole_chart_read_insert",
    )


# ── Auto mode (AC.5) ──────────────────────────────────────────────────────────

def _retrieve_auto(query: str, k: int, rerank: bool) -> list[RetrievalResult]:
    if _is_chart_state_query(query):
        results = _retrieve_graph_walk(query, k, apply_cgm_boost=True)
        results = _layer_balance_enforcer(results, k)
        for r in results:
            r.metadata["auto_mode_selected"] = "graph_walk"
        if rerank and results:
            results = _apply_reranker(query, results[:min(50, k * OVERSAMPLE_FACTOR)])
            results = _layer_balance_enforcer(results, k)
    elif _is_ucn_interpretive_query(query):
        results = _retrieve_vector(query, k)
        for r in results:
            r.metadata["auto_mode_selected"] = "vector"
        results = _apply_whole_chart_read(results)
        if rerank and results:
            results = _apply_reranker(query, results[:min(50, k * OVERSAMPLE_FACTOR)])
    else:
        results = _retrieve_hybrid_rrf(query, k)
        for r in results:
            r.metadata["auto_mode_selected"] = "hybrid_rrf"
        if rerank and results:
            results = _apply_reranker(query, results[:min(50, k * OVERSAMPLE_FACTOR)])
            results = _layer_balance_enforcer(results, k)

    return results


# ── Public entry point ────────────────────────────────────────────────────────

def retrieve(
    query: str,
    mode: Literal["vector", "bm25", "graph_walk", "hybrid_rrf", "auto"] = "hybrid_rrf",
    k: int = 10,
    rerank: bool = True,
) -> list[RetrievalResult]:
    """
    Retrieve top-k chunks for the given query.

    Args:
        query:  Natural language query string.
        mode:   Retrieval mode (vector | bm25 | graph_walk | hybrid_rrf | auto).
        k:      Number of results to return.
        rerank: Whether to apply the selected reranker after initial retrieval.

    Returns:
        List of RetrievalResult, sorted by score descending, 1-indexed rank.
    """
    logger.debug("[retrieve] query=%r mode=%s k=%d rerank=%s", query, mode, k, rerank)

    if mode == "vector":
        results = _retrieve_vector(query, k)
    elif mode == "bm25":
        results = _retrieve_bm25(query, k)
    elif mode == "graph_walk":
        apply_boost = _is_chart_state_query(query)
        results = _retrieve_graph_walk(query, k, apply_cgm_boost=apply_boost)
    elif mode == "hybrid_rrf":
        results = _retrieve_hybrid_rrf(query, k)
        if rerank and results:
            _init_reranker()
            results = _apply_reranker(query, results[:min(50, k * OVERSAMPLE_FACTOR)])
            results = _layer_balance_enforcer(results, k)
    elif mode == "auto":
        results = _retrieve_auto(query, k, rerank)
    else:
        raise ValueError(f"Unknown retrieval mode: {mode!r}")

    # Ensure rank is 1-indexed and sequential
    for i, r in enumerate(results, start=1):
        r.rank = i

    return results
