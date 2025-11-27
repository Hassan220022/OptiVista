# AR Eyewear App - Project Handbook

This handbook serves as a file-by-file guide for the repository, detailing the conceptual responsibility, flow, and configuration of each file.

## 0. Top-Level Repo

### `README.md`
* High-level description of the AR Eyewear App.
* Tech stack (Flutter, FastAPI, Supabase).
* How the monorepo is organized.
* Basic “getting started” steps:
  * How to set up Supabase project.
  * How to run backend locally.
  * How to run frontend.
* Links to other docs (architecture, API, data model).

### `LICENSE`
* License text (MIT).

### `/docs` folder
* **`architecture.md`**: Diagram + description of Flutter ↔ FastAPI ↔ Supabase, Auth source of truth, Storage buckets, and AR asset flow.
* **`api-contract.md`**: Human-readable list of endpoints (Path, method, auth, purpose, fields).
* **`data-model.md`**: List of tables, columns, relationships, and RLS policies.
* **`ar-integration.md`**: Explanation of AR asset storage, retrieval, and coordinate conventions.

---

## 1. Supabase Folder

### 1.1. `supabase/config/supabase.env.example`
* Variable names + comments (Project URL, Anon key, Service role key).
* Note that real values must never be committed.

### 1.2. `supabase/migrations/`
* **`0001_init_auth_default.sql`**: Initial schema (auto-generated).
* **`0002_create_profiles.sql`**: `public.profiles` table (PK/FK to `auth.users`).
* **`0003_create_categories.sql`**: `categories` table (indexes, unique slug).
* **`0004_create_products.sql`**: `products` table (eyewear fields, FK to categories, indexes).
* **`0005_create_ar_assets.sql`**: `ar_assets` table (linked to products, storage paths, scale, offsets).
* **`0006_create_reviews.sql`**: `reviews` table (FKs, indexes).
* **`0007_create_carts.sql`**: `carts` and `cart_items` tables.
* **`0008_create_orders.sql`**: `orders` and `order_items` tables.
* **`0009_create_feedback.sql`**: `feedback` table.
* **`00xx_seed_*.sql`**: Sample data insertion.

### 1.3. `supabase/policies/`
* **`profiles_policies.sql`**: RLS for profiles (User read/update own, Admin read all).
* **`products_policies.sql`**: RLS for products (Public/Auth read, Admin write).
* **`carts_policies.sql`**, **`orders_policies.sql`**, **`reviews_policies.sql`**, **`feedback_policies.sql`**, **`storage_policies.sql`**: Role-based read/write rules.

### 1.4. `supabase/storage/`
* **`buckets.md`**:
  * `product-images`: Public/Auth read, `products/{product_id}/...`.
  * `ar-models`: Private/Auth read, `models/{product_id}/...`.
  * `user-avatars`: Owner read/write, `avatars/{user_id}/...`.

### 1.5. `supabase/README.md`
* Instructions for CLI, linking repo, running migrations, and managing storage.

---

## 2. Backend (apps/backend)

### 2.1. `app/core/config.py`
* Configuration class reading from env vars (Env name, API base, Supabase URL/Keys, CORS, Payment/Email settings).

### 2.2. `app/core/security.py`
* Token constants (Issuer, Audience, Header).
* General security policies and flags.

### 2.3. `app/core/logging.py`
* Logging format and level configuration (Env-dependent).

### 2.4. `app/core/supabase_client.py`
* Supabase client construction and helper functions.

### 2.5. `app/security/supabase_jwt.py`
* JWT validation logic (Validate, Decode, Extract User ID/Email/Claims).
* Handling of expired/invalid tokens.

### 2.6. `app/security/permissions.py`
* Helper functions: `ensure_authenticated`, `ensure_admin`.
* Role definitions.

### 2.7. `app/security/supabase_admin.py`
* Admin operations using Service Role Key (List users, Disable account).
* **Strictly backend-only**.

### 2.8. `app/api/dependencies/auth.py`
* Main auth dependency: Extract token -> Validate -> Fetch Profile -> Return User Context.

### 2.9. `app/api/dependencies/pagination.py`
* Pagination parameters (Page number, Page size).

### 2.10. `app/api/dependencies/filters.py`
* Filter definitions (Category, Gender, Price, Search, Sort).

### 2.11. `app/api/v1/routers/`
* **`user_router.py`**: Get current user, Update profile, Update PD.
* **`product_router.py`**: List products (filtered/paginated), Get product details.
* **`review_router.py`**: Get reviews, Post review.
* **`cart_router.py`**: Get cart, Add item, Update quantity, Remove item.
* **`order_router.py`**: List orders, Order details, Create order.
* **`feedback_router.py`**: Submit feedback.
* **`ar_router.py`**: Get AR asset (paths/signed URLs), Post telemetry.
* **`admin_router.py`**: Admin-only operations (Products, Orders, Users).

### 2.12. `app/models/*.py`
* Pydantic schemas for data shapes (User, Product, Cart, Order, Feedback, AR).

