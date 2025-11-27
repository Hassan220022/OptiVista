# Cart Domain Prompt

> **Usage**: Copy and paste this complete prompt to generate the cart backend domain.
> 
> **Prerequisites**: Run `00-master-project.md` and `backend/01-architecture.md` first.

---

You are a FastAPI domain engineer.

## Domain Configuration

```
Domain: cart
Base route: /api/v1/cart
Router file: apps/backend/app/api/v1/cart.py
Service file: apps/backend/app/services/cart_service.py
Schema file: apps/backend/app/schemas/cart.py
```

## Goal

Design endpoints, schemas, and services to manage the user's shopping cart.

---

## Task 1: Use Cases

| # | Use Case | Actor | Description |
|---|----------|-------|-------------|
| 1 | Get Cart | Shopper | Retrieve current cart contents |
| 2 | Add Item | Shopper | Add product variant to cart |
| 3 | Update Quantity | Shopper | Change item quantity |
| 4 | Remove Item | Shopper | Delete item from cart |
| 5 | Clear Cart | Shopper | Remove all items |
| 6 | Validate Cart | System | Check stock and prices before checkout |

---

## Task 2: Endpoints

#### `GET /api/v1/cart`

**Purpose**: Get current user's cart

**Authentication**: Required

**Response** (200):
```
{
  id: string — Cart ID
  items: [
    {
      id: string — Cart item ID
      product: {
        id: string
        name: string
        brand: string
        slug: string
        image_url: string
      }
      variant: {
        id: string
        color_name: string
        size: string
      }
      unit_price: decimal
      quantity: int
      max_quantity: int — Available stock
      line_total: decimal
      has_ar_asset: boolean
    }
  ]
  subtotal: decimal
  total_items: int
  currency: string
  updated_at: datetime
}
```

**Notes**:
- Returns empty cart if none exists (auto-create on first add)
- Includes current stock availability

---

#### `POST /api/v1/cart/items`

**Purpose**: Add item to cart

**Authentication**: Required

**Request Body**:
```
{
  product_id: string
  variant_id: string
  quantity: int — Default 1
}
```

**Response** (201):
```
{
  item: CartItem — Added item
  cart_summary: {
    subtotal: decimal
    total_items: int
  }
}
```

**Behavior**:
- If item already in cart, increment quantity
- Validate variant exists and is active
- Check stock availability
- Create cart if not exists

**Errors**:
| Status | Code | When |
|--------|------|------|
| 400 | `INSUFFICIENT_STOCK` | Quantity exceeds stock |
| 404 | `PRODUCT_NOT_FOUND` | Product doesn't exist |
| 404 | `VARIANT_NOT_FOUND` | Variant doesn't exist |
| 400 | `PRODUCT_UNAVAILABLE` | Product is inactive |

---

#### `PATCH /api/v1/cart/items/{item_id}`

**Purpose**: Update item quantity

**Authentication**: Required

**Path Parameters**: `item_id` (string)

**Request Body**:
```
{
  quantity: int — New quantity
}
```

**Response** (200):
```
{
  item: CartItem — Updated item
  cart_summary: {
    subtotal: decimal
    total_items: int
  }
}
```

**Behavior**:
- Validate quantity > 0 (else delete)
- Check stock availability
- Recalculate line total

**Errors**:
| Status | Code | When |
|--------|------|------|
| 404 | `ITEM_NOT_FOUND` | Cart item doesn't exist |
| 400 | `INSUFFICIENT_STOCK` | Quantity exceeds stock |
| 400 | `INVALID_QUANTITY` | Quantity <= 0 |

---

#### `DELETE /api/v1/cart/items/{item_id}`

**Purpose**: Remove item from cart

**Authentication**: Required

**Path Parameters**: `item_id` (string)

**Response** (200):
```
{
  cart_summary: {
    subtotal: decimal
    total_items: int
  }
}
```

---

#### `DELETE /api/v1/cart`

**Purpose**: Clear all cart items

**Authentication**: Required

**Response** (204): No content

---

#### `POST /api/v1/cart/validate`

**Purpose**: Validate cart for checkout

**Authentication**: Required

