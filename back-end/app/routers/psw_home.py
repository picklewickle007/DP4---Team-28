from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import PSWQueue
from app.routers.psw import get_current_psw

router = APIRouter(prefix="/psw-home", tags=["PSW-Home"])

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

@router.post("/queue/emergency/complete/{queue_id}")
def complete_emergency_task(queue_id: int, token: str, session: Session = Depends(get_session)):
    get_current_psw(token)
    queue_entry = session.get(PSWQueue, queue_id)
    if not queue_entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")
    session.delete(queue_entry)
    session.commit()
    return {"message": f"Emergency for patient {queue_entry.patient_name} has been completed and removed from queue"}    