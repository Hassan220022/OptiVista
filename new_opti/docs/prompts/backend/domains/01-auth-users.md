# Auth & Users Domain Prompt

> **Usage**: Copy and paste this complete prompt to generate the auth and users backend domain.
> 
> **Prerequisites**: Run `00-master-project.md` and `backend/01-architecture.md` first.

---

You are a FastAPI domain engineer.

## Domain Configuration

```
Domain: auth & users
Base routes: /api/v1/auth, /api/v1/users
Router files: 
  - apps/backend/app/api/v1/auth.py
  - apps/backend/app/api/v1/users.py
Service file: apps/backend/app/services/user_service.py
Schema file: apps/backend/app/schemas/users.py
```

## Goal

Design all REST endpoints, schemas, and services for integrating with Supabase auth and managing user profiles.

---

## Task 1: Use Cases

### Auth Use Cases
| # | Use Case | Actor | Description |
|---|----------|-------|-------------|
| 1 | Verify Token | System | Validate Supabase JWT on each request |
| 2 | Get Current User | Shopper | Return profile from JWT |
| 3 | Session Exchange | System | Optional: Exchange Supabase token for backend session |

### User Use Cases
| # | Use Case | Actor | Description |
|---|----------|-------|-------------|
| 1 | Get Profile | Shopper | Retrieve own profile details |
| 2 | Update Profile | Shopper | Modify name, phone, preferences |
| 3 | List Addresses | Shopper | Get all saved addresses |
| 4 | Add Address | Shopper | Create new address |
| 5 | Update Address | Shopper | Modify existing address |
| 6 | Delete Address | Shopper | Remove an address |
| 7 | Set Default Address | Shopper | Mark address as default |

---

## Task 2: Endpoints

### Auth Endpoints

#### `GET /api/v1/auth/me`

**Purpose**: Get current user info from Supabase JWT

**Authentication**: Required (Supabase JWT)

**Response** (200):
```
{
  id: string — User UUID from Supabase
  email: string — User's email
  role: string — "shopper" or "admin"
  email_verified: boolean — Email confirmation status
}
```

**Errors**:
| Status | Code | When |
|--------|------|------|
| 401 | `INVALID_TOKEN` | Missing or invalid JWT |
| 401 | `TOKEN_EXPIRED` | JWT has expired |

---

### User Profile Endpoints

#### `GET /api/v1/users/me`

**Purpose**: Get full user profile

**Authentication**: Required

**Response** (200):
```
{
  id: string
  email: string
  full_name: string
  phone: string | null
  avatar_url: string | null
  role: string
  created_at: datetime
  updated_at: datetime
  preferences: {
    theme: string
    notifications_enabled: boolean
  }
}
```

#### `PATCH /api/v1/users/me`

**Purpose**: Update user profile

**Authentication**: Required

**Request Body**:
```
{
  full_name: string | null — Optional update
  phone: string | null — Optional update
  preferences: object | null — Optional preferences update
}
```

**Response** (200): Updated `UserProfile`

**Errors**:
| Status | Code | When |
|--------|------|------|
| 400 | `INVALID_PHONE` | Phone format invalid |
| 422 | `VALIDATION_ERROR` | Field validation failed |

---

### Address Endpoints

#### `GET /api/v1/users/me/addresses`

**Purpose**: List all user addresses

**Authentication**: Required

**Response** (200):
```
{
  items: [
    {
      id: string
      label: string
      full_name: string
      phone: string
      street_address: string
      street_address_2: string | null
      city: string
      state: string
      postal_code: string
      country: string
      is_default: boolean
      created_at: datetime
    }
  ]
}
```

#### `POST /api/v1/users/me/addresses`

**Purpose**: Create new address

**Authentication**: Required

**Request Body**:
```
{
  label: string — "Home", "Work", etc.
  full_name: string
  phone: string
  street_address: string
  street_address_2: string | null
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}
```

**Response** (201): Created `Address`

**Behavior**: If `is_default: true`, unset other defaults

#### `PUT /api/v1/users/me/addresses/{address_id}`

**Purpose**: Update existing address

**Authentication**: Required

**Path Parameters**: `address_id` (string)

**Request Body**: Same as POST (all fields)

