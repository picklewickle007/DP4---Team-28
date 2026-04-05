'''This code lets PSWs view and manage their patient queue by seeing regular and emergency requests, 
checking whos next, and removing patients from the queue once theyve been helped.'''


from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import PSWQueue, Patient_profiles
from app.routers.psw import get_current_psw

router = APIRouter(prefix="/psw-home", tags=["PSW-Home"])


@router.get("/queue")
def get_regular_queue(token: str, session: Session = Depends(get_session)):
    get_current_psw(token)
    queue_entries = session.exec(
        select(PSWQueue).where(PSWQueue.priority == 0).order_by(PSWQueue.id)
    ).all()

    queue_with_addresses = []
    for entry in queue_entries:
        patient = session.get(Patient_profiles, entry.patient_id)
        queue_with_addresses.append(
            {
                "id": entry.id,
                "patient_id": entry.patient_id,
                "patient_name": entry.patient_name,
                "address": patient.address if patient else "Address unavailable",
            }
        )

    return queue_with_addresses

@router.get("/queue/next")
def get_next_in_queue(token: str, session: Session = Depends(get_session)):
    get_current_psw(token)
    query = select(PSWQueue).where(PSWQueue.priority == 0).order_by(PSWQueue.id)
    next_patient = session.exec(query).first()
    if not next_patient:
        raise HTTPException(status_code=404, detail="Queue is empty")
    return next_patient

@router.post("/queue/complete/{queue_id}")
def complete_queue_task(queue_id: int, token: str, session: Session = Depends(get_session)):
    get_current_psw(token)
    queue_entry = session.get(PSWQueue, queue_id)
    if not queue_entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")
    session.delete(queue_entry)
    session.commit()
    return {"message": f"Patient {queue_entry.patient_name} has been removed from the queue"}

@router.get("/queue/emergency")
def get_emergency_queue(token: str, session: Session = Depends(get_session)):
    get_current_psw(token)
    query = select(PSWQueue).where(PSWQueue.priority == 1).order_by(PSWQueue.id)
    next_patient = session.exec(query).first()
    if not next_patient:
        raise HTTPException(status_code=404, detail="No emergencies in queue")
    return next_patient


@router.get("/queue/emergencies")
def get_emergency_queue_list(token: str, session: Session = Depends(get_session)):
    get_current_psw(token)
    queue_entries = session.exec(
        select(PSWQueue).where(PSWQueue.priority == 1).order_by(PSWQueue.id)
    ).all()

    queue_with_addresses = []
    for entry in queue_entries:
        patient = session.get(Patient_profiles, entry.patient_id)
        queue_with_addresses.append(
            {
                "id": entry.id,
                "patient_id": entry.patient_id,
                "patient_name": entry.patient_name,
                "address": patient.address if patient else "Address unavailable",
            }
        )

    return queue_with_addresses

@router.post("/queue/emergency/complete/{queue_id}")
def complete_emergency_task(queue_id: int, token: str, session: Session = Depends(get_session)):
    get_current_psw(token)
    queue_entry = session.get(PSWQueue, queue_id)
    if not queue_entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")
    session.delete(queue_entry)
    session.commit()
    return {"message": f"Emergency for patient {queue_entry.patient_name} has been completed and removed from queue"}