"""
Seller API routes - endpoints for seller dashboard
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from app.api.dependencies.auth import get_current_user, require_seller_role

router = APIRouter(prefix="/seller", tags=["Seller"])


# ============ Pydantic Models ============

class ProductCreateRequest(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    brand: Optional[str] = None
    frame_type: Optional[str] = None
    frame_material: Optional[str] = None
    frame_color: Optional[str] = None
    price_cents: int
    stock_quantity: int = 0
    is_active: bool = True


class ProductUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    brand: Optional[str] = None
    price_cents: Optional[int] = None
    stock_quantity: Optional[int] = None
    is_active: Optional[bool] = None


class OrderStatusUpdate(BaseModel):
    tracking_number: Optional[str] = None
    carrier: Optional[str] = None


class StoreProfileUpdate(BaseModel):
    store_name: Optional[str] = None
    store_description: Optional[str] = None


# ============ Dashboard Stats ============

@router.get("/stats", dependencies=[Depends(require_seller_role)])
async def get_seller_stats(current_user: dict = Depends(get_current_user)):
    """Get seller dashboard statistics."""
    from app.core.supabase_client import supabase
    
    seller_id = current_user["id"]
    
    # Get product count
    products = supabase.table("products").select(
        "id", count="exact"
    ).eq("seller_id", seller_id).eq("is_active", True).execute()
    
    # Get orders for seller's products
    seller_products = supabase.table("products").select("id").eq("seller_id", seller_id).execute()
    product_ids = [p["id"] for p in (seller_products.data or [])]
    
    total_orders = 0
    total_revenue = 0
    pending_orders = 0
    
    if product_ids:
        # Get order items for seller's products
        order_items = supabase.table("order_items").select(
            "order_id, quantity, unit_price_cents"
        ).in_("product_id", product_ids).execute()
        
        order_ids = list(set([item["order_id"] for item in (order_items.data or [])]))
        total_orders = len(order_ids)
        total_revenue = sum(
            (item.get("quantity", 0) * item.get("unit_price_cents", 0)) / 100 
            for item in (order_items.data or [])
        )
        
        # Get pending orders
        if order_ids:
            pending = supabase.table("orders").select(
                "id", count="exact"
            ).in_("id", order_ids).eq("status", "pending").execute()
            pending_orders = pending.count or 0
    
    # Get reviews for seller's products
    pending_reviews = 0
    if product_ids:
        reviews = supabase.table("reviews").select(
            "id", count="exact"
        ).in_("product_id", product_ids).execute()
        pending_reviews = reviews.count or 0
    
    return {
        "total_products": products.count or 0,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "pending_orders": pending_orders,
        "total_reviews": pending_reviews,
    }


# ============ Products ============

@router.get("/products", dependencies=[Depends(require_seller_role)])
async def list_seller_products(
    current_user: dict = Depends(get_current_user),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None
):
    """List seller's products."""
    from app.core.supabase_client import supabase
    
    seller_id = current_user["id"]
    
    query = supabase.table("products").select("*").eq("seller_id", seller_id)
    
    if status == "active":
        query = query.eq("is_active", True)
    elif status == "inactive":
        query = query.eq("is_active", False)
    
    offset = (page - 1) * page_size
    response = query.order("created_at", desc=True).range(offset, offset + page_size - 1).execute()
    
    return {"items": response.data or [], "page": page, "page_size": page_size}


@router.post("/products", dependencies=[Depends(require_seller_role)])
async def create_seller_product(
    product: ProductCreateRequest,
    current_user: dict = Depends(get_current_user)
):
    """Create a new product."""
    from app.core.supabase_client import supabase
    
    seller_id = current_user["id"]
    
    product_data = product.model_dump()
    product_data["seller_id"] = seller_id
    
    response = supabase.table("products").insert(product_data).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create product")
    
    return response.data[0]


