from fastapi import Request, status
from fastapi.responses import JSONResponse


class AppException(Exception):
    """Excepción base de la aplicación con código HTTP y detalle."""

    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail
        super().__init__(detail)


class NotFoundException(AppException):
    def __init__(self, detail: str = "Recurso no encontrado") -> None:
        super().__init__(status.HTTP_404_NOT_FOUND, detail)


class UnauthorizedException(AppException):
    def __init__(self, detail: str = "No autorizado") -> None:
        super().__init__(status.HTTP_401_UNAUTHORIZED, detail)


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )
