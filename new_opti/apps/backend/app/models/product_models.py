from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    slug: str
    brand: Optional[str] = None
    price_cents: int
    currency_code: str = "USD"
    thumbnail_url: Optional[str] = None
    avg_rating: Optional[float] = 0.0

class ProductSummary(ProductBase):
    id: UUID
    category_id: UUID

class ProductDetail(ProductSummary):
    description: Optional[str] = None
    frame_type: Optional[str] = None
    frame_material: Optional[str] = None
    frame_color: Optional[str] = None
    lens_width_mm: Optional[int] = None
    bridge_width_mm: Optional[int] = None
    temple_length_mm: Optional[int] = None
    stock_quantity: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

class ProductFilter(BaseModel):
    category_slug: Optional[str] = None
    gender: Optional[str] = None
    min_price: Optional[int] = None
    max_price: Optional[int] = None
    search: Optional[str] = None
