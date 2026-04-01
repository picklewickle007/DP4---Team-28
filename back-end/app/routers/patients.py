from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Patient_profiles, PSW_profiles
import hashlib

router = APIRouter(prefix="/patients-login", tags=["Patients-login"])

active_sessions = {} # dictionary that stores patient ID and associated session token

@router.post("/signup", response_model=Patient_profiles)
def signup(patient: Patient_profiles, psw_username: str, session: Session = Depends(get_session)):
    
    # check if user has already signed up
    existing_patient = session.exec(select(Patient_profiles).where(Patient_profiles.username == patient.username)).first()
    existing_psw = session.exec(select(PSW_profiles).where(PSW_profiles.username == patient.username)).first()
    if existing_patient or existing_psw:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # check if psw has signed up before patient signs up
    psw = session.exec(select(PSW_profiles).where(PSW_profiles.username == psw_username)).first()
    if not psw:
        raise HTTPException(status_code=404, detail="PSW not found")
    
    patient.id = None
    patient.psw_id = psw.id
    patient.password = hashlib.sha256(patient.password.encode()).hexdigest()
    session.add(patient)
    session.commit()
    session.refresh(patient)
    return patient

@router.post("/login")
def login(username: str, password: str, session: Session = Depends(get_session)):
    hashed = hashlib.sha256(password.encode()).hexdigest()
    patient = session.exec(select(Patient_profiles).where(Patient_profiles.username == username, Patient_profiles.password == hashed)).first()
    if not patient:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = hashlib.sha256(f"{username}{password}".encode()).hexdigest()
    active_sessions[token] = patient.id
    return {"token": token, "name": patient.name}

def get_current_patient(token: str) -> int: # accept token as input and return patient id as int as output
    if token not in active_sessions: # check if user is logged in and has active token 
        raise HTTPException(status_code=401, detail="Not logged in")
    return active_sessions[token] # return patient ID