"""
persist_from_reconciled.py
MARSYS-JIS RAG Pipeline — recovery: read existing reconciled.md + raw YAML
and persist accepted SUPPORTS edges to DB + manifest + verification artifacts.

Used when reconciler has already run (ledger populated, reconciled.md written)
but DB persistence step did not complete. Avoids re-running reconciler (which
would duplicate ledger events).

Usage: python -m rag.reconcilers.persist_from_reconciled
"""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import yaml

_PROJECT_ROOT = Path(__file__).resolve().parents[4]
_RESPONSES_DIR = _PROJECT_ROOT / "035_DISCOVERY_LAYER" / "PROMPTS" / "gemini" / "responses"
_DISCOVERY_LAYER = _PROJECT_ROOT / "035_DISCOVERY_LAYER"
_VERIFICATION_DIR = _PROJECT_ROOT / "verification_artifacts" / "RAG"

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from rag.graph import persist_supports_edges

SESSION_ID = "Madhav_M2A_Exec_7"
RESPONSE_DATE = "2026-04-26"

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


def _parse_reconciled_verdicts(reconciled_path: Path) -> dict[tuple[str, str], str]:
    """
    Parse the per-edge verdict table in a reconciled.md.
    Returns dict {(source_signal_id, target_ucn_section_id): "ACCEPT" or "REJECT"}.
    """
    verdicts: dict[tuple[str, str], str] = {}
    text = reconciled_path.read_text(encoding="utf-8")
    # Table rows: | # | source | target | report | **VERDICT** | ... |
    pattern = re.compile(
        r"^\|\s*\d+\s*\|\s*(SIG\.MSR\.[\w]+)\s*\|\s*(UCN\.SEC\.[\w.]+)\s*\|.*?\|\s*\*\*(ACCEPT|REJECT)\*\*",
        re.MULTILINE,
    )
    for m in pattern.finditer(text):
        verdicts[(m.group(1), m.group(2))] = m.group(3)
    return verdicts


def _parse_raw_yaml(raw_path: Path) -> list[dict]:
    """Extract proposed_supports_edges YAML from raw response file."""
    text = raw_path.read_text(encoding="utf-8")
    fenced = re.search(r"```(?:yaml)?\s*\n(.*?)```", text, re.DOTALL)
    yaml_text = fenced.group(1) if fenced else text
    parsed = yaml.safe_load(yaml_text)
    if isinstance(parsed, dict):
        return parsed.get("proposed_supports_edges", []) or []
    return parsed or []


