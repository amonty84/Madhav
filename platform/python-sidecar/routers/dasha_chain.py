"""
MARSYS-JIS Sidecar — /dasha_chain endpoint (M2-A.3)

Given {native_id, date}, return the full 5-level Vimshottari dasha
active at that date: MD / AD / PD / SD / PD2.

Date range: 1900-01-01 through 2100-12-31.

Epoch derivation strategy (in priority order):
1. Query chart_facts dasha_vimshottari rows for MD boundaries (primary).
2. Extend backward/forward algorithmically using Vimshottari proportional
   subdivision from the known anchor.
"""
from __future__ import annotations

import os
from datetime import date, timedelta

import psycopg
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

VIMSHOTTARI: list[tuple[str, int]] = [
    ("Ketu",    7),
    ("Venus",   20),
    ("Sun",     6),
    ("Moon",    10),
    ("Mars",    7),
    ("Rahu",    18),
    ("Jupiter", 16),
    ("Saturn",  19),
    ("Mercury", 17),
]
TOTAL_YEARS = 120
DAYS_PER_YEAR = 365.25


class DashaChainRequest(BaseModel):
    native_id: str
    date: str  # ISO format: YYYY-MM-DD


class DashaLevel(BaseModel):
    lord: str
    start: str  # ISO date
    end: str    # ISO date


class DashaChainResponse(BaseModel):
    native_id: str
    query_date: str
    md: DashaLevel
    ad: DashaLevel
    pd: DashaLevel
    sd: DashaLevel
    pd2: DashaLevel


def _lord_years(lord: str) -> int:
    for name, yrs in VIMSHOTTARI:
        if name == lord:
            return yrs
    raise ValueError(f"Unknown dasha lord: {lord}")


def _sequence_from(lord: str) -> list[tuple[str, int]]:
    idx = next(i for i, (n, _) in enumerate(VIMSHOTTARI) if n == lord)
    return VIMSHOTTARI[idx:] + VIMSHOTTARI[:idx]


def _years_to_days(years: float) -> int:
    return int(years * DAYS_PER_YEAR)


def _build_ad_periods(md_start: date, md_lord: str, md_years: int) -> list[tuple[str, date, date]]:
    """Compute all AD periods within a MD using proportional subdivision."""
    seq = _sequence_from(md_lord)
    periods: list[tuple[str, date, date]] = []
    current = md_start
    for sub_lord, sub_lord_years in seq:
        ad_days = _years_to_days(md_years * sub_lord_years / TOTAL_YEARS)
        end = current + timedelta(days=ad_days)
        periods.append((sub_lord, current, end))
        current = end
    return periods


def _build_sub_periods(
    parent_start: date, parent_lord: str, parent_days: int, sub_lord_weight: int
) -> list[tuple[str, date, date]]:
    """Compute sub-period schedule (PD within AD, SD within PD, PD2 within SD)."""
    seq = _sequence_from(parent_lord)
    periods: list[tuple[str, date, date]] = []
    current = parent_start
    for sub_lord, sub_lord_years in seq:
        sub_days = int(parent_days * sub_lord_years / TOTAL_YEARS)
        end = current + timedelta(days=sub_days)
        periods.append((sub_lord, current, end))
        current = end
    return periods


def _find_active(
    query_date: date, periods: list[tuple[str, date, date]]
) -> tuple[str, date, date]:
    """Return the period active at query_date. Falls back to last period."""
    for lord, start, end in periods:
        if start <= query_date < end:
            return lord, start, end
    # query_date == end of last period (edge case)
    return periods[-1]


def _get_md_schedule(conn: psycopg.Connection) -> list[tuple[str, date, date]]:
    """
    Build full MD schedule from chart_facts dasha_vimshottari rows.
    Returns list of (md_lord, md_start, md_end) ordered by md_start.

    The DB rows cover from birth (1984-02-05) forward; we extend backward
    and forward algorithmically to cover 1900-01-01 through 2100-12-31.
    """
    rows = conn.execute(
        """
        SELECT
            value_json->>'md_lord'     AS md_lord,
            MIN((value_json->>'start_date')::date) AS md_start,
            MAX((value_json->>'end_date')::date)   AS md_end
        FROM chart_facts
        WHERE category = 'dasha_vimshottari' AND is_stale = false
        GROUP BY value_json->>'md_lord'
        ORDER BY MIN((value_json->>'start_date')::date)
        """
    ).fetchall()

    if not rows:
        raise RuntimeError(
            "No dasha_vimshottari rows in chart_facts. Run chart_facts ETL first."
        )

    # DB-derived schedule (may start at birth, not actual MD start)
    db_schedule: list[tuple[str, date, date]] = [(r[0], r[1], r[2]) for r in rows]

    # The first DB row's md_start is birth date (1984-02-05), but the first MD
    # (Jupiter) actually started before birth. Derive the real start:
    # Jupiter MD total = 16 years; balance at birth = first MD's end - birth date.
    first_lord, first_db_start, first_md_end = db_schedule[0]
    first_years = _lord_years(first_lord)
    actual_first_start = first_md_end - timedelta(days=_years_to_days(first_years))

    # Build the full ordered schedule, replacing the first entry with corrected start
    schedule: list[tuple[str, date, date]] = [
        (first_lord, actual_first_start, first_md_end)
    ] + db_schedule[1:]

    # Extend backward from actual_first_start to cover 1900-01-01
    target_past = date(1900, 1, 1)
    seq_rev = list(reversed(_sequence_from(first_lord)))  # planets before first_lord
    # seq_rev[0] is the planet immediately before first_lord
    current_start = actual_first_start
    for lord, lord_years in seq_rev:
        if lord == first_lord:
            continue
        period_days = _years_to_days(lord_years)
        period_start = current_start - timedelta(days=period_days)
        schedule.insert(0, (lord, period_start, current_start))
        current_start = period_start
        if current_start <= target_past:
            break

    # Extend forward from last DB MD to cover 2100-12-31
    target_future = date(2100, 12, 31)
    last_lord, _, last_end = schedule[-1]
    seq_fwd = _sequence_from(last_lord)
    current = last_end
    # Skip to the lord AFTER last_lord in the sequence
    after_last = seq_fwd[1:]  # next lords after last_lord
    for lord, lord_years in after_last:
        period_days = _years_to_days(lord_years)
        end = current + timedelta(days=period_days)
        schedule.append((lord, current, end))
        current = end
        if current >= target_future:
            break

    return sorted(schedule, key=lambda x: x[1])


