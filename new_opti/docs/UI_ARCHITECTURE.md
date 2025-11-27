# UI Architecture & Backend Map

This document serves as the blueprint for the Flutter application's UI, mapping each screen to its directory structure and backend integration points (Supabase tables and API endpoints).

## 1. Core / Shell

### 1.1 `SplashScreen`
* **Path**: `lib/features/core/presentation/splash_screen.dart`
* **Purpose**: Initialize Supabase, restore session, load config/flags. Route user to Onboarding, Auth, or Home.
* **Backend / APIs**: None directly (uses Supabase client + local storage).
* **Supabase**: `auth.sessions` (via SDK), `auth.users` (implicitly via session).

### 1.2 `RootShellScreen`
* **Path**: `lib/features/core/presentation/root_shell_screen.dart`
* **Purpose**: Main container with bottom navigation / tab navigation (Home, Catalog, Cart, Profile).
* **Backend / APIs**: None directly; child screens call APIs.
* **Supabase**: Reads “is authenticated” from session (via global auth state).

## 2. Onboarding & Permissions

### 2.1 `OnboardingScreen`
* **Path**: `lib/features/onboarding/presentation/onboarding_screen.dart`
* **Purpose**: Show intro slides. Mark onboarding as seen (local flag).
* **Backend / APIs**: None.
* **Supabase**: None.

### 2.2 `PrivacyConsentScreen`
* **Path**: `lib/features/onboarding/presentation/privacy_consent_screen.dart`
* **Purpose**: Explain camera/telemetry usage. Store privacy consent flag.
* **Backend / APIs**: Optional `PATCH /api/v1/users/me` (to save “consent_given” field).
* **Supabase**: `public.profiles` (if consent stored there).

### 2.3 `CameraPermissionScreen`
* **Path**: `lib/features/onboarding/presentation/camera_permission_screen.dart`
* **Purpose**: Explain why camera permission needed. Trigger OS camera permission request.
* **Backend / APIs**: None.
* **Supabase**: None.

## 3. Auth & Account Access

### 3.1 `AuthGateScreen`
* **Path**: `lib/features/auth/presentation/auth_gate_screen.dart`
* **Purpose**: Decide routing based on session existence.
* **Backend / APIs**: None directly; uses Supabase SDK for session.
* **Supabase**: `auth.sessions`, `auth.users`.

### 3.2 `SignInScreen`
* **Path**: `lib/features/auth/presentation/sign_in_screen.dart`
* **Purpose**: Email/password login.
* **Backend / APIs**: Supabase Auth SDK: `signInWithPassword`.
* **Supabase**: `auth.users`, `auth.sessions`.

### 3.3 `SignUpScreen`
* **Path**: `lib/features/auth/presentation/sign_up_screen.dart`
* **Purpose**: Create new account.
* **Backend / APIs**: Supabase Auth SDK: `signUp()`. Optional FastAPI call `PATCH /api/v1/users/me` to ensure profile.
* **Supabase**: `auth.users`, `public.profiles`.

### 3.4 `ForgotPasswordScreen`
* **Path**: `lib/features/auth/presentation/forgot_password_screen.dart`
* **Purpose**: Trigger password reset email.
* **Backend / APIs**: Supabase Auth SDK: `resetPasswordForEmail()`.
* **Supabase**: `auth.users`.

### 3.5 `ResetPasswordScreen`
* **Path**: `lib/features/auth/presentation/reset_password_screen.dart`
* **Purpose**: Handle deep link, let user set new password.
* **Backend / APIs**: Supabase Auth SDK: `updateUser()`.
* **Supabase**: `auth.users`.

### 3.6 `VerifyEmailScreen`
* **Path**: `lib/features/auth/presentation/verify_email_screen.dart`
* **Purpose**: Show “check your email” message. Poll for session update.
* **Backend / APIs**: Supabase Auth SDK.
* **Supabase**: `auth.users`.

## 4. Home & Notifications

### 4.1 `HomeScreen`
* **Path**: `lib/features/home/presentation/home_screen.dart`
* **Purpose**: Main entry screen (featured products, trending).
* **Backend / APIs**: `GET /api/v1/products` (with filters). Optional `GET /api/v1/home/feed`.
* **Supabase**: `public.products`, `public.categories`, `ar_assets`.

