from app.core.supabase_client import supabase
from app.models.user_models import UserResponse, ProfileUpdate, PDUpdate
from typing import Dict, Any, Optional
from uuid import UUID

class UserService:
    @staticmethod
    def get_profile(user_id: str) -> Optional[Dict[str, Any]]:
        try:
            response = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
            return response.data
        except Exception as e:
            # If profile doesn't exist (PGRST116), create it
            if "PGRST116" in str(e):
                # Fetch user email from auth (optional, or just create basic profile)
                # Since we can't easily access auth.users from here without admin key,
                # we'll just create a basic profile with the ID.
                new_profile = {
                    "id": user_id,
                    "role": "user"
                }
                create_response = supabase.table("profiles").insert(new_profile).execute()
                return create_response.data[0]
            raise e

    @staticmethod
    def update_profile(user_id: str, profile_update: ProfileUpdate) -> Dict[str, Any]:
        data = profile_update.model_dump(exclude_unset=True)
        response = supabase.table("profiles").update(data).eq("id", user_id).execute()
        return response.data[0] if response.data else {}

    @staticmethod
    def update_pd(user_id: str, pd_update: PDUpdate) -> Dict[str, Any]:
        data = {"pd_value_mm": pd_update.pd_value_mm}
        response = supabase.table("profiles").update(data).eq("id", user_id).execute()
        return response.data[0] if response.data else {}
