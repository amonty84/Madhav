"""
ledger
MARSYS-JIS RAG Pipeline — two-pass discovery ledger event writer.
Implements the minimal B.4 surface: append_two_pass_event + read_events_for_batch.
B.5 mining-event extensions (get_acceptance_rate etc.) are deferred per PHASE_B_PLAN §B.5 Task 0.
"""

from __future__ import annotations

import hashlib
import json
import pathlib
from datetime import datetime, timezone
from typing import Any

import jsonschema

# Paths are resolved relative to the project root (two levels up from this file).
_PROJECT_ROOT = pathlib.Path(__file__).resolve().parent.parent.parent.parent
_LEDGER_DIR = _PROJECT_ROOT / "06_LEARNING_LAYER" / "LEDGER"
_LEDGER_FILE = _LEDGER_DIR / "two_pass_events.jsonl"
_SCHEMA_FILE = (
    _PROJECT_ROOT
    / "06_LEARNING_LAYER"
    / "SCHEMAS"
    / "two_pass_events_schema_v0_1.json"
)

_schema_cache: dict | None = None


class SchemaValidationError(ValueError):
    """Raised when a ledger event fails JSON Schema validation."""


def _load_schema() -> dict:
    global _schema_cache
    if _schema_cache is None:
        with _SCHEMA_FILE.open() as f:
            _schema_cache = json.load(f)
    return _schema_cache


def _compute_event_id(seed: str) -> str:
    """12-char hex prefix of sha256(seed)."""
    return hashlib.sha256(seed.encode()).hexdigest()[:12]


def append_two_pass_event(event: dict[str, Any]) -> str:
    """
    Validate and append a two-pass ledger event to two_pass_events.jsonl.

    Assigns event_id (sha256-truncated-12) seeded from batch_id + timestamp + edge_proposal
    before validation so the written record carries the ID.  Returns event_id.
    Raises SchemaValidationError on validation failure.
    """
    # Assign event_id if not yet present.
    if "event_id" not in event or not event["event_id"]:
        seed_parts = [
            event.get("batch_id", ""),
            event.get("timestamp", datetime.now(timezone.utc).isoformat()),
            json.dumps(event.get("edge_proposal", {}), sort_keys=True),
        ]
        event["event_id"] = _compute_event_id("|".join(seed_parts))

    # Validate against schema before writing.
    schema = _load_schema()
    try:
        jsonschema.validate(instance=event, schema=schema)
    except jsonschema.ValidationError as exc:
        raise SchemaValidationError(str(exc)) from exc

    _LEDGER_DIR.mkdir(parents=True, exist_ok=True)
    with _LEDGER_FILE.open("a", encoding="utf-8") as f:
        f.write(json.dumps(event, ensure_ascii=False) + "\n")

    return event["event_id"]


def read_events_for_batch(batch_id: str) -> list[dict[str, Any]]:
    """
    Return all ledger events whose batch_id matches the argument.
    Returns empty list if the ledger file does not exist (never raises FileNotFoundError).
    """
    if not _LEDGER_FILE.exists():
        return []
    results: list[dict] = []
    with _LEDGER_FILE.open(encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                record = json.loads(line)
            except json.JSONDecodeError:
                continue
            if record.get("batch_id") == batch_id:
                results.append(record)
    return results


# Verdict-emitting event types (denominator for acceptance rate).
_VERDICT_EVENT_TYPES: frozenset[str] = frozenset({
    "claude_reconcile_accept",
    "claude_reconcile_reject",
    "gemini_challenge_accept",
    "gemini_challenge_reject",
    "claude_pattern_accept",
    "claude_pattern_reject",
})

# Accept-side verdict types (numerator for acceptance rate).
_ACCEPT_EVENT_TYPES: frozenset[str] = frozenset({
    "claude_reconcile_accept",
    "gemini_challenge_accept",
    "claude_pattern_accept",
})


def get_acceptance_rate(batch_id: str) -> float:
    """
    Numerator: count of events where event_type ∈ {claude_reconcile_accept,
                gemini_challenge_accept, claude_pattern_accept}.
    Denominator: count of events where event_type ∈ verdict event types.
    Returns NaN (float('nan')) if denominator is 0 (no verdicts yet for this batch).
    Raises FileNotFoundError if ledger file does not exist.
    Per PHASE_B_PLAN_v1_0.md §B.5 Acceptance-rate monitoring.
    Extended at Madhav_M2A_Exec_9 (2026-04-27).
    """
    if not _LEDGER_FILE.exists():
        raise FileNotFoundError(f"Ledger file not found: {_LEDGER_FILE}")

    numerator = 0
    denominator = 0
    with _LEDGER_FILE.open(encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                record = json.loads(line)
            except json.JSONDecodeError:
                continue
            if record.get("batch_id") != batch_id:
                continue
            et = record.get("event_type", "")
            if et in _VERDICT_EVENT_TYPES:
                denominator += 1
                if et in _ACCEPT_EVENT_TYPES:
                    numerator += 1

    if denominator == 0:
        return float("nan")
    return numerator / denominator
