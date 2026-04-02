from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, SQLModel, select
from app.database import get_session
from app.models import Patient_profiles, PSW_profiles
import hashlib

router = APIRouter(prefix="/patients-login", tags=["Patients-login"])

active_sessions = {} # dictionary that stores patient ID and associated session token


class PatientProfileUpdate(SQLModel):
    name: str
    username: str
    age: int
    address: str
    current_password: str

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

@router.get("/profile")
def get_profile(token: str, session: Session = Depends(get_session)):
    patient_id = get_current_patient(token)
    patient = session.exec(select(Patient_profiles).where(Patient_profiles.id == patient_id)).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")

    assigned_psw = None
    if patient.psw_id is not None:
        assigned_psw = session.exec(select(PSW_profiles).where(PSW_profiles.id == patient.psw_id)).first()

    return {
        "name": patient.name,
        "username": patient.username,
        "age": patient.age,
        "address": patient.address,
        "assigned_psw_username": assigned_psw.username if assigned_psw else "Unassigned",
        "assigned_psw_name": assigned_psw.name if assigned_psw else "Unassigned",
    }


@router.put("/profile")
def update_profile(update: PatientProfileUpdate, token: str, session: Session = Depends(get_session)):
    patient_id = get_current_patient(token)
    patient = session.exec(select(Patient_profiles).where(Patient_profiles.id == patient_id)).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")

    hashed_password = hashlib.sha256(update.current_password.encode()).hexdigest()
    if patient.password != hashed_password:
        raise HTTPException(status_code=401, detail="Incorrect password")

    existing_patient = session.exec(
        select(Patient_profiles).where(
            Patient_profiles.username == update.username,
            Patient_profiles.id != patient_id,
        )
    ).first()
    existing_psw = session.exec(
        select(PSW_profiles).where(PSW_profiles.username == update.username)
    ).first()

    if existing_patient or existing_psw:
        raise HTTPException(status_code=400, detail="Username already taken")

    patient.name = update.name
    patient.username = update.username
    patient.age = update.age
    patient.address = update.address

    session.add(patient)
    session.commit()
    session.refresh(patient)

    assigned_psw = None
    if patient.psw_id is not None:
        assigned_psw = session.exec(select(PSW_profiles).where(PSW_profiles.id == patient.psw_id)).first()

    return {
        "message": "Profile updated successfully",
        "profile": {
            "name": patient.name,
            "username": patient.username,
            "age": patient.age,
            "address": patient.address,
            "assigned_psw_username": assigned_psw.username if assigned_psw else "Unassigned",
            "assigned_psw_name": assigned_psw.name if assigned_psw else "Unassigned",
        },
    }

def get_current_patient(token: str) -> int: # accept token as input and return patient id as int as output
    if token not in active_sessions: # check if user is logged in and has active token 
        raise HTTPException(status_code=401, detail="Not logged in")
    return active_sessions[token] # return patient ID

@router.get("/{patient_id}")
def get_patient_by_id(patient_id: int, session: Session = Depends(get_session)):
    patient = session.get(Patient_profiles, patient_id)
    return patient