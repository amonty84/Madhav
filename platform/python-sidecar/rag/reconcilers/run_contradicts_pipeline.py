"""
run_contradicts_pipeline.py
MARSYS-JIS RAG Pipeline — CONTRADICTS edge pipeline orchestrator.
Phase B.4 Task 3 (CONTRADICTS sub-task). Madhav_M2A_Exec_8.

Invokes Pass-1 (Claude hypothesis generator) then waits for native to commit
Gemini raw responses, then invokes the reconciler for each committed batch.

Usage (after Pass-1 batch files are generated and native has committed raw responses):
  python -m rag.reconcilers.run_contradicts_pipeline --mode reconcile \\
      [--batch A] [--batch C] [--dry-run]

Or run Pass-1 only:
  python -m rag.reconcilers.run_contradicts_pipeline --mode pass1 [--dry-run]
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

_PROJECT_ROOT = Path(__file__).resolve().parents[4]
_GEMINI_RESPONSES_DIR = _PROJECT_ROOT / "035_DISCOVERY_LAYER" / "PROMPTS" / "gemini" / "responses"
_CLAUDE_RESPONSES_DIR = _PROJECT_ROOT / "035_DISCOVERY_LAYER" / "PROMPTS" / "claude" / "responses"
_VERIFICATION_DIR = _PROJECT_ROOT / "verification_artifacts" / "RAG"
_DISCOVERY_LAYER = _PROJECT_ROOT / "035_DISCOVERY_LAYER"

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from rag.reconcilers.cgm_contradicts_pass1 import run_pass1
from rag.reconcilers.cgm_contradicts_reconciler import reconcile_batch

SESSION_ID = "Madhav_M2A_Exec_8"
RESPONSE_DATE = "2026-04-26"

BATCH_TYPES = ["A", "B", "C"]

BATCH_DESCRIPTIONS = {
    "A": "P1 Layer-Bleed",
    "B": "P6 UVC-Conflict",
    "C": "Rahu-as-PK Dual-Karaka",
}


def _pass1_batch_file(batch_type: str) -> Path:
    return _CLAUDE_RESPONSES_DIR / f"{RESPONSE_DATE}_B4_contradicts_pass1_batch{batch_type}.md"


def _raw_file(batch_type: str) -> Path:
    return _GEMINI_RESPONSES_DIR / f"{RESPONSE_DATE}_B4_contradicts_batch{batch_type}_raw.md"


def _edge_id_for_manifest(src: str, tgt: str) -> str:
    return hashlib.sha256(f"{src}|{tgt}|CONTRADICTS".encode()).hexdigest()[:16]


def run_reconcile_all(
    batches: list[str],
    dry_run: bool = False,
) -> dict:
    """
    For each batch in `batches`, reconcile the Gemini raw response if it exists.
    Collects all accepted edges into the manifest and writes verification artifacts.
    """
    today = datetime.now(timezone.utc).isoformat()
    all_accepted = []
    summary_by_batch = {}

    for batch_type in batches:
        raw_file = _raw_file(batch_type)
        if not raw_file.exists():
            print(f"[PIPELINE] Batch {batch_type}: raw response not found at {raw_file} — skipping.")
            summary_by_batch[batch_type] = {"status": "NOT_FOUND", "proposed": 0, "accepted": 0}
            continue

        pass1_file = _pass1_batch_file(batch_type)
        batch_id = f"B4_contradicts_batch{batch_type}"
        print(f"\n[PIPELINE] Reconciling Batch {batch_type} ({BATCH_DESCRIPTIONS.get(batch_type, '?')})...")

        try:
            result = reconcile_batch(
                batch_id=batch_id,
                raw_file_path=raw_file,
                pass1_batch_file=pass1_file if pass1_file.exists() else None,
                dry_run=dry_run,
            )
        except Exception as exc:
            print(f"[PIPELINE] STOP: Batch {batch_type} reconciler failed: {exc}", file=sys.stderr)
            sys.exit(1)

        summary_by_batch[batch_type] = {
            "status": "OK",
            "proposed": result["proposed"],
            "accepted": result["accepted"],
            "rejected_by_gemini": result["rejected_by_gemini"],
            "rejected_by_pass2": result["rejected_by_pass2"],
        }
        all_accepted.extend(result.get("accepted_edges", []))

    # Write cgm_contradicts_edges_manifest_v1_0.json
    if not dry_run:
        manifest = []
        for i, edge in enumerate(all_accepted, 1):
            manifest.append({
                "edge_id": f"CGM_CONTRADICTS_{i:03d}",
                "source_node_id": edge["source_node_id"],
                "target_node_id": edge["target_node_id"],
                "edge_type": "CONTRADICTS",
                "conflict_type": edge.get("conflict_type", ""),
                "source_batch": edge.get("source_batch", ""),
                "hypothesis_id": edge.get("hypothesis_id", ""),
                "claude_pass1_artifact": edge.get("claude_pass1_artifact", ""),
                "gemini_pass2_artifact": edge.get("gemini_pass2_artifact", ""),
                "claude_severity_prior": edge.get("claude_severity_prior", "MED"),
                "gemini_confidence": edge.get("gemini_confidence", "MED"),
                "accepted_at": edge.get("accepted_at", today),
                "accepted_by_session": SESSION_ID,
                "steelman_reconciliation_excerpt": edge.get("steelman_reconciliation_excerpt", ""),
            })

        manifest_path = _DISCOVERY_LAYER / "cgm_contradicts_edges_manifest_v1_0.json"
        manifest_path.write_text(json.dumps({"edges": manifest}, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"\n[PIPELINE] Manifest written: {manifest_path}")

        # Write b4_contradicts_count.json
        count_by_batch = []
        for batch_type in BATCH_TYPES:
            s = summary_by_batch.get(batch_type, {})
            count_by_batch.append({
                "batch": batch_type,
                "conflict_type": {
                    "A": "p1_layer_bleed",
                    "B": "p6_uvc_conflict",
                    "C": "rahu_as_pk",
                }.get(batch_type, "unknown"),
                "proposed": s.get("proposed", 0),
                "accepted": s.get("accepted", 0),
                "rejected_by_gemini": s.get("rejected_by_gemini", 0),
                "rejected_by_pass2_schema": s.get("rejected_by_pass2", 0),
            })

        totals = {
            "total_proposed": sum(s.get("proposed", 0) for s in summary_by_batch.values()),
            "total_accepted": len(all_accepted),
            "total_rejected": sum(s.get("rejected_by_gemini", 0) + s.get("rejected_by_pass2", 0)
                                  for s in summary_by_batch.values()),
        }

        by_target_type = {}
        for edge in all_accepted:
            tgt = edge["target_node_id"]
            if tgt.startswith("UCN.SEC"):
                t = "ucn_section"
            elif tgt.startswith("L3."):
                t = "l3_report"
            elif tgt.startswith("SIG."):
                t = "signal"
            elif tgt.startswith("KARAKA."):
                t = "karaka_system"
            elif tgt.startswith("CONTRACT."):
                t = "layer_contract"
            else:
                t = "other"
            by_target_type[t] = by_target_type.get(t, 0) + 1

        count_json = {
            "produced_at": today,
            "produced_by_session": SESSION_ID,
            "by_batch": count_by_batch,
            "totals": totals,
            "by_target_node_type": by_target_type,
        }

        count_path = _VERIFICATION_DIR / "b4_contradicts_count.json"
        _VERIFICATION_DIR.mkdir(parents=True, exist_ok=True)
        count_path.write_text(json.dumps(count_json, indent=2), encoding="utf-8")
        print(f"[PIPELINE] Counts written: {count_path}")

    return {
        "batches": summary_by_batch,
        "total_accepted": len(all_accepted),
        "status": "OK",
    }


def main():
    parser = argparse.ArgumentParser(description="MARSYS-JIS CONTRADICTS pipeline orchestrator")
    parser.add_argument("--mode", choices=["pass1", "reconcile"], default="reconcile",
                        help="pass1: run hypothesis generation. reconcile: run Gemini response reconciler.")
    parser.add_argument("--batch", action="append", choices=["A", "B", "C"],
                        help="Batch type(s) to process. Defaults to all (A, B, C).")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    batches = args.batch or BATCH_TYPES

    if args.mode == "pass1":
        result = run_pass1(repo_root=_PROJECT_ROOT, dry_run=args.dry_run)
        print(f"\nPass-1 complete: {result['total']} hypotheses generated.")
        if result.get("status") == "ZERO_HYPOTHESES_STOP":
            sys.exit(2)
    else:
        result = run_reconcile_all(batches=batches, dry_run=args.dry_run)
        print(f"\nPipeline complete: {result['total_accepted']} CONTRADICTS edges accepted.")


if __name__ == "__main__":
    main()
