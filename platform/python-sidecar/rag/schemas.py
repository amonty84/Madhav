"""
schemas
MARSYS-JIS RAG Pipeline — Pydantic request/response schemas.
Per PHASE_B_PLAN_v1_0.md §G B.0 Task 9.
B.7 (Exec_13): QueryPlan schema added.
B.8 (Exec_14): DerivationEntry + SynthesisAnswer added.
"""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class QueryPlan(BaseModel):
    """
    Structured query plan produced by the router (classify_query).
    Downstream components (retriever, synthesizer, portal) consume this object.

    Fields:
        query_text         : The original natural-language query.
        plan_type          : Routing classification (one of 6 values).
                             'exploratory' is a static fallback only — never emitted by Opus.
        significance_score : Float in [0.0, 1.0]. Higher = broader / deeper chart involvement.
        domains            : List of Jyotish domain strings the query touches.
        actor              : Model string that produced this plan, or 'static_fallback'.
        wcr_forced         : True iff plan_type is interpretive_multidomain or interpretive_single.
                             Signals downstream to call retrieve() with mode='auto' (WCR).
        routing_rationale  : 1–2 sentence explanation from Opus. Empty string for static_fallback.
    """

    query_text: str
    plan_type: Literal[
        "interpretive_multidomain",
        "interpretive_single",
        "factual",
        "timing",
        "meta",
        "exploratory",
    ]
    significance_score: float = Field(..., ge=0.0, le=1.0)
    domains: list[str]
    actor: str
    wcr_forced: bool
    routing_rationale: str


class DerivationEntry(BaseModel):
    chunk_id: str
    doc_type: str
    layer: str
    signal_or_fact_id: str
    claim_supported: str


class SynthesisAnswer(BaseModel):
    query_text: str
    plan: QueryPlan
    answer_text: str
    derivation_ledger: list[DerivationEntry]
    confidence: Literal["LOW", "MED", "HIGH"]
    confidence_rationale: str
    interpretations: list[str]
    bundle_chunk_ids: list[str]
    actor: str
    p7_triggered: bool
    p6_enforcement: str