### 4.2 `NotificationsScreen` (optional)
* **Path**: `lib/features/home/presentation/notifications_screen.dart`
* **Purpose**: Show push-style app notifications history.
* **Backend / APIs**: Optional `GET /api/v1/notifications`.
* **Supabase**: `notifications` (if created).

## 5. Catalog & Product Discovery

### 5.1 `CatalogScreen`
* **Path**: `lib/features/catalog/presentation/catalog_screen.dart`
* **Purpose**: List and search products with filters/sorting.
* **Backend / APIs**: `GET /api/v1/products` (params: page, limit, q, category_id, gender, min_price, max_price, sort).
* **Supabase**: `public.products`, `public.categories`.

### 5.2 `ProductDetailsScreen`
* **Path**: `lib/features/catalog/presentation/product_details_screen.dart`
* **Purpose**: Detailed page for single product.
* **Backend / APIs**: `GET /api/v1/products/{product_id}`, `GET /api/v1/products/{product_id}/reviews`.
* **Supabase**: `public.products`, `public.categories`, `public.reviews`, `ar_assets`.

### 5.3 `ProductReviewsScreen`
* **Path**: `lib/features/catalog/presentation/product_reviews_screen.dart`
* **Purpose**: Full list of reviews for a product.
* **Backend / APIs**: `GET /api/v1/products/{product_id}/reviews`.
* **Supabase**: `public.reviews`, `public.profiles`.

### 5.4 `ProductFilterBottomSheet`
* **Path**: `lib/features/catalog/presentation/widgets/product_filter_bottom_sheet.dart`
* **Purpose**: Filtering UI.
* **Backend / APIs**: None directly; updates filter params.
* **Supabase**: Indirectly via Catalog.

### 5.5 `SearchResultsScreen`
* **Path**: `lib/features/catalog/presentation/search_results_screen.dart`
* **Purpose**: Show results for a query separate from main catalog.
* **Backend / APIs**: `GET /api/v1/products?q=...`.
* **Supabase**: `public.products`.

## 6. AR Try-On & Fitting

### 6.1 `ARTryOnScreen`
* **Path**: `lib/features/ar_tryon/presentation/ar_try_on_screen.dart`
* **Purpose**: Fullscreen AR view.
* **Backend / APIs**: `GET /api/v1/ar/assets/{product_id}`. Optional `POST /api/v1/ar/telemetry`.
* **Supabase**: `ar_assets`, `public.products`, `public.ar_telemetry`.

### 6.2 `ARFitAdjustScreen`
* **Path**: `lib/features/ar_tryon/presentation/ar_fit_adjust_screen.dart`
* **Purpose**: UI for adjusting scale/offset of AR model.
* **Backend / APIs**: Optional `PATCH /api/v1/users/me` (ar_preferences).
* **Supabase**: `public.profiles`.

### 6.3 `ARTutorialOverlayScreen`
* **Path**: `lib/features/ar_tryon/presentation/widgets/ar_tutorial_overlay.dart`
* **Purpose**: Shows overlay instructions on first AR use.
* **Backend / APIs**: None.
* **Supabase**: None.

### 6.4 `ARErrorScreen`
* **Path**: `lib/features/ar_tryon/presentation/ar_error_screen.dart`
* **Purpose**: Display AR-specific error states.
* **Backend / APIs**: Optional `POST /api/v1/ar/telemetry`.
* **Supabase**: `public.ar_telemetry`.

## 7. Cart & Wishlist

### 7.1 `CartScreen`
* **Path**: `lib/features/cart/presentation/cart_screen.dart`
* **Purpose**: Show cart items + totals. Proceed to Checkout.
* **Backend / APIs**: `GET /api/v1/cart`, `POST /api/v1/cart/items`, `PATCH /api/v1/cart/items/{item_id}`, `DELETE /api/v1/cart/items/{item_id}`.
* **Supabase**: `public.carts`, `public.cart_items`, `public.products`.

### 7.2 `WishlistScreen` (optional)
* **Path**: `lib/features/cart/presentation/wishlist_screen.dart`
* **Purpose**: Show saved favorites.
* **Backend / APIs**: `GET /api/v1/wishlist`, `POST /api/v1/wishlist/{product_id}`, `DELETE /api/v1/wishlist/{product_id}`.
* **Supabase**: `public.wishlist`, `public.products`.

## 8. Checkout Flow

