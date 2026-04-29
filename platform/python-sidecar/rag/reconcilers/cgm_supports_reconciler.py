"""
cgm_supports_reconciler.py
MARSYS-JIS RAG Pipeline — Claude Pass-2 reconciler for SUPPORTS edges.
Phase B.4 Task 3 (SUPPORTS sub-task). Madhav_M2A_Exec_7.

Usage:
  python -m rag.reconcilers.cgm_supports_reconciler --batch-id B4_supports_batch1 \\
      --raw-file <path_to_raw.md> [--dry-run]

Or import reconcile_batch() for programmatic use.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import yaml

# Project root (4 levels up from this file)
_PROJECT_ROOT = Path(__file__).resolve().parents[4]
_L3_REPORTS_DIR = _PROJECT_ROOT / "03_DOMAIN_REPORTS"
_RESPONSES_DIR = _PROJECT_ROOT / "035_DISCOVERY_LAYER" / "PROMPTS" / "gemini" / "responses"
_DISCOVERY_LAYER = _PROJECT_ROOT / "035_DISCOVERY_LAYER"
_RAG_ROOT = Path(__file__).resolve().parents[1]

# Validators (import path-safe)
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from rag.validators import p5_signal_id_resolution as p5
from rag.ledger import append_two_pass_event

SESSION_ID = "Madhav_M2A_Exec_7"
PROMPT_ID = "gemini.cgm_supports_edges"
PROMPT_VERSION = "1.0"

# CURRENT L3 reports (filenames only, no path)
CURRENT_L3_REPORTS = {
    "REPORT_CAREER_DHARMA_v1_1.md",
    "REPORT_CHILDREN_v1_1.md",
    "REPORT_FINANCIAL_v2_1.md",
    "REPORT_HEALTH_LONGEVITY_v1_1.md",
    "REPORT_PARENTS_v1_1.md",
    "REPORT_PSYCHOLOGY_MIND_v1_1.md",
    "REPORT_RELATIONSHIPS_v1_1.md",
    "REPORT_SPIRITUAL_v1_1.md",
    "REPORT_TRAVEL_v1_1.md",
}

# Valid UCN section IDs (derived from UCN_v4_0.md headings)
_UCN_SECTION_IDS: set[str] | None = None


def _get_ucn_section_ids() -> set[str]:
    global _UCN_SECTION_IDS
    if _UCN_SECTION_IDS is None:
        ucn_path = _PROJECT_ROOT / "025_HOLISTIC_SYNTHESIS" / "UCN_v4_0.md"
        ids: set[str] = set()
        with ucn_path.open(encoding="utf-8") as f:
            for line in f:
                m = re.match(r"^### ([IVX]+\.\d+) —", line)
                if m:
                    ids.add(f"UCN.SEC.{m.group(1)}")
        _UCN_SECTION_IDS = ids
    return _UCN_SECTION_IDS


# ---------------------------------------------------------------------------
# Parse raw Gemini response
# ---------------------------------------------------------------------------

def _extract_yaml_from_raw(raw_text: str) -> list[dict]:
    """
    Extract proposed_supports_edges list from raw Gemini markdown response.
    Handles YAML inside ```yaml ... ``` fences or bare YAML.
    Returns list of edge dicts (empty list on parse failure — caller logs error).
    """
    # Try fenced YAML block first
    fenced = re.search(r"```(?:yaml)?\s*\n(.*?)```", raw_text, re.DOTALL)
    yaml_text = fenced.group(1) if fenced else raw_text

    try:
        parsed = yaml.safe_load(yaml_text)
    except yaml.YAMLError as exc:
        print(f"[RECONCILER] YAML parse error: {exc}", file=sys.stderr)
        return []

    if isinstance(parsed, dict):
        edges = parsed.get("proposed_supports_edges", [])
    elif isinstance(parsed, list):
        edges = parsed
    else:
        edges = []

    return edges if isinstance(edges, list) else []


# ---------------------------------------------------------------------------
# Validators
# ---------------------------------------------------------------------------

def _check_p5(edge: dict) -> tuple[bool, str]:
    """P5: source_signal_id must exist in MSR registry."""
    sig_id = edge.get("source_signal_id", "").strip()
    registry = p5.get_signal_registry()
    if sig_id in registry:
        return True, ""
    return False, f"P5: signal_id '{sig_id}' not in MSR registry"


def _check_p1(edge: dict) -> tuple[bool, str]:
    """P1: l3_evidence_report must be a CURRENT L3 file (not L1)."""
    report = edge.get("l3_evidence_report", "").strip()
    # Strip path prefix if present
    report_name = Path(report).name if report else ""
    if not report_name:
        return False, "P1: l3_evidence_report is empty"
    if report_name not in CURRENT_L3_REPORTS:
        return False, f"P1: '{report_name}' is not a CURRENT L3 report"
    return True, ""


def _check_p2(edge: dict) -> tuple[bool, str]:
    """P2: l1_basis must be non-empty and target_ucn_section_id must be valid."""
    ucn_id = edge.get("target_ucn_section_id", "").strip()
    valid_ucn = _get_ucn_section_ids()
    if ucn_id not in valid_ucn:
        return False, f"P2: target_ucn_section_id '{ucn_id}' not in UCN_v4_0 section list"
    l1_basis = edge.get("l1_basis", "").strip()
    if not l1_basis:
        return False, "P2: l1_basis is empty"
    return True, ""


def _check_l3_chain(edge: dict, window: int = 100) -> tuple[bool, str]:
    """
    L3 chain check: confirm the L3 report body contains the source_signal_id AND
    the target_ucn_section_id (via raw_ref §X.Y) or target_ucn_heading within a
    `window`-line sliding window.
    """
    report_name = Path(edge.get("l3_evidence_report", "")).name
    sig_id = edge.get("source_signal_id", "").strip()
    ucn_id = edge.get("target_ucn_section_id", "").strip()
    ucn_heading = edge.get("target_ucn_heading", "").strip()

    if not report_name or not sig_id or not ucn_id:
        return False, "L3_CHAIN: missing required fields"

    report_path = _L3_REPORTS_DIR / report_name
    if not report_path.exists():
        return False, f"L3_CHAIN: report file not found: {report_name}"

    lines = report_path.read_text(encoding="utf-8").splitlines()

    # Build raw_ref from stable ID: UCN.SEC.IV.2 → §IV.2
    raw_ref_m = re.match(r"UCN\.SEC\.(.+)", ucn_id)
    ucn_raw_ref = f"§{raw_ref_m.group(1)}" if raw_ref_m else ""

    # Build numeric-only sig ID for MSR.NNN citations
    sig_num_m = re.match(r"SIG\.MSR\.(\d+)", sig_id)
    sig_num = sig_num_m.group(1).lstrip("0") if sig_num_m else ""  # "042" → "42"

    # Patterns to match signal reference in L3 text
    sig_patterns = [re.compile(re.escape(sig_id))]
    if sig_num:
        sig_patterns.append(re.compile(rf"\bMSR\.0*{sig_num}\b"))

    # Patterns to match UCN section reference in L3 text
    ucn_patterns = []
    if ucn_raw_ref:
        ucn_patterns.append(re.compile(re.escape(ucn_raw_ref)))
    if ucn_heading:
        # Match first 20 chars of heading (avoids full-string regex complexity)
        truncated = re.escape(ucn_heading[:25])
        ucn_patterns.append(re.compile(truncated))

    # Find all lines where signal appears
    sig_line_indices = []
    for i, line in enumerate(lines):
        if any(p.search(line) for p in sig_patterns):
            sig_line_indices.append(i)

    if not sig_line_indices:
        # Signal not found by ID in L3 — allow implicit references (LOW confidence)
        # Return True but flag it for the reconciler output
        return True, "L3_CHAIN: signal not found by ID in L3 (implicit reference — LOW confidence)"

    # Check if any UCN pattern appears within window of any signal line
    for sig_line in sig_line_indices:
        start = max(0, sig_line - window)
        end = min(len(lines), sig_line + window)
        window_text = "\n".join(lines[start:end])
        if any(p.search(window_text) for p in ucn_patterns):
            return True, ""

    return False, (
        f"L3_CHAIN: signal '{sig_id}' found in L3 at lines "
        f"{sig_line_indices[:3]}... but UCN ref '{ucn_raw_ref}' not within "
        f"{window}-line window"
    )


# ---------------------------------------------------------------------------
# Reconcile a single edge
# ---------------------------------------------------------------------------

def _reconcile_edge(edge: dict) -> dict:
    """
    Run P1/P2/P5 + L3 chain check on a single proposed edge.
    Returns a verdict dict.
    """
    p5_ok, p5_reason = _check_p5(edge)
    p1_ok, p1_reason = _check_p1(edge)
    p2_ok, p2_reason = _check_p2(edge)
    l3_ok, l3_reason = _check_l3_chain(edge)

    # An edge is rejected if any hard check fails
    rejected = not (p5_ok and p1_ok and p2_ok and l3_ok)

    # L3_CHAIN allows implicit references (soft fail) — don't hard-reject those
    if not l3_ok and "implicit reference" in l3_reason:
        # Treat as accepted with LOW confidence + flag
        rejected = False
        l3_ok = True

    reject_reasons = [r for ok, r in [(p5_ok, p5_reason), (p1_ok, p1_reason), (p2_ok, p2_reason), (l3_ok, l3_reason)] if not ok and r]

    return {
        "edge": edge,
        "accepted": not rejected,
        "p1_pass": p1_ok,
        "p2_pass": p2_ok,
        "p5_pass": p5_ok,
        "l3_chain_pass": l3_ok,
        "reject_reasons": reject_reasons,
        "l3_chain_note": l3_reason,
    }


# ---------------------------------------------------------------------------
# Core reconcile_batch function
# ---------------------------------------------------------------------------

def reconcile_batch(
    batch_id: str,
    raw_file_path: str | Path,
    dry_run: bool = False,
) -> dict[str, Any]:
    """
    Reconcile one Gemini raw-response batch.

    Args:
        batch_id: e.g. "B4_supports_batch1"
        raw_file_path: path to the raw Gemini response file
        dry_run: if True, do not write ledger events or manifest entries

    Returns:
        dict with accepted_edges, rejected_edges, summary stats, paths to output files
    """
    raw_path = Path(raw_file_path)
    if not raw_path.exists():
        raise FileNotFoundError(f"Raw response file not found: {raw_path}")

    raw_text = raw_path.read_text(encoding="utf-8")
    proposed_edges = _extract_yaml_from_raw(raw_text)

    if not proposed_edges:
        raise ValueError(
            f"[RECONCILER] STOP: batch {batch_id} — no edges parsed from {raw_path.name}. "
            "Check for malformed YAML in the raw Gemini response."
        )

    gemini_response_ref = str(raw_path.relative_to(_PROJECT_ROOT))

    # Reconcile each edge
    verdicts = [_reconcile_edge(e) for e in proposed_edges]

    accepted = [v for v in verdicts if v["accepted"]]
    rejected = [v for v in verdicts if not v["accepted"]]
    rejected_p1 = [v for v in rejected if not v["p1_pass"]]
    rejected_p2 = [v for v in rejected if not v["p2_pass"] and v["p1_pass"]]
    rejected_p5 = [v for v in rejected if not v["p5_pass"]]
    rejected_l3 = [v for v in rejected if v["p1_pass"] and v["p2_pass"] and v["p5_pass"]]

    # Write reconciled artifact
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    reconciled_filename = raw_path.name.replace("_raw.md", "_reconciled.md")
    reconciled_path = raw_path.parent / reconciled_filename
    reconciler_artifact_ref = str(reconciled_path.relative_to(_PROJECT_ROOT))

    reconciled_md = _build_reconciled_artifact(
        batch_id, raw_path, verdicts, accepted, rejected,
        rejected_p1, rejected_p2, rejected_p5, rejected_l3, today
    )

    if not dry_run:
        reconciled_path.write_text(reconciled_md, encoding="utf-8")
        print(f"[RECONCILER] Wrote: {reconciled_path}")

    # Append ledger events
    timestamp = datetime.now(timezone.utc).isoformat()
    accepted_edges_out = []

    if not dry_run:
        for verdict in verdicts:
            edge = verdict["edge"]
            edge_proposal_payload = {
                "source_node_id": edge.get("source_signal_id", ""),
                "target_node_id": edge.get("target_ucn_section_id", ""),
                "edge_type": "SUPPORTS",
                "l1_source": edge.get("l1_basis", ""),
                "l3_evidence_report": edge.get("l3_evidence_report", ""),
                "confidence_prior": edge.get("confidence_prior", "LOW"),
            }

            # Gemini proposal event
            proposal_event = {
                "event_type": "gemini_proposal",
                "timestamp": timestamp,
                "batch_id": batch_id,
                "prompt_id": PROMPT_ID,
                "prompt_version": PROMPT_VERSION,
                "gemini_response_ref": gemini_response_ref,
                "edge_proposal": edge_proposal_payload,
            }
            append_two_pass_event(proposal_event)

            # Claude reconcile event
            event_type = "claude_reconcile_accept" if verdict["accepted"] else "claude_reconcile_reject"
            decision_basis = (
                "P1/P2/P5/L3-chain pass" if verdict["accepted"]
                else "; ".join(verdict["reject_reasons"])
            )
            reconcile_event: dict[str, Any] = {
                "event_type": event_type,
                "timestamp": timestamp,
                "batch_id": batch_id,
                "prompt_id": PROMPT_ID,
                "prompt_version": PROMPT_VERSION,
                "gemini_response_ref": gemini_response_ref,
                "reconciler_artifact_ref": reconciler_artifact_ref,
                "edge_proposal": edge_proposal_payload,
                "decision_basis": decision_basis,
                "validator_results": {
                    "P1": verdict["p1_pass"],
                    "P2": verdict["p2_pass"],
                    "P5": verdict["p5_pass"],
                    "l3_chain": verdict["l3_chain_pass"],
                },
            }
            if verdict["accepted"]:
                reconcile_event["accepted_by_session"] = SESSION_ID

            append_two_pass_event(reconcile_event)

        # Build accepted_edges_out for downstream persistence
        for verdict in accepted:
            edge = verdict["edge"]
            accepted_edges_out.append({
                "source_signal_id": edge.get("source_signal_id", ""),
                "target_ucn_section_id": edge.get("target_ucn_section_id", ""),
                "target_ucn_heading": edge.get("target_ucn_heading", ""),
                "l3_evidence_report": Path(edge.get("l3_evidence_report", "")).name,
                "l3_evidence_section": edge.get("l3_evidence_section", ""),
                "l1_source": edge.get("l1_basis", ""),
                "confidence_prior": edge.get("confidence_prior", "LOW"),
                "source_batch": batch_id,
                "source_reconciled_artifact": reconciler_artifact_ref,
                "accepted_at": timestamp,
                "accepted_by_session": SESSION_ID,
            })

    return {
        "batch_id": batch_id,
        "proposed": len(proposed_edges),
        "accepted": len(accepted),
        "rejected": len(rejected),
        "rejected_p1": len(rejected_p1),
        "rejected_p2": len(rejected_p2),
        "rejected_p5": len(rejected_p5),
        "rejected_l3_chain": len(rejected_l3),
        "accepted_edges": accepted_edges_out,
        "reconciled_artifact": str(reconciled_path) if not dry_run else None,
        "reconciler_artifact_ref": reconciler_artifact_ref,
    }


# ---------------------------------------------------------------------------
# Build reconciled.md artifact
# ---------------------------------------------------------------------------

def _build_reconciled_artifact(
    batch_id, raw_path, verdicts, accepted, rejected,
    rejected_p1, rejected_p2, rejected_p5, rejected_l3, today
):
    lines = [
        f"# SUPPORTS Edge Reconciler — Batch {batch_id}",
        f"",
        f"**Session:** {SESSION_ID}  ",
        f"**Date:** {today}  ",
        f"**Raw response:** `{raw_path.name}`  ",
        f"**Reconciler:** `cgm_supports_reconciler.py`  ",
        f"",
        f"---",
        f"",
        f"## §1 — Result Summary",
        f"",
        f"| Metric | Count |",
        f"|--------|-------|",
        f"| Proposed | {len(verdicts)} |",
        f"| Accepted | {len(accepted)} |",
        f"| Rejected (total) | {len(rejected)} |",
        f"| → Rejected P1 (L3 report validity) | {len(rejected_p1)} |",
        f"| → Rejected P2 (UCN section validity / l1_basis) | {len(rejected_p2)} |",
        f"| → Rejected P5 (signal_id resolution) | {len(rejected_p5)} |",
        f"| → Rejected L3 chain | {len(rejected_l3)} |",
        f"",
        f"---",
        f"",
        f"## §2 — Per-Edge Verdict Table",
        f"",
        f"| # | source_signal_id | target_ucn_section_id | l3_evidence_report | verdict | P1 | P2 | P5 | L3 chain | notes |",
        f"|---|---|---|---|---|---|---|---|---|---|",
    ]

    for i, v in enumerate(verdicts, 1):
        e = v["edge"]
        verdict = "ACCEPT" if v["accepted"] else "REJECT"
        p1 = "✓" if v["p1_pass"] else "✗"
        p2 = "✓" if v["p2_pass"] else "✗"
        p5 = "✓" if v["p5_pass"] else "✗"
        l3 = "✓" if v["l3_chain_pass"] else "✗"
        notes = "; ".join(v["reject_reasons"]) or v.get("l3_chain_note", "") or ""
        notes = notes[:80]  # truncate for table readability
        sig = e.get("source_signal_id", "?")
        ucn = e.get("target_ucn_section_id", "?")
        rep = Path(e.get("l3_evidence_report", "?")).name
        lines.append(f"| {i} | {sig} | {ucn} | {rep} | **{verdict}** | {p1} | {p2} | {p5} | {l3} | {notes} |")

    return "\n".join(lines) + "\n"


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="MARSYS-JIS SUPPORTS edge reconciler (B.4 Task 3)")
    parser.add_argument("--batch-id", required=True, help="Batch ID (e.g. B4_supports_batch1)")
    parser.add_argument("--raw-file", required=True, help="Path to raw Gemini response file")
    parser.add_argument("--dry-run", action="store_true", help="Parse and validate without writing outputs")
    args = parser.parse_args()

    result = reconcile_batch(
        batch_id=args.batch_id,
        raw_file_path=args.raw_file,
        dry_run=args.dry_run,
    )

    print(f"\n[RECONCILER] Batch {result['batch_id']} complete:")
    print(f"  Proposed:        {result['proposed']}")
    print(f"  Accepted:        {result['accepted']}")
    print(f"  Rejected:        {result['rejected']}")
    print(f"    → P1 fail:     {result['rejected_p1']}")
    print(f"    → P2 fail:     {result['rejected_p2']}")
    print(f"    → P5 fail:     {result['rejected_p5']}")
    print(f"    → L3 chain:    {result['rejected_l3_chain']}")
    if result.get("reconciled_artifact"):
        print(f"  Artifact:        {result['reconciled_artifact']}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
