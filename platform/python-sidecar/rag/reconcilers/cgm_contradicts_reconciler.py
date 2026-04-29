"""
cgm_contradicts_reconciler.py
MARSYS-JIS RAG Pipeline — Gemini Pass-2 adjudicator for CONTRADICTS edges.
Phase B.4 Task 3 (CONTRADICTS sub-task). Madhav_M2A_Exec_8.

Usage:
  python -m rag.reconcilers.cgm_contradicts_reconciler --batch-id B4_contradicts_batchA \\
      --raw-file <path_to_raw.md> [--pass1-batch-file <path>] [--dry-run]

Reads Gemini's raw challenger response and adjudicates each hypothesis.
For accepted hypotheses: validates P1/P2/P5 then marks for persistence.
For rejected hypotheses: logs gemini_challenge_reject ledger event.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import yaml

_PROJECT_ROOT = Path(__file__).resolve().parents[4]
_GEMINI_RESPONSES_DIR = _PROJECT_ROOT / "035_DISCOVERY_LAYER" / "PROMPTS" / "gemini" / "responses"
_CLAUDE_RESPONSES_DIR = _PROJECT_ROOT / "035_DISCOVERY_LAYER" / "PROMPTS" / "claude" / "responses"
_DISCOVERY_LAYER = _PROJECT_ROOT / "035_DISCOVERY_LAYER"

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from rag.ledger import append_two_pass_event, read_events_for_batch
from rag.graph import persist_contradicts_edges

SESSION_ID = "Madhav_M2A_Exec_8"
PROMPT_ID = "claude.cgm_contradicts_edges"
PROMPT_VERSION = "1.0"


# ── Parse Gemini raw challenger response ──────────────────────────────────────

def _extract_yaml_from_raw(raw_text: str) -> list[dict]:
    """
    Extract challenger_adjudications list from Gemini raw markdown response.
    Returns empty list on parse failure (caller raises).
    """
    fenced = re.search(r"```(?:yaml)?\s*\n(.*?)```", raw_text, re.DOTALL)
    yaml_text = fenced.group(1) if fenced else raw_text

    try:
        parsed = yaml.safe_load(yaml_text)
    except yaml.YAMLError as exc:
        print(f"[RECONCILER] YAML parse error: {exc}", file=sys.stderr)
        return []

    if isinstance(parsed, dict):
        return parsed.get("challenger_adjudications", [])
    elif isinstance(parsed, list):
        return parsed
    return []


# ── Load Pass-1 hypothesis map ────────────────────────────────────────────────

def _load_pass1_hypotheses(pass1_batch_file: Path) -> dict[str, dict]:
    """
    Parse the Claude Pass-1 batch .md file and return hypothesis_id → hypothesis dict.
    Falls back to regex field extraction when YAML parsing fails (hypothesis excerpts
    may contain unescaped quotes that break the YAML block).
    """
    if not pass1_batch_file.exists():
        return {}

    text = pass1_batch_file.read_text(encoding="utf-8")
    fenced = re.search(r"```(?:yaml)?\s*\n(.*?)```", text, re.DOTALL)
    if not fenced:
        return {}

    # Try YAML parse first
    try:
        parsed = yaml.safe_load(fenced.group(1))
        hypotheses = {}
        if isinstance(parsed, dict):
            for h in parsed.get("contradiction_hypotheses", []):
                hid = h.get("hypothesis_id", "")
                if hid:
                    hypotheses[hid] = h
        if hypotheses:
            return hypotheses
    except yaml.YAMLError:
        pass

    # Fallback: regex extraction for each hypothesis block
    block_text = fenced.group(1)
    hypotheses = {}
    # Split on hypothesis_id markers
    blocks = re.split(r"\n  - hypothesis_id:", block_text)
    for block in blocks[1:]:  # skip preamble
        hid_m = re.search(r'^[\s"]*([0-9a-f]{12})', block)
        src_m = re.search(r'source_node_id:\s*"([^"]+)"', block)
        tgt_m = re.search(r'target_node_id:\s*"([^"]+)"', block)
        ctype_m = re.search(r'conflict_type:\s*"([^"]+)"', block)
        sev_m = re.search(r'claude_severity_prior:\s*"([^"]+)"', block)
        if not hid_m:
            continue
        hid = hid_m.group(1).strip()
        hypotheses[hid] = {
            "hypothesis_id": hid,
            "source_node_id": src_m.group(1) if src_m else "",
            "target_node_id": tgt_m.group(1) if tgt_m else "",
            "conflict_type": ctype_m.group(1) if ctype_m else "",
            "claude_severity_prior": sev_m.group(1) if sev_m else "MED",
        }
    return hypotheses


def _load_hypotheses_from_ledger(batch_id: str) -> dict[str, dict]:
    """
    Load hypothesis data from ledger claude_proposal events as final fallback.
    Returns hypothesis_id → hypothesis dict.
    """
    events = read_events_for_batch(batch_id)
    hypotheses = {}
    for ev in events:
        if ev.get("event_type") != "claude_proposal":
            continue
        hid = ev.get("hypothesis_id", "")
        if not hid:
            continue
        ep = ev.get("edge_proposal", {})
        hypotheses[hid] = {
            "hypothesis_id": hid,
            "source_node_id": ep.get("source_node_id", ""),
            "target_node_id": ep.get("target_node_id", ""),
            "conflict_type": ev.get("conflict_type", ""),
            "claude_severity_prior": ev.get("claude_severity_prior", "MED"),
        }
    return hypotheses


# ── Validate a single accepted contradiction edge ─────────────────────────────

def _validate_accepted_edge(
    adjudication: dict,
    hypothesis: dict,
) -> tuple[bool, list[str]]:
    """
    Run minimal P1/P2 defense checks on a Gemini-accepted CONTRADICTS edge.
    Returns (valid, reject_reasons).
    """
    reject_reasons = []

    # P1 check: source_node_id must be resolvable to a non-null node type
    src = hypothesis.get("source_node_id", "")
    if not src:
        reject_reasons.append("P1: missing source_node_id")

    # P2 check: target_node_id must be present
    tgt = hypothesis.get("target_node_id", "")
    if not tgt:
        reject_reasons.append("P2: missing target_node_id")

    # Verdict format check
    verdict = adjudication.get("verdict", "")
    if verdict not in ("accept", "reject"):
        reject_reasons.append(f"Schema: invalid verdict '{verdict}' (must be accept or reject)")

    # steelman_reconciliation required
    if not adjudication.get("steelman_reconciliation", "").strip():
        reject_reasons.append("Schema: steelman_reconciliation is empty or missing")

    # accept_rationale required for accepts
    if verdict == "accept" and not adjudication.get("accept_rationale", "").strip():
        reject_reasons.append("Schema: accept_rationale required for accept verdict")

    return (len(reject_reasons) == 0, reject_reasons)


# ── Core reconcile_batch function ─────────────────────────────────────────────

def reconcile_batch(
    batch_id: str,
    raw_file_path: str | Path,
    pass1_batch_file: str | Path | None = None,
    dry_run: bool = False,
) -> dict[str, Any]:
    """
    Reconcile one Gemini challenger raw-response batch.

    Args:
        batch_id: e.g. "B4_contradicts_batchA"
        raw_file_path: path to the raw Gemini challenger response file
        pass1_batch_file: path to the Claude Pass-1 batch file (for hypothesis cross-ref)
        dry_run: if True, do not write ledger events or persist to DB

    Returns:
        dict with proposed / accepted / rejected_by_gemini / rejected_by_pass2 counts
    """
    raw_path = Path(raw_file_path)
    if not raw_path.exists():
        raise FileNotFoundError(f"Raw response file not found: {raw_path}")

    raw_text = raw_path.read_text(encoding="utf-8")
    adjudications = _extract_yaml_from_raw(raw_text)

    if not adjudications:
        raise ValueError(
            f"[RECONCILER] STOP: batch {batch_id} — no adjudications parsed from {raw_path.name}. "
            "Check for malformed YAML in the raw Gemini response."
        )

    # Load Pass-1 hypotheses for cross-reference (file → regex fallback → ledger fallback)
    hypotheses_map: dict[str, dict] = {}
    if pass1_batch_file:
        hypotheses_map = _load_pass1_hypotheses(Path(pass1_batch_file))
    if not hypotheses_map:
        hypotheses_map = _load_hypotheses_from_ledger(batch_id)

    gemini_response_ref = str(raw_path.relative_to(_PROJECT_ROOT))

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    reconciled_filename = raw_path.name.replace("_raw.md", "_reconciled.md")
    reconciled_path = raw_path.parent / reconciled_filename
    reconciler_artifact_ref = str(reconciled_path.relative_to(_PROJECT_ROOT))

    timestamp = datetime.now(timezone.utc).isoformat()
    accepted_edges_out = []
    verdicts = []

    for adj in adjudications:
        hyp_id = adj.get("hypothesis_id", "")
        verdict = adj.get("verdict", "")
        hypothesis = hypotheses_map.get(hyp_id, {})

        if verdict == "accept":
            valid, reasons = _validate_accepted_edge(adj, hypothesis)
            if valid:
                verdicts.append({
                    "adjudication": adj,
                    "hypothesis": hypothesis,
                    "final_verdict": "accept",
                    "reject_reasons": [],
                })
                accepted_edges_out.append({
                    "source_node_id": hypothesis.get("source_node_id", hyp_id),
                    "target_node_id": hypothesis.get("target_node_id", "UNKNOWN"),
                    "conflict_type": hypothesis.get("conflict_type", "unknown"),
                    "claude_severity_prior": hypothesis.get("claude_severity_prior", "MED"),
                    "gemini_confidence": adj.get("confidence", "MED"),
                    "source_batch": batch_id,
                    "claude_pass1_artifact": str(Path(pass1_batch_file).relative_to(_PROJECT_ROOT))
                        if pass1_batch_file else "",
                    "gemini_pass2_artifact": gemini_response_ref,
                    "accepted_at": timestamp,
                    "accepted_by_session": SESSION_ID,
                    "steelman_reconciliation_excerpt": adj.get("steelman_reconciliation", "")[:300],
                    "hypothesis_id": hyp_id,
                })
            else:
                verdicts.append({
                    "adjudication": adj,
                    "hypothesis": hypothesis,
                    "final_verdict": "reject_by_pass2",
                    "reject_reasons": reasons,
                })
        else:
            verdicts.append({
                "adjudication": adj,
                "hypothesis": hypothesis,
                "final_verdict": "reject_by_gemini",
                "reject_reasons": [adj.get("reject_rationale", "Gemini rejected")],
            })

    accepted = [v for v in verdicts if v["final_verdict"] == "accept"]
    rejected_by_gemini = [v for v in verdicts if v["final_verdict"] == "reject_by_gemini"]
    rejected_by_pass2 = [v for v in verdicts if v["final_verdict"] == "reject_by_pass2"]

    # Write reconciled artifact
    reconciled_md = _build_reconciled_artifact(
        batch_id, raw_path, verdicts, accepted, rejected_by_gemini, rejected_by_pass2, today
    )
    if not dry_run:
        reconciled_path.write_text(reconciled_md, encoding="utf-8")
        print(f"[RECONCILER] Wrote: {reconciled_path}")

    # Append ledger events and persist accepted edges
    if not dry_run:
        for v in verdicts:
            adj = v["adjudication"]
            hyp = v["hypothesis"]
            hyp_id = adj.get("hypothesis_id", "")

            edge_proposal = {
                "source_node_id": hyp.get("source_node_id", hyp_id),
                "target_node_id": hyp.get("target_node_id", "UNKNOWN"),
                "edge_type": "CONTRADICTS",
                "l1_source": "FORENSIC_v8_0 (via P1/P6/Rahu-PK scan)",
            }

            if v["final_verdict"] in ("accept", "reject_by_pass2"):
                event_type = "gemini_challenge_accept" if v["final_verdict"] == "accept" else "gemini_challenge_reject"
            else:
                event_type = "gemini_challenge_reject"

            event: dict[str, Any] = {
                "event_type": event_type,
                "timestamp": timestamp,
                "batch_id": batch_id,
                "prompt_id": PROMPT_ID,
                "prompt_version": PROMPT_VERSION,
                "gemini_response_ref": gemini_response_ref,
                "hypothesis_id": hyp_id,
                "reconciler_artifact_ref": reconciler_artifact_ref,
                "decision_basis": (
                    adj.get("accept_rationale", "") if event_type == "gemini_challenge_accept"
                    else "; ".join(v["reject_reasons"])
                ),
                "edge_proposal": edge_proposal,
            }
            append_two_pass_event(event)

        # Persist accepted edges to DB
        if accepted_edges_out:
            written = persist_contradicts_edges(accepted_edges_out)
            print(f"[RECONCILER] Persisted {written} CONTRADICTS edges to DB.")

    return {
        "batch_id": batch_id,
        "proposed": len(adjudications),
        "accepted": len(accepted),
        "rejected_by_gemini": len(rejected_by_gemini),
        "rejected_by_pass2": len(rejected_by_pass2),
        "accepted_edges": accepted_edges_out,
        "reconciled_artifact": str(reconciled_path) if not dry_run else None,
        "reconciler_artifact_ref": reconciler_artifact_ref,
    }


# ── Build reconciled.md artifact ──────────────────────────────────────────────

def _build_reconciled_artifact(
    batch_id, raw_path, verdicts, accepted, rejected_by_gemini, rejected_by_pass2, today
):
    lines = [
        f"# CONTRADICTS Edge Reconciler — Batch {batch_id}",
        f"",
        f"**Session:** {SESSION_ID}  ",
        f"**Date:** {today}  ",
        f"**Raw response:** `{raw_path.name}`  ",
        f"**Reconciler:** `cgm_contradicts_reconciler.py`  ",
        f"",
        f"---",
        f"",
        f"## §1 — Result Summary",
        f"",
        f"| Metric | Count |",
        f"|--------|-------|",
        f"| Proposed (adjudications) | {len(verdicts)} |",
        f"| Accepted (CONTRADICTS edges persisted) | {len(accepted)} |",
        f"| Rejected by Gemini | {len(rejected_by_gemini)} |",
        f"| Rejected by Pass-2 P1/P2/schema | {len(rejected_by_pass2)} |",
        f"",
        f"---",
        f"",
        f"## §2 — Per-Hypothesis Verdict Table",
        f"",
        f"| # | hypothesis_id | conflict_type | final_verdict | gemini_confidence | notes |",
        f"|---|---|---|---|---|---|",
    ]

    for i, v in enumerate(verdicts, 1):
        adj = v["adjudication"]
        hyp = v["hypothesis"]
        hyp_id = adj.get("hypothesis_id", "?")
        conf = adj.get("confidence", "?")
        ctype = hyp.get("conflict_type", adj.get("conflict_type", "?"))
        verdict = v["final_verdict"].upper()
        notes = "; ".join(v["reject_reasons"])[:80] if v["reject_reasons"] else adj.get("steelman_reconciliation", "")[:60]
        lines.append(f"| {i} | {hyp_id} | {ctype} | **{verdict}** | {conf} | {notes} |")

    return "\n".join(lines) + "\n"


# ── CLI entry point ───────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="MARSYS-JIS CONTRADICTS edge reconciler (B.4 Task 3)")
    parser.add_argument("--batch-id", required=True, help="Batch ID (e.g. B4_contradicts_batchA)")
    parser.add_argument("--raw-file", required=True, help="Path to raw Gemini challenger response file")
    parser.add_argument("--pass1-batch-file", help="Path to Claude Pass-1 batch file for cross-reference")
    parser.add_argument("--dry-run", action="store_true", help="Parse and validate without writing outputs")
    args = parser.parse_args()

    result = reconcile_batch(
        batch_id=args.batch_id,
        raw_file_path=args.raw_file,
        pass1_batch_file=args.pass1_batch_file,
        dry_run=args.dry_run,
    )

    print(f"\n[RECONCILER] Batch {result['batch_id']} complete:")
    print(f"  Proposed:              {result['proposed']}")
    print(f"  Accepted:              {result['accepted']}")
    print(f"  Rejected by Gemini:    {result['rejected_by_gemini']}")
    print(f"  Rejected by Pass-2:    {result['rejected_by_pass2']}")
    if result.get("reconciled_artifact"):
        print(f"  Artifact:              {result['reconciled_artifact']}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
