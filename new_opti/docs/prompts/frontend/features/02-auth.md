# Auth Feature Prompt

> **Usage**: Copy and paste this complete prompt to generate the auth feature.
> 
> **Prerequisites**: Run `00-master-project.md` and `frontend/01-architecture.md` first.

---

You are a senior Flutter feature engineer.

## Feature Configuration

```
Feature name: auth
Target folder: apps/frontend/lib/features/auth/
```

## Goal

Design the full authentication module that connects to Supabase auth, supports email/password sign up/sign in, and optionally social providers later. Handles forgot password and basic auth state.

---

## Instructions

### 1. Screens

| Screen | Path | Purpose |
|--------|------|---------|
| `SignInScreen` | `presentation/screens/sign_in_screen.dart` | Email/password login |
| `SignUpScreen` | `presentation/screens/sign_up_screen.dart` | New account registration |
| `ForgotPasswordScreen` | `presentation/screens/forgot_password_screen.dart` | Password reset request |

For each screen, describe:

#### SignInScreen
- **UI Sections**: Logo/title, email field, password field, sign-in button, "Forgot password?" link, "Don't have an account? Sign up" link
- **Shared Widgets**: Primary button, text fields, error banners, loading overlay
- **Validation**: Email format, password required

#### SignUpScreen
- **UI Sections**: Logo/title, name field, email field, password field, confirm password field, sign-up button, "Already have an account? Sign in" link
- **Shared Widgets**: Same as sign-in plus password strength indicator
- **Validation**: All fields required, email format, password match, password strength

#### ForgotPasswordScreen
- **UI Sections**: Title, explanation text, email field, submit button, back to sign-in link
- **Shared Widgets**: Primary button, text field, success/error banners

---

### 2. Presentation Layer & State

#### Controllers/Providers

##### `SignInController` (`presentation/controllers/sign_in_controller.dart`)

**State Fields**:
| Field | Type | Purpose |
|-------|------|---------|
| `email` | String | User input |
| `password` | String | User input |
| `isLoading` | bool | Submission in progress |
| `errorMessage` | String? | Error to display |

**Actions**:
- `onEmailChanged(value)`: Update email
- `onPasswordChanged(value)`: Update password
- `submitSignIn()`: Validate and call auth repository

##### `SignUpController` (`presentation/controllers/sign_up_controller.dart`)

**State Fields**:
| Field | Type | Purpose |
|-------|------|---------|
| `name` | String | User's full name |
| `email` | String | User input |
| `password` | String | User input |
| `confirmPassword` | String | Password confirmation |
| `isLoading` | bool | Submission in progress |
| `errorMessage` | String? | Error to display |

**Actions**:
- `submitSignUp()`: Validate all fields and call auth repository
- Field change handlers for each input

##### `ForgotPasswordController` (`presentation/controllers/forgot_password_controller.dart`)

**State Fields**:
| Field | Type | Purpose |
|-------|------|---------|
| `email` | String | User input |
| `isLoading` | bool | Submission in progress |
| `successMessage` | String? | Success confirmation |
| `errorMessage` | String? | Error to display |

**Actions**:
- `submitForgotPassword()`: Request password reset

#### Screen State Rendering

Each screen subscribes to its controller and renders:
- **Idle**: Form with inputs enabled
- **Loading**: Form disabled, loading indicator
- **Error**: Error banner/message displayed
- **Success**: Navigation or success message

---

### 3. Data/Domain

#### `data/auth_repository.dart`

**Methods** (conceptual):
| Method | Input | Output | Purpose |
|--------|-------|--------|---------|
| `signInWithEmailPassword` | email, password | AuthResult | Authenticate user |
| `signUpWithEmailPassword` | name, email, password | AuthResult | Create new account |
| `sendPasswordReset` | email | AuthResult | Trigger reset email |
| `signOut` | - | void | Clear session |
| `getCurrentSession` | - | Session? | Check existing auth |
| `watchAuthStateChanges` | - | Stream<AuthState> | Observe auth changes |

Each method calls Supabase auth under the hood and returns a result model.

**Note**: No tokens are manually stored; rely on Supabase's Flutter client for session persistence.

#### `domain/auth_result.dart`

`AuthResult` entity:
| Field | Type | Purpose |
|-------|------|---------|
| `success` | bool | Whether operation succeeded |
| `user` | User? | User data on success |
| `errorCode` | String? | Error code for handling |
| `errorMessage` | String? | Human-readable error |

---

### 4. Navigation & Global Auth Flow

#### Post-Authentication
- After successful sign in/up → navigate to home
- If user is already authenticated at app launch → skip auth screens

#### `AuthGate` Widget (in `core/routing/`)
- Observes auth state from repository
- Routes user to:
  - Onboarding (if first launch)
  - Auth screens (if not authenticated)
  - Main app/home (if authenticated)

---

### 5. UX and Error Handling

#### Error Mapping
Map Supabase errors to friendly messages:
| Supabase Error | User Message |
|----------------|--------------|
| `invalid_credentials` | "Invalid email or password" |
| `user_already_exists` | "An account with this email already exists" |
| `weak_password` | "Password is too weak" |
| `network_error` | "Check your internet connection" |

#### Validation
- **Client-side**: Required fields, email format, password length (min 8), passwords match
- **Server-side**: Wrong credentials, user exists, rate limiting

#### Accessibility
- Focus management between fields
- "Submit on done" keyboard action
- Screen reader labels for all inputs
- Error announcements

---

## Expected Output

### Directory Tree

```
features/auth/
├── presentation/
│   ├── screens/
│   │   ├── sign_in_screen.dart
│   │   ├── sign_up_screen.dart
│   │   └── forgot_password_screen.dart
│   ├── widgets/
│   │   ├── auth_header.dart
│   │   ├── password_field.dart
│   │   └── social_auth_buttons.dart (future)
│   └── controllers/
│       ├── sign_in_controller.dart
│       ├── sign_up_controller.dart
│       └── forgot_password_controller.dart
├── data/
│   └── auth_repository.dart
└── domain/
    ├── auth_result.dart
    └── auth_state.dart
```

### Per-File Responsibilities

Provide detailed descriptions for each file including:
- Main classes/widgets
- Public methods/properties
- How screens connect to controllers
- How repository interfaces with Supabase

**No Dart code** - only detailed descriptions.
