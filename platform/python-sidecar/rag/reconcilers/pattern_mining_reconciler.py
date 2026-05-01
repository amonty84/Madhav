"""
pattern_mining_reconciler.py
MARSYS-JIS RAG Pipeline — Claude Pass-2 reconciler for B.5 pattern mining.
Phase B.5 Session 1. Madhav_M2A_Exec_9 (2026-04-27).

Usage (programmatic):
  from rag.reconcilers.pattern_mining_reconciler import reconcile_batch
  result = reconcile_batch(raw_response_path, batch_id)

Or via run_pattern_pipeline.py orchestrator:
  python -m rag.reconcilers.run_pattern_pipeline --batches B5_pattern_mining_batch1
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
_PATTERN_REGISTER_JSON = _REGISTERS_DIR / "PATTERN_REGISTER_v1_0.json"
_PATTERN_REGISTER_MD = _REGISTERS_DIR / "PATTERN_REGISTER_v1_0.md"
_SCHEMA_FILE = _PROJECT_ROOT / "06_LEARNING_LAYER" / "SCHEMAS" / "pattern_schema_v0_1.json"
_PREDICTION_LEDGER_DIR = _PROJECT_ROOT / "06_LEARNING_LAYER" / "PREDICTION_LEDGER"

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from rag.validators import p5_signal_id_resolution as p5
from rag.validators.p7_three_interpretation import validate as p7_validate
from rag.validators.p8_confidence import validate as p8_validate
from rag.ledger import append_two_pass_event
from rag.prediction_ledger import append_prediction

SESSION_ID = "Madhav_M2A_Exec_9"
PROMPT_ID = "gemini.pattern_mining"
PROMPT_VERSION = "1.0"

_pattern_schema_cache: dict | None = None
_pat_counter: int | None = None


@dataclass
class ReconciliationResult:
    accepted_patterns: list[dict] = field(default_factory=list)
    rejected_proposals: list[dict] = field(default_factory=list)
    batch_acceptance_rate: float = float("nan")
    anomaly_fired: bool = False
    anomaly_message: str = ""


def _load_pattern_schema() -> dict:
    global _pattern_schema_cache
    if _pattern_schema_cache is None:
        with _SCHEMA_FILE.open() as f:
            _pattern_schema_cache = json.load(f)
    return _pattern_schema_cache


def _compute_event_id(seed: str) -> str:
    return hashlib.sha256(seed.encode()).hexdigest()[:12]


def _next_pattern_id() -> str:
    global _pat_counter
    if _pat_counter is None:
        if _PATTERN_REGISTER_JSON.exists():
            with _PATTERN_REGISTER_JSON.open() as f:
                data = json.load(f)
            _pat_counter = len(data.get("patterns", []))
        else:
            _pat_counter = 0
    _pat_counter += 1
    return f"PAT.{_pat_counter:03d}"


def _extract_yaml_from_raw(raw_text: str) -> list[dict]:
    """Parse pattern_proposals list from Gemini raw response.

    Strategy:
    1. Look for a fenced block that contains 'pattern_proposals:'.
    2. Fall back to finding 'pattern_proposals:' anywhere in the text.
    3. Strip the YAML front-matter block (---...---) if present before parsing.
    """
    # Strip YAML front-matter block (---...---) at start of document first
    body = re.sub(r"^---\s*\n.*?---\s*\n", "", raw_text, flags=re.DOTALL, count=1)

    # Try fenced blocks in the body; pick the one containing pattern_proposals
    fenced_blocks = re.findall(r"```(?:yaml)?\s*\n(.*?)```", body, re.DOTALL)
    yaml_text: str | None = None
    for block in fenced_blocks:
        if "pattern_proposals:" in block:
            yaml_text = block
            break

    # Fall back: extract from 'pattern_proposals:' occurrence to end of body
    if yaml_text is None:
        match = re.search(r"(pattern_proposals\s*:.*)", body, re.DOTALL)
        if match:
            yaml_text = match.group(1)

    if yaml_text is None:
        return []

    # Truncate at the first bare '---' document separator (not inside a value)
    yaml_text = re.split(r"\n---\s*\n", yaml_text)[0]

    try:
        parsed = yaml.safe_load(yaml_text)
    except yaml.YAMLError as exc:
        print(f"[RECONCILER] YAML parse error: {exc}", file=sys.stderr)
        return []

    if isinstance(parsed, dict):
        proposals = parsed.get("pattern_proposals", [])
    elif isinstance(parsed, list):
        proposals = parsed
    else:
        proposals = []

    return proposals if isinstance(proposals, list) else []


def _validate_pattern(proposal: dict) -> tuple[bool, list[str], dict]:
    """
    Run P1/P2/P5/P7/P8 validator stack on a pattern proposal.
    Returns (all_pass, rejection_reasons, validator_results_dict).
    """
    failures = []
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
            failures.append(f"P5: unresolved signal IDs: {bad_signals}")
            vr["P5"] = False
        else:
            vr["P5"] = True

    # P1: claim_text must not be a bare L1 positional fact (simple heuristic:
    # reject if claim_text is ≤30 chars or contains only a single entity ID)
    claim = proposal.get("claim_text", "")
    if len(claim) < 30:
        failures.append("P1: claim_text too short — likely a bare L1 fact")
        vr["P1"] = False
    elif re.match(r"^[A-Z]{2,5}\.[A-Z0-9._]+\s*$", claim.strip()):
        failures.append("P1: claim_text appears to be a bare entity ID — not a pattern")
        vr["P1"] = False
    else:
        vr["P1"] = True

    # P2: mechanism must be non-empty
    mechanism = proposal.get("mechanism", "")
    if len(mechanism) < 20:
        failures.append("P2: mechanism too short — derivation not grounded")
        vr["P2"] = False
    else:
        vr["P2"] = True

    # P7: three-interpretation check
    p7_result = p7_validate(proposal)
    vr["P7"] = p7_result.passed
    if not p7_result.passed:
        failures.extend(p7_result.findings)

    # P8: falsifier-conditions enforcement
    p8_result = p8_validate(proposal)
    vr["P8"] = p8_result.passed
    if not p8_result.passed:
        failures.extend(p8_result.findings)

    # P9: audit trail — minimal: ledger_event_ids placeholder OK at proposal stage
    vr["P9"] = True  # Full P9 impl deferred to Exec_11 per STALENESS_REGISTER

    return len(failures) == 0, failures, vr


def _build_accepted_entry(
    proposal: dict,
    pattern_id: str,
    validator_results: dict,
    ledger_event_ids: list[str],
    prediction_ledger_ref: str | None,
) -> dict:
    """Construct the final PATTERN_REGISTER entry from an accepted proposal."""
    return {
        "pattern_id": pattern_id,
        "claim_text": proposal.get("claim_text", ""),
        "mechanism": proposal.get("mechanism", ""),
        "domain": proposal.get("domain", "meta"),
        "signals_referenced": proposal.get("signals_referenced", []),
        "counter_cases": proposal.get("counter_cases", []),
        "classical_basis": proposal.get("classical_basis", "derivative — emergent pattern"),
        "alternatives": proposal.get("alternatives", []),
        "validator_results": validator_results,
        "confidence": proposal.get("confidence", "LOW"),
        "significance": proposal.get("significance", 0.0),
        "is_forward_looking": proposal.get("is_forward_looking", False),
        "time_indexed_falsifier": proposal.get("time_indexed_falsifier"),
        "ledger_event_ids": ledger_event_ids,
        "prediction_ledger_ref": prediction_ledger_ref,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "created_by_session": SESSION_ID,
    }


def _append_to_pattern_register(entry: dict) -> None:
    """Append accepted pattern to PATTERN_REGISTER_v1_0.json and regenerate .md mirror."""
    _REGISTERS_DIR.mkdir(parents=True, exist_ok=True)

    if _PATTERN_REGISTER_JSON.exists():
        with _PATTERN_REGISTER_JSON.open() as f:
            data = json.load(f)
    else:
        data = {
            "schema": "06_LEARNING_LAYER/SCHEMAS/pattern_schema_v0_1.json",
            "version": "1.0",
            "produced_by_session": SESSION_ID,
            "produced_at": datetime.now(timezone.utc).date().isoformat(),
            "patterns": [],
        }

    data["patterns"].append(entry)

    with _PATTERN_REGISTER_JSON.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    _regenerate_md_mirror(data["patterns"])


def _regenerate_md_mirror(patterns: list[dict]) -> None:
    """Regenerate PATTERN_REGISTER_v1_0.md from the canonical JSON."""
    lines = [
        "---",
        "artifact: PATTERN_REGISTER_v1_0.md",
        'version: "1.0"',
        "status: LIVE",
        f"produced_by_session: {SESSION_ID}",
        f"produced_at: {datetime.now(timezone.utc).date().isoformat()}",
        "canonical_source: 035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.json",
        "schema: 06_LEARNING_LAYER/SCHEMAS/pattern_schema_v0_1.json",
        "changelog:",
        "  - v1.0 (2026-04-27, Madhav_M2A_Exec_9): Initial scaffold.",
        f"  - Regenerated {datetime.now(timezone.utc).isoformat()} with {len(patterns)} patterns.",
        "---",
        "",
        "# PATTERN REGISTER v1.0 — MARSYS-JIS Discovery Layer",
        "",
        "## §1 — About This Register",
        "",
        "Derived Markdown view of `035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.json`.",
        "Do not edit directly — regenerated by `pattern_mining_reconciler.py` after each accept.",
        "",
        "---",
        "",
        "## §2 — Pattern Index",
        "",
    ]

    if not patterns:
        lines.append("*No patterns yet.*")
        lines.append("")
        lines.append("| pattern_id | domain | confidence | significance | is_forward_looking |")
        lines.append("|---|---|---|---|---|")
    else:
        lines.append("| pattern_id | domain | confidence | significance | is_forward_looking |")
        lines.append("|---|---|---|---|---|")
        for p in patterns:
            lines.append(
                f"| {p['pattern_id']} | {p['domain']} | {p['confidence']} "
                f"| {p.get('significance', 0):.2f} | {p['is_forward_looking']} |"
            )

    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## §3 — Pattern Details")
    lines.append("")

    for p in patterns:
        pid = p["pattern_id"]
        lines.append(f"### {pid} — {p.get('domain', '').upper()}")
        lines.append("")

        # Metadata bar
        fwd = "✓ Forward-looking" if p.get("is_forward_looking") else "Retrospective"
        lines.append(
            f"**Confidence:** {p.get('confidence', '—')} &nbsp;·&nbsp; "
            f"**Significance:** {p.get('significance', 0):.2f} &nbsp;·&nbsp; {fwd}"
        )
        lines.append("")

        # Claim
        lines.append(f"**Claim:** {p.get('claim_text', '—')}")
        lines.append("")

        # Mechanism
        mech = p.get("mechanism", "")
        if mech:
            lines.append(f"**Mechanism:** {mech}")
            lines.append("")

        # Signals referenced
        sigs = p.get("signals_referenced", [])
        if sigs:
            lines.append(f"**Signals:** {', '.join(sigs)}")
            lines.append("")

        # Classical basis
        cb = p.get("classical_basis", "")
        if cb:
            lines.append(f"**Classical basis:** {cb}")
            lines.append("")

        # Alternatives
        alts = p.get("alternatives", [])
        if alts:
            lines.append("**Alternative interpretations:**")
            for i, alt in enumerate(alts, 1):
                lines.append(f"- Alt {i}: {alt}")
            lines.append("")

        # Counter-cases
        cc = p.get("counter_cases", [])
        if cc:
            lines.append("**Counter-cases (why standard astrology predicts otherwise):**")
            for c in cc:
                lines.append(f"- {c}")
            lines.append("")

        # Falsifier
        tif = p.get("time_indexed_falsifier")
        if tif and isinstance(tif, dict):
            lines.append("**Falsifier:**")
            ws = tif.get("verification_window_start", "")
            we = tif.get("verification_window_end", "")
            if ws or we:
                lines.append(f"- Window: {ws} → {we}")
            for fc in tif.get("falsifier_conditions", []):
                lines.append(f"- {fc}")
            lines.append("")

        # Prediction ledger ref
        pred_ref = p.get("prediction_ledger_ref")
        if pred_ref:
            lines.append(f"**Prediction ledger ref:** {pred_ref}")
            lines.append("")

        lines.append("---")
        lines.append("")

    lines.append("*End of PATTERN_REGISTER_v1_0.md. Regenerated by pattern_mining_reconciler.py.*")
    lines.append("")

    _PATTERN_REGISTER_MD.write_text("\n".join(lines), encoding="utf-8")


def reconcile_batch(raw_response_path: str, batch_id: str) -> ReconciliationResult:
    """
    Pass-2 reconciler for a single Gemini pattern-mining batch.

    For each proposed pattern:
    1. Parse YAML from raw response file.
    2. Run P1/P2/P5/P7/P8 validator stack.
    3. Emit claude_pattern_accept or claude_pattern_reject ledger event.
    4. If accepted: append to PATTERN_REGISTER; if forward-looking, log prediction.

    Returns ReconciliationResult with accepted patterns, rejections, acceptance rate.
    """
    raw_path = Path(raw_response_path)
    if not raw_path.is_absolute():
        raw_path = _PROJECT_ROOT / raw_response_path
    if not raw_path.exists():
        raise FileNotFoundError(f"Raw response file not found: {raw_path}")

    raw_text = raw_path.read_text(encoding="utf-8")

    # Write pattern_proposal ledger event for the batch
    ts = datetime.now(timezone.utc).isoformat()
    proposal_event_id = _compute_event_id(f"{batch_id}|{ts}|proposal")
    try:
        append_two_pass_event({
            "event_id": proposal_event_id,
            "event_type": "pattern_proposal",
            "timestamp": ts,
            "batch_id": batch_id,
            "prompt_id": PROMPT_ID,
            "prompt_version": PROMPT_VERSION,
            "gemini_response_ref": str(raw_path.relative_to(_PROJECT_ROOT)),
            "edge_proposal": {
                "source_node_id": "pattern_batch",
                "target_node_id": "PATTERN_REGISTER_v1_0",
                "edge_type": "SUPPORTS",
                "l1_source": "derivative — pattern proposals reference L1 via signal IDs",
            },
        })
    except Exception as exc:
        print(f"[RECONCILER] Warning: could not write proposal event: {exc}", file=sys.stderr)

    proposals = _extract_yaml_from_raw(raw_text)
    if not proposals:
        print(f"[RECONCILER] WARNING: No pattern proposals parsed from {raw_path}", file=sys.stderr)

    result = ReconciliationResult()
    schema = _load_pattern_schema()
    reconciler_ref = str(raw_path.with_suffix("").name) + "_reconciled.md"

    for idx, proposal in enumerate(proposals):
        ts_now = datetime.now(timezone.utc).isoformat()
        pat_hash = _compute_event_id(f"{batch_id}|{idx}|{ts_now}")

        passed, failures, validator_results = _validate_pattern(proposal)

        # Also check JSON Schema structural validity
        if passed:
            # Build a tentative entry to check schema
            tentative_id = _next_pattern_id()
            tentative = _build_accepted_entry(
                proposal, tentative_id, validator_results, [proposal_event_id, pat_hash], None
            )
            try:
                jsonschema.validate(instance=tentative, schema=schema)
            except jsonschema.ValidationError as exc:
                passed = False
                failures.append(f"schema_error: {exc.message}")
                _pat_counter_rollback()

        if passed:
            pattern_id = tentative_id

            # Emit claude_pattern_accept ledger event
            accept_event: dict[str, Any] = {
                "event_id": pat_hash,
                "event_type": "claude_pattern_accept",
                "timestamp": ts_now,
                "batch_id": batch_id,
                "prompt_id": PROMPT_ID,
                "prompt_version": PROMPT_VERSION,
                "gemini_response_ref": str(raw_path.relative_to(_PROJECT_ROOT)),
                "edge_proposal": {
                    "source_node_id": str(proposal.get("signals_referenced", ["?"])[0] if proposal.get("signals_referenced") else "?"),
                    "target_node_id": "PATTERN_REGISTER_v1_0",
                    "edge_type": "SUPPORTS",
                    "l1_source": "derivative — pattern accepted via P1/P2/P5/P7/P8 pass",
                },
                "pattern_id": pat_hash,
                "decision_basis": f"P1/P2/P5/P7/P8 pass. validators={validator_results}",
                "reconciler_artifact_ref": reconciler_ref,
                "pattern_payload": proposal,
            }
            try:
                append_two_pass_event(accept_event)
            except Exception as exc:
                print(f"[RECONCILER] Warning: could not write accept event: {exc}", file=sys.stderr)

            # Handle prediction ledger for forward-looking patterns
            prediction_ref: str | None = None
            if proposal.get("is_forward_looking"):
                tif = proposal.get("time_indexed_falsifier") or {}
                pred_entry = {
                    "artifact_id": pattern_id,
                    "artifact_type": "pattern",
                    "claim_text": proposal.get("claim_text", ""),
                    "domain": proposal.get("domain", "meta"),
                    "verification_window_start": tif.get("verification_window_start", "2026-01-01"),
                    "verification_window_end": tif.get("verification_window_end", "2030-01-01"),
                    "falsifier_conditions": tif.get("falsifier_conditions", ["No explicit falsifier provided"]),
                    "confirmation_conditions": ["Pattern is observationally confirmed within window"],
                    "outcome": None,
                    "outcome_source": None,
                    "outcome_recorded_at": None,
                    "created_by_event_id": pat_hash,
                    "ledger_ref": "06_LEARNING_LAYER/LEDGER/two_pass_events.jsonl",
                    "classical_basis": proposal.get("classical_basis"),
                    "confidence_at_creation": proposal.get("confidence", "LOW"),
                    "dependencies": [],
                }
                try:
                    prediction_ref = append_prediction(pred_entry)
                except Exception as exc:
                    print(f"[RECONCILER] Warning: prediction ledger write failed: {exc}", file=sys.stderr)

            # Build final entry
            final_entry = _build_accepted_entry(
                proposal,
                pattern_id,
                validator_results,
                [proposal_event_id, pat_hash],
                prediction_ref,
            )
            _append_to_pattern_register(final_entry)
            result.accepted_patterns.append(final_entry)

        else:
            # Emit claude_pattern_reject ledger event
            reject_event: dict[str, Any] = {
                "event_id": pat_hash,
                "event_type": "claude_pattern_reject",
                "timestamp": ts_now,
                "batch_id": batch_id,
                "prompt_id": PROMPT_ID,
                "prompt_version": PROMPT_VERSION,
                "gemini_response_ref": str(raw_path.relative_to(_PROJECT_ROOT)),
                "edge_proposal": {
                    "source_node_id": str(proposal.get("signals_referenced", ["?"])[0] if proposal.get("signals_referenced") else "?"),
                    "target_node_id": "PATTERN_REGISTER_v1_0",
                    "edge_type": "SUPPORTS",
                    "l1_source": "derivative — proposal rejected by validator stack",
                },
                "pattern_id": pat_hash,
                "decision_basis": f"Validation failed: {'; '.join(failures)}",
                "reconciler_artifact_ref": reconciler_ref,
            }
            try:
                append_two_pass_event(reject_event)
            except Exception as exc:
                print(f"[RECONCILER] Warning: could not write reject event: {exc}", file=sys.stderr)

            result.rejected_proposals.append({
                "proposal": proposal,
                "failures": failures,
                "validator_results": validator_results,
            })

    # Compute acceptance rate
    total = len(result.accepted_patterns) + len(result.rejected_proposals)
    if total > 0:
        result.batch_acceptance_rate = len(result.accepted_patterns) / total
        # Check anomaly band [0.15, 0.80]
        if result.batch_acceptance_rate < 0.15 or result.batch_acceptance_rate > 0.80:
            result.anomaly_fired = True
            result.anomaly_message = (
                f"[ACCEPTANCE_RATE_ANOMALY] batch={batch_id} "
                f"rate={result.batch_acceptance_rate:.2%} "
                f"(accepted={len(result.accepted_patterns)}, rejected={len(result.rejected_proposals)})"
            )

    return result


def _pat_counter_rollback() -> None:
    """Roll back the _pat_counter increment on schema validation failure."""
    global _pat_counter
    if _pat_counter is not None and _pat_counter > 0:
        _pat_counter -= 1
