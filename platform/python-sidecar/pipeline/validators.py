"""
pipeline.validators — Pydantic models for VALIDATED_ASSET_REGISTRY and asset frontmatter.
Phase 14B.
"""
from __future__ import annotations

from typing import Any, Literal, Optional

from pydantic import BaseModel, Field


class RegistryAsset(BaseModel):
    asset_id: str
    path: str
    format: str = "markdown"
    version: Optional[str] = None
    status: Optional[str] = None
    classification: Optional[str] = None
    data_categories: list[str] = Field(default_factory=list)
    current_storage: list[str] = Field(default_factory=list)
    modernization_target: Optional[str] = None
    modernization_phase: Optional[str] = None
    model_config = {"extra": "allow"}


class RegistryLayer(BaseModel):
    purpose: Optional[str] = None
    status_note: Optional[str] = None
    current_assets: list[RegistryAsset] = Field(default_factory=list)
    archived_assets: list[Any] = Field(default_factory=list)
    model_config = {"extra": "allow"}


class ValidatedAssetRegistry(BaseModel):
    version: str
    generated_at: str
    generated_by: str
    layers: dict[str, RegistryLayer]
    model_config = {"extra": "allow"}


class AssetFrontmatter(BaseModel):
    """Shared frontmatter envelope present on canonical markdown artifacts."""
    version: Optional[str] = None
    status: Optional[str] = None
    canonical_id: Optional[str] = None
    model_config = {"extra": "allow"}
