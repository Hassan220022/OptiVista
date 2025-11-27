# Products & Catalog Domain Prompt

> **Usage**: Copy and paste this complete prompt to generate the products backend domain.
> 
> **Prerequisites**: Run `00-master-project.md` and `backend/01-architecture.md` first.

---

You are a FastAPI domain engineer.

## Domain Configuration

```
Domain: products & catalog
Base route: /api/v1/products
Router file: apps/backend/app/api/v1/products.py
Service file: apps/backend/app/services/product_service.py
Schema file: apps/backend/app/schemas/products.py
```

## Goal

Design all endpoints, schemas, and services for product listing, search, and details.

---

## Task 1: Use Cases

### Public Use Cases
| # | Use Case | Actor | Description |
|---|----------|-------|-------------|
| 1 | List Products | Anyone | Browse products with filters and pagination |
| 2 | Search Products | Anyone | Full-text search with filters |
| 3 | Get Product Details | Anyone | View single product with variants and AR info |
| 4 | Get Filter Options | Anyone | Available filter values (brands, shapes, etc.) |
| 5 | Get Featured Products | Anyone | Curated featured list |
| 6 | Get Similar Products | Anyone | Related products for a given product |

### Admin Use Cases
| # | Use Case | Actor | Description |
|---|----------|-------|-------------|
| 1 | Create Product | Admin | Add new product |
| 2 | Update Product | Admin | Modify product details |
| 3 | Delete Product | Admin | Remove product (soft delete) |
| 4 | Create Variant | Admin | Add product variant |
| 5 | Update Variant | Admin | Modify variant |
| 6 | Delete Variant | Admin | Remove variant |

---

## Task 2: Endpoints

### Public Endpoints

#### `GET /api/v1/products`

**Purpose**: List products with optional filters and pagination

**Authentication**: Optional

**Query Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `page` | int | No | Page number (default: 1) |
| `page_size` | int | No | Items per page (default: 20, max: 100) |
| `category` | string | No | Category slug filter |
| `brand` | string | No | Brand name filter |
| `min_price` | decimal | No | Minimum price |
| `max_price` | decimal | No | Maximum price |
| `shape` | string | No | Frame shape (round, square, etc.) |
| `gender` | string | No | Gender (men, women, unisex) |
| `ar_only` | boolean | No | Only AR-enabled products |
| `sort_by` | string | No | Sort field (price, name, created_at, rating) |
| `sort_order` | string | No | asc or desc |

**Response** (200):
```
{
  items: [
    {
      id: string
      name: string
      brand: string
      slug: string
      price: decimal
      original_price: decimal | null
      primary_image_url: string
      has_ar_asset: boolean
      rating: decimal | null
      review_count: int
      is_new: boolean
      is_bestseller: boolean
    }
  ]
  total: int
  page: int
  page_size: int
  has_more: boolean
}
```

#### `GET /api/v1/products/search`

**Purpose**: Full-text search with filters

**Query Parameters**: Same as list + `q` (search query, required)

**Response**: Same as list endpoint

**Search Behavior**:
- Search in name, brand, description
- Support partial matching
- Rank by relevance

#### `GET /api/v1/products/{product_id}`

**Purpose**: Get full product details

**Path Parameters**: `product_id` (string)

**Response** (200):
```
{
  id: string
  name: string
  brand: string
  slug: string
  description: string
  short_description: string
  base_price: decimal
  currency: string
  primary_image_url: string
  images: [string]
  has_ar_asset: boolean
  rating: decimal | null
  review_count: int
  is_new: boolean
  is_active: boolean
  categories: [{ id, name, slug }]
  variants: [
    {
      id: string
      color_name: string
      color_hex: string
      size: string
      price_adjustment: decimal
      final_price: decimal
      stock_quantity: int
      is_available: boolean
      has_ar_asset: boolean
      images: [string] | null
    }
  ]
  specs: {
    material: string
    lens_width: string
    bridge_width: string
    temple_length: string
    lens_type: string
    weight: string
  }
  review_summary: {
    average_rating: decimal
    total_reviews: int
    rating_distribution: { 1: int, 2: int, 3: int, 4: int, 5: int }
  }
  created_at: datetime
  updated_at: datetime
}
```

**Errors**:
| Status | Code | When |
|--------|------|------|
| 404 | `PRODUCT_NOT_FOUND` | Product doesn't exist or inactive |

#### `GET /api/v1/products/filters`

**Purpose**: Get available filter options

**Response** (200):
```
{
  brands: [string]
  shapes: [string]
  colors: [string]
  genders: [string]
  categories: [{ id, name, slug }]
  price_range: { min: decimal, max: decimal }
}
```

