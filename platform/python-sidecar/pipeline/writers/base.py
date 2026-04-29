"""
pipeline.writers.base — IBuildWriter abstract base class.
Phase 14B. Evolved in Phase 14C/14D to support row-based structured writers.
14C/14D/14E plug in additional writers behind this interface.
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any


@dataclass
class WriteResult:
    chunk_count: int       # primary field (kept for main.py compat)
    embedding_count: int = 0
    errors: list[str] = field(default_factory=list)

    @property
    def row_count(self) -> int:
        return self.chunk_count

    @property
    def aux_count(self) -> int:
        return self.embedding_count


@dataclass
class ValidationResult:
    valid: bool
    chunk_count: int       # primary field (kept for main.py compat)
    embedding_count: int = 0
    issues: list[str] = field(default_factory=list)

    @property
    def row_count(self) -> int:
        return self.chunk_count

    @property
    def aux_count(self) -> int:
        return self.embedding_count


@dataclass
class SwapResult:
    success: bool
    promoted_chunk_count: int
    message: str


class IBuildWriter(ABC):
    @abstractmethod
    def write_to_staging(self, rows: list[Any], build_id: str) -> WriteResult:
        """Write rows to the writer's staging table. rows is writer-specific."""
        ...

    @abstractmethod
    def validate_staging(self, build_id: str) -> ValidationResult:
        ...

    @abstractmethod
    def swap_to_live(self, build_id: str) -> SwapResult:
        ...
