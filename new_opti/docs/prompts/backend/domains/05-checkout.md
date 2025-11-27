# Checkout & Payments Domain Prompt

> **Usage**: Copy and paste this complete prompt to generate the checkout backend domain.
> 
> **Prerequisites**: Run `00-master-project.md` and `backend/01-architecture.md` first.

---

You are a FastAPI domain engineer.

## Domain Configuration

```
Domain: checkout & payments
Base route: /api/v1/checkout
Router file: apps/backend/app/api/v1/checkout.py
Service files: 
  - apps/backend/app/services/checkout_service.py
  - apps/backend/app/services/payment_service.py
Schema file: apps/backend/app/schemas/checkout.py
```

## Goal

Design backend side of checkout and payment lifecycle: validating cart, creating payment intent, confirming order after payment.

---

## Task 1: Use Cases

| # | Use Case | Actor | Description |
|---|----------|-------|-------------|
| 1 | Start Checkout | Shopper | Validate cart, calculate totals |
| 2 | Get Checkout Summary | Shopper | View totals with shipping/tax |
| 3 | Create Payment Intent | System | Initialize payment with gateway |
| 4 | Process Webhook | Gateway | Receive payment confirmation |
| 5 | Confirm Order | System | Create order after successful payment |
| 6 | Handle Failure | System | Manage failed payments |

---

## Task 2: Endpoints

#### `POST /api/v1/checkout/start`

**Purpose**: Start checkout session, validate cart, calculate totals

**Authentication**: Required

**Request Body**:
```
{
  address_id: string
  shipping_method_id: string
  promo_code: string | null
}
```

**Response** (200):
```
{
  checkout_session_id: string
  summary: {
    items: [
      {
        product_name: string
        variant_name: string
        quantity: int
        unit_price: decimal
        line_total: decimal
      }
    ]
    subtotal: decimal
    shipping_cost: decimal
    tax_amount: decimal
    discount_amount: decimal
    total: decimal
    currency: string
  }
  shipping_address: AddressResponse
  shipping_method: {
    id: string
    name: string
    estimated_days: int
    cost: decimal
  }
  expires_at: datetime — Session expiration
}
```

**Behavior**:
1. Validate cart (stock, prices, availability)
2. Validate address belongs to user
3. Validate shipping method
4. Apply promo code if provided
5. Calculate totals (subtotal + shipping + tax - discount)
6. Create checkout session record
7. Return session with summary

**Errors**:
| Status | Code | When |
|--------|------|------|
| 400 | `CART_EMPTY` | No items in cart |
| 400 | `CART_INVALID` | Stock or availability issues |
| 404 | `ADDRESS_NOT_FOUND` | Address doesn't exist |
| 400 | `SHIPPING_UNAVAILABLE` | Shipping method not available |
| 400 | `PROMO_INVALID` | Promo code invalid or expired |

---

#### `GET /api/v1/checkout/summary`

**Purpose**: Get current checkout session summary

**Authentication**: Required

**Query Parameters**: `session_id` (optional, uses latest if not provided)

**Response** (200): Same summary as start checkout

**Errors**:
| Status | Code | When |
|--------|------|------|
| 404 | `SESSION_NOT_FOUND` | No active checkout session |
| 400 | `SESSION_EXPIRED` | Checkout session expired |

---

#### `POST /api/v1/checkout/create-payment-intent`

**Purpose**: Create payment intent with gateway

**Authentication**: Required

**Request Body**:
```
{
  checkout_session_id: string
  payment_method_type: string — "card", "apple_pay", etc.
}
```

**Response** (200):
```
{
  payment_intent_id: string — Gateway's intent ID
  client_secret: string — For frontend SDK
  amount: int — Amount in cents
  currency: string
  status: string — "requires_payment_method"
}
```

**Behavior**:
1. Validate checkout session exists and not expired
2. Re-validate cart (final check)
3. Create pending order record
4. Call payment gateway to create intent
5. Link intent to order
6. Return client secret for frontend

**Errors**:
| Status | Code | When |
|--------|------|------|
| 404 | `SESSION_NOT_FOUND` | Session doesn't exist |
| 400 | `SESSION_EXPIRED` | Session expired |
| 400 | `CART_CHANGED` | Cart modified since session start |
| 500 | `PAYMENT_ERROR` | Gateway error |

---

#### `POST /api/v1/checkout/webhook`

**Purpose**: Receive payment events from gateway

**Authentication**: Webhook signature verification (not user auth)

**Headers**: 
- `Stripe-Signature` (or equivalent for other gateways)

**Request Body**: Raw gateway webhook payload

**Response** (200):
```
{ "received": true }
```

**Behavior**:
1. Verify webhook signature
2. Parse event type
3. Handle based on event:

| Event | Action |
|-------|--------|
| `payment_intent.succeeded` | Confirm order, update status, reduce inventory, clear cart |
| `payment_intent.payment_failed` | Update order status, keep cart |
| `payment_intent.canceled` | Update order status, keep cart |

4. Return 200 quickly (async processing if needed)

