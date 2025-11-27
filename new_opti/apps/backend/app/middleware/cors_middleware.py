from fastapi.middleware.cors import CORSMiddleware
from typing import List


def create_cors_middleware(
    allow_origins: List[str] = None,
    allow_credentials: bool = True,
    allow_methods: List[str] = None,
    allow_headers: List[str] = None,
):
    """
    Create CORS middleware configuration.
    
    Args:
        allow_origins: List of allowed origins (default: all origins in dev)
        allow_credentials: Whether to allow credentials
        allow_methods: List of allowed HTTP methods
        allow_headers: List of allowed headers
    
    Returns:
        CORS middleware configuration dict
    """
    return {
        "middleware_class": CORSMiddleware,
        "allow_origins": allow_origins or ["*"],
        "allow_credentials": allow_credentials,
        "allow_methods": allow_methods or ["*"],
        "allow_headers": allow_headers or ["*"],
    }


# Default CORS configuration for development
DEV_CORS_CONFIG = {
    "allow_origins": [
        "http://localhost:3000",      # Web frontend
        "http://localhost:8080",      # Alternative web
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8080",
        "capacitor://localhost",       # Mobile Capacitor
        "ionic://localhost",           # Ionic
        "http://localhost",            # Generic localhost
    ],
    "allow_credentials": True,
    "allow_methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    "allow_headers": [
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "X-Requested-With",
        "X-Request-ID",
    ],
}


# Production CORS configuration (stricter)
PROD_CORS_CONFIG = {
    "allow_origins": [
        "https://optivista.app",
        "https://www.optivista.app",
        "https://api.optivista.app",
    ],
    "allow_credentials": True,
    "allow_methods": ["GET", "POST", "PUT", "PATCH", "DELETE"],
    "allow_headers": [
        "Authorization",
        "Content-Type",
        "Accept",
    ],
}


def get_cors_config(environment: str = "development"):
    """Get CORS config based on environment."""
    if environment == "production":
        return PROD_CORS_CONFIG
    return DEV_CORS_CONFIG
