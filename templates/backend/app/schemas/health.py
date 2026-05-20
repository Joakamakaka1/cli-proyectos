# templates/backend/app/schemas/health.py
from pydantic import BaseModel

class HealthCheckResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"