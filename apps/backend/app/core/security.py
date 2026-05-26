from fastapi.security import HTTPBearer

# Auth Header
API_KEY_HEADER = "Authorization"
BEARER_PREFIX = "Bearer "

# Security Schemes
security_scheme = HTTPBearer()

# Supabase JWT Claims
SUPABASE_JWT_ALGORITHM = "HS256"
