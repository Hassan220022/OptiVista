---
trigger: model_decision
---

# Orders Domain Prompt

> **Usage**: Copy and paste this complete prompt to generate the orders backend domain.
> 
> **Prerequisites**: Run `00-master-project.md` and `backend/01-architecture.md` first.

---

You are a FastAPI domain engineer.

## Domain Configuration

```
Domain: orders
Base route: /api/v1/orders
Router file: apps/backend/app/api/v1/orders.py
Service file: apps/backend/app/services/order_service.py
Schema file: apps/backend/app/schemas/orders.py
```

## Goal

Design endpoints and services for orders: listing, fetching details, updating status (admin).

---

## Task 1: Use Cases

### User Use Cases
| # | Use Case | Actor | Description |
|---|----------|-------|-------------|
| 1 | List Orders | Shopper | View order history with pagination |
| 2 | Get Order Details | Shopper | View single order with all details |
| 3 | Track Order | Shopper | Get tracking information |

### Admin Use Cases
| # | Use Case | Actor | Description |
|---|----------|-------|-------------|
| 1 | List All Orders | Admin | View all orders with filters |
| 2 | Update Status | Admin | Change order status |
| 3 | Add Tracking | Admin | Add tracking number/URL |

---

## Task 2: Endpoints

### User Endpoints

#### `GET /api/v1/orders`

**Purpose**: List user's orders

**Authentication**: Required

**Query Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `page` | int | No | Page number (default: 1) |
| `page_size` | int | No | Items per page (default: 10) |
| `status` | string | No | Filter by status |

**Response** (200):
```
{
  items: [
    {
      id: string
      order_number: string
      status: string
      created_at: datetime
      item_count: int
      total: decimal
      currency: string
      preview_image_url: string | null — First item image
    }
  ]
  total: int
  page: int
  page_size: int
  has_more: boolean
}
```

---

#### `GET /api/v1/orders/{order_id}`

**Purpose**: Get order details

**Authentication**: Required (must own order)

**Path Parameters**: `order_id` (string)

**Response** (200):
```
{
  id: string
  order_number: string
  status: string
  payment_status: string
  created_at: datetime
  updated_at: datetime
  items: [
    {
      id: string
      product_id: string
      product_name: string
      variant_name: string
      image_url: string
      quantity: int
      unit_price: decimal
      line_total: decimal
    }
  ]
  shipping_address: {
    full_name: string
    street_address: string
    city: string
    state: string
    postal_code: string
    country: string
    phone: string
  }
  shipping_method: string
  tracking: {
    number: string | null
    url: string | null
    carrier: string | null
  }
  totals: {
    subtotal: decimal
    shipping_cost: decimal
    tax_amount: decimal
    discount_amount: decimal
    total: decimal
  }
  currency: string
  payment_method: string
  payment_last_four: string | null
  estimated_delivery: date | null
  status_history: [
    {
      status: string
      timestamp: datetime
      note: string | null
    }
  ]
}
```

**Errors**:
| Status | Code | When |
|--------|------|------|
| 404 | `ORDER_NOT_FOUND` | Order doesn't exist or not owned |

---

#### `GET /api/v1/orders/{order_id}/tracking`

**Purpose**: Get tracking information

**Authentication**: Required (must own order)

**Response** (200):
```
{
  order_id: string
  order_number: string
  status: string
  tracking: {
    number: string | null
    url: string | null
    carrier: string | null
    estimated_delivery: date | null
  }
  status_history: [StatusEvent]
}
```

---

### Admin Endpoints

#### `GET /api/v1/orders/admin`

**Purpose**: List all orders (admin)

**Authentication**: Required (Admin role)

**Query Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `page` | int | No | Page number |
| `page_size` | int | No | Items per page |
| `status` | string | No | Filter by status |
| `date_from` | date | No | Orders from date |
| `date_to` | date | No | Orders to date |
| `search` | string | No | Search by order number or email |

**Response** (200):
```
{
  items: [
    {
      id: string
      order_number: string
      user_email: string
      status: string
      payment_status: string
      total: decimal
      item_count: int
      created_at: datetime
    }
  ]
  total: int
  page: int
  has_more: boolean
}
```

---

#### `PATCH /api/v1/orders/{order_id}/status`

**Purpose**: Update order status

**Authentication**: Required (Admin role)

**Request Body**:
```
{
  status: string — New status
  note: string | null — Optional note
}
```

**Response** (200):
```
{
  id: string
  order_number: string
  status: string
  updated_at: datetime
}
```

