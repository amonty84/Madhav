from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class Params(BaseModel):
    params: dict = {}


@router.post("")
def compute(req: Params):
    return {"status": "not_implemented", "message": "event_chart_states: use ephemeris endpoint for natal positions"}
