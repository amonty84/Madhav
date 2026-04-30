"""
Unit tests for pipeline.extractors.chart_facts_extractor.
KARN-W2-R2-CHART-FACTS-ETL — AC.12 requirement: ≥2 tests per new category.

Tests use minimal FORENSIC-like markdown fixtures (not the real file) to keep
tests fast and deterministic. Integration against real FORENSIC file is done
via the ingest pipeline (AC.8-AC.10).
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

# Ensure sidecar root is importable
_SIDECAR = Path(__file__).resolve().parents[3]
if str(_SIDECAR) not in sys.path:
    sys.path.insert(0, str(_SIDECAR))

from pipeline.extractors.chart_facts_extractor import (
    _parse_md_table,
    _extract_section,
    _extract_subsection,
    _find_tables,
    parse_section_6,
    parse_section_7,
    parse_section_8,
    parse_section_9,
    parse_section_11,
    parse_section_13,
    parse_section_16,
    parse_section_17,
    parse_section_18,
    parse_section_20,
    parse_section_22,
    parse_section_24,
    extract_all,
)

# ──────────────────────────────────────────────────────────
# Fixture helpers
# ──────────────────────────────────────────────────────────

def _wrap(section_heading: str, body: str) -> str:
    """Wrap body in a minimal FORENSIC-like H2 section."""
    return f"## {section_heading}\n\n{body}\n\n## §99 — NEXT SECTION\n"


SHADBALA_COMPONENT_FIXTURE = _wrap("§6 — STRENGTH METRICS (FACTS)", """
### §6.1 Shadbala — Component Breakdown

| ID | Component | Sun | Moon | Mars | Mercury | Jupiter | Venus | Saturn |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `SBL.STHANA.TOTAL` | Total Sthana Bala | 191.49 | 206.77 | 176.84 | 182.22 | 233.40 | 151.14 | 257.93 |
| `SBL.DIG.TOTAL` | Total Dig Bala | 53.67 | 18.02 | 35.18 | 26.15 | 19.14 | 4.60 | 56.65 |
| `SBL.KALA.TOTAL` | Total Kala Bala | 225.58 | 149.46 | 65.08 | 165.25 | 170.47 | 66.15 | 106.01 |

### §6.2 Shadbala — Totals and Ranking (DUAL-ENGINE)

| ID | Planet | FORENSIC Virupas | FORENSIC Rupas | FORENSIC Rank | JH Rupas | JH Rank | Min Required (Rupas) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `SBL.TOTAL.SUN` | Sun | 510.85 | 8.51 | 1 | 8.18 | 2 | 5.00 |
| `SBL.TOTAL.SATURN` | Saturn | 447.98 | 7.47 | 4 | 8.79 | 1 | 5.00 |

### §6.3 Uccha Bala Ranking (Exaltation Proximity Proxy)

| ID | Planet | Uccha Score (max 60) | Band |
| --- | --- | --- | --- |
| `SBL.UCHA.RANK.1` | Saturn | 59.18 | Max |
| `SBL.UCHA.RANK.2` | Moon | 38.02 | High |

### §6.5 Vimsopaka Bala (20-Point Varga Strength)

| ID | Rank | Planet | Score | Band |
| --- | --- | --- | --- | --- |
| `VIM.1` | 1 | Jupiter | 12.1 | Dominant |

### §6.6 Bhava Bala — JH Engine (NEW in v8.0)

| ID | House | Life Area | JH Rupas | JH Rank |
| --- | --- | --- | --- | --- |
| `BVB.JH.5` | 5 | Creativity / Children | 9.64 | 1 (strongest) |
| `BVB.JH.7` | 7 | Partners / Spouse / ATT | 4.73 | 12 (weakest) |

### §6.7 Ishta / Kashta Phala — JH Engine (NEW in v8.0)

| ID | Planet | Ishta Phala | Kashta Phala | Net Assessment |
| --- | --- | --- | --- | --- |
| `IKP.SATURN` | Saturn | 43.28 | 4.81 | ~9:1 beneficial |
| `IKP.JUPITER` | Jupiter | 10.78 | 48.81 | ~1:5 malefic |

### §6.8 Pancha-Vargeeya Classification — JH Engine (NEW in v8.0)

