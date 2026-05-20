# templates/backend/app/api/v1/endpoints/health.py
from fastapi import APIRouter, status
from app.schemas.health import HealthCheckResponse

router = APIRouter()

@router.get(
    "/health", 
    response_model=HealthCheckResponse, 
    status_code=status.HTTP_200_OK,
    summary="Comprobar el estado de la API"
)
async def check_health():
    """
    Endpoint simple para verificar que el servidor de FastAPI responde correctamente.
    """
    return HealthCheckResponse(status="ok", version="1.0.0")