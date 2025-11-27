import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../catalog/domain/product_model.dart';
import '../../../catalog/providers/product_provider.dart';
import '../../../cart/providers/cart_provider.dart';
import '../../../../core/supabase/supabase_client.dart';

/// Home screen state
class HomeState {
  final bool isLoading;
  final bool isRefreshing;
  final List<Product> featuredProducts;
  final List<Product> recommendedProducts;
  final String? userName;
  final int cartItemCount;
  final String? errorMessage;

  const HomeState({
    this.isLoading = true,
    this.isRefreshing = false,
    this.featuredProducts = const [],
    this.recommendedProducts = const [],
    this.userName,
    this.cartItemCount = 0,
    this.errorMessage,
  });

  HomeState copyWith({
    bool? isLoading,
    bool? isRefreshing,
    List<Product>? featuredProducts,
    List<Product>? recommendedProducts,
    String? userName,
    int? cartItemCount,
    String? errorMessage,
  }) {
    return HomeState(
      isLoading: isLoading ?? this.isLoading,
      isRefreshing: isRefreshing ?? this.isRefreshing,
      featuredProducts: featuredProducts ?? this.featuredProducts,
      recommendedProducts: recommendedProducts ?? this.recommendedProducts,
      userName: userName ?? this.userName,
      cartItemCount: cartItemCount ?? this.cartItemCount,
      errorMessage: errorMessage,
    );
  }
}

/// Home controller
class HomeController extends StateNotifier<HomeState> {
  final Ref _ref;

  HomeController(this._ref) : super(const HomeState()) {
    loadHomeData();
  }

  /// Load all home screen data
  Future<void> loadHomeData() async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      // Get user name from Supabase auth
      final user = supabase.auth.currentUser;
      final userName = user?.userMetadata?['full_name'] as String? ??
          user?.email?.split('@').first;

      // Get cart item count
      final cartAsync = _ref.read(cartProvider);
      final cartCount = cartAsync.when(
        data: (items) => items.length,
        loading: () => 0,
        error: (_, __) => 0,
      );

      // Fetch products
      final productsAsync = await _ref.read(productsProvider.future);
      
      // Split into featured (first 6) and recommended (rest)
      final featured = productsAsync.take(6).toList();
      final recommended = productsAsync.skip(6).take(6).toList();

      state = state.copyWith(
        isLoading: false,
        userName: userName,
        cartItemCount: cartCount,
        featuredProducts: featured,
        recommendedProducts: recommended,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Failed to load home data. Please try again.',
      );
    }
  }

  /// Pull-to-refresh handler
  Future<void> refresh() async {
    state = state.copyWith(isRefreshing: true);
    
    // Invalidate the products provider to refetch
    _ref.invalidate(productsProvider);
    
    await loadHomeData();
    
    state = state.copyWith(isRefreshing: false);
  }

  /// Update cart count
  void updateCartCount(int count) {
    state = state.copyWith(cartItemCount: count);
  }
}

/// Home controller provider
final homeControllerProvider =
    StateNotifierProvider<HomeController, HomeState>((ref) {
  return HomeController(ref);
});

/// Cart item count provider for home screen badge
final homeCartCountProvider = Provider<int>((ref) {
  final cartAsync = ref.watch(cartProvider);
  return cartAsync.when(
    data: (items) => items.length,
    loading: () => 0,
    error: (_, __) => 0,
  );
});
