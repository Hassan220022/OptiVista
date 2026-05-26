# UI Architecture

## Mobile App: `apps/mobile`

Expo Router owns the mobile route tree.

```txt
src/app/
├── _layout.tsx              # root app shell/providers
├── index.tsx                # entry redirect
├── (auth)/                  # auth stack
├── (tabs)/                  # main tab navigation
├── product/[id].tsx         # product detail
├── ar-try-on/[id].tsx       # AR try-on flow
├── checkout/                # shipping, payment, review, confirmation
└── profile/                 # edit profile, orders, addresses, settings, feedback
```

### Shared Mobile Layers

- `src/components/ui/` — buttons, cards, states, rating stars, loaders.
- `src/components/features/` — feature-specific reusable sections.
- `src/lib/api.ts` — API helper functions/constants.
- `src/lib/supabase.ts` — Supabase client initialization.
- `src/stores/auth-store.ts` — auth/session state.
- `src/stores/cart-store.ts` — cart state.
- `src/stores/settings-store.ts` — local settings state.
- `src/theme/` — color, spacing, and theme provider.

## Admin Dashboard: `apps/admin`

React Router pages live in `src/pages/`.

- `Dashboard.tsx` — platform overview.
- `Products.tsx` — product management.
- `Orders.tsx` — order management.
- `Reviews.tsx` — review moderation.
- `Feedback.tsx` — user feedback.
- `Users.tsx` — user management.
- `Sellers.tsx` — seller management.
- `Settings.tsx` — admin settings.
- `Login.tsx` — admin login.

## Seller Dashboard: `apps/seller`

React Router pages live in `src/pages/`.

- `Dashboard.tsx` — seller overview.
- `Products.tsx` — seller product management.
- `Orders.tsx` — seller order tracking.
- `Reviews.tsx` — review visibility.
- `Analytics.tsx` — seller analytics.
- `Payouts.tsx` — payout status.
- `Settings.tsx` — seller settings.
- `Login.tsx` — seller login.

## Backend Integration

Clients use Supabase directly for auth/session-aware reads where safe, and FastAPI for API orchestration, validation, privileged operations, payment flows, and signed storage URLs.

## Removed UI Stack

Flutter UI code is no longer part of the active source tree. The customer app is Expo.
