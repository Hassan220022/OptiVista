# Database Schema & Supabase Integration Prompt

> **Usage**: Use this prompt to design the database schema and Supabase configuration.
> 
> **Prerequisites**: Run `00-master-project.md` first to establish context.

---

You are a database architect working with Supabase (Postgres).

## Goal

Design the database schema and Supabase integration for the AR Eyewear app.

---

## Task 1: Define Tables

### Core Tables

For each table, define:
- Column names and types (conceptually)
- Purpose of each column
- Relationships (foreign keys)
- Important indexes

---

### `profiles` (extends Supabase auth.users)

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (PK, FK to auth.users) | Links to Supabase auth |
| `email` | TEXT | User's email (synced from auth) |
| `full_name` | TEXT | Display name |
| `avatar_url` | TEXT | Profile picture URL |
| `phone` | TEXT | Contact number |
| `role` | ENUM (shopper, admin) | User role |
| `created_at` | TIMESTAMP | Account creation |
| `updated_at` | TIMESTAMP | Last profile update |

**Relationships**: One-to-one with `auth.users`
**Indexes**: `email` (unique)

---

### `addresses`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (PK) | Primary key |
| `user_id` | UUID (FK) | Owner |
| `label` | TEXT | "Home", "Work", etc. |
| `full_name` | TEXT | Recipient name |
| `phone` | TEXT | Contact number |
| `street_address` | TEXT | Street line 1 |
| `street_address_2` | TEXT | Street line 2 (optional) |
| `city` | TEXT | City |
| `state` | TEXT | State/Province |
| `postal_code` | TEXT | ZIP/Postal code |
| `country` | TEXT | Country code |
| `is_default` | BOOLEAN | Default shipping address |
| `created_at` | TIMESTAMP | Creation time |

**Relationships**: Many-to-one with `profiles`
**Indexes**: `user_id`

---

### `categories`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (PK) | Primary key |
| `name` | TEXT | Category name |
| `slug` | TEXT | URL-friendly identifier |
| `type` | ENUM | frame_type, gender, style, etc. |
| `parent_id` | UUID (FK, nullable) | Parent category |
| `display_order` | INT | Sort order |
| `created_at` | TIMESTAMP | Creation time |

**Relationships**: Self-referential for hierarchy
**Indexes**: `slug` (unique), `type`

---

### `products`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (PK) | Primary key |
| `sku` | TEXT | Stock keeping unit |
| `name` | TEXT | Product name |
| `slug` | TEXT | URL-friendly identifier |
| `description` | TEXT | Full description |
| `short_description` | TEXT | Card/preview text |
| `brand` | TEXT | Brand name |
| `base_price` | DECIMAL | Base price before variants |
| `currency` | TEXT | Currency code (USD, EUR) |
| `is_active` | BOOLEAN | Published status |
| `is_ar_enabled` | BOOLEAN | Has AR try-on |
| `created_at` | TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | Last update |

**Relationships**: 
- Many-to-many with `categories` via `product_categories`
- One-to-many with `product_variants`

**Indexes**: `slug` (unique), `sku` (unique), `is_active`, `brand`

---

### `product_categories` (junction)

| Column | Type | Purpose |
|--------|------|---------|
| `product_id` | UUID (FK) | Product reference |
| `category_id` | UUID (FK) | Category reference |

**Indexes**: Composite primary key

---

### `product_variants`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (PK) | Primary key |
| `product_id` | UUID (FK) | Parent product |
| `name` | TEXT | Variant name ("Black", "Tortoise") |
| `color_hex` | TEXT | Color code for UI |
| `color_name` | TEXT | Human-readable color |
| `size` | TEXT | Frame size (S, M, L) |
| `price_adjustment` | DECIMAL | +/- from base price |
| `stock_quantity` | INT | Available inventory |
| `is_active` | BOOLEAN | Available for purchase |
| `display_order` | INT | Sort order |
| `created_at` | TIMESTAMP | Creation time |

