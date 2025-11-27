from fastapi import HTTPException, status
from typing import Dict, Any

def ensure_authenticated(current_user: Dict[str, Any] | None):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

def ensure_admin(current_user: Dict[str, Any]):
    ensure_authenticated(current_user)
    # Check app_metadata for role or a specific claim
    # Alternatively, check the 'profiles' table if role is stored there.
    # For now, let's assume 'admin' role is in app_metadata or we fetch it.
    # This is a placeholder logic.
    role = current_user.get("app_metadata", {}).get("role") or current_user.get("role")
    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
