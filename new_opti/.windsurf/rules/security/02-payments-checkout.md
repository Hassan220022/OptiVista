---
trigger: model_decision
---

# Payments & Checkout Prompt

> **Usage**: Use this prompt to design the checkout flow and payment integration.
> 
> **Prerequisites**: Run `00-master-project.md` and `backend/01-architecture.md` first.

---

You are a backend engineer designing payments & checkout.

## Goal

Define how checkout and payments are handled, from cart to confirmed order.

---

## Task 1: Checkout Flow Overview

### Flow Diagram

```
Cart → Validate → Address → Shipping → Payment → Confirm → Order
```

### Step-by-Step

1. **User has cart**: Items synced to backend
2. **Initiate checkout**: Validate cart, check stock
3. **Select address**: Choose existing or add new
4. **Choose shipping**: Select shipping method, calculate cost
5. **Review totals**: Show subtotal, shipping, tax, discounts, total
6. **Select payment**: Choose payment method
7. **Create payment intent**: Backend creates intent with payment gateway
8. **Process payment**: Frontend handles payment UI (Stripe Elements, etc.)
9. **Receive confirmation**: Webhook confirms payment success
10. **Create order**: Convert cart to order, update inventory
11. **Show confirmation**: Display order number, send email

---

## Task 2: API Endpoints

### `POST /api/v1/checkout/validate`

**Purpose**: Validate cart before checkout

**Auth**: Required

**Request**:
```
{
  cart_id: UUID (optional, uses active cart if not provided)
}
```

**Response**:
```
{
  valid: boolean,
  issues: [
    {
      item_id: UUID,
      issue: "out_of_stock" | "price_changed" | "no_longer_available",
      details: string
    }
  ],
  cart_summary: {
    item_count: number,
    subtotal: decimal
  }
}
```

**Logic**:
- Check each item still exists and is active
- Verify stock availability
- Compare current price to cart price
- Return issues if any found

---

### `POST /api/v1/checkout/calculate`

**Purpose**: Calculate totals with shipping and tax

**Auth**: Required

**Request**:
```
{
  address_id: UUID,
  shipping_method: string
}
```

**Response**:
```
{
  subtotal: decimal,
  shipping_cost: decimal,
  tax_amount: decimal,
  discount_amount: decimal,
  total: decimal,
  currency: string,
  breakdown: {
    items: [...],
    shipping: { method, cost, estimated_days },
    tax: { rate, amount },
    discounts: [{ code, amount }]
  }
}
```

---

### `POST /api/v1/checkout/create-payment-intent`

**Purpose**: Create payment intent with gateway (e.g., Stripe)

**Auth**: Required

**Request**:
```
{
  address_id: UUID,
  shipping_method: string,
  promo_code: string (optional)
}
```

**Response**:
```
{
  client_secret: string,  // For frontend payment SDK
  payment_intent_id: string,
  amount: decimal,
  currency: string
}
```

**Process**:
1. Validate cart again
2. Calculate final totals
3. Create pending order record
4. Create payment intent with gateway
5. Return client secret for frontend

---

### `POST /api/v1/checkout/webhook`

**Purpose**: Receive payment confirmation from gateway

**Auth**: Webhook signature verification (not user auth)

**Request**: Gateway-specific webhook payload

**Process**:
1. Verify webhook signature
2. Parse event type
3. If payment successful:
   - Update order status to "confirmed"
   - Update payment status to "paid"
   - Reduce inventory
   - Clear user's cart
   - Queue confirmation email
4. If payment failed:
   - Update order status to "payment_failed"
   - Keep cart intact

---

### `GET /api/v1/checkout/order/{order_id}/confirmation`

**Purpose**: Get order confirmation details

**Auth**: Required (must own order)

**Response**:
```
{
  order_number: string,
  status: string,
  items: [...],
  totals: {...},
  shipping_address: {...},
  estimated_delivery: date,
  created_at: timestamp
}
```

---

## Task 3: Data Models

### Pending Order (during checkout)

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Customer |
| `cart_snapshot` | JSONB | Cart contents at checkout |
| `totals` | JSONB | Calculated totals |
| `payment_intent_id` | TEXT | Gateway reference |
| `status` | ENUM | pending, completed, failed, expired |
| `expires_at` | TIMESTAMP | Payment timeout |
| `created_at` | TIMESTAMP | Checkout started |

### Order (after payment)

See `backend/02-database-schema.md` for full order schema.

---

## Task 4: Idempotency & Error Handling

### Prevent Duplicate Orders

1. **Payment intent ID is unique**: One order per intent
2. **Check before creating**: If intent exists, return existing order
3. **Webhook idempotency**: Process each event only once (track event IDs)

### Handle Failed Payments

| Scenario | Action |
|----------|--------|
| Card declined | Show error, let user retry with different card |
| Insufficient funds | Show error, suggest lower amount or different card |
| Gateway timeout | Retry with same intent, or show error |
| Webhook missed | Reconciliation job checks pending orders |

### Handle Cart Changes During Checkout

- Lock cart during active checkout session
- If item becomes unavailable, fail checkout with clear message
- Return user to cart to adjust

---

## Task 5: Security Considerations

### Never Trust Frontend

- Always recalculate totals on backend
- Validate all prices against database
- Don't accept user-provided amounts

### No Card Data on Backend

- Use tokenized payment methods
- Frontend collects card → sends to gateway → receives token
- Backend only sees token/intent ID

### Validate Cart Ownership

- Ensure cart belongs to authenticated user
- Ensure address belongs to authenticated user

### Rate Limiting

| Endpoint | Limit |
|----------|-------|
| Create payment intent | 5 per minute per user |
| Validate cart | 20 per minute per user |
| Webhook | Unlimited (verified by signature) |

### Webhook Security

- Verify signature with gateway's signing secret
- Only accept from gateway's IP range (if available)
- Respond quickly (< 5 seconds) or use async processing

---

## Task 6: Payment Gateway Abstraction

### Service Interface: `PaymentGateway`

**Methods**:
- `create_payment_intent(amount, currency, metadata) → IntentResult`
- `confirm_payment(intent_id) → ConfirmResult`
- `cancel_payment(intent_id) → CancelResult`
- `process_webhook(payload, signature) → WebhookEvent`

### Implementations

- `StripeGateway`: Stripe API integration
- `MockGateway`: For testing/development

### Configuration

- Gateway selection via environment variable
- API keys in environment variables
- Webhook signing secret in environment variables

---

## Expected Output

1. **Complete checkout flow** - step by step
2. **API endpoint specifications** - request/response
3. **Idempotency strategy** - preventing duplicates
4. **Security measures** - what to validate, what to protect
5. **Gateway abstraction** - interface design
6. **No code** - only detailed descriptions
