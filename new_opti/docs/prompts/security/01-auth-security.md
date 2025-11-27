# Auth & Security Prompt

> **Usage**: Use this prompt to design authentication, authorization, and security measures.
> 
> **Prerequisites**: Run `00-master-project.md` first.

---

You are responsible for auth & security.

## Goal

Design auth, session handling, and security for the AR Eyewear app using Supabase + FastAPI.

---

## Task 1: Authentication Flow

### Signup Flow

1. **User enters**: email, password, full name
2. **Flutter app**: Calls Supabase Auth `signUp()`
3. **Supabase**: Creates user in `auth.users`, sends confirmation email
4. **Trigger**: Database trigger creates row in `profiles` table
5. **User**: Clicks email link to confirm
6. **App**: Detects confirmed session, navigates to home

### Signin Flow

1. **User enters**: email, password
2. **Flutter app**: Calls Supabase Auth `signInWithPassword()`
3. **Supabase**: Validates credentials, returns session (access_token + refresh_token)
4. **App**: Stores tokens securely (Flutter Secure Storage)
5. **App**: Navigates to home, includes token in API requests

### Social Auth (Optional)

1. **User taps**: "Sign in with Google/Apple"
2. **Flutter app**: Initiates OAuth flow via Supabase
3. **Supabase**: Handles OAuth, creates/links user
4. **App**: Receives session tokens

### Token Storage (Flutter)

| Platform | Storage Method |
|----------|----------------|
| iOS | Keychain via flutter_secure_storage |
| Android | EncryptedSharedPreferences via flutter_secure_storage |

**Never store tokens in**:
- SharedPreferences (unencrypted)
- Local files
- Logs or analytics

---

## Task 2: Session Management

### Token Structure (Supabase JWT)

```
{
  "aud": "authenticated",
  "exp": 1234567890,
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "authenticated",
  "app_metadata": {
    "role": "shopper"  // or "admin"
  }
}
```

### Token Refresh Strategy

1. **Access token**: Valid for 1 hour (Supabase default)
2. **Refresh token**: Valid for longer (configurable)
3. **Auto-refresh**: Supabase client handles automatically
4. **On 401**: Attempt refresh, if fails → force re-login

### Session Persistence

- **App launch**: Check for existing session
- **Valid session**: Auto-login, navigate to home
- **Expired session**: Attempt refresh
- **No session**: Show auth screen

---

## Task 3: Backend Token Validation

### FastAPI JWT Verification

**Location**: `apps/backend/app/core/security.py`

**Process**:
1. Extract token from `Authorization: Bearer <token>` header
2. Decode JWT using Supabase JWT secret
3. Verify signature, expiration, audience
4. Extract user ID and role from payload
5. Return user context or raise 401

### Dependency: `get_current_user`

```
Input: Request with Authorization header
Output: User dict with { id, email, role }
Raises: 401 if invalid/missing token
```

### Dependency: `get_optional_user`

```
Input: Request with optional Authorization header
Output: User dict or None
Usage: Public endpoints that behave differently for logged-in users
```

### Dependency: `require_admin`

```
Input: Current user from get_current_user
Output: User if role == "admin"
Raises: 403 if not admin
```

---

## Task 4: Roles & Permissions

### Role Definitions

| Role | Description | Capabilities |
|------|-------------|--------------|
| `shopper` | Regular customer | Browse, buy, review, manage own data |
| `admin` | Back-office user | All shopper + manage catalog, orders, users |

### Permission Matrix

| Resource | Shopper | Admin |
|----------|---------|-------|
| Products (read) | ✓ | ✓ |
| Products (write) | ✗ | ✓ |
| Own cart | ✓ | ✓ |
| Own orders | ✓ | ✓ |
| All orders | ✗ | ✓ |
| Own profile | ✓ | ✓ |
| All profiles | ✗ | ✓ |
| Own reviews | ✓ | ✓ |
| Moderate reviews | ✗ | ✓ |
| AR assets (read) | ✓ | ✓ |
| AR assets (write) | ✗ | ✓ |

### Role Assignment

- Default role on signup: `shopper`
- Admin role: Set manually in database or via admin panel
- Role stored in: `profiles.role` and `app_metadata.role`

---

## Task 5: Row Level Security (RLS)

### RLS Policy Patterns

#### User-owned data (profiles, addresses, carts)
```
Policy: Users can only access their own rows
Check: auth.uid() = user_id
```

#### Public read, admin write (products, categories)
```
Policy (read): Anyone can read active items
Check: is_active = true OR auth.jwt() ->> 'role' = 'admin'

Policy (write): Only admins
Check: auth.jwt() ->> 'role' = 'admin'
```

#### Moderated content (reviews)
```
Policy (read): See approved OR own reviews
Check: is_approved = true OR auth.uid() = user_id

Policy (write): Own reviews only
Check: auth.uid() = user_id
```

### RLS + Backend Double-Check

- RLS provides database-level security
- Backend also validates for defense in depth
- Neither alone is sufficient

---

## Task 6: Security Best Practices

### Secrets Management

| Secret | Storage Location | Access |
|--------|------------------|--------|
| Supabase URL | Environment variable | Backend + Frontend |
| Supabase Anon Key | Environment variable | Frontend only |
| Supabase Service Key | Environment variable | Backend only (NEVER in frontend) |
| JWT Secret | Environment variable | Backend only |
| Payment API keys | Environment variable | Backend only |

### HTTPS Everywhere

- All API calls over HTTPS
- Supabase enforces HTTPS
- Backend deployed behind HTTPS load balancer
- No HTTP fallback

### Input Validation

- Validate all inputs on backend (Pydantic)
- Sanitize user-generated content
- Parameterized queries (Supabase handles this)
- Rate limiting on auth endpoints

### Logging Security

**Never log**:
- Passwords or tokens
- Full credit card numbers
- Personal identification numbers

**Do log**:
- User ID (not email) for audit
- Action type and timestamp
- Error codes (not full stack traces in production)

---

## Task 7: Password & Account Security

### Password Requirements

- Minimum 8 characters
- Supabase handles hashing (bcrypt)
- No password stored in our tables

### Account Recovery

1. User requests password reset
2. Supabase sends reset email
3. User clicks link, enters new password
4. Supabase updates credential
5. All existing sessions invalidated

### Account Deletion

1. User requests deletion in app
2. Backend soft-deletes profile (set `deleted_at`)
3. After 30 days, hard delete via scheduled job
4. User data anonymized, orders preserved for records

---

## Expected Output

1. **Complete auth flow** - signup, signin, token management
2. **Backend validation approach** - dependencies and checks
3. **Role and permission model** - who can do what
4. **RLS policies** - database-level security
5. **Security checklist** - secrets, HTTPS, logging
6. **No code** - only detailed descriptions
