from app.core.supabase_client import supabase
from typing import Dict, Any, List, Optional
from uuid import UUID
from postgrest.exceptions import APIError

class CartService:
    @staticmethod
    def get_active_cart(user_id: str) -> Dict[str, Any]:
        # Try to find active cart
        try:
            response = supabase.table("carts").select("*, items:cart_items(*, product:products(*))") \
                .eq("user_id", user_id).eq("status", "active").maybe_single().execute()

            if response and response.data:
                return response.data
        except APIError as e:
            # maybe_single() throws APIError with code 204 when no results found
            if e.code == "204":
                pass  # Fall through to create new cart
            else:
                raise

        # Create new if not exists
        new_cart = supabase.table("carts").insert({"user_id": user_id, "status": "active"}).execute()
        return new_cart.data[0]

    @staticmethod
    def add_item(user_id: str, product_id: str, quantity: int) -> Dict[str, Any]:
        product_id_str = str(product_id)
        cart = CartService.get_active_cart(user_id)
        cart_id = cart["id"]

        # Check if item exists
        existing = supabase.table("cart_items").select("*").eq("cart_id", cart_id).eq("product_id", product_id_str).execute()

        if existing.data:
            item_id = existing.data[0]["id"]
            new_qty = existing.data[0]["quantity"] + quantity
            supabase.table("cart_items").update({"quantity": new_qty}).eq("id", item_id).execute()
        else:
            # Get price
            product = supabase.table("products").select("price_cents").eq("id", product_id_str).single().execute()
            price = product.data["price_cents"]
            supabase.table("cart_items").insert({
                "cart_id": cart_id,
                "product_id": product_id_str,
                "quantity": quantity,
                "unit_price_cents": price
            }).execute()

        return CartService.get_active_cart(user_id)

    @staticmethod
    def update_item(user_id: str, item_id: str, quantity: int) -> Dict[str, Any]:
        if quantity <= 0:
            CartService.remove_item(user_id, item_id)
        else:
            supabase.table("cart_items").update({"quantity": quantity}).eq("id", item_id).execute()

        return CartService.get_active_cart(user_id)

    @staticmethod
    def remove_item(user_id: str, item_id: str):
        # Verify ownership via RLS or explicit check
        supabase.table("cart_items").delete().eq("id", item_id).execute()
