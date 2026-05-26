from app.core.supabase_client import supabase
from app.core.config import settings
from typing import Dict, Any, Optional
from fastapi import HTTPException
from jose import jwt, JWTError
from datetime import datetime


class AuthService:
    """Service for authentication and JWT validation."""
    
    @staticmethod
    def verify_token(token: str) -> Dict[str, Any]:
        """
        Verify a Supabase JWT token and return the payload.
        
        Args:
            token: The JWT token to verify
            
        Returns:
            Dict containing user_id, email, role, and other claims
            
        Raises:
            HTTPException: If token is invalid or expired
        """
        try:
            # Decode the JWT using Supabase JWT secret
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated"
            )
            
            # Check expiration
            exp = payload.get("exp")
            if exp and datetime.utcnow().timestamp() > exp:
                raise HTTPException(
                    status_code=401,
                    detail="Token has expired"
                )
            
            return payload
            
        except JWTError as e:
            raise HTTPException(
                status_code=401,
                detail=f"Invalid token: {str(e)}"
            )
    
    @staticmethod
    def get_user_from_token(token: str) -> Dict[str, Any]:
        """
        Extract user information from a verified token.
        
        Args:
            token: The JWT token
            
        Returns:
            Dict with id, email, role
        """
        payload = AuthService.verify_token(token)
        
        return {
            "id": payload.get("sub"),
            "email": payload.get("email"),
            "role": payload.get("role", "authenticated"),
            "app_metadata": payload.get("app_metadata", {}),
            "user_metadata": payload.get("user_metadata", {})
        }
    
    @staticmethod
    def get_user_id_from_token(token: str) -> str:
        """
        Extract just the user ID from a token.
        
        Args:
            token: The JWT token
            
        Returns:
            The user's UUID string
        """
        payload = AuthService.verify_token(token)
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token: missing user ID"
            )
        
        return user_id
    
    @staticmethod
    def check_admin_role(user: Dict[str, Any]) -> bool:
        """
        Check if user has admin role.
        
        Args:
            user: User dict from get_user_from_token
            
        Returns:
            True if user is admin
        """
        app_metadata = user.get("app_metadata", {})
        return app_metadata.get("role") == "admin"
    
    @staticmethod
    def require_admin(token: str) -> Dict[str, Any]:
        """
        Verify token and require admin role.
        
        Args:
            token: The JWT token
            
        Returns:
            User dict if admin
            
        Raises:
            HTTPException: If not admin
        """
        user = AuthService.get_user_from_token(token)
        
        if not AuthService.check_admin_role(user):
            raise HTTPException(
                status_code=403,
                detail="Admin access required"
            )
        
        return user
    
    @staticmethod
    def get_user_profile(user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get user profile from database.
        
        Args:
            user_id: The user's UUID
            
        Returns:
            Profile dict or None
        """
        response = supabase.table("profiles").select("*").eq(
            "id", user_id
        ).maybe_single().execute()
        
        return response.data
    
    @staticmethod
    def update_last_login(user_id: str) -> None:
        """Update user's last login timestamp."""
        supabase.table("profiles").update({
            "last_login": datetime.utcnow().isoformat()
        }).eq("id", user_id).execute()
