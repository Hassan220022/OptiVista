---
trigger: model_decision
---

# Orders Feature Prompt

> **Usage**: Copy and paste this complete prompt to generate the orders (order history) feature.
> 
> **Prerequisites**: Run `00-master-project.md` and `frontend/01-architecture.md` first.

---

You are a senior Flutter feature engineer.

## Feature Configuration

```
Feature name: orders
Target folder: apps/frontend/lib/features/orders/
```

## Goal

Design order history and order details: list of past orders and details for each order.

---

## Instructions

### 1. Screens

| Screen | Path | Purpose |
|--------|------|---------|
| `OrderHistoryScreen` | `presentation/screens/order_history_screen.dart` | List of all orders |
| `OrderDetailsScreen` | `presentation/screens/order_details_screen.dart` | Single order details |

---

### 2. Screen Details

#### `OrderHistoryScreen`

**Layout**:
| Section | Description |
|---------|-------------|
| App Bar | Title "My Orders", optional filter |
| Filter Tabs | All, Processing, Shipped, Delivered (optional) |
| Order List | Scrollable list of order cards |
| Empty State | "No orders yet" with "Start Shopping" button |
| Pull to Refresh | Refresh order list |

**Order Card** (`OrderCard`):
| Element | Description |
|---------|-------------|
| Order Number | "#ORD-12345" |
| Date | "Nov 27, 2025" |
| Status Badge | Colored badge (Pending, Shipped, Delivered, etc.) |
| Item Count | "3 items" |
| Total | "$299.00" |
| First Item Image | Thumbnail preview |
| View Details | Chevron or button |

#### `OrderDetailsScreen`

**Sections**:
| Section | Description |
|---------|-------------|
| Order Header | Order number, date, status |
| Status Timeline | Visual progress of order status |
| Order Items | List of items with quantities and prices |
| Shipping Info | Address, method, tracking (if available) |
| Payment Info | Payment method, last 4 digits |
| Price Summary | Subtotal, shipping, tax, discounts, total |
| Actions | Reorder button, Contact support |

**Status Timeline**:
```
Order Placed ─── Processing ─── Shipped ─── Delivered
     ✓              ✓             ○            ○
```

---

### 3. State Management

#### `OrdersController` (`presentation/controllers/orders_controller.dart`)

**State Fields**:
| Field | Type | Purpose |
|-------|------|---------|
| `isLoading` | bool | Initial load |
| `isRefreshing` | bool | Pull-to-refresh |
| `orders` | List<OrderSummary> | Order list |
| `selectedFilter` | OrderStatus? | Active status filter |
| `errorMessage` | String? | Error to display |

**Actions**:
| Action | Purpose |
|--------|---------|
| `loadOrders()` | Fetch all orders |
| `refresh()` | Pull-to-refresh |
| `filterByStatus(status)` | Apply status filter |
| `clearFilter()` | Show all orders |

#### `OrderDetailsController` (`presentation/controllers/order_details_controller.dart`)

**State Fields**:
| Field | Type | Purpose |
|-------|------|---------|
| `isLoading` | bool | Loading order |
| `order` | OrderDetails? | Full order data |
| `errorMessage` | String? | Error to display |

**Actions**:
| Action | Purpose |
|--------|---------|
| `loadOrderDetails(orderId)` | Fetch order details |
| `reorder()` | Add all items to cart |
| `trackShipment()` | Open tracking URL |

---

### 4. Data/Domain

#### `data/models/order_summary_model.dart`

`OrderSummary`:
| Field | Type | Purpose |
|-------|------|---------|
| `id` | String | Order ID |
| `orderNumber` | String | Display number |
| `status` | OrderStatus | Current status |
| `createdAt` | DateTime | Order date |
| `itemCount` | int | Number of items |
| `total` | double | Order total |
| `previewImageUrl` | String? | First item image |

`OrderStatus` enum:
- `pending`
- `confirmed`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

