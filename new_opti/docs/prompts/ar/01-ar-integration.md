# AR Backend & Native Integration Prompt

> **Usage**: Use this prompt for AR-related backend design and native coordination.
> 
> **Prerequisites**: Run `00-master-project.md` first.

---

You are handling the AR backend & coordination layer.

## Goal

Design backend and storage aspects for AR assets and how mobile clients consume them.

---

## Task 1: AR Asset Concept

For each eyewear variant, there may be:
- **3D model file** (e.g., .glb, .usdz)
- **Scale/offset calibration data** (how to position it on the face)
- **Supported platforms** (iOS-only, Android-only, Unity-only, all)

### `ar_assets` Table Design

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID | Primary key |
| `product_id` | UUID (FK) | Parent product |
| `variant_id` | UUID (FK, nullable) | Specific variant (null = all variants) |
| `model_url` | TEXT | URL to 3D model in storage |
| `model_format` | ENUM | glb, usdz, fbx |
| `thumbnail_url` | TEXT | Preview image URL |
| `default_scale` | DECIMAL | Default sizing factor (1.0 = normal) |
| `default_vertical_offset` | DECIMAL | Y-axis position adjustment |
| `default_horizontal_offset` | DECIMAL | X-axis position adjustment |
| `default_depth_offset` | DECIMAL | Z-axis position adjustment |
| `platform` | ENUM | ios, android, all |
| `min_sdk_version` | TEXT | Minimum AR SDK version required |
| `file_size_bytes` | INT | For download progress/estimation |
| `is_active` | BOOLEAN | Available for use |
| `created_at` | TIMESTAMP | Upload time |
| `updated_at` | TIMESTAMP | Last modification |

### Relationships

- Many-to-one with `products`
- Many-to-one with `product_variants` (optional)
- One product can have multiple AR assets for different platforms

---

## Task 2: API Endpoints

### `GET /api/v1/ar-assets/product/{product_id}`

**Purpose**: Get all AR assets for a product

**Parameters**:
| Location | Name | Type | Required | Description |
|----------|------|------|----------|-------------|
| path | `product_id` | UUID | Yes | Product ID |
| query | `platform` | string | No | Filter by platform (ios/android) |
| query | `variant_id` | UUID | No | Filter by specific variant |

**Response**:
```
{
  assets: [
    {
      id: UUID,
      variant_id: UUID | null,
      model_url: string (signed URL),
      model_format: string,
      calibration: {
        scale: number,
        vertical_offset: number,
        horizontal_offset: number,
        depth_offset: number
      },
      platform: string,
      file_size_bytes: number
    }
  ]
}
```

### `GET /api/v1/ar-assets/{asset_id}`

**Purpose**: Get single AR asset details with fresh signed URL

**Response**: Single asset object with signed URL valid for 1 hour

### `GET /api/v1/products?ar_enabled=true`

**Purpose**: List only AR-capable products

**Note**: Uses existing products endpoint with filter

### Admin Endpoints

#### `POST /api/v1/admin/ar-assets`

**Purpose**: Upload new AR asset metadata (after file upload to storage)

**Body**:
```
{
  product_id: UUID,
  variant_id: UUID | null,
  model_path: string (storage path),
  model_format: string,
  calibration: { ... },
  platform: string
}
```

#### `PUT /api/v1/admin/ar-assets/{asset_id}`

**Purpose**: Update AR asset calibration or metadata

#### `DELETE /api/v1/admin/ar-assets/{asset_id}`

**Purpose**: Soft delete (set is_active = false)

---

## Task 3: Storage Strategy

### Supabase Storage Bucket: `ar-models`

**Structure**:
```
ar-models/
├── {product_id}/
│   ├── {variant_id}/
│   │   ├── model.glb
│   │   └── model.usdz
│   └── default/
│       ├── model.glb
│       └── model.usdz
```

### URL Strategy

- **Stored in DB**: Relative path (e.g., `{product_id}/default/model.glb`)
- **Returned to client**: Signed URL with expiration
- **Signed URL duration**: 1 hour for normal requests, 24 hours for pre-caching

### Caching Recommendations for Frontend

1. **Pre-fetch on product details view**: Start downloading AR model when user views product
2. **Cache by asset ID + version**: Store locally with cache key
3. **Check file size before download**: Show warning on cellular if > 5MB
4. **Background download**: Use platform background download APIs

---

## Task 4: Calibration Data Delivery

### Calibration Object Structure

```
{
  scale: 1.0,              // Multiplier for model size
  vertical_offset: 0.0,    // Y-axis shift (positive = up)
  horizontal_offset: 0.0,  // X-axis shift (positive = right)
  depth_offset: 0.0,       // Z-axis shift (positive = forward)
  rotation_offset: {       // Optional rotation adjustments
    x: 0.0,
    y: 0.0,
    z: 0.0
  }
}
```

### How Frontend Uses Calibration

1. Load AR asset with calibration data
2. Apply `default_*` values as initial transform
3. Allow user to adjust via UI sliders
4. User adjustments are additive to defaults
5. Optionally save user preferences for future sessions

### Platform-Specific Notes

| Platform | Model Format | Notes |
|----------|--------------|-------|
| iOS (ARKit) | .usdz preferred, .glb supported | Native USDZ rendering is fastest |
| Android (ARCore) | .glb | Standard format |
| Unity AR | .glb or .fbx | Depends on Unity importer |

---

## Task 5: AR Capability Check

### Endpoint: `GET /api/v1/ar-assets/capabilities`

**Purpose**: Return AR support requirements for the app

**Response**:
```
{
  min_ios_version: "11.0",
  min_arkit_version: "1.0",
  min_android_version: "7.0",
  min_arcore_version: "1.0",
  supported_formats: ["glb", "usdz"],
  max_model_size_mb: 50
}
```

**Usage**: Frontend checks device capabilities against these requirements

---

## Expected Output

1. **AR asset schema** with all columns and relationships
2. **API endpoint specifications** for asset retrieval
3. **Storage organization** and URL strategy
4. **Calibration data format** and usage
5. **No code** - only detailed descriptions
