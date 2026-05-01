"""
run_contradiction_pipeline.py
MARSYS-JIS RAG Pipeline — Contradiction Scan Pipeline Orchestrator.
Phase B.5 Session 3. Madhav_M2A_Exec_11 (2026-04-27).

Usage:
  python -m rag.reconcilers.run_contradiction_pipeline --batches batch1
  python -m rag.reconcilers.run_contradiction_pipeline --batches batch1,batch2

Reads Claude Pass-1 hypotheses from:
  035_DISCOVERY_LAYER/PROMPTS/gemini/responses/<YYYY-MM-DD>_B5_claude_contradiction_<batch_id>_raw.md

Reads Gemini Pass-2 adjudications from:
  035_DISCOVERY_LAYER/PROMPTS/gemini/responses/<YYYY-MM-DD>_B5_gemini_contradiction_pass2_<batch_id>_raw.md
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

_PROJECT_ROOT = Path(__file__).resolve().parents[4]
_RESPONSES_DIR = _PROJECT_ROOT / "035_DISCOVERY_LAYER" / "PROMPTS" / "gemini" / "responses"
_SUMMARY_FILE = _PROJECT_ROOT / "verification_artifacts" / "RAG" / "contradiction_batch_rates.json"
_DR_FILE = _PROJECT_ROOT / "00_ARCHITECTURE" / "DISAGREEMENT_REGISTER_v1_0.md"


def _find_response(pattern: str) -> Path:
    matches = list(_RESPONSES_DIR.glob(pattern))
    if not matches:
        raise FileNotFoundError(f"No file found matching {pattern} in {_RESPONSES_DIR}")
    if len(matches) > 1:
        matches.sort()
        print(f"[PIPELINE] Multiple matches for {pattern}; using: {matches[-1].name}", file=sys.stderr)
    return matches[-1]


def run_pipeline(batch_ids: list[str]) -> dict:
    from rag.reconcilers.contradiction_reconciler import reconcile_batch

    summary = {
        "batches_run": [],
        "total_confirmed": 0,
        "total_hypotheses": 0,
        "anomaly_fired": False,
    }

    for batch_id in batch_ids:
        print(f"\n[PIPELINE] Processing contradiction batch: {batch_id}")

        try:
            claude_path = _find_response(f"*_B5_claude_contradiction_{batch_id}_raw.md")
            gemini_path = _find_response(f"*_B5_gemini_contradiction_pass2_{batch_id}_raw.md")
        except FileNotFoundError as exc:
            print(f"[PIPELINE] HALT: {exc}", file=sys.stderr)
            sys.exit(1)

        print(f"[PIPELINE] Claude Pass-1: {claude_path.name}")
        print(f"[PIPELINE] Gemini Pass-2: {gemini_path.name}")

        result = reconcile_batch(str(claude_path), str(gemini_path), batch_id)

        total = len(result.confirmed_contradictions) + len(result.rejected_hypotheses)
        batch_summary = {
            "batch_id": batch_id,
            "total_hypotheses": total,
            "confirmed": len(result.confirmed_contradictions),
            "rejected": len(result.rejected_hypotheses),
            "confirmation_rate": round(result.batch_confirmation_rate, 4),
            "anomaly_fired": result.anomaly_fired,
            "confirmed_contradiction_ids": [c["contradiction_id"] for c in result.confirmed_contradictions],
        }
        summary["batches_run"].append(batch_summary)
        summary["total_confirmed"] += len(result.confirmed_contradictions)
        summary["total_hypotheses"] += total

        print(
            f"[PIPELINE] Batch {batch_id}: hypotheses={total} "
            f"confirmed={len(result.confirmed_contradictions)} "
            f"rejected={len(result.rejected_hypotheses)} "
            f"rate={result.batch_confirmation_rate:.1%}"
        )

        for c in result.confirmed_contradictions:
            print(f"  CONFIRMED: {c['contradiction_id']} [{c['contradiction_class']}] {c['hypothesis_text'][:60]}")
        for r in result.rejected_hypotheses:
            hyp = r.get("hypothesis", {})
            htext = hyp.get("hypothesis_text", "?")[:60] if isinstance(hyp, dict) else "?"
            print(f"  REJECTED: '{htext}' — {'; '.join(r.get('failures', [])[:2])}")

        if result.anomaly_fired:
            print(f"\n[PIPELINE] {result.anomaly_message}", file=sys.stderr)
            summary["anomaly_fired"] = True
            break

    return summary


def main() -> None:
    parser = argparse.ArgumentParser(description="MARSYS-JIS Contradiction Scan Pipeline")
    parser.add_argument("--batches", required=True, help="Comma-separated batch IDs")
    args = parser.parse_args()
    batch_ids = [b.strip() for b in args.batches.split(",") if b.strip()]
    if not batch_ids:
        print("[PIPELINE] ERROR: --batches is empty", file=sys.stderr)
        sys.exit(1)

    summary = run_pipeline(batch_ids)

    print("\n[PIPELINE] === Contradiction Scan Summary ===")
    print(f"  Batches run: {len(summary['batches_run'])}")
    print(f"  Total confirmed contradictions: {summary['total_confirmed']}")
    print(f"  Total hypotheses processed: {summary['total_hypotheses']}")
    if summary["total_confirmed"] < 5:
        print(
            f"  [WARNING] Only {summary['total_confirmed']} contradictions confirmed; "
            f"B.5 AC bar requires ≥5.",
            file=sys.stderr,
        )
    if summary["anomaly_fired"]:
        print("  [CONFIRMATION_RATE_ANOMALY] Fired — see stderr output above.", file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    main()