def _get_ad_from_db(
    conn: psycopg.Connection, query_date: date
) -> tuple[str, date, date] | None:
    """Look up the active MD/AD from DB for query_date. Returns None if not covered."""
    row = conn.execute(
        """
        SELECT
            value_json->>'ad_lord'              AS ad_lord,
            (value_json->>'start_date')::date   AS start_date,
            (value_json->>'end_date')::date     AS end_date
        FROM chart_facts
        WHERE category = 'dasha_vimshottari' AND is_stale = false
          AND (value_json->>'start_date')::date <= %s
          AND (value_json->>'end_date')::date   >  %s
        LIMIT 1
        """,
        (query_date, query_date),
    ).fetchone()
    if row:
        return row[0], row[1], row[2]
    return None


@router.post("/dasha_chain", response_model=DashaChainResponse)
async def dasha_chain(request: DashaChainRequest) -> DashaChainResponse:
    """Return the full 5-level Vimshottari dasha active at request.date."""
    try:
        query_date = date.fromisoformat(request.date)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {request.date!r}")

    if not (date(1900, 1, 1) <= query_date <= date(2100, 12, 31)):
        raise HTTPException(
            status_code=400,
            detail="Date must be between 1900-01-01 and 2100-12-31",
        )

    db_url = os.environ.get("DATABASE_URL", "")
    if not db_url:
        raise HTTPException(status_code=503, detail="DATABASE_URL not configured")

    try:
        with psycopg.connect(db_url) as conn:
            md_schedule = _get_md_schedule(conn)
            ad_from_db = _get_ad_from_db(conn, query_date)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))

    # Find active MD
    md_lord, md_start, md_end = _find_active(query_date, md_schedule)
    md_years = _lord_years(md_lord)
    md_days = (md_end - md_start).days

    # Find active AD — prefer DB data (authoritative dates), fall back to computation
    if ad_from_db:
        ad_lord, ad_start, ad_end = ad_from_db
    else:
        ad_periods = _build_ad_periods(md_start, md_lord, md_years)
        ad_lord, ad_start, ad_end = _find_active(query_date, ad_periods)

    ad_days = (ad_end - ad_start).days

    # PD within AD
    pd_periods = _build_sub_periods(ad_start, ad_lord, ad_days, _lord_years(ad_lord))
    pd_lord, pd_start, pd_end = _find_active(query_date, pd_periods)
    pd_days = (pd_end - pd_start).days

    # SD within PD
    sd_periods = _build_sub_periods(pd_start, pd_lord, pd_days, _lord_years(pd_lord))
    sd_lord, sd_start, sd_end = _find_active(query_date, sd_periods)
    sd_days = (sd_end - sd_start).days

    # PD2 within SD
    pd2_periods = _build_sub_periods(sd_start, sd_lord, sd_days, _lord_years(sd_lord))
    pd2_lord, pd2_start, pd2_end = _find_active(query_date, pd2_periods)

    return DashaChainResponse(
        native_id=request.native_id,
        query_date=request.date,
        md=DashaLevel(lord=md_lord, start=md_start.isoformat(), end=md_end.isoformat()),
        ad=DashaLevel(lord=ad_lord, start=ad_start.isoformat(), end=ad_end.isoformat()),
        pd=DashaLevel(lord=pd_lord, start=pd_start.isoformat(), end=pd_end.isoformat()),
        sd=DashaLevel(lord=sd_lord, start=sd_start.isoformat(), end=sd_end.isoformat()),
        pd2=DashaLevel(lord=pd2_lord, start=pd2_start.isoformat(), end=pd2_end.isoformat()),
    )
