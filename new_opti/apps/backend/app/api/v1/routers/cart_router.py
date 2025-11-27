from fastapi import APIRouter, Depends, HTTPException
from app.api.dependencies.auth import get_current_user_id
from app.services.cart_service import CartService
from app.models.cart_models import CartResponse, CartItemCreate, CartItemUpdate

router = APIRouter()

@router.get("/", response_model=CartResponse)
async def get_cart(user_id: str = Depends(get_current_user_id)):
    return CartService.get_active_cart(user_id)

@router.post("/items", response_model=CartResponse)
async def add_item_to_cart(
    item: CartItemCreate,
    user_id: str = Depends(get_current_user_id)
):
    return CartService.add_item(user_id, item.product_id, item.quantity)

@router.put("/items/{item_id}", response_model=CartResponse)
async def update_item_quantity(
    item_id: str,
    item: CartItemUpdate,
    user_id: str = Depends(get_current_user_id)
):
    return CartService.update_item(user_id, item_id, item.quantity)

@router.delete("/items/{item_id}")
async def remove_item_from_cart(
    item_id: str,
    user_id: str = Depends(get_current_user_id)
):
    CartService.remove_item(user_id, item_id)
    return {"status": "success"}
