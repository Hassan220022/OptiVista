# Catalog Feature Prompt

> **Usage**: Copy and paste this complete prompt to generate the catalog feature.
> 
> **Prerequisites**: Run `00-master-project.md` and `frontend/01-architecture.md` first.

---

You are a senior Flutter feature engineer.

## Feature Configuration

```
Feature name: catalog
Target folder: apps/frontend/lib/features/catalog/
```

## Goal

Design the full catalog browsing and search experience: list of eyewear products, filters, search, pagination or infinite scroll, AR-enabled labeling.

---

## Instructions

### 1. Screens

| Screen | Path | Purpose |
|--------|------|---------|
| `CatalogScreen` | `presentation/screens/catalog_screen.dart` | Main product grid/list with filters |
| `FilterBottomSheet` | `presentation/widgets/filter_bottom_sheet.dart` | Multi-section filter selection |
| `SearchResultsScreen` | `presentation/screens/search_results_screen.dart` | Search results (or integrated into catalog) |

#### CatalogScreen Layout
- **App Bar**: Title, search icon, filter icon
- **Search Bar**: Expandable or always visible
- **Filter/Sort Bar**: Active filter chips, sort dropdown
- **Product Grid**: 2-column grid of product cards
- **Pagination**: Infinite scroll or "Load more" button

#### FilterBottomSheet Sections
| Section | Options |
|---------|---------|
| Frame Shape | Round, Square, Aviator, Cat-eye, etc. |
| Color | Black, Brown, Gold, Silver, Tortoise, etc. |
| Brand | List of available brands |
| Gender | Men, Women, Unisex |
| Price Range | Slider or predefined ranges |
| AR Available | Toggle for AR-enabled only |

---

### 2. Presentation & State

#### `CatalogController` (`presentation/controllers/catalog_controller.dart`)

**State Fields**:
| Field | Type | Purpose |
|-------|------|---------|
| `isLoading` | bool | Initial load in progress |
| `isLoadingMore` | bool | Pagination load in progress |
| `isRefreshing` | bool | Pull-to-refresh in progress |
| `products` | List<Product> | Current loaded products |
| `appliedFilters` | FilterState | Active filter configuration |
| `currentPage` | int | Current pagination page |
| `hasMore` | bool | More products available |
| `searchQuery` | String | Active search query |
| `sortBy` | SortOption | Current sort selection |
| `errorMessage` | String? | Error to display |
| `totalCount` | int | Total matching products |

**Actions**:
| Action | Purpose |
|--------|---------|
| `loadInitialProducts()` | Fetch first page |
| `loadMore()` | Fetch next page (pagination) |
| `applyFilters(newFilters)` | Apply filters, reset to page 1 |
| `clearFilters()` | Remove all filters |
| `setSearchQuery(query)` | Set search, reload |
| `setSortOption(option)` | Change sort, reload |
| `refresh()` | Pull-to-refresh |

#### `FilterState` Entity

| Field | Type | Purpose |
|-------|------|---------|
| `shapes` | List<String> | Selected frame shapes |
| `colors` | List<String> | Selected colors |
| `brands` | List<String> | Selected brands |
| `gender` | String? | Selected gender filter |
| `minPrice` | double? | Minimum price |
| `maxPrice` | double? | Maximum price |
| `arOnly` | bool | Only AR-enabled products |

---

### 3. Data/Domain

#### `data/models/product_model.dart`

`Product` / `ProductSummary`:
| Field | Type | Purpose |
|-------|------|---------|
| `id` | String | Unique identifier |
| `name` | String | Product name |
| `brand` | String | Brand name |
| `price` | double | Display price |
| `originalPrice` | double? | Price before discount |
| `imageUrl` | String | Primary image URL |
| `hasArAsset` | bool | AR try-on available |
| `rating` | double? | Average rating |
| `reviewCount` | int | Number of reviews |
| `categoryIds` | List<String> | Category associations |
| `isNew` | bool | New arrival flag |
| `isBestseller` | bool | Bestseller flag |

#### `data/repositories/products_repository.dart`

**Methods**:
| Method | Input | Output | Purpose |
|--------|-------|--------|---------|
| `fetchProducts` | filters, page, pageSize | ProductsPage | Get paginated products |
| `searchProducts` | query, filters, page | ProductsPage | Search with filters |
| `getFilterOptions` | - | FilterOptions | Available filter values |

`ProductsPage` contains:
- `items`: List of products
- `totalCount`: Total matching
- `currentPage`: Current page number
- `hasMore`: More pages available

---

### 4. UI Components

#### Product Card (use shared `ProductCard`)
- Product image with AR badge overlay
- Product name and brand
- Price (with strikethrough if discounted)
- Rating stars
- Quick add-to-cart button (optional)

#### Loading State
- Skeleton grid while loading
- Shimmer effect on placeholders

#### Empty State
- "No products found" message
- Illustration
- "Reset filters" button
- "Try a different search" suggestion

#### Error State
- Error message
- Retry button
- Option to go back

---

### 5. Navigation

| User Action | Destination |
|-------------|-------------|
| Tap product card | Product Details with `productId` |
| Tap AR badge on card | Direct AR Try-On (if supported) |
| Tap search icon | Focus search field |
| Tap filter icon | Open FilterBottomSheet |
| Back button | Previous screen (home) |

---

### 6. UX Details

#### Infinite Scroll
- Load more when user scrolls near bottom
- Show loading indicator at bottom
- Handle rapid scrolling gracefully

#### Filter Persistence
- Remember filters within session
- Option to save filter preferences

#### Search Behavior
- Debounce search input (300ms)
- Show search suggestions (optional)
- Highlight matching text in results

#### Performance
- Lazy load images
- Cache product list
- Prefetch next page

---

## Expected Output

### Directory Tree

```
features/catalog/
├── presentation/
│   ├── screens/
│   │   ├── catalog_screen.dart
│   │   └── search_results_screen.dart
│   ├── widgets/
│   │   ├── filter_bottom_sheet.dart
│   │   ├── filter_chip_bar.dart
│   │   ├── sort_dropdown.dart
│   │   ├── product_grid.dart
│   │   ├── catalog_search_bar.dart
│   │   └── catalog_empty_state.dart
│   └── controllers/
│       ├── catalog_controller.dart
│       └── filter_controller.dart
├── data/
│   ├── models/
│   │   ├── product_model.dart
│   │   ├── filter_options.dart
│   │   └── products_page.dart
│   └── repositories/
│       └── products_repository.dart
└── domain/
    └── entities/
        ├── product.dart
        └── filter_state.dart
```

### Per-File Responsibilities

Provide detailed descriptions for each file including:
- Main classes/widgets
- Public methods/properties
- How filtering and pagination work
- Dependencies on shared widgets

**No Dart code** - only detailed descriptions.