**Valid Status Transitions**:
| From | To |
|------|----|
| pending | confirmed, cancelled |
| confirmed | processing, cancelled |
| processing | shipped, cancelled |
| shipped | delivered |
| delivered | (terminal) |
| cancelled | (terminal) |

**Errors**:
| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_TRANSITION` | Status transition not allowed |
| 404 | `ORDER_NOT_FOUND` | Order doesn't exist |

---

#### `PATCH /api/v1/orders/{order_id}/tracking`

**Purpose**: Add/update tracking information

**Authentication**: Required (Admin role)

**Request Body**:
```
{
  tracking_number: string
  tracking_url: string | null
  carrier: string — "fedex", "ups", "usps", etc.
  estimated_delivery: date | null
}
```

**Response** (200): Updated order with tracking

**Behavior**:
- If order status is "processing", auto-advance to "shipped"
- Optionally trigger notification to customer

---

## Task 3: Schemas

### Request Schemas

| Schema | Fields | Purpose |
|--------|--------|---------|
| `UpdateStatusRequest` | status, note? | Status update |
| `UpdateTrackingRequest` | tracking_number, url?, carrier, estimated_delivery? | Tracking update |

### Response Schemas

| Schema | Fields | Purpose |
|--------|--------|---------|
| `OrderSummary` | Basic order info | List item |
| `OrderDetail` | Full order with items and history | Detail view |
| `OrderListResponse` | items, pagination | Paginated list |
| `TrackingInfo` | number, url, carrier, estimated | Tracking data |
| `StatusEvent` | status, timestamp, note | History item |

---

## Task 4: Service Layer

### `OrderService` (`app/services/order_service.py`)

**Dependencies**: Supabase client, NotificationService (optional)

**Methods**:

#### `create_order(user_id, checkout_session, payment_intent) -> Order`
- Create order from checkout session
- Create order items from cart snapshot
- Set initial status: "pending"
- Set payment status: "pending"
- Called by CheckoutService on payment intent creation

#### `confirm_order(order_id) -> Order`
- Update status to "confirmed"
- Update payment status to "paid"
- Reduce inventory
- Clear user's cart
- Add status history entry
- Queue confirmation email

#### `get_orders(user_id, filters, pagination) -> OrderListResult`
- Query orders for user
- Apply status filter
- Return paginated list with summaries

#### `get_order(user_id, order_id) -> OrderDetail`
- Fetch order with all relations
- Verify ownership
- Return full details

#### `get_all_orders(filters, pagination) -> OrderListResult` (Admin)
- Query all orders
- Apply filters (status, date range, search)
- Return paginated list

#### `update_status(order_id, new_status, note) -> Order` (Admin)
- Validate status transition
- Update order status
- Add to status history
- Optionally notify customer
- Return updated order

#### `update_tracking(order_id, tracking_info) -> Order` (Admin)
- Update tracking fields
- Auto-advance status if appropriate
- Optionally notify customer
- Return updated order

---

## Task 5: Security

### User Endpoints
- JWT required
- RLS ensures users only see own orders
- Order ownership verified in service

### Admin Endpoints
- Admin role required
- All orders accessible
- Actions logged for audit

### Data Protection
- Payment details (last 4 only) stored
- Full card numbers never stored
- Address data encrypted at rest (Supabase default)

---

## Task 6: Supabase Integration

### Tables Used
- `orders`
- `order_items`
- `profiles` (for user email in admin view)

### Order Status Values
```
pending → confirmed → processing → shipped → delivered
                ↓           ↓          ↓
            cancelled  cancelled  (n/a)
```

### Status History
Store as JSONB array in orders table or separate table:
```
status_history: [
  { status: "pending", timestamp: "...", note: null },
  { status: "confirmed", timestamp: "...", note: "Payment received" },
  ...
]
```

### Queries

| Operation | Query Pattern |
|-----------|---------------|
| User orders | `orders where user_id = ? order by created_at desc` |
| Order detail | `orders where id = ? and user_id = ?` with items join |
| Admin orders | `orders` with filters, join profiles for email |
| Update status | `update orders set status = ?, updated_at = now()` |

---

## Task 7: Notifications (Optional)

### Trigger Points
| Event | Notification |
|-------|--------------|
| Order confirmed | Email: "Order confirmed" |
| Order shipped | Email: "Your order is on the way" + tracking |
| Order delivered | Email: "Your order has been delivered" |

### Implementation Note
- Use background task/queue for sending
- Don't block API response
- Handle failures gracefully

---

## Expected Output

1. **Complete order endpoints** for users and admin
2. **Status management** with valid transitions
3. **Tracking integration** approach
4. **Service layer** with business logic
5. **No Python code** - only descriptions