**Relationships**: Many-to-one with `products`
**Indexes**: `product_id`, `is_active`

---

### `product_images`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (PK) | Primary key |
| `product_id` | UUID (FK) | Product reference |
| `variant_id` | UUID (FK, nullable) | Variant-specific image |
| `url` | TEXT | Image URL (Supabase storage) |
| `alt_text` | TEXT | Accessibility text |
| `is_primary` | BOOLEAN | Main product image |
| `display_order` | INT | Gallery order |
| `created_at` | TIMESTAMP | Upload time |

**Relationships**: Many-to-one with `products` and `product_variants`
**Indexes**: `product_id`, `variant_id`

---

### `ar_assets`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (PK) | Primary key |
| `product_id` | UUID (FK) | Product reference |
| `variant_id` | UUID (FK, nullable) | Variant-specific model |
| `model_url` | TEXT | 3D model file URL (.glb) |
| `model_format` | TEXT | File format (glb, usdz) |
| `default_scale` | DECIMAL | Default sizing factor |
| `default_vertical_offset` | DECIMAL | Y-axis positioning |
| `default_horizontal_offset` | DECIMAL | X-axis positioning |
| `platform` | ENUM | ios, android, all |
| `is_active` | BOOLEAN | Available for AR |
| `file_size_bytes` | INT | For download estimation |
| `created_at` | TIMESTAMP | Upload time |
| `updated_at` | TIMESTAMP | Last update |

**Relationships**: Many-to-one with `products` and `product_variants`
**Indexes**: `product_id`, `variant_id`, `is_active`

---

### `carts`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (PK) | Primary key |
| `user_id` | UUID (FK) | Cart owner |
| `status` | ENUM | active, converted, abandoned |
| `created_at` | TIMESTAMP | Cart creation |
| `updated_at` | TIMESTAMP | Last modification |

**Relationships**: One-to-one active cart per user
**Indexes**: `user_id`, `status`

---

### `cart_items`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (PK) | Primary key |
| `cart_id` | UUID (FK) | Parent cart |
| `product_id` | UUID (FK) | Product reference |
| `variant_id` | UUID (FK) | Selected variant |
| `quantity` | INT | Item count |
| `unit_price` | DECIMAL | Price at time of add |
| `created_at` | TIMESTAMP | Add time |
| `updated_at` | TIMESTAMP | Quantity update time |

**Relationships**: Many-to-one with `carts`, `products`, `product_variants`
**Indexes**: `cart_id`

---

### `orders`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (PK) | Primary key |
| `user_id` | UUID (FK) | Customer |
| `order_number` | TEXT | Human-readable order ID |
| `status` | ENUM | pending, confirmed, processing, shipped, delivered, cancelled |
| `subtotal` | DECIMAL | Items total |
| `shipping_cost` | DECIMAL | Shipping fee |
| `tax_amount` | DECIMAL | Tax applied |
| `discount_amount` | DECIMAL | Discounts applied |
| `total` | DECIMAL | Final amount |
| `currency` | TEXT | Currency code |
| `shipping_address` | JSONB | Address snapshot |
| `billing_address` | JSONB | Billing address snapshot |
| `payment_method` | TEXT | Payment type used |
| `payment_status` | ENUM | pending, paid, failed, refunded |
| `payment_intent_id` | TEXT | Payment gateway reference |
| `notes` | TEXT | Customer notes |
| `created_at` | TIMESTAMP | Order placement |
| `updated_at` | TIMESTAMP | Status update |

**Relationships**: Many-to-one with `profiles`
**Indexes**: `user_id`, `order_number` (unique), `status`, `created_at`

---

### `order_items`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (PK) | Primary key |
| `order_id` | UUID (FK) | Parent order |
| `product_id` | UUID (FK) | Product reference |
| `variant_id` | UUID (FK) | Variant reference |
| `product_name` | TEXT | Name snapshot |
| `variant_name` | TEXT | Variant snapshot |
| `quantity` | INT | Item count |
| `unit_price` | DECIMAL | Price at purchase |
| `total_price` | DECIMAL | quantity * unit_price |
| `created_at` | TIMESTAMP | Creation time |

