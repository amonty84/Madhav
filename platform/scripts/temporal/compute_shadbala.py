"""
Shadbala (six-fold strength) computation engine — v1.

M3-W3-C3 deliverable. Computes 4 of 6 Shadbala components deterministically
from pyswisseph + Lahiri sidereal; marks 2 components as
[EXTERNAL_COMPUTATION_REQUIRED] per CLAUDE.md §I B.10.

Computed components:
  (a) Uccha Bala       — exaltation/debilitation strength
  (b) Dig Bala         — directional strength (Placidus angles)
  (c) Naisargika Bala  — natural/fixed strength (constant per planet, brief D1.c)
  (d) Kala Bala (Nathonnatha sub-component only) — day/night strength via Sun altitude

External-computation-required components (marked, not invented):
  (e) Sthana Bala — full positional strength (Saptavargaja + Ojayugmarasyamsa
                    + Kendra + Drekkana + Uccha across vargas). Requires JH
                    Saptavargaja Bala export per ED.1.
  (f) Drik Bala  — full aspectual strength with partial-aspect Jyotish rules
                    and sign-based exceptions. Requires JH aspect-strength
                    table export per ED.1.

partial_total = uccha + dig + naisargika + nathonnatha (excludes Sthana + Drik).
Each row carries `needs_verification: true` and `ecr_components: ['sthana', 'drik']`.

Per PROJECT_ARCHITECTURE §B.1 (Facts/Interpretation separation): outputs of
this script are L1.5 (computed from L1 chart inputs via Swiss Ephemeris); they
are not L2.5 interpretations.

Run direct (defaults to native chart):
    python3 platform/scripts/temporal/compute_shadbala.py

Run with explicit args:
    python3 platform/scripts/temporal/compute_shadbala.py \\
        --chart-id abhisek_mohanty_primary \\
        --birth 1984-02-05T10:43:00+05:30 \\
        --query-date 2026-05-01 \\
        --birth-lat 20.2961 --birth-lon 85.8245 \\
        --output 05_TEMPORAL_ENGINES/shadbala/SHADBALA_RAW_v1_0.json

Outputs:
    JSON envelope { schema_version, computed_at, chart_id, ayanamsha,
                    computed_by, diagnostics, row_counts, rows }
    Each row: chart_id, planet, query_date, query_context, uccha_bala,
              dig_bala, naisargika_bala, nathonnatha_bala, partial_total,
              sthana_ecr (true), drik_ecr (true), ecr_components,
              needs_verification (true), computed_by, ayanamsha.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from dataclasses import asdict, dataclass, field
from datetime import datetime, date, time, timedelta, timezone
from pathlib import Path
from typing import Iterable

try:
    import swisseph as swe
except ImportError:
    print(
        "[EXTERNAL_COMPUTATION_REQUIRED]: pyswisseph not installed. "
        "Install with `pip install pyswisseph` and re-run.",
        file=sys.stderr,
    )
    sys.exit(2)


# ----------------------------------------------------------------------------
# Constants
# ----------------------------------------------------------------------------

# Vimshottari planet keys (Sun..Saturn — no nodes for Shadbala).
PLANETS = ("Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn")

PLANET_BODY = {
    "Sun": swe.SUN, "Moon": swe.MOON, "Mars": swe.MARS,
    "Mercury": swe.MERCURY, "Jupiter": swe.JUPITER, "Venus": swe.VENUS,
    "Saturn": swe.SATURN,
}

# Sidereal exaltation longitudes (Lahiri convention).
# Tropical and sidereal exaltation degrees agree by convention (the rashi
# system itself is sidereal in Jyotish).
# Format: sign_index (0=Aries..11=Pisces) * 30 + degree-within-sign.
EXALTATION_LON = {
    "Sun":     0 * 30 + 10,    # 10° Aries
    "Moon":    1 * 30 + 3,     #  3° Taurus
    "Mars":    9 * 30 + 28,    # 28° Capricorn
    "Mercury": 5 * 30 + 15,    # 15° Virgo
    "Jupiter": 3 * 30 + 5,     #  5° Cancer
    "Venus":   11 * 30 + 27,   # 27° Pisces
    "Saturn":  6 * 30 + 20,    # 20° Libra
}

# Dig Bala "point" per planet (Placidus angle).
# Sun, Mars  → MC  (10H cusp)
# Moon, Venus → IC  ( 4H cusp)
# Mercury, Jupiter → Asc ( 1H cusp)
# Saturn → Dsc ( 7H cusp)
DIG_POINT = {
    "Sun": "MC", "Mars": "MC",
    "Moon": "IC", "Venus": "IC",
    "Mercury": "Asc", "Jupiter": "Asc",
    "Saturn": "Dsc",
}

# Naisargika Bala (rupas) per session brief D1.c.
#   Saturn=60, Mars=30, Mercury=25, Jupiter=20, Venus=15, Moon=10, Sun=7.5
# NOTE: brief-stipulated values diverge from classical Phaladeepika
# (Sun=60.00, Moon=51.42, Mars=17.16, Mercury=25.74, Jupiter=34.26,
# Venus=42.84, Saturn=8.58 — see FORENSIC §6.1 SBL.NAISARG.TOTAL).
# Divergence is documented in CROSSCHECK_v1_0.md; brief is the governing
# scope for this engine v1.
NAISARGIKA_BALA = {
    "Saturn": 60.0, "Mars": 30.0, "Mercury": 25.0,
    "Jupiter": 20.0, "Venus": 15.0, "Moon": 10.0, "Sun": 7.5,
}

# Diurnal/nocturnal classification for Nathonnatha.
DIURNAL = {"Sun", "Jupiter", "Saturn"}
NOCTURNAL = {"Moon", "Venus", "Mars"}
# Mercury → always 60 per brief D1.d.

ECR_COMPONENTS = ["sthana", "drik"]
ECR_SPEC = {
    "sthana": (
        "Requires Jagannatha Hora Saptavargaja Bala export per ED.1 "
        "(full Sapta-Varga uchcha + ojayugmarasyamsa across D1+D2+D3+D4+D7+D9+D12)."
    ),
    "drik": (
        "Requires full aspect-strength table from JH or shri_jyoti_star "
        "per ED.1 (Jyotish 1/4, 1/2, 3/4 partial aspects + sign-based "
        "exceptions, planetary aspects on planets and bhavas)."
    ),
}

# ----------------------------------------------------------------------------
# Dataclass row
# ----------------------------------------------------------------------------

@dataclass
class ShadbalaRow:
    chart_id: str
    planet: str
    query_date: str          # 'YYYY-MM-DD'
    query_context: str       # 'natal' | 'current' | 'MD_start_<lord>' | 'MD_end_<lord>'
    uccha_bala: float
    dig_bala: float
    naisargika_bala: float
    nathonnatha_bala: float
    partial_total: float
    sthana_ecr: bool = True
    drik_ecr: bool = True
    ecr_components: list = field(default_factory=lambda: list(ECR_COMPONENTS))
    needs_verification: bool = True
    computed_by: str = "pyswisseph"
    ayanamsha: str = "lahiri"


# ----------------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------------

def parse_iso8601(s: str) -> datetime:
    if s.endswith("Z"):
        s = s[:-1] + "+00:00"
    return datetime.fromisoformat(s)


def angular_distance(a: float, b: float) -> float:
    """Shortest angular distance between two longitudes (degrees, 0..180)."""
    d = abs((a - b) % 360.0)
    return min(d, 360.0 - d)


def to_jd_ut(dt_utc: datetime) -> float:
    """Convert a timezone-aware UTC datetime to Julian Day (UT)."""
    if dt_utc.tzinfo is None:
        raise ValueError("dt_utc must be timezone-aware UTC")
    if dt_utc.utcoffset() != timedelta(0):
        dt_utc = dt_utc.astimezone(timezone.utc)
    return swe.julday(
        dt_utc.year, dt_utc.month, dt_utc.day,
        dt_utc.hour + dt_utc.minute / 60.0 + dt_utc.second / 3600.0,
    )


def setup_sidereal():
    swe.set_sid_mode(swe.SIDM_LAHIRI)


# ----------------------------------------------------------------------------
# Component computations
# ----------------------------------------------------------------------------

def compute_sidereal_longitude(jd_ut: float, body: int) -> float:
    setup_sidereal()
    flags = swe.FLG_MOSEPH | swe.FLG_SIDEREAL
    pos, _ = swe.calc_ut(jd_ut, body, flags)
    return pos[0] % 360.0


def compute_angles(jd_ut: float, lat: float, lon: float) -> dict:
    """Return Placidus Asc / MC and derived Dsc / IC (sidereal Lahiri)."""
    setup_sidereal()
    cusps, ascmc = swe.houses_ex(jd_ut, lat, lon, b'P', swe.FLG_SIDEREAL)
    asc = ascmc[0] % 360.0
    mc = ascmc[1] % 360.0
    return {
        "Asc": asc,
        "MC": mc,
        "Dsc": (asc + 180.0) % 360.0,
        "IC": (mc + 180.0) % 360.0,
    }


def compute_sun_altitude(jd_ut: float, lat: float, lon: float) -> float:
    """Sun's apparent altitude (degrees) above horizon at (lat, lon, jd_ut)."""
    setup_sidereal()
    # Use tropical equatorial coordinates for azalt conversion.
    flags = swe.FLG_MOSEPH | swe.FLG_EQUATORIAL
    sun_pos, _ = swe.calc_ut(jd_ut, swe.SUN, flags)
    ra = sun_pos[0]
    dec = sun_pos[1]
    dist = sun_pos[2]
    # geopos: (longitude_east_positive, latitude_north_positive, altitude_meters)
    geopos = (lon, lat, 0.0)
    azalt = swe.azalt(jd_ut, swe.EQU2HOR, geopos, 1010.0, 10.0, [ra, dec, dist])
    # azalt = (azimuth, true_altitude, apparent_altitude)
    return azalt[1]


