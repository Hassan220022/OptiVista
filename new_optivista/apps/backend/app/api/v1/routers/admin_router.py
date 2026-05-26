from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from typing import Optional, List
from app.api.dependencies.auth import get_current_user_id, require_admin_role
from app.services.product_service import ProductService
from app.services.order_service import OrderService
from app.services.feedback_service import FeedbackService
from app.services.review_service import ReviewService
from app.services.storage_service import StorageService
from pydantic import BaseModel
from datetime import datetime


router = APIRouter()


# ============ Product Management ============

class ProductCreateRequest(BaseModel):
    name: str
    brand: str
    description: str
    short_description: Optional[str] = None
    price_cents: int
    currency: str = "USD"
    category_ids: List[str] = []
    is_active: bool = True


class ProductUpdateRequest(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    price_cents: Optional[int] = None
    is_active: Optional[bool] = None


class VariantCreateRequest(BaseModel):
    color_name: str
    color_hex: str
    size: str
    price_adjustment_cents: int = 0
    stock_quantity: int = 0
    is_active: bool = True


@router.post("/products", dependencies=[Depends(require_admin_role)])
async def create_product(product: ProductCreateRequest):
    """Create a new product (admin only)."""
    from app.core.supabase_client import supabase
    
    product_data = {
        "name": product.name,
        "brand": product.brand,
        "description": product.description,
        "short_description": product.short_description,
        "price_cents": product.price_cents,
        "currency": product.currency,
        "is_active": product.is_active,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    response = supabase.table("products").insert(product_data).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create product")
    
    # Add category associations
    product_id = response.data[0]["id"]
    if product.category_ids:
        category_links = [
            {"product_id": product_id, "category_id": cat_id}
            for cat_id in product.category_ids
        ]
        supabase.table("product_categories").insert(category_links).execute()
    
    return response.data[0]


@router.put("/products/{product_id}", dependencies=[Depends(require_admin_role)])
async def update_product(product_id: str, product: ProductUpdateRequest):
    """Update a product (admin only)."""
    from app.core.supabase_client import supabase
    
    update_data = {k: v for k, v in product.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow().isoformat()
    
    response = supabase.table("products").update(update_data).eq(
        "id", product_id
    ).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return response.data[0]


@router.delete("/products/{product_id}", dependencies=[Depends(require_admin_role)])
async def delete_product(product_id: str):
    """Soft delete a product (admin only)."""
    from app.core.supabase_client import supabase
    
    response = supabase.table("products").update({
        "is_active": False,
        "updated_at": datetime.utcnow().isoformat()
    }).eq("id", product_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"status": "success", "message": "Product deactivated"}


@router.post("/products/{product_id}/variants", dependencies=[Depends(require_admin_role)])
async def create_variant(product_id: str, variant: VariantCreateRequest):
    """Add a variant to a product (admin only)."""
    from app.core.supabase_client import supabase
    
    variant_data = {
        "product_id": product_id,
        "color_name": variant.color_name,
        "color_hex": variant.color_hex,
        "size": variant.size,
        "price_adjustment_cents": variant.price_adjustment_cents,
        "stock_quantity": variant.stock_quantity,
        "is_active": variant.is_active,
        "created_at": datetime.utcnow().isoformat()
    }
    
    response = supabase.table("product_variants").insert(variant_data).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create variant")
    
    return response.data[0]


@router.post("/products/{product_id}/images", dependencies=[Depends(require_admin_role)])
async def upload_product_image(
    product_id: str,
    file: UploadFile = File(...),
    variant_id: Optional[str] = None,
    is_primary: bool = False
):
    """Upload an image for a product (admin only)."""
    url = StorageService.upload_product_image(file, product_id, variant_id)
    
    # Save to database
    from app.core.supabase_client import supabase
    
    image_data = {
        "product_id": product_id,
        "variant_id": variant_id,
        "url": url,
        "is_primary": is_primary,
        "created_at": datetime.utcnow().isoformat()
    }
    
    supabase.table("product_images").insert(image_data).execute()
    
    return {"url": url, "message": "Image uploaded successfully"}


# ============ Order Management ============

class OrderStatusUpdate(BaseModel):
    status: str
    note: Optional[str] = None


class TrackingUpdate(BaseModel):
    tracking_number: str
    tracking_url: Optional[str] = None
    carrier: str
    estimated_delivery: Optional[str] = None


@router.get("/orders", dependencies=[Depends(require_admin_role)])
async def list_all_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None
):
    """List all orders (admin only)."""
    return OrderService.get_all_orders(
        page=page,
        page_size=page_size,
        status=status,
        date_from=date_from,
        date_to=date_to
    )


@router.patch("/orders/{order_id}/status", dependencies=[Depends(require_admin_role)])
async def update_order_status(order_id: str, update: OrderStatusUpdate):
    """Update order status (admin only)."""
    return OrderService.update_order_status(order_id, update.status, update.note)


@router.patch("/orders/{order_id}/tracking", dependencies=[Depends(require_admin_role)])
async def update_order_tracking(order_id: str, tracking: TrackingUpdate):
    """Add or update tracking info (admin only)."""
    return OrderService.update_tracking(
        order_id=order_id,
        tracking_number=tracking.tracking_number,
        tracking_url=tracking.tracking_url,
        carrier=tracking.carrier,
        estimated_delivery=tracking.estimated_delivery
    )


# ============ Feedback Management ============

@router.get("/feedback", dependencies=[Depends(require_admin_role)])
async def list_all_feedback(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    feedback_type: Optional[str] = None
):
    """List all feedback (admin only)."""
    return FeedbackService.get_all_feedback(
        status=status,
        feedback_type=feedback_type,
        page=page,
        page_size=page_size
    )


class FeedbackStatusUpdate(BaseModel):
    status: str
    admin_notes: Optional[str] = None


@router.patch("/feedback/{feedback_id}", dependencies=[Depends(require_admin_role)])
async def update_feedback_status(feedback_id: str, update: FeedbackStatusUpdate):
    """Update feedback status (admin only)."""
    return FeedbackService.update_feedback_status(
        feedback_id=feedback_id,
        status=update.status,
        admin_notes=update.admin_notes
    )


# ============ Review Moderation ============

@router.get("/reviews", dependencies=[Depends(require_admin_role)])
async def list_all_reviews(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None
):
    """List all reviews (admin only)."""
    from app.core.supabase_client import supabase
    
    query = supabase.table("reviews").select(
        "*, profiles:user_id (full_name, email), products:product_id (name)"
    )
    
    if status == "approved":
        query = query.eq("is_approved", True)
    elif status == "pending":
        query = query.eq("is_approved", False)
    
    response = query.order("created_at", desc=True).execute()
    
    return {"items": response.data or []}


@router.get("/reviews/pending", dependencies=[Depends(require_admin_role)])
async def list_pending_reviews():
    """List reviews pending moderation (admin only)."""
    from app.core.supabase_client import supabase
    
    response = supabase.table("reviews").select(
        "*, profiles:user_id (full_name, email), products:product_id (name)"
    ).eq("is_approved", False).order("created_at", desc=True).execute()
    
    return {"items": response.data or []}


class ReviewModerationRequest(BaseModel):
    is_approved: bool
    rejection_reason: Optional[str] = None


@router.patch("/reviews/{review_id}", dependencies=[Depends(require_admin_role)])
async def moderate_review(review_id: str, moderation: ReviewModerationRequest):
    """Approve or reject a review (admin only)."""
    from app.core.supabase_client import supabase
    
    update_data = {
        "is_approved": moderation.is_approved,
        "updated_at": datetime.utcnow().isoformat()
    }
    
    if moderation.rejection_reason:
        update_data["rejection_reason"] = moderation.rejection_reason
    
    response = supabase.table("reviews").update(update_data).eq(
        "id", review_id
    ).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Review not found")
    
    return response.data[0]


@router.delete("/reviews/{review_id}", dependencies=[Depends(require_admin_role)])
async def delete_review_admin(review_id: str):
    """Delete any review (admin only)."""
    from app.core.supabase_client import supabase
    
    supabase.table("reviews").delete().eq("id", review_id).execute()
    
    return {"status": "success", "message": "Review deleted"}


# ============ AR Asset Management ============

@router.post("/ar-assets/{product_id}", dependencies=[Depends(require_admin_role)])
async def upload_ar_model(
    product_id: str,
    file: UploadFile = File(...),
    variant_id: Optional[str] = None,
    platform: str = "all"
):
    """Upload an AR model for a product (admin only)."""
    path = StorageService.upload_ar_model(file, product_id, variant_id, platform)
    
    # Save metadata to database
    from app.core.supabase_client import supabase
    
    ar_asset_data = {
        "product_id": product_id,
        "variant_id": variant_id,
        "model_path": path,
        "model_format": path.split(".")[-1],
        "platform": platform,
        "default_scale": 1.0,
        "default_vertical_offset": 0.0,
        "is_active": True,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    response = supabase.table("ar_assets").insert(ar_asset_data).execute()
    
    return {
        "path": path,
        "asset": response.data[0] if response.data else None,
        "message": "AR model uploaded successfully"
    }


# ============ Dashboard Stats ============

@router.get("/stats", dependencies=[Depends(require_admin_role)])
async def get_dashboard_stats():
    """Get admin dashboard statistics."""
    from app.core.supabase_client import supabase
    
    # Get counts
    products = supabase.table("products").select("id", count="exact").eq("is_active", True).execute()
    orders = supabase.table("orders").select("*", count="exact").execute()
    users = supabase.table("profiles").select("id", count="exact").execute()
    pending_reviews = supabase.table("reviews").select("id", count="exact").eq("is_approved", False).execute()
    pending_feedback = supabase.table("feedback").select("id", count="exact").eq("status", "pending").execute()
    
    # Calculate revenue and pending orders
    all_orders = orders.data or []
    total_revenue = sum(
        o.get("total", 0) or 0 
        for o in all_orders 
        if o.get("payment_status") == "paid"
    )
    pending_orders = sum(1 for o in all_orders if o.get("status") == "pending")
    
    # Recent orders with user info
    recent_orders = supabase.table("orders").select(
        "*, profiles:user_id(full_name, email)"
    ).order("created_at", desc=True).limit(5).execute()
    
    # Top products
    top_products = supabase.table("products").select("*").eq(
        "is_active", True
    ).order("created_at", desc=True).limit(5).execute()
    
    return {
        "total_products": products.count or 0,
        "total_orders": orders.count or 0,
        "total_users": users.count or 0,
        "total_revenue": total_revenue,
        "pending_orders": pending_orders,
        "pending_reviews": pending_reviews.count or 0,
        "pending_feedback": pending_feedback.count or 0,
        "recent_orders": recent_orders.data or [],
        "top_products": top_products.data or []
    }
