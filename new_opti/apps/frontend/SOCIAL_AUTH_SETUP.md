# Social Authentication Setup (Supabase + Native SDKs)

This app uses **Supabase Authentication** with native Google/Apple SDKs for the best user experience.

## How It Works

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Native SDK     │ ──► │  Get ID Token    │ ──► │  Supabase   │
│  (Google/Apple) │     │  from Provider   │     │  Auth       │
└─────────────────┘     └──────────────────┘     └─────────────┘
```

1. User taps "Sign in with Google/Apple"
2. Native SDK handles authentication (one-tap, Face ID, etc.)
3. SDK returns an ID Token
4. App sends token to Supabase via `signInWithIdToken()`
5. Supabase validates token and creates/authenticates user

---

## Step 1: Configure `.env` File

Add these to `apps/frontend/.env`:

```env
# Google Sign-In (from Google Cloud Console)
GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
```

---

## Step 2: Google Sign-In Setup

### A. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Go to **APIs & Services → Credentials**

### B. Create 3 OAuth Client IDs

| Type | Purpose | Configuration |
|------|---------|---------------|
| **iOS** | Native iOS login | Bundle ID: `com.optivista.app` |
| **Android** | Native Android login | Package: `com.optivista.app` + SHA-1 |
| **Web** | Supabase backend | Redirect URI: `https://csdjqlvitlxztyelyakh.supabase.co/auth/v1/callback` |

### C. Get Android SHA-1

```bash
cd apps/frontend/android
./gradlew signingReport
```

### D. Configure Supabase

1. Go to **Supabase Dashboard → Authentication → Providers → Google**
2. Enable Google
3. Add your **Web Client ID** and **Client Secret**

### E. Update iOS Info.plist

Update `ios/Runner/Info.plist` with your iOS Client ID:

```xml
<key>CFBundleURLSchemes</key>
<array>
    <string>com.googleusercontent.apps.YOUR_IOS_CLIENT_ID</string>
</array>
```

---

## Step 3: Apple Sign-In Setup

### A. Supabase Configuration

1. Go to **Supabase Dashboard → Authentication → Providers → Apple**
2. Enable Apple
3. You'll need from Apple Developer:
   - **Service ID**
   - **Team ID**
   - **Key ID**
   - **Private Key** (.p8 file contents)

### B. Apple Developer Console

1. Go to [Apple Developer](https://developer.apple.com/)
2. **Identifiers → App IDs**: Enable "Sign In with Apple"
3. **Identifiers → Services IDs**: Create one with:
   - Domain: `csdjqlvitlxztyelyakh.supabase.co`
   - Return URL: `https://csdjqlvitlxztyelyakh.supabase.co/auth/v1/callback`
4. **Keys**: Create a key with "Sign In with Apple" enabled

### C. Xcode Configuration

1. Open `ios/Runner.xcworkspace`
2. Select Runner target → **Signing & Capabilities**
3. Click **+ Capability** → Add **Sign In with Apple**

---

## Step 4: Verify Setup

### Checklist

- [ ] `.env` has `GOOGLE_IOS_CLIENT_ID` and `GOOGLE_WEB_CLIENT_ID`
- [ ] Supabase Google provider enabled with Web Client credentials
- [ ] Supabase Apple provider enabled with Apple credentials
- [ ] iOS `Info.plist` has Google URL scheme
- [ ] Xcode has "Sign In with Apple" capability

### Test Commands

```bash
# Run on iOS simulator (Google works, Apple needs real device)
flutter run -d simulator

# Run on Android emulator (needs Google Play Services)
flutter run -d emulator
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Google "Error 10" | SHA-1 fingerprint mismatch - regenerate and update |
| Google redirect error | Check Supabase callback URL in Google Console |
| Apple not showing | Only works on iOS 13+ real devices |
| Token validation failed | Verify Client IDs match in .env and providers |

---

## Security

- ✅ All credentials are in `.env` (not hardcoded)
- ✅ `.env` is in `.gitignore`
- ✅ Supabase handles token validation server-side
- ✅ Native SDKs provide secure authentication flow
