# Frontend Architecture & Scaffold Prompt

> **Usage**: Use this prompt to generate the full Flutter project structure inside `apps/frontend`.
> 
> **Prerequisites**: Run `00-master-project.md` first to establish context.

---

You are a senior Flutter architect.

## Goal

Design and implement the FULL Flutter project structure for a production-grade AR Eyewear e-commerce app inside `apps/frontend`.

## Constraints

- Flutter 3+, Dart with null-safety
- Material 3 design, minimal dependencies
- Use a modular, feature-first structure with clear separation of:
  - **core/** - config, routing, theme, network, error handling, supabase client, security
  - **shared/** - reusable widgets, dialogs, mixins, theme extensions
  - **features/** - onboarding, auth, home, catalog, product_details, ar_tryon, cart, checkout, profile, orders, feedback, settings
  - **main entrypoint files** - main.dart, app.dart or equivalent

## Task

### 1. Define the Complete Directory Tree

Create the full directory tree under `apps/frontend/lib`.

### 2. For Each Directory and File

- Name it precisely
- Describe its responsibilities in detail
- Mention the main public classes/widgets and what they do (without writing actual Dart code)

### 3. Define Cross-Cutting Concerns

#### Navigation
- How navigation is handled (e.g., declarative router, route names, deep links)
- Route guard patterns for auth-protected screens

#### State Management
- Pick one approach (Riverpod/Provider/BLoC) and stick to it
- Explain the pattern for all features

#### Network & Data Access
- How network requests and Supabase access are abstracted
- API client + repositories pattern

#### Error Handling
- How app-wide error handling is managed
- Loading state patterns

### 4. Include Design System Foundation

#### App Theme Structure
- Light/dark mode support
- Typography scale
- Color scheme

#### Global Design System
- Buttons, text styles, paddings, elevations
- Implemented as shared widgets + theme extensions

#### Localization
- Hook points for localization (even if starting with EN only)
- File structure for translations

## Expected Output

1. **Detailed directory tree** - Complete folder and file structure
2. **Per-file explanation** - Responsibilities, main classes/widgets, and inter-module relationships
3. **No actual Dart code** - Only structural and descriptive text

---

## Output Format Example

```
apps/frontend/lib/
├── main.dart
│   └── [Description of main.dart responsibilities]
├── app.dart
│   └── [Description of app.dart responsibilities]
├── core/
│   ├── config/
│   │   ├── app_config.dart
│   │   │   └── [Description]
│   │   └── environment.dart
│   │       └── [Description]
│   ├── routing/
│   │   ├── app_router.dart
│   │   │   └── [Description]
│   │   └── routes.dart
│   │       └── [Description]
│   ... etc
```

For each file, explain:
- **Responsibility**: What this file does
- **Main Classes/Widgets**: Public interfaces (by name and purpose)
- **Dependencies**: What it imports/uses from other modules
- **Used By**: What other modules depend on it
