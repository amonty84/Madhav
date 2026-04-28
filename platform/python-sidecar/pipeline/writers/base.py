"""
pipeline.writers.base — IBuildWriter abstract base class.
Phase 14B. 14C/14D/14E plug in additional writers behind this interface.
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any


@dataclass
class WriteResult:
    chunk_count: int
    embedding_count: int
    errors: list[str]


@dataclass
class ValidationResult:
    valid: bool
    chunk_count: int
    embedding_count: int
    issues: list[str]


@dataclass
class SwapResult:
    success: bool
    promoted_chunk_count: int
    message: str


class IBuildWriter(ABC):
    @abstractmethod
    def write_chunks(
        self,
        chunks: list[Any],
        embeddings: list[list[float]],
        build_id: str,
    ) -> WriteResult:
        ...

    @abstractmethod
    def validate_staging(self, build_id: str) -> ValidationResult:
        ...

    @abstractmethod
    def swap_to_live(self, build_id: str) -> SwapResult:
        ...
