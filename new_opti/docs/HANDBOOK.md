# OptiVista Project Handbook

This handbook maps the current active repository structure.

## Top Level

- `README.md` — current project overview and setup commands.
- `docs/` — project background artifacts.
- `new_opti/` — active monorepo and source of truth.

## `new_opti/apps/backend`

FastAPI backend.

- `app/main.py` — FastAPI application assembly.
- `app/api/` — routers and dependencies.
- `app/core/` — configuration, logging, security helpers, Supabase client.
- `app/models/` — Pydantic request/response models.
- `app/services/` — business logic and Supabase data access.
- `app/security/` — Supabase JWT validation and auth helpers.
- `app/integrations/` — external provider adapters.
- `app/middleware/` — request middleware.
- `app/tests/` — backend tests.
- `requirements.txt` — Python dependencies.

## `new_opti/apps/mobile`

Expo Router customer mobile app.

- `src/app/` — route tree.
- `src/app/(auth)/` — sign in, sign up, forgot password.
- `src/app/(tabs)/` — main tab shell: home, catalog, cart, profile.
- `src/app/product/` — product detail routes.
- `src/app/ar-try-on/` — AR try-on routes.
- `src/app/checkout/` — checkout flow.
- `src/app/profile/` — profile, orders, addresses, settings, feedback.
- `src/components/` — reusable UI and feature components.
- `src/lib/` — API constants and Supabase client setup.
- `src/stores/` — Zustand stores for auth, cart, settings.
- `src/theme/` — theme tokens and provider.
- `src/types/` — shared TypeScript types.

## `new_opti/apps/admin`

React/Vite admin dashboard.

- `src/pages/` — dashboard pages for products, orders, reviews, feedback, users, sellers, settings.
- `src/components/` — reusable dashboard components.
- `src/contexts/` — auth and app contexts.
- `src/hooks/` — React hooks.
- `src/lib/` — Supabase/API helpers.
- `src/types/` — shared TypeScript types.

## `new_opti/apps/seller`

React/Vite seller dashboard.

- `src/pages/` — seller dashboard, products, orders, reviews, analytics, payouts, settings.
- `src/components/` — reusable dashboard components.
- `src/contexts/` — seller auth context.
- `src/hooks/` — React hooks.
- `src/lib/` — Supabase/API helpers.
- `src/types/` — shared TypeScript types.

## `new_opti/supabase`

- `migrations/0001_init.sql` — consolidated schema, RLS, functions, buckets.
- `migrations/0002_seed_data.sql` — seed categories, products, AR assets.
- RLS policies live in `migrations/0001_init.sql` so fresh environments have one clear source of truth.
- `storage/buckets.md` — bucket names and intended access patterns.
- `config/` — Supabase config templates.

## Hygiene Rules

- Keep active source under `new_opti/`.
- Do not reintroduce root legacy apps.
- Do not commit generated folders: `node_modules/`, `dist/`, `.expo/`, `__pycache__/`.
- Do not commit `.env` files or MCP token configs.
- Use `.env.example` for placeholders.
