import 'package:flutter/material.dart';
import '../models/cart_item.dart';
import '../models/product.dart';

class CartProvider with ChangeNotifier {
  final Map<int, CartItem> _items = {}; // Key: productId

  Map<int, CartItem> get items => _items;

  double get totalPrice {
    double total = 0.0;
    _items.forEach((key, cartItem) {
      total += cartItem.product.price * cartItem.quantity;
    });
    return total;
  }

  // Add a product to the cart
  void addToCart(Product product) {
    if (_items.containsKey(product.id)) {
      _items[product.id]!.quantity += 1;
    } else {
      _items[product.id] = CartItem(product: product, quantity: 1);
    }
    notifyListeners();
  }

  // Remove a product from the cart
  void removeFromCart(int productId) {
    if (_items.containsKey(productId)) {
      _items.remove(productId);
      notifyListeners();
    }
  }

  // Update the quantity of a product in the cart
  void updateQuantity(int productId, int quantity) {
    if (_items.containsKey(productId)) {
      if (quantity > 0) {
        _items[productId]!.quantity = quantity;
      } else {
        _items.remove(productId);
      }
      notifyListeners();
    }
  }

  // Clear the entire cart
  void clearCart() {
    _items.clear();
    notifyListeners();
  }
}
