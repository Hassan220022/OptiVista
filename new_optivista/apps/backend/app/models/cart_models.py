from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from app.models.product_models import ProductSummary

class CartItemBase(BaseModel):
    product_id: UUID
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(CartItemBase):
    id: UUID
    unit_price_cents: int
    product: Optional[ProductSummary] = None # Enriched data

class CartResponse(BaseModel):
    id: UUID
    user_id: UUID
    status: str
    items: List[CartItemResponse] = []
    total_amount_cents: int = 0
    created_at: datetime
    updated_at: datetime
