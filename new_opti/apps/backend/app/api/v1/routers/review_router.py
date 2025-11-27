from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.api.dependencies.auth import get_current_user_id, get_optional_user_id
from app.services.review_service import ReviewService
from app.models.review_models import (
    ReviewResponse,
    ReviewListResponse,
    RatingSummary,
    CreateReviewRequest,
    UpdateReviewRequest
)

router = APIRouter()


@router.get("/product/{product_id}", response_model=ReviewListResponse)
async def get_product_reviews(
    product_id: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    sort_by: str = Query("created_at", regex="^(created_at|rating|helpful_count)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    rating: Optional[int] = Query(None, ge=1, le=5)
):
    """Get reviews for a product with pagination."""
    return ReviewService.get_reviews_for_product(
        product_id=product_id,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order
    )


@router.get("/product/{product_id}/summary", response_model=RatingSummary)
async def get_product_rating_summary(product_id: str):
    """Get rating summary for a product."""
    return ReviewService.get_rating_summary(product_id)


@router.post("/", response_model=ReviewResponse)
async def create_review(
    review: CreateReviewRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Create a new review for a product."""
    return ReviewService.create_review(
        user_id=user_id,
        product_id=review.product_id,
        rating=review.rating,
        title=review.title,
        body=review.body
    )


@router.put("/{review_id}", response_model=ReviewResponse)
async def update_review(
    review_id: str,
    review: UpdateReviewRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Update user's own review."""
    return ReviewService.update_review(
        user_id=user_id,
        review_id=review_id,
        rating=review.rating,
        title=review.title,
        body=review.body
    )


@router.delete("/{review_id}")
async def delete_review(
    review_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Delete user's own review."""
    ReviewService.delete_review(user_id, review_id)
    return {"status": "success", "message": "Review deleted"}


@router.get("/me")
async def get_my_reviews(user_id: str = Depends(get_current_user_id)):
    """Get current user's reviews."""
    return {"items": ReviewService.get_user_reviews(user_id)}


@router.post("/{review_id}/helpful")
async def toggle_helpful(
    review_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Mark or unmark a review as helpful."""
    return ReviewService.mark_helpful(user_id, review_id)
