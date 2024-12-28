import '../models/cart_item.dart';
import '../models/product.dart';
import 'api_service.dart';

class CartService {
  final ApiService _apiService = ApiService();

  // Add a product to the cart
  Future<void> addToCart(int productId, int quantity) async {
    final data = {
      'productId': productId,
      'quantity': quantity,
    };

    final response = await _apiService.post('/cart/add', data);

    if (!response['success']) {
      throw Exception(response['message'] ?? 'Failed to add to cart');
    }
  }

  // Remove a product from the cart
  Future<void> removeFromCart(int productId) async {
    final response = await _apiService.delete('/cart/remove/$productId');

    if (!response['success']) {
      throw Exception(response['message'] ?? 'Failed to remove from cart');
    }
  }

  // Update the quantity of a product in the cart
  Future<void> updateCartItem(int productId, int quantity) async {
    final data = {
      'quantity': quantity,
    };

    final response = await _apiService.put('/cart/update/$productId', data);

    if (!response['success']) {
      throw Exception(response['message'] ?? 'Failed to update cart item');
    }
  }

  // Fetch the current cart items
  Future<List<CartItem>> fetchCartItems() async {
    final response = await _apiService.get('/cart/');

    if (response['success']) {
      List<dynamic> data = response['data'];
      List<CartItem> cartItems =
          data.map((item) => CartItem.fromJson(item)).toList();
      return cartItems;
    } else {
      throw Exception(response['message'] ?? 'Failed to fetch cart items');
    }
  }

  // Clear the entire cart
  Future<void> clearCart() async {
    final response = await _apiService.delete('/cart/clear');

    if (!response['success']) {
      throw Exception(response['message'] ?? 'Failed to clear cart');
    }
  }
}
