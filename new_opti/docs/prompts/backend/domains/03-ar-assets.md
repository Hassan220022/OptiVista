# AR Assets Domain Prompt

> **Usage**: Copy and paste this complete prompt to generate the AR assets backend domain.
> 
> **Prerequisites**: Run `00-master-project.md` and `backend/01-architecture.md` first.

---

You are a FastAPI domain engineer.

## Domain Configuration

```
Domain: ar_assets
Base route: /api/v1/ar-assets
Router file: apps/backend/app/api/v1/ar_assets.py
Service file: apps/backend/app/services/ar_asset_service.py
Schema file: apps/backend/app/schemas/ar_assets.py
```

## Goal

Design endpoints for managing and retrieving AR asset metadata for eyewear variants.

---

## Task 1: Use Cases

### Client Use Cases
| # | Use Case | Actor | Description |
|---|----------|-------|-------------|
| 1 | Get AR Asset by Variant | Client | Fetch AR config for specific variant |
| 2 | Get AR Assets by Product | Client | Fetch all AR configs for a product |
| 3 | Check AR Capability | Client | Get supported AR requirements |

### Admin Use Cases
| # | Use Case | Actor | Description |
|---|----------|-------|-------------|
| 1 | Create AR Asset | Admin | Add AR asset metadata |
| 2 | Update AR Asset | Admin | Modify calibration values |
| 3 | Delete AR Asset | Admin | Remove AR asset |

---

## Task 2: Endpoints

### Client Endpoints

#### `GET /api/v1/ar-assets/by-variant/{variant_id}`

**Purpose**: Get AR asset configuration for a specific variant

**Authentication**: Optional

**Path Parameters**: `variant_id` (string)

**Query Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `platform` | string | No | Filter by platform (ios, android) |

**Response** (200):
```
{
  id: string
  variant_id: string
  product_id: string
  model_url: string — Signed URL to 3D model
  model_format: string — "glb", "usdz"
  thumbnail_url: string | null
  calibration: {
    scale: decimal
    vertical_offset: decimal
    horizontal_offset: decimal
    depth_offset: decimal
    rotation: { x: decimal, y: decimal, z: decimal } | null
  }
  platform: string — "ios", "android", "all"
  file_size_bytes: int
  expires_at: datetime — When signed URL expires
}
```

**Errors**:
| Status | Code | When |
|--------|------|------|
| 404 | `AR_ASSET_NOT_FOUND` | No AR asset for this variant |
| 404 | `VARIANT_NOT_FOUND` | Variant doesn't exist |

#### `GET /api/v1/ar-assets/by-product/{product_id}`

**Purpose**: Get all AR assets for a product

**Path Parameters**: `product_id` (string)

**Query Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `platform` | string | No | Filter by platform |
| `variant_id` | string | No | Filter by specific variant |

**Response** (200):
```
{
  items: [
    {
      id: string
      variant_id: string | null — null means default for product
      model_url: string
      model_format: string
      calibration: { ... }
      platform: string
      file_size_bytes: int
      expires_at: datetime
    }
  ]
}
```

#### `GET /api/v1/ar-assets/capabilities`

**Purpose**: Get AR capability requirements

**Response** (200):
```
{
  min_ios_version: string — "11.0"
  min_arkit_version: string — "1.0"
  min_android_version: string — "7.0"
  min_arcore_version: string — "1.0"
  supported_model_formats: [string] — ["glb", "usdz"]
  max_model_size_mb: int — 50
}
```

#### `GET /api/v1/ar-assets/{asset_id}`

**Purpose**: Get single AR asset with fresh signed URL

**Path Parameters**: `asset_id` (string)

**Response** (200): Single AR asset object

---

### Admin Endpoints

#### `POST /api/v1/ar-assets` (Admin)

**Purpose**: Create new AR asset metadata

**Authentication**: Required (Admin role)

**Request Body**:
```
{
  product_id: string
  variant_id: string | null
  model_path: string — Storage path after upload
  model_format: string — "glb", "usdz"
  calibration: {
    scale: decimal — Default 1.0
    vertical_offset: decimal — Default 0.0
    horizontal_offset: decimal — Default 0.0
    depth_offset: decimal — Default 0.0
  }
  platform: string — "ios", "android", "all"
  file_size_bytes: int
}
```

**Response** (201): Created AR asset

**Errors**:
| Status | Code | When |
|--------|------|------|
| 404 | `PRODUCT_NOT_FOUND` | Product doesn't exist |
| 404 | `VARIANT_NOT_FOUND` | Variant doesn't exist |
| 409 | `AR_ASSET_EXISTS` | Asset already exists for variant/platform |

