from fastapi import APIRouter, Depends
from sqlmodel import Session
from sqlalchemy import text
from app.database import get_session
from app.models import History

router = APIRouter(prefix="/history", tags=["History"])

# Use the same format you used on schedule.py here

#get all history!
@router.get("/", response_model=list[History])
def get_history(session: Session = Depends(get_session)):
    query = text("SELECT id, task, time, date FROM history;")
    results = session.execute(query).fetchall()
    return results