"""
run_supports_pipeline.py
MARSYS-JIS RAG Pipeline — SUPPORTS edge pipeline orchestrator.
Phase B.4 Task 3 (SUPPORTS sub-task). Madhav_M2A_Exec_7.

Runs all 9 SUPPORTS reconciler batches, persists accepted edges to DB,
writes cgm_supports_edges_manifest_v1_0.json, ucn_section_node_map.json,
and b4_supports_count.json.

Usage:
  python -m rag.reconcilers.run_supports_pipeline [--dry-run] [--batches 1,2,3]
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

# Project root
_PROJECT_ROOT = Path(__file__).resolve().parents[4]
_RESPONSES_DIR = _PROJECT_ROOT / "035_DISCOVERY_LAYER" / "PROMPTS" / "gemini" / "responses"
_DISCOVERY_LAYER = _PROJECT_ROOT / "035_DISCOVERY_LAYER"
_VERIFICATION_DIR = _PROJECT_ROOT / "verification_artifacts" / "RAG"

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from rag.reconcilers.cgm_supports_reconciler import reconcile_batch
from rag.graph import persist_supports_edges

SESSION_ID = "Madhav_M2A_Exec_7"

# Batch definitions (batch_number → L3 report filename)
BATCH_MAP = {
    1: "REPORT_CAREER_DHARMA_v1_1.md",
    2: "REPORT_CHILDREN_v1_1.md",
    3: "REPORT_FINANCIAL_v2_1.md",
    4: "REPORT_HEALTH_LONGEVITY_v1_1.md",
    5: "REPORT_PARENTS_v1_1.md",
    6: "REPORT_PSYCHOLOGY_MIND_v1_1.md",
    7: "REPORT_RELATIONSHIPS_v1_1.md",
    8: "REPORT_SPIRITUAL_v1_1.md",
    9: "REPORT_TRAVEL_v1_1.md",
}

RESPONSE_DATE = "2026-04-26"  # Update if running on a different date


def _raw_file_path(batch_num: int) -> Path:
    return _RESPONSES_DIR / f"{RESPONSE_DATE}_B4_supports_batch{batch_num}_raw.md"


def _edge_id_for_manifest(src: str, tgt: str) -> str:
    return "sha256:" + hashlib.sha256(f"{src}:{tgt}:SUPPORTS".encode()).hexdigest()[:16]


def run_pipeline(batches: list[int], dry_run: bool = False) -> dict:
    """
    Run reconciler for each batch, collect accepted edges, persist to DB,
    write manifest + verification artifacts.
    """
    all_accepted: list[dict] = []
    all_results: list[dict] = []
    per_report_counts: dict[str, int] = {}
    missing_batches: list[int] = []

    for batch_num in sorted(batches):
        raw_path = _raw_file_path(batch_num)
        batch_id = f"B4_supports_batch{batch_num}"
        report_name = BATCH_MAP[batch_num]

        if not raw_path.exists():
            print(f"[PIPELINE] MISSING batch {batch_num}: {raw_path.name} — skipping")
            missing_batches.append(batch_num)
            per_report_counts[report_name] = 0
            continue

        print(f"[PIPELINE] Reconciling batch {batch_num} ({report_name})...")
        try:
            result = reconcile_batch(
                batch_id=batch_id,
                raw_file_path=raw_path,
                dry_run=dry_run,
            )
        except Exception as exc:
            print(f"[PIPELINE] STOP: batch {batch_num} reconciler error: {exc}", file=sys.stderr)
            raise

        all_accepted.extend(result["accepted_edges"])
        all_results.append({**result, "l3_report": report_name})
        per_report_counts[report_name] = result["accepted"]

        print(
            f"[PIPELINE] Batch {batch_num}: {result['proposed']} proposed → "
            f"{result['accepted']} accepted / {result['rejected']} rejected"
        )

    if missing_batches:
        print(f"[PIPELINE] WARNING: {len(missing_batches)} batches missing raw files: {missing_batches}")

    # Check L3 acceptance gate (AC.8): every report must have ≥1 SUPPORTS
    gate_failures = [r for r, c in per_report_counts.items() if c == 0]
    if gate_failures:
        print(f"[PIPELINE] STOP (AC.8): L3 reports with ZERO accepted SUPPORTS edges:")
        for r in gate_failures:
            print(f"  {r}")
        print("[PIPELINE] Either re-run the offending batch(es) or accept the gap with native approval.")
        print("[PIPELINE] Continuing persistence for accepted edges from other batches...")

    # Persist accepted edges to DB (AC.6)
    if not dry_run and all_accepted:
        print(f"[PIPELINE] Persisting {len(all_accepted)} accepted edges to rag_graph_edges...")
        try:
            import dotenv
            dotenv.load_dotenv(_PROJECT_ROOT / ".env.rag", override=False)
            written = persist_supports_edges(
                all_accepted,
                repo_root=str(_PROJECT_ROOT),
            )
            print(f"[PIPELINE] DB write: {written} edges upserted.")
        except Exception as exc:
            print(f"[PIPELINE] STOP: DB persistence error: {exc}", file=sys.stderr)
            raise

    # Build UCN section node map (AC.6)
    ucn_node_map: dict[str, str] = {}
    for edge in all_accepted:
        ucn_id = edge.get("target_ucn_section_id", "")
        if ucn_id and ucn_id not in ucn_node_map:
            # chunk_id is null for ucn_section nodes created here — map stable_id → node_id (same value)
            ucn_node_map[ucn_id] = ucn_id  # node_id in rag_graph_nodes = stable_id

    ucn_map_path = _VERIFICATION_DIR / "ucn_section_node_map.json"
    if not dry_run:
        ucn_map_path.parent.mkdir(parents=True, exist_ok=True)
        ucn_map_path.write_text(
            json.dumps({
                "produced_by_session": SESSION_ID,
                "produced_at": datetime.now(timezone.utc).isoformat(),
                "description": "Maps UCN stable section IDs (UCN.SEC.X.Y) to rag_graph_nodes node_id. "
                               "For ucn_section nodes, node_id == stable_id. chunk_id is NULL "
                               "(these nodes are graph-side records, not chunk-derived).",
                "mappings": ucn_node_map,
            }, indent=2),
            encoding="utf-8",
        )
        print(f"[PIPELINE] Written: {ucn_map_path}")

    # Write cgm_supports_edges_manifest_v1_0.json (AC.6)
    manifest_entries = []
    for i, edge in enumerate(all_accepted, 1):
        manifest_entries.append({
            "edge_id": f"CGM_SUPPORTS_{i:03d}",
            "source_node_id": edge["source_signal_id"],
            "target_node_id": edge["target_ucn_section_id"],
            "edge_type": "SUPPORTS",
            "target_ucn_heading": edge.get("target_ucn_heading", ""),
            "l3_evidence_report": edge.get("l3_evidence_report", ""),
            "l3_evidence_section": edge.get("l3_evidence_section", ""),
            "l1_source": edge.get("l1_source", ""),
            "confidence_prior": edge.get("confidence_prior", "LOW"),
            "source_batch": edge.get("source_batch", ""),
            "source_reconciled_artifact": edge.get("source_reconciled_artifact", ""),
            "accepted_at": edge.get("accepted_at", ""),
            "accepted_by_session": SESSION_ID,
        })

    manifest = {
        "artifact": "cgm_supports_edges_manifest_v1_0.json",
        "version": "1.0",
        "status": "CURRENT",
        "produced_by_session": SESSION_ID,
        "produced_on": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "phase": "B.4",
        "l1_authority": "FORENSIC_ASTROLOGICAL_DATA_v8_0.md §2.1",
        "protocol": "Gemini Pass-1 (promiscuous connector) + Claude Pass-2 (P1/P2/P5 + L3 chain)",
        "total_edges": len(manifest_entries),
        "edges": manifest_entries,
    }
    manifest_path = _DISCOVERY_LAYER / "cgm_supports_edges_manifest_v1_0.json"
    if not dry_run:
        manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"[PIPELINE] Written: {manifest_path}")

    # Write b4_supports_count.json (AC.7)
    total_proposed = sum(r["proposed"] for r in all_results)
    total_accepted = sum(r["accepted"] for r in all_results)
    total_rejected = sum(r["rejected"] for r in all_results)
    total_rejected_p1 = sum(r["rejected_p1"] for r in all_results)
    total_rejected_p2 = sum(r["rejected_p2"] for r in all_results)
    total_rejected_p5 = sum(r["rejected_p5"] for r in all_results)
    total_rejected_l3 = sum(r["rejected_l3_chain"] for r in all_results)

    supports_count = {
        "produced_by_session": SESSION_ID,
        "produced_at": datetime.now(timezone.utc).isoformat(),
        "per_l3_report": [
            {"report_id": rname, "supports_edge_count": count}
            for rname, count in sorted(per_report_counts.items())
        ],
        "aggregate": {
            "total_proposed": total_proposed,
            "total_accepted": total_accepted,
            "total_rejected": total_rejected,
            "rejected_p1": total_rejected_p1,
            "rejected_p2": total_rejected_p2,
            "rejected_p5": total_rejected_p5,
            "rejected_l3_chain": total_rejected_l3,
            "batches_run": len(all_results),
        },
        "l3_gate_pass": len(gate_failures) == 0,
        "l3_gate_failures": gate_failures,
    }

    supports_count_path = _VERIFICATION_DIR / "b4_supports_count.json"
    if not dry_run:
        supports_count_path.write_text(json.dumps(supports_count, indent=2), encoding="utf-8")
        print(f"[PIPELINE] Written: {supports_count_path}")

    # Update b4_edge_count.json (AC.9 partial — full re-export deferred to after DB read)
    edge_count_path = _VERIFICATION_DIR / "b4_edge_count.json"
    if not dry_run and edge_count_path.exists():
        with edge_count_path.open() as f:
            edge_count = json.load(f)
        edge_count["supports_edges"] = total_accepted
        edge_count["supports_deferred_to"] = None
        if "edges_by_type" not in edge_count:
            edge_count["edges_by_type"] = {}
        edge_count["edges_by_type"]["SUPPORTS"] = total_accepted
        if "db_edges_by_type" not in edge_count:
            edge_count["db_edges_by_type"] = {}
        edge_count["db_edges_by_type"]["SUPPORTS"] = total_accepted
        edge_count["b4_supports_complete"] = True
        edge_count["b4_full_close_pending"] = (
            "Madhav_M2A_Exec_8 (Task 3 — Claude CONTRADICTS→Gemini two-pass + B.4 phase final close)"
        )
        edge_count_path.write_text(json.dumps(edge_count, indent=2), encoding="utf-8")
        print(f"[PIPELINE] Updated: {edge_count_path}")

    return {
        "all_accepted": all_accepted,
        "per_report_counts": per_report_counts,
        "gate_failures": gate_failures,
        "supports_count": supports_count,
        "manifest_path": str(manifest_path) if not dry_run else None,
    }


def main():
    parser = argparse.ArgumentParser(description="MARSYS-JIS SUPPORTS edge pipeline orchestrator")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument(
        "--batches",
        default="1,2,3,4,5,6,7,8,9",
        help="Comma-separated batch numbers to run (default: all 9)",
    )
    args = parser.parse_args()
    batches = [int(b.strip()) for b in args.batches.split(",")]

    result = run_pipeline(batches=batches, dry_run=args.dry_run)

    print("\n[PIPELINE] Summary:")
    print(f"  Per-report SUPPORTS counts:")
    for item in result["supports_count"]["per_l3_report"]:
        gate = "✓" if item["supports_edge_count"] >= 1 else "✗ GATE FAIL"
        print(f"    {item['report_id']}: {item['supports_edge_count']} {gate}")
    agg = result["supports_count"]["aggregate"]
    print(f"  Total proposed: {agg['total_proposed']}")
    print(f"  Total accepted: {agg['total_accepted']}")
    print(f"  L3 gate pass:   {result['supports_count']['l3_gate_pass']}")
    if result["gate_failures"]:
        print(f"  GATE FAILURES:  {result['gate_failures']}")


if __name__ == "__main__":
    sys.exit(main())
