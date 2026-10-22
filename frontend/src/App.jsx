
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>💰 Personal Expense Tracker</h1>
        <p>Manage your income, expenses, and savings in one place.</p>
      </header>

      <main className="dashboard">
        <section className="summary-section">
          <div className="summary-card income">
            <h3>Total Income</h3>
            <h2>₹0.00</h2>
          </div>

          <div className="summary-card expense">
            <h3>Total Expenses</h3>
            <h2>₹0.00</h2>
          </div>

          <div className="summary-card balance">
            <h3>Current Balance</h3>
            <h2>₹0.00</h2>
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
