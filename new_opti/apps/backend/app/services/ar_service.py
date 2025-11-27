from app.core.supabase_client import supabase
from typing import Dict, Any, Optional

class ARService:
    @staticmethod
    def get_asset(product_id: str) -> Optional[Dict[str, Any]]:
        try:
            response = supabase.table("ar_assets").select("*").eq("product_id", product_id).maybe_single().execute()
            if not response or not response.data:
                return None
                
            asset = response.data
            
            # Build model URL
            model_path = asset.get("supabase_path_ar_model") or asset.get("model_path")
            if model_path:
                asset["model_url"] = f"{supabase.storage_url}/object/public/ar-models/{model_path}"
            
            return asset
        except Exception:
            return None
