# ---- Builder stage ----
FROM python:3.12-slim AS builder

WORKDIR /app

# Copiar uv desde su imagen oficial (sin instalar pip/pipx)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copiar archivos de dependencias primero para aprovechar el caché de capas
COPY pyproject.toml uv.lock* ./

# Instalar dependencias de producción en un directorio aislado
RUN uv sync --frozen --no-dev --no-install-project

# ---- Runtime stage ----
FROM python:3.12-slim

WORKDIR /app

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
COPY --from=builder /app/.venv /app/.venv

# Copiar el código de la aplicación
COPY app/ ./app/

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
