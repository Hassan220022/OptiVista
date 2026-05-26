from typing import Optional, Dict, Any
from app.core.supabase_client import supabase
from app.core.logging import logger

def validate_supabase_jwt(token: str) -> Optional[Dict[str, Any]]:
    """
    Validates the Supabase JWT by calling Supabase Auth API (getUser).
    Returns the user object (dict) if valid, None otherwise.
    """
    try:
        # In a real production scenario with high traffic, you might want to verify the JWT signature locally
        # using the JWT secret to avoid a round-trip to Supabase for every request.
        # However, calling getUser ensures the token is not revoked and gets fresh user data.
        user_response = supabase.auth.get_user(token)
        if user_response and user_response.user:
            # Return a dict representation of the user
            # The User object from supabase-py might need conversion or we just use the ID/Email
            return {
                "id": user_response.user.id,
                "email": user_response.user.email,
                "app_metadata": user_response.user.app_metadata,
                "user_metadata": user_response.user.user_metadata,
                "aud": user_response.user.aud,
                "role": user_response.user.role
            }
        return None
    except Exception as e:
        logger.error(f"JWT Validation Error: {str(e)}")
        return None
