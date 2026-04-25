"""
embed — AM-JIS RAG Pipeline embedding generator.
Phase B.3. Per M2A_EXEC_PLAN_v1_0.md §PLAN B.3 Task 1 + CLAUDECODE_BRIEF v5.0 §SESSION_4.

Vertex AI text-multilingual-embedding-002 (768-dim) replaces Voyage-3-large.
Uses Application Default Credentials — no API key required.
Pre-embedding enrichment: [{layer}] [{doc_type}] prefix.
Content-hash idempotency: skip chunks already in rag_embeddings.
Halt policy: any Vertex AI error → log unindexed chunks to unindexed_chunks.jsonl; STOP.
HNSW index: CREATE INDEX IF NOT EXISTS after all batches (m=16, ef_construction=64).
"""
from __future__ import annotations

import json
import logging
import os
import statistics
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import numpy as np
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

# ── Constants ────────────────────────────────────────────────────────────────

EMBED_MODEL = "text-multilingual-embedding-002"
EMBED_DIM = 768
BATCH_SIZE = 10  # Vertex AI text-multilingual-embedding-002 limit: 20k tokens/request
SANITY_QUERY = "Saturn 7th house Libra"
LATENCY_SAMPLE_COUNT = 100
UNINDEXED_LOG = "verification_artifacts/RAG/unindexed_chunks.jsonl"
SANITY_JSON = "verification_artifacts/RAG/b3_sanity_test.json"

# ── Environment loading ───────────────────────────────────────────────────────


def _load_env(repo_root: str) -> None:
    load_dotenv(Path(repo_root) / ".env.rag", override=False)


# ── Cloud SQL (psycopg) helpers ───────────────────────────────────────────────


def _db_url() -> str:
    url = os.environ.get("DATABASE_URL", "")
    if not url:
        raise RuntimeError(
            "[STOP] DATABASE_URL not set. "
            "Add DATABASE_URL=postgresql://... to .env.rag and start the Auth Proxy."
        )
    return url


# ── Chunk + embedding data access (psycopg) ──────────────────────────────────


def get_non_stale_chunks(repo_root: str) -> list[dict[str, Any]]:
    """Fetch all non-stale chunks from rag_chunks via psycopg."""
    import psycopg

    with psycopg.connect(_db_url()) as conn:
        rows = conn.execute(
            "SELECT chunk_id, content, layer, doc_type "
            "FROM rag_chunks WHERE is_stale = false"
        ).fetchall()
    result = [
        {"chunk_id": r[0], "content": r[1], "layer": r[2], "doc_type": r[3]}
        for r in rows
    ]
    logger.info("Fetched %d non-stale chunks from rag_chunks.", len(result))
    return result


def get_embedded_ids(repo_root: str) -> set[str]:
    """Return set of chunk_ids already present in rag_embeddings (idempotency check)."""
    import psycopg

    with psycopg.connect(_db_url()) as conn:
        rows = conn.execute("SELECT chunk_id FROM rag_embeddings").fetchall()
    ids = {r[0] for r in rows}
    logger.info("Found %d already-embedded chunk IDs.", len(ids))
    return ids


# ── Pre-embedding text enrichment ────────────────────────────────────────────


def _enrich_text(chunk: dict[str, Any]) -> str:
    """
    Prefix chunk content with [{layer}] [{doc_type}] per M2A_EXEC_PLAN §PLAN B.3 Task 1.
    Layer-conditioning improves retrieval precision across L1/L2.5/L3 boundaries.
    """
    return f"[{chunk['layer']}] [{chunk['doc_type']}]\n{chunk['content']}"


# ── Vertex AI embedding ───────────────────────────────────────────────────────


def _init_vertexai() -> None:
    import vertexai

    project = os.environ.get("GCP_PROJECT", "")
    # Vertex AI text embedding models are available in us-central1 globally;
    # use that regardless of where Cloud SQL is hosted.
    vertexai.init(project=project, location="us-central1")


def _embed_batch(texts: list[str], task_type: str = "RETRIEVAL_DOCUMENT") -> list[list[float]]:
    """
    Call Vertex AI text-multilingual-embedding-002 for one batch.
    Returns list of 768-dim float vectors.
    Any API error propagates to caller (which applies halt policy).
    """
    from vertexai.language_models import TextEmbeddingInput, TextEmbeddingModel

    model = TextEmbeddingModel.from_pretrained(EMBED_MODEL)
    inputs = [TextEmbeddingInput(text, task_type) for text in texts]
    result = model.get_embeddings(inputs)
    return [e.values for e in result]


# ── Embedding writes (psycopg) ────────────────────────────────────────────────


def _write_embedding_batch(rows: list[dict[str, Any]]) -> None:
    """
    Upsert a batch of embedding rows to rag_embeddings via psycopg.
    Each row: {chunk_id, model, embedding (list[float])}.
    ON CONFLICT (chunk_id, model) DO UPDATE — idempotent.
    """
    import psycopg
    from pgvector.psycopg import register_vector

    with psycopg.connect(_db_url(), autocommit=True) as conn:
        register_vector(conn)
        for row in rows:
            vec = np.array(row["embedding"], dtype=np.float32)
            conn.execute(
                """
                INSERT INTO rag_embeddings (chunk_id, model, embedding)
                VALUES (%s, %s, %s)
                ON CONFLICT (chunk_id, model) DO UPDATE
                  SET embedding = EXCLUDED.embedding
                """,
                (row["chunk_id"], row["model"], vec),
            )