### 2.13. `app/services/*.py`
* Business logic and DB interactions.
* **`user_service.py`**: Profile management.
* **`product_service.py`**: Product fetching and filtering.
* **`cart_service.py`**: Cart management.
* **`order_service.py`**: Order creation and processing.
* **`ar_service.py`**: AR asset retrieval and telemetry.
* **`storage_service.py`**: Signed URL generation.

### 2.14. `app/db/`
* `migrations/` (Reference), `seeds/` (Test data), `schema_diagrams/` (ERD).

### 2.15. `app/middleware/*.py`
* **`auth_middleware.py`**: Central auth check/logging.
* **`error_handler.py`**: Exception mapping.
* **`cors_middleware.py`**: CORS config.
* **`rate_limit_middleware.py`**: Rate limiting.

### 2.16. `app/integrations/`
* **`payment/`**: `payment_client.py` (Provider wrapper), `payment_webhooks.py` (Webhook handling).
* **`notifications/`**: `email_client.py`, `push_client.py`.

### 2.17. `app/docs/`
* `openapi_override.yml`, `api_guide.md`, `postman_collection.json`.

### 2.18. `app/tests/`
* `unit/`, `integration/`, `e2e/`.

### 2.19. `app/main.py`
* App assembly: FastAPI instance, Middleware, Routers, OpenAPI.

---

## 3. Frontend (apps/frontend)

### 3.1. `assets/`
* `images/` (Logo, Illustrations), `icons/`, `models/` (Config files).

### 3.2. `lib/core/config/`
* **`app_config.dart`**: Config values (API URL, Supabase URL).
* **`env.dart`**: Environment selection (Dev/Staging/Prod).

### 3.3. `lib/core/constants/`
* **`colors.dart`**: Color palette.
* **`typography.dart`**: Text styles.
* **`dimensions.dart`**: Spacing, radius, sizes.
* **`api_endpoints.dart`**: API path constants.

### 3.4. `lib/core/routing/`
* **`route_names.dart`**: Route string constants.
* **`app_router.dart`**: GoRouter config, Guards, Route mapping.

### 3.5. `lib/core/network/`
* **`api_client.dart`**: Dio client setup, URL building, Error handling.
* **`auth_interceptor.dart`**: Token injection, Auth error handling.

### 3.6. `lib/core/supabase/`
* **`supabase_client.dart`**: Client initialization.
* **`supabase_session_manager.dart`**: Auth state management, Session holding.

### 3.7. `lib/core/security/token_storage.dart`
* Local persistence of tokens (Secure Storage).

### 3.8. `lib/core/error/`
* **`failure.dart`**: Unified error model.
* **`error_mapper.dart`**: Error conversion logic.

### 3.9. `lib/core/theme/app_theme.dart`
* ThemeData configuration.

### 3.10. `lib/shared/widgets/*.dart`
* Reusable components: `app_button.dart`, `app_text_field.dart`, `app_appbar.dart`, `product_card.dart`, `rating_stars.dart`, `price_tag.dart`, `loading_indicator.dart`, `empty_state.dart`, `error_view.dart`.

### 3.11. `lib/shared/dialogs/*.dart`
* `confirmation_dialog.dart`, `info_bottom_sheet.dart`.

### 3.12. `lib/shared/mixins/responsive_mixin.dart`
* Layout adaptation helpers.

### 3.13. `lib/ar_integration/channels/*.dart`
* **`arkit_channel.dart`**, **`arcore_channel.dart`**, **`unity_channel.dart`**: Platform channel contracts.

### 3.14. `lib/ar_integration/models/*.dart`
* **`ar_session_state.dart`**: Session status tracking.
* **`ar_fit_params.dart`**: Scale/Position parameters.

### 3.15. `lib/ar_integration/widgets/ar_view_container.dart`
* AR view widget, permission handling, overlay controls.

### 3.16. `lib/features/*` (Pattern)
* **`presentation/`**: Screens and UI flow.
* **`data/`**: Repositories and Data Sources.
* **`domain/`**: Business entities.
* **Examples**:
  * `onboarding`: Intro screens.
  * `auth`: Sign in/up logic.
  * `home`: Dashboard layout.
  * `catalog`: Product listing/details.
  * `ar_tryon`: AR experience.
  * `cart`: Cart management.

### 3.17. `lib/state/`
* App-wide state descriptions (Auth, Catalog, Cart, AR Session).

### 3.18. `lib/main.dart` & `lib/app.dart`
* Entry point, Initialization, Root widget.

---

## 4. Infra

### 4.1. `infra/docker/Dockerfile`
* Backend image build steps (Python base, Copy source, Install deps, Run command).

### 4.2. `infra/docker/docker-compose.dev.yml`
* Services: Backend, Nginx Proxy.
* Volumes and Networks.

### 4.3. `infra/docker/nginx.conf`
* Reverse proxy rules (`/api` -> Backend).
* TLS config.
