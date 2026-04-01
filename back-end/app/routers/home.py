from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Schedule, PSWQueue, Patient_profiles
from app.routers.patients import get_current_patient

router = APIRouter(prefix="/home", tags=["Home"])

@router.post("/queue/")
def add_to_queue(token: str, session: Session = Depends(get_session)):
    patient_id = get_current_patient(token)
    
    # check if patient is already in the queue
    existing = session.exec(select(PSWQueue).where(PSWQueue.patient_id == patient_id)).first()
    if existing:
        raise HTTPException(status_code=400, detail="You are already in the queue")
    
    patient_profile = session.exec(select(Patient_profiles).where(Patient_profiles.id == patient_id)).first()
    patient = PSWQueue(patient_id=patient_id, patient_name=patient_profile.name, priority=0, status = "waiting")
    session.add(patient)
    session.commit()
    session.refresh(patient)
    return {"message": "Added to queue", "patient": patient}

@router.get("/queue/status/")
def get_queue_status(token: str, session: Session = Depends(get_session)):
    patient_id = get_current_patient(token)
    entry = session.exec(select(PSWQueue).where(PSWQueue.patient_id == patient_id)).first()

    if not entry:
        return {"in_queue": False}

    return {"in_queue": True, "patient": entry}

@router.delete("/queue/")
def leave_queue(token: str, session: Session = Depends(get_session)):
    patient_id = get_current_patient(token)
    entry = session.exec(select(PSWQueue).where(PSWQueue.patient_id == patient_id)).first()

    if not entry:
        raise HTTPException(status_code=404, detail="You are not currently in the queue")

    session.delete(entry)
    session.commit()
    return {"message": "Removed from queue"}

@router.post("/queue/emergency/")
def emergency_queue(token: str, session: Session = Depends(get_session)):
    patient_id = get_current_patient(token)

    existing = session.exec(select(PSWQueue).where(PSWQueue.patient_id == patient_id)).first()
    if existing:
        session.delete(existing)
        session.commit()

    patient_profile = session.exec(select(Patient_profiles).where(Patient_profiles.id == patient_id)).first()
    patient = PSWQueue(patient_id=patient_id, patient_name=patient_profile.name, priority=1, status = "waiting")
    session.add(patient)
    session.commit()
    session.refresh(patient)
    return {"message": "EMERGENCY: Added to top of queue", "patient": patient}

@router.get("/queue/")
def get_queue(session: Session = Depends(get_session)):
    results = session.exec(select(PSWQueue).order_by(PSWQueue.priority.desc(), PSWQueue.id)).all()
    return results

