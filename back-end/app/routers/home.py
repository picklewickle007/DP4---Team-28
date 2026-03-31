from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Schedule, PSWQueue, Patient_profiles
from app.routers.patients import get_current_patient

router = APIRouter(prefix="/home", tags=["Home"])

@router.get("/")
def get_home():
    return {"message": "Welcome to the home page"}

@router.post("/queue/")
def add_to_queue(token: str, session: Session = Depends(get_session)):
    patient_id = get_current_patient(token)
    query = select(Patient_profiles).where(Patient_profiles.id == patient_id)
    patient_profile = session.exec(query).first()
    patient = PSWQueue(patient_id=patient_id, patient_name=patient_profile.name, priority=0)
    session.add(patient)
    session.commit()
    session.refresh(patient)
    return {"message": "Added to queue", "patient": patient}

@router.post("/queue/emergency/")
def emergency_queue(token: str, session: Session = Depends(get_session)):
    patient_id = get_current_patient(token)
    query = select(Patient_profiles).where(Patient_profiles.id == patient_id)
    patient_profile = session.exec(query).first()
    patient = PSWQueue(patient_id=patient_id, patient_name=patient_profile.name, priority=1)
    session.add(patient)
    session.commit()
    session.refresh(patient)
    return {"message": "EMERGENCY: Added to top of queue", "patient": patient}

@router.get("/queue/")
def get_queue(session: Session = Depends(get_session)):
    query = select(PSWQueue).order_by(PSWQueue.priority.desc(), PSWQueue.id)
    results = session.exec(query).all()
    return results

@router.post("/schedule/")
def home_create_schedule(task: Schedule, token: str, session: Session = Depends(get_session)):
    patient_id = get_current_patient(token)
    patient = session.exec(select(Patient_profiles).where(Patient_profiles.id == patient_id)).first()
    task.patient_id = patient_id
    task.psw_id = patient.psw_id
    session.add(task)
    session.commit()
    session.refresh(task)
    return task