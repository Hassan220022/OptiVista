# Settings Feature Prompt

> **Usage**: Copy and paste this complete prompt to generate the settings feature.
> 
> **Prerequisites**: Run `00-master-project.md` and `frontend/01-architecture.md` first.

---

You are a senior Flutter feature engineer.

## Feature Configuration

```
Feature name: settings
Target folder: apps/frontend/lib/features/settings/
```

## Goal

Design settings screens: preferences (language/theme), legal pages (Terms, Privacy), app info, and logout.

---

## Instructions

### 1. Screens

| Screen | Path | Purpose |
|--------|------|---------|
| `SettingsScreen` | `presentation/screens/settings_screen.dart` | Main settings hub |
| `LegalTextScreen` | `presentation/screens/legal_text_screen.dart` | Display legal documents |
| `AppInfoScreen` | `presentation/screens/app_info_screen.dart` | Version and credits |

---

### 2. Screen Details

#### `SettingsScreen`

**Layout** (grouped sections):

**Account Section**:
| Item | Description |
|------|-------------|
| Profile | Navigate to edit profile |
| Change Password | Navigate to Supabase password reset or in-app flow |

**Preferences Section**:
| Item | Description |
|------|-------------|
| Theme | Light / Dark / System dropdown or segmented control |
| Language | Language selector (start with English only) |
| Notifications | Toggle for push notifications (future) |

**Legal Section**:
| Item | Description |
|------|-------------|
| Terms of Service | Navigate to legal text screen |
| Privacy Policy | Navigate to legal text screen |
| Return Policy | Navigate to legal text screen |

**About Section**:
| Item | Description |
|------|-------------|
| App Info | Version, build number, credits |
| Rate the App | Open app store rating |

**Actions Section**:
| Item | Description |
|------|-------------|
| Log Out | Sign out with confirmation |

#### `LegalTextScreen`

**Receives**: Document type (terms, privacy, returns)

**Layout**:
| Section | Description |
|---------|-------------|
| App Bar | Document title |
| Content | Scrollable markdown/text content |
| Last Updated | Date at bottom |

**Behavior**:
- Load content from backend or bundled asset
- Support markdown rendering
- Handle loading/error states
- Cache for offline access

#### `AppInfoScreen`

**Layout**:
| Item | Description |
|------|-------------|
| App Icon | App logo |
| App Name | "OptiVista" |
| Version | "Version 1.0.0 (build 123)" |
| Credits | "Made with ❤️ by [Team]" |
| Licenses | Open source licenses link |

---

### 3. State Management

#### `SettingsController` (`presentation/controllers/settings_controller.dart`)

**State Fields**:
| Field | Type | Purpose |
|-------|------|---------|
| `themeMode` | ThemeMode | Current theme setting |
| `language` | String | Current language code |
| `notificationsEnabled` | bool | Push notification preference |
| `isLoading` | bool | Loading state |
| `appVersion` | String | App version string |
| `buildNumber` | String | Build number |

**Actions**:
| Action | Purpose |
|--------|---------|
| `loadSettings()` | Load saved preferences |
| `setThemeMode(mode)` | Change and persist theme |
| `setLanguage(code)` | Change and persist language |
| `toggleNotifications(enabled)` | Update notification pref |
| `logout()` | Sign out user |

#### Theme Integration
- Theme changes apply immediately
- Persisted to local storage
- Synced with system theme if "System" selected
- Notify app-level theme provider

---

### 4. Data/Domain

#### `data/repositories/settings_repository.dart`

**Methods**:
| Method | Input | Output | Purpose |
|--------|-------|--------|---------|
| `getThemeMode` | - | ThemeMode | Get saved theme |
| `setThemeMode` | ThemeMode | void | Save theme |
| `getLanguage` | - | String | Get saved language |
| `setLanguage` | String | void | Save language |
| `getNotificationsEnabled` | - | bool | Get notification pref |
| `setNotificationsEnabled` | bool | void | Save notification pref |

**Storage**: Local storage (SharedPreferences or secure storage)

#### `data/repositories/legal_repository.dart`

**Methods**:
| Method | Input | Output | Purpose |
|--------|-------|--------|---------|
| `getTermsOfService` | - | LegalDocument | Fetch ToS |
| `getPrivacyPolicy` | - | LegalDocument | Fetch privacy |
| `getReturnPolicy` | - | LegalDocument | Fetch returns |

`LegalDocument`:
| Field | Type |
|-------|------|
| `title` | String |
| `content` | String (markdown) |
| `lastUpdated` | DateTime |

**Sources**: Backend API or bundled assets with version check

---

### 5. Navigation

| User Action | Destination |
|-------------|-------------|
| Tap Profile | Edit Profile screen (profile feature) |
| Tap Change Password | Supabase password reset flow |
| Tap Theme | Theme selection modal/dialog |
| Tap Language | Language selection modal |
| Tap Terms/Privacy/Returns | Legal Text screen |
| Tap App Info | App Info screen |
| Tap Rate the App | App store rating prompt |
| Tap Log Out | Confirmation → Auth gate |

---

### 6. UX Details

#### Theme Selection
- Segmented control: Light | Dark | System
- Preview color changes immediately
- Persist on selection

#### Language Selection
- Currently only English
- Show "Coming soon" badge on other languages
- Designed to support future localization

#### Notifications Toggle
- Platform permission handling
- If denied, show "Enable in Settings" with link
- Explain what notifications are used for

#### Logout Confirmation
```
Are you sure you want to log out?
[Cancel] [Log Out]
```

#### Legal Document Loading
- Show loading skeleton
- Cache for offline access
- Show error with retry if fetch fails
- Pull-to-refresh to check for updates

#### Rate the App
- Use in_app_review package
- Only prompt if user has used app for X days
- Don't prompt again if declined

---

## Expected Output

### Directory Tree

```
features/settings/
├── presentation/
│   ├── screens/
│   │   ├── settings_screen.dart
│   │   ├── legal_text_screen.dart
│   │   └── app_info_screen.dart
│   ├── widgets/
│   │   ├── settings_section.dart
│   │   ├── settings_tile.dart
│   │   ├── theme_selector.dart
│   │   ├── language_selector.dart
│   │   └── notification_toggle.dart
│   └── controllers/
│       ├── settings_controller.dart
│       └── legal_document_controller.dart
├── data/
│   ├── models/
│   │   └── legal_document_model.dart
│   └── repositories/
│       ├── settings_repository.dart
│       └── legal_repository.dart
└── domain/
    └── entities/
        └── legal_document.dart
```

### Per-File Responsibilities

Provide detailed descriptions including:
- Theme persistence and propagation
- Legal document caching
- Logout flow coordination
- Platform-specific settings (notifications)

**No Dart code** - only detailed descriptions.
