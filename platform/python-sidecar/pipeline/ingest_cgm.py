"""
pipeline.ingest_cgm — One-shot runner for CGM nodes + edges ingest.
Phase 14D Stream E / RETRIEVAL_11C_a fix.

Extracts CGM nodes (234 base + UCN section nodes + aux nodes) and CGM edges,
writes to staging, validates, and swaps to live.

Usage:
  cd platform/python-sidecar
  DATABASE_URL=... MARSYS_REPO_ROOT=... python -m pipeline.ingest_cgm [--dry-run]
"""
from __future__ import annotations

import argparse
import importlib.util
import logging
import os
import sys

# Ensure the python-sidecar directory is on sys.path when running as a script.
_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
_SIDECAR_ROOT_EARLY = os.path.dirname(_SCRIPT_DIR)
if _SIDECAR_ROOT_EARLY not in sys.path:
    sys.path.insert(0, _SIDECAR_ROOT_EARLY)

logging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(levelname)s %(name)s %(message)s")
log = logging.getLogger("pipeline.ingest_cgm")

BUILD_ID = "build-retrieval-11c-a-20260429"

_SIDECAR_ROOT = os.path.dirname(os.path.dirname(__file__))


def _load_pyc(module_name: str, rel_path: str):
    abs_path = os.path.join(_SIDECAR_ROOT, rel_path)
    spec = importlib.util.spec_from_file_location(module_name, abs_path)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[module_name] = mod
    spec.loader.exec_module(mod)
    return mod


def run(repo_root: str, dry_run: bool = False) -> None:
    from pipeline.extractors.cgm_extractor import extract_cgm_edges, extract_cgm_nodes

    _load_pyc("pipeline.writers.base", "pipeline/writers/__pycache__/base.cpython-313.pyc")
    nodes_writer_mod = _load_pyc(
        "pipeline.writers.cgm_nodes_writer",
        "pipeline/writers/__pycache__/cgm_nodes_writer.cpython-313.pyc",
    )
    edges_writer_mod = _load_pyc(
        "pipeline.writers.cgm_edges_writer",
        "pipeline/writers/__pycache__/cgm_edges_writer.cpython-313.pyc",
    )

    CGMNodesWriter = nodes_writer_mod.CGMNodesWriter
    CGMEdgesWriter = edges_writer_mod.CGMEdgesWriter

    log.info("=== CGM ingest starting (build_id=%s, dry_run=%s) ===", BUILD_ID, dry_run)

    # --- Extract ---
    log.info("Extracting CGM nodes...")
    nodes = extract_cgm_nodes(repo_root)
    log.info("Extracted %d CGM nodes", len(nodes))

    node_ids = {n["node_id"] for n in nodes}
    log.info("Extracting CGM edges...")
    edges = extract_cgm_edges(repo_root, node_ids)
    log.info("Extracted %d CGM edges", len(edges))

    for node in nodes:
        node["build_id"] = BUILD_ID
    for edge in edges:
        edge["build_id"] = BUILD_ID

    if dry_run:
        log.info("DRY RUN — skipping DB writes. Node count=%d, Edge count=%d", len(nodes), len(edges))
        return

    nodes_w = CGMNodesWriter()
    edges_w = CGMEdgesWriter()

    # --- Nodes: write → validate → swap ---
    log.info("Writing nodes to staging...")
    write_result = nodes_w.write_to_staging(nodes, BUILD_ID)
    log.info("Nodes staging result: %s", write_result)

    log.info("Validating nodes staging...")
    val_result = nodes_w.validate_staging(BUILD_ID)
    log.info("Nodes validate result: %s", val_result)
    if not val_result.valid:
        log.error("Nodes staging validation FAILED: %s", val_result.issues)
        sys.exit(1)

    log.info("Swapping nodes to live...")
    swap_result = nodes_w.swap_to_live(BUILD_ID)
    log.info("Nodes swap result: %s", swap_result)

    # --- Edges: write → validate → swap ---
    log.info("Writing edges to staging...")
    write_result = edges_w.write_to_staging(edges, BUILD_ID)
    log.info("Edges staging result: %s", write_result)

    log.info("Validating edges staging...")
    val_result = edges_w.validate_staging(BUILD_ID)
    log.info("Edges validate result: %s", val_result)
    if not val_result.valid:
        log.error("Edges staging validation FAILED: %s", val_result.issues)
        sys.exit(1)

    log.info("Swapping edges to live...")
    swap_result = edges_w.swap_to_live(BUILD_ID)
    log.info("Edges swap result: %s", swap_result)

    log.info("=== CGM ingest complete ===")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest CGM nodes and edges to Cloud SQL.")
    parser.add_argument("--dry-run", action="store_true", help="Extract but skip DB writes")
    args = parser.parse_args()

    repo_root = os.environ.get("MARSYS_REPO_ROOT", os.path.abspath(os.path.join(_SIDECAR_ROOT, "../..")))
    db_url = os.environ.get("DATABASE_URL", "")

    if not db_url and not args.dry_run:
        env_file = os.path.join(_SIDECAR_ROOT, "../../platform/.env.local")
        if os.path.exists(env_file):
            for line in open(env_file):
                line = line.strip()
                if line.startswith("DATABASE_URL="):
                    os.environ["DATABASE_URL"] = line[len("DATABASE_URL="):].strip('"\'')
                    break

    run(repo_root, dry_run=args.dry_run)
