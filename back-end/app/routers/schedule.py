from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from sqlalchemy import text
from app.database import get_session
from app.models import Schedule
from app.models import History

router = APIRouter(prefix="/schedule", tags=["Schedule"])

@router.post("/", response_model=Schedule)
def create_scheduled_task(task: Schedule, session: Session = Depends(get_session)):
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.get("/", response_model=list[Schedule])
def get_schedule(session: Session = Depends(get_session)):
    query = text("SELECT id, task, time, date FROM schedule;")
    results = session.execute(query).fetchall()
    return results

@router.post("/{task_id}/complete")
def complete_task(task_id: int, session: Session = Depends(get_session)):
    task = session.get(Schedule, task_id)

    completed_task = History(id = task.id, task = task.task, time = task.time, date = task.date)
    session.add(completed_task)
    session.delete(task)

    session.commit()
    return {"message": f"Task {task_id} successfully moved to History!"}

@router.get("/testing")
def test_function(session: Session = Depends(get_session)):
    test = "hello"
    return test