def main():
    all_accepted: list[dict] = []
    per_report_counts: dict[str, int] = {}
    per_report_proposed: dict[str, int] = {}
    aggregate_counts = {
        "total_proposed": 0,
        "total_accepted": 0,
        "total_rejected": 0,
        "rejected_l3_chain": 0,
        "rejected_p1": 0,
        "rejected_p2": 0,
        "rejected_p5": 0,
    }

    for batch_num in sorted(BATCH_MAP.keys()):
        report_name = BATCH_MAP[batch_num]
        batch_id = f"B4_supports_batch{batch_num}"
        raw_path = _RESPONSES_DIR / f"{RESPONSE_DATE}_B4_supports_batch{batch_num}_raw.md"
        rec_path = _RESPONSES_DIR / f"{RESPONSE_DATE}_B4_supports_batch{batch_num}_reconciled.md"

        if not raw_path.exists() or not rec_path.exists():
            print(f"[PERSIST] batch{batch_num}: MISSING files, skipping")
            continue

        verdicts = _parse_reconciled_verdicts(rec_path)
        proposed_edges = _parse_raw_yaml(raw_path)

        per_report_proposed[report_name] = len(proposed_edges)
        accepted_n = sum(1 for v in verdicts.values() if v == "ACCEPT")
        rejected_n = sum(1 for v in verdicts.values() if v == "REJECT")
        per_report_counts[report_name] = accepted_n

        aggregate_counts["total_proposed"] += len(proposed_edges)
        aggregate_counts["total_accepted"] += accepted_n
        aggregate_counts["total_rejected"] += rejected_n

        # All rejections in this session were L3-chain (verified earlier)
        aggregate_counts["rejected_l3_chain"] += rejected_n

        accept_at = datetime.now(timezone.utc).isoformat()
        recon_ref = str(rec_path.relative_to(_PROJECT_ROOT))

        for edge in proposed_edges:
            sig = edge.get("source_signal_id", "")
            ucn = edge.get("target_ucn_section_id", "")
            if verdicts.get((sig, ucn)) != "ACCEPT":
                continue
            all_accepted.append({
                "source_signal_id": sig,
                "target_ucn_section_id": ucn,
                "target_ucn_heading": edge.get("target_ucn_heading", ""),
                "l3_evidence_report": Path(edge.get("l3_evidence_report", "")).name,
                "l3_evidence_section": edge.get("l3_evidence_section", ""),
                "l1_source": edge.get("l1_basis", ""),
                "confidence_prior": edge.get("confidence_prior", "LOW"),
                "source_batch": batch_id,
                "source_reconciled_artifact": recon_ref,
                "accepted_at": accept_at,
                "accepted_by_session": SESSION_ID,
                # graph.persist_supports_edges expects these field names:
                "source_node_id": sig,
                "target_node_id": ucn,
            })

        print(f"[PERSIST] batch{batch_num} ({report_name}): {len(proposed_edges)} proposed, {accepted_n} accepted")

    print(f"\n[PERSIST] Total accepted: {len(all_accepted)} edges")

    # Persist to DB
    if all_accepted:
        try:
            import dotenv
            dotenv.load_dotenv(_PROJECT_ROOT / ".env.rag", override=False)
            written = persist_supports_edges(all_accepted, repo_root=str(_PROJECT_ROOT))
            print(f"[PERSIST] DB: {written} edges upserted to rag_graph_edges")
        except Exception as exc:
            print(f"[PERSIST] STOP: DB error: {exc}", file=sys.stderr)
            raise

    # UCN section node map
    ucn_node_map: dict[str, str] = {}
    for edge in all_accepted:
        ucn_id = edge["target_ucn_section_id"]
        if ucn_id not in ucn_node_map:
            ucn_node_map[ucn_id] = ucn_id  # node_id == stable_id
    ucn_map_path = _VERIFICATION_DIR / "ucn_section_node_map.json"
    ucn_map_path.parent.mkdir(parents=True, exist_ok=True)
    ucn_map_path.write_text(
        json.dumps({
            "produced_by_session": SESSION_ID,
            "produced_at": datetime.now(timezone.utc).isoformat(),
            "description": "Maps UCN stable section IDs to rag_graph_nodes node_id. node_id == stable_id; chunk_id NULL.",
            "mappings": ucn_node_map,
            "unique_ucn_targets": len(ucn_node_map),
        }, indent=2),
        encoding="utf-8",
    )
    print(f"[PERSIST] Wrote: {ucn_map_path}")

    # Manifest
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
        "task": "Task 3 SUPPORTS sub-task",
        "l1_authority": "FORENSIC_ASTROLOGICAL_DATA_v8_0.md §2.1",
        "protocol": "Gemini Pass-1 (promiscuous connector) + Claude Pass-2 (P1/P2/P5 + L3 chain)",
        "total_edges": len(manifest_entries),
        "edges": manifest_entries,
        "l3_gate_pass": all(c >= 1 for c in per_report_counts.values()),
        "l3_gate_failures_at_close": [r for r, c in per_report_counts.items() if c == 0],
        "l3_gate_disposition": (
            "DIS.class.l3_zero_supports — accepted-as-data per native decision 2026-04-26. "
            "HEALTH_LONGEVITY and RELATIONSHIPS L3 reports do not formally cite UCN sections "
            "via §X.Y format; gap surfaced as M2B prediction-ledger input."
        ),
    }
    manifest_path = _DISCOVERY_LAYER / "cgm_supports_edges_manifest_v1_0.json"
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[PERSIST] Wrote: {manifest_path}")

    # b4_supports_count.json
    supports_count = {
        "produced_by_session": SESSION_ID,
        "produced_at": datetime.now(timezone.utc).isoformat(),
        "per_l3_report": [
            {
                "report_id": rname,
                "supports_proposed": per_report_proposed.get(rname, 0),
                "supports_accepted": per_report_counts.get(rname, 0),
            }
            for rname in sorted(BATCH_MAP.values())
        ],
        "aggregate": aggregate_counts,
        "l3_gate_pass": all(c >= 1 for c in per_report_counts.values()),
        "l3_gate_failures": [r for r, c in per_report_counts.items() if c == 0],
        "l3_gate_disposition": "DIS.class.l3_zero_supports — accepted-as-data 2026-04-26",
    }
    count_path = _VERIFICATION_DIR / "b4_supports_count.json"
    count_path.write_text(json.dumps(supports_count, indent=2), encoding="utf-8")
    print(f"[PERSIST] Wrote: {count_path}")

    # Update b4_edge_count.json
    edge_count_path = _VERIFICATION_DIR / "b4_edge_count.json"
    if edge_count_path.exists():
        with edge_count_path.open() as f:
            edge_count = json.load(f)
        edge_count["supports_edges"] = len(all_accepted)
        edge_count["supports_deferred_to"] = None
        edge_count.setdefault("edges_by_type", {})["SUPPORTS"] = len(all_accepted)
        edge_count.setdefault("db_edges_by_type", {})["SUPPORTS"] = len(all_accepted)
        edge_count["total_edges"] = edge_count.get("total_edges", 3814) + len(all_accepted)
        edge_count["db_edge_count"] = edge_count.get("db_edge_count", 3814) + len(all_accepted)
        edge_count["b4_supports_complete"] = True
        edge_count["b4_full_close_pending"] = (
            "Madhav_M2A_Exec_8 (Task 3 — Claude CONTRADICTS→Gemini two-pass + B.4 phase final close)"
        )
        edge_count["contradicts_deferred_to"] = "Madhav_M2A_Exec_8"
        edge_count_path.write_text(json.dumps(edge_count, indent=2), encoding="utf-8")
        print(f"[PERSIST] Updated: {edge_count_path}")

    print("\n[PERSIST] DONE")


if __name__ == "__main__":
    main()
