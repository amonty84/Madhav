"""
resonance_walk_reconciler.py
MARSYS-JIS RAG Pipeline — Claude Pass-2 reconciler for B.5 Resonance Walk.
Phase B.5 Session 2. Madhav_M2A_Exec_10 (2026-04-27).

Usage (programmatic):
  from rag.reconcilers.resonance_walk_reconciler import reconcile_batch
  result = reconcile_batch(raw_response_path, batch_id)

Or via run_resonance_pipeline.py orchestrator:
  python -m rag.reconcilers.run_resonance_pipeline --batches B5_resonance_walk_batch1
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

import jsonschema
import yaml

_PROJECT_ROOT = Path(__file__).resolve().parents[4]
_REGISTERS_DIR = _PROJECT_ROOT / "035_DISCOVERY_LAYER" / "REGISTERS"
_RESONANCE_REGISTER_JSON = _REGISTERS_DIR / "RESONANCE_REGISTER_v1_0.json"
_RESONANCE_REGISTER_MD = _REGISTERS_DIR / "RESONANCE_REGISTER_v1_0.md"
_SCHEMA_FILE = _PROJECT_ROOT / "06_LEARNING_LAYER" / "SCHEMAS" / "resonance_schema_v0_1.json"

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from rag.validators import p5_signal_id_resolution as p5
from rag.validators.p7_three_interpretation import validate as p7_validate
from rag.validators.p8_confidence import validate as p8_validate
from rag.ledger import append_two_pass_event
from rag.prediction_ledger import append_prediction

SESSION_ID = "Madhav_M2A_Exec_10"
PROMPT_ID = "gemini.resonance_walk"
PROMPT_VERSION = "1.0"

# Canonical CDLM domains (9 specific domains, excluding 'cross_domain' and 'meta' which are
# pattern-register aggregate labels, not actual CDLM row/column domains).
_CDLM_DOMAINS = frozenset({
    "career", "wealth", "relationships", "health", "children",
    "spiritual", "parents", "mind", "travel",
})

# Canonical domain enum (from resonance_schema + pattern_schema — includes cross_domain/meta
# which are valid for domains_bridged but not for CDLM cell naming).
_CANONICAL_DOMAINS = frozenset({
    "career", "wealth", "health", "relationships", "children",
    "spiritual", "parents", "mind", "travel", "meta", "cross_domain",
})

_resonance_schema_cache: dict | None = None
_res_counter: int | None = None


@dataclass
class ReconciliationResult:
    accepted_resonances: list[dict] = field(default_factory=list)
    rejected_proposals: list[dict] = field(default_factory=list)
    batch_acceptance_rate: float = float("nan")
    anomaly_fired: bool = False
    anomaly_message: str = ""


def _load_resonance_schema() -> dict:
    global _resonance_schema_cache
    if _resonance_schema_cache is None:
        with _SCHEMA_FILE.open() as f:
            _resonance_schema_cache = json.load(f)
    return _resonance_schema_cache


def _compute_event_id(seed: str) -> str:
    return hashlib.sha256(seed.encode()).hexdigest()[:12]


def _next_resonance_id() -> str:
    global _res_counter
    if _res_counter is None:
        if _RESONANCE_REGISTER_JSON.exists():
            with _RESONANCE_REGISTER_JSON.open() as f:
                data = json.load(f)
            _res_counter = len(data.get("resonances", []))
        else:
            _res_counter = 0
    _res_counter += 1
    return f"RES.{_res_counter:03d}"


def _res_counter_rollback() -> None:
    global _res_counter
    if _res_counter is not None and _res_counter > 0:
        _res_counter -= 1


def _validate_cdlm_cells(cells: list[str]) -> tuple[bool, list[str]]:
    """
    Validate that each cell ID matches CDLM.<domain1>.<domain2> with both domain names
    drawn from the 9 specific CDLM domains. Returns (all_valid, failure_reasons).
    """
    failures = []
    for cell in cells:
        m = re.match(r"^CDLM\.([a-z_]+)\.([a-z_]+)$", cell)
        if not m:
            failures.append(f"RESONANCE_CDLM_UNRESOLVED: cell '{cell}' does not match CDLM.<d1>.<d2> pattern")
            continue
        d1, d2 = m.group(1), m.group(2)
        if d1 not in _CDLM_DOMAINS:
            failures.append(f"RESONANCE_CDLM_UNRESOLVED: '{d1}' is not a recognized CDLM domain in '{cell}'")
        if d2 not in _CDLM_DOMAINS:
            failures.append(f"RESONANCE_CDLM_UNRESOLVED: '{d2}' is not a recognized CDLM domain in '{cell}'")
    return len(failures) == 0, failures


def _extract_yaml_from_raw(raw_text: str) -> list[dict]:
    """Parse resonance_proposals list from Gemini raw response.

    Strategy:
    1. Strip YAML front-matter (---...---) at start of document.
    2. Look for a fenced block containing 'resonance_proposals:'.
    3. Fall back to finding 'resonance_proposals:' anywhere in text.
    """
    body = re.sub(r"^---\s*\n.*?---\s*\n", "", raw_text, flags=re.DOTALL, count=1)

    fenced_blocks = re.findall(r"```(?:yaml)?\s*\n(.*?)```", body, re.DOTALL)
    yaml_text: str | None = None
    for block in fenced_blocks:
        if "resonance_proposals:" in block:
            yaml_text = block
            break

    if yaml_text is None:
        match = re.search(r"(resonance_proposals\s*:.*)", body, re.DOTALL)
        if match:
            yaml_text = match.group(1)

    if yaml_text is None:
        return []

    yaml_text = re.split(r"\n---\s*\n", yaml_text)[0]

    try:
        parsed = yaml.safe_load(yaml_text)
    except yaml.YAMLError as exc:
        print(f"[RESONANCE_RECONCILER] YAML parse error: {exc}", file=sys.stderr)
        return []

    if isinstance(parsed, dict):
        proposals = parsed.get("resonance_proposals", [])
    elif isinstance(parsed, list):
        proposals = parsed
    else:
        proposals = []

    return proposals if isinstance(proposals, list) else []


def _validate_resonance(proposal: dict) -> tuple[bool, list[str], dict]:
    """
    Run P1/P2/P5/P7/P8 + resonance-specific gates on a resonance proposal.
    Returns (all_pass, rejection_reasons, validator_results_dict).
    """
    failures: list[str] = []
    vr: dict[str, bool] = {}

    # P5: signals_referenced must resolve in MSR registry
    registry = p5.get_signal_registry()
    signals = proposal.get("signals_referenced", [])
    if not signals:
        failures.append("P5: signals_referenced is empty")
        vr["P5"] = False
    else:
        bad_signals = [s for s in signals if s not in registry]
        if bad_signals:
            failures.append(f"P5_SIGNAL_NOT_RESOLVED: unresolved signal IDs: {bad_signals}")
            vr["P5"] = False
        else:
            vr["P5"] = True

    # Resonance-specific: domains_bridged must be exactly 2 elements from canonical domain enum
    domains_bridged = proposal.get("domains_bridged", [])
    if not isinstance(domains_bridged, list) or len(domains_bridged) != 2:
        failures.append(
            f"RESONANCE_DOMAINS_BRIDGED_INVALID: domains_bridged must be exactly 2 elements, got "
            f"{len(domains_bridged) if isinstance(domains_bridged, list) else 'non-list'}"
        )
        vr["P1"] = False
    else:
        bad_domains = [d for d in domains_bridged if d not in _CANONICAL_DOMAINS]
        if bad_domains:
            failures.append(
                f"RESONANCE_DOMAINS_BRIDGED_INVALID: unrecognized domain(s) {bad_domains} "
                f"(must be from canonical domain enum)"
            )
            vr["P1"] = False
        elif len(set(domains_bridged)) < 2:
            failures.append("RESONANCE_DOMAINS_BRIDGED_INVALID: both domains_bridged elements are the same")
            vr["P1"] = False
        else:
            vr["P1"] = True

    # Resonance-specific: cdlm_cells_referenced must resolve
    cdlm_cells = proposal.get("cdlm_cells_referenced", [])
    cdlm_ok, cdlm_failures = _validate_cdlm_cells(cdlm_cells)
    if not cdlm_ok:
        failures.extend(cdlm_failures)
    # cdlm_cells_referenced is optional per schema (no minItems) but if present must be valid

    # P1: claim_text must not be a bare L1 positional fact
    claim = proposal.get("claim_text", "")
    if len(claim) < 30:
        failures.append("P1: claim_text too short — likely a bare L1 fact")
        if "P1" not in vr:
            vr["P1"] = False
    elif re.match(r"^[A-Z]{2,5}\.[A-Z0-9._]+\s*$", claim.strip()):
        failures.append("P1: claim_text appears to be a bare entity ID — not a resonance")
        if "P1" not in vr:
            vr["P1"] = False
    elif "P1" not in vr:
        vr["P1"] = True

    # P2: mechanism must be non-empty
    mechanism = proposal.get("mechanism", "")
    if len(mechanism) < 20:
        failures.append("P2: mechanism too short — derivation not grounded")
        vr["P2"] = False
    else:
        vr["P2"] = True

    # P7: three-interpretation check (reuses pattern validator — proposal shape is compatible)
    p7_result = p7_validate(proposal)
    vr["P7"] = p7_result.passed
    if not p7_result.passed:
        failures.extend(p7_result.findings)

    # P8: falsifier-conditions enforcement
    p8_result = p8_validate(proposal)
    vr["P8"] = p8_result.passed
    if not p8_result.passed:
        failures.extend(p8_result.findings)

    # P9: audit trail — deferred (full impl at Exec_11)
    vr["P9"] = True

    return len(failures) == 0, failures, vr


def _build_accepted_entry(
    proposal: dict,
    resonance_id: str,
    validator_results: dict,
    ledger_event_ids: list[str],
    prediction_ledger_ref: str | None,
) -> dict:
    """Construct the final RESONANCE_REGISTER entry from an accepted proposal."""
    return {
        "resonance_id": resonance_id,
        "claim_text": proposal.get("claim_text", ""),
        "mechanism": proposal.get("mechanism", ""),
        "domains_bridged": proposal.get("domains_bridged", []),
        "signals_referenced": proposal.get("signals_referenced", []),
        "cdlm_cells_referenced": proposal.get("cdlm_cells_referenced", []),
        "counter_cases": proposal.get("counter_cases", []),
        "classical_basis": proposal.get("classical_basis", "derivative — emergent resonance"),
        "alternatives": proposal.get("alternatives", []),
        "validator_results": validator_results,
        "confidence": proposal.get("confidence", "LOW"),
        "significance": proposal.get("significance", 0.0),
        "is_forward_looking": proposal.get("is_forward_looking", False),
        "time_indexed_falsifier": proposal.get("time_indexed_falsifier"),
        "ledger_event_ids": ledger_event_ids,
        "prediction_ledger_ref": prediction_ledger_ref,
        "pass_1_actor": "gemini",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "created_by_session": SESSION_ID,
    }


def _append_to_resonance_register(entry: dict) -> None:
    """Append accepted resonance to RESONANCE_REGISTER_v1_0.json and regenerate .md mirror."""
    _REGISTERS_DIR.mkdir(parents=True, exist_ok=True)

    if _RESONANCE_REGISTER_JSON.exists():
        with _RESONANCE_REGISTER_JSON.open() as f:
            data = json.load(f)
    else:
        data = {
            "schema": "06_LEARNING_LAYER/SCHEMAS/resonance_schema_v0_1.json",
            "version": "1.0",
            "produced_by_session": SESSION_ID,
            "produced_at": datetime.now(timezone.utc).date().isoformat(),
            "resonances": [],
        }

    data["resonances"].append(entry)

    with _RESONANCE_REGISTER_JSON.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    _regenerate_md_mirror(data["resonances"])


def _regenerate_md_mirror(resonances: list[dict]) -> None:
    """Regenerate RESONANCE_REGISTER_v1_0.md from the canonical JSON."""
    lines = [
        "---",
        "artifact: RESONANCE_REGISTER_v1_0.md",
        'version: "1.0"',
        "status: LIVE",
        f"produced_by_session: {SESSION_ID}",
        f"produced_at: {datetime.now(timezone.utc).date().isoformat()}",
        "canonical_source: 035_DISCOVERY_LAYER/REGISTERS/RESONANCE_REGISTER_v1_0.json",
        "schema: 06_LEARNING_LAYER/SCHEMAS/resonance_schema_v0_1.json",
        "changelog:",
        "  - v1.0 (2026-04-27, Madhav_M2A_Exec_10): Initial scaffold.",
        f"  - Regenerated {datetime.now(timezone.utc).isoformat()} with {len(resonances)} resonances.",
        "---",
        "",
        "# RESONANCE REGISTER v1.0 — MARSYS-JIS Discovery Layer",
        "",
        "## §1 — About This Register",
        "",
        "Derived Markdown view of `035_DISCOVERY_LAYER/REGISTERS/RESONANCE_REGISTER_v1_0.json`.",
        "Do not edit directly — regenerated by `resonance_walk_reconciler.py` after each accept.",
        "Each resonance bridges exactly two domains via a shared signal mechanism that operates",
        "simultaneously in both. Resonances extend or complement CDLM explicit cross-links.",
        "",
        "---",
        "",
        "## §2 — Resonance Index",
        "",
    ]

    if not resonances:
        lines.append("*No resonances yet.*")
        lines.append("")
        lines.append("| resonance_id | domains_bridged | pass_1_actor | confidence | significance | is_forward_looking | claim_text |")
        lines.append("|---|---|---|---|---|---|---|")
    else:
        lines.append("| resonance_id | domains_bridged | pass_1_actor | confidence | significance | is_forward_looking | claim_text |")
        lines.append("|---|---|---|---|---|---|---|")
        for r in resonances:
            claim = r.get("claim_text", "")[:80].replace("|", "\\|")
            domains = " + ".join(r.get("domains_bridged", []))
            lines.append(
                f"| {r['resonance_id']} | {domains} | {r.get('pass_1_actor', '?')} "
                f"| {r['confidence']} | {r.get('significance', 0):.2f} "
                f"| {r['is_forward_looking']} | {claim} |"
            )

    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("*End of RESONANCE_REGISTER_v1_0.md. Regenerated by resonance_walk_reconciler.py.*")
    lines.append("")

    _RESONANCE_REGISTER_MD.write_text("\n".join(lines), encoding="utf-8")


def reconcile_batch(raw_response_path: str, batch_id: str) -> ReconciliationResult:
    """
    Pass-2 reconciler for a single Gemini resonance-walk batch.

    For each proposed resonance:
    1. Parse YAML from raw response file.
    2. Run P1/P2/P5/P7/P8 validator stack + resonance-specific gates
       (signals_referenced resolved, cdlm_cells_referenced resolved, domains_bridged exactly 2).
    3. Emit claude_resonance_accept or claude_resonance_reject ledger event.
    4. If accepted: append to RESONANCE_REGISTER; if forward-looking, log prediction.

    Returns ReconciliationResult with accepted resonances, rejections, acceptance rate.
    """
    raw_path = Path(raw_response_path)
    if not raw_path.is_absolute():
        raw_path = _PROJECT_ROOT / raw_response_path
    if not raw_path.exists():
        raise FileNotFoundError(f"Raw response file not found: {raw_path}")

    raw_text = raw_path.read_text(encoding="utf-8")

    # Write resonance_proposal ledger event for the batch
    ts = datetime.now(timezone.utc).isoformat()
    proposal_event_id = _compute_event_id(f"{batch_id}|{ts}|resonance_proposal")
    try:
        append_two_pass_event({
            "event_id": proposal_event_id,
            "event_type": "resonance_proposal",
            "timestamp": ts,
            "batch_id": batch_id,
            "prompt_id": PROMPT_ID,
            "prompt_version": PROMPT_VERSION,
            "gemini_response_ref": str(raw_path.relative_to(_PROJECT_ROOT)),
            "edge_proposal": {
                "source_node_id": "resonance_batch",
                "target_node_id": "RESONANCE_REGISTER_v1_0",
                "edge_type": "SUPPORTS",
                "l1_source": "derivative — resonance proposals reference L1 via signal IDs",
            },
        })
    except Exception as exc:
        print(f"[RESONANCE_RECONCILER] Warning: could not write proposal event: {exc}", file=sys.stderr)

    proposals = _extract_yaml_from_raw(raw_text)
    if not proposals:
        print(
            f"[RESONANCE_RECONCILER] WARNING: No resonance proposals parsed from {raw_path}",
            file=sys.stderr,
        )

    result = ReconciliationResult()
    schema = _load_resonance_schema()
    reconciler_ref = str(raw_path.with_suffix("").name) + "_reconciled.md"

    for idx, proposal in enumerate(proposals):
        ts_now = datetime.now(timezone.utc).isoformat()
        res_hash = _compute_event_id(f"{batch_id}|{idx}|{ts_now}|resonance")

        # Parse failure gate: if proposal is not a dict, treat as parse_failure reject
        if not isinstance(proposal, dict):
            reject_event: dict[str, Any] = {
                "event_id": res_hash,
                "event_type": "claude_resonance_reject",
                "timestamp": ts_now,
                "batch_id": batch_id,
                "prompt_id": PROMPT_ID,
                "prompt_version": PROMPT_VERSION,
                "gemini_response_ref": str(raw_path.relative_to(_PROJECT_ROOT)),
                "edge_proposal": {
                    "source_node_id": "?",
                    "target_node_id": "RESONANCE_REGISTER_v1_0",
                    "edge_type": "SUPPORTS",
                    "l1_source": "derivative — proposal rejected at parse stage",
                },
                "resonance_id": f"RES.{0:03d}",
                "decision_basis": "parse_failure: proposal is not a dict",
                "reconciler_artifact_ref": reconciler_ref,
            }
            try:
                append_two_pass_event(reject_event)
            except Exception as exc:
                print(f"[RESONANCE_RECONCILER] Warning: could not write reject event: {exc}", file=sys.stderr)
            result.rejected_proposals.append({"proposal": proposal, "failures": ["parse_failure"]})
            continue

        passed, failures, validator_results = _validate_resonance(proposal)

        # JSON Schema structural validity
        if passed:
            tentative_id = _next_resonance_id()
            tentative = _build_accepted_entry(
                proposal, tentative_id, validator_results, [proposal_event_id, res_hash], None
            )
            try:
                jsonschema.validate(instance=tentative, schema=schema)
            except jsonschema.ValidationError as exc:
                passed = False
                failures.append(f"schema_error: {exc.message}")
                _res_counter_rollback()

        if passed:
            resonance_id = tentative_id  # type: ignore[possibly-undefined]

            # Emit claude_resonance_accept ledger event
            accept_event: dict[str, Any] = {
                "event_id": res_hash,
                "event_type": "claude_resonance_accept",
                "timestamp": ts_now,
                "batch_id": batch_id,
                "prompt_id": PROMPT_ID,
                "prompt_version": PROMPT_VERSION,
                "gemini_response_ref": str(raw_path.relative_to(_PROJECT_ROOT)),
                "edge_proposal": {
                    "source_node_id": str(
                        proposal.get("signals_referenced", ["?"])[0]
                        if proposal.get("signals_referenced") else "?"
                    ),
                    "target_node_id": "RESONANCE_REGISTER_v1_0",
                    "edge_type": "SUPPORTS",
                    "l1_source": "derivative — resonance accepted via P1/P2/P5/P7/P8 pass",
                },
                "resonance_id": resonance_id,
                "decision_basis": f"P1/P2/P5/P7/P8 pass + resonance gates pass. validators={validator_results}",
                "reconciler_artifact_ref": reconciler_ref,
                "resonance_payload": proposal,
            }
            try:
                append_two_pass_event(accept_event)
            except Exception as exc:
                print(f"[RESONANCE_RECONCILER] Warning: could not write accept event: {exc}", file=sys.stderr)

            # Handle prediction ledger for forward-looking resonances
            prediction_ref: str | None = None
            if proposal.get("is_forward_looking"):
                tif = proposal.get("time_indexed_falsifier") or {}
                pred_entry = {
                    "artifact_id": resonance_id,
                    "artifact_type": "resonance",
                    "claim_text": proposal.get("claim_text", ""),
                    "domain": "_".join(proposal.get("domains_bridged", ["cross_domain"])),
                    "verification_window_start": tif.get("verification_window_start", "2026-01-01"),
                    "verification_window_end": tif.get("verification_window_end", "2030-01-01"),
                    "falsifier_conditions": tif.get("falsifier_conditions", ["No explicit falsifier provided"]),
                    "confirmation_conditions": ["Resonance is observationally confirmed within window"],
                    "outcome": None,
                    "outcome_source": None,
                    "outcome_recorded_at": None,
                    "created_by_event_id": res_hash,
                    "ledger_ref": "06_LEARNING_LAYER/LEDGER/two_pass_events.jsonl",
                    "classical_basis": proposal.get("classical_basis"),
                    "confidence_at_creation": proposal.get("confidence", "LOW"),
                    "dependencies": [],
                }
                try:
                    prediction_ref = append_prediction(pred_entry)
                except Exception as exc:
                    print(f"[RESONANCE_RECONCILER] Warning: prediction ledger write failed: {exc}", file=sys.stderr)

            final_entry = _build_accepted_entry(
                proposal,
                resonance_id,
                validator_results,
                [proposal_event_id, res_hash],
                prediction_ref,
            )
            _append_to_resonance_register(final_entry)
            result.accepted_resonances.append(final_entry)

        else:
            # Emit claude_resonance_reject ledger event
            reject_event = {
                "event_id": res_hash,
                "event_type": "claude_resonance_reject",
                "timestamp": ts_now,
                "batch_id": batch_id,
                "prompt_id": PROMPT_ID,
                "prompt_version": PROMPT_VERSION,
                "gemini_response_ref": str(raw_path.relative_to(_PROJECT_ROOT)),
                "edge_proposal": {
                    "source_node_id": str(
                        proposal.get("signals_referenced", ["?"])[0]
                        if proposal.get("signals_referenced") else "?"
                    ),
                    "target_node_id": "RESONANCE_REGISTER_v1_0",
                    "edge_type": "SUPPORTS",
                    "l1_source": "derivative — proposal rejected by validator stack",
                },
                "resonance_id": f"RES.{0:03d}",
                "decision_basis": f"Validation failed: {'; '.join(failures)}",
                "reconciler_artifact_ref": reconciler_ref,
            }
            try:
                append_two_pass_event(reject_event)
            except Exception as exc:
                print(f"[RESONANCE_RECONCILER] Warning: could not write reject event: {exc}", file=sys.stderr)

            result.rejected_proposals.append({
                "proposal": proposal,
                "failures": failures,
                "validator_results": validator_results,
            })

    # Compute acceptance rate
    total = len(result.accepted_resonances) + len(result.rejected_proposals)
    if total > 0:
        result.batch_acceptance_rate = len(result.accepted_resonances) / total
        if result.batch_acceptance_rate < 0.15 or result.batch_acceptance_rate > 0.80:
            result.anomaly_fired = True
            result.anomaly_message = (
                f"[ACCEPTANCE_RATE_ANOMALY] batch={batch_id} "
                f"rate={result.batch_acceptance_rate:.2%} band=[0.15, 0.80] "
                f"(accepted={len(result.accepted_resonances)}, rejected={len(result.rejected_proposals)})"
            )

    return result
