from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.security.supabase_jwt import validate_supabase_jwt
from typing import Optional, List
import re


class AuthMiddleware(BaseHTTPMiddleware):
    """
    Middleware for JWT authentication.
    Validates tokens and attaches user info to request state.
    """
    
    # Paths that don't require authentication
    PUBLIC_PATHS: List[str] = [
        r"^/$",
        r"^/docs",
        r"^/redoc",
        r"^/openapi\.json",
        r"^/api/v1/products/?",
        r"^/api/v1/products/[^/]+$",
        r"^/api/v1/reviews/product/",
        r"^/api/v1/ar/assets/",
        r"^/api/v1/checkout/payment-methods$",
    ]
    
    def __init__(self, app, public_paths: Optional[List[str]] = None):
        super().__init__(app)
        if public_paths:
            self.PUBLIC_PATHS.extend(public_paths)
    
    async def dispatch(self, request: Request, call_next):
        # Check if path is public
        path = request.url.path
        
        for pattern in self.PUBLIC_PATHS:
            if re.match(pattern, path):
                return await call_next(request)
        
        # Check for Authorization header
        auth_header = request.headers.get("Authorization")
        
        if not auth_header:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Not authenticated"},
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # Extract token
        try:
            scheme, token = auth_header.split()
            if scheme.lower() != "bearer":
                raise ValueError("Invalid auth scheme")
        except ValueError:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Invalid authorization header"},
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # Validate token
        payload = validate_supabase_jwt(token)
        
        if payload is None:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Invalid or expired token"},
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # Attach user info to request state
        request.state.user = payload
        request.state.user_id = payload.get("id")
        
        return await call_next(request)


class OptionalAuthMiddleware(BaseHTTPMiddleware):
    """
    Middleware that attaches user info if token is present,
    but doesn't require authentication.
    """
    
    async def dispatch(self, request: Request, call_next):
        request.state.user = None
        request.state.user_id = None
        
        auth_header = request.headers.get("Authorization")
        
        if auth_header:
            try:
                scheme, token = auth_header.split()
                if scheme.lower() == "bearer":
                    payload = validate_supabase_jwt(token)
                    if payload:
                        request.state.user = payload
                        request.state.user_id = payload.get("id")
            except Exception:
                pass  # Silently ignore auth errors for optional auth
        
        return await call_next(request)
