# Feature Module Prompt Template

> **Usage**: Use this template for each feature module. Copy this file, replace placeholders, and run with your coding agent.
> 
> **Prerequisites**: Run `00-master-project.md`, `frontend/01-architecture.md`, and `frontend/02-shared-ui.md` first.

---

You are a senior Flutter feature engineer.

## Feature Configuration

```
Feature name: <REPLACE_WITH_FEATURE_NAME>
Target folder: apps/frontend/lib/features/<FEATURE_NAME>/
```

## Goal

Design the full feature module, including presentation, state management, and data access interfaces (no actual network code) following Clean-ish architecture:

```
features/<FEATURE_NAME>/
├── presentation/     # Screens, widgets, controllers/viewmodels
├── data/            # Models, repositories, data sources interfaces
└── domain/          # Entities, use cases if needed
```

## Instructions

### 1. Screen Inventory

List all screens and sub-screens in this feature:

| Screen | File Path | Purpose |
|--------|-----------|---------|
| ... | `presentation/screens/..._screen.dart` | ... |

For each screen, document:
- Main UI sections/components
- Which shared widgets are used
- User interactions (tap, swipe, inputs)
- Navigation flows into/out of this feature

### 2. Presentation Layer

#### Screen Widgets
Define one main screen widget per route (e.g., `*_screen.dart`).

For each screen, describe:
- What state it depends on (e.g., current user, product list)
- Which controllers/viewmodels/providers it reads or watches
- How loading, success, and error states are rendered
- Layout structure (scaffold, body sections)

#### Helper Widgets
Define any smaller widgets under `presentation/widgets/`:
- Purpose of each widget
- Props it accepts
- Where it's used

### 3. State Management

Using [Riverpod/Provider/BLoC - pick one], define:

| Provider/Controller | Responsibility | State Fields |
|---------------------|----------------|--------------|
| ... | ... | `isLoading`, `data`, `error`, etc. |

For each:
- What triggers state changes
- What side effects it performs
- How it interacts with repositories

### 4. Data & Domain Layer

#### Models/Entities
Define data structures for this feature:

| Model | Fields | Purpose |
|-------|--------|---------|
| ... | ... | ... |

#### Repository Interfaces
Define repositories the controllers use:

| Repository | Method | Input | Output | Errors |
|------------|--------|-------|--------|--------|
| ... | ... | ... | ... | ... |

### 5. UX Details

Define handling for:
- **Empty states**: What shows when there's no data
- **Error states**: What shows on failure, retry options
- **Edge cases**: No internet, feature not supported, etc.
- **Loading states**: Skeleton, spinner, shimmer

---

## Feature Description

**<DESCRIBE FEATURE IN DETAIL HERE>**

Example descriptions to use as templates:

### Catalog Feature
> Browse all products with filters (shape, color, brand, price range, gender), infinite scroll/pagination, product tiles with AR badge, search bar, quick-add to cart, links to Product Details, filter bottom sheet.

### Product Details Feature
> View single product with image gallery, color/variant selector, size guide, AR try-on button, add to cart with quantity, reviews section with ratings, similar products carousel.

### AR Try-On Feature
> Camera view with 3D glasses overlay, frame variant switcher, fit adjustment controls (scale, position), capture screenshot button, share functionality, guidance overlays.

### Cart Feature
> List of cart items with quantity adjusters, remove item, price summary, promo code input, proceed to checkout button, empty cart state.

### Checkout Feature
> Address selection/entry, shipping method picker, payment method selection, order summary review, place order button, loading/success/failure states.

---

## Expected Output

1. **Directory tree** under `features/<FEATURE_NAME>/`
2. **Per-file explanation**: responsibilities, main classes, states, interactions
3. **No Dart code** - only descriptions

---

## Output Format Example

```
features/catalog/
├── presentation/
│   ├── screens/
│   │   ├── catalog_screen.dart
│   │   │   └── [Detailed description]
│   │   └── search_screen.dart
│   │       └── [Detailed description]
│   ├── widgets/
│   │   ├── product_grid.dart
│   │   ├── filter_bar.dart
│   │   └── search_field.dart
│   └── controllers/
│       └── catalog_controller.dart
│           └── [State management description]
├── data/
│   ├── models/
│   │   └── product_model.dart
│   └── repositories/
│       └── product_repository.dart
└── domain/
    └── entities/
        └── product.dart
```
