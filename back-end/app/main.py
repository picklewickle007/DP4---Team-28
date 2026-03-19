from fastapi import FastAPI
from sqlmodel import SQLModel

from app.database import engine
from app.routers import schedule, history, psw

from fastapi.middleware.cors import CORSMiddleware

# Create the tables immediately when Python reads this file
SQLModel.metadata.create_all(engine)

app = FastAPI(title="PSW Scheduling API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, you'd be more specific!
    allow_methods=["*"],
    allow_headers=["*"],
)

# Plug in the routers
app.include_router(schedule.router)
app.include_router(history.router)

@app.get("/")
def health():
    return {"message": "API is running!"}