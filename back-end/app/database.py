'''
Description: configures the database engine and session for the application. Uses
SQLite as the database, stored locally in a file called app.db.
'''

from sqlmodel import create_engine, Session

# creates a local SQLite file named 'app.db'
sqlite_url = "sqlite:///./app.db"
engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def get_session():
    with Session(engine) as session:
        yield session