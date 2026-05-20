FastAPI Production Backend 🚀

A high-performance, production-ready backend built with **FastAPI**, following strict **SOLID** architecture patterns and optimized for modern cloud deployments and AI/ML processing layers.

---

## ⚡ Core Tech Stack

- **Runtime & Package Management:** [uv](https://github.com/astral-sh/uv) (Blazing fast Python package manager written in Rust).
- **Web Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Asynchronous, high-performance API framework).
- **Database Layer:** [SQLAlchemy 2.0](https://www.sqlalchemy.org/) (Async engine) + [asyncpg](https://github.com/MagicStack/asyncpg) (PostgreSQL client).
- **Migrations:** [Alembic](https://alembic.sqlalchemy.org/) for database schema evolution management.
- **Background Tasks:** [arq](https://github.com/samuelcolvin/arq) (Redis-based heavy asynchronous task worker).
- **Code Quality:** [Ruff](https://github.com/astral-sh/ruff) (Linter/Formatter) + [Mypy](https://mypy-lang.org/) (Strict static typing).
- **Logging:** [structlog](https://www.structlog.org/) for production-ready JSON structured logging.

---

## 📂 Architecture Overview

The codebase is strictly separated into decoupled layers to maintain a maintainable, testable, and scalable architecture:

```text
app/
├── api/
│   └── v1/
│       ├── endpoints/     # HTTP controllers / Route handlers (Request/Response only)
│       └── api_router.py  # Central V1 endpoint aggregator
├── core/                  # Security (JWT, Hashing), Config (Pydantic-settings), Exceptions
├── db/                    # DB Engine creation and Async Session generator
├── models/                # SQLAlchemy ORM declarative models
├── repositories/          # Data Access Layer (Strictly encapsulates raw DB/SQL queries)
├── schemas/               # Pydantic core data schemas and serialization models
├── services/              # Domain Business Logic (Decoupled from HTTP, DB, and external APIs)
└── main.py                # ASGI application root entry point
```

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
Ensure you have **`uv`** installed globally on your machine:
```bash
# On macOS/Linux
curl -LsSf https://astral-sh.uv.run/install.sh | sh

# On Windows
powershell -c "irm https://astral-sh.uv.run/install.ps1 | iex"
```

### 2. Environment Initialization
Inside this backend folder, initialize the virtual environment and sync your locked dependencies:
```bash
# Create the .venv using the pinned python version
uv venv

# Sync dependencies and lockfile
uv pip sync
```

### 3. Environment Variables
Copy the template and fill out your local configuration details (database, keys, secret tokens):
```bash
cp .env.example .env
```

### 4. Run Databases with Docker
Launch the pre-configured PostgreSQL and Redis servers via Docker Compose:
```bash
docker compose up -d
```

### 5. Run Database Migrations
Apply the structural migrations to your database using Alembic:
```bash
# Upgrade database to the latest schema version
uv run alembic upgrade head
```

### 6. Start the Applications

#### Start the API server:
```bash
uv run fastapi dev app/main.py
```
* Your API will be live at `http://localhost:8000`
* Interactive API Documentation will be available at `http://localhost:8000/docs`

#### Start the Background Task Worker (Optional - if `arq` was selected):
```bash
uv run arq app.core.worker.WorkerSettings
```

---

## 🛡️ Code Quality & Testing

Keep the codebase clean, stable, and strictly typed with these utility scripts:

```bash
# Run Ruff to find linting errors and auto-fix formatting
uv run ruff check . --fix
uv run ruff format .

# Run Type Checking
uv run mypy .

# Run Testing Suite (Pytest)
uv run pytest
```

---

## 📦 Adding New Dependencies

To add or manage libraries, always rely on **`uv`** for instantaneous resolution:
```bash
# Example: Adding a new utility library
uv add httpx

# Example: Adding a development dependency (like a test mock)
uv add --dev pytest-mock
```