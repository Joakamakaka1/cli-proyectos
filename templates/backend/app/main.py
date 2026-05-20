# templates/backend/app/main.py
from fastapi import FastAPI
from app.api.v1.api_router import api_router

app = FastAPI(
    title="Mi API Profesional KISS",
    description="API moderna construida con FastAPI, uv y arquitectura SOLID",
    version="1.0.0"
)

# Registramos todas las rutas bajo el prefijo global /api/v1
app.include_router(api_router, prefix="/api/v1")

# Opcional: Un redirect o mensaje simple en la raíz pura para saber que el backend arranca
@app.get("/", include_in_schema=False)
async def root():
    return {"message": "Backend operativo. Visita /docs para ver la documentación interactiva."}