**Response** (200): Updated `Address`

**Errors**:
| Status | Code | When |
|--------|------|------|
| 404 | `ADDRESS_NOT_FOUND` | Address doesn't exist or not owned |

#### `DELETE /api/v1/users/me/addresses/{address_id}`

**Purpose**: Delete address

**Authentication**: Required

**Response** (204): No content

**Errors**:
| Status | Code | When |
|--------|------|------|
| 404 | `ADDRESS_NOT_FOUND` | Address doesn't exist |
| 400 | `CANNOT_DELETE_DEFAULT` | Can't delete only/default address (optional rule) |

---

## Task 3: Schemas

### Request Schemas

| Schema | Fields | Purpose |
|--------|--------|---------|
| `ProfileUpdateRequest` | full_name?, phone?, preferences? | Update profile |
| `AddressCreateRequest` | All address fields | Create address |
| `AddressUpdateRequest` | All address fields | Update address |

### Response Schemas

| Schema | Fields | Purpose |
|--------|--------|---------|
| `AuthUserResponse` | id, email, role, email_verified | Token user info |
| `UserProfileResponse` | Full profile with preferences | User profile |
| `AddressResponse` | All address fields + id, timestamps | Address data |
| `AddressListResponse` | items: List[Address] | Address list |

---

## Task 4: Service Layer

### `AuthService` (`app/services/auth_service.py`)

**Purpose**: Handle JWT validation and user extraction

**Methods**:

#### `verify_token(token: str) -> TokenPayload`
- Decode Supabase JWT using JWT secret
- Validate signature, expiration, audience
- Return payload with user ID and claims
- Raise `InvalidTokenError` on failure

#### `get_user_from_token(token: str) -> AuthUser`
- Call `verify_token`
- Extract user ID, email, role
- Return `AuthUser` object

---

### `UserService` (`app/services/user_service.py`)

**Purpose**: Manage user profiles and addresses

**Dependencies**: Supabase client

**Methods**:

#### `get_profile(user_id: str) -> UserProfile`
- Query `profiles` table by user ID
- Return profile or raise `UserNotFoundError`

#### `update_profile(user_id: str, data: ProfileUpdate) -> UserProfile`
- Update allowed fields in `profiles` table
- Return updated profile

#### `get_addresses(user_id: str) -> List[Address]`
- Query `addresses` table filtered by user ID
- Return list sorted by `is_default` then `created_at`

#### `create_address(user_id: str, data: AddressCreate) -> Address`
- Insert into `addresses` table
- If `is_default`, update other addresses to `is_default=false`
- Return created address

#### `update_address(user_id: str, address_id: str, data: AddressUpdate) -> Address`
- Verify address belongs to user
- Update address fields
- Handle `is_default` logic
- Return updated address

#### `delete_address(user_id: str, address_id: str) -> None`
- Verify address belongs to user
- Delete from `addresses` table

---

## Task 5: Security

### Authentication
- All `/users` endpoints require valid Supabase JWT
- JWT verified on each request via `get_current_user` dependency
- Token extracted from `Authorization: Bearer <token>` header

### Authorization
- Users can only access/modify their own profile and addresses
- RLS provides additional database-level protection
- No admin endpoints in this domain (admin uses direct Supabase access)

### Data Validation
- Phone numbers validated for format
- Email is read-only (managed by Supabase auth)
- Address fields validated for length and format

---

## Task 6: Supabase Integration

### Tables Used
- `profiles` (extends auth.users)
- `addresses`

### Queries (Conceptual)

| Operation | Table | Filters |
|-----------|-------|---------|
| Get profile | profiles | id = user_id |
| Update profile | profiles | id = user_id |
| List addresses | addresses | user_id = user_id |
| Create address | addresses | (insert) |
| Update address | addresses | id = address_id, user_id = user_id |
| Delete address | addresses | id = address_id, user_id = user_id |

### Profile Sync
- Profile created automatically via Supabase trigger on auth.users insert
- Email synced from auth.users

---

## Expected Output

1. **Complete endpoint list** with request/response specifications
2. **Schema definitions** in natural language
3. **Service method descriptions** with error cases
4. **Security and authorization** rules
5. **No Python code** - only descriptions
