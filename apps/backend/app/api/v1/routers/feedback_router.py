from fastapi import APIRouter, Depends
from app.api.dependencies.auth import get_current_user_id
from app.models.feedback_models import CreateFeedbackRequest
from app.core.supabase_client import supabase

router = APIRouter()

@router.post("/")
async def create_feedback(
    feedback: CreateFeedbackRequest,
    user_id: str = Depends(get_current_user_id)
):
    data = feedback.model_dump()
    data["user_id"] = user_id
    supabase.table("feedback").insert(data).execute()
    return {"status": "received"}
