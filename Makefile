PYTHON ?= python3.11

.PHONY: backend-setup backend-dev frontend-setup frontend-dev

backend-setup:
	cd backend && cp -n .env.example .env || true
	cd backend && $(PYTHON) -m venv .venv
	cd backend && .venv/bin/pip install -r requirements.txt

backend-dev:
	cd backend && .venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8001

frontend-setup:
	cd frontend && cp -n .env.example .env.local || true
	cd frontend && npm install

frontend-dev:
	cd frontend && npm run dev -- --host 127.0.0.1 --port 5173
