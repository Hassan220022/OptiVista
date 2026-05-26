from fastapi import APIRouter, Depends, Query
from app.api.dependencies.pagination import PaginationParams, get_pagination_params
from app.api.dependencies.filters import ProductFilter, get_product_filters
from app.services.product_service import ProductService
from app.models.product_models import ProductSummary, ProductDetail
from typing import List, Dict, Any
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=Dict[str, Any])
async def read_products(
    pagination: PaginationParams = Depends(get_pagination_params),
    filters: ProductFilter = Depends(get_product_filters)
):
    data, count = ProductService.get_products(filters, pagination.page, pagination.page_size)
    return {
        "items": data,
        "total": count,
        "page": pagination.page,
        "page_size": pagination.page_size
    }

@router.get("/{product_id}", response_model=ProductDetail)
async def read_product(product_id: UUID):
    return ProductService.get_product_by_id(str(product_id))
