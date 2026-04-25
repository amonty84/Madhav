"""
models — MARSYS-JIS RAG Pipeline Pydantic v2 data models.
Phase B.1. Per M2A_EXEC_PLAN_v1_0.md §PLAN B.1 Task 1 + chunker_spec_v1_0.md metadata field lists.
"""
from __future__ import annotations

import hashlib
from typing import Any, Literal, Optional

from pydantic import BaseModel, Field, model_validator


class Document(BaseModel):
    path: str
    layer: Literal["L0", "L1", "L2", "L2.5", "L3", "L4"]
    doc_type: str
    version: str
    is_current: bool
    supersedes: Optional[str] = None
    frontmatter: dict[str, Any] = Field(default_factory=dict)


class Chunk(BaseModel):
    chunk_id: str  # content-hash derived (sha256 hex of content)
    doc_type: str
    layer: str
    source_file: str
    source_version: str
    content: str
    token_count: int
    is_stale: bool = False
    stale_reason: Optional[str] = None
    stale_since: Optional[str] = None
    citation_valid: bool = True
    external_computation_pending: bool = False
    metadata: dict[str, Any] = Field(default_factory=dict)

    @model_validator(mode="before")
    @classmethod
    def derive_chunk_id(cls, data: Any) -> Any:
        if isinstance(data, dict) and not data.get("chunk_id") and data.get("content"):
            data["chunk_id"] = hashlib.sha256(data["content"].encode()).hexdigest()[:32]
        return data


class Signal(BaseModel):
    signal_id: str
    signal_name: str
    signal_type: str
    domains_affected: list[str] = Field(default_factory=list)
    confidence: float
    valence: str
    temporal_activation: str
    tags: list[str] = Field(default_factory=list)
    provenance: str


class GraphNode(BaseModel):
    node_id: str
    node_type: str
    node_label: str
    domains: list[str] = Field(default_factory=list)
    layer: str


class GraphEdge(BaseModel):
    source_id: str
    target_id: str
    edge_type: str
    weight: float = 1.0
    ledger_event_ref: Optional[str] = None


class RegisterEntry(BaseModel):
    entry_id: str
    entry_type: str
    status: str
    confidence: float
    ledger_event_ids: list[str] = Field(default_factory=list)


class LedgerEvent(BaseModel):
    event_id: str
    event_type: str
    actor: str
    timestamp: str
    prompt_ref: Optional[str] = None
    prompt_version: Optional[str] = None
    prompt_hash: Optional[str] = None
    gemini_response_ref: Optional[str] = None
    input_bundle_hash: Optional[str] = None
    artifact_id: Optional[str] = None
