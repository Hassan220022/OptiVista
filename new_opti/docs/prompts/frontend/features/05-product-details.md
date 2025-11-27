# Product Details Feature Prompt

> **Usage**: Copy and paste this complete prompt to generate the product details feature.
> 
> **Prerequisites**: Run `00-master-project.md` and `frontend/01-architecture.md` first.

---

You are a senior Flutter feature engineer.

## Feature Configuration

```
Feature name: product_details
Target folder: apps/frontend/lib/features/product_details/
```

## Goal

Design the product details experience: rich view of a single frame with images, specs, variants, AR entry, and add-to-cart.

---

## Instructions

### 1. Screen

#### `ProductDetailsScreen` (`presentation/screens/product_details_screen.dart`)

**Sections** (top to bottom):
| Section | Description |
|---------|-------------|
| Image Carousel | Multiple product angles, swipeable |
| Product Header | Name, brand, rating, review count |
| Price Section | Current price, original price (if discounted), discount badge |
| Variant Selector | Color options, size options (frame width) |
| AR Try-On CTA | Primary button: "Try in AR" |
| Add to Cart | Floating or persistent button with quantity selector |
| Specs Section | Material, dimensions, lens type, weight |
| Reviews Preview | Rating summary, 2-3 featured reviews, "See all" link |
| Similar Products | Carousel of related products |

---

### 2. Nested Widgets

Under `presentation/widgets/`:

| Widget | File | Purpose |
|--------|------|---------|
| `ProductImageCarousel` | `product_image_carousel.dart` | Swipeable image gallery with indicators |
| `VariantSelector` | `variant_selector.dart` | Color/size picker with availability |
| `SpecsSection` | `specs_section.dart` | Expandable specifications list |
| `ReviewsPreviewList` | `reviews_preview_list.dart` | Rating summary + featured reviews |
| `SimilarProductsCarousel` | `similar_products_carousel.dart` | Horizontal related products |
| `AddToCartBar` | `add_to_cart_bar.dart` | Sticky bottom bar with price and button |
| `QuantitySelector` | `quantity_selector.dart` | +/- stepper for quantity |

For each widget:
- Define props/inputs
- Describe visual output
- Note interactions and callbacks

---

### 3. State Management

#### `ProductDetailsController` (`presentation/controllers/product_details_controller.dart`)

**Inputs**: `productId` from navigation

**State Fields**:
| Field | Type | Purpose |
|-------|------|---------|
| `isLoading` | bool | Data loading in progress |
| `product` | ProductDetails? | Full product with variants |
| `selectedVariant` | ProductVariant? | Currently selected variant |
| `selectedQuantity` | int | Quantity to add (default 1) |
| `isInWishlist` | bool | Wishlist status |
| `isAddingToCart` | bool | Add to cart in progress |
| `errorMessage` | String? | Error to display |

**Computed/Derived**:
| Field | Derivation |
|-------|------------|
| `currentPrice` | Base price + variant adjustment |
| `hasDiscount` | Original price > current price |
| `isArAvailable` | Selected variant has AR asset |
| `isInStock` | Selected variant has stock |

**Actions**:
| Action | Purpose |
|--------|---------|
| `loadProductDetails(productId)` | Fetch product data |
| `selectVariant(variantId)` | Update selected variant |
| `setQuantity(quantity)` | Update quantity |
| `addToCart()` | Add selected variant to cart |
| `toggleWishlist()` | Add/remove from wishlist |
| `goToArTryOn()` | Navigate to AR with selected variant |

---

### 4. Data/Domain

#### `data/models/product_details_model.dart`

`ProductDetails`:
| Field | Type | Purpose |
|-------|------|---------|
| `id` | String | Product ID |
| `name` | String | Product name |
| `brand` | String | Brand name |
| `description` | String | Full description |
| `basePrice` | double | Base price |
| `images` | List<String> | Image URLs |
| `variants` | List<ProductVariant> | Available variants |
| `specs` | ProductSpecs | Specifications |
| `reviewSummary` | ReviewSummary | Rating + count |
| `featuredReviews` | List<Review> | Top reviews |
| `similarProductIds` | List<String> | Related products |

`ProductVariant`:
| Field | Type | Purpose |
|-------|------|---------|
| `id` | String | Variant ID |
| `colorName` | String | Color display name |
| `colorHex` | String | Color code |
| `size` | String | Frame size |
| `priceAdjustment` | double | +/- from base |
| `stockQuantity` | int | Available stock |
| `hasArAsset` | bool | AR available for this variant |
| `images` | List<String>? | Variant-specific images |

#### `data/repositories/product_details_repository.dart`

**Methods**:
| Method | Input | Output | Purpose |
|--------|-------|--------|---------|
| `getProductDetails` | productId | ProductDetails | Full product data |
| `getSimilarProducts` | productId | List<Product> | Related products |

---

### 5. Navigation

| User Action | Destination |
|-------------|-------------|
| "Try in AR" button | AR Try-On with `productId`, `variantId` |
| "Add to Cart" button | Add to cart + snackbar with "View Cart" action |
| "See all reviews" | Reviews screen for this product |
| Tap similar product | Product Details for that product |
| Back button | Previous screen (catalog/home) |

---

### 6. UX Details

#### Variant Selection
- Default to first available variant
- Show color swatches with selection indicator
- Disable out-of-stock variants (but show them)
- Update price and images when variant changes

#### AR Badge/Button
- Show prominent "Try in AR" button if AR available
- Show disabled state with tooltip if AR not available
- Text: "AR Try-On not available for this style"

#### Add to Cart
- Require variant selection before enabling button
- Show loading state during add
- On success: Snackbar "Added to cart" with "View Cart" action
- On error: Error snackbar with retry

#### Image Carousel
- Pinch to zoom
- Page indicator dots
- Thumbnail strip (optional)

#### Out of Stock
- Clear "Out of Stock" badge on variant
- Disable add to cart
- Option to "Notify when available"

---

## Expected Output

### Directory Tree

```
features/product_details/
├── presentation/
│   ├── screens/
│   │   └── product_details_screen.dart
│   ├── widgets/
│   │   ├── product_image_carousel.dart
│   │   ├── variant_selector.dart
│   │   ├── color_option.dart
│   │   ├── size_option.dart
│   │   ├── specs_section.dart
│   │   ├── reviews_preview_list.dart
│   │   ├── similar_products_carousel.dart
│   │   ├── add_to_cart_bar.dart
│   │   └── quantity_selector.dart
│   └── controllers/
│       └── product_details_controller.dart
├── data/
│   ├── models/
│   │   ├── product_details_model.dart
│   │   ├── product_variant.dart
│   │   ├── product_specs.dart
│   │   └── review_summary.dart
│   └── repositories/
│       └── product_details_repository.dart
└── domain/
    └── entities/
        └── product_details.dart
```

### Per-File Responsibilities

Provide detailed descriptions for each file including:
- Main classes/widgets
- Public methods/properties
- Variant selection logic
- Cart integration

**No Dart code** - only detailed descriptions.
