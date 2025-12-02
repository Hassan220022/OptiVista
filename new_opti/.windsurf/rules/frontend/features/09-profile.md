---
trigger: model_decision
---

# Profile Feature Prompt

> **Usage**: Copy and paste this complete prompt to generate the profile feature.
> 
> **Prerequisites**: Run `00-master-project.md` and `frontend/01-architecture.md` first.

---

You are a senior Flutter feature engineer.

## Feature Configuration

```
Feature name: profile
Target folder: apps/frontend/lib/features/profile/
```

## Goal

Design profile management: viewing and editing user details, addresses, and quick access to orders/settings.

---

## Instructions

### 1. Screens

| Screen | Path | Purpose |
|--------|------|---------|
| `ProfileScreen` | `presentation/screens/profile_screen.dart` | Main profile hub |
| `EditProfileScreen` | `presentation/screens/edit_profile_screen.dart` | Edit user details |
| `AddressesScreen` | `presentation/screens/addresses_screen.dart` | Manage addresses |
| `AddEditAddressScreen` | `presentation/screens/add_edit_address_screen.dart` | Address form |

---

### 2. Screen Details

#### `ProfileScreen`

**Layout**:
| Section | Description |
|---------|-------------|
| Profile Header | Avatar, name, email, edit button |
| Quick Stats | Total orders, member since (optional) |
| Menu Items | Navigable list of options |

**Menu Items**:
| Item | Icon | Destination |
|------|------|-------------|
| My Orders | 📦 | Order History screen |
| Addresses | 📍 | Addresses screen |
| Payment Methods | 💳 | Future feature |
| Settings | ⚙️ | Settings screen |
| Help & Support | ❓ | Feedback/Support screen |
| Log Out | 🚪 | Logout action |

#### `EditProfileScreen`

**Form Fields**:
| Field | Type | Validation |
|-------|------|------------|
| Avatar | Image picker | Optional |
| Full Name | Text | Required |
| Phone | Phone input | Optional, format validation |
| Email | Text | Display only (managed by auth) |

**Actions**:
- Save button (enabled when form is dirty and valid)
- Cancel/back navigation
- Delete account option (with confirmation)

#### `AddressesScreen`

**Layout**:
| Section | Description |
|---------|-------------|
| Address List | Cards for each saved address |
| Add Button | FAB or header button to add new |
| Empty State | "No addresses saved" with add CTA |

**Address Card**:
- Full formatted address
- Default badge
- Edit button
- Delete button
- Set as default action

#### `AddEditAddressScreen`

**Form Fields**:
| Field | Type | Required |
|-------|------|----------|
| Label | Text (Home, Work, Other) | No |
| Full Name | Text | Yes |
| Phone | Phone | Yes |
| Street Address | Text | Yes |
| Street Address 2 | Text | No |
| City | Text | Yes |
| State/Province | Text/Dropdown | Yes |
| Postal Code | Text | Yes |
| Country | Dropdown | Yes |
| Set as Default | Toggle | No |

---

### 3. State Management

#### `ProfileController` (`presentation/controllers/profile_controller.dart`)

**State Fields**:
| Field | Type | Purpose |
|-------|------|---------|
| `isLoading` | bool | Loading profile data |
| `isSaving` | bool | Save in progress |
| `userProfile` | UserProfile? | Current user data |
| `errorMessage` | String? | Error to display |

**Actions**:
| Action | Purpose |
|--------|---------|
| `loadProfile()` | Fetch current user profile |
| `updateProfile(data)` | Save profile changes |
| `uploadAvatar(file)` | Upload new profile picture |
| `logout()` | Sign out user |

#### `AddressesController` (`presentation/controllers/addresses_controller.dart`)

**State Fields**:
| Field | Type | Purpose |
|-------|------|---------|
| `isLoading` | bool | Loading addresses |
| `addresses` | List<Address> | User's addresses |
| `errorMessage` | String? | Error to display |

