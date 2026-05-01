"""
pipeline.ingest_l3_registers — Phase 14E one-shot runner.

Loads all four L3 discovery registers from GCS, validates signal FKs,
inserts to staging, and swaps to live using append-only semantics.

Usage:
  cd platform/python-sidecar
  DATABASE_URL=... python -m pipeline.ingest_l3_registers
"""
from __future__ import annotations

import logging
import os
import sys

logging.basicConfig(stream=sys.stdout, level=logging.INFO,
                    format="%(levelname)s %(name)s %(message)s")
log = logging.getLogger(__name__)

BUILD_ID = "build-l3-registers-20260429"

REGISTERS = [
    ("pattern",       "pipeline.writers.pattern_register_writer",      "PatternRegisterWriter"),
    ("resonance",     "pipeline.writers.resonance_register_writer",     "ResonanceRegisterWriter"),
    ("cluster",       "pipeline.writers.cluster_register_writer",       "ClusterRegisterWriter"),
    ("contradiction", "pipeline.writers.contradiction_register_writer", "ContradictionRegisterWriter"),
]


def run() -> None:
    from pipeline.extractors import register_loader

    results: list[dict] = []
    all_ok = True

    for register_name, module_path, class_name in REGISTERS:
        log.info(f"--- {register_name.upper()} ---")
        import importlib
        mod = importlib.import_module(module_path)
        writer_cls = getattr(mod, class_name)
        writer = writer_cls()

        entries = register_loader.load(register_name)
        write_result = writer.write_to_staging(entries, BUILD_ID)
        log.info(f"staging: {write_result.chunk_count} rows, errors={write_result.errors}")

        val = writer.validate_staging(BUILD_ID)
        log.info(f"validation: valid={val.valid}, count={val.chunk_count}, issues={val.issues}")

        if not val.valid:
            log.error(f"Validation failed for {register_name}: {val.issues}")
            all_ok = False
            results.append({"register": register_name, "status": "FAILED", "count": 0})
            continue

        swap = writer.swap_to_live(BUILD_ID)
        log.info(f"swap: {swap.message}")
        results.append({
            "register": register_name,
            "status": "OK" if swap.success else "FAILED",
            "count": swap.promoted_chunk_count,
            "errors": write_result.errors,
        })
        if not swap.success:
            all_ok = False

    log.info("=== INGEST SUMMARY ===")
    for r in results:
        log.info(f"  {r['register']:20s}: {r['status']} ({r['count']} rows)")
    if all_ok:
        log.info("ALL REGISTERS INGESTED SUCCESSFULLY")
        sys.exit(0)
    else:
        log.error("ONE OR MORE REGISTERS FAILED")
        sys.exit(1)


if __name__ == "__main__":
    db_url = os.environ.get("DATABASE_URL", "")
    if not db_url:
        # Try loading from .env.local
        env_file = os.path.join(os.path.dirname(__file__), "../../.env.local")
        if os.path.exists(env_file):
            for line in open(env_file):
                line = line.strip()
                if line.startswith("DATABASE_URL="):
                    os.environ["DATABASE_URL"] = line.split("=", 1)[1].strip('"').strip("'")
                    break
    run()
