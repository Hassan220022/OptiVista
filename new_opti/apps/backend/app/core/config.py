import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "AR Eyewear App"
    ENVIRONMENT: str = "dev"
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SUPABASE_ANON_KEY: str | None = None
    SUPABASE_JWT_SECRET: str  # JWT secret for token verification
    
    # Paymob Payment Gateway
    PAYMOB_API_KEY: str                    # Legacy API key (base64 encoded)
    PAYMOB_SECRET_KEY: str                 # Secret key (egy_sk_...)
    PAYMOB_PUBLIC_KEY: str                 # Public key (egy_pk_...)
    PAYMOB_IFRAME_ID: str                  # iFrame ID from dashboard
    PAYMOB_INTEGRATION_ID: str | None = None  # Card integration ID
    PAYMOB_APPLE_PAY_INTEGRATION_ID: str | None = None  # Apple Pay integration ID
    PAYMOB_HMAC_SECRET: str | None = None     # HMAC for webhooks
    
    # Optional: Email (Resend)
    RESEND_API_KEY: str | None = None
    
    # Optional: Push Notifications (Firebase)
    FCM_SERVER_KEY: str | None = None
    FIREBASE_PROJECT_ID: str | None = None
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
