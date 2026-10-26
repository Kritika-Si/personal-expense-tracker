
import os
import sqlite3
from pathlib import Path

# Use the deployment-provided path when available.
# Otherwise, keep the existing local database location.
DATABASE_PATH = Path(
    os.getenv(
        "DATABASE_PATH",
        str(Path(__file__).resolve().parent / "expenses.db"),
    )
)

# Ensure the database directory exists.
DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)


def get_connection():
    """Create and return a connection to the SQLite database."""
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    """Create the expenses table if it does not exist."""
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                amount REAL NOT NULL CHECK (amount > 0),
                category TEXT NOT NULL,
                transaction_type TEXT NOT NULL
                    CHECK (transaction_type IN ('income', 'expense')),
                date TEXT NOT NULL,
                notes TEXT DEFAULT '',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