**Errors**:
| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_SIGNATURE` | Webhook signature invalid |
| 400 | `UNKNOWN_EVENT` | Unhandled event type |

---

#### `GET /api/v1/checkout/order/{order_id}/confirmation`

**Purpose**: Get order confirmation after successful payment

**Authentication**: Required (must own order)

**Response** (200):
```
{
  order_id: string
  order_number: string
  status: string — "confirmed"
  items: [OrderItem]
  totals: {
    subtotal: decimal
    shipping: decimal
    tax: decimal
    discount: decimal
    total: decimal
  }
  shipping_address: Address
  estimated_delivery: date | null
  created_at: datetime
}
```

---

#### `GET /api/v1/checkout/shipping-methods`

**Purpose**: Get available shipping methods for address

**Authentication**: Required

**Query Parameters**: `address_id` (string)

**Response** (200):
```
{
  methods: [
    {
      id: string
      name: string — "Standard", "Express"
      description: string
      cost: decimal
      estimated_days: int
      estimated_delivery: date
    }
  ]
}
```

---

## Task 3: Schemas

### Request Schemas

| Schema | Fields | Purpose |
|--------|--------|---------|
| `StartCheckoutRequest` | address_id, shipping_method_id, promo_code? | Start checkout |
| `CreatePaymentIntentRequest` | checkout_session_id, payment_method_type | Create intent |

### Response Schemas

| Schema | Fields | Purpose |
|--------|--------|---------|
| `CheckoutSessionResponse` | session_id, summary, expires_at | Checkout session |
| `CheckoutSummary` | items, totals, shipping | Order summary |
| `PaymentIntentResponse` | intent_id, client_secret, amount | Payment init |
| `OrderConfirmationResponse` | order details | Post-payment confirmation |
| `ShippingMethodsResponse` | available methods | Shipping options |

---

## Task 4: Service Layer

### `CheckoutService` (`app/services/checkout_service.py`)

**Dependencies**: CartService, PaymentService, OrderService

**Methods**:

#### `start_checkout(user_id, address_id, shipping_method_id, promo_code?) -> CheckoutSession`
- Validate cart using CartService
- Validate address ownership
- Calculate shipping cost
- Calculate tax based on address
- Apply promo code discount
- Create checkout session with expiry (30 min)
- Return session with summary

#### `get_session(user_id, session_id?) -> CheckoutSession`
- Get session by ID or latest for user
- Check not expired
- Re-calculate if cart changed (optional)
- Return session

#### `get_shipping_methods(address_id) -> List[ShippingMethod]`
- Determine available methods based on address
- Calculate cost and estimated delivery
- Return sorted by cost

#### `create_payment_intent(user_id, session_id) -> PaymentIntent`
- Validate session
- Final cart validation
- Create pending order
- Call PaymentService.create_intent()
- Link intent to order
- Return intent details

---

### `PaymentService` (`app/services/payment_service.py`)

**Dependencies**: Payment gateway SDK (Stripe, etc.)

**Methods**:

#### `create_intent(amount, currency, metadata) -> PaymentIntent`
- Call gateway API to create payment intent
- Include order ID in metadata
- Return intent with client secret

#### `process_webhook(payload, signature) -> WebhookResult`
- Verify signature with gateway
- Parse event type and data
- Return parsed event

#### `handle_payment_success(payment_intent_id) -> None`
- Find order by payment intent
- Update order status to "confirmed"
- Update payment status to "paid"
- Reduce inventory for each item
- Clear user's cart
- Queue confirmation email

#### `handle_payment_failure(payment_intent_id, error) -> None`
- Find order by payment intent
- Update order status to "payment_failed"
- Log error for debugging

---

## Task 5: Security

### Authentication
- All user endpoints require JWT
- Webhook uses signature verification

### Idempotency
- Payment intent ID is unique per order
- Webhook events processed once (track event IDs)
- Order creation is idempotent on intent ID

### Data Protection
- No card data stored (tokenized by gateway)
- Amounts calculated server-side only
- Cart totals verified before payment

### Webhook Security
- Verify signature with gateway secret
- Respond quickly (< 5 seconds)
- Use async processing for heavy operations

---

## Task 6: Supabase Integration

### Tables Used
- `checkout_sessions` (temporary session data)
- `orders` (created on payment intent)
- `order_items` (created on order confirmation)
- `carts` / `cart_items` (source data)

### Checkout Session Table
| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID | Session ID |
| `user_id` | UUID | Owner |
| `cart_snapshot` | JSONB | Cart at session start |
| `address_id` | UUID | Selected address |
| `shipping_method` | JSONB | Selected shipping |
| `totals` | JSONB | Calculated totals |
| `promo_code` | TEXT | Applied promo |
| `payment_intent_id` | TEXT | Gateway reference |
| `status` | ENUM | pending, completed, expired |
| `expires_at` | TIMESTAMP | Session expiry |

---

## Task 7: Error Handling

### Cart Validation Failures
- Return detailed issues
- Allow user to fix and retry
- Don't proceed to payment

### Payment Failures
- Order stays in "pending" until retry
- Cart preserved for retry
- Clear error messaging to user

### Webhook Failures
- Return 200 to acknowledge receipt
- Retry logic handled by gateway
- Log for manual investigation

### Timeout Handling
- Checkout sessions expire after 30 minutes
- Pending orders expire after 24 hours
- Background job cleans up expired records

---

## Expected Output

1. **Complete checkout flow** endpoints and responses
2. **Payment gateway integration** pattern
3. **Webhook handling** for payment events
4. **Security measures** for payment processing
5. **No Python code** - only descriptions
