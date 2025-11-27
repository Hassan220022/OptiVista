from app.core.supabase_client import supabase
from typing import List, Dict, Any, Optional
from datetime import datetime
from fastapi import HTTPException


class ReviewService:
    """Service for managing product reviews and ratings."""
    
    @staticmethod
    def get_reviews_for_product(
        product_id: str,
        page: int = 1,
        page_size: int = 10,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> Dict[str, Any]:
        """Get reviews for a product with pagination and sorting."""
        # Calculate pagination
        start = (page - 1) * page_size
        end = start + page_size - 1
        
        # Build query - select reviews with user profile
        query = supabase.table("reviews").select(
            "*, profiles(full_name)",
            count="exact"
        ).eq("product_id", product_id)
        
        # Apply sorting
        query = query.order(sort_by, desc=(sort_order == "desc"))
        query = query.range(start, end)
        
        response = query.execute()
        
        # Get rating summary
        summary = ReviewService.get_rating_summary(product_id)
        
        # Transform items to match expected response model
        items = []
        for item in (response.data or []):
            items.append({
                "id": item["id"],
                "user_id": item["user_id"],
                "product_id": item["product_id"],
                "rating": item["rating"],
                "title": item.get("title"),
                "body": item.get("body", ""),
                "is_verified_purchase": False,
                "helpful_count": 0,
                "created_at": item["created_at"],
                "updated_at": item["updated_at"],
                "profiles": item.get("profiles")
            })
        
        return {
            "summary": summary,
            "items": items,
            "total": response.count or 0,
            "page": page,
            "page_size": page_size,
            "has_more": (response.count or 0) > end + 1
        }
    
    @staticmethod
    def get_rating_summary(product_id: str) -> Dict[str, Any]:
        """Get aggregated rating statistics for a product."""
        response = supabase.table("reviews").select(
            "rating"
        ).eq("product_id", product_id).execute()
        
        if not response.data:
            return {
                "average_rating": 0,
                "total_reviews": 0,
                "rating_distribution": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
            }
        
        ratings = [r["rating"] for r in response.data]
        total = len(ratings)
        average = sum(ratings) / total if total > 0 else 0
        
        distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        for r in ratings:
            if r in distribution:
                distribution[r] += 1
        
        return {
            "average_rating": round(average, 1),
            "total_reviews": total,
            "rating_distribution": distribution
        }
    
    @staticmethod
    def create_review(
        user_id: str,
        product_id: str,
        rating: int,
        title: Optional[str],
        body: str
    ) -> Dict[str, Any]:
        """Create a new review for a product."""
        # Validate rating
        if not 1 <= rating <= 5:
            raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
        
        # Check if user already reviewed this product
        existing = supabase.table("reviews").select("id").eq(
            "user_id", user_id
        ).eq("product_id", product_id).maybe_single().execute()
        
        if existing.data:
            raise HTTPException(
                status_code=400, 
                detail="You have already reviewed this product"
            )
        
        # Check if user purchased the product (verified purchase)
        order_check = supabase.table("order_items").select(
            "id, orders!inner(user_id, status)"
        ).eq("product_id", product_id).execute()
        
        is_verified = any(
            item.get("orders", {}).get("user_id") == user_id and
            item.get("orders", {}).get("status") == "delivered"
            for item in (order_check.data or [])
        )
        
        # Create review (matching actual schema)
        review_data = {
            "user_id": user_id,
            "product_id": product_id,
            "rating": rating,
            "title": title,
            "body": body
        }
        
        response = supabase.table("reviews").insert(review_data).execute()
        
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create review")
        
        return response.data[0]
    
    @staticmethod
    def update_review(
        user_id: str,
        review_id: str,
        rating: int,
        title: Optional[str],
        body: str
    ) -> Dict[str, Any]:
        """Update user's own review."""
        # Verify ownership
        existing = supabase.table("reviews").select("*").eq(
            "id", review_id
        ).eq("user_id", user_id).maybe_single().execute()
        
        if not existing.data:
            raise HTTPException(status_code=404, detail="Review not found")
        
        # Validate rating
        if not 1 <= rating <= 5:
            raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
        
        # Update review
        update_data = {
            "rating": rating,
            "title": title,
            "body": body,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table("reviews").update(update_data).eq(
            "id", review_id
        ).execute()
        
        return response.data[0] if response.data else existing.data
    
    @staticmethod
    def delete_review(user_id: str, review_id: str) -> None:
        """Delete user's own review."""
        # Verify ownership
        existing = supabase.table("reviews").select("id").eq(
            "id", review_id
        ).eq("user_id", user_id).maybe_single().execute()
        
        if not existing.data:
            raise HTTPException(status_code=404, detail="Review not found")
        
        supabase.table("reviews").delete().eq("id", review_id).execute()
    
    @staticmethod
    def get_user_reviews(user_id: str) -> List[Dict[str, Any]]:
        """Get all reviews by a user."""
        response = supabase.table("reviews").select(
            "*, products(id, name, primary_image_url)"
        ).eq("user_id", user_id).order("created_at", desc=True).execute()
        
        return response.data or []
    
    @staticmethod
    def mark_helpful(user_id: str, review_id: str) -> Dict[str, Any]:
        """Toggle helpful vote for a review."""
        # Check if user already voted
        existing_vote = supabase.table("review_helpful_votes").select("id").eq(
            "user_id", user_id
        ).eq("review_id", review_id).maybe_single().execute()
        
        if existing_vote.data:
            # Remove vote
            supabase.table("review_helpful_votes").delete().eq(
                "id", existing_vote.data["id"]
            ).execute()
            # Decrement count
            supabase.rpc("decrement_helpful_count", {"review_id": review_id}).execute()
        else:
            # Add vote
            supabase.table("review_helpful_votes").insert({
                "user_id": user_id,
                "review_id": review_id
            }).execute()
            # Increment count
            supabase.rpc("increment_helpful_count", {"review_id": review_id}).execute()
        
        # Get updated review
        response = supabase.table("reviews").select(
            "id, helpful_count"
        ).eq("id", review_id).maybe_single().execute()
        
        return response.data or {"id": review_id, "helpful_count": 0}
