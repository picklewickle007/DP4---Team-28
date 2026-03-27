from sqlmodel import SQLModel, Field

# FILL IN THESE TABLES WITH BETTER SCHEMAS (THE DATA WE TALKED ABOUT IN TUTORIAL!)
class Schedule(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    task: str
    time: str
    date: str

class History(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    task: str
    time: str
    date: str
