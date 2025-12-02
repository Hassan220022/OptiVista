---
trigger: model_decision
---

# Shared UI & Design System Prompt

> **Usage**: Use this prompt to build all common widgets and theming.
> 
> **Prerequisites**: Run `00-master-project.md` and `frontend/01-architecture.md` first.

---

You are a Flutter UI/UX specialist.

## Goal

Design the shared UI layer (design system) for the AR Eyewear app.

## Context

The app is a modern, sleek eyewear e-commerce app where aesthetics matter. We want:
- Clean layouts
- Consistent paddings, radii, elevations
- Reusable, composable widgets

## Task

### 1. Define Widget Library

Under `apps/frontend/lib/shared/widgets/`, define:

| Widget | Purpose |
|--------|---------|
| **Primary Button** | Main CTA button with loading state |
| **Secondary Button** | Less prominent actions |
| **Icon Button** | Circular icon actions |
| **App Bar Variants** | Standard, large title, transparent overlay |
| **Product Card** | Thumbnail, name, price, AR badge |
| **Section Header** | Title with optional "See All" action |
| **Tag Chips** | Category/filter display chips |
| **Filter Chips** | Selectable filter options |
| **Rating Stars** | Display and input rating |
| **Empty State** | Icon + title + description + CTA |
| **Loading Indicators** | Spinners, progress bars |
| **Skeleton Loaders** | Placeholder content shapes |
| **Error Banner** | Inline error display |
| **Snackbar Wrapper** | Consistent snackbar styling |

### 2. Define Dialog Library

Under `apps/frontend/lib/shared/dialogs/`, define:

| Dialog | Purpose |
|--------|---------|
| **Confirmation Dialog** | Yes/No decisions with customizable text |
| **Error Dialog** | Error display with retry option |
| **Filter Bottom Sheet** | Multi-select filters with apply/reset |
| **Action Bottom Sheet** | List of action options |

### 3. Define Theme System

Under `apps/frontend/lib/shared/theme/`, define:

| File | Contents |
|------|----------|
| **app_theme.dart** | Main ThemeData for light/dark modes |
| **color_scheme.dart** | Brand colors, semantic colors |
| **typography.dart** | Text styles scale (headline, body, caption, etc.) |
| **spacing.dart** | Padding/margin constants (xs, sm, md, lg, xl) |
| **sizes.dart** | Icon sizes, radius values, elevation levels |
| **app_icons.dart** | Centralized icon mapping |

### 4. Per-File Documentation

For each widget/theme file, provide:

- **File path**: Exact location in project
- **Public widgets/classes**: Names and their props (in words)
- **Visual output**: What it renders
- **Theme integration**: How it uses/extends the global theme
- **Variants**: Different states or configurations

### 5. Usage Rules

Define clear guidelines for:

- How feature screens should use these shared widgets
- When to create a new shared widget vs. feature-specific widget
- How to handle dark mode consistently
- Naming conventions for widget variants

## Expected Output

1. **Detailed file list** under `shared/`
2. **Clear descriptions** of each shared widget/dialog/theme element
3. **Integration guidelines** for feature developers
4. **No Flutter code** - only descriptions

---

## Output Format Example

### `shared/widgets/buttons/primary_button.dart`

**Responsibility**: Main call-to-action button used throughout the app.

**Widget: `PrimaryButton`**
- **Props**:
  - `label` (String) - Button text
  - `onPressed` (VoidCallback?) - Tap handler, null = disabled state
  - `isLoading` (bool) - Shows spinner, disables interaction
  - `icon` (IconData?) - Optional leading icon
  - `fullWidth` (bool) - Expand to fill parent width
- **Visual**: Rounded rectangle with brand primary color, white text, elevation on press
- **States**: Default, pressed, disabled, loading
- **Theme Integration**: Uses `colorScheme.primary` for background, `colorScheme.onPrimary` for text

**Used In**: Auth screens, checkout, cart, AR try-on capture button
