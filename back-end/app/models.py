'''
Description: define all database tables for our scheduling app. table = True creates 
a correspondin table in the database; relationships between tables are managed via 
foregin keys.
'''

from sqlmodel import SQLModel, Field
from typing import Optional

# stores PSW account information
class PSW_profiles(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    age: int
    username: str
    password: str

# stores patient account information as well as links patient account with PSW account via psw_id
class Patient_profiles(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    age: int
    address: str
    username: str
    password: str
    psw_id: int | None = Field(default=None, foreign_key="psw_profiles.id") 

# stores upcoming scheduled tasks for all patients and psws 
class Schedule(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    patient_id: int | None = Field(default=None, foreign_key="patient_profiles.id")
    psw_id: int | None = Field(default=None, foreign_key="psw_profiles.id") 
    task: str
    start_time: str
    duration: str
    date: str

# stores completed tasks, moved here from schedule database above
class History(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    patient_id: int | None = Field(default=None, foreign_key="patient_profiles.id")
    psw_id: int | None = Field(default=None, foreign_key="psw_profiles.id") 
    task: str
    start_time: str
    duration: str
    date: str
    status: str

# stores patients waiting to be assigned a PSW, ordered by priority
class PSWQueue(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    patient_id: int | None = Field(default=None, foreign_key="patient_profiles.id")
    patient_name: str
    priority: int = 0
    status: str = "waiting"