| ID | Planet | Score | Classification |
| --- | --- | --- | --- |
| `PVC.JUPITER` | Jupiter | 14.76 | POWERFUL |
| `PVC.SATURN` | Saturn | 12.12 | POWERFUL |
""")

BAV_FIXTURE = _wrap("§7 — ASHTAKAVARGA (FACTS + DERIVED)", """
### §7.1 BAV — Per-Planet Bindus by Sign

| ID | Planet | Ar | Ta | Ge | Cn | Le | Vi | Li | Sc | Sg | Cp | Aq | Pi | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `AVG.BAV.SUN` | Sun | 5 | 5 | 5 | 5 | 4 | 3 | 5 | 6 | 2 | 4 | 2 | 2 | 48 |
| `AVG.BAV.SATURN` | Saturn | 4 | 2 | 2 | 4 | 4 | 3 | 4 | 4 | 4 | 2 | 4 | 2 | 39 |

### §7.2 SAV — Sarvashtakavarga by Sign

| ID | Sign | House | SAV Total (FORENSIC) | JH Total |
| --- | --- | --- | --- | --- |
| `AVG.SAV.ARIES` | Aries | 1 | 29 | 29 |
| `AVG.SAV.LIBRA` | Libra | 7 | 33 | 34 |

### §7.3 Shuddha Pinda (Ashtakavarga Reductions)

| ID | Planet | Rasi Pinda | Graha Pinda | Shuddha Pinda | Rank |
| --- | --- | --- | --- | --- | --- |
| `AVG.SHP.MARS` | Mars | 136 | 62 | 198 | 1 |
| `AVG.SHP.SATURN` | Saturn | 44 | 36 | 80 | 7 |
""")

KAKSHYA_FIXTURE = _wrap("§8 — SATURN KAKSHYA ZONES (DERIVED)", """
| ID | Zone | Degree Range | Ruler | Status |
| --- | --- | --- | --- | --- |
| `KAK.PISCES.Z1` | 1 | 0°00′ – 3°45′ | Saturn | ACTIVE |
| `KAK.PISCES.Z2` | 2 | 3°45′ – 7°30′ | Jupiter | INACTIVE |
""")

AVASTHA_FIXTURE = _wrap("§9 — AVASTHA DIAGNOSTICS (DERIVED)", """
### §9.1 Jagratadi / Baladi / Deeptadi States

| ID | Planet | Role | Jagratadi | Baladi | Deeptadi |
| --- | --- | --- | --- | --- | --- |
| `AVS.MERCURY` | Mercury | Current Vimshottari MD Lord | Susupta | Mrat | Shant |
| `AVS.SATURN` | Saturn | Current Vimshottari AD Lord | Susupta | Vradha | Muditha |
""")

SENSITIVE_FIXTURE = _wrap("§11 — SENSITIVE POINTS (DERIVED)", """
### §11.1 Upagrahas

| ID | Upagraha | Type | Sign | Degree | Nakshatra |
| --- | --- | --- | --- | --- | --- |
| `UPG.GULIKA` | Gulika | Time-based | Gemini | 13°57′ | Ardra |
| `UPG.MANDI` | Mandi | Time-based | Cancer | 14°13′ | Pushya |

### §11.2 Bhrigu Bindu (Destiny Point)

| ID | Field | Value |
| --- | --- | --- |
| `BB.RESULT.SIGN` | Sign | Libra |
| `BB.RESULT.DEG` | Degree | 08°04′ |

### §11.3 Yogi / Avayogi

| ID | Field | Value |
| --- | --- | --- |
| `YOG.PLANET` | Yogi Planet | Mercury (ruler of Revati) |
| `AVY.PLANET` | Avayogi Planet | Mars (ruler of Mrigasira) |

### §11.4 Combustion and Planetary War

| ID | Check | Result |
| --- | --- | --- |
| `CMB.MERCURY` | Mercury vs Sun | Separation ≈ 21°07′. Not combust. |
| `WAR.CHECK` | Planetary War check | Mars and Saturn ≈ 3°56′ apart. No war. |

### §11.5 Hazards — Mrityu Bhaga

