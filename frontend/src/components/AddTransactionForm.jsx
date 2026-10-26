import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function getTodayDate() {
  const now = new Date();
  const localDate = new Date(
    now.getTime() - now.getTimezoneOffset() * 60 * 1000
  );

  return localDate.toISOString().slice(0, 10);
}

function getErrorMessage(errorData, fallback) {
  if (typeof errorData?.detail === "string") {
    return errorData.detail;
  }

  if (Array.isArray(errorData?.detail)) {
    return errorData.detail
      .map((item) => item.msg)
      .filter(Boolean)
      .join(". ");
  }

  return fallback;
}

function AddTransactionForm({ onClose, onSuccess, transaction = null }) {
  const isEditing = transaction !== null;

  const [formData, setFormData] = useState({
    title: transaction?.title ?? "",
    amount: transaction?.amount ?? "",
    category: transaction?.category ?? "Food",
    transaction_type: transaction?.transaction_type ?? "expense",
    date: transaction?.date ?? getTodayDate(),
    notes: transaction?.notes ?? "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      return "Please enter a transaction title.";
    }

    if (formData.title.trim().length > 100) {
      return "The title must be 100 characters or fewer.";
    }

    const amount = Number(formData.amount);

    if (
      formData.amount === "" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return "Please enter an amount greater than zero.";
    }

    if (!["income", "expense"].includes(formData.transaction_type)) {
      return "Please select a valid transaction type.";
    }

    if (!formData.category.trim()) {
      return "Please select a category.";
    }

    if (!formData.date || !/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
      return "Please select a valid transaction date.";
    }

    const [, year, month, day] = formData.date.match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    ) || [];

    if (!year || !month || !day) {
      return "Please select a valid transaction date.";
    }

    const date = new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day))
    );

    if (
      date.getUTCFullYear() !== Number(year) ||
      date.getUTCMonth() !== Number(month) - 1 ||
      date.getUTCDate() !== Number(day)
    ) {
    return "Please enter a real calendar date.";
  }

    if (formData.notes.length > 500) {
      return "Notes must be 500 characters or fewer.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const url = isEditing
        ? `${API_URL}/api/transactions/${transaction.id}`
        : `${API_URL}/api/transactions/`;

      const method = isEditing ? "PATCH" : "POST";

      let response;

      try {
        response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            title: formData.title.trim(),
            amount: Number(formData.amount),
            notes: formData.notes.trim(),
          }),
        });
      } catch {
        throw new Error(
          "Unable to connect to the server. Please check that the backend is running and try again."
        );
      }

      if (!response.ok) {
        let errorData = null;

        try {
          errorData = await response.json();
        } catch {
          // The server may return an empty or non-JSON error response.
        }

        const fallback = isEditing
          ? "Could not update the transaction. Please try again."
          : "Could not save the transaction. Please try again.";

        throw new Error(getErrorMessage(errorData, fallback));
      }

      onSuccess();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay">
      <div
        className="form-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-form-heading"
      >
        <div className="form-header">
          <h2 id="transaction-form-heading">
            {isEditing ? "Edit Transaction" : "Add New Transaction"}
          </h2>

          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close form"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="transaction-title">Title</label>
          <input
            id="transaction-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Grocery shopping"
            maxLength={100}
            required
            disabled={loading}
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
            disabled={loading}
          />

          <label htmlFor="transaction-type">Transaction Type</label>
          <select
            id="transaction-type"
            name="transaction_type"
            value={formData.transaction_type}
            onChange={handleChange}
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          />

          <label htmlFor="transaction-notes">Notes (Optional)</label>
          <textarea
            id="transaction-notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any additional details..."
            rows="3"
            maxLength={500}
            disabled={loading}
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
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Update Transaction"
                  : "Save Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransactionForm;
