# Domain/API Prompt Template

> **Usage**: Use this template for each backend domain. Copy this file, replace placeholders, and run with your coding agent.
> 
> **Prerequisites**: Run `00-master-project.md` and `backend/01-architecture.md` first.

---

You are a FastAPI domain engineer.

## Domain Configuration

```
Domain: <REPLACE_WITH_DOMAIN_NAME>
Base route: /api/v1/<DOMAIN_PATH>
Router file: apps/backend/app/api/v1/<domain>.py
Service file: apps/backend/app/services/<domain>_service.py
Schema file: apps/backend/app/schemas/<domain>.py
```

## Goal

Design all REST endpoints, schemas, and services for this domain.

---

## Task 1: Use Case Inventory

List all use cases from the app's perspective:

| # | Use Case | Actor | Description |
|---|----------|-------|-------------|
| 1 | ... | Shopper/Admin | ... |

---

## Task 2: Endpoint Definitions

For each endpoint, define:

### Endpoint: `<METHOD> <PATH>`

**Purpose**: What this endpoint does

**Authentication**: Required / Optional / Admin-only

**Parameters**:
| Location | Name | Type | Required | Description |
|----------|------|------|----------|-------------|
| path | ... | ... | ... | ... |
| query | ... | ... | ... | ... |
| body | ... | ... | ... | ... |

**Request Body** (if applicable):
```
{
  field_name: type — description
}
```

**Response** (success):
```
{
  field_name: type — description
}
```

**Error Responses**:
| Status | Code | When |
|--------|------|------|
| 400 | ... | ... |
| 401 | ... | ... |
| 404 | ... | ... |

---

## Task 3: Schema Definitions

### Request Schemas

| Schema Name | Fields | Purpose |
|-------------|--------|---------|
| `...Request` | field: type | ... |

### Response Schemas

| Schema Name | Fields | Purpose |
|-------------|--------|---------|
| `...Response` | field: type | ... |

### Internal Entities

| Entity | Fields | Purpose |
|--------|--------|---------|
| ... | ... | ... |

---

## Task 4: Service Layer

### `<Domain>Service`

**Dependencies**: What it needs (DB client, other services)

**Methods**:

#### `method_name(params) -> ReturnType`
- **Purpose**: What it does
- **Input**: Parameter descriptions
- **Process**: Key logic steps
- **Output**: What it returns
- **Errors**: What can go wrong

---

## Task 5: Security Considerations

| Concern | Mitigation |
|---------|------------|
| Auth requirement | Which endpoints need auth |
| Admin-only operations | How admin role is checked |
| Data ownership | How to verify user owns resource |
| Rate limiting | Limits for sensitive endpoints |
| Input validation | Validation rules applied |

---

## Task 6: Supabase Integration

**Tables Used**: List of tables this domain reads/writes

**Queries**:
| Operation | Table | Filters | Joins |
|-----------|-------|---------|-------|
| ... | ... | ... | ... |

**Storage**: Any bucket access needed

---

## Domain Description

**<DESCRIBE DOMAIN IN DETAIL HERE>**

Example domain descriptions:

### Products & Catalog
> CRUD for products, variants, images. List with filters (category, price range, brand, gender, AR-enabled). Search by name/description. Get product details with all variants and AR assets. Admin: create/update/delete products.

### Cart
> User cart management. Get current cart. Add item (product + variant + quantity). Update item quantity. Remove item. Clear cart. Calculate totals. Validate stock availability.

### Checkout & Payments
> Checkout flow. Validate cart and stock. Calculate totals with shipping and tax. Create payment intent. Process webhook for payment confirmation. Create order from cart.

### Orders
> Order history for users. List user's orders with pagination. Get order details with items. Admin: list all orders, update order status, add tracking info.

### Reviews
> Product reviews and ratings. List reviews for product. Create review (verified purchase bonus). Update own review. Delete own review. Calculate product rating average.

---

## Expected Output

1. **Endpoint list** with complete specifications
2. **Schema definitions** in natural language
3. **Service method specifications**
4. **Security and integration notes**
5. **No Python code** - only descriptions

---

## Output Format Example

### Endpoint: `GET /api/v1/products`

**Purpose**: List products with optional filters and pagination

**Authentication**: Optional (public access)

**Parameters**:
| Location | Name | Type | Required | Description |
|----------|------|------|----------|-------------|
| query | `page` | int | No | Page number (default 1) |
| query | `limit` | int | No | Items per page (default 20, max 100) |
| query | `category` | string | No | Category slug filter |
| query | `brand` | string | No | Brand name filter |
| query | `min_price` | decimal | No | Minimum price filter |
| query | `max_price` | decimal | No | Maximum price filter |
| query | `ar_enabled` | bool | No | Filter AR-capable products |
| query | `search` | string | No | Search in name/description |
| query | `sort` | string | No | Sort field (price, name, created_at) |
| query | `order` | string | No | Sort order (asc, desc) |

**Response** (success - 200):
```
{
  items: [ProductListItem] — Array of product summaries
  total: int — Total matching products
  page: int — Current page
  limit: int — Items per page
  has_more: bool — More pages available
}
```

**Error Responses**:
| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_FILTER` | Invalid filter value |
| 400 | `INVALID_PAGINATION` | Page/limit out of range |
