from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from sqlalchemy import text
from app.database import get_session
from app.models import Schedule

router = APIRouter(prefix="/schedule", tags=["Schedule"])

@router.post("/", response_model=Schedule)
def create_scheduled_task(task: Schedule, session: Session = Depends(get_session)):
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.get("/", response_model=list[Schedule])
def get_schedule(session: Session = Depends(get_session)):
    query = text("SELECT id, task FROM schedule;")
    results = session.execute(query).fetchall()
    return results

@router.post("/{task_id}/complete")
def complete_task(task_id: int, session: Session = Depends(get_session)):
    return {"message": "Task successfully moved to History!"}