def uccha_bala(planet: str, sid_lon: float) -> float:
    exalt = EXALTATION_LON[planet]
    angle = angular_distance(sid_lon, exalt)
    # Full at exaltation (angle=0) → 60; zero at debilitation (angle=180) → 0; linear.
    return 60.0 * (180.0 - angle) / 180.0


def dig_bala(planet: str, sid_lon: float, angles: dict) -> float:
    point = angles[DIG_POINT[planet]]
    angle = angular_distance(sid_lon, point)
    # Full at the Dig Bala point (angle=0) → 60; zero at the opposite point
    # (angle=180) → 0; linear.
    return 60.0 * (180.0 - angle) / 180.0


def nathonnatha_bala(planet: str, jd_ut: float, lat: float, lon: float) -> float:
    """
    Day/night strength via Sun altitude on the query date.
    Diurnal planets (Sun, Jupiter, Saturn) get 60 at solar noon, 0 at solar
    midnight; nocturnal planets (Moon, Venus, Mars) inverse; Mercury constant 60.
    Anchor points (alt_max, alt_min) computed by sampling 25 points across
    the 24h window [jd_ut-12h, jd_ut+12h] at 1h resolution.
    """
    if planet == "Mercury":
        return 60.0
    samples = [
        compute_sun_altitude(jd_ut + dh / 24.0, lat, lon)
        for dh in range(-12, 13)
    ]
    alt_now = compute_sun_altitude(jd_ut, lat, lon)
    alt_max = max(samples + [alt_now])
    alt_min = min(samples + [alt_now])
    if alt_max - alt_min < 1e-9:
        diurnal_factor = 0.5
    else:
        diurnal_factor = (alt_now - alt_min) / (alt_max - alt_min)
    diurnal_factor = max(0.0, min(1.0, diurnal_factor))
    if planet in DIURNAL:
        return 60.0 * diurnal_factor
    if planet in NOCTURNAL:
        return 60.0 * (1.0 - diurnal_factor)
    raise ValueError(f"Unknown nathonnatha class for planet {planet!r}")


