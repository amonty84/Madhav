"""
test_ledger.py — smoke + unit tests for rag/ledger.py.
Run from platform/python-sidecar/: python -m pytest rag/tests/test_ledger.py
Covers: schema-pass, schema-fail, read_events_for_batch round-trip,
        get_acceptance_rate (AC.4 extension at Madhav_M2A_Exec_9).
"""

import json
import pathlib
import tempfile
import unittest
from datetime import datetime, timezone
from unittest import mock

import math

import rag.ledger as ledger_mod
from rag.ledger import SchemaValidationError, append_two_pass_event, get_acceptance_rate, read_events_for_batch


def _good_event(batch_id: str = "B4_test_batch1", event_type: str = "gemini_proposal") -> dict:
    event = {
        "event_type": event_type,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "batch_id": batch_id,
        "prompt_id": "gemini.cgm_supports_edges",
        "prompt_version": "1.0",
        "gemini_response_ref": "035_DISCOVERY_LAYER/PROMPTS/gemini/responses/2026-04-26_B4_supports_batch1_raw.md",
        "edge_proposal": {
            "source_node_id": "SIG.MSR.042",
            "target_node_id": "UCN.SEC.IV.2",
            "edge_type": "SUPPORTS",
            "l1_source": "derivative — l3_evidence_report carries the chain",
            "l3_evidence_report": "REPORT_CAREER_DHARMA_v1_1.md",
            "confidence_prior": "HIGH",
        },
    }
    if event_type in ("claude_reconcile_accept", "claude_reconcile_reject"):
        event["reconciler_artifact_ref"] = "035_DISCOVERY_LAYER/PROMPTS/gemini/responses/2026-04-26_B4_supports_batch1_reconciled.md"
        event["decision_basis"] = "P1/P2/P5 pass; L3 narrative chain confirmed."
    if event_type == "claude_reconcile_accept":
        event["accepted_by_session"] = "Madhav_M2A_Exec_7"
    return event


