from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database import get_session
from app.models import History
from app.routers.patients import get_current_patient
from app.routers.psw import get_current_psw

router = APIRouter(prefix="/history", tags=["History"])

@router.get("/patient", response_model=list[History])
def get_history(token: str, session: Session = Depends(get_session)):
    patient_id = get_current_patient(token)
    results = session.exec(select(History).where(History.patient_id == patient_id)).all()
    return results

@router.get("/psw", response_model=list[History])
def get_psw_history(token: str, session: Session = Depends(get_session)):
    psw_id = get_current_psw(token)
    results = session.exec(select(History).where(History.psw_id == psw_id)).all()
    return results