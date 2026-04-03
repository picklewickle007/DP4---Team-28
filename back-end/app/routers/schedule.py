'''
Description: handles all scheduling routes for both patients and PSWs. 
Patients can crete and view their scheduled tasks. 
PSWs can view all tasks assigned to them.
Completing or cancelling a task moves it to the History table.
'''

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import Schedule, History, Patient_profiles 
from app.routers.patients import get_current_patient # import get_current_patient function 
from app.routers.psw import get_current_psw # import get_current_psw function 
 
router = APIRouter(prefix="/schedule", tags=["Schedule"])
 
# creates a new scheduled task for the logged-in patient 
# automatically assigns the patient's PSW based on their profile
@router.post("/", response_model=Schedule) # return data in the shape of Schedule model
def create_scheduled_task(task: Schedule, token: str, session: Session = Depends(get_session)): # input parameters from frontend
    
    patient_id = get_current_patient(token) # get patient ID from token
    patient = session.exec(select(Patient_profiles).where(Patient_profiles.id == patient_id)).first() # return patient profile from Patient_profiles database
    task.patient_id = patient_id
    task.psw_id = patient.psw_id
    session.add(task)
    session.commit()
    session.refresh(task)
    return task
 
 # return all scheduled tasks for the logged-in patient 
@router.get("/", response_model=list[Schedule])
def get_schedule(token: str, session: Session = Depends(get_session)):
   
    patient_id = get_current_patient(token)
    results = session.exec(select(Schedule).where(Schedule.patient_id == patient_id)).all()
    return results
 
 # marks a task as completed and moves it to History 
@router.post("/{task_id}/complete")
def complete_task(task_id: int, session: Session = Depends(get_session)):
  
    task = session.get(Schedule, task_id)
    completed_task = History(patient_id=task.patient_id, psw_id=task.psw_id, task=task.task, start_time = task.start_time, duration=task.duration, date=task.date, status="completed")
    session.add(completed_task)
    session.delete(task)
    session.commit()
 
 # marks a task as cancelled and moves it to History 
@router.post("/{task_id}/cancel")
def cancel_task(task_id: int, session: Session = Depends(get_session)):
   
    task = session.get(Schedule, task_id)
    cancelled_task = History(patient_id=task.patient_id, psw_id=task.psw_id, task=task.task, start_time=task.start_time, duration=task.duration, date=task.date, status="cancelled")
    session.add(cancelled_task)
    session.delete(task)
    session.commit() 
 
 # returns all scheduled tasks assigned to the logged-in PSW
@router.get("/psw", response_model=list[Schedule])
def get_psw_schedule(token: str, session: Session = Depends(get_session)):
    
    psw_id = get_current_psw(token)
    results = session.exec(select(Schedule).where(Schedule.psw_id == psw_id)).all()
    return results