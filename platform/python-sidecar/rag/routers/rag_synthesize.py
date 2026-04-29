"""
rag_synthesize — FastAPI router for the synthesis endpoint.
Phase B.8. Madhav_M2A_Exec_14 (2026-04-28).
Endpoint: POST /rag/synthesize
Composite pipeline: classify_query → retrieve → synthesize.
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from rag.router import classify_query
from rag.retrieve import retrieve
from rag.synthesize import SynthesisError, synthesize

router = APIRouter()


class SynthesizeRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)


@router.post("/synthesize")
def synthesize_endpoint(req: SynthesizeRequest) -> dict:
    try:
        plan = classify_query(req.query)
        mode = "auto" if plan.wcr_forced else "hybrid_rrf"
        results = retrieve(req.query, mode=mode, k=10, rerank=True)
        answer = synthesize(plan, results)
        return {"answer": answer.model_dump()}
    except SynthesisError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
