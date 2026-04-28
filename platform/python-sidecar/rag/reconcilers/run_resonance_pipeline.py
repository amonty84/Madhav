"""
run_resonance_pipeline.py
MARSYS-JIS RAG Pipeline — Resonance Walk Pipeline Orchestrator.
Phase B.5 Session 2. Madhav_M2A_Exec_10 (2026-04-27).

Usage:
  python -m rag.reconcilers.run_resonance_pipeline --batches B5_resonance_walk_batch1
  python -m rag.reconcilers.run_resonance_pipeline --batches B5_resonance_walk_batch1,B5_resonance_walk_batch2

Reads Gemini raw responses from:
  035_DISCOVERY_LAYER/PROMPTS/gemini/responses/<YYYY-MM-DD>_B5_resonance_walk_<batch_id>_raw.md

For each batch:
1. Invokes resonance_walk_reconciler.reconcile_batch().
2. Appends per-batch row to verification_artifacts/RAG/batch_acceptance_rates.json.
3. Checks for [ACCEPTANCE_RATE_ANOMALY] — HARD HALT before next batch if fires.
   Per Q2 native decision 2026-04-27: opens DIS.class.acceptance_rate_anomaly in
   DISAGREEMENT_REGISTER_v1_0.md and halts. Does NOT auto-proceed.
4. Prints reconciliation summary.
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
    """
    Find raw response file matching *_B5_resonance_walk_{batch_id}_raw.md.
    Raises FileNotFoundError if not found.
    """
    pattern = f"*_B5_resonance_walk_{batch_id}_raw.md"
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
            "produced_by_session": "Madhav_M2A_Exec_10",
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


def _open_disagreement_register_entry(batch_id: str, rate: float, surface: str) -> str:
    """
    Append a DIS.class.acceptance_rate_anomaly entry to DISAGREEMENT_REGISTER_v1_0.md.
    Returns the DR entry ID string.
    Per Q2 native decision 2026-04-27: every anomaly opens a real DR entry.
    """
    if not _DR_FILE.exists():
        print(f"[PIPELINE] WARNING: {_DR_FILE} not found; cannot open DR entry", file=sys.stderr)
        return "DR_UNKNOWN"

    dr_text = _DR_FILE.read_text(encoding="utf-8")

    # Determine next DR entry ID
    existing_ids = [m for m in __import__("re").findall(r"DIS\.(\d+)", dr_text)]
    next_num = max((int(i) for i in existing_ids), default=0) + 1
    dr_id = f"DIS.{next_num:03d}"

    ts = datetime.now(timezone.utc).isoformat()
    entry = f"""
---

### {dr_id} — DIS.class.acceptance_rate_anomaly

- **opened_at:** {ts}
- **opened_by_session:** Madhav_M2A_Exec_10
- **class:** DIS.class.acceptance_rate_anomaly
- **batch_id:** {batch_id}
- **acceptance_rate:** {rate:.4f} (band: [0.15, 0.80])
- **surface:** {surface}
- **status:** OPEN
- **resolution:** PENDING — native instruction required before pipeline can resume
- **options:**
  - Option A: Re-prompt with stricter input curation and re-run the batch
  - Option B: Accept the rate as data and explicitly authorize proceed (native logs restart in halts_encountered[])
  - Option C: Re-author the prompt with adjusted instruction

