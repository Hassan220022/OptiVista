# Storage Buckets

## product-images
- **Access**: Public
- **Content**: Product thumbnails, gallery images.
- **Path Convention**: `products/{product_id}/{filename}`

## ar-models
- **Access**: Private (Authenticated only)
- **Content**: 3D models (.glb, .usdz), textures.
- **Path Convention**: `models/{product_id}/{filename}`

## user-avatars
- **Access**: Private (Owner only)
- **Content**: User profile pictures.
- **Path Convention**: `avatars/{user_id}/{filename}`