#### `data/models/order_details_model.dart`

`OrderDetails`:
| Field | Type | Purpose |
|-------|------|---------|
| `id` | String | Order ID |
| `orderNumber` | String | Display number |
| `status` | OrderStatus | Current status |
| `statusHistory` | List<StatusEvent> | Timeline data |
| `items` | List<OrderItem> | Order items |
| `shippingAddress` | Address | Delivery address |
| `shippingMethod` | String | Shipping type |
| `trackingNumber` | String? | Carrier tracking |
| `trackingUrl` | String? | Tracking link |
| `paymentMethod` | String | Payment type |
| `paymentLastFour` | String? | Card digits |
| `subtotal` | double | Items total |
| `shippingCost` | double | Shipping fee |
| `taxAmount` | double | Tax |
| `discountAmount` | double | Discounts |
| `total` | double | Final total |
| `createdAt` | DateTime | Order date |
| `estimatedDelivery` | DateTime? | Expected delivery |

`OrderItem`:
| Field | Type |
|-------|------|
| `productId` | String |
| `productName` | String |
| `variantName` | String |
| `imageUrl` | String |
| `quantity` | int |
| `unitPrice` | double |
| `lineTotal` | double |

`StatusEvent`:
| Field | Type |
|-------|------|
| `status` | OrderStatus |
| `timestamp` | DateTime |
| `description` | String |

#### `data/repositories/orders_repository.dart`

**Methods**:
| Method | Input | Output | Purpose |
|--------|-------|--------|---------|
| `getOrders` | status? | List<OrderSummary> | Get user's orders |
| `getOrderById` | orderId | OrderDetails | Get order details |

---

### 5. Navigation

| User Action | Destination |
|-------------|-------------|
| Tap order card | Order Details screen |
| "Track Shipment" | External tracking URL |
| "Reorder" | Add to cart, go to cart |
| "Contact Support" | Feedback/Support screen |
| "Start Shopping" (empty) | Catalog |
| Back | Profile or previous screen |

---

### 6. UX Details

#### Order List
- Sorted by date (newest first)
- Pull-to-refresh
- Show loading skeletons
- Paginate if many orders

#### Status Colors
| Status | Color |
|--------|-------|
| Pending | Orange |
| Confirmed | Blue |
| Processing | Blue |
| Shipped | Purple |
| Delivered | Green |
| Cancelled | Red |

#### Empty States
- No orders: "You haven't placed any orders yet"
- No orders with filter: "No [status] orders"

#### Reorder Flow
1. Tap "Reorder"
2. Check stock availability
3. Add available items to cart
4. Navigate to cart
5. Show warning if some items unavailable

#### Tracking
- If tracking available, show button
- Opens in in-app browser or external
- Show tracking number for copy

---

## Expected Output

### Directory Tree

```
features/orders/
├── presentation/
│   ├── screens/
│   │   ├── order_history_screen.dart
│   │   └── order_details_screen.dart
│   ├── widgets/
│   │   ├── order_card.dart
│   │   ├── order_status_badge.dart
│   │   ├── order_status_timeline.dart
│   │   ├── order_item_tile.dart
│   │   ├── order_price_summary.dart
│   │   ├── shipping_info_card.dart
│   │   └── orders_empty_state.dart
│   └── controllers/
│       ├── orders_controller.dart
│       └── order_details_controller.dart
├── data/
│   ├── models/
│   │   ├── order_summary_model.dart
│   │   ├── order_details_model.dart
│   │   ├── order_item_model.dart
│   │   └── status_event_model.dart
│   └── repositories/
│       └── orders_repository.dart
└── domain/
    └── entities/
        ├── order.dart
        └── order_status.dart
```

### Per-File Responsibilities

Provide detailed descriptions including:
- Order list pagination
- Status timeline visualization
- Reorder functionality
- Tracking integration

**No Dart code** - only detailed descriptions.
