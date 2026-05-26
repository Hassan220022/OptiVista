from fastapi import Query
from typing import Optional
from app.models.product_models import ProductFilter

def get_product_filters(
    category: Optional[str] = Query(None, description="Category slug"),
    gender: Optional[str] = Query(None, description="Gender filter"),
    min_price: Optional[int] = Query(None, description="Minimum price in cents"),
    max_price: Optional[int] = Query(None, description="Maximum price in cents"),
    search: Optional[str] = Query(None, description="Search term")
) -> ProductFilter:
    return ProductFilter(
        category_slug=category,
        gender=gender,
        min_price=min_price,
        max_price=max_price,
        search=search
    )
