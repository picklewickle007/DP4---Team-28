'''
Description: entry point for the PSW scheduling API. Sets up FastAPI app,
database, CORS middleware, and registers all routes.
'''

from fastapi import FastAPI
from sqlmodel import SQLModel

from app.database import engine
from app.routers import auth, schedule, history, home, patients, psw, psw_home

from fastapi.middleware.cors import CORSMiddleware

# creates all database tables defined in models.py
SQLModel.metadata.create_all(engine)

app = FastAPI(title="PSW Scheduling API")

# allows requests from any origin for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# register all routers with their respective prefixes and route handlers
app.include_router(schedule.router)
app.include_router(history.router)
app.include_router(home.router)
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(psw.router)
app.include_router(psw_home.router)

# health check endpoint to verify the API is running
@app.get("/")
def health():
    return {"message": "API is running!"}