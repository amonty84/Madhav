"""
rag_router — FastAPI router for MARSYS-JIS query classification.
Phase B.7. Madhav_M2A_Exec_13 (2026-04-27).
Endpoint: POST /rag/route
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from rag.router import classify_query

router = APIRouter()


class RouteRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)


@router.post("/route")
def route_endpoint(req: RouteRequest) -> dict:
    try:
        plan = classify_query(req.query)
        return {"plan": plan.model_dump()}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
