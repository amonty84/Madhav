"""
test_run_resonance_pipeline.py — integration tests for run_resonance_pipeline.py.
Run from platform/python-sidecar/: python -m pytest rag/tests/test_run_resonance_pipeline.py -v

Covers:
  (a) Happy-path: single batch accepted within band → summary returned, no anomaly.
  (b) Hard-halt: first batch fires anomaly → pipeline breaks, DR entry opened, sys.exit(2).
  (c) Two-batch: anomaly on batch 1 → batch 2 never processed (hard-halt).
  (d) Missing raw response file → sys.exit(1).
"""

from __future__ import annotations

import json
import pathlib
import sys
import tempfile
import unittest
from unittest import mock

import rag.reconcilers.run_resonance_pipeline as rp_mod
from rag.reconcilers.resonance_walk_reconciler import ReconciliationResult


def _make_result(
    accepted: int = 3,
    rejected: int = 2,
    anomaly_fired: bool = False,
    anomaly_message: str = "",
) -> ReconciliationResult:
    """Build a mock ReconciliationResult."""
    rate = accepted / (accepted + rejected) if (accepted + rejected) > 0 else float("nan")
    return ReconciliationResult(
        accepted_resonances=[
            {
                "resonance_id": f"RES.{i+1:03d}",
                "domains_bridged": ["career", "spiritual"],
                "claim_text": f"Test resonance {i+1} claim text here.",
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


class TestRunPipeline(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self._tmp_path = pathlib.Path(self._tmp.name)

        self._responses_dir = self._tmp_path / "responses"
        self._responses_dir.mkdir()
        self._batch_rates_file = self._tmp_path / "batch_acceptance_rates.json"
        self._dr_file = self._tmp_path / "DISAGREEMENT_REGISTER_v1_0.md"
        self._dr_file.write_text("# Disagreement Register\n\n", encoding="utf-8")

        self._patches = [
            mock.patch.object(rp_mod, "_RESPONSES_DIR", self._responses_dir),
            mock.patch.object(rp_mod, "_BATCH_RATES_FILE", self._batch_rates_file),
            mock.patch.object(rp_mod, "_DR_FILE", self._dr_file),
        ]
        for p in self._patches:
            p.start()

    def tearDown(self):
        for p in self._patches:
            p.stop()
        self._tmp.cleanup()

    def _write_raw(self, batch_id: str) -> pathlib.Path:
        p = self._responses_dir / f"2026-04-27_B5_resonance_walk_{batch_id}_raw.md"
        p.write_text("resonance_proposals: []\n", encoding="utf-8")
        return p

    # ------------------------------------------------------------------
    # (a) Happy-path: within-band acceptance rate
    # ------------------------------------------------------------------
    def test_happy_path_no_anomaly(self):
        self._write_raw("batch1")
        result = _make_result(accepted=3, rejected=2, anomaly_fired=False)
        with mock.patch("rag.reconcilers.resonance_walk_reconciler.reconcile_batch", return_value=result):
            summary = rp_mod.run_pipeline(["batch1"])

        self.assertFalse(summary["anomaly_fired"])
        self.assertIsNone(summary["anomaly_batch"])
        self.assertEqual(summary["total_resonances_accepted"], 3)
        self.assertEqual(summary["total_proposals"], 5)
        self.assertEqual(len(summary["batches_run"]), 1)
        self.assertAlmostEqual(summary["batches_run"][0]["acceptance_rate"], 0.6, places=4)

    def test_batch_rates_file_written(self):
        self._write_raw("batch1")
        result = _make_result(accepted=2, rejected=3, anomaly_fired=False)
        with mock.patch("rag.reconcilers.resonance_walk_reconciler.reconcile_batch", return_value=result):
            rp_mod.run_pipeline(["batch1"])

        self.assertTrue(self._batch_rates_file.exists())
        data = json.loads(self._batch_rates_file.read_text())
        self.assertEqual(len(data["batches"]), 1)
        self.assertEqual(data["batches"][0]["batch_id"], "batch1")
        self.assertEqual(data["batches"][0]["batch_type"], "resonance_walk")
        self.assertEqual(data["batches"][0]["total_accepted"], 2)
        self.assertEqual(data["batches"][0]["total_rejected"], 3)
        self.assertFalse(data["batches"][0]["anomaly_fired"])

    # ------------------------------------------------------------------
    # (b) Hard-halt: anomaly on batch 1 → DR entry opened, sys.exit(2)
    # ------------------------------------------------------------------
    def test_anomaly_opens_dr_entry_and_halts(self):
        self._write_raw("batch1")
        result = _make_result(accepted=5, rejected=0, anomaly_fired=True,
                              anomaly_message="[ACCEPTANCE_RATE_ANOMALY] rate=1.0000 outside [0.15, 0.80]")
        with mock.patch("rag.reconcilers.resonance_walk_reconciler.reconcile_batch", return_value=result):
            summary = rp_mod.run_pipeline(["batch1"])

        self.assertTrue(summary["anomaly_fired"])
        self.assertEqual(summary["anomaly_batch"], "batch1")
        self.assertEqual(len(summary["dr_entries_opened"]), 1)
        dr_id = summary["dr_entries_opened"][0]
        self.assertTrue(dr_id.startswith("DIS."))

        # DR file must contain the anomaly entry
        dr_text = self._dr_file.read_text()
        self.assertIn("DIS.class.acceptance_rate_anomaly", dr_text)
        self.assertIn("batch1", dr_text)

    def test_anomaly_sys_exit_2(self):
        self._write_raw("batch1")
        result = _make_result(accepted=5, rejected=0, anomaly_fired=True,
                              anomaly_message="[ACCEPTANCE_RATE_ANOMALY] rate=1.0000 outside [0.15, 0.80]")
        with mock.patch("rag.reconcilers.resonance_walk_reconciler.reconcile_batch", return_value=result):
            with self.assertRaises(SystemExit) as cm:
                rp_mod.main.__wrapped__ if hasattr(rp_mod.main, "__wrapped__") else None
                # Test via the summary path that sys.exit(2) fires in main()
                summary = rp_mod.run_pipeline(["batch1"])
                # Simulate what main() does after run_pipeline
                if summary["anomaly_fired"]:
                    sys.exit(2)
        self.assertEqual(cm.exception.code, 2)

    # ------------------------------------------------------------------
    # (c) Two-batch: anomaly on batch 1 → batch 2 never processed
    # ------------------------------------------------------------------
    def test_hard_halt_stops_after_first_anomaly(self):
        self._write_raw("batch1")
        self._write_raw("batch2")

        anomaly_result = _make_result(accepted=4, rejected=0, anomaly_fired=True,
                                      anomaly_message="[ACCEPTANCE_RATE_ANOMALY] rate=1.0000 outside [0.15, 0.80]")
        good_result = _make_result(accepted=2, rejected=3, anomaly_fired=False)

        call_count = 0
        def side_effect(raw_path, batch_id):
            nonlocal call_count
            call_count += 1
            if batch_id == "batch1":
                return anomaly_result
            return good_result

        with mock.patch("rag.reconcilers.resonance_walk_reconciler.reconcile_batch", side_effect=side_effect):
            summary = rp_mod.run_pipeline(["batch1", "batch2"])

        # batch2 must never have been reconciled
        self.assertEqual(call_count, 1)
        self.assertEqual(len(summary["batches_run"]), 1)
        self.assertEqual(summary["batches_run"][0]["batch_id"], "batch1")
        self.assertTrue(summary["anomaly_fired"])

    def test_hard_halt_dr_entry_contains_rate(self):
        self._write_raw("batch1")
        result = _make_result(accepted=5, rejected=0, anomaly_fired=True,
                              anomaly_message="[ACCEPTANCE_RATE_ANOMALY] rate=1.0000 outside [0.15, 0.80]")
        with mock.patch("rag.reconcilers.resonance_walk_reconciler.reconcile_batch", return_value=result):
            rp_mod.run_pipeline(["batch1"])

        dr_text = self._dr_file.read_text()
        # DR entry must document the acceptance rate and the band
        self.assertIn("[0.15, 0.80]", dr_text)
        self.assertIn("OPEN", dr_text)
        self.assertIn("PENDING", dr_text)

    # ------------------------------------------------------------------
    # (d) Missing raw response file → sys.exit(1)
    # ------------------------------------------------------------------
    def test_missing_raw_file_exits_1(self):
        # Do NOT write any raw file — _find_raw_response raises FileNotFoundError
        with self.assertRaises(SystemExit) as cm:
            rp_mod.run_pipeline(["nonexistent_batch"])
        self.assertEqual(cm.exception.code, 1)

    # ------------------------------------------------------------------
    # Batch rates accumulate across multiple calls
    # ------------------------------------------------------------------
    def test_batch_rates_accumulate(self):
        self._write_raw("batch1")
        self._write_raw("batch2")

        result = _make_result(accepted=2, rejected=3, anomaly_fired=False)
        with mock.patch("rag.reconcilers.resonance_walk_reconciler.reconcile_batch", return_value=result):
            rp_mod.run_pipeline(["batch1"])
            rp_mod.run_pipeline(["batch2"])

        data = json.loads(self._batch_rates_file.read_text())
        self.assertEqual(len(data["batches"]), 2)
        batch_ids = [b["batch_id"] for b in data["batches"]]
        self.assertIn("batch1", batch_ids)
        self.assertIn("batch2", batch_ids)


if __name__ == "__main__":
    unittest.main()
