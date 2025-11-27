import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'route_names.dart';
import '../supabase/supabase_session_manager.dart';
import '../../features/auth/presentation/sign_in_screen.dart';
import '../../features/auth/presentation/sign_up_screen.dart';
import '../../features/auth/presentation/forgot_password_screen.dart';
import '../../features/profile/presentation/profile_screen.dart';
import '../../features/core/presentation/splash_screen.dart';
import '../../features/core/presentation/root_shell_screen.dart';
import '../../features/onboarding/presentation/onboarding_screen.dart';

import '../../features/catalog/presentation/screens/catalog_screen.dart';
import '../../features/catalog/presentation/product_details_screen.dart';
import '../../features/cart/presentation/cart_screen.dart';

import '../../features/ar/presentation/ar_try_on_screen.dart';
import '../../features/checkout/presentation/shipping_address_screen.dart';
import '../../features/checkout/presentation/payment_method_screen.dart';
import '../../features/checkout/presentation/order_review_screen.dart';
import '../../features/checkout/presentation/order_confirmation_screen.dart';
import '../../features/orders/presentation/order_history_screen.dart';
import '../../features/orders/presentation/order_details_screen.dart';
import '../../features/home/presentation/screens/home_screen.dart';

import '../../features/settings/presentation/settings_screen.dart';
import '../../features/support/presentation/feedback_screen.dart';
import '../../features/profile/presentation/edit_profile_screen.dart';
import '../../features/profile/presentation/addresses_screen.dart';

// Placeholder Screens
class PlaceholderScreen extends StatelessWidget {
  final String title;
  const PlaceholderScreen(this.title, {super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(child: Text(title)),
    );
  }
}

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorHomeKey =
    GlobalKey<NavigatorState>(debugLabel: 'shellHome');
final _shellNavigatorCatalogKey =
    GlobalKey<NavigatorState>(debugLabel: 'shellCatalog');
final _shellNavigatorCartKey =
    GlobalKey<NavigatorState>(debugLabel: 'shellCart');
final _shellNavigatorProfileKey =
    GlobalKey<NavigatorState>(debugLabel: 'shellProfile');

final routerProvider = Provider<GoRouter>((ref) {
  final session = ref.watch(sessionProvider);

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: RouteNames.splash,
    redirect: (context, state) {
      final isLoggedIn = session.value != null;
      final isAuthRoute = state.uri.path == RouteNames.signIn ||
          state.uri.path == RouteNames.signUp ||
          state.uri.path == RouteNames.onboarding;
      final isSplash = state.uri.path == RouteNames.splash;

      // If on splash, let the splash screen handle navigation logic
      if (isSplash) return null;

      if (!isLoggedIn && !isAuthRoute) {
        return RouteNames.signIn;
      }

      if (isLoggedIn && isAuthRoute) {
        return RouteNames.home;
      }

      return null;
    },
    routes: [
      GoRoute(
        path: RouteNames.splash,
        name: RouteNames.splash,
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: RouteNames.signIn,
        name: RouteNames.signIn,
        builder: (context, state) => const SignInScreen(),
      ),
      GoRoute(
        path: RouteNames.signUp,
        name: RouteNames.signUp,
        builder: (context, state) => const SignUpScreen(),
      ),
      GoRoute(
        path: '/forgot-password',
        name: 'forgotPassword',
        builder: (context, state) => const ForgotPasswordScreen(),
      ),
      GoRoute(
        path: RouteNames.onboarding,
        name: RouteNames.onboarding,
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: RouteNames.productDetails,
        name: RouteNames.productDetailsName,
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return ProductDetailsScreen(productId: id);
        },
      ),
      GoRoute(
        path: RouteNames.arTryOn,
        name: RouteNames.arTryOnName,
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return ARTryOnScreen(productId: id);
        },
      ),
      GoRoute(
        path: '/checkout/shipping',
        name: RouteNames.shipping,
        builder: (context, state) => const ShippingAddressScreen(),
      ),
      GoRoute(
        path: '/checkout/payment',
        name: RouteNames.payment,
        builder: (context, state) => const PaymentMethodScreen(),
      ),
      GoRoute(
        path: '/checkout/review',
        name: RouteNames.review,
        builder: (context, state) => const OrderReviewScreen(),
      ),
      GoRoute(
        path: '/checkout/confirmation/:id',
        name: RouteNames.confirmation,
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return OrderConfirmationScreen(orderId: id);
        },
      ),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return RootShellScreen(navigationShell: navigationShell);
        },
        branches: [
          StatefulShellBranch(
            navigatorKey: _shellNavigatorHomeKey,
            routes: [
              GoRoute(
                path: RouteNames.home,
                name: RouteNames.home,
                builder: (context, state) => const HomeScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            navigatorKey: _shellNavigatorCatalogKey,
            routes: [
              GoRoute(
                path: RouteNames.catalog,
                name: RouteNames.catalog,
                builder: (context, state) => const CatalogScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            navigatorKey: _shellNavigatorCartKey,
            routes: [
              GoRoute(
                path: RouteNames.cart,
                name: RouteNames.cart,
                builder: (context, state) => const CartScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            navigatorKey: _shellNavigatorProfileKey,
            routes: [
              GoRoute(
                path: RouteNames.profile,
                name: RouteNames.profile,
                builder: (context, state) => const ProfileScreen(),
                routes: [
                  GoRoute(
                    path: 'edit',
                    name: 'edit_profile',
                    builder: (context, state) => const EditProfileScreen(),
                  ),
                  GoRoute(
                    path: 'addresses',
                    name: 'addresses',
                    builder: (context, state) => const AddressesScreen(),
                  ),
                  GoRoute(
                    path: 'orders',
                    name: 'orders',
                    builder: (context, state) => const OrderHistoryScreen(),
                    routes: [
                      GoRoute(
                        path: ':id',
                        name: 'order_details',
                        builder: (context, state) {
                          final id = state.pathParameters['id']!;
                          return OrderDetailsScreen(orderId: id);
                        },
                      ),
                    ],
                  ),
                  GoRoute(
                    path: 'settings',
                    name: 'settings',
                    builder: (context, state) => const SettingsScreen(),
                    routes: [
                      GoRoute(
                        path: 'feedback',
                        name: 'feedback',
                        builder: (context, state) => const FeedbackScreen(),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  );
});
