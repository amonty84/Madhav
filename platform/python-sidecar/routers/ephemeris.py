from fastapi import APIRouter
from pydantic import BaseModel
import swisseph as swe

router = APIRouter()

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


def _position_from_lon(lon: float, speed: float, name: str) -> PlanetPosition:
    lon = lon % 360
    sign_idx = int(lon / 30)
    deg_in_sign = lon % 30
    nak_idx = int(lon / (360 / 27))
    pada = int((lon % (360 / 27)) / (360 / 108)) + 1
    return PlanetPosition(
        planet=name,
        longitude=round(lon, 4),
        sign=SIGNS[sign_idx],
        deg_in_sign=round(deg_in_sign, 4),
        nakshatra=NAKSHATRAS[nak_idx],
        pada=pada,
        retrograde=speed < 0,
        speed=round(speed, 6),
    )


@router.post("")
def compute_natal_positions(req: EphemerisRequest) -> dict:
    # Set Lahiri ayanamsa per-invocation to guard against global state mutation
    swe.set_sid_mode(swe.SIDM_LAHIRI)

    h, m = map(int, req.birth_time.split(':'))
    decimal_hour_ut = h + m / 60.0 - req.ut_offset

    parts = req.birth_date.split('-')
    year, month, day = int(parts[0]), int(parts[1]), int(parts[2])

    jd = swe.julday(year, month, day, decimal_hour_ut)
    flags = swe.FLG_SWIEPH | swe.FLG_SIDEREAL | swe.FLG_SPEED

    positions = []
    rahu_long = None
    rahu_speed = None

    for name, code in PLANETS:
        pos, _ = swe.calc_ut(jd, code, flags)
        lon, speed = pos[0], pos[3]
        positions.append(_position_from_lon(lon, speed, name))
        if name == 'Rahu':
            rahu_long = lon
            rahu_speed = speed

    # Ketu: opposite Rahu, moves at same rate in opposite direction
    if rahu_long is not None:
        ketu_long = rahu_long + 180
        ketu_speed = -(rahu_speed or 0.0)
        positions.append(_position_from_lon(ketu_long, ketu_speed, 'Ketu'))

    return {"jd": jd, "positions": [p.model_dump() for p in positions]}
