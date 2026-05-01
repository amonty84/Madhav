"""
Unit tests for pipeline.chunkers.forensic_chunker.
KARN-W2-R2-CHART-FACTS-ETL — AC.12 requirement.

Tests verify_coverage logic and section targeting without touching
the real DB (mocked where necessary).
"""
from __future__ import annotations

import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

_SIDECAR = Path(__file__).resolve().parents[3]
if str(_SIDECAR) not in sys.path:
    sys.path.insert(0, str(_SIDECAR))

from pipeline.chunkers.forensic_chunker import TARGET_SECTIONS, verify_coverage


class TestTargetSections:
    def test_all_target_sections_present(self):
        expected = {"§6", "§7", "§8", "§9", "§11", "§13", "§16", "§17", "§18", "§20", "§22", "§24"}
        assert expected.issubset(set(TARGET_SECTIONS))

    def test_target_sections_count(self):
        assert len(TARGET_SECTIONS) == 12

    def test_no_skipped_sections_included(self):
        # §19 Kota Chakra and §25 Additional Dashas are explicitly skipped
        assert "§19" not in TARGET_SECTIONS
        assert "§25" not in TARGET_SECTIONS


class TestVerifyCoverage:
    def _make_mock_conn(self, rows: list[tuple]) -> MagicMock:
        """Return a mock psycopg connection that yields given rows."""
        mock_cursor = MagicMock()
        mock_cursor.fetchall.return_value = rows
        mock_conn = MagicMock()
        mock_conn.execute.return_value = mock_cursor
        mock_conn.__enter__ = lambda s: s
        mock_conn.__exit__ = MagicMock(return_value=False)
        return mock_conn

    @patch("pipeline.chunkers.forensic_chunker.os.environ.get", return_value="postgresql://test")
    @patch("pipeline.chunkers.forensic_chunker.psycopg")
    def test_all_covered_when_all_sections_present(self, mock_psycopg, mock_env):
        # Simulate DB returning one chunk per target section
        mock_rows = [(sec + ".1", 1) for sec in TARGET_SECTIONS]
        mock_psycopg.connect.return_value = self._make_mock_conn(mock_rows)

        result = verify_coverage()
        assert len(result["missing"]) == 0
        assert len(result["covered"]) == len(TARGET_SECTIONS)

    @patch("pipeline.chunkers.forensic_chunker.os.environ.get", return_value="postgresql://test")
    @patch("pipeline.chunkers.forensic_chunker.psycopg")
    def test_missing_sections_reported(self, mock_psycopg, mock_env):
        # Only §6 present
        mock_rows = [("§6.1", 3)]
        mock_psycopg.connect.return_value = self._make_mock_conn(mock_rows)

        result = verify_coverage()
        assert "§6" in result["covered"]
        assert "§7" in result["missing"]
        assert "§24" in result["missing"]

    @patch("pipeline.chunkers.forensic_chunker.os.environ.get", return_value="postgresql://test")
    @patch("pipeline.chunkers.forensic_chunker.psycopg")
    def test_total_chunk_count_aggregated(self, mock_psycopg, mock_env):
        mock_rows = [("§6.1", 5), ("§7.1", 3), ("§8", 1)]
        mock_psycopg.connect.return_value = self._make_mock_conn(mock_rows)

        result = verify_coverage()
        assert result["total_l1_chunks"] == 9

    @patch("pipeline.chunkers.forensic_chunker.os.environ.get", return_value="")
    def test_missing_database_url_raises(self, mock_env):
        with pytest.raises(RuntimeError, match="DATABASE_URL"):
            verify_coverage()
