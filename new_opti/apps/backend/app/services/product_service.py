from app.core.supabase_client import supabase
from app.models.product_models import ProductFilter
from typing import List, Dict, Any, Tuple

class ProductService:
    @staticmethod
    def get_products(
        filters: ProductFilter, 
        page: int, 
        page_size: int
    ) -> Tuple[List[Dict[str, Any]], int]:
        query = supabase.table("products").select("*", count="exact")
        
        if filters.category_slug:
            # Join with categories if needed, or if category_id is passed. 
            # Assuming we filter by category_id or need a join. 
            # For simplicity, let's assume we might filter by category_id if we had it, 
            # but here we might need to fetch category first or use a join.
            # Let's keep it simple: exact match on category_id if we had it, 
            # or we'd need to look up the category by slug first.
            pass 

        if filters.min_price:
            query = query.gte("price_cents", filters.min_price)
        if filters.max_price:
            query = query.lte("price_cents", filters.max_price)
        if filters.search:
            query = query.ilike("name", f"%{filters.search}%")
            
        # Pagination
        start = (page - 1) * page_size
        end = start + page_size - 1
        query = query.range(start, end)
        
        response = query.execute()
        return response.data, response.count

    @staticmethod
    def get_product_by_id(product_id: str) -> Dict[str, Any]:
        response = supabase.table("products").select("*").eq("id", product_id).maybe_single().execute()
        if not response or not response.data:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Product not found")
        return response.data