| ID | Planet | Sign | Degree | Mrityu Bhaga Degree | Differential | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `HAZ.SUN` | Sun | Capricorn | 21°57′ | 20° | 1°57′ | Safe |
| `HAZ.SATURN` | Saturn | Libra | 22°27′ | 4° | 18°27′ | Safe |
""")

ARUDHA_OCCUPANCY_FIXTURE = _wrap("§13 — ARUDHAS (DERIVED)", """
### §13.1 Arudha Placements

| ID | Arudha | Computed Sign | Computed House (from D1 Lagna) | D1 Tenants | Derivation |
| --- | --- | --- | --- | --- | --- |
| `ARD.AL` | Arudha Lagna (AL) | Capricorn | 10 | Sun, Mercury | -- |

### §13.2 Arudha Sign Occupancy

| ID | Sign | House (from D1 Lagna) | Markers / Planets Present |
| --- | --- | --- | --- |
| `ARO.ARIES` | Aries | 1 | A10 |
| `ARO.LIBRA` | Libra | 7 | Saturn, Mars |
""")

ASPECT_FIXTURE = _wrap("§16 — ASPECTS — GRAHA DRISHTI (FACTS)", """
### §16.1 Classical Vedic Aspects (Graha Drishti)

| ID | Planet | From Sign | Aspect Rays |
| --- | --- | --- | --- |
| `ASP.G.SUN` | Sun | Capricorn | 7th on Cancer |
| `ASP.G.SATURN` | Saturn | Libra | 3rd on Sagittarius; 7th on Aries; 10th on Cancer |
""")

CHALIT_FIXTURE = _wrap("§17 — CHALIT KINETIC SHIFTS (DERIVED)", """
| ID | Planet | Rashi House | Chalit House | Shift |
| --- | --- | --- | --- | --- |
| `CKS.SUN` | Sun | 10 | 11 | +1 (Career → Gains) |
| `CKS.MARS` | Mars | 7 | 7 | 0 |
""")

CHANDRA_FIXTURE = _wrap("§18 — CHANDRA CHART (FROM-MOON VIEW)", """
| ID | House from Moon | Sign | Planets |
| --- | --- | --- | --- |
| `CHN.1` | 1 (Self) | Aquarius | Moon |
| `CHN.9` | 9 (Luck) | Libra | Pluto, Mars, Saturn |
""")

DEITY_FIXTURE = _wrap("§20 — DEITY ASSIGNMENTS (DERIVED)", """
### §20.1 Deity Triad (Jaimini Derivation)

| ID | Role | D9 Sign | Ruling Planet | Deity |
| --- | --- | --- | --- | --- |
| `DEV.ISHTA` | Ishta Devata (12th from AK in D9) | Taurus | Venus | Mahalakshmi |
| `DEV.DHARMA` | Dharma Devata (9th from AK in D9) | Aquarius | Saturn | Lord Venkateswara |

### §20.2 Digpala and Divisional Deity Mapping

| ID | Scope | Assignments |
| --- | --- | --- |
| `DEV.D10.DIG` | D10 Digpala | Lagna → Varuna; Sun → Yama |

### §20.3 Planet → Deity Ledger

| ID | Body | D10 Digpala | D20 Deity | D24 Deity | D60 Label |
| --- | --- | --- | --- | --- | --- |
| `DEV.L.SUN` | Sun | Yama | Vimala | Maya | Amrita |
| `DEV.L.SATURN` | Saturn | Isana | Raudri | Mitra | Saumya |
""")

VARSHPHAL_FIXTURE = _wrap("§22 — VARSHPHAL 2026–2027 (FACTS)", """
| ID | Component | Value |
| --- | --- | --- |
| `VRS.VALIDITY` | Validity | 2026-02-05 to 2027-02-05 |
| `VRS.MUNTHA.SIGN` | Muntha | Libra (7th House) |
| `VRS.MUNTHA.LORD` | Muntha Lord | Venus |
""")

LONGEVITY_FIXTURE = _wrap("§24 — LONGEVITY INDICATORS (FACTS — NEW in v8.0)", """
### §24.1 Kalachakra Paramayush

| ID | Field | Value |
| --- | --- | --- |
| `LON.KALACHAKRA.PARAMAYUSH` | Paramayush | 85 years |
| `LON.KALACHAKRA.SCHEME` | Scheme | Savya |

### §24.2 Ayurdasaya Status

