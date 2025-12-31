# Doctor Appointment API

Production-ready FastAPI backend for managing doctor appointments with JWT authentication and RBAC.

## Features
- User registration and login for Doctors and Patients
- JWT-protected routes with role checks
- Doctors manage availability and view upcoming appointments
- Patients browse doctors, view availability, book, and cancel appointments
- Double-booking prevention and availability enforcement
- Async SQLAlchemy with PostgreSQL (Docker) or SQLite (default) support
- Pytest coverage for auth and booking flows

## Getting Started

### Prerequisites
- Python 3.12+
- Docker & Docker Compose (recommended for Postgres)

### Local Development (SQLite default)
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`.

### Running with Docker Compose (PostgreSQL)
```bash
docker-compose up --build
```
Environment variables can be set to override defaults:
- `DATABASE_URL` (e.g., `postgresql+asyncpg://doctor:doctor@db:5432/doctor_appointments`)
- `SECRET_KEY` for JWT signing

## Authentication & RBAC
- Register via `POST /auth/register` with role `doctor` or `patient`.
- Login via `POST /auth/login` (OAuth2 Password flow) to receive a Bearer token.
- Include `Authorization: Bearer <token>` on protected requests.
- Role enforcement:
  - Doctors: manage availability, view their appointments.
  - Patients: book and cancel their own appointments.

## Key Endpoints
- `POST /auth/register` — Create a user
- `POST /auth/login` — Obtain JWT
- `POST /auth/forgot-password` — Mock reset flow
- `GET /doctors` — List doctors
- `GET /doctors/{id}/availability` — Doctor availability
- `POST /doctors/availability` — (Doctor) Set availability
- `GET /doctors/me/appointments` — (Doctor) Upcoming appointments
- `POST /appointments` — (Patient) Book appointment
- `GET /appointments` — List current user's appointments
- `DELETE /appointments/{id}` — Cancel own appointment

## Testing
```bash
pytest
```

## Project Layout
```
app/
  core/           # settings, security, dependencies
  db/             # engine and base
  models/         # SQLAlchemy models
  schemas/        # Pydantic request/response models
  repositories/   # data access layer
  services/       # business logic
  routers/        # FastAPI routers
  main.py         # application entrypoint
```