**Actions**:
| Action | Purpose |
|--------|---------|
| `loadAddresses()` | Fetch all addresses |
| `addAddress(data)` | Create new address |
| `updateAddress(id, data)` | Edit existing address |
| `deleteAddress(id)` | Remove address |
| `setDefaultAddress(id)` | Mark as default |

---

### 4. Data/Domain

#### `data/models/user_profile_model.dart`

`UserProfile`:
| Field | Type | Purpose |
|-------|------|---------|
| `id` | String | User ID |
| `email` | String | Email (read-only) |
| `fullName` | String | Display name |
| `phone` | String? | Contact number |
| `avatarUrl` | String? | Profile picture URL |
| `createdAt` | DateTime | Member since |
| `preferences` | UserPreferences? | App preferences |

#### `data/repositories/profile_repository.dart`

**Methods**:
| Method | Input | Output | Purpose |
|--------|-------|--------|---------|
| `getCurrentProfile` | - | UserProfile | Get profile |
| `updateProfile` | ProfileUpdate | UserProfile | Save changes |
| `uploadAvatar` | File | String (url) | Upload image |
| `deleteAccount` | - | void | Delete user account |

#### `data/repositories/address_repository.dart`

**Methods**:
| Method | Input | Output | Purpose |
|--------|-------|--------|---------|
| `getAddresses` | - | List<Address> | All addresses |
| `addAddress` | AddressData | Address | Create |
| `updateAddress` | id, AddressData | Address | Update |
| `deleteAddress` | id | void | Delete |
| `setDefault` | id | void | Set as default |

---

### 5. Navigation

| User Action | Destination |
|-------------|-------------|
| Tap "Edit" on profile | Edit Profile screen |
| Tap "My Orders" | Order History (orders feature) |
| Tap "Addresses" | Addresses screen |
| Tap "Settings" | Settings (settings feature) |
| Tap "Help & Support" | Feedback screen |
| Tap "Log Out" | Confirmation → Auth gate |
| Tap address "Edit" | Add/Edit Address screen |
| Tap "Add Address" | Add/Edit Address screen (create mode) |

---

### 6. UX Details

#### Profile Editing
- Show loading overlay during save
- Success: Snackbar "Profile updated"
- Error: Error banner with retry

#### Avatar Upload
- Image picker (camera or gallery)
- Crop/resize before upload
- Show upload progress
- Optimistic update with local image

#### Address Management
- Confirm before delete
- Can't delete last address if orders exist (optional rule)
- Show which address is default

#### Logout Flow
1. Tap logout
2. Confirmation dialog: "Are you sure?"
3. If confirmed: Clear session, navigate to auth
4. Show loading during signout

#### Delete Account
- Require confirmation with typed "DELETE"
- Explain data deletion policy
- Final confirmation dialog
- Navigate to auth after completion

---

## Expected Output

### Directory Tree

```
features/profile/
├── presentation/
│   ├── screens/
│   │   ├── profile_screen.dart
│   │   ├── edit_profile_screen.dart
│   │   ├── addresses_screen.dart
│   │   └── add_edit_address_screen.dart
│   ├── widgets/
│   │   ├── profile_header.dart
│   │   ├── profile_menu_item.dart
│   │   ├── avatar_picker.dart
│   │   ├── address_card.dart
│   │   └── address_form.dart
│   └── controllers/
│       ├── profile_controller.dart
│       ├── edit_profile_controller.dart
│       └── addresses_controller.dart
├── data/
│   ├── models/
│   │   ├── user_profile_model.dart
│   │   └── address_model.dart
│   └── repositories/
│       ├── profile_repository.dart
│       └── address_repository.dart
└── domain/
    └── entities/
        ├── user_profile.dart
        └── address.dart
```

### Per-File Responsibilities

Provide detailed descriptions including:
- Profile data flow
- Avatar upload handling
- Address CRUD operations
- Logout coordination with auth

**No Dart code** - only detailed descriptions.
