"""
run_cluster_pipeline.py
MARSYS-JIS RAG Pipeline — Cluster Annotation Pipeline Orchestrator.
Phase B.5 Session 3. Madhav_M2A_Exec_11 (2026-04-27).

Usage:
  python -m rag.reconcilers.run_cluster_pipeline --batches B5_cluster_annotation_batch1
  python -m rag.reconcilers.run_cluster_pipeline --batches B5_cluster_annotation_batch1,B5_cluster_annotation_batch2

Reads Gemini raw responses from:
  035_DISCOVERY_LAYER/PROMPTS/gemini/responses/<YYYY-MM-DD>_B5_cluster_annotation_<batch_id>_raw.md

For each batch:
1. Invokes cluster_reconciler.reconcile_batch().
2. Checks for [ACCEPTANCE_RATE_ANOMALY] — HARD HALT per Q1 band [0.15, 0.80] enforcement.
3. Prints reconciliation summary.
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

_PROJECT_ROOT = Path(__file__).resolve().parents[4]
_RESPONSES_DIR = _PROJECT_ROOT / "035_DISCOVERY_LAYER" / "PROMPTS" / "gemini" / "responses"
_BATCH_RATES_FILE = _PROJECT_ROOT / "verification_artifacts" / "RAG" / "batch_acceptance_rates.json"
_DR_FILE = _PROJECT_ROOT / "00_ARCHITECTURE" / "DISAGREEMENT_REGISTER_v1_0.md"


def _find_raw_response(batch_id: str) -> Path:
    pattern = f"*_B5_cluster_annotation_{batch_id}_raw.md"
    matches = list(_RESPONSES_DIR.glob(pattern))
    if not matches:
        raise FileNotFoundError(
            f"No raw response file found matching {pattern} in {_RESPONSES_DIR}"
        )
    if len(matches) > 1:
        matches.sort()
        print(f"[PIPELINE] Multiple matches for {pattern}; using: {matches[-1].name}", file=sys.stderr)
    return matches[-1]


def _append_batch_rate(
    batch_id: str,
    batch_type: str,
    total_proposed: int,
    total_accepted: int,
    total_rejected: int,
    acceptance_rate: float,
    anomaly_fired: bool,
) -> None:
    if _BATCH_RATES_FILE.exists():
        with _BATCH_RATES_FILE.open() as f:
            data = json.load(f)
    else:
        data = {
            "schema_version": "0.1",
            "produced_by_session": "Madhav_M2A_Exec_11",
            "batches": [],
        }

    data["batches"].append({
        "batch_id": batch_id,
        "batch_type": batch_type,
        "total_proposed": total_proposed,
        "total_accepted": total_accepted,
        "total_rejected": total_rejected,
        "acceptance_rate": round(acceptance_rate, 4) if acceptance_rate == acceptance_rate else None,
        "anomaly_fired": anomaly_fired,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })

    with _BATCH_RATES_FILE.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def _open_disagreement_register_entry(batch_id: str, rate: float) -> str:
    if not _DR_FILE.exists():
        return "DR_UNKNOWN"
    dr_text = _DR_FILE.read_text(encoding="utf-8")
    existing_ids = [m for m in __import__("re").findall(r"DIS\.(\d+)", dr_text)]
    next_num = max((int(i) for i in existing_ids), default=0) + 1
    dr_id = f"DIS.{next_num:03d}"
    ts = datetime.now(timezone.utc).isoformat()
    entry = f"""
---

### {dr_id} — DIS.class.acceptance_rate_anomaly

- **opened_at:** {ts}
- **opened_by_session:** Madhav_M2A_Exec_11
- **class:** DIS.class.acceptance_rate_anomaly
- **batch_id:** {batch_id}
- **acceptance_rate:** {rate:.4f} (band: [0.15, 0.80])
- **surface:** CLUSTER
- **status:** OPEN
- **resolution:** PENDING — native instruction required before pipeline can resume
- **options:**
  - Option A: Re-prompt with stricter cluster input curation and re-run the batch
  - Option B: Accept the rate as data and explicitly authorize proceed
  - Option C: Re-author cluster_annotation_v1_0.md with adjusted instructions

