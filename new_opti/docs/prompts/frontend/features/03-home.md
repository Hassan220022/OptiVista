# Home Feature Prompt

> **Usage**: Copy and paste this complete prompt to generate the home feature.
> 
> **Prerequisites**: Run `00-master-project.md` and `frontend/01-architecture.md` first.

---

You are a senior Flutter feature engineer.

## Feature Configuration

```
Feature name: home
Target folder: apps/frontend/lib/features/home/
```

## Goal

Design the home screen experience that user sees after login. It should feature hero sections, featured products, quick access to catalog and AR, and possibly personalized recommendations.

---

## Instructions

### 1. Screens

#### `HomeScreen` (`presentation/screens/home_screen.dart`)

Acts as main tab/root after authentication.

**Contains**:
| Section | Description |
|---------|-------------|
| Top App Bar | Greeting ("Good morning, [Name]"), profile avatar, cart icon with badge |
| Search Bar | Tappable search field leading to catalog search |
| Hero Banner | Promotional banner or AR Try-On spotlight |
| Featured Products | Horizontally scrolling product carousel |
| Category Chips | Quick filters: "Men", "Women", "Unisex", "Sunglasses" |
| Quick Actions | "Browse All", "AR Try-On", "My Orders" cards |
| Recommended Products | Personalized or trending products section |

---

### 2. Nested Widgets

Under `presentation/widgets/`:

| Widget | File | Purpose |
|--------|------|---------|
| `HomeHeroBanner` | `home_hero_banner.dart` | Large promotional banner with CTA |
| `FeaturedProductCarousel` | `featured_product_carousel.dart` | Horizontal scrolling product list |
| `CategoryChipRow` | `category_chip_row.dart` | Scrollable category filter chips |
| `QuickActionRow` | `quick_action_row.dart` | Grid of quick action cards |
| `HomeGreeting` | `home_greeting.dart` | Personalized greeting with user name |

For each widget, describe:
- Props it accepts
- What it renders
- Which shared widgets it uses
- Navigation actions it triggers

---

### 3. State Management

#### `HomeController` (`presentation/controllers/home_controller.dart`)

**State Fields**:
| Field | Type | Purpose |
|-------|------|---------|
| `isLoading` | bool | Initial data loading |
| `isRefreshing` | bool | Pull-to-refresh in progress |
| `featuredProducts` | List<Product> | Featured products list |
| `recommendedProducts` | List<Product> | Personalized recommendations |
| `userName` | String? | Current user's name for greeting |
| `cartItemCount` | int | Badge count for cart icon |
| `errorMessage` | String? | Error to display |

**Actions**:
| Action | Purpose |
|--------|---------|
| `loadHomeData()` | Fetch all home screen data |
| `refresh()` | Pull-to-refresh handler |
| `onCategorySelected(category)` | Navigate to filtered catalog |

**Screen Rendering**:
- **Loading**: Show skeleton placeholders for each section
- **Error**: Show error banner with retry button
- **Success**: Show all content sections
- **Refreshing**: Show refresh indicator, keep existing content

---

### 4. Data/Domain

#### Data Sources

Use `ProductsRepository` from catalog feature (don't reinvent):

```
// Conceptual usage
productsRepository.getFeaturedProducts()
productsRepository.getRecommendedProducts(userId)
```

#### Optional `HomeRepository` (`data/home_repository.dart`)

Wraps product repository calls for home-specific endpoints:

| Method | Purpose |
|--------|---------|
| `getHomeData()` | Fetch all home screen data in one call |
| `getFeaturedProducts()` | Get featured products |
| `getRecommendedProducts()` | Get personalized recommendations |

#### Entities

Use shared models from catalog:
- `Product` / `ProductSummary`
- No home-specific entities needed

---

### 5. Navigation

| User Action | Destination |
|-------------|-------------|
| Tap product card | Product Details screen |
| Tap "See All" on featured | Catalog with "featured" filter |
| Tap "Try in AR" hero | AR Try-On with recommended frame OR AR-enabled catalog |
| Tap cart icon | Cart screen |
| Tap profile avatar | Profile screen |
| Tap search bar | Catalog in search mode |
| Tap category chip | Catalog filtered by category |
| Tap quick action | Respective feature screen |

---

### 6. UX Details

#### Personalization
- Greeting uses profile data: "Good morning, [Name]"
- Time-based greeting: morning/afternoon/evening
- If name unavailable, use "Welcome back"

#### Empty States
| Scenario | Display |
|----------|---------|
| No featured products | "New arrivals coming soon" message |
| No recommendations | Hide section or show "Explore our collection" |
| Network error | Full-screen error with retry |

#### Pull-to-Refresh
- Standard pull-to-refresh gesture
- Refreshes all sections
- Shows indicator at top

#### Performance
- Lazy load images in carousels
- Cache product data for fast display
- Prefetch product details on hover/long-press (optional)

---

## Expected Output

### Directory Tree

```
features/home/
├── presentation/
│   ├── screens/
│   │   └── home_screen.dart
│   ├── widgets/
│   │   ├── home_hero_banner.dart
│   │   ├── featured_product_carousel.dart
│   │   ├── category_chip_row.dart
│   │   ├── quick_action_row.dart
│   │   ├── quick_action_card.dart
│   │   └── home_greeting.dart
│   └── controllers/
│       └── home_controller.dart
├── data/
│   └── home_repository.dart (optional wrapper)
└── domain/
    └── (uses shared entities)
```

### Per-File Responsibilities

Provide detailed descriptions for each file including:
- Main classes/widgets
- Public methods/properties
- Dependencies on catalog/cart features
- Navigation triggers

**No Dart code** - only detailed descriptions.
