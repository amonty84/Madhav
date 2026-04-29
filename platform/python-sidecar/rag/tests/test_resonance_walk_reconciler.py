"""
test_resonance_walk_reconciler.py — unit tests for resonance_walk_reconciler.py.
Run from platform/python-sidecar/: python -m pytest rag/tests/test_resonance_walk_reconciler.py -v

Covers:
  (a) Happy-path: parse + validate + accept a valid resonance YAML fixture.
  (b) signals_referenced unresolved → reject with P5_SIGNAL_NOT_RESOLVED.
  (c) domains_bridged not 2-element → reject with RESONANCE_DOMAINS_BRIDGED_INVALID.
  (d) cdlm_cells_referenced unresolved → reject with RESONANCE_CDLM_UNRESOLVED.
  (e) high-significance resonance with <2 alternatives → reject with P7 failure.
"""

from __future__ import annotations

import json
import pathlib
import tempfile
import textwrap
import unittest
from datetime import datetime, timezone
from unittest import mock

import rag.reconcilers.resonance_walk_reconciler as rw_mod
from rag.reconcilers.resonance_walk_reconciler import (
    ReconciliationResult,
    _extract_yaml_from_raw,
    _validate_resonance,
    _validate_cdlm_cells,
)


def _fixture_proposal(
    signals=None,
    domains_bridged=None,
    cdlm_cells=None,
    alternatives=None,
    significance=0.65,
    is_forward_looking=False,
) -> dict:
    """Build a minimal valid resonance proposal for testing."""
    return {
        "proposed_resonance_id": "RES.XXX",
        "claim_text": "Saturn AK governs career discipline and spiritual austerity simultaneously, creating structural entanglement between career excellence and renunciation.",
        "mechanism": "Saturn as AK (soul purpose) and AmK (career dharma) means every professional act carries soul-debt weight; career discipline and spiritual austerity share the same planetary engine.",
        "domains_bridged": domains_bridged if domains_bridged is not None else ["career", "spiritual"],
        "signals_referenced": signals if signals is not None else ["SIG.MSR.015", "SIG.MSR.042"],
        "cdlm_cells_referenced": cdlm_cells if cdlm_cells is not None else ["CDLM.career.spiritual"],
        "counter_cases": ["Career excellence and spiritual renunciation may operate on separate timescales."],
        "classical_basis": "derivative — emergent resonance",
        "alternatives": alternatives if alternatives is not None else [
            "AK governs soul only; career operates independently under AmK.",
            "The dual karaka assignment is a 7-karaka vs 8-karaka dispute; under 8-karaka AmK = Venus.",
        ],
        "confidence": "HIGH",
        "significance": significance,
        "is_forward_looking": is_forward_looking,
        "time_indexed_falsifier": (
            {
                "verification_window_start": "2025-01-01",
                "verification_window_end": "2028-12-31",
                "falsifier_conditions": ["No career peak or spiritual transformation occurs in the window."],
            }
            if is_forward_looking
            else None
        ),
    }


def _make_raw_yaml(proposals: list[dict]) -> str:
    import yaml
    return yaml.dump({"resonance_proposals": proposals}, allow_unicode=True)


class TestExtractYaml(unittest.TestCase):
    def test_plain_yaml(self):
        proposal = _fixture_proposal()
        raw = _make_raw_yaml([proposal])
        result = _extract_yaml_from_raw(raw)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["claim_text"], proposal["claim_text"])

    def test_fenced_yaml_block(self):
        proposal = _fixture_proposal()
        import yaml
        raw = f"```yaml\n{yaml.dump({'resonance_proposals': [proposal]})}\n```"
        result = _extract_yaml_from_raw(raw)
        self.assertEqual(len(result), 1)

    def test_empty_response_returns_empty(self):
        result = _extract_yaml_from_raw("no proposals here")
        self.assertEqual(result, [])


class TestValidateCdlmCells(unittest.TestCase):
    def test_valid_cell(self):
        ok, failures = _validate_cdlm_cells(["CDLM.career.spiritual"])
        self.assertTrue(ok)
        self.assertEqual(failures, [])

    def test_invalid_domain(self):
        ok, failures = _validate_cdlm_cells(["CDLM.career.unknown_domain"])
        self.assertFalse(ok)
        self.assertTrue(any("RESONANCE_CDLM_UNRESOLVED" in f for f in failures))

    def test_pattern_mismatch(self):
        ok, failures = _validate_cdlm_cells(["career.spiritual"])
        self.assertFalse(ok)
        self.assertTrue(any("RESONANCE_CDLM_UNRESOLVED" in f for f in failures))

    def test_empty_list_is_valid(self):
        ok, failures = _validate_cdlm_cells([])
        self.assertTrue(ok)


