
from fastapi import APIRouter, HTTPException, status, Query
from datetime import date

from backend.database import get_connection
from backend.schemas import (
    TransactionCreate,
    TransactionUpdate,
    TransactionResponse,
)

router = APIRouter(
    prefix="/api/transactions",
    tags=["Transactions"],
)


@router.post(
    "/",
    response_model=TransactionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_transaction(transaction: TransactionCreate):
    connection = get_connection()

    try:
        cursor = connection.execute(
            """
            INSERT INTO expenses (
                title, amount, category,
                transaction_type, date, notes
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                transaction.title,
                transaction.amount,
                transaction.category,
                transaction.transaction_type,
                transaction.date.isoformat(),
                transaction.notes,
            ),
        )

        connection.commit()

        new_transaction = connection.execute(
            "SELECT * FROM expenses WHERE id = ?",
            (cursor.lastrowid,),
        ).fetchone()

        return dict(new_transaction)

    except Exception:
        connection.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to create transaction",
        )

    finally:
        connection.close()


@router.get("/", response_model=list[TransactionResponse])
def get_transactions(
    month: int | None = Query(default=None, ge=1, le=12),
    year: int | None = Query(default=None, ge=2000, le=2100),
):
    if (month is None) != (year is None):
        raise HTTPException(
            status_code=400,
            detail="Provide both month and year, or neither.",
        )

    connection = get_connection()

    try:
        if month is not None and year is not None:
            selected_month = f"{year:04d}-{month:02d}"

            transactions = connection.execute(
                """
                SELECT * FROM expenses
                WHERE substr(date, 1, 7) = ?
                ORDER BY date DESC, id DESC
                """,
                (selected_month,),
            ).fetchall()
        else:
            transactions = connection.execute(
                """
                SELECT * FROM expenses
                ORDER BY date DESC, id DESC
                """
            ).fetchall()

        return [dict(transaction) for transaction in transactions]

    finally:
        connection.close()


@router.patch(
    "/{transaction_id}",
    response_model=TransactionResponse,
)
def update_transaction(
    transaction_id: int,
    transaction: TransactionUpdate,
):
    connection = get_connection()

    try:
        existing = connection.execute(
            "SELECT * FROM expenses WHERE id = ?",
            (transaction_id,),
        ).fetchone()

        if existing is None:
            raise HTTPException(
                status_code=404,
                detail="Transaction not found",
            )

        updates = transaction.model_dump(exclude_unset=True)

        if not updates:
            return dict(existing)

        if any(value is None for value in updates.values()):
            raise HTTPException(
                status_code=422,
                detail="Transaction fields cannot be null",
            )

        if "date" in updates:
            updates["date"] = updates["date"].isoformat()

        columns = ", ".join(
            f"{field} = ?" for field in updates
        )
        values = list(updates.values()) + [transaction_id]

        try:
            connection.execute(
                f"UPDATE expenses SET {columns} WHERE id = ?",
                values,
            )
            connection.commit()
        except Exception as exc:
            connection.rollback()
            raise HTTPException(
                status_code=500,
                detail="Failed to update transaction",
            ) from exc

        updated = connection.execute(
            "SELECT * FROM expenses WHERE id = ?",
            (transaction_id,),
        ).fetchone()

        return dict(updated)

    finally:
        connection.close()


@router.delete(
    "/{transaction_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_transaction(transaction_id: int):
    connection = get_connection()

    try:
        cursor = connection.execute(
            "DELETE FROM expenses WHERE id = ?",
            (transaction_id,),
        )

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Transaction not found",
            )

        connection.commit()

    finally:
        connection.close()


@router.get("/summary")
def get_transaction_summary(
    month: int | None = Query(default=None, ge=1, le=12),
    year: int | None = Query(default=None, ge=2000, le=2100),
):
    if (month is None) != (year is None):
        raise HTTPException(
            status_code=400,
            detail="Provide both month and year, or neither.",
        )

    connection = get_connection()

    try:
        if month is not None and year is not None:
            selected_month = f"{year:04d}-{month:02d}"

            result = connection.execute(
                """
                SELECT
                    COALESCE(SUM(CASE
                        WHEN transaction_type = 'income'
                        THEN amount ELSE 0 END), 0) AS total_income,
                    COALESCE(SUM(CASE
                        WHEN transaction_type = 'expense'
                        THEN amount ELSE 0 END), 0) AS total_expenses,
                    COUNT(*) AS total_transactions
                FROM expenses
                WHERE substr(date, 1, 7) = ?
                """,
                (selected_month,),
            ).fetchone()
        else:
            result = connection.execute(
                """
                SELECT
                    COALESCE(SUM(CASE
                        WHEN transaction_type = 'income'
                        THEN amount ELSE 0 END), 0) AS total_income,
                    COALESCE(SUM(CASE
                        WHEN transaction_type = 'expense'
                        THEN amount ELSE 0 END), 0) AS total_expenses,
                    COUNT(*) AS total_transactions
                FROM expenses
                """
            ).fetchone()

        total_income = result["total_income"]
        total_expenses = result["total_expenses"]

        return {
            "total_income": total_income,
            "total_expenses": total_expenses,
            "balance": total_income - total_expenses,
            "total_transactions": result["total_transactions"],
        }

    finally:
        connection.close()
