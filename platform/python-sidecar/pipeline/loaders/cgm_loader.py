"""
pipeline.loaders.cgm_loader
KARN-W2-R3-CGM-FULL-EDGES — Thin loader accepting all 15 edge types.

Wraps cgm_extractor + CGMEdgesWriter to provide a CLI entry point for
re-ingesting the full expanded CGM edge set. Performs staging-then-swap
via CGMEdgesWriter.

Usage:
    cd platform/python-sidecar
    DATABASE_URL=... python -m pipeline.loaders.cgm_loader [--dry-run] [--verify]
"""
from __future__ import annotations

import argparse
import logging
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

BUILD_ID = f"karn-w2-r3-cgm-edges-{datetime.now(timezone.utc).strftime('%Y%m%d')}"
IMAGE_URI = "asia-south1-docker.pkg.dev/madhav-astrology/marsys-pipeline/pipeline:v1.0.9"

VALID_EDGE_TYPES = frozenset({
    "RULES_OVER",
    "DISPOSES",
    "NAKSHATRA_OF",
    "KARAKA_OF",
    "CONJUNCT",
    "DASHA_GIVES",
    "ASPECTS",
    "AFFLICTS",
    "SUPPORTS",
    "ARUDHA_OF",
    "CO_OCCURS",
    "DUAL_SYSTEM_DIVERGENCE",
    "SEC_REFERENCES",
    "RESONATES_WITH",
    "CONTRADICTS_WITH",
})

_SIDECAR_ROOT = Path(__file__).resolve().parents[2]
_REPO_ROOT = _SIDECAR_ROOT.parents[1]


def verify_edge_types(repo_root: str | Path | None = None) -> dict[str, Any]:
    """Check l25_cgm_edges for presence of all 15 edge types."""
    import psycopg

    db_url = os.environ.get("DATABASE_URL", "")
    if not db_url:
        raise RuntimeError("DATABASE_URL env var not set")

    with psycopg.connect(db_url) as conn:
        rows = conn.execute(
            "SELECT edge_type, COUNT(*) FROM l25_cgm_edges WHERE status='valid' "
            "GROUP BY edge_type ORDER BY 2 DESC"
        ).fetchall()
        total = conn.execute(
            "SELECT COUNT(*) FROM l25_cgm_edges WHERE status='valid'"
        ).fetchone()
        orphan_count = conn.execute(
            "SELECT COUNT(*) FROM l25_cgm_edges WHERE status='orphan'"
        ).fetchone()

    by_type = {row[0]: row[1] for row in rows}
    total_count = int(total[0]) if total else 0
    orphans = int(orphan_count[0]) if orphan_count else 0
    present = set(by_type.keys())
    missing = [t for t in VALID_EDGE_TYPES if t not in present]

    return {
        "total_valid": total_count,
        "orphan_count": orphans,
        "by_type": by_type,
        "missing_types": missing,
        "all_types_present": len(missing) == 0,
    }


