from app.core.supabase_client import supabase
from typing import Dict, Any, Optional, List
from datetime import datetime
from fastapi import HTTPException
import platform
import sys


class FeedbackService:
    """Service for managing user feedback and support requests."""
    
    @staticmethod
    def submit_feedback(
        user_id: str,
        feedback_type: str,
        message: str,
        rating: Optional[int] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Submit user feedback.
        
        Args:
            user_id: The user's UUID
            feedback_type: Category of feedback (app_experience, ar_accuracy, etc.)
            message: The feedback message
            rating: Optional rating (1-5)
            metadata: Optional device/app metadata
            
        Returns:
            Created feedback record
        """
        # Validate feedback type
        valid_types = [
            "app_experience",
            "ar_accuracy", 
            "order_issue",
            "feature_request",
            "bug_report",
            "other"
        ]
        
        if feedback_type not in valid_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid feedback type. Must be one of: {', '.join(valid_types)}"
            )
        
        # Validate rating if provided
        if rating is not None and not 1 <= rating <= 5:
            raise HTTPException(
                status_code=400,
                detail="Rating must be between 1 and 5"
            )
        
        # Validate message length
        if len(message.strip()) < 10:
            raise HTTPException(
                status_code=400,
                detail="Message must be at least 10 characters"
            )
        
        # Build feedback data
        feedback_data = {
            "user_id": user_id,
            "type": feedback_type,
            "message": message.strip(),
            "rating": rating,
            "metadata": metadata or {},
            "status": "pending",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table("feedback").insert(feedback_data).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=500,
                detail="Failed to submit feedback"
            )
        
        return response.data[0]
    
    @staticmethod
    def get_user_feedback(user_id: str) -> List[Dict[str, Any]]:
        """Get all feedback submitted by a user."""
        response = supabase.table("feedback").select("*").eq(
            "user_id", user_id
        ).order("created_at", desc=True).execute()
        
        return response.data or []
    
    @staticmethod
    def get_feedback_by_id(feedback_id: str, user_id: str) -> Dict[str, Any]:
        """Get specific feedback by ID (user must own it)."""
        response = supabase.table("feedback").select("*").eq(
            "id", feedback_id
        ).eq("user_id", user_id).maybe_single().execute()
        
        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Feedback not found"
            )
        
        return response.data
    
    @staticmethod
    def get_all_feedback(
        status: Optional[str] = None,
        feedback_type: Optional[str] = None,
        page: int = 1,
        page_size: int = 20
    ) -> Dict[str, Any]:
        """
        Get all feedback (admin only).
        
        Args:
            status: Filter by status (pending, reviewed, resolved)
            feedback_type: Filter by type
            page: Page number
            page_size: Items per page
            
        Returns:
            Paginated feedback list
        """
        query = supabase.table("feedback").select(
            "*, profiles(full_name, email)",
            count="exact"
        )
        
        if status:
            query = query.eq("status", status)
        
        if feedback_type:
            query = query.eq("type", feedback_type)
        
        # Pagination
        start = (page - 1) * page_size
        end = start + page_size - 1
        query = query.order("created_at", desc=True).range(start, end)
        
        response = query.execute()
        
        return {
            "items": response.data or [],
            "total": response.count or 0,
            "page": page,
            "page_size": page_size,
            "has_more": (response.count or 0) > end + 1
        }
    
    @staticmethod
    def update_feedback_status(
        feedback_id: str,
        status: str,
        admin_notes: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Update feedback status (admin only).
        
        Args:
            feedback_id: The feedback UUID
            status: New status (pending, reviewed, resolved, closed)
            admin_notes: Optional notes from admin
        """
        valid_statuses = ["pending", "reviewed", "resolved", "closed"]
        
        if status not in valid_statuses:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        
        update_data = {
            "status": status,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        if admin_notes:
            update_data["admin_notes"] = admin_notes
        
        response = supabase.table("feedback").update(update_data).eq(
            "id", feedback_id
        ).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Feedback not found"
            )
        
        return response.data[0]
    
    @staticmethod
    def build_device_metadata() -> Dict[str, Any]:
        """Build device/system metadata for feedback."""
        return {
            "python_version": sys.version,
            "platform": platform.platform(),
            "timestamp": datetime.utcnow().isoformat()
        }
