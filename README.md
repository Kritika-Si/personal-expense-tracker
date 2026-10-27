# 💜 Personal Expense Tracker

A full-stack personal finance dashboard built to help users track income, manage expenses, and understand their spending habits through interactive visualizations and monthly summaries.

🌐 **Live Demo:** [View Personal Expense Tracker](https://personal-expense-tracker-quxk.onrender.com)

📁 **GitHub Repository:** [personal-expense-tracker](https://github.com/Kritika-Si/personal-expense-tracker)

## ✨ Features

- **Financial Dashboard:** View total income, total expenses, current balance, and transaction count.
- **Transaction Management:** Add, view, edit, and delete financial transactions.
- **Monthly Filtering:** Filter transactions by month and year.
- **Search & Filters:** Search transactions by title and filter by category or transaction type.
- **Interactive Charts:** Visualize expense distribution by category and compare income with expenses.
- **Responsive Design:** Use the dashboard on desktop and mobile devices.
- **Form Validation:** Receive validation and success/error messages.
- **REST API Integration:** Connect the React frontend to a FastAPI backend.
- **SQLite Database:** Store transaction records in a database.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development and build tool |
| Python | Backend programming |
| FastAPI | REST API development |
| SQLite | Database |
| Recharts | Data visualization |
| CSS | Styling and responsive layout |
| Git & GitHub | Version control |
| Render | Deployment |

## 📸 Screenshots

_Add screenshots of the application here._

## 📂 Project Structure

```text
personal-expense-tracker/
├── backend/
│   ├── routers/
│   ├── database.py
│   ├── main.py
│   ├── schemas.py
│   └── expenses.db
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env.production
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── requirements.txt
└── README.md
```

## 🚀 Run Locally

### Prerequisites

- Python 3.12 or compatible version
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Kritika-Si/personal-expense-tracker.git
cd personal-expense-tracker
```

### 2. Set up the backend

Create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn backend.main:app --reload
```

The backend API runs at `http://127.0.0.1:8000`.

Interactive API documentation: `http://127.0.0.1:8000/docs`

### 3. Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend` folder with:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually `http://localhost:5173`.

## 🌍 Deployment

- **Frontend:** Deployed on Render.
- **Backend:** Deployed on Render.
- **Database:** SQLite.

Note: The deployed SQLite database may not retain data across restarts or redeployments unless persistent storage is configured.

## 📚 Key Learnings

- Building a full-stack application using React and FastAPI.
- Designing and integrating REST APIs.
- Managing transaction data with SQLite.
- Creating interactive charts and financial summaries.
- Implementing search, filtering, and CRUD operations.
- Deploying a full-stack application using Render.
- Using Git and GitHub for version control.

## 👩‍💻 Author

**Kritika Kumari**

B.Tech CSE — Artificial Intelligence & Data Science

[GitHub](https://github.com/Kritika-Si) · [LinkedIn](https://www.linkedin.com/)