# Reviews & Ratings Domain Prompt

> **Usage**: Copy and paste this complete prompt to generate the reviews backend domain.
> 
> **Prerequisites**: Run `00-master-project.md` and `backend/01-architecture.md` first.

---

You are a FastAPI domain engineer.

## Domain Configuration

```
Domain: reviews & ratings
Base route: /api/v1/reviews
Router file: apps/backend/app/api/v1/reviews.py
Service file: apps/backend/app/services/review_service.py
Schema file: apps/backend/app/schemas/reviews.py
```

## Goal

Design endpoints for users to review products, and for fetching reviews and ratings.

---

## Task 1: Use Cases

### Public Use Cases
| # | Use Case | Actor | Description |
|---|----------|-------|-------------|
| 1 | Get Product Reviews | Anyone | Fetch reviews for a product |
| 2 | Get Rating Summary | Anyone | Get aggregate rating stats |

### User Use Cases
| # | Use Case | Actor | Description |
|---|----------|-------|-------------|
| 1 | Create Review | Shopper | Submit review for purchased product |
| 2 | Update Review | Shopper | Edit own review |
| 3 | Delete Review | Shopper | Remove own review |
| 4 | Get My Reviews | Shopper | List own reviews |

### Admin Use Cases
| # | Use Case | Actor | Description |
|---|----------|-------|-------------|
| 1 | Moderate Review | Admin | Approve/reject reviews |
| 2 | Delete Review | Admin | Remove any review |

---

## Task 2: Endpoints

### Public Endpoints

#### `GET /api/v1/reviews/product/{product_id}`

**Purpose**: Get reviews for a product

**Authentication**: Optional

**Path Parameters**: `product_id` (string)

**Query Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `page` | int | No | Page number (default: 1) |
| `page_size` | int | No | Items per page (default: 10) |
| `sort_by` | string | No | Sort field (created_at, rating, helpful) |
| `sort_order` | string | No | asc or desc |
| `rating` | int | No | Filter by star rating (1-5) |

**Response** (200):
```
{
  summary: {
    average_rating: decimal
    total_reviews: int
    rating_distribution: {
      1: int
      2: int
      3: int
      4: int
      5: int
    }
    verified_purchase_count: int
  }
  items: [
    {
      id: string
      user_name: string — Display name or "Anonymous"
      rating: int — 1-5
      title: string | null
      body: string
      is_verified_purchase: boolean
      helpful_count: int
      created_at: datetime
      updated_at: datetime
    }
  ]
  total: int
  page: int
  page_size: int
  has_more: boolean
}
```

---

#### `GET /api/v1/reviews/product/{product_id}/summary`

**Purpose**: Get only rating summary (for product cards)

**Response** (200):
```
{
  product_id: string
  average_rating: decimal
  total_reviews: int
  rating_distribution: { 1: int, 2: int, 3: int, 4: int, 5: int }
}
```

---

### User Endpoints

#### `POST /api/v1/reviews`

**Purpose**: Create a review

**Authentication**: Required

**Request Body**:
```
{
  product_id: string
  rating: int — 1-5, required
  title: string | null — Optional headline
  body: string — Required, min 10 chars
}
```

**Response** (201):
```
{
  id: string
  product_id: string
  rating: int
  title: string | null
  body: string
  is_verified_purchase: boolean
  status: string — "pending" or "approved"
  created_at: datetime
}
```

**Behavior**:
- Check if user has purchased product → set `is_verified_purchase`
- Check if user already reviewed this product → reject duplicate
- Set initial status based on config (auto-approve or pending moderation)

**Errors**:
| Status | Code | When |
|--------|------|------|
| 400 | `ALREADY_REVIEWED` | User already reviewed this product |
| 404 | `PRODUCT_NOT_FOUND` | Product doesn't exist |
| 400 | `INVALID_RATING` | Rating not 1-5 |
| 400 | `BODY_TOO_SHORT` | Review body < 10 chars |

---

#### `PUT /api/v1/reviews/{review_id}`

**Purpose**: Update own review

**Authentication**: Required

**Path Parameters**: `review_id` (string)

**Request Body**:
```
{
  rating: int
  title: string | null
  body: string
}
```

**Response** (200): Updated review

**Errors**:
| Status | Code | When |
|--------|------|------|
| 404 | `REVIEW_NOT_FOUND` | Review doesn't exist or not owned |

---

#### `DELETE /api/v1/reviews/{review_id}`

**Purpose**: Delete own review

**Authentication**: Required

**Response** (204): No content

---

#### `GET /api/v1/reviews/me`

**Purpose**: List user's own reviews

**Authentication**: Required

**Response** (200):
```
{
  items: [
    {
      id: string
      product_id: string
      product_name: string
      product_image_url: string
      rating: int
      title: string | null
      body: string
      status: string
      created_at: datetime
    }
  ]
}
```

---

#### `POST /api/v1/reviews/{review_id}/helpful`

**Purpose**: Mark review as helpful

**Authentication**: Required

**Response** (200):
```
{
  review_id: string
  helpful_count: int
}
```

**Behavior**:
- One vote per user per review
- Toggle: if already voted, remove vote

---

### Admin Endpoints

#### `GET /api/v1/reviews/admin/pending`

