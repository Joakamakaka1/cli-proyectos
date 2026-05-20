---
name: project-rules
description: >
  Development standards, workflow protocols, and behavioral guidelines for
  cli-projects. Read after CONTEXT.md before starting any task.
---

# PROJECT RULES & GUIDELINES (RULES.md)

This document is the source of truth for development standards, architectural patterns, and workflow protocols. Read **CONTEXT.md** first for the architectural blueprint, then apply the rules below.

---

## 1. Engineering Principles
- **KISS (Keep It Simple, Stupid)**: Primary directive. If a task can be solved with a simple, readable implementation, do not use a complex design pattern.
- **SOLID**: Applied strictly in the backend template architecture. Any new layer (repository, service, endpoint) must respect the existing separation of concerns.
- **Robust & Scalable Code**: Resilient error handling and modular components. Each piece must be replaceable without cascading side-effects.
- **Best Practices**: Follow industry-standard naming, formatting, and documentation conventions.
- **Module System**: `src/index.js` is **CJS (CommonJS)**. Use `require()` / `module.exports`. Do not introduce ESM `import`/`export` syntax unless `"type": "module"` is added to `package.json`.

## 2. Git Workflow & Conventional Commits
To maintain a clean and searchable history, all contributors must follow these Git standards:

### Branching Strategy
- All new features or changes must be developed in branches following this naming convention:
  `feature/name-of-the-feature`

### Commit Message Format
We use **Conventional Commits** enhanced with emojis. Each commit must follow this structure:

Supported types (use `new_version.ps1` to automate):
- ✨ `feat:` New feature
- 🐛 `fix:` Bug fix
- 📝 `docs:` Documentation
- 💄 `style:` Styling / formatting
- ♻️ `refactor:` Code refactoring
- ⚡ `perf:` Performance improvement
- ✅ `test:` Tests
- 🏗️ `build:` Build system / dependencies
- 👷 `ci:` CI/CD configuration
- 🔧 `chore:` Maintenance / housekeeping
- ⏪ `revert:` Revert a previous commit

## 3. Package Management & Ecosystem
The project operates as a multi-language monorepo. You must use the correct tools for each layer:
- **JS/TS Management**: Use **pnpm** for workspace management, dependency installation, and running scripts.
- **Python Management**: Use **uv** for high-performance Python dependency management and environment isolation.

## 4. Testing Conventions
- **Framework**: `vitest`. All tests live under a `tests/` or `__tests__/` directory at the root (not inside `src/`).
- **Naming**: Test files must match `*.test.js` or `*.spec.js`.
- **Coverage**: Run `pnpm test` before every commit. Never commit with failing tests.
- **Smoke test (local)**: The CLI supports non-interactive mode — use `node src/index.js backend mi-test-api --no-pipelines` to simulate the CI smoke test locally.

## 5. Repository Structure
> See **CONTEXT.md §5** for the complete file tree. Below is a quick-reference summary:

- `src/index.js` — CLI entry point (CJS, published to NPM as `cli-projects`).
- `templates/backend/` — FastAPI SOLID boilerplate (do not add opinionated business logic).
- `templates/frontend/` — Next.js App Router boilerplate.
- `.github/workflows/` — **PLANNED** (see CONTEXT.md §4).
- `new_version.ps1` / `new_release.ps1` — Release automation (see **SKILL-release.md**).

## 6. Execution & Validation Workflow
Never commit code that hasn't been verified in a local environment.
- **Local Verification**: Search for the execution scripts in the root `README.md` or `package.json`.
- **Testing**: Execute the relevant test suites (Unit, Integration) after every significant change.

## 7. GitHub MCP & CI/CD Pipeline Management
Agents must use the connected **GitHub MCP** to manage the lifecycle of Pull Requests (PRs).
- **Status Checks**: After pushing changes to a `feature/` branch, use GitHub MCP tools to monitor CI/CD pipelines.
- **Pipeline Results**:
    - **Success (Green)**: If all pipelines pass, report a status of **"OK"**.
    - **Failure (Red)**: Review logs via MCP, identify the cause, and implement fixes.
- **Final Approval**: The human user is the only one authorized to merge PRs into the `master` / `main` branch.

## 8. Documentation & CONTEXT.md Maintenance
- **Step 1**: Read `README.md` **before** starting any task.
- **Step 2**: Update `README.md` immediately after completing changes (new features, env vars, scripts).
- **Step 3**: Update **CONTEXT.md §2** (Current Status) and **§5** (file tree) whenever the project structure or technology stack changes. Stale context misleads future agents.

## 9. AI Tools & Skills
- **Caveman skill**: Use `/caveman` to reduce token usage during long agentic sessions.
- **SKILL-release.md**: Consult before executing any release or version bump.
- All `.agents/` files must be read before starting a task. Priority order: `CONTEXT.md` → `RULES.md` → relevant `SKILL-*.md`.