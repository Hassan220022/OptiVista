---
trigger: model_decision
---

# Cart Feature Prompt

> **Usage**: Copy and paste this complete prompt to generate the cart feature.
> 
> **Prerequisites**: Run `00-master-project.md` and `frontend/01-architecture.md` first.

---

You are a senior Flutter feature engineer.

## Feature Configuration

```
Feature name: cart
Target folder: apps/frontend/lib/features/cart/
```

## Goal

Design the cart module: show items, allow quantity edits, removal, and proceed to checkout.

---

## Instructions

### 1. Screen

#### `CartScreen` (`presentation/screens/cart_screen.dart`)

**Sections**:
| Section | Description |
|---------|-------------|
| App Bar | Title "My Cart", optional clear cart action |
| Cart Items List | Scrollable list of cart item tiles |
| Summary Panel | Subtotal, estimated shipping, total |
| Primary CTA | "Proceed to Checkout" button |
| Secondary CTA | "Continue Shopping" link |

**Empty State**:
- Illustration of empty cart
- "Your cart is empty" message
- "Start Shopping" button → Catalog

---

### 2. Nested Widgets

Under `presentation/widgets/`:

#### `CartItemTile` (`cart_item_tile.dart`)

**Displays**:
| Element | Description |
|---------|-------------|
| Product Image | Thumbnail of product |
| Product Name | Full product name |
| Variant Info | Color, size selected |
| Unit Price | Price per item |
| Quantity Stepper | +/- buttons with current quantity |
| Line Total | quantity × unit price |
| Remove Button | Delete item from cart |

**Interactions**:
- Tap +/- to change quantity
- Tap remove to delete (with confirmation)
- Tap tile to go to product details

#### `CartSummaryPanel` (`cart_summary_panel.dart`)

**Displays**:
| Row | Description |
|-----|-------------|
| Subtotal | Sum of line totals |
| Estimated Shipping | "Calculated at checkout" or estimate |
| Discount | If promo applied (future) |
| Total | Final amount |

#### `QuantityStepper` (`quantity_stepper.dart`)

- Minus button (disabled at quantity 1)
- Current quantity display
- Plus button (disabled at max stock)
- Compact horizontal layout

---

### 3. State Management

#### `CartController` (`presentation/controllers/cart_controller.dart`)

**State Fields**:
| Field | Type | Purpose |
|-------|------|---------|
| `isLoading` | bool | Initial cart load |
| `isUpdating` | bool | Item update in progress |
| `items` | List<CartItem> | Current cart items |
| `subtotal` | double | Calculated subtotal |
| `totalItems` | int | Total quantity count |
| `errorMessage` | String? | Error to display |
| `itemBeingUpdated` | String? | ID of item being modified |

**Computed**:
| Field | Derivation |
|-------|------------|
| `isEmpty` | items.isEmpty |
| `canCheckout` | !isEmpty && !isUpdating |

**Actions**:
| Action | Purpose |
|--------|---------|
| `loadCart()` | Fetch cart from backend |
| `addItem(productId, variantId, quantity)` | Add new item |
| `updateQuantity(cartItemId, newQuantity)` | Change quantity |
| `removeItem(cartItemId)` | Delete item |
| `clearCart()` | Remove all items |
| `refresh()` | Reload cart data |

**Optimistic Updates**:
- Update UI immediately on quantity change
- Rollback if backend fails
- Show error toast on failure

---

### 4. Data/Domain

#### `data/models/cart_item_model.dart`

`CartItem`:
| Field | Type | Purpose |
|-------|------|---------|
| `id` | String | Cart item ID |
| `productId` | String | Product reference |
| `variantId` | String | Variant reference |
| `productName` | String | Display name |
| `variantLabel` | String | "Black / Medium" |
| `imageUrl` | String | Product thumbnail |
| `unitPrice` | double | Price per item |
| `quantity` | int | Current quantity |
| `maxQuantity` | int | Stock limit |
| `lineTotal` | double | Computed: unitPrice × quantity |

#### `data/repositories/cart_repository.dart`

**Methods**:
| Method | Input | Output | Purpose |
|--------|-------|--------|---------|
| `getCart()` | - | Cart | Get current user's cart |
| `addToCart` | productId, variantId, qty | CartItem | Add item |
| `updateCartItem` | cartItemId, quantity | CartItem | Update quantity |
| `removeCartItem` | cartItemId | void | Delete item |
| `clearCart` | - | void | Empty cart |

`Cart` entity:
| Field | Type |
|-------|------|
| `items` | List<CartItem> |
| `subtotal` | double |
| `itemCount` | int |

---

### 5. Navigation

| User Action | Destination |
|-------------|-------------|
| "Proceed to Checkout" | Checkout flow (shipping screen) |
| "Continue Shopping" | Catalog or Home |
| Tap cart item | Product Details |
| Back button | Previous screen |

---

### 6. UX Details

#### Real-Time Price Updates
- Recalculate subtotal on quantity change
- Show brief loading indicator on item being updated
- Animate price changes

#### Quantity Limits
- Minimum: 1 (show remove button instead of 0)
- Maximum: Available stock
- Disable + button at max

#### Remove Confirmation
- Show confirmation bottom sheet or dialog
- "Remove [Product Name] from cart?"
- Cancel / Remove buttons

#### Network Error Handling
- Rollback optimistic update on failure
- Show error snackbar with retry
- Keep cart functional during errors

#### Syncing
- Cart syncs with backend
- Handle concurrent modifications gracefully
- Show "Cart updated" if items changed externally

---

## Expected Output

### Directory Tree

```
features/cart/
├── presentation/
│   ├── screens/
│   │   └── cart_screen.dart
│   ├── widgets/
│   │   ├── cart_item_tile.dart
│   │   ├── cart_summary_panel.dart
│   │   ├── quantity_stepper.dart
│   │   ├── cart_empty_state.dart
│   │   └── remove_item_dialog.dart
│   └── controllers/
│       └── cart_controller.dart
├── data/
│   ├── models/
│   │   ├── cart_model.dart
│   │   └── cart_item_model.dart
│   └── repositories/
│       └── cart_repository.dart
└── domain/
    └── entities/
        ├── cart.dart
        └── cart_item.dart
```

### Per-File Responsibilities

Provide detailed descriptions for each file including:
- Main classes/widgets
- Optimistic update logic
- Backend sync handling
- Error recovery

**No Dart code** - only detailed descriptions.
