---
trigger: model_decision
---

# Checkout Feature Prompt

> **Usage**: Copy and paste this complete prompt to generate the checkout feature.
> 
> **Prerequisites**: Run `00-master-project.md` and `frontend/01-architecture.md` first.

---

You are a senior Flutter feature engineer.

## Feature Configuration

```
Feature name: checkout
Target folder: apps/frontend/lib/features/checkout/
```

## Goal

Design the full checkout experience with 3 steps: Shipping, Payment, Order Review/Confirmation. Integrate with backend checkout APIs and payment session.

---

## Instructions

### 1. Screens

| Screen | Path | Purpose |
|--------|------|---------|
| `ShippingScreen` | `presentation/screens/shipping_screen.dart` | Address and shipping method |
| `PaymentScreen` | `presentation/screens/payment_screen.dart` | Payment method selection |
| `OrderReviewScreen` | `presentation/screens/order_review_screen.dart` | Final review before placing |
| `OrderConfirmationScreen` | `presentation/screens/order_confirmation_screen.dart` | Success state after order |

---

### 2. Screen Details

#### `ShippingScreen`

**Sections**:
| Section | Description |
|---------|-------------|
| Progress Indicator | Step 1 of 3 |
| Saved Addresses | List of user's addresses with selection |
| Add New Address | Button/form to add new address |
| Shipping Methods | Standard, Express options with prices |
| Continue Button | Proceed to payment |

**Address Card**:
- Recipient name
- Full address formatted
- Phone number
- Default badge
- Edit/Delete actions
- Selection radio

#### `PaymentScreen`

**Sections**:
| Section | Description |
|---------|-------------|
| Progress Indicator | Step 2 of 3 |
| Payment Options | Card, Apple Pay, Google Pay (future) |
| Card Input | Secure card form (via payment SDK) |
| Billing Address | Same as shipping or different |
| Continue Button | Proceed to review |

**Note**: Actual card input handled by payment gateway SDK (Stripe Elements, etc.)

#### `OrderReviewScreen`

**Sections**:
| Section | Description |
|---------|-------------|
| Progress Indicator | Step 3 of 3 |
| Order Items | List of items with quantities and prices |
| Shipping Address | Selected address summary |
| Shipping Method | Selected method with cost |
| Payment Method | Card ending in XXXX |
| Price Breakdown | Subtotal, shipping, tax, discounts, total |
| Place Order Button | Final submission |
| Terms Checkbox | Accept terms and conditions |

#### `OrderConfirmationScreen`

**Sections**:
| Section | Description |
|---------|-------------|
| Success Icon | Checkmark animation |
| Order Number | "Order #12345" prominently displayed |
| Confirmation Message | "Thank you for your order!" |
| Email Notice | "Confirmation sent to email@example.com" |
| Order Summary | Collapsed view of order |
| Action Buttons | "View Order Details", "Continue Shopping" |

---

### 3. State Management

#### `CheckoutController` (`presentation/controllers/checkout_controller.dart`)

**State Fields**:
| Field | Type | Purpose |
|-------|------|---------|
| `currentStep` | CheckoutStep enum | shipping, payment, review |
| `isLoading` | bool | Data loading |
| `isSubmitting` | bool | Order submission in progress |
| `addresses` | List<Address> | User's saved addresses |
| `selectedAddress` | Address? | Chosen shipping address |
| `shippingMethods` | List<ShippingMethod> | Available options |
| `selectedShippingMethod` | ShippingMethod? | Chosen method |
| `paymentMethod` | PaymentMethod? | Selected payment |
| `orderSummary` | OrderSummary? | Calculated totals |
| `orderId` | String? | Created order ID (after success) |
| `errorMessage` | String? | Error to display |

**Computed**:
| Field | Derivation |
|-------|------------|
| `canProceedToPayment` | selectedAddress != null && selectedShippingMethod != null |
| `canProceedToReview` | paymentMethod != null |
| `canPlaceOrder` | termsAccepted && !isSubmitting |

**Actions**:
| Action | Purpose |
|--------|---------|
| `loadInitialData()` | Fetch cart, addresses, shipping methods |
| `selectAddress(addressId)` | Set selected address |
| `addNewAddress(addressData)` | Create and select new address |
| `selectShippingMethod(method)` | Set shipping method |
| `selectPaymentMethod(method)` | Set payment method |
| `createPaymentSession()` | Initialize payment with gateway |
| `confirmOrder()` | Submit order after payment |
| `goToStep(step)` | Navigate between steps |
| `goBack()` | Previous step or exit |

