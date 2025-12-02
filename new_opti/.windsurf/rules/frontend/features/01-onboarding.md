---
trigger: model_decision
---

# Onboarding Feature Prompt

> **Usage**: Copy and paste this complete prompt to generate the onboarding feature.
> 
> **Prerequisites**: Run `00-master-project.md` and `frontend/01-architecture.md` first.

---

You are a senior Flutter feature engineer.

## Feature Configuration

```
Feature name: onboarding
Target folder: apps/frontend/lib/features/onboarding/
```

## Goal

Design the full onboarding feature module that introduces the AR Eyewear app, explains value, and gently asks for permissions (camera, notifications later).

This feature is shown only on first launch (or until completed), and then the user goes to auth or home.

---

## Instructions

### 1. Screens and Navigation

Define all screens:

| Screen | Path | Purpose |
|--------|------|---------|
| `OnboardingScreen` | `presentation/onboarding_screen.dart` | Main paged onboarding with 3–4 slides |
| `PermissionsInfoScreen` | `presentation/permissions_info_screen.dart` | Explains why we need camera, gives CTA to proceed |

For each screen, describe:
- **Purpose**: What the screen accomplishes
- **Main sections**: Hero image, title, subtitle, bullet features, CTA button, skip button
- **Shared widgets used**: Primary button, page indicator, section headers

Navigation flow:
- From onboarding → auth (sign in/up)
- Skipping onboarding marks it complete
- "Get Started" at last slide leads to auth/home

---

### 2. Presentation Layer

Under `presentation/`:

#### `OnboardingScreen` Widget
- Shows a PageView or similar to scroll between pages
- Uses a shared page indicator widget
- Uses shared primary/secondary buttons for "Next", "Skip", "Get Started"
- Handles swipe gestures between pages

#### `presentation/widgets/onboarding_page.dart`
`OnboardingPage` widget that:
- Takes `title`, `description`, `illustrationAsset`, optional `highlightTag`
- Renders a single onboarding slide with consistent layout
- Supports dark mode styling

#### States Handled
- `currentPageIndex`: Which page is visible
- `isLastPage`: Whether to show "Get Started" vs "Next"
- `hasCompletedOnboarding`: Persisted flag for skip logic

---

### 3. State Management

Using the app's chosen state management (Riverpod/Provider/BLoC):

#### `OnboardingController` (`presentation/controllers/onboarding_controller.dart`)

**Responsibilities**:
- Track current page index
- Handle "Next", "Skip", "Get Started" actions
- Persist onboarding completion flag (secure local storage or shared prefs)

**State Fields** (conceptual):
| Field | Type | Purpose |
|-------|------|---------|
| `currentPageIndex` | int | Current visible page |
| `isLastPage` | bool | Computed: currentPageIndex == totalPages - 1 |
| `hasCompletedOnboarding` | bool | Loaded from storage on init |

**Actions**:
- `nextPage()`: Advance to next page or complete if last
- `skipOnboarding()`: Mark complete and navigate
- `completeOnboarding()`: Persist flag and navigate to auth

---

### 4. Data/Domain

#### `domain/onboarding_step.dart`

`OnboardingStep` entity:
| Field | Type | Purpose |
|-------|------|---------|
| `titleKey` | String | Localization key for title |
| `descriptionKey` | String | Localization key for description |
| `imageAsset` | String | Path to illustration asset |
| `isHighlight` | bool | Whether this is a key feature slide |
| `ctaLabelKey` | String? | Optional custom CTA label |

#### `data/onboarding_steps_repository.dart`

`OnboardingStepsRepository`:
- Returns a static list of `OnboardingStep` objects
- Encapsulates localization keys
- Could be extended to fetch from remote config

---

### 5. UX Details and Edge Cases

#### Behavior if Onboarding Already Completed
- On app launch, check `hasCompletedOnboarding` flag
- If true, auto-redirect to auth/home (skip onboarding screens entirely)

#### Empty/Error States
- Unlikely to have errors (static content)
- Fallback: If steps fail to load, show single welcome screen with "Get Started"

#### Design System Usage
- Use app theme colors for backgrounds and text
- Consistent spacing from design system
- Dark mode: Adjust illustration assets or use adaptive colors
- Page indicator uses theme accent color

#### Camera Permission Note
- Camera permission is **not requested here**, only explained
- Actual permission request happens in AR Try-On feature
- Show informational text like "We'll need camera access for virtual try-on"

---

## Expected Output

### Directory Tree

```
features/onboarding/
├── presentation/
│   ├── screens/
│   │   ├── onboarding_screen.dart
│   │   └── permissions_info_screen.dart
│   ├── widgets/
│   │   ├── onboarding_page.dart
│   │   └── page_indicator.dart (or use shared)
│   └── controllers/
│       └── onboarding_controller.dart
├── data/
│   └── onboarding_steps_repository.dart
└── domain/
    └── onboarding_step.dart
```

### Per-File Responsibilities

Provide detailed descriptions for each file including:
- Main classes/widgets
- Public methods/properties
- Dependencies on other modules
- How it integrates with shared widgets and theme

**No Dart code** - only detailed descriptions.