"""
    _DR_FILE.write_text(dr_text.rstrip() + entry, encoding="utf-8")
    return dr_id


def run_pipeline(batch_ids: list[str]) -> dict:
    from rag.reconcilers.cluster_reconciler import reconcile_batch

    summary = {
        "batches_run": [],
        "total_clusters_accepted": 0,
        "total_proposals": 0,
        "anomaly_fired": False,
        "anomaly_batch": None,
        "dr_entries_opened": [],
    }

    for batch_id in batch_ids:
        print(f"\n[PIPELINE] Processing cluster batch: {batch_id}")
        try:
            raw_path = _find_raw_response(batch_id)
        except FileNotFoundError as exc:
            print(f"[PIPELINE] HALT: {exc}", file=sys.stderr)
            sys.exit(1)

        print(f"[PIPELINE] Raw response: {raw_path.name}")
        result = reconcile_batch(str(raw_path), batch_id)

        total_proposed = len(result.accepted_clusters) + len(result.rejected_proposals)
        acceptance_rate = result.batch_acceptance_rate

        _append_batch_rate(
            batch_id=batch_id,
            batch_type="cluster_annotation",
            total_proposed=total_proposed,
            total_accepted=len(result.accepted_clusters),
            total_rejected=len(result.rejected_proposals),
            acceptance_rate=acceptance_rate,
            anomaly_fired=result.anomaly_fired,
        )

        batch_summary = {
            "batch_id": batch_id,
            "proposed": total_proposed,
            "accepted": len(result.accepted_clusters),
            "rejected": len(result.rejected_proposals),
            "acceptance_rate": round(acceptance_rate, 4) if acceptance_rate == acceptance_rate else float("nan"),
            "anomaly_fired": result.anomaly_fired,
            "accepted_cluster_ids": [c["cluster_id"] for c in result.accepted_clusters],
        }
        summary["batches_run"].append(batch_summary)
        summary["total_clusters_accepted"] += len(result.accepted_clusters)
        summary["total_proposals"] += total_proposed

        print(
            f"[PIPELINE] Batch {batch_id}: proposed={total_proposed} "
            f"accepted={len(result.accepted_clusters)} "
            f"rejected={len(result.rejected_proposals)} "
            f"rate={acceptance_rate:.1%}"
        )

        for c in result.accepted_clusters:
            print(f"  ACCEPT: {c['cluster_id']} [{c['dominant_domain']}] {c['cluster_label']}")
        for r in result.rejected_proposals:
            ann = r.get("annotation", {})
            label = ann.get("cluster_label", "?") if isinstance(ann, dict) else "?"
            print(f"  REJECT: '{label}' — {'; '.join(r.get('failures', [])[:2])}")

        if result.anomaly_fired:
            print(f"\n[PIPELINE] {result.anomaly_message}", file=sys.stderr)
            dr_id = _open_disagreement_register_entry(batch_id, acceptance_rate)
            summary["anomaly_fired"] = True
            summary["anomaly_batch"] = batch_id
            summary["dr_entries_opened"].append(dr_id)
            print(
                f"[PIPELINE] HARD HALT: Opened {dr_id}. Surface to native before continuing.",
                file=sys.stderr,
            )
            break

    return summary


def main() -> None:
    parser = argparse.ArgumentParser(description="MARSYS-JIS Cluster Annotation Pipeline")
    parser.add_argument("--batches", required=True, help="Comma-separated batch IDs")
    args = parser.parse_args()
    batch_ids = [b.strip() for b in args.batches.split(",") if b.strip()]
    if not batch_ids:
        print("[PIPELINE] ERROR: --batches is empty", file=sys.stderr)
        sys.exit(1)

    summary = run_pipeline(batch_ids)

    print("\n[PIPELINE] === Cluster Annotation Summary ===")
    print(f"  Batches run: {len(summary['batches_run'])}")
    print(f"  Total accepted clusters: {summary['total_clusters_accepted']}")
    print(f"  Total proposals processed: {summary['total_proposals']}")
    if summary["anomaly_fired"]:
        print(
            f"  [ACCEPTANCE_RATE_ANOMALY] HARD HALT on batch: {summary['anomaly_batch']} "
            f"DR: {summary['dr_entries_opened']}"
        )
        sys.exit(2)


if __name__ == "__main__":
    main()
