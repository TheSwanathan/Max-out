# Max-out

Max-out is a React + FastAPI lifting tracker. The simplest local setup uses:

- Frontend: Vite on `http://127.0.0.1:5173`
- Backend: FastAPI on `http://127.0.0.1:8001`
- Database: local SQLite file at `backend/maxout.db`

This is the recommended setup for running the project on another developer's computer.

## Requirements

- Node.js 20+
- Python 3.11

## Local Setup

If you prefer, you can use the included `Makefile`:

```bash
make backend-setup
make frontend-setup
make backend-dev
make frontend-dev
```

Or run the commands manually below.

### 1. Backend

```bash
cd backend
cp .env.example .env
python3.11 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8001
```

The backend automatically loads `backend/.env`. By default it uses SQLite:

```env
DATABASE_URL=sqlite:///./maxout.db
```

### 2. Frontend

In a second terminal:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

The frontend env points to the local backend:

```env
VITE_API_URL=http://127.0.0.1:8001
```

## Optional Docker Setup

`docker-compose.yml` is still available for a Postgres-based environment, but it is separate from the recommended local SQLite setup above.