class TestValidateResonance(unittest.TestCase):
    def _mock_signal_registry(self, signals: set):
        """Return a context manager that patches get_signal_registry."""
        return mock.patch(
            "rag.reconcilers.resonance_walk_reconciler.p5.get_signal_registry",
            return_value={s: {} for s in signals},
        )

    def test_happy_path_accepted(self):
        proposal = _fixture_proposal()
        known_signals = {"SIG.MSR.015", "SIG.MSR.042"}
        with self._mock_signal_registry(known_signals):
            passed, failures, vr = _validate_resonance(proposal)
        self.assertTrue(passed, f"Expected pass but got failures: {failures}")
        self.assertEqual(failures, [])
        self.assertTrue(vr.get("P1"))
        self.assertTrue(vr.get("P5"))

    def test_signals_unresolved_rejected(self):
        proposal = _fixture_proposal(signals=["SIG.MSR.FAKE"])
        with self._mock_signal_registry({"SIG.MSR.015"}):
            passed, failures, vr = _validate_resonance(proposal)
        self.assertFalse(passed)
        self.assertTrue(any("P5_SIGNAL_NOT_RESOLVED" in f for f in failures), failures)
        self.assertFalse(vr.get("P5"))

    def test_domains_bridged_not_two_elements(self):
        proposal = _fixture_proposal(domains_bridged=["career"])
        with self._mock_signal_registry({"SIG.MSR.015", "SIG.MSR.042"}):
            passed, failures, vr = _validate_resonance(proposal)
        self.assertFalse(passed)
        self.assertTrue(any("RESONANCE_DOMAINS_BRIDGED_INVALID" in f for f in failures), failures)

    def test_domains_bridged_three_elements(self):
        proposal = _fixture_proposal(domains_bridged=["career", "spiritual", "wealth"])
        with self._mock_signal_registry({"SIG.MSR.015", "SIG.MSR.042"}):
            passed, failures, vr = _validate_resonance(proposal)
        self.assertFalse(passed)
        self.assertTrue(any("RESONANCE_DOMAINS_BRIDGED_INVALID" in f for f in failures), failures)

    def test_cdlm_cells_unresolved_rejected(self):
        proposal = _fixture_proposal(cdlm_cells=["CDLM.career.notadomain"])
        with self._mock_signal_registry({"SIG.MSR.015", "SIG.MSR.042"}):
            passed, failures, vr = _validate_resonance(proposal)
        self.assertFalse(passed)
        self.assertTrue(any("RESONANCE_CDLM_UNRESOLVED" in f for f in failures), failures)

    def test_high_significance_few_alternatives_rejected(self):
        # significance 0.80 ≥ 0.7 threshold → P7 requires ≥2 alternatives; only 1 provided
        proposal = _fixture_proposal(significance=0.80, alternatives=["Only one alternative."])
        with self._mock_signal_registry({"SIG.MSR.015", "SIG.MSR.042"}):
            passed, failures, vr = _validate_resonance(proposal)
        self.assertFalse(passed)
        self.assertFalse(vr.get("P7"))