### 8.1 `ShippingAddressScreen`
* **Path**: `lib/features/checkout/presentation/shipping_address_screen.dart`
* **Purpose**: Enter/select shipping address.
* **Backend / APIs**: `GET /api/v1/users/me/addresses`, `POST /api/v1/users/me/addresses`, `PATCH /api/v1/users/me/addresses/{address_id}`.
* **Supabase**: `public.addresses`.

### 8.2 `DeliveryOptionsScreen` (optional)
* **Path**: `lib/features/checkout/presentation/delivery_options_screen.dart`
* **Purpose**: Select delivery type & see ETA/cost.
* **Backend / APIs**: `GET /api/v1/shipping/options`.
* **Supabase**: `public.shipping_options`.

### 8.3 `PaymentMethodScreen`
* **Path**: `lib/features/checkout/presentation/payment_method_screen.dart`
* **Purpose**: Choose payment method.
* **Backend / APIs**: `GET /api/v1/payment/methods`, `POST /api/v1/orders` (or payment intent).
* **Supabase**: `public.orders`.

### 8.4 `OrderReviewScreen`
* **Path**: `lib/features/checkout/presentation/order_review_screen.dart`
* **Purpose**: Show everything before placing order.
* **Backend / APIs**: `GET /api/v1/cart`, `POST /api/v1/orders`.
* **Supabase**: `public.carts`, `public.cart_items`, `public.orders`, `public.order_items`.

### 8.5 `OrderConfirmationScreen`
* **Path**: `lib/features/checkout/presentation/order_confirmation_screen.dart`
* **Purpose**: Show order success info.
* **Backend / APIs**: `GET /api/v1/orders/{order_id}`.
* **Supabase**: `public.orders`, `public.order_items`.

### 8.6 `PaymentStatusScreen`
* **Path**: `lib/features/checkout/presentation/payment_status_screen.dart`
* **Purpose**: Handle redirect after external payment.
* **Backend / APIs**: `GET /api/v1/orders/{order_id}`.
* **Supabase**: `public.orders`.

## 9. Profile & Account

### 9.1 `ProfileScreen`
* **Path**: `lib/features/profile/presentation/profile_screen.dart`
* **Purpose**: Overview of account.
* **Backend / APIs**: `GET /api/v1/users/me`.
* **Supabase**: `public.profiles`, `auth.users`.

### 9.2 `EditProfileScreen`
* **Path**: `lib/features/profile/presentation/edit_profile_screen.dart`
* **Purpose**: Change name, phone, gender, avatar.
* **Backend / APIs**: `PATCH /api/v1/users/me`. Avatar upload to Supabase Storage.
* **Supabase**: `public.profiles`, `storage.objects`.

### 9.3 `PDInputScreen`
* **Path**: `lib/features/profile/presentation/pd_input_screen.dart`
* **Purpose**: Enter PD (pupillary distance).
* **Backend / APIs**: `PATCH /api/v1/users/me/pd`.
* **Supabase**: `public.profiles`.

### 9.4 `AddressBookScreen`
* **Path**: `lib/features/profile/presentation/address_book_screen.dart`
* **Purpose**: List saved addresses.
* **Backend / APIs**: `GET /api/v1/users/me/addresses`, `DELETE`.
* **Supabase**: `public.addresses`.

### 9.5 `EditAddressScreen`
* **Path**: `lib/features/profile/presentation/edit_address_screen.dart`
* **Purpose**: Create/edit one address.
* **Backend / APIs**: `POST`, `PATCH`.
* **Supabase**: `public.addresses`.

### 9.6 `SecuritySettingsScreen`
* **Path**: `lib/features/profile/presentation/security_settings_screen.dart`
* **Purpose**: Password change.
* **Backend / APIs**: Supabase Auth SDK.
* **Supabase**: `auth.users`.

## 10. Order History & Tracking

### 10.1 `OrderHistoryScreen`
* **Path**: `lib/features/orders/presentation/order_history_screen.dart`
* **Purpose**: List of past orders.
* **Backend / APIs**: `GET /api/v1/orders`.
* **Supabase**: `public.orders`.

### 10.2 `OrderDetailsScreen`
* **Path**: `lib/features/orders/presentation/order_details_screen.dart`
* **Purpose**: Detailed view for single order.
* **Backend / APIs**: `GET /api/v1/orders/{order_id}`.
* **Supabase**: `public.orders`, `public.order_items`, `public.products`.

## 11. Feedback & Support

