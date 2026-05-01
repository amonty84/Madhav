"""
eval.run_eval
MARSYS-JIS RAG Pipeline — evaluation runner.
Per PHASE_B_PLAN_v1_0.md §B.5 Task 0 + §B.9.
B.5 scope (Madhav_M2A_Exec_9): --mode=discovery_sanity.
B.6 scope (Madhav_M2A_Exec_12): --mode=retrieval_eval (precision@10, recall@10, layer_balance, KR-3).
Full RAGAS harness (faithfulness, context precision, context recall, answer relevancy)
deferred to Phase B.9 — see STALENESS_REGISTER.md.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path


def _project_root() -> Path:
    return Path(__file__).resolve().parents[4]


def _load_seeds(seed_set_path: str) -> list[dict]:
    path = Path(seed_set_path)
    if not path.is_absolute():
        path = _project_root() / seed_set_path
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def _embed_query(text: str) -> list[float]:
    """Single-query embed via Vertex AI text-multilingual-embedding-002."""
    import os
    from dotenv import load_dotenv

    load_dotenv(_project_root() / ".env.rag", override=False)

    import vertexai
    from vertexai.language_models import TextEmbeddingInput, TextEmbeddingModel

    project = os.environ.get("GCP_PROJECT", "")
    vertexai.init(project=project, location="us-central1")
    model = TextEmbeddingModel.from_pretrained("text-multilingual-embedding-002")
    inputs = [TextEmbeddingInput(text, "RETRIEVAL_QUERY")]
    result = model.get_embeddings(inputs)
    return result[0].values


def _hnsw_search(query_vec: list[float], k: int = 10) -> list[dict]:
    """Cosine similarity search returning top-k chunk_ids."""
    import numpy as np
    import psycopg
    from pgvector.psycopg import register_vector
    from dotenv import load_dotenv

    load_dotenv(_project_root() / ".env.rag", override=False)
    db_url = os.environ.get("DATABASE_URL", "")
    if not db_url:
        raise RuntimeError("DATABASE_URL not set in .env.rag")

    vec = np.array(query_vec, dtype=np.float32)
    with psycopg.connect(db_url) as conn:
        register_vector(conn)
        rows = conn.execute(
            """
            SELECT rc.chunk_id
            FROM rag_embeddings re
            JOIN rag_chunks rc ON re.chunk_id = rc.chunk_id
            WHERE rc.is_stale = false
            ORDER BY re.embedding <=> %s
            LIMIT %s
            """,
            (vec, k),
        ).fetchall()
    return [{"chunk_id": r[0]} for r in rows]


def run_discovery_sanity(seed_set_path: str) -> dict:
    """
    Embed each seed's claim_text; query HNSW k=10; check if any
    expected_chunks_rank10 chunk ID appears in top-10.
    Returns {mode, recall_at_10, pass, seed_results}.
    Exit code: 0 if recall_at_10 >= 0.8, else 1.
    """
    seeds = _load_seeds(seed_set_path)
    if not seeds:
        raise ValueError("Seed set is empty")

    hits = 0
    seed_results = []
    for seed in seeds:
        query_emb = _embed_query(seed["claim_text"])
        top10 = _hnsw_search(query_emb, k=10)
        top10_ids = {r["chunk_id"] for r in top10}
        expected = set(seed.get("expected_chunks_rank10", []))
        matched = bool(expected & top10_ids)
        if matched:
            hits += 1
        seed_results.append({
            "seed_id": seed["seed_id"],
            "hit": matched,
            "expected_in_top10": list(expected & top10_ids),
            "top10_chunk_ids": [r["chunk_id"] for r in top10],
        })

    recall = hits / len(seeds)
    return {
        "mode": "discovery_sanity",
        "total_seeds": len(seeds),
        "hits": hits,
        "recall_at_10": round(recall, 4),
        "pass": recall >= 0.8,
        "seed_results": seed_results,
    }


def run_retrieval_assessment(golden_path: str, output_path: str | None = None) -> dict:
    """
    B.6 retrieval assessment: run retrieve() on each golden query; compute precision@10,
    recall@10, layer_balance_pass_rate, kr3_cgm_top5_rate.

    Metrics:
      precision@10 = mean over queries of |expected ∩ top10| / 10
      recall@10    = mean over queries of |expected ∩ top10| / max(|expected|, 1)
      layer_balance_pass_rate = fraction of queries where top10 covers all 5 LAYER_DOC_TYPES
      kr3_cgm_top5_rate = fraction of chart_state_structured queries where cgm_node in top5

    Thresholds (from golden file eval_thresholds):
      precision@10 >= 0.7, recall@10 >= 0.6, layer_balance_pass_rate = 1.0, kr3_cgm_top5_rate >= 0.75

    Requires DATABASE_URL (Cloud SQL Auth Proxy) and Vertex AI credentials.
    """
    from datetime import datetime, timezone

    from rag.retrieve import retrieve, LAYER_DOC_TYPES

    golden_file = Path(golden_path)
    if not golden_file.is_absolute():
        golden_file = _project_root() / golden_path
    with golden_file.open(encoding="utf-8") as f:
        golden = json.load(f)

    thresholds = golden.get("eval_thresholds", {})
    queries = golden["queries"]

    query_results = []
    precision_sum = 0.0
    recall_sum = 0.0
    layer_balance_passes = 0
    chart_state_total = 0
    chart_state_cgm_hits = 0

    for q in queries:
        qid = q["query_id"]
        query_text = q["query_text"]
        expected_ids = set(q.get("expected_chunk_ids", []))

        results = retrieve(query_text, mode="hybrid_rrf", k=10, rerank=True)
        top10_ids = [r.chunk_id for r in results]
        top10_set = set(top10_ids)
        top5_doc_types = {r.doc_type for r in results[:5]}
        top10_doc_types = {r.doc_type for r in results}

        hits = expected_ids & top10_set
        prec = len(hits) / 10.0
        rec = len(hits) / max(len(expected_ids), 1)

        layer_ok = LAYER_DOC_TYPES.issubset(top10_doc_types)

        kr3_pass = None
        if q["query_class"] == "chart_state_structured":
            chart_state_total += 1
            kr3_pass = "cgm_node" in top5_doc_types
            if kr3_pass:
                chart_state_cgm_hits += 1

        precision_sum += prec
        recall_sum += rec
        if layer_ok:
            layer_balance_passes += 1

        query_results.append({
            "query_id": qid,
            "query_class": q["query_class"],
            "precision_at_10": round(prec, 4),
            "recall_at_10": round(rec, 4),
            "layer_balance_pass": layer_ok,
            "kr3_cgm_in_top5": kr3_pass,
            "expected_chunk_ids": sorted(expected_ids),
            "hit_chunk_ids": sorted(hits),
            "top10_chunk_ids": top10_ids,
            "top10_doc_types": sorted(top10_doc_types),
        })

    n = len(queries)
    precision_at_10 = round(precision_sum / n, 4) if n else 0.0
    recall_at_10 = round(recall_sum / n, 4) if n else 0.0
    layer_balance_pass_rate = round(layer_balance_passes / n, 4) if n else 0.0
    kr3_cgm_top5_rate = (
        round(chart_state_cgm_hits / chart_state_total, 4) if chart_state_total else None
    )

    t = thresholds
    passed = (
        precision_at_10 >= t.get("precision_at_10", 0.7)
        and recall_at_10 >= t.get("recall_at_10", 0.6)
        and layer_balance_pass_rate >= t.get("layer_balance_pass_rate", 1.0)
        and (kr3_cgm_top5_rate is None or kr3_cgm_top5_rate >= t.get("kr3_cgm_top5_rate", 0.75))
    )

    result = {
        "schema_version": "1.0",
        "produced_by_session": "Madhav_M2A_Exec_12",
        "produced_at": datetime.now(timezone.utc).isoformat(),
        "golden_file": str(golden_file),
        "query_count": n,
        "precision_at_10": precision_at_10,
        "recall_at_10": recall_at_10,
        "layer_balance_pass_rate": layer_balance_pass_rate,
        "kr3_cgm_top5_rate": kr3_cgm_top5_rate,
        "thresholds": t,
        "pass": passed,
        "query_results": query_results,
    }

    if output_path:
        out = Path(output_path)
        if not out.is_absolute():
            out = _project_root() / output_path
        out.parent.mkdir(parents=True, exist_ok=True)
        with out.open("w", encoding="utf-8") as f:
            json.dump(result, f, indent=2)
        print(f"[EVAL] Results written to {out}", file=sys.stderr)

    return result


def main() -> None:
    parser = argparse.ArgumentParser(description="MARSYS-JIS RAG Evaluation Runner")
    parser.add_argument(
        "--mode", required=True,
        choices=["discovery_sanity", "retrieval_eval"],
        help="discovery_sanity (B.5) or retrieval_eval (B.6).",
    )
    parser.add_argument(
        "--seed_set",
        default="verification_artifacts/RAG/discovery_sanity_seed_set_v1_0.json",
        help="Seed set JSON path for discovery_sanity mode.",
    )
    parser.add_argument(
        "--golden",
        default="verification_artifacts/RAG/retrieval_golden_v1_0.json",
        help="Golden set JSON path for retrieval_eval mode.",
    )
    parser.add_argument(
        "--output",
        default="verification_artifacts/RAG/retrieval_eval_v1_0.json",
        help="Output path for retrieval assessment results.",
    )
    args = parser.parse_args()

    if args.mode == "discovery_sanity":
        result = run_discovery_sanity(args.seed_set)
        print(json.dumps(result, indent=2))
        sys.exit(0 if result["pass"] else 1)
    elif args.mode == "retrieval_eval":
        result = run_retrieval_assessment(args.golden, args.output)
        print(json.dumps({k: v for k, v in result.items() if k != "query_results"}, indent=2))
        sys.exit(0 if result["pass"] else 1)
    else:
        raise NotImplementedError("B.9 deliverable — full RAGAS harness not yet implemented.")


if __name__ == "__main__":
    main()