#### `GET /api/v1/products/featured`

**Purpose**: Get featured products list

**Query Parameters**: `limit` (int, default: 10)

**Response**: List of `ProductSummary`

#### `GET /api/v1/products/{product_id}/similar`

**Purpose**: Get similar products

**Query Parameters**: `limit` (int, default: 6)

**Response**: List of `ProductSummary`

---

### Admin Endpoints

#### `POST /api/v1/products` (Admin)

**Purpose**: Create new product

**Authentication**: Required (Admin role)

**Request Body**:
```
{
  name: string
  brand: string
  description: string
  short_description: string
  base_price: decimal
  currency: string
  category_ids: [string]
  is_active: boolean
  specs: object
}
```

**Response** (201): Created product

#### `PUT /api/v1/products/{product_id}` (Admin)

**Purpose**: Update product

**Request Body**: Same as create

**Response** (200): Updated product

#### `DELETE /api/v1/products/{product_id}` (Admin)

**Purpose**: Soft delete product (set is_active = false)

**Response** (204): No content

#### `POST /api/v1/products/{product_id}/variants` (Admin)

**Purpose**: Add variant to product

**Request Body**:
```
{
  color_name: string
  color_hex: string
  size: string
  price_adjustment: decimal
  stock_quantity: int
  is_active: boolean
}
```

**Response** (201): Created variant

---

## Task 3: Schemas

### Request Schemas

| Schema | Fields | Purpose |
|--------|--------|---------|
| `ProductFilterParams` | All filter query params | List/search filters |
| `ProductCreateRequest` | Product creation fields | Create product |
| `ProductUpdateRequest` | Product update fields | Update product |
| `VariantCreateRequest` | Variant fields | Create variant |
| `VariantUpdateRequest` | Variant fields | Update variant |

### Response Schemas

| Schema | Fields | Purpose |
|--------|--------|---------|
| `ProductSummary` | Basic product info | List items |
| `ProductDetail` | Full product + variants + specs | Detail view |
| `ProductVariant` | Variant info | Variant data |
| `ProductListResponse` | items, pagination | Paginated list |
| `FilterOptionsResponse` | Available filter values | Filter dropdown data |

---

## Task 4: Service Layer

### `ProductService` (`app/services/product_service.py`)

**Dependencies**: Supabase client

**Methods**:

#### `list_products(filters, pagination) -> ProductListResult`
- Build query with filters
- Apply pagination
- Include variant availability info
- Return paginated result

#### `search_products(query, filters, pagination) -> ProductListResult`
- Full-text search on name, brand, description
- Apply additional filters
- Rank by relevance
- Return paginated result

#### `get_product(product_id) -> ProductDetail`
- Fetch product with all relations
- Include variants, images, categories, specs
- Include review summary
- Raise `ProductNotFoundError` if not found

#### `get_filter_options() -> FilterOptions`
- Query distinct values for each filter
- Get price range
- Return options object

#### `get_featured_products(limit) -> List[ProductSummary]`
- Query products marked as featured
- Or query by some criteria (bestseller, new, etc.)
- Return limited list

#### `get_similar_products(product_id, limit) -> List[ProductSummary]`
- Find products in same categories
- Exclude current product
- Return limited list

#### Admin methods: `create_product`, `update_product`, `delete_product`, variant CRUD

---

## Task 5: Security

### Public Endpoints
- No authentication required
- Rate limiting applied
- Only active products returned

### Admin Endpoints
- Require valid JWT with admin role
- Use `require_admin` dependency
- Log all write operations

### Data Filtering
- Public queries only see `is_active = true` products
- Admin queries can see all products

---

## Task 6: Supabase Integration

### Tables Used
- `products`
- `product_variants`
- `product_images`
- `categories`
- `product_categories` (junction)
- `ar_assets` (for has_ar_asset flag)
- `reviews` (for rating aggregation)

### Query Patterns

| Operation | Joins | Notes |
|-----------|-------|-------|
| List products | variants (for availability) | Apply filters, paginate |
| Product detail | variants, images, categories, ar_assets | Full data fetch |
| Search | Same as list | Add text search |
| Filters | Aggregate distinct values | Cache if needed |

### Performance Considerations
- Index on frequently filtered columns
- Consider full-text search index
- Cache filter options
- Paginate all list queries

---

## Expected Output

1. **Complete endpoint specifications** with parameters and responses
2. **Schema definitions** for requests and responses
3. **Service method descriptions** with logic
4. **Security rules** for public vs admin
5. **No Python code** - only descriptions