# ----------------------------------------------------------------------------
# Per-snapshot computation
# ----------------------------------------------------------------------------

def compute_snapshot(
    *,
    chart_id: str,
    query_dt: datetime,
    query_context: str,
    birth_lat: float,
    birth_lon: float,
) -> list[ShadbalaRow]:
    """
    Compute one Shadbala snapshot (7 rows, one per Sun..Saturn) for a single
    query datetime at the native's birth location.
    """
    if query_dt.tzinfo is None:
        raise ValueError("query_dt must be timezone-aware")
    utc_dt = query_dt.astimezone(timezone.utc)
    jd_ut = to_jd_ut(utc_dt)
    angles = compute_angles(jd_ut, birth_lat, birth_lon)
    rows: list[ShadbalaRow] = []
    for planet in PLANETS:
        body = PLANET_BODY[planet]
        sid_lon = compute_sidereal_longitude(jd_ut, body)
        u = uccha_bala(planet, sid_lon)
        d = dig_bala(planet, sid_lon, angles)
        n = NAISARGIKA_BALA[planet]
        nat = nathonnatha_bala(planet, jd_ut, birth_lat, birth_lon)
        partial = u + d + n + nat
        rows.append(ShadbalaRow(
            chart_id=chart_id,
            planet=planet,
            query_date=query_dt.date().isoformat(),
            query_context=query_context,
            uccha_bala=round(u, 4),
            dig_bala=round(d, 4),
            naisargika_bala=round(n, 4),
            nathonnatha_bala=round(nat, 4),
            partial_total=round(partial, 4),
        ))
    return rows


