from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import security_scheme, BEARER_PREFIX
from app.security.supabase_jwt import validate_supabase_jwt
from app.models.user_models import UserResponse
from typing import Dict, Any

async def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(security_scheme)
) -> Dict[str, Any]:
    """
    Validates the JWT and returns the user object.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # token.credentials contains the raw JWT
    payload = validate_supabase_jwt(token.credentials)
    if payload is None:
        raise credentials_exception
        
    return payload

async def get_current_user_id(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> str:
    return current_user["id"]


async def get_optional_user_id(
    token: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False))
) -> str | None:
    """
    Returns user ID if authenticated, None otherwise.
    Useful for endpoints that work for both authenticated and anonymous users.
    """
    if token is None:
        return None
    
    try:
        payload = validate_supabase_jwt(token.credentials)
        return payload["id"] if payload else None
    except Exception:
        return None


async def require_admin_role(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Require admin role for access.
    Raises 403 if user is not an admin.
    """
    app_metadata = current_user.get("app_metadata", {})
    role = app_metadata.get("role", "shopper")
    
    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return current_user
