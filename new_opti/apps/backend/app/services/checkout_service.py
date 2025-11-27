from app.core.supabase_client import supabase
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
from fastapi import HTTPException
import uuid


class CheckoutService:
    """Service for handling checkout flow."""
    
    # Session expiry in minutes
    SESSION_EXPIRY_MINUTES = 30
    
    # Tax rate (example: 8%)
    TAX_RATE = 0.08
    
    # Shipping costs by method
    SHIPPING_COSTS = {
        "standard": 599,
        "express": 1299,
        "overnight": 2499
    }
    
    @staticmethod
    def start_checkout(
        user_id: str,
        address_id: str,
        shipping_method_id: str,
        promo_code: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Start a checkout session.
        Validates cart, calculates totals.
        """
        # Get user's active cart
        cart = CheckoutService._get_active_cart(user_id)
        if not cart or not cart.get("items"):
            raise HTTPException(status_code=400, detail="Cart is empty")
        
        # Validate address
        address = CheckoutService._get_address(address_id, user_id)
        if not address:
            raise HTTPException(status_code=400, detail="Invalid address")
        
        # Calculate totals
        subtotal = sum(item["quantity"] * item["unit_price"] for item in cart["items"])
        shipping_cost = CheckoutService.SHIPPING_COSTS.get(shipping_method_id, 599)
        
        # Apply promo code if provided
        discount_amount = 0
        if promo_code:
            discount_amount = CheckoutService._validate_promo_code(promo_code, subtotal)
        
        # Calculate tax
        taxable_amount = subtotal - discount_amount
        tax_amount = int(taxable_amount * CheckoutService.TAX_RATE)
        
        # Total
        total = subtotal + shipping_cost + tax_amount - discount_amount
        
        # Create checkout session
        session_id = str(uuid.uuid4())
        session_data = {
            "id": session_id,
            "user_id": user_id,
            "cart_id": cart["id"],
            "address_id": address_id,
            "shipping_method_id": shipping_method_id,
            "promo_code": promo_code,
            "subtotal_cents": subtotal,
            "shipping_cost_cents": shipping_cost,
            "tax_amount_cents": tax_amount,
            "discount_amount_cents": discount_amount,
            "total_cents": total,
            "currency": "USD",
            "status": "pending",
            "expires_at": (datetime.utcnow() + timedelta(minutes=CheckoutService.SESSION_EXPIRY_MINUTES)).isoformat(),
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Store session (in production, use Redis or database)
        supabase.table("checkout_sessions").insert(session_data).execute()
        
        return {
            "session_id": session_id,
            "summary": {
                "items": cart["items"],
                "subtotal_cents": subtotal,
                "shipping_cost_cents": shipping_cost,
                "tax_amount_cents": tax_amount,
                "discount_amount_cents": discount_amount,
                "total_cents": total,
                "currency": "USD"
            },
            "shipping_address": address,
            "expires_at": session_data["expires_at"]
        }
    
    @staticmethod
    def get_session(session_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Get checkout session details."""
        try:
            response = supabase.table("checkout_sessions").select("*").eq(
                "id", session_id
            ).eq("user_id", user_id).maybe_single().execute()
            
            if not response or not response.data:
                return None
            
            session = response.data
            
            # Check expiry
            expires_at = datetime.fromisoformat(session["expires_at"].replace("Z", "+00:00"))
            if datetime.utcnow().replace(tzinfo=expires_at.tzinfo) > expires_at:
                return None
            
            return session
        except Exception:
            return None
    
    @staticmethod
    async def create_payment_intent(
        session_id: str,
        user_id: str,
        payment_method: str
    ) -> Dict[str, Any]:
        """Create a payment intent with the payment gateway."""
        from app.integrations.payment.payment_client import get_payment_client
        
        session = CheckoutService.get_session(session_id, user_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Get address for billing data
        address = CheckoutService._get_address(session["address_id"], user_id)
        billing_data = None
        if address:
            # Map address fields to Paymob billing data format
            billing_data = {
                "first_name": address.get("full_name", "Customer").split(" ")[0],
                "last_name": " ".join(address.get("full_name", "Customer").split(" ")[1:]) or "Customer",
                "phone_number": address.get("phone") or "+201000000000",
                "email": "customer@example.com", # Ideally fetch from user profile
                "street": address.get("street_address", "NA"),
                "building": "NA", # Should collect if needed
                "floor": "NA",
                "apartment": "NA",
                "city": address.get("city", "Cairo"),
                "country": address.get("country", "EG"),
                "state": address.get("state", "NA"),
                "postal_code": address.get("postal_code", "NA")
            }
            
            # Fetch user email if possible
            user_profile = supabase.table("profiles").select("email").eq("id", user_id).maybe_single().execute()
            if user_profile and user_profile.data:
                billing_data["email"] = user_profile.data.get("email")

        # Create payment intent
        client = get_payment_client()
        result = await client.create_payment_intent(
            amount_cents=session["total_cents"],
            currency=session["currency"],
            metadata={
                "session_id": session_id,
                "user_id": user_id
            },
            billing_data=billing_data
        )
        
        if not result.success:
            raise HTTPException(status_code=500, detail=result.error_message)
        
        # Update session with payment intent
        supabase.table("checkout_sessions").update({
            "payment_intent_id": result.transaction_id,
            "payment_method": payment_method
        }).eq("id", session_id).execute()
        
        return {
            "payment_intent_id": result.transaction_id,
            "client_secret": result.client_secret,
            "payment_url": result.payment_url,
            "amount_cents": session["total_cents"],
            "currency": session["currency"]
        }
    
    @staticmethod
    def confirm_order(
        user_id: str,
        session_id: str,
        payment_intent_id: str
    ) -> Dict[str, Any]:
        """Confirm order after successful payment."""
        from app.services.order_service import OrderService
        from app.services.cart_service import CartService
        
        session = CheckoutService.get_session(session_id, user_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Verify payment intent matches
        if session.get("payment_intent_id") != payment_intent_id:
            raise HTTPException(status_code=400, detail="Payment verification failed")
        
        # Create order
        order = OrderService.create_order_from_session(session)
        
        # Mark cart as converted
        CartService.convert_cart(session["cart_id"])
        
        # Update session status
        supabase.table("checkout_sessions").update({
            "status": "completed",
            "order_id": order["id"]
        }).eq("id", session_id).execute()
        
        return {
            "order_id": order["id"],
            "order_number": order["order_number"],
            "status": order["status"],
            "total_cents": order["total_cents"],
            "message": "Order placed successfully"
        }
    
    @staticmethod
    def cancel_session(session_id: str, user_id: str) -> None:
        """Cancel a checkout session."""
        supabase.table("checkout_sessions").update({
            "status": "cancelled"
        }).eq("id", session_id).eq("user_id", user_id).execute()
    
    @staticmethod
    def _get_active_cart(user_id: str) -> Optional[Dict[str, Any]]:
        """Get user's active cart with items."""
        response = supabase.table("carts").select(
            "id, cart_items(id, product_id, variant_id, quantity, unit_price, products(name, thumbnail_url))"
        ).eq("user_id", user_id).eq("status", "active").maybe_single().execute()
        
        if not response or not response.data:
            return None
        
        cart = response.data
        items = []
        for item in cart.get("cart_items", []):
            items.append({
                "id": item["id"],
                "product_id": item["product_id"],
                "variant_id": item["variant_id"],
                "quantity": item["quantity"],
                "unit_price": item["unit_price"],
                "product_name": item.get("products", {}).get("name", "Unknown"),
                "thumbnail_url": item.get("products", {}).get("thumbnail_url")
            })
        
        return {"id": cart["id"], "items": items}
    
    @staticmethod
    def _get_address(address_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user's address."""
        response = supabase.table("addresses").select("*").eq(
            "id", address_id
        ).eq("user_id", user_id).maybe_single().execute()
        
        return response.data if response else None
    
    @staticmethod
    def _validate_promo_code(code: str, subtotal: int) -> int:
        """Validate promo code and return discount amount."""
        # Simple promo code validation
        # In production, this would query a promo_codes table
        promo_codes = {
            "SAVE10": {"type": "percentage", "value": 10},
            "SAVE20": {"type": "percentage", "value": 20},
            "FLAT500": {"type": "flat", "value": 500}
        }
        
        promo = promo_codes.get(code.upper())
        if not promo:
            return 0
        
        if promo["type"] == "percentage":
            return int(subtotal * promo["value"] / 100)
        else:
            return min(promo["value"], subtotal)
