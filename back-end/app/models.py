from sqlmodel import SQLModel, Field
from typing import Optional

class PSW_profiles(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    age: int
    username: str
    password: str

class Patient_profiles(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    age: int
    address: str
    username: str
    password: str
    psw_id: int | None = Field(default=None, foreign_key="psw_profiles.id") 

class Schedule(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    patient_id: int | None = Field(default=None, foreign_key="patient_profiles.id")
    
    psw_id: int | None = Field(default=None, foreign_key="psw_profiles.id") 
    task: str
    start_time: str
    duration: str
    date: str

class History(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    patient_id: int | None = Field(default=None, foreign_key="patient_profiles.id")
    psw_id: int | None = Field(default=None, foreign_key="psw_profiles.id") 
    task: str
    start_time: str
    duration: str
    date: str

class PSWQueue(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    patient_id: int | None = Field(default=None, foreign_key="patient_profiles.id")
    patient_name: str
    priority: int = 0
    status: str = "waiting"