def _ensure_build_manifest(build_id: str, db_url: str) -> None:
    """Insert a build_manifests row if not already present."""
    import psycopg
    with psycopg.connect(db_url) as conn:
        exists = conn.execute(
            "SELECT 1 FROM build_manifests WHERE build_id = %s", (build_id,)
        ).fetchone()
        if not exists:
            conn.execute(
                """
                INSERT INTO build_manifests
                  (build_id, triggered_by, registry_fingerprint, pipeline_image_uri,
                   embedding_model, embedding_dim, chunk_count, embedding_count, status, manifest_uri)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    build_id, "manual:karn-w2-r3-cgm-full-edges", "n/a",
                    IMAGE_URI, "n/a", 0, 0, 0, "staging",
                    f"gs://madhav-marsys-build-artifacts/{build_id}/manifest.json",
                ),
            )
            conn.commit()
            logger.info("cgm_loader: inserted build_manifests row for %s", build_id)


def run_ingest(repo_root: str | Path | None = None, dry_run: bool = False) -> int:
    """Run full CGM edge ingest: extract → stage → swap. Returns promoted count."""
    sys.path.insert(0, str(_SIDECAR_ROOT))
    from pipeline.extractors.cgm_extractor import extract_cgm_nodes, extract_cgm_edges
    from pipeline.writers.cgm_edges_writer import CGMEdgesWriter

    root = str(Path(repo_root) if repo_root else _REPO_ROOT)
    nodes = extract_cgm_nodes(root)
    node_ids = {n["node_id"] for n in nodes}
    edges = extract_cgm_edges(root, node_ids)

    valid_edges = [e for e in edges if e.get("status") == "valid"]
    orphan_count = sum(1 for e in edges if e.get("status") == "orphan")

    logger.info("cgm_loader: extracted %d edges (%d valid, %d orphans)",
                len(edges), len(valid_edges), orphan_count)

    if orphan_count > 0:
        logger.error("HALT: %d orphan edges detected. Fix extractor before ingest.", orphan_count)
        raise RuntimeError(f"cgm_loader: {orphan_count} orphan edges — ingest halted (AC.5 violated)")

    unknown_types = {e["edge_type"] for e in valid_edges} - VALID_EDGE_TYPES
    if unknown_types:
        logger.warning("cgm_loader: unknown edge types: %s", unknown_types)

    if dry_run:
        logger.info("cgm_loader dry-run: %d valid edges would be staged", len(valid_edges))
        return len(valid_edges)

    db_url = os.environ.get("DATABASE_URL", "")
    if not db_url:
        raise RuntimeError("DATABASE_URL env var not set")
    _ensure_build_manifest(BUILD_ID, db_url)

    writer = CGMEdgesWriter()
    write_result = writer.write_to_staging(valid_edges, BUILD_ID)
    if write_result.errors:
        logger.error("cgm_loader: %d write errors: %s", len(write_result.errors), write_result.errors[:3])

    val_result = writer.validate_staging(BUILD_ID)
    if not val_result.valid:
        raise RuntimeError(f"cgm_loader: staging validation failed: {val_result.issues}")

    swap_result = writer.swap_to_live(BUILD_ID)
    if not swap_result.success:
        raise RuntimeError(f"cgm_loader: swap_to_live failed: {swap_result.message}")

    logger.info("cgm_loader: promoted %d edges to l25_cgm_edges", swap_result.promoted_chunk_count)
    return swap_result.promoted_chunk_count


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s %(message)s", stream=sys.stdout)
    parser = argparse.ArgumentParser(description="KARN-W2-R3 CGM edge loader")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--verify", action="store_true", help="Check DB coverage without re-ingesting")
    parser.add_argument("--repo-root", help="Override repo root path")
    args = parser.parse_args()

    root = args.repo_root or str(_REPO_ROOT)

    if args.verify:
        result = verify_edge_types(root)
        print(f"\n=== CGM edges coverage ===")
        print(f"Total valid edges: {result['total_valid']}")
        print(f"Orphan edges: {result['orphan_count']}")
        print(f"\nEdge type breakdown:")
        for et, cnt in sorted(result["by_type"].items(), key=lambda x: -x[1]):
            marker = "✅" if et in VALID_EDGE_TYPES else "⚠️"
            print(f"  {marker} {et:<30} {cnt}")
        if result["missing_types"]:
            print(f"\nMISSING TYPES ({len(result['missing_types'])}):")
            for t in result["missing_types"]:
                print(f"  ❌ {t}")
        else:
            print("\nAll 15 edge types present.")
        return

    count = run_ingest(repo_root=root, dry_run=args.dry_run)
    if args.dry_run:
        print(f"dry-run: {count} valid edges would be staged")
    else:
        print(f"Promoted: {count} edges to l25_cgm_edges")


if __name__ == "__main__":
    main()
