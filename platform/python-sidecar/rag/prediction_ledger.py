"""
prediction_ledger
MARSYS-JIS RAG Pipeline — prediction ledger writer (Hook 2).
Per PHASE_B_PLAN_v1_0.md §B.5 Task 0 + §F.2 Hook 2.
Appends JSONL entries to 06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl
for every forward-looking falsifiable claim before outcome is observed.
Promoted from stub at Madhav_M2A_Exec_9 (2026-04-27).
Minimal scope: append_prediction only — no read_predictions_for_artifact,
no record_outcome, no automatic Hook-2 chain to two_pass_events (those are M4+ scope).
"""

from __future__ import annotations

import json
import pathlib
from datetime import datetime, timezone
from typing import Any

import jsonschema

_PROJECT_ROOT = pathlib.Path(__file__).resolve().parent.parent.parent.parent
_LEDGER_DIR = _PROJECT_ROOT / "06_LEARNING_LAYER" / "PREDICTION_LEDGER"
_LEDGER_FILE = _LEDGER_DIR / "prediction_ledger.jsonl"
_SCHEMA_FILE = (
    _PROJECT_ROOT / "06_LEARNING_LAYER" / "SCHEMAS" / "prediction_schema_v0_1.json"
)

_schema_cache: dict | None = None


class SchemaValidationError(ValueError):
    """Raised when a prediction entry fails JSON Schema validation."""


def _load_schema() -> dict:
    global _schema_cache
    if _schema_cache is None:
        with _SCHEMA_FILE.open() as f:
            _schema_cache = json.load(f)
    return _schema_cache


def _next_prediction_id() -> str:
    """Auto-number from existing rows + 1, returning PRED.NNN."""
    if not _LEDGER_FILE.exists():
        return "PRED.001"
    count = 0
    with _LEDGER_FILE.open(encoding="utf-8") as f:
        for line in f:
            if line.strip():
                count += 1
    return f"PRED.{count + 1:03d}"


def append_prediction(entry: dict[str, Any]) -> str:
    """
    Validate against prediction_schema_v0_1.json; append JSONL row to
    06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl.
    Returns the assigned prediction_id (PRED.NNN — auto-numbered from existing rows + 1).
    Raises SchemaValidationError on validation failure.
    """
    entry = dict(entry)

    if not entry.get("prediction_id"):
        entry["prediction_id"] = _next_prediction_id()

    if not entry.get("created_at"):
        entry["created_at"] = datetime.now(timezone.utc).isoformat()

    schema = _load_schema()
    try:
        jsonschema.validate(instance=entry, schema=schema)
    except jsonschema.ValidationError as exc:
        raise SchemaValidationError(str(exc)) from exc

    _LEDGER_DIR.mkdir(parents=True, exist_ok=True)
    with _LEDGER_FILE.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

    return entry["prediction_id"]