class TestReconcileBatch(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self._tmp_path = pathlib.Path(self._tmp.name)

        # Patch project root + file paths so tests don't touch real registers
        self._patches = [
            mock.patch.object(rw_mod, "_PROJECT_ROOT", self._tmp_path),
            mock.patch.object(
                rw_mod, "_RESONANCE_REGISTER_JSON",
                self._tmp_path / "RESONANCE_REGISTER_v1_0.json",
            ),
            mock.patch.object(
                rw_mod, "_RESONANCE_REGISTER_MD",
                self._tmp_path / "RESONANCE_REGISTER_v1_0.md",
            ),
            mock.patch.object(
                rw_mod, "_SCHEMA_FILE",
                pathlib.Path(__file__).resolve().parents[4] / "06_LEARNING_LAYER" / "SCHEMAS" / "resonance_schema_v0_1.json",
            ),
            mock.patch("rag.reconcilers.resonance_walk_reconciler.append_two_pass_event", return_value=None),
            mock.patch("rag.reconcilers.resonance_walk_reconciler.append_prediction", return_value="PRED.005"),
            mock.patch(
                "rag.reconcilers.resonance_walk_reconciler.p5.get_signal_registry",
                return_value={s: {} for s in [
                    "SIG.MSR.015", "SIG.MSR.040", "SIG.MSR.041", "SIG.MSR.042",
                    "SIG.MSR.228", "SIG.MSR.396", "SIG.MSR.397", "SIG.MSR.413",
                ]},
            ),
        ]
        for p in self._patches:
            p.start()
        # Reset counter between tests
        rw_mod._res_counter = None
        rw_mod._resonance_schema_cache = None

    def tearDown(self):
        for p in self._patches:
            p.stop()
        self._tmp.cleanup()

    def _write_raw(self, proposals: list[dict]) -> pathlib.Path:
        import yaml
        raw = yaml.dump({"resonance_proposals": proposals}, allow_unicode=True)
        p = self._tmp_path / "2026-04-27_B5_resonance_walk_testbatch1_raw.md"
        p.write_text(raw)
        return p

    def test_happy_path_single_proposal_accepted(self):
        proposal = _fixture_proposal()
        raw_path = self._write_raw([proposal])
        result = rw_mod.reconcile_batch(str(raw_path), "testbatch1")
        self.assertEqual(len(result.accepted_resonances), 1)
        self.assertEqual(len(result.rejected_proposals), 0)
        self.assertEqual(result.accepted_resonances[0]["resonance_id"], "RES.001")
        self.assertAlmostEqual(result.batch_acceptance_rate, 1.0)

    def test_accept_includes_pass_1_actor_gemini(self):
        proposal = _fixture_proposal()
        raw_path = self._write_raw([proposal])
        result = rw_mod.reconcile_batch(str(raw_path), "testbatch1")
        self.assertEqual(result.accepted_resonances[0]["pass_1_actor"], "gemini")

    def test_rejection_p5_unresolved_signal(self):
        proposal = _fixture_proposal(signals=["SIG.MSR.FAKE_SIGNAL"])
        raw_path = self._write_raw([proposal])
        result = rw_mod.reconcile_batch(str(raw_path), "testbatch1")
        self.assertEqual(len(result.accepted_resonances), 0)
        self.assertEqual(len(result.rejected_proposals), 1)
        self.assertTrue(any("P5_SIGNAL_NOT_RESOLVED" in f for f in result.rejected_proposals[0]["failures"]))

    def test_rejection_domains_bridged_invalid(self):
        proposal = _fixture_proposal(domains_bridged=["career"])
        raw_path = self._write_raw([proposal])
        result = rw_mod.reconcile_batch(str(raw_path), "testbatch1")
        self.assertEqual(len(result.accepted_resonances), 0)
        self.assertTrue(any("RESONANCE_DOMAINS_BRIDGED_INVALID" in f for f in result.rejected_proposals[0]["failures"]))

    def test_rejection_cdlm_unresolved(self):
        proposal = _fixture_proposal(cdlm_cells=["CDLM.career.badomain"])
        raw_path = self._write_raw([proposal])
        result = rw_mod.reconcile_batch(str(raw_path), "testbatch1")
        self.assertEqual(len(result.accepted_resonances), 0)
        self.assertTrue(any("RESONANCE_CDLM_UNRESOLVED" in f for f in result.rejected_proposals[0]["failures"]))

    def test_rejection_p7_high_significance_few_alternatives(self):
        proposal = _fixture_proposal(significance=0.80, alternatives=["Only one."])
        raw_path = self._write_raw([proposal])
        result = rw_mod.reconcile_batch(str(raw_path), "testbatch1")
        self.assertEqual(len(result.accepted_resonances), 0)
        self.assertTrue(
            any("P7" in f or "interpretation" in f.lower() for f in result.rejected_proposals[0]["failures"]),
            result.rejected_proposals[0]["failures"],
        )

    def test_anomaly_fires_on_100_percent_acceptance(self):
        proposals = [_fixture_proposal() for _ in range(4)]
        raw_path = self._write_raw(proposals)
        result = rw_mod.reconcile_batch(str(raw_path), "testbatch1")
        self.assertTrue(result.anomaly_fired)
        self.assertIn("ACCEPTANCE_RATE_ANOMALY", result.anomaly_message)

    def test_no_anomaly_within_band(self):
        # 3 accepted, 2 rejected → 60% → within [0.15, 0.80]
        good = [_fixture_proposal() for _ in range(3)]
        bad = [_fixture_proposal(signals=["SIG.MSR.FAKE"]) for _ in range(2)]
        raw_path = self._write_raw(good + bad)
        result = rw_mod.reconcile_batch(str(raw_path), "testbatch1")
        self.assertFalse(result.anomaly_fired)


if __name__ == "__main__":
    unittest.main()
