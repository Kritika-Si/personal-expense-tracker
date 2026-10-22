
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expenses: 0,
    balance: 0,
    total_transactions: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch(
          `${API_URL}/api/transactions/summary`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard summary");
        }

        const data = await response.json();
        setSummary(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, []);

  const formatCurrency = (amount) =>
    Number(amount).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });

  return (
    <div className="app">
      <header className="app-header">
        <h1>💰 Personal Expense Tracker</h1>
        <p>Manage your income, expenses, and savings in one place.</p>
      </header>

      <main className="dashboard">
        {error && (
          <p role="alert" className="error-message">
            Error: {error}
          </p>
        )}

        <section className="summary-section">
          <div className="summary-card income">
            <h3>Total Income</h3>
            <h2>
              {loading ? "Loading..." : formatCurrency(summary.total_income)}
            </h2>
          </div>

          <div className="summary-card expense">
            <h3>Total Expenses</h3>
            <h2>
              {loading ? "Loading..." : formatCurrency(summary.total_expenses)}
            </h2>
          </div>

          <div className="summary-card balance">
            <h3>Current Balance</h3>
            <h2>
              {loading ? "Loading..." : formatCurrency(summary.balance)}
            </h2>
          </div>
        </section>

        <section className="transactions-section">
          <div className="section-header">
            <h2>Recent Transactions</h2>
            <button className="add-btn" disabled>
              + Add Transaction
            </button>
          </div>

          <p className="empty-message">
            No transactions yet. Start tracking your expenses!
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
