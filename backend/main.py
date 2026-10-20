
from contextlib import asynccontextmanager

from fastapi import FastAPI

from backend.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Personal Expense Tracker API",
    description="API for managing personal income and expenses",
    version="1.0.0",
    lifespan=lifespan,
)


@app.get("/")
def home():
    return {
        "message": "Personal Expense Tracker API is running!"
    }
