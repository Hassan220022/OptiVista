from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class StartCheckoutRequest(BaseModel):
    """Request to start a checkout session."""
    address_id: str
    shipping_method_id: str = "standard"
    promo_code: Optional[str] = None


class CheckoutItemSummary(BaseModel):
    """Item in checkout summary."""
    id: str
    product_id: str
    variant_id: Optional[str] = None
    product_name: str
    quantity: int
    unit_price: int
    thumbnail_url: Optional[str] = None


class CheckoutSummary(BaseModel):
    """Checkout totals summary."""
    items: List[CheckoutItemSummary]
    subtotal_cents: int
    shipping_cost_cents: int
    tax_amount_cents: int
    discount_amount_cents: int = 0
    total_cents: int
    currency: str = "USD"


class AddressResponse(BaseModel):
    """Shipping address in checkout."""
    id: str
    full_name: str
    street_address: str
    street_address_2: Optional[str] = None
    city: str
    state: Optional[str] = None
    postal_code: str
    country: str
    phone: Optional[str] = None


class CheckoutSessionResponse(BaseModel):
    """Response for checkout session."""
    session_id: str
    summary: CheckoutSummary
    shipping_address: Optional[AddressResponse] = None
    expires_at: str


class CreatePaymentRequest(BaseModel):
    """Request to create payment intent."""
    payment_method: str = "card"


class PaymentIntentResponse(BaseModel):
    """Response with payment intent details."""
    payment_intent_id: str
    client_secret: str
    payment_url: Optional[str] = None
    amount_cents: int
    currency: str


class ConfirmOrderRequest(BaseModel):
    """Request to confirm order after payment."""
    session_id: str
    payment_intent_id: str


class OrderConfirmationResponse(BaseModel):
    """Response after order confirmation."""
    order_id: str
    order_number: str
    status: str
    total_cents: int
    message: str


class ShippingMethod(BaseModel):
    """Shipping method option."""
    id: str
    name: str
    description: str
    price_cents: int
    estimated_days: int


class ShippingMethodsResponse(BaseModel):
    """List of shipping methods."""
    items: List[ShippingMethod]