| ID | Field | Status |
| --- | --- | --- |
| `LON.PINDAYU` | Pindayu longevity | INTENTIONALLY EXCLUDED — Kalachakra anchor |
""")


# ──────────────────────────────────────────────────────────
# Utility parser tests
# ──────────────────────────────────────────────────────────

class TestParseMdTable:
    def test_basic_three_column_table(self):
        md = "| A | B | C |\n| --- | --- | --- |\n| 1 | 2 | 3 |\n| 4 | 5 | 6 |"
        result = _parse_md_table(md)
        assert len(result) == 2
        assert result[0] == {"A": "1", "B": "2", "C": "3"}

    def test_strips_backtick_ids(self):
        md = "| ID | Value |\n| --- | --- |\n| `FOO.BAR` | hello |"
        result = _parse_md_table(md)
        assert result[0]["ID"] == "`FOO.BAR`"  # raw; caller uses _clean_id

    def test_empty_string_returns_empty(self):
        assert _parse_md_table("") == []

    def test_no_separator_row_still_parses(self):
        md = "| A | B |\n| X | Y |"
        result = _parse_md_table(md)
        assert len(result) >= 1


class TestExtractSection:
    def test_extracts_section_between_h2s(self):
        md = "## §6 — STRENGTH\n\ncontent6\n\n## §7 — ASHTA\n\ncontent7"
        sec = _extract_section(md, "§6")
        assert "content6" in sec
        assert "content7" not in sec

    def test_returns_empty_when_not_found(self):
        md = "## §6 — STRENGTH\n\ncontent"
        assert _extract_section(md, "§99") == ""


class TestExtractSubsection:
    def test_extracts_h3_within_section(self):
        text = "## §6 — STRENGTH\n### §6.1 Shadbala\n\ntable here\n\n### §6.2 Totals\n\nother"
        sec = _extract_section(text, "§6")
        sub = _extract_subsection(sec, "§6.1")
        assert "table here" in sub
        assert "other" not in sub


# ──────────────────────────────────────────────────────────
# §6 shadbala
# ──────────────────────────────────────────────────────────

class TestParseSection6Shadbala:
    def test_component_rows_produced_per_planet(self):
        rows = parse_section_6(SHADBALA_COMPONENT_FIXTURE)
        shb = [r for r in rows if r["category"] == "shadbala" and r["fact_id"].startswith("SHB.")]
        assert len(shb) == 7  # one per planet

    def test_sun_component_row_has_sthana_and_dig(self):
        rows = parse_section_6(SHADBALA_COMPONENT_FIXTURE)
        sun = next(r for r in rows if r["fact_id"] == "SHB.SUN")
        vj = sun["value_json"]
        assert "sthana_bala" in vj
        assert "dig_bala" in vj
        assert vj["sthana_bala"] == 191.49

    def test_total_rows_produced_from_s62(self):
        rows = parse_section_6(SHADBALA_COMPONENT_FIXTURE)
        total_rows = [r for r in rows if r["fact_id"].startswith("SBL.TOTAL.")]
        assert len(total_rows) == 2  # Sun + Saturn in fixture

    def test_total_row_contains_jh_and_forensic(self):
        rows = parse_section_6(SHADBALA_COMPONENT_FIXTURE)
        sun_total = next(r for r in rows if r["fact_id"] == "SBL.TOTAL.SUN")
        vj = sun_total["value_json"]
        assert vj["jh_rupas"] == 8.18
        assert vj["forensic_rupas"] == 8.51


class TestParseSection6BhavaBala:
    def test_bhava_bala_category_assigned(self):
        rows = parse_section_6(SHADBALA_COMPONENT_FIXTURE)
        bvb = [r for r in rows if r["category"] == "bhava_bala"]
        assert len(bvb) == 2  # BVB.JH.5 + BVB.JH.7

    def test_bhava_bala_weakest_house_is_7(self):
        rows = parse_section_6(SHADBALA_COMPONENT_FIXTURE)
        bvb7 = next(r for r in rows if r["fact_id"] == "BVB.JH.7")
        assert bvb7["value_json"]["house"] == 7
        assert bvb7["value_json"]["jh_rupas"] == 4.73


class TestParseSection6IshtaKashta:
    def test_ishta_kashta_rows_produced(self):
        rows = parse_section_6(SHADBALA_COMPONENT_FIXTURE)
        ik = [r for r in rows if r["category"] == "ishta_kashta"]
        assert len(ik) == 2  # Saturn + Jupiter in fixture

    def test_saturn_ishta_kashta_ratio(self):
        rows = parse_section_6(SHADBALA_COMPONENT_FIXTURE)
        sat = next(r for r in rows if r["fact_id"] == "IKP.SATURN")
        vj = sat["value_json"]
        assert vj["ishta"] == 43.28
        assert vj["kashta"] == 4.81


class TestParseSection6StrengthExtra:
    def test_uccha_bala_rows_produced(self):
        rows = parse_section_6(SHADBALA_COMPONENT_FIXTURE)
        uccha = [r for r in rows if r["category"] == "strength_extra" and r["value_json"].get("metric") == "uccha_bala"]
        assert len(uccha) == 2  # Saturn + Moon in fixture

    def test_pancha_vargeeya_rows_produced(self):
        rows = parse_section_6(SHADBALA_COMPONENT_FIXTURE)
        pvc = [r for r in rows if r["category"] == "strength_extra" and r["value_json"].get("metric") == "pancha_vargeeya"]
        assert len(pvc) == 2  # Jupiter + Saturn

    def test_vimsopaka_rows_produced(self):
        rows = parse_section_6(SHADBALA_COMPONENT_FIXTURE)
        vim = [r for r in rows if r["category"] == "strength_extra" and r["value_json"].get("metric") == "vimsopaka_bala"]
        assert len(vim) == 1  # only Jupiter in fixture


# ──────────────────────────────────────────────────────────
# §7 ashtakavarga
# ──────────────────────────────────────────────────────────

class TestParseSection7Bav:
    def test_bav_rows_produced(self):
        rows = parse_section_7(BAV_FIXTURE)
        bav = [r for r in rows if r["category"] == "ashtakavarga_bav"]
        assert len(bav) == 2  # Sun + Saturn in fixture

    def test_sun_bav_total_correct(self):
        rows = parse_section_7(BAV_FIXTURE)
        sun = next(r for r in rows if r["fact_id"] == "AVG.BAV.SUN")
        assert sun["value_json"]["total_bindus"] == 48
        assert sun["value_json"]["by_sign"]["Aries"] == 5


class TestParseSection7Sav:
    def test_sav_rows_produced(self):
        rows = parse_section_7(BAV_FIXTURE)
        sav = [r for r in rows if r["category"] == "ashtakavarga_sav"]
        assert len(sav) == 2  # Aries + Libra

    def test_libra_sav_diverges_jh_forensic(self):
        rows = parse_section_7(BAV_FIXTURE)
        libra = next(r for r in rows if r["fact_id"] == "AVG.SAV.LIBRA")
        vj = libra["value_json"]
        assert vj["sav_forensic"] == 33
        assert vj["sav_jh"] == 34


class TestParseSection7ShuddhaP:
    def test_shuddha_pinda_rows_produced(self):
        rows = parse_section_7(BAV_FIXTURE)
        shp = [r for r in rows if r["category"] == "ashtakavarga_pinda"]
        assert len(shp) == 2

    def test_mars_shuddha_pinda_is_198(self):
        rows = parse_section_7(BAV_FIXTURE)
        mars = next(r for r in rows if r["fact_id"] == "AVG.SHP.MARS")
        assert mars["value_json"]["shuddha_pinda"] == 198


# ──────────────────────────────────────────────────────────
# §8 kakshya_zone
# ──────────────────────────────────────────────────────────

class TestParseSection8:
    def test_kakshya_rows_produced(self):
        rows = parse_section_8(KAKSHYA_FIXTURE)
        assert len(rows) == 2
        assert all(r["category"] == "kakshya_zone" for r in rows)

    def test_zone1_is_active(self):
        rows = parse_section_8(KAKSHYA_FIXTURE)
        z1 = next(r for r in rows if r["fact_id"] == "KAK.PISCES.Z1")
        assert z1["value_json"]["transit_active"] is True

    def test_zone2_is_inactive(self):
        rows = parse_section_8(KAKSHYA_FIXTURE)
        z2 = next(r for r in rows if r["fact_id"] == "KAK.PISCES.Z2")
        assert z2["value_json"]["transit_active"] is False


# ──────────────────────────────────────────────────────────
# §9 avastha
# ──────────────────────────────────────────────────────────

class TestParseSection9:
    def test_avastha_rows_produced(self):
        rows = parse_section_9(AVASTHA_FIXTURE)
        assert len(rows) == 2
        assert all(r["category"] == "avastha" for r in rows)

    def test_mercury_jagratadi_is_susupta(self):
        rows = parse_section_9(AVASTHA_FIXTURE)
        merc = next(r for r in rows if r["fact_id"] == "AVS.MERCURY")
        assert merc["value_json"]["jagratadi"] == "Susupta"

    def test_avastha_has_all_three_states(self):
        rows = parse_section_9(AVASTHA_FIXTURE)
        sat = next(r for r in rows if r["fact_id"] == "AVS.SATURN")
        vj = sat["value_json"]
        assert "jagratadi" in vj
        assert "baladi" in vj
        assert "deeptadi" in vj


# ──────────────────────────────────────────────────────────
# §11 sensitive_point + upagraha + mrityu_bhaga
# ──────────────────────────────────────────────────────────

class TestParseSection11Upagraha:
    def test_upagraha_rows_produced(self):
        rows = parse_section_11(SENSITIVE_FIXTURE)
        upg = [r for r in rows if r["category"] == "upagraha"]
        assert len(upg) == 2

    def test_gulika_in_gemini(self):
        rows = parse_section_11(SENSITIVE_FIXTURE)
        gulika = next(r for r in rows if r["fact_id"] == "UPG.GULIKA")
        assert gulika["value_json"]["sign"] == "Gemini"

    def test_mandi_nakshatra_correct(self):
        rows = parse_section_11(SENSITIVE_FIXTURE)
        mandi = next(r for r in rows if r["fact_id"] == "UPG.MANDI")
        assert mandi["value_json"]["nakshatra"] == "Pushya"


class TestParseSection11SensitivePoint:
    def test_bhrigu_bindu_rows_produced(self):
        rows = parse_section_11(SENSITIVE_FIXTURE)
        bb = [r for r in rows if r["category"] == "sensitive_point" and "Bhrigu" in r["value_text"]]
        assert len(bb) == 2  # BB.RESULT.SIGN + BB.RESULT.DEG

    def test_yogi_avayogi_produced(self):
        rows = parse_section_11(SENSITIVE_FIXTURE)
        yog = [r for r in rows if r["category"] == "sensitive_point" and "Yogi" in r["value_text"]]
        assert len(yog) >= 2

    def test_combustion_check_produced(self):
        rows = parse_section_11(SENSITIVE_FIXTURE)
        cmb = [r for r in rows if r["fact_id"] == "CMB.MERCURY"]
        assert len(cmb) == 1
        assert cmb[0]["category"] == "sensitive_point"


class TestParseSection11MrityuBhaga:
    def test_mrityu_bhaga_rows_produced(self):
        rows = parse_section_11(SENSITIVE_FIXTURE)
        mb = [r for r in rows if r["category"] == "mrityu_bhaga"]
        assert len(mb) == 2  # Sun + Saturn in fixture

    def test_sun_mrityu_bhaga_not_active(self):
        rows = parse_section_11(SENSITIVE_FIXTURE)
        sun = next(r for r in rows if r["fact_id"] == "HAZ.SUN")
        assert sun["value_json"]["active"] is False

    def test_mrityu_bhaga_has_degree_fields(self):
        rows = parse_section_11(SENSITIVE_FIXTURE)
        sat = next(r for r in rows if r["fact_id"] == "HAZ.SATURN")
        vj = sat["value_json"]
        assert "degree" in vj
        assert "mrityu_bhaga_degree" in vj


# ──────────────────────────────────────────────────────────
# §13 arudha_occupancy
# ──────────────────────────────────────────────────────────

class TestParseSection13:
    def test_arudha_occupancy_rows_produced(self):
        rows = parse_section_13(ARUDHA_OCCUPANCY_FIXTURE)
        assert len(rows) == 2
        assert all(r["category"] == "arudha_occupancy" for r in rows)

    def test_aries_has_a10_marker(self):
        rows = parse_section_13(ARUDHA_OCCUPANCY_FIXTURE)
        aries = next(r for r in rows if r["fact_id"] == "ARO.ARIES")
        assert "A10" in aries["value_json"]["markers"]

    def test_libra_house_is_7(self):
        rows = parse_section_13(ARUDHA_OCCUPANCY_FIXTURE)
        libra = next(r for r in rows if r["fact_id"] == "ARO.LIBRA")
        assert libra["value_json"]["house"] == 7


# ──────────────────────────────────────────────────────────
# §16 aspect
# ──────────────────────────────────────────────────────────

class TestParseSection16:
    def test_aspect_rows_produced(self):
        rows = parse_section_16(ASPECT_FIXTURE)
        assert len(rows) == 2
        assert all(r["category"] == "aspect" for r in rows)

    def test_sun_casts_7th_on_cancer(self):
        rows = parse_section_16(ASPECT_FIXTURE)
        sun = next(r for r in rows if r["fact_id"] == "ASP.G.SUN")
        vj = sun["value_json"]
        assert vj["type"] == "parashari"
        assert any(a["target_sign"] == "Cancer" for a in vj["aspect_rays"])

    def test_saturn_has_three_aspect_rays(self):
        rows = parse_section_16(ASPECT_FIXTURE)
        sat = next(r for r in rows if r["fact_id"] == "ASP.G.SATURN")
        assert len(sat["value_json"]["aspect_rays"]) == 3


# ──────────────────────────────────────────────────────────
# §17 chalit_shift
# ──────────────────────────────────────────────────────────

class TestParseSection17:
    def test_chalit_rows_produced(self):
        rows = parse_section_17(CHALIT_FIXTURE)
        assert len(rows) == 2
        assert all(r["category"] == "chalit_shift" for r in rows)

    def test_sun_shifts_from_10_to_11(self):
        rows = parse_section_17(CHALIT_FIXTURE)
        sun = next(r for r in rows if r["fact_id"] == "CKS.SUN")
        vj = sun["value_json"]
        assert vj["rashi_house"] == 10
        assert vj["chalit_house"] == 11
        assert vj["shift"] == 1

    def test_mars_no_shift(self):
        rows = parse_section_17(CHALIT_FIXTURE)
        mars = next(r for r in rows if r["fact_id"] == "CKS.MARS")
        assert mars["value_json"]["shift"] == 0


# ──────────────────────────────────────────────────────────
# §18 chandra_placement
# ──────────────────────────────────────────────────────────

class TestParseSection18:
    def test_chandra_rows_produced(self):
        rows = parse_section_18(CHANDRA_FIXTURE)
        assert len(rows) == 2
        assert all(r["category"] == "chandra_placement" for r in rows)

    def test_chandra_h1_has_moon(self):
        rows = parse_section_18(CHANDRA_FIXTURE)
        h1 = next(r for r in rows if r["fact_id"] == "CHN.1")
        assert "Moon" in h1["value_json"]["planets"]
        assert h1["value_json"]["moon_house"] == 1

    def test_chandra_h9_has_multiple_planets(self):
        rows = parse_section_18(CHANDRA_FIXTURE)
        h9 = next(r for r in rows if r["fact_id"] == "CHN.9")
        vj = h9["value_json"]
        assert len(vj["planets"]) == 3
        assert vj["occupied"] is True


# ──────────────────────────────────────────────────────────
# §20 deity_assignment
# ──────────────────────────────────────────────────────────

class TestParseSection20:
    def test_deity_rows_produced(self):
        rows = parse_section_20(DEITY_FIXTURE)
        assert all(r["category"] == "deity_assignment" for r in rows)
        assert len(rows) >= 5  # 2 (20.1) + 1 (20.2) + 2 (20.3)

    def test_ishta_devata_is_mahalakshmi(self):
        rows = parse_section_20(DEITY_FIXTURE)
        ishta = next(r for r in rows if r["fact_id"] == "DEV.ISHTA")
        assert ishta["value_json"]["deity"] == "Mahalakshmi"
        assert ishta["divisional_chart"] == "D9"

    def test_planet_deity_ledger_sun_row(self):
        rows = parse_section_20(DEITY_FIXTURE)
        sun_ledger = next(r for r in rows if r["fact_id"] == "DEV.L.SUN")
        vj = sun_ledger["value_json"]
        assert vj["d10_digpala"] == "Yama"
        assert vj["d60_label"] == "Amrita"


# ──────────────────────────────────────────────────────────
# §22 varshphal
# ──────────────────────────────────────────────────────────

class TestParseSection22:
    def test_varshphal_rows_produced(self):
        rows = parse_section_22(VARSHPHAL_FIXTURE)
        assert len(rows) == 3
        assert all(r["category"] == "varshphal" for r in rows)

    def test_muntha_sign_is_libra(self):
        rows = parse_section_22(VARSHPHAL_FIXTURE)
        muntha = next(r for r in rows if r["fact_id"] == "VRS.MUNTHA.SIGN")
        assert "Libra" in muntha["value_json"]["value"]

    def test_varshphal_year_annotated(self):
        rows = parse_section_22(VARSHPHAL_FIXTURE)
        for r in rows:
            assert r["value_json"]["year"] == "2026-2027"


# ──────────────────────────────────────────────────────────
# §24 longevity_indicator
# ──────────────────────────────────────────────────────────

class TestParseSection24:
    def test_longevity_rows_produced(self):
        rows = parse_section_24(LONGEVITY_FIXTURE)
        assert len(rows) >= 3  # §24.1: 2 + §24.2: 1 in fixture
        assert all(r["category"] == "longevity_indicator" for r in rows)

    def test_kalachakra_paramayush_is_85(self):
        rows = parse_section_24(LONGEVITY_FIXTURE)
        pa = next(r for r in rows if r["fact_id"] == "LON.KALACHAKRA.PARAMAYUSH")
        assert pa["value_json"]["estimated_years"] == 85
        assert pa["value_json"]["system"] == "kalachakra"

    def test_excluded_rows_flagged(self):
        rows = parse_section_24(LONGEVITY_FIXTURE)
        pindayu = next(r for r in rows if r["fact_id"] == "LON.PINDAYU")
        assert pindayu["value_json"]["intentionally_excluded"] is True


# ──────────────────────────────────────────────────────────
# extract_all integration
# ──────────────────────────────────────────────────────────

class TestExtractAll:
    def test_combined_fixture_produces_all_categories(self):
        combined = "\n".join([
            SHADBALA_COMPONENT_FIXTURE, BAV_FIXTURE, KAKSHYA_FIXTURE,
            AVASTHA_FIXTURE, SENSITIVE_FIXTURE, ARUDHA_OCCUPANCY_FIXTURE,
            ASPECT_FIXTURE, CHALIT_FIXTURE, CHANDRA_FIXTURE,
            DEITY_FIXTURE, VARSHPHAL_FIXTURE, LONGEVITY_FIXTURE,
        ])
        rows = extract_all(combined)
        cats = {r["category"] for r in rows}
        assert "shadbala" in cats
        assert "ashtakavarga_bav" in cats
        assert "ashtakavarga_sav" in cats
        assert "ashtakavarga_pinda" in cats
        assert "kakshya_zone" in cats
        assert "avastha" in cats
        assert "upagraha" in cats
        assert "sensitive_point" in cats
        assert "mrityu_bhaga" in cats
        assert "arudha_occupancy" in cats
        assert "aspect" in cats
        assert "chalit_shift" in cats
        assert "chandra_placement" in cats
        assert "deity_assignment" in cats
        assert "varshphal" in cats
        assert "longevity_indicator" in cats

    def test_no_duplicate_fact_ids(self):
        combined = "\n".join([
            SHADBALA_COMPONENT_FIXTURE, BAV_FIXTURE, KAKSHYA_FIXTURE,
            AVASTHA_FIXTURE, SENSITIVE_FIXTURE, ARUDHA_OCCUPANCY_FIXTURE,
        ])
        rows = extract_all(combined)
        ids = [r["fact_id"] for r in rows]
        assert len(ids) == len(set(ids))

    def test_all_rows_have_required_fields(self):
        combined = SHADBALA_COMPONENT_FIXTURE + BAV_FIXTURE
        rows = extract_all(combined)
        for row in rows:
            assert row.get("fact_id"), f"Missing fact_id: {row}"
            assert row.get("category"), f"Missing category: {row}"
            assert row.get("source_section"), f"Missing source_section: {row}"
            assert row.get("value_json") is not None, f"Missing value_json: {row}"
