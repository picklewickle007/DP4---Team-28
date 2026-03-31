from fastapi import FastAPI
from sqlmodel import SQLModel

from app.database import engine
from app.routers import schedule, history, home, patients, psw, psw_home

from fastapi.middleware.cors import CORSMiddleware

SQLModel.metadata.create_all(engine)

app = FastAPI(title="PSW Scheduling API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(schedule.router)
app.include_router(history.router)
app.include_router(home.router)
app.include_router(patients.router)
app.include_router(psw.router)
app.include_router(psw_home.router)

@app.get("/")
def health():
    return {"message": "API is running!"}