from pydantic import BaseModel, Field
from typing import TypeVar, Generic, List, Optional, Any
from datetime import datetime


T = TypeVar('T')


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response model."""
    items: List[T]
    total: int
    page: int
    page_size: int
    has_more: bool = False
    
    @classmethod
    def create(
        cls, 
        items: List[T], 
        total: int, 
        page: int, 
        page_size: int
    ) -> "PaginatedResponse[T]":
        return cls(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            has_more=total > page * page_size
        )


class SuccessResponse(BaseModel):
    """Generic success response."""
    status: str = "success"
    message: str


class ErrorResponse(BaseModel):
    """Generic error response."""
    status: str = "error"
    detail: str
    code: Optional[str] = None


class TimestampMixin(BaseModel):
    """Mixin for created_at and updated_at fields."""
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class Money(BaseModel):
    """Money representation."""
    amount_cents: int = Field(..., ge=0)
    currency: str = Field(default="USD", max_length=3)
    
    @property
    def amount(self) -> float:
        return self.amount_cents / 100
    
    def format(self) -> str:
        symbols = {"USD": "$", "EUR": "€", "GBP": "£"}
        symbol = symbols.get(self.currency, self.currency + " ")
        return f"{symbol}{self.amount:.2f}"


class Address(BaseModel):
    """Shipping/billing address."""
    id: Optional[str] = None
    full_name: str
    line1: str
    line2: Optional[str] = None
    city: str
    state: Optional[str] = None
    postal_code: str
    country: str = "US"
    phone: Optional[str] = None
    is_default: bool = False


class ImageAsset(BaseModel):
    """Image asset with multiple sizes."""
    original_url: str
    thumbnail_url: Optional[str] = None
    medium_url: Optional[str] = None
    alt_text: Optional[str] = None


class SortOrder(BaseModel):
    """Sorting parameters."""
    field: str
    direction: str = Field(default="desc", pattern="^(asc|desc)$")
