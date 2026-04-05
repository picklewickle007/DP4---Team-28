'''
Description: handles PSW account management including signup, login, and profile updates
'''

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, SQLModel, select
from app.database import get_session
from app.models import PSW_profiles, Patient_profiles
import hashlib

router = APIRouter(prefix="/psw-login", tags=["PSW-login"])

# stores active PSW sessions in memory. Cleared on server restart.
active_psw_sessions = {}

# model for updating a PSW profile 
class PSWProfileUpdate(SQLModel):

    name: str
    username: str
    age: int
    current_password: str

# registers a new PSW account and checks if username is unique across both PSW and patient tables.
@router.post("/signup", response_model=PSW_profiles)
def signup(psw: PSW_profiles, session: Session = Depends(get_session)):

    existing_psw = session.exec(select(PSW_profiles).where(PSW_profiles.username == psw.username)).first()
    existing_patient = session.exec(select(Patient_profiles).where(Patient_profiles.username == psw.username)).first()

    if existing_psw or existing_patient:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    psw.id = None
    psw.password = hashlib.sha256(psw.password.encode()).hexdigest() # has password before storing for security 

    session.add(psw)
    session.commit()
    session.refresh(psw)
    return psw

# logs in a PSW and returns a session token and their name 
@router.post("/login")
def login(username: str, password: str, session: Session = Depends(get_session)):

    hashed = hashlib.sha256(password.encode()).hexdigest()
    query = select(PSW_profiles).where(PSW_profiles.username == username, PSW_profiles.password == hashed)
    psw = session.exec(query).first()

    if not psw:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    token = hashlib.sha256(f"{username}{password}".encode()).hexdigest() # PSW token is a combination of their hashed username and password
    active_psw_sessions[token] = psw.id

    return {"token": token, "name": psw.name}

# returns the logged-in PSW's profile information
@router.get("/profile")
def get_profile(token: str, session: Session = Depends(get_session)):

    psw_id = get_current_psw(token)

    psw = session.exec(select(PSW_profiles).where(PSW_profiles.id == psw_id)).first()

    if not psw:
        raise HTTPException(status_code=404, detail="PSW profile not found")

    return {
        "name": psw.name,
        "username": psw.username,
        "age": psw.age,
    }

# updates PSW's profile 
@router.put("/profile-update")
def update_profile(update: PSWProfileUpdate, token: str, session: Session = Depends(get_session)):
    
    psw_id = get_current_psw(token)
    psw = session.exec(select(PSW_profiles).where(PSW_profiles.id == psw_id)).first()
    if not psw:
        raise HTTPException(status_code=404, detail="PSW profile not found")

    hashed_password = hashlib.sha256(update.current_password.encode()).hexdigest()
    if psw.password != hashed_password:
        raise HTTPException(status_code=401, detail="Incorrect password")

    existing_psw = session.exec(select(PSW_profiles).where(PSW_profiles.username == update.username, PSW_profiles.id != psw_id,)).first()
    existing_patient = session.exec(select(Patient_profiles).where(Patient_profiles.username == update.username)).first()

    if existing_psw or existing_patient:
        raise HTTPException(status_code=400, detail="Username already taken")

    psw.name = update.name
    psw.username = update.username
    psw.age = update.age

    session.add(psw)
    session.commit()
    session.refresh(psw)

    return {
        "message": "Profile updated successfully",
        "profile": {
            "name": psw.name,
            "username": psw.username,
            "age": psw.age,
        },
    }

# validates a PSW token and returns their ID -- this function is imported by other routers 
def get_current_psw(token: str) -> int:

    if token not in active_psw_sessions:
        raise HTTPException(status_code=401, detail="Not logged in")
    return active_psw_sessions[token]