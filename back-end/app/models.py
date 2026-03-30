from sqlmodel import SQLModel, Field
from typing import Optional


# FILL IN THESE TABLES WITH BETTER SCHEMAS (THE DATA WE TALKED ABOUT IN TUTORIAL!)
class Patient_profiles(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    age: int
    room_number: str
    username: str
    password: str

class Schedule(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patient_profiles.id")
    task: str
    time: str
    date: str

class History(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patient_profiles.id")
    task: str
    time: str
    date: str

class PSWQueue(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patient_profiles.id")
    patient_name: str
    priority: int = 0
    status: str = "waiting"

class PSW_profiles(SQLModel, table = True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    age: int
    username: str
    password: str


    
