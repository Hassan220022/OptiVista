from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional
from pydantic import BaseModel
from app.api.dependencies.auth import get_current_user_id
from app.services.checkout_service import CheckoutService
from app.models.checkout_models import (
    StartCheckoutRequest,
    CheckoutSessionResponse,
    CreatePaymentRequest,
    PaymentIntentResponse,
    ConfirmOrderRequest,
    OrderConfirmationResponse
)

router = APIRouter()


# ============ PUBLIC ENDPOINTS (must come before /{session_id}) ============

@router.get("/payment-methods")
async def get_payment_methods():
    """Get available payment methods. Public endpoint."""
    from app.integrations.payment.payment_client import get_available_payment_methods
    
    methods = get_available_payment_methods()
    
    return {
        "items": [
            {
                "id": "card",
                "name": "Credit/Debit Card",
                "description": "Pay with Visa, Mastercard, or Meeza",
                "icon": "credit_card",
                "available": methods.get("card", False)
            },
            {
                "id": "apple_pay",
                "name": "Apple Pay",
                "description": "Fast and secure payment with Apple Pay",
                "icon": "apple",
                "available": methods.get("apple_pay", False)
            }
        ]
    }


# ============ AUTHENTICATED ENDPOINTS ============

@router.post("/start", response_model=CheckoutSessionResponse)
async def start_checkout(
    request: StartCheckoutRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Start a checkout session.
    Validates cart, calculates totals with shipping and tax.
    """
    return CheckoutService.start_checkout(
        user_id=user_id,
        address_id=request.address_id,
        shipping_method_id=request.shipping_method_id,
        promo_code=request.promo_code
    )


@router.get("/{session_id}", response_model=CheckoutSessionResponse)
async def get_checkout_session(
    session_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Get current checkout session details."""
    session = CheckoutService.get_session(session_id, user_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Checkout session not found or expired"
        )
    return session


@router.post("/{session_id}/payment", response_model=PaymentIntentResponse)
async def create_payment_intent(
    session_id: str,
    request: CreatePaymentRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Create a payment intent for the checkout session.
    Returns client_secret for frontend payment confirmation.
    """
    return await CheckoutService.create_payment_intent(
        session_id=session_id,
        user_id=user_id,
        payment_method=request.payment_method
    )


@router.post("/confirm", response_model=OrderConfirmationResponse)
async def confirm_order(
    request: ConfirmOrderRequest,
    user_id: str = Depends(get_current_user_id)
):
    """
    Confirm order after successful payment.
    Creates the order and clears the cart.
    """
    return CheckoutService.confirm_order(
        user_id=user_id,
        session_id=request.session_id,
        payment_intent_id=request.payment_intent_id
    )


@router.post("/{session_id}/cancel")
async def cancel_checkout(
    session_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Cancel a checkout session."""
    CheckoutService.cancel_session(session_id, user_id)
    return {"status": "success", "message": "Checkout cancelled"}


@router.get("/shipping-methods")
async def get_shipping_methods(user_id: str = Depends(get_current_user_id)):
    """Get available shipping methods."""
    return {
        "items": [
            {
                "id": "standard",
                "name": "Standard Shipping",
                "description": "5-7 business days",
                "price_cents": 599,
                "estimated_days": 7
            },
            {
                "id": "express",
                "name": "Express Shipping",
                "description": "2-3 business days",
                "price_cents": 1299,
                "estimated_days": 3
            },
            {
                "id": "overnight",
                "name": "Overnight Shipping",
                "description": "Next business day",
                "price_cents": 2499,
                "estimated_days": 1
            }
        ]
    }
