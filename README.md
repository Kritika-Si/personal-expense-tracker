# 💜 Personal Expense Tracker

A full-stack personal finance dashboard to track income, manage expenses, and understand spending habits through interactive charts and monthly summaries.

🔗 **Live Demo:** https://personal-expense-tracker-quxk.onrender.com  
📂 **GitHub Repository:** https://github.com/Kritika-Si/personal-expense-tracker

## ✨ Features

- **Dashboard Overview** — View total income, total expenses, balance, and transaction count.
- **Transaction Management** — Add, edit, view, and delete transactions.
- **Monthly Filtering** — Filter transactions by month and year.
- **Search and Filters** — Search transactions and filter by category or transaction type.
- **Interactive Charts** — Visualize expense distribution and compare income with expenses.
- **CSV Export** — Export transaction data for further analysis.
- **Light and Dark Mode** — Switch between themes with saved theme preferences.
- **Form Validation** — Validate transaction details and display feedback messages.
- **Responsive Design** — Use the dashboard on desktop and mobile devices.
- **REST API** — Manage transaction data through a FastAPI backend.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| Vite | Development server and build tool |
| Python | Backend programming |
| FastAPI | REST API |
| SQLite | Database |
| Recharts | Data visualization |
| CSS | Styling and responsive design |
| Git & GitHub | Version control |
| Render | Deployment |

## 📊 Dashboard

The dashboard brings income, expenses, transaction history, and spending visualizations together in one place.

**Main capabilities:**
- Summary cards for financial insights
- Expense breakdown by category
- Income versus expense comparison
- Transaction history with search and filters

> 📸 **Screenshots:** Add screenshots of your dashboard here to showcase the interface. Include both light and dark themes if possible.

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

## ⚙️ Run Locally

### Prerequisites

- Python 3.10 or later
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Kritika-Si/personal-expense-tracker.git
cd personal-expense-tracker
```

### 2. Set up the backend

Create and activate a virtual environment.

**Windows PowerShell:**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Start the backend from the project root:

```powershell
uvicorn backend.main:app --reload
```

Backend URL: http://127.0.0.1:8000

Interactive API documentation: http://127.0.0.1:8000/docs

### 3. Set up the frontend

Open a second terminal:

```powershell
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend` directory with:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the development server:

```powershell
npm run dev
```

Open the local URL displayed by Vite, usually http://localhost:5173.

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions/` | Retrieve transactions |
| POST | `/api/transactions/` | Create a transaction |
| PATCH | `/api/transactions/{transaction_id}` | Update a transaction |
| DELETE | `/api/transactions/{transaction_id}` | Delete a transaction |
| GET | `/api/transactions/summary` | Retrieve financial summary |
| GET | `/` | Check the API home endpoint |

## 🚀 Deployment

The application is deployed on Render using separate services:

- **Frontend:** Render Static Site
- **Backend:** Render Web Service

The frontend uses `VITE_API_URL` to connect to the deployed backend API.

## 🎯 What I Learned

- Building a full-stack application with React and FastAPI
- Designing and connecting REST API endpoints
- Working with SQLite and database operations
- Managing application state and form validation
- Creating interactive charts using Recharts
- Implementing responsive UI and persistent theme preferences
- Configuring environment variables and deploying a full-stack application

## 🔮 Future Improvements

- Persistent cloud database for reliable data storage
- User authentication and individual financial accounts
- Monthly budgets and savings goals
- Advanced spending analytics and reports
- Automated recurring transaction support

## 👩‍💻 Author

**Kritika Kumari**

- GitHub: https://github.com/Kritika-Si

---

⭐ If you find this project useful, consider giving the repository a star.
