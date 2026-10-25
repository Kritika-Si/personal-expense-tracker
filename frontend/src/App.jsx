
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";

import AddTransactionForm from "./components/AddTransactionForm";
import TransactionItem from "./components/TransactionItem";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

const CHART_COLORS = [
  "#8b5cf6",
  "#f59e0b",
  "#10b981",
  "#ec4899",
  "#06b6d4",
  "#a78bfa",
];

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
}

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("expense-tracker-theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("expense-tracker-theme", theme);
  }, [theme]);

  const [summary, setSummary] = useState({
    total_income: 0,
    total_expenses: 0,
    balance: 0,
    total_transactions: 0,
  });

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchSummary() {
      setLoading(true);

      try {
        const query = selectedMonth
          ? (() => {
              const [year, month] = selectedMonth.split("-");
              return `?month=${Number(month)}&year=${Number(year)}`;
            })()
          : "";

        const response = await fetch(
          `${API_URL}/api/transactions/summary${query}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard summary");
        }

        const data = await response.json();

        if (!cancelled) {
          setSummary(data);
          setError("");
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSummary();
    return () => {
      cancelled = true;
    };
  }, [selectedMonth, refreshKey]);

  useEffect(() => {
    let cancelled = false;

    async function fetchTransactions() {
      setTransactionsLoading(true);

      try {
        const query = selectedMonth
          ? (() => {
              const [year, month] = selectedMonth.split("-");
              return `?month=${Number(month)}&year=${Number(year)}`;
            })()
          : "";

        const response = await fetch(`${API_URL}/api/transactions/${query}`);

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();

        if (!cancelled) {
          setTransactions(data);
          setError("");
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setTransactionsLoading(false);
      }
    }

    fetchTransactions();
    return () => {
      cancelled = true;
    };
  }, [selectedMonth, refreshKey]);

  const categories = [
    ...new Set(
      transactions.map((transaction) => transaction.category || "Others")
    ),
  ].sort();

  const filteredTransactions = transactions.filter((transaction) => {
    const title = String(transaction.title || "").toLowerCase();
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch = title.includes(search);
    const category = transaction.category || "Others";

    const matchesCategory =
      !selectedCategory || category === selectedCategory;

    const matchesType =
      !selectedType || transaction.transaction_type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedType("");
  };

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedCategory !== "" ||
    selectedType !== "";

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      setError("There are no matching transactions to export.");
      return;
    }

    const headers = ["ID", "Title", "Category", "Type", "Amount", "Date"];

    const escapeCSV = (value, protectFormula = false) => {
      let text = String(value ?? "");

      if (
        protectFormula &&
        /^[\s\u0000-\u001F]*[=+\-@]/.test(text)
      ) {
        text = `'${text}`;
      }

      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = filteredTransactions.map((transaction) => [
      transaction.id,
      transaction.title,
      transaction.category || "Others",
      transaction.transaction_type,
      transaction.amount,
      transaction.date ?? "",
    ]);

    const csvContent = [
      headers.map((header) => escapeCSV(header)).join(","),
      ...rows.map((row) =>
        row
          .map((value, index) =>
            escapeCSV(value, [1, 2, 3, 5].includes(index))
          )
          .join(",")
      ),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF", csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `transactions-${selectedMonth || "all-months"}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const refreshDashboard = () => {
    setRefreshKey((previous) => previous + 1);
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleTransactionSaved = () => {
    handleCloseForm();
    refreshDashboard();
  };

  const handleDelete = async (transaction) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${transaction.title}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/transactions/${transaction.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      refreshDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatCurrency = (amount) =>
    Number(amount).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });

  const categoryTotals = transactions
    .filter((transaction) => transaction.transaction_type === "expense")
    .reduce((totals, transaction) => {
      const category = transaction.category || "Others";
      totals[category] =
        (totals[category] || 0) + Number(transaction.amount);
      return totals;
    }, {});

  const expenseChartData = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .filter((item) => item.value > 0);

  const comparisonData = [
    {
      name: "Income",
      amount: Number(summary.total_income),
      fill: "#10b981",
    },
    {
      name: "Expenses",
      amount: Number(summary.total_expenses),
      fill: "#f472b6",
    },
  ];

  const monthLabel = selectedMonth
    ? new Date(`${selectedMonth}-15T12:00:00`).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "All Months";

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div className="header-spacer" aria-hidden="true" />

          <div className="header-title">
            <h1>💜 Personal Expense Tracker</h1>
            <p>Manage your income, expenses, and savings in one place.</p>
          </div>

          <button
            type="button"
            className="theme-toggle"
            onClick={() =>
              setTheme((current) => (current === "light" ? "dark" : "light"))
            }
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
      </header>

      <main className="dashboard">
        {error && (
          <p role="alert" className="error-message">
            Error: {error}
          </p>
        )}

        <section className="month-filter-section">
          <div className="month-filter-heading">
            <h2>Dashboard Overview</h2>
            <p>Currently viewing: {monthLabel}</p>
          </div>

          <div className="month-filter-controls">
            <label htmlFor="month-filter">Select month</label>
            <input
              id="month-filter"
              type="month"
              value={selectedMonth}
              onChange={(event) => {
                setError("");
                setSelectedMonth(event.target.value);
              }}
            />

            <button
              type="button"
              className="all-months-btn"
              onClick={() => {
                setError("");
                setSelectedMonth("");
              }}
              disabled={!selectedMonth}
            >
              Show All Months
            </button>
          </div>
        </section>

        <section className="summary-section">
          <div className="summary-card income">
            <h3>Total Income</h3>
            <h2>{loading ? "Loading..." : formatCurrency(summary.total_income)}</h2>
          </div>

          <div className="summary-card expense">
            <h3>Total Expenses</h3>
            <h2>{loading ? "Loading..." : formatCurrency(summary.total_expenses)}</h2>
          </div>

          <div className="summary-card balance">
            <h3>Current Balance</h3>
            <h2>{loading ? "Loading..." : formatCurrency(summary.balance)}</h2>
          </div>
        </section>

        <section className="analytics-section">
          <h2>Expense Breakdown by Category</h2>

          {transactionsLoading ? (
            <p className="empty-message">Loading expense chart...</p>
          ) : expenseChartData.length === 0 ? (
            <p className="empty-message">
              No expenses available for {monthLabel}. Add an expense to see
              your category breakdown.
            </p>
          ) : (
            <div className="expense-chart">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={expenseChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    paddingAngle={3}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {expenseChartData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="analytics-section">
          <h2>Income vs Expenses — {monthLabel}</h2>

          {loading ? (
            <p className="empty-message">Loading comparison chart...</p>
          ) : summary.total_transactions === 0 ? (
            <p className="empty-message">
              No transactions available for {monthLabel}.
            </p>
          ) : (
            <div className="expense-chart">
              <ResponsiveContainer width="100%" height={340}>
                <BarChart
                  data={comparisonData}
                  margin={{ top: 30, right: 25, left: 15, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="var(--border-color)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "var(--text-secondary)", fontSize: 14 }}
                    axisLine={{ stroke: "var(--border-color)" }}
                    tickLine={false}
                  />
                  <YAxis
                    width={85}
                    tickFormatter={(value) =>
                      `₹${Number(value).toLocaleString("en-IN")}`
                    }
                    tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    domain={[
                      0,
                      (dataMax) => (dataMax > 0 ? dataMax * 1.2 : 100),
                    ]}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), "Amount"]}
                    contentStyle={{
                      backgroundColor: "var(--surface)",
                      color: "var(--text-primary)",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                    }}
                  />
                  <Bar
                    dataKey="amount"
                    name="Amount"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={90}
                  >
                    {comparisonData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                    <LabelList
                      dataKey="amount"
                      position="top"
                      formatter={(value) => formatCurrency(value)}
                      style={{
                        fill: "var(--text-primary)",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="transactions-section">
          <div className="section-header">
            <h2>Transactions — {monthLabel}</h2>

            <div className="transaction-actions">
              <button
                type="button"
                className="export-btn"
                onClick={handleExportCSV}
                disabled={
                  transactionsLoading || filteredTransactions.length === 0
                }
              >
                Export CSV
              </button>

              <button className="add-btn" onClick={handleAdd}>
                + Add Transaction
              </button>
            </div>
          </div>

          <div className="transaction-filters">
            <div className="filter-control">
              <label htmlFor="transaction-search">Search by title</label>
              <input
                id="transaction-search"
                type="search"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="filter-control">
              <label htmlFor="category-filter">Filter by category</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-control">
              <label htmlFor="type-filter">Filter by type</label>
              <select
                id="type-filter"
                value={selectedType}
                onChange={(event) => setSelectedType(event.target.value)}
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <button
              type="button"
              className="all-months-btn"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              Clear Filters
            </button>
          </div>

          {!transactionsLoading && transactions.length > 0 && (
            <p className="filter-results-count">
              Showing {filteredTransactions.length} of {transactions.length}{" "}
              transactions
            </p>
          )}

          {transactionsLoading ? (
            <p className="empty-message">Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p className="empty-message">
              No transactions found for {monthLabel}.
            </p>
          ) : filteredTransactions.length === 0 ? (
            <p className="empty-message">
              No transactions match your search or filters. Try changing your
              filters or click Clear Filters.
            </p>
          ) : (
            <div className="transaction-list">
              {filteredTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  formatCurrency={formatCurrency}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {showForm && (
        <AddTransactionForm
          key={editingTransaction?.id ?? "new"}
          transaction={editingTransaction}
          onClose={handleCloseForm}
          onSuccess={handleTransactionSaved}
        />
      )}
    </div>
  );
}

export default App;