# ── Unindexed chunk log ───────────────────────────────────────────────────────


def _log_unindexed(repo_root: str, chunk_ids: list[str], error_msg: str) -> None:
    out = Path(repo_root) / UNINDEXED_LOG
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", encoding="utf-8") as f:
        for cid in chunk_ids:
            f.write(json.dumps({"chunk_id": cid, "error": error_msg}) + "\n")
    logger.error("Halt: logged %d unindexed chunk IDs to %s", len(chunk_ids), out)


# ── HNSW index management ─────────────────────────────────────────────────────


def _ensure_hnsw_index() -> bool:
    """
    Create HNSW index on rag_embeddings if absent.
    Returns True if index exists after the call.
    """
    import psycopg
    from pgvector.psycopg import register_vector

    with psycopg.connect(_db_url(), autocommit=True) as conn:
        register_vector(conn)
        conn.execute(
            """
            CREATE INDEX IF NOT EXISTS idx_rag_embeddings_hnsw
            ON rag_embeddings
            USING hnsw (embedding vector_cosine_ops)
            WITH (m = 16, ef_construction = 64)
            """
        )
        row = conn.execute(
            "SELECT indexname FROM pg_indexes "
            "WHERE tablename='rag_embeddings' AND indexname LIKE '%hnsw%'"
        ).fetchone()
    exists = row is not None
    logger.info("HNSW index present: %s", exists)
    return exists


# ── Vector similarity queries ─────────────────────────────────────────────────


def _vector_query(query_vec: list[float], limit: int = 3) -> list[dict[str, Any]]:
    """Cosine similarity search against rag_embeddings JOIN rag_chunks."""
    import psycopg
    from pgvector.psycopg import register_vector

    vec = np.array(query_vec, dtype=np.float32)
    with psycopg.connect(_db_url()) as conn:
        register_vector(conn)
        rows = conn.execute(
            """
            SELECT rc.chunk_id, rc.doc_type, rc.layer, rc.content,
                   (1 - (re.embedding <=> %s))::float AS similarity
            FROM rag_embeddings re
            JOIN rag_chunks rc ON re.chunk_id = rc.chunk_id
            WHERE rc.is_stale = false
            ORDER BY re.embedding <=> %s
            LIMIT %s
            """,
            (vec, vec, limit),
        ).fetchall()
    return [
        {
            "chunk_id": r[0],
            "doc_type": r[1],
            "layer": r[2],
            "content_preview": r[3][:200],
            "similarity": round(r[4], 6),
        }
        for r in rows
    ]


def _measure_hnsw_latency(n: int = LATENCY_SAMPLE_COUNT) -> dict[str, float]:
    """Run n random 768-dim vector queries; measure wall-clock latency per query."""
    import psycopg
    from pgvector.psycopg import register_vector

    latencies: list[float] = []
    with psycopg.connect(_db_url()) as conn:
        register_vector(conn)
        for _ in range(n):
            vec = np.random.randn(EMBED_DIM).astype(np.float32)
            vec /= np.linalg.norm(vec)
            t0 = time.perf_counter()
            conn.execute(
                "SELECT chunk_id FROM rag_embeddings ORDER BY embedding <=> %s LIMIT 3",
                (vec,),
            ).fetchall()
            latencies.append((time.perf_counter() - t0) * 1000.0)

    sorted_lat = sorted(latencies)
    p95_idx = int(0.95 * len(sorted_lat))
    return {
        "min_ms": round(sorted_lat[0], 3),
        "max_ms": round(sorted_lat[-1], 3),
        "p50_ms": round(statistics.median(sorted_lat), 3),
        "p95_ms": round(sorted_lat[p95_idx], 3),
        "mean_ms": round(statistics.mean(sorted_lat), 3),
        "sample_count": n,
    }


# ── Sanity test ───────────────────────────────────────────────────────────────


def _run_sanity_test() -> dict[str, Any]:
    """Embed SANITY_QUERY, retrieve top-3, measure HNSW p95 latency."""
    logger.info("Embedding sanity query: '%s'", SANITY_QUERY)
    query_vecs = _embed_batch([SANITY_QUERY], task_type="RETRIEVAL_QUERY")
    query_vec = query_vecs[0]

    top_3 = _vector_query(query_vec, limit=3)
    distinct_doc_types = len({r["doc_type"] for r in top_3})

    logger.info("Measuring HNSW p95 latency (%d random queries)...", LATENCY_SAMPLE_COUNT)
    latency = _measure_hnsw_latency()

    return {
        "query": SANITY_QUERY,
        "top_3": top_3,
        "doc_type_distinct_count": distinct_doc_types,
        "hnsw_latency": latency,
        "ac_b3_4_pass": distinct_doc_types >= 2,
        "ac_b3_3_pass": latency["p95_ms"] < 50.0,
    }