#### `PUT /api/v1/ar-assets/{asset_id}` (Admin)

**Purpose**: Update AR asset calibration

**Request Body**:
```
{
  calibration: {
    scale: decimal
    vertical_offset: decimal
    horizontal_offset: decimal
    depth_offset: decimal
  }
  is_active: boolean
}
```

**Response** (200): Updated AR asset

#### `DELETE /api/v1/ar-assets/{asset_id}` (Admin)

**Purpose**: Delete AR asset (soft delete)

**Response** (204): No content

---

## Task 3: Schemas

### Request Schemas

| Schema | Fields | Purpose |
|--------|--------|---------|
| `ArAssetCreateRequest` | product_id, variant_id?, model_path, calibration, platform | Create asset |
| `ArAssetUpdateRequest` | calibration?, is_active? | Update asset |
| `CalibrationData` | scale, offsets, rotation | Calibration values |

### Response Schemas

| Schema | Fields | Purpose |
|--------|--------|---------|
| `ArAssetResponse` | Full asset with signed URL | Single asset |
| `ArAssetListResponse` | items: List[ArAsset] | Asset list |
| `ArCapabilitiesResponse` | Platform requirements | Capability check |

---

## Task 4: Service Layer

### `ArAssetService` (`app/services/ar_asset_service.py`)

**Dependencies**: Supabase client, Storage client

**Methods**:

#### `get_asset_by_variant(variant_id, platform?) -> ArAsset`
- Query `ar_assets` by variant_id
- Filter by platform if specified
- Generate signed URL for model
- Return asset or raise `ArAssetNotFoundError`

#### `get_assets_by_product(product_id, platform?, variant_id?) -> List[ArAsset]`
- Query `ar_assets` by product_id
- Apply optional filters
- Generate signed URLs for all
- Return list

#### `get_asset(asset_id) -> ArAsset`
- Query by asset_id
- Generate fresh signed URL
- Return asset

#### `generate_signed_url(model_path, expiry_seconds=3600) -> str`
- Use Supabase Storage API
- Generate signed URL with expiration
- Return URL string

#### `get_capabilities() -> ArCapabilities`
- Return static configuration
- Could be configurable in future

#### Admin methods: `create_asset`, `update_asset`, `delete_asset`

---

## Task 5: Security

### Client Endpoints
- No authentication required
- Rate limiting on signed URL generation
- Only active assets returned

### Admin Endpoints
- Require admin role
- Validate product/variant existence before create
- Log all changes

### Signed URLs
- Default expiry: 1 hour
- Longer expiry (24h) for prefetch requests
- Include in response when URL expires

---

## Task 6: Supabase Integration

### Tables Used
- `ar_assets`
- `products` (for validation)
- `product_variants` (for validation)

### Storage Bucket
- Bucket: `ar-models`
- Path structure: `{product_id}/{variant_id}/model.{format}`
- Signed URL access

### Query Patterns

| Operation | Query | Notes |
|-----------|-------|-------|
| By variant | `ar_assets where variant_id = ?` | + platform filter |
| By product | `ar_assets where product_id = ?` | Include all variants |
| Single asset | `ar_assets where id = ?` | Direct lookup |

### URL Signing
```
// Conceptual
signed_url = supabase.storage
  .from('ar-models')
  .create_signed_url(model_path, expires_in=3600)
```

---

## Task 7: Calibration Data

### Calibration Object
| Field | Type | Default | Range | Purpose |
|-------|------|---------|-------|---------|
| `scale` | decimal | 1.0 | 0.5-2.0 | Model size multiplier |
| `vertical_offset` | decimal | 0.0 | -1.0-1.0 | Y-axis shift |
| `horizontal_offset` | decimal | 0.0 | -1.0-1.0 | X-axis shift |
| `depth_offset` | decimal | 0.0 | -1.0-1.0 | Z-axis shift |
| `rotation.x` | decimal | 0.0 | -180-180 | X rotation degrees |
| `rotation.y` | decimal | 0.0 | -180-180 | Y rotation degrees |
| `rotation.z` | decimal | 0.0 | -180-180 | Z rotation degrees |

### Client Usage
1. Client receives calibration as defaults
2. Applies to 3D model transform
3. User adjustments added on top
4. User adjustments can be saved locally

---

## Expected Output

1. **Complete endpoint specifications** for AR asset retrieval
2. **Signed URL generation** approach
3. **Calibration data structure** and usage
4. **Admin endpoints** for asset management
5. **No Python code** - only descriptions
