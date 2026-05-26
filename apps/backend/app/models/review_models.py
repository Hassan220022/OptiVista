from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from datetime import datetime


class RatingSummary(BaseModel):
    """Aggregated rating statistics for a product."""
    average_rating: float = Field(..., ge=0, le=5)
    total_reviews: int = Field(..., ge=0)
    rating_distribution: Dict[int, int] = Field(
        default_factory=lambda: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    )


class ReviewUser(BaseModel):
    """User info embedded in review."""
    full_name: Optional[str] = None


class ReviewResponse(BaseModel):
    """Single review response."""
    id: str
    user_id: str
    product_id: str
    rating: int = Field(..., ge=1, le=5)
    title: Optional[str] = None
    body: str
    is_verified_purchase: bool = False
    helpful_count: int = 0
    created_at: datetime
    updated_at: datetime
    profiles: Optional[ReviewUser] = None
    
    class Config:
        from_attributes = True


class ReviewListResponse(BaseModel):
    """Paginated list of reviews."""
    summary: RatingSummary
    items: List[ReviewResponse]
    total: int
    page: int
    page_size: int
    has_more: bool


class CreateReviewRequest(BaseModel):
    """Request to create a new review."""
    product_id: str
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5 stars")
    title: Optional[str] = Field(None, max_length=200)
    body: str = Field(..., min_length=10, max_length=5000)


class UpdateReviewRequest(BaseModel):
    """Request to update a review."""
    rating: int = Field(..., ge=1, le=5)
    title: Optional[str] = Field(None, max_length=200)
    body: str = Field(..., min_length=10, max_length=5000)


class MyReviewResponse(BaseModel):
    """User's review with product info."""
    id: str
    product_id: str
    product_name: str
    product_image_url: Optional[str] = None
    rating: int
    title: Optional[str] = None
    body: str
    status: str
    created_at: datetime
