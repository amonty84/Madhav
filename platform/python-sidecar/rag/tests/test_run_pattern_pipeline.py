"""
test_run_pattern_pipeline.py — unit tests for run_pattern_pipeline.py.
Run from platform/python-sidecar/: python -m pytest rag/tests/test_run_pattern_pipeline.py -v

Covers:
  (a) TestAnomalyOpensDR: anomaly_fired=True → DR entry written with correct fields.
  (b) Happy-path: single batch accepted within band → summary returned, no anomaly, no DR.
  (c) Two-batch: anomaly on batch 1 → batch 2 never processed (hard-halt).
  (d) Missing raw response file → sys.exit(1).

Modelled on test_run_resonance_pipeline.py TestAnomalyOpensDR class.
Backported DR-opening fix verified in AC.0 of Madhav_M2A_Exec_12 (2026-04-27).
"""

from __future__ import annotations

import json
import pathlib
import sys
import tempfile
import unittest
from unittest import mock

import rag.reconcilers.run_pattern_pipeline as pp_mod
from rag.reconcilers.pattern_mining_reconciler import ReconciliationResult


def _make_result(
    accepted: int = 3,
    rejected: int = 2,
    anomaly_fired: bool = False,
    anomaly_message: str = "",
) -> ReconciliationResult:
    rate = accepted / (accepted + rejected) if (accepted + rejected) > 0 else float("nan")
    return ReconciliationResult(
        accepted_patterns=[
            {
                "pattern_id": f"PAT.{i+1:03d}",
                "domain": "career",
                "claim_text": f"Test pattern {i+1} claim text here.",
                "pass_1_actor": "gemini",
            }
            for i in range(accepted)
        ],
        rejected_proposals=[
            {"proposal": {"claim_text": f"Rejected claim {i+1}"}, "failures": ["P5_SIGNAL_NOT_RESOLVED"]}
            for i in range(rejected)
        ],
        batch_acceptance_rate=rate,
        anomaly_fired=anomaly_fired,
        anomaly_message=anomaly_message if anomaly_fired else "",
    )


class TestAnomalyOpensDR(unittest.TestCase):
    """
    AC.0 verification: _open_disagreement_register_entry() is called in the anomaly halt path
    and writes a valid DR entry to DISAGREEMENT_REGISTER_v1_0.md.
    """

    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self._tmp_path = pathlib.Path(self._tmp.name)

        self._responses_dir = self._tmp_path / "responses"
        self._responses_dir.mkdir()
        self._batch_rates_file = self._tmp_path / "batch_acceptance_rates.json"
        self._dr_file = self._tmp_path / "DISAGREEMENT_REGISTER_v1_0.md"
        self._dr_file.write_text("# Disagreement Register\n\n", encoding="utf-8")

        self._patches = [
            mock.patch.object(pp_mod, "_RESPONSES_DIR", self._responses_dir),
            mock.patch.object(pp_mod, "_BATCH_RATES_FILE", self._batch_rates_file),
            mock.patch.object(pp_mod, "_DR_FILE", self._dr_file),
        ]
        for p in self._patches:
            p.start()

    def tearDown(self):
        for p in self._patches:
            p.stop()
        self._tmp.cleanup()

    def _write_raw(self, batch_id: str) -> pathlib.Path:
        p = self._responses_dir / f"2026-04-27_B5_pattern_mining_{batch_id}_raw.md"
        p.write_text("pattern_proposals: []\n", encoding="utf-8")
        return p

    def test_anomaly_opens_dr_entry(self):
        """anomaly_fired=True → DR entry exists in temp DR file."""
        self._write_raw("batch1")
        result = _make_result(
            accepted=5, rejected=0, anomaly_fired=True,
            anomaly_message="[ACCEPTANCE_RATE_ANOMALY] rate=1.0000 outside [0.15, 0.80]",
        )
        with mock.patch("rag.reconcilers.pattern_mining_reconciler.reconcile_batch", return_value=result):
            summary = pp_mod.run_pipeline(["batch1"])

        # Pipeline must report the DR entry
        self.assertTrue(summary["anomaly_fired"])
        self.assertEqual(summary["anomaly_batch"], "batch1")
        self.assertEqual(len(summary["dr_entries_opened"]), 1)
        dr_id = summary["dr_entries_opened"][0]
        self.assertTrue(dr_id.startswith("DIS."), f"Expected DIS.NNN, got {dr_id!r}")

        # DR file must contain a proper entry
        dr_text = self._dr_file.read_text()
        self.assertIn("DIS.class.acceptance_rate_anomaly", dr_text)
        self.assertIn("batch1", dr_text)

    def test_dr_entry_contains_batch_id(self):
        self._write_raw("mybatch")
        result = _make_result(accepted=4, rejected=0, anomaly_fired=True,
                              anomaly_message="[ACCEPTANCE_RATE_ANOMALY]")
        with mock.patch("rag.reconcilers.pattern_mining_reconciler.reconcile_batch", return_value=result):
            pp_mod.run_pipeline(["mybatch"])

        dr_text = self._dr_file.read_text()
        self.assertIn("mybatch", dr_text)

    def test_dr_entry_has_open_status(self):
        self._write_raw("batch1")
        result = _make_result(accepted=5, rejected=0, anomaly_fired=True,
                              anomaly_message="[ACCEPTANCE_RATE_ANOMALY]")
        with mock.patch("rag.reconcilers.pattern_mining_reconciler.reconcile_batch", return_value=result):
            pp_mod.run_pipeline(["batch1"])

        dr_text = self._dr_file.read_text()
        self.assertIn("OPEN", dr_text)
        self.assertIn("PENDING", dr_text)

    def test_no_dr_entry_on_happy_path(self):
        """No anomaly → DR file unchanged."""
        self._write_raw("batch1")
        result = _make_result(accepted=3, rejected=2, anomaly_fired=False)
        with mock.patch("rag.reconcilers.pattern_mining_reconciler.reconcile_batch", return_value=result):
            summary = pp_mod.run_pipeline(["batch1"])

        self.assertFalse(summary["anomaly_fired"])
        self.assertEqual(summary["dr_entries_opened"], [])
        dr_text = self._dr_file.read_text()
        self.assertNotIn("DIS.class.acceptance_rate_anomaly", dr_text)


