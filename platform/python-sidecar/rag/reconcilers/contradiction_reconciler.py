"""
contradiction_reconciler.py
MARSYS-JIS RAG Pipeline — Claude Pass-2 reconciler for B.5 Contradiction Scan.
Phase B.5 Session 3. Madhav_M2A_Exec_11 (2026-04-27).

CONTRADICTS flow (inverted two-pass):
  Claude Pass-1: hypothesizes contradictions → claude_contradiction_scan_batch<N>_raw.md
  Gemini Pass-2: adjudicates each hypothesis → gemini_contradiction_pass2_batch<N>_raw.md

Usage (programmatic):
  from rag.reconcilers.contradiction_reconciler import reconcile_batch
  result = reconcile_batch(
      claude_raw_path,  # Claude Pass-1 hypothesis file
      gemini_raw_path,  # Gemini Pass-2 adjudication file
      batch_id
  )

Or via run_contradiction_pipeline.py orchestrator.
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import yaml

_PROJECT_ROOT = Path(__file__).resolve().parents[4]
_REGISTERS_DIR = _PROJECT_ROOT / "035_DISCOVERY_LAYER" / "REGISTERS"
_CONTRADICTION_REGISTER_JSON = _REGISTERS_DIR / "CONTRADICTION_REGISTER_v1_0.json"
_CONTRADICTION_REGISTER_MD = _REGISTERS_DIR / "CONTRADICTION_REGISTER_v1_0.md"

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from rag.validators import p5_signal_id_resolution as p5
from rag.ledger import append_two_pass_event

SESSION_ID = "Madhav_M2A_Exec_11"
CLAUDE_PROMPT_ID = "claude.contradiction_scan"
CLAUDE_PROMPT_VERSION = "1.0"
GEMINI_PROMPT_ID = "gemini.contradiction_adjudication"
GEMINI_PROMPT_VERSION = "1.0"

_CANONICAL_DOMAINS = frozenset({
    "career", "wealth", "health", "relationships", "children",
    "spiritual", "parents", "mind", "travel", "meta", "cross_domain"
})

_CANONICAL_CLASSES = frozenset({
    "p1_layer_bleed", "p6_uvc_conflict", "karaka_ambiguity",
    "domain_cross_claim", "timing_conflict", "classical_basis_conflict",
    "signal_polarity_conflict"
})

_contradiction_counter: int | None = None


@dataclass
class ContradictionReconciliationResult:
    confirmed_contradictions: list[dict] = field(default_factory=list)
    rejected_hypotheses: list[dict] = field(default_factory=list)
    batch_confirmation_rate: float = float("nan")
    anomaly_fired: bool = False
    anomaly_message: str = ""


def _compute_event_id(seed: str) -> str:
    return hashlib.sha256(seed.encode()).hexdigest()[:12]


def _next_contradiction_id() -> str:
    global _contradiction_counter
    if _contradiction_counter is None:
        if _CONTRADICTION_REGISTER_JSON.exists():
            with _CONTRADICTION_REGISTER_JSON.open() as f:
                data = json.load(f)
            _contradiction_counter = len(data.get("contradictions", []))
        else:
            _contradiction_counter = 0
    _contradiction_counter += 1
    return f"CON.{_contradiction_counter:03d}"


def _extract_yaml_block(raw_text: str, root_key: str) -> list[dict]:
    """Parse a YAML list from a raw response file under root_key."""
    body = re.sub(r"^---\s*\n.*?---\s*\n", "", raw_text, flags=re.DOTALL, count=1)

    fenced_blocks = re.findall(r"```(?:yaml)?\s*\n(.*?)```", body, re.DOTALL)
    yaml_text: str | None = None
    for block in fenced_blocks:
        if f"{root_key}:" in block:
            yaml_text = block
            break

    if yaml_text is None:
        match = re.search(rf"({root_key}\s*:.*)", body, re.DOTALL)
        if match:
            yaml_text = match.group(1)

    if yaml_text is None:
        return []

    yaml_text = re.split(r"\n---\s*\n", yaml_text)[0]

    try:
        parsed = yaml.safe_load(yaml_text)
    except yaml.YAMLError as exc:
        print(f"[CONTRADICTION_RECONCILER] YAML parse error: {exc}", file=sys.stderr)
        return []

    if isinstance(parsed, dict):
        items = parsed.get(root_key, [])
    elif isinstance(parsed, list):
        items = parsed
    else:
        items = []

    return items if isinstance(items, list) else []


def _validate_hypothesis(hypothesis: dict) -> tuple[bool, list[str]]:
    """Validate a Claude Pass-1 contradiction hypothesis."""
    failures: list[str] = []

    if not hypothesis.get("hypothesis_text", ""):
        failures.append("MISSING_HYPOTHESIS_TEXT")

    cls = hypothesis.get("contradiction_class", "")
    if cls not in _CANONICAL_CLASSES:
        failures.append(f"INVALID_CLASS: '{cls}' not in canonical enum")

    signals = hypothesis.get("signals_in_conflict", [])
    if len(signals) < 2:
        failures.append(f"INSUFFICIENT_SIGNALS: need ≥2 signals_in_conflict, got {len(signals)}")
    else:
        registry = p5.get_signal_registry()
        bad = [s for s in signals if s not in registry]
        if bad:
            failures.append(f"P5_UNRESOLVED: {bad}")

    domains = hypothesis.get("domains_implicated", [])
    bad_domains = [d for d in domains if d not in _CANONICAL_DOMAINS]
    if bad_domains:
        failures.append(f"INVALID_DOMAINS: {bad_domains}")

    if not hypothesis.get("l1_references"):
        failures.append("MISSING_L1_REFERENCES")

    if hypothesis.get("claude_severity_prior", "") not in {"LOW", "MED", "HIGH"}:
        failures.append("INVALID_SEVERITY_PRIOR")

    return len(failures) == 0, failures


def _build_accepted_entry(
    hypothesis: dict,
    gemini_verdict: dict,
    contradiction_id: str,
    ledger_event_ids: list[str],
) -> dict:
    return {
        "contradiction_id": contradiction_id,
        "contradiction_class": hypothesis.get("contradiction_class", ""),
        "hypothesis_text": hypothesis.get("hypothesis_text", ""),
        "mechanism": hypothesis.get("mechanism", ""),
        "domains_implicated": hypothesis.get("domains_implicated", []),
        "signals_in_conflict": hypothesis.get("signals_in_conflict", []),
        "l1_references": hypothesis.get("l1_references", []),
        "claude_severity_prior": hypothesis.get("claude_severity_prior", "LOW"),
        "resolution_options": hypothesis.get("resolution_options", []),
        "gemini_verdict": gemini_verdict.get("verdict", "CONFIRMED"),
        "gemini_rationale": gemini_verdict.get("rationale", ""),
        "dr_entry_id": gemini_verdict.get("dr_entry_id", None),
        "ledger_event_ids": ledger_event_ids,
        "pass_1_actor": "claude_self",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "created_by_session": SESSION_ID,
    }


def _append_to_register(entry: dict) -> None:
    _REGISTERS_DIR.mkdir(parents=True, exist_ok=True)

    if _CONTRADICTION_REGISTER_JSON.exists():
        with _CONTRADICTION_REGISTER_JSON.open() as f:
            data = json.load(f)
    else:
        data = {
            "schema": "06_LEARNING_LAYER/SCHEMAS/contradiction_schema_v0_1.json",
            "version": "1.0",
            "produced_by_session": SESSION_ID,
            "produced_at": datetime.now(timezone.utc).date().isoformat(),
            "contradictions": [],
        }

    data["contradictions"].append(entry)

    with _CONTRADICTION_REGISTER_JSON.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    _regenerate_md_mirror(data["contradictions"])


def _regenerate_md_mirror(contradictions: list[dict]) -> None:
    lines = [
        "---",
        "artifact: CONTRADICTION_REGISTER_v1_0.md",
        'version: "1.0"',
        "status: LIVE",
        f"produced_by_session: {SESSION_ID}",
        f"produced_at: {datetime.now(timezone.utc).date().isoformat()}",
        "canonical_source: 035_DISCOVERY_LAYER/REGISTERS/CONTRADICTION_REGISTER_v1_0.json",
        "schema: 06_LEARNING_LAYER/SCHEMAS/contradiction_schema_v0_1.json",
        "changelog:",
        "  - v1.0 (2026-04-27, Madhav_M2A_Exec_11): Initial scaffold.",
        f"  - Regenerated {datetime.now(timezone.utc).isoformat()} with {len(contradictions)} confirmed contradictions.",
        "---",
        "",
        "# CONTRADICTION REGISTER v1.0 — MARSYS-JIS Discovery Layer",
        "",
        "## §1 — About This Register",
        "",
        "Confirmed internal corpus contradictions discovered via B.5 Claude Pass-1 scan",
        "and adjudicated by Gemini Pass-2. Each entry represents a genuine conflict between",
        "two or more MSR signals or registered entries in the native's chart corpus.",
        "Do not edit directly — regenerated by `contradiction_reconciler.py` after each accept.",
        "",
        "---",
        "",
        "## §2 — Contradiction Index",
        "",
    ]

    if not contradictions:
        lines.append("*No confirmed contradictions yet.*")
        lines.append("")
    else:
        lines.append("| contradiction_id | contradiction_class | domains_implicated | severity | gemini_verdict |")
        lines.append("|---|---|---|---|---|")
        for c in contradictions:
            lines.append(
                f"| {c['contradiction_id']} | {c['contradiction_class']} "
                f"| {', '.join(c.get('domains_implicated', []))} "
                f"| {c.get('claude_severity_prior','?')} | {c.get('gemini_verdict','?')} |"
            )

    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## §3 — Contradiction Detail")
    lines.append("")
    for c in contradictions:
        lines.append(f"### {c['contradiction_id']} — {c['contradiction_class']}")
        lines.append(f"- **hypothesis_text:** {c['hypothesis_text']}")
        lines.append(f"- **domains_implicated:** {', '.join(c.get('domains_implicated', []))}")
        lines.append(f"- **signals_in_conflict:** {', '.join(c.get('signals_in_conflict', []))}")
        lines.append(f"- **claude_severity_prior:** {c.get('claude_severity_prior','?')}")
        lines.append(f"- **gemini_verdict:** {c.get('gemini_verdict','?')}")
        lines.append(f"- **mechanism:** {c.get('mechanism','')}")
        lines.append(f"- **gemini_rationale:** {c.get('gemini_rationale','')}")
        lines.append(f"- **resolution_options:** {'; '.join(c.get('resolution_options', []))}")
        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("*End of CONTRADICTION_REGISTER_v1_0.md. Regenerated by contradiction_reconciler.py.*")
    lines.append("")

    _CONTRADICTION_REGISTER_MD.write_text("\n".join(lines), encoding="utf-8")


def reconcile_batch(
    claude_raw_path: str,
    gemini_raw_path: str,
    batch_id: str,
) -> ContradictionReconciliationResult:
    """
    Reconcile a contradiction scan batch.

    claude_raw_path: Claude Pass-1 hypothesis file (contradiction_hypotheses: list)
    gemini_raw_path: Gemini Pass-2 adjudication file (contradiction_adjudications: list)
    batch_id: batch identifier

    For each hypothesis:
    1. Validate Claude hypothesis (class, signals, domains, l1_refs, severity).
    2. Look up Gemini Pass-2 verdict by hypothesis_id.
    3. If CONFIRMED by Gemini: accept → append to CONTRADICTION_REGISTER.
    4. If REJECTED by Gemini: record as rejected_hypothesis.
    5. Emit ledger events for full two-pass audit trail.
    """
    claude_path = Path(claude_raw_path)
    if not claude_path.is_absolute():
        claude_path = _PROJECT_ROOT / claude_raw_path
    if not claude_path.exists():
        raise FileNotFoundError(f"Claude raw file not found: {claude_path}")

    gemini_path = Path(gemini_raw_path)
    if not gemini_path.is_absolute():
        gemini_path = _PROJECT_ROOT / gemini_raw_path
    if not gemini_path.exists():
        raise FileNotFoundError(f"Gemini raw file not found: {gemini_path}")

    claude_text = claude_path.read_text(encoding="utf-8")
    gemini_text = gemini_path.read_text(encoding="utf-8")

    hypotheses = _extract_yaml_block(claude_text, "contradiction_hypotheses")
    adjudications = _extract_yaml_block(gemini_text, "contradiction_adjudications")

    # Build lookup: hypothesis_id → gemini adjudication
    gemini_lookup: dict[str, dict] = {
        a.get("hypothesis_id", ""): a for a in adjudications if isinstance(a, dict)
    }

    ts = datetime.now(timezone.utc).isoformat()
    proposal_event_id = _compute_event_id(f"{batch_id}|{ts}|contradiction_claude_proposal")

    try:
        append_two_pass_event({
            "event_id": proposal_event_id,
            "event_type": "claude_proposal",
            "timestamp": ts,
            "batch_id": batch_id,
            "prompt_id": CLAUDE_PROMPT_ID,
            "prompt_version": CLAUDE_PROMPT_VERSION,
            "gemini_response_ref": None,
            "edge_proposal": {
                "source_node_id": "contradiction_scan_batch",
                "target_node_id": "CONTRADICTION_REGISTER_v1_0",
                "edge_type": "CONTRADICTS",
                "l1_source": "derivative — contradiction hypotheses reference L1 via signal IDs",
            },
        })
    except Exception as exc:
        print(f"[CONTRADICTION_RECONCILER] Warning: could not write proposal event: {exc}", file=sys.stderr)

    result = ContradictionReconciliationResult()
    reconciler_ref = "contradiction_scan_batch1_reconciled.md"

    for idx, hypothesis in enumerate(hypotheses):
        if not isinstance(hypothesis, dict):
            result.rejected_hypotheses.append({"hypothesis": hypothesis, "failures": ["parse_failure"]})
            continue

        ts_now = datetime.now(timezone.utc).isoformat()
        h_id = hypothesis.get("hypothesis_id", f"CH.{idx+1:03d}")

        passed, failures = _validate_hypothesis(hypothesis)

        if not passed:
            result.rejected_hypotheses.append({"hypothesis": hypothesis, "failures": failures})
            continue

        # Look up Gemini Pass-2 verdict
        gemini_adj = gemini_lookup.get(h_id, {})
        gemini_verdict_str = gemini_adj.get("verdict", "PENDING")

        event_id = _compute_event_id(f"{batch_id}|{h_id}|{ts_now}|{gemini_verdict_str}")

        if gemini_verdict_str == "CONFIRMED":
            contradiction_id = _next_contradiction_id()
            accept_event: dict[str, Any] = {
                "event_id": event_id,
                "event_type": "gemini_challenge_accept",
                "timestamp": ts_now,
                "batch_id": batch_id,
                "prompt_id": GEMINI_PROMPT_ID,
                "prompt_version": GEMINI_PROMPT_VERSION,
                "gemini_response_ref": str(gemini_path.relative_to(_PROJECT_ROOT)),
                "hypothesis_id": proposal_event_id,
                "edge_proposal": {
                    "source_node_id": h_id,
                    "target_node_id": "CONTRADICTION_REGISTER_v1_0",
                    "edge_type": "CONTRADICTS",
                    "l1_source": "derivative — Gemini confirmed contradiction via Pass-2",
                },
                "decision_basis": f"Gemini CONFIRMED: {gemini_adj.get('rationale', '')[:100]}",
                "reconciler_artifact_ref": reconciler_ref,
            }
            try:
                append_two_pass_event(accept_event)
            except Exception as exc:
                print(f"[CONTRADICTION_RECONCILER] Warning: could not write accept event: {exc}", file=sys.stderr)

            final_entry = _build_accepted_entry(
                hypothesis, gemini_adj, contradiction_id, [proposal_event_id, event_id]
            )
            _append_to_register(final_entry)
            result.confirmed_contradictions.append(final_entry)

        else:
            reject_event: dict[str, Any] = {
                "event_id": event_id,
                "event_type": "gemini_challenge_reject",
                "timestamp": ts_now,
                "batch_id": batch_id,
                "prompt_id": GEMINI_PROMPT_ID,
                "prompt_version": GEMINI_PROMPT_VERSION,
                "gemini_response_ref": str(gemini_path.relative_to(_PROJECT_ROOT)),
                "hypothesis_id": proposal_event_id,
                "edge_proposal": {
                    "source_node_id": h_id,
                    "target_node_id": "CONTRADICTION_REGISTER_v1_0",
                    "edge_type": "CONTRADICTS",
                    "l1_source": "derivative — Gemini rejected contradiction hypothesis via Pass-2",
                },
                "decision_basis": f"Gemini REJECTED: {gemini_adj.get('rationale', '')}",
                "reconciler_artifact_ref": reconciler_ref,
            }
            try:
                append_two_pass_event(reject_event)
            except Exception as exc:
                print(f"[CONTRADICTION_RECONCILER] Warning: could not write reject event: {exc}", file=sys.stderr)

            result.rejected_hypotheses.append({
                "hypothesis": hypothesis,
                "failures": [f"gemini_rejected: {gemini_adj.get('rationale', 'no rationale')}"],
            })

    total = len(result.confirmed_contradictions) + len(result.rejected_hypotheses)
    if total > 0:
        result.batch_confirmation_rate = len(result.confirmed_contradictions) / total
        if result.batch_confirmation_rate < 0.10 or result.batch_confirmation_rate > 0.95:
            result.anomaly_fired = True
            result.anomaly_message = (
                f"[CONFIRMATION_RATE_ANOMALY] batch={batch_id} "
                f"rate={result.batch_confirmation_rate:.2%} band=[0.10, 0.95] "
                f"(confirmed={len(result.confirmed_contradictions)}, rejected={len(result.rejected_hypotheses)})"
            )

    return result
