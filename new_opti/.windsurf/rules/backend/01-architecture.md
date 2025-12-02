# Backend Architecture & Scaffold Prompt

> **Usage**: Use this prompt to build the complete FastAPI backend structure inside `apps/backend`.
> 
> **Prerequisites**: Run `00-master-project.md` first to establish context.

---

You are a senior backend engineer with strong FastAPI + Postgres + Supabase experience.

## Goal

Design and implement the full backend architecture for the AR Eyewear app inside `apps/backend`.

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Framework** | FastAPI |
| **Schemas** | Pydantic models for request/response |
| **Database** | Postgres via Supabase |
| **Auth** | JWT-based, compatible with Supabase auth tokens |
| **Structure** | Modular routers per domain |

## Task

### 1. Define Folder Structure

Design the complete folder structure under `apps/backend`:

```
apps/backend/
├── app/
│   ├── main.py              # App entry, startup
│   ├── core/                # Config, settings, security, error handling, logging
│   ├── api/                 # Router packages, versioning
│   ├── models/              # SQLAlchemy or ORM models (if needed)
│   ├── schemas/             # Pydantic schemas
│   ├── services/            # Business logic
│   ├── dependencies/        # FastAPI dependencies
│   └── utils/               # Helpers
├── tests/                   # Unit/integration tests
├── requirements.txt
├── Dockerfile
└── .env.example
```

### 2. Core Module (`app/core/`)

Define these files:

| File | Responsibility |
|------|----------------|
| `config.py` | Environment-based configuration, settings object |
| `settings.py` | Pydantic Settings with validation |
| `security.py` | JWT verification, password hashing, auth utilities |
| `errors.py` | Custom exception classes |
| `error_handlers.py` | FastAPI exception handlers |
| `logging.py` | Logging configuration, formatters |
| `supabase.py` | Supabase client initialization |

### 3. API Module (`app/api/`)

Define router organization:

```
app/api/
├── __init__.py
├── v1/
│   ├── __init__.py          # Router aggregation
│   ├── auth.py              # Auth endpoints
│   ├── users.py             # User profile endpoints
│   ├── products.py          # Product catalog endpoints
│   ├── ar_assets.py         # AR asset endpoints
│   ├── cart.py              # Cart management
│   ├── checkout.py          # Checkout flow
│   ├── orders.py            # Order management
│   └── reviews.py           # Reviews & ratings
└── health.py                # Health check endpoint
```

### 4. Schemas Module (`app/schemas/`)

Define schema organization:

| File | Contents |
|------|----------|
| `auth.py` | LoginRequest, TokenResponse, SignupRequest |
| `users.py` | UserProfile, UserUpdate, UserResponse |
| `products.py` | ProductList, ProductDetail, ProductFilter |
| `ar_assets.py` | ARAsset, ARAssetResponse |
| `cart.py` | CartItem, Cart, AddToCartRequest |
| `checkout.py` | CheckoutRequest, CheckoutResponse, PaymentIntent |
| `orders.py` | Order, OrderItem, OrderStatus |
| `reviews.py` | Review, CreateReviewRequest, ReviewResponse |
| `common.py` | Pagination, ErrorResponse, SuccessResponse |

### 5. Services Module (`app/services/`)

Define business logic layer:

| Service | Responsibility |
|---------|----------------|
| `auth_service.py` | Token validation, user session management |
| `user_service.py` | Profile CRUD operations |
| `product_service.py` | Product queries, filtering, search |
| `ar_asset_service.py` | AR asset retrieval, signed URLs |
| `cart_service.py` | Cart CRUD, item management |
| `checkout_service.py` | Checkout flow, payment integration |
| `order_service.py` | Order creation, status updates |
| `review_service.py` | Review CRUD, rating calculations |

### 6. Dependencies Module (`app/dependencies/`)

Define FastAPI dependencies:

| Dependency | Purpose |
|------------|---------|
| `database.py` | Database session/connection |
| `auth.py` | `get_current_user`, `get_optional_user`, `require_admin` |
| `pagination.py` | Pagination parameters |

### 7. Cross-Cutting Concerns

#### API Versioning
- Base path: `/api/v1`
- Router registration pattern
- Version upgrade strategy

#### Error Handling Strategy
- Custom exception classes per error type
- Global exception handlers
- Consistent error response format
- HTTP status code mapping

#### Logging Strategy
- Request logging middleware
- Error logging with stack traces
- Slow query logging
- Structured JSON logs for production

#### Security
- JWT verification against Supabase public key
- Role-based access control
- Rate limiting considerations
- CORS configuration

### 8. Testing Structure

```
tests/
├── conftest.py              # Fixtures
├── unit/
│   ├── services/
│   └── utils/
├── integration/
│   └── api/
└── factories/               # Test data factories
```

---

## Expected Output

1. **Complete directory tree** for `apps/backend`
2. **Per-file explanation**: responsibilities, main functions/classes, interactions
3. **No Python code** - only detailed descriptions

---

## Output Format Example

### `app/main.py`

**Responsibility**: Application entry point, FastAPI app initialization.

**Main Components**:
- `create_app()` factory function
- Lifespan context manager for startup/shutdown
- Router registration
- Middleware setup (CORS, logging)
- Exception handler registration

**Interactions**:
- Imports routers from `app/api/v1/`
- Uses config from `app/core/config.py`
- Registers error handlers from `app/core/error_handlers.py`

### `app/core/security.py`

**Responsibility**: Authentication and authorization utilities.

**Main Functions**:
- `verify_jwt_token(token: str) -> dict`: Validates Supabase JWT, returns payload
- `get_user_id_from_token(token: str) -> str`: Extracts user ID
- `check_admin_role(user: dict) -> bool`: Verifies admin permissions

**Dependencies**:
- Uses `python-jose` for JWT decoding
- Reads Supabase JWT secret from settings

**Used By**:
- `app/dependencies/auth.py` for route protection