# ── Main embed orchestration ──────────────────────────────────────────────────


def embed_corpus(repo_root: str = ".") -> dict[str, Any]:
    """
    B.3 Task 1: full embedding pipeline.

    1. Fetch non-stale chunks from rag_chunks.
    2. Skip chunks already in rag_embeddings (idempotency).
    3. Batch-embed with Vertex AI text-multilingual-embedding-002 (batch size 100).
    4. Write embeddings to rag_embeddings via psycopg.
    5. Halt on any Vertex AI error: log unindexed chunks; raise RuntimeError.
    6. Ensure HNSW index after all batches.
    """
    _load_env(repo_root)
    _init_vertexai()

    all_chunks = get_non_stale_chunks(repo_root)
    if not all_chunks:
        raise RuntimeError("[STOP] rag_chunks is empty — B.2 must complete before B.3.")

    already_embedded = get_embedded_ids(repo_root)
    to_embed = [c for c in all_chunks if c["chunk_id"] not in already_embedded]
    logger.info(
        "Chunks to embed: %d (total non-stale: %d, already done: %d)",
        len(to_embed), len(all_chunks), len(already_embedded),
    )

    embedded_count = 0
    for batch_start in range(0, len(to_embed), BATCH_SIZE):
        batch = to_embed[batch_start : batch_start + BATCH_SIZE]
        texts = [_enrich_text(c) for c in batch]

        try:
            embeddings = _embed_batch(texts, task_type="RETRIEVAL_DOCUMENT")
        except Exception as exc:
            unindexed_ids = [c["chunk_id"] for c in to_embed[batch_start:]]
            _log_unindexed(repo_root, unindexed_ids, str(exc))
            raise RuntimeError(
                f"[STOP] Vertex AI error at batch starting {batch_start}: {exc}\n"
                f"Unindexed chunk IDs logged to {UNINDEXED_LOG}."
            ) from exc

        rows = [
            {"chunk_id": c["chunk_id"], "model": EMBED_MODEL, "embedding": emb}
            for c, emb in zip(batch, embeddings)
        ]
        _write_embedding_batch(rows)
        embedded_count += len(batch)
        logger.info(
            "Embedded batch %d–%d (%d total so far).",
            batch_start, batch_start + len(batch) - 1, embedded_count,
        )

    logger.info("Embedding complete. %d new chunks embedded.", embedded_count)

    hnsw_ok = _ensure_hnsw_index()
    if not hnsw_ok:
        raise RuntimeError("[STOP] HNSW index creation failed — not found after CREATE.")

    total_embedded = len(already_embedded) + embedded_count
    non_stale_count = len(all_chunks)
    if abs(total_embedded - non_stale_count) > 5:
        raise RuntimeError(
            f"[STOP] Embedding gap: total_embedded={total_embedded} "
            f"but non_stale_chunk_count={non_stale_count}. "
            "Verify Vertex AI completed all batches."
        )

    return {
        "non_stale_chunk_count": non_stale_count,
        "already_embedded_at_start": len(already_embedded),
        "newly_embedded": embedded_count,
        "total_embedded": total_embedded,
        "hnsw_index_present": hnsw_ok,
        "embedding_model": EMBED_MODEL,
        "embed_dim": EMBED_DIM,
    }


def run_sanity_test(repo_root: str = ".") -> dict[str, Any]:
    """B.3 Task 2: sanity retrieval test. Produces b3_sanity_test.json."""
    _load_env(repo_root)
    _init_vertexai()

    sanity = _run_sanity_test()

    result = {
        "produced_at": datetime.now(timezone.utc).isoformat(),
        "producer": "embed.py — M2A-Exec Session 4 (Madhav_M2A_Exec_4)",
        "embedding_model": EMBED_MODEL,
        **sanity,
    }

    out_path = Path(repo_root) / SANITY_JSON
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
    logger.info("Sanity test written to %s", out_path)

    if sanity["doc_type_distinct_count"] < 2:
        logger.warning(
            "[LAYER_IMBALANCE] All top-3 sanity results are same doc_type. "
            "Surface to native for calibration."
        )

    return result


# ── CLI entry point ───────────────────────────────────────────────────────────


def main() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )

    repo_root = Path(__file__).resolve().parents[3]
    logger.info("embed.py — B.3 Embedding. repo_root=%s", repo_root)

    result = embed_corpus(str(repo_root))
    logger.info(
        "embed_corpus complete: %d total embeddings, HNSW=%s",
        result["total_embedded"], result["hnsw_index_present"],
    )

    sanity = run_sanity_test(str(repo_root))
    logger.info(
        "Sanity test: top-3 doc_types=%s, p95_latency=%.1fms, AC-B3.3=%s, AC-B3.4=%s",
        [r["doc_type"] for r in sanity["top_3"]],
        sanity["hnsw_latency"]["p95_ms"],
        sanity["ac_b3_3_pass"],
        sanity["ac_b3_4_pass"],
    )


if __name__ == "__main__":
    main()
