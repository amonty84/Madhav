from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from routers import ephemeris, events, eclipses, retrogrades, sade_sati, jaimini, v7_additions

load_dotenv()

app = FastAPI(title="MARSYS-JIS Compute Sidecar", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

API_KEY = os.environ.get("SIDECAR_API_KEY", "")


def verify_api_key(x_api_key: str = Header(default="")):
    if API_KEY and x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")


app.include_router(ephemeris.router, prefix="/ephemeris", dependencies=[Depends(verify_api_key)])
app.include_router(events.router, prefix="/event_chart_states", dependencies=[Depends(verify_api_key)])
app.include_router(eclipses.router, prefix="/eclipses", dependencies=[Depends(verify_api_key)])
app.include_router(retrogrades.router, prefix="/retrogrades", dependencies=[Depends(verify_api_key)])
app.include_router(sade_sati.router, prefix="/sade_sati", dependencies=[Depends(verify_api_key)])
app.include_router(jaimini.router, prefix="/jaimini_drishti", dependencies=[Depends(verify_api_key)])
app.include_router(v7_additions.router, prefix="/v7_additions", dependencies=[Depends(verify_api_key)])


@app.get("/health")
def health():
    return {"status": "ok"}
