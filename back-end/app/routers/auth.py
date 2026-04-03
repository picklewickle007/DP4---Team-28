'''Handles user login by verifying hashed credentials against patient or PSW records, 
then generates and stores a session token with the users role.  This information is used to direct 
patients to the patient interface and PSWs to the PSW interface.'''

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Patient_profiles, PSW_profiles
from app.routers.patients import active_sessions
from app.routers.psw import active_psw_sessions
import hashlib

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
def login(username: str, password: str, session: Session = Depends(get_session)):
    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    patient = session.exec(
        select(Patient_profiles).where(
            Patient_profiles.username == username,
            Patient_profiles.password == hashed_password,
        )
    ).first()
    if patient:
        token = hashlib.sha256(f"{username}{password}".encode()).hexdigest()
        active_sessions[token] = patient.id
        return {"token": token, "name": patient.name, "role": "patient"}

    psw = session.exec(
        select(PSW_profiles).where(
            PSW_profiles.username == username,
            PSW_profiles.password == hashed_password,
        )
    ).first()
    if psw:
        token = hashlib.sha256(f"{username}{password}".encode()).hexdigest()
        active_psw_sessions[token] = psw.id
        return {"token": token, "name": psw.name, "role": "psw"}

    raise HTTPException(status_code=401, detail="Invalid username or password")