**Purpose**: List reviews pending moderation

**Authentication**: Required (Admin role)

**Response** (200): List of pending reviews with user and product info

---

#### `PATCH /api/v1/reviews/admin/{review_id}`

**Purpose**: Moderate review

**Authentication**: Required (Admin role)

**Request Body**:
```
{
  status: string — "approved" or "rejected"
  rejection_reason: string | null
}
```

**Response** (200): Updated review

---

#### `DELETE /api/v1/reviews/admin/{review_id}`

**Purpose**: Delete any review

**Authentication**: Required (Admin role)

**Response** (204): No content

---

## Task 3: Schemas

### Request Schemas

| Schema | Fields | Purpose |
|--------|--------|---------|
| `CreateReviewRequest` | product_id, rating, title?, body | Create review |
| `UpdateReviewRequest` | rating, title?, body | Update review |
| `ModerateReviewRequest` | status, rejection_reason? | Admin moderation |

### Response Schemas

| Schema | Fields | Purpose |
|--------|--------|---------|
| `ReviewResponse` | Full review data | Single review |
| `ReviewListResponse` | summary + items + pagination | Product reviews |
| `RatingSummary` | average, total, distribution | Rating stats |
| `MyReviewResponse` | Review with product info | User's review |

---

## Task 4: Service Layer

### `ReviewService` (`app/services/review_service.py`)

**Dependencies**: Supabase client, OrderService

**Methods**:

#### `get_product_reviews(product_id, filters, pagination) -> ReviewListResult`
- Fetch approved reviews for product
- Calculate rating summary
- Apply filters and pagination
- Return reviews with summary

#### `get_rating_summary(product_id) -> RatingSummary`
- Aggregate ratings for product
- Calculate average and distribution
- Cache if needed for performance

#### `create_review(user_id, data) -> Review`
- Check for existing review by user for product
- Check purchase history for verified badge
- Create review with appropriate status
- Update product rating cache (if caching)

#### `update_review(user_id, review_id, data) -> Review`
- Verify ownership
- Update fields
- Reset to pending moderation (if moderation enabled)
- Update product rating cache

#### `delete_review(user_id, review_id) -> None`
- Verify ownership
- Delete review
- Update product rating cache

#### `get_user_reviews(user_id) -> List[Review]`
- Fetch all reviews by user
- Include product info
- Return list

#### `mark_helpful(user_id, review_id) -> Review`
- Toggle helpful vote for user/review
- Update helpful count
- Return updated review

#### `check_purchase(user_id, product_id) -> bool`
- Query orders for user with product
- Return true if found delivered order

---

### Admin Methods

#### `get_pending_reviews() -> List[Review]`
- Fetch reviews with status "pending"
- Include user and product info

#### `moderate_review(review_id, status, reason?) -> Review`
- Update review status
- Record rejection reason if rejected
- Update product rating cache if approved

---

## Task 5: Security

### Public Endpoints
- No auth required for reading approved reviews
- Rate limiting on read endpoints

### User Endpoints
- JWT required
- Users can only modify own reviews
- One review per user per product

### Admin Endpoints
- Admin role required
- Can moderate and delete any review

### Content Moderation
- Option for auto-approve or manual moderation
- Filter for inappropriate content (basic)
- Admin queue for pending reviews

---

## Task 6: Supabase Integration

### Tables Used
- `reviews`
- `review_helpful_votes` (junction table for helpful)
- `orders` / `order_items` (for purchase verification)
- `products` (for product info)
- `profiles` (for user display name)

### Reviews Table
| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID | Primary key |
| `user_id` | UUID (FK) | Reviewer |
| `product_id` | UUID (FK) | Reviewed product |
| `order_id` | UUID (FK, nullable) | Purchase link |
| `rating` | INT | 1-5 stars |
| `title` | TEXT | Optional headline |
| `body` | TEXT | Review content |
| `is_verified_purchase` | BOOL | Has order |
| `status` | ENUM | pending, approved, rejected |
| `helpful_count` | INT | Cached count |
| `created_at` | TIMESTAMP | Submission time |
| `updated_at` | TIMESTAMP | Edit time |

### RLS Policies
```
-- Public can read approved reviews
SELECT: is_approved = true

-- Users can read/update/delete own reviews
ALL: auth.uid() = user_id

-- Admin can do everything
ALL: role = 'admin'
```

### Rating Cache
Option to cache aggregate ratings in products table:
- `average_rating` (decimal)
- `review_count` (int)
- Updated via trigger or service on review changes

---

## Task 7: Rating Calculation

### Average Rating
```
average = SUM(ratings) / COUNT(ratings)
// Round to 1 decimal place for display
```

### Rating Distribution
```
{
  5: COUNT where rating = 5,
  4: COUNT where rating = 4,
  3: COUNT where rating = 3,
  2: COUNT where rating = 2,
  1: COUNT where rating = 1
}
```

### Verified Purchase Weight (Optional)
- Optionally weight verified purchases higher in average
- Or display "verified" average separately

---

## Expected Output

1. **Complete review endpoints** for public, user, and admin
2. **Rating aggregation** approach
3. **Verified purchase** detection
4. **Moderation workflow** for admin
5. **No Python code** - only descriptions
