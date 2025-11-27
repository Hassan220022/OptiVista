from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from postgrest.exceptions import APIError as PostgrestAPIError
import logging
import traceback

logger = logging.getLogger(__name__)


async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handle HTTP exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "detail": exc.detail,
            "code": f"HTTP_{exc.status_code}"
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle request validation errors."""
    errors = []
    for error in exc.errors():
        field = ".".join(str(loc) for loc in error["loc"])
        errors.append({
            "field": field,
            "message": error["msg"],
            "type": error["type"]
        })
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "status": "error",
            "detail": "Validation error",
            "code": "VALIDATION_ERROR",
            "errors": errors
        }
    )


async def postgrest_exception_handler(request: Request, exc: PostgrestAPIError):
    """Handle Supabase/PostgREST API errors."""
    logger.error(f"PostgREST error: {exc}")
    
    # Map common PostgREST error codes
    error_map = {
        "PGRST116": (404, "Resource not found"),
        "23505": (409, "Resource already exists"),
        "23503": (400, "Invalid reference"),
        "42501": (403, "Permission denied"),
        "42703": (400, "Invalid column reference"),
    }
    
    code = str(exc.details.get("code", ""))
    status_code, message = error_map.get(code, (500, "Database error"))
    
    return JSONResponse(
        status_code=status_code,
        content={
            "status": "error",
            "detail": message,
            "code": code or "DB_ERROR"
        }
    )


async def generic_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions."""
    logger.error(f"Unexpected error: {exc}")
    logger.error(traceback.format_exc())
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "detail": "An unexpected error occurred",
            "code": "INTERNAL_ERROR"
        }
    )


def register_exception_handlers(app):
    """Register all exception handlers with the app."""
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(PostgrestAPIError, postgrest_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)
