"""
pipeline.swap — Transactional staging→live swap for rag_chunks + rag_embeddings.
Phase 14B. Called by RAGChunksWriter.swap_to_live or directly from main.py.

The swap logic lives in RAGChunksWriter.swap_to_live to keep writer abstraction
intact. This module re-exports it for direct invocation and testing.
"""
from pipeline.writers.rag_chunks_writer import RAGChunksWriter


def perform_swap(build_id: str) -> None:
    """Swap staging to live. Raises on safety-threshold failure."""
    writer = RAGChunksWriter()
    result = writer.swap_to_live(build_id)
    if not result.success:
        raise RuntimeError(result.message)
