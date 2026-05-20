# cli-projects 🚀

An ultra-fast, modern, and interactive CLI tool designed to scaffold production-ready fullstack applications using **FastAPI** (Backend) and **Next.js** (Frontend) following strict **KISS** and **SOLID** principles.

---

## 🏗️ System Architecture

This CLI is part of a 3-legged ecosystem engineered for rapid, robust development:
1. **`cli-projects` (This repository):** The core orchestrator that prompts developers and scaffolds identical workspace architectures.
2. **`cli-pipelines` (Next step):** An independent companion CLI that injects modular, secure CI/CD workflows (`.github/workflows/`) on demand.
3. **Production Boilerplates:** Pure, decoupled templates featuring `uv` for Python and `pnpm` for Node.

---

## ⚡ Key Features

- **Blazing Fast Python Management:** Natively hooks into **`uv`** (written in Rust) to manage Python versions and environments instantly.
- **Modern Backend Stack:** Scaffolds a FastAPI architecture pre-configured with async SQLAlchemy 2.0, Postgres via `asyncpg`, validation via Pydantic, background workers via `arq`, and structured logging.
- **Modern Frontend Stack:** Scaffolds a Next.js environment featuring App Router, TypeScript, and optimized asset delivery.
- **Interactive Checklist:** Pick and choose only the libraries your specific project needs—no bloated code.

---

## 🛠️ Installation & Usage

You don't even need to install it globally. Run it directly using **pnpm** (recommended), npm, or bun:

```bash
# Using pnpm
pnpm dlx cli-projects

# Using npm
npx cli-projects

# Using bun
bunx cli-projects