"""
test_prediction_ledger.py — unit tests for rag/prediction_ledger.py (AC.1).
Run from platform/python-sidecar/: python -m pytest rag/tests/test_prediction_ledger.py -v
Covers: valid entry round-trips, missing falsifier_conditions raises error,
auto-numbered prediction_id increments correctly.
"""

import json
import pathlib
import tempfile
import unittest
from datetime import datetime, timezone
from unittest import mock

import rag.prediction_ledger as pred_mod
from rag.prediction_ledger import SchemaValidationError, append_prediction


def _good_entry(prediction_id: str | None = None) -> dict:
    entry = {
        "artifact_id": "PAT.001",
        "artifact_type": "pattern",
        "claim_text": "Saturn-Jupiter conjunction in the 10th house signals a major career peak during Shani AD.",
        "domain": "career",
        "verification_window_start": "2026-01-01",
        "verification_window_end": "2028-01-01",
        "falsifier_conditions": ["No career change occurs in the window", "Saturn dasha ends before 2026"],
        "confirmation_conditions": ["Promotion or leadership role confirmed by 2027"],
        "outcome": None,
        "outcome_source": None,
        "outcome_recorded_at": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "created_by_event_id": "abc123def456",
        "ledger_ref": "two_pass_events.jsonl",
        "classical_basis": "Brihat Parashara Hora Shastra §Karma Bhava",
        "confidence_at_creation": "MED",
        "dependencies": [],
    }
    if prediction_id:
        entry["prediction_id"] = prediction_id
    return entry


class TestPredictionLedger(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        tmp_path = pathlib.Path(self._tmp.name)
        self._ledger_dir = tmp_path / "PREDICTION_LEDGER"
        self._ledger_file = self._ledger_dir / "prediction_ledger.jsonl"
        self._patches = [
            mock.patch.object(pred_mod, "_LEDGER_DIR", self._ledger_dir),
            mock.patch.object(pred_mod, "_LEDGER_FILE", self._ledger_file),
            mock.patch.object(pred_mod, "_schema_cache", None),
        ]
        for p in self._patches:
            p.start()

    def tearDown(self):
        for p in self._patches:
            p.stop()
        self._tmp.cleanup()

    def test_valid_entry_round_trips(self):
        """Valid entry is written and readable as the last JSONL line."""
        pred_id = append_prediction(_good_entry())
        self.assertRegex(pred_id, r"^PRED\.\d{3}$")
        self.assertTrue(self._ledger_file.exists())
        lines = [l for l in self._ledger_file.read_text().splitlines() if l.strip()]
        self.assertEqual(len(lines), 1)
        record = json.loads(lines[0])
        self.assertEqual(record["prediction_id"], pred_id)
        self.assertEqual(record["artifact_type"], "pattern")
        self.assertEqual(record["domain"], "career")

    def test_missing_falsifier_conditions_raises(self):
        """Entry missing falsifier_conditions raises SchemaValidationError; file not created."""
        entry = _good_entry()
        del entry["falsifier_conditions"]
        with self.assertRaises(SchemaValidationError):
            append_prediction(entry)
        self.assertFalse(self._ledger_file.exists())

    def test_auto_numbered_id_starts_at_001(self):
        """First entry gets PRED.001 when no existing rows."""
        pred_id = append_prediction(_good_entry())
        self.assertEqual(pred_id, "PRED.001")

    def test_auto_numbered_id_increments(self):
        """Second entry gets PRED.002; third gets PRED.003."""
        id1 = append_prediction(_good_entry())
        id2 = append_prediction(_good_entry())
        id3 = append_prediction(_good_entry())
        self.assertEqual(id1, "PRED.001")
        self.assertEqual(id2, "PRED.002")
        self.assertEqual(id3, "PRED.003")

    def test_explicit_prediction_id_preserved(self):
        """If prediction_id is provided in entry, it is used as-is."""
        entry = _good_entry()
        entry["prediction_id"] = "PRED.042"
        pred_id = append_prediction(entry)
        self.assertEqual(pred_id, "PRED.042")
        record = json.loads(self._ledger_file.read_text().splitlines()[0])
        self.assertEqual(record["prediction_id"], "PRED.042")

    def test_bad_artifact_type_raises(self):
        """Entry with invalid artifact_type raises SchemaValidationError."""
        entry = _good_entry()
        entry["artifact_type"] = "invalid_type"
        with self.assertRaises(SchemaValidationError):
            append_prediction(entry)

    def test_bad_domain_raises(self):
        """Entry with invalid domain raises SchemaValidationError."""
        entry = _good_entry()
        entry["domain"] = "unknown_domain"
        with self.assertRaises(SchemaValidationError):
            append_prediction(entry)

    def test_created_at_auto_assigned_if_missing(self):
        """created_at is auto-filled if not provided."""
        entry = _good_entry()
        del entry["created_at"]
        pred_id = append_prediction(entry)
        record = json.loads(self._ledger_file.read_text().splitlines()[0])
        self.assertIn("created_at", record)
        self.assertTrue(record["created_at"])


if __name__ == "__main__":
    unittest.main()