# ----------------------------------------------------------------------------
# Driver — multi-snapshot run from VIMSHOTTARI MD boundaries + today + natal
# ----------------------------------------------------------------------------

def load_md_boundaries(vimshottari_path: Path) -> list[tuple[date, str]]:
    """
    Return list of (boundary_date, context) for the M-level rows in the
    Vimshottari raw JSON. Each MD start_date and the final MD end_date is
    a boundary point; context names the lord at the boundary.
    """
    payload = json.loads(vimshottari_path.read_text(encoding="utf-8"))
    md_rows = [r for r in payload["rows"] if r["dasha_level"] == "M"]
    boundaries: list[tuple[date, str]] = []
    for r in md_rows:
        boundaries.append((
            date.fromisoformat(r["start_date"]),
            f"MD_start_{r['planet']}",
        ))
    if md_rows:
        last = md_rows[-1]
        boundaries.append((
            date.fromisoformat(last["end_date"]),
            f"MD_end_{last['planet']}",
        ))
    # Deduplicate while preserving order.
    seen = set()
    out: list[tuple[date, str]] = []
    for d_, ctx in boundaries:
        if d_ in seen:
            continue
        seen.add(d_)
        out.append((d_, ctx))
    return out


def run(
    *,
    chart_id: str,
    birth_iso: str,
    birth_lat: float,
    birth_lon: float,
    vimshottari_path: Path,
    additional_dates: Iterable[tuple[date, str]] = (),
) -> dict:
    """
    Full Shadbala computation envelope: 7 MD start_dates + final MD end_date
    + natal + today (or any additional_dates passed in). Time-of-day for
    every query is held at the native's birth time-of-day per cross-check
    convention (so the natal date snapshot serves as the FORENSIC §6.1 anchor).
    """
    birth_dt = parse_iso8601(birth_iso)
    birth_tz = birth_dt.tzinfo
    boundaries = load_md_boundaries(vimshottari_path)
    # Add additional_dates (dedup with boundaries by date).
    boundary_dates = {d_ for d_, _ in boundaries}
    extra: list[tuple[date, str]] = []
    for d_, ctx in additional_dates:
        if d_ not in boundary_dates:
            extra.append((d_, ctx))
            boundary_dates.add(d_)
    all_snapshots = boundaries + extra
    # Order: chronological.
    all_snapshots.sort(key=lambda x: x[0])

    rows: list[ShadbalaRow] = []
    diagnostics: list[dict] = []
    for query_d, ctx in all_snapshots:
        # Compose query_dt = query_d + birth_dt time-of-day, in birth tz.
        query_dt = datetime.combine(query_d, birth_dt.time(), tzinfo=birth_tz)
        snapshot = compute_snapshot(
            chart_id=chart_id,
            query_dt=query_dt,
            query_context=ctx,
            birth_lat=birth_lat,
            birth_lon=birth_lon,
        )
        rows.extend(snapshot)
        diagnostics.append({
            "query_date": query_d.isoformat(),
            "query_context": ctx,
            "query_dt_iso": query_dt.isoformat(),
        })

    envelope = {
        "schema_version": "1.0",
        "computed_at": datetime.now(timezone.utc).isoformat(),
        "chart_id": chart_id,
        "ayanamsha": "lahiri",
        "computed_by": f"pyswisseph {swe.version}",
        "ephe_mode": "moshier",
        "diagnostics": {
            "snapshot_count": len(diagnostics),
            "snapshots": diagnostics,
            "ecr_components": ECR_COMPONENTS,
            "ecr_specs": ECR_SPEC,
            "naisargika_source": (
                "session brief M3-W3-C3 §DELIVERABLES D1.c — Saturn=60..Sun=7.5 rupas; "
                "diverges from classical FORENSIC §6.1 SBL.NAISARG.TOTAL "
                "(Sun=60..Saturn=8.58); divergence documented in CROSSCHECK_v1_0.md"
            ),
            "time_of_day_convention": (
                "every query datetime uses the native's birth time-of-day "
                "(local birth tz) — natal snapshot anchored to FORENSIC §6.1 cross-check"
            ),
        },
        "row_counts": {
            "total_rows": len(rows),
            "snapshot_count": len(diagnostics),
            "planets_per_snapshot": len(PLANETS),
        },
        "rows": [asdict(r) for r in rows],
    }
    return envelope