"""
    _DR_FILE.write_text(dr_text.rstrip() + entry, encoding="utf-8")
    return dr_id


def run_pipeline(batch_ids: list[str]) -> dict:
    """
    Run the resonance walk pipeline for each batch in order.
    Returns summary dict. HARD HALT on first ACCEPTANCE_RATE_ANOMALY per Q2 decision.
    """
    from rag.reconcilers.resonance_walk_reconciler import reconcile_batch

    summary = {
        "batches_run": [],
        "total_resonances_accepted": 0,
        "total_proposals": 0,
        "anomaly_fired": False,
        "anomaly_batch": None,
        "dr_entries_opened": [],
    }

    for batch_id in batch_ids:
        print(f"\n[PIPELINE] Processing resonance batch: {batch_id}")
        try:
            raw_path = _find_raw_response(batch_id)
        except FileNotFoundError as exc:
            print(f"[PIPELINE] HALT: {exc}", file=sys.stderr)
            sys.exit(1)

        print(f"[PIPELINE] Raw response: {raw_path.name}")
        result = reconcile_batch(str(raw_path), batch_id)

        total_proposed = len(result.accepted_resonances) + len(result.rejected_proposals)
        acceptance_rate = result.batch_acceptance_rate

        _append_batch_rate(
            batch_id=batch_id,
            batch_type="resonance_walk",
            total_proposed=total_proposed,
            total_accepted=len(result.accepted_resonances),
            total_rejected=len(result.rejected_proposals),
            acceptance_rate=acceptance_rate,
            anomaly_fired=result.anomaly_fired,
        )

        batch_summary = {
            "batch_id": batch_id,
            "proposed": total_proposed,
            "accepted": len(result.accepted_resonances),
            "rejected": len(result.rejected_proposals),
            "acceptance_rate": round(acceptance_rate, 4) if acceptance_rate == acceptance_rate else float("nan"),
            "anomaly_fired": result.anomaly_fired,
            "accepted_resonance_ids": [r["resonance_id"] for r in result.accepted_resonances],
        }
        summary["batches_run"].append(batch_summary)
        summary["total_resonances_accepted"] += len(result.accepted_resonances)
        summary["total_proposals"] += total_proposed

        if acceptance_rate == acceptance_rate:
            print(
                f"[PIPELINE] Batch {batch_id}: proposed={total_proposed} "
                f"accepted={len(result.accepted_resonances)} "
                f"rejected={len(result.rejected_proposals)} rate={acceptance_rate:.1%}"
            )
        else:
            print(f"[PIPELINE] Batch {batch_id}: no verdicts emitted")

        for r in result.accepted_resonances:
            domains = " + ".join(r.get("domains_bridged", []))
            print(f"  ACCEPT: {r['resonance_id']} [{domains}] {r['claim_text'][:60]}...")
        for r in result.rejected_proposals:
            claim = r["proposal"].get("claim_text", "?")[:50] if isinstance(r["proposal"], dict) else "?"
            print(f"  REJECT: '{claim}...' — {'; '.join(r['failures'][:2])}")

        if result.anomaly_fired:
            print(f"\n[PIPELINE] {result.anomaly_message}", file=sys.stderr)
            # Q2 HARD HALT: open DR entry + halt
            dr_id = _open_disagreement_register_entry(batch_id, acceptance_rate, "RESONANCE")
            summary["anomaly_fired"] = True
            summary["anomaly_batch"] = batch_id
            summary["dr_entries_opened"].append(dr_id)
            print(
                f"[PIPELINE] HARD HALT: Opened {dr_id} (DIS.class.acceptance_rate_anomaly). "
                f"Surface to native before continuing. Pipeline does NOT auto-proceed.",
                file=sys.stderr,
            )
            print(
                f"[PIPELINE] Recommendation matrix:\n"
                f"  Option A: Re-prompt with stricter input curation and re-run batch {batch_id}\n"
                f"  Option B: Accept rate as data — native explicitly authorizes proceed "
                f"(log restart in halts_encountered[])\n"
                f"  Option C: Re-author resonance_walk_v1_0.md prompt with adjusted instructions",
                file=sys.stderr,
            )
            break

    return summary


def main() -> None:
    parser = argparse.ArgumentParser(description="MARSYS-JIS Resonance Walk Pipeline")
    parser.add_argument(
        "--batches",
        required=True,
        help="Comma-separated batch IDs (e.g. B5_resonance_walk_batch1,B5_resonance_walk_batch2)",
    )
    args = parser.parse_args()
    batch_ids = [b.strip() for b in args.batches.split(",") if b.strip()]
    if not batch_ids:
        print("[PIPELINE] ERROR: --batches is empty", file=sys.stderr)
        sys.exit(1)

    summary = run_pipeline(batch_ids)

    print("\n[PIPELINE] === Resonance Walk Summary ===")
    print(f"  Batches run: {len(summary['batches_run'])}")
    print(f"  Total accepted resonances: {summary['total_resonances_accepted']}")
    print(f"  Total proposals processed: {summary['total_proposals']}")
    if summary["anomaly_fired"]:
        print(
            f"  [ACCEPTANCE_RATE_ANOMALY] HARD HALT on batch: {summary['anomaly_batch']} "
            f"DR: {summary['dr_entries_opened']}"
        )
        sys.exit(2)


if __name__ == "__main__":
    main()
