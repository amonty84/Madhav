from fastapi import APIRouter
from pydantic import BaseModel
import swisseph as swe

router = APIRouter()

swe.set_sid_mode(swe.SIDM_LAHIRI)

PLANETS = [
    ('Sun', swe.SUN),
    ('Moon', swe.MOON),
    ('Mars', swe.MARS),
    ('Mercury', swe.MERCURY),
    ('Jupiter', swe.JUPITER),
    ('Venus', swe.VENUS),
    ('Saturn', swe.SATURN),
    ('Rahu', swe.MEAN_NODE),  # Ketu = Rahu + 180
]

SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni',
    'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha',
    'Jyeshtha', 'Moola', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana',
    'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
]


class EphemerisRequest(BaseModel):
    birth_date: str    # YYYY-MM-DD
    birth_time: str    # HH:MM (local time at birth place)
    lat: float
    lng: float
    ut_offset: float = 5.5  # UTC offset of birth place (IST = 5.5)


class PlanetPosition(BaseModel):
    planet: str
    longitude: float
    sign: str
    deg_in_sign: float
    nakshatra: str
    pada: int
    retrograde: bool
    speed: float


@router.post("")
def compute_natal_positions(req: EphemerisRequest) -> dict:
    h, m = map(int, req.birth_time.split(':'))
    decimal_hour_local = h + m / 60.0
    decimal_hour_ut = decimal_hour_local - req.ut_offset

    parts = req.birth_date.split('-')
    year, month, day = int(parts[0]), int(parts[1]), int(parts[2])

    jd = swe.julday(year, month, day, decimal_hour_ut)
    flags = swe.FLG_SWIEPH | swe.FLG_SIDEREAL | swe.FLG_SPEED

    positions = []
    rahu_long = None

    for name, code in PLANETS:
        pos, _ = swe.calc_ut(jd, code, flags)
        lon = pos[0] % 360
        speed = pos[3]
        retrograde = speed < 0

        sign_idx = int(lon / 30)
        deg_in_sign = lon % 30
        sign = SIGNS[sign_idx]

        nak_idx = int(lon / (360 / 27))
        pada = int((lon % (360 / 27)) / (360 / 108)) + 1
        nakshatra = NAKSHATRAS[nak_idx]

        positions.append(PlanetPosition(
            planet=name,
            longitude=round(lon, 4),
            sign=sign,
            deg_in_sign=round(deg_in_sign, 4),
            nakshatra=nakshatra,
            pada=pada,
            retrograde=retrograde,
            speed=round(speed, 6),
        ))
        if name == 'Rahu':
            rahu_long = lon

    # Ketu = Rahu + 180
    if rahu_long is not None:
        ketu_long = (rahu_long + 180) % 360
        sign_idx = int(ketu_long / 30)
        nak_idx = int(ketu_long / (360 / 27))
        pada = int((ketu_long % (360 / 27)) / (360 / 108)) + 1
        positions.append(PlanetPosition(
            planet='Ketu',
            longitude=round(ketu_long, 4),
            sign=SIGNS[sign_idx],
            deg_in_sign=round(ketu_long % 30, 4),
            nakshatra=NAKSHATRAS[nak_idx],
            pada=pada,
            retrograde=True,
            speed=0.0,
        ))

    return {"jd": jd, "positions": [p.model_dump() for p in positions]}
