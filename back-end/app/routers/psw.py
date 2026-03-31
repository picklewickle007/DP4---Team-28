from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import PSW_profiles
import hashlib

router = APIRouter(prefix="/psw-login", tags=["PSW-login"])

active_psw_sessions = {}

@router.post("/signup", response_model=PSW_profiles)
def signup(psw: PSW_profiles, session: Session = Depends(get_session)):
    psw.password = hashlib.sha256(psw.password.encode()).hexdigest()
    session.add(psw)
    session.commit()
    session.refresh(psw)
    return psw

@router.post("/login")
def login(username: str, password: str, session: Session = Depends(get_session)):
    hashed = hashlib.sha256(password.encode()).hexdigest()
    query = select(PSW_profiles).where(PSW_profiles.username == username, PSW_profiles.password == hashed)
    psw = session.exec(query).first()
    if not psw:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = hashlib.sha256(f"{username}{password}".encode()).hexdigest()
    active_psw_sessions[token] = psw.id
    return {"token": token, "name": psw.name}

def get_current_psw(token: str) -> int:
    if token not in active_psw_sessions:
        raise HTTPException(status_code=401, detail="Not logged in")
    return active_psw_sessions[token]