---

### 4. Data/Domain

#### Models

`Address`:
| Field | Type |
|-------|------|
| `id` | String |
| `fullName` | String |
| `phone` | String |
| `streetAddress` | String |
| `city` | String |
| `state` | String |
| `postalCode` | String |
| `country` | String |
| `isDefault` | bool |

`ShippingMethod`:
| Field | Type |
|-------|------|
| `id` | String |
| `name` | String |
| `description` | String |
| `price` | double |
| `estimatedDays` | int |

`PaymentMethod`:
| Field | Type |
|-------|------|
| `type` | PaymentType enum |
| `lastFour` | String? |
| `brand` | String? |

`OrderSummary`:
| Field | Type |
|-------|------|
| `items` | List<CartItem> |
| `subtotal` | double |
| `shippingCost` | double |
| `taxAmount` | double |
| `discountAmount` | double |
| `total` | double |

#### `data/repositories/checkout_repository.dart`

**Methods**:
| Method | Input | Output | Purpose |
|--------|-------|--------|---------|
| `getCheckoutSummary` | - | OrderSummary | Calculate totals |
| `getAddresses` | - | List<Address> | User's addresses |
| `addAddress` | AddressData | Address | Create new address |
| `getShippingMethods` | addressId | List<ShippingMethod> | Available methods |
| `startCheckout` | addressId, shippingMethodId | PaymentSession | Create payment intent |
| `confirmOrder` | paymentResult | Order | Finalize order |

---

### 5. Navigation

**Step Flow**:
```
Cart → Shipping → Payment → Review → Confirmation
         ↑          ↑         ↑
         └──────────┴─────────┘ (back navigation)
```

| User Action | Destination |
|-------------|-------------|
| "Continue" on Shipping | Payment screen |
| "Continue" on Payment | Review screen |
| "Place Order" on Review | Confirmation screen |
| Back button | Previous step |
| Exit checkout | Confirmation dialog → Cart |
| "View Order Details" | Order Details screen |
| "Continue Shopping" | Home |

---

### 6. UX Details

#### Progress Indicator
- Shows steps: Shipping → Payment → Review
- Current step highlighted
- Completed steps show checkmark
- Tappable to go back (but not forward)

#### Form Validation
- Validate address fields before proceeding
- Inline validation with error messages
- Disable continue button until valid

#### Payment Flow
- Payment SDK handles secure card input
- Show loading during payment processing
- Handle 3D Secure challenges if needed
- Clear error messages on failure

#### Error Handling
| Error | Display |
|-------|---------|
| Address validation | Inline field errors |
| Shipping unavailable | "Shipping not available to this address" |
| Payment declined | Error dialog with retry option |
| Order creation failed | Error with retry, don't lose data |

#### Cart Changes
- If cart changes during checkout, show warning
- "Your cart has been updated" with review option
- Recalculate totals automatically

---

## Expected Output

### Directory Tree

```
features/checkout/
├── presentation/
│   ├── screens/
│   │   ├── shipping_screen.dart
│   │   ├── payment_screen.dart
│   │   ├── order_review_screen.dart
│   │   └── order_confirmation_screen.dart
│   ├── widgets/
│   │   ├── checkout_progress_indicator.dart
│   │   ├── address_card.dart
│   │   ├── address_form.dart
│   │   ├── shipping_method_tile.dart
│   │   ├── payment_method_selector.dart
│   │   ├── order_summary_card.dart
│   │   ├── order_item_row.dart
│   │   └── price_breakdown.dart
│   └── controllers/
│       ├── checkout_controller.dart
│       └── address_form_controller.dart
├── data/
│   ├── models/
│   │   ├── address_model.dart
│   │   ├── shipping_method_model.dart
│   │   ├── payment_method_model.dart
│   │   └── order_summary_model.dart
│   └── repositories/
│       └── checkout_repository.dart
└── domain/
    └── entities/
        ├── address.dart
        ├── shipping_method.dart
        └── checkout_session.dart
```

### Per-File Responsibilities

Provide detailed descriptions including:
- Multi-step flow coordination
- Payment gateway integration points
- Error recovery strategies
- State persistence across steps

**No Dart code** - only detailed descriptions.
