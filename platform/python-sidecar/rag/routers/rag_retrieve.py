"""
rag_retrieve — FastAPI router for hybrid RAG retrieval.
Phase B.6. Madhav_M2A_Exec_12 (2026-04-27).
Endpoint: POST /rag/retrieve
"""
from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from rag.retrieve import retrieve, RetrievalResult

router = APIRouter()


class RetrieveRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)
    mode: Literal["vector", "bm25", "graph_walk", "hybrid_rrf", "auto"] = "hybrid_rrf"
    k: int = Field(default=10, ge=1, le=50)
    rerank: bool = True


@router.post("/retrieve")
def retrieve_endpoint(req: RetrieveRequest) -> list[dict]:
    try:
        results: list[RetrievalResult] = retrieve(
            req.query, mode=req.mode, k=req.k, rerank=req.rerank
        )
        return [r.__dict__ for r in results]
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