class TestRunPipeline(unittest.TestCase):
    """Additional pipeline behaviour tests."""

    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self._tmp_path = pathlib.Path(self._tmp.name)

        self._responses_dir = self._tmp_path / "responses"
        self._responses_dir.mkdir()
        self._batch_rates_file = self._tmp_path / "batch_acceptance_rates.json"
        self._dr_file = self._tmp_path / "DISAGREEMENT_REGISTER_v1_0.md"
        self._dr_file.write_text("# Disagreement Register\n\n", encoding="utf-8")

        self._patches = [
            mock.patch.object(pp_mod, "_RESPONSES_DIR", self._responses_dir),
            mock.patch.object(pp_mod, "_BATCH_RATES_FILE", self._batch_rates_file),
            mock.patch.object(pp_mod, "_DR_FILE", self._dr_file),
        ]
        for p in self._patches:
            p.start()

    def tearDown(self):
        for p in self._patches:
            p.stop()
        self._tmp.cleanup()

    def _write_raw(self, batch_id: str) -> pathlib.Path:
        p = self._responses_dir / f"2026-04-27_B5_pattern_mining_{batch_id}_raw.md"
        p.write_text("pattern_proposals: []\n", encoding="utf-8")
        return p

    def test_happy_path_no_anomaly(self):
        self._write_raw("batch1")
        result = _make_result(accepted=3, rejected=2, anomaly_fired=False)
        with mock.patch("rag.reconcilers.pattern_mining_reconciler.reconcile_batch", return_value=result):
            summary = pp_mod.run_pipeline(["batch1"])

        self.assertFalse(summary["anomaly_fired"])
        self.assertIsNone(summary["anomaly_batch"])
        self.assertEqual(summary["total_patterns_accepted"], 3)
        self.assertEqual(summary["total_proposals"], 5)
        self.assertEqual(len(summary["batches_run"]), 1)
        self.assertAlmostEqual(summary["batches_run"][0]["acceptance_rate"], 0.6, places=4)

    def test_hard_halt_stops_after_first_anomaly(self):
        self._write_raw("batch1")
        self._write_raw("batch2")

        anomaly_result = _make_result(accepted=4, rejected=0, anomaly_fired=True,
                                      anomaly_message="[ACCEPTANCE_RATE_ANOMALY] rate=1.0000")
        good_result = _make_result(accepted=2, rejected=3, anomaly_fired=False)

        call_count = 0

        def side_effect(raw_path, batch_id):
            nonlocal call_count
            call_count += 1
            return anomaly_result if batch_id == "batch1" else good_result

        with mock.patch("rag.reconcilers.pattern_mining_reconciler.reconcile_batch", side_effect=side_effect):
            summary = pp_mod.run_pipeline(["batch1", "batch2"])

        self.assertEqual(call_count, 1)
        self.assertEqual(len(summary["batches_run"]), 1)
        self.assertTrue(summary["anomaly_fired"])

    def test_missing_raw_file_exits_1(self):
        with self.assertRaises(SystemExit) as cm:
            pp_mod.run_pipeline(["nonexistent_batch"])
        self.assertEqual(cm.exception.code, 1)

    def test_batch_rates_file_written(self):
        self._write_raw("batch1")
        result = _make_result(accepted=2, rejected=3, anomaly_fired=False)
        with mock.patch("rag.reconcilers.pattern_mining_reconciler.reconcile_batch", return_value=result):
            pp_mod.run_pipeline(["batch1"])

        self.assertTrue(self._batch_rates_file.exists())
        data = json.loads(self._batch_rates_file.read_text())
        self.assertEqual(len(data["batches"]), 1)
        self.assertEqual(data["batches"][0]["batch_id"], "batch1")
        self.assertEqual(data["batches"][0]["batch_type"], "pattern_mining")


if __name__ == "__main__":
    unittest.main()
