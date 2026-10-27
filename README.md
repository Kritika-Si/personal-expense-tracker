# 💜 Personal Expense Tracker

A full-stack personal finance dashboard built to help users track income, manage expenses, and understand their spending habits through interactive visualizations and monthly summaries.

**🌐 Live Demo:** [View Personal Expense Tracker](https://personal-expense-tracker-quxk.onrender.com)  
**📂 GitHub Repository:** [personal-expense-tracker](https://github.com/Kritika-Si/personal-expense-tracker)

---

## ✨ Features

- **Financial Dashboard:** View total income, total expenses, current balance, and transaction count.
- **Transaction Management:** Add, view, edit, and delete financial transactions.
- **Monthly Filtering:** Filter transactions by month and year.
- **Search & Filters:** Find transactions by title and filter by category or transaction type.
- **Interactive Visualizations:** Analyze expense distribution by category and compare income with expenses.
- **CSV Export:** Export transaction data for further analysis.
- **Light & Dark Themes:** Switch between themes with saved theme preferences.
- **Form Validation:** Validate transaction details and display success or error messages.
- **Responsive Interface:** Access the dashboard on desktop and mobile devices.
- **REST API Integration:** Connect the frontend to a FastAPI backend for transaction operations.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend development |
| Vite | Development server and build tool |
| Python | Backend programming |
| FastAPI | REST API development |
| SQLite | Database management |
| Recharts | Interactive charts and data visualization |
| CSS | Styling and responsive layouts |
| Git & GitHub | Version control and source code management |
| Render | Application deployment |

## 📸 Screenshots

Add screenshots of your dashboard here to showcase its design and functionality. Screenshots of both light and dark themes can help demonstrate the interface.

## 📁 Project Structure

```text
personal-expense-tracker/
├── backend/
│   ├── routers/
│   │   └── transactions.py
│   ├── database.py
│   ├── main.py
│   └── schemas.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── .env.production
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── requirements.txt
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

- Python 3.10 or later
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Kritika-Si/personal-expense-tracker.git
cd personal-expense-tracker
```

### 2. Set Up the Backend

Create and activate a virtual environment using Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install the Python dependencies:

```powershell
pip install -r requirements.txt
```

Start the backend server from the project root:

```powershell
uvicorn backend.main:app --reload
```

The backend will run at `http://127.0.0.1:8000`.

Interactive API documentation is available at `http://127.0.0.1:8000/docs`.

### 3. Set Up the Frontend

Open
