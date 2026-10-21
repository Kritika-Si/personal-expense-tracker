
from datetime import date as Date, datetime
from typing import Literal

from pydantic import BaseModel, Field, ConfigDict


Category = Literal[
    "Food",
    "Travel",
    "Shopping",
    "Education",
    "Bills",
    "Others",
]

TransactionType = Literal["income", "expense"]


class TransactionCreate(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    amount: float = Field(gt=0, allow_inf_nan=False)
    category: Category
    transaction_type: TransactionType
    date: Date
    notes: str = Field(default="", max_length=500)


class TransactionUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=100)
    amount: float | None = Field(default=None, gt=0, allow_inf_nan=False)
    category: Category | None = None
    transaction_type: TransactionType | None = None
    date: Date | None = None
    notes: str | None = Field(default=None, max_length=500)


class TransactionResponse(TransactionCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