# ----------------------------------------------------------------------------
# SQL INSERT emission
# ----------------------------------------------------------------------------

SQL_HEADER = """\
-- SHADBALA_INSERT_v1_0.sql
-- Generated by M3-W3-C3-SHADBALA on {generated_at}
-- Source: 05_TEMPORAL_ENGINES/shadbala/SHADBALA_RAW_v1_0.json
-- Computed by: {computed_by} ({ephe_mode} ephemeris, Lahiri sidereal)
-- Cross-check vs FORENSIC §6.1: see 05_TEMPORAL_ENGINES/shadbala/CROSSCHECK_v1_0.md
--
-- This file is self-contained: it carries CREATE TABLE IF NOT EXISTS plus
-- the INSERT block, gated on migration 031_shadbala.sql being applied to
-- the DB. Migration 031 is the canonical schema source; this file's
-- CREATE block mirrors that schema for offline applicability.
--
-- Apply order:
--   1. platform/migrations/031_shadbala.sql (creates table + indexes)
--   2. THIS FILE (data only — INSERTs are idempotent via ON CONFLICT DO NOTHING)
--
-- Sthana Bala (sthana_ecr=true) and Drik Bala (drik_ecr=true) are marked
-- [EXTERNAL_COMPUTATION_REQUIRED] per CLAUDE.md §I B.10. partial_total
-- excludes those two components and represents only the four
-- pyswisseph-computable components (uccha + dig + naisargika + nathonnatha).

BEGIN;

CREATE TABLE IF NOT EXISTS shadbala (
  id              UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  chart_id        TEXT      NOT NULL,
  planet          TEXT      NOT NULL,
  query_date      DATE      NOT NULL,
  query_context   TEXT,
  uccha_bala      NUMERIC,
  dig_bala        NUMERIC,
  naisargika_bala NUMERIC,
  nathonnatha_bala NUMERIC,
  partial_total   NUMERIC,
  sthana_ecr      BOOLEAN   NOT NULL DEFAULT true,
  drik_ecr        BOOLEAN   NOT NULL DEFAULT true,
  ecr_components  TEXT[],
  needs_verification BOOLEAN NOT NULL DEFAULT true,
  computed_by     TEXT      NOT NULL DEFAULT 'pyswisseph',
  ayanamsha       TEXT      NOT NULL DEFAULT 'lahiri',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (chart_id, planet, query_date, query_context)
);

CREATE INDEX IF NOT EXISTS idx_shadbala_chart_date
  ON shadbala(chart_id, query_date);
CREATE INDEX IF NOT EXISTS idx_shadbala_planet
  ON shadbala(chart_id, planet);

"""

SQL_FOOTER = "\nCOMMIT;\n"


def _sql_array(items: list[str]) -> str:
    inner = ",".join(f"'{x}'" for x in items)
    return f"ARRAY[{inner}]::TEXT[]"


