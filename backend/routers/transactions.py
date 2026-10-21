
from fastapi import APIRouter, HTTPException, status

from backend.database import get_connection
from backend.schemas import TransactionCreate, TransactionResponse

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])


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
