
import { useState } from "react";

function AddTransactionForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    transaction_type: "expense",
    date: new Date().toLocaleDateString("en-CA"),
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/transactions/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            title: formData.title.trim(),
            amount: Number(formData.amount),
            notes: formData.notes.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>Add New Transaction</h2>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close form"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="transaction-title">Title</label>
          <input
            id="transaction-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Grocery shopping"
            required
          />

          <label htmlFor="transaction-amount">Amount (₹)</label>
          <input
            id="transaction-amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            placeholder="Enter amount"
            required
          />

          <label htmlFor="transaction-type">Transaction Type</label>
          <select
            id="transaction-type"
            name="transaction_type"
            value={formData.transaction_type}
            onChange={handleChange}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <label htmlFor="transaction-category">Category</label>
          <select
            id="transaction-category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Education">Education</option>
            <option value="Bills">Bills</option>
            <option value="Others">Others</option>
          </select>

          <label htmlFor="transaction-date">Date</label>
          <input
            id="transaction-date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <label htmlFor="transaction-notes">Notes (Optional)</label>
          <textarea
            id="transaction-notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any additional details..."
            rows="3"
          />

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransactionForm;