class TestLedger(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        tmp_path = pathlib.Path(self._tmp.name)
        self._ledger_dir = tmp_path / "LEDGER"
        self._ledger_file = self._ledger_dir / "two_pass_events.jsonl"
        self._patches = [
            mock.patch.object(ledger_mod, "_LEDGER_DIR", self._ledger_dir),
            mock.patch.object(ledger_mod, "_LEDGER_FILE", self._ledger_file),
        ]
        for p in self._patches:
            p.start()

    def tearDown(self):
        for p in self._patches:
            p.stop()
        self._tmp.cleanup()

    def test_schema_pass_gemini_proposal(self):
        """Valid gemini_proposal event is written and returns a 12-char event_id."""
        event = _good_event()
        event_id = append_two_pass_event(event)
        self.assertRegex(event_id, r"^[0-9a-f]{12}$")
        self.assertTrue(self._ledger_file.exists())
        lines = [l for l in self._ledger_file.read_text().splitlines() if l.strip()]
        self.assertEqual(len(lines), 1)
        record = json.loads(lines[0])
        self.assertEqual(record["event_id"], event_id)
        self.assertEqual(record["batch_id"], "B4_test_batch1")

    def test_schema_pass_reconcile_accept(self):
        """Valid claude_reconcile_accept event is accepted."""
        event_id = append_two_pass_event(_good_event(event_type="claude_reconcile_accept"))
        self.assertRegex(event_id, r"^[0-9a-f]{12}$")

    def test_schema_pass_reconcile_reject(self):
        """Valid claude_reconcile_reject event is accepted."""
        event_id = append_two_pass_event(_good_event(event_type="claude_reconcile_reject"))
        self.assertRegex(event_id, r"^[0-9a-f]{12}$")

    def test_schema_fail_missing_required_field(self):
        """Event missing required field raises SchemaValidationError (file not created)."""
        event = _good_event()
        del event["batch_id"]
        with self.assertRaises(SchemaValidationError):
            append_two_pass_event(event)
        self.assertFalse(self._ledger_file.exists())

    def test_schema_fail_bad_event_type(self):
        """Event with invalid enum value raises SchemaValidationError."""
        event = _good_event()
        event["event_type"] = "unknown_type"
        with self.assertRaises(SchemaValidationError):
            append_two_pass_event(event)

    def test_read_events_no_file(self):
        """read_events_for_batch returns [] when ledger file doesn't exist."""
        self.assertEqual(read_events_for_batch("nonexistent_batch"), [])

    def test_read_events_round_trip(self):
        """Events written are correctly filtered by batch_id on read."""
        append_two_pass_event(_good_event(batch_id="batch_A"))
        append_two_pass_event(_good_event(batch_id="batch_A"))
        append_two_pass_event(_good_event(batch_id="batch_B"))
        result_a = read_events_for_batch("batch_A")
        result_b = read_events_for_batch("batch_B")
        result_c = read_events_for_batch("batch_C")
        self.assertEqual(len(result_a), 2)
        self.assertEqual(len(result_b), 1)
        self.assertEqual(result_c, [])
        for r in result_a:
            self.assertEqual(r["batch_id"], "batch_A")

    def test_event_id_stability(self):
        """Same seed bytes produce identical event_id."""
        ts = "2026-04-26T10:00:00+00:00"
        e1 = _good_event()
        e1["timestamp"] = ts
        e1.pop("event_id", None)
        e2 = _good_event()
        e2["timestamp"] = ts
        e2.pop("event_id", None)
        id1 = append_two_pass_event(e1)
        self._ledger_file.unlink()
        id2 = append_two_pass_event(e2)
        self.assertEqual(id1, id2)


class TestGetAcceptanceRate(unittest.TestCase):
    """AC.4 extension: get_acceptance_rate(batch_id) tests."""

    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        tmp_path = pathlib.Path(self._tmp.name)
        self._ledger_dir = tmp_path / "LEDGER"
        self._ledger_file = self._ledger_dir / "two_pass_events.jsonl"
        self._patches = [
            mock.patch.object(ledger_mod, "_LEDGER_DIR", self._ledger_dir),
            mock.patch.object(ledger_mod, "_LEDGER_FILE", self._ledger_file),
        ]
        for p in self._patches:
            p.start()

    def tearDown(self):
        for p in self._patches:
            p.stop()
        self._tmp.cleanup()

    def _write_events(self, events: list[dict]) -> None:
        self._ledger_dir.mkdir(parents=True, exist_ok=True)
        with self._ledger_file.open("w", encoding="utf-8") as f:
            for ev in events:
                f.write(json.dumps(ev) + "\n")

    def test_two_accepts_one_reject_one_proposal(self):
        """2 accepts + 1 reject + 1 proposal → acceptance_rate = 2/3 ≈ 0.6667."""
        events = [
            {"batch_id": "test_batch", "event_type": "pattern_proposal"},
            {"batch_id": "test_batch", "event_type": "claude_pattern_accept"},
            {"batch_id": "test_batch", "event_type": "claude_pattern_accept"},
            {"batch_id": "test_batch", "event_type": "claude_pattern_reject"},
        ]
        self._write_events(events)
        rate = get_acceptance_rate("test_batch")
        self.assertAlmostEqual(rate, 2 / 3, places=4)

    def test_empty_batch_returns_nan(self):
        """Batch with no verdict events returns NaN."""
        events = [
            {"batch_id": "test_batch", "event_type": "pattern_proposal"},
        ]
        self._write_events(events)
        rate = get_acceptance_rate("test_batch")
        self.assertTrue(math.isnan(rate))

    def test_no_events_for_batch_returns_nan(self):
        """Batch not present in ledger returns NaN (not FileNotFoundError)."""
        events = [
            {"batch_id": "other_batch", "event_type": "claude_pattern_accept"},
        ]
        self._write_events(events)
        rate = get_acceptance_rate("missing_batch")
        self.assertTrue(math.isnan(rate))

    def test_file_not_found_raises(self):
        """FileNotFoundError raised when ledger file does not exist."""
        with self.assertRaises(FileNotFoundError):
            get_acceptance_rate("any_batch")

    def test_all_accepts(self):
        """All accept events → rate = 1.0."""
        events = [
            {"batch_id": "b", "event_type": "claude_reconcile_accept"},
            {"batch_id": "b", "event_type": "gemini_challenge_accept"},
        ]
        self._write_events(events)
        self.assertEqual(get_acceptance_rate("b"), 1.0)

    def test_all_rejects(self):
        """All reject events → rate = 0.0."""
        events = [
            {"batch_id": "b", "event_type": "claude_reconcile_reject"},
            {"batch_id": "b", "event_type": "claude_pattern_reject"},
        ]
        self._write_events(events)
        self.assertEqual(get_acceptance_rate("b"), 0.0)

    def test_mixed_batch_types(self):
        """Mixes of accept types all count in numerator."""
        events = [
            {"batch_id": "b", "event_type": "claude_reconcile_accept"},
            {"batch_id": "b", "event_type": "gemini_challenge_accept"},
            {"batch_id": "b", "event_type": "claude_pattern_accept"},
            {"batch_id": "b", "event_type": "claude_pattern_reject"},
        ]
        self._write_events(events)
        rate = get_acceptance_rate("b")
        self.assertAlmostEqual(rate, 3 / 4)


if __name__ == "__main__":
    unittest.main()
