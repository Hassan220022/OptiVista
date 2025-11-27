from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime

class OrderItemResponse(BaseModel):
    id: UUID
    product_id: UUID
    quantity: int
    unit_price_cents: int
    product_name: Optional[str] = None # Simplified for summary

class OrderSummary(BaseModel):
    id: UUID
    status: str
    total_amount_cents: int
    currency_code: str
    created_at: datetime

class OrderDetail(OrderSummary):
    shipping_address: Dict[str, Any]
    payment_provider: str
    items: List[OrderItemResponse]

class CreateOrderRequest(BaseModel):
    shipping_address: Dict[str, Any]
    payment_provider: str = "stripe"