**Response** (200):
```
{
  valid: boolean
  issues: [
    {
      item_id: string
      product_name: string
      issue_type: string — "out_of_stock", "price_changed", "unavailable"
      details: string
      suggested_quantity: int | null
    }
  ]
  cart_summary: {
    subtotal: decimal
    total_items: int
  }
}
```

**Behavior**:
- Check each item's stock availability
- Compare stored price to current price
- Check product/variant is still active
- Return all issues found

---

## Task 3: Schemas

### Request Schemas

| Schema | Fields | Purpose |
|--------|--------|---------|
| `AddToCartRequest` | product_id, variant_id, quantity | Add item |
| `UpdateQuantityRequest` | quantity | Update quantity |

### Response Schemas

| Schema | Fields | Purpose |
|--------|--------|---------|
| `CartResponse` | Full cart with items | Get cart |
| `CartItemResponse` | Item with product/variant details | Item data |
| `CartSummary` | subtotal, total_items | Quick totals |
| `CartValidationResponse` | valid, issues, summary | Validation result |
| `CartIssue` | item_id, issue_type, details | Validation issue |

### Internal Entities

| Entity | Fields | Purpose |
|--------|--------|---------|
| `Cart` | id, user_id, items, status | Cart aggregate |
| `CartItem` | id, product_id, variant_id, quantity, unit_price | Cart line item |

---

## Task 4: Service Layer

### `CartService` (`app/services/cart_service.py`)

**Dependencies**: Supabase client, ProductService

**Methods**:

#### `get_cart(user_id) -> Cart`
- Query active cart for user
- Join with products and variants for display data
- Calculate totals
- Return cart (create empty if none)

#### `add_item(user_id, product_id, variant_id, quantity) -> CartItem`
- Get or create cart for user
- Validate product and variant exist and active
- Check stock availability
- If item exists, update quantity; else create
- Store current price as `unit_price`
- Return updated item

#### `update_quantity(user_id, item_id, quantity) -> CartItem`
- Verify item belongs to user's cart
- Validate stock availability
- Update quantity
- Recalculate line total
- Return updated item

#### `remove_item(user_id, item_id) -> None`
- Verify item belongs to user's cart
- Delete cart item

#### `clear_cart(user_id) -> None`
- Delete all items in user's cart
- Optionally keep cart record with empty items

#### `validate_cart(user_id) -> CartValidation`
- Get cart with current product/variant data
- Compare stored prices to current prices
- Check stock levels
- Check product/variant active status
- Return validation result with issues

---

## Task 5: Security

### Authentication
- All endpoints require valid JWT
- User can only access their own cart

### Authorization
- Cart ownership verified on every operation
- RLS policy: `user_id = auth.uid()`

### Data Integrity
- Price stored at time of add (for comparison)
- Stock validated before add and checkout
- Concurrent access handled (last write wins or merge)

---

## Task 6: Supabase Integration

### Tables Used
- `carts` (one active cart per user)
- `cart_items` (items in cart)
- `products` (for validation and display)
- `product_variants` (for validation and display)

### Queries

| Operation | Query Pattern |
|-----------|---------------|
| Get cart | `carts where user_id = ? and status = 'active'` |
| Get items | `cart_items where cart_id = ?` with product/variant join |
| Add item | Insert into `cart_items` |
| Update qty | Update `cart_items` where id = ? |
| Remove item | Delete from `cart_items` where id = ? |
| Clear | Delete from `cart_items` where cart_id = ? |

### Stock Check Pattern
```
// Conceptual
variant = get_variant(variant_id)
if variant.stock_quantity < requested_quantity:
    raise InsufficientStockError
```

---

## Task 7: Edge Cases

### Concurrent Modifications
- Handle race conditions in stock check
- Use database-level constraints where possible
- Return clear error if stock depleted

### Price Changes
- Store `unit_price` at time of add
- On checkout validation, detect price changes
- Optionally: update to current price or require confirmation

### Product Deactivation
- Validate on checkout, not on every cart view
- Mark items as unavailable in validation response
- Don't auto-remove (let user see and decide)

### Cart Expiration
- Optional: Expire abandoned carts after N days
- Background job to mark carts as 'abandoned'
- Release held inventory (if implementing holds)

---

## Expected Output

1. **Complete endpoint specifications** with request/response
2. **Schema definitions** for cart operations
3. **Service method descriptions** with business logic
4. **Stock validation** approach
5. **No Python code** - only descriptions