### 11.1 `FeedbackScreen`
* **Path**: `lib/features/feedback/presentation/feedback_screen.dart`
* **Purpose**: General feedback form.
* **Backend / APIs**: `POST /api/v1/feedback`.
* **Supabase**: `public.feedback`.

### 11.2 `SupportCenterScreen` (optional)
* **Path**: `lib/features/feedback/presentation/support_center_screen.dart`
* **Purpose**: FAQ, contact options.
* **Backend / APIs**: None.
* **Supabase**: None.

### 11.3 `ReportIssueScreen` (optional)
* **Path**: `lib/features/feedback/presentation/report_issue_screen.dart`
* **Purpose**: Bug report screen.
* **Backend / APIs**: `POST /api/v1/feedback` or `/issues`.
* **Supabase**: `public.feedback`.

## 12. Settings & Legal

### 12.1 `SettingsScreen`
* **Path**: `lib/features/settings/presentation/settings_screen.dart`
* **Purpose**: Central hub for preferences.
* **Backend / APIs**: Optional `PATCH /api/v1/users/me`.
* **Supabase**: `public.profiles`.

### 12.2 `LanguageSelectionScreen`
* **Path**: `lib/features/settings/presentation/language_selection_screen.dart`
* **Purpose**: Choose app language.
* **Backend / APIs**: Optional `PATCH /api/v1/users/me`.
* **Supabase**: `public.profiles`.

### 12.3 `LegalScreen`
* **Path**: `lib/features/settings/presentation/legal_screen.dart`
* **Purpose**: List of legal docs.
* **Backend / APIs**: None.
* **Supabase**: None.

### 12.4 `LegalDetailScreen`
* **Path**: `lib/features/settings/presentation/legal_detail_screen.dart`
* **Purpose**: Render full legal text.
* **Backend / APIs**: None.
* **Supabase**: `public.legal_docs` (optional).

### 12.5 `AboutAppScreen`
* **Path**: `lib/features/settings/presentation/about_app_screen.dart`
* **Purpose**: App description, version.
* **Backend / APIs**: None.
* **Supabase**: None.

## 13. Admin (Optional)

### 13.1 `AdminDashboardScreen`
* **Path**: `lib/features/admin/presentation/admin_dashboard_screen.dart`
* **Purpose**: Overview stats.
* **Backend / APIs**: `GET /api/v1/admin/dashboard`.
* **Supabase**: `public.orders`, `public.products`, `public.users`.

### 13.2 `AdminProductManagementScreen`
* **Path**: `lib/features/admin/presentation/admin_product_management_screen.dart`
* **Purpose**: List products.
* **Backend / APIs**: `GET /api/v1/admin/products`, `DELETE`.
* **Supabase**: `public.products`.

### 13.3 `AdminEditProductScreen`
* **Path**: `lib/features/admin/presentation/admin_edit_product_screen.dart`
* **Purpose**: Create or edit product.
* **Backend / APIs**: `POST`, `PATCH`.
* **Supabase**: `public.products`, `ar_assets`, `storage.objects`.

### 13.4 `AdminOrderManagementScreen`
* **Path**: `lib/features/admin/presentation/admin_order_management_screen.dart`
* **Purpose**: View/manage all orders.
* **Backend / APIs**: `GET /api/v1/admin/orders`, `PATCH`.
* **Supabase**: `public.orders`.

### 13.5 `AdminUserManagementScreen`
* **Path**: `lib/features/admin/presentation/admin_user_management_screen.dart`
* **Purpose**: View users.
* **Backend / APIs**: `GET /api/v1/admin/users`.
* **Supabase**: `auth.users`, `public.profiles`.

## 14. Utility / Error Screens

### 14.1 `FullScreenLoaderScreen`
* **Path**: `lib/features/core/presentation/full_screen_loader_screen.dart`
* **Purpose**: Blocking loader.
* **Backend / APIs**: None.
* **Supabase**: None.

### 14.2 `NetworkErrorScreen`
* **Path**: `lib/features/core/presentation/network_error_screen.dart`
* **Purpose**: Show when no connectivity.
* **Backend / APIs**: None.
* **Supabase**: None.

### 14.3 `NotFoundScreen`
* **Path**: `lib/features/core/presentation/not_found_screen.dart`
* **Purpose**: Fallback UI.
* **Backend / APIs**: None.
* **Supabase**: None.
