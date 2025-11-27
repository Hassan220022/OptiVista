from fastapi import APIRouter, Depends, HTTPException
from app.api.dependencies.auth import get_current_user_id, get_current_user
from app.services.user_service import UserService
from app.models.user_models import UserResponse, ProfileUpdate, PDUpdate

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    profile = UserService.get_profile(user_id)
    
    if not profile:
        # If profile doesn't exist (e.g. first login), we might want to create it or just return basic info
        # For now, let's return a basic structure with the info we have
        return UserResponse(
            id=user_id,
            email=current_user["email"],
            role=current_user.get("role", "user")
        )
    
    # Merge auth info (email) with profile info
    profile["email"] = current_user["email"]
    return profile

@router.patch("/me", response_model=UserResponse)
async def update_user_me(
    update_data: ProfileUpdate,
    user_id: str = Depends(get_current_user_id)
):
    return UserService.update_profile(user_id, update_data)

@router.patch("/me/pd", response_model=UserResponse)
async def update_user_pd(
    pd_data: PDUpdate,
    user_id: str = Depends(get_current_user_id)
):
    return UserService.update_pd(user_id, pd_data)
