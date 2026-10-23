
function TransactionItem({ transaction, formatCurrency, onEdit, onDelete }) {
  const isIncome = transaction.transaction_type === "income";

  return (
    <div className="transaction-item">
      <div className="transaction-details">
        <h3>{transaction.title}</h3>
        <p>
          {transaction.category} • {transaction.date}
        </p>
      </div>

      <div className="transaction-right">
        <strong
          className={`transaction-amount ${
            isIncome ? "income" : "expense"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </strong>

        <div className="transaction-actions">
          <button
            type="button"
            className="edit-btn"
            onClick={() => onEdit(transaction)}
            aria-label={`Edit ${transaction.title}`}
          >
            ✏️ Edit
          </button>

          <button
            type="button"
            className="delete-btn"
            onClick={() => onDelete(transaction)}
            aria-label={`Delete ${transaction.title}`}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionItem;
