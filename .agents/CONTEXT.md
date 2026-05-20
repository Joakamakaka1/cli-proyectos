---
name: cli-projects
description: >
  Architectural blueprint and current state of cli-projects: an interactive
  Node.js CLI that scaffolds production-ready FastAPI and Next.js projects.
  Read this file before starting any task in this repository.
---

# Project Summary: Modular Initialization CLI (KISS/SOLID)

We are building a development tools ecosystem divided into **three independent but connected projects**. The objective is to automate the creation of production-ready projects with high industry standards (2026), strict typing, extreme speed, and clean architecture, avoiding repetitive configurations.

We are currently focused on the development of the first project: **`cli-projects`**.

---

## 1. System Architecture (The 3 Legs)
1. **`cli-projects` (Current development):** Interactive CLI tool built in Node.js with `pnpm` that clones professional base templates (Frontend and Backend) according to user choices in the terminal.
2. **`cli-pipelines` (Next step):** Independent tool that generates optimized CI/CD workflows (GitHub Actions). The project CLI invokes it automatically at the end of its execution via `pnpm dlx` if requested by the user.
3. **Software Architecture Templates:** The base folder structures (`templates/`) that the CLI injects (FastAPI for Backend, Next.js for Frontend).

---

## 2. Current Status of `cli-projects`

### CLI Technologies:
* **Environment:** Node.js (>=20) with Pure JavaScript (**CJS — CommonJS**, `require()`) managed with **`pnpm`**.
* **Published binary name:** `cli-projects` (defined in `package.json#bin`).
* **Core Dependencies:** `prompts` (terminal interactivity) and `fs-extra` (file system manipulation).
* **Quality and Testing (DevDependencies):** `@biomejs/biome` (ultra-fast linter and formatter in Rust) and `vitest` (for unit testing).

### Script Execution Flow (`src/index.js`):
1. Prompts for the project type to create (FastAPI Backend or Next.js Frontend).
2. Prompts for the desired Python version (3.12, 3.13, 3.14).
3. Displays an **interactive checklist** of optional professional libraries.
4. Clones the base template, pins the Python version, and natively invokes **`uv`** (Python package manager in Rust) to initialize the environment and run `uv add` hot with the selected libraries.
5. Prompts whether to integrate pipelines. If the user answers "Yes", it runs under the hood: `pnpm dlx tu-cli-pipelines add --target=[path]`.

---

## 3. Technical Stack of the Generated Backend (FastAPI)
The Backend template (`templates/backend/`) follows a **pure, decoupled SOLID design**, ideal for AI/Machine Learning projects:

* **Folder Structure:** Rigorously separated into `api/v1/endpoints/`, `core/` (security and config), `db/` (session), `models/` (ORM tables), `schemas/` (Pydantic), `repositories/` (flat data access), and `services/` (business logic/LLMs).
* **Chosen Industry-Standard Libraries:**
    * **`uv` & `ruff` & `mypy`**: For environment management, linting, and strict typing.
    * **`pydantic-settings`**: For robust and typed validation of `.env` files (instead of flat `dotenv`).
    * **`sqlalchemy` (2.0) & `asyncpg`**: For native asynchronous access to PostgreSQL.
    * **`alembic`**: For database migrations and version control.
    * **`arq`**: For heavy background task processing (async workers).
    * **`structlog`**: For structured JSON logs ready for production.
    * **`python-jose` + `passlib[bcrypt]`**: For security and JWT tokens.
* **Status:** It features a base `/health` endpoint (validated with Pydantic schemas) and a centralized router integrated into `app/main.py`.

---

## 4. CI/CD Infrastructure for the CLI Repository
To protect the `cli-projects` code before pushing to GitHub or publishing to NPM, two independent workflows have been designed in `.github/` using **pnpm**:

1. **`ci-pr.yml` (Pull Request Phase):** Checks out code, installs dependencies with `pnpm install --frozen-lockfile`, and runs the Linter (`biome`) and Unit Tests (`vitest`). Blocks the merge if anything fails.
2. **`cd-deploy.yml` (Merge to `main` Phase):** Executes a **Smoke Test** by spinning up the CLI live in a clean environment, simulating the real creation of a full Backend project and a full Frontend project. If both structures are successfully generated, it triggers automatic cloud publishing via `pnpm publish`.

---

## 5. Current Repository Structure

Below is the exact snapshot of the workspace filesystem. Use this map to safely read or inject code into templates, workflows, or source targets.

```text
cli-projects/
├── .agents/
│   ├── CONTEXT.md                 # Project context and architectural blueprint (this file)
│   ├── RULES.md                   # Development guidelines and behavioral standards
│   └── SKILL-release.md           # Step-by-step release workflow
├── .github/                       # ⚠️ PLANNED — not yet created
│   └── workflows/
│       ├── cd-deploy.yml          # CD: Smoke tests and live NPM publishing pipeline
│       └── ci-pr.yml              # CI: Linter and unit testing pipeline for PRs
├── src/
│   └── index.js                   # CLI core orchestrator (CJS, published to NPM as `cli-projects`)
├── templates/
│   ├── backend/                   # FastAPI Backend boilerplate (SOLID architecture)
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── deps.py
│   │   │   │   └── v1/
│   │   │   │       ├── endpoints/
│   │   │   │       │   └── health.py
│   │   │   │       └── api_router.py
│   │   │   ├── core/
│   │   │   │   ├── config.py
│   │   │   │   ├── exceptions.py
│   │   │   │   └── security.py
│   │   │   ├── db/
│   │   │   │   └── session.py
│   │   │   ├── models/
│   │   │   │   └── __init__.py
│   │   │   ├── repositories/
│   │   │   │   └── __init__.py
│   │   │   ├── schemas/
│   │   │   │   ├── __init__.py
│   │   │   │   └── health.py
│   │   │   ├── services/
│   │   │   │   └── __init__.py
│   │   │   └── main.py
│   │   ├── scripts/
│   │   ├── tests/
│   │   ├── .env.example
│   │   ├── .gitignore
│   │   ├── .python-version        # uv Python version pin
│   │   ├── docker-compose.yml
│   │   ├── Dockerfile
│   │   └── pyproject.toml
│   └── frontend/                  # Next.js Frontend boilerplate (App Router + TypeScript)
│       ├── app/
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── public/
│       ├── .gitignore
│       ├── eslint.config.mjs
│       ├── next.config.ts
│       ├── package.json
│       ├── postcss.config.mjs
│       ├── README.md
│       └── tsconfig.json
├── .gitignore
├── new_release.ps1                # PowerShell: creates annotated git tag from current version
├── new_version.ps1                # PowerShell: bumps package.json version + conventional commit
├── package.json                   # CLI config, bin, scripts, dependencies
├── pnpm-lock.yaml                 # Lockfile
└── README.md