def emit_sql(envelope: dict) -> str:
    parts = [SQL_HEADER.format(
        generated_at=envelope["computed_at"],
        computed_by=envelope["computed_by"],
        ephe_mode=envelope.get("ephe_mode", "moshier"),
    )]
    for r in envelope["rows"]:
        parts.append(
            "INSERT INTO shadbala "
            "(chart_id, planet, query_date, query_context, "
            "uccha_bala, dig_bala, naisargika_bala, nathonnatha_bala, "
            "partial_total, sthana_ecr, drik_ecr, ecr_components, "
            "needs_verification, computed_by, ayanamsha) VALUES ("
            f"'{r['chart_id']}', '{r['planet']}', '{r['query_date']}', "
            f"'{r['query_context']}', "
            f"{r['uccha_bala']}, {r['dig_bala']}, {r['naisargika_bala']}, "
            f"{r['nathonnatha_bala']}, {r['partial_total']}, "
            f"{'true' if r['sthana_ecr'] else 'false'}, "
            f"{'true' if r['drik_ecr'] else 'false'}, "
            f"{_sql_array(r['ecr_components'])}, "
            f"{'true' if r['needs_verification'] else 'false'}, "
            f"'{r['computed_by']}', '{r['ayanamsha']}') "
            "ON CONFLICT (chart_id, planet, query_date, query_context) DO NOTHING;"
        )
    parts.append(SQL_FOOTER)
    return "\n".join(parts)


# ----------------------------------------------------------------------------
# CLI
# ----------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[1] if __doc__ else "")
    parser.add_argument("--chart-id", default="abhisek_mohanty_primary")
    parser.add_argument("--birth", default="1984-02-05T10:43:00+05:30",
                        help="Native birth datetime ISO8601 (default: native)")
    parser.add_argument("--birth-lat", type=float, default=20.2961,
                        help="Birth latitude (default: Bhubaneswar)")
    parser.add_argument("--birth-lon", type=float, default=85.8245,
                        help="Birth longitude east positive (default: Bhubaneswar)")
    parser.add_argument("--vimshottari",
                        default=str(REPO_ROOT / "05_TEMPORAL_ENGINES" / "dasha"
                                    / "vimshottari" / "VIMSHOTTARI_RAW_v1_0.json"),
                        help="Path to VIMSHOTTARI_RAW_v1_0.json (MD boundaries)")
    parser.add_argument("--query-date", default="2026-05-01",
                        help="Additional query date (today/control); ISO YYYY-MM-DD")
    parser.add_argument("--output", required=False,
                        default=str(REPO_ROOT / "05_TEMPORAL_ENGINES" / "shadbala"
                                    / "SHADBALA_RAW_v1_0.json"))
    parser.add_argument("--sql-output", required=False,
                        default=str(REPO_ROOT / "05_TEMPORAL_ENGINES" / "shadbala"
                                    / "SHADBALA_INSERT_v1_0.sql"))
    args = parser.parse_args(argv)

    additional: list[tuple[date, str]] = []
    if args.query_date:
        additional.append((date.fromisoformat(args.query_date), "current"))

    envelope = run(
        chart_id=args.chart_id,
        birth_iso=args.birth,
        birth_lat=args.birth_lat,
        birth_lon=args.birth_lon,
        vimshottari_path=Path(args.vimshottari),
        additional_dates=additional,
    )

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(envelope, indent=2), encoding="utf-8")

    sql_path = Path(args.sql_output)
    sql_path.parent.mkdir(parents=True, exist_ok=True)
    sql_path.write_text(emit_sql(envelope), encoding="utf-8")

    print(f"Wrote {len(envelope['rows'])} rows over "
          f"{envelope['row_counts']['snapshot_count']} snapshots → {out_path}")
    print(f"Wrote SQL → {sql_path}")
    # Tag natal sanity-check anchor for quick visual confirmation.
    natal_rows = [
        r for r in envelope["rows"]
        if r["query_date"] == "1984-02-05"
    ]
    if natal_rows:
        print("\nNatal-date snapshot (1984-02-05) — Uccha Bala anchors vs FORENSIC §6.1:")
        ref = {"Saturn": 59.18, "Sun": 33.99, "Moon": 38.02, "Mars": 26.84,
               "Mercury": 24.72, "Jupiter": 8.40, "Venus": 27.39}
        for r in natal_rows:
            f = ref.get(r["planet"], None)
            delta = (r["uccha_bala"] - f) if f is not None else None
            print(f"  {r['planet']:8s} engine_uccha={r['uccha_bala']:7.2f}  "
                  f"FORENSIC={f}  Δ={delta:+.2f}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
