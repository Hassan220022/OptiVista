from fastapi import APIRouter, Depends, HTTPException
from app.services.ar_service import ARService
from app.models.ar_models import ARAssetResponse

router = APIRouter()

@router.get("/assets/{product_id}", response_model=ARAssetResponse)
async def get_ar_asset(product_id: str):
    asset = ARService.get_asset(product_id)
    if not asset:
        raise HTTPException(status_code=404, detail="AR Asset not found")
    return asset
