# templates/backend/app/api/v1/api_router.py
from fastapi import APIRouter
from app.api.v1.endpoints import health

api_router = APIRouter()

# Incluimos el router de health. 
# Si mañana añades 'users', pondrías: api_router.include_router(users.router, prefix="/users")
api_router.include_router(health.router, prefix="")