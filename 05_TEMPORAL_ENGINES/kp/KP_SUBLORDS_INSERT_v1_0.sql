-- KP Sub-Lord substrate — self-contained SQL bundle.
-- Created by compute_kp.py (M3-W3-C2-KP-VARSHAPHALA, 2026-05-01).
-- Mirrors the schema in platform/migrations/024_kp_sublords.sql so this
-- file remains self-contained for ad-hoc apply / inspection. The two files
-- are kept in sync; the migration is the canonical source for the live DB.

CREATE TABLE IF NOT EXISTS kp_sublords (
    id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    chart_id        TEXT         NOT NULL,
    planet          TEXT         NOT NULL,
    sidereal_lon    NUMERIC      NOT NULL,
    sign            TEXT         NOT NULL,
    nakshatra       TEXT         NOT NULL,
    nakshatra_lord  TEXT         NOT NULL,
    sub_lord        TEXT         NOT NULL,
    sub_sub_lord    TEXT         NOT NULL,
    computed_by     TEXT         NOT NULL DEFAULT 'pyswisseph',
    ayanamsha       TEXT         NOT NULL DEFAULT 'lahiri',
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    UNIQUE (chart_id, planet, ayanamsha)
);
CREATE INDEX IF NOT EXISTS idx_kp_sublords_chart  ON kp_sublords(chart_id);
CREATE INDEX IF NOT EXISTS idx_kp_sublords_planet ON kp_sublords(chart_id, planet);

INSERT INTO kp_sublords (chart_id, planet, sidereal_lon, sign, nakshatra, nakshatra_lord, sub_lord, sub_sub_lord, computed_by, ayanamsha) VALUES ('abhisek_mohanty_primary', 'Sun', 291.9568422706, 'Capricorn', 'Shravana', 'Moon', 'Venus', 'Saturn', 'pyswisseph', 'lahiri') ON CONFLICT (chart_id, planet, ayanamsha) DO NOTHING;
INSERT INTO kp_sublords (chart_id, planet, sidereal_lon, sign, nakshatra, nakshatra_lord, sub_lord, sub_sub_lord, computed_by, ayanamsha) VALUES ('abhisek_mohanty_primary', 'Moon', 327.0550441280, 'Aquarius', 'PurvaBhadrapada', 'Jupiter', 'Venus', 'Moon', 'pyswisseph', 'lahiri') ON CONFLICT (chart_id, planet, ayanamsha) DO NOTHING;
INSERT INTO kp_sublords (chart_id, planet, sidereal_lon, sign, nakshatra, nakshatra_lord, sub_lord, sub_sub_lord, computed_by, ayanamsha) VALUES ('abhisek_mohanty_primary', 'Mars', 198.5159481637, 'Libra', 'Swati', 'Rahu', 'Moon', 'Jupiter', 'pyswisseph', 'lahiri') ON CONFLICT (chart_id, planet, ayanamsha) DO NOTHING;
INSERT INTO kp_sublords (chart_id, planet, sidereal_lon, sign, nakshatra, nakshatra_lord, sub_lord, sub_sub_lord, computed_by, ayanamsha) VALUES ('abhisek_mohanty_primary', 'Mercury', 270.8288796838, 'Capricorn', 'UttaraAshadha', 'Sun', 'Rahu', 'Venus', 'pyswisseph', 'lahiri') ON CONFLICT (chart_id, planet, ayanamsha) DO NOTHING;
INSERT INTO kp_sublords (chart_id, planet, sidereal_lon, sign, nakshatra, nakshatra_lord, sub_lord, sub_sub_lord, computed_by, ayanamsha) VALUES ('abhisek_mohanty_primary', 'Jupiter', 249.7807263717, 'Sagittarius', 'Mula', 'Ketu', 'Saturn', 'Mercury', 'pyswisseph', 'lahiri') ON CONFLICT (chart_id, planet, ayanamsha) DO NOTHING;
INSERT INTO kp_sublords (chart_id, planet, sidereal_lon, sign, nakshatra, nakshatra_lord, sub_lord, sub_sub_lord, computed_by, ayanamsha) VALUES ('abhisek_mohanty_primary', 'Venus', 259.1633413822, 'Sagittarius', 'PurvaAshadha', 'Venus', 'Rahu', 'Mercury', 'pyswisseph', 'lahiri') ON CONFLICT (chart_id, planet, ayanamsha) DO NOTHING;
INSERT INTO kp_sublords (chart_id, planet, sidereal_lon, sign, nakshatra, nakshatra_lord, sub_lord, sub_sub_lord, computed_by, ayanamsha) VALUES ('abhisek_mohanty_primary', 'Saturn', 202.4301146914, 'Libra', 'Vishakha', 'Jupiter', 'Saturn', 'Ketu', 'pyswisseph', 'lahiri') ON CONFLICT (chart_id, planet, ayanamsha) DO NOTHING;
INSERT INTO kp_sublords (chart_id, planet, sidereal_lon, sign, nakshatra, nakshatra_lord, sub_lord, sub_sub_lord, computed_by, ayanamsha) VALUES ('abhisek_mohanty_primary', 'Rahu', 49.0330441003, 'Taurus', 'Rohini', 'Moon', 'Mercury', 'Rahu', 'pyswisseph', 'lahiri') ON CONFLICT (chart_id, planet, ayanamsha) DO NOTHING;
INSERT INTO kp_sublords (chart_id, planet, sidereal_lon, sign, nakshatra, nakshatra_lord, sub_lord, sub_sub_lord, computed_by, ayanamsha) VALUES ('abhisek_mohanty_primary', 'Ketu', 229.0330441003, 'Scorpio', 'Jyeshtha', 'Mercury', 'Ketu', 'Jupiter', 'pyswisseph', 'lahiri') ON CONFLICT (chart_id, planet, ayanamsha) DO NOTHING;
