
from contextlib import asynccontextmanager

from fastapi import FastAPI

from backend.database import init_db
from backend.routers.transactions import router as transactions_router

from fastapi.middleware.cors import CORSMiddleware


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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions_router)

@app.get("/")
def home():
    return {
        "message": "Personal Expense Tracker API is running!"
    }
