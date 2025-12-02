from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.routers import (
    user_router,
    product_router,
    cart_router,
    order_router,
    ar_router,
    feedback_router,
    review_router,
    admin_router,
    seller_router,
    checkout_router
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Routers
app.include_router(user_router.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(product_router.router, prefix=f"{settings.API_V1_STR}/products", tags=["products"])
app.include_router(cart_router.router, prefix=f"{settings.API_V1_STR}/cart", tags=["cart"])
app.include_router(order_router.router, prefix=f"{settings.API_V1_STR}/orders", tags=["orders"])
app.include_router(ar_router.router, prefix=f"{settings.API_V1_STR}/ar", tags=["ar"])
app.include_router(feedback_router.router, prefix=f"{settings.API_V1_STR}/feedback", tags=["feedback"])
app.include_router(review_router.router, prefix=f"{settings.API_V1_STR}/reviews", tags=["reviews"])
app.include_router(checkout_router.router, prefix=f"{settings.API_V1_STR}/checkout", tags=["checkout"])
app.include_router(admin_router.router, prefix=f"{settings.API_V1_STR}/admin", tags=["admin"])
app.include_router(seller_router.router, prefix=f"{settings.API_V1_STR}/seller", tags=["seller"])

@app.get("/")
def root():
    return {"message": "Welcome to AR Eyewear App API"}