**Relationships**: Many-to-one with `orders`
**Indexes**: `order_id`

---

### `reviews`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (PK) | Primary key |
| `user_id` | UUID (FK) | Reviewer |
| `product_id` | UUID (FK) | Reviewed product |
| `order_id` | UUID (FK, nullable) | Verified purchase link |
| `rating` | INT | 1-5 stars |
| `title` | TEXT | Review headline |
| `body` | TEXT | Review content |
| `is_verified_purchase` | BOOLEAN | Has order for product |
| `is_approved` | BOOLEAN | Moderation status |
| `created_at` | TIMESTAMP | Review submission |
| `updated_at` | TIMESTAMP | Edit time |

**Relationships**: Many-to-one with `profiles`, `products`, `orders`
**Indexes**: `product_id`, `user_id`, `is_approved`, `rating`

---

### `wishlists` (optional, future)

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (PK) | Primary key |
| `user_id` | UUID (FK) | Owner |
| `product_id` | UUID (FK) | Wishlisted product |
| `created_at` | TIMESTAMP | Add time |

---

## Task 2: Supabase-Specific Configuration

### Auth Integration

- Supabase `auth.users` is the source of truth for credentials
- `profiles` table extends auth with app-specific data
- Trigger on `auth.users` insert creates `profiles` row automatically
- Sync `email` changes from auth to profiles

### Row Level Security (RLS) Policies

| Table | Policy | Rule |
|-------|--------|------|
| `profiles` | Users see own | `auth.uid() = id` |
| `profiles` | Users update own | `auth.uid() = id` |
| `addresses` | Users see/edit own | `auth.uid() = user_id` |
| `carts` | Users see/edit own | `auth.uid() = user_id` |
| `cart_items` | Via cart ownership | Join to cart, check user |
| `orders` | Users see own | `auth.uid() = user_id` |
| `reviews` | Users see all approved | `is_approved = true` |
| `reviews` | Users edit own | `auth.uid() = user_id` |
| `products` | Public read | `is_active = true` |
| `products` | Admin write | `role = 'admin'` |
| `ar_assets` | Public read | `is_active = true` |
| `categories` | Public read | All |

### Storage Buckets

| Bucket | Purpose | Access |
|--------|---------|--------|
| `product-images` | Product photos | Public read |
| `ar-models` | 3D model files (.glb) | Public read (signed URLs for large files) |
| `user-avatars` | Profile pictures | Public read, owner write |
| `ar-captures` | User AR screenshots | Owner read/write |

---

## Task 3: Migrations & Seed Data

### Migration Organization

```
supabase/migrations/
├── 00001_initial_schema.sql       # Core tables
├── 00002_categories.sql           # Category structure
├── 00003_products.sql             # Product tables
├── 00004_ar_assets.sql            # AR-specific tables
├── 00005_cart_orders.sql          # Commerce tables
├── 00006_reviews.sql              # Review system
├── 00007_rls_policies.sql         # All RLS policies
├── 00008_functions.sql            # Helper functions
└── 00009_triggers.sql             # Automation triggers
```

### Seed Data Structure

```
supabase/seed/
├── 01_categories.sql              # Frame types, genders, styles
├── 02_sample_products.sql         # Demo products
├── 03_sample_variants.sql         # Product variants
├── 04_sample_images.sql           # Image references
└── 05_sample_ar_assets.sql        # AR model references
```

### Backend Schema Discovery

- Backend reads schema via Supabase client
- No ORM models needed; use Supabase Python SDK
- Type hints from Pydantic schemas match DB columns
- Migrations run via Supabase CLI, not backend

---

## Expected Output

1. **Complete schema description** - table by table with all columns
2. **RLS policy definitions** - who can do what
3. **Storage bucket configuration** - purposes and access rules
4. **Migration file structure** - organization approach
5. **No SQL code** - only conceptual descriptions
