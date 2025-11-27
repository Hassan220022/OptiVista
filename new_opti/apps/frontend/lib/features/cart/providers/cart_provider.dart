import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';
import '../../catalog/domain/product_model.dart';
import '../domain/cart_item_model.dart';

class CartNotifier extends StateNotifier<AsyncValue<List<CartItem>>> {
  final Dio _dio;

  CartNotifier(this._dio) : super(const AsyncValue.loading()) {
    fetchCart();
  }

  Future<void> fetchCart() async {
    state = const AsyncValue.loading();
    try {
      final response = await _dio.get('/cart/');
      final List<dynamic> itemsJson = response.data['items'];
      final items = itemsJson.map((json) => CartItem.fromJson(json)).toList();
      state = AsyncValue.data(items);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> addToCart(Product product, {int quantity = 1}) async {
    try {
      // Optimistic update (if we had the ID, but we don't for new items)
      // So we just show loading or keep previous state

      await _dio.post('/cart/items', data: {
        'product_id': product.id,
        'quantity': quantity,
      });

      // Refresh cart to get the new state with IDs
      await fetchCart();
    } catch (e) {
      // Handle error (maybe show snackbar via a side effect provider)
      print('Error adding to cart: $e');
    }
  }

  Future<void> removeFromCart(String itemId) async {
    try {
      // Optimistic update
      // Optimistic update
      if (state.hasValue) {
        state = AsyncValue.data(
          state.value!.where((item) => item.id != itemId).toList(),
        );
      }

      await _dio.delete('/cart/items/$itemId');

      // No need to fetch if successful, but maybe safer to sync
    } catch (e) {
      // Revert on error
      // state = previousState;
      // Need to store previousState properly if we want revert
      await fetchCart(); // Sync on error
    }
  }

  Future<void> updateQuantity(String itemId, int quantity) async {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      // Optimistic update
      if (state.hasValue) {
        state = AsyncValue.data([
          for (final item in state.value!)
            if (item.id == itemId) item.copyWith(quantity: quantity) else item
        ]);
      }

      await _dio.put('/cart/items/$itemId', data: {
        'quantity': quantity,
      });

      // Ideally the backend returns the updated cart, so we could use that
      // await fetchCart();
    } catch (e) {
      await fetchCart();
    }
  }

  Future<void> clearCart() async {
    // Implement clear cart endpoint if available, or delete all items
    // For now, just local clear + maybe fetch
    state = const AsyncValue.data([]);
  }
}

final cartProvider =
    StateNotifierProvider<CartNotifier, AsyncValue<List<CartItem>>>((ref) {
  final dio = ref.watch(apiClientProvider);
  return CartNotifier(dio);
});

final cartTotalProvider = Provider<double>((ref) {
  final cartAsync = ref.watch(cartProvider);
  return cartAsync.when(
    data: (cart) => cart.fold(0, (total, item) => total + item.totalPrice),
    loading: () => 0,
    error: (_, __) => 0,
  );
});
