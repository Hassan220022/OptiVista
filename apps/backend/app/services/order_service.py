from app.core.supabase_client import supabase
from app.models.order_models import CreateOrderRequest
from app.services.cart_service import CartService
from typing import Dict, Any

class OrderService:
    @staticmethod
    def create_order(user_id: str, request: CreateOrderRequest) -> Dict[str, Any]:
        # Get active cart
        cart = CartService.get_active_cart(user_id)
        if not cart.get("items"):
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail="Cart is empty")
            
        # Calculate total
        total = sum(item["quantity"] * item["unit_price_cents"] for item in cart["items"])
        
        # Create Order
        order_data = {
            "user_id": user_id,
            "status": "pending",
            "total_amount_cents": total,
            "currency_code": "USD", # Should come from cart/product
            "shipping_address_json": request.shipping_address,
            "payment_provider": request.payment_provider
        }
        order_res = supabase.table("orders").insert(order_data).execute()
        order_id = order_res.data[0]["id"]
        
        # Move items
        items_data = []
        for item in cart["items"]:
            items_data.append({
                "order_id": order_id,
                "product_id": item["product_id"],
                "quantity": item["quantity"],
                "unit_price_cents": item["unit_price_cents"]
            })
        supabase.table("order_items").insert(items_data).execute()
        
        # Close cart
        supabase.table("carts").update({"status": "converted"}).eq("id", cart["id"]).execute()
        
        return order_res.data[0]

    @staticmethod
    def get_orders(user_id: str) -> list:
        response = supabase.table("orders").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return response.data

    @staticmethod
    def get_order_details(user_id: str, order_id: str) -> Dict[str, Any]:
        # Fetch order
        order_res = supabase.table("orders").select("*").eq("id", order_id).eq("user_id", user_id).maybe_single().execute()
        if not order_res or not order_res.data:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Order not found")
        order = order_res.data
        # Map DB field to Pydantic model field
        order["shipping_address"] = order.get("shipping_address_json")
        
        # Fetch items
        items_res = supabase.table("order_items").select("*, products(*)").eq("order_id", order_id).execute()
        
        # Format items
        items = []
        for item in items_res.data:
            product_data = item.get("products", {})
            # Map thumbnail_url to images list for frontend compatibility
            images = [product_data.get("thumbnail_url")] if product_data and product_data.get("thumbnail_url") else []
            
            items.append({
                "id": item["id"],
                "product_id": item["product_id"],
                "quantity": item["quantity"],
                "unit_price_cents": item["unit_price_cents"],
                "product_name": product_data.get("name") if product_data else "Unknown Product",
                "product": {
                    "id": item["product_id"],
                    "name": product_data.get("name", "Unknown"),
                    "description": product_data.get("description", ""),
                    "price": product_data.get("price_cents", 0),
                    "currency": product_data.get("currency_code", "USD"),
                    "brand": product_data.get("brand", ""),
                    "model_number": product_data.get("slug", ""),
                    "frame_color": product_data.get("frame_color", ""),
                    "lens_color": "",
                    "frame_material": product_data.get("frame_material", ""),
                    "style": "",
                    "gender": "",
                    "face_shape": "",
                    "images": images,
                    "is_virtual_try_on_enabled": False,
                    "rating": float(product_data.get("avg_rating", 0.0)),
                    "review_count": 0
                }
            })
            
        order["items"] = items
        return order
