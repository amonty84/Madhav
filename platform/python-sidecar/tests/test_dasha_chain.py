"""
Tests for /dasha_chain endpoint (M2-A.3).

These tests exercise the core computation logic independently of the live DB
by patching _get_md_schedule and _get_ad_from_db, then run integration-style
assertions against the live DB when DATABASE_URL is available.

Known facts (from chart_facts dasha_vimshottari):
  - Jupiter MD: ~1975-08 to 1991-08-21
  - Saturn MD:  1991-08-21 to 2010-08-21
  - Mercury MD: 2010-08-21 to 2027-08-21
  - Ketu MD:    2027-08-21 to 2034-08-21
  - Venus MD:   2034-08-21 onwards
"""
from __future__ import annotations

import os
from datetime import date, timedelta
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from main import app
from routers.dasha_chain import (
    VIMSHOTTARI,
    _build_ad_periods,
    _find_active,
    _lord_years,
    _sequence_from,
)

client = TestClient(app)

API_KEY = os.environ.get("PYTHON_SIDECAR_API_KEY", "local-dev")
HEADERS = {"x-api-key": API_KEY}
NATIVE_ID = "abhisek_mohanty"
DB_URL = os.environ.get("DATABASE_URL", "")


# ── Unit tests for pure-computation helpers ────────────────────────────────

def test_lord_years_all_planets():
    assert _lord_years("Ketu") == 7
    assert _lord_years("Venus") == 20
    assert _lord_years("Mercury") == 17
    assert _lord_years("Saturn") == 19
    assert _lord_years("Jupiter") == 16


def test_sequence_from_mercury():
    seq = _sequence_from("Mercury")
    assert seq[0] == ("Mercury", 17)
    assert seq[1] == ("Ketu", 7)
    assert len(seq) == 9


def test_build_ad_periods_sums_to_md_duration():
    """AD periods within a Mercury MD should sum to Mercury's 17-year span."""
    md_start = date(2010, 8, 21)
    periods = _build_ad_periods(md_start, "Mercury", 17)
    assert len(periods) == 9
    total_days = sum((end - start).days for _, start, end in periods)
    expected_days = int(17 * 365.25)
    assert abs(total_days - expected_days) <= 10  # allow up to ~1 day rounding per sub-period


def test_find_active_returns_correct_period():
    periods = [
        ("Ketu",    date(2027, 8, 21), date(2028, 1, 18)),
        ("Venus",   date(2028, 1, 18), date(2029, 3, 18)),
        ("Sun",     date(2029, 3, 18), date(2029, 7, 24)),
    ]
    lord, start, end = _find_active(date(2028, 6, 1), periods)
    assert lord == "Venus"
    assert start == date(2028, 1, 18)


# ── Integration tests against live DB (skip if DB unavailable) ─────────────

@pytest.mark.skipif(not DB_URL, reason="DATABASE_URL not set")
def test_dasha_chain_mercury_md_2025():
    """AC.3: date 2025-06-15 → Mercury MD."""
    resp = client.post(
        "/dasha_chain",
        json={"native_id": NATIVE_ID, "date": "2025-06-15"},
        headers=HEADERS,
    )
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["md"]["lord"] == "Mercury"
    assert body["ad"]["lord"] in {n for n, _ in VIMSHOTTARI}
    assert body["pd"]["lord"] in {n for n, _ in VIMSHOTTARI}
    assert body["sd"]["lord"] in {n for n, _ in VIMSHOTTARI}
    assert body["pd2"]["lord"] in {n for n, _ in VIMSHOTTARI}
    # start ≤ query_date < end for md
    assert body["md"]["start"] <= "2025-06-15" < body["md"]["end"]


@pytest.mark.skipif(not DB_URL, reason="DATABASE_URL not set")
def test_dasha_chain_ketu_md_2028():
    """AC.4: date 2028-01-01 → Ketu MD (next MD after Mercury, starts 2027-08-21)."""
    resp = client.post(
        "/dasha_chain",
        json={"native_id": NATIVE_ID, "date": "2028-01-01"},
        headers=HEADERS,
    )
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body["md"]["lord"] == "Ketu"
    assert body["md"]["start"] <= "2028-01-01" < body["md"]["end"]


@pytest.mark.skipif(not DB_URL, reason="DATABASE_URL not set")
def test_dasha_chain_birth_date():
    """AC.5: date 1984-02-05 (birth date) → valid 5-level chain, no crash."""
    resp = client.post(
        "/dasha_chain",
        json={"native_id": NATIVE_ID, "date": "1984-02-05"},
        headers=HEADERS,
    )
    assert resp.status_code == 200, resp.text
    body = resp.json()
    # All 5 levels must be present with valid lords
    valid_lords = {n for n, _ in VIMSHOTTARI}
    for level in ("md", "ad", "pd", "sd", "pd2"):
        assert body[level]["lord"] in valid_lords, f"{level} lord invalid: {body[level]['lord']}"
    # MD at birth should be Jupiter (Purva Bhadrapada, Jupiter-ruled — authoritative per chart_facts)
    assert body["md"]["lord"] == "Jupiter"


def test_dasha_chain_invalid_date():
    """AC.6: invalid date format → 400."""
    resp = client.post(
        "/dasha_chain",
        json={"native_id": NATIVE_ID, "date": "not-a-date"},
        headers=HEADERS,
    )
    assert resp.status_code == 400


def test_dasha_chain_out_of_range_date():
    """AC.6: date outside 1900-2100 → 400."""
    resp = client.post(
        "/dasha_chain",
        json={"native_id": NATIVE_ID, "date": "2150-01-01"},
        headers=HEADERS,
    )
    assert resp.status_code == 400