@router.put("/products/{product_id}", dependencies=[Depends(require_seller_role)])
async def update_seller_product(
    product_id: str,
    updates: ProductUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    """Update a product (only seller's own products)."""
    from app.core.supabase_client import supabase
    
    seller_id = current_user["id"]
    
    # Verify ownership
    existing = supabase.table("products").select("seller_id").eq("id", product_id).single().execute()
    if not existing.data or existing.data.get("seller_id") != seller_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this product")
    
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    
    response = supabase.table("products").update(update_data).eq("id", product_id).execute()
    
    return response.data[0] if response.data else None


@router.delete("/products/{product_id}", dependencies=[Depends(require_seller_role)])
async def delete_seller_product(
    product_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a product (only seller's own products)."""
    from app.core.supabase_client import supabase
    
    seller_id = current_user["id"]
    
    # Verify ownership
    existing = supabase.table("products").select("seller_id").eq("id", product_id).single().execute()
    if not existing.data or existing.data.get("seller_id") != seller_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this product")
    
    supabase.table("products").delete().eq("id", product_id).execute()
    
    return {"success": True}


# ============ Orders ============

@router.get("/orders", dependencies=[Depends(require_seller_role)])
async def list_seller_orders(
    current_user: dict = Depends(get_current_user),
    page: int = Query(1, ge=1),
    status: Optional[str] = None
):
    """List orders containing seller's products."""
    from app.core.supabase_client import supabase
    
    seller_id = current_user["id"]
    
    # Get seller's product IDs
    products = supabase.table("products").select("id").eq("seller_id", seller_id).execute()
    product_ids = [p["id"] for p in (products.data or [])]
    
    if not product_ids:
        return {"items": [], "page": page}
    
    # Get order items for these products
    order_items = supabase.table("order_items").select(
        "order_id"
    ).in_("product_id", product_ids).execute()
    
    order_ids = list(set([item["order_id"] for item in (order_items.data or [])]))
    
    if not order_ids:
        return {"items": [], "page": page}
    
    # Get orders
    query = supabase.table("orders").select(
        "*, profiles:user_id(full_name, email)"
    ).in_("id", order_ids)
    
    if status:
        query = query.eq("status", status)
    
    response = query.order("created_at", desc=True).execute()
    
    return {"items": response.data or [], "page": page}


@router.patch("/orders/{order_id}/tracking", dependencies=[Depends(require_seller_role)])
async def update_order_tracking(
    order_id: str,
    update: OrderStatusUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update tracking info for an order (if contains seller's products)."""
    from app.core.supabase_client import supabase
    
    seller_id = current_user["id"]
    
    # Verify seller has products in this order
    products = supabase.table("products").select("id").eq("seller_id", seller_id).execute()
    product_ids = [p["id"] for p in (products.data or [])]
    
    order_items = supabase.table("order_items").select(
        "id"
    ).eq("order_id", order_id).in_("product_id", product_ids).execute()
    
    if not order_items.data:
        raise HTTPException(status_code=403, detail="Not authorized to update this order")
    
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    
    response = supabase.table("orders").update(update_data).eq("id", order_id).execute()
    
    return response.data[0] if response.data else None


# ============ Reviews ============

@router.get("/reviews", dependencies=[Depends(require_seller_role)])
async def list_seller_reviews(
    current_user: dict = Depends(get_current_user),
    page: int = Query(1, ge=1)
):
    """List reviews for seller's products."""
    from app.core.supabase_client import supabase
    
    seller_id = current_user["id"]
    
    # Get seller's product IDs
    products = supabase.table("products").select("id").eq("seller_id", seller_id).execute()
    product_ids = [p["id"] for p in (products.data or [])]
    
    if not product_ids:
        return {"items": [], "page": page}
    
    response = supabase.table("reviews").select(
        "*, profiles:user_id(full_name, email), products:product_id(name)"
    ).in_("product_id", product_ids).order("created_at", desc=True).execute()
    
    return {"items": response.data or [], "page": page}


# ============ Store Profile ============

@router.get("/profile", dependencies=[Depends(require_seller_role)])
async def get_seller_profile(current_user: dict = Depends(get_current_user)):
    """Get seller profile."""
    from app.core.supabase_client import supabase
    
    response = supabase.table("profiles").select(
        "id, full_name, email, store_name, store_description, store_logo_url, is_seller_approved, seller_commission_rate"
    ).eq("id", current_user["id"]).single().execute()
    
    return response.data


@router.patch("/profile", dependencies=[Depends(require_seller_role)])
async def update_seller_profile(
    update: StoreProfileUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update seller profile."""
    from app.core.supabase_client import supabase
    
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    
    response = supabase.table("profiles").update(update_data).eq("id", current_user["id"]).execute()
    
    return response.data[0] if response.data else None


# ============ Analytics ============

@router.get("/analytics", dependencies=[Depends(require_seller_role)])
async def get_seller_analytics(
    current_user: dict = Depends(get_current_user),
    period: str = Query("30d", description="Time period: 7d, 30d, 90d")
):
    """Get seller analytics data."""
    from app.core.supabase_client import supabase
    from datetime import datetime, timedelta
    
    seller_id = current_user["id"]
    
    # Calculate date range
    days = {"7d": 7, "30d": 30, "90d": 90}.get(period, 30)
    start_date = (datetime.utcnow() - timedelta(days=days)).isoformat()
    
    # Get products
    products = supabase.table("products").select("id, name").eq("seller_id", seller_id).execute()
    product_ids = [p["id"] for p in (products.data or [])]
    
    if not product_ids:
        return {
            "total_revenue": 0,
            "total_orders": 0,
            "total_views": 0,
            "top_products": [],
        }
    
    # Get order items
    order_items = supabase.table("order_items").select(
        "product_id, quantity, unit_price_cents"
    ).in_("product_id", product_ids).execute()
    
    # Aggregate by product
    product_sales: dict = {}
    for item in (order_items.data or []):
        pid = item["product_id"]
        if pid not in product_sales:
            product_sales[pid] = {"quantity": 0, "revenue": 0}
        product_sales[pid]["quantity"] += item.get("quantity", 0)
        product_sales[pid]["revenue"] += (item.get("quantity", 0) * item.get("unit_price_cents", 0)) / 100
    
    # Build top products
    top_products = []
    for p in (products.data or []):
        sales = product_sales.get(p["id"], {"quantity": 0, "revenue": 0})
        top_products.append({
            "name": p["name"],
            "sales": sales["quantity"],
            "revenue": sales["revenue"],
        })
    
    top_products.sort(key=lambda x: x["revenue"], reverse=True)
    
    return {
        "total_revenue": sum(p["revenue"] for p in top_products),
        "total_orders": len(set(item.get("order_id") for item in (order_items.data or []) if "order_id" in item)),
        "total_views": 0,  # Would need view tracking
        "top_products": top_products[:5],
    }
