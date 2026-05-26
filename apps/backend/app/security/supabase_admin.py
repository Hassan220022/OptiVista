from app.core.supabase_client import supabase
from typing import List, Dict, Any

class SupabaseAdmin:
    """
    Wrapper for Supabase Admin operations using the Service Role Key.
    """
    
    @staticmethod
    def list_users() -> List[Dict[str, Any]]:
        # This requires service_role key
        response = supabase.auth.admin.list_users()
        return response

    @staticmethod
    def delete_user(user_id: str):
        return supabase.auth.admin.delete_user(user_id)

supabase_admin = SupabaseAdmin()
