from fastapi import APIRouter, Depends
from app.api.dependencies.auth import get_current_user_id
from app.services.order_service import OrderService
from app.models.order_models import OrderSummary, CreateOrderRequest, OrderDetail
from typing import List

router = APIRouter()

@router.get("/", response_model=List[OrderSummary])
async def get_orders(user_id: str = Depends(get_current_user_id)):
    return OrderService.get_orders(user_id)

@router.get("/{order_id}", response_model=OrderDetail)
async def get_order(order_id: str, user_id: str = Depends(get_current_user_id)):
    return OrderService.get_order_details(user_id, order_id)

@router.post("/", response_model=OrderSummary)
async def create_order(
    request: CreateOrderRequest,
    user_id: str = Depends(get_current_user_id)
):
    return OrderService.create_order(